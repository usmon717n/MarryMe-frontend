import { useState, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, X, Check, Package } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('uz-UZ').format(n);

const CATEGORY_LABELS = {
  WEDDING: "To'y", LOVE_STORY: 'Love Story', PROPOSAL: 'Taklif',
  BIRTHDAY: "Tug'ilgan kun", ANNIVERSARY: 'Yillik', HENNA_NIGHT: 'Xina kechasi', CORPORATE: 'Korporativ',
};

// ─── PACKAGE FORM MODAL ───────────────────────────────────
function PackageModal({ serviceId, pkg, onClose, onSaved }) {
  const isEdit = Boolean(pkg);
  const [form, setForm] = useState({
    slug:      pkg?.slug      ?? '',
    price:     pkg?.price     ?? '',
    isPopular: pkg?.isPopular ?? false,
    emoji:     pkg?.emoji     ?? '🎁',
    regions:   pkg?.regions?.join(', ') ?? '',
    nameUZ:    pkg?.translations?.find(t => t.lang === 'UZ')?.name ?? '',
    includesUZ: pkg?.translations?.find(t => t.lang === 'UZ')?.includes?.join(', ') ?? '',
    nameRU:    pkg?.translations?.find(t => t.lang === 'RU')?.name ?? '',
    includesRU: pkg?.translations?.find(t => t.lang === 'RU')?.includes?.join(', ') ?? '',
    nameEN:    pkg?.translations?.find(t => t.lang === 'EN')?.name ?? '',
    includesEN: pkg?.translations?.find(t => t.lang === 'EN')?.includes?.join(', ') ?? '',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.nameUZ || !form.price) { toast.error('Nom va narx majburiy'); return; }
    setSaving(true);
    try {
      const payload = {
        slug:      form.slug || form.nameUZ.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        price:     parseInt(form.price),
        isPopular: form.isPopular,
        emoji:     form.emoji,
        regions:   form.regions.split(',').map(r => r.trim()).filter(Boolean),
        translations: {
          UZ: { name: form.nameUZ, includes: form.includesUZ.split(',').map(s => s.trim()).filter(Boolean) },
          RU: { name: form.nameRU || form.nameUZ, includes: form.includesRU.split(',').map(s => s.trim()).filter(Boolean) },
          EN: { name: form.nameEN || form.nameUZ, includes: form.includesEN.split(',').map(s => s.trim()).filter(Boolean) },
        },
      };
      if (isEdit) {
        await api.put(`/admin/packages/${pkg.id}`, payload);
      } else {
        await api.post(`/admin/services/${serviceId}/packages`, payload);
      }
      toast.success(isEdit ? 'Paket yangilandi' : 'Paket qo\'shildi');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Xato yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{isEdit ? 'Paketni tahrirlash' : 'Yangi paket'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Emoji</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Narx (so'm)</label>
              <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nom (UZ) *</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none" value={form.nameUZ} onChange={e => setForm(f => ({ ...f, nameUZ: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Xizmatlar (UZ, vergul bilan)</label>
            <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none resize-none" value={form.includesUZ} onChange={e => setForm(f => ({ ...f, includesUZ: e.target.value }))} placeholder="Dekoratsiya, Fotograf, Koordinator" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nom (RU)</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none" value={form.nameRU} onChange={e => setForm(f => ({ ...f, nameRU: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Xizmatlar (RU, vergul bilan)</label>
            <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none resize-none" value={form.includesRU} onChange={e => setForm(f => ({ ...f, includesRU: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Viloyatlar (vergul bilan)</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none" value={form.regions} onChange={e => setForm(f => ({ ...f, regions: e.target.value }))} placeholder="Toshkent sh., Samarqand" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPopular} onChange={e => setForm(f => ({ ...f, isPopular: e.target.checked }))} className="w-4 h-4 accent-rose-500" />
            <span className="text-sm text-gray-700">Mashhur (Popular)</span>
          </label>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50">Bekor</button>
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
    basePrice:   service.basePrice,
    isActive:    service.isActive,
    regions:     service.regions?.join(', ') ?? '',
    nameUZ:      service.translations?.find(t => t.lang === 'UZ')?.name ?? '',
    descUZ:      service.translations?.find(t => t.lang === 'UZ')?.description ?? '',
    featuresUZ:  service.translations?.find(t => t.lang === 'UZ')?.features?.join(', ') ?? '',
    nameRU:      service.translations?.find(t => t.lang === 'RU')?.name ?? '',
    descRU:      service.translations?.find(t => t.lang === 'RU')?.description ?? '',
    featuresRU:  service.translations?.find(t => t.lang === 'RU')?.features?.join(', ') ?? '',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/services/${service.id}`, {
        basePrice:  parseInt(form.basePrice),
        isActive:   form.isActive,
        regions:    form.regions.split(',').map(r => r.trim()).filter(Boolean),
        translations: {
          UZ: { name: form.nameUZ, description: form.descUZ, features: form.featuresUZ.split(',').map(s => s.trim()).filter(Boolean) },
          RU: { name: form.nameRU || form.nameUZ, description: form.descRU || form.descUZ, features: form.featuresRU.split(',').map(s => s.trim()).filter(Boolean) },
        },
      });
      toast.success('Xizmat yangilandi');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Xato yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Asosiy narx (so'm)</label>
          <input type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none bg-white" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-rose-500" />
            <span className="text-sm text-gray-700">Aktiv</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Nom (UZ)</label>
        <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none bg-white" value={form.nameUZ} onChange={e => setForm(f => ({ ...f, nameUZ: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Tavsif (UZ)</label>
        <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none bg-white resize-none" value={form.descUZ} onChange={e => setForm(f => ({ ...f, descUZ: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Xususiyatlar (UZ, vergul bilan)</label>
        <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none bg-white" value={form.featuresUZ} onChange={e => setForm(f => ({ ...f, featuresUZ: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Nom (RU)</label>
        <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none bg-white" value={form.nameRU} onChange={e => setForm(f => ({ ...f, nameRU: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Viloyatlar (vergul bilan)</label>
        <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-200 outline-none bg-white" value={form.regions} onChange={e => setForm(f => ({ ...f, regions: e.target.value }))} placeholder="Toshkent sh., Samarqand" />
      </div>
      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-rose-400 hover:bg-rose-500 disabled:opacity-60 text-white rounded-xl text-sm font-medium">
          <Check className="w-4 h-4" />
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────
export default function AdminServices() {
  const [services,    setServices]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState({});
  const [editingId,   setEditingId]   = useState(null);
  const [pkgModal,    setPkgModal]    = useState(null); // { serviceId, pkg? }
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
    if (!window.confirm('Paketni o\'chirishni tasdiqlaysizmi?')) return;
    setDeletingPkg(id);
    try {
      await api.delete(`/admin/packages/${id}`);
      toast.success('Paket o\'chirildi');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Xato yuz berdi');
    } finally {
      setDeletingPkg(null);
    }
  };

  if (loading) return (
    <div className="p-6 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Xizmatlar boshqaruvi</h1>
        <span className="text-sm text-gray-400">{services.length} ta xizmat</span>
      </div>

      <div className="space-y-4">
        {services.map(svc => {
          const tr = svc.translations?.find(t => t.lang === 'UZ') ?? svc.translations?.[0];
          const isExp = expanded[svc.id];
          const isEditing = editingId === svc.id;

          return (
            <div key={svc.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Service header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{tr?.name ?? svc.slug}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{CATEGORY_LABELS[svc.category] ?? svc.category}</span>
                    {!svc.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-500">Nofaol</span>}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Asosiy narx: <span className="text-gray-700 font-medium">{fmt(svc.basePrice)} so'm</span>
                    {' · '}{svc.packages?.length ?? 0} ta paket
                    {' · '}{svc._count?.orders ?? 0} ta buyurtma
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingId(isEditing ? null : svc.id); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${isEditing ? 'bg-rose-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <Pencil className="w-3 h-3" />
                    {isEditing ? 'Yopish' : 'Tahrirlash'}
                  </button>
                  <button onClick={() => toggleExpand(svc.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                    {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Edit form */}
              {isEditing && (
                <div className="px-5 pb-4">
                  <ServiceEditForm service={svc} onSaved={() => { setEditingId(null); load(); }} />
                </div>
              )}

              {/* Packages */}
              {isExp && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-rose-400" /> Paketlar
                    </span>
                    <button onClick={() => setPkgModal({ serviceId: svc.id })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-400 hover:bg-rose-500 text-white rounded-xl text-xs font-medium">
                      <Plus className="w-3 h-3" /> Paket qo'shish
                    </button>
                  </div>

                  {(!svc.packages || svc.packages.length === 0) ? (
                    <p className="text-sm text-gray-400 text-center py-4">Paketlar yo'q</p>
                  ) : (
                    <div className="space-y-2">
                      {svc.packages.map(pkg => {
                        const ptr = pkg.translations?.find(t => t.lang === 'UZ') ?? pkg.translations?.[0];
                        return (
                          <div key={pkg.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <span className="text-xl flex-shrink-0">{pkg.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-medium text-gray-900">{ptr?.name ?? pkg.slug}</span>
                                {pkg.isPopular && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">Mashhur</span>}
                              </div>
                              <p className="text-xs text-gray-500">{fmt(pkg.price)} so'm</p>
                              {ptr?.includes?.length > 0 && (
                                <p className="text-xs text-gray-400 truncate">{ptr.includes.join(' · ')}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button onClick={() => setPkgModal({ serviceId: svc.id, pkg })}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => deletePkg(pkg.id)} disabled={deletingPkg === pkg.id}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
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

      {pkgModal && (
        <PackageModal
          serviceId={pkgModal.serviceId}
          pkg={pkgModal.pkg}
          onClose={() => setPkgModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
