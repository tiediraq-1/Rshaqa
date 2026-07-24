import {
  UserProfile,
  FoodItem,
  WeightEntry,
  MealPlan,
  WearableDevice,
  CommunityPost,
  WorkoutLog,
  MoodLog,
  SmartNotificationRule,
  MealLogEntry
} from '../types';

export const initialUserProfile: UserProfile = {
  name: 'عبدالله محمد',
  age: 28,
  gender: 'male',
  heightCm: 176,
  currentWeightKg: 84.5,
  startingWeightKg: 92.0,
  targetWeightKg: 74.0,
  weeklyGoalKg: 0.75,
  activityLevel: 'moderate',
  dietType: 'balanced',
  dailyCalorieGoal: 1850,
  proteinGoalG: 140,
  carbsGoalG: 185,
  fatsGoalG: 60,
  waterGoalMl: 3000,
  streakDays: 14,
};

export const initialFoods: FoodItem[] = [
  { id: 'f1', name: 'صدر دجاج مشوي', category: 'proteins', calories: 165, protein: 31, carbs: 0, fats: 3.6, servingUnit: 'جرام', servingSizeGrams: 100 },
  { id: 'f2', name: 'أرز أبيض مسلوق', category: 'grains', calories: 130, protein: 2.7, carbs: 28, fats: 0.3, servingUnit: 'جرام', servingSizeGrams: 100 },
  { id: 'f3', name: 'أرز بني مسلوق', category: 'grains', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, servingUnit: 'جرام', servingSizeGrams: 100 },
  { id: 'f4', name: 'سلطة خضراء بالليمون', category: 'veg_fruits', calories: 35, protein: 1.5, carbs: 7, fats: 0.5, servingUnit: 'طبق كبير', servingSizeGrams: 150 },
  { id: 'f5', name: 'شوفان بالحليب والعسل', category: 'grains', calories: 240, protein: 10, carbs: 42, fats: 4.5, servingUnit: 'كوب', servingSizeGrams: 200 },
  { id: 'f6', name: 'بيض مسلوق', category: 'proteins', calories: 155, protein: 12.6, carbs: 1.1, fats: 10.6, servingUnit: 'حبة كبيرة', servingSizeGrams: 50 },
  { id: 'f7', name: 'سمك سلمون مشوي', category: 'proteins', calories: 206, protein: 22, carbs: 0, fats: 12, servingUnit: 'جرام', servingSizeGrams: 100 },
  { id: 'f8', name: 'تفاح أحمر طازج', category: 'veg_fruits', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, servingUnit: 'حبة متوسطة', servingSizeGrams: 150 },
  { id: 'f9', name: 'موز طازج', category: 'veg_fruits', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, servingUnit: 'حبة متوسطة', servingSizeGrams: 120 },
  { id: 'f10', name: 'زبادي يوناني خالي الدسم', category: 'dairy', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, servingUnit: 'علبة', servingSizeGrams: 150 },
  { id: 'f11', name: 'تمر مجدول', category: 'veg_fruits', calories: 277, protein: 1.8, carbs: 75, fats: 0.2, servingUnit: 'حبة', servingSizeGrams: 25 },
  { id: 'f12', name: 'لوز نئ غير مملح', category: 'snacks', calories: 579, protein: 21, carbs: 22, fats: 50, servingUnit: 'حفنة (30 جم)', servingSizeGrams: 30 },
  { id: 'f13', name: 'كبسة دجاج لايت (أرز بسمتي + صدر)', category: 'main', calories: 420, protein: 35, carbs: 50, fats: 8, servingUnit: 'وجبة متكاملة', servingSizeGrams: 350 },
  { id: 'f14', name: 'شاورما دجاج بخبز الصاج الكامل', category: 'main', calories: 380, protein: 28, carbs: 35, fats: 12, servingUnit: 'ساندويتش', servingSizeGrams: 220 },
  { id: 'f15', name: 'شوربة عدس صحية', category: 'main', calories: 160, protein: 9, carbs: 26, fats: 2.5, servingUnit: 'زبدية', servingSizeGrams: 250 },
  { id: 'f16', name: 'حلوم مشوي خفيف الدسم', category: 'dairy', calories: 240, protein: 18, carbs: 2, fats: 18, servingUnit: 'جرام', servingSizeGrams: 100 },
  { id: 'f17', name: 'أفوكادو طازج', category: 'veg_fruits', calories: 160, protein: 2, carbs: 8.5, fats: 15, servingUnit: 'نصف حبة', servingSizeGrams: 100 },
  { id: 'f18', name: 'قهوة سوداء بدون سكر', category: 'beverages', calories: 2, protein: 0.3, carbs: 0, fats: 0, servingUnit: 'كوب', servingSizeGrams: 200 },
  { id: 'f19', name: 'شاي أخضر بالنعناع', category: 'beverages', calories: 1, protein: 0, carbs: 0, fats: 0, servingUnit: 'كوب', servingSizeGrams: 200 },
  { id: 'f20', name: 'تونة بالماء مغسولة', category: 'proteins', calories: 116, protein: 26, carbs: 0, fats: 1, servingUnit: 'علبة', servingSizeGrams: 120 }
];

