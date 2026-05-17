import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getAllOrders, getProducts, getUsers } from '../../services/api';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getAllOrders(), getProducts({}), getUsers()])
      .then(([ordersRes, productsRes, usersRes]) => {
        const orders   = ordersRes.value?.data?.orders   || ordersRes.value?.data  || [];
        const products = productsRes.value?.data?.products || productsRes.value?.data || [];
        const users    = usersRes.value?.data?.users      || usersRes.value?.data   || [];

        const revenue  = orders.filter((o) => o.paymentStatus === 'Paid').reduce((s, o) => s + (o.totalAmount || 0), 0);
        const lowStock = products.filter((p) => p.stock < 5).length;

        setStats({ products: products.length, orders: orders.length, revenue, users: users.length, lowStock });
        setRecentOrders(orders.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: '👟', color: 'bg-blue-50 text-blue-700', link: '/admin/products' },
    { label: 'Total Orders',   value: stats.orders,   icon: '📦', color: 'bg-purple-50 text-purple-700', link: '/admin/orders' },
    { label: 'Total Revenue',  value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: 'bg-green-50 text-green-700', link: '/admin/payments' },
    { label: 'Total Users',    value: stats.users,    icon: '👤', color: 'bg-yellow-50 text-yellow-700', link: '/admin/users' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
          </div>
          {stats.lowStock > 0 && (
            <Link to="/admin/inventory" className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
              ⚠️ {stats.lowStock} item{stats.lowStock > 1 ? 's' : ''} low in stock
            </Link>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((c) => (
            <Link key={c.label} to={c.link}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-xl mb-4 ${c.color}`}>
                {c.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{c.label}</p>
              <p className="text-2xl font-black tracking-tight">{loading ? '…' : c.value}</p>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-lg">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-gray-400 hover:text-black underline underline-offset-2">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3">Order ID</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3">Customer</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3">Amount</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td className="py-3 font-mono text-xs text-gray-400">#{o._id?.slice(-8).toUpperCase()}</td>
                      <td className="py-3 text-gray-700">{o.userId?.name || 'Customer'}</td>
                      <td className="py-3 font-semibold">₹{o.totalAmount?.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
