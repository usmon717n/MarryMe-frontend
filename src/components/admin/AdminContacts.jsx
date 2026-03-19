import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Phone, Mail, MessageSquare, Clock } from 'lucide-react';

const STATUS_COLORS = {
  NEW: 'bg-rose-100 text-rose-700',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-green-100 text-green-700',
};

const STATUS_LABELS = { NEW: 'Yangi', IN_REVIEW: "Ko'rilmoqda", RESOLVED: 'Hal qilindi' };

export default function AdminContacts() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchContacts = () => {
    setLoading(true);
    api.get('/admin/contacts').then(r => setContacts(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(fetchContacts, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/contacts/${id}/status`, { status });
      toast.success('Status yangilandi');
      fetchContacts();
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.contacts')}</h1>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 h-20 animate-pulse border border-gray-100" />
            ))
          ) : contacts.length === 0 ? (
            <div className="bg-white rounded-xl py-16 flex flex-col items-center gap-3 text-center border border-gray-100">
              <MessageSquare className="w-10 h-10 text-gray-200" />
              <p className="text-gray-400 text-sm">Murojaatlar yo'q</p>
            </div>
          ) : contacts.map(c => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className={`bg-white border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${selected?.id === c.id ? 'border-rose-300 shadow-sm' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="w-3 h-3" /> {c.phone}
                    </span>
                    {c.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail className="w-3 h-3" /> {c.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <div className="bg-white border border-gray-100 rounded-xl p-5 sticky top-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 font-bold">
                  {selected.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selected.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${selected.phone}`} className="text-rose-500 hover:underline">{selected.phone}</a>
                </div>
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selected.email}`} className="text-rose-500 hover:underline">{selected.email}</a>
                  </div>
                )}
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{selected.message}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(selected.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Statusni o'zgartirish:</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selected.id, key)}
                      disabled={selected.status === key}
                      className={`w-full py-2 text-sm rounded-lg transition-colors ${
                        selected.status === key
                          ? `${STATUS_COLORS[key]} opacity-60 cursor-default`
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl py-16 flex flex-col items-center gap-3 text-center">
              <MessageSquare className="w-8 h-8 text-gray-200" />
              <p className="text-gray-400 text-sm">Murojaat tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