export const initialMealLogsToday: MealLogEntry[] = [
  {
    id: 'l1',
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast',
    foodName: 'شوفان بالحليب والعسل',
    portionGrams: 200,
    calories: 240,
    protein: 10,
    carbs: 42,
    fats: 4.5,
    timestamp: '08:30 ص'
  },
  {
    id: 'l2',
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast',
    foodName: 'بيض مسلوق',
    portionGrams: 100,
    calories: 155,
    protein: 12.6,
    carbs: 1.1,
    fats: 10.6,
    timestamp: '08:30 ص'
  },
  {
    id: 'l3',
    date: new Date().toISOString().split('T')[0],
    mealType: 'lunch',
    foodName: 'كبسة دجاج لايت (أرز بسمتي + صدر)',
    portionGrams: 350,
    calories: 420,
    protein: 35,
    carbs: 50,
    fats: 8,
    timestamp: '02:15 م'
  },
  {
    id: 'l4',
    date: new Date().toISOString().split('T')[0],
    mealType: 'snack',
    foodName: 'تفاح أحمر طازج',
    portionGrams: 150,
    calories: 78,
    protein: 0.5,
    carbs: 21,
    fats: 0.3,
    timestamp: '05:00 م'
  }
];

export const initialWeightHistory: WeightEntry[] = [
  { id: 'w1', date: '2026-06-01', weightKg: 92.0, waistCm: 104, hipsCm: 110, chestCm: 108, notes: 'بداية الرحلة مع رشاقة!' },
  { id: 'w2', date: '2026-06-08', weightKg: 90.8, waistCm: 103, hipsCm: 109, chestCm: 107, notes: 'التزام كامل بالدايت وشرب الماء' },
  { id: 'w3', date: '2026-06-15', weightKg: 89.5, waistCm: 101, hipsCm: 108, chestCm: 106, notes: 'إضافة مشي يومي 30 دقيقة' },
  { id: 'w4', date: '2026-06-22', weightKg: 88.2, waistCm: 100, hipsCm: 106, chestCm: 105, notes: 'تجاوز مرحلة ثبات الوزن الأولية' },
  { id: 'w5', date: '2026-06-29', weightKg: 87.1, waistCm: 98, hipsCm: 105, chestCm: 104, notes: 'طاقة ممتازة ونوم متواصل' },
  { id: 'w6', date: '2026-07-06', weightKg: 86.0, waistCm: 97, hipsCm: 104, chestCm: 103, notes: 'تحسن في مقاسات الملابس' },
  { id: 'w7', date: '2026-07-13', weightKg: 85.2, waistCm: 96, hipsCm: 103, chestCm: 102, notes: 'ربط الساعة الذكية وزيادة عدد الخطوات' },
  { id: 'w8', date: '2026-07-20', weightKg: 84.5, waistCm: 94.5, hipsCm: 102, chestCm: 101, notes: 'أفضل وزن منذ سنوات!' }
];

