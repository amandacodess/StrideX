import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No order data found.</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">Go home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-semibold mb-2">Order placed!</h1>
      <p className="text-gray-500 text-sm mb-8">
        Thanks for your purchase. Your order is being processed.
      </p>

      <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Order ID</span>
          <span className="font-mono text-xs">{state.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Transaction ID</span>
          <span className="font-mono font-medium">{state.transactionId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Amount paid</span>
          <span className="font-semibold">₹{state.totalAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-green-600 font-medium">Paid</span>
        </div>
      </div>

      <div className="mt-8 flex gap-3 justify-center">
        <Link to="/profile" className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
          View orders
        </Link>
        <Link to="/products" className="px-5 py-2.5 bg-black text-white rounded-lg text-sm hover:bg-gray-900">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}