import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  Phone,
  Lightbulb,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { analyzePhishingText, soundEffects } from '../utils/securityUtils';

export const PhishingScanner: React.FC = () => {
  const [inputText, setInputText] = useState(
    'عزيزي العميل، تم إيقاف بطاقتك الائتمانية بشكل مؤقت لأسباب أمنية. لتفادي الإلغاء يرجى تحديث بياناتك خلال 24 ساعة وإدخال رمز التحقق OTP عبر الرابط: https://secure-bank-login.xyz/verify'
  );

  const result = analyzePhishingText(inputText);

  const sampleMessages = [
    {
      title: '🚨 رسالة بنكية احتيالية',
      text: 'عزيزي العميل، تم إيقاف بطاقتك الائتمانية بشكل مؤقت لأسباب أمنية. لتفادي الإلغاء يرجى تحديث بياناتك خلال 24 ساعة وإدخال رمز التحقق OTP عبر الرابط: https://secure-bank-login.xyz/verify',
    },
    {
      title: '🚨 جائزة واستثمار وهمي',
      text: 'مبروك ربحت معنا جائزة نقدية كبرى بقيمة 50,000 ريال! استلم جائزتك الآن قبل انتهاء صلاحية العرض بالضغط على الرابط التالي: https://win-cash-today.top/claim',
    },
    {
      title: '🚨 شحنة بريد معلقة',
      text: 'شحنتك معلقة في المستودع بسبب رسوم جمركية قدرها 12 ريال. يرجى سداد المبلغ فوراً لتجنب إرجاع الشحنة: http://192.168.1.1/track',
    },
    {
      title: '🟢 رسالة إشعار طبيعية',
      text: 'أهلاً بك، تم تأكيد موعدك لدى العيادة يوم الأحد الساعة 4:00 مساءً. نرجو الحضور قبل الموعد بـ 15 دقيقة.',
    },
  ];

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'high':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          title: '🚨 رسالة احتيالية عالية الخطورة',
          bg: 'bg-rose-950/20 border-rose-500/30',
        };
      case 'medium':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          title: '⚠️ رسالة مشبوهة — تتطلب الحذر',
          bg: 'bg-amber-950/20 border-amber-500/30',
        };
      case 'low':
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          title: 'ℹ️ رسالة تحتوي على مؤشرات طفيفة',
          bg: 'bg-blue-950/20 border-blue-500/30',
        };
      case 'safe':
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          title: '✅ لا توجد مؤشرات احتيال ظاهرة',
          bg: 'bg-emerald-950/20 border-emerald-500/30',
        };
    }
  };

  const currentBadge = getSeverityBadge(result.level);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">فاحص رسائل التصيد والاحتيال (SMS & Email)</h2>
            </div>
            <p className="text-sm text-slate-400">
              تحليل نصوص الرسائل والبريد الوارد لكشف أساليب الهندسة الاجتماعية وادعاءات الطوارئ المزيفة.
            </p>
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-5 relative">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ألصق نص الرسالة التي وردتك عبر SMS أو واتساب أو البريد الإلكتروني هنا..."
            className="w-full bg-slate-950/80 border border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-xl p-4 text-sm text-white placeholder:text-slate-600 transition resize-none leading-relaxed"
          />
        </div>

        {/* Quick Sample Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">عينات ورسائل شائعة:</span>
          {sampleMessages.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundEffects.playClick();
                setInputText(s.text);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              {s.title}
            </button>
          ))}
          <button
            onClick={() => setInputText('')}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 border border-slate-700 transition flex items-center gap-1 mr-auto"
            title="مسح الحقل"
          >
            <RotateCcw className="w-3 h-3" />
            <span>مسح</span>
          </button>
        </div>

        {/* Verdict Badge */}
        <div className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${currentBadge.bg}`}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              {result.level === 'high' || result.level === 'medium' ? (
                <AlertOctagon className="w-6 h-6 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="text-xs text-slate-400">تقييم سلامة الرسالة:</div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {currentBadge.title}
              </div>
            </div>
          </div>

          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${currentBadge.badge}`}>
            مؤشر الخطر: {result.riskScore}%
          </span>
        </div>
      </div>

      {/* Triggers Breakdown */}
      {result.detectedTriggers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-rose-400" />
            <span>المؤشرات المشبوهة المكتشفة في الرسالة:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.detectedTriggers.map((t, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.category}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                    شديد الخطورة
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 my-2">
                  {t.detectedPhrases.map((phrase, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs"
                    >
                      "{phrase}"
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Links & Phones */}
      {(result.foundUrls.length > 0 || result.foundPhones.length > 0) && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>العناصر المضمنة بالرسالة:</span>
          </h4>

          {result.foundUrls.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400">روابط تم رصدها (احذر الضغط عليها):</span>
              <div className="space-y-1" dir="ltr">
                {result.foundUrls.map((u, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-rose-400 border border-slate-800 flex items-center justify-between">
                    <span className="truncate">{u}</span>
                    <span className="text-[11px] text-rose-400 font-sans px-2 py-0.5 bg-rose-500/10 rounded">
                      مشبوه
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.foundPhones.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400">أرقام هواتف وردت بالرسالة:</span>
              <div className="flex flex-wrap gap-2" dir="ltr">
                {result.foundPhones.map((p, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>{p}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actionable Defense Advice */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>توصيات الحماية الرقمية:</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {result.advice.map((adv, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 text-slate-300">
              <span className="text-amber-400 font-bold shrink-0">✓</span>
              <span className="leading-relaxed">{adv}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
