// ============================================================
//  المنهاج الرسمي — السنة الثالثة علوم تجريبية (3AS-Experimental)
//  الحجم الساعي: 135 ساعة (27 أسبوعًا × 5 ساعات)
//  المصدر: التدرّج الرسمي 2022
// ============================================================
//  الوحدات الرسمية:
//  T1: الدوال العددية، الأسية واللوغاريتمية، النهايات والتزائد المقارن، المتتاليات
//  T2: المتتاليات (تابع)، الدوال الأصلية والحساب التكاملي، الاحتمالات والإحصاء، الأعداد المركبة
//  T3: التحولات النقطية، الهندسة في الفضاء
// ============================================================

import type { UnitSeed } from "./curriculum";

const unit3ASExp_Functions: UnitSeed = {
  slug: "3as-exp-functions",
  title: "الدوال العددية (الاشتقاقية والاستمرارية)",
  description: "الاستمرارية، الاشتقاقية، تطبيقات. (الفصل 1 — 10 ساعات)",
  order: 1,
  icon: "FunctionSquare",
  color: "#0EA5E9",
  stream: "EXPERIMENTAL_SCIENCES",
  trimester: 1,
  chapters: [
    {
      slug: "functions-study",
      title: "دراسة الدوال",
      description: "الاستمرارية، الاشتقاق، اتجاه التغير، القيم القصوى",
      prerequisites: "الاشتقاقية من 2AS.",
      lessons: [
        {
          slug: "function-deep-study",
          title: "الدراسة الكاملة لدالة",
          content: `## الدراسة الكاملة لدالة

### خطوات الدراسة
1. **مجال التعريف**: تحديد $D_f$
2. **الاستمرارية**: أين $f$ مستمرة؟
3. **الاشتقاقية**: حساب $f'(x)$ ومجالها
4. **إشارة $f'$**: جدول إشارة المشتقة
5. **جدول التغيرات**: تزايد/تناقص، قيم قصوى
6. **النقاط الخاصة**: تقاطع مع المحاور، نقاط عدم اشتقاق
7. **النهايات**: عند فروع المجال
8. **التمثيل البياني**

### مثال محلول
$f(x) = \\frac{x^2 - 4}{x - 2}$ على $\\mathbb{R} \\setminus \\{2\\}$
- **التبسيط**: $f(x) = \\frac{(x-2)(x+2)}{x-2} = x + 2$ (لـ $x \\neq 2$)
- **مجال**: $D_f = \\mathbb{R} \\setminus \\{2\\}$
- **استمرارية**: مستمرة على $D_f$
- **اشتقاق**: $f'(x) = 1 > 0$ ← تزايدية على $D_f$
- **نهاية عند 2**: $\\lim_{x \\to 2} f(x) = 4$
- **المنحنى**: مستقيم $y = x + 2$ مع "ثقب" عند $(2, 4)$

### نقاط أساسية
- ابدأ بتبسيط الدالة إن أمكن
- اشتق ← إشارة ← تغيرات
- انتبه للنقاط المستثناة من المجال`,
          durationMin: 40,
          keyPoints: ["خطوات: مجال → استمرارية → اشتقاق → إشارة → تغيرات", "تبسيط أولاً", "الثقوب في المنحنى"],
        },
      ],
      exercises: [
        {
          title: "دراسة دالة كسرية",
          statement: "ادرس الدالة $f(x) = \\frac{x^3}{x^2 - 1}$ على $\\mathbb{R} \\setminus \\{-1, 1\\}$: (1) مجال التعريف. (2) المشتقة. (3) اتجاه التغير.",
          hint: "f'(x) = [3x²(x²-1) - x³·2x] / (x²-1)²",
          solution: `(1) $D_f = \\mathbb{R} \\setminus \\{-1, 1\\}$ (لا قسمة على صفر)

(2) $f'(x) = \\frac{3x^2(x^2-1) - x^3 \\cdot 2x}{(x^2-1)^2} = \\frac{3x^4 - 3x^2 - 2x^4}{(x^2-1)^2} = \\frac{x^2(x^2 - 3)}{(x^2-1)^2}$

(3) إشارة $f'$: نفس إشارة $x^2(x^2 - 3)$ لأن المقام موجب:
- $x^2 \\geq 0$ دائمًا
- $x^2 - 3 \\geq 0 \\iff |x| \\geq \\sqrt{3}$
- إذن:
  - $x \\in ]-\\sqrt{3}, -1[ \\cup ]-1, 0[ \\cup ]0, 1[ \\cup ]1, \\sqrt{3}[$: $f' < 0$ (تناقص)
  - $x \\in ]-\\infty, -\\sqrt{3}] \\cup [\\sqrt{3}, +\\infty[$: $f' > 0$ (تزايد)
  - عند $x = 0$: $f' = 0$ (نقطة انعطاف أفقية)`,
          difficulty: "ADVANCED",
          type: "PROBLEM",
          points: 8,
          tags: ["دالة كسرية", "اشتقاق", "تغيرات"],
        },
      ],
    },
  ],
};

