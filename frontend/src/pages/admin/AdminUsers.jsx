import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getUsers } from '../../services/api';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    getUsers().then((r) => setUsers(r.data?.users || r.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black tracking-tight">Users</h1>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm w-60 focus:outline-none focus:ring-1 focus:ring-black" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No users found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {['User', 'Email', 'Role', 'Joined'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
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
