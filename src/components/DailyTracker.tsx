import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Droplets,
  Flame,
  Dumbbell,
  Search,
  Sparkles,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Apple
} from 'lucide-react';
import { UserProfile, MealLogEntry, FoodItem } from '../types';

interface DailyTrackerProps {
  userProfile: UserProfile;
  mealLogs?: MealLogEntry[];
  waterIntakeMl?: number;
  onWaterChange?: (newAmountMl: number) => void;
  onUpdateWater?: (newAmountMl: number) => void;
  onAddMealLog: (log: MealLogEntry) => void;
  onDeleteMealLog: (logId: string) => void;
  foodDatabase?: FoodItem[];
  workoutCaloriesBurned?: number;
  stepsCaloriesBurned?: number;
  onOpenScanner?: () => void;
  onOpenFoodScanner?: () => void;
  onOpenAiCoach?: () => void;
  workoutLogs?: any[];
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  userProfile,
  mealLogs = [],
  waterIntakeMl = 2250,
  onWaterChange,
  onUpdateWater,
  onAddMealLog,
  onDeleteMealLog,
  foodDatabase = [],
  workoutCaloriesBurned = 0,
  stepsCaloriesBurned = 0,
  onOpenScanner,
  onOpenFoodScanner,
  onOpenAiCoach,
}) => {
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionGrams, setPortionGrams] = useState<number>(100);

  // Custom Quick Add state
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState<number>(200);
  const [customProtein, setCustomProtein] = useState<number>(15);
  const [customCarbs, setCustomCarbs] = useState<number>(25);
  const [customFats, setCustomFats] = useState<number>(5);

  // Today's date string
  const todayDateStr = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const safeMealLogs = mealLogs || [];
  const safeFoodDb = foodDatabase || [];

  // Calculate totals
  const totalConsumedCalories = safeMealLogs.reduce((acc, m) => acc + (m?.calories || 0), 0);
  const totalProtein = safeMealLogs.reduce((acc, m) => acc + (m?.protein || 0), 0);
  const totalCarbs = safeMealLogs.reduce((acc, m) => acc + (m?.carbs || 0), 0);
  const totalFats = safeMealLogs.reduce((acc, m) => acc + (m?.fats || 0), 0);

  const totalBurned = (workoutCaloriesBurned || 0) + (stepsCaloriesBurned || 0);
  const netCalories = totalConsumedCalories - totalBurned;
  const remainingCalories = (userProfile?.dailyCalorieGoal || 2000) - netCalories;
  const progressPercent = Math.min(Math.round((totalConsumedCalories / (userProfile?.dailyCalorieGoal || 2000)) * 100), 100);

  const mealTypes = [
    { id: 'breakfast', name: 'الإفطار', icon: '🍳', target: 450 },
    { id: 'lunch', name: 'الغداء', icon: '🥗', target: 650 },
    { id: 'dinner', name: 'العشاء', icon: '🥩', target: 450 },
    { id: 'snack', name: 'وجبة خفيفة', icon: '🍎', target: 250 },
  ];

  const handleOpenAddModal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMealType(mealType);
    setSelectedFood(null);
    setSearchQuery('');
    setPortionGrams(100);
    setIsAddModalOpen(true);
  };

  const handleAddSelectedFood = () => {
    if (selectedFood) {
      const factor = portionGrams / 100;
      const newEntry: MealLogEntry = {
        id: 'log_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        mealType: selectedMealType,
        foodName: selectedFood.name,
        portionGrams,
        calories: Math.round(selectedFood.calories * factor),
        protein: Math.round(selectedFood.protein * factor * 10) / 10,
        carbs: Math.round(selectedFood.carbs * factor * 10) / 10,
        fats: Math.round(selectedFood.fats * factor * 10) / 10,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      onAddMealLog(newEntry);
      setIsAddModalOpen(false);
    } else if (customFoodName) {
      const newEntry: MealLogEntry = {
        id: 'log_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        mealType: selectedMealType,
        foodName: customFoodName,
        portionGrams,
        calories: Number(customCalories),
        protein: Number(customProtein),
        carbs: Number(customCarbs),
        fats: Number(customFats),
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      onAddMealLog(newEntry);
      setCustomFoodName('');
      setIsAddModalOpen(false);
    }
  };

  const filteredFoods = (safeFoodDb || []).filter((food) =>
    food && food.name && food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Date Header */}
      <div className="bg-gradient-to-l from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
              <Calendar className="w-4 h-4" />
              <span>{todayDateStr}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">سجل التغذية والسعرات الحرارية اليومية</h2>
            <p className="text-emerald-100/80 text-xs mt-1">
              هدف اليوم: خفض {userProfile.weeklyGoalKg} كجم هذا الأسبوع • {userProfile.dailyCalorieGoal} سعرة حرارية مستهدفة
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenScanner}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>ماسح الوجبات بالذكاء الاصطناعي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Calorie Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Big Calorie Ring & Breakdown */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>توازن السعرات الحرارية</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {remainingCalories >= 0 ? `متبقي ${remainingCalories} سعرة` : `تجاوزت بـ ${Math.abs(remainingCalories)} سعرة`}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold mb-1">المستهدف اليومي</div>
              <div className="text-xl font-black text-slate-800">{userProfile.dailyCalorieGoal}</div>
              <div className="text-[10px] text-slate-400 font-medium">سعرة</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="text-xs text-amber-700 font-semibold mb-1">المتأكول (الطعام)</div>
              <div className="text-xl font-black text-amber-800">+{totalConsumedCalories}</div>
              <div className="text-[10px] text-amber-600 font-medium">سعرة</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-xs text-emerald-700 font-semibold mb-1">المحروق (النشاط)</div>
              <div className="text-xl font-black text-emerald-800">-{totalBurned}</div>
              <div className="text-[10px] text-emerald-600 font-medium">{workoutCaloriesBurned} رياضة + {stepsCaloriesBurned} خطوات</div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
              <div className="text-xs text-teal-800 font-semibold mb-1">الصافي المتبقي</div>
              <div className={`text-xl font-black ${remainingCalories < 0 ? 'text-rose-600' : 'text-teal-900'}`}>
                {remainingCalories}
              </div>
              <div className="text-[10px] text-teal-700 font-medium">سعرة حرة</div>
            </div>

          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
              <span>نسبة استهلاك السعرات</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent > 100
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Macros Breakdown Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm mb-4">توزيع العناصر الكبرى (المكروز)</h3>

          <div className="space-y-4">
            
            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">بروتين</span>
                <span className="text-emerald-700">{totalProtein} / {userProfile.proteinGoalG}g</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${Math.min((totalProtein / userProfile.proteinGoalG) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">كربوهيدرات</span>
                <span className="text-amber-700">{totalCarbs} / {userProfile.carbsGoalG}g</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min((totalCarbs / userProfile.carbsGoalG) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">دهون</span>
                <span className="text-rose-700">{totalFats} / {userProfile.fatsGoalG}g</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${Math.min((totalFats / userProfile.fatsGoalG) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-semibold text-center">
            تأكد من تناول بروتين كافٍ لمنع خسارة الكتلة العضلية!
          </div>
        </div>

      </div>

      {/* Water Intake Tracker Section */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Droplets className="w-8 h-8 fill-white/80" />
            </div>
            <div>
              <div className="text-xs text-sky-100 font-bold mb-0.5">تتبع شرب الماء اليومي</div>
              <h3 className="text-xl font-black">{waterIntakeMl} / {userProfile.waterGoalMl} مل</h3>
              <p className="text-xs text-sky-100/80 mt-1">
                الماء يسارع عملية الأيض ويطرد السموم ويرفع معدل الحرق بنسبة تصل إلى 15%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateWater(waterIntakeMl + 250)}
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-sky-50 rounded-2xl text-xs font-extrabold shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+250 مل (كوب)</span>
            </button>
            <button
              onClick={() => onUpdateWater(waterIntakeMl + 500)}
              className="px-4 py-2.5 bg-sky-400/30 hover:bg-sky-400/40 text-white rounded-2xl text-xs font-extrabold cursor-pointer transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+500 مل (قارورة)</span>
            </button>
            {waterIntakeMl > 0 && (
              <button
                onClick={() => onUpdateWater(Math.max(0, waterIntakeMl - 250))}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white/90 rounded-2xl text-xs font-bold cursor-pointer transition-all"
                title="تراجـع"
              >
                تراجع
              </button>
            )}
          </div>
        </div>

        {/* Water Bar */}
        <div className="mt-4 bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min((waterIntakeMl / userProfile.waterGoalMl) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Meal Categories Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">الوجبات الموثقة اليوم</h3>
          <span className="text-xs text-slate-500 font-bold">{mealLogs.length} صنف مسجل</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealTypes.map((mealType) => {
            const logsForMeal = mealLogs.filter((m) => m.mealType === mealType.id);
            const mealCalories = logsForMeal.reduce((sum, m) => sum + m.calories, 0);

            return (
              <div key={mealType.id} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
                
                {/* Meal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{mealType.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{mealType.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">الموصى به: ~{mealType.target} سعرة</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-slate-100 text-slate-800 px-3 py-1 rounded-full">
                      {mealCalories} سعرة
                    </span>
                    <button
                      onClick={() => handleOpenAddModal(mealType.id as any)}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl cursor-pointer transition-all"
                      title="إضافة وجبة"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Logged Food Items List */}
                {logsForMeal.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-xs text-slate-400 font-medium mb-2">لم تقم بتسجيل {mealType.name} بعد</p>
                    <button
                      onClick={() => handleOpenAddModal(mealType.id as any)}
                      className="text-xs text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة صنف الآن</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logsForMeal.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all"
                      >
                        <div>
                          <div className="text-xs font-extrabold text-slate-800">{log.foodName}</div>
                          <div className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                            <span>{log.portionGrams}g</span>
                            <span>•</span>
                            <span className="text-emerald-700">بروتين: {log.protein}g</span>
                            <span>•</span>
                            <span className="text-amber-700">كارب: {log.carbs}g</span>
                            <span>•</span>
                            <span className="text-rose-700">دهون: {log.fats}g</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900">{log.calories} سعرة</span>
                          <button
                            onClick={() => onDeleteMealLog(log.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  إضافة وجبة لـ {mealTypes.find((m) => m.id === selectedMealType)?.name}
                </h3>
                <p className="text-xs text-slate-500">اختر صنفاً من قاعدة البيانات أو أدخل بيانات خاصة</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن طعام (مثل: أرز، صدر دجاج، شوفان، تمر)..."
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-emerald-500"
              />
            </div>

            {/* Food Selector List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredFoods.map((food) => {
                const isSelected = selectedFood?.id === food.id;
                return (
                  <div
                    key={food.id}
                    onClick={() => {
                      setSelectedFood(food);
                      setCustomFoodName('');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 shadow-xs'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{food.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {food.calories} سعرة حرارية لكل 100 جرام ({food.protein}g بروتين | {food.carbs}g كارب)
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  </div>
                );
              })}
            </div>

            {/* Portion Control if Selected */}
            {selectedFood && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">الكمية المتناولة (جرام):</span>
                  <input
                    type="number"
                    value={portionGrams}
                    onChange={(e) => setPortionGrams(Math.max(1, Number(e.target.value)))}
                    className="w-24 text-center py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-black text-emerald-900"
                  />
                </div>
                <div className="text-xs font-bold text-emerald-800 flex justify-between">
                  <span>السعرات المحسوبة:</span>
                  <span className="text-sm font-black">
                    {Math.round(selectedFood.calories * (portionGrams / 100))} سعرة
                  </span>
                </div>
              </div>
            )}

            {/* Custom Entry Option */}
            {!selectedFood && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="text-xs font-bold text-slate-700">أو إضافة صنف مخصص سريع:</div>
                <input
                  type="text"
                  placeholder="اسم الوجبة (مثلاً: سندويتش تونة بيتي)"
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">السعرات</label>
                    <input
                      type="number"
                      value={customCalories}
                      onChange={(e) => setCustomCalories(Number(e.target.value))}
                      className="w-full py-1.5 px-2 bg-slate-50 border rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">البروتين (g)</label>
                    <input
                      type="number"
                      value={customProtein}
                      onChange={(e) => setCustomProtein(Number(e.target.value))}
                      className="w-full py-1.5 px-2 bg-slate-50 border rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">الكارب (g)</label>
                    <input
                      type="number"
                      value={customCarbs}
                      onChange={(e) => setCustomCarbs(Number(e.target.value))}
                      className="w-full py-1.5 px-2 bg-slate-50 border rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500">الدهون (g)</label>
                    <input
                      type="number"
                      value={customFats}
                      onChange={(e) => setCustomFats(Number(e.target.value))}
                      className="w-full py-1.5 px-2 bg-slate-50 border rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddSelectedFood}
                disabled={!selectedFood && !customFoodName}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
              >
                إضافة لليوم
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
