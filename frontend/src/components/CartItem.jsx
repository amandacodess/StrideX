import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart();
  const imgSrc = item.images?.[0] || `https://placehold.co/120x120/1a1a1a/ffffff?text=${encodeURIComponent(item.name)}`;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover"
          onError={(e) => { e.target.src = `https://placehold.co/120x120/1a1a1a/ffffff?text=${encodeURIComponent(item.name)}`; }} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{item.name}</h3>
        {item.size    && <p className="text-xs text-gray-400 mb-0.5">Size: {item.size}</p>}
        {item.variant && <p className="text-xs text-gray-400 mb-0.5">Variant: {item.variant}</p>}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => updateQty(item._id, item.size, item.variant, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-lg font-medium"
            >−</button>
            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQty(item._id, item.size, item.variant, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-lg font-medium"
            >+</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
            <button
              onClick={() => removeFromCart(item._id, item.size, item.variant)}
              className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
            >×</button>
          </div>
        </div>
      </div>
    </div>
  );
}