const unit3ASExp_Integral: UnitSeed = {
  slug: "3as-exp-integral",
  title: "الدوال الأصلية والحساب التكاملي",
  description: "التكامل، التطبيقات على المساحة والحجم. (الفصل 2 — 13 ساعة)",
  order: 2,
  icon: "Sigma",
  color: "#9333EA",
  stream: "EXPERIMENTAL_SCIENCES",
  trimester: 2,
  chapters: [
    {
      slug: "integration-techniques",
      title: "تقنيات التكامل",
      description: "التكامل بالتجزئة، تغيير المتغير",
      prerequisites: "الدوال الأصلية الأساسية.",
      lessons: [
        {
          slug: "integration-by-parts",
          title: "التكامل بالتجزئة وتغيير المتغير",
          content: `## تقنيات التكامل

### التكامل بالتجزئة
$$\\int u(x) \\cdot v'(x) \\, dx = u(x) \\cdot v(x) - \\int u'(x) \\cdot v(x) \\, dx$$

**متى نستعمل؟** عندما يكون جداء من نوع:
- Polynôme × exponentielle
- Polynôme × ln
- Polynôme × sin/cos

### مثال: $\\int x \\cdot e^x \\, dx$
- $u = x$, $u' = 1$
- $v' = e^x$, $v = e^x$
- $\\int x e^x = x \\cdot e^x - \\int e^x \\, dx = x e^x - e^x + C = (x-1)e^x + C$

### تغيير المتغير
إذا كان لدينا $\\int f(\\phi(t)) \\cdot \\phi'(t) \\, dt$, نضع $x = \\phi(t)$:
$$\\int f(\\phi(t)) \\cdot \\phi'(t) \\, dt = \\int f(x) \\, dx$$

### مثال: $\\int 2x \\cdot \\cos(x^2) \\, dx$
- نضع $u = x^2$, $du = 2x \\, dx$
- $\\int \\cos(u) \\, du = \\sin(u) + C = \\sin(x^2) + C$

### نقاط أساسية
- التجزئة: $\\int u v' = uv - \\int u' v$
- تغيير المتغير: نختار $u = \\phi(t)$ بحيث $\\phi'(t)$ موجودة
- التحقق: اشتق النتيجة للحصول على المكامل`,
          durationMin: 45,
          keyPoints: ["∫u·v' = uv - ∫u'·v", "تغيير متغير: u = φ(t)", "تحقق بالاشتقاق"],
        },
      ],
      exercises: [
        {
          title: "تكامل بالتجزئة",
          statement: "احسب $I = \\int_0^{\\pi/2} x \\cdot \\sin(x) \\, dx$.",
          hint: "u = x, v' = sin(x) → v = -cos(x)",
          solution: `التجزئة: $u = x$, $v' = \\sin x$ → $u' = 1$, $v = -\\cos x$

$I = [x \\cdot (-\\cos x)]_0^{\\pi/2} - \\int_0^{\\pi/2} (-\\cos x) \\, dx$
$I = -\\frac{\\pi}{2} \\cos\\frac{\\pi}{2} + 0 + [\\sin x]_0^{\\pi/2}$
$I = -\\frac{\\pi}{2} \\cdot 0 + (1 - 0) = 1$`,
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 6,
          tags: ["تكامل", "تجزئة", "مثلثيات"],
        },
      ],
    },
  ],
};

