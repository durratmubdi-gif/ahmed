/**
 * درع الأمان — مكتبة الفحص والخوارزميات السيبرانية
 * جميع العمليات تنفّذ محلياً داخل المتصفح بنسبة 100% حفاظاً على الخصوصية.
 */

export interface PasswordCheckResult {
  details: {
    الطول: boolean;
    حروف_كبيرة: boolean;
    حروف_صغيرة: boolean;
    أرقام: boolean;
    رموز_خاصة: boolean;
  };
  extraDetails: {
    طول_موصى_به: boolean; // >= 12
    طول_فائق: boolean; // >= 16
    لا_يحتوي_تسلسل_شائع: boolean;
    تنوع_مرتفع: boolean;
  };
  score: number; // 0 to 5 (from Python spec)
  totalPercentage: number; // 0 to 100
  rating: string;
  ratingLevel: 'very_weak' | 'fair' | 'good' | 'excellent';
  crackTimeEstimate: string;
  entropyBits: number;
  warnings: string[];
  recommendations: string[];
  sha1Hash?: string;
  sha256Hash?: string;
}

export interface UrlCheckResult {
  details: {
    يبدأ_بـ_آمن: boolean;
    يحتوي_نطاق_واضح: boolean;
    لا_يحتوي_حروف_مشبوهة: boolean;
  };
  extraDetails: {
    ليس_عنوان_ip: boolean;
    ليس_رابطا_مختصرا: boolean;
    نطاقات_فرعية_آمنة: boolean;
    منفذ_طبيعي: boolean;
    امتداد_موثوق: boolean;
    خالي_من_كلمات_التصيد: boolean;
    خالي_من_بيانات_اعتماد: boolean;
  };
  isSafe: boolean;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  message: string;
  score: number; // 0 - 100 (100 is completely safe)
  breakdown: {
    protocol: string;
    hostname: string;
    domain: string;
    subdomains: string;
    port: string;
    pathname: string;
    queryParams: { key: string; value: string }[];
    hasCyrillic: boolean;
    suspiciousChars: string[];
  };
  warnings: string[];
  positives: string[];
}

