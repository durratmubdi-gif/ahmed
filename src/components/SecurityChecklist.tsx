import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Sparkles,
  Printer
} from 'lucide-react';
import { soundEffects } from '../utils/securityUtils';

interface ChecklistItem {
  id: string;
  question: string;
  impact: string;
  category: string;
}

export const SecurityChecklist: React.FC = () => {
  const items: ChecklistItem[] = [
    {
      id: '2fa',
      question: 'تفعيل المصادقة الثنائية (2FA) عبر تطبيقات التوثيق على البريد والحسابات البنكية',
      impact: 'يمنع 99% من محاولات الاختراق حتى لو تم تسريب كلمة المرور.',
      category: 'الحسابات والمصادقة',
    },
    {
      id: 'unique_passwords',
      question: 'استخدام كلمة مرور فريدة ومختلفة تماماً لكل موقع أو تطبيق',
      impact: 'يمنع تساقط الحسابات (Credential Stuffing) عند اختراق موقع واحد.',
      category: 'كلمات المرور',
    },
    {
      id: 'no_otp_sharing',
      question: 'عدم مشاركة رمز التحقق لمرة واحدة (OTP) أو كلمة المرور مع أي متصل مهما ادعى',
      impact: 'يحميك من أكثر من 80% من عمليات الاحتيال المالي المباشر.',
      category: 'مكافحة الاحتيال',
    },
    {
      id: 'url_inspection',
      question: 'فحص الروابط المشبوهة والتأكد من اسم النطاق الرسمي وبروتوكول HTTPS',
      impact: 'يحميك من الوقوع في فخاخ المواقع المزيفة وهجمات التوأم الخبيث.',
      category: 'التصفح الآمن',
    },
    {
      id: 'password_manager',
      question: 'الاعتماد على مدير كلمات مرور موثوق لحفظ وتوليد المفاتيح المعقدة',
      impact: 'يلغي الحاجة لحفظ كلمات المرور في مذكرات أو ملفات غير مشفرة.',
      category: 'كلمات المرور',
    },
    {
      id: 'system_updates',
      question: 'تثبيت التحديثات الأمنية لنظام التشغيل والهاتف فور صدورها',
      impact: 'يسد الثغرات الأمنية المعروفة (Zero-Days) التي يستغلها القراصنة.',
      category: 'الأجهزة والأنظمة',
    },
    {
      id: 'public_wifi',
      question: 'تجنب الدخول للحسابات البنكية عبر شبكات Wi-Fi العامة المفتوحة دون VPN',
      impact: 'يمنع هجمات وسيط الاتصال (Man-in-the-Middle) والتنصت على الحزم.',
      category: 'الشبكات والاتصال',
    },
    {
      id: 'backups',
      question: 'الاحتفاظ بنسخ احتياطية مشفرة ومنفصلة لبياناتك وملفاتك المهمة دورياً',
      impact: 'يحميك من برامج الفدية الخبيثة (Ransomware) وتلف الأجهزة.',
      category: 'البيانات والنسخ الاحتياطي',
    },
  ];

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    '2fa': true,
    'no_otp_sharing': true,
    'url_inspection': true,
    'system_updates': true,
  });

  const [copied, setCopied] = useState(false);

  const toggleItem = (id: string) => {
    soundEffects.playClick();
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const score = Math.round((completedCount / items.length) * 100);

  const getTier = () => {
    if (score >= 90) return { title: 'درع الحماية الذهبي الفائق 🛡️✨', color: 'text-teal-300', bg: 'bg-teal-500/10 border-teal-500/30' };
    if (score >= 70) return { title: 'درع الأمان الفضي المتقدم 🛡️', color: 'text-emerald-300', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 40) return { title: 'درع الأمان الأساسي 🟡', color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { title: 'تحتاج تعزيزات أمنية عاجلة 🔴', color: 'text-rose-300', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const tier = getTier();

  const handleCopyReport = () => {
    const text = `📊 تقرير جاهزية الأمان الرقمي — درع الأمان v1.0
الدرجة: ${score}% (${completedCount}/${items.length})
الرتبة: ${tier.title}
التاريخ: ${new Date().toLocaleDateString('ar-SA')}

معايير السلامة المكتملة:
${items.map(i => `${checkedItems[i.id] ? '✅' : '❌'} ${i.question}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    soundEffects.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Score Overview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Award className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">حاسبة ومقياس الجاهزية الرقمية</h2>
            </div>
            <p className="text-sm text-slate-400">
              قائمة تدقيق تفاعلية لتقييم سلوكك السيبراني اليومي وحساب مؤشر مناعتك ضد الهجمات الرقمية.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ التقرير' : 'نسخ التقرير'}</span>
            </button>
          </div>
        </div>

        {/* Score Card Display */}
        <div className={`mt-6 p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${tier.bg}`}>
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="relative w-16 h-16 rounded-full bg-slate-950 border-2 border-emerald-500/50 flex items-center justify-center font-bold text-xl text-white font-mono shrink-0 shadow-lg shadow-emerald-500/10">
              {score}%
            </div>
            <div>
              <div className="text-xs text-slate-400">رتبة الحصانة الرقمية:</div>
              <div className={`text-base sm:text-lg font-bold ${tier.color} mt-0.5`}>
                {tier.title}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                أنجزت {completedCount} من أصل {items.length} تدابير وقائية أساسية
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.max(5, score)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>حدد الممارسات التي تطبقها في حياتك الرقمية:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{item.question}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.impact}</p>
                  <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
