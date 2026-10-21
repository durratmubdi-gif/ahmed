import React, { useState, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Flame,
  KeyRound,
  RefreshCw,
  Hash,
  Info,
  Clock,
  Cpu
} from 'lucide-react';
import {
  checkPasswordStrength,
  calculateHash,
  soundEffects,
  generateSecurePassword
} from '../utils/securityUtils';

export const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState('MyP@ssw0rd2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [sha256, setSha256] = useState<string>('');

  const result = checkPasswordStrength(password);

  useEffect(() => {
    if (password) {
      calculateHash(password, 'SHA-256').then(setSha256);
    } else {
      setSha256('');
    }
  }, [password]);

  const handleCopy = (text: string, isHash = false) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    soundEffects.playSuccess();
    if (isHash) {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateAndSet = () => {
    soundEffects.playClick();
    const newPass = generateSecurePassword({
      length: 16,
      includeUpper: true,
      includeLower: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
    });
    setPassword(newPass);
  };

  // Color styles based on ratingLevel
  const getRatingStyle = () => {
    switch (result.ratingLevel) {
      case 'very_weak':
        return {
          badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          bar: 'bg-rose-500 shadow-rose-500/40',
          iconColor: 'text-rose-400',
        };
      case 'fair':
        return {
          badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          bar: 'bg-amber-500 shadow-amber-500/40',
          iconColor: 'text-amber-400',
        };
      case 'good':
        return {
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          bar: 'bg-emerald-500 shadow-emerald-500/40',
          iconColor: 'text-emerald-400',
        };
      case 'excellent':
      default:
        return {
          badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm shadow-teal-500/20',
          bar: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-teal-500/50',
          iconColor: 'text-teal-400',
        };
    }
  };

  const ratingStyle = getRatingStyle();

  const presets = [
    { label: '🔴 ضعيفة', value: '123456' },
    { label: '🟡 مقبولة', value: 'Pass1234' },
    { label: '🟢 جيدة', value: 'SecurePass!9' },
    { label: '💚 ممتازة', value: 'K#9mX$vL8@qW2&pZ' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Introduction */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">فاحص قوة كلمة المرور الذكي</h2>
            </div>
            <p className="text-sm text-slate-400">
              تحليل فوري دقيق لمعايير الأمان، الإنتروبيا الرياضية، وتقدير وقت الكسر بالهجوم الغاشم.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">أمثلة سريعة:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  soundEffects.playClick();
                  setPassword(p.value);
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Password Input Box */}
        <div className="mt-6 relative">
          <div className="relative flex items-center">
            <div className="absolute right-4 text-slate-500 pointer-events-none">
              <KeyRound className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="اكتب أو ألصق كلمة المرور هنا..."
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pr-12 pl-28 py-3.5 text-base sm:text-lg text-white font-mono tracking-wider placeholder:text-slate-600 transition"
              dir="ltr"
            />
            
            {/* Input Action Buttons */}
            <div className="absolute left-2.5 flex items-center gap-1.5" dir="ltr">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleCopy(password)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="نسخ كلمة المرور"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleGenerateAndSet}
                className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition border border-emerald-500/20"
                title="توليد كلمة مرور فائقة القوة عشوائياً"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar & Main Verdict */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">التقييم النهائي:</span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${ratingStyle.badge}`}>
                {result.rating}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
              <span>{result.score} من 5 معايير</span>
              <span className="text-emerald-400 font-bold">{result.totalPercentage}%</span>
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${ratingStyle.bar}`}
              style={{ width: `${Math.max(4, result.totalPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Results: The Python Inspection Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Python Check 1: الطول */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.details.الطول
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs ${
                result.details.الطول ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.details.الطول ? '✅' : '❌'}
              </div>
              <span className="font-semibold text-white">الطول (8 أحرف فأكثر)</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
              {password.length} أحرف
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {result.details.الطول
              ? 'ممتاز، كلمة المرور تحقق الحد الأدنى الأساسي للطول.'
              : 'طول كلمة المرور أقل من 8 خانات، مما يسهل كسرها بسرعة.'}
          </p>
        </div>

        {/* Python Check 2: حروف كبيرة */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.details.حروف_كبيرة
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs ${
                result.details.حروف_كبيرة ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.details.حروف_كبيرة ? '✅' : '❌'}
              </div>
              <span className="font-semibold text-white">حروف كبيرة (A-Z)</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
              {password.split('').filter(c => /[A-Z]/.test(c)).length} حرف
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {result.details.حروف_كبيرة
              ? 'موجودة، تضاعف حجم مصفوفة التخمين ضد المهاجمين.'
              : 'مفقودة، ينصح بإضافة حرف إنجليزي كبير واحد على الأقل.'}
          </p>
        </div>

        {/* Python Check 3: حروف صغيرة */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.details.حروف_صغيرة
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs ${
                result.details.حروف_صغيرة ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.details.حروف_صغيرة ? '✅' : '❌'}
              </div>
              <span className="font-semibold text-white">حروف صغيرة (a-z)</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
              {password.split('').filter(c => /[a-z]/.test(c)).length} حرف
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {result.details.حروف_صغيرة
              ? 'موجودة، تزيد من مرونة وسلاسة الكلمة.'
              : 'مفقودة، يجب تضمين حروف صغيرة كجزء أساسي.'}
          </p>
        </div>

        {/* Python Check 4: أرقام */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.details.أرقام
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs ${
                result.details.أرقام ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.details.أرقام ? '✅' : '❌'}
              </div>
              <span className="font-semibold text-white">أرقام (0-9)</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
              {password.split('').filter(c => /[0-9]/.test(c)).length} أرقام
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {result.details.أرقام
              ? 'موجودة، تحمي من هجمات القواميس القائمة على الكلمات فقط.'
              : 'مفقودة، أضف أرقاماً غير متسلسلة لتعزيز الصعوبة.'}
          </p>
        </div>

        {/* Python Check 5: رموز خاصة */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.details.رموز_خاصة
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs ${
                result.details.رموز_خاصة ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.details.رموز_خاصة ? '✅' : '❌'}
              </div>
              <span className="font-semibold text-white">رموز خاصة (!@#$...)</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
              {password.split('').filter(c => /[!@#$%^&*(),.?":{}|<>]/.test(c)).length} رموز
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {result.details.رموز_خاصة
              ? 'موجودة، ترفع الإنتروبيا وتقطع طريق هجمات التخمين الآلي.'
              : 'مفقودة، الرموز تجعل كسر الكلمة بالهجوم الغاشم أمراً شبه مستحيل.'}
          </p>
        </div>

        {/* Extra Security Check: نمط التسلسل */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.extraDetails.لا_يحتوي_تسلسل_شائع
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs ${
                result.extraDetails.لا_يحتوي_تسلسل_شائع ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.extraDetails.لا_يحتوي_تسلسل_شائع ? '✅' : '⚠️'}
              </div>
              <span className="font-semibold text-white">خلو من الأنماط الشائعة</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
              {result.extraDetails.لا_يحتوي_تسلسل_شائع ? 'نظيف' : 'مكشوف'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {result.extraDetails.لا_يحتوي_تسلسل_شائع
              ? 'لا تحتوي على كلمات شائعة مثل 123456 أو qwerty.'
              : 'تحتوي على تسلسل نمطي متكرر يسهل تخمينه بسرعة!'}
          </p>
        </div>
      </div>

      {/* Advanced Telemetry: Entropy & Crack Time & Hashes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crack Time & Entropy */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>الوقت المقدر للاختراق (Brute Force)</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800 px-2 py-0.5 rounded">
              {result.entropyBits} بت إنتروبيا
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400">الوقت اللازم لحاسوب فائق لكشف الكلمة:</div>
              <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {result.crackTimeEstimate}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            * التقدير محسوب بافتراض كروت شاشة حديثة تنفّذ 100 مليار محاولة تخمين مشفرة في الثانية الواحدة.
          </p>
        </div>

        {/* SHA-256 Fingerprint / Hash */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-400" />
              <span>البصمة التشفيرية المشفرة (SHA-256)</span>
            </h3>
            <span className="text-xs text-slate-400">فحص الخصوصية</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">
              تُستخدم البصمة الرقمية للتحقق من التسريبات دون الكشف عن كلمة المرور الفعلية:
            </div>
            <div className="relative group">
              <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-emerald-400/90 break-all border border-slate-800 select-all" dir="ltr">
                {sha256 || '...جاري الحساب'}
              </div>
              <button
                onClick={() => handleCopy(sha256, true)}
                className="absolute top-2 left-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="نسخ الهاش"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400/80 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
            <Info className="w-4 h-4 shrink-0" />
            <span>حماية كاملة: العمليات الحسابية تتم محلياً داخل معالج جهازك عبر Web Crypto API.</span>
          </div>
        </div>
      </div>

      {/* Warnings & Recommendations */}
      {(result.warnings.length > 0 || result.recommendations.length > 0) && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>توجيهات لتعزيز سلامة حساباتك:</span>
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            {result.warnings.map((w, idx) => (
              <li key={`warn-${idx}`} className="flex items-center gap-2 text-rose-300 bg-rose-950/20 p-2 rounded-lg border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{w}</span>
              </li>
            ))}
            {result.recommendations.map((r, idx) => (
              <li key={`rec-${idx}`} className="flex items-center gap-2 text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
