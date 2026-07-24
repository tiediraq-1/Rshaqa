import React, { useState } from 'react';
import {
  Dumbbell,
  Smile,
  Zap,
  Flame,
  Plus,
  Trash2,
  Calendar,
  Heart,
  Clock,
  Sparkles
} from 'lucide-react';
import { WorkoutLog, MoodLog } from '../types';

interface WorkoutMoodJournalProps {
  workoutLogs: WorkoutLog[];
  moodLogs: MoodLog[];
  onAddWorkout: (log: WorkoutLog) => void;
  onAddMood: (log: MoodLog) => void;
  onDeleteWorkout: (id: string) => void;
}

export const WorkoutMoodJournal: React.FC<WorkoutMoodJournalProps> = ({
  workoutLogs = [],
  moodLogs = [],
  onAddWorkout,
  onAddMood,
  onDeleteWorkout,
}) => {
  const safeWorkouts = workoutLogs || [];
  const safeMoods = moodLogs || [];
  // Workout Form State
  const [exerciseType, setExerciseType] = useState('مشي سريع في الهواء الطلق');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [intensity, setIntensity] = useState<'خفيف' | 'متوسط' | 'عالي'>('متوسط');
  const [exerciseNotes, setExerciseNotes] = useState('');

  // Mood Form State
  const [selectedMood, setSelectedMood] = useState<MoodLog['mood']>('متفائل');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [moodNotes, setMoodNotes] = useState('');

  const exercisesOptions = [
    'مشي سريع في الهواء الطلق',
    'جري خفيف / ماراثون',
    'تمارين حديد ومقاومة',
    'سباحة حرة',
    'دراجة هوائية ثابتة',
    'يوجا وإطالات',
    'تمارين كارديو HIIT',
    'كرة قدم / رياضات جماعية'
  ];

  const moodsOptions = [
    { label: 'سعيد', emoji: '😃', color: 'bg-emerald-100 text-emerald-800' },
    { label: 'متفائل', emoji: '😊', color: 'bg-teal-100 text-teal-800' },
    { label: 'هادئ', emoji: '😌', color: 'bg-sky-100 text-sky-800' },
    { label: 'متعب', emoji: '😫', color: 'bg-amber-100 text-amber-800' },
    { label: 'متوتر', emoji: '😰', color: 'bg-rose-100 text-rose-800' }
  ];

  // Calculate calories burned estimate based on duration & intensity
  const calculateBurnEstimate = (mins: number, intens: 'خفيف' | 'متوسط' | 'عالي') => {
    let factor = 6; // kcal/min base
    if (intens === 'متوسط') factor = 8.5;
    if (intens === 'عالي') factor = 11.5;
    return Math.round(mins * factor);
  };

  const handleSaveWorkout = () => {
    const burn = calculateBurnEstimate(durationMinutes, intensity);
    const newLog: WorkoutLog = {
      id: 'wk_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      exerciseType,
      durationMinutes: Number(durationMinutes),
      intensity,
      caloriesBurned: burn,
      notes: exerciseNotes || 'تمرين رياضي نشط'
    };
    onAddWorkout(newLog);
    setExerciseNotes('');
    alert(`تم تسجيل تمرين "${exerciseType}" بنجاح! تم حرق ${burn} سعرة.`);
  };

  const handleSaveMood = () => {
    const newLog: MoodLog = {
      id: 'mood_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      energyLevel,
      stressLevel,
      notes: moodNotes || 'ملاحظات عن الحالة النفسية والطاقة'
    };
    onAddMood(newLog);
    setMoodNotes('');
    alert(`تم حفظ مذكرات المزاج والطاقة لليوم!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 inline-block">
            مذكرات الصحة واللياقة
          </span>
          <h2 className="text-2xl font-black">مذكرات النشاط الرياضي والمزاج العام</h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            سجل تمارينك اليومية واستكشف العلاقة بين النشاط البدني وتحسن الحالة النفسية والطاقة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Workout Journal Form & History */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-600" />
              <span>تسجيل تمرين رياضي جديد</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs font-bold text-slate-800">
            <div>
              <label className="block mb-1 text-slate-600">نوع التمرين:</label>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
              >
                {exercisesOptions.map((ex, i) => (
                  <option key={i} value={ex}>{ex}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-slate-600">المدة (دقائق):</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">مستوى الشدة:</label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value as any)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="خفيف">خفيف (Low)</option>
                  <option value="متوسط">متوسط (Moderate)</option>
                  <option value="عالي">عالي الشدة (High HIIT)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 flex items-center justify-between">
              <span>تنسيق الحرق التقديري:</span>
              <span className="text-sm font-black text-amber-800">
                +{calculateBurnEstimate(durationMinutes, intensity)} سعرة محروقة
              </span>
            </div>

            <div>
              <label className="block mb-1 text-slate-600">ملاحظات عن التمرين:</label>
              <input
                type="text"
                placeholder="مثال: قطعت 4 كيلومترات وشعرت براحة كبيرة"
                value={exerciseNotes}
                onChange={(e) => setExerciseNotes(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <button
              onClick={handleSaveWorkout}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl cursor-pointer transition-all shadow-xs"
            >
              حفظ التمرين اليوم
            </button>
          </div>

          {/* Workout History List */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">تمارين السجل الأخيرة:</h4>
            {safeWorkouts.map((wk) => (
              <div key={wk.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{wk.exerciseType}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{wk.durationMinutes} دقيقة • شدة {wk.intensity}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-emerald-800">+{wk.caloriesBurned} سعرة</span>
                  <button onClick={() => onDeleteWorkout(wk.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Mood & Energy Journal Form & History */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Smile className="w-5 h-5 text-teal-600" />
              <span>مذكرات المزاج ومستوى الطاقة</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs font-bold text-slate-800">
            <div>
              <label className="block mb-2 text-slate-600">اختر شعورك العام اليوم:</label>
              <div className="grid grid-cols-5 gap-2">
                {moodsOptions.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setSelectedMood(m.label as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedMood === m.label
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-2xl">{m.emoji}</div>
                    <div className="text-[10px] font-bold mt-1 text-slate-800">{m.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders for Energy & Stress */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>مستوى الطاقة والحيوية:</span>
                  <span className="text-emerald-700">{energyLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>مستوى التوتر والضغط:</span>
                  <span className="text-rose-700">{stressLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-slate-600">انطباعك وملاحظاتك اليومية:</label>
              <textarea
                rows={2}
                placeholder="اكتب ما تشعر به حول تقدمك في التغذية وطاقتك..."
                value={moodNotes}
                onChange={(e) => setMoodNotes(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <button
              onClick={handleSaveMood}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl cursor-pointer transition-all shadow-xs"
            >
              حفظ مذكرات المزاج اليوم
            </button>
          </div>

          {/* Mood History */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">سجل انطباعات المزاج:</h4>
            {safeMoods.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between font-extrabold text-slate-900">
                  <span>الحالة: {m.mood}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{m.date}</span>
                </div>
                <div className="text-[10px] text-slate-600">طاقة: {m.energyLevel}/5 • توتر: {m.stressLevel}/5</div>
                {m.notes && <p className="text-[11px] text-slate-600 italic">"{m.notes}"</p>}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
