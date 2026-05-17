import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts({ featured: true })
      .then((res) => setFeatured(res.data?.products || res.data || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white min-h-[85vh] flex items-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full tracking-widest mb-6 uppercase">
              New Collection 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter mb-6">
              MOVE<br />
              <span className="text-yellow-400">FURTHER.</span><br />
              GO<br />
              HARDER.
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
              Premium sportswear engineered for those who push limits. Crafted for performance, designed to last.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center gap-2 bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition-colors text-sm tracking-wide">
                SHOP NOW
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm tracking-wide">
                EXPLORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black tracking-tight mb-10 text-center">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Shoes',    query: 'shoes',     emoji: '👟' },
              { label: 'Apparel',  query: 'apparel',   emoji: '👕' },
              { label: 'Shorts',   query: 'shorts',    emoji: '🩳' },
              { label: 'Accessories', query: 'accessories', emoji: '🎽' },
            ].map((cat) => (
              <Link
                key={cat.query}
                to={`/products?category=${cat.query}`}
                className="group bg-gray-50 hover:bg-black text-black hover:text-white rounded-2xl p-8 text-center transition-all duration-300"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <div className="font-bold text-sm tracking-widest uppercase">{cat.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black tracking-tight">FEATURED</h2>
              <Link to="/products" className="text-sm font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="bg-yellow-400 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-4">
            FREE SHIPPING<br />ON ORDERS OVER ₹999
          </h2>
          <p className="text-black/60 text-lg mb-8">Limited time offer. Shop now.</p>
          <Link to="/products" className="inline-block bg-black text-white font-bold px-10 py-4 rounded-xl hover:bg-gray-900 transition-colors text-sm tracking-wide">
            SHOP NOW
          </Link>
        </div>
      </section>
    </div>
  );
}
