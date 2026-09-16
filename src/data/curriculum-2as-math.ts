// ============================================================
//  المنهاج الرسمي — السنة الثانية شعبة رياضيات (2AS-Math)
//  الحجم الساعي: 189 ساعة (27 أسبوعًا × 7 ساعات)
//  المصدر: التدرّج الرسمي 2022
// ============================================================
//  الوحدات الرسمية:
//  T1: الدوال، الاشتقاقية، الاحتمالات، المرجح
//  T2: النهايات، الزوايا الموجهة، التحولات النقطية، الجداء السلمي
//  T3: المتتاليات، الهندسة في الفضاء
// ============================================================

import type { UnitSeed } from "./curriculum";

const unit2ASMath_Functions: UnitSeed = {
  slug: "2as-math-functions",
  title: "الدوال",
  description: "العمليات على الدوال، الدوال المرجعية، دراسة اتجاه التغير. (الفصل 1 — 21 ساعة)",
  order: 1,
  icon: "FunctionSquare",
  color: "#0EA5E9",
  stream: "MATHEMATICS",
  trimester: 1,
  chapters: [
    {
      slug: "operations-on-functions",
      title: "العمليات على الدوال",
      description: "مجموع، جداء، تركيب، تقابل دالتين",
      prerequisites: "الدوال من 1AS.",
      lessons: [
        {
          slug: "function-composition",
          title: "تركيب الدوال",
          content: `## تركيب الدوال

### تعريف
إذا كانت $f$ معرفة على $I$ و $g$ معرفة على $J$ بحيث $f(I) \\subset J$، فإن تركيب $g$ على $f$ هو:
$$(g \\circ f)(x) = g(f(x))$$

### مجال التعريف
$D_{g \\circ f} = \\{x \\in D_f \\mid f(x) \\in D_g\\}$

### خاصية التركيب
- عمومًا: $g \\circ f \\neq f \\circ g$ (غير تبادلي)
- ترابطي: $(h \\circ g) \\circ f = h \\circ (g \\circ f)$
- الدالة المطابقة: $\\text{id} \\circ f = f \\circ \\text{id} = f$

### الدالة العكسية
إذا كانت $f$ تقابلًا من $I$ إلى $J$:
$$f^{-1} \\circ f = \\text{id}_I, \\quad f \\circ f^{-1} = \\text{id}_J$$

### مثال محلول
$f(x) = x^2$ على $[0, +\\infty[$ و $g(x) = \\sqrt{x}$ على $[0, +\\infty[$:
- $(g \\circ f)(x) = g(x^2) = \\sqrt{x^2} = |x| = x$ (لـ $x \\geq 0$)
- $(f \\circ g)(x) = f(\\sqrt{x}) = (\\sqrt{x})^2 = x$
- إذن $f$ و $g$ معكوسان لبعضهما على $[0, +\\infty[$

### نقاط أساسية
- $(g \\circ f)(x) = g(f(x))$
- غير تبادلي عمومًا
- شرط التقابل للحصول على $f^{-1}$`,
          durationMin: 45,
          keyPoints: ["(g∘f)(x) = g(f(x))", "غير تبادلي", "f∘f⁻¹ = id"],
        },
      ],
      exercises: [
        {
          title: "تركيب دالتين",
          statement: "لتكن $f(x) = 2x + 1$ و $g(x) = x^2$. (1) احسب $(g \\circ f)(x)$. (2) احسب $(f \\circ g)(x)$. (3) هل $g \\circ f = f \\circ g$؟",
          hint: "طبّق التعريف مباشرة",
          solution: `(1) $(g \\circ f)(x) = g(2x + 1) = (2x + 1)^2 = 4x^2 + 4x + 1$
(2) $(f \\circ g)(x) = f(x^2) = 2x^2 + 1$
(3) $4x^2 + 4x + 1 \\neq 2x^2 + 1$ → غير متساويان (التركيب غير تبادلي)`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["تركيب", "دوال", "تقابل"],
        },
      ],
    },
  ],
};

