import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check } from 'lucide-react';
import { checkPasswordStrength, checkUrlSafety, soundEffects } from '../utils/securityUtils';

interface HistoryLine {
  id: string;
  type: 'system' | 'prompt' | 'input' | 'output' | 'error';
  text: string;
}

export const TerminalView: React.FC = () => {
  const [history, setHistory] = useState<HistoryLine[]>([
    { id: '1', type: 'system', text: '==================================================' },
    { id: '2', type: 'system', text: '🛡️  درع الأمان — فاحص السلامة الرقمية' },
    { id: '3', type: 'system', text: '==================================================' },
    { id: '4', type: 'system', text: '' },
    { id: '5', type: 'prompt', text: 'ماذا تريد أن تفعل؟' },
    { id: '6', type: 'prompt', text: '1 — فحص كلمة مرور' },
    { id: '7', type: 'prompt', text: '2 — فحص رابط' },
    { id: '8', type: 'prompt', text: '3 — الخروج' },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [currentStep, setCurrentStep] = useState<'menu' | 'awaiting_password' | 'awaiting_url' | 'exited'>('menu');
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const addLine = (type: HistoryLine['type'], text: string) => {
    setHistory((prev) => [...prev, { id: Math.random().toString(), type, text }]);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setHistory([
      { id: '1', type: 'system', text: '==================================================' },
      { id: '2', type: 'system', text: '🛡️  درع الأمان — فاحص السلامة الرقمية' },
      { id: '3', type: 'system', text: '==================================================' },
      { id: '4', type: 'system', text: '' },
      { id: '5', type: 'prompt', text: 'ماذا تريد أن تفعل؟' },
      { id: '6', type: 'prompt', text: '1 — فحص كلمة مرور' },
      { id: '7', type: 'prompt', text: '2 — فحص رابط' },
      { id: '8', type: 'prompt', text: '3 — الخروج' },
    ]);
    setCurrentStep('menu');
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputVal.trim();
    if (!val && currentStep === 'menu') return;

    soundEffects.playClick();
    addLine('input', `> ${val}`);
    setInputVal('');

    if (currentStep === 'menu') {
      if (val === '1') {
        setCurrentStep('awaiting_password');
        addLine('prompt', 'أدخل كلمة المرور لفحصها:');
      } else if (val === '2') {
        setCurrentStep('awaiting_url');
        addLine('prompt', 'أدخل الرابط لفحصه:');
      } else if (val === '3') {
        setCurrentStep('exited');
        soundEffects.playSuccess();
        addLine('system', '👋 شكراً لاستخدامك درع الأمان — في أمان الله');
      } else {
        addLine('error', '⚠️ اختيار غير صحيح، يرجى كتابة 1 أو 2 أو 3.');
        addLine('prompt', '\nماذا تريد أن تفعل؟');
        addLine('prompt', '1 — فحص كلمة مرور');
        addLine('prompt', '2 — فحص رابط');
        addLine('prompt', '3 — الخروج');
      }
    } else if (currentStep === 'awaiting_password') {
      // تفاصيل, تقييم, _ = فحص_كلمة_المرور(كلمة_المرور)
      const res = checkPasswordStrength(val);
      addLine('output', '\n📊 نتيجة الفحص:');
      addLine('output', `  ${res.details.الطول ? '✅' : '❌'} الطول`);
      addLine('output', `  ${res.details.حروف_كبيرة ? '✅' : '❌'} حروف_كبيرة`);
      addLine('output', `  ${res.details.حروف_صغيرة ? '✅' : '❌'} حروف_صغيرة`);
      addLine('output', `  ${res.details.أرقام ? '✅' : '❌'} أرقام`);
      addLine('output', `  ${res.details.رموز_خاصة ? '✅' : '❌'} رموز_خاصة`);
      addLine('output', `\nالتقييم النهائي: ${res.rating}`);
      addLine('system', '--------------------------------------------------');

      if (res.score >= 4) soundEffects.playSuccess();
      else soundEffects.playWarning();

      // Return to menu
      setCurrentStep('menu');
      addLine('prompt', '\nماذا تريد أن تفعل؟');
      addLine('prompt', '1 — فحص كلمة مرور');
      addLine('prompt', '2 — فحص رابط');
      addLine('prompt', '3 — الخروج');
    } else if (currentStep === 'awaiting_url') {
      // تفاصيل, رسالة = فحص_الرابط(الرابط)
      const res = checkUrlSafety(val);
      addLine('output', '\n📊 نتيجة الفحص:');
      addLine('output', `  ${res.details.يبدأ_بـ_آمن ? '✅' : '❌'} يبدأ_بـ_آمن`);
      addLine('output', `  ${res.details.يحتوي_نطاق_واضح ? '✅' : '❌'} يحتوي_نطاق_واضح`);
      addLine('output', `  ${res.details.لا_يحتوي_حروف_مشبوهة ? '✅' : '❌'} لا_يحتوي_حروف_مشبوهة`);
      addLine('output', `\n${res.message}`);
      addLine('system', '--------------------------------------------------');

      if (res.isSafe) soundEffects.playSuccess();
      else soundEffects.playWarning();

      // Return to menu
      setCurrentStep('menu');
      addLine('prompt', '\nماذا تريد أن تفعل؟');
      addLine('prompt', '1 — فحص كلمة مرور');
      addLine('prompt', '2 — فحص رابط');
      addLine('prompt', '3 — الخروج');
    }
  };

  const copyLog = () => {
    const text = history.map((h) => h.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs text-slate-400 font-mono mr-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>python3 security_shield.py</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLog}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
            title="نسخ مخرجات الطرفية"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">نسخ</span>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
            title="إعادة تشغيل البرنامج"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">إعادة تشغيل</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Screen */}
      <div
        className="p-6 bg-slate-950 text-slate-200 text-sm leading-relaxed min-h-[380px] max-h-[520px] overflow-y-auto space-y-1"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((line) => {
          let color = 'text-slate-300';
          if (line.type === 'system') color = 'text-cyan-400 font-bold';
          if (line.type === 'prompt') color = 'text-slate-200';
          if (line.type === 'input') color = 'text-emerald-400 font-bold';
          if (line.type === 'error') color = 'text-rose-400 font-bold';
          if (line.type === 'output') {
            if (line.text.includes('🔴')) color = 'text-rose-400 font-bold';
            else if (line.text.includes('🟡')) color = 'text-amber-400 font-bold';
            else if (line.text.includes('🟢') || line.text.includes('💚')) color = 'text-emerald-400 font-bold';
            else color = 'text-slate-100';
          }

          return (
            <div key={line.id} className={`${color} whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}

        {/* Input prompt line */}
        {currentStep !== 'exited' ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="bg-transparent border-none outline-none text-emerald-400 flex-1 font-mono text-sm placeholder:text-slate-700"
              placeholder={
                currentStep === 'menu'
                  ? 'اكتب 1 أو 2 أو 3 ثم اضغط Enter...'
                  : currentStep === 'awaiting_password'
                  ? 'اكتب كلمة المرور واضغط Enter...'
                  : 'اكتب الرابط واضغط Enter...'
              }
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs flex items-center gap-1 border border-emerald-500/30"
            >
              <Play className="w-3 h-3" />
              <span>إرسال</span>
            </button>
          </form>
        ) : (
          <div className="pt-4 text-xs text-slate-500 flex items-center justify-between">
            <span>انتهى البرنامج. اضغط زر إعادة التشغيل أعلاه للبدء من جديد.</span>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded hover:bg-emerald-500/30 text-xs"
            >
              إعادة التشغيل الآن
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
