import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';

const EMPTY = { name:'', description:'', price:'', category:'', sizes:'', variants:'', stock:'', images:'', featured:false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  const load = () => {
    setLoading(true);
    getProducts({}).then((r) => setProducts(r.data?.products || r.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd  = ()  => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, sizes: p.sizes?.join(',') || '', variants: p.variants?.join(',') || '', images: p.images?.join(',') || '' });
    setError(''); setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        sizes:    form.sizes    ? form.sizes.split(',').map((s) => s.trim()) : [],
        variants: form.variants ? form.variants.split(',').map((v) => v.trim()) : [],
        images:   form.images   ? form.images.split(',').map((i) => i.trim()) : [],
      };
      if (editing) await updateProduct(editing._id, payload);
      else         await createProduct(payload);
      setModal(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id).catch(() => {});
    load();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black tracking-tight">Products</h1>
          <button onClick={openAdd} className="bg-black text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors">
            + Add Product
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No products found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-semibold text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{p.category}</td>
                    <td className="px-6 py-4 font-semibold">₹{p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">{p.featured ? '✅' : '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="text-xs font-medium px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-black mb-6">{editing ? 'Edit Product' : 'Add Product'}</h2>
              {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
              <form onSubmit={handleSave} className="space-y-4">
                {[
                  { name: 'name',        label: 'Name',              type: 'text' },
                  { name: 'price',       label: 'Price (₹)',          type: 'number' },
                  { name: 'category',    label: 'Category',          type: 'text' },
                  { name: 'stock',       label: 'Stock Qty',         type: 'number' },
                  { name: 'sizes',       label: 'Sizes (comma sep)', type: 'text' },
                  { name: 'variants',    label: 'Variants (comma)',  type: 'text' },
                  { name: 'images',      label: 'Image URLs (comma)',type: 'text' },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{f.label}</label>
                    <input type={f.type} value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black" required={['name','price','category','stock'].includes(f.name)} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-black w-4 h-4" />
                  <span className="text-sm text-gray-700">Featured product</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-black text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors">
                    {saving ? 'Saving…' : 'Save'}
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
