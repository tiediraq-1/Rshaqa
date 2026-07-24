import React, { useState } from 'react';
import {
  Watch,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Flame,
  Heart,
  Moon,
  Battery,
  Smartphone,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { WearableDevice } from '../types';

interface WearablesSyncProps {
  wearables: WearableDevice[];
  onToggleConnect: (deviceId: string) => void;
  onSyncNow: (deviceId: string) => void;
}

export const WearablesSync: React.FC<WearablesSyncProps> = ({
  wearables = [],
  onToggleConnect,
  onSyncNow,
}) => {
  const safeDevices = wearables || [];
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSyncClick = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      onSyncNow(id);
      setSyncingId(null);
    }, 1200);
  };

  const connectedDevice = safeDevices.find((w) => w.connected);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-900/60 border border-indigo-500/30 px-3 py-1 rounded-full mb-2 inline-block">
            ربط الأجهزة الذكية القابلة للارتداء
          </span>
          <h2 className="text-2xl font-black">ربط أجهزة قياس النشاط البدني والمزامنة اللحظية</h2>
          <p className="text-indigo-200/80 text-xs mt-1">
            ربط مباشر مع ساعات أبل، فيتبت، جارمن، وساعات سامسونج لمزامنة الخطوات والحرق التلقائي
          </p>
        </div>

        {connectedDevice && (
          <button
            onClick={() => handleSyncClick(connectedDevice.id)}
            disabled={syncingId !== null}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${syncingId === connectedDevice.id ? 'animate-spin' : ''}`} />
            <span>{syncingId === connectedDevice.id ? 'جاري المزامنة...' : 'مزامنة البيانات الآن'}</span>
          </button>
        )}
      </div>

      {/* Live Synced Metrics Overview if connected */}
      {connectedDevice && (
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 shadow-md">
          
          <div className="flex items-center justify-between pb-4 border-b border-indigo-500/30 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Watch className="w-6 h-6 text-indigo-200" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">{connectedDevice.name}</h3>
                <p className="text-xs text-indigo-200">آخر مزامنة: {connectedDevice.lastSyncTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>متصل ونشط</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
                <span>الخطوات اليومية</span>
                <Footprints className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black">{connectedDevice.stepsToday.toLocaleString('ar-SA')}</div>
              <div className="text-[10px] text-indigo-200/80 mt-1">الهدف: 10,000 خطوة</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
                <span>الحرق النشط</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black">{connectedDevice.activeCaloriesBurned} <span className="text-xs font-normal">سعرة</span></div>
              <div className="text-[10px] text-indigo-200/80 mt-1">تضاف تلقائياً للخصم اليومي</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
                <span>معدل النبض</span>
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black">{connectedDevice.heartRateBpm} <span className="text-xs font-normal">bpm</span></div>
              <div className="text-[10px] text-indigo-200/80 mt-1">معدل استراحة طبيعي</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between text-indigo-200 text-xs font-bold mb-1">
                <span>ساعات النوم</span>
                <Moon className="w-4 h-4 text-sky-300" />
              </div>
              <div className="text-2xl font-black">{connectedDevice.sleepHours} <span className="text-xs font-normal">ساعات</span></div>
              <div className="text-[10px] text-indigo-200/80 mt-1">نوم متواصل ومريح</div>
            </div>

          </div>

        </div>
      )}

      {/* Wearable Devices Selection Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base">الأجهزة والساعات الذكية المدعومة</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wearables.map((device) => {
            const isSyncingThis = syncingId === device.id;
            return (
              <div
                key={device.id}
                className={`bg-white border rounded-3xl p-5 shadow-xs transition-all flex items-center justify-between ${
                  device.connected ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    device.connected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Watch className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{device.name}</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                        {device.brand}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {device.connected ? `متصل • آخر مزامنة ${device.lastSyncTime}` : 'غير متصل'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {device.connected && (
                    <button
                      onClick={() => handleSyncClick(device.id)}
                      disabled={isSyncingThis}
                      className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all cursor-pointer"
                      title="مزامنة الآن"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingThis ? 'animate-spin text-emerald-600' : ''}`} />
                    </button>
                  )}

                  <button
                    onClick={() => onToggleConnect(device.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      device.connected
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {device.connected ? 'إلغاء الربط' : 'ربط الجهاز'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
