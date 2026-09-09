// ============================================================
//  نظام الاشتراكات والباقات — منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  طرق الدفع الجزائرية:
//  - CIB (البطاقة الذهبية)
//  - بريدي موب (BaridiMob)
//  - CCP (حساب بريدي)
// ============================================================

export type PlanTier = "FREE" | "FULL";

export interface Plan {
  id: PlanTier;
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  monthlyPrice: number;       // بالدينار الجزائري
  yearlyPrice: number;        // بالدينار الجزائري
  currency: string;
  color: string;
  badge?: string;
  isMostPopular?: boolean;
  features: {
    label: string;
    included: boolean;
    highlight?: boolean;
  }[];
  cta: string;
}

export const plans: Plan[] = [
  {
    id: "FREE",
    slug: "free",
    name: "Free",
    nameAr: "المجاني",
    description: "ابدأ رحلتك مجاناً — مناسب لاكتشاف المنصة والمراجعة الأساسية",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "DZD",
    color: "#6B7280",
    cta: "ابدأ مجاناً",
    features: [
      { label: "كل الدروس النظرية", included: true },
      { label: "50 تمرين محلول", included: true },
      { label: "اختبارات تفاعلية محدودة", included: true },
      { label: "لوحة تتبع التقدم", included: true },
      { label: "فضاء ولي الأمر", included: false },
      { label: "كل المواضيع الشاملة (1000+ تمرين)", included: false },
      { label: "الدورات الشاملة الكاملة", included: false },
      { label: "الدروس الخاصة مع الأستاذ", included: false },
      { label: "تصحيح فردي للتمارين", included: false },
      { label: "الملخصات الذهنية PDF", included: false },
    ],
  },
  // ✅ عرض واحد فقط — 500 دج للاستفادة الكاملة
  {
    id: "FULL",
    slug: "full",
    name: "Full",
    nameAr: "الاستفادة الكاملة",
    description: "عرض واحد بسعر رمزي — 500 دج فقط للوصول الكامل لكل محتوى المنصة",
    monthlyPrice: 500,
    yearlyPrice: 500,
    currency: "DZD",
    color: "#A4133C",
    badge: "⭐ العرض الوحيد",
    isMostPopular: true,
    cta: "اشترك الآن — 500 دج",
    features: [
      { label: "كل ما في الباقة المجانية", included: true },
      { label: "كل التمارين المحلولة (1000+ تمرين)", included: true, highlight: true },
      { label: "كل الاختبارات التفاعلية", included: true },
      { label: "فضاء ولي الأمر الكامل", included: true },
      { label: "كل المواضيع الشاملة (بكالوريا)", included: true, highlight: true },
      { label: "الفيديوهات التعليمية", included: true },
      { label: "الملخصات النهائية PDF", included: true },
      { label: "المساعد الذكي", included: true, highlight: true },
      { label: "الدورات الشاملة (9 دورات)", included: true, highlight: true },
    ],
  },
  // تم حذف باقات BASIC, PREMIUM, FAMILY — عرض واحد فقط بـ 500 دج
];

// ============================================================
//  طرق الدفع الجزائرية
// ============================================================

export type PaymentMethod = "CIB" | "BARIDI_MOB" | "CCP" | "BANK_TRANSFER";

export interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  nameAr: string;
  description: string;
  icon: string;
  color: string;
  instructions: string[];
  fields: PaymentField[];
  isInstant: boolean;
  fee: string;
}

