import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { api } from '../../context/AuthContext';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/contact', data);
      toast.success(t('contact.success'));
      reset();
    } catch {
      toast.error(t('common.error'));
    }
  };

  const contacts = [
    { icon: Phone, label: '+998 90 123 45 67', href: 'tel:+998901234567' },
    { icon: Mail, label: 'hello@marryme.uz', href: 'mailto:hello@marryme.uz' },
    { icon: MapPin, label: t('contact.address'), href: '#' },
    { icon: Clock, label: t('contact.workHours'), href: '#' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('contact.title')}</h1>
        <p className="text-gray-500 max-w-md mx-auto">{t('contact.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Info */}
        <div>
          <div className="space-y-4 mb-8">
            {contacts.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-rose-400" />
                </div>
                <span className="text-gray-700 text-sm">{label}</span>
              </a>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-rose-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('contact.address')}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')} *</label>
              <input type="text" {...register('name', { required: true })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.phone')} *</label>
              <input type="tel" placeholder="+998" {...register('phone', { required: true })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
              <input type="email" {...register('email')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')} *</label>
              <textarea rows={4} {...register('message', { required: true })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none resize-none" />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-rose-400 hover:bg-rose-500 disabled:opacity-60 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? t('common.loading') : t('contact.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