export interface PhishingAnalysisResult {
  riskScore: number; // 0 - 100 (100 is dangerous)
  level: 'safe' | 'low' | 'medium' | 'high';
  detectedTriggers: {
    category: string;
    detectedPhrases: string[];
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  foundUrls: string[];
  foundPhones: string[];
  advice: string[];
}

// ----------------------------------------------------
// 1. خوارزمية فحص كلمة المرور (مطابقة ومطوّرة عن كود بايثون)
// ----------------------------------------------------
export function checkPasswordStrength(password: string): PasswordCheckResult {
  if (!password) {
    return {
      details: {
        الطول: false,
        حروف_كبيرة: false,
        حروف_صغيرة: false,
        أرقام: false,
        رموز_خاصة: false,
      },
      extraDetails: {
        طول_موصى_به: false,
        طول_فائق: false,
        لا_يحتوي_تسلسل_شائع: true,
        تنوع_مرتفع: false,
      },
      score: 0,
      totalPercentage: 0,
      rating: "🔴 ضعيفة جداً — أدخل كلمة مرور",
      ratingLevel: 'very_weak',
      crackTimeEstimate: "لحظياً (0 ثانية)",
      entropyBits: 0,
      warnings: ["كلمة المرور فارغة"],
      recommendations: ["أدخل 8 أحرف على الأقل تحتوي على مزيج من الحروف والأرقام والرموز."],
    };
  }

  // الأساسيات من الكود البرمجي الأصلي للمستخدم
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const details = {
    "الطول": hasLength,
    "حروف_كبيرة": hasUpper,
    "حروف_صغيرة": hasLower,
    "أرقام": hasNumber,
    "رموز_خاصة": hasSpecial,
  };

  const points = (hasLength ? 1 : 0) +
                 (hasUpper ? 1 : 0) +
                 (hasLower ? 1 : 0) +
                 (hasNumber ? 1 : 0) +
                 (hasSpecial ? 1 : 0);

  // الفحوصات المتقدمة الإضافية
  const isRecommendedLength = password.length >= 12;
  const isEliteLength = password.length >= 16;

  // فحص الكلمات والأنماط الشائعة
  const commonSequences = [
    '123456', '12345678', 'password', 'qwerty', '111111', 'admin', 'welcome', 'letmein',
    'pass123', 'iloveyou', 'abc123', '000000', 'password1', 'test123'
  ];
  const lowerPwd = password.toLowerCase();
  const hasCommonPattern = commonSequences.some(seq => lowerPwd.includes(seq)) || /(.)\1{3,}/.test(password);

  // حساب الحجم الفعلي للمجموعة (Character Set Pool)
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 33;
  if (poolSize === 0) poolSize = 26; // افتراضي إذا كانت لغة أخرى كالعربية

  // حساب الإنتروبيا: Entropy = Length * log2(poolSize)
  const entropy = Math.round(password.length * Math.log2(poolSize));

  // تقدير وقت الكسر بواسطة هجوم القوة العمياء المتطور (Brute-force)
  // افتراض كرت شاشة حديث يخمّن 100 مليار تخمين بالثانية
  const combinations = Math.pow(poolSize, password.length);
  const crackTimeEstimate = calculateCrackTime(combinations, entropy, hasCommonPattern);

  // تحديد التقييم اللفظي والنقاط (وفق منطق بايثون الأساسي)
  let rating = "";
  let ratingLevel: 'very_weak' | 'fair' | 'good' | 'excellent' = 'very_weak';

  if (points <= 2) {
    rating = "🔴 ضعيفة جداً — غير آمنة";
    ratingLevel = 'very_weak';
  } else if (points === 3) {
    rating = "🟡 مقبولة — تحتاج تحسين";
    ratingLevel = 'fair';
  } else if (points === 4) {
    rating = "🟢 جيدة — آمنة";
    ratingLevel = 'good';
  } else {
    rating = "💚 ممتازة — حماية عالية جداً";
    ratingLevel = 'excellent';
  }

  // حساب النسبة المئوية الدقيقة (0 - 100)
  let percentage = points * 20;
  if (isRecommendedLength && percentage >= 60) percentage = Math.min(100, percentage + 10);
  if (isEliteLength && percentage >= 80) percentage = 100;
  if (hasCommonPattern) percentage = Math.max(15, percentage - 30);

  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (hasCommonPattern) {
    warnings.push("تحتوي كلمة المرور على نمط أو تكرار شائع يسهل على برامج الاختراق تخمينه.");
    recommendations.push("تجنب التسلسلات مثل 1234 أو qwerty أو تكرار نفس الحرف أكثر من مرتين.");
  }
  if (!hasLength) {
    warnings.push("طول كلمة المرور أقل من 8 خانات، مما يسهل كسرها في ثوانٍ.");
    recommendations.push("اجعل طول كلمة المرور 12 خانة على الأقل لأمان موثوق.");
  }
  if (!hasSpecial) {
    recommendations.push("أضف رمزاً خاصاً واحداً على الأقل مثل: ! @ # $ % * &");
  }
  if (!hasUpper) {
    recommendations.push("أضف حروفاً إنجليزية كبيرة (A-Z) لزيادة تعقيد التشفير.");
  }
  if (!hasNumber) {
    recommendations.push("أضف أرقاماً (0-9) متباعدة داخل الكلمة.");
  }

  return {
    details,
    extraDetails: {
      طول_موصى_به: isRecommendedLength,
      طول_فائق: isEliteLength,
      لا_يحتوي_تسلسل_شائع: !hasCommonPattern,
      تنوع_مرتفع: poolSize >= 62,
    },
    score: points,
    totalPercentage: percentage,
    rating,
    ratingLevel,
    crackTimeEstimate,
    entropyBits: entropy,
    warnings,
    recommendations,
  };
}

function calculateCrackTime(combinations: number, entropy: number, isCommon: boolean): string {
  if (isCommon) return "أقل من ثانية واحدة (مكشوفة في قواميس التخمين)";
  if (entropy < 28) return "أقل من ثانية واحدة";
  if (entropy < 36) return "بضع ثوانٍ إلى دقائق معدودة";
  if (entropy < 45) return "عدة ساعات إلى يومين";
  if (entropy < 55) return "بضعة أشهر إلى عامين";
  if (entropy < 65) return "حوالي 150 إلى 500 عام";
  if (entropy < 80) return "أكثر من 100 ألف سنة";
  return "مليارات السنين (غير قابلة للكسر عملياً)";
}

// ----------------------------------------------------
// 2. خوارزمية فحص الروابط (مطابقة ومطوّرة عن كود بايثون)
// ----------------------------------------------------
export function checkUrlSafety(inputUrl: string): UrlCheckResult {
  const trimmed = inputUrl.trim();

  // فحص الحروف السريلية المشبوهة (هجوم الحروف المتطابقة Homograph Attack)
  // كود بايثون الأصلي: not bool(re.search(r'[а-я]', الرابط))
  const cyrillicRegex = /[а-яА-ЯёЁ]/;
  const hasCyrillic = cyrillicRegex.test(trimmed);
  const suspiciousChars: string[] = [];
  if (hasCyrillic) {
    const matches = trimmed.match(/[а-яА-ЯёЁ]/g);
    if (matches) {
      suspiciousChars.push(...Array.from(new Set(matches)));
    }
  }

  let parsed: URL | null = null;
  let rawProtocol = "";
  let rawHostname = "";
  let rawPort = "";
  let rawPath = "";
  const queryParams: { key: string; value: string }[] = [];

  try {
    // محاولة الإكمال إذا لم يكتب المستخدم https://
    let normalized = trimmed;
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = "https://" + normalized;
    }
    parsed = new URL(normalized);
    rawProtocol = parsed.protocol.replace(':', '');
    rawHostname = parsed.hostname;
    rawPort = parsed.port;
    rawPath = parsed.pathname;

    parsed.searchParams.forEach((val, key) => {
      queryParams.push({ key, value: val });
    });
  } catch {
    // الرابط غير صالح في التكوين
  }

