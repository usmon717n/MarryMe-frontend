import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Package, Calendar, CreditCard } from 'lucide-react';

const STATUSES = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const STATUS_COLORS = {
  PENDING:     'bg-amber-100 text-amber-700',
  CONFIRMED:   'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED:   'bg-gray-100 text-gray-700',
  CANCELLED:   'bg-red-100 text-red-700',
};

const fmt = (p) => new Intl.NumberFormat('uz-UZ').format(p);

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders,       setOrders]       = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading,      setLoading]      = useState(true);
  const [selected,     setSelected]     = useState(null);

  const fetch = () => {
    setLoading(true);
    const q = statusFilter ? `?status=${statusFilter}` : '';
    api.get(`/admin/orders${q}`)
      .then(r => setOrders(r.data.data))
      .catch(() => toast.error(t('common.error')))
      .finally(() => setLoading(false));
  };

  useEffect(fetch, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success('Status yangilandi');
      fetch();
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.orders')}</h1>

      {/* Filters */}
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

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Table */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Mijoz</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Xizmat</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Narx</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Holat</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : orders.map(order => {
                    const name  = [order.user?.name].filter(Boolean).join(' ') || '—';
                    const contact = order.user?.phone || order.user?.email || '—';
                    const svcName = order.service || '—';

                    return (
                      <tr key={order.id}
                        onClick={() => setSelected(order)}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected?.id === order.id ? 'bg-rose-50/40' : ''}`}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 text-sm">{name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            {order.user?.phone
                              ? <><Phone className="w-3 h-3"/>{order.user.phone}</>
                              : <><Mail className="w-3 h-3"/>{order.user?.email || '—'}</>
                            }
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800 text-sm font-medium">{svcName}</p>
                          {order.package && (
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Package className="w-3 h-3"/>{order.package}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-semibold text-gray-900">{fmt(order.totalPrice)} so'm</p>
                          <p className="text-xs text-rose-500">Avans: {fmt(order.advancePayment)} so'm</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                            {t(`status.${order.status}`)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateStatus(order.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-rose-300 bg-white"
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {!loading && orders.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">Buyurtmalar yo'q</div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 sticky top-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Buyurtma tafsiloti</h3>
                <span className="text-xs text-gray-400">#{selected.orderNumber?.slice(-6).toUpperCase()}</span>
              </div>

              {/* Client */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mijoz</p>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{selected.user?.name || '—'}</p>
                    {selected.user?.phone
                      ? <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/>{selected.user.phone}</p>
                      : <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3"/>{selected.user?.email || '—'}</p>
                    }
                  </div>
                </div>
              </div>

              {/* Service */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Xizmat</p>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Xizmat</span>
                    <span className="text-sm font-medium text-gray-900">{selected.service || '—'}</span>
                  </div>
                  {selected.package && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Paket</span>
                      <span className="text-sm font-medium text-gray-900">{selected.package}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3"/>Sana</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(selected.eventDate).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  {selected.venue && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Joy</span>
                      <span className="text-sm font-medium text-gray-900 max-w-[140px] text-right truncate">{selected.venue}</span>
                    </div>
                  )}
                  {selected.guestCount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mehmonlar</span>
                      <span className="text-sm font-medium text-gray-900">{selected.guestCount} kishi</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">To'lov</p>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1"><CreditCard className="w-3 h-3"/>Jami narx</span>
                    <span className="text-sm font-bold text-gray-900">{fmt(selected.totalPrice)} so'm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avans (30%)</span>
                    <span className="text-sm font-semibold text-rose-500">{fmt(selected.advancePayment)} so'm</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Izoh:</p>
                  <p className="text-sm text-amber-800">{selected.notes}</p>
                </div>
              )}

              {/* Status change */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Statusni o'zgartirish</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {STATUSES.map(s => (
                    <button key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={selected.status === s}
                      className={`py-2 px-3 text-xs rounded-lg font-medium transition-colors text-left ${
                        selected.status === s
                          ? `${STATUS_COLORS[s]} opacity-70 cursor-default`
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}>
                      {selected.status === s ? '✓ ' : ''}{t(`status.${s}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl py-20 flex flex-col items-center gap-3 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">Buyurtma tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
