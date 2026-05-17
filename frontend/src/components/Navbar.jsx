import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount }    = useCart();
  const navigate         = useNavigate();

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          STRIDE<span className="text-yellow-400">X</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide">
            PRODUCTS
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors tracking-wide">
              ADMIN
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative group flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:block">
                {user.name?.split(' ')[0]}
              </Link>
              <button
                onClick={logout}
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
