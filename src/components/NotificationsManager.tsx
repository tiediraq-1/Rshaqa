import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Volume2,
  Clock,
  Sparkles,
  Target,
  Flame,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SmartNotificationRule, UserProfile } from '../types';

interface NotificationsManagerProps {
  notifications: SmartNotificationRule[];
  userProfile: UserProfile;
  onToggleNotification: (id: string) => void;
  onUpdateWeeklyGoal: (weeklyGoalKg: number) => void;
  onTestTriggerAlert: (rule: SmartNotificationRule) => void;
}

export const NotificationsManager: React.FC<NotificationsManagerProps> = ({
  notifications = [],
  userProfile,
  onToggleNotification,
  onUpdateWeeklyGoal,
  onTestTriggerAlert,
}) => {
  const safeNotifications = notifications || [];
  const [selectedGoalRate, setSelectedGoalRate] = useState<number>(userProfile?.weeklyGoalKg || 0.75);

  const goalOptions = [
    { rate: 0.25, title: 'تنزيل بطيء ولطيف', desc: 'خسارة 0.25 كجم/أسبوع • أسهل في الالتزام', calories: 2100 },
    { rate: 0.50, title: 'تنزيل صحي متوازن', desc: 'خسارة 0.50 كجم/أسبوع • النطاق الموصى به عالمياً', calories: 1950 },
    { rate: 0.75, title: 'تنزيل سريع ونشط', desc: 'خسارة 0.75 كجم/أسبوع • نتائج ملحوظة في شهر', calories: 1800 },
    { rate: 1.00, title: 'تنزيل مكثف (حرق أقصى)', desc: 'خسارة 1.00 كجم/أسبوع • يتطلب انضباطاً كاملاً', calories: 1650 },
  ];

  const handleApplyGoalChange = (rate: number) => {
    setSelectedGoalRate(rate);
    onUpdateWeeklyGoal(rate);
    alert(`تم تحديث الهدف الأسبوعي إلى نزول ${rate} كجم/أسبوع وتم تعديل السعرات التلقائي.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 inline-block">
            نظام التنبيهات والأهداف الذكية
          </span>
          <h2 className="text-2xl font-black">نظام التنبيهات الذكي للتحفيز وضبط الهدف</h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            تنبيهات مخصصة لشرب الماء، تسجيل الوجبات، وعبارات تحفيزية يومية تضمن عدم الانقطاع عن الهدف
          </p>
        </div>
      </div>

      {/* Goal Rate Wizard Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>معدل تنزيل الوزن المستهدف أسبوعياً</span>
            </h3>
            <p className="text-xs text-slate-500">اختر وتيرة النزول المناسبة لسرعة حرقك ونمط حياتك</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {goalOptions.map((opt) => {
            const isSelected = selectedGoalRate === opt.rate;
            return (
              <div
                key={opt.rate}
                onClick={() => handleApplyGoalChange(opt.rate)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-emerald-800">-{opt.rate} كجم</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs">{opt.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{opt.desc}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-700">
                  السعرات: ~{opt.calories} سعرة/يوم
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications Rules List */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <span>جدول التنبيهات والتذكيرات الذكية</span>
            </h3>
            <p className="text-xs text-slate-500">قم بتفعيل أو إيقاف التذكيرات التلقائية وتجربتها مباشرة</p>
          </div>
        </div>

        <div className="space-y-3">
          {safeNotifications.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                rule.enabled ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/40 border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl text-white ${
                  rule.category === 'water' ? 'bg-sky-500' : rule.category === 'meal' ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">{rule.title}</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rule.scheduledTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{rule.body}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => onTestTriggerAlert(rule)}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>اختبار التنبيه</span>
                </button>

                <button
                  onClick={() => onToggleNotification(rule.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    rule.enabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {rule.enabled ? 'مفعل' : 'موقوف'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
