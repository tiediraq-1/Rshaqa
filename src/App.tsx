import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DailyTracker } from './components/DailyTracker';
import { MealPlans } from './components/MealPlans';
import { WeightChart } from './components/WeightChart';
import { WeeklyReport } from './components/WeeklyReport';
import { WearablesSync } from './components/WearablesSync';
import { FoodDatabase } from './components/FoodDatabase';
import { CommunityFeed } from './components/CommunityFeed';
import { WorkoutMoodJournal } from './components/WorkoutMoodJournal';
import { NotificationsManager } from './components/NotificationsManager';

import { AiNutritionCoachModal } from './components/AiNutritionCoachModal';
import { FoodScannerModal } from './components/FoodScannerModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AuthLandingPage } from './components/AuthLandingPage';

import {
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  saveMealLogToFirestore,
  deleteMealLogFromFirestore,
  subscribeMealLogs,
  saveWeightEntryToFirestore,
  subscribeWeightHistory,
  saveWorkoutLogToFirestore,
  deleteWorkoutLogFromFirestore,
  subscribeWorkoutLogs,
  saveMoodLogToFirestore,
  subscribeMoodLogs,
  saveFoodItemToFirestore,
  subscribeCustomFoods,
  saveCommunityPostToFirestore,
  subscribeCommunityPosts,
  toggleLikeCommunityPost,
  addCommentToCommunityPost
} from './lib/firebaseDb';

import {
  initialUserProfile,
  initialMealLogsToday,
  initialWeightHistory,
  initialMealPlans,
  initialWearables,
  initialFoods,
  initialCommunityPosts,
  initialWorkoutLogs,
  initialMoodLogs,
  initialNotificationRules,
} from './data/initialData';

import {
  MealLogEntry,
  WeightEntry,
  FoodItem,
  CommunityPost,
  WorkoutLog,
  MoodLog,
  SmartNotificationRule,
  UserProfile,
  WearableDevice
} from './types';
import { Bell, Sparkles, X } from 'lucide-react';

