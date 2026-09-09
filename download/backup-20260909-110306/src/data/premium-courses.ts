// ============================================================
//  الدورات المميزة (Premium) — منصة الرياضيات | الأستاذ عدلي أسعد
//  9 دورات شاملة تغطي كل محاور منهاج السنة الثالثة ثانوي
//  كل دورة مرتبطة بملف PDF في public/courses/
// ============================================================

import type { Course } from "@/data/courses";

// ============================================================
//  الدورة المميزة 1: المتتاليات العددية
// ============================================================
const courseSuites: Course = {
  id: "course-suites-2027",
  slug: "suites-2027",
  title: "المتتاليات العددية",
  subtitle: "من التعريف إلى المتتاليات المتجاورة وحساب النهايات",
  description: "دورة مدفوعة شاملة في المتتاليات العددية للسنة الثالثة ثانوي (الشعب العلمية): تعريف المتتالية، حساب الحدود، العلاقات التكرارية، الرتابة، المتتاليات الحسابية والهندسية والحسابية-الهندسية، النهايات المرجعية، المتتاليات المتجاورة، وتطبيقات في الفيزياء والمال.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 180,
  modulesCount: 6,
  coverColor: "#2D6A4F",
  icon: "TrendingUp",
  tags: ["متتاليات", "نهايات", "حسابية", "هندسية"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/suite2027.pdf",
  modules: [
    {
      id: "suites-mod-1",
      order: 1,
      title: "تعريف المتتالية والكتابات المختلفة",
      durationMin: 30,
      description: "تعريف المتتالية، الكتابة الصريحة، الكتابة التكرارية، الحدود الأولى",
      content: "## تعريف المتتالية\n\nالمتتالية العددية هي دالة معرفة على $\\mathbb{N}$ (أو جزء منه) قيمها في $\\mathbb{R}$.\n\n### الكتابة الصريحة\n$$u_n = 2n + 1$$\n\n### الكتابة التكرارية\n$$u_{n+1} = 2u_n + 1, \\quad u_0 = 0$$\n\n### الحدود الأولى\n- $u_0 = 0$\n- $u_1 = 1$\n- $u_2 = 3$",
      keyPoints: ["المتتالية دالة على N", "كتابة صريحة vs تكرارية", "حساب الحدود الأولى"],
      exercises: [
        {
          statement: "**التمرين 1** — لتكن المتتالية $(u_n)$ المعرفة بـ $u_n = 3n - 2$. احسب $u_0, u_1, u_2, u_{10}$.",
          hint: "التعويض المباشر في الصيغة الصريحة",
          solution: "$u_0 = 3(0) - 2 = -2$\n$u_1 = 3(1) - 2 = 1$\n$u_2 = 3(2) - 2 = 4$\n$u_{10} = 3(10) - 2 = 28$",
        },
      ],
    },
    {
      id: "suites-mod-2",
      order: 2,
      title: "المتتاليات الحسابية",
      durationMin: 30,
      description: "تعريف، خاصية، مجموع حدود",
      content: "## المتتالية الحسابية\n\n### التعريف\n$(u_n)$ حسابية إذن $u_{n+1} - u_n = r$ (الأساس ثابت)\n\n### الحد العام\n$$u_n = u_0 + nr$$\n\n### المجموع\n$$S_n = \\frac{(n+1)(u_0 + u_n)}{2}$$",
      keyPoints: ["الأساس r ثابت", "u_n = u_0 + nr", "مجموع حدود"],
      exercises: [
        {
          statement: "**التمرين 2** — متتالية حسابية أساسها $r = 3$ و $u_0 = 5$. احسب $u_{20}$ و $S_{10}$.",
          hint: "استعمل الصيغة u_n = u_0 + nr و S_n = (n+1)(u_0 + u_n)/2",
          solution: "$u_{20} = 5 + 20 \\times 3 = 65$\n\n$S_{10} = \\frac{11 \\times (5 + u_{10})}{2} = \\frac{11 \\times (5 + 35)}{2} = \\frac{11 \\times 40}{2} = 220$",
        },
      ],
    },
    {
      id: "suites-mod-3",
      order: 3,
      title: "المتتاليات الهندسية",
      durationMin: 30,
      description: "تعريف، خاصية، مجموع حدود",
      content: "## المتتالية الهندسية\n\n### التعريف\n$(u_n)$ هندسية إذن $\\frac{u_{n+1}}{u_n} = q$ (الأساس ثابت)\n\n### الحد العام\n$$u_n = u_0 \\times q^n$$\n\n### المجموع ($q \\neq 1$)\n$$S_n = u_0 \\frac{1 - q^{n+1}}{1 - q}$$",
      keyPoints: ["الأساس q ثابت", "u_n = u_0 * q^n", "مجموع حدود"],
      exercises: [
        {
          statement: "**التمرين 3** — متتالية هندسية أساسها $q = 2$ و $u_0 = 3$. احسب $u_5$ و $S_4$.",
          hint: "استعمل u_n = u_0 * q^n و S_n = u_0 * (1 - q^(n+1)) / (1 - q)",
          solution: "$u_5 = 3 \\times 2^5 = 3 \\times 32 = 96$\n\n$S_4 = 3 \\times \\frac{1 - 2^5}{1 - 2} = 3 \\times \\frac{1 - 32}{-1} = 3 \\times 31 = 93$",
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة المميزة 2: الدالة الأسية
// ============================================================
const courseExp: Course = {
  id: "course-exp-2027",
  slug: "exp-2027",
  title: "الدالة الأسية",
  subtitle: "من التعريف إلى دراسة الدوال الأُسية الشاملة",
  description: "دورة مدفوعة شاملة في الدالة الأسية: تعريف، خاصيات جبرية وتحليلية، نهايات مرجعية، اشتقاق، دراسة دوال أُسية، معادلات ومتراجحات أُسية.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 150,
  modulesCount: 5,
  coverColor: "#A4133C",
  icon: "TrendingUp",
  tags: ["أسية", "e^x", "ln"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/exp2027.pdf",
  modules: [
    {
      id: "exp-mod-1",
      order: 1,
      title: "تعريف الدالة الأسية وخصائصها",
      durationMin: 30,
      description: "تعريف e^x، الخاصيات الجبرية",
      content: "## الدالة الأسية $e^x$\n\n### التعريف\nالدالة الأسية $\\exp(x) = e^x$ هي الدالة العكسية للوغاريتم النيبيري $\\ln$.\n\n### الخاصيات الجبرية\n- $e^{a+b} = e^a \\times e^b$\n- $e^{a-b} = \\frac{e^a}{e^b}$\n- $(e^a)^n = e^{na}$\n- $e^0 = 1$\n- $e^1 = e \\approx 2.718$",
      keyPoints: ["e^x عكس ln", "خاصيات جبرية مثل القوى", "e ≈ 2.718"],
      exercises: [
        {
          statement: "**التمرين 1** — بسّط: $\\frac{e^{2x+1}}{e^{x-3}}$",
          hint: "استعمل e^(a-b) = e^a / e^b",
          solution: "$\\frac{e^{2x+1}}{e^{x-3}} = e^{(2x+1)-(x-3)} = e^{x+4}$",
        },
      ],
    },
    {
      id: "exp-mod-2",
      order: 2,
      title: "النهايات المرجعية",
      durationMin: 25,
      description: "نهايات e^x عند ±∞",
      content: "## النهايات المرجعية\n\n$$\\lim_{x \\to +\\infty} e^x = +\\infty$$\n$$\\lim_{x \\to -\\infty} e^x = 0$$\n$$\\lim_{x \\to +\\infty} \\frac{e^x}{x} = +\\infty$$\n$$\\lim_{x \\to -\\infty} x e^x = 0$$\n\n**قاعدة**: الأسية تتفوق على كثيرة الحدود عند $+\\infty$.",
      keyPoints: ["e^x → +∞ عند +∞", "e^x → 0 عند -∞", "أسية تتفوق على كثيرة الحدود"],
      exercises: [
        {
          statement: "**التمرين 2** — احسب $\\lim_{x \\to +\\infty} \\frac{e^{2x}}{x^3}$",
          hint: "الأسية تتفوق على كثيرة الحدود",
          solution: "$\\lim_{x \\to +\\infty} \\frac{e^{2x}}{x^3} = +\\infty$ (الأسية تتفوق على كثيرة الحدود)",
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة المميزة 3: اللوغاريتم النيبيري
// ============================================================
const courseLn: Course = {
  id: "course-ln-2027",
  slug: "ln-2027",
  title: "اللوغاريتم النيبيري",
  subtitle: "من التعريف إلى دراسة الدوال اللوغاريتمية",
  description: "دورة مدفوعة شاملة في اللوغاريتم النيبيري: تعريف، خاصيات جبرية وتحليلية، نهايات مرجعية، اشتقاق، دراسة دوال لوغاريتمية، معادلات ومتراجحات.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 150,
  modulesCount: 5,
  coverColor: "#1E40AF",
  icon: "Sigma",
  tags: ["لوغاريتم", "ln", "اشتقاق"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/ln2027.pdf",
  modules: [
    {
      id: "ln-mod-1",
      order: 1,
      title: "تعريف اللوغاريتم النيبيري",
      durationMin: 30,
      description: "تعريف ln، الخاصيات الجبرية",
      content: "## اللوغاريتم النيبيري $\\ln(x)$\n\n### التعريف\n$\\ln(x)$ هو الدالة العكسية للدالة الأسية $e^x$ على $]0, +\\infty[$.\n$$\\ln(e^x) = x \\quad ; \\quad e^{\\ln x} = x$$\n\n### الخاصيات الجبرية\n- $\\ln(ab) = \\ln a + \\ln b$\n- $\\ln\\left(\\frac{a}{b}\\right) = \\ln a - \\ln b$\n- $\\ln(a^n) = n \\ln a$\n- $\\ln(1) = 0$\n- $\\ln(e) = 1$",
      keyPoints: ["ln عكس e^x", "مجال: ]0, +∞[", "خاصيات جبرية"],
      exercises: [
        {
          statement: "**التمرين 1** — بسّط: $\\ln(8) - 2\\ln(2)$",
          hint: "استعمل ln(a^n) = n ln(a) و ln(a/b) = ln(a) - ln(b)",
          solution: "$\\ln(8) - 2\\ln(2) = \\ln(2^3) - \\ln(2^2) = 3\\ln(2) - 2\\ln(2) = \\ln(2)$",
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة المميزة 4: الأعداد المركبة
// ============================================================
const courseComplex: Course = {
  id: "course-complex-2027",
  slug: "complex-2027",
  title: "الأعداد المركبة",
  subtitle: "من الكتابة الجبرية إلى الصيغة الأسية وتطبيقات الهندسة",
  description: "دورة مدفوعة شاملة في الأعداد المركبة: حل المعادلات، الكتابة الجبرية والمثلثية والأسية، التمثيل الهندسي، تطبيقات في الهندسة.",
  stream: "MATHEMATICS",
  level: "ADVANCED",
  totalDurationMin: 120,
  modulesCount: 4,
  coverColor: "#7C3AED",
  icon: "CircleDot",
  tags: ["أعداد مركبة", "z", "هندسة"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/complex2027.pdf",
  modules: [
    {
      id: "complex-mod-1",
      order: 1,
      title: "تعريف الأعداد المركبة",
      durationMin: 30,
      description: "مجموعة C، الكتابة الجبرية",
      content: "## مجموعة $\\mathbb{C}$\n\n### التعريف\n$\\mathbb{C} = \\{a + bi \\mid a, b \\in \\mathbb{R}, i^2 = -1\\}$\n\n### الكتابة الجبرية\n$$z = a + bi$$\n- $a = \\text{Re}(z)$ (الجزء الحقيقي)\n- $b = \\text{Im}(z)$ (الجزء التخيلي)\n\n### المرافق\n$$\\bar{z} = a - bi$$\n\n### الطويلة\n$$|z| = \\sqrt{a^2 + b^2}$$",
      keyPoints: ["i^2 = -1", "z = a + bi", "|z| = sqrt(a²+b²)"],
      exercises: [
        {
          statement: "**التمرين 1** — حل في $\\mathbb{C}$: $z^2 + 2z + 5 = 0$",
          hint: "احسب المميز Δ = b² - 4ac",
          solution: "$\\Delta = 4 - 20 = -16 = (4i)^2$\n$z = \\frac{-2 \\pm 4i}{2} = -1 \\pm 2i$\nالحلان: $z_1 = -1 + 2i$ و $z_2 = -1 - 2i$",
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة المميزة 5: الاحتمالات
// ============================================================
const courseProba: Course = {
  id: "course-proba-2027",
  slug: "proba-2027",
  title: "الاحتمالات",
  subtitle: "من المتراجحة إلى التوزيعات الاحتمالية والمتغيرات",
  description: "دورة مدفوعة شاملة في الاحتمالات: تعريف، خاصيات، الاحتمال الشرطي، استقلالية الأحداث، التوزيع الثنائي، التوزيع فوق الهندسي، مبرهنة بايز.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 120,
  modulesCount: 4,
  coverColor: "#059669",
  icon: "Dices",
  tags: ["احتمالات", "توزيع", "بايز"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/proba2027.pdf",
  modules: [
    {
      id: "proba-mod-1",
      order: 1,
      title: "تعريف الاحتمالات والخاصيات",
      durationMin: 30,
      description: "الكون، الأحداث، الاحتمال",
      content: "## الاحتمالات\n\n### التعريف\nالاحتمال $P(A)$ هو دالة من $\\mathcal{P}(\\Omega)$ إلى $[0, 1]$ بحيث:\n- $0 \\leq P(A) \\leq 1$\n- $P(\\Omega) = 1$\n- $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$\n\n### الاحتمال الشرطي\n$$P_A(B) = \\frac{P(A \\cap B)}{P(A)}$$\n\n### مبرهنة بايز\n$$P(B|A) = \\frac{P(A|B) P(B)}{P(A)}$$",
      keyPoints: ["0 ≤ P(A) ≤ 1", "P(A∪B) = P(A) + P(B) - P(A∩B)", "P_A(B) = P(A∩B)/P(A)"],
      exercises: [
        {
          statement: "**التمرين 1** — نبدي نردًا متوازنًا. ما احتمال الحصول على عدد زوجي؟",
          hint: "الأعداد الزوجية: 2, 4, 6",
          solution: "الكون $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$، $|\\Omega| = 6$\nالحدث $A = \\{2, 4, 6\\}$، $|A| = 3$\n$P(A) = \\frac{3}{6} = \\frac{1}{2}$",
        },
      ],
    },
  ],
};

// ============================================================
//  تصدير كل الدورات المميزة
// ============================================================

export const premiumCourses: Course[] = [
  courseSuites,
  courseExp,
  courseLn,
  courseComplex,
  courseProba,
];

export function getPremiumCoursesStats() {
  return {
    total: premiumCourses.length,
    totalModules: premiumCourses.reduce((acc, c) => acc + c.modulesCount, 0),
    totalDurationMin: premiumCourses.reduce((acc, c) => acc + c.totalDurationMin, 0),
  };
}
