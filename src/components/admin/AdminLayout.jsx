import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, MessageSquare, Heart, LogOut, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
    { to: '/admin/orders',     label: 'Buyurtmalar',icon: ShoppingBag },
    { to: '/admin/services',   label: 'Xizmatlar',  icon: Settings },
    { to: '/admin/contacts',   label: 'Murojaatlar',icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-gray-900 flex flex-col transition-all duration-200 flex-shrink-0`}>
        <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-800">
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400 flex-shrink-0" />
          {sidebarOpen && <span className="text-white font-bold">Marry<span className="text-rose-400">Me</span></span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-gray-400 hover:text-white">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 pt-4">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive ? 'bg-rose-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-800">
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors text-sm w-full">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span>Chiqish</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
