import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin',             label: 'Dashboard',  icon: '📊' },
  { to: '/admin/products',    label: 'Products',   icon: '👟' },
  { to: '/admin/orders',      label: 'Orders',     icon: '📦' },
  { to: '/admin/inventory',   label: 'Inventory',  icon: '🗄️' },
  { to: '/admin/coupons',     label: 'Coupons',    icon: '🎫' },
  { to: '/admin/users',       label: 'Users',      icon: '👤' },
  { to: '/admin/payments',    label: 'Payments',   icon: '💳' },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-60 bg-black text-white flex flex-col min-h-screen flex-shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/" className="text-xl font-black tracking-tighter">
          STRIDE<span className="text-yellow-400">X</span>
          <span className="ml-2 text-xs text-gray-400 font-normal tracking-normal">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon }) => {
          const active = pathname === to || (to !== '/admin' && pathname.startsWith(to));
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}>
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-4">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
          <span>🏪</span> View Store
        </Link>
      </div>
    </aside>
  );
}
