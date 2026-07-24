export type DietType = 'balanced' | 'keto' | 'intermittent_fasting' | 'mediterranean' | 'low_carb' | 'vegetarian';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  currentWeightKg: number;
  startingWeightKg: number;
  targetWeightKg: number;
  weeklyGoalKg: number; // e.g. 0.5 or 1.0 kg/week
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietType: DietType;
  dailyCalorieGoal: number;
  proteinGoalG: number;
  carbsGoalG: number;
  fatsGoalG: number;
  waterGoalMl: number;
  streakDays: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'main' | 'proteins' | 'veg_fruits' | 'dairy' | 'grains' | 'snacks' | 'beverages';
  calories: number; // per 100g or serving
  protein: number;
  carbs: number;
  fats: number;
  servingUnit: string; // e.g. "غرام" or "كوب" or "حبة"
  servingSizeGrams: number;
  isCustom?: boolean;
}

export interface MealLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
}

export interface DailyLog {
  date: string;
  waterIntakeMl: number;
  meals: MealLogEntry[];
}

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  hipsCm?: number;
  chestCm?: number;
  notes?: string;
}

export interface MealPlanMeal {
  type: 'الإفطار' | 'الغداء' | 'العشاء' | 'وجبة خفيفة';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  prepTimeMinutes: number;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
}

export interface MealPlan {
  id: string;
  title: string;
  dietType: DietType;
  summary: string;
  dailyTargetCalories: number;
  meals: MealPlanMeal[];
  tips: string[];
}

export interface WearableDevice {
  id: string;
  name: string;
  brand: 'Apple Health' | 'Fitbit' | 'Garmin' | 'Google Fit' | 'Samsung Health' | 'Huawei Health';
  connected: boolean;
  lastSyncTime: string;
  batteryLevel: number;
  stepsToday: number;
  activeCaloriesBurned: number;
  heartRateBpm: number;
  sleepHours: number;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  recipeImage?: string;
  calories?: number;
  prepTimeMinutes?: number;
  likesCount: number;
  userLiked: boolean;
  comments: CommunityComment[];
  timestamp: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  exerciseType: string; // e.g. مشي سريع، جري، تمارين قوة، يوجا، سباحة
  durationMinutes: number;
  intensity: 'خفيف' | 'متوسط' | 'عالي';
  caloriesBurned: number;
  notes?: string;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: 'سعيد' | 'متفائل' | 'هادئ' | 'متعب' | 'متوتر';
  energyLevel: number; // 1-5
  stressLevel: number; // 1-5
  notes?: string;
}

export interface SmartNotificationRule {
  id: string;
  title: string;
  body: string;
  scheduledTime: string; // HH:MM
  category: 'water' | 'meal' | 'weight' | 'motivation' | 'workout';
  enabled: boolean;
}
