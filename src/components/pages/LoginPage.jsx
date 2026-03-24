import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const GoogleSvg = () => (
  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const { t }                  = useTranslation();
  const { login, googleToken } = useAuth();
  const { isDark }             = useTheme();
  const navigate               = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const user = await googleToken(access_token);
        toast.success('Xush kelibsiz! 👋');
        navigate(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard', { replace: true });
      } catch { toast.error(t('common.error')); }
    },
    onError: () => toast.error('Google orqali kirishda xato'),
  });

  const onSubmit = async ({ email, password }) => {
    try {
      const user = await login(email, password);
      toast.success('Xush kelibsiz! 👋');
      navigate(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
    }
  };

  const panelBg = isDark
    ? 'rgba(30, 0, 40, 0.70)'
    : 'rgba(255,255,255,0.88)';
  const panelBorder = isDark
    ? '1px solid rgba(200,80,180,0.20)'
    : '1px solid rgba(255,220,230,0.80)';
  const labelColor = isDark ? 'rgba(230,190,225,0.90)' : 'rgba(60,20,40,0.75)';
  const textMuted  = isDark ? 'rgba(190,140,185,0.70)' : 'rgba(120,60,80,0.60)';
  const dividerColor = isDark ? 'rgba(200,80,180,0.18)' : 'rgba(200,100,130,0.18)';
  const dividerText  = isDark ? 'rgba(30,0,40,0.7)' : '#fff';
  const dividerTextColor = isDark ? 'rgba(190,130,185,0.65)' : 'rgba(120,60,80,0.55)';

  const googleBg = isDark
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(255,255,255,0.95)';
  const googleBorder = isDark
    ? '2px solid rgba(200,80,180,0.22)'
    : '2px solid rgba(200,100,130,0.20)';
  const googleColor  = isDark ? 'rgba(235,200,230,0.90)' : 'rgba(40,20,30,0.85)';

  return (
    <div className="min-h-[90vh] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #c2185b 0%, #9c27b0 50%, #7b1fa2 100%)' }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 text-center text-white max-w-sm">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Heart className="w-10 h-10 fill-white text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Marry<span style={{ color: '#f9a8d4' }}>Me</span></h2>
          <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Hayotingizdagi eng go'zal lahzalarni biz bilan nishonlang
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[['500+', "To'ylar"], ['6+', 'Yil'], ['4.9★', 'Reyting']].map(([v, l]) => (
              <div key={l} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-xl font-bold">{v}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6"
        style={{ background: 'transparent' }}>
        <div className="w-full max-w-md">
          <div className="rounded-3xl p-8"
            style={{
              background: panelBg,
              border: panelBorder,
              backdropFilter: 'blur(24px)',
              boxShadow: isDark
                ? '0 16px 60px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.07)'
                : '0 16px 60px rgba(200,80,120,0.12), inset 0 1px 0 rgba(255,255,255,0.90)',
            }}>
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <Heart className="w-6 h-6 fill-rose-400 text-rose-400" />
              <span className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#111' }}>
                Marry<span style={{ color: '#f43f5e' }}>Me</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-1" style={{ color: isDark ? 'rgba(245,215,240,0.97)' : '#111' }}>
              {t('auth.login')}
            </h1>
            <p className="text-sm mb-7" style={{ color: textMuted }}>Hisobingizga kiring</p>

            {/* Google */}
            <button type="button" onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all mb-6 hover:-translate-y-0.5"
              style={{ background: googleBg, border: googleBorder, color: googleColor, backdropFilter: 'blur(8px)' }}>
              <GoogleSvg />
              Google orqali kirish
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px" style={{ background: dividerColor }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs font-medium"
                  style={{ background: isDark ? 'rgba(30,0,40,0.7)' : 'rgba(255,255,255,0.9)', color: dividerTextColor }}>
                  yoki email bilan
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: labelColor }}>
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? 'rgba(200,130,190,0.60)' : 'rgba(160,80,110,0.50)' }} />
                  <input type="email" autoComplete="email" placeholder="email@example.com"
                    {...register('email', { required: true })}
                    className="input w-full pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: labelColor }}>
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? 'rgba(200,130,190,0.60)' : 'rgba(160,80,110,0.50)' }} />
                  <input type={showPass ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
                    {...register('password', { required: true })}
                    className="input w-full pl-10 pr-11" />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: isDark ? 'rgba(200,130,190,0.60)' : 'rgba(160,80,110,0.50)' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full text-white py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #e91e63, #9c27b0)',
                  boxShadow: '0 6px 20px rgba(180,0,140,0.40)',
                }}>
                {isSubmitting ? 'Kirish...' : t('auth.login')}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: textMuted }}>
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="font-semibold transition-colors hover:opacity-80" style={{ color: '#e91e63' }}>
                {t('auth.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
