import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  TrendingDown,
  Plus,
  Scale,
  Calendar,
  CheckCircle2,
  Award,
  ArrowDownRight,
  Info
} from 'lucide-react';
import { UserProfile, WeightEntry } from '../types';

interface WeightChartProps {
  userProfile: UserProfile;
  weightHistory: WeightEntry[];
  onAddWeightEntry: (entry: WeightEntry) => void;
}

export const WeightChart: React.FC<WeightChartProps> = ({
  userProfile,
  weightHistory = [],
  onAddWeightEntry,
}) => {
  const safeHistory = weightHistory || [];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState<number>(userProfile?.currentWeightKg || 80);
  const [newWaist, setNewWaist] = useState<number>(94);
  const [newHips, setNewHips] = useState<number>(101);
  const [newChest, setNewChest] = useState<number>(100);
  const [newNote, setNewNote] = useState<string>('');

  // Calculate metrics
  const latestWeight = safeHistory.length > 0 ? safeHistory[safeHistory.length - 1].weightKg : (userProfile?.currentWeightKg || 80);
  const startWeight = userProfile.startingWeightKg;
  const targetWeight = userProfile.targetWeightKg;
  const totalLost = Math.round((startWeight - latestWeight) * 10) / 10;
  const remainingToTarget = Math.max(0, Math.round((latestWeight - targetWeight) * 10) / 10);

  // BMI Calculation: weight (kg) / (height (m))^2
  const heightMeters = userProfile.heightCm / 100;
  const bmi = Math.round((latestWeight / (heightMeters * heightMeters)) * 10) / 10;

  let bmiCategory = 'وزن مثالي';
  let bmiColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (bmi < 18.5) {
    bmiCategory = 'تحت الوزن';
    bmiColor = 'text-sky-600 bg-sky-50 border-sky-200';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'زيادة وزن طفيفة';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (bmi >= 30) {
    bmiCategory = 'سمنة';
    bmiColor = 'text-rose-600 bg-rose-50 border-rose-200';
  }

  // Estimated weeks to reach goal
  const weeksLeft = userProfile.weeklyGoalKg > 0 ? Math.ceil(remainingToTarget / userProfile.weeklyGoalKg) : 0;
  const targetDateEstimated = new Date(Date.now() + weeksLeft * 7 * 86400000).toLocaleDateString('ar-SA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSaveWeight = () => {
    const entry: WeightEntry = {
      id: 'w_entry_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(newWeight),
      waistCm: Number(newWaist),
      hipsCm: Number(newHips),
      chestCm: Number(newChest),
      notes: newNote || 'تسجيل وزن جديد',
    };
    onAddWeightEntry(entry);
    setIsAddModalOpen(false);
  };

  // Recharts custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs shadow-lg border border-slate-800">
          <div className="font-bold text-slate-300">{label}</div>
          <div className="font-black text-emerald-400 text-sm mt-0.5">
            الوزن: {payload[0].value} كجم
          </div>
          {payload[0].payload.notes && (
            <div className="text-[10px] text-slate-400 mt-1 italic">
              "{payload[0].payload.notes}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 inline-block">
            رسم بياني لتطور الوزن
          </span>
          <h2 className="text-2xl font-black">مخطط التطور والقياسات البدنية</h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            تابع نزول وزنك وانخفاض مقاسات الخصر والوركين نحو الهدف المنشود
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>تسجيل وزن جديد اليوم</span>
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-bold mb-1">الوزن الأولي عند البدء</div>
          <div className="text-2xl font-black text-slate-800">{startWeight} <span className="text-xs font-normal">كجم</span></div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">بداية التوثيق</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-xs">
          <div className="text-xs text-emerald-800 font-bold mb-1">الوزن الحالي المسجل</div>
          <div className="text-2xl font-black text-emerald-900">{latestWeight} <span className="text-xs font-normal">كجم</span></div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>إجمالي النزول: {totalLost} كجم</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-bold mb-1">الوزن المستهدف النهائي</div>
          <div className="text-2xl font-black text-teal-800">{targetWeight} <span className="text-xs font-normal">كجم</span></div>
          <div className="text-[10px] text-teal-600 font-medium mt-1">متبقي: {remainingToTarget} كجم</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-bold mb-1">التاريخ المتوقع للوصول</div>
          <div className="text-base font-black text-slate-900 mt-1">{targetDateEstimated}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">بمعدل ~{userProfile.weeklyGoalKg} كجم/أسبوع</div>
        </div>

      </div>

      {/* Main Interactive Weight Chart */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
              <span>منحنى انخفاض الوزن الزمني</span>
            </h3>
            <p className="text-xs text-slate-500">يعرض تطور وزنك مقارنةً بخط الهدف المحدد</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block"></span>
              الوزن الفعلي
            </span>
            <span className="flex items-center gap-1 text-teal-600">
              <span className="w-3 h-0.5 bg-teal-500 inline-block"></span>
              الهدف ({targetWeight} كجم)
            </span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={safeHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={targetWeight} stroke="#0d9488" strokeDasharray="5 5" label={{ value: 'الهدف', fill: '#0d9488', fontSize: 10 }} />
              <Area type="monotone" dataKey="weightKg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#weightGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* BMI & Body Measurements Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BMI Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>مؤشر كتلة الجسم (BMI)</span>
          </h3>

          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-3xl font-black text-slate-900">{bmi}</div>
            <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${bmiColor}`}>
              {bmiCategory}
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold text-slate-600">
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>تحت الوزن:</span>
              <span className="font-bold">&lt; 18.5</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold">
              <span>وزن طبيعي مثالي:</span>
              <span>18.5 - 24.9</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>زيادة وزن:</span>
              <span>25 - 29.9</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>سمنة:</span>
              <span>&gt; 30</span>
            </div>
          </div>
        </div>

        {/* Body Measurements History Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">سجل قياسات الجسم (سم)</h3>
            <span className="text-xs text-slate-500">{weightHistory.length} قياسات مسجلة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5 px-2">التاريخ</th>
                  <th className="py-2.5 px-2">الوزن (كجم)</th>
                  <th className="py-2.5 px-2">محيط الخصر (سم)</th>
                  <th className="py-2.5 px-2">محيط الوركين (سم)</th>
                  <th className="py-2.5 px-2">محيط الصدر (سم)</th>
                  <th className="py-2.5 px-2">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weightHistory.slice().reverse().map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-800">{entry.date}</td>
                    <td className="py-3 px-2 font-black text-emerald-700">{entry.weightKg}</td>
                    <td className="py-3 px-2 text-slate-700 font-medium">{entry.waistCm || '-'}</td>
                    <td className="py-3 px-2 text-slate-700 font-medium">{entry.hipsCm || '-'}</td>
                    <td className="py-3 px-2 text-slate-700 font-medium">{entry.chestCm || '-'}</td>
                    <td className="py-3 px-2 text-slate-500 italic text-[11px]">{entry.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Record Weight Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">تسجيل قياس الوزن اليوم</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold p-1 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-800">
              
              <div>
                <label className="block mb-1 text-slate-600">الوزن الحالي (كجم):</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-emerald-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 text-slate-500 text-[10px]">الخصر (سم)</label>
                  <input
                    type="number"
                    value={newWaist}
                    onChange={(e) => setNewWaist(Number(e.target.value))}
                    className="w-full py-2 px-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 text-[10px]">الوركين (سم)</label>
                  <input
                    type="number"
                    value={newHips}
                    onChange={(e) => setNewHips(Number(e.target.value))}
                    className="w-full py-2 px-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-500 text-[10px]">الصدر (سم)</label>
                  <input
                    type="number"
                    value={newChest}
                    onChange={(e) => setNewChest(Number(e.target.value))}
                    className="w-full py-2 px-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-600">ملاحظة عن الإنجاز اليوم:</label>
                <input
                  type="text"
                  placeholder="مثال: طاقة متجددة ونوم عميق"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">إلغاء</button>
              <button onClick={handleSaveWeight} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer">حفظ القياسات</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
