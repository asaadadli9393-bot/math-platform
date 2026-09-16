// ============================================================
//  المنهاج الرسمي — السنة الثالثة تقني رياضي (3AS-TechnicalMath)
//  الحجم الساعي: 162 ساعة (27 أسبوعًا × 6 ساعات)
//  المصدر: التدرّج الرسمي 2022
// ============================================================
//  الوحدات الرسمية:
//  T1: الدوال العددية، الأسية واللوغاريتمية، النهايات، التزائد المقارن، المتتاليات
//  T2: الدوال الأصلية والحساب التكاملي، الأعداد والحساب، الإحصاء والاحتمالات
//  T3: الأعداد المركبة والتحولات النقطية، الهندسة في الفضاء
// ============================================================

import type { UnitSeed } from "./curriculum";

const unit3ASTechMath_Functions: UnitSeed = {
  slug: "3as-tech-functions",
  title: "الدوال العددية (الاشتقاقية والاستمرارية)",
  description: "الاستمرارية، الاشتقاقية، دراسة الدوال. (الفصل 1 — 12 ساعة)",
  order: 1,
  icon: "FunctionSquare",
  color: "#0EA5E9",
  stream: "TECHNICAL_MATH",
  trimester: 1,
  chapters: [
    {
      slug: "continuity-derivative",
      title: "الاستمرارية والاشتقاقية",
      description: "تعريف الاستمرارية، الاشتقاق، تطبيقات",
      prerequisites: "الاشتقاقية من 2AS.",
      lessons: [
        {
          slug: "continuity-definition",
          title: "الاستمرارية على مجال",
          content: `## الاستمرارية

### تعريف
$f$ مستمرة عند $x_0 \\in D_f$ إذا:
$$\\lim_{x \\to x_0} f(x) = f(x_0)$$

$f$ مستمرة على مجال $I$ إذا كانت مستمرة عند كل نقطة من $I$.

### خصائص
- مجموع، جداء، تركيب، خارج (إذا المقام ≠ 0) دوال مستمرة = دالة مستمرة
- الدوال المرجعية (polynômes, e^x, ln, √, sin, cos) مستمرة على مجالها

### الاشتقاقية
$f$ قابلة للاشتقاق عند $x_0$ إذا وُجد:
$$f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}$$

### علاقة: اشتقاق ⟹ استمرارية
إذا كانت $f$ قابلة للاشتقاق عند $x_0$، فهي مستمرة عندها. (العكس غير صحيح!)

### مثال محلول
$f(x) = |x|$ عند $x_0 = 0$:
- $\\lim_{x \\to 0} |x| = 0 = f(0)$ ← مستمرة ✓
- $\\lim_{h \\to 0^+} \\frac{|h|}{h} = 1$ و $\\lim_{h \\to 0^-} \\frac{|h|}{h} = -1$ → غير قابلة للاشتقاق

### نقاط أساسية
- استمرارية ⟺ lim f(x) = f(x₀)
- اشتقاق ⟹ استمرارية (وليس العكس)
- |x| في 0: مستمرة لكن غير قابلة للاشتقاق`,
          durationMin: 45,
          keyPoints: ["مستمرة ⟺ lim f = f(x₀)", "اشتقاق ⟹ استمرارية", "|x| غير قابلة للاشتقاق في 0"],
        },
      ],
      exercises: [
        {
          title: "دراسة الاستمرارية",
          statement: "لتكن $f(x) = \\begin{cases} x^2 + 1 & x \\leq 2 \\\\ 2x + 1 & x > 2 \\end{cases}$. هل $f$ مستمرة عند $x = 2$؟",
          hint: "احسب lim f من اليسار واليمين وقارن مع f(2)",
          solution: `$f(2) = 2^2 + 1 = 5$
$\\lim_{x \\to 2^-} f(x) = \\lim (x^2 + 1) = 5$ (من اليسار)
$\\lim_{x \\to 2^+} f(x) = \\lim (2x + 1) = 5$ (من اليمين)
النهاية موجودة وتساوي 5 = $f(2)$
**نعم، $f$ مستمرة عند $x = 2$.**`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["استمرارية", "نهاية", "دالة قطعية"],
        },
      ],
    },
  ],
};

