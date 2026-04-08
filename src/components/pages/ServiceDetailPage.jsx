import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api, useAuth } from '../../context/AuthContext';
import {
  Check, Star, ChevronRight, Calendar, Users,
  X, ArrowLeft, MapPin, Package, Info,
} from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('uz-UZ').format(n);

function RegionBadges({ regions = [] }) {
  if (!regions.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {regions.map((r) => (
        <span key={r} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-medium">
          <MapPin className="w-2.5 h-2.5" />{r}
        </span>
      ))}
    </div>
  );
}

function SubServiceModal({ subService, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div ref={ref} className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-xl flex-shrink-0">
            {subService.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{subService.name}</h3>
            <p className="text-xs text-gray-400">{subService.shortDesc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {subService.images?.length > 0 && (
          <div className="flex gap-2 p-4 pb-0">
            {subService.images.slice(0, 3).map((img, i) => (
              <div key={i} className="flex-1 h-28 rounded-xl bg-rose-50 overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600 leading-relaxed">{subService.fullDesc}</p>
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg, isSelected, onSelect }) {
  const [expanded,   setExpanded]  = useState(false);
  const [activeSS,   setActiveSS]  = useState(null);

  if (!expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        className={`rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
          ${isSelected ? 'border-rose-400 shadow-md shadow-rose-100' : 'border-gray-100 hover:border-rose-200 hover:shadow-sm'}`}
      >
        {pkg.regions?.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border-b border-rose-100">
            <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
            <span className="text-xs text-rose-600 truncate">{pkg.regions.join(', ')}</span>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl flex-shrink-0">
              {pkg.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-semibold text-gray-900">{pkg.name}</span>
                {pkg.isPopular && <span className="text-xs bg-rose-400 text-white px-2 py-0.5 rounded-full">Mashhur</span>}
                {isSelected && (
                  <span className="text-xs bg-emerald-400 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Tanlangan
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-rose-500">{fmt(pkg.price)} so'm</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {pkg.includes.map((item, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{item}</span>
            ))}
          </div>
          <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
            <Info className="w-3 h-3" /> Batafsil ko'rish uchun bosing
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border-2 border-rose-300 shadow-lg overflow-hidden bg-white">
        <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border-b border-rose-100">
          <button onClick={() => setExpanded(false)} className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg">{pkg.emoji}</span>
            <span className="font-semibold text-gray-900">{pkg.name}</span>
            {pkg.isPopular && <span className="text-xs bg-rose-400 text-white px-2 py-0.5 rounded-full">Mashhur</span>}
          </div>
          <span className="font-bold text-rose-500 text-sm flex-shrink-0">{fmt(pkg.price)} so'm</span>
        </div>

        {pkg.regions?.length > 0 && (
          <div className="px-4 pt-3"><RegionBadges regions={pkg.regions} /></div>
        )}

        {pkg.subServices?.length > 0 && (
          <div className="p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Xizmat turi ustiga bosib batafsil ma'lumot oling
            </p>
            <div className="grid grid-cols-2 gap-2">
              {pkg.subServices.map((ss) => (
                <button key={ss.id} onClick={() => setActiveSS(ss)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-rose-200 hover:bg-rose-50 transition-all text-left">
                  <span className="text-xl flex-shrink-0">{ss.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate leading-tight">{ss.name}</p>
                    <p className="text-xs text-gray-400 truncate">{ss.shortDesc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pb-4">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(pkg); setExpanded(false); }}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
              ${isSelected ? 'bg-emerald-400 hover:bg-emerald-500 text-white' : 'bg-rose-400 hover:bg-rose-500 text-white'}`}
          >
            {isSelected ? '✓ Tanlangan' : 'Shu paketni tanlash'}
          </button>
        </div>
      </div>

      {activeSS && <SubServiceModal subService={activeSS} onClose={() => setActiveSS(null)} />}
    </>
  );
}

function OrderForm({ service, selectedPkg, onSubmit, isOrdering, user }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const price = selectedPkg?.price ?? service?.basePrice ?? 0;
  const avans = Math.round(price * 0.3);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="sticky top-24 bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{fmt(price)}</span>
          <span className="text-rose-100 text-sm">so'm</span>
        </div>
        <p className="text-rose-100 text-xs mt-0.5">
          Avans: <span className="font-semibold text-white">{fmt(avans)} so'm</span> (30%)
        </p>
        {selectedPkg && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-sm">{selectedPkg.emoji}</span>
            <span className="text-rose-100 text-xs">{selectedPkg.name} paketi tanlangan</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3.5">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            <Calendar className="w-3 h-3 inline mr-1" />Tadbir sanasi *
          </label>
          <input type="date" min={today}
            {...register('eventDate', { required: 'Sana tanlang' })}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-rose-200 focus:border-rose-300 ${errors.eventDate ? 'border-red-300' : 'border-gray-200'}`} />
          {errors.eventDate && <p className="text-xs text-red-400 mt-1">{errors.eventDate.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <Users className="w-3 h-3 inline mr-1" />Mehmonlar
            </label>
            <input type="number" min="1" placeholder="50"
              {...register('guestCount', { min: 1 })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <MapPin className="w-3 h-3 inline mr-1" />Manzil
            </label>
            <input type="text" placeholder="Toshkent"
              {...register('venue')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Qo'shimcha izoh</label>
          <textarea rows={3} placeholder="Maxsus talablar, rang, mavzu..."
            {...register('notes')}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 resize-none" />
        </div>

        <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Tanlangan paket</span>
            <span className="text-gray-700 font-medium">{selectedPkg?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Asosiy narx</span>
            <span className="text-gray-700 font-medium">{fmt(price)} so'm</span>
          </div>
          <div className="flex justify-between text-xs border-t border-gray-200 pt-1.5">
            <span className="text-rose-500 font-medium">Avans (30%)</span>
            <span className="text-rose-500 font-semibold">{fmt(avans)} so'm</span>
          </div>
        </div>

        {user ? (
          <button type="submit" disabled={isOrdering}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-rose-200/60 hover:-translate-y-0.5">
            {isOrdering ? 'Yuborilmoqda...' : 'Buyurtma berish'}
          </button>
        ) : (
          <div className="space-y-2">
            <button type="button" onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-rose-200/60">
              Kirish va buyurtma berish
            </button>
            <p className="text-center text-xs text-gray-400">
              Hisobingiz yo'qmi?{' '}
              <Link to="/register" className="text-rose-500 font-medium">Ro'yxatdan o'ting</Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default function ServiceDetailPage() {
  const { slug }                = useParams();
  const { i18n }                = useTranslation();
  const { user }                = useAuth();
  const navigate                = useNavigate();
  const [service,  setService]  = useState(null);
  const [selPkg,   setSelPkg]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [ordering, setOrdering] = useState(false);

  const lang = i18n.language.toUpperCase();

  useEffect(() => {
    setLoading(true);
    api.get(`/services/${slug}?lang=${lang}`)
      .then(r => {
        const svc = r.data.data;
        setService(svc);
        setSelPkg(svc.packages?.find(p => p.isPopular) ?? svc.packages?.[0] ?? null);
      })
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false));
  }, [slug, lang]);

  const handleOrder = async (data) => {
    if (!user) { navigate('/login'); return; }
    try {
      setOrdering(true);
      await api.post('/orders', {
        serviceId:  service.id,
        packageId:  selPkg?.id ?? null,
        eventDate:  data.eventDate,
        eventType:  service.name,
        guestCount: data.guestCount ? parseInt(data.guestCount) : null,
        venue:      data.venue   || null,
        notes:      data.notes   || null,
        totalPrice: selPkg?.price ?? service.basePrice,
      });
      toast.success("Buyurtmangiz qabul qilindi! Tez orada bog'lanamiz 🎉");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Xato yuz berdi. Qayta urining.');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
          <div className="lg:col-span-2">
            <div className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) return null;

  const CAT_EMOJI = { WEDDING:'💍', BIRTHDAY:'🎂', LOVE_STORY:'💕', PROPOSAL:'💝', ANNIVERSARY:'🥂', HENNA_NIGHT:'🌿', CORPORATE:'🏢' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white">
      <div className="max-w-5xl mx-auto px-4 py-10">

        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/services" className="hover:text-rose-500 transition-colors">Xizmatlar</Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-gray-900 font-medium">{service.name}</span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Left */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{CAT_EMOJI[service.category] ?? '🎉'}</span>
                <span className="text-xs font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  {service.category.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{service.name}</h1>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>

            {service.regions?.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Xizmat ko'rsatiladigan viloyatlar
                </p>
                <RegionBadges regions={service.regions} />
              </div>
            )}

            {service.features?.length > 0 && (
              <div className="mb-8 bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Nimalar kiradi</h3>
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-rose-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.packages?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-rose-400" />Paket tanlang
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Paket ustiga bosib xizmat turlarini ko'ring, so'ng "Shu paketni tanlash" tugmasini bosing
                </p>
                <div className="space-y-3">
                  {service.packages.map(pkg => (
                    <PackageCard
                      key={pkg.id} pkg={pkg}
                      isSelected={selPkg?.id === pkg.id}
                      onSelect={setSelPkg}
                    />
                  ))}
                </div>
              </div>
            )}

            {service.reviews?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Mijozlar sharhlari</h3>
                <div className="space-y-3">
                  {service.reviews.slice(0, 4).map(review => (
                    <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2.5 mb-2">
                        {review.user.avatar ? (
                          <img src={review.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-semibold text-rose-500">
                            {(review.user.name?.[0] ?? '?').toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{review.user.name || 'Foydalanuvchi'}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long' })}
                          </p>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="lg:col-span-2">
            <OrderForm
              service={service} selectedPkg={selPkg}
              onSubmit={handleOrder} isOrdering={ordering} user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
