import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToCart } = useCart();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);
  const [size,     setSize]     = useState('');
  const [variant,  setVariant]  = useState('');
  const [qty,      setQty]      = useState(1);
  const [added,    setAdded]    = useState(false);

  useEffect(() => {
    setLoading(true);
    setImgIdx(0); setSize(''); setVariant(''); setQty(1);
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        return getProducts({ category: res.data.category });
      })
      .then((res) => {
        const all = res.data?.products || res.data || [];
        setRelated(all.filter((p) => p._id !== id).slice(0, 4));
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !size) { alert('Please select a size'); return; }
    addToCart(product, size, variant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-2xl" />
      <div className="space-y-4 pt-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );

  if (!product) return null;

  const images  = product.images?.length ? product.images : [`https://placehold.co/600x600/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}`];
  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3">
            <img src={images[imgIdx]} alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = `https://placehold.co/600x600/1a1a1a/ffffff?text=${encodeURIComponent(product.name)}`; }} />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-black' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-2">
          <span className="inline-block bg-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            {product.category}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-4">₹{product.price?.toLocaleString()}</p>
          <p className={`text-sm font-medium mb-6 ${inStock ? 'text-green-600' : 'text-red-500'}`}>
            {inStock ? `In stock (${product.stock} left)` : 'Out of stock'}
          </p>

          <p className="text-gray-500 text-sm leading-relaxed mb-8">{product.description}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      size === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                    }`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button key={v} onClick={() => setVariant(v)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      variant === v ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                    }`}>{v}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors font-medium text-lg">−</button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors font-medium text-lg">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={!inStock}
              className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
                added ? 'bg-green-500 text-white' : inStock ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              {added ? '✓ Added to Cart!' : inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button onClick={() => { handleAddToCart(); navigate('/cart'); }}
              disabled={!inStock}
              className="flex-1 py-4 rounded-xl font-bold text-sm border-2 border-black hover:bg-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all tracking-wide">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-6">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
