import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';
import { ArrowRight, Star, Heart, Quote, ChevronRight } from 'lucide-react';

const CATEGORY_ICONS = {
  WEDDING: '💍', LOVE_STORY: '📸', PROPOSAL: '💌',
  BIRTHDAY: '🎂', ANNIVERSARY: '🥂', HENNA_NIGHT: '🌸', CORPORATE: '🏢',
};

const CATEGORY_GRADIENTS = {
  WEDDING: 'from-rose-400 to-pink-500',
  LOVE_STORY: 'from-amber-400 to-orange-500',
  PROPOSAL: 'from-purple-400 to-pink-500',
  BIRTHDAY: 'from-blue-400 to-indigo-500',
  ANNIVERSARY: 'from-teal-400 to-emerald-500',
  HENNA_NIGHT: 'from-pink-400 to-rose-500',
  CORPORATE: 'from-slate-400 to-gray-500',
};

function formatPrice(p) { return new Intl.NumberFormat('uz-UZ').format(p); }

// ─── REVIEWS DATA (static + from API) ─────────────────────
const STATIC_REVIEWS = [
  { id: 1, name: 'Aziza Karimova', city: 'Toshkent', rating: 5, avatar: 'AK', color: 'from-rose-400 to-pink-500', comment: "To'yimiz hayotimizning eng yaxshi kuni bo'ldi! MarryMe jamoasi professional va g'amxo'r. Har bir tafsilotga e'tibor berishdi. Rahmat!" },
  { id: 2, name: 'Sardor Toshmatov', city: 'Samarkand', rating: 5, avatar: 'ST', color: 'from-blue-400 to-indigo-500', comment: "Love Story fotosessiyamiz juda chiroyli chiqdi. Registon fonida olgan suratlarimiz umr bo'yi esimizda qoladi. Super xizmat!" },
  { id: 3, name: 'Nilufar Yusupova', city: 'Buxoro', rating: 5, avatar: 'NY', color: 'from-purple-400 to-pink-500', comment: "Surprise proposal marosimini shunday beautifully tashkil qilishdi! Erim yig'lab yubordi, men ham. Professional va mehribon jamoa!" },
  { id: 4, name: 'Jasur Rahimov', city: 'Namangan', rating: 5, avatar: 'JR', color: 'from-amber-400 to-orange-500', comment: "Qizimning tug'ilgan kunini super o'tkazib berishdi. Bolalar juda xursand bo'ldi. Dekoratsiya zo'r, animatorlar professional!" },
  { id: 5, name: 'Malika Ergasheva', city: 'Farg\'ona', rating: 5, avatar: 'ME', color: 'from-teal-400 to-emerald-500', comment: "Nikoh yilligimizni nishonlash uchun MarryMe ni tanladik. Kutganimizdan ham yaxshi bo'ldi. Albatta yana murojaat qilamiz!" },
  { id: 6, name: 'Doniyor Mirzaev', city: 'Toshkent', rating: 5, avatar: 'DM', color: 'from-rose-400 to-red-500', comment: "Platinum paket oldik — hech narsa haqida o'ylamasdan dam oldik. Hamma narsani o'zlari hal qilishdi. Tavsiya qilaman!" },
];