const unit3ASTechMath_Integral: UnitSeed = {
  slug: "3as-tech-integral",
  title: "الدوال الأصلية والحساب التكاملي",
  description: "الدالة الأصلية، التكامل، تطبيقات. (الفصل 2 — 18 ساعة)",
  order: 2,
  icon: "Sigma",
  color: "#9333EA",
  stream: "TECHNICAL_MATH",
  trimester: 2,
  chapters: [
    {
      slug: "primitives-integrals",
      title: "الدوال الأصلية والتكامل",
      description: "حساب الدوال الأصلية، التكامل المعرّف، المساحة",
      prerequisites: "الاشتقاقية.",
      lessons: [
        {
          slug: "primitive-computation",
          title: "الدالة الأصلية والتكامل",
          content: `## الدالة الأصلية

### تعريف
$F$ دالة أصلية لـ $f$ على مجال $I$ إذا كانت $F'(x) = f(x)$ لكل $x \\in I$.

### الجدول الأساسي
| $f(x)$ | $F(x)$ |
|--------|--------|
| $x^n$ ($n \\neq -1$) | $\\frac{x^{n+1}}{n+1}$ |
| $\\frac{1}{x}$ | $\\ln|x|$ |
| $e^x$ | $e^x$ |
| $\\frac{1}{\\sqrt{x}}$ | $2\\sqrt{x}$ |

### التكامل المعرّف
$$\\int_a^b f(x) \\, dx = F(b) - F(a) = [F(x)]_a^b$$

### خصائص
- خطية: $\\int (\\alpha f + \\beta g) = \\alpha \\int f + \\beta \\int g$
- قابلية الجمع: $\\int_a^b = \\int_a^c + \\int_c^b$
- إذا $f \\geq 0$ على $[a, b]$: $\\int_a^b f \\geq 0$

### تطبيق: المساحة
إذا $f \\geq 0$ على $[a, b]$، المساحة تحت منحنى $f$ بين $a$ و $b$:
$$\\mathcal{A} = \\int_a^b f(x) \\, dx$$

### مثال محلول
$\\int_0^2 (3x^2 + 2x + 1) \\, dx$
- الدالة الأصلية: $F(x) = x^3 + x^2 + x$
- $F(2) - F(0) = (8 + 4 + 2) - 0 = 14$

### نقاط أساسية
- $F' = f$ ⟹ $F$ أصلية لـ $f$
- $\\int_a^b f = [F]_a^b = F(b) - F(a)$
- المساحة تحت المنحنى = $\\int_a^b f(x) dx$`,
          durationMin: 45,
          keyPoints: ["F' = f", "∫_a^b f = [F]_a^b", "مساحة = ∫f"],
        },
      ],
      exercises: [
        {
          title: "حساب تكامل",
          statement: "احسب $I = \\int_1^3 \\frac{2x + 1}{x^2 + x} \\, dx$.",
          hint: "لاحظ أن 2x + 1 هو مشتق x² + x",
          solution: `لاحظ أن $\\frac{d}{dx}(x^2 + x) = 2x + 1$.
إذن $\\frac{2x + 1}{x^2 + x} = \\frac{u'}{u}$ حيث $u = x^2 + x$.
دالتها الأصلية: $\\ln|x^2 + x| = \\ln(u)$.

$I = [\\ln(x^2 + x)]_1^3 = \\ln(12) - \\ln(2) = \\ln\\left(\\frac{12}{2}\\right) = \\ln(6)$`,
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 5,
          tags: ["تكامل", "لوغاريتم", "دالة أصلية"],
        },
      ],
    },
  ],
};

const unit3ASTechMath_ComplexNumbers: UnitSeed = {
  slug: "3as-tech-complex-numbers",
  title: "الأعداد المركبة والتحولات النقطية",
  description: "الأعداد المركبة، الكتابة الأُسية، التحولات. (الفصل 3 — 18 ساعة)",
  order: 3,
  icon: "Hexagon",
  color: "#F59E0B",
  stream: "TECHNICAL_MATH",
  trimester: 3,
  chapters: [
    {
      slug: "complex-basics",
      title: "الأعداد المركبة",
      description: "التعريف، العمليات، المرافق، الطويلة",
      prerequisites: "الجبر الأساسي.",
      lessons: [
        {
          slug: "complex-numbers-overview",
          title: "الأعداد المركبة",
          content: `## الأعداد المركبة

### تعريف
العدد المركب: $z = a + bi$ حيث $a, b \\in \\mathbb{R}$ و $i^2 = -1$.
- $\\mathbb{C} = \\{a + bi \\mid a, b \\in \\mathbb{R}\\}$
- الجزء الحقيقي: $\\text{Re}(z) = a$
- الجزء التخيلي: $\\text{Im}(z) = b$

### العمليات
- $(a + bi) + (c + di) = (a+c) + (b+d)i$
- $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$

### المرافق والطويلة
- $\\bar{z} = a - bi$
- $|z| = \\sqrt{a^2 + b^2}$
- $z \\cdot \\bar{z} = |z|^2$

### الكتابة الأُسية
إذا $z = a + bi$ و $|z| = r$ و $\\theta = \\arg(z)$:
$$z = r(\\cos\\theta + i\\sin\\theta) = r \\cdot e^{i\\theta}$$

### صيغة Moivre
$$(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$$

### مثال محلول
$z = 1 + i$
- $|z| = \\sqrt{1 + 1} = \\sqrt{2}$
- $\\arg(z) = \\pi/4$
- الكتابة الأُسية: $z = \\sqrt{2} \\cdot e^{i\\pi/4}$

### نقاط أساسية
- $i^2 = -1$
- $|z|^2 = z \\cdot \\bar{z}$
- $z = r \\cdot e^{i\\theta}$ (كتابة أُسية)`,
          durationMin: 45,
          keyPoints: ["i² = -1", "|z|² = z·z̄", "z = r·e^(iθ)"],
        },
      ],
      exercises: [
        {
          title: "حساب مع الأعداد المركبة",
          statement: "لتكن $z = 3 + 4i$ و $w = 1 - 2i$. (1) احسب $z + w$ و $z \\cdot w$. (2) احسب $|z|$ و $\\arg(z)$. (3) اكتب $z$ بالكتابة الأُسية.",
          hint: "لـ arg(z): tan θ = b/a",
          solution: `(1) $z + w = (3+1) + (4-2)i = 4 + 2i$
$z \\cdot w = (3)(1) + (3)(-2i) + (4i)(1) + (4i)(-2i) = 3 - 6i + 4i - 8i^2 = 3 - 2i + 8 = 11 - 2i$

(2) $|z| = \\sqrt{9 + 16} = 5$
$\\arg(z) = \\arctan(4/3) \\approx 0.927$ rad

(3) $z = 5 \\cdot e^{i \\arctan(4/3)}$`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 5,
          tags: ["عدد مركب", "طويلة", "كتابة أُسية"],
        },
      ],
    },
  ],
};

export const curriculum3ASTechnicalMath: UnitSeed[] = [
  unit3ASTechMath_Functions,
  unit3ASTechMath_Integral,
  unit3ASTechMath_ComplexNumbers,
];
