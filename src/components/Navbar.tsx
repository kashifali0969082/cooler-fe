import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
             <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg shadow-blue-200">C</span>
             Cooler Store
          </Link>

          <div className="hidden md:flex items-center gap-8">
             <Link to="/" className="text-sm font-black text-gray-900 hover:text-blue-600 transition-all uppercase tracking-widest">Home</Link>
             <Link to="/store" className="text-sm font-black text-gray-500 hover:text-blue-600 transition-all uppercase tracking-widest">Collection</Link>
             <Link to="/about" className="text-sm font-black text-gray-500 hover:text-blue-600 transition-all uppercase tracking-widest">About Us</Link>
             <Link to="/faqs" className="text-sm font-black text-gray-500 hover:text-blue-600 transition-all uppercase tracking-widest">Expert Help</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative group p-2">
              <span className="text-2xl group-hover:scale-110 transition-transform inline-block">🛒</span>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-200 border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/admin/items"
                  className="text-xs font-black bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase tracking-widest"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-xs text-red-500 hover:text-red-700 font-black uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-[10px] font-black text-gray-400 hover:text-blue-600 transition-all uppercase tracking-[0.2em]"
              >
                Staff Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