// ─── REVIEWS TICKER ────────────────────────────────────────
function ReviewsTicker() {
  const doubled = [...STATIC_REVIEWS, ...STATIC_REVIEWS];

  return (
    <div className="w-full overflow-hidden py-2">
      <div className="flex gap-5 animate-ticker">
        {doubled.map((review, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-80 bg-white rounded-2xl p-5 shadow-sm border border-rose-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {review.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{review.name}</p>
                <p className="text-xs text-gray-400">{review.city}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="relative">
              <Quote className="w-4 h-4 text-rose-200 absolute -top-1 -left-1" />
              <p className="text-xs text-gray-600 leading-relaxed pl-3 line-clamp-3">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────
function ServiceCard({ service }) {
  const { t } = useTranslation();
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
    >
      <div className={`h-36 bg-gradient-to-br ${CATEGORY_GRADIENTS[service.category] || 'from-rose-400 to-pink-500'} flex items-center justify-center`}>
        <span className="text-5xl">{CATEGORY_ICONS[service.category] || '✨'}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-rose-500 transition-colors">{service.name}</h3>
          {service.avgRating && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-amber-600">{service.avgRating}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400">{t('services.from')} </span>
            <span className="text-sm font-bold text-gray-900">{formatPrice(service.basePrice)}</span>
            <span className="text-xs text-gray-400"> {t('common.currency')}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-rose-50 group-hover:bg-rose-400 flex items-center justify-center transition-all">
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────
export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get(`/services?lang=${i18n.language.toUpperCase()}`)
      .then(res => setServices(res.data.data.slice(0, 4)))
      .catch(() => {});
  }, [i18n.language]);

  const stats = [
    { value: '500+', label: i18n.language === 'uz' ? 'Mamnun juft' : i18n.language === 'ru' ? 'Пар' : 'Couples' },
    { value: '6+', label: i18n.language === 'uz' ? 'Yil tajriba' : i18n.language === 'ru' ? 'Лет опыта' : 'Years' },
    { value: '15', label: i18n.language === 'uz' ? 'Mutaxassis' : i18n.language === 'ru' ? 'Мастеров' : 'Experts' },
    { value: '4.9', label: i18n.language === 'uz' ? 'Reyting' : i18n.language === 'ru' ? 'Рейтинг' : 'Rating' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50/50 to-amber-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <div className="absolute top-20 right-20 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-40 w-56 h-56 bg-amber-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-40 h-40 bg-pink-200/40 rounded-full blur-2xl" />
        </div>

        {/* Floating cards deco */}
        <div className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 hidden md:grid grid-cols-2 gap-3 w-72">
          {[
            { icon: '💍', label: "To'y", gradient: 'from-rose-400 to-pink-500' },
            { icon: '📸', label: 'Love Story', gradient: 'from-amber-400 to-orange-500' },
            { icon: '💌', label: 'Proposal', gradient: 'from-purple-400 to-pink-500' },
            { icon: '🎂', label: "Tug'ilgan kun", gradient: 'from-blue-400 to-indigo-500' },
          ].map((item, i) => (
            <div key={i} className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-5 text-center shadow-lg transform ${i % 2 === 1 ? 'translate-y-4' : ''}`}>
              <span className="text-3xl block mb-1">{item.icon}</span>
              <span className="text-white text-xs font-medium">{item.label}</span>
            </div>
          ))}
          {/* Rating badge */}
          <div className="col-span-2 bg-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3 border border-rose-100">
            <div className="flex -space-x-2">
              {['AK', 'ST', 'NY'].map((initials, j) => (
                <div key={j} className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                  {initials[0]}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-xs text-gray-500">500+ sharh</p>
            </div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-xs font-semibold px-4 py-2 rounded-full mb-7">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>O'zbekiston №1 Wedding Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
              {t('hero.title')}<br />
              <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
                {t('hero.titleAccent')}
              </span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-9 max-w-md">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-7 py-3.5 rounded-2xl font-semibold transition-all shadow-lg shadow-rose-200/60 hover:shadow-rose-300/60 hover:-translate-y-0.5">
                {t('hero.cta')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/portfolio"
                className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-rose-300 text-gray-700 hover:text-rose-500 px-7 py-3.5 rounded-2xl font-semibold transition-all hover:bg-rose-50/50">
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100/80">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-1">
                {s.value}
              </div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-rose-500 text-sm font-semibold mb-2 tracking-wide uppercase">Xizmatlar</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('services.title')}</h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 font-medium">
              {t('common.seeAll')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.length > 0 ? services.map(service => (
              <ServiceCard key={service.id} service={service} />
            )) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-36 bg-gray-100" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/services" className="inline-flex items-center gap-2 text-rose-500 font-medium">
              {t('common.seeAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS TICKER ───────────────────────────────── */}
      <section className="py-16 bg-gradient-to-b from-rose-50/30 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-10 text-center">
          <p className="text-rose-500 text-sm font-semibold mb-2 tracking-wide uppercase">Mijozlar fikri</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {i18n.language === 'uz' ? "Ular nima deyishdi?" :
             i18n.language === 'ru' ? "Что говорят клиенты?" : "What they say"}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-gray-500 text-sm ml-2">4.9 / 5.0 · 500+ sharh</span>
          </div>
        </div>
        <ReviewsTicker />
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="text-4xl mb-4">💍</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {i18n.language === 'uz' ? 'Bayramingizni rejalashtiramizmi?' :
               i18n.language === 'ru' ? 'Планируете праздник?' : 'Plan your special day?'}
            </h2>
            <p className="text-rose-100 mb-8 text-lg">
              {i18n.language === 'uz' ? 'Bepul konsultatsiya uchun hozir bog\'laning' :
               i18n.language === 'ru' ? 'Свяжитесь для бесплатной консультации' : 'Contact us for a free consultation'}
            </p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 bg-white text-rose-500 hover:bg-rose-50 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-0.5">
              {t('hero.cta')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