  // الأساسيات المحددة في بايثون للمستخدم:
  // 1. يبدأ_بـ_آمن: أجزاء.scheme == "https"
  const startsWithHttps = trimmed.startsWith("https://") || (parsed?.protocol === "https:" && trimmed.startsWith("https"));
  // 2. يحتوي_نطاق_واضح: len(أجزاء.netloc) > 3
  const hasClearDomain = Boolean(parsed && parsed.hostname && parsed.hostname.length > 3 && parsed.hostname.includes('.'));
  // 3. لا_يحتوي_حروف_مشبوهة: not bool(re.search(r'[а-я]', الرابط))
  const noSuspiciousChars = !hasCyrillic;

  const basicDetails = {
    "يبدأ_بـ_آمن": startsWithHttps,
    "يحتوي_نطاق_واضح": hasClearDomain,
    "لا_يحتوي_حروف_مشبوهة": noSuspiciousChars,
  };

  // الفحوصات الإضافية لسلامة المستخدم
  const hostname = parsed?.hostname?.toLowerCase() || "";
  
  // فحص عنوان IP المباشر
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const isNotIp = !ipRegex.test(hostname);

  // فحص اختصار الروابط
  const shorteners = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 
    'adf.ly', 'bit.do', 'cutt.ly', 'shorte.st', 'trib.al', 'rb.gy'
  ];
  const isNotShortened = !shorteners.includes(hostname);

  // فحص المنافذ غير الاعتيادية
  const standardPorts = ['', '80', '443'];
  const hasStandardPort = standardPorts.includes(rawPort);

  // فحص النطاقات الفرعية المريبة (أكثر من 3 نطاقات فرعية تدل عادة على تصيد)
  const subdomainsList = hostname.split('.');
  const hasSafeSubdomains = subdomainsList.length <= 4;

  // فحص الامتدادات الرخيصة عالية الخطورة في التصيد
  const riskyTlds = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.buzz', '.rest', '.support', '.download', '.racing'];
  const hasTrustedTld = !riskyTlds.some(tld => hostname.endsWith(tld));

  // فحص كلمات تصيد شهيرة مدمجة في النطاق غير الرسمي
  const brandKeywords = ['paypal', 'google', 'apple', 'amazon', 'facebook', 'instagram', 'microsoft', 'netflix', 'alrajhi', 'alinma', 'stc', 'aramco', 'nafath', 'absher'];
  const securityWords = ['login', 'verify', 'account', 'security', 'update', 'banking', 'secure', 'signin'];
  
  let hasPhishingKeyword = false;
  // إذا احتوى على اسم بنك أو خدمة لكن ليس النطاق الرسمي نفسه
  for (const brand of brandKeywords) {
    if (hostname.includes(brand)) {
      const isOfficial = hostname === `${brand}.com` || hostname.endsWith(`.${brand}.com`) || hostname.endsWith(`.${brand}.sa`);
      if (!isOfficial) {
        hasPhishingKeyword = true;
        break;
      }
    }
  }

  const hasCredentials = trimmed.includes('@') && parsed?.username !== '';

  const extraDetails = {
    ليس_عنوان_ip: isNotIp,
    ليس_رابطا_مختصرا: isNotShortened,
    نطاقات_فرعية_آمنة: hasSafeSubdomains,
    منفذ_طبيعي: hasStandardPort,
    امتداد_موثوق: hasTrustedTld,
    خالي_من_كلمات_التصيد: !hasPhishingKeyword,
    خالي_من_بيانات_اعتماد: !hasCredentials,
  };

  const warnings: string[] = [];
  const positives: string[] = [];

  if (startsWithHttps) {
    positives.push("يستخدم بروتوكول التشفير الآمن (HTTPS).");
  } else {
    warnings.push("الرابط غير مشفر (HTTP)؛ أي بيانات ترسلها قد يتم اعتراضها.");
  }

  if (hasClearDomain) {
    positives.push(`نطاق واضح المعالم: ${hostname}`);
  } else {
    warnings.push("اسم النطاق غير مكتمل أو غير صالح البنية.");
  }

  if (hasCyrillic) {
    warnings.push("تحذير هجوم التوأم الخبيث (Homograph): يحتوي الرابط على حروف روسية/سريلية تبدو بالعين مثل الإنجليزية لتضليلك!");
  }

  if (!isNotIp) {
    warnings.push("الرابط يستخدم عنوان IP رقمي مباشر بدلاً من نطاق مسجل، وهو سلوك شائع للمخترقين.");
  }

  if (!isNotShortened) {
    warnings.push("هذا رابط مختصر؛ قد يخفي الوجهة الحقيقية لموقع احتيالي أو ملف ضار.");
  }

  if (hasPhishingKeyword) {
    warnings.push("مؤشر تصيد مرتفع: تم العثور على اسم علامة تجارية أو خدمة شهيرة ضمن نطاق غير رسمي!");
  }

  if (!hasTrustedTld) {
    warnings.push("امتداد النطاق يندرج ضمن الامتدادات المجانية أو منخفضة التكلفة المستخدمة بكثرة في الحملات المشبوهة.");
  }

  // حساب النتيجة من بايثون ومطابقتها:
  // آمن = all(نتيجة.values())
  // return نتيجة, "✅ الرابط آمن" if آمن else "⚠️ تنبيه: قد يكون الرابط غير آمن"
  const pythonSafe = basicDetails.يبدأ_بـ_آمن && basicDetails.يحتوي_نطاق_واضح && basicDetails.لا_يحتوي_حروف_مشبوهة;
  
  // تقييم المخاطر الشامل
  let score = 100;
  if (!startsWithHttps) score -= 25;
  if (!hasClearDomain) score -= 30;
  if (hasCyrillic) score -= 50;
  if (!isNotIp) score -= 30;
  if (!isNotShortened) score -= 20;
  if (hasPhishingKeyword) score -= 40;
  if (!hasTrustedTld) score -= 15;
  if (!hasSafeSubdomains) score -= 10;
  score = Math.max(0, Math.min(100, score));

  let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
  let message = "";

  if (hasCyrillic || hasPhishingKeyword || !isNotIp || score < 40) {
    riskLevel = 'dangerous';
    message = "🚨 تحذير عالي الخطورة: مؤشرات احتيال وتصيد قوية!";
  } else if (!pythonSafe || score < 75) {
    riskLevel = 'suspicious';
    message = "⚠️ تنبيه: قد يكون الرابط غير آمن";
  } else {
    riskLevel = 'safe';
    message = "✅ الرابط آمن";
  }

  return {
    details: basicDetails,
    extraDetails,
    isSafe: pythonSafe && riskLevel === 'safe',
    riskLevel,
    message,
    score,
    breakdown: {
      protocol: rawProtocol || "غير محدد",
      hostname: hostname || "غير متوفر",
      domain: subdomainsList.slice(-2).join('.') || hostname,
      subdomains: subdomainsList.length > 2 ? subdomainsList.slice(0, -2).join('.') : "لا يوجد",
      port: rawPort || (rawProtocol === "https" ? "443 (تلقائي)" : "80 (تلقائي)"),
      pathname: rawPath || "/",
      queryParams,
      hasCyrillic,
      suspiciousChars,
    },
    warnings,
    positives,
  };
}

