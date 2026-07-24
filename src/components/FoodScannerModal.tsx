import React, { useState } from 'react';
import { Sparkles, Camera, Upload, CheckCircle2, Flame, AlertCircle, X } from 'lucide-react';
import { MealLogEntry } from '../types';

interface FoodScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMealLog: (log: MealLogEntry) => void;
}

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({
  isOpen,
  onClose,
  onAddMealLog,
}) => {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageBase64(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzePhoto = async () => {
    if (!selectedImageBase64) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedImageBase64 })
      });

      const data = await response.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error(err);
      alert('تعذر تحليل صورة الوجبة حالياً.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmLog = () => {
    if (!analysisResult) return;
    const newLog: MealLogEntry = {
      id: 'scan_log_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      mealType,
      foodName: analysisResult.foodName || 'وجبة مصورة',
      portionGrams: analysisResult.estimatedWeightGram || 250,
      calories: analysisResult.calories || 400,
      protein: analysisResult.protein || 25,
      carbs: analysisResult.carbs || 35,
      fats: analysisResult.fats || 10,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    onAddMealLog(newLog);
    alert(`تمت إضافة "${analysisResult.foodName}" إلى سجل اليوم بنجاح!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-slate-900 text-base">ماسح الوجبات والتحليل البصري الذكي</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Box */}
        {!selectedImageBase64 && (
          <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50">
            <Camera className="w-10 h-10 text-emerald-600 mb-2" />
            <span className="text-xs font-black text-slate-800">اختر أو التقط صورة لوجبتك الغذائية</span>
            <span className="text-[10px] text-slate-400 mt-1">سيتم التعرف على الصنف والسعرات تلقائياً</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}

        {/* Image Preview */}
        {selectedImageBase64 && (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-52">
              <img src={selectedImageBase64} alt="Food Preview" className="w-full object-cover" />
              <button
                onClick={() => { setSelectedImageBase64(null); setAnalysisResult(null); }}
                className="absolute top-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-full text-xs font-bold"
              >
                تغيير الصورة
              </button>
            </div>

            {!analysisResult && (
              <button
                onClick={handleAnalyzePhoto}
                disabled={isAnalyzing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {isAnalyzing ? (
                  <span>جاري التعرف على الوجبة بالسعرات...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>تحليل الوجبة بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Analysis Result Card */}
        {analysisResult && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-3xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-emerald-950 text-base">{analysisResult.foodName}</h4>
              <span className="px-2.5 py-0.5 bg-emerald-200 text-emerald-900 rounded-full font-bold text-[10px]">
                {analysisResult.healthRating || 'صحي'}
              </span>
            </div>

            <p className="text-emerald-800 text-[11px] font-medium">{analysisResult.description}</p>

            <div className="grid grid-cols-4 gap-2 text-center font-bold">
              <div className="bg-white p-2 rounded-xl">
                <div className="text-slate-500 text-[10px]">السعرات</div>
                <div className="text-emerald-900 font-black text-sm">{analysisResult.calories}</div>
              </div>
              <div className="bg-white p-2 rounded-xl">
                <div className="text-slate-500 text-[10px]">البروتين</div>
                <div className="text-emerald-900 font-black text-sm">{analysisResult.protein}g</div>
              </div>
              <div className="bg-white p-2 rounded-xl">
                <div className="text-slate-500 text-[10px]">الكارب</div>
                <div className="text-emerald-900 font-black text-sm">{analysisResult.carbs}g</div>
              </div>
              <div className="bg-white p-2 rounded-xl">
                <div className="text-slate-500 text-[10px]">الدهون</div>
                <div className="text-emerald-900 font-black text-sm">{analysisResult.fats}g</div>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold text-emerald-900">إضافة لوجبة:</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full py-2 px-3 bg-white border border-emerald-300 rounded-xl font-bold"
              >
                <option value="breakfast">الإفطار</option>
                <option value="lunch">الغداء</option>
                <option value="dinner">العشاء</option>
                <option value="snack">وجبة خفيفة</option>
              </select>
            </div>

            <button
              onClick={handleConfirmLog}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl cursor-pointer"
            >
              تأكيد وإضافة للسجل اليومي
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
