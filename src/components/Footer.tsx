import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-24 rounded-t-[4rem] px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Branding */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-3xl font-black text-blue-600 mb-6 inline-block">
            Cooler Store
          </Link>
          <p className="text-gray-400 font-medium leading-relaxed max-w-xs pr-4 mb-8">
            The nation's most trusted electronic store for premium cooling technology and household essentials.
          </p>
          <div className="flex gap-4">
             {['🌐', '🐦', '📸', '📽️'].map((icon, i) => (
                <span key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-lg hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer">
                    {icon}
                </span>
             ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-bold mb-8">Shop Collections</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li><Link to="/store" className="hover:text-blue-600 transition-all">Air Coolers</Link></li>
            <li><Link to="/store" className="hover:text-blue-600 transition-all">Refrigerators</Link></li>
            <li><Link to="/store" className="hover:text-blue-600 transition-all">Smart Fans</Link></li>
            <li><Link to="/store" className="hover:text-blue-600 transition-all">Air Conditioners</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xl font-bold mb-8">Quick Navigation</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li><Link to="/" className="hover:text-blue-600 transition-all">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-600 transition-all">About Our Story</Link></li>
            <li><Link to="/faqs" className="hover:text-blue-600 transition-all">Common FAQs</Link></li>
            <li><Link to="/admin/login" className="hover:text-blue-600 transition-all">Staff Login</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-xl font-bold mb-8">Office & Support</h4>
          <ul className="space-y-4 text-gray-400 font-medium leading-relaxed pr-6">
            <li className="flex gap-3">
                <span className="text-lg">📍</span>
                <span>Main Market Road, <br/>Electronics Hub Zone-4</span>
            </li>
            <li className="flex gap-3">
                <span className="text-lg">📞</span>
                <span>+92 300 1234567</span>
            </li>
            <li className="flex gap-3">
                <span className="text-lg">📬</span>
                <span>support@coolerstore.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 font-bold text-xs uppercase tracking-widest gap-6">
        <p>&copy; 2026 Cooler Electronics Store. All rights reserved.</p>
        <div className="flex gap-8">
            <span className="hover:text-white transition-all cursor-pointer">Terms Of Service</span>
            <span className="hover:text-white transition-all cursor-pointer">Privacy Policy</span>
        </div>
      </div>

      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[80px] -z-0" />
    </footer>
  );
};

export default Footer;
