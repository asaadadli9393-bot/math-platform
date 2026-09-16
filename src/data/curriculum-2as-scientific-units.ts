// ============================================================
//  الوحدات المشتركة للسنة الثانية — الشعب العلمية (Math / TechMath / Experimental)
//  إشراف بيداغوجي: الأستاذ عدلي أسعد
//  مرتّب حسب تدرّج وزارة التربية الوطنية 2022
// ============================================================
//  الوحدات العشر المشتركة بين الشعب العلمية الثلاث:
//    1. الدوال              (2as-functions)
//    2. الاشتقاقية          (2as-derivatives)
//    3. الاحتمالات          (2as-probability)        — مُعاد استخدامها من curriculum-2as.ts
//    4. المرجح              (2as-barycenter)
//    5. النهايات            (2as-limits-continuity)  — مُعاد استخدامها من curriculum-2as.ts
//    6. الزوايا الموجهة     (2as-directed-angles)
//    7. التحولات النقلية    (2as-transformations)
//    8. الجداء السلمي       (2as-scalar-product)
//    9. المتتاليات          (2as-sequences)          — مُعاد استخدامها من curriculum-2as.ts
//   10. الهندسة في الفضاء    (2as-space-geometry)     — مُعاد استخدامها من curriculum-2as.ts
// ============================================================

import type { UnitSeed } from "./curriculum";
import { curriculum2AS } from "./curriculum-2as";

// إعادة استخدام الوحدات من curriculum-2as.ts القديم (المطابقة للتدرّج الرسمي 2022)
// نأخذ: limits-continuity (النهايات)، probability (الاحتمالات)، sequences (المتتاليات)، space-geometry (الهندسة في الفضاء)
const legacyLimitsIdx = curriculum2AS.findIndex((u) => u.slug === "2as-limits-continuity");
const legacyProbabilityIdx = curriculum2AS.findIndex((u) => u.slug === "2as-probability");
const legacySequencesIdx = curriculum2AS.findIndex((u) => u.slug === "2as-sequences");
const legacySpaceGeometryIdx = curriculum2AS.findIndex((u) => u.slug === "2as-space-geometry");

