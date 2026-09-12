// ============================================================
//  src/data/curriculum-extra-units.ts
//  وحدات إضافية ناقصة حسب تدرّج وزارة التربية الوطنية 2022
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  الوحدات الناقصة حسب التدرّج الرسمي:
//  - التكامل (الحساب التكاملي + الدالة الأصلية)
//  - المعادلات التفاضلية
//  هذه الوحدات كانت مدمجة ضمن "دراسة الدوال" سابقاً
//  و الآن نفصلها كوحدات مستقلة كما في التدرّج الرسمي 2022
// ============================================================

import type { UnitSeed } from "./curriculum";

// ============================================================
//  الوحدة 8: الحساب التكاملي — الفصل الثالث (المحور 7)
//  شعب: علوم تجريبية + رياضيات + تقني رياضي
// ============================================================
export const unitIntegration: UnitSeed = {
  slug: "integration",
  title: "الحساب التكاملي",
  description:
    "الدالة الأصلية و الحساب التكاملي: التركيبة الأولية، خصائص التكامل، التكامل بالتجزئة، تغيير المتغير، التطبيقات الهندسية (المساحات و الأحجام). (التدرّج المقرر: الفصل الثالث، المحور 7 — لكل الشعب العلمية)",
  order: 6,
  icon: "Sigma",
  color: "#1B998B",
  stream: "ALL",
  trimester: 3,
  chapters: [
    {
      slug: "primitive-function",
      title: "الدالة الأصلية و التركيبة الأولية",
      description: "تعريف الدالة الأصلية، الخطية، خصائص التكامل غير المحدد",
      prerequisites: "الاشتقاق، دراسة الدوال، النهايات.",
      lessons: [
        {
          slug: "primitive-definition",
          title: "تعريف الدالة الأصلية",
          durationMin: 30,
          content: `
## الدالة الأصلية (Primitive)

### التعريف
لتكن $f$ دالة معرفة على مجال $I$. تسمى **دالة أصلية** لـ $f$ على $I$ كل دالة $F$ قابلة للاشتقاق على $I$ بحيث:
$$F'(x) = f(x) \\quad \\forall x \\in I$$

### خاصية الخطية
إذا كانت $F$ أصلية لـ $f$ و $G$ أصلية لـ $g$ على $I$، فإن:
- $F + G$ أصلية لـ $f + g$
- $\\lambda F$ أصلية لـ $\\lambda f$ ($\\lambda \\in \\mathbb{R}$)

### مبرهنة الوحدانية (إلى ثابت قريب)
إذا كانت $F$ و $G$ دالتان أصليتان لـ $f$ على مجال $I$, فإنّ:
$$F - G = C \\quad (C \\text{ real constant})$$

### المجموعة $\\int f(x)\\, dx$
نرمز لمجموعة دوال $f$ الأصلية بـ:
$$\\int f(x)\\, dx = F(x) + C \\quad (C \\in \\mathbb{R})$$
`,
          keyPoints: [
            "الدالة الأصلية $F$: $F' = f$",
            "الوحدانية إلى ثابت قريب: $F - G = C$",
            "الخطية: $(F + G)' = f + g$, $(\\lambda F)' = \\lambda f$",
            "التركيبة الأولية: $\\int f(x)\\, dx = F(x) + C$",
          ],
        },
        {
          slug: "primitive-rules",
          title: "قواعد الحساب الأولي",
          durationMin: 30,
          content: `
## التراكيب الأولية الأساسية

| الدالة $f(x)$ | الدالة الأصلية $F(x)$ |
|---|---|
| $x^n$ ($n \\neq -1$) | $\\dfrac{x^{n+1}}{n+1} + C$ |
| $\\dfrac{1}{x}$ | $\\ln\\|x\\| + C$ |
| $e^x$ | $e^x + C$ |
| $\\sin x$ | $-\\cos x + C$ |
| $\\cos x$ | $\\sin x + C$ |
| $\\dfrac{1}{1+x^2}$ | $\\arctan x + C$ |

### قواعد التركيب

1. **التأليف الخطي**: $\\int (af + bg)\\, dx = a \\int f\\, dx + b \\int g\\, dx$
2. **دالة مركّبة**: $\\int f'(ax + b)\\, dx = \\frac{1}{a} f(ax + b) + C$ ($a \\neq 0$)
3. **التأليف**: $\\int u'(x) \\cdot f(u(x))\\, dx = F(u(x)) + C$ حيث $F' = f$
`,
          keyPoints: [
            "$\\int x^n\\, dx = \\frac{x^{n+1}}{n+1} + C$ ($n \\neq -1$)",
            "$\\int \\frac{1}{x}\\, dx = \\ln|x| + C$",
            "$\\int e^x\\, dx = e^x + C$",
            "قاعدة التأليف: $\\int u' \\cdot f(u)\\, dx = F(u) + C$",
          ],
        },
      ],
      exercises: [
        {
          title: "أوجد الدالة الأصلية",
          statement: "أوجد $\\int (3x^2 + 2x - 1)\\, dx$.",
          hint: "استعمل قاعدة الخطية + التركيب الأولي للدوال الكثيرة الحدود.",
          solution: "$\\int (3x^2 + 2x - 1)\\, dx = x^3 + x^2 - x + C$",
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
        },
        {
          title: "تركيبة أولية لدالة كسرية",
          statement: "أوجد $\\int \\frac{2x + 1}{x^2 + x + 1}\\, dx$.",
          hint: "لاحظ أنّ مشتق المقام هو $2x + 1$.",
          solution: "نلاحظ: $(x^2 + x + 1)' = 2x + 1$, إذن $\\int \\frac{2x+1}{x^2+x+1}\\, dx = \\ln(x^2+x+1) + C$",
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 3,
        },
      ],
    },
    {
      slug: "definite-integral",
      title: "التكامل المحدد و خصائصه",
      description: "تعريف تكامل ريمان، خصائصه، الخطية، الإضافة، التماثل",
      prerequisites: "الدالة الأصلية، النهايات.",
      lessons: [
        {
          slug: "definite-integral-definition",
          title: "تعريف التكامل المحدد",
          durationMin: 30,
          content: `
## التكامل المحدد

### التعريف
لتكن $f$ دالة متصلة على $[a, b]$ و $F$ دالة أصلية لها. يُعرَّف **التكامل المحدد** بـ:
$$\\int_a^b f(x)\\, dx = F(b) - F(a) = [F(x)]_a^b$$

### خصائص التكامل

1. **الخطية**: $\\int_a^b (\\alpha f + \\beta g)\\, dx = \\alpha \\int_a^b f\\, dx + \\beta \\int_a^b g\\, dx$
2. **علاقة شاسل**: $\\int_a^b f\\, dx = -\\int_b^a f\\, dx$
3. **الإضافة**: $\\int_a^b f\\, dx = \\int_a^c f\\, dx + \\int_c^b f\\, dx$ ($\\forall c \\in [a, b]$)
4. **التماثل**: إذا $f$ زوجية على $[-a, a]$: $\\int_{-a}^a f\\, dx = 2 \\int_0^a f\\, dx$
5. **التماثل**: إذا $f$ فردية على $[-a, a]$: $\\int_{-a}^a f\\, dx = 0$
6. **عدم المساواة**: $f \\leq g$ على $[a, b] \\Rightarrow \\int_a^b f\\, dx \\leq \\int_a^b g\\, dx$
7. **القيمة المتوسطة**: $\\exists c \\in [a, b]: \\int_a^b f\\, dx = f(c)(b - a)$
`,
          keyPoints: [
            "$\\int_a^b f\\, dx = F(b) - F(a)$",
            "علاقة شاسل: $\\int_a^b = -\\int_b^a$",
            "التماثل: زوجية → $2\\int_0^a$, فردية → $0$",
            "عدم المساواة: $f \\leq g \\Rightarrow \\int f \\leq \\int g$",
          ],
        },
      ],
      exercises: [
        {
          title: "حساب تكامل بسيط",
          statement: "احسب $\\int_0^1 (x^2 + 2x)\\, dx$.",
          solution: "$\\int_0^1 (x^2 + 2x)\\, dx = [\\frac{x^3}{3} + x^2]_0^1 = \\frac{1}{3} + 1 = \\frac{4}{3}$",
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
        },
        {
          title: "استعمال التماثل",
          statement: "احسب $\\int_{-2}^2 (x^3 + x \\sin^2 x)\\, dx$.",
          hint: "لاحظ أنّ الدالة فردية.",
          solution: "$x^3$ و $x\\sin^2 x$ كلاهما فرديتان. إذن $\\int_{-2}^2 = 0$.",
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 3,
        },
      ],
    },
    {
      slug: "integration-by-parts",
      title: "التكامل بالتجزئة",
      description: "صيغة التكامل بالتجزئة و تطبيقاتها على دوال الأسية و المثلثية و اللوغاريتمية",
      prerequisites: "الدالة الأصلية، الاشتقاق.",
      lessons: [
        {
          slug: "integration-by-parts-formula",
          title: "صيغة التكامل بالتجزئة",
          durationMin: 30,
          content: `
## التكامل بالتجزئة (Intégration par parties)

### الصيغة
إذا كانت $u$ و $v$ دالتان قابلتان للاشتقاق على $[a, b]$ مع اشتقاق متواصل, فإن:
$$\\int_a^b u(x) v'(x)\\, dx = [u(x) v(x)]_a^b - \\int_a^b u'(x) v(x)\\, dx$$

### الحالات الكلاسيكية
| الشكل $\\int f\\, dx$ | الاختيار |
|---|---|
| $\\int P(x) e^{\\alpha x}\\, dx$ | $u = P$, $v' = e^{\\alpha x}$ |
| $\\int P(x) \\ln x\\, dx$ | $u = \\ln x$, $v' = P$ |
| $\\int P(x) \\sin x\\, dx$ | $u = P$, $v' = \\sin x$ |
| $\\int P(x) \\cos x\\, dx$ | $u = P$, $v' = \\cos x$ |
| $\\int e^{\\alpha x} \\sin(\\beta x)\\, dx$ | $u = \\sin$, $v' = e^{\\alpha x}$ (حلقة) |

حيث $P$ دالة كثيرة الحدود.

### مثال
$\\int_0^1 x e^x\\, dx = [x e^x]_0^1 - \\int_0^1 e^x\\, dx = e - (e - 1) = 1$.
`,
          keyPoints: [
            "$\\int u v' = [uv] - \\int u' v$",
            "اختيار $u$ و $v'$ حسب الأولوية: logarithme → polynôme → trigonométrique → exponentielle",
            "حلقة في بعض الحالات (دالتان متبادلتان)",
          ],
        },
      ],
      exercises: [
        {
          title: "تكامل بسيط بالتجزئة",
          statement: "احسب $\\int_0^1 x e^{-x}\\, dx$.",
          solution: "$u = x, v' = e^{-x}$. النتيجة: $1 - \\frac{2}{e}$.",
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
        },
        {
          title: "تكامل مركّب بالتجزئة",
          statement: "احسب $\\int_1^e x^2 \\ln x\\, dx$.",
          solution: "$u = \\ln x, v' = x^2$. النتيجة: $\\frac{2e^3 + 1}{9}$.",
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 4,
        },
      ],
    },
    {
      slug: "change-of-variable",
      title: "تغيير المتغير في التكامل",
      description: "تقنية تغيير المتغير لحساب التكاليل المعقدة",
      prerequisites: "التكامل المحدد، الدالة الأصلية.",
      lessons: [
        {
          slug: "change-of-variable-formula",
          title: "صيغة تغيير المتغير",
          durationMin: 30,
          content: `
## تغيير المتغير في التكامل

### الصيغة
إذا كانت $\\varphi$ دالة قابلة للاشتقاق على $[\\alpha, \\beta]$ مع $\\varphi'(\\varphi)$ متصلة, و $f$ متصلة على $\\varphi([\\alpha, \\beta])$, فإن:
$$\\int_\\alpha^\\beta f(\\varphi(t)) \\cdot \\varphi'(t)\\, dt = \\int_{\\varphi(\\alpha)}^{\\varphi(\\beta)} f(x)\\, dx$$

### مثال
احسب $\\int_0^{\\sqrt{3}} \\frac{x}{\\sqrt{x^2 + 1}}\\, dx$.

**الحل:** نضع $u = x^2 + 1$, $du = 2x\\, dx$.
- عند $x = 0$: $u = 1$; عند $x = \\sqrt{3}$: $u = 4$
- $\\int_0^{\\sqrt{3}} \\frac{x}{\\sqrt{x^2+1}}\\, dx = \\frac{1}{2} \\int_1^4 \\frac{du}{\\sqrt{u}} = [\\sqrt{u}]_1^4 = 2 - 1 = 1$

### الحالات النموذجية
- $\\int f(ax + b)\\, dx$: نضع $u = ax + b$
- $\\int \\frac{u'(x)}{u(x)}\\, dx = \\ln|u(x)| + C$
- $\\int f(x^n) x^{n-1}\\, dx$: نضع $u = x^n$
`,
          keyPoints: [
            "$\\int f(\\varphi) \\varphi' = F(\\varphi) + C$",
            "تغيير حدود التكامل عند تغيير المتغير",
            "خصائص الاشتقاق المعكوس",
          ],
        },
      ],
      exercises: [
        {
          title: "تغيير متغير بسيط",
          statement: "احسب $\\int_0^{\\ln 2} \\frac{e^x}{1 + e^x}\\, dx$.",
          solution: "نضع $u = 1 + e^x$, النتيجة: $\\ln(3/2)$.",
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 3,
        },
        {
          title: "تغيير متغير مثلثي",
          statement: "احسب $\\int_0^{\\pi/2} \\sin^3 x\\, dx$.",
          hint: "نضع $u = \\cos x$.",
          solution: "النتيجة: $\\frac{2}{3}$.",
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 4,
        },
      ],
    },
    {
      slug: "applications-geometry",
      title: "التطبيقات الهندسية: المساحات و الأحجام",
      description: "حساب المساحة بين منحنى و المحور السيني, بين منحنيين, و الأحجام بالدوران",
      prerequisites: "التكامل المحدد, دراسة الدوال.",
      lessons: [
        {
          slug: "area-between-curve-axis",
          title: "المساحة بين منحنى و المحور السيني",
          durationMin: 30,
          content: `
## المساحة بين المنحنى $(\\mathcal{C}_f)$ و المحور السيني على $[a, b]$

### الصيغة
إذا كانت $f$ متصلة على $[a, b]$, فإنّ المساحة المحصورة بين منحناها $\\mathcal{C}_f$ و المحور السيني على $[a, b]$ هي:
$$\\mathcal{S} = \\int_a^b |f(x)|\\, dx$$

### حالة خاصة: $f \\geq 0$ على $[a, b]$
$$\\mathcal{S} = \\int_a^b f(x)\\, dx$$

### حالة $f \\leq 0$ على $[a, b]$
$$\\mathcal{S} = -\\int_a^b f(x)\\, dx = \\left|\\int_a^b f(x)\\, dx\\right|$$

### مثال
المساحة بين $y = x^2$ و المحور السيني على $[0, 2]$:
$$\\mathcal{S} = \\int_0^2 x^2\\, dx = \\frac{8}{3}$$

## المساحة بين منحنيين

إذا $f \\geq g$ على $[a, b]$:
$$\\mathcal{S} = \\int_a^b (f(x) - g(x))\\, dx$$
`,
          keyPoints: [
            "المساحة $= \\int |f|$",
            "إذا $f \\geq 0$: $\\int f$",
            "بين منحنيين: $\\int (f - g)$",
          ],
        },
      ],
      exercises: [
        {
          title: "مساحة بسيطة",
          statement: "احسب المساحة بين $y = x^2$ و المحور السيني على $[0, 2]$.",
          solution: "$\\mathcal{S} = \\int_0^2 x^2\\, dx = \\frac{8}{3}$",
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 3,
        },
        {
          title: "مساحة بين منحنيين",
          statement: "احسب المساحة بين $y = x$ و $y = x^2$ على $[0, 1]$.",
          solution: "على $[0, 1]$: $x \\geq x^2$, إذن $\\mathcal{S} = \\int_0^1 (x - x^2)\\, dx = \\frac{1}{6}$.",
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 9: المعادلات التفاضلية — الفصل الثالث (المحور 8)
//  شعب: رياضيات + تقني رياضي
// ============================================================
export const unitDifferentialEquations: UnitSeed = {
  slug: "differential-equations",
  title: "المعادلات التفاضلية",
  description:
    "المعادلات التفاضلية من الدرجة الأولى: $y' = ay + b$ و $y' + ay = b(x)$, طريقة تغيير الدالة الثابتة, التطبيقات الفيزيائية و الاقتصادية. (التدرّج المقرر: الفصل الثالث، المحور 8 — خاص بشعبة الرياضيات و تقني رياضي)",
  order: 7,
  icon: "FunctionSquare",
  color: "#6A4C93",
  stream: "MATHEMATICS",
  trimester: 3,
  chapters: [
    {
      slug: "first-order-homogeneous",
      title: "المعادلات التفاضلية الزوجية من الدرجة الأولى",
      description: "$y' = ay + b$ — الحل العام و الحل الوحيد بالشرط الابتدائي",
      prerequisites: "الدالة الأسية, الاشتقاق.",
      lessons: [
        {
          slug: "definition-differential-equation",
          title: "تعريف المعادلة التفاضلية",
          durationMin: 30,
          content: `
## المعادلة التفاضلية

### التعريف
**المعادلة التفاضلية** هي معادلة تربط دالة مجهولة $y(x)$ بمشتقاتها. تسمى:
- **من الدرجة الأولى** إذا كانت تحتوي $y'$ فقط (و ليس $y''$)
- **خطية ذات معاملات ثابتة** إذا كانت على الشكل $y' + a y = b(x)$ ($a$ ثابت)
- **زوجية (بدون حد ثاني)** إذا $b(x) = 0$

### المعادلة الزوجية $y' = ay$
الحل العام: $y(x) = C e^{ax}$, $C \\in \\mathbb{R}$.

### المعادلة $y' + ay = b$ ($b$ ثابت)
الحل الخاص: $y_p = -b/a$ (إذا $a \\neq 0$).
الحل العام: $y(x) = C e^{-ax} - b/a$.

### مثال
حلّ $y' - 3y = 0$:
- الحل العام: $y = C e^{3x}$
`,
          keyPoints: [
            "$y' = ay \\Rightarrow y = Ce^{ax}$",
            "$y' + ay = b \\Rightarrow y = Ce^{-ax} - b/a$",
            "الشرط الابتدائي $y(x_0) = y_0$ يحدّد $C$",
          ],
        },
      ],
      exercises: [
        {
          title: "حل معادلة تفاضلية بسيطة",
          statement: "حلّ المعادلة التفاضلية $(E): y' + 2y = 0$.",
          solution: "$y' = -2y$, الحل العام: $y(x) = C e^{-2x}$.",
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
        },
        {
          title: "حل بالشرط الابتدائي",
          statement: "حلّ $(E): y' + 2y = 0$ بالشرط $y(0) = 3$.",
          solution: "$y(0) = C = 3$, الحل الوحيد: $y(x) = 3 e^{-2x}$.",
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 3,
        },
      ],
    },
    {
      slug: "non-homogeneous-method",
      title: "المعادلات غير الزوجية — طريقة تغيير الدالة الثابتة",
      description: "$y' + ay = b(x)$ — طريقة_variation_de_la_constante",
      prerequisites: "الحل الزوجي, الدالة الأسية.",
      lessons: [
        {
          slug: "variation-of-constant",
          title: "طريقة تغيير الدالة الثابتة",
          durationMin: 30,
          content: `
## طريقة تغيير الدالة الثابتة (Variation de la constante)

### المعادلة $(E): y' + ay = b(x)$ ($a$ ثابت, $b(x)$ دالة معطاة)

**الخطوة 1:** حلّ المعادلة الزوجية $(E_0): y' + ay = 0$.
الحل العام: $y_h(x) = C e^{-ax}$ (حل زوجي).

**الخطوة 2:** نبحث عن حلّ خاص على الشكل $y_p(x) = C(x) e^{-ax}$, حيث $C$ دالة مجهولة.

نشتق: $y_p'(x) = C'(x) e^{-ax} - a C(x) e^{-ax}$

نعوّض في $(E)$:
$$C'(x) e^{-ax} - a C(x) e^{-ax} + a C(x) e^{-ax} = b(x)$$
$$C'(x) e^{-ax} = b(x)$$
$$C'(x) = b(x) e^{ax}$$

**الخطوة 3:** نكامل:
$$C(x) = \\int b(x) e^{ax}\\, dx + K$$

**الخطوة 4:** الحل العام:
$$y(x) = C(x) e^{-ax} = \\left(\\int b(x) e^{ax}\\, dx + K\\right) e^{-ax}$$

### مثال
حلّ $y' + 2y = e^{-x}$:

1. الحل الزوجي: $y_h = C e^{-2x}$
2. $C'(x) e^{-2x} = e^{-x} \\Rightarrow C'(x) = e^{x} \\Rightarrow C(x) = e^{x} + K$
3. الحل العام: $y(x) = (e^x + K) e^{-2x} = e^{-x} + K e^{-2x}$
`,
          keyPoints: [
            "حلّ المعادلة الزوجية أولاً",
            "نضع $y_p = C(x) e^{-ax}$",
            "نشتق ونعوّض في المعادلة",
            "نكامل لإيجاد $C(x)$",
          ],
        },
      ],
      exercises: [
        {
          title: "معادلة غير زوجية بسيطة",
          statement: "حلّ $y' - y = e^{2x}$.",
          solution: "الحل العام: $y(x) = e^{2x}/3 + C e^{x}$.",
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
        },
        {
          title: "معادلة بالشرط الابتدائي",
          statement: "حلّ $y' + 3y = 2x$ بشرط $y(0) = 1$.",
          solution: "الحل العام: $y = \\frac{2x}{3} - \\frac{2}{9} + C e^{-3x}$. بـ $y(0) = 1$: $C = 11/9$.",
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 5,
        },
      ],
    },
    {
      slug: "applications-physics",
      title: "التطبيقات الفيزيائية و الاقتصادية",
      description: "نموذج النمو الأُسي, اضمحلال بنوعية, التطبيقات في الفيزياء و الاقتصاد",
      prerequisites: "المعادلات التفاضلية, الدالة الأسية.",
      lessons: [
        {
          slug: "exponential-growth",
          title: "النمو الأُسي و الاضمحلال",
          durationMin: 30,
          content: `
## النمو الأُسي و الاضمحلال

### النمو الأُسي
إذا كانت كمية $N(t)$ تتغير بمعدل يتناسب معها:
$$\\frac{dN}{dt} = k N$$

الحل: $N(t) = N_0 e^{kt}$, حيث $N_0 = N(0)$.

### الاضمحلال
$$\\frac{dN}{dt} = -k N \\Rightarrow N(t) = N_0 e^{-kt}$$

### عمر النصف
الزمن اللازم لتناقص $N$ إلى النصف:
$$T_{1/2} = \\frac{\\ln 2}{k}$$

### مثال
ال-carbon 14 له $T_{1/2} = 5730$ سنة, إذن $k = \\frac{\\ln 2}{5730} \\approx 1.21 \\times 10^{-4}$ سنوي.

### تطبيق: التبريد في نيوتن
$$\\frac{dT}{dt} = -k(T - T_e)$$
حيث $T_e$ درجة حرارة المحيط. الحل: $T(t) = T_e + (T_0 - T_e) e^{-kt}$.
`,
          keyPoints: [
            "$dN/dt = kN \\Rightarrow N = N_0 e^{kt}$",
            "عمر النصف $T_{1/2} = \\ln 2 / k$",
            "تبريد نيوتن: $T = T_e + (T_0 - T_e) e^{-kt}$",
          ],
        },
      ],
      exercises: [
        {
          title: "نمو سكاني",
          statement: "تعداد مدينة يزداد بنسبة 3% سنوياً. إذا كان 100,000 اليوم, كم سيكون بعد 10 سنوات؟",
          solution: "$N(t) = 100000 \\cdot e^{0.03 \\times 10} \\approx 134,986$.",
          difficulty: "INTERMEDIATE",
          type: "PROBLEM",
          points: 4,
        },
      ],
    },
  ],
};
