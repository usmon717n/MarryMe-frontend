import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Heart, Phone, Mail, MapPin, Clock, Instagram, Send, ArrowRight } from 'lucide-react';

export default function Footer() {
  const { t }    = useTranslation();
  const { isDark } = useTheme();
  const year     = new Date().getFullYear();

  const footerBg = isDark
    ? 'rgba(12, 6, 14, 0.72)'
    : 'rgba(255, 235, 242, 0.65)';
  const borderTop = isDark
    ? 'rgba(244,63,94,0.18)'
    : 'rgba(244,63,94,0.20)';
  const headingColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(60,20,40,0.9)';
  const textColor    = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(100,40,60,0.55)';
  const iconBg       = isDark ? 'rgba(244,63,94,0.10)' : 'rgba(244,63,94,0.08)';
  const iconBorder   = isDark ? 'rgba(244,63,94,0.18)' : 'rgba(244,63,94,0.15)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(244,63,94,0.12)';
  const socialBg     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(244,63,94,0.07)';
  const socialBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(244,63,94,0.15)';

  return (
    <footer style={{
      background: footerBg,
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderTop: '1px solid ' + borderTop,
    }}>
      {/* Top accent line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, #f43f5e, #ec4899, #a855f7, #ec4899, #f43f5e)', backgroundSize: '200% 100%' }} />

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#f43f5e,#ec4899)', boxShadow: '0 4px 16px rgba(244,63,94,0.35)' }}>
                <Heart className="fill-white text-white" style={{ width: 16, height: 16 }} />
              </div>
              <span className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#2d0a1a' }}>
                Marry<span style={{ color: '#f43f5e' }}>Me</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: textColor }}>
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/marryme.uz" target="_blank" rel="noreferrer"
                className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ width: 40, height: 40, borderRadius: 12, background: socialBg, border: '1px solid ' + socialBorder, color: textColor }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#f43f5e,#ec4899)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.border = 'none'; }}
                onMouseLeave={e => { e.currentTarget.style.background = socialBg; e.currentTarget.style.color = textColor; e.currentTarget.style.border = '1px solid ' + socialBorder; }}
              >
                <Instagram style={{ width: 16, height: 16 }} />
              </a>
              <a href="https://t.me/marryme_uz" target="_blank" rel="noreferrer"
                className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ width: 40, height: 40, borderRadius: 12, background: socialBg, border: '1px solid ' + socialBorder, color: textColor }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#38bdf8,#3b82f6)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.border = 'none'; }}
                onMouseLeave={e => { e.currentTarget.style.background = socialBg; e.currentTarget.style.color = textColor; e.currentTarget.style.border = '1px solid ' + socialBorder; }}
              >
                <Send style={{ width: 16, height: 16 }} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-5 text-sm" style={{ color: headingColor }}>{t('footer.links')}</h4>
            <ul className="space-y-3">
              {[
                { to: '/',          label: t('nav.home') },
                { to: '/services',  label: t('nav.services') },
                { to: '/portfolio', label: t('nav.portfolio') },
                { to: '/contact',   label: t('nav.contact') },
                { to: '/login',     label: t('nav.login') },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-sm flex items-center gap-1.5 group transition-colors"
                    style={{ color: textColor }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
                    onMouseLeave={e => e.currentTarget.style.color = textColor}
                  >
                    <ArrowRight style={{ width: 12, height: 12, opacity: 0, marginLeft: -14, transition: 'all .2s' }}
                      className="group-hover:opacity-100 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-5 text-sm" style={{ color: headingColor }}>{t('nav.contact')}</h4>
            <ul className="space-y-4">
              {[
                { icon: Phone,  text: '+998 90 123 45 67', href: 'tel:+998901234567' },
                { icon: Mail,   text: 'hello@marryme.uz',  href: 'mailto:hello@marryme.uz' },
                { icon: MapPin, text: t('contact.address'), href: '#' },
                { icon: Clock,  text: t('contact.workHours'), href: '#' },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a href={href}
                    className="flex items-start gap-2.5 text-sm transition-colors group"
                    style={{ color: textColor }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
                    onMouseLeave={e => e.currentTarget.style.color = textColor}
                  >
                    <div className="flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                      style={{ width: 28, height: 28, borderRadius: 9, background: iconBg, border: '1px solid ' + iconBorder }}>
                      <Icon style={{ width: 13, height: 13 }} />
                    </div>
                    <span className="leading-snug">{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-7 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid ' + dividerColor }}>
          <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(100,40,60,0.35)' }}>
            © {year} MarryMe.uz — {t('footer.rights')}
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(100,40,60,0.35)' }}>
            Made with
            <Heart className="fill-rose-400 text-rose-400" style={{ width: 12, height: 12 }} />
            in Tashkent, Uzbekistan
          </p>
        </div>
      </div>
    </footer>
  );
}