function MainApp() {
  const { currentUser, loading } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [mealLogs, setMealLogs] = useState<MealLogEntry[]>(initialMealLogsToday);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>(initialWeightHistory);
  const [mealPlans, setMealPlans] = useState(initialMealPlans);
  const [wearables, setWearables] = useState<WearableDevice[]>(initialWearables);
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(initialFoods);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(initialWorkoutLogs);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(initialMoodLogs);
  const [notifications, setNotifications] = useState<SmartNotificationRule[]>(initialNotificationRules);
  
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(2250);
  const [activeTab, setActiveTab] = useState<string>('daily');

  // Modals state
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isFoodScannerOpen, setIsFoodScannerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [activeToastAlert, setActiveToastAlert] = useState<SmartNotificationRule | null>(null);

  // Sync Firebase when currentUser changes
  useEffect(() => {
    if (!currentUser) return;

    // Load or initialize User Profile in Firestore
    getUserProfileFromFirestore(currentUser.uid).then((profile) => {
      if (profile) {
        setUserProfile(profile);
      } else {
        const newProfile: UserProfile = {
          ...initialUserProfile,
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'مستخدم رشاقة',
        };
        setUserProfile(newProfile);
        saveUserProfileToFirestore(currentUser.uid, newProfile);
      }
    });

    // Subscriptions for real-time Firestore synchronization
    const unsubMeals = subscribeMealLogs(currentUser.uid, (remoteMeals) => {
      if (remoteMeals && remoteMeals.length > 0) {
        setMealLogs(remoteMeals);
      }
    });

    const unsubWeight = subscribeWeightHistory(currentUser.uid, (remoteEntries) => {
      if (remoteEntries && remoteEntries.length > 0) {
        setWeightHistory(remoteEntries);
      }
    });

    const unsubWorkouts = subscribeWorkoutLogs(currentUser.uid, (remoteWorkouts) => {
      if (remoteWorkouts && remoteWorkouts.length > 0) {
        setWorkoutLogs(remoteWorkouts);
      }
    });

    const unsubMoods = subscribeMoodLogs(currentUser.uid, (remoteMoods) => {
      if (remoteMoods && remoteMoods.length > 0) {
        setMoodLogs(remoteMoods);
      }
    });

    const unsubFoods = subscribeCustomFoods(currentUser.uid, (remoteFoods) => {
      if (remoteFoods && remoteFoods.length > 0) {
        // Merge custom foods with initial dataset
        setFoodDatabase((prev) => {
          const ids = new Set(prev.map((f) => f.id));
          const newItems = remoteFoods.filter((f) => !ids.has(f.id));
          return [...newItems, ...prev];
        });
      }
    });

    return () => {
      unsubMeals();
      unsubWeight();
      unsubWorkouts();
      unsubMoods();
      unsubFoods();
    };
  }, [currentUser]);

  // Subscribe to community posts globally
  useEffect(() => {
    const unsubCommunity = subscribeCommunityPosts((remotePosts) => {
      if (remotePosts && remotePosts.length > 0) {
        setCommunityPosts(remotePosts);
      }
    });
    return () => unsubCommunity();
  }, []);

  // Update Profile Wrapper
  const handleUpdateUserProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    if (currentUser) {
      saveUserProfileToFirestore(currentUser.uid, newProfile);
    }
  };

  // Meal Logs handlers
  const handleAddMealLog = (newLog: MealLogEntry) => {
    setMealLogs((prev) => [newLog, ...prev]);
    if (currentUser) {
      saveMealLogToFirestore(currentUser.uid, newLog);
    }
  };

  const handleDeleteMealLog = (id: string) => {
    setMealLogs((prev) => prev.filter((m) => m.id !== id));
    if (currentUser) {
      deleteMealLogFromFirestore(currentUser.uid, id);
    }
  };

  // Weight Entry Handler
  const handleAddWeightEntry = (newEntry: WeightEntry) => {
    setWeightHistory((prev) => [...prev, newEntry]);
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        currentWeightKg: newEntry.weightKg,
      };
      if (currentUser) {
        saveUserProfileToFirestore(currentUser.uid, updated);
      }
      return updated;
    });
    if (currentUser) {
      saveWeightEntryToFirestore(currentUser.uid, newEntry);
    }
  };

  // Wearables handlers
  const handleToggleWearableConnect = (deviceId: string) => {
    setWearables((prev) =>
      prev.map((w) => (w.id === deviceId ? { ...w, connected: !w.connected } : w))
    );
  };

  const handleSyncWearableNow = (deviceId: string) => {
    const device = wearables.find((w) => w.id === deviceId);
    if (!device) return;

    const updatedSteps = device.stepsToday + 1200;
    const updatedBurn = device.activeCaloriesBurned + 80;

    setWearables((prev) =>
      prev.map((w) =>
        w.id === deviceId
          ? {
              ...w,
              stepsToday: updatedSteps,
              activeCaloriesBurned: updatedBurn,
              lastSyncTime: 'الآن',
            }
          : w
      )
    );

    const syncWorkoutLog: WorkoutLog = {
      id: 'sync_wk_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      exerciseType: `مزامنة خطوات تلقائية (${device.name})`,
      durationMinutes: 35,
      intensity: 'متوسط',
      caloriesBurned: 80,
      notes: 'تمت المزامنة من الجهاز القابل للارتداء',
    };
    handleAddWorkoutLog(syncWorkoutLog);
  };

  // Food Database handlers
  const handleAddFoodToDatabase = (food: FoodItem) => {
    setFoodDatabase((prev) => [food, ...prev]);
    if (currentUser) {
      saveFoodItemToFirestore(currentUser.uid, food);
    }
  };

  // Community Feed handlers
  const handleTogglePostLike = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.userLiked;
          return {
            ...p,
            userLiked: !isLiked,
            likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
    const targetPost = communityPosts.find((p) => p.id === postId);
    if (targetPost) {
      toggleLikeCommunityPost(postId, targetPost.userLiked);
    }
  };

  const handleAddCommentToPost = (postId: string, commentText: string) => {
    const comment = {
      id: 'c_' + Date.now(),
      authorName: currentUser?.displayName || userProfile.name,
      content: commentText,
      timestamp: 'الآن',
    };

    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, comment],
          };
        }
        return p;
      })
    );

    addCommentToCommunityPost(postId, comment);
  };

  const handleCreatePost = (newPostData: Omit<CommunityPost, 'id' | 'likesCount' | 'userLiked' | 'comments' | 'timestamp'>) => {
    const post: CommunityPost = {
      ...newPostData,
      id: 'p_' + Date.now(),
      authorName: currentUser?.displayName || userProfile.name,
      authorAvatar: currentUser?.photoURL || newPostData.authorAvatar,
      likesCount: 1,
      userLiked: true,
      comments: [],
      timestamp: 'الآن',
    };
    setCommunityPosts((prev) => [post, ...prev]);
    saveCommunityPostToFirestore(post);
  };

  // Workout & Mood handlers
  const handleAddWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => [log, ...prev]);
    if (currentUser) {
      saveWorkoutLogToFirestore(currentUser.uid, log);
    }
  };

  const handleDeleteWorkoutLog = (id: string) => {
    setWorkoutLogs((prev) => prev.filter((w) => w.id !== id));
    if (currentUser) {
      deleteWorkoutLogFromFirestore(currentUser.uid, id);
    }
  };

  const handleAddMoodLog = (log: MoodLog) => {
    setMoodLogs((prev) => [log, ...prev]);
    if (currentUser) {
      saveMoodLogToFirestore(currentUser.uid, log);
    }
  };

  // Notifications Handlers
  const handleToggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const handleTestTriggerAlert = (rule: SmartNotificationRule) => {
    setActiveToastAlert(rule);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // ignore
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white dir-rtl">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-300">جاري تحميل منصة رشاقة...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthLandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-['Cairo',sans-serif] dir-rtl text-right pb-16 antialiased selection:bg-emerald-200">
      
      {/* Toast Alert Banner */}
      {activeToastAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-bounce">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-4 shadow-2xl border border-emerald-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 text-slate-950 rounded-2xl shrink-0">
                <Bell className="w-5 h-5 fill-slate-950 stroke-slate-950" />
              </div>
              <div>
                <h4 className="font-black text-xs text-emerald-300">{activeToastAlert.title}</h4>
                <p className="text-xs text-white mt-0.5 font-bold">{activeToastAlert.body}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveToastAlert(null)}
              className="text-white/70 hover:text-white p-1 font-bold text-xs cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <Navbar
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiCoach={() => setIsAiCoachOpen(true)}
        onOpenScanner={() => setIsFoodScannerOpen(true)}
        onExportPdf={handleExportPdf}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        wearablesConnectedCount={wearables.filter((w) => w.connected).length}
        onOpenAuthModal={() => setIsGoogleAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {(activeTab === 'daily' || activeTab === 'tracker') && (
          <DailyTracker
            userProfile={userProfile}
            mealLogs={mealLogs}
            workoutLogs={workoutLogs}
            waterIntakeMl={waterIntakeMl}
            onWaterChange={setWaterIntakeMl}
            onUpdateWater={setWaterIntakeMl}
            onAddMealLog={handleAddMealLog}
            onDeleteMealLog={handleDeleteMealLog}
            foodDatabase={foodDatabase}
            workoutCaloriesBurned={(workoutLogs || []).reduce((acc, w) => acc + (w.caloriesBurned || 0), 0)}
            stepsCaloriesBurned={(wearables || []).filter(w => w.connected).reduce((acc, w) => acc + Math.round(w.activeCaloriesBurned || 0), 0)}
            onOpenScanner={() => setIsFoodScannerOpen(true)}
            onOpenFoodScanner={() => setIsFoodScannerOpen(true)}
            onOpenAiCoach={() => setIsAiCoachOpen(true)}
          />
        )}

        {activeTab === 'meal_plans' && (
          <MealPlans
            mealPlans={mealPlans}
            userProfile={userProfile}
            onAddMealLog={handleAddMealLog}
            onOpenAiCoach={() => setIsAiCoachOpen(true)}
          />
        )}

        {activeTab === 'weight_chart' && (
          <WeightChart
            userProfile={userProfile}
            weightHistory={weightHistory}
            onAddWeightEntry={handleAddWeightEntry}
          />
        )}

        {activeTab === 'weekly_report' && (
          <WeeklyReport
            userProfile={userProfile}
            mealLogs={mealLogs}
            weightHistory={weightHistory}
            workoutLogs={workoutLogs}
            moodLogs={moodLogs}
            waterIntakeMl={waterIntakeMl}
            onExportPdf={handleExportPdf}
          />
        )}

        {activeTab === 'wearables' && (
          <WearablesSync
            wearables={wearables}
            onToggleConnect={handleToggleWearableConnect}
            onSyncNow={handleSyncWearableNow}
          />
        )}

        {(activeTab === 'food_db' || activeTab === 'food_database') && (
          <FoodDatabase
            foodDatabase={foodDatabase}
            onAddFoodToDatabase={handleAddFoodToDatabase}
            onAddMealLog={handleAddMealLog}
          />
        )}

        {activeTab === 'community' && (
          <CommunityFeed
            posts={communityPosts}
            onToggleLike={handleTogglePostLike}
            onAddComment={handleAddCommentToPost}
            onCreatePost={handleCreatePost}
          />
        )}

        {(activeTab === 'workout_mood' || activeTab === 'journal') && (
          <WorkoutMoodJournal
            workoutLogs={workoutLogs}
            moodLogs={moodLogs}
            onAddWorkout={handleAddWorkoutLog}
            onAddMood={handleAddMoodLog}
            onDeleteWorkout={handleDeleteWorkoutLog}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsManager
            notifications={notifications}
            userProfile={userProfile}
            onToggleNotification={handleToggleNotification}
            onUpdateWeeklyGoal={(rate) =>
              handleUpdateUserProfile({ ...userProfile, weeklyGoalKg: rate })
            }
            onTestTriggerAlert={handleTestTriggerAlert}
          />
        )}

      </main>

      {/* Floating AI Coach Button at bottom right */}
      <button
        onClick={() => setIsAiCoachOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-5 py-3.5 rounded-full shadow-2xl border-2 border-emerald-300 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 no-print"
      >
        <Sparkles className="w-5 h-5 fill-white" />
        <span className="text-xs">المستشار التغذوي الذكي</span>
      </button>

      {/* All Application Modals */}
      <AiNutritionCoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        userProfile={userProfile}
      />

      <FoodScannerModal
        isOpen={isFoodScannerOpen}
        onClose={() => setIsFoodScannerOpen(false)}
        onAddMealLog={handleAddMealLog}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateUserProfile}
      />

      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
