import React, { useState } from 'react';
import { Header } from './components/Header';
import { PasswordChecker } from './components/PasswordChecker';
import { UrlChecker } from './components/UrlChecker';
import { PasswordGenerator } from './components/PasswordGenerator';
import { PhishingScanner } from './components/PhishingScanner';
import { HashTool } from './components/HashTool';
import { SecurityChecklist } from './components/SecurityChecklist';
import { TerminalView } from './components/TerminalView';
import { Shield, Lock, Globe, Sparkles, ShieldAlert, Hash, Award, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('password');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [terminalMode, setTerminalMode] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background cyber grid & ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        terminalMode={terminalMode}
        setTerminalMode={setTerminalMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {terminalMode ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>الوضع الطرفي التفاعلي (Python CLI Interactive Mode)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  محاكاة حية مباشرة لكود بايثون 1.0 مع قائمة الأوامر التفاعلية الكاملة.
                </p>
              </div>
              <button
                onClick={() => setTerminalMode(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
              >
                العودة للواجهة الرسومية
              </button>
            </div>
            <TerminalView />
          </div>
        ) : (
          <div>
            {activeTab === 'password' && <PasswordChecker />}
            {activeTab === 'url' && <UrlChecker />}
            {activeTab === 'generator' && <PasswordGenerator />}
            {activeTab === 'phishing' && <PhishingScanner />}
            {activeTab === 'hash' && <HashTool />}
            {activeTab === 'checklist' && <SecurityChecklist />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-sm mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>درع الأمان — أداة الفحص والحماية الذكية • الإصدار 1.0</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>جميع الفحوصات والحسابات تنفّذ محلياً داخل جهازك 100% دون مشاركة أي بيانات حساسة.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
