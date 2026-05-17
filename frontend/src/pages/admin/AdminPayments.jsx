import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getPayments } from '../../services/api';

const STATUS_COLORS = {
  Paid:    'bg-green-100 text-green-700',
  Failed:  'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getPayments().then((r) => setPayments(r.data?.payments || r.data || [])).finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments.filter((p) => p.paymentStatus === 'Paid').reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black tracking-tight mb-8">Payments</h1>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'bg-green-50 text-green-700', icon: '💰' },
            { label: 'Total Transactions', value: payments.length, color: 'bg-blue-50 text-blue-700', icon: '🔄' },
            { label: 'Successful', value: payments.filter((p) => p.paymentStatus === 'Paid').length, color: 'bg-purple-50 text-purple-700', icon: '✅' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-xl mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{s.label}</p>
              <p className="text-2xl font-black">{loading ? '…' : s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No transactions yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Transaction ID', 'Order ID', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-700">{p.transactionId}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{p.orderId?.toString().slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-bold">₹{p.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{p.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
