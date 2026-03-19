// ServicesPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import { Star, ArrowRight } from 'lucide-react';

const CATEGORIES = ['ALL', 'WEDDING', 'LOVE_STORY', 'PROPOSAL', 'BIRTHDAY', 'ANNIVERSARY', 'HENNA_NIGHT'];
const ICONS = { WEDDING: '💍', LOVE_STORY: '📸', PROPOSAL: '💌', BIRTHDAY: '🎂', ANNIVERSARY: '🥂', HENNA_NIGHT: '🌸', CORPORATE: '🏢' };

function formatPrice(p) { return new Intl.NumberFormat('uz-UZ').format(p); }

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ lang: i18n.language.toUpperCase() });
    if (filter !== 'ALL') params.append('category', filter);
    api.get(`/services?${params}`)
      .then(r => setServices(r.data.data))
      .finally(() => setLoading(false));
  }, [filter, i18n.language]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('services.title')}</h1>
        <p className="text-gray-500 max-w-xl mx-auto">{t('services.subtitle')}</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-rose-400 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
            }`}
          >
            {cat === 'ALL' ? (i18n.language === 'uz' ? 'Barchasi' : i18n.language === 'ru' ? 'Все' : 'All') : (ICONS[cat] + ' ' + t(`categories.${cat}`))}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Link
              key={service.id}
              to={`/services/${service.slug}`}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="h-44 bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center text-6xl">
                {ICONS[service.category] || '✨'}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-rose-500 transition-colors">{service.name}</h3>
                  {service.avgRating && (
                    <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded-lg ml-2">
                      <Star className="w-3 h-3 fill-amber-400" />{service.avgRating}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">
                    {t('services.from')} {formatPrice(service.basePrice)} {t('common.currency')}
                  </span>
                  <span className="text-rose-400 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
