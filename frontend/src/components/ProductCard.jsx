import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imgSrc = product.images?.[0] || `https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}`;
  const inStock = product.stock > 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-gray-50">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = `https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}`; }}
          />
        </div>
        {product.featured && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 hover:text-black">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
          <button
            onClick={() => inStock && addToCart(product)}
            disabled={!inStock}
            className="bg-black text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