const unit2ASMath_Derivative: UnitSeed = {
  slug: "2as-math-derivative",
  title: "الاشتقاقية",
  description: "العدد المشتق، الدالة المشتقة، العمليات على المشتقات. (الفصل 1 — 17 ساعة)",
  order: 2,
  icon: "TrendingUp",
  color: "#10B981",
  stream: "MATHEMATICS",
  trimester: 1,
  chapters: [
    {
      slug: "derivative-basics",
      title: "العدد المشتق والدالة المشتقة",
      description: "تعريف، حساب، عمليات",
      prerequisites: "النهايات والدوال.",
      lessons: [
        {
          slug: "derivative-definition",
          title: "تعريف المشتقة",
          content: `## الاشتقاقية

### العدد المشتق
العدد المشتق للدالة $f$ عند $x_0$:
$$f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}$$

### تفسير هندسي
$f'(x_0)$ = ميل المماس لمنحنى $f$ عند $x_0$.

معادلة المماس عند $x_0$:
$$y = f'(x_0)(x - x_0) + f(x_0)$$

### الدالة المشتقة
الدالة $f'$ التي تربط كل $x$ بـ $f'(x)$ حيث توجد المشتقة.

### المشتقات الأساسية
| $f(x)$ | $f'(x)$ |
|--------|---------|
| $k$ | $0$ |
| $x$ | $1$ |
| $x^n$ | $nx^{n-1}$ |
| $\\frac{1}{x}$ | $-\\frac{1}{x^2}$ |
| $\\sqrt{x}$ | $\\frac{1}{2\\sqrt{x}}$ |

### عمليات
- $(u + v)' = u' + v'$
- $(uv)' = u'v + uv'$
- $(ku)' = ku'$
- $\\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2}$
- $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$

### مثال محلول
$f(x) = (2x + 1)(x - 3)$
- نطبّق قاعدة الجداء: $u = 2x + 1$, $v = x - 3$
- $u' = 2$, $v' = 1$
- $f'(x) = 2(x - 3) + (2x + 1)(1) = 2x - 6 + 2x + 1 = 4x - 5$

### نقاط أساسية
- $f'(x_0)$ = ميل المماس
- معادلة المماس: $y = f'(x_0)(x - x_0) + f(x_0)$
- $(uv)' = u'v + uv'$, $(u/v)' = (u'v - uv')/v²$`,
          durationMin: 45,
          keyPoints: ["f'(x₀) = ميل المماس", "(uv)' = u'v + uv'", "(u/v)' = (u'v - uv')/v²"],
        },
      ],
      exercises: [
        {
          title: "حساب دالة مشتقة",
          statement: "احسب المشتقة للدالة $f(x) = \\frac{2x + 1}{x - 3}$ على مجال تعريفها.",
          hint: "استعمل قاعدة المشتقة للكسر",
          solution: `نطبّق $(u/v)' = (u'v - uv')/v^2$:
- $u = 2x + 1$, $u' = 2$
- $v = x - 3$, $v' = 1$
- $f'(x) = \\frac{2(x-3) - (2x+1)(1)}{(x-3)^2} = \\frac{2x - 6 - 2x - 1}{(x-3)^2} = \\frac{-7}{(x-3)^2}$

المجال: $\\mathbb{R} \\setminus \\{3\\}$`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["مشتقة", "كسر"],
        },
      ],
    },
  ],
};

