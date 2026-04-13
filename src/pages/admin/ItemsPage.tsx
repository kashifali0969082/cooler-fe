import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { parseItemsListResponse } from '../../utils/parseItemsListResponse';
import { itemEffectiveUnitPrice, itemHasDiscount } from '../../utils/itemPrice';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  price: number;
  discountedPrice?: number | null;
  image: string;
  description: string;
  categoryId?: number;
  category?: Category;
}

const emptyForm = {
  name: '',
  price: '',
  discountedPrice: '',
  image: '',
  description: '',
  categoryId: '',
};

const ADMIN_ITEMS_PAGE_SIZE = 12;

const ItemsPage: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listPage, setListPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3000);
  };

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Optionally clear the manual image URL if a file is picked
      setForm({ ...form, image: '' });
    }
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}/items?page=${listPage}&limit=${ADMIN_ITEMS_PAGE_SIZE}`,
      );
      const { items: list, lastPage, total } = parseItemsListResponse(res);
      setItems((list || []) as Item[]);
      setTotalPages(lastPage);
      setTotalCount(total);
    } catch {
      setItems([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [listPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      const payload = res.data?.data;
      setCategories(Array.isArray(payload) ? payload : []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  useEffect(() => {
    if (!loading && totalPages >= 1 && listPage > totalPages) {
      setListPage(totalPages);
    }
  }, [loading, listPage, totalPages]);

  const openAdd = () => { 
    setEditItem(null); 
    setForm(emptyForm); 
    setSelectedFile(null);
    setPreviewUrl('');
    setShowModal(true); 
  };
  
  const openEdit = (item: Item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      price: String(item.price),
      discountedPrice:
        item.discountedPrice != null && item.discountedPrice !== undefined
          ? String(item.discountedPrice)
          : '',
      image: item.image,
      description: item.description,
      categoryId: String(item.categoryId || ''),
    });
    setSelectedFile(null);
    setPreviewUrl(item.image);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('discountedPrice', form.discountedPrice.trim());
      formData.append('description', form.description);
      if (form.categoryId) {
        formData.append('categoryId', form.categoryId);
      }
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (form.image) {
        formData.append('image', form.image);
      }

      if (editItem) {
        await axios.patch(`${API}/items/${editItem.id}`, formData, {
          headers: { ...authHeader.headers, 'Content-Type': 'multipart/form-data' }
        });
        showToast('Item updated successfully!');
      } else {
        await axios.post(`${API}/items`, formData, {
          headers: { ...authHeader.headers, 'Content-Type': 'multipart/form-data' }
        });
        showToast('Item created successfully!');
      }
      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to save item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${API}/items/${id}`, authHeader);
      showToast('Item deleted.');
      fetchItems();
    } catch {
      showToast('Failed to delete item.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">⚙️ Admin Panel</span>
        <div className="flex items-center gap-4">
          <Link to="/admin/items" className="font-medium text-blue-600 border-b-2 border-blue-600 pb-0.5">Items</Link>
          <Link to="/admin/categories" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Categories</Link>
          <Link to="/admin/settings" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Settings</Link>
          <Link to="/" className="text-gray-400 hover:text-blue-600 text-sm transition-colors">← Store</Link>
          <button onClick={() => { logout(); navigate('/'); }} className="text-red-500 hover:text-red-700 text-sm font-medium">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {toast && (
          <div className={`fixed top-5 right-5 px-5 py-3 rounded-xl shadow-lg z-50 text-white font-medium ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toastType === 'success' ? '✅' : '❌'} {toast}
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Items</h1>
            {!loading && totalCount > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {(listPage - 1) * ADMIN_ITEMS_PAGE_SIZE + 1}–
                {Math.min(listPage * ADMIN_ITEMS_PAGE_SIZE, totalCount)} of {totalCount} products
              </p>
            )}
          </div>
          <button
            onClick={openAdd}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            + Add Item
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading items…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-lg font-medium">No items yet. Add your first product!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Image</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Description</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=?'; }}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">
                      {itemHasDiscount(item) ? (
                        <span className="flex flex-col gap-0.5">
                          <span>PKR {itemEffectiveUnitPrice(item).toFixed(2)}</span>
                          <span className="text-xs text-gray-400 line-through font-medium">
                            PKR {Number(item.price).toFixed(2)}
                          </span>
                        </span>
                      ) : (
                        <span>PKR {Number(item.price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">{item.category?.name || <span className="italic text-gray-400">None</span>}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{item.description}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
                <span className="text-sm text-gray-600">
                  Page {listPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={listPage <= 1}
                    onClick={() => setListPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={listPage >= totalPages}
                    onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      }
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-center justify-center bg-black/50 p-4 py-8 sm:p-6">
            <div
              className="my-auto flex min-h-0 w-full max-w-lg max-h-[min(90vh,calc(100dvh-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="item-modal-title"
            >
              <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-6">
                  <h2 id="item-modal-title" className="text-xl font-bold text-gray-900 mb-5">
                    {editItem ? 'Edit Item' : 'Add New Item'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Product Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="19.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Discounted price (PKR){' '}
                    <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.discountedPrice}
                    onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Leave empty for no sale"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Must be less than regular price. Clear to remove sale.
                  </p>
                </div>
                  </div>
                  <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Category (Defaults to "Other")</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                  </div>
                  <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Image</label>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400">Preview</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    >
                      📁 {selectedFile ? 'Change File' : 'Choose File'}
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1.5 italic">
                      {selectedFile ? selectedFile.name : 'Image will be stored in S3'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-[10px]">URL</span>
                  </div>
                  {/* <input
                    value={form.image}
                    onChange={(e) => {
                      setForm({ ...form, image: e.target.value });
                      setPreviewUrl(e.target.value);
                      setSelectedFile(null);
                    }}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    placeholder="Or paste direct image link..."
                  /> */}
                </div>
                  </div>
                  <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Product description..."
                />
                  </div>
                </div>
                <div className="flex shrink-0 gap-3 border-t border-gray-100 bg-white p-6 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