export const initialMealPlans: MealPlan[] = [
  {
    id: 'mp1',
    title: 'خطة التنزيل المتوازنة (1850 سعرة)',
    dietType: 'balanced',
    summary: 'خطة صحية متوازنة تعتمد على بروتين عالي وكربوهيدرات معقدة لضمان الشبع واستمرار حرق الدهون.',
    dailyTargetCalories: 1850,
    tips: [
      'احرص على شرب 500 مل ماء قبل كل وجبة رئيسية بـ 20 دقيقة.',
      'استبدل الخبز الأبيض بالخبز البر أو الشوفان الكامل.',
      'تناول العشاء قبل النوم بـ 3 ساعات على الأقل.'
    ],
    meals: [
      {
        type: 'الإفطار',
        name: 'طبق الشوفان المشبع مع البيض المسلوق',
        calories: 395,
        protein: 23,
        carbs: 43,
        fats: 15,
        prepTimeMinutes: 10,
        ingredients: ['50g شوفان كامل', '150ml حليب خالي الدسم', '1 بيضة مسلوقة', 'ملعقة صغيرة عسل طازج'],
        instructions: 'يطهى الشوفان مع الحليب لمدة 5 دقائق على نار هادئة، يضاف العسل ويقدم بجانبه البيض المسلوق.'
      },
      {
        type: 'الغداء',
        name: 'ستيك دجاج مشوي مع أرز الأعشاب وسلطة الفتوش الصحية',
        calories: 550,
        protein: 48,
        carbs: 58,
        fats: 11,
        prepTimeMinutes: 25,
        ingredients: ['180g صدر دجاج', '150g أرز بسمتي طازج', 'خيار وطماطم وبقدونس', 'ملعقة زيت زيتون مع ليمون'],
        instructions: 'يشوى صدر الدجاج بالأعشاب والليمون، ويسلق الأرز بماء الملح والبهارات الخفيفة.'
      },
      {
        type: 'وجبة خفيفة',
        name: 'زبادي يوناني مع التمر واللوز النئ',
        calories: 220,
        protein: 14,
        carbs: 25,
        fats: 6,
        prepTimeMinutes: 3,
        ingredients: ['150g زبادي يوناني', '2 حبة تمر مجدول', '10 حبات لوز'],
        instructions: 'يخلط الزبادي مع قطع التمر واللوز المهروس لوجبة غنية بالبروتين والمغنيسيوم.'
      },
      {
        type: 'العشاء',
        name: 'سلطة التونة بالليمون وزيت الزيتون مع خبز الألياف',
        calories: 380,
        protein: 36,
        carbs: 28,
        fats: 12,
        prepTimeMinutes: 8,
        ingredients: ['علبة تونة بالماء', 'شريحة خبز أسمر بالحبوب', 'جرجير وطماطم كرزية', 'عصير ليمون وزيت زيتون'],
        instructions: 'تصفى التونة وتخلط مع الخضراوات والليمون وتقدم مع الخبز الأسمر المحمص.'
      }
    ]
  },
  {
    id: 'mp2',
    title: 'خطة الكيتو السريعة لحرق الدهون (1600 سعرة)',
    dietType: 'keto',
    summary: 'حمية منخفضة الكربوهيدرات مرتفعة الدهون الصحية لتحفيز الجسم على الدخول في الحالة الكيتونية.',
    dailyTargetCalories: 1600,
    tips: ['شرب الماء بكثرة مع تعويض الصوديوم والبوتاسيوم.', 'استخدام زيت الزيتون وزيت الزبدة الطبيعية.'],
    meals: [
      {
        type: 'الإفطار',
        name: 'أومليت البيض بالجبن والأفوكادو',
        calories: 450,
        protein: 24,
        carbs: 4,
        fats: 38,
        prepTimeMinutes: 10,
        ingredients: ['3 بيضات', '50g جبن شيدر', 'نصف حبة أفوكادو', 'ملعقة زبدة طبيعية'],
        instructions: 'يخفق البيض ويطهى بالزبدة ويحشى بالجبن والأفوكادو.'
      },
      {
        type: 'الغداء',
        name: 'سلمون مشوي بالزبدة والليمون مع بروكلي سوتيه',
        calories: 580,
        protein: 42,
        carbs: 6,
        fats: 44,
        prepTimeMinutes: 20,
        ingredients: ['200g فيليه سلمون', '100g بروكلي طازج', 'ثوم وزبدة وزيت زيتون'],
        instructions: 'يشوى السلمون ويشوح البروكلي مع الثوم والزبدة.'
      },
      {
        type: 'العشاء',
        name: 'سلطة دجاج بالمايونيز الصحي والجوز',
        calories: 410,
        protein: 35,
        carbs: 5,
        fats: 28,
        prepTimeMinutes: 12,
        ingredients: ['150g دجاج مطبوخ', '2 ملعقة مايونيز كيتو', 'جرجير وخس', '30g جوز'],
        instructions: 'يخلط الدجاج مع المايونيز والجوز ويقدم فوق فراش من الورقيات.'
      }
    ]
  },
  {
    id: 'mp3',
    title: 'خطة الصيام المتقطع (16:8) المتطورة',
    dietType: 'intermittent_fasting',
    summary: 'تعتمد على الصيام لمدة 16 ساعة مع نافذة أكل 8 ساعات لتسريع استهلاك مخزون الدهون وتجديد الخلايا.',
    dailyTargetCalories: 1750,
    tips: ['السماح بالماء والقهوة السوداء والشاي بدون سكر أثناء ساعات الصيام.'],
    meals: [
      {
        type: 'الإفطار',
        name: 'وجبة كسر الصيام: بروتين شيك بالشوفان والموز والزبادي',
        calories: 420,
        protein: 32,
        carbs: 52,
        fats: 8,
        prepTimeMinutes: 5,
        ingredients: ['سكوب واي بروتين', '1 موزة', '30g شوفان', '200ml حليب خالي الدسم'],
        instructions: 'تخلط جميع المكونات للخلاط لكسر الصيام بسلاسة وامتصاص سريع.'
      },
      {
        type: 'الغداء',
        name: 'طبق شاورما دجاج صحي مع البطاطس المشوية بالأيرفراير',
        calories: 620,
        protein: 52,
        carbs: 64,
        fats: 14,
        prepTimeMinutes: 20,
        ingredients: ['200g صدر دجاج متبل', '150g بطاطس مشوية', 'سلطة ثومية دايت خفيفة'],
        instructions: 'تشوى قطع الدجاج وتطهى البطاطس بالقلاية الهوائية بدون زيوت زائدة.'
      },
      {
        type: 'العشاء',
        name: 'وجبة قبل بدء الصيام: جبن قريش مع زعتـر ورغيف بر وسلطة',
        calories: 380,
        protein: 30,
        carbs: 35,
        fats: 10,
        prepTimeMinutes: 7,
        ingredients: ['200g جبن قريش طازج', '1 خبز أسمر كامل', 'خيار وطماطم وزيت زيتون'],
        instructions: 'تخلط الجبنة مع الزعتر وزيت الزيتون وتقدم مع الخبز والخضار لضمان الشبع الممتد.'
      }
    ]
  }
];

