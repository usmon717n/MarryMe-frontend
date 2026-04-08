import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import { ShoppingBag, Users, TrendingUp, MessageSquare, Calendar } from 'lucide-react';

const STATUS_COLORS = {
  PENDING:     'bg-amber-100 text-amber-700',
  CONFIRMED:   'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED:   'bg-gray-100 text-gray-700',
  CANCELLED:   'bg-red-100 text-red-700',
};

const fmt = (p) => new Intl.NumberFormat('uz-UZ').format(p);

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [data,    setData]    = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/orders?limit=8'),
    ])
      .then(([dashRes, ordersRes]) => {
        // FIX: backend returns data directly, not data.stats
        setData(dashRes.data.data);
        setOrders(ordersRes.data.data || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-gray-100" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
        Xato: {error}
      </div>
    </div>
  );

  const stats = [
    { label: t('admin.totalOrders'),   value: data?.totalOrders  ?? 0,               icon: ShoppingBag,   color: 'bg-rose-50 text-rose-500'   },
    { label: t('admin.totalClients'),  value: data?.totalUsers   ?? 0,               icon: Users,         color: 'bg-blue-50 text-blue-500'   },
    { label: t('admin.totalRevenue'),  value: fmt(data?.totalRevenue ?? 0) + ' so\'m', icon: TrendingUp,    color: 'bg-green-50 text-green-500' },
    { label: t('admin.newContacts'),   value: data?.newContacts  ?? 0,               icon: MessageSquare, color: 'bg-amber-50 text-amber-500' },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.dashboard')}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: t('status.PENDING'),   value: data?.pendingOrders ?? 0, color: 'text-amber-500' },
          { label: 'Faol',                value: 0,                        color: 'text-blue-500'  },
          { label: t('status.COMPLETED'), value: 0,                        color: 'text-gray-500'  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Oxirgi buyurtmalar</h2>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Buyurtmalar yo'q</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map(order => (
              <div key={order.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{order.user?.name || order.user?.email}</p>
                  <p className="text-xs text-gray-500 truncate">{order.service}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(order.eventDate).toLocaleDateString('uz-UZ')}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || ''}`}>
                  {t(`status.${order.status}`) || order.status}
                </span>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  {fmt(order.totalPrice)} so'm
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