// ----------------------------------------------------
// 3. خوارزمية توليد كلمات مرور فائقة التشفير
// ----------------------------------------------------
export interface GeneratorOptions {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // e.g. 1, l, I, 0, O
}

export function generateSecurePassword(options: GeneratorOptions): string {
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lower = "abcdefghijklmnopqrstuvwxyz";
  let numbers = "0123456789";
  let symbols = "!@#$%^&*()_+~|}{[]:;?><,.-=";

  if (options.excludeSimilar) {
    upper = upper.replace(/[IO]/g, '');
    lower = lower.replace(/[lo]/g, '');
    numbers = numbers.replace(/[01]/g, '');
  }

  let charset = "";
  const guaranteedChars: string[] = [];

  if (options.includeUpper) {
    charset += upper;
    guaranteedChars.push(getRandomChar(upper));
  }
  if (options.includeLower) {
    charset += lower;
    guaranteedChars.push(getRandomChar(lower));
  }
  if (options.includeNumbers) {
    charset += numbers;
    guaranteedChars.push(getRandomChar(numbers));
  }
  if (options.includeSymbols) {
    charset += symbols;
    guaranteedChars.push(getRandomChar(symbols));
  }

  if (charset.length === 0) {
    charset = lower + numbers;
  }

  const remainingLength = Math.max(0, options.length - guaranteedChars.length);
  const randomChars: string[] = [];

  const randomValues = new Uint32Array(remainingLength);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < remainingLength; i++) {
    randomChars.push(charset[randomValues[i] % charset.length]);
  }

  const allChars = [...guaranteedChars, ...randomChars];
  
  // خلط العناصر (Fisher-Yates Shuffle) بأمان
  for (let i = allChars.length - 1; i > 0; i--) {
    const rand = new Uint32Array(1);
    window.crypto.getRandomValues(rand);
    const j = rand[0] % (i + 1);
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  return allChars.join('');
}

