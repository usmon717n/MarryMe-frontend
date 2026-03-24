import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../context/AuthContext';
import {
  Heart, Globe, ChevronDown, LayoutDashboard,
  LogOut, Shield, Bell, Sun, Moon, Menu, X,
} from 'lucide-react';

// ─── CONSTANTS ────────────────────────────────────────────
const LANGS = [
  { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const NOTIF_COLORS = {
  WELCOME:       'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
  ORDER_CREATED: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  ORDER_STATUS:  'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
  SYSTEM:        'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
};

const NOTIF_EMOJI = {
  WELCOME: '🎉', ORDER_CREATED: '📋', ORDER_STATUS: '🔔', SYSTEM: 'ℹ️',
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return 'Hozirgina';
  if (diff < 3600)  return Math.floor(diff / 60) + ' daqiqa oldin';
  if (diff < 86400) return Math.floor(diff / 3600) + ' soat oldin';
  return new Date(date).toLocaleDateString('uz-UZ');
}

// ─── GLASS STYLES ─────────────────────────────────────────
// Light mode: oq shaffof pill
// Dark mode: qora shaffof pill — orqa fonning suyuq animatsiyasi ko'rinadi
const pillStyle = (isDark, scrolled) => ({
  background: isDark
    ? 'rgba(10, 10, 12, 0.55)'
    : 'rgba(255, 255, 255, 0.55)',
  backdropFilter: 'blur(32px) saturate(200%)',
  WebkitBackdropFilter: 'blur(32px) saturate(200%)',
  border: isDark
    ? '1px solid rgba(255, 255, 255, 0.10)'
    : '1px solid rgba(255, 255, 255, 0.75)',
  boxShadow: isDark
    ? '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 8px 32px rgba(244,63,94,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
  transform: scrolled ? 'translateY(0px)' : 'translateY(0px)',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
});

// Dropdown panel
const dropdownStyle = (isDark) => ({
  background: isDark
    ? 'rgba(25, 0, 35, 0.80)'
    : 'rgba(255, 255, 255, 0.58)',
  backdropFilter: 'blur(36px) saturate(200%)',
  WebkitBackdropFilter: 'blur(36px) saturate(200%)',
  border: isDark
    ? '1px solid rgba(180, 60, 160, 0.25)'
    : '1px solid rgba(255,255,255,0.72)',
  boxShadow: isDark
    ? '0 16px 48px rgba(0,0,0,0.65), 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)'
    : '0 16px 48px rgba(244,63,94,0.10), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
});

// ─── NOTIFICATION BELL ────────────────────────────────────
function NotificationBell({ user, isDark }) {
  const [open,   setOpen]   = useState(false);
  const [items,  setItems]  = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const fetchNotifs = () => {
    api.get('/notifications')
      .then(r => { setItems(r.data.data); setUnread(r.data.unread); })
      .catch(() => {});
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifs();
    const id = setInterval(fetchNotifs, 30000);
    return () => clearInterval(id);
  }, [user]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const markAll = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setItems(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const markOne = async (id) => {
    await api.put('/notifications/' + id + '/read').catch(() => {});
    setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  if (!user) return null;

  const iconColor = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(60,60,80,0.75)';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative flex items-center justify-center transition-all duration-200"
        style={{
          width: 34, height: 34, borderRadius: 12,
          color: iconColor,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Bell style={{ width: 16, height: 16 }} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 w-80 rounded-2xl overflow-hidden z-[60]"
          style={dropdownStyle(isDark)}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>
            <span className="font-semibold text-sm" style={{ color: isDark ? '#fff' : '#111' }}>
              Bildirishnomalar
            </span>
            {unread > 0 && (
              <button onClick={markAll} className="text-xs text-rose-500 hover:text-rose-400 font-medium">
                Barchasini o'qildi
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 text-center text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Bildirishnomalar yo'q
              </div>
            ) : items.map(n => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markOne(n.id)}
                className="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.04)',
                  background: n.isRead ? 'transparent' : (isDark ? 'rgba(244,63,94,0.06)' : 'rgba(244,63,94,0.04)'),
                }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${NOTIF_COLORS[n.type] || ''}`}>
                  {NOTIF_EMOJI[n.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: isDark ? (n.isRead ? 'rgba(255,255,255,0.5)' : '#fff') : (n.isRead ? 'rgba(0,0,0,0.5)' : '#111') }}>
                    {n.title}
                  </p>
                  <p className="text-xs mt-0.5 line-clamp-2" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)' }}>
                    {n.body}
                  </p>
                  <p className="text-xs mt-1" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)' }}>
                    {timeAgo(n.createdAt)}
                  </p>
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

// ─── ICON BUTTON ──────────────────────────────────────────
function IconBtn({ onClick, title, children, isDark }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        width: 34, height: 34, borderRadius: 12,
        color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(60,60,80,0.75)',
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {children}
    </button>
  );
}

// ─── MAIN NAVBAR ──────────────────────────────────────────
export default function Navbar() {
  const { t, i18n }               = useTranslation();
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggle, isDark } = useTheme();
  const navigate                  = useNavigate();
  const location                  = useLocation();

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [langOpen,  setLangOpen]  = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);

  // Scroll listener — pill birozgina kichrayadi
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Route o'zgarganda mobil menyuni yopamiz
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('mm_lang', code);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserOpen(false);
  };

  const closeAll    = () => { setLangOpen(false); setUserOpen(false); };
  const currentLang = LANGS.find(l => l.code === i18n.language) || LANGS[0];

  const navLinks = [
    { to: '/',          label: t('nav.home'),      end: true },
    { to: '/services',  label: t('nav.services')          },
    { to: '/portfolio', label: t('nav.portfolio')         },
    { to: '/contact',   label: t('nav.contact')           },
  ];

  const textColor     = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(40,30,50,0.80)';
  const activeColor   = isDark ? '#fff' : '#111';
  const activeBg      = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)';
  const hoverBg       = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';

  return (
    <>
      {/* Overlay — dropdown'lar açıq bo'lganda */}
      {(langOpen || userOpen) && (
        <div className="fixed inset-0 z-40" onClick={closeAll} />
      )}

      {/* Floating pill wrapper — sticky, markazda */}
      <div
        className="sticky top-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: scrolled ? 10 : 14, paddingLeft: 16, paddingRight: 16, transition: 'padding 0.4s ease' }}
      >
        {/* ── PILL NAVBAR ─────────────────────────────────── */}
        <div
          className="pointer-events-auto w-full flex items-center gap-2 px-3"
          style={{
            ...pillStyle(isDark, scrolled),
            maxWidth: scrolled ? 860 : 900,
            height: scrolled ? 52 : 58,
            borderRadius: scrolled ? 18 : 22,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            style={{ marginRight: 4 }}
          >
            <div className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{
                width: 32, height: 32, borderRadius: 11,
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                boxShadow: '0 2px 12px rgba(244,63,94,0.45)',
              }}>
              <Heart style={{ width: 14, height: 14, fill: 'white', color: 'white' }} />
            </div>
            <span className="text-base font-bold tracking-tight hidden sm:block"
              style={{ color: isDark ? '#fff' : '#111', letterSpacing: '-0.3px' }}>
              Marry<span style={{ color: '#f43f5e' }}>Me</span>
            </span>
          </Link>

          {/* Thin divider */}
          <div style={{ width: 1, height: 20, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', flexShrink: 0 }} />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className="transition-all duration-200 font-medium text-sm whitespace-nowrap"
                style={({ isActive }) => ({
                  padding: '6px 11px',
                  borderRadius: 12,
                  color:      isActive ? activeColor : textColor,
                  background: isActive ? activeBg    : 'transparent',
                  boxShadow:  isActive
                    ? (isDark ? 'inset 0 1px 0 rgba(255,255,255,0.12)' : '0 1px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)')
                    : 'none',
                })}
                onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = hoverBg; }}
                onMouseLeave={e => { e.currentTarget.style.background = e.currentTarget.getAttribute('aria-current') ? activeBg : 'transparent'; }}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1 hidden md:block" />

          {/* Right actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">

            {/* Notification Bell */}
            <NotificationBell user={user} isDark={isDark} />

            {/* Theme toggle */}
            <IconBtn onClick={toggle} title={isDark ? 'Light mode' : 'Dark mode'} isDark={isDark}>
              {isDark
                ? <Sun style={{ width: 16, height: 16 }} />
                : <Moon style={{ width: 16, height: 16 }} />
              }
            </IconBtn>

            {/* Language selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => { setLangOpen(o => !o); setUserOpen(false); }}
                className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  height: 34, padding: '0 10px', borderRadius: 12,
                  color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(60,60,80,0.75)',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                }}
              >
                <span style={{ fontSize: 14 }}>{currentLang.flag}</span>
                <span>{currentLang.code.toUpperCase()}</span>
                <ChevronDown style={{ width: 12, height: 12, opacity: 0.6 }} />
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-11 py-1.5 rounded-2xl z-[60] min-w-[150px] overflow-hidden"
                  style={dropdownStyle(isDark)}
                >
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => changeLang(l.code)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-all"
                      style={{
                        color: l.code === i18n.language
                          ? '#f43f5e'
                          : (isDark ? 'rgba(255,255,255,0.75)' : 'rgba(40,30,50,0.85)'),
                        background: l.code === i18n.language
                          ? (isDark ? 'rgba(244,63,94,0.12)' : 'rgba(244,63,94,0.06)')
                          : 'transparent',
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thin divider */}
            <div style={{ width: 1, height: 20, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', flexShrink: 0 }} />

            {/* User menu / Auth buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setUserOpen(o => !o); setLangOpen(false); }}
                  className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    height: 34, padding: '0 8px 0 4px', borderRadius: 14,
                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                    border: isDark ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 overflow-hidden"
                    style={{ width: 26, height: 26, borderRadius: 9, background: 'linear-gradient(135deg,#f43f5e,#ec4899)' }}>
                    {user.profile?.avatar ? (
                      <img src={user.profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                        {(user.profile?.firstName?.[0] ?? 'U').toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold max-w-[70px] truncate"
                    style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(40,30,50,0.85)' }}>
                    {user.profile?.firstName ?? user.email.split('@')[0]}
                  </span>
                  <ChevronDown style={{ width: 12, height: 12, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)' }} />
                </button>

                {userOpen && (
                  <div
                    className="absolute right-0 top-11 py-1.5 rounded-2xl z-[60] min-w-[190px] overflow-hidden"
                    style={dropdownStyle(isDark)}
                  >
                    <div className="px-4 py-2.5" style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)' }}>
                      <p className="text-sm font-semibold truncate" style={{ color: isDark ? '#fff' : '#111' }}>
                        {user.profile?.firstName} {user.profile?.lastName}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                        {user.email}
                      </p>
                    </div>

                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all"
                        style={{ color: '#a855f7' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(168,85,247,0.1)' : 'rgba(168,85,247,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Shield style={{ width: 15, height: 15 }} /> Admin panel
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all"
                      style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(40,30,50,0.85)' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LayoutDashboard style={{ width: 15, height: 15 }} /> {t('nav.dashboard')}
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all"
                      style={{ color: '#f43f5e' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut style={{ width: 15, height: 15 }} /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="hidden sm:flex items-center text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    height: 34, padding: '0 12px', borderRadius: 12,
                    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(40,30,50,0.75)',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="flex items-center text-xs font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                  style={{
                    height: 34, padding: '0 14px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                    boxShadow: '0 4px 16px rgba(244,63,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex items-center justify-center transition-all"
              style={{
                width: 34, height: 34, borderRadius: 12,
                color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(60,60,80,0.75)',
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              }}
            >
              {menuOpen ? <X style={{ width: 16, height: 16 }} /> : <Menu style={{ width: 16, height: 16 }} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ─────────────────────────────────── */}
        {menuOpen && (
          <div
            className="pointer-events-auto absolute top-full left-4 right-4 mt-2 rounded-2xl overflow-hidden z-[60] py-2"
            style={dropdownStyle(isDark)}
          >
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-5 py-3 text-sm font-medium transition-all"
                style={({ isActive }) => ({
                  color: isActive ? '#f43f5e' : (isDark ? 'rgba(255,255,255,0.75)' : 'rgba(40,30,50,0.85)'),
                  background: isActive ? (isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.06)') : 'transparent',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', margin: '4px 0' }} />

            {/* Language in mobile */}
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { changeLang(l.code); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm transition-all"
                style={{
                  color: l.code === i18n.language
                    ? '#f43f5e'
                    : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(40,30,50,0.7)'),
                  background: l.code === i18n.language
                    ? (isDark ? 'rgba(244,63,94,0.1)' : 'rgba(244,63,94,0.05)')
                    : 'transparent',
                }}
              >
                <span style={{ fontSize: 18 }}>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