const unit3ASExp_ComplexNumbers: UnitSeed = {
  slug: "3as-exp-complex-numbers",
  title: "الأعداد المركبة",
  description: "الأعداد المركبة، الكتابة الأُسية، المعادلات. (الفصل 2 — 15 ساعة)",
  order: 3,
  icon: "Hexagon",
  color: "#F59E0B",
  stream: "EXPERIMENTAL_SCIENCES",
  trimester: 2,
  chapters: [
    {
      slug: "complex-equations",
      title: "المعادلات في $\\mathbb{C}$",
      description: "حل المعادلات في الأعداد المركبة",
      prerequisites: "الأعداد المركبة الأساسية.",
      lessons: [
        {
          slug: "complex-equations-resolution",
          title: "حل المعادلات في الأعداد المركبة",
          content: `## المعادلات في $\\mathbb{C}$

### معادلة من الدرجة الثانية
$az^2 + bz + c = 0$ حيث $a, b, c \\in \\mathbb{R}$ و $a \\neq 0$.

**الحل**: نحسب $\\Delta = b^2 - 4ac$

#### حالة 1: $\\Delta > 0$
حلان حقيقيان: $z = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$

#### حالة 2: $\\Delta = 0$
حل واحد مضاعف: $z = \\frac{-b}{2a}$

#### حالة 3: $\\Delta < 0$
حلان مركبان مترافقان: $z = \\frac{-b \\pm i\\sqrt{-\\Delta}}{2a}$

### مثال محلول
$z^2 + 2z + 5 = 0$
- $\\Delta = 4 - 20 = -16 < 0$
- $\\sqrt{-\\Delta} = 4$
- $z = \\frac{-2 \\pm 4i}{2} = -1 \\pm 2i$

### معادلة $z^n = a$
في $\\mathbb{C}$، $z^n = a$ لها $n$ حلول.

### مثال: $z^2 = 3 + 4i$
نكتب $z = x + iy$:
$x^2 - y^2 = 3$ و $2xy = 4$
- $xy = 2$ → $y = 2/x$
- $x^2 - 4/x^2 = 3$ → $x^4 - 3x^2 - 4 = 0$
- $x^2 = 4$ (موجب) → $x = \\pm 2$
- الحلول: $z = 2 + i$ و $z = -2 - i$

### نقاط أساسية
- $\\Delta < 0$: حلان مركبان مترافقان
- $z^n = a$: $n$ حلول في $\\mathbb{C}$
- $z^2 = a + bi$: نضع $z = x + iy$`,
          durationMin: 45,
          keyPoints: ["Δ<0: حلان مركبان مترافقان", "z^n = a: n حلول", "z = x + iy"],
        },
      ],
      exercises: [
        {
          title: "حل معادلة من الدرجة الثانية في C",
          statement: "حل في $\\mathbb{C}$ المعادلة $z^2 - 4z + 13 = 0$.",
          hint: "احسب Δ الذي سيكون سالبًا",
          solution: `$\\Delta = 16 - 52 = -36 < 0$
$\\sqrt{-\\Delta} = 6$
$z = \\frac{4 \\pm 6i}{2} = 2 \\pm 3i$

الحلان: $z_1 = 2 + 3i$ و $z_2 = 2 - 3i$ (مترافقان)`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 4,
          tags: ["معادلة", "عدد مركب", "مترافق"],
        },
      ],
    },
  ],
};

export const curriculum3ASExperimental: UnitSeed[] = [
  unit3ASExp_Functions,
  unit3ASExp_Integral,
  unit3ASExp_ComplexNumbers,
];
