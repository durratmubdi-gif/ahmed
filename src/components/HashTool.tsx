import React, { useState, useEffect } from 'react';
import {
  Hash,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { calculateHash, calculateMD5, soundEffects } from '../utils/securityUtils';

export const HashTool: React.FC = () => {
  const [inputText, setInputText] = useState('درع الأمان 2026');
  const [sha256, setSha256] = useState('');
  const [sha1, setSha1] = useState('');
  const [md5, setMd5] = useState('');
  const [sha512, setSha512] = useState('');
  
  const [expectedHash, setExpectedHash] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    if (!inputText) {
      setSha256('');
      setSha1('');
      setMd5('');
      setSha512('');
      return;
    }

    calculateHash(inputText, 'SHA-256').then(setSha256);
    calculateHash(inputText, 'SHA-1').then(setSha1);
    calculateHash(inputText, 'SHA-512').then(setSha512);
    setMd5(calculateMD5(inputText));
  }, [inputText]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    soundEffects.playSuccess();
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Compare against expected hash
  const cleanExpected = expectedHash.trim().toLowerCase();
  const isMatch = Boolean(
    cleanExpected &&
    (cleanExpected === sha256.toLowerCase() ||
     cleanExpected === sha1.toLowerCase() ||
     cleanExpected === md5.toLowerCase() ||
     cleanExpected === sha512.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Hash className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">حاسبة البصمات الرقمية (Hash Generator & Inspector)</h2>
            </div>
            <p className="text-sm text-slate-400">
              توليد بصمات التشفير SHA-256 و SHA-1 و MD5 والتحقق من سلامة وتطابق الملفات والبيانات.
            </p>
          </div>
        </div>

        {/* Text Input */}
        <div className="mt-5">
          <label className="text-xs text-slate-400 mb-1.5 block">
            النص أو المحتوى المراد تجزئته وتوليد بصمته:
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب أي نص أو عبارة..."
            className="w-full bg-slate-950/80 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 transition"
          />
        </div>
      </div>

      {/* Generated Hashes List */}
      <div className="space-y-3">
        {/* SHA-256 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">SHA-256</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                المعيار العالمي الحديث الموصى به
              </span>
            </div>
            <button
              onClick={() => handleCopy(sha256, 'sha256')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1"
              title="نسخ"
            >
              {copiedType === 'sha256' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'sha256' ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-emerald-400 break-all select-all border border-slate-800/80" dir="ltr">
            {sha256 || '...'}
          </div>
        </div>

        {/* SHA-1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">SHA-1</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                مستخدم في Git وتدقيق سلامة التحميل
              </span>
            </div>
            <button
              onClick={() => handleCopy(sha1, 'sha1')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1"
              title="نسخ"
            >
              {copiedType === 'sha1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'sha1' ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-cyan-300 break-all select-all border border-slate-800/80" dir="ltr">
            {sha1 || '...'}
          </div>
        </div>

        {/* MD5 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">MD5</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Checksum قديم للتحقق من سلامة النقل
              </span>
            </div>
            <button
              onClick={() => handleCopy(md5, 'md5')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1"
              title="نسخ"
            >
              {copiedType === 'md5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'md5' ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-purple-300 break-all select-all border border-slate-800/80" dir="ltr">
            {md5 || '...'}
          </div>
        </div>
      </div>

      {/* Hash Verifier / Integrity Matcher */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>مطابقة الهاش (Hash Verifier):</span>
        </h3>
        <p className="text-xs text-slate-400">
          ألصق الهاش المعلن من الموقع الرسمي للبرنامج أو الملف، وسنتحقق فوراً من تطابقه مع النص أعلاه:
        </p>

        <div className="relative">
          <input
            type="text"
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            placeholder="ألصق الهاش المتوقع للتحقق من تطابقه..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white font-mono placeholder:text-slate-600 transition"
            dir="ltr"
          />
        </div>

        {cleanExpected && (
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
            isMatch
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {isMatch ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
              <div className="text-xs sm:text-sm font-bold">
                {isMatch
                  ? 'تطابق تام وموثوق! الملف أو النص سليم 100% ولم يتم التلاعب به.'
                  : 'الهاش غير متطابق! قد يكون الملف معدلاً أو غير متوافق.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
