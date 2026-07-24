import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  Plus,
  BookOpen,
  Filter,
  Bot,
  ListOrdered
} from 'lucide-react';
import { MealPlan, DietType, MealLogEntry, UserProfile } from '../types';

interface MealPlansProps {
  mealPlans: MealPlan[];
  userProfile: UserProfile;
  onAddMealLog: (log: MealLogEntry) => void;
  onOpenAiCoach: () => void;
}

export const MealPlans: React.FC<MealPlansProps> = ({
  mealPlans = [],
  userProfile,
  onAddMealLog,
  onOpenAiCoach
}) => {
  const safePlans = mealPlans || [];
  const [selectedDietFilter, setSelectedDietFilter] = useState<string>('all');
  const [activePlan, setActivePlan] = useState<MealPlan | null>(safePlans.length > 0 ? safePlans[0] : null);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [aiCalories, setAiCalories] = useState<number>(userProfile?.dailyCalorieGoal || 1800);
  const [aiDietType, setAiDietType] = useState<DietType>(userProfile?.dietType || 'balanced');
  const [aiAllergies, setAiAllergies] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);

  const dietFilterButtons = [
    { id: 'all', label: 'جميع الحميات' },
    { id: 'balanced', label: 'متوازن' },
    { id: 'keto', label: 'كيتو' },
    { id: 'intermittent_fasting', label: 'صيام متقطع' },
  ];

  const filteredPlans = selectedDietFilter === 'all'
    ? safePlans
    : safePlans.filter((mp) => mp.dietType === selectedDietFilter);

  const handleApplyMealToLog = (mealName: string, calories: number, protein: number, carbs: number, fats: number, mealTypeStr: string) => {
    let typeKey: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'breakfast';
    if (mealTypeStr.includes('غداء')) typeKey = 'lunch';
    else if (mealTypeStr.includes('عشاء')) typeKey = 'dinner';
    else if (mealTypeStr.includes('خفيفة') || mealTypeStr.includes('سناك')) typeKey = 'snack';

    const newLog: MealLogEntry = {
      id: 'plan_log_' + Date.now() + Math.random(),
      date: new Date().toISOString().split('T')[0],
      mealType: typeKey,
      foodName: mealName,
      portionGrams: 250,
      calories,
      protein,
      carbs,
      fats,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    onAddMealLog(newLog);
    alert(`تمت إضافة "${mealName}" إلى سجل التتبع اليومي بنجاح! 🎉`);
  };

  const handleGenerateAiMealPlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietType: aiDietType,
          targetCalories: aiCalories,
          allergies: aiAllergies,
          goal: 'تنزيل الوزن بشكل صحي'
        })
      });

      const data = await response.json();
      if (data.plan) {
        const newMealPlan: MealPlan = {
          id: 'ai_plan_' + Date.now(),
          title: data.plan.title || 'خطة وجبات ذكية مخصصة',
          dietType: aiDietType,
          summary: data.plan.summary || 'خطة ولدت خصيصاً عبر الذكاء الاصطناعي لتتناسب مع أهدافك.',
          dailyTargetCalories: data.plan.dailyTargetCalories || aiCalories,
          tips: data.plan.tips || ['الالتزام بتناول الوجبات في أوقاتها.'],
          meals: (data.plan.meals || []).map((m: any) => ({
            type: m.type || 'وجبة',
            name: m.name || 'وجبة صحية',
            calories: m.calories || 400,
            protein: m.protein || 25,
            carbs: m.carbs || 35,
            fats: m.fats || 10,
            prepTimeMinutes: m.prepTimeMinutes || 15,
            ingredients: m.ingredients || ['مكونات صحية طازجة'],
            instructions: m.instructions || 'قم بتحضير المكونات بشكل صحي مشوي أو مسلوق.'
          }))
        };

        setGeneratedPlan(newMealPlan);
        setActivePlan(newMealPlan);
      }
    } catch (err) {
      console.error(err);
      alert('تعذر توليد الخطة بالذكاء الاصطناعي حالياً، يمكنك تصفح الخطط المتاحة.');
    } finally {
      setIsGenerating(false);
      setIsAiGeneratorOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 inline-block">
            خطط غذائية علمية متوازنة
          </span>
          <h2 className="text-2xl font-black">خطط الوجبات الصحيات المخصصة لتنزيل الوزن</h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            اختر الخطة الأنسب لأسلوب حياتك أو دع الذكاء الاصطناعي ينشئ لك خطة مخصصة بالكامل
          </p>
        </div>

        <button
          onClick={() => setIsAiGeneratorOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>توليد خطة مخصصة بالذكاء الاصطناعي</span>
        </button>
      </div>

      {/* Diet Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {dietFilterButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSelectedDietFilter(btn.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedDietFilter === btn.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Main Meal Plan Details View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Plans Navigation List */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>الخطط الغذائية المقترحة</span>
          </h3>

          <div className="space-y-3">
            {generatedPlan && (
              <div
                onClick={() => setActivePlan(generatedPlan)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border-emerald-400 shadow-xs ${
                  activePlan?.id === generatedPlan.id ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-800 text-[10px] font-black mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مولدة بالذكاء الاصطناعي</span>
                </div>
                <h4 className="font-black text-slate-900 text-sm">{generatedPlan.title}</h4>
                <div className="text-xs text-slate-600 mt-1 font-bold">
                  {generatedPlan.dailyTargetCalories} سعرة اليوم
                </div>
              </div>
            )}

            {filteredPlans.map((plan) => {
              const isSelected = activePlan?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setActivePlan(plan)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {plan.dietType === 'balanced' ? 'متوازن' : plan.dietType === 'keto' ? 'كيتو' : 'صيام متقطع'}
                    </span>
                    <span className="text-xs font-black text-emerald-800">{plan.dailyTargetCalories} سعرة</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mt-2">{plan.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{plan.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Plan Details & Meals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full">
                  استهداف: {activePlan.dailyTargetCalories} سعرة حرارية يومياً
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{activePlan.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{activePlan.summary}</p>
              </div>
            </div>

            {/* Nutrition Tips */}
            {activePlan.tips && activePlan.tips.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>نصائح لضمان نجاح الخطة:</span>
                </h4>
                <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside font-medium">
                  {activePlan.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meals List */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">الوجبات المحددة بالخطة:</h4>

              {activePlan.meals.map((meal, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                        {meal.type}
                      </span>
                      <h5 className="font-extrabold text-slate-900 text-sm">{meal.name}</h5>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-xs font-black text-slate-800">{meal.calories} سعرة</div>
                      <button
                        onClick={() => handleApplyMealToLog(meal.name, meal.calories, meal.protein, meal.carbs, meal.fats, meal.type)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        title="إضافة للتتبع اليومي"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة لليوم</span>
                      </button>
                    </div>
                  </div>

                  {/* Macros Badges */}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">بروتين: {meal.protein}g</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">كارب: {meal.carbs}g</span>
                    <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">دهون: {meal.fats}g</span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.prepTimeMinutes} دقيقة تحضير
                    </span>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-700 mb-1">المكونات:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {meal.ingredients.map((ing, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-lg">
                          • {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 font-medium">
                    <span className="font-bold text-slate-800">طريقة التحضير: </span>
                    {meal.instructions}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* AI Generator Modal */}
      {isAiGeneratorOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-lg">مولد الخطط الذكي بالذكاء الاصطناعي</h3>
              </div>
              <button
                onClick={() => setIsAiGeneratorOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-800">
              
              <div>
                <label className="block mb-1 text-slate-600">هدف السعرات اليومي:</label>
                <input
                  type="number"
                  value={aiCalories}
                  onChange={(e) => setAiCalories(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">نوع الحمية المفضل:</label>
                <select
                  value={aiDietType}
                  onChange={(e) => setAiDietType(e.target.value as DietType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="balanced">متوازن (High Protein Balanced)</option>
                  <option value="keto">كيتو (Low Carb Keto)</option>
                  <option value="intermittent_fasting">صيام متقطع (16:8 Fasting)</option>
                  <option value="mediterranean">حمية البحر المتوسط (Mediterranean)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-600">أي أطعمة ترغب باستبعادها أو حساسيات غذائية:</label>
                <input
                  type="text"
                  value={aiAllergies}
                  onChange={(e) => setAiAllergies(e.target.value)}
                  placeholder="مثال: بدون حليب، حساسيات المكسرات، لا أحب السمك..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsAiGeneratorOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleGenerateAiMealPlan}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                {isGenerating ? (
                  <span>جاري توليد الخطة بالذكاء الاصطناعي...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد الخطة الآن</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