export interface PaymentField {
  id: string;
  label: string;
  type: "text" | "number" | "tel" | "email" | "select";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export const paymentMethods: PaymentMethodInfo[] = [
  {
    id: "CIB",
    name: "CIB Card",
    nameAr: "البطاقة الذهبية CIB",
    description: "الدفع الفوري بالبطاقة الذهبية CIB — الأكثر استعمالاً في الجزائر",
    icon: "💳",
    color: "#FFB800",
    instructions: [
      "ستتم إعادة توجيهك إلى بوابة الدفع الآمنة",
      "أدخل رقم بطاقة CIB (16 رقماً)",
      "أدخل تاريخ الانتهاء (MM/YY)",
      "أدخل رمز CVV (3 أرقام خلف البطاقة)",
      "أكد العملية برمز OTP المرسل عبر SMS",
    ],
    isInstant: true,
    fee: "مجاناً",
    fields: [
      {
        id: "cardNumber",
        label: "رقم البطاقة",
        type: "number",
        placeholder: "0000 0000 0000 0000",
        required: true,
        helpText: "16 رقماً مكتوباً على بطاقة CIB",
      },
      {
        id: "expiry",
        label: "تاريخ الانتهاء",
        type: "text",
        placeholder: "MM/YY",
        required: true,
      },
      {
        id: "cvv",
        label: "CVV",
        type: "number",
        placeholder: "000",
        required: true,
        helpText: "3 أرقام خلف البطاقة",
      },
      {
        id: "holderName",
        label: "اسم حامل البطاقة",
        type: "text",
        placeholder: "الاسم الكامل كما في البطاقة",
        required: true,
      },
    ],
  },
  {
    id: "BARIDI_MOB",
    name: "BaridiMob",
    nameAr: "بريدي موب",
    description: "الدفع عبر تطبيق بريدي موب الجزائري — سريع وآمن",
    icon: "📱",
    color: "#F7941D",
    instructions: [
      "افتح تطبيق بريدي موب على هاتفك",
      "اختر 'تحويل' أو 'دفع'",
      "أدخل رقم حساب التاجر: 00299999XXXXXXXX",
      "أدخل المبلغ المطلوب",
      "أكد العملية برمز PIN",
      "ستصلك رسالة تأكيد العملية",
    ],
    isInstant: true,
    fee: "مجاناً",
    fields: [
      {
        id: "baridiPhone",
        label: "رقم الهاتف المسجل في بريدي موب",
        type: "tel",
        placeholder: "06 XX XX XX XX",
        required: true,
      },
      {
        id: "transactionRef",
        label: "رقم العملية (Transaction ID)",
        type: "text",
        placeholder: "رقم التأكيد من رسالة SMS",
        required: true,
        helpText: "أدخل رقم العملية المرسل برسالة SMS بعد إتمام التحويل",
      },
    ],
  },
  {
    id: "CCP",
    name: "CCP Transfer",
    nameAr: "حساب بريدي CCP",
    description: "تحويل عبر الحساب البريدي CCP — موثوق ومنتشر",
    icon: "📮",
    color: "#2D6A4F",
    instructions: [
      "اذهب إلى أقرب مكتب بريد",
      "أو استعمل تطبيق بريدي موب للتحويل",
      "حساب التاجر: رقم الحساب البريدي 00299999XXXXXXXX",
      "اسم صاحب الحساب: الأستاذ عدلي أسعد",
      "أدخل المبلغ المطلوب",
      "احتفظ بإيصال التحويل وأدخل رقم العملية",
    ],
    isInstant: false,
    fee: "مجاناً",
    fields: [
      {
        id: "ccpAccount",
        label: "رقم حسابك البريدي CCP",
        type: "text",
        placeholder: "0009999XXXXXXXX",
        required: true,
      },
      {
        id: "transferCode",
        label: "رقم الإيصال / رقم العملية",
        type: "text",
        placeholder: "رقم من إيصال التحويل",
        required: true,
        helpText: "الرقم الموجود في إيصال التحويل البريدي",
      },
      {
        id: "transferDate",
        label: "تاريخ التحويل",
        type: "text",
        placeholder: "DD/MM/YYYY",
        required: true,
      },
    ],
  },
  {
    id: "BANK_TRANSFER",
    name: "Bank Transfer",
    nameAr: "تحويل بنكي",
    description: "تحويل بنكي مباشر — للعائلات التي تفضل التحويل التقليدي",
    icon: "🏦",
    color: "#1D3557",
    instructions: [
      "اذهب إلى وكالة بنكك (BNA، BEA، CPA، BADR، إلخ)",
      "اطلب تحويل بنكي إلى الحساب التالي:",
      "BNA - الأستاذ عدلي أسعد",
      "RIB: 004 00099 9999999999 99",
      "أدخل المبلغ المطلوب",
      "احتفظ بالإيصال وأدخل رقم العملية",
    ],
    isInstant: false,
    fee: "حسب البنك",
    fields: [
      {
        id: "bankName",
        label: "اسم البنك المحوّل منه",
        type: "select",
        required: true,
        options: [
          { value: "BNA", label: "BNA - البنك الوطني الجزائري" },
          { value: "BEA", label: "BEA - البنك الخارجي الجزائري" },
          { value: "CPA", label: "CPA - البنك الجزائري الشعبي" },
          { value: "BADR", label: "BADR - بنك التنمية الريفية" },
          { value: "BANQUE_ALEP", label: "بنك الأمان" },
          { value: "OTHER", label: "بنك آخر" },
        ],
      },
      {
        id: "rib",
        label: "RIB الحساب المحوّل منه",
        type: "text",
        placeholder: "004 00099 9999999999 99",
        required: true,
      },
      {
        id: "transferRef",
        label: "رقم العملية / الإيصال",
        type: "text",
        required: true,
      },
    ],
  },
];

// ============================================================
//  المنتجات الرقمية (PDF، مواضيع، ملخصات)
// ============================================================

export interface DigitalProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: "PDF" | "EXAM" | "SUMMARY" | "VIDEO" | "BUNDLE";
  format: string;
  pages?: number;
  rating: number;
  downloads: number;
  color: string;
  icon: string;
  tags: string[];
  isFeatured?: boolean;
}