export const initialWearables: WearableDevice[] = [
  {
    id: 'w_apple',
    name: 'ساعة أبل الرياضية',
    brand: 'Apple Health',
    connected: true,
    lastSyncTime: 'منذ 10 دقائق',
    batteryLevel: 88,
    stepsToday: 9420,
    activeCaloriesBurned: 420,
    heartRateBpm: 72,
    sleepHours: 7.5
  },
  {
    id: 'w_fitbit',
    name: 'سوار فيتبت تراك 5',
    brand: 'Fitbit',
    connected: false,
    lastSyncTime: 'الأمس 11:30 م',
    batteryLevel: 45,
    stepsToday: 0,
    activeCaloriesBurned: 0,
    heartRateBpm: 0,
    sleepHours: 0
  },
  {
    id: 'w_garmin',
    name: 'جارمن فوررنر 255',
    brand: 'Garmin',
    connected: false,
    lastSyncTime: 'غير متصل',
    batteryLevel: 95,
    stepsToday: 0,
    activeCaloriesBurned: 0,
    heartRateBpm: 0,
    sleepHours: 0
  },
  {
    id: 'w_samsung',
    name: 'ساعة سامسونج جالاكسي واش 6',
    brand: 'Samsung Health',
    connected: true,
    lastSyncTime: 'منذ ساعة',
    batteryLevel: 74,
    stepsToday: 8150,
    activeCaloriesBurned: 365,
    heartRateBpm: 68,
    sleepHours: 8.0
  }
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'cp1',
    authorName: 'سارة العتيبي',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'وصفة الشاورما الصحولية بدون دهون - نقصت 12 كجم بها!',
    content: 'أشارككم اليوم وصفتي المفضلة للشاورما المنزلية باستخدام صدر الدجاج المتبل بالزبادي والليمون والبهارات العربية، مطبوخة بقطرة زيت واحدة على المقلاة الهوائية. طعم لذيذ ومشبع جداً!',
    calories: 340,
    prepTimeMinutes: 15,
    likesCount: 38,
    userLiked: true,
    timestamp: 'منذ ساعتين',
    comments: [
      { id: 'c1', authorName: 'خالد العنزي', content: 'ماشاء الله تجنن! هل ينفع نستخدم خبز التورتيلا الأسمر؟', timestamp: 'منذ ساعة' },
      { id: 'c2', authorName: 'سارة العتيبي', content: 'نعم بالتأكيد! خبز الشوفان أو التورتيلا الأسمر ممتاز جداً.', timestamp: 'منذ 45 دقيقة' }
    ]
  },
  {
    id: 'cp2',
    authorName: 'د. يوسف الشمري',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    title: 'كيف تتغلب على ثبات الوزن في منتصف الرحلة؟',
    content: 'ثبات الوزن أمر طبيعي كبديل للتكيف الأيضي. أنصحك بكسر الروتين الغذائي ليوم واحد (Refeed Day) بزيادة الكربوهيدرات المعقدة، أو تغيير أوقات التمارين وزيادة حدة المشي!',
    likesCount: 89,
    userLiked: false,
    timestamp: 'منذ 5 ساعات',
    comments: [
      { id: 'c3', authorName: 'مريم القحطاني', content: 'نصيحة ذهبية دكتور، بالفعل كان وزني ثابت أسبوعين وانفك العقدة مع كسر الروتين!', timestamp: 'منذ 3 ساعات' }
    ]
  },
  {
    id: 'cp3',
    authorName: 'فهد البقمي',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    title: 'سناك بروتيني سريع: زبادي يوناني مع زبدة الفول السوداني والقرفة',
    content: 'وجبة سريعة جداً في أقل من دقيقتين تعطيك 20 جرام بروتين وتطرد رغبة تناول الحلويات في المساء.',
    calories: 210,
    prepTimeMinutes: 2,
    likesCount: 45,
    userLiked: false,
    timestamp: 'منذ يوم',
    comments: []
  }
];

