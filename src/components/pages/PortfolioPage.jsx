// PortfolioPage.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../context/AuthContext';

const CATEGORIES = ['ALL', 'WEDDING', 'LOVE_STORY', 'PROPOSAL', 'BIRTHDAY'];
const BG_COLORS = {
  WEDDING: 'from-rose-100 to-pink-100',
  LOVE_STORY: 'from-amber-100 to-orange-100',
  PROPOSAL: 'from-purple-100 to-pink-100',
  BIRTHDAY: 'from-blue-100 to-indigo-100',
};
const ICONS = { WEDDING: '💍', LOVE_STORY: '📸', PROPOSAL: '💌', BIRTHDAY: '🎂' };

export function PortfolioPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ lang: i18n.language.toUpperCase() });
    if (filter !== 'ALL') params.append('category', filter);
    api.get(`/portfolio?${params}`)
      .then(r => setItems(r.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filter, i18n.language]);

  // Fallback demo items if API is empty
  const demo = [
    { id: 1, category: 'WEDDING', title: "Aziz & Malika to'yi", location: 'Samarkand', eventDate: '2024-09-14' },
    { id: 2, category: 'LOVE_STORY', title: 'Sardor & Nilufar Love Story', location: 'Buxoro', eventDate: '2024-08-20' },
    { id: 3, category: 'PROPOSAL', title: 'Surprise Proposal', location: 'Toshkent', eventDate: '2024-07-10' },
    { id: 4, category: 'BIRTHDAY', title: "Laylo 25 yosh", location: 'Toshkent', eventDate: '2024-06-05' },
    { id: 5, category: 'WEDDING', title: "Jasur & Dildora to'yi", location: 'Namangan', eventDate: '2024-05-18' },
    { id: 6, category: 'LOVE_STORY', title: 'Amir & Zulfiya', location: 'Chorvoq', eventDate: '2024-04-22' },
  ];

  const displayed = items.length > 0 ? items : demo.filter(d => filter === 'ALL' || d.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Portfolio</h1>
        <p className="text-gray-500">{t('hero.subtitle').split('.')[0]}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === cat ? 'bg-rose-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500'}`}>
            {cat === 'ALL' ? (i18n.language === 'uz' ? 'Barchasi' : i18n.language === 'ru' ? 'Все' : 'All') : (ICONS[cat] || '') + ' ' + t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {displayed.map((item, i) => (
          <div key={item.id || i} className={`break-inside-avoid rounded-2xl overflow-hidden bg-gradient-to-br ${BG_COLORS[item.category] || 'from-gray-100 to-gray-200'} p-8 flex flex-col items-center justify-center gap-3 ${i % 3 === 1 ? 'aspect-square' : 'aspect-video'}`}>
            <span className="text-5xl">{ICONS[item.category] || '✨'}</span>
            <div className="text-center">
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.location} · {new Date(item.eventDate).getFullYear()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioPage;
