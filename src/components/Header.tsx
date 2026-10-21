import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Volume2, VolumeX, Lock, Sparkles, Terminal } from 'lucide-react';
import { soundEffects } from '../utils/securityUtils';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  terminalMode: boolean;
  setTerminalMode: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  terminalMode,
  setTerminalMode,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.enabled = next;
    if (next) soundEffects.playClick();
  };

  const navItems = [
    { id: 'password', label: 'فحص كلمة المرور', icon: Lock, badge: 'رئيسي' },
    { id: 'url', label: 'فحص الروابط', icon: ShieldCheck, badge: 'رئيسي' },
    { id: 'generator', label: 'توليد كلمات مرور', icon: Sparkles },
    { id: 'phishing', label: 'فاحص التصيد والرسائل', icon: ShieldAlert },
    { id: 'hash', label: 'حاسبة الهاش والتشفير', icon: Shield },
    { id: 'checklist', label: 'جاهزية الأمان الرقمي', icon: ShieldCheck },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and App Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg shadow-emerald-500/20 text-white font-bold ring-1 ring-white/20">
            <Shield className="w-6 h-6 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-cairo">
                درع الأمان
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                v1.0 الذكية
              </span>
            </div>
            <p className="text-xs text-slate-400">
              أداة الفحص والحماية الرقمية • فحص محلي آمن 100%
            </p>
          </div>
        </div>

        {/* Privacy Pill & Action Controls */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">البيانات لا تغادر جهازك (Offline First)</span>
          </div>

          {/* Terminal / CLI Mode Toggle */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setTerminalMode(!terminalMode);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              terminalMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="تبديل إلى نافذة سطر أوامر بايثون الأصلية"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{terminalMode ? 'وضع الواجهة' : 'الوضع الطرفي (Python CLI)'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg text-xs transition-all border ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:border-cyan-500/50'
                : 'bg-slate-850 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'كتم التأثيرات الصوتية' : 'تفعيل التأثيرات الصوتية'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      {!terminalMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all relative ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
