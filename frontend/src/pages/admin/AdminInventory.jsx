import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getProducts, updateProduct } from '../../services/api';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState({});
  const [saving,  setSaving]    = useState(null);

  const load = () => {
    setLoading(true);
    getProducts({}).then((r) => setProducts(r.data?.products || r.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStockChange = (id, val) => setEditing((prev) => ({ ...prev, [id]: val }));

  const handleSave = async (product) => {
    const newStock = Number(editing[product._id]);
    if (isNaN(newStock) || newStock < 0) return;
    setSaving(product._id);
    try {
      await updateProduct(product._id, { ...product, stock: newStock });
      setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, stock: newStock } : p));
      setEditing((prev) => { const n = { ...prev }; delete n[product._id]; return n; });
    } catch {} finally { setSaving(null); }
  };

  const lowStock  = products.filter((p) => p.stock < 5);
  const okStock   = products.filter((p) => p.stock >= 5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-black tracking-tight mb-8">Inventory</h1>

        {/* Low stock alert */}
        {!loading && lowStock.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <h2 className="font-bold text-red-700 mb-3">⚠️ Low Stock Alert — {lowStock.length} item{lowStock.length > 1 ? 's' : ''}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStock.map((p) => (
                <div key={p._id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-red-500 font-bold">{p.stock} left</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} value={editing[p._id] ?? p.stock}
                      onChange={(e) => handleStockChange(p._id, e.target.value)}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-black" />
                    {editing[p._id] !== undefined && (
                      <button onClick={() => handleSave(p)} disabled={saving === p._id}
                        className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
                        {saving === p._id ? '…' : 'Save'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Update'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className={p.stock < 5 ? 'bg-red-50/30' : ''}>
                    <td className="px-6 py-3 font-semibold text-gray-900">{p.name}</td>
                    <td className="px-6 py-3 text-gray-500 capitalize">{p.category}</td>
                    <td className="px-6 py-3 font-semibold">₹{p.price?.toLocaleString()}</td>
                    <td className="px-6 py-3 font-bold">{p.stock}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {p.stock === 0 ? 'Out of Stock' : p.stock < 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <input type="number" min={0} value={editing[p._id] ?? p.stock}
                          onChange={(e) => handleStockChange(p._id, e.target.value)}
                          className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-black" />
                        {editing[p._id] !== undefined && (
                          <button onClick={() => handleSave(p)} disabled={saving === p._id}
                            className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
                            {saving === p._id ? '…' : 'Save'}
                          </button>
                        )}
                      </div>
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
