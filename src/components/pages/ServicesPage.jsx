import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import { Star, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  WEDDING:     '💍',
  LOVE_STORY:  '📸',
  PROPOSAL:    '💌',
  BIRTHDAY:    '🎂',
  ANNIVERSARY: '🥂',
  HENNA_NIGHT: '🌸',
  CORPORATE:   '🏢',
  CUSTOM:      '✨',
};

const CATEGORY_GRADIENTS = {
  WEDDING:     'from-rose-400 to-pink-500',
  LOVE_STORY:  'from-amber-400 to-orange-500',
  PROPOSAL:    'from-purple-400 to-pink-500',
  BIRTHDAY:    'from-blue-400 to-indigo-500',
  ANNIVERSARY: 'from-teal-400 to-emerald-500',
  HENNA_NIGHT: 'from-pink-400 to-rose-500',
  CORPORATE:   'from-slate-400 to-gray-500',
  CUSTOM:      'from-violet-400 to-purple-500',
};

function formatPrice(p) { return new Intl.NumberFormat('uz-UZ').format(p); }

function ServiceCard({ service }) {
  const { t } = useTranslation();
  const hasCover = Boolean(service.coverImage);
  const gradient = CATEGORY_GRADIENTS[service.category] || 'from-rose-400 to-pink-500';
  const icon     = CATEGORY_ICONS[service.category] || '✨';

  return (
    <Link
      to={'/services/' + service.slug}
      className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-gray-900 transition-all hover:-translate-y-1"
    >
      <div className="h-44 overflow-hidden relative">
        {hasCover ? (
          <img
            src={service.coverImage}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={'h-full bg-gradient-to-br ' + gradient + ' flex items-center justify-center text-6xl'}>
            {icon}
          </div>
        )}
        {service.customCategory && (
          <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full">
            {service.customCategory}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors">
            {service.name}
          </h3>
          {service.avgRating > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />{service.avgRating}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {t('services.from')} {formatPrice(service.basePrice)} {t('common.currency')}
          </span>
          <span className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/20 group-hover:bg-rose-400 flex items-center justify-center transition-all">
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  const [services,   setServices]   = useState([]);
  const [categories, setCategories] = useState(['ALL']);
  const [filter,     setFilter]     = useState('ALL');
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ lang: i18n.language.toUpperCase() });
    if (filter !== 'ALL') params.append('category', filter);
    api.get('/services?' + params)
      .then(r => {
        const data = r.data.data;
        setServices(data);
        // Build dynamic category list from actual services
        const cats = ['ALL', ...new Set(data.map(s => s.category))];
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, i18n.language]);

  const getCatLabel = (cat) => {
    if (cat === 'ALL') {
      return i18n.language === 'uz' ? 'Barchasi' : i18n.language === 'ru' ? 'Все' : 'All';
    }
    if (cat === 'CUSTOM') return '✨ ' + (i18n.language === 'uz' ? 'Boshqa' : i18n.language === 'ru' ? 'Другое' : 'Other');
    const icon = CATEGORY_ICONS[cat] || '✨';
    const key  = 'categories.' + cat;
    const tr   = t(key);
    return icon + ' ' + (tr === key ? cat : tr);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10 anim-fade-up">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t('services.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {t('services.subtitle')}
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={'px-4 py-2 rounded-xl text-sm font-medium transition-all ' + (
              filter === cat
                ? 'bg-rose-400 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 dark:hover:text-rose-400'
            )}
          >
            {getCatLabel(cat)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>{i18n.language === 'uz' ? 'Xizmatlar topilmadi' : i18n.language === 'ru' ? 'Услуги не найдены' : 'No services found'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
