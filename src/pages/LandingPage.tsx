import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white -z-10" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-sky-100/30 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-in slide-in-from-left duration-700">
            <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
              Official Store
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
              Beat The Heat <br /> 
              <span className="text-blue-600">With Precision.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed">
              Experience next-generation cooling technology with our premium range of air coolers, refrigerators, and climate solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/store"
                className="px-10 py-5 bg-blue-600 text-white rounded-2xl text-lg font-black hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-blue-200"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl text-lg font-bold hover:bg-gray-50 active:scale-95 transition-all"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '🚚', title: 'Fast Delivery', desc: 'Secure delivery in 2-3 days' },
            { icon: '⚡', title: 'Power Save', desc: 'Up to 30% energy efficiency' },
            { icon: '🛡️', title: '1-Year Warranty', desc: 'Official brand protection' },
            { icon: '💎', title: 'Premium Build', desc: 'Crafted with top-tier materials' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 p-6 bg-white rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all">
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h4 className="font-black text-gray-900 text-lg leading-tight">{item.title}</h4>
                <p className="text-sm text-gray-400 font-medium mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collections Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 inline-block">Curated Just For You</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Our Top Collections</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">Explore our meticulously crafted electronics designed for the modern lifestyle.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Air Coolers', img: 'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=1000&auto=format&fit=crop', items: '24+ Items', color: 'bg-blue-600' },
            { title: 'Refrigerators', img: 'https://images.unsplash.com/photo-1571175452282-15d44d7f691f?q=80&w=1000&auto=format&fit=crop', items: '12+ Items', color: 'bg-indigo-600' },
            { title: 'Smart Fans', img: 'https://images.unsplash.com/photo-1544450181-29597f6077e9?q=80&w=1000&auto=format&fit=crop', items: '18+ Items', color: 'bg-sky-600' }
          ].map((cat, i) => (
            <div key={i} className="group relative rounded-[2.5rem] overflow-hidden aspect-[4/5] cursor-pointer shadow-xl">
               <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
               <div className="absolute bottom-10 left-10 text-white">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 inline-block">{cat.items}</span>
                  <h3 className="text-3xl font-black mb-6">{cat.title}</h3>
                  <Link 
                    to="/store" 
                    className="inline-flex items-center gap-2 text-sm font-bold bg-white text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    View Store <span className="text-lg">→</span>
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-blue-600 rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden text-center items-center shadow-2xl shadow-blue-200">
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Stay Updated On New Tech</h2>
              <p className="text-blue-100 text-lg font-medium mb-10 leading-relaxed">Join our inner circle and receive exclusive updates on newly launched cooling innovations and special offers.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white/10 p-2 rounded-3xl border border-white/20 backdrop-blur-sm">
                 <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-blue-200 focus:outline-none font-medium"
                 />
                 <button className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                    Subscribe
                 </button>
              </div>
           </div>
           
           {/* Abstract Shapes */}
           <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-blue-500 rounded-full blur-3xl opacity-50" />
           <div className="absolute bottom-[-50%] left-[-10%] w-[400px] h-[400px] bg-indigo-500 rounded-full blur-3xl opacity-50" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
