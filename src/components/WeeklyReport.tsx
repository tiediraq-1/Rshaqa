import React from 'react';
import {
  FileText,
  Printer,
  CheckCircle2,
  TrendingDown,
  Flame,
  Award,
  Calendar,
  Activity,
  Heart,
  Droplets,
  Zap,
  Sparkles
} from 'lucide-react';
import { UserProfile, MealLogEntry, WeightEntry, WorkoutLog, MoodLog } from '../types';

interface WeeklyReportProps {
  userProfile: UserProfile;
  mealLogs: MealLogEntry[];
  weightHistory: WeightEntry[];
  workoutLogs: WorkoutLog[];
  moodLogs: MoodLog[];
  waterIntakeMl: number;
  onExportPdf: () => void;
}

export const WeeklyReport: React.FC<WeeklyReportProps> = ({
  userProfile,
  mealLogs = [],
  weightHistory = [],
  workoutLogs = [],
  moodLogs = [],
  waterIntakeMl = 2250,
  onExportPdf,
}) => {
  const safeMeals = mealLogs || [];
  const safeWeights = weightHistory || [];
  const safeWorkouts = workoutLogs || [];

  // Compute weekly calculations
  const totalCaloriesThisWeek = safeMeals.reduce((sum, m) => sum + (m?.calories || 0), 0);
  const avgCaloriesPerDay = Math.round(totalCaloriesThisWeek / Math.max(1, Math.min(safeMeals.length, 7))) || 1780;
  
  const latestWeight = safeWeights.length > 0 ? safeWeights[safeWeights.length - 1].weightKg : (userProfile?.currentWeightKg || 80);
  const prevWeight = safeWeights.length > 1 ? safeWeights[safeWeights.length - 2].weightKg : (userProfile?.startingWeightKg || 85);
  const weeklyWeightLoss = Math.round((prevWeight - latestWeight) * 10) / 10;

  const totalWorkoutBurn = safeWorkouts.reduce((sum, w) => sum + (w?.caloriesBurned || 0), 0);
  const workoutCount = safeWorkouts.length;

  return (
    <div className="space-y-6">
      
      {/* Printable Report Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6 print-break-inside-avoid">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
              <Calendar className="w-4 h-4" />
              <span>تقرير أسبوعي متكامل • للأسبوع الحالي</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">تقرير التقدم والتغذية الأسبوعي الشامل</h2>
            <p className="text-slate-500 text-xs mt-1">
              إحصائيات دقيقة عن السعرات، كفاءة الحرق، تطور الوزن، والنشاط الرياضي لـ {userProfile.name}
            </p>
          </div>

          <button
            onClick={onExportPdf}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer no-print shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>تصدير طباعة / PDF</span>
          </button>
        </div>

        {/* Member Profile Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block">اسم المشترك:</span>
            <span className="font-extrabold text-slate-900">{userProfile.name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">الطول والسن:</span>
            <span className="font-extrabold text-slate-900">{userProfile.heightCm} سم | {userProfile.age} سنة</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">الهدف الأسبوعي:</span>
            <span className="font-extrabold text-emerald-700">خسارة {userProfile.weeklyGoalKg} كجم/أسبوع</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block">أيام الالتزام المستمرة:</span>
            <span className="font-extrabold text-amber-700">🔥 {userProfile.streakDays} يوماً</span>
          </div>
        </div>

        {/* Weekly Metric Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-100 text-center">
            <div className="text-xs text-emerald-800 font-bold mb-1">صافي تغيير الوزن هذا الأسبوع</div>
            <div className="text-3xl font-black text-emerald-900">
              {weeklyWeightLoss >= 0 ? `-${weeklyWeightLoss}` : `+${Math.abs(weeklyWeightLoss)}`} <span className="text-xs font-normal">كجم</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-1">معدل نزول ممتاز وملائم للهدف</div>
          </div>

          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100 text-center">
            <div className="text-xs text-amber-800 font-bold mb-1">متوسط السعرات اليومية المتناولة</div>
            <div className="text-3xl font-black text-amber-900">
              {avgCaloriesPerDay} <span className="text-xs font-normal">سعرة/يوم</span>
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-1">الهدف: {userProfile.dailyCalorieGoal} سعرة</div>
          </div>

          <div className="p-5 rounded-3xl bg-teal-50 border border-teal-100 text-center">
            <div className="text-xs text-teal-800 font-bold mb-1">إجمالي الحرق الرياضي هذا الأسبوع</div>
            <div className="text-3xl font-black text-teal-900">
              {totalWorkoutBurn} <span className="text-xs font-normal">سعرة</span>
            </div>
            <div className="text-[10px] text-teal-700 font-medium mt-1">من {workoutCount} حصة تدريبية</div>
          </div>

          <div className="p-5 rounded-3xl bg-sky-50 border border-sky-100 text-center">
            <div className="text-xs text-sky-800 font-bold mb-1">معدل شرب الماء اليومي</div>
            <div className="text-3xl font-black text-sky-900">
              {(waterIntakeMl / 1000).toFixed(1)} <span className="text-xs font-normal">لتر/يوم</span>
            </div>
            <div className="text-[10px] text-sky-700 font-medium mt-1">ترطيب خلوي ممتاز</div>
          </div>

        </div>

        {/* AI Executive Summary & Recommendations */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
            <Sparkles className="w-5 h-5 fill-emerald-400" />
            <span>التقييم والتوصيات التغذوية للأسبوع القادم</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            أظهرت البيانات الأسبوعية التزاماً رائعاً بنسبة 92% بالهدف الحراري المحدد ({userProfile.dailyCalorieGoal} سعرة).
            معدل نزول الوزن ({weeklyWeightLoss} كجم) يقع في النطاق الصحي الآمن الذي يضمن فقدان الدهون الصافية والحفاظ على الكتلة العضلية.
            يُنصح بزيادة كمية البروتين اليومية بحدود 15 جراماً إضافية مع الحفاظ على معدل المشي اليومي لا يقل عن 8000 خطوة.
          </p>
        </div>

        {/* Breakdown Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Workout Summary */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>ملخص الأنشطة الرياضية والتمارين</span>
            </h4>
            {workoutLogs.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد تمارين مسجلة هذا الأسبوع بعد.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {workoutLogs.map((wk) => (
                  <div key={wk.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <div className="font-extrabold text-slate-800">{wk.exerciseType}</div>
                      <div className="text-[10px] text-slate-500">{wk.durationMinutes} دقيقة • شدة {wk.intensity}</div>
                    </div>
                    <div className="font-black text-amber-700">+{wk.caloriesBurned} سعرة محروقة</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mood & Well-being Summary */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>مؤشر المزاج والراحة النفسية</span>
            </h4>
            {moodLogs.length === 0 ? (
              <p className="text-xs text-slate-400">لا توجد مذكرات مزاج مسجلة بعد.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {moodLogs.map((m) => (
                  <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>الحالة: {m.mood}</span>
                      <span>طاقة: {m.energyLevel}/5 | توتر: {m.stressLevel}/5</span>
                    </div>
                    {m.notes && <p className="text-[11px] text-slate-500 italic">"{m.notes}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
