import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllOrders, updateOrderStatus } from '../../services/api';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then((r) => setOrders(r.data?.orders || r.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus: status } : o));
    } catch {} finally { setUpdating(null); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black tracking-tight mb-8">Orders</h1>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No orders found</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {orders.map((o) => (
                <div key={o._id}>
                  <div className="flex items-center px-6 py-4 hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-gray-400">#{o._id?.slice(-8).toUpperCase()}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{o.userId?.name || 'Customer'}</p>
                    </div>
                    <div className="hidden md:block w-48 text-sm text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </div>
                    <div className="w-32 text-sm font-bold">₹{o.totalAmount?.toLocaleString()}</div>
                    <div className="w-32">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {o.orderStatus}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs">{expanded === o._id ? '▲' : '▼'}</div>
                  </div>

                  {expanded === o._id && (
                    <div className="px-6 pb-6 bg-gray-50/50 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Items</h3>
                          <div className="space-y-2">
                            {o.products?.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span>{item.productId?.name || 'Product'} × {item.quantity} {item.size && `(${item.size})`}</span>
                              </div>
                            ))}
                          </div>
                          {o.shippingAddress && (
                            <div className="mt-4">
                              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Shipping</h3>
                              <p className="text-sm text-gray-600">
                                {o.shippingAddress.fullName}, {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state} — {o.shippingAddress.pincode}
                              </p>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Update Status</h3>
                          <div className="flex flex-wrap gap-2">
                            {STATUSES.map((s) => (
                              <button key={s} onClick={() => handleStatus(o._id, s)}
                                disabled={updating === o._id}
                                className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                                  o.orderStatus === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                                }`}>{s}</button>
                            ))}
                          </div>
                          <div className="mt-4 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Transaction ID</span>
                              <span className="font-mono text-xs">{o.transactionId || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Payment</span>
                              <span className={`font-semibold ${o.paymentStatus === 'Paid' ? 'text-green-600' : 'text-gray-600'}`}>{o.paymentStatus}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
