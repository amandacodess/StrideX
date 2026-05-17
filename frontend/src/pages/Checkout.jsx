import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { placeOrder, validateCoupon } from '../services/api';

const emptyAddress = { fullName: '', phone: '', street: '', city: '', state: '', pincode: '' };

export default function Checkout() {
  const { cartItems, clearCart }  = useContext(CartContext);
  const navigate                  = useNavigate();
  const [address, setAddress]     = useState(emptyAddress);
  const [couponCode, setCoupon]   = useState('');
  const [discount, setDiscount]   = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const subtotal    = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalAmount = subtotal - discount;

  const handleAddressChange = (e) =>
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApplyCoupon = async () => {
    try {
      const res = await validateCoupon(couponCode);
      const discountAmt = Math.round((subtotal * res.data.discount) / 100);
      setDiscount(discountAmt);
      setCouponMsg(`Coupon applied — ${res.data.discount}% off (₹${discountAmt} saved)`);
    } catch {
      setCouponMsg('Invalid or expired coupon');
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    const required = Object.values(address).every((v) => v.trim() !== '');
    if (!required) return setError('Please fill in all address fields');
    if (cartItems.length === 0) return setError('Your cart is empty');

    setLoading(true);
    setError('');

    try {
      const payload = {
        products: cartItems.map((i) => ({
          productId: i._id,
          quantity:  i.quantity,
          size:      i.size   || '',
          variant:   i.variant || '',
        })),
        shippingAddress: address,
        couponCode:      couponCode || null,
        paymentMethod:   'simulated',
      };

      const res = await placeOrder(payload);
      clearCart();
      navigate('/order-confirmation', { state: res.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Address form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Shipping address</h2>
        {['fullName','phone','street','city','state','pincode'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={address[field]}
            onChange={handleAddressChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        ))}

        {/* Coupon */}
        <div className="flex gap-2 mt-2">
          <input
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Apply
          </button>
        </div>
        {couponMsg && (
          <p className={`text-xs mt-1 ${discount > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {couponMsg}
          </p>
        )}
      </div>

      {/* Order summary */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Order summary</h2>
        <div className="space-y-3 mb-4">
          {cartItems.map((item) => (
            <div key={item._id + item.size} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity} {item.size && `(${item.size})`}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span><span>−₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base pt-1">
            <span>Total</span><span>₹{totalAmount}</span>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full mt-6 bg-black text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition"
        >
          {loading ? 'Placing order…' : 'Place order'}
        </button>

        <p className="text-xs text-gray-400 mt-3 text-center">
          Simulated payment — no real charge
        </p>
      </div>
    </div>
  );
}