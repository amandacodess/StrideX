import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { cartItems, clearCart } = useCart();

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-black tracking-tight mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started.</p>
        <Link to="/products" className="inline-block bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors">
          SHOP NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black tracking-tight">MY CART</h1>
        <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2">
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          {cartItems.map((item) => <CartItem key={item._id + item.size + item.variant} item={item} />)}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-bold text-lg mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm mb-6">
            {cartItems.map((item) => (
              <div key={item._id + item.size} className="flex justify-between text-gray-600">
                <span className="truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-base mb-6">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="block w-full bg-black text-white text-center font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors text-sm tracking-wide">
            CHECKOUT
          </Link>
          <Link to="/products" className="block w-full text-center text-sm text-gray-400 mt-3 hover:text-black transition-colors">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
