import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Phone, Mail, MessageSquare, Clock, Send, CheckCheck } from 'lucide-react';

const STATUS_COLORS = {
  NEW:       'bg-rose-100 text-rose-700',
  IN_REVIEW: 'bg-amber-100 text-amber-700',
  RESOLVED:  'bg-green-100 text-green-700',
};
const STATUS_LABELS = { NEW: 'Yangi', IN_REVIEW: "Ko'rilmoqda", RESOLVED: 'Hal qilindi' };

export default function AdminContacts() {
  const { t } = useTranslation();
  const [contacts,  setContacts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [reply,     setReply]     = useState('');
  const [sending,   setSending]   = useState(false);
  const [replies,   setReplies]   = useState({}); // contactId → [{ text, time }]
  const textareaRef = useRef(null);

  const fetchContacts = () => {
    setLoading(true);
    api.get('/admin/contacts')
      .then(r => setContacts(r.data.data))
      .finally(() => setLoading(false));
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

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/admin/contacts/${selected.id}/reply`, { message: reply.trim() });
      const newReply = { text: reply.trim(), time: new Date().toISOString(), notified: res.data.notified };
      setReplies(prev => ({
        ...prev,
        [selected.id]: [...(prev[selected.id] || []), newReply],
      }));
      setReply('');
      toast.success(res.data.notified ? 'Xabar yuborildi va foydalanuvchi xabardor qilindi ✓' : 'Xabar saqlandi (foydalanuvchi topilmadi)');
      // auto mark in-review
      if (selected.status === 'NEW') {
        updateStatus(selected.id, 'IN_REVIEW');
      }
    } catch {
      toast.error('Xabar yuborishda xato');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendReply();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.contacts')}</h1>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
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
            <div key={c.id}
              onClick={() => setSelected(c)}
              className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-sm ${selected?.id === c.id ? 'border-rose-300 shadow-sm bg-rose-50/30' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{c.name}</p>
                  {(replies[c.id]?.length > 0) && (
                    <CheckCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[c.status]}`}>
                  {STATUS_LABELS[c.status]}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mb-1.5">{c.message}</p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Phone className="w-3 h-3" />{c.phone}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                  <Clock className="w-3 h-3" />
                  {new Date(c.createdAt).toLocaleDateString('uz-UZ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail + Reply */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
              {/* Header */}
              <div className="flex items-center gap-3 p-5 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 font-bold flex-shrink-0">
                  {selected.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{selected.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${selected.phone}`} className="text-rose-500 hover:underline">{selected.phone}</a>
                    </span>
                    {selected.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${selected.email}`} className="text-rose-500 hover:underline truncate max-w-[160px]">{selected.email}</a>
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              {/* Conversation */}
              <div className="flex-1 p-5 space-y-3 overflow-y-auto" style={{ maxHeight: '320px' }}>
                {/* Original message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-sm flex-shrink-0">
                    {selected.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-700 leading-relaxed border border-gray-100">
                      {selected.message}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-1">
                      {new Date(selected.createdAt).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                </div>

                {/* Replies */}
                {(replies[selected.id] || []).map((r, i) => (
                  <div key={i} className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      A
                    </div>
                    <div className="flex-1 flex flex-col items-end">
                      <div className="bg-rose-400 rounded-2xl rounded-tr-none px-4 py-3 text-sm text-white leading-relaxed max-w-[85%]">
                        {r.text}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 mr-1 flex items-center gap-1">
                        {r.notified && <CheckCheck className="w-3 h-3 text-green-500" />}
                        {new Date(r.time).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status change */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Status:</span>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <button key={key}
                    onClick={() => updateStatus(selected.id, key)}
                    disabled={selected.status === key}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      selected.status === key
                        ? `${STATUS_COLORS[key]} cursor-default`
                        : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Reply box */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                <p className="text-xs font-medium text-gray-600 mb-2">Javob yozing — foydalanuvchi bildirishnomalar orqali qabul qiladi:</p>
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={textareaRef}
                    rows={3}
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Xabar yozing... (Ctrl+Enter — yuborish)"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none resize-none bg-white"
                  />
                  <button
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-400 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0 h-[70px]">
                    {sending ? (
                      <span className="text-xs">Yuborilmoqda...</span>
                    ) : (
                      <><Send className="w-4 h-4" /><span className="hidden sm:block">Yuborish</span></>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {selected.email || selected.phone
                    ? "Foydalanuvchi tizimda ro'yxatdan o'tgan bo'lsa bildirishnoma keladi"
                    : "Foydalanuvchi ma'lumotlari topilmadi"}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl py-20 flex flex-col items-center gap-3 text-center shadow-sm">
              <MessageSquare className="w-10 h-10 text-gray-200" />
              <p className="text-gray-400 text-sm">Murojaat tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
