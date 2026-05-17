import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-black tracking-tighter mb-3">STRIDE<span className="text-yellow-400">X</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed">Premium sportswear crafted for performance and style. Move further. Go harder.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wider mb-4 text-gray-300">SHOP</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=shoes" className="hover:text-white transition-colors">Shoes</Link></li>
              <li><Link to="/products?category=apparel" className="hover:text-white transition-colors">Apparel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm tracking-wider mb-4 text-gray-300">ACCOUNT</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/profile" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-xs">
          © 2026 StrideX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
