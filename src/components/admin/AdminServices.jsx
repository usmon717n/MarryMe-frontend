import { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, X, Check, Package, Image } from 'lucide-react';
import ImageUploader from '../common/ImageUploader';

const fmt = (n) => new Intl.NumberFormat('uz-UZ').format(n);

const PRESET_CATEGORIES = [
  { value: 'WEDDING',     labelUZ: "To'y marosimi",  emoji: '💍' },
  { value: 'LOVE_STORY',  labelUZ: 'Love Story',     emoji: '📸' },
  { value: 'PROPOSAL',    labelUZ: 'Taklifnoma',     emoji: '💌' },
  { value: 'BIRTHDAY',    labelUZ: "Tug'ilgan kun",  emoji: '🎂' },
  { value: 'ANNIVERSARY', labelUZ: 'Yillik',         emoji: '🥂' },
  { value: 'HENNA_NIGHT', labelUZ: 'Xina kechasi',  emoji: '🌸' },
  { value: 'CORPORATE',   labelUZ: 'Korporativ',     emoji: '🏢' },
  { value: 'CUSTOM',      labelUZ: 'Yangi kategoriya', emoji: '✨' },
];

const inp  = 'w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 transition-all';
const ta   = inp + ' resize-none';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

// ─── PACKAGE MODAL ────────────────────────────────────────
function PackageModal({ serviceId, pkg, onClose, onSaved }) {
  const isEdit = Boolean(pkg);
  const [form, setForm] = useState({
    slug:       pkg?.slug      ?? '',
    price:      pkg?.price     ?? '',
    isPopular:  pkg?.isPopular ?? false,
    emoji:      pkg?.emoji     ?? '🎁',
    regions:    pkg?.regions?.join(', ') ?? '',
    nameUZ:     pkg?.translations?.find(t => t.lang === 'UZ')?.name ?? '',
    includesUZ: pkg?.translations?.find(t => t.lang === 'UZ')?.includes?.join(', ') ?? '',
    nameRU:     pkg?.translations?.find(t => t.lang === 'RU')?.name ?? '',
    includesRU: pkg?.translations?.find(t => t.lang === 'RU')?.includes?.join(', ') ?? '',
  });
  const [saving, setSaving] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.nameUZ || !form.price) { toast.error('Nom va narx majburiy'); return; }
    setSaving(true);
    try {
      const slug = form.slug || form.nameUZ.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const payload = {
        slug, price: parseInt(form.price), isPopular: form.isPopular, emoji: form.emoji,
        regions: form.regions.split(',').map(r => r.trim()).filter(Boolean),
        translations: {
          UZ: { name: form.nameUZ, includes: form.includesUZ.split(',').map(s => s.trim()).filter(Boolean) },
          RU: { name: form.nameRU || form.nameUZ, includes: form.includesRU.split(',').map(s => s.trim()).filter(Boolean) },
          EN: { name: form.nameUZ, includes: form.includesUZ.split(',').map(s => s.trim()).filter(Boolean) },
        },
      };
      if (isEdit) await api.put('/admin/packages/' + pkg.id, payload);
      else        await api.post('/admin/services/' + serviceId + '/packages', payload);
      toast.success(isEdit ? 'Paket yangilandi' : "Paket qo'shildi");
      onSaved(); onClose();
    } catch (err) { toast.error(err.response?.data?.message ?? 'Xato'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <h3 className="font-semibold text-gray-900 dark:text-white">{isEdit ? 'Paketni tahrirlash' : 'Yangi paket'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Emoji"><input className={inp} value={form.emoji} onChange={e => f('emoji', e.target.value)} /></Field>
            <Field label="Narx (so'm) *"><input type="number" className={inp} value={form.price} onChange={e => f('price', e.target.value)} /></Field>
          </div>
          <Field label="Nom (UZ) *"><input className={inp} value={form.nameUZ} onChange={e => f('nameUZ', e.target.value)} /></Field>
          <Field label="Kiradi (UZ, vergul bilan)">
            <textarea rows={2} className={ta} value={form.includesUZ} onChange={e => f('includesUZ', e.target.value)} placeholder="Dekoratsiya, Fotograf, Koordinator" />
          </Field>
          <Field label="Nom (RU)"><input className={inp} value={form.nameRU} onChange={e => f('nameRU', e.target.value)} /></Field>
          <Field label="Kiradi (RU, vergul bilan)">
            <textarea rows={2} className={ta} value={form.includesRU} onChange={e => f('includesRU', e.target.value)} />
          </Field>
          <Field label="Viloyatlar (vergul bilan)">
            <input className={inp} value={form.regions} onChange={e => f('regions', e.target.value)} placeholder="Toshkent sh., Samarqand" />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPopular} onChange={e => f('isPopular', e.target.checked)} className="w-4 h-4 accent-rose-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mashhur (Popular)</span>
          </label>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            Bekor
          </button>
          <button onClick={save} disabled={saving} className="flex-1 px-4 py-2.5 bg-rose-400 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium">
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SERVICE EDIT FORM ────────────────────────────────────
function ServiceEditForm({ service, onSaved }) {
  const [form, setForm] = useState({
    basePrice:      service.basePrice,
    isActive:       service.isActive,
    coverImage:     service.coverImage ?? '',
    regions:        service.regions?.join(', ') ?? '',
    customCategory: service.customCategory ?? '',
    nameUZ:         service.translations?.find(t => t.lang === 'UZ')?.name ?? '',
    descUZ:         service.translations?.find(t => t.lang === 'UZ')?.description ?? '',
    featuresUZ:     service.translations?.find(t => t.lang === 'UZ')?.features?.join(', ') ?? '',
    nameRU:         service.translations?.find(t => t.lang === 'RU')?.name ?? '',
    descRU:         service.translations?.find(t => t.lang === 'RU')?.description ?? '',
  });
  const [saving, setSaving] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/services/' + service.id, {
        basePrice:      parseInt(form.basePrice),
        isActive:       form.isActive,
        coverImage:     form.coverImage,
        customCategory: service.category === 'CUSTOM' ? form.customCategory : null,
        regions:        form.regions.split(',').map(r => r.trim()).filter(Boolean),
        translations: {
          UZ: { name: form.nameUZ, description: form.descUZ, features: form.featuresUZ.split(',').map(s => s.trim()).filter(Boolean) },
          RU: { name: form.nameRU || form.nameUZ, description: form.descRU || form.descUZ, features: [] },
          EN: { name: form.nameUZ, description: form.descUZ, features: [] },
        },
      });
      toast.success('Xizmat yangilandi');
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message ?? 'Xato'); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-4 bg-rose-50/40 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30 space-y-3">
      <ImageUploader
        label="Muqova rasm"
        value={form.coverImage}
        onChange={v => f('coverImage', v)}
        endpoint="serviceCover"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Asosiy narx (so'm)">
          <input type="number" className={inp} value={form.basePrice} onChange={e => f('basePrice', e.target.value)} />
        </Field>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => f('isActive', e.target.checked)} className="w-4 h-4 accent-rose-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Aktiv</span>
          </label>
        </div>
      </div>
      {service.category === 'CUSTOM' && (
        <Field label="Kategoriya nomi (ko'rsatiladigan)">
          <input className={inp} value={form.customCategory} onChange={e => f('customCategory', e.target.value)} placeholder="Masalan: Mehmonxona, Restoran..." />
        </Field>
      )}
      <Field label="Nom (UZ)">
        <input className={inp} value={form.nameUZ} onChange={e => f('nameUZ', e.target.value)} />
      </Field>
      <Field label="Tavsif (UZ)">
        <textarea rows={2} className={ta} value={form.descUZ} onChange={e => f('descUZ', e.target.value)} />
      </Field>
      <Field label="Xususiyatlar (UZ, vergul bilan)">
        <input className={inp} value={form.featuresUZ} onChange={e => f('featuresUZ', e.target.value)} />
      </Field>
      <Field label="Nom (RU)">
        <input className={inp} value={form.nameRU} onChange={e => f('nameRU', e.target.value)} />
      </Field>
      <Field label="Viloyatlar (vergul bilan)">
        <input className={inp} value={form.regions} onChange={e => f('regions', e.target.value)} placeholder="Toshkent sh., Samarqand" />
      </Field>
      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-rose-400 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium">
          <Check className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </div>
  );
}

