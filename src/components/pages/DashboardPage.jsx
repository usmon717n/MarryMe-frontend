import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, api } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Camera, Edit3, Save, X, Calendar, ArrowRight,
  Clock, CheckCircle2, XCircle, Loader2, Star,
  Phone, Mail, MapPin, Shield, Heart, Package,
} from 'lucide-react';

// ─── HELPERS ──────────────────────────────────────────────
const fmt = (p) => new Intl.NumberFormat('uz-UZ').format(p);

const STATUS = {
  PENDING:     { label: "Ko'rilmoqda",   bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200',   dot: 'bg-amber-400',   Icon: Clock        },
  CONFIRMED:   { label: 'Tasdiqlandi',   bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-400', Icon: CheckCircle2 },
  IN_PROGRESS: { label: 'Jarayonda',     bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    dot: 'bg-blue-400',    Icon: Loader2      },
  COMPLETED:   { label: 'Bajarildi',     bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-200',    dot: 'bg-gray-400',    Icon: Star         },
  CANCELLED:   { label: 'Bekor qilindi', bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-200',     dot: 'bg-red-400',     Icon: XCircle      },
};

// ─── AVATAR COMPONENT ─────────────────────────────────────
function AvatarUploader({ user, onUploaded }) {
  const { uploadAvatar } = useAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error('Rasm 3MB dan kichik bo\'lsin'); return; }

    try {
      setUploading(true);
      const url = await uploadAvatar(file);
      toast.success('Rasm yangilandi! ✅');
      onUploaded?.(url);
    } catch {
      toast.error('Rasm yuklashda xato');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const initials = [user?.profile?.firstName?.[0], user?.profile?.lastName?.[0]]
    .filter(Boolean).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="relative group flex-shrink-0">
      <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl">
        {user?.profile?.avatar ? (
          <img
            src={user.profile.avatar}
            alt={initials}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div
          className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold"
          style={{ display: user?.profile?.avatar ? 'none' : 'flex' }}
        >
          {initials}
        </div>
      </div>

      {/* Upload overlay */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
      >
        {uploading
          ? <Loader2 className="w-6 h-6 text-white animate-spin" />
          : <Camera className="w-6 h-6 text-white" />
        }
      </button>

      {/* Camera badge */}
      <div
        onClick={() => inputRef.current?.click()}
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-rose-400 hover:bg-rose-500 rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-colors"
      >
        <Camera className="w-4 h-4 text-white" />
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
    </div>
  );
}

// ─── PROFILE SECTION ──────────────────────────────────────
function ProfileSection({ user, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const { updateProfile } = useAuth();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName:  user?.profile?.lastName  || '',
      phone:     user?.phone              || '',
      city:      user?.profile?.city      || '',
    },
  });

  // Sync form when user changes
  useEffect(() => {
    reset({
      firstName: user?.profile?.firstName || '',
      lastName:  user?.profile?.lastName  || '',
      phone:     user?.phone              || '',
      city:      user?.profile?.city      || '',
    });
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      setSaving(true);
      await updateProfile(values);
      toast.success('Profil yangilandi ✅');
      setEditing(false);
      onSaved?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xato yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const fullName = [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ') || 'Foydalanuvchi';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' }) : '';

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      {/* Cover gradient */}
      <div className="h-28 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        {/* Role badge */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
            <Shield className="w-3 h-3" /> Admin
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        {/* Avatar + name row */}
        <div className="flex items-end gap-4 -mt-12 mb-5">
          <AvatarUploader user={user} onUploaded={onSaved} />
          <div className="pb-1 flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate leading-tight">{fullName}</h2>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            {memberSince && (
              <p className="text-xs text-gray-400 mt-0.5">A'zo: {memberSince}</p>
            )}
            {user?.authProvider === 'GOOGLE' && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full mt-1">
                <svg viewBox="0 0 24 24" style={{ width: 10, height: 10 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </span>
            )}
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex-shrink-0 flex items-center gap-2 border border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-600 hover:text-rose-500 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              <Edit3 className="w-4 h-4" /> Tahrirlash
            </button>
          )}
        </div>

        {editing ? (
          /* ── EDIT FORM ── */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Ism</label>
                <input {...register('firstName', { required: true })}
                  className="w-full border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Familiya</label>
                <input {...register('lastName', { required: true })}
                  className="w-full border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Telefon</label>
                <input type="tel" {...register('phone')} placeholder="+998 90 000 00 00"
                  className="w-full border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Shahar</label>
                <input {...register('city')} placeholder="Toshkent"
                  className="w-full border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 rounded-xl px-3 py-2.5 text-sm outline-none transition-all" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 shadow-sm shadow-rose-200 transition-all">
                <Save className="w-4 h-4" />
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
              <button type="button" onClick={() => { reset(); setEditing(false); }}
                className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
                <X className="w-4 h-4" /> Bekor
              </button>
            </div>
          </form>
        ) : (
          /* ── INFO GRID ── */
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Mail,   label: 'Email',   value: user?.email,              color: 'bg-rose-50 text-rose-400'    },
              { Icon: Phone,  label: 'Telefon', value: user?.phone    || '—',    color: 'bg-violet-50 text-violet-400' },
              { Icon: MapPin, label: 'Shahar',  value: user?.profile?.city || '—', color: 'bg-amber-50 text-amber-400'  },
            ].map(({ Icon, label, value, color }) => (
              <div key={label} className="bg-gray-50 hover:bg-gray-100 rounded-2xl px-4 py-3 transition-colors">
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-2`}>
                  <Icon style={{ width: 14, height: 14 }} />
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-800 truncate" title={value}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────
function OrderCard({ order }) {
  const cfg = STATUS[order.status] || STATUS.PENDING;
  const { Icon } = cfg;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-rose-100 transition-all">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl ${cfg.bg} ${cfg.border} border flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${cfg.text}`} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{order.service}</p>
            {order.package && <p className="text-xs text-gray-400">{order.package} paketi</p>}
            <div className="flex items-center gap-1 mt-1.5">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {new Date(order.eventDate).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <p className="text-sm font-bold text-gray-900 mt-2">{fmt(order.totalPrice)} so'm</p>
          <p className="text-xs text-gray-400">avans: {fmt(order.advancePayment || Math.round(order.totalPrice * 0.3))} so'm</p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function DashboardPage() {
  const { t }                    = useTranslation();
  const { user, refreshUser }    = useAuth();
  const [orders,  setOrders]     = useState([]);
  const [loading, setLoading]    = useState(true);
  const [tab, setTab]            = useState('orders'); // 'orders' | 'profile'

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data || []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleProfileSaved = async () => {
    await refreshUser();
  };

  const stats = [
    { label: 'Jami',       value: orders.length,                                                               g: 'from-rose-400 to-pink-500'     },
    { label: 'Faol',       value: orders.filter(o => ['CONFIRMED','IN_PROGRESS'].includes(o.status)).length,   g: 'from-blue-400 to-indigo-500'   },
    { label: 'Bajarildi',  value: orders.filter(o => o.status === 'COMPLETED').length,                         g: 'from-emerald-400 to-teal-500'  },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/60 via-pink-50/30 to-white">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* ── PROFILE SECTION ── */}
        <div className="mb-6">
          <ProfileSection user={user} onSaved={handleProfileSaved} />
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
              <div className={`text-3xl font-bold bg-gradient-to-r ${s.g} bg-clip-text text-transparent mb-1`}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500">{s.label} buyurtma</div>
            </div>
          ))}
        </div>

        {/* ── ORDERS ── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-300" />
            {t('dashboard.myOrders')}
          </h2>
          <Link to="/services"
            className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 font-medium">
            Yangi buyurtma <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl py-16 flex flex-col items-center gap-4 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-3xl">💍</div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">{t('dashboard.noOrders')}</p>
              <p className="text-sm text-gray-400">Birinchi buyurtmangizni bering</p>
            </div>
            <Link to="/services"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">
              Xizmatlarni ko'rish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
}
