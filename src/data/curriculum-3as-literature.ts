// ============================================================
//  المنهاج الرسمي — السنة الثالثة آداب وفلسفة (3AS-Literature)
//  الحجم الساعي: ~54 ساعة
//  المصدر: التدرّج الرسمي 2022
// ============================================================

import type { UnitSeed } from "./curriculum";

const unit3ASLit_Statistics: UnitSeed = {
  slug: "3as-lit-statistics",
  title: "الإحصاء",
  description: "المؤشرات، التمثيلات، السلاسل المُجدوَلة. (الفصل 1)",
  order: 1,
  icon: "BarChart3",
  color: "#10B981",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "stats-indicators",
      title: "المؤشرات الإحصائية",
      description: "المتوسط، الوسيط، الربيعيات، الانحراف المعياري",
      prerequisites: "الإحصاء من 2AS.",
      lessons: [
        {
          slug: "mean-median-std",
          title: "المؤشرات الإحصائية الكاملة",
          content: `## المؤشرات الإحصائية

### المتوسط المرجَّح
$$\\bar{x} = \\frac{\\sum n_i x_i}{N}$$

### الربيعيات
- $Q_1$: الموقع $\\frac{N}{4}$ (أو $\\frac{N+1}{4}$)
- $Q_2$ = الوسيط: الموقع $\\frac{N}{2}$
- $Q_3$: الموقع $\\frac{3N}{4}$

### التباين والانحراف المعياري
$$V = \\frac{\\sum n_i (x_i - \\bar{x})^2}{N}, \\quad \\sigma = \\sqrt{V}$$

### مثال محلول
السلسلة: 5, 8, 10, 12, 15
- المتوسط: $\\bar{x} = 10$
- التباين: $V = \\frac{(5-10)^2 + (8-10)^2 + (10-10)^2 + (12-10)^2 + (15-10)^2}{5} = \\frac{25 + 4 + 0 + 4 + 25}{5} = \\frac{58}{5} = 11.6$
- الانحراف المعياري: $\\sigma = \\sqrt{11.6} \\approx 3.41$

### نقاط أساسية
- $\\sigma$ يقيس التشتت حول المتوسط
- $V = \\sigma^2$
- أكبر $\\sigma$ → تشتت أكبر`,
          durationMin: 30,
          keyPoints: ["x̄ = Σnᵢxᵢ/N", "V = σ²", "σ = √V"],
        },
      ],
      exercises: [
        {
          title: "حساب مؤشرات",
          statement: "سلسلة: 4, 6, 8, 10, 12, 14. احسب المتوسط والتباين والانحراف المعياري.",
          hint: "احسب x̄ ثم V ثم σ = √V",
          solution: `$\\bar{x} = \\frac{4+6+8+10+12+14}{6} = 9$
$V = \\frac{(4-9)^2 + (6-9)^2 + (8-9)^2 + (10-9)^2 + (12-9)^2 + (14-9)^2}{6}$
$V = \\frac{25 + 9 + 1 + 1 + 9 + 25}{6} = \\frac{70}{6} \\approx 11.67$
$\\sigma = \\sqrt{11.67} \\approx 3.42$`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["إحصاء", "تباين", "انحراف معياري"],
        },
      ],
    },
  ],
};

const unit3ASLit_Probability: UnitSeed = {
  slug: "3as-lit-probability",
  title: "الاحتمالات",
  description: "الاحتمالات الشرطية، الاستقلال، شجرة الاحتمالات. (الفصل 1)",
  order: 2,
  icon: "Dices",
  color: "#F59E0B",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "conditional-probability",
      title: "الاحتمال الشرطي",
      description: "الاحتمال الشرطي، الاستقلال، صيغة بايز",
      prerequisites: "الاحتمالات من 2AS.",
      lessons: [
        {
          slug: "conditional-independence",
          title: "الاحتمال الشرطي والاستقلال",
          content: `## الاحتمال الشرطي

### تعريف
الاحتمال الشرطي لـ $B$ مع علم $A$ محقق:
$$P_A(B) = P(B|A) = \\frac{P(A \\cap B)}{P(A)} \\quad (P(A) > 0)$$

### صيغة الاحتمال المركّب
$$P(A \\cap B) = P(A) \\times P_A(B)$$

### الاستقلال
$A$ و $B$ مستقلان إذا وفقط إذا:
$$P(A \\cap B) = P(A) \\times P(B)$$

### شجرة الاحتمالات
- العقدة الأولى: $A$ و $\\bar{A}$
- العقدة الثانية: $B$ و $\\bar{B}$ من كل فرع
- الاحتمال الكامل: ضرب الاحتمالات على المسار

### صيغة الاحتمالات الكاملة
إذا $A_1, A_2, \\ldots, A_n$ تقسيم للكون:
$$P(B) = \\sum_{i=1}^{n} P(A_i) \\times P_{A_i}(B)$$

### مثال محلول
صندوق به 3 كرات حمراء و 2 زرقاء. نسحب كرتين متتاليتين بدون استبدال.
- $P(\\text{أحمر أول}) = 3/5$
- $P_{\\text{أحمر}}(\\text{أحمر ثاني}) = 2/4 = 1/2$
- $P(\\text{أحمر، أحمر}) = \\frac{3}{5} \\times \\frac{1}{2} = \\frac{3}{10}$

### نقاط أساسية
- $P(B|A) = P(A \\cap B)/P(A)$
- الاستقلال: $P(A \\cap B) = P(A) \\cdot P(B)$
- شجرة: ضرب على المسار`,
          durationMin: 30,
          keyPoints: ["P(B|A) = P(A∩B)/P(A)", "استقلال: P(A∩B) = P(A)·P(B)", "شجرة: ضرب"],
        },
      ],
      exercises: [
        {
          title: "احتمال شرطي",
          statement: "في فصل به 60% بنين و 40% بنات، 70% من البنين نجحوا و 80% من البنات نجحن. (1) ما احتمال أن طالب ناجح؟ (2) إذا كان طالب ناجحًا، ما احتمال أن يكون بنتًا؟",
          hint: "استعمل صيغة الاحتمالات الكاملة ثم صيغة بايز",
          solution: `ليكن $G$ = بنت، $\\bar{G}$ = بنت، $R$ = ناجح.
$P(G) = 0.4$, $P(\\bar{G}) = 0.6$
$P_{\\bar{G}}(R) = 0.7$, $P_G(R) = 0.8$

(1) $P(R) = P(\\bar{G}) \\cdot P_{\\bar{G}}(R) + P(G) \\cdot P_G(R) = 0.6 \\times 0.7 + 0.4 \\times 0.8 = 0.42 + 0.32 = 0.74$

(2) $P_R(G) = \\frac{P(G \\cap R)}{P(R)} = \\frac{0.4 \\times 0.8}{0.74} = \\frac{0.32}{0.74} \\approx 0.432$`,
          difficulty: "ADVANCED",
          type: "PROBLEM",
          points: 6,
          tags: ["احتمال شرطي", "بايز", "شجرة"],
        },
      ],
    },
  ],
};

export const curriculum3ASLiterature: UnitSeed[] = [
  unit3ASLit_Statistics,
  unit3ASLit_Probability,
];
