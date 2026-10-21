import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Search,
  Server,
  Layers,
  FileCode,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { checkUrlSafety, soundEffects } from '../utils/securityUtils';

export const UrlChecker: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://www.google.com');
  const [copied, setCopied] = useState(false);

  const result = checkUrlSafety(urlInput);

  const handleCopy = () => {
    navigator.clipboard.writeText(urlInput);
    soundEffects.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleLinks = [
    {
      label: '🟢 رابط آمن قياسي',
      url: 'https://www.google.com',
      desc: 'مشفر بـ HTTPS ونطاق رسمي موثوق'
    },
    {
      label: '🟡 غير مشفر (HTTP)',
      url: 'http://news-updates-portal.org/page',
      desc: 'يفتقر لتشفير الاتصال والشهادة الرقمية'
    },
    {
      label: '🚨 هجوم التوأم (سريلي)',
      // Note: the letters 'о' are Cyrillic U+043E, looks identical to Latin 'o'
      url: 'https://g\u043E\u043Egle.com/login',
      desc: 'يحتوي حروفاً سريلية روسية متطابقة بالعين لخداع المستخدم!'
    },
    {
      label: '🚨 عنوان IP مباشر',
      url: 'http://185.193.64.12/account/verify',
      desc: 'رابط مباشر لأي بي بدون نطاق مسجل'
    },
    {
      label: '🚨 تصيد ونطاق فرعي احتيالي',
      url: 'https://alrajhibank.com.sa-login.tk/security-check',
      desc: 'تضليل باستخدام اسم بنك داخل نطاق فرعي'
    },
    {
      label: '⚠️ رابط مختصر',
      url: 'https://bit.ly/free-voucher-claim',
      desc: 'رابط مختصر يخفي العنوان النهائي'
    },
  ];

  const getVerdictStyle = () => {
    if (result.riskLevel === 'dangerous') {
      return {
        badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/10',
        card: 'border-rose-500/30 bg-rose-950/10',
        icon: ShieldAlert,
        iconColor: 'text-rose-400',
      };
    }
    if (result.riskLevel === 'suspicious') {
      return {
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/10',
        card: 'border-amber-500/30 bg-amber-950/10',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
      };
    }
    return {
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10',
      card: 'border-emerald-500/30 bg-emerald-950/10',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
    };
  };

  const verdictStyle = getVerdictStyle();
  const VerdictIcon = verdictStyle.icon;

  return (
    <div className="space-y-6">
      {/* Top Banner & Scanner Input */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Globe className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">فاحص سلامة الروابط وكشف التصيد</h2>
            </div>
            <p className="text-sm text-slate-400">
              كشف الروابط الاحتيالية، هجمات الحروف السريلية المتطابقة (Homograph Attacks)، وحجب المواقع المضللة.
            </p>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative mt-4">
          <div className="relative flex items-center">
            <div className="absolute right-4 text-slate-500 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/login..."
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl pr-12 pl-24 py-3.5 text-sm sm:text-base text-white font-mono placeholder:text-slate-600 transition"
              dir="ltr"
            />
            <div className="absolute left-2.5 flex items-center gap-1.5" dir="ltr">
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="نسخ الرابط"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Samples Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">نماذج فحص تجريبية:</span>
          {sampleLinks.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playClick();
                setUrlInput(s.url);
              }}
              title={s.desc}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1"
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Main Verdict Card (Exact Python Message Output) */}
        <div className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${verdictStyle.card}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 ${verdictStyle.iconColor}`}>
              <VerdictIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs text-slate-400">النتيجة والتقييم النهائي:</div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {result.message}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${verdictStyle.badge}`}>
              درجة السلامة: {result.score}%
            </span>
          </div>
        </div>
      </div>

      {/* Python Specific Checks (Exact from user python script) */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>المعايير الأساسية المحددة في فحص بايثون:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Check 1: يبدأ_بـ_آمن */}
          <div className={`p-4 rounded-xl border transition-all ${
            result.details.يبدأ_بـ_آمن
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-amber-950/20 border-amber-500/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-sm">يبدأ_بـ_آمن (HTTPS)</span>
              <span className="text-sm">
                {result.details.يبدأ_بـ_آمن ? '✅' : '❌'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {result.details.يبدأ_بـ_آمن
                ? 'الرابط يبدأ ببروتوكول https:// المشفر بشهادة أمان SSL/TLS.'
                : 'الرابط يبدأ ببروتوكول http:// أو بدون تشفير، مما يعرض البيانات للتنصت!'}
            </p>
          </div>

          {/* Check 2: يحتوي_نطاق_واضح */}
          <div className={`p-4 rounded-xl border transition-all ${
            result.details.يحتوي_نطاق_واضح
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-950/20 border-rose-500/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-sm">يحتوي_نطاق_واضح</span>
              <span className="text-sm">
                {result.details.يحتوي_نطاق_واضح ? '✅' : '❌'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {result.details.يحتوي_نطاق_واضح
                ? `النطاق معروف وبنيته صحيحة (${result.breakdown.hostname}).`
                : 'الرابط لا يحتوي على اسم نطاق واضح أو طول النطاق غير كافٍ!'}
            </p>
          </div>

          {/* Check 3: لا_يحتوي_حروف_مشبوهة */}
          <div className={`p-4 rounded-xl border transition-all ${
            result.details.لا_يحتوي_حروف_مشبوهة
              ? 'bg-emerald-950/20 border-emerald-500/30'
              : 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-500/10'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-sm">لا_يحتوي_حروف_مشبوهة</span>
              <span className="text-sm">
                {result.details.لا_يحتوي_حروف_مشبوهة ? '✅' : '❌'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {result.details.لا_يحتوي_حروف_مشبوهة
                ? 'خالٍ من الحروف الروسية أو السريلية الخادعة.'
                : `تحذير: تم كشف حروف روسية/سريلية مخفية (${result.breakdown.suspiciousChars.join(' ، ')}) لخداع العين!`}
            </p>
          </div>
        </div>
      </div>

      {/* Extended Security Checklist */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>الفحوصات السيبرانية المتقدمة الإضافية:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">عنوان IP مباشر:</span>
              <span>{result.extraDetails.ليس_عنوان_ip ? '✅ سليم' : '🚨 مكشوف'}</span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">رابط مختصر:</span>
              <span>{result.extraDetails.ليس_رابطا_مختصرا ? '✅ أصلي' : '⚠️ مختصر'}</span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">أمان النطاق الفرعي:</span>
              <span>{result.extraDetails.نطاقات_فرعية_آمنة ? '✅ آمن' : '⚠️ مريب'}</span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">امتداد موثوق:</span>
              <span>{result.extraDetails.امتداد_موثوق ? '✅ طبيعي' : '⚠️ مشبوه'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Link Anatomy / Breakdown Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>تشريح عناصر الرابط (URL Breakdown):</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">العنصر</th>
                <th className="py-2 px-3">القيمة المستخرجة</th>
                <th className="py-2 px-3">الحالة الأمنية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono" dir="ltr">
              <tr>
                <td className="py-2 px-3 text-slate-400 font-sans text-right">البروتوكول (Scheme)</td>
                <td className="py-2 px-3 text-cyan-300">{result.breakdown.protocol}</td>
                <td className="py-2 px-3 font-sans text-right">
                  {result.breakdown.protocol === 'https' ? (
                    <span className="text-emerald-400">مشفر وآمن</span>
                  ) : (
                    <span className="text-amber-400">غير مشفر</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-400 font-sans text-right">اسم النطاق (Hostname)</td>
                <td className="py-2 px-3 text-white">{result.breakdown.hostname}</td>
                <td className="py-2 px-3 font-sans text-right">
                  {result.breakdown.hasCyrillic ? (
                    <span className="text-rose-400 font-bold">يحتوي حروفاً سريلية!</span>
                  ) : (
                    <span className="text-emerald-400">أحرف لاتينية سليمة</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-400 font-sans text-right">المسار (Path)</td>
                <td className="py-2 px-3 text-slate-300">{result.breakdown.pathname}</td>
                <td className="py-2 px-3 font-sans text-right text-slate-400">مسار المورد المطلوب</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-400 font-sans text-right">معلمات الاستعلام (Query)</td>
                <td className="py-2 px-3 text-slate-400">
                  {result.breakdown.queryParams.length > 0
                    ? `${result.breakdown.queryParams.length} متغيرات`
                    : 'لا توجد'}
                </td>
                <td className="py-2 px-3 font-sans text-right text-slate-400">
                  {result.breakdown.queryParams.length > 3 ? 'متغيرات كثيرة' : 'طبيعي'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Warnings & Positives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.warnings.length > 0 && (
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>المحاذير والمخاطر المكتشفة:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-rose-300/90">
              {result.warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.positives.length > 0 && (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>المؤشرات الإيجابية الموثقة:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-300/90">
              {result.positives.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