export const digitalProducts: DigitalProduct[] = [
  {
    id: "prod-bac-2019-2023",
    slug: "bac-exams-2019-2023",
    title: "مواضيع بكالوريا 2019-2023 (PDF مصححة)",
    description:
      "مجموعة كاملة لجميع مواضيع البكالوريا للسنوات 2019-2023 لكل الشعب العلمية، مع الحلول النموذجية المفصلة خطوة بخطوة. ملف PDF احترافي قابل للطباعة.",
    price: 800,
    oldPrice: 1200,
    category: "BUNDLE",
    format: "PDF (120 صفحة)",
    pages: 120,
    rating: 4.9,
    downloads: 1247,
    color: "#A4133C",
    icon: "FileText",
    tags: ["بكالوريا", "مصححة", "PDF", "كل الشعب"],
    isFeatured: true,
  },
  {
    id: "prod-summary-math",
    slug: "math-summary-bac",
    title: "الملخص الذهني للبكالوريا رياضيات",
    description:
      "ملخص شامل ومركّز لكل منهاج رياضيات السنة الثالثة ثانوي — 32 صفحة فقط تحتوي كل القوانين والمتطاببات والنظريات بطريقة بصرية أنيقة.",
    price: 500,
    oldPrice: 700,
    category: "SUMMARY",
    format: "PDF (32 صفحة)",
    pages: 32,
    rating: 4.8,
    downloads: 892,
    color: "#5A3EBA",
    icon: "Sparkles",
    tags: ["ملخص", "رياضيات", "بكالوريا", "PDF"],
    isFeatured: true,
  },
  {
    id: "prod-summary-exp",
    slug: "experimental-summary",
    title: "الملخص الذهني للبكالوريا علوم تجريبية",
    description:
      "ملخص شامل لمنهاج رياضيات شعبة العلوم التجريبية — 28 صفحة بصرية تحتوي كل ما تحتاجه لمراجعة سريعة وفعالة قبل الامتحان.",
    price: 500,
    oldPrice: 700,
    category: "SUMMARY",
    format: "PDF (28 صفحة)",
    pages: 28,
    rating: 4.7,
    downloads: 643,
    color: "#2D6A4F",
    icon: "Sparkles",
    tags: ["ملخص", "علوم تجريبية", "بكالوريا", "PDF"],
  },
  {
    id: "prod-summary-tech",
    slug: "technical-summary",
    title: "الملخص الذهني للبكالوريا تقني رياضي",
    description:
      "ملخص شامل لمنهاج رياضيات شعبة التقني رياضي — 30 صفحة بصرية تحتوي كل القوانين والمفاهيم بطريقة سهلة المراجعة.",
    price: 500,
    oldPrice: 700,
    category: "SUMMARY",
    format: "PDF (30 صفحة)",
    pages: 30,
    rating: 4.6,
    downloads: 421,
    color: "#7F5539",
    icon: "Sparkles",
    tags: ["ملخص", "تقني رياضي", "بكالوريا", "PDF"],
  },
  {
    id: "prod-exam-simulation",
    slug: "bac-simulation-exam",
    title: "محاكاة بكالوريا (3 مواضيع + تصحيص)",
    description:
      "3 مواضيع بكالوريا كاملة بمستوى حقيقي + تصحيح مفصل لكل موضوع. مثالية للتدريب النهائي قبل الامتحان الرسمي.",
    price: 1200,
    oldPrice: 1800,
    category: "EXAM",
    format: "PDF (90 صفحة)",
    pages: 90,
    rating: 5.0,
    downloads: 387,
    color: "#1D3557",
    icon: "Award",
    tags: ["محاكاة", "تصحيح", "بكالوريا", "PDF"],
    isFeatured: true,
  },
  {
    id: "prod-sequences-pack",
    slug: "sequences-pack",
    title: "حزمة المتتاليات العددية (500 تمرين + حلول)",
    description:
      "500 تمرين متدرج في المتتاليات العددية مع حلول نموذجية مفصلة — من المكتسبات القبلية إلى مستوى البكالوريا المتقدم.",
    price: 700,
    category: "BUNDLE",
    format: "PDF (180 صفحة)",
    pages: 180,
    rating: 4.9,
    downloads: 567,
    color: "#2D6A4F",
    icon: "TrendingUp",
    tags: ["متتاليات", "تمارين", "حلول", "PDF"],
  },
  {
    id: "prod-functions-pack",
    slug: "functions-pack",
    title: "حزمة دراسة الدوال (600 تمرين + حلول)",
    description:
      "600 تمرين في دراسة الدوال الشاملة مع حلول مفصلة — تشمل النهايات، الاشتقاق، المقاربات، التقعر، الأمثلية.",
    price: 800,
    category: "BUNDLE",
    format: "PDF (220 صفحة)",
    pages: 220,
    rating: 4.9,
    downloads: 612,
    color: "#A4133C",
    icon: "LineChart",
    tags: ["دوال", "تمارين", "حلول", "PDF"],
  },
  {
    id: "prod-private-session",
    slug: "private-session",
    title: "درس خاص مع الأستاذ عدلي أسعد (60 دقيقة)",
    description:
      "حصة خاصة فردية عبر Zoom مع الأستاذ عدلي أسعد — 60 دقيقة للتركيز على نقاط ضعفك الفردية. مواعيد مرنة.",
    price: 2000,
    category: "VIDEO",
    format: "Zoom (60 دقيقة)",
    rating: 5.0,
    downloads: 89,
    color: "#F7941D",
    icon: "Users",
    tags: ["درس خاص", "Zoom", "متابعة", "فردي"],
  },
];

