import React from 'react';
import {
  Flame,
  Activity,
  Printer,
  Sparkles,
  Bot,
  User,
  PieChart,
  Utensils,
  TrendingDown,
  FileText,
  Watch,
  Database,
  Users,
  Dumbbell,
  Bell,
  LogOut,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenAiCoach: () => void;
  onOpenScanner: () => void;
  onExportPdf: () => void;
  wearablesConnectedCount: number;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfile,
  onOpenAiCoach,
  onOpenScanner,
  onExportPdf,
  wearablesConnectedCount,
  onOpenAuthModal,
}) => {
  const { currentUser, logout } = useAuth();

  const tabs = [
    { id: 'daily', label: 'التتبع اليومي', icon: PieChart },
    { id: 'meal_plans', label: 'خطط الوجبات', icon: Utensils },
    { id: 'weight_chart', label: 'تطور الوزن', icon: TrendingDown },
    { id: 'weekly_report', label: 'التقارير الأسبوعية', icon: FileText },
    { id: 'wearables', label: 'الأجهزة الرياضية', icon: Watch, badge: wearablesConnectedCount ? `${wearablesConnectedCount}` : undefined },
    { id: 'food_db', label: 'قاعدة الأغذية', icon: Database },
    { id: 'community', label: 'مجتمع الوصفات', icon: Users },
    { id: 'workout_mood', label: 'الرياضة والمزاج', icon: Dumbbell },
    { id: 'notifications', label: 'التنبيهات والأهداف', icon: Bell },
  ];

  return (
    <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-30 no-print">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Tagline - Branded Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">منصة رَشـاقَـة</h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Google Firebase
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">المنصة الذكية المتكاملة للغذاء وتنزيل الوزن</p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold shadow-xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{userProfile.streakDays} يوم التزام</span>
            </div>

            {/* AI Scanner Button */}
            <button
              onClick={onOpenScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">ماسح الوجبات</span>
            </button>

            {/* AI Nutrition Coach Button */}
            <button
              onClick={onOpenAiCoach}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>المستشار الذكي</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="تصدير تقرير التقدم بصيغة PDF"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>PDF</span>
            </button>

            {/* Auth Button or User Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1.5 pl-3 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer"
                  title="عرض الملف الشخصي"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || userProfile.name}
                      className="w-7 h-7 rounded-lg object-cover ring-2 ring-emerald-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {userProfile.name ? userProfile.name.charAt(0) : 'G'}
                    </div>
                  )}
                  <div className="text-right hidden md:block">
                    <div className="text-xs font-bold text-slate-800 leading-none">
                      {currentUser.displayName || userProfile.name}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                      <span>Google Auth</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border border-slate-800"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>تسجيل بـ Google</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