// ─── CREATE SERVICE MODAL ─────────────────────────────────
function CreateServiceModal({ onClose, onSaved }) {
  const [step,    setStep]    = useState(1);
  const [saving,  setSaving]  = useState(false);
  const [service, setService] = useState(null);
  const [packages, setPackages] = useState([]);

  const [form, setForm] = useState({
    category:         '',
    customCategoryName: '',
    slug:             '',
    basePrice:        '',
    coverImage:       '',
    regions:          '',
    nameUZ:  '', descUZ: '', featuresUZ: '',
    nameRU:  '', descRU: '',
  });

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const autoSlug = (name) =>
    name.toLowerCase()
      .replace(/[ʻ'']/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

  const step1Save = async () => {
    if (!form.category)  return toast.error('Kategoriya tanlang');
    if (!form.nameUZ)    return toast.error('Xizmat nomini kiriting');
    if (!form.basePrice) return toast.error('Asosiy narxni kiriting');
    setSaving(true);
    try {
      const slug = form.slug || autoSlug(form.nameUZ);
      const payload = {
        slug,
        category:           form.category,
        customCategoryName: form.category === 'CUSTOM' ? (form.customCategoryName || form.nameUZ) : undefined,
        basePrice:          parseInt(form.basePrice),
        coverImage:         form.coverImage,
        regions:            form.regions.split(',').map(s => s.trim()).filter(Boolean),
        translations: {
          UZ: { name: form.nameUZ, description: form.descUZ, features: form.featuresUZ.split(',').map(s => s.trim()).filter(Boolean) },
          RU: { name: form.nameRU || form.nameUZ, description: form.descRU || form.descUZ, features: [] },
          EN: { name: form.nameUZ, description: form.descUZ, features: [] },
        },
      };
      const res = await api.post('/admin/services', payload);
      setService(res.data.data);
      setStep(2);
      toast.success("Xizmat yaratildi! Paketlar qo'shing");
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Xato yuz berdi');
    } finally { setSaving(false); }
  };

  const addPackage = () => setPackages(prev => [...prev, {
    _id: Date.now(), emoji: '🎁', slug: '', price: '',
    isPopular: false, regions: '',
    nameUZ: '', includesUZ: '',
    nameRU: '', includesRU: '',
    saved: false, saving: false,
  }]);

  const updPkg = (id, k, v) => setPackages(prev => prev.map(p => p._id === id ? { ...p, [k]: v } : p));

  const savePkg = async (pkg) => {
    if (!pkg.nameUZ || !pkg.price) { toast.error('Nom va narx majburiy'); return; }
    updPkg(pkg._id, 'saving', true);
    try {
      const slug = pkg.slug || autoSlug(pkg.nameUZ);
      await api.post('/admin/services/' + service.id + '/packages', {
        slug, price: parseInt(pkg.price), isPopular: pkg.isPopular, emoji: pkg.emoji,
        regions: pkg.regions.split(',').map(s => s.trim()).filter(Boolean),
        translations: {
          UZ: { name: pkg.nameUZ, includes: pkg.includesUZ.split(',').map(s => s.trim()).filter(Boolean) },
          RU: { name: pkg.nameRU || pkg.nameUZ, includes: pkg.includesRU.split(',').map(s => s.trim()).filter(Boolean) },
          EN: { name: pkg.nameUZ, includes: pkg.includesUZ.split(',').map(s => s.trim()).filter(Boolean) },
        },
      });
      updPkg(pkg._id, 'saved', true);
      toast.success('"' + pkg.nameUZ + '" paketi qo\'shildi');
    } catch (err) { toast.error(err.response?.data?.message ?? 'Xato'); }
    finally { updPkg(pkg._id, 'saving', false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800 overflow-hidden" style={{ maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">Yangi xizmat qo'shish</h2>
            <div className="flex items-center gap-2 mt-1">
              {[1, 2].map(n => (
                <div key={n} className="flex items-center gap-1.5">
                  <div className={'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ' + (step >= n ? 'bg-rose-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500')}>
                    {n}
                  </div>
                  <span className={'text-xs ' + (step >= n ? 'text-rose-500 font-medium' : 'text-gray-400 dark:text-gray-500')}>
                    {n === 1 ? 'Asosiy' : 'Paketlar'}
                  </span>
                  {n < 2 && <div className={'w-8 h-0.5 ' + (step > n ? 'bg-rose-300' : 'bg-gray-100 dark:bg-gray-800')} />}
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Kategoriya tanlang *">
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_CATEGORIES.map(cat => (
                    <button key={cat.value}
                      type="button"
                      onClick={() => {
                        f('category', cat.value);
                        if (!form.nameUZ && cat.value !== 'CUSTOM') f('nameUZ', cat.labelUZ);
                      }}
                      className={'flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-medium transition-all ' + (
                        form.category === cat.value
                          ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}>
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-center leading-tight">{cat.labelUZ}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {form.category === 'CUSTOM' && (
                <Field label="Kategoriya nomi (o'zbek tilida) *">
                  <input className={inp} value={form.customCategoryName}
                    onChange={e => f('customCategoryName', e.target.value)}
                    placeholder="Masalan: Mehmonxona bezash, Restoran..." />
                </Field>
              )}

              <ImageUploader
                label="Muqova rasm (ixtiyoriy)"
                value={form.coverImage}
                onChange={v => f('coverImage', v)}
                endpoint="serviceCover"
              />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Asosiy narx (so'm) *">
                  <input type="number" className={inp} value={form.basePrice}
                    onChange={e => f('basePrice', e.target.value)} placeholder="15000000" />
                </Field>
                <Field label="Slug (URL)">
                  <input className={inp} value={form.slug}
                    onChange={e => f('slug', e.target.value)} placeholder="avto — nomdan" />
                </Field>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">O'zbek tili (UZ) *</p>
                <div className="space-y-3">
                  <Field label="Xizmat nomi *">
                    <input className={inp} value={form.nameUZ} onChange={e => f('nameUZ', e.target.value)} placeholder="To'y marosimi" />
                  </Field>
                  <Field label="Tavsif">
                    <textarea rows={2} className={ta} value={form.descUZ} onChange={e => f('descUZ', e.target.value)} placeholder="Qisqa tavsif..." />
                  </Field>
                  <Field label="Xususiyatlar (vergul bilan)">
                    <input className={inp} value={form.featuresUZ} onChange={e => f('featuresUZ', e.target.value)} placeholder="Dekoratsiya, Fotograf, Videograf" />
                  </Field>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Rus tili (RU)</p>
                <div className="space-y-3">
                  <Field label="Xizmat nomi (RU)">
                    <input className={inp} value={form.nameRU} onChange={e => f('nameRU', e.target.value)} placeholder="UZ nomidan foydalaniladi" />
                  </Field>
                  <Field label="Tavsif (RU)">
                    <textarea rows={2} className={ta} value={form.descRU} onChange={e => f('descRU', e.target.value)} />
                  </Field>
                </div>
              </div>

              <Field label="Viloyatlar (vergul bilan)">
                <input className={inp} value={form.regions} onChange={e => f('regions', e.target.value)} placeholder="Toshkent sh., Samarqand, Buxoro" />
              </Field>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{form.nameUZ}</span> xizmatiga paketlar qo'shing
                </p>
                <button type="button" onClick={addPackage}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-400 hover:bg-rose-500 text-white rounded-xl text-sm font-medium">
                  <Plus className="w-3.5 h-3.5" /> Paket qo'shish
                </button>
              </div>

              {packages.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                  <Package className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                  <p className="text-gray-400 dark:text-gray-500 text-sm">Hali paketlar yo'q</p>
                  <button type="button" onClick={addPackage}
                    className="mt-3 text-rose-500 text-sm font-medium hover:underline">
                    + Birinchi paketni qo'shish
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {packages.map((pkg, idx) => (
                  <div key={pkg._id}
                    className={'rounded-2xl border p-4 space-y-3 ' + (pkg.saved
                      ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-900/10'
                      : 'border-gray-200 dark:border-gray-700')}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Paket #{idx + 1}</span>
                      <div className="flex items-center gap-2">
                        {pkg.saved && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Saqlandi
                          </span>
                        )}
                        {!pkg.saved && (
                          <button type="button" onClick={() => setPackages(prev => prev.filter(p => p._id !== pkg._id))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 text-gray-400 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {!pkg.saved && (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          <Field label="Emoji"><input className={inp} value={pkg.emoji} onChange={e => updPkg(pkg._id, 'emoji', e.target.value)} /></Field>
                          <Field label="Narx (so'm) *"><input type="number" className={inp} value={pkg.price} onChange={e => updPkg(pkg._id, 'price', e.target.value)} placeholder="15000000" /></Field>
                          <Field label="Slug"><input className={inp} value={pkg.slug} onChange={e => updPkg(pkg._id, 'slug', e.target.value)} placeholder="silver" /></Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Nom (UZ) *"><input className={inp} value={pkg.nameUZ} onChange={e => updPkg(pkg._id, 'nameUZ', e.target.value)} placeholder="Silver" /></Field>
                          <Field label="Nom (RU)"><input className={inp} value={pkg.nameRU} onChange={e => updPkg(pkg._id, 'nameRU', e.target.value)} placeholder="UZ dan" /></Field>
                        </div>
                        <Field label="Kiradi (UZ, vergul bilan)">
                          <textarea rows={2} className={ta} value={pkg.includesUZ} onChange={e => updPkg(pkg._id, 'includesUZ', e.target.value)} placeholder="Dekoratsiya, Fotograf, Koordinator" />
                        </Field>
                        <Field label="Kiradi (RU, vergul bilan)">
                          <textarea rows={2} className={ta} value={pkg.includesRU} onChange={e => updPkg(pkg._id, 'includesRU', e.target.value)} />
                        </Field>
                        <Field label="Viloyatlar (vergul bilan)">
                          <input className={inp} value={pkg.regions} onChange={e => updPkg(pkg._id, 'regions', e.target.value)} placeholder="Toshkent sh., Samarqand" />
                        </Field>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={pkg.isPopular} onChange={e => updPkg(pkg._id, 'isPopular', e.target.checked)} className="w-4 h-4 accent-rose-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Mashhur (Popular)</span>
                          </label>
                          <button type="button" onClick={() => savePkg(pkg)} disabled={pkg.saving}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-400 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium">
                            <Check className="w-3.5 h-3.5" />
                            {pkg.saving ? 'Saqlanmoqda...' : 'Paketni saqlash'}
                          </button>
                        </div>
                      </>
                    )}

                    {pkg.saved && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-xl">{pkg.emoji}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-200">{pkg.nameUZ}</span>
                        <span className="text-gray-300 dark:text-gray-600">·</span>
                        <span>{fmt(parseInt(pkg.price || 0))} so'm</span>
                        {pkg.isPopular && <span className="text-xs bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">Mashhur</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <button type="button" onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            {step === 2 ? 'Yopish' : 'Bekor qilish'}
          </button>
          {step === 1 && (
            <button type="button" onClick={step1Save} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-400 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold">
              {saving ? 'Saqlanmoqda...' : 'Keyingi: Paketlar →'}
            </button>
          )}
          {step === 2 && (
            <button type="button" onClick={() => { onSaved(); onClose(); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold">
              <Check className="w-4 h-4" /> Tayyor — Saqlash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
export default function AdminServices() {
  const [services,    setServices]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState({});
  const [editingId,   setEditingId]   = useState(null);
  const [pkgModal,    setPkgModal]    = useState(null);
  const [createOpen,  setCreateOpen]  = useState(false);
  const [deletingPkg, setDeletingPkg] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/admin/services')
      .then(r => setServices(r.data.data))
      .catch(() => toast.error('Xizmatlarni yuklashda xato'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const deletePkg = async (id) => {
    if (!window.confirm("Paketni o'chirishni tasdiqlaysizmi?")) return;
    setDeletingPkg(id);
    try {
      await api.delete('/admin/packages/' + id);
      toast.success("Paket o'chirildi");
      load();
    } catch (err) { toast.error(err.response?.data?.message ?? 'Xato'); }
    finally { setDeletingPkg(null); }
  };

  const getCatInfo = (svc) => {
    const preset = PRESET_CATEGORIES.find(c => c.value === svc.category);
    if (svc.category === 'CUSTOM') {
      return { emoji: '✨', labelUZ: svc.customCategory || 'Boshqa' };
    }
    return preset || { emoji: '✨', labelUZ: svc.category };
  };

  if (loading) return (
    <div className="p-6 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Xizmatlar boshqaruvi</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{services.length} ta xizmat mavjud</p>
        </div>
        <button type="button" onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-400 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
          <Plus className="w-4 h-4" /> Yangi xizmat
        </button>
      </div>

      <div className="space-y-4">
        {services.map(svc => {
          const tr     = svc.translations?.find(t => t.lang === 'UZ') ?? svc.translations?.[0];
          const isExp  = expanded[svc.id];
          const isEdit = editingId === svc.id;
          const cat    = getCatInfo(svc);

          return (
            <div key={svc.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-5 py-4">
                {/* Cover or emoji */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-rose-50 dark:bg-rose-900/20">
                  {svc.coverImage ? (
                    <img src={svc.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{cat.emoji}</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 dark:text-white">{tr?.name ?? svc.slug}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{cat.labelUZ}</span>
                    {!svc.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400">Nofaol</span>}
                    {svc.coverImage && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Image className="w-3 h-3" /> Rasm
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                    Narx: <span className="text-gray-700 dark:text-gray-300 font-medium">{fmt(svc.basePrice)} so'm</span>
                    {' · '}<span className="font-medium text-gray-600 dark:text-gray-400">{svc.packages?.length ?? 0}</span> paket
                    {' · '}<span className="font-medium text-gray-600 dark:text-gray-400">{svc._count?.orders ?? 0}</span> buyurtma
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => setEditingId(isEdit ? null : svc.id)}
                    className={'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ' + (
                      isEdit
                        ? 'bg-rose-400 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}>
                    <Pencil className="w-3 h-3" /> {isEdit ? 'Yopish' : 'Tahrirlash'}
                  </button>
                  <button type="button" onClick={() => toggleExpand(svc.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                    {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isEdit && (
                <div className="px-5 pb-4">
                  <ServiceEditForm service={svc} onSaved={() => { setEditingId(null); load(); }} />
                </div>
              )}

              {isExp && (
                <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-rose-400" /> Paketlar
                    </span>
                    <button type="button" onClick={() => setPkgModal({ serviceId: svc.id })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-400 hover:bg-rose-500 text-white rounded-xl text-xs font-medium">
                      <Plus className="w-3 h-3" /> Paket qo'shish
                    </button>
                  </div>
                  {(!svc.packages || svc.packages.length === 0) ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                      Paketlar yo'q
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {svc.packages.map(pkg => {
                        const ptr = pkg.translations?.find(t => t.lang === 'UZ') ?? pkg.translations?.[0];
                        return (
                          <div key={pkg.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="text-xl flex-shrink-0">{pkg.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{ptr?.name ?? pkg.slug}</span>
                                {pkg.isPopular && <span className="text-xs bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">Mashhur</span>}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{fmt(pkg.price)} so'm</p>
                              {ptr?.includes?.length > 0 && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{ptr.includes.join(' · ')}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button type="button" onClick={() => setPkgModal({ serviceId: svc.id, pkg })}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button type="button" onClick={() => deletePkg(pkg.id)} disabled={deletingPkg === pkg.id}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 text-gray-400 hover:text-red-500 disabled:opacity-50">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pkgModal    && <PackageModal serviceId={pkgModal.serviceId} pkg={pkgModal.pkg} onClose={() => setPkgModal(null)} onSaved={load} />}
      {createOpen  && <CreateServiceModal onClose={() => setCreateOpen(false)} onSaved={load} />}
    </div>
  );
}