// ============================================================
//  الوحدة 1: الدوال (الفصل 1)
// ============================================================
export const unit2AS_Functions: UnitSeed = {
  slug: "2as-functions",
  title: "الدوال",
  description:
    "العمليات على الدوال (f+g, f·g, f/g, g∘f)، تفكيك دالة بالدوال المرجعية، دراسة تغير الدوال من الشكل f+k، -f، f(ax+b)، حل مسائل بمعادلات ومتراجحات من الدرجة 2 و 3 بالتحليل إلى جداء عوامل. (الفصل 1)",
  order: 1,
  icon: "LineChart",
  color: "#1E40AF",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "2as-functions-operations",
      title: "العمليات على الدوال وتفكيكها",
      description: "f+g, f·g, f/g, g∘f، تفكيك، دوال مرفقة",
      prerequisites: "الدوال المرجعية (1AS).",
      lessons: [
        {
          slug: "2as-functions-ops-composition",
          title: "العمليات على الدوال والمركب",
          content: `## العمليات على الدوال

### تعريفات
لتكن $f$ و $g$ دالتين عدديتين. على مجال مشترك $I$:
- **المجموع**: $(f + g)(x) = f(x) + g(x)$
- **الجداء**: $(f \\cdot g)(x) = f(x) \\cdot g(x)$
- **القسمة**: $\\left(\\dfrac{f}{g}\\right)(x) = \\dfrac{f(x)}{g(x)}$ (إذا $g(x) \\neq 0$)
- **المركب**: $(g \\circ f)(x) = g(f(x))$ — معرفة على $\\{x \\in D_f \\mid f(x) \\in D_g\\}$

### تفكيك دالة
لتكن $h$ دالة. تفكيك $h = g \\circ f$ يعني إيجاد $f, g$ بحيث $h(x) = g(f(x))$.
مثلا: $h(x) = (2x + 1)^2 + 3$ نضع $f(x) = 2x + 1$ و $g(x) = x^2 + 3$.

### تغيرات الدوال المركبة (الحالات البسيطة)
- $f + k$: نفس تغيرات $f$ (النقل عموديًا)
- $k \\cdot f$ ($k > 0$): نفس تغيرات $f$
- $k \\cdot f$ ($k < 0$): تغيرات معكوسة لـ $f$
- $f(-x)$: تناظر بالنسبة لمحور $y$
- $-f(x)$: تناظر بالنسبة لمحور $x$
- $f(ax + b)$ ($a > 0$): نفس تغيرات $f$
- $f(ax + b)$ ($a < 0$): تغيرات معكوسة لـ $f$
- $\\sqrt{f}$ و $f^2$ على مجال موجب: نفس تغيرات $f$

### تناظر المنحنى
- $\\mathcal{C}_f$ متناظر بالنسبة لمحور الترتيب $\\Leftrightarrow f$ زوجية ($f(-x) = f(x)$)
- $\\mathcal{C}_f$ متناظر بالنسبة لمبدأ المعلم $\\Leftrightarrow f$ فردية ($f(-x) = -f(x)$)
- $\\mathcal{C}_f$ متناظر بالنسبة لنقطة $(a, b)$ $\\Leftrightarrow f(2a - x) + f(x) = 2b$
- $\\mathcal{C}_f$ متناظر بالنسبة لمستقيم $x = a$ $\\Leftrightarrow f(a + h) = f(a - h)$ لكل $h$

### أمثلة محلولة
**مثال**: $h(x) = \\sqrt{x^2 + 1}$. نضع $f(x) = x^2 + 1$ و $g(x) = \\sqrt{x}$، فيكون $h = g \\circ f$.

### نقاط أساسية
- g∘f(x) = g(f(x))
- تفكيك: h(x) = (g∘f)(x)
- f(ax+b) بـ a>0: نفس تغيرات f
- f زوجية: f(-x) = f(x)، فردية: f(-x) = -f(x)`,
          durationMin: 50,
          keyPoints: [
            "g∘f(x) = g(f(x))",
            "تفكيك دالة إلى مركب",
            "f(ax+b) (a>0): نفس تغيرات f، (a<0): معكوسة",
            "زوجية: f(-x) = f(x)، فردية: f(-x) = -f(x)",
          ],
        },
      ],
      exercises: [
        {
          title: "تفكيك دالة",
          statement: "فكّك الدالة $h(x) = (3x - 2)^3$ على شكل $g \\circ f$.",
          hint: "ضع f(x) = 3x - 2 و g(x) = x³.",
          solution: `$f(x) = 3x - 2$ و $g(x) = x^3$. تحقق: $(g \\circ f)(x) = g(3x - 2) = (3x - 2)^3 = h(x)$ ✓.`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 3,
          tags: ["مركب", "تفكيك"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 2: الاشتقاقية (الفصل 1)
// ============================================================
export const unit2AS_Derivatives: UnitSeed = {
  slug: "2as-derivatives",
  title: "الاشتقاقية",
  description:
    "العدد المشتق (تعريف وتفسير هندسي = المماس)، التفسير الهندسي للعدد المشتق ومعادلة المماس، حساب مشتقات الدوال المألوفة وقواعد المشتقات (مجموع، جداء، قسمة، ax+b)، المشتق واتجاه التغير، القيم الحدية، حل مسائل الاستمثال. (الفصل 1)",
  order: 2,
  icon: "LineChart",
  color: "#A4133C",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "2as-derivatives-basics",
      title: "العدد المشتق والدالة المشتقة",
      description: "تعريف، تفسير هندسي، قواعد",
      prerequisites: "الدوال المرجعية، النهايات.",
      lessons: [
        {
          slug: "2as-derivative-number-tangent",
          title: "العدد المشتق ومعادلة المماس",
          content: `## العدد المشتق

### تعريف
لتكن $f$ دالة معرفة على مجال يحوي $a$. نقول إن $f$ **قابلة للاشتقاق** عند $a$ إذا كانت النهاية:
$$f'(a) = \\lim_{h \\to 0} \\dfrac{f(a + h) - f(a)}{h}$$
موجودة ومنتهية. العدد $f'(a)$ هو **العدد المشتق** لـ $f$ عند $a$.

### التفسير الهندسي
$f'(a)$ هو معامل توجيه (ميل) المماس $\\mathcal{T}$ لمنحنى $f$ عند النقطة $A(a, f(a))$.

### معادلة المماس
$$\\mathcal{T}: y = f'(a) (x - a) + f(a)$$

### التقريب الخطي (التقريب التآلفي)
قرب $a$: $f(x) \\approx f(a) + f'(a)(x - a)$.

### مشتقات الدوال المرجعية
| $f(x)$ | $f'(x)$ |
|--------|---------|
| $k$ | $0$ |
| $x$ | $1$ |
| $x^n$ ($n \\in \\mathbb{Z}$) | $n x^{n-1}$ |
| $\\dfrac{1}{x}$ | $-\\dfrac{1}{x^2}$ |
| $\\sqrt{x}$ | $\\dfrac{1}{2\\sqrt{x}}$ |
| $\\sin x$ | $\\cos x$ |
| $\\cos x$ | $-\\sin x$ |

### العمليات
- $(u + v)' = u' + v'$
- $(ku)' = k u'$
- $(u v)' = u' v + u v'$
- $\\left(\\dfrac{1}{v}\\right)' = -\\dfrac{v'}{v^2}$
- $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u' v - u v'}{v^2}$
- $(u^n)' = n u' u^{n-1}$
- $(g \\circ f)' = (g' \\circ f) \\cdot f'$ (مشتقة المركب)

### المشتق والتغيرات
- $f'(x) > 0$ على $I$ $\\Rightarrow$ $f$ متزايدة على $I$
- $f'(x) < 0$ على $I$ $\\Rightarrow$ $f$ متناقصة على $I$
- $f'(x_0) = 0$ + تغير إشارة $\\Rightarrow$ قيمة حدية محلية

### أمثلة محلولة
**مثال**: $f(x) = x^3 - 3x^2 + 2$. ادرس تغيرات $f$.
- $f'(x) = 3x^2 - 6x = 3x(x - 2)$
- $f'(x) = 0 \\Leftrightarrow x = 0$ أو $x = 2$
- $f'(x) > 0$ على $]-\\infty, 0[ \\cup ]2, +\\infty[$
- $f'(x) < 0$ على $]0, 2[$
- $f$ متزايدة على $]-\\infty, 0]$ و $[2, +\\infty[$، متناقصة على $[0, 2]$
- قيمة كبرى محلية: $f(0) = 2$، صغرى محلية: $f(2) = -2$.

### نقاط أساسية
- f'(a) = lim (f(a+h)-f(a))/h
- f'(a) = ميل المماس
- المماس: y = f'(a)(x-a) + f(a)
- (u·v)' = u'v + uv'
- (u/v)' = (u'v - uv')/v²
- (g∘f)' = (g'∘f)·f'`,
          durationMin: 60,
          keyPoints: [
            "f'(a) = lim (f(a+h)-f(a))/h",
            "المماس: y = f'(a)(x-a) + f(a)",
            "(u·v)' = u'v + uv'",
            "(u/v)' = (u'v - uv')/v²",
            "(g∘f)' = (g'∘f)·f'",
            "f'(x)>0 ⟹ f متزايدة، f'(x)<0 ⟹ متناقصة",
          ],
        },
      ],
      exercises: [
        {
          title: "حساب مشتقة دالة مركبة",
          statement: "احسب مشتقة الدالة $f(x) = (3x^2 + 1)^5$.",
          hint: "استعمل (u^n)' = n·u'·u^(n-1).",
          solution: `$u = 3x^2 + 1$، $u' = 6x$. $f'(x) = 5 \\cdot 6x \\cdot (3x^2 + 1)^4 = 30x(3x^2 + 1)^4$.`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["مشتقة", "مركب"],
        },
        {
          title: "دراسة تغيرات ومماس",
          statement: "لتكن $f(x) = x^3 - 3x$. (1) ادرس تغيرات $f$. (2) اكتب معادلة المماس عند $a = 1$.",
          hint: "f'(x) = 3x² - 3 = 3(x-1)(x+1).",
          solution: `(1) $f'(x) = 3(x-1)(x+1)$. $f'(x) > 0$ على $]-\\infty, -1[ \\cup ]1, +\\infty[$ و $f'(x) < 0$ على $]-1, 1[$.
- متزايدة على $]-\\infty, -1]$ و $[1, +\\infty[$
- متناقصة على $[-1, 1]$
- كبرى محلية: $f(-1) = 2$، صغرى محلية: $f(1) = -2$.
(2) $f(1) = -2$، $f'(1) = 0$. المماس: $y = -2$ (مستقيم أفقي).`,
          difficulty: "ADVANCED",
          type: "PROBLEM",
          points: 6,
          tags: ["مشتقة", "تغيرات", "مماس"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 4: المرجح (الفصل 1)
// ============================================================
export const unit2AS_Barycenter: UnitSeed = {
  slug: "2as-barycenter",
  title: "المرجّح",
  description:
    "إنشاء مرجح نقطتين وثلاث نقط، خاصية التجميع، حساب إحداثيي المرجح، استعمال المرجح لإثبات استقامية نقط وتلاقي مستقيمات، توظيف المرجح في دراسة مجموعات نقطية. (الفصل 1)",
  order: 4,
  icon: "Box",
  color: "#7C3AED",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "2as-barycenter-basics",
      title: "تعريف وخواص المرجح",
      description: "إنشاء، تجميع، إحداثيات، تطبيقات",
      prerequisites: "الحساب الشعاعي (1AS).",
      lessons: [
        {
          slug: "2as-barycenter-concept",
          title: "مفهوم المرجح وخواصه",
          content: `## المرجح

### تعريف
لتكن $n$ نقطة $A_1, A_2, \\ldots, A_n$ وأعداد حقيقية $\\alpha_1, \\ldots, \\alpha_n$ (معاملات). إذا كان $\\sum \\alpha_i \\neq 0$ فإنه يوجد نقطة وحيدة $G$ تسمى **مرجح** النظام $\\{(A_1, \\alpha_1), \\ldots, (A_n, \\alpha_n)\\}$ تحقق:
$$\\sum_{i=1}^{n} \\alpha_i \\overrightarrow{GA_i} = \\vec{0}$$

نكتب $G = \\mathrm{bar}\\{(A_1, \\alpha_1), \\ldots, (A_n, \\alpha_n)\\}$.

### حالة نقطتين
$G = \\mathrm{bar}\\{(A, \\alpha), (B, \\beta)\\}$ ($\\alpha + \\beta \\neq 0$) تحقق:
$$\\overrightarrow{OG} = \\dfrac{\\alpha \\overrightarrow{OA} + \\beta \\overrightarrow{OB}}{\\alpha + \\beta}$$

### خاصية التجميع (الاختزال)
إذا $\\alpha + \\beta \\neq 0$ و $H = \\mathrm{bar}\\{(A, \\alpha), (B, \\beta)\\}$ فإن:
$$\\mathrm{bar}\\{(A, \\alpha), (B, \\beta), (C, \\gamma)\\} = \\mathrm{bar}\\{(H, \\alpha + \\beta), (C, \\gamma)\\}$$

### خاصية التجانس
$$\\mathrm{bar}\\{(A, k\\alpha), (B, k\\beta), (C, k\\gamma)\\} = \\mathrm{bar}\\{(A, \\alpha), (B, \\beta), (C, \\gamma)\\} \\quad (k \\neq 0)$$

### إحداثيات المرجح
في معلم، $G(x_G, y_G) = \\mathrm{bar}\\{(A_1(x_1, y_1), \\alpha_1), \\ldots, (A_n(x_n, y_n), \\alpha_n)\\}$:
$$x_G = \\dfrac{\\sum \\alpha_i x_i}{\\sum \\alpha_i}, \\quad y_G = \\dfrac{\\sum \\alpha_i y_i}{\\sum \\alpha_i}$$

### خاصية: استقامية
ثلاث نقط $A, B, C$ مستقيمية $\\Leftrightarrow$ يوجد $\\alpha, \\beta, \\gamma$ ليست كلها منعدمة مع $\\alpha + \\beta + \\gamma \\neq 0$ بحيث $\\mathrm{bar}\\{(A, \\alpha), (B, \\beta), (C, \\gamma)\\}$ غير معرف (أو منعدم).
أبسط: $A, B, C$ مستقيمية $\\Leftrightarrow$ $\\exists \\alpha, \\beta, \\gamma$ مع $\\alpha + \\beta + \\gamma = 0$ وغير كلها منعدمة، بحيث $\\alpha \\overrightarrow{PA} + \\beta \\overrightarrow{PB} + \\gamma \\overrightarrow{PC} = \\vec{0}$ لكل $P$.

### أمثلة محلولة
**مثال 1**: $G = \\mathrm{bar}\\{(A, 2), (B, 3)\\}$. $\\overrightarrow{OG} = \\dfrac{2\\overrightarrow{OA} + 3\\overrightarrow{OB}}{5}$.
إذا $A(1, 2)$ و $B(4, 6)$ فإن $G\\left(\\dfrac{2+12}{5}, \\dfrac{4+18}{5}\\right) = G(2.8, 4.4)$.

**مثال 2**: لإثبات استقامية $A, B, C$: نكتب $\\overrightarrow{AB} = \\lambda \\overrightarrow{AC}$ (بحث عن علاقة شعاعية).

### نقاط أساسية
- Σ αᵢ·GAᵢ⃗ = 0⃗
- OG⃗ = (Σ αᵢ·OAᵢ⃗) / (Σ αᵢ)
- خاصية التجميع
- خاصية التجانس
- إحداثيات: x_G = (Σ αᵢxᵢ)/(Σ αᵢ)`,
          durationMin: 55,
          keyPoints: [
            "Σ αᵢ·GAᵢ⃗ = 0⃗",
            "OG⃗ = (Σ αᵢ·OAᵢ⃗)/(Σ αᵢ)",
            "خاصية التجميع: H = bar(A,α),(B,β) → bar(H,α+β)",
            "خاصية التجهن: bar((A,kα)) = bar((A,α))",
            "إحداثيات G = (Σ αᵢxᵢ)/(Σ αᵢ)",
          ],
        },
      ],
      exercises: [
        {
          title: "حساب إحداثيات مرجح",
          statement: "لتكن $A(1, -1)$، $B(3, 5)$، $C(-2, 4)$. احسب إحداثيات $G = \\mathrm{bar}\\{(A, 2), (B, -1), (C, 3)\\}$.",
          hint: "Σ α = 4. استعمل x_G = (Σ αx)/Σ α.",
          solution: `Σ α = 2 - 1 + 3 = 4.
- $x_G = \\dfrac{2(1) + (-1)(3) + 3(-2)}{4} = \\dfrac{2 - 3 - 6}{4} = -\\dfrac{7}{4}$
- $y_G = \\dfrac{2(-1) + (-1)(5) + 3(4)}{4} = \\dfrac{-2 - 5 + 12}{4} = \\dfrac{5}{4}$
إذن $G\\left(-\\dfrac{7}{4}, \\dfrac{5}{4}\\right)$.`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["مرجح", "إحداثيات"],
        },
        {
          title: "إثبات استقامية بالمرجح",
          statement: "لتكن $G = \\mathrm{bar}\\{(A, 2), (B, 3)\\}$ و $I$ منتصف $[AB]$. أثبت أن $A, G, I$ مستقيمية.",
          hint: "أوجد علاقة شعاعية بين G و I.",
          solution: `$I = \\mathrm{bar}\\{(A, 1), (B, 1)\\}$. بالتجهن: $G = \\mathrm{bar}\\{(A, 2), (B, 3)\\}$ = $\\mathrm{bar}\\{(I, 2+3=5)\\}$ غير ممكن لأن I وحدها.
بطريقة أخرى: $\\overrightarrow{AG} = \\dfrac{3}{5}\\overrightarrow{AB}$ و $\\overrightarrow{AI} = \\dfrac{1}{2}\\overrightarrow{AB}$. إذن $\\overrightarrow{AG} = \\dfrac{6}{5}\\overrightarrow{AI}$. إذن $A, G, I$ مستقيمية.`,
          difficulty: "ADVANCED",
          type: "PROBLEM",
          points: 5,
          tags: ["مرجح", "استقامية"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 6: الزوايا الموجهة (الفصل 2)
// ============================================================
export const unit2AS_DirectedAngles: UnitSeed = {
  slug: "2as-directed-angles",
  title: "الزوايا الموجهة",
  description:
    "الزاوية الموجهة لشعاعين وخواصها، أقياس الزاوية الموجهة (القياس الرئيسي)، نظرية الزاوية المحيطية، حساب المثلثات (cos, sin) وتحويلاتها، حل معادلات ومتراجحات مثلثية. (الفصل 2)",
  order: 6,
  icon: "CircleDot",
  color: "#0F766E",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "2as-directed-angles-trig",
      title: "الزوايا الموجهة وحساب المثلثات",
      description: "تعريف، قياس رئيسي، نظرية الزاوية المحيطية، صيغ الجمع",
      prerequisites: "الدائرة المثلثية (1AS).",
      lessons: [
        {
          slug: "2as-directed-angles-properties",
          title: "الزوايا الموجهة وصيغ المثلثات",
          content: `## الزوايا الموجهة

### تعريف
لتكن $\\vec{u}$ و $\\vec{v}$ شعاعان غير منعدمين. **الزاوية الموجهة** $(\\vec{u}, \\vec{v})$ هي الزاوية الناتجة عن دوران يحوّل اتجاه $\\vec{u}$ إلى اتجاه $\\vec{v}$.

### قياس الزاوية الموجهة
- بالراديان: زاوية الدوران (موجب باتجاه عكس عقارب الساعة)
- **القياس الرئيسي**: $\\theta \\in ]-\\pi, \\pi]$
- علاقة القياسات: $(\\vec{u}, \\vec{v}) \\equiv (\\vec{u}, \\vec{v}) + 2k\\pi$، $k \\in \\mathbb{Z}$

### خاصية (علاقة شال)
$$(\\vec{u}, \\vec{v}) + (\\vec{v}, \\vec{w}) \\equiv (\\vec{u}, \\vec{w}) \\pmod{2\\pi}$$

### نظرية الزاوية المحيطية
إذا كانت $A, M, N$ نقطًا على دائرة واحدة و $A \\neq M, N$ فإن:
$$(\\overrightarrow{MA}, \\overrightarrow{MB}) \\equiv \\dfrac{1}{2}(\\overrightarrow{OA}, \\overrightarrow{OB}) \\pmod{\\pi}$$
(حيث $O$ مركز الدائرة.) كل زاويتين محيطيتين تحصران القوس نفسه متقايستان.

### صيغ المثلثات الأساسية
**الجمع**:
- $\\cos(a + b) = \\cos a \\cos b - \\sin a \\sin b$
- $\\cos(a - b) = \\cos a \\cos b + \\sin a \\sin b$
- $\\sin(a + b) = \\sin a \\cos b + \\cos a \\sin b$
- $\\sin(a - b) = \\sin a \\cos b - \\cos a \\sin b$

**الاستنتاجات**:
- $\\cos(2a) = \\cos^2 a - \\sin^2 a = 2\\cos^2 a - 1 = 1 - 2\\sin^2 a$
- $\\sin(2a) = 2 \\sin a \\cos a$
- $\\cos^2 a + \\sin^2 a = 1$
- $\\cos^2 a = \\dfrac{1 + \\cos(2a)}{2}$، $\\sin^2 a = \\dfrac{1 - \\cos(2a)}{2}$

### حل المعادلات المثلثية الأساسية
- $\\cos x = \\cos a \\Leftrightarrow x \\equiv a \\pmod{2\\pi}$ أو $x \\equiv -a \\pmod{2\\pi}$
- $\\sin x = \\sin a \\Leftrightarrow x \\equiv a \\pmod{2\\pi}$ أو $x \\equiv \\pi - a \\pmod{2\\pi}$

### أمثلة محلولة
**مثال**: حل $\\cos x = \\dfrac{1}{2}$ على $]-\\pi, \\pi]$.
$\\cos x = 0.5 \\Leftrightarrow x = \\dfrac{\\pi}{3}$ أو $x = -\\dfrac{\\pi}{3}$.

### نقاط أساسية
- القياس الرئيسي ∈ ]-π, π]
- علاقة شال: (u,v) + (v,w) ≡ (u,w)
- نظرية الزاوية المحيطية
- cos(a+b) = cos a cos b - sin a sin b
- sin(2a) = 2 sin a cos a
- cos² + sin² = 1`,
          durationMin: 60,
          keyPoints: [
            "القياس الرئيسي ∈ ]-π, π]",
            "علاقة شال للزوايا",
            "نظرية الزاوية المحيطية",
            "cos(a+b) = cos a cos b - sin a sin b",
            "sin(2a) = 2 sin a cos a",
            "cos² + sin² = 1",
          ],
        },
      ],
      exercises: [
        {
          title: "حل معادلة مثلثية",
          statement: "حل في $]-\\pi, \\pi]$ المعادلة $\\sin x = \\dfrac{\\sqrt{2}}{2}$.",
          hint: "sin(π/4) = √2/2.",
          solution: `$\\sin x = \\dfrac{\\sqrt{2}}{2} = \\sin\\dfrac{\\pi}{4}$.
$x \\equiv \\dfrac{\\pi}{4}$ أو $x \\equiv \\pi - \\dfrac{\\pi}{4} = \\dfrac{3\\pi}{4}$ (mod $2\\pi$).
الحلول في $]-\\pi, \\pi]$: $x = \\dfrac{\\pi}{4}$ أو $x = \\dfrac{3\\pi}{4}$.`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["معادلة مثلثية", "جيب"],
        },
        {
          title: "حساب قيمة بـ صيغة الجمع",
          statement: "احسب $\\cos\\dfrac{\\pi}{12}$ باستعمال صيغة الجمع.",
          hint: "π/12 = π/3 - π/4.",
          solution: `$\\dfrac{\\pi}{12} = \\dfrac{\\pi}{3} - \\dfrac{\\pi}{4}$.
$\\cos\\dfrac{\\pi}{12} = \\cos\\dfrac{\\pi}{3}\\cos\\dfrac{\\pi}{4} + \\sin\\dfrac{\\pi}{3}\\sin\\dfrac{\\pi}{4} = \\dfrac{1}{2} \\cdot \\dfrac{\\sqrt{2}}{2} + \\dfrac{\\sqrt{3}}{2} \\cdot \\dfrac{\\sqrt{2}}{2} = \\dfrac{\\sqrt{2} + \\sqrt{6}}{4}$.`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["حساب مثلثي", "صيغة الجمع"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 7: التحولات النقلية (الفصل 2)
// ============================================================
export const unit2AS_Transformations: UnitSeed = {
  slug: "2as-transformations",
  title: "التحولات النقلية في المستوي",
  description:
    "تطبيق التناظر المركزي والمحوري والانسحاب والدوران والتحاكي في حل مسائل هندسية، تعريف وخواص التحاكي، استعمال خواص التحولات لإثبات استقامية نقط، البحث عن محلات هندسية. (الفصل 2)",
  order: 7,
  icon: "Box",
  color: "#15803D",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "2as-transformations-homothety",
      title: "التحولات النقلية والتحاكي",
      description: "تذكير بالتحولات، التحاكي، تطبيقات",
      prerequisites: "الحساب الشعاعي، الزوايا الموجهة.",
      lessons: [
        {
          slug: "2as-transformations-properties",
          title: "خواص التحولات النقلية والتحاكي",
          content: `## التحولات النقلية

### تذكير بالتحولات المعروفة
1. **التناظر المركزي** ذو المركز $O$: $M \\mapsto M'$ بحيث $O$ منتصف $[MM']$.
2. **التناظر المحوري** ذو المحور $(\\Delta)$: $M \\mapsto M'$ بحيث $(\\Delta)$ منصف عمودي لـ $[MM']$.
3. **الانسحاب** بشعاع $\\vec{u}$: $M \\mapsto M'$ بحيث $\\overrightarrow{MM'} = \\vec{u}$.
4. **الدوران** بمركز $O$ وزاوية $\\theta$: $M \\mapsto M'$ بحيث $OM = OM'$ و $(\\overrightarrow{OM}, \\overrightarrow{OM'}) = \\theta$.

### الخواص المشتركة
كل هذه التحولات النقلية:
- **تحفظ الاستقامية** (صورة 3 نقط مستقيمية مستقيمية)
- **تحفظ التوازي**
- **تحفظ الأطوال** (للتناظر المركزي والمحوري والانسحاب والدوران)
- **تحفظ الزوايا الموجهة**
- **تحفظ المساحات**

### التحاكي
**التحاكي** ذو المركز $O$ ونسبة $k$ ($k \\neq 0$) هو التحول $h$ الذي يربط كل نقطة $M$ بالنقطة $M' = h(M)$ بحيث:
$$\\overrightarrow{OM'} = k \\overrightarrow{OM}$$

### خواص التحاكي
- $h$ تبقى الاستقامية والتوازي
- طول الصورة: $M'N' = |k| \\cdot MN$
- مساحة الصورة مضروبة في $k^2$، الحجم في $k^3$ (في الفضاء)
- زاوية الصورة: محفوظة (إذا $k > 0$)، معكوسة (إذا $k < 0$)
- صورة منتصف قطعة هي منتصف صورة القطعة

### خاصية هامة
كل تحاكي نسبته سالبة يساوي مركب تحاكي نسبته موجبة (نفس المركز) وتناظر مركزي.

### أمثلة محلولة
**مثال**: تحاكي مركزه $O$ ونسبته $k = 3$، صورة $A$ هي $A'$ بحيث $\\overrightarrow{OA'} = 3\\overrightarrow{OA}$. طول $AB = 4 \\Rightarrow$ طول $A'B' = 12$.

### نقاط أساسية
- التناظر المركزي/المحوري، الانسحاب، الدوران
- تحفظ الاستقامية، التوازي، الأطوال، الزوايا، المساحات
- التحاكي: OM'⃗ = k·OM⃗
- طول الصورة = |k| · الطول الأصلي
- مساحة الصورة × k²`,
          durationMin: 50,
          keyPoints: [
            "4 تحولات نقلية: تناظران، انسحاب، دوران",
            "تحفظ الاستقامية والتوازي والأطوال والزوايا",
            "التحاكي: OM'⃗ = k·OM⃗",
            "طول الصورة = |k| · الطول",
            "مساحة الصورة × k²",
          ],
        },
      ],
      exercises: [
        {
          title: "صورة نقطة بتحاكي",
          statement: "في معلم، $O(0, 0)$ و $A(2, 3)$. أوجد إحداثيات $A'$ صورة $A$ بالتحاكي ذي المركز $O$ والنسبة $k = -2$.",
          hint: "OA'⃗ = k·OA⃗.",
          solution: `$\\overrightarrow{OA'} = -2 \\overrightarrow{OA} = -2(2, 3) = (-4, -6)$. إذن $A'(-4, -6)$.`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["تحاكي", "إحداثيات"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 8: الجداء السلمي (الفصل 2)
// ============================================================
export const unit2AS_ScalarProduct: UnitSeed = {
  slug: "2as-scalar-product",
  title: "الجداء السلمي في المستوي",
  description:
    "تعريف الجداء السلمي وخواصه، التعبير التحليلي، تطبيقات (معادلة مستقيم، معادلة دائرة)، العلاقات المترية (مبرهنة الكاشي، Al-Kashi)، حل معادلة cos(ax+b) = c. (الفصل 2)",
  order: 8,
  icon: "Divide",
  color: "#1E3A8A",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "2as-scalar-product-applications",
      title: "الجداء السلمي وتطبيقاته",
      description: "تعريف، خواص، تعبير تحليلي، تطبيقات مترية",
      prerequisites: "الحساب الشعاعي، الزوايا.",
      lessons: [
        {
          slug: "2as-scalar-product-definition",
          title: "الجداء السلمي والعلاقات المترية",
          content: `## الجداء السلمي

### تعريف هندسي
لتكن $\\vec{u}$ و $\\vec{v}$ شعاعان غير منعدمين. **الجداء السلمي** للشعاعين هو العدد الحقيقي:
$$\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\cdot \\|\\vec{v}\\| \\cdot \\cos(\\vec{u}, \\vec{v})$$
إذا كان أحد الشعاعين منعدمًا فإن $\\vec{u} \\cdot \\vec{v} = 0$.

### خاصية (التعامد)
$\\vec{u} \\perp \\vec{v} \\Leftrightarrow \\vec{u} \\cdot \\vec{v} = 0$

### خواص
1. $\\vec{u} \\cdot \\vec{v} = \\vec{v} \\cdot \\vec{u}$ (تبديلية)
2. $\\vec{u} \\cdot (\\vec{v} + \\vec{w}) = \\vec{u} \\cdot \\vec{v} + \\vec{u} \\cdot \\vec{w}$ (توزيعية)
3. $(k\\vec{u}) \\cdot \\vec{v} = k(\\vec{u} \\cdot \\vec{v})$
4. $\\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\|^2 \\geq 0$ (مربع سلمي)
5. $\\vec{u} \\cdot \\vec{u} = 0 \\Leftrightarrow \\vec{u} = \\vec{0}$

### التعبير التحليلي
في معلم متعامد متجانس، إذا $\\vec{u}(x, y)$ و $\\vec{v}(x', y')$ فإن:
$$\\vec{u} \\cdot \\vec{v} = x x' + y y'$$

### تطبيق: معادلة مستقيم
المستقيم المار من $A(x_A, y_A)$ بشعاع ناظمي $\\vec{n}(a, b)$:
$$a(x - x_A) + b(y - y_A) = 0$$

### تطبيق: معادلة دائرة
الدائرة مركزها $\\Omega(a, b)$ ونصف قطرها $r$:
$$(x - a)^2 + (y - b)^2 = r^2$$

### مبرهنة الكاشي (Al-Kashi)
في المثلث $ABC$:
$$BC^2 = AB^2 + AC^2 - 2 \\cdot AB \\cdot AC \\cdot \\cos \\widehat{BAC}$$
(تعميم لفيثاغورس.)

### مبرهنة الوسط الهندسي
$$\\overrightarrow{MA} \\cdot \\overrightarrow{MB} = MI^2 - \\dfrac{AB^2}{4}$$
حيث $I$ منتصف $[AB]$.

### أمثلة محلولة
**مثال**: $\\vec{u}(3, 4)$، $\\vec{v}(2, -1)$. $\\vec{u} \\cdot \\vec{v} = 6 - 4 = 2$. $\\|\\vec{u}\\| = 5$، $\\|\\vec{v}\\| = \\sqrt{5}$. $\\cos\\theta = \\dfrac{2}{5\\sqrt{5}} \\approx 0.179$، $\\theta \\approx 79.7°$.

### نقاط أساسية
- u⃗·v⃗ = ‖u⃗‖·‖v⃗‖·cos(u⃗,v⃗)
- u⃗ ⊥ v⃗ ⟺ u⃗·v⃗ = 0
- تحليلي: u⃗·v⃗ = xx' + yy'
- u⃗·u⃗ = ‖u⃗‖²
- كاشي: BC² = AB² + AC² - 2·AB·AC·cos(A)
- دائرة: (x-a)² + (y-b)² = r²`,
          durationMin: 60,
          keyPoints: [
            "u⃗·v⃗ = ‖u⃗‖·‖v⃗‖·cos(u⃗,v⃗)",
            "u⃗ ⊥ v⃗ ⟺ u⃗·v⃗ = 0",
            "تحليلي: xx' + yy'",
            "كاشي: BC² = AB² + AC² - 2·AB·AC·cos A",
            "معادلة دائرة: (x-a)² + (y-b)² = r²",
          ],
        },
      ],
      exercises: [
        {
          title: "إيجاد زاوية بـ الجداء السلمي",
          statement: "لتكن $\\vec{u}(1, 2)$ و $\\vec{v}(3, -1)$. احسب $\\vec{u} \\cdot \\vec{v}$ ثم استنتج قياس الزاوية $(\\vec{u}, \\vec{v})$.",
          hint: "u⃗·v⃗ = 1·3 + 2·(-1) = 1. ‖u⃗‖ = √5، ‖v⃗‖ = √10.",
          solution: `$\\vec{u} \\cdot \\vec{v} = 3 - 2 = 1$. $\\|\\vec{u}\\| = \\sqrt{5}$، $\\|\\vec{v}\\| = \\sqrt{10}$.
$\\cos\\theta = \\dfrac{1}{\\sqrt{5} \\cdot \\sqrt{10}} = \\dfrac{1}{\\sqrt{50}} \\approx 0.1414$.
$\\theta \\approx \\arccos(0.1414) \\approx 81.87°$.`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["جداء سلمي", "زاوية"],
        },
        {
          title: "تطبيق مبرهنة الكاشي",
          statement: "في المثلث $ABC$، $AB = 5$، $AC = 7$، $\\widehat{BAC} = 60°$. احسب $BC$.",
          hint: "BC² = AB² + AC² - 2·AB·AC·cos(60°).",
          solution: `$BC^2 = 25 + 49 - 2 \\cdot 5 \\cdot 7 \\cdot 0.5 = 74 - 35 = 39$.
$BC = \\sqrt{39} \\approx 6.24$.`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["كاشي", "مثلث"],
        },
      ],
    },
  ],
};

// ============================================================
//  تصدير الوحدات العلمية المشتركة + الوحدات القديمة المعاد استخدامها
// ============================================================
export const shared2AS_Units = {
  Functions: unit2AS_Functions,
  Derivatives: unit2AS_Derivatives,
  Probability: legacyProbabilityIdx >= 0 ? curriculum2AS[legacyProbabilityIdx] : unit2AS_Functions,
  Barycenter: unit2AS_Barycenter,
  Limits: legacyLimitsIdx >= 0 ? curriculum2AS[legacyLimitsIdx] : unit2AS_Functions,
  DirectedAngles: unit2AS_DirectedAngles,
  Transformations: unit2AS_Transformations,
  ScalarProduct: unit2AS_ScalarProduct,
  Sequences: legacySequencesIdx >= 0 ? curriculum2AS[legacySequencesIdx] : unit2AS_Functions,
  SpaceGeometry: legacySpaceGeometryIdx >= 0 ? curriculum2AS[legacySpaceGeometryIdx] : unit2AS_Functions,
};
