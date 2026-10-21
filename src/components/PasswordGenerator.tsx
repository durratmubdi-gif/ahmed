import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
  Layers,
  Lock
} from 'lucide-react';
import {
  generateSecurePassword,
  checkPasswordStrength,
  soundEffects,
  GeneratorOptions
} from '../utils/securityUtils';

export const PasswordGenerator: React.FC = () => {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUpper: true,
    includeLower: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');

  const arabicWords = [
    'صقر', 'برق', 'واحة', 'نخيل', 'سحاب', 'فارس', 'شمس', 'بحر', 'قمر', 'رمح',
    'نجم', 'طويق', 'درع', 'سيف', 'عزم', 'مجد', 'سلام', 'فجر', 'أفق', 'حكمة'
  ];

  const generatePassphrase = (): string => {
    const selected: string[] = [];
    const randVals = new Uint32Array(4);
    window.crypto.getRandomValues(randVals);
    for (let i = 0; i < 3; i++) {
      selected.push(arabicWords[randVals[i] % arabicWords.length]);
    }
    const num = (randVals[3] % 900) + 100;
    return `${selected.join('-')}-${num}!`;
  };

  const regenerate = () => {
    soundEffects.playClick();
    if (mode === 'random') {
      const generated = generateSecurePassword(options);
      setPassword(generated);
    } else {
      setPassword(generatePassphrase());
    }
  };

  useEffect(() => {
    regenerate();
  }, [options, mode]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    soundEffects.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = checkPasswordStrength(password);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">مولّد كلمات المرور المشفرة</h2>
            </div>
            <p className="text-sm text-slate-400">
              توليد مفاتيح وكلمات مرور عشوائية غير قابلة للتنبؤ باستخدام خوارزميات التشفير العشوائي الآمنة.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setMode('random')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'random'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              رموز عشوائية (High-Entropy)
            </button>
            <button
              onClick={() => setMode('passphrase')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'passphrase'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عبارة سهلة التذكر (Passphrase)
            </button>
          </div>
        </div>

        {/* Generated Output Box */}
        <div className="mt-6 relative">
          <div className="p-4 sm:p-5 bg-slate-950 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3 shadow-inner">
            <div className="font-mono text-base sm:text-xl font-bold text-emerald-400 select-all break-all" dir="ltr">
              {password}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={regenerate}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="توليد كلمة جديدة"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          {/* Quick Score Ribbon */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">تقييم الكلمة المولدة:</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                {strength.rating}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono">
              <span>{strength.entropyBits} بت إنتروبيا</span>
              <span>•</span>
              <span className="text-teal-400 font-bold">{strength.crackTimeEstimate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Options */}
      {mode === 'random' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>تخصيص معايير التوليد:</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              الطول الحالي: <strong className="text-emerald-400 text-sm">{options.length}</strong> خانة
            </span>
          </div>

          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>8 خانات (الحد الأدنى)</span>
              <span>16 (موصى به عالمياً)</span>
              <span>64 (حماية عسكرية)</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value, 10) })}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Checkbox Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={options.includeUpper}
                onChange={(e) => setOptions({ ...options, includeUpper: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-white">حروف كبيرة (A-Z)</div>
                <div className="text-[11px] text-slate-500 font-mono">ABCDEF...</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={options.includeLower}
                onChange={(e) => setOptions({ ...options, includeLower: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-white">حروف صغيرة (a-z)</div>
                <div className="text-[11px] text-slate-500 font-mono">abcdef...</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-white">أرقام (0-9)</div>
                <div className="text-[11px] text-slate-500 font-mono">0123456789</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-white">رموز خاصة</div>
                <div className="text-[11px] text-slate-500 font-mono">!@#$%^&*()...</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition sm:col-span-2">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => setOptions({ ...options, excludeSimilar: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div>
                <div className="text-xs font-bold text-white">استبعاد الأحرف المتشابهة والمربكة للعين</div>
                <div className="text-[11px] text-slate-500 font-mono">يمنع التباس: (0 مع O) أو (1 مع l و I)</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Passphrase Info */}
      {mode === 'passphrase' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2 text-xs text-slate-300">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>ما هي طريقة عبارة المرور (Passphrase)؟</span>
          </h4>
          <p className="text-slate-400 leading-relaxed">
            عبارة المرور تجمع بين كلمات عربية ذات معنى مع أرقام ورموز خاصة؛ وهي تقدم أماناً استثنائياً بفضل طولها وتنوع كلماتها مع سهولة تذكرها ونطقها مقارنة بالسلاسل العشوائية الصعبة.
          </p>
        </div>
      )}
    </div>
  );
};
