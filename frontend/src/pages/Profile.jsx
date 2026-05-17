import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/api';

const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getOrders()
      .then((res) => setOrders(res.data?.orders || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* User card */}
      <div className="bg-black text-white rounded-2xl p-8 mb-8 flex items-center justify-between">
        <div>
          <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-black text-2xl font-black mb-3">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          <span className="inline-block mt-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {user.role}
          </span>
        </div>
        <button onClick={logout} className="text-sm border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
          Logout
        </button>
      </div>

      {/* Orders */}
      <h2 className="text-xl font-black tracking-tight mb-5">MY ORDERS</h2>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map((i) => <div key={i} className="bg-white rounded-2xl p-6 h-24 animate-pulse bg-gray-200" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-gray-400 mb-1">Order #{order._id?.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                    {order.orderStatus}
                  </span>
                  <p className="text-lg font-bold mt-2">₹{order.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
              <div className="border-t border-gray-50 pt-3 text-xs text-gray-500 space-y-1">
                {order.products?.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.productId?.name || 'Product'} × {item.quantity}</span>
                  </div>
                ))}
                {order.products?.length > 2 && <p className="text-gray-400">+{order.products.length - 2} more items</p>}
              </div>
              {order.transactionId && (
                <p className="text-xs text-gray-400 mt-3 font-mono">Txn: {order.transactionId}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