function getRandomChar(source: string): string {
  const rand = new Uint32Array(1);
  window.crypto.getRandomValues(rand);
  return source[rand[0] % source.length];
}

// ----------------------------------------------------
// 4. فاحص رسائل التصيد والاحتيال (SMS / WhatsApp / Email)
// ----------------------------------------------------
export function analyzePhishingText(text: string): PhishingAnalysisResult {
  if (!text.trim()) {
    return {
      riskScore: 0,
      level: 'safe',
      detectedTriggers: [],
      foundUrls: [],
      foundPhones: [],
      advice: ["ألصق أو اكتب نص الرسالة التي وصلتك لفحص مؤشرات الخداع والاحتيال."],
    };
  }

  const triggers: {
    category: string;
    detectedPhrases: string[];
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[] = [];

  // 1. التهديد والاستعجال المصطنع (Urgency / Fear)
  const urgencyKeywords = [
    'تم إيقاف حسابك', 'تم تجميد حسابك', 'تحديث بياناتك فوراً', 'خلال 24 ساعة', 'إيقاف بطاقتك',
    'سيتم حظر', 'تحديث فوري', 'عاجل', 'إجراء مطلوب فوراً', 'قبل الإلغاء', 'تفادياً لقطع الخدمة'
  ];
  const matchedUrgency = urgencyKeywords.filter(k => text.includes(k));
  if (matchedUrgency.length > 0) {
    triggers.push({
      category: "عامل التهديد والاستعجال المصطنع",
      detectedPhrases: matchedUrgency,
      severity: 'high',
      description: "يحاول المحتال خلق حالة من الذعر لجعلك تتصرف بسرعة دون تفكير."
    });
  }

  // 2. الإغراء المالي والجوائز الوهمية (Greed / Financial Baits)
  const financialKeywords = [
    'ربحت معنا', 'مبروك فزت', 'استلم جائزتك', 'مليون ريال', 'تحويل مالي بانتظارك',
    'شحنة معلقة', 'ادفع رسوم التوصيل', 'استثمار مضمون', 'أرباح يومية', 'يانصيب'
  ];
  const matchedFinancial = financialKeywords.filter(k => text.includes(k));
  if (matchedFinancial.length > 0) {
    triggers.push({
      category: "الإغراء المالي والجوائز الوهمية",
      detectedPhrases: matchedFinancial,
      severity: 'high',
      description: "وعود بمكافآت وجوائز أو دفع مبالغ طفيفة لاستلام طرود غير موجودة."
    });
  }

  // 3. طلب بيانات سرية (OTP / Passwords)
  const credentialKeywords = [
    'رمز التحقق', 'رمز التأكيد', 'أدخل الرقم السري', 'otp', 'كلمة السر', 'cvv', 'رقم البطاقة'
  ];
  const matchedCredentials = credentialKeywords.filter(k => text.toLowerCase().includes(k));
  if (matchedCredentials.length > 0) {
    triggers.push({
      category: "طلب بيانات حساسة أو رمز تحقق (OTP)",
      detectedPhrases: matchedCredentials,
      severity: 'high',
      description: "البنوك والجهات الرسمية لا تطلب إطلاقاً تزويدها برمز التحقق أو كلمة المرور!"
    });
  }

  // 4. استخراج الروابط
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const foundUrls = text.match(urlRegex) || [];

  // 5. استخراج أرقام الهواتف
  const phoneRegex = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})/g;
  const foundPhones = text.match(phoneRegex) || [];

  // حساب درجة الخطورة
  let score = 0;
  if (matchedUrgency.length > 0) score += 35;
  if (matchedFinancial.length > 0) score += 35;
  if (matchedCredentials.length > 0) score += 40;
  if (foundUrls.length > 0) score += 20;

  score = Math.min(100, score);

  let level: 'safe' | 'low' | 'medium' | 'high' = 'safe';
  if (score >= 60) level = 'high';
  else if (score >= 35) level = 'medium';
  else if (score > 0) level = 'low';

  const advice: string[] = [];
  if (level === 'high') {
    advice.push("لا تضغط على أي رابط نهائياً ولا تقم بالرد على هذه الرسالة.");
    advice.push("إذا كانت الرسالة تدعي أنها من بنكك، اتصل مباشرة برقم خدمة العملاء المكتوب خلف بطاقتك البنكية.");
    advice.push("لا تشارك رمز التحقق لمرة واحدة (OTP) مع أي شخص مهما ادعى منصبه.");
  } else if (level === 'medium') {
    advice.push("توخ الحذر؛ تحقق من عنوان المرسل بدقة وتأكد من المنصة الرسمية.");
  } else {
    advice.push("الرسالة لا تحتوي على كلمات التصيد التقليدية الشائعة، لكن احرص دائماً على عدم مشاركة بياناتك السرية.");
  }

  return {
    riskScore: score,
    level,
    detectedTriggers: triggers,
    foundUrls,
    foundPhones,
    advice,
  };
}

// ----------------------------------------------------
// 5. خوارزميات التجزئة والتشفير (SHA-256 / SHA-1)
// ----------------------------------------------------
export async function calculateHash(text: string, algorithm: 'SHA-256' | 'SHA-1' | 'SHA-512'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// خوارزمية MD5 سريعة ومحلية
export function calculateMD5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x: number, y: number, z: number) { return (x & y) | ((~x) & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & (~z)); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | (~z)); }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string) {
    let lWordCount;
    const lMessageLength = str.length;
    const lNumberOfWordsTempOne = lMessageLength + 8;
    const lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number) {
    let wordToHexValue = "", wordToHexValueTemp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValueTemp = "0" + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }
    return wordToHexValue;
  }

  let x: number[] = [];
  let k, AA, BB, CC, DD, a, b, c, d;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  x = convertToWordArray(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);

    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);

    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);

    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

// ----------------------------------------------------
// 6. صوتيات سيبرانية خفيفة باستخدام Web Audio API
// ----------------------------------------------------
class CyberSoundEffects {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }

  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch {
      // ignore
    }
  }

  public playWarning() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.22);
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new CyberSoundEffects();
