import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, CheckCircle2, Activity, Utensils, TrendingUp, Camera, Bot, Users, Flame } from 'lucide-react';

export const AuthLandingPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('حدث خطأ أثناء تسجيل الدخول بواسطة Google. يرجى إعادة المحاولة.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Cairo',sans-serif] dir-rtl text-right flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">منصة رَشـاقَـة</h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                Google Auth
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">المنصة الذكية للتغذية وتنزيل الوزن</p>
          </div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>تسجيل الدخول الآن</span>
        </button>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12 z-10 flex flex-col items-center text-center space-y-10 my-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold backdrop-blur-md">
          <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>منصة رشاقة للتنحيف وتتبع السعرات الحرارية بالذكاء الاصطناعي</span>
        </div>

        {/* Title */}
        <div className="space-y-4 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            ابدأ رحلة تحوّلك الصحي مع <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">منصة رشاقة</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium">
            سجّل دخولك أو أنشئ حسابك الجديد بضغطة زر واحدة عبر Google لحفظ بياناتك الصحية، تتبع وجباتك بالماسح الذكي، والحصول على خطط غذائية مخصصة لجسمك.
          </p>
        </div>

        {/* Google Primary Sign In Box */}
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-bold text-white">تسجيل الدخول / إنشاء حساب</h3>
            <p className="text-xs text-slate-400">
              تسجيل آمن ومباشر عن طريق حساب Google المعتمد
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 text-center font-medium">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleGoogleAuth}
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-extrabold text-sm shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 relative group"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-emerald-600 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>المتابعة بـحساب Google</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>حماية وسرية تامة لقواعد بياناتك عبر Google Firebase</span>
          </div>
        </div>

        {/* Platform Core Features Grid */}
        <div className="w-full pt-10 border-t border-slate-800/80">
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-8">
            مميزات منصة رشاقة المتكاملة
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-base">تتبع السعرات اليومية</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                حساب دقيق للبروتين، الكاربوهيدرات، والدهون مع اقتراح الوجبات المناسبة لهدفك.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-base">ماسح الوجبات الذكي</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                التقط صورة لوجبتك ليقوم الذكاء الاصطناعي بتحليل مكوناتها واستخراج السعرات فوراً.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-base">المستشار التغذوي الشخصي</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                استشارات فورية وإجابات مخصصة على أسئلتك الغذائية والرياضية طوال اليوم.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-base">مراقبة التغير بالوزن</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                مخططات بيانية تفاعلية لقياسات الجسم ونسبة الدهون وتقدمك الأسبوعي.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-base">مجتمع رشاقة الصحي</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                شارك الوصفات والأنشطة والتجارب مع أعضاء المنصة لتحفيز مستمر.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-base">حفظ ومزامنة تلقائية</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                مزامنة فورية لكل بياناتك عبر سحابة Google Firebase لتصل إليها من أي مكان.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 z-10">
        <p>© 2026 منصة رشاقة | Rashaqa - جميع الحقوق محفوظة</p>
      </footer>

    </div>
  );
};
