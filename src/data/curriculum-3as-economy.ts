// ============================================================
//  المنهاج الرسمي — السنة الثالثة تسيير واقتصاد (3AS-Economy)
//  الحجم الساعي: 108 ساعة
//  المصدر: التدرّج الرسمي 2022
// ============================================================

import type { UnitSeed } from "./curriculum";

const unit3ASEco_Sequences: UnitSeed = {
  slug: "3as-eco-sequences",
  title: "المتتاليات العددية",
  description: "متتاليات، حدود، رتابة، تقارب، برهان بالتراجع. (الفصل 1 — 16 ساعة)",
  order: 1,
  icon: "TrendingUp",
  color: "#84CC16",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "sequences-economy",
      title: "المتتاليات وتطبيقاتها الاقتصادية",
      description: "متتاليات حسابية وهندسية، تطبيقات في الفائدة والاستهلاك",
      prerequisites: "المتتاليات من 2AS.",
      lessons: [
        {
          slug: "sequences-applications",
          title: "تطبيقات المتتاليات في الاقتصاد",
          content: `## المتتاليات في الاقتصاد

### الفائدة المركبة
رأس مال $C_0$ بفائدة $t\\%$ سنويًا:
- بعد سنة: $C_1 = C_0(1 + t)$
- بعد $n$ سنوات: $C_n = C_0(1 + t)^n$

متتالية هندسية بأساس $q = 1 + t$.

### الاستهلاك (Amortissement)
قيمة آلة تساوم $V_0$ وتستهلك بنسبة $t\\%$ سنويًا:
$$V_n = V_0 \\cdot (1 - t)^n$$

### الإيراد السنوي الثابت
سلسلة دفعات سنوية ثابتة $a$ لمدة $n$ سنة بفائدة $t\\%$:
$$V = a \\cdot \\frac{1 - (1+t)^{-n}}{t}$$

### مثال محلول
رأس مال $C_0 = 10000$ دج، فائدة 5% سنويًا.
- بعد 3 سنوات: $C_3 = 10000 \\times 1.05^3 = 10000 \\times 1.157625 = 11576.25$ دج
- الربح: $1576.25$ دج

### نقاط أساسية
- الفائدة المركبة: $C_n = C_0(1+t)^n$
- الاستهلاك: $V_n = V_0(1-t)^n$
- السلسلة المتساوية: $V = a \\cdot \\frac{1-(1+t)^{-n}}{t}$`,
          durationMin: 40,
          keyPoints: ["فائدة مركبة: C_n = C_0(1+t)^n", "استهلاك: V_n = V_0(1-t)^n", "متتالية هندسية"],
        },
      ],
      exercises: [
        {
          title: "فائدة مركبة",
          statement: "رأس مال 50000 دج بفائدة 4% سنويًا. (1) احسب القيمة بعد 5 سنوات. (2) بعد كم سنة يتضاعف؟",
          hint: "1.05⁵ × 50000 و 1.04^n = 2",
          solution: `(1) $C_5 = 50000 \\times 1.04^5 = 50000 \\times 1.21665 = 60832.5$ دج
(2) $1.04^n = 2 \\Rightarrow n = \\frac{\\ln 2}{\\ln 1.04} \\approx \\frac{0.693}{0.0392} \\approx 17.67$
إذن بعد 18 سنة يتضاعف.`,
          difficulty: "INTERMEDIATE",
          type: "PROBLEM",
          points: 5,
          tags: ["فائدة مركبة", "لوغاريتم", "اقتصاد"],
        },
      ],
    },
  ],
};

const unit3ASEco_ExponentialLog: UnitSeed = {
  slug: "3as-eco-exponential-logarithm",
  title: "الدالتان الأسية واللوغاريتمية",
  description: "خصائص، نهايات، حل معادلات، تطبيقات. (الفصل 2 — 24 ساعة)",
  order: 2,
  icon: "FunctionSquare",
  color: "#0EA5E9",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "exponential-log-economy",
      title: "الدالة الأسية واللوغاريتم في الاقتصاد",
      description: "النمو الأسي، الانخفاض الأسي، اللوغاريتم في الحساب المالي",
      prerequisites: "الدوال من 2AS.",
      lessons: [
        {
          slug: "exp-log-applications",
          title: "الدالة الأسية واللوغاريتم النيبيري",
          content: `## الدالة الأسية $e^x$

### خصائص
- $e^0 = 1$
- $e^{a+b} = e^a \\times e^b$
- $e^{-a} = 1/e^a$
- $(e^a)^b = e^{ab}$
- $\\lim_{x \\to +\\infty} e^x = +\\infty$
- $\\lim_{x \\to -\\infty} e^x = 0$
- اشتقاق: $(e^x)' = e^x$

## الدالة اللوغاريتم النيبيري $\\ln(x)$

### خصائص
- معرفة على $]0, +\\infty[$
- $\\ln(1) = 0$, $\\ln(e) = 1$
- $\\ln(ab) = \\ln(a) + \\ln(b)$
- $\\ln(a/b) = \\ln(a) - \\ln(b)$
- $\\ln(a^n) = n \\ln(a)$
- $\\ln(e^x) = x$ و $e^{\\ln x} = x$
- اشتقاق: $(\\ln x)' = 1/x$

### تطبيقات اقتصادية
- **النمو السكاني**: $P(t) = P_0 e^{rt}$
- **انخفاض القيمة**: $V(t) = V_0 e^{-rt}$
- **زمن التضاعف**: $t = \\ln(2)/r$

### مثال محلول
سكان بلدية 10000 نسمة، نمو 3% سنويًا:
- $P(t) = 10000 e^{0.03t}$
- بعد 10 سنوات: $P(10) = 10000 e^{0.3} \\approx 10000 \\times 1.3499 = 13499$ نسمة
- زمن التضاعف: $t = \\ln(2)/0.03 \\approx 23.1$ سنة

### نقاط أساسية
- $e^{\\ln x} = x$، $\\ln(e^x) = x$
- $\\ln(ab) = \\ln a + \\ln b$
- $P(t) = P_0 e^{rt}$ للنمو الأسي`,
          durationMin: 45,
          keyPoints: ["e^(ln x) = x", "ln(ab) = ln a + ln b", "نمو أسي: P = P_0·e^(rt)"],
        },
      ],
      exercises: [
        {
          title: "نمو سكاني أسي",
          statement: "سكان مدينة 50000 نسمة بنمو 2% سنويًا. (1) كم سيكونون بعد 20 سنة؟ (2) بعد كم سنة يتضاعف العدد؟",
          hint: "P(t) = 50000·e^(0.02t) و ln(2)/0.02",
          solution: `(1) $P(20) = 50000 \\times e^{0.02 \\times 20} = 50000 \\times e^{0.4} \\approx 50000 \\times 1.4918 = 74591$ نسمة
(2) $t = \\frac{\\ln 2}{0.02} \\approx \\frac{0.693}{0.02} \\approx 34.66$ سنة`,
          difficulty: "INTERMEDIATE",
          type: "PROBLEM",
          points: 5,
          tags: ["أسية", "لوغاريتم", "نمو سكاني"],
        },
      ],
    },
  ],
};

export const curriculum3ASEconomy: UnitSeed[] = [
  unit3ASEco_Sequences,
  unit3ASEco_ExponentialLog,
];