const unit2ASMath_Limits: UnitSeed = {
  slug: "2as-math-limits",
  title: "النهايات",
  description: "حساب النهايات، حالات عدم التعيين، الاستمرارية. (الفصل 2 — 18 ساعة)",
  order: 3,
  icon: "Infinity",
  color: "#9333EA",
  stream: "MATHEMATICS",
  trimester: 2,
  chapters: [
    {
      slug: "limits-computation",
      title: "حساب النهايات",
      description: "النهايات الأساسية، العمليات، حالات عدم التعيين",
      prerequisites: "الدوال المرجعية.",
      lessons: [
        {
          slug: "limits-indeterminate",
          title: "حالات عدم التعيين",
          content: `## حالات عدم التعيين

### الصيغ الأساسية
عند حساب النهايات، نواجه 4 حالات عدم تعيين:
1. $\\frac{0}{0}$
2. $\\frac{\\infty}{\\infty}$
3. $\\infty - \\infty$
4. $0 \\times \\infty$

### تقنيات الرفع
1. **التبسيط**: تحليل واختزال
2. **الكو conjugate**: للجذور
3. **القسمة الإقليدية**: للكسور
4. **القاعدة**: في اللانهايات، نأخذ أعلى درجة

### أمثلة محلولة

**مثال 1**: $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$
- صيغة $\\frac{0}{0}$
- تبسيط: $\\frac{(x-2)(x+2)}{x-2} = x + 2$
- النتيجة: $\\lim_{x \\to 2} (x + 2) = 4$

**مثال 2**: $\\lim_{x \\to +\\infty} \\frac{3x^2 + 2x - 1}{x^2 - 5}$
- صيغة $\\frac{\\infty}{\\infty}$
- بأعلى درجة: $\\frac{3x^2}{x^2} = 3$
- النتيجة: $3$

**مثال 3**: $\\lim_{x \\to +\\infty} \\sqrt{x^2 + 1} - x$
- صيغة $\\infty - \\infty$
- بالمرافق: $\\frac{(x^2 + 1) - x^2}{\\sqrt{x^2 + 1} + x} = \\frac{1}{\\sqrt{x^2 + 1} + x}$
- النتيجة: $0$

### نقاط أساسية
- 4 حالات عدم تعيين تحتاج تقنيات خاصة
- التبسيط يحل $\\frac{0}{0}$
- بأعلى درجة يحل $\\frac{\\infty}{\\infty}$
- المرافق للجذور`,
          durationMin: 45,
          keyPoints: ["0/0: تبسيط", "∞/∞: أعلى درجة", "∞-∞: مرافق"],
        },
      ],
      exercises: [
        {
          title: "حل حالة عدم تعيين",
          statement: "احسب $\\lim_{x \\to +\\infty} \\frac{2x^3 - x + 1}{x^3 + 4x^2}$.",
          hint: "اقسم على x³",
          solution: `بأعلى درجة: نقسم على $x^3$:
$$\\lim_{x \\to +\\infty} \\frac{2x^3/x^3 - x/x^3 + 1/x^3}{x^3/x^3 + 4x^2/x^3} = \\lim_{x \\to +\\infty} \\frac{2 - 1/x^2 + 1/x^3}{1 + 4/x} = \\frac{2 - 0 + 0}{1 + 0} = 2$$`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["نهاية", "عدم تعيين"],
        },
      ],
    },
  ],
};

