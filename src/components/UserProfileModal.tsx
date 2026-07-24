import React, { useState } from 'react';
import { User, Settings, Save, X } from 'lucide-react';
import { UserProfile, DietType } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [gender, setGender] = useState(userProfile.gender);
  const [heightCm, setHeightCm] = useState(userProfile.heightCm);
  const [currentWeightKg, setCurrentWeightKg] = useState(userProfile.currentWeightKg);
  const [targetWeightKg, setTargetWeightKg] = useState(userProfile.targetWeightKg);
  const [dietType, setDietType] = useState<DietType>(userProfile.dietType);
  const [weeklyGoalKg, setWeeklyGoalKg] = useState(userProfile.weeklyGoalKg);

  if (!isOpen) return null;

  const handleSave = () => {
    // Mifflin-St Jeor Formula for BMR
    // Male BMR = 10 * weight + 6.25 * height - 5 * age + 5
    // Female BMR = 10 * weight + 6.25 * height - 5 * age - 161
    let bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
    let tdee = bmr * 1.55; // moderate activity
    let deficit = weeklyGoalKg * 1000 * 7 / 7; // ~7700 kcal per kg -> daily deficit ~1100 for 1kg/week
    let dailyGoal = Math.max(1200, Math.round(tdee - (weeklyGoalKg * 770)));

    const updatedProfile: UserProfile = {
      ...userProfile,
      name,
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      currentWeightKg: Number(currentWeightKg),
      targetWeightKg: Number(targetWeightKg),
      dietType,
      weeklyGoalKg: Number(weeklyGoalKg),
      dailyCalorieGoal: dailyGoal,
      proteinGoalG: Math.round(currentWeightKg * 1.8),
      carbsGoalG: Math.round((dailyGoal * 0.4) / 4),
      fatsGoalG: Math.round((dailyGoal * 0.25) / 9),
    };

    onUpdateProfile(updatedProfile);
    alert('تم تحديث بيانات ملفك الشخصي وإعادة حساب هدف السعرات بنجاح!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-base">إعدادات الملف الشخصي والهدف</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-bold text-slate-800">
          <div>
            <label className="block mb-1 text-slate-600">الاسم:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-slate-600">العمر:</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-600">الجنس:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-slate-600">الطول (سم):</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-600">الوزن الحالي (كجم):</label>
              <input
                type="number"
                step="0.1"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
                className="w-full py-2 px-3 bg-slate-50 border rounded-xl font-black text-emerald-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-slate-600">الوزن المستهدف (كجم):</label>
              <input
                type="number"
                step="0.1"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full py-2 px-3 bg-slate-50 border rounded-xl font-black text-teal-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-slate-600">الهدف الأسبوعي (كجم/أسبوع):</label>
              <select
                value={weeklyGoalKg}
                onChange={(e) => setWeeklyGoalKg(Number(e.target.value))}
                className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
              >
                <option value={0.25}>0.25 كجم/أسبوع</option>
                <option value={0.50}>0.50 كجم/أسبوع</option>
                <option value={0.75}>0.75 كجم/أسبوع</option>
                <option value={1.00}>1.00 كجم/أسبوع</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-600">نوع الحمية الغذائية المفضلة:</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value as DietType)}
              className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
            >
              <option value="balanced">متوازن (High Protein Balanced)</option>
              <option value="keto">كيتو (Low Carb Keto)</option>
              <option value="intermittent_fasting">صيام متقطع (16:8 Fasting)</option>
              <option value="mediterranean">حمية البحر المتوسط (Mediterranean)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">إلغاء</button>
          <button onClick={handleSave} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer">حفظ التغييرات</button>
        </div>

      </div>
    </div>
  );
};
