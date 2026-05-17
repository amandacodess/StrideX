import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getCoupons, createCoupon, deleteCoupon } from '../../services/api';

const EMPTY = { code: '', discount: '', expiryDate: '', usageLimit: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const load = () => {
    setLoading(true);
    getCoupons().then((r) => setCoupons(r.data?.coupons || r.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await createCoupon({ ...form, discount: Number(form.discount), usageLimit: Number(form.usageLimit) });
      setModal(false); setForm(EMPTY); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await deleteCoupon(id).catch(() => {});
    load();
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black tracking-tight">Coupons</h1>
          <button onClick={() => { setForm(EMPTY); setError(''); setModal(true); }}
            className="bg-black text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors">
            + Create Coupon
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map((i) => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl">No coupons yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => {
              const expired = isExpired(c.expiryDate);
              return (
                <div key={c._id} className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${expired ? 'border-red-100 opacity-70' : 'border-transparent'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono font-black text-xl tracking-wider text-black">{c.code}</span>
                    <button onClick={() => handleDelete(c._id)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-xl leading-none">×</button>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Discount</span>
                      <span className="font-bold text-green-600">{c.discount}% off</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Expires</span>
                      <span className={`font-medium text-xs ${expired ? 'text-red-500' : 'text-gray-700'}`}>
                        {new Date(c.expiryDate).toLocaleDateString('en-IN')} {expired && '(Expired)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Usage limit</span>
                      <span className="font-medium">{c.usageLimit}</span>
                    </div>
                  </div>
                  {!expired && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-xl font-black mb-6">Create Coupon</h2>
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
              <form onSubmit={handleSave} className="space-y-4">
                {[
                  { name: 'code',       label: 'Coupon Code',        type: 'text',   placeholder: 'SUMMER20' },
                  { name: 'discount',   label: 'Discount (%)',       type: 'number', placeholder: '10' },
                  { name: 'expiryDate', label: 'Expiry Date',        type: 'date',   placeholder: '' },
                  { name: 'usageLimit', label: 'Usage Limit',        type: 'number', placeholder: '100' },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{f.label}</label>
                    <input type={f.type} value={form[f.name]} placeholder={f.placeholder}
                      onChange={(e) => setForm({ ...form, [f.name]: f.name === 'code' ? e.target.value.toUpperCase() : e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black" required />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-black text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors">
                    {saving ? 'Creating…' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