const unit2ASMath_Sequences: UnitSeed = {
  slug: "2as-math-sequences",
  title: "المتتاليات",
  description: "متتاليات حسابية وهندسية، رتابة، حدود. (الفصل 3 — 14 ساعة)",
  order: 4,
  icon: "TrendingUp",
  color: "#84CC16",
  stream: "MATHEMATICS",
  trimester: 3,
  chapters: [
    {
      slug: "sequences-recurrent",
      title: "المتتاليات التكرارية",
      description: "المتتاليات المتولدة بعلاقة تكرارية، رتابة، تقارب",
      prerequisites: "المتتاليات الأساسية.",
      lessons: [
        {
          slug: "recurrent-sequences",
          title: "دراسة متتالية تكرارية",
          content: `## المتتاليات التكرارية

### تعريف
متتالية متولدة بـ:
- حد ابتدائي $u_0$ (أو $u_1$)
- علاقة تكرارية: $u_{n+1} = f(u_n)$

### دراسة الرتابة
نحسب $u_{n+1} - u_n$:
- إذا $\\geq 0$: تزايدية
- إذا $\\leq 0$: تناقصية

أو ندرس إشارة $f(x) - x$:
- $f(x) > x$: احتمال تزايد
- $f(x) < x$: احتمال تناقص

### البرهان بالتراجع
لإثبات خاصية $P(n)$ لكل $n \\geq n_0$:
1. **التهيئة**: نتحقق من $P(n_0)$
2. **التراجع**: نفترض $P(n)$ صحيحة، نُثبت $P(n+1)$

### تقارب متتالية تكرارية
إذا تقاربت $u_n$ إلى $\\ell$ و $f$ مستمرة:
$$\\ell = f(\\ell)$$
نحل المعادلة لإيجاد النهاية المحتملة.

### مثال محلول
$u_0 = 2$ و $u_{n+1} = \\frac{u_n + 1}{2}$

**رتابة**: $u_{n+1} - u_n = \\frac{u_n + 1}{2} - u_n = \\frac{1 - u_n}{2}$
- $u_0 = 2 \\Rightarrow u_1 - u_0 = -1/2 < 0$ (تناقص)
- بالإستقراء: $u_n \\geq 1 \\Rightarrow 1 - u_n \\leq 0$ (تناقص)

**نهاية محتملة**: $\\ell = \\frac{\\ell + 1}{2} \\Rightarrow 2\\ell = \\ell + 1 \\Rightarrow \\ell = 1$

### نقاط أساسية
- الرتابة: ندرس $u_{n+1} - u_n$
- التراجع: تهيئة + فرض + استنتاج
- النهاية: حل $\\ell = f(\\ell)$`,
          durationMin: 45,
          keyPoints: ["رتابة: u_{n+1} - u_n", "تراجع: تهيئة + استقراء", "ℓ = f(ℓ) للنهاية"],
        },
      ],
      exercises: [
        {
          title: "دراسة متتالية تكرارية",
          statement: "لتكن $u_0 = 3$ و $u_{n+1} = \\frac{1}{2}u_n + 1$. (1) احسب $u_1, u_2, u_3$. (2) برهن بالتراجع أن $u_n > 2$ لكل $n$. (3) أوجد النهاية المحتملة.",
          hint: "للتراجع: افرض u_n > 2، أثبت u_{n+1} > 2",
          solution: `(1) $u_1 = 1/2 \\cdot 3 + 1 = 5/2 = 2.5$
$u_2 = 1/2 \\cdot 5/2 + 1 = 5/4 + 1 = 9/4 = 2.25$
$u_3 = 1/2 \\cdot 9/4 + 1 = 9/8 + 1 = 17/8 = 2.125$

(2) **التهيئة**: $u_0 = 3 > 2$ ✓
**التراجع**: نفترض $u_n > 2$. إذن:
$u_{n+1} = \\frac{1}{2}u_n + 1 > \\frac{1}{2} \\cdot 2 + 1 = 2$ ✓

(3) النهاية $\\ell$: $\\ell = \\frac{1}{2}\\ell + 1 \\Rightarrow \\ell/2 = 1 \\Rightarrow \\ell = 2$

بما أن المتتالية تناقصية (لأن $u_{n+1} - u_n = (1 - u_n)/2 < 0$) ومحدودة من الأسفل بـ 2، فإنها تتقارب إلى $\\ell = 2$.`,
          difficulty: "ADVANCED",
          type: "PROBLEM",
          points: 8,
          tags: ["متتالية تكرارية", "تراجع", "تقارب"],
        },
      ],
    },
  ],
};

export const curriculum2ASMath: UnitSeed[] = [
  unit2ASMath_Functions,
  unit2ASMath_Derivative,
  unit2ASMath_Limits,
  unit2ASMath_Sequences,
];
