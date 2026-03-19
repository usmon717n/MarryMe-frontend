import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Phone, Mail, MapPin, Clock, Instagram, Send, ArrowRight } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Top gradient line */}
      <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400" />

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-900/30">
                <Heart className="w-4.5 h-4.5 fill-white text-white" />
              </div>
              <span className="text-xl font-bold text-white">Marry<span className="text-rose-400">Me</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/marryme.uz" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-gradient-to-br hover:from-rose-400 hover:to-pink-500 flex items-center justify-center transition-all duration-200 border border-gray-800 hover:border-transparent">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://t.me/marryme_uz" target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-500 flex items-center justify-center transition-all duration-200 border border-gray-800 hover:border-transparent">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm">{t('footer.links')}</h4>
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
                    className="text-sm text-gray-500 hover:text-rose-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm">{t('nav.contact')}</h4>
            <ul className="space-y-4">
              {[
                { icon: Phone, text: '+998 90 123 45 67', href: 'tel:+998901234567' },
                { icon: Mail,  text: 'hello@marryme.uz',  href: 'mailto:hello@marryme.uz' },
                { icon: MapPin, text: t('contact.address'), href: '#' },
                { icon: Clock,  text: t('contact.workHours'), href: '#' },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a href={href}
                    className="flex items-start gap-2.5 text-sm text-gray-500 hover:text-rose-400 transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-gray-900 border border-gray-800 group-hover:border-rose-800 group-hover:bg-rose-950 flex items-center justify-center flex-shrink-0 transition-all mt-0.5">
                      <Icon className="w-3.5 h-3.5 group-hover:text-rose-400 transition-colors" />
                    </div>
                    <span className="leading-snug">{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-900 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} MarryMe.uz — {t('footer.rights')}
          </p>
          <p className="text-xs text-gray-700 flex items-center gap-1.5">
            Made with
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            in Tashkent, Uzbekistan
          </p>
        </div>
      </div>
    </footer>
  );
}
