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
  WEDDING:     'from-rose-400 to-pink-500',
  LOVE_STORY:  'from-amber-400 to-orange-500',
  PROPOSAL:    'from-purple-400 to-pink-500',
  BIRTHDAY:    'from-blue-400 to-indigo-500',
  ANNIVERSARY: 'from-teal-400 to-emerald-500',
  HENNA_NIGHT: 'from-pink-400 to-rose-500',
  CORPORATE:   'from-slate-400 to-gray-500',
};

function formatPrice(p) { return new Intl.NumberFormat('uz-UZ').format(p); }


// ─── SATURN RINGS 3D ──────────────────────────────────────
function SaturnRings() {
  const ORBIT_ITEMS = [
    { emoji: '💍', bg: 'bg-rose-500',    anim: 'animate-orbit-1', size: 'w-11 h-11' },
    { emoji: '📸', bg: 'bg-pink-500',    anim: 'animate-orbit-2', size: 'w-10 h-10' },
    { emoji: '🎉', bg: 'bg-purple-500',  anim: 'animate-orbit-3', size: 'w-11 h-11' },
  ];

  const SPARKLES = [
    { pos: 'top-8 left-10',    anim: 'animate-sparkle',   size: 'text-xl' },
    { pos: 'top-12 right-8',   anim: 'animate-sparkle-2', size: 'text-base' },
    { pos: 'bottom-16 left-8', anim: 'animate-sparkle-3', size: 'text-sm' },
    { pos: 'bottom-12 right-6',anim: 'animate-sparkle-4', size: 'text-xl' },
    { pos: 'top-1/3 left-4',   anim: 'animate-sparkle-5', size: 'text-xs' },
    { pos: 'top-1/3 right-3',  anim: 'animate-sparkle-6', size: 'text-base' },
    { pos: 'top-6 left-1/2',   anim: 'animate-sparkle',   size: 'text-sm' },
  ];

  const FLOAT_CARDS = [
    {
      emoji: '💍', label: "To'y",        sub: '15+ paket',
      gradient: 'from-rose-400 to-pink-500',
      pos: '-top-6 -left-4 md:left-2',
      anim: 'animate-float-up-1',
    },
    {
      emoji: '📸', label: 'Love Story',  sub: '4K videografi',
      gradient: 'from-amber-400 to-orange-500',
      pos: 'top-8 -right-4 md:right-2',
      anim: 'animate-float-up-2',
    },
    {
      emoji: '🎂', label: "Tug'ilgan kun", sub: 'Kreativ dastur',
      gradient: 'from-blue-400 to-indigo-500',
      pos: '-bottom-6 -left-2 md:left-4',
      anim: 'animate-float-up-3',
    },
  ];

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center select-none">

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <span key={i} className={`absolute ${s.pos} ${s.anim} ${s.size} pointer-events-none`}>✨</span>
      ))}

      {/* Ring 1 — outermost, slowest */}
      <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full"
        style={{ border: '22px solid rgba(252,231,243,0.55)', transform: 'rotateX(72deg) rotateZ(-15deg)' }}>
        <div className="absolute inset-0 rounded-full animate-spin-slow"
          style={{ border: '1px dashed rgba(244,114,182,0.4)' }} />
      </div>

      {/* Ring 2 — medium */}
      <div className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full"
        style={{ border: '16px solid rgba(251,207,232,0.45)', transform: 'rotateX(72deg) rotateZ(20deg)' }}>
        <div className="absolute inset-0 rounded-full animate-spin-med"
          style={{ border: '1px dashed rgba(236,72,153,0.35)' }} />
      </div>

      {/* Ring 3 — innermost, fastest */}
      <div className="absolute w-40 h-40 md:w-48 md:h-48 rounded-full"
        style={{ border: '10px solid rgba(249,168,212,0.4)', transform: 'rotateX(72deg) rotateZ(55deg)' }}>
        <div className="absolute inset-0 rounded-full animate-spin-fast"
          style={{ border: '1px dashed rgba(244,63,94,0.3)' }} />
      </div>

      {/* Glowing aura */}
      <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(236,72,153,0.08) 50%, transparent 70%)' }} />

      {/* Orbiting icon nodes */}
      {ORBIT_ITEMS.map((item, i) => (
        <div key={i} className={`absolute ${item.anim}`}
          style={{ transformOrigin: 'center center' }}>
          <div className={`${item.size} ${item.bg} rounded-2xl flex items-center justify-center shadow-lg`}
            style={{ boxShadow: '0 4px 20px rgba(244,63,94,0.4)' }}>
            <span className="text-xl">{item.emoji}</span>
          </div>
        </div>
      ))}

      {/* Center core */}
      <div className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-white flex items-center justify-center"
        style={{
          boxShadow: '0 0 0 3px rgba(252,231,243,1), 0 0 0 6px rgba(251,207,232,0.6), 0 8px 32px rgba(244,63,94,0.2)',
        }}>
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
          <span className="text-5xl md:text-6xl animate-heartbeat">💍</span>
        </div>
      </div>

      {/* Floating mini cards */}
      {FLOAT_CARDS.map((card, i) => (
        <div key={i}
          className={`absolute ${card.pos} ${card.anim} z-20 flex items-center gap-2.5 bg-white rounded-2xl px-3 py-2.5 shadow-xl`}
          style={{ border: '1px solid rgba(252,231,243,0.8)', minWidth: '130px' }}>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-lg">{card.emoji}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800 leading-tight">{card.label}</p>
            <p className="text-xs text-gray-400">{card.sub}</p>
          </div>
        </div>
      ))}

      {/* Rating badge */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20
        flex items-center gap-2.5 bg-white rounded-2xl px-4 py-2.5 shadow-xl animate-float-up-2 whitespace-nowrap"
        style={{ border: '1px solid rgba(252,231,243,0.8)' }}>
        <div className="flex -space-x-1.5">
          {['AK','ST','NY'].map((init, j) => (
            <div key={j} className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
              {init[0]}
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex gap-0.5">
            {Array.from({length:5}).map((_,k) => <Star key={k} className="w-3 h-3 fill-amber-400 text-amber-400"/>)}
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">500+ mamnun juft</p>
        </div>
      </div>
    </div>
  );
}

// ─── REVIEWS ──────────────────────────────────────────────
const STATIC_REVIEWS = [
  { id:1, name:'Aziza Karimova',   city:'Toshkent',  rating:5, avatar:'AK', color:'from-rose-400 to-pink-500',    comment:"To'yimiz hayotimizning eng yaxshi kuni bo'ldi! MarryMe jamoasi professional va g'amxo'r. Har bir tafsilotga e'tibor berishdi. Rahmat!" },
  { id:2, name:'Sardor Toshmatov', city:'Samarqand', rating:5, avatar:'ST', color:'from-blue-400 to-indigo-500',  comment:"Love Story fotosessiyamiz juda chiroyli chiqdi. Registon fonida olgan suratlarimiz umr bo'yi esimizda qoladi. Super xizmat!" },
  { id:3, name:'Nilufar Yusupova', city:'Buxoro',    rating:5, avatar:'NY', color:'from-purple-400 to-pink-500',  comment:"Surprise proposal marosimini shunday beautifully tashkil qilishdi! Erim yig'lab yubordi, men ham. Professional va mehribon jamoa!" },
  { id:4, name:'Jasur Rahimov',    city:'Namangan',  rating:5, avatar:'JR', color:'from-amber-400 to-orange-500', comment:"Qizimning tug'ilgan kunini super o'tkazib berishdi. Bolalar juda xursand bo'ldi. Dekoratsiya zo'r, animatorlar professional!" },
  { id:5, name:'Malika Ergasheva', city:"Farg'ona",  rating:5, avatar:'ME', color:'from-teal-400 to-emerald-500', comment:"Nikoh yilligimizni nishonlash uchun MarryMe ni tanladik. Kutganimizdan ham yaxshi bo'ldi. Albatta yana murojaat qilamiz!" },
  { id:6, name:'Doniyor Mirzaev',  city:'Toshkent',  rating:5, avatar:'DM', color:'from-rose-400 to-red-500',    comment:"Platinum paket oldik — hech narsa haqida o'ylamasdan dam oldik. Hamma narsani o'zlari hal qilishdi. Tavsiya qilaman!" },
];

function ReviewsTicker() {
  const doubled = [...STATIC_REVIEWS, ...STATIC_REVIEWS];
  return (
    <div className="w-full overflow-hidden py-2">
      <div className="flex gap-5 animate-ticker">
        {doubled.map((review, i) => (
          <div key={i} className="flex-shrink-0 w-80 bg-white rounded-2xl p-5 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {review.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{review.name}</p>
                <p className="text-xs text-gray-400">{review.city}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({length: review.rating}).map((_,j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400"/>)}
              </div>
            </div>
            <div className="relative">
              <Quote className="w-4 h-4 text-rose-200 absolute -top-1 -left-1"/>
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
    <Link to={`/services/${service.slug}`}
      className="anim-card group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      <div className={`h-36 bg-gradient-to-br ${CATEGORY_GRADIENTS[service.category] || 'from-rose-400 to-pink-500'} flex items-center justify-center`}>
        <span className="text-5xl">{CATEGORY_ICONS[service.category] || '✨'}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-rose-500 transition-colors">{service.name}</h3>
          {service.avgRating && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400"/>
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
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors"/>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get(`/services?lang=${i18n.language.toUpperCase()}`)
      .then(res => setServices(res.data.data.slice(0, 4)))
      .catch(() => {});
  }, [i18n.language]);

  const stats = [
    { value: '500+', label: i18n.language === 'uz' ? 'Mamnun juft'  : i18n.language === 'ru' ? 'Пар'      : 'Couples' },
    { value: '6+',   label: i18n.language === 'uz' ? 'Yil tajriba'  : i18n.language === 'ru' ? 'Лет'      : 'Years'   },
    { value: '15',   label: i18n.language === 'uz' ? 'Mutaxassis'   : i18n.language === 'ru' ? 'Мастеров' : 'Experts' },
    { value: '4.9',  label: i18n.language === 'uz' ? 'Reyting'      : i18n.language === 'ru' ? 'Рейтинг'  : 'Rating'  },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[94vh] flex items-center overflow-hidden">


        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-0 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8">

            {/* Left — text */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 text-xs font-semibold px-4 py-2 rounded-full mb-7 animate-fade-in-up">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>O'zbekiston №1 Wedding Platform</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-5 animate-fade-in-up-delay">
                {t('hero.title')}<br />
                <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
                  {t('hero.titleAccent')}
                </span>
              </h1>

              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md animate-fade-in-up-delay2">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap gap-3 animate-fade-in-up-delay2">
                <Link to="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-7 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-rose-200/60 hover:shadow-rose-300/70 hover:-translate-y-0.5 active:scale-95">
                  {t('hero.cta')} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/portfolio"
                  className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-rose-300 text-gray-700 hover:text-rose-500 px-7 py-4 rounded-2xl font-semibold transition-all hover:bg-rose-50/60 hover:-translate-y-0.5">
                  {t('hero.ctaSecondary')}
                </Link>
              </div>

              {/* Mini trust row */}
              <div className="flex items-center gap-6 mt-10 animate-fade-in-up-delay2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['AK','ST','NY','JR'].map((init,j) => (
                      <div key={j} className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white flex items-center justify-center text-white text-[11px] font-bold">
                        {init[0]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5">
                      {Array.from({length:5}).map((_,k) => <Star key={k} className="w-3 h-3 fill-amber-400 text-amber-400"/>)}
                    </div>
                    <p className="text-xs text-gray-500">500+ sharh</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">6+ yil</span> tajriba
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">15+</span> mutaxassis
                </div>
              </div>
            </div>

            {/* Right — Saturn animation */}
            <div className="flex-shrink-0 flex items-center justify-center animate-scale-in"
              style={{ paddingBottom: '60px', paddingRight: '16px', paddingLeft: '16px' }}>
              <SaturnRings />
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────── */}
      <section className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border-y border-gray-100/80 dark:border-gray-800/60">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent mb-1 tabular-nums">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-rose-500 text-sm font-semibold mb-2 tracking-wide uppercase">Xizmatlar</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{t('services.title')}</h2>
            </div>
            <Link to="/services" className="hidden md:flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 font-medium">
              {t('common.seeAll')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.length > 0
              ? services.map(service => <ServiceCard key={service.id} service={service} />)
              : Array.from({length:4}).map((_,i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-36 bg-gray-100" />
                    <div className="p-5 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                ))
            }
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/services" className="inline-flex items-center gap-2 text-rose-500 font-medium">
              {t('common.seeAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ──────────────────────────────────────── */}
      <section className="py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-10 text-center">
          <p className="text-rose-500 text-sm font-semibold mb-2 tracking-wide uppercase">Mijozlar fikri</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            {i18n.language === 'uz' ? 'Ular nima deyishdi?' : i18n.language === 'ru' ? 'Что говорят клиенты?' : 'What they say'}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({length:5}).map((_,i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400"/>)}
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
              {i18n.language === 'uz' ? 'Bayramingizni rejalashtiramizmi?' : i18n.language === 'ru' ? 'Планируете праздник?' : 'Plan your special day?'}
            </h2>
            <p className="text-rose-100 mb-8 text-lg">
              {i18n.language === 'uz' ? "Bepul konsultatsiya uchun hozir bog'laning" : i18n.language === 'ru' ? 'Свяжитесь для бесплатной консультации' : 'Contact us for a free consultation'}
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
