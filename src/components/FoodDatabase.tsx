import React, { useState } from 'react';
import {
  Search,
  Plus,
  Database,
  Filter,
  Check,
  Apple,
  Fish,
  Wheat,
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { FoodItem, MealLogEntry } from '../types';

interface FoodDatabaseProps {
  foodDatabase: FoodItem[];
  onAddFoodToDatabase: (food: FoodItem) => void;
  onAddMealLog: (log: MealLogEntry) => void;
}

export const FoodDatabase: React.FC<FoodDatabaseProps> = ({
  foodDatabase = [],
  onAddFoodToDatabase,
  onAddMealLog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Quick Log Modal State
  const [selectedFoodForLog, setSelectedFoodForLog] = useState<FoodItem | null>(null);
  const [logPortionGrams, setLogPortionGrams] = useState<number>(100);
  const [logMealType, setLogMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  // Custom Food Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<FoodItem['category']>('proteins');
  const [newCalories, setNewCalories] = useState<number>(180);
  const [newProtein, setNewProtein] = useState<number>(20);
  const [newCarbs, setNewCarbs] = useState<number>(10);
  const [newFats, setNewFats] = useState<number>(5);
  const [newServingUnit, setNewServingUnit] = useState('جرام');

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'proteins', label: 'البروتينات' },
    { id: 'grains', label: 'الحبوب والنشويات' },
    { id: 'veg_fruits', label: 'الخضار والفواكه' },
    { id: 'main', label: 'أطباق رئيسية' },
    { id: 'dairy', label: 'الألبان' },
    { id: 'snacks', label: 'وجبات خفيفة ومكسرات' },
    { id: 'beverages', label: 'المشروبات' },
  ];

  const filteredFoods = (foodDatabase || []).filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateFood = () => {
    if (!newName) return;
    const newItem: FoodItem = {
      id: 'custom_f_' + Date.now(),
      name: newName,
      category: newCategory,
      calories: Number(newCalories),
      protein: Number(newProtein),
      carbs: Number(newCarbs),
      fats: Number(newFats),
      servingUnit: newServingUnit,
      servingSizeGrams: 100,
      isCustom: true,
    };
    onAddFoodToDatabase(newItem);
    setNewName('');
    setIsCreateModalOpen(false);
  };

  const handleConfirmLogMeal = () => {
    if (!selectedFoodForLog) return;
    const factor = logPortionGrams / 100;
    const entry: MealLogEntry = {
      id: 'log_from_db_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      mealType: logMealType,
      foodName: selectedFoodForLog.name,
      portionGrams: logPortionGrams,
      calories: Math.round(selectedFoodForLog.calories * factor),
      protein: Math.round(selectedFoodForLog.protein * factor * 10) / 10,
      carbs: Math.round(selectedFoodForLog.carbs * factor * 10) / 10,
      fats: Math.round(selectedFoodForLog.fats * factor * 10) / 10,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
    onAddMealLog(entry);
    setSelectedFoodForLog(null);
    alert(`تمت إضافة ${selectedFoodForLog.name} إلى سجل وجباتك اليوم!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 inline-block">
            دليل التغذية والسعرات
          </span>
          <h2 className="text-2xl font-black">قاعدة بيانات المكونات والأطعمة الشاملة</h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            استعرض القيم الغذائية الدقيقة (سعرات، بروتين، كربوهيدرات، دهون) للأطعمة العربية والعالمية
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة طعام جديد للقاعدة</span>
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المكون أو الطبق (مثل: صدر دجاج، كبسة، شوفان، سلمون)..."
            className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                  {food.servingUnit}
                </span>
                {food.isCustom && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                    مخصص
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm">{food.name}</h3>
              
              <div className="text-xl font-black text-emerald-800 mt-2">
                {food.calories} <span className="text-xs font-bold text-slate-500">سعرة / 100g</span>
              </div>

              {/* Macros Breakdown */}
              <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-slate-100 text-center text-[10px] font-bold">
                <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded-xl">
                  <div>بروتين</div>
                  <div className="font-black text-xs mt-0.5">{food.protein}g</div>
                </div>
                <div className="bg-amber-50 text-amber-800 p-1.5 rounded-xl">
                  <div>كارب</div>
                  <div className="font-black text-xs mt-0.5">{food.carbs}g</div>
                </div>
                <div className="bg-rose-50 text-rose-800 p-1.5 rounded-xl">
                  <div>دهون</div>
                  <div className="font-black text-xs mt-0.5">{food.fats}g</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedFoodForLog(food)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة إلى وجبات اليوم</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add To Meal Modal */}
      {selectedFoodForLog && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">إضافة {selectedFoodForLog.name}</h3>
              <button onClick={() => setSelectedFoodForLog(null)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-800">
              <div>
                <label className="block mb-1 text-slate-600">نوع الوجبة:</label>
                <select
                  value={logMealType}
                  onChange={(e) => setLogMealType(e.target.value as any)}
                  className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
                >
                  <option value="breakfast">الإفطار</option>
                  <option value="lunch">الغداء</option>
                  <option value="dinner">العشاء</option>
                  <option value="snack">وجبة خفيفة</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-600">الكمية المتناولة (جرام):</label>
                <input
                  type="number"
                  value={logPortionGrams}
                  onChange={(e) => setLogPortionGrams(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-slate-50 border rounded-xl text-sm font-black text-emerald-800"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl text-xs text-emerald-900 font-bold flex justify-between">
                <span>السعرات المحسوبة:</span>
                <span className="font-black text-sm">
                  {Math.round(selectedFoodForLog.calories * (logPortionGrams / 100))} سعرة
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => setSelectedFoodForLog(null)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">إلغاء</button>
              <button onClick={handleConfirmLogMeal} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer">إضافة لليوم</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Food Item Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">إضافة صنف غذائي جديد للقاعدة</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-800">
              <div>
                <label className="block mb-1 text-slate-600">اسم المكون أو الطبق:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: مطبق خضار دايت"
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">التصنيف:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="proteins">بروتينات</option>
                  <option value="grains">حبوب ونشويات</option>
                  <option value="veg_fruits">خضار وفواكه</option>
                  <option value="main">أطباق رئيسية</option>
                  <option value="dairy">ألبان</option>
                  <option value="snacks">وجبات خفيفة ومكسرات</option>
                  <option value="beverages">مشروبات</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-600">السعرات لكل 100g:</label>
                  <input
                    type="number"
                    value={newCalories}
                    onChange={(e) => setNewCalories(Number(e.target.value))}
                    className="w-full py-2 px-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">البروتين (g):</label>
                  <input
                    type="number"
                    value={newProtein}
                    onChange={(e) => setNewProtein(Number(e.target.value))}
                    className="w-full py-2 px-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">الكربوهيدرات (g):</label>
                  <input
                    type="number"
                    value={newCarbs}
                    onChange={(e) => setNewCarbs(Number(e.target.value))}
                    className="w-full py-2 px-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">الدهون (g):</label>
                  <input
                    type="number"
                    value={newFats}
                    onChange={(e) => setNewFats(Number(e.target.value))}
                    className="w-full py-2 px-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">إلغاء</button>
              <button onClick={handleCreateFood} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer">حفظ المكون</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
