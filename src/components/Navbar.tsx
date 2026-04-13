import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string, exact?: boolean) =>
    exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-2 h-16 sm:h-20 min-h-[4rem]">
          <Link
            to="/"
            className="text-lg sm:text-xl md:text-2xl font-black text-blue-600 tracking-tight flex items-center gap-1.5 sm:gap-2 min-w-0 shrink"
          >
             <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg shadow-lg shadow-blue-200">C</span>
             <span className="truncate">Cooler Store</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-black uppercase tracking-widest transition-all ${
                isActive('/', true) ? 'text-gray-900' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/store"
              className={`text-sm font-black uppercase tracking-widest transition-all ${
                isActive('/store') ? 'text-gray-900' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Collection
            </Link>
            <Link
              to="/about"
              className={`text-sm font-black uppercase tracking-widest transition-all ${
                isActive('/about') ? 'text-gray-900' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/faqs"
              className={`text-sm font-black uppercase tracking-widest transition-all ${
                isActive('/faqs') ? 'text-gray-900' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              Expert Help
            </Link>
            <Link
              to="/donation"
              className={`text-sm font-black uppercase tracking-widest transition-all ${
                isActive('/donation') ? 'text-blue-900' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Donate
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-6 shrink-0">
        
            <Link to="/cart" className="relative group p-1.5 sm:p-2 touch-manipulation" aria-label="Cart">
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform inline-block">🛒</span>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-blue-200 border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/donation"
              className={`md:hidden inline-flex items-center justify-center px-3 py-2 rounded-xl text-white text-[10px] sm:text-xs font-black uppercase tracking-wide shadow-md active:scale-95 transition-all whitespace-nowrap ${
                isActive('/donation')
                  ? 'bg-blue-800 shadow-blue-300 ring-2 ring-blue-900/30'
                  : 'bg-blue-600 shadow-blue-200 hover:bg-blue-700'
              }`}
            >
              Donate
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link
                  to="/admin/items"
                  className="text-[10px] sm:text-xs font-black bg-gray-900 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase tracking-wide sm:tracking-widest whitespace-nowrap"
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
                className="text-[9px] sm:text-[10px] font-black text-gray-400 hover:text-blue-600 transition-all uppercase tracking-wider sm:tracking-[0.2em] whitespace-nowrap leading-tight text-right"
              >
                {/* Staff Login */}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
