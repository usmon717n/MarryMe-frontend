import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../context/AuthContext';
import { Menu, X, Heart, Globe, ChevronDown, LayoutDashboard, LogOut, Shield, Bell } from 'lucide-react';

const LANGS = [
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const STATUS_COLORS = {
  WELCOME:       'bg-rose-50 text-rose-500',
  ORDER_CREATED: 'bg-blue-50 text-blue-500',
  ORDER_STATUS:  'bg-amber-50 text-amber-600',
  SYSTEM:        'bg-gray-50 text-gray-500',
};

const STATUS_EMOJI = {
  WELCOME:       '🎉',
  ORDER_CREATED: '📋',
  ORDER_STATUS:  '🔔',
  SYSTEM:        'ℹ️',
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)   return 'Hozirgina';
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  return new Date(date).toLocaleDateString('uz-UZ');
}

function NotificationBell({ user }) {
  const [open, setOpen]   = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const fetch = () => {
    api.get('/notifications')
      .then(r => { setItems(r.data.data); setUnread(r.data.unread); })
      .catch(() => {});
  };

  useEffect(() => {
    if (!user) return;
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [user]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const openPanel = () => {
    setOpen(o => !o);
  };

  const markAll = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const markOne = async (id) => {
    await api.put(`/notifications/${id}/read`).catch(() => {});
    setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={openPanel}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">Bildirishnomalar</span>
            {unread > 0 && (
              <button onClick={markAll} className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                Barchasini o'qildi
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                Bildirishnomalar yo'q
              </div>
            ) : items.map(n => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markOne(n.id)}
                className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition-colors
                  ${n.isRead ? 'bg-white' : 'bg-rose-50/40 hover:bg-rose-50'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${STATUS_COLORS[n.type] || 'bg-gray-50 text-gray-500'}`}>
                  {STATUS_EMOJI[n.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${n.isRead ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-xs text-gray-300 mt-1">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 bg-rose-400 rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('mm_lang', code);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserOpen(false);
    setMenuOpen(false);
  };

  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  const navLinks = [
    { to: '/',          label: t('nav.home'),      end: true },
    { to: '/services',  label: t('nav.services')          },
    { to: '/portfolio', label: t('nav.portfolio')         },
    { to: '/contact',   label: t('nav.contact')           },
  ];

  const closeAll = () => { setLangOpen(false); setUserOpen(false); };

  return (
    <>
      {(langOpen || userOpen) ? <div className="fixed inset-0 z-40" onClick={closeAll} /> : null}

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-rose-100/80 shadow-sm shadow-rose-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Marry<span className="text-rose-400">Me</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm rounded-xl font-medium transition-all ${
                    isActive ? 'text-rose-500 bg-rose-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Notification Bell */}
            <NotificationBell user={user} />

            {/* Lang */}
            <div className="relative hidden sm:block">
              <button onClick={() => { setLangOpen(o => !o); setUserOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="font-medium">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px] z-50">
                  {LANGS.map(l => (
                    <button key={l.code} onClick={() => changeLang(l.code)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                        i18n.language === l.code ? 'text-rose-500 bg-rose-50' : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User */}
            {user ? (
              <div className="relative">
                <button onClick={() => { setUserOpen(o => !o); setLangOpen(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-rose-100 flex items-center justify-center flex-shrink-0">
                    {user.profile?.avatar
                      ? <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xs font-semibold text-rose-500">{(user.profile?.firstName?.[0] ?? 'U').toUpperCase()}</span>
                    }
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                    {user.profile?.firstName ?? user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[180px] z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.profile?.firstName} {user.profile?.lastName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 transition-colors">
                        <Shield className="w-4 h-4" /> Admin panel
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> {t('nav.dashboard')}
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  {t('auth.login')}
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl hover:shadow-md transition-all">
                  {t('auth.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(o => !o)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'text-rose-500 bg-rose-50' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }>
                {link.label}
              </NavLink>
            ))}
            {LANGS.map(l => (
              <button key={l.code} onClick={() => { changeLang(l.code); setMenuOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  i18n.language === l.code ? 'text-rose-500 bg-rose-50' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
