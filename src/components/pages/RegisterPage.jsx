import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Heart, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

const GoogleSvg = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register: registerUser, googleToken } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        await googleToken(access_token);
        toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz! 🎉");
        navigate('/dashboard', { replace: true });
      } catch { toast.error(t('common.error')); }
    },
    onError: () => toast.error('Google orqali kirishda xato'),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz! 🎉");
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  };

  return (
    <div className="min-h-[90vh] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-400" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10 text-center text-white max-w-sm">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Heart className="w-10 h-10 fill-white text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">MarryMe</h2>
          <p className="text-rose-100 text-lg leading-relaxed mb-10">
            Biz bilan birgalikda unutilmas lahzalar yarating
          </p>
          <div className="space-y-3">
            {[
              { icon: '💍', text: "To'y marosimlarini tashkil qilish" },
              { icon: '📸', text: 'Love Story fotosessiyalar' },
              { icon: '🎂', text: "Tug'ilgan kun va yillik tantanalar" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3">
                <span className="text-lg">{icon}</span>
                <span className="text-sm text-rose-50 text-left">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-rose-50/50 to-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-rose-100/40 p-8 border border-rose-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('auth.register')}</h1>
            <p className="text-gray-500 text-sm mb-6">Yangi hisob yaratish</p>

            {/* Google */}
            <button type="button" onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50/50 rounded-2xl font-medium text-gray-700 transition-all shadow-sm hover:shadow-md mb-5">
              <GoogleSvg />
              Google orqali ro'yxatdan o'tish
            </button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400 font-medium">yoki email bilan</span></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'firstName', label: t('auth.firstName'), ph: 'Ism' },
                  { name: 'lastName',  label: t('auth.lastName'),  ph: 'Familiya' },
                ].map(({ name, label, ph }) => (
                  <div key={name}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input type="text" placeholder={ph}
                        {...register(name, { required: true })}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none" />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" autoComplete="email"
                    {...register('email', { required: true })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('auth.phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" placeholder="+998 90 000 00 00"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t('auth.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} autoComplete="new-password"
                    {...register('password', { required: true, minLength: 6 })}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none" />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-rose-200/60 hover:-translate-y-0.5 active:translate-y-0 mt-1">
                {isSubmitting ? "Ro'yxatdan o'tilmoqda..." : t('auth.register')}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-rose-500 font-semibold hover:text-rose-600">{t('auth.login')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
