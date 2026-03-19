// AdminOrders.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUSES = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

function formatPrice(p) { return new Intl.NumberFormat('uz-UZ').format(p); }

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/admin/orders${params}`)
      .then(r => setOrders(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.orders')}</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setStatusFilter('')}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${!statusFilter ? 'bg-rose-400 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          {t('common.seeAll')}
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${statusFilter === s ? 'bg-rose-400 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t(`status.${s}`)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Mijoz</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Xizmat</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Sana</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Narx</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Holat</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.user?.profile?.firstName} {order.user?.profile?.lastName}</p>
                    <p className="text-xs text-gray-400">{order.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {order.service?.translations?.[0]?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(order.eventDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {formatPrice(order.totalPrice)} so'm
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {t(`status.${order.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-300"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && orders.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">Buyurtmalar yo'q</div>
        )}
      </div>
    </div>
  );
}