export const initialWorkoutLogs: WorkoutLog[] = [
  {
    id: 'wk1',
    date: new Date().toISOString().split('T')[0],
    exerciseType: 'مشي سريع في الهواء الطلق',
    durationMinutes: 45,
    intensity: 'متوسط',
    caloriesBurned: 260,
    notes: 'خطوات منتظمة ونبضات قلب متوازنة'
  },
  {
    id: 'wk2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    exerciseType: 'تمارين قوة ومقاومة للجسم',
    durationMinutes: 40,
    intensity: 'عالي',
    caloriesBurned: 310,
    notes: 'تركيز على الجزء العلوي والبطن'
  }
];

export const initialMoodLogs: MoodLog[] = [
  {
    id: 'm1',
    date: new Date().toISOString().split('T')[0],
    mood: 'متفائل',
    energyLevel: 4,
    stressLevel: 2,
    notes: 'شعر بنشاط كبير بعد تناول وجبة الإفطار الصحية وتجاوز هدف الخطوات اليومي.'
  },
  {
    id: 'm2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    mood: 'سعيد',
    energyLevel: 5,
    stressLevel: 1,
    notes: 'نوم عميق ونسبة حرق ممتازة طوال اليوم.'
  }
];

export const initialNotificationRules: SmartNotificationRule[] = [
  { id: 'n1', title: 'تذكير شرب الماء', body: 'حان وقت شرب كوب ماء طازج للتحفيز الأيضي والحفاظ على نضارتك!', scheduledTime: '10:00', category: 'water', enabled: true },
  { id: 'n2', title: 'تنسيق وجبة الغداء', body: 'تأكد من تسجيل مكونات غدائك في تطبيق رشاقة لضمان عدم تجاوز السعرات!', scheduledTime: '13:30', category: 'meal', enabled: true },
  { id: 'n3', title: 'تذكير تسجيل الوزن الأسبوعي', body: 'صباح الخير! حان موعد القياس الأسبوعي لرؤية إنجازك الرائع!', scheduledTime: '07:30', category: 'weight', enabled: true },
  { id: 'n4', title: 'جرعة تحفيز يومية', body: '«كل خطوة تخطوها اليوم تقربك من جسدك المثالي وصحتك المستدامة» 🔥', scheduledTime: '18:00', category: 'motivation', enabled: true },
  { id: 'n5', title: 'تذكير النشاط الرياضي', body: 'حان موعد 30 دقيقة مشي أو تمارين سويدية لتنشيط الدورة الدموية!', scheduledTime: '19:30', category: 'workout', enabled: true }
];