// ============================================================
//  دالة لتنسيق الأسعار
// ============================================================

export function formatPrice(price: number, currency: string = "DZD"): string {
  if (price === 0) return "مجاناً";
  return `${price.toLocaleString("en-US")} ${currency}`;
}

export function formatPriceMonthly(price: number, currency: string = "DZD"): string {
  if (price === 0) return "مجاناً";
  return `${price.toLocaleString("en-US")} ${currency}/شهر`;
}

// ============================================================
//  إحصائيات الأسعار
// ============================================================

export function getPlansStats() {
  return {
    plansCount: plans.length,
    minPrice: Math.min(...plans.filter((p) => p.monthlyPrice > 0).map((p) => p.monthlyPrice)),
    maxPrice: Math.max(...plans.map((p) => p.monthlyPrice)),
    freePlan: plans.find((p) => p.id === "FREE"),
    fullPlan: plans.find((p) => p.id === "FULL"),
  };
}

export function getProductsStats() {
  return {
    total: digitalProducts.length,
    totalValue: digitalProducts.reduce((a, p) => a + p.price, 0),
    avgPrice: Math.round(
      digitalProducts.reduce((a, p) => a + p.price, 0) / digitalProducts.length
    ),
    featured: digitalProducts.filter((p) => p.isFeatured).length,
  };
}

// عناوين عربية
export const planLabelsAr: Record<PlanTier, string> = {
  FREE: "مجاني",
  FULL: "الاستفادة الكاملة",
};

export const productCategoryLabels: Record<DigitalProduct["category"], string> = {
  PDF: "ملف PDF",
  EXAM: "مواضيع امتحان",
  SUMMARY: "ملخص",
  VIDEO: "فيديو / حصة",
  BUNDLE: "حزمة شاملة",
};
