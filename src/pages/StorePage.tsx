import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  categoryId?: number;
  category?: Category;
}

const StorePage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { addToCart } = useCart();
  const limit = 8;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = `${API}/items?page=${page}&limit=${limit}`;
      if (selectedCategory) {
        url += `&categoryId=${selectedCategory}`;
      }
      const res = await axios.get(url);
      const responseBody = res.data;
      setItems(responseBody.data || []);
      setTotalPages(responseBody.lastPage || 1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (item: Item, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart({ itemId: String(item.id), name: item.name, price: item.price, image: item.image });
    setToast(`${item.name} added to cart!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg z-50 font-medium animate-bounce">
          ✅ {toast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <p className="text-gray-500 mt-1">Discover our premium collection</p>
      </div>

      {/* Category Filter */}
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => { setSelectedCategory(null); setPage(1); }}
          className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
            selectedCategory === null
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50'
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
            className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50'
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center py-24 min-h-[50vh]">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl font-medium">No products yet</p>
            <p className="text-sm mt-2">Check back soon!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden bg-gray-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {item.category?.name || 'Other'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors truncate">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-black text-blue-600">PKR {Number(item.price).toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            ← Prev
          </button>
          <span className="text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Next →
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300">
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors z-10 shadow-sm"
            >
              ✕
            </button>

            {/* Left: Image */}
            <div className="md:w-1/2 bg-gray-50 h-64 md:h-auto flex items-center justify-center">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=No+Image';
                }}
              />
            </div>

            {/* Right: Content */}
            <div className="md:w-1/2 p-8 flex flex-col max-h-[80vh]">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-gray-900 mb-2">{selectedItem.name}</h2>
                <span className="text-3xl font-bold text-blue-600">PKR {Number(selectedItem.price).toFixed(2)}</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-8">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Description</h4>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {selectedItem.description}
                </p>
              </div>

              <button
                onClick={() => { handleAdd(selectedItem); setSelectedItem(null); }}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-black hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
          {/* Backdrop Click */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedItem(null)} />
        </div>
      )}
    </div>
  );
};

export default StorePage;
