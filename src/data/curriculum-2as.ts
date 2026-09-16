// ============================================================
//  بيانات المنهاج الرسمي — السنة الثانية ثانوي (2AS)
//  الشعب العلمية: علوم تجريبية | رياضيات | تقني رياضي
//  إشراف بيداغوجي: الأستاذ عدلي أسعد
//  مرتّب حسب تدرّج وزارة التربية الوطنية 2022
// ============================================================
//  المحتوى: 8 وحدات كبرى مرتّبة حسب التدرّج الرسمي 2022:
//  الفصل 1: النهايات والاستمرارية + الدالة الأسية + الهندسة في الفضاء
//  الفصل 2: الجداء السلمي في الفضاء + اللوغاريتم + الاحتمالات
//  الفصل 3: المتتاليات + المعادلات التفاضلية
//  ملاحظة: الأعداد المركبة موضوع 3AS وليس 2AS (محذوفة)
// ============================================================

import type { UnitSeed } from "./curriculum";

// ============================================================
//  الوحدة 1: النهايات والاستمرارية (الفصل 1)
// ============================================================
const unit2AS_LimitsContinuity: UnitSeed = {
  slug: "2as-limits-continuity",
  title: "النهايات والاستمرارية",
  description:
    "حساب النهايات، العمليات على النهايات، الاستمرارية، الصور اللانهائية. أساس دراسة الدوال. (التدرّج المقرر: الفصل الأول، المحور 1)",
  order: 1,
  icon: "Infinity",
  color: "#1E3A8A",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "limits-basics",
      title: "النهايات والعمليات",
      description: "تعريف النهاية، النهايات المرجعية، العمليات",
      prerequisites: "الدوال العددية، الترتيب.",
      lessons: [
        {
          slug: "limits-definition",
          title: "النهايات في $\\mathbb{R}$",
          content: `## النهايات

### النهايات المرجعية
- $\\lim_{x \\to +\\infty} \\frac{1}{x} = 0^+$
- $\\lim_{x \\to -\\infty} \\frac{1}{x} = 0^-$
- $\\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty$
- $\\lim_{x \\to 0^-} \\frac{1}{x} = -\\infty$
- $\\lim_{x \\to +\\infty} x^n = +\\infty$ (إذا $n > 0$)
- $\\lim_{x \\to +\\infty} \\sqrt{x} = +\\infty$

### العمليات على النهايات
إذا $\\lim f = L$ و $\\lim g = M$ (حيث $L, M \\in \\mathbb{R}$) فإن:
- $\\lim (f + g) = L + M$
- $\\lim (f \\cdot g) = L \\cdot M$
- $\\lim \\frac{f}{g} = \\frac{L}{M}$ (إذا $M \\neq 0$)

### حالات عدم التعيين
1. **$\\infty - \\infty$**: نطور العبارة (تحليل، تجميع)
2. **$\\frac{\\infty}{\\infty}$**: نطرح القوى الأكبر
3. **$\\frac{0}{0}$**: نتحلل ونبسّط
4. **$0 \\times \\infty$**: نحوّل إلى كسر

### نظرية الحصار (Gendarmes)
إذا $u(x) \\leq f(x) \\leq v(x)$ قرب $a$ و $\\lim_{x \\to a} u = \\lim_{x \\to a} v = L$ فإن:
$$\\lim_{x \\to a} f = L$$

### مثال محلول
$\\lim_{x \\to +\\infty} \\frac{3x^2 - 2x + 1}{x^2 + 5}$

نطرح $x^2$ (الأكبر):
$\\lim \\frac{x^2(3 - 2/x + 1/x^2)}{x^2(1 + 5/x^2)} = \\lim \\frac{3 - 2/x + 1/x^2}{1 + 5/x^2} = \\frac{3 - 0 + 0}{1 + 0} = 3$

### الاستمرارية عند نقطة
$f$ مستمرة عند $a \\in D_f$ إذا:
$$\\lim_{x \\to a} f(x) = f(a)$$

### نقاط أساسية
- الحالات الأربع لعدم التعيين
- نظرية الحصار تحل حالات معقدة
- الاستمرارية = النهاية = قيمة الدالة`,
          durationMin: 50,
          keyPoints: [
            "4 حالات عدم تعيين: ∞-∞, ∞/∞, 0/0, 0×∞",
            "نظرية الحصار: u≤f≤v و lim u=lim v=L ⟹ lim f=L",
            "نطرح القوة الأكبر في حالات ∞/∞",
            "f مستمرة عند a ⟺ lim f(x) = f(a)",
          ],
        },
      ],
      exercises: [
        {
          title: "حساب نهاية كسرية",
          statement: "احسب $\\lim_{x \\to +\\infty} \\frac{2x^3 + x - 1}{x^3 - 3x^2}$",
          hint: "نطرح القوة الأكبر: x³",
          solution: `$\\frac{x^3(2 + 1/x^2 - 1/x^3)}{x^3(1 - 3/x)} = \\frac{2 + 1/x^2 - 1/x^3}{1 - 3/x}$
عند $x \\to +\\infty$: $\\lim = \\frac{2 + 0 - 0}{1 - 0} = 2$`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["نهاية", "كسر"],
        },
        {
          title: "نهاية حالة عدم تعيين",
          statement: "احسب $\\lim_{x \\to +\\infty} (\\sqrt{x^2 + 1} - x)$",
          hint: "اضرب واقسم على المرافق (√(x²+1) + x)",
          solution: `$\\sqrt{x^2 + 1} - x = \\frac{(\\sqrt{x^2+1}-x)(\\sqrt{x^2+1}+x)}{\\sqrt{x^2+1}+x} = \\frac{x^2+1-x^2}{\\sqrt{x^2+1}+x} = \\frac{1}{\\sqrt{x^2+1}+x}$
عند $x \\to +\\infty$: المقام $\\to +\\infty$، إذن $\\lim = 0^+$`,
          methodology: "للقضية على ∞-∞ نضرب بالمرافق لإيجاد شكل قابل للحساب.",
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 5,
          tags: ["نهاية", "عدم تعيين", "مرافق"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 2: الدالة الأسية (الفصل 1)
// ============================================================
const unit2AS_Exponential: UnitSeed = {
  slug: "2as-exponential",
  title: "الدالة الأسية",
  description:
    "الدالة الأسية $e^x$، خصائصها، نهاياتها، معادلات أسية. وحدة مركزية في التحليل. (التدرّج المقرر: الفصل الأول، المحور 2)",
  order: 2,
  icon: "TrendingUp",
  color: "#15803D",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "exponential-definition",
      title: "الدالة الأسية $\\exp$",
      description: "تعريف الدالة الأسية، الخصائص الجبرية والتحليلية",
      prerequisites: "النهايات، الاشتقاق.",
      lessons: [
        {
          slug: "exp-properties",
          title: "خصائص الدالة الأسية",
          content: `## الدالة الأسية $\\exp(x) = e^x$

### التعريف والخصائص الجبرية
- $\\exp(0) = 1$
- $\\exp(1) = e \\approx 2.718$
- $\\exp(a + b) = \\exp(a) \\cdot \\exp(b)$ → $e^{a+b} = e^a \\cdot e^b$
- $\\exp(a - b) = \\frac{\\exp(a)}{\\exp(b)}$
- $\\exp(na) = (\\exp(a))^n$ → $e^{na} = (e^a)^n$

### النهايات المرجعية
- $\\lim_{x \\to +\\infty} e^x = +\\infty$
- $\\lim_{x \\to -\\infty} e^x = 0$
- $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$ (مهم!)
- $\\lim_{x \\to +\\infty} \\frac{e^x}{x^n} = +\\infty$ (لكل $n$)
- $\\lim_{x \\to -\\infty} x^n e^x = 0$

### الاشتقاق
$$(e^x)' = e^x$$
بشكل عام: $\\left(e^{u(x)}\\right)' = u'(x) \\cdot e^{u(x)}$

### حل المعادلات الأسية
- $e^x = e^y \\Leftrightarrow x = y$
- $e^x = a$ ($a > 0$) $\\Leftrightarrow x = \\ln a$
- $e^x = 0$ → لا حل
- $e^x < 0$ → لا حل (لأن $e^x > 0$ دائماً)

### مثال محلول
حل $e^{2x} - 3e^x + 2 = 0$
نضع $X = e^x$ ($X > 0$):
$X^2 - 3X + 2 = 0 \\Rightarrow (X-1)(X-2) = 0 \\Rightarrow X = 1$ أو $X = 2$
- $e^x = 1 \\Rightarrow x = 0$
- $e^x = 2 \\Rightarrow x = \\ln 2$
**الحلول**: $x = 0$ أو $x = \\ln 2$`,
          durationMin: 45,
          keyPoints: [
            "e^(a+b) = e^a · e^b",
            "lim(e^x-1)/x = 1 عند x→0",
            "(e^x)' = e^x",
            "(e^u)' = u'·e^u",
            "e^x > 0 دائماً",
          ],
        },
      ],
      exercises: [
        {
          title: "حل معادلة أسية",
          statement: "حل في $\\mathbb{R}$ المعادلة: $e^{2x} - 5e^x + 6 = 0$",
          hint: "ضع X = e^x (X > 0) ثم حل المعادلة من الدرجة الثانية",
          solution: `نضع $X = e^x$ ($X > 0$):
$X^2 - 5X + 6 = 0 \\Rightarrow \\Delta = 1, X_1 = 2, X_2 = 3$
- $e^x = 2 \\Rightarrow x = \\ln 2$
- $e^x = 3 \\Rightarrow x = \\ln 3$
**الحلول**: $x = \\ln 2$ أو $x = \\ln 3$`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["دالة أسية", "معادلة", "تغيير متغير"],
        },
        {
          title: "حساب نهاية",
          statement: "احسب $\\lim_{x \\to 0} \\frac{e^{2x} - 1}{x}$",
          hint: "استعمل lim (e^t - 1)/t = 1 عند t→0",
          solution: `$\\frac{e^{2x} - 1}{x} = 2 \\cdot \\frac{e^{2x} - 1}{2x}$
نضع $t = 2x$، عند $x \\to 0$: $t \\to 0$
$\\lim 2 \\cdot \\frac{e^t - 1}{t} = 2 \\times 1 = 2$`,
          difficulty: "ADVANCED",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["نهاية", "دالة أسية"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 3: الزوايا والقطوع في الفضاء (الفصل 1)
// ============================================================
const unit2AS_SpaceGeometry: UnitSeed = {
  slug: "2as-space-geometry",
  title: "الهندسة في الفضاء",
  description:
    "الإحداثيات في الفضاء، المسافة، المعادلات، الزوايا. (التدرّج المقرر: الفصل الأول، المحور 3)",
  order: 3,
  icon: "Box",
  color: "#7C3AED",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "space-coordinates",
      title: "الإحداثيات في الفضاء",
      description: "معلم فضائي، إحداثيات، مسافة",
      prerequisites: "الإحداثيات في المستوى.",
      lessons: [
        {
          slug: "3d-coordinates",
          title: "الإحداثيات في الفضاء $\\mathbb{R}^3$",
          content: `## الإحداثيات في الفضاء

### المعلم الديكارتي
معلم فضائي متعامد ممنظم $\\mathcal{R} = (O; \\vec{i}, \\vec{j}, \\vec{k})$ حيث:
- $\\vec{i}, \\vec{j}, \\vec{k}$ متعامدة مثلى مثلى
- $\\|\\vec{i}\\| = \\|\\vec{j}\\| = \\|\\vec{k}\\| = 1$

كل نقطة $M$ في الفضاء لها إحداثيات وحيدة $(x, y, z)$:
$$\\overrightarrow{OM} = x\\vec{i} + y\\vec{j} + z\\vec{k}$$

### المسافة بين نقطتين
$$AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2 + (z_B - z_A)^2}$$

### منتصف قطعة
$$I\\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}, \\frac{z_A + z_B}{2}\\right)$$

### معادلة كرة
كرة المركز $\\Omega(x_0, y_0, z_0)$ والشعاع $R$:
$$(x - x_0)^2 + (y - y_0)^2 + (z - z_0)^2 = R^2$$

### مثال محلول
$A(1, 2, 3)$ و $B(4, 6, 3)$
- $AB = \\sqrt{9 + 16 + 0} = 5$
- منتصف: $I(5/2, 4, 3)$

### نقاط أساسية
- 3 إحداثيات لكل نقطة في الفضاء
- المسافة = جذر مجموع المربعات لفروق الإحداثيات الثلاث
- معادلة الكرة = تعميم معادلة الدائرة`,
          durationMin: 35,
          keyPoints: [
            "AB = √((xᵦ-xₐ)² + (yᵦ-yₐ)² + (zᵦ-zₐ)²)",
            "منتصف [AB] = متوسط الإحداثيات",
            "كرة: (x-x₀)²+(y-y₀)²+(z-z₀)² = R²",
          ],
        },
      ],
      exercises: [
        {
          title: "حساب مسافة في الفضاء",
          statement: "احسب المسافة بين النقطتين $A(2, -1, 3)$ و $B(5, 3, -1)$",
          hint: "AB = √((xᵦ-xₐ)²+(yᵦ-yₐ)²+(zᵦ-zₐ)²)",
          solution: `$AB = \\sqrt{(5-2)^2 + (3-(-1))^2 + ((-1)-3)^2}$
$= \\sqrt{9 + 16 + 16} = \\sqrt{41}$`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
          tags: ["مسافة", "فضاء"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 4: الجداء السلمي في الفضاء (الفصل 2)
// ============================================================
const unit2AS_SpaceDotProduct: UnitSeed = {
  slug: "2as-space-dot-product",
  title: "الجداء السلمي في الفضاء",
  description:
    "الجداء السلمي في $\\mathbb{R}^3$، تطبيقات (تعامد، زوايا، مستويات). (التدرّج المقرر: الفصل الثاني، المحور 4)",
  order: 4,
  icon: "Move3d",
  color: "#B91C1C",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "space-dot-product",
      title: "الجداء السلمي في الفضاء",
      description: "تعريف، خصائص، تطبيقات",
      prerequisites: "الجداء السلمي في المستوى، الإحداثيات في الفضاء.",
      lessons: [
        {
          slug: "3d-dot-product",
          title: "الجداء السلمي في $\\mathbb{R}^3$",
          content: `## الجداء السلمي في الفضاء

### تعريف
إذا كان $\\vec{u}(x, y, z)$ و $\\vec{v}(x', y', z')$ في معلم متعامد ممنظم فإن:
$$\\vec{u} \\cdot \\vec{v} = xx' + yy' + zz'$$

### الخصائص (نفس المستوى)
1. **التبادل**: $\\vec{u} \\cdot \\vec{v} = \\vec{v} \\cdot \\vec{u}$
2. **التوزيع**: $\\vec{u} \\cdot (\\vec{v} + \\vec{w}) = \\vec{u} \\cdot \\vec{v} + \\vec{u} \\cdot \\vec{w}$
3. **المعيار**: $\\|\\vec{u}\\|^2 = x^2 + y^2 + z^2$
4. **التعامد**: $\\vec{u} \\perp \\vec{v} \\Leftrightarrow \\vec{u} \\cdot \\vec{v} = 0$

### الزاوية بين شعاعين
$$\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\cdot \\|\\vec{v}\\|}$$

### معادلة مستوي
المستوي المار بـ $A(x_0, y_0, z_0)$ والشعاع السوي $\\vec{n}(a, b, c)$:
$$a(x - x_0) + b(y - y_0) + c(z - z_0) = 0$$

### مثال محلول
$\\vec{u}(1, 2, -1)$ و $\\vec{v}(2, 0, 2)$
- $\\vec{u} \\cdot \\vec{v} = 1 \\times 2 + 2 \\times 0 + (-1) \\times 2 = 2 - 2 = 0$
- إذن $\\vec{u} \\perp \\vec{v}$ ✓

### تطبيقات
- إثبات تعامد شعاعين
- حساب زاوية بين شعاعين
- إيجاد معادلة مستوي عمودي على شعاع معلوم
- حساب مسافة من نقطة إلى مستوي`,
          durationMin: 40,
          keyPoints: [
            "u⃗·v⃗ = xx' + yy' + zz'",
            "u⃗ ⊥ v⃗ ⟺ u⃗·v⃗ = 0",
            "||u⃗||² = x² + y² + z²",
            "مستوي: a(x-x₀)+b(y-y₀)+c(z-z₀) = 0",
          ],
        },
      ],
      exercises: [
        {
          title: "إثبات تعامد شعاعين في الفضاء",
          statement: "بيّن أن الشعاعين $\\vec{u}(1, -2, 3)$ و $\\vec{v}(3, 3, 1)$ متعامدان.",
          hint: "u⃗ ⊥ v⃗ ⟺ u⃗·v⃗ = 0",
          solution: `$\\vec{u} \\cdot \\vec{v} = 1 \\times 3 + (-2) \\times 3 + 3 \\times 1 = 3 - 6 + 3 = 0$
بما أن $\\vec{u} \\cdot \\vec{v} = 0$ فإن $\\vec{u} \\perp \\vec{v}$. ✓`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
          tags: ["جداء سلمي", "فضاء", "تعامد"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 5: الدالة اللوغاريتمية (الفصل 2)
// ============================================================
const unit2AS_Logarithm: UnitSeed = {
  slug: "2as-logarithm",
  title: "الدالة اللوغاريتمية",
  description:
    "اللوغاريتم النيبيري $\\ln$، خصائصه، نهاياته، معادلات لوغاريتمية. (التدرّج المقرر: الفصل الثاني، المحور 5)",
  order: 5,
  icon: "Calculator",
  color: "#0891B2",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "ln-definition",
      title: "الدالة $\\ln$ وخصائصها",
      description: "تعريف، خصائص جبرية، نهايات، اشتقاق",
      prerequisites: "الدالة الأسية، النهايات.",
      lessons: [
        {
          slug: "ln-properties",
          title: "خصائص الدالة $\\ln$",
          content: `## الدالة اللوغاريتمية $\\ln$

### تعريف
اللوغاريتم النيبيري $\\ln x$ معرّف على $]0, +\\infty[$ و هو الدالة العكسية لـ $e^x$:
$$\\ln x = y \\Leftrightarrow e^y = x$$

### الخصائص الجبرية
1. $\\ln 1 = 0$
2. $\\ln e = 1$
3. $\\ln(ab) = \\ln a + \\ln b$
4. $\\ln\\left(\\frac{a}{b}\\right) = \\ln a - \\ln b$
5. $\\ln(a^n) = n \\ln a$ (لكل $n \\in \\mathbb{Q}$)
6. $\\ln(\\sqrt{a}) = \\frac{1}{2} \\ln a$

### علاقة مع الدالة الأسية
- $\\ln(e^x) = x$ لكل $x \\in \\mathbb{R}$
- $e^{\\ln x} = x$ لكل $x > 0$

### النهايات المرجعية
- $\\lim_{x \\to +\\infty} \\ln x = +\\infty$
- $\\lim_{x \\to 0^+} \\ln x = -\\infty$
- $\\lim_{x \\to 1} \\frac{\\ln x}{x - 1} = 1$ (مهم!)
- $\\lim_{x \\to +\\infty} \\frac{\\ln x}{x^n} = 0$ (لكل $n > 0$)
- $\\lim_{x \\to 0^+} x^n \\ln x = 0$ (لكل $n > 0$)

### الاشتقاق
$$(\\ln x)' = \\frac{1}{x}$$
بشكل عام: $\\left(\\ln|u(x)|\\right)' = \\frac{u'(x)}{u(x)}$

### حل المعادلات اللوغاريتمية
- $\\ln x = \\ln y \\Leftrightarrow x = y$ (مع $x, y > 0$)
- $\\ln x = a \\Leftrightarrow x = e^a$
- $\\ln x + \\ln y = \\ln(xy)$

### مثال محلول
حل $\\ln(x + 1) + \\ln(x - 2) = \\ln 4$
**شرط**: $x > 2$
$\\ln((x+1)(x-2)) = \\ln 4 \\Rightarrow (x+1)(x-2) = 4$
$x^2 - x - 2 = 4 \\Rightarrow x^2 - x - 6 = 0$
$\\Delta = 25$, $x_1 = -2$ (مرفوض) أو $x_2 = 3$ ✓
**الحل**: $x = 3$`,
          durationMin: 50,
          keyPoints: [
            "ln(ab) = ln a + ln b",
            "ln(a/b) = ln a - ln b",
            "ln(a^n) = n·ln a",
            "(ln x)' = 1/x",
            "(ln u)' = u'/u",
            "شرط: x > 0",
          ],
        },
      ],
      exercises: [
        {
          title: "حل معادلة لوغاريتمية",
          statement: "حل في $]0, +\\infty[$: $\\ln x + \\ln(x+1) = \\ln 2$",
          hint: "نجمع اللوغاريتمات باستعمال ln(ab)=ln a + ln b",
          solution: `**شرط**: $x > 0$
$\\ln(x(x+1)) = \\ln 2 \\Rightarrow x^2 + x = 2$
$x^2 + x - 2 = 0 \\Rightarrow \\Delta = 9$, $x_1 = 1$ أو $x_2 = -2$ (مرفوض)
**الحل**: $x = 1$`,
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["لوغاريتم", "معادلة"],
        },
        {
          title: "بسط تعبير لوغاريتمي",
          statement: "بسّط التعبير: $A = \\ln 8 - \\ln 2 + \\ln 4 - \\ln 16$",
          hint: "ln a - ln b = ln(a/b), ln a + ln b = ln(ab)",
          solution: `$A = \\ln\\frac{8}{2} + \\ln\\frac{4}{16} = \\ln 4 + \\ln\\frac{1}{4}$
$= \\ln\\left(4 \\times \\frac{1}{4}\\right) = \\ln 1 = 0$`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["لوغاريتم", "تبسيط"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 6: الاحتمالات (الفصل 2)
// ============================================================
const unit2AS_Probability: UnitSeed = {
  slug: "2as-probability",
  title: "الاحتمالات",
  description:
    "الاحتمالات الشرطية، الاستقلال، صيغة الاحتمالات الكلية. (التدرّج المقرر: الفصل الثاني، المحور 6)",
  order: 6,
  icon: "Dices",
  color: "#BE185D",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "conditional-probability",
      title: "الاحتمالات الشرطية",
      description: "تعريف، صيغة بايز، الاستقلال، شجرة الاحتمالات",
      prerequisites: "الاحتمالات الأساسية، المجموعات.",
      lessons: [
        {
          slug: "conditional-prob-def",
          title: "الاحتمال الشرطي",
          content: `## الاحتمال الشرطي $P_A(B)$

### تعريف
إذا كان $P(A) \\neq 0$ فإن الاحتمال الشرطي لـ $B$ إذا تحقق $A$:
$$P_A(B) = \\frac{P(A \\cap B)}{P(A)}$$

### صيغة الاحتمالات المركبة
$$P(A \\cap B) = P(A) \\times P_A(B)$$

### الاستقلال
حدثان $A$ و $B$ مستقلان إذا:
$$P(A \\cap B) = P(A) \\times P(B)$$
أو ما يعادله: $P_A(B) = P(B)$

### صيغة الاحتمالات الكلية
إذا كانت $\\{A_1, A_2, \\ldots, A_n\\}$ قسمة للكون $\\Omega$ فإن:
$$P(B) = \\sum_{i=1}^{n} P(A_i) \\times P_{A_i}(B)$$

### مثال محلول
صندوق به 3 كرات حمراء و 5 بيضاء. نسحب كرتين بترتيب دون إرجاع.
ما هو احتمال أن تكون الكرتان بيضاء؟
- $P(B_1) = \\frac{5}{8}$ (الأولى بيضاء)
- $P_{B_1}(B_2) = \\frac{4}{7}$ (الثانية بيضاء بعد الأولى)
- $P(B_1 \\cap B_2) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$

### نقاط أساسية
- P_A(B) = P(A∩B) / P(A)
- الاستقلال: P(A∩B) = P(A) × P(B)
- الاحتمالات الكلية: قسمة الكون + جمع
- شجرة الاحتمالات تساعد على الترتيب`,
          durationMin: 50,
          keyPoints: [
            "P_A(B) = P(A∩B) / P(A)",
            "P(A∩B) = P(A) × P_A(B)",
            "استقلال ⟺ P(A∩B) = P(A) × P(B)",
            "الاحتمالات الكلية: قسمة الكون",
          ],
        },
      ],
      exercises: [
        {
          title: "احتمال شرطي",
          statement: "في صنف به 20 تلميذ: 12 تلميذ ناجح و8 راسب. من بين الناجحين 7 إناث. ما هو احتمال أن يكون تلميذ مختار عشوائياً إنثى ناجحة؟",
          hint: "P(إنثى ∩ ناجح) — استعمل P(F∩N) = P(N) × P_N(F)",
          solution: `$P(N) = \\frac{12}{20} = \\frac{3}{5}$
$P_N(F) = \\frac{7}{12}$ (إناث من الناجحين)
$P(N \\cap F) = P(N) \\times P_N(F) = \\frac{3}{5} \\times \\frac{7}{12} = \\frac{7}{20}$`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["احتمال", "شرطي"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 7: المتتاليات (الفصل 3)
// ============================================================
const unit2AS_Sequences: UnitSeed = {
  slug: "2as-sequences",
  title: "المتتاليات",
  description:
    "المتتاليات الحسابية والهندسية، الترتيب، النهايات، الاستدعاء. (التدرّج المقرر: الفصل الثالث، المحور 7)",
  order: 7,
  icon: "List",
  color: "#9333EA",
  stream: "ALL",
  trimester: 3,
  chapters: [
    {
      slug: "sequences-2as",
      title: "المتتاليات الحسابية والهندسية",
      description: "تعريف، حد عام، مجموع، ترتيب، نهايات",
      prerequisites: "المتتاليات الحسابية (1AS)، النهايات.",
      lessons: [
        {
          slug: "geometric-sequence",
          title: "المتتالية الهندسية",
          content: `## المتتالية الهندسية

### تعريف
المتتالية $(u_n)$ هندسية إذا كانت النسبة بين حدين متتاليين ثابتة:
$$\\frac{u_{n+1}}{u_n} = q \\quad (q \\neq 0)$$

### الحد العام
$$u_n = u_0 \\times q^n \\quad \\text{أو} \\quad u_n = u_p \\times q^{n-p}$$

### المجموع (هندسية)
مجموع الحدود الأولى من $u_0$ إلى $u_n$ ($q \\neq 1$):
$$S_n = u_0 \\frac{1 - q^{n+1}}{1 - q}$$

إذا $q = 1$: $S_n = (n + 1) u_0$

### نهاية $q^n$
- إذا $|q| < 1$: $\\lim q^n = 0$
- إذا $q = 1$: $\\lim q^n = 1$
- إذا $q > 1$: $\\lim q^n = +\\infty$
- إذا $q = -1$: $q^n$ تتأرجح ($(-1)^n$ لا نهاية لها)
- إذا $q < -1$: $|q^n| \\to +\\infty$ (لا نهاية)

### مثال محلول
$(u_n)$ هندسية أساسها $q = 2$ و $u_0 = 3$.
- الحد العام: $u_n = 3 \\times 2^n$
- $u_{10} = 3 \\times 1024 = 3072$
- مجموع $u_0 + \\cdots + u_5 = 3 \\times \\frac{1 - 2^6}{1 - 2} = 3 \\times \\frac{1 - 64}{-1} = 3 \\times 63 = 189$

### خصائص
1. ثلاثة حدود $a, b, c$ هندسية $\\Leftrightarrow b^2 = a \\times c$ (إذا $a, c \\neq 0$)
2. لوغاريتم متتالية هندسية موجبة = متتالية حسابية

### نقاط أساسية
- متتالية هندسية ⟹ uₙ₊₁/uₙ = q ثابت
- الحد العام: uₙ = u₀ × qⁿ
- المجموع: Sₙ = u₀ × (1-qⁿ⁺¹)/(1-q) (إذا q≠1)
- |q|<1 ⟹ lim qⁿ = 0`,
          durationMin: 45,
          keyPoints: [
            "uₙ₊₁/uₙ = q ثابت",
            "uₙ = u₀ × qⁿ",
            "Sₙ = u₀ × (1-qⁿ⁺¹)/(1-q)",
            "lim qⁿ = 0 إذا |q|<1",
          ],
        },
      ],
      exercises: [
        {
          title: "حل متتالية هندسية",
          statement: "متتالية هندسية أساسها $q = \\frac{1}{2}$ و $u_4 = 8$. أوجد $u_0$ ثم $u_n$.",
          hint: "u_n = u_0 × q^n → u_4 = u_0 × (1/2)⁴",
          solution: `$u_4 = u_0 \\times \\left(\\frac{1}{2}\\right)^4 = \\frac{u_0}{16}$
$\\frac{u_0}{16} = 8 \\Rightarrow u_0 = 128$
**الحد العام**: $u_n = 128 \\times \\left(\\frac{1}{2}\\right)^n = \\frac{128}{2^n}$`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 4,
          tags: ["متتالية هندسية", "حد عام"],
        },
        {
          title: "نهاية متتالية هندسية",
          statement: "احسب $\\lim_{n \\to +\\infty} \\frac{3^n + 1}{2^n + 5}$",
          hint: "نطرح 2^n (الأكبر) ونتذكر lim (3/2)^n",
          solution: `$\\frac{3^n + 1}{2^n + 5} = \\frac{2^n\\left((3/2)^n + 1/2^n\\right)}{2^n(1 + 5/2^n)}$
عند $n \\to +\\infty$: $(3/2)^n \\to +\\infty$، $1/2^n \\to 0$، $5/2^n \\to 0$
إذن $\\lim = +\\infty$`,
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 5,
          tags: ["متتالية", "نهاية"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 8: المعادلات التفاضلية (الفصل 3)
// ============================================================
const unit2AS_DifferentialEquations: UnitSeed = {
  slug: "2as-differential-equations",
  title: "المعادلات التفاضلية",
  description:
    "حل المعادلات التفاضلية من الشكل $y' = ay + b$، التطبيقات. (التدرّج المقرر: الفصل الثالث، المحور 8)",
  order: 8,
  icon: "Activity",
  color: "#D97706",
  stream: "ALL",
  trimester: 3,
  chapters: [
    {
      slug: "diff-eq-yay-b",
      title: "المعادلة $y' = ay + b$",
      description: "حل المعادلة، الحل الخاص، شرط ابتدائي",
      prerequisites: "الاشتقاق، الدالة الأسية.",
      lessons: [
        {
          slug: "diff-eq-solution",
          title: "حل $y' = ay + b$",
          content: `## المعادلة التفاضلية $y' = ay + b$

### المعادلة بدون حد ثاني $y' = ay$
الحل العام: $y(x) = C e^{ax}$ حيث $C$ ثابتة حقيقية.

### المعادلة الكاملة $y' = ay + b$ ($a \\neq 0$)
**الحل العام**:
$$y(x) = Ce^{ax} - \\frac{b}{a}$$

### طريقة الحل
1. نحل المعادلة المتجانسة $y' - ay = 0$: حل $y_H = Ce^{ax}$
2. نبحث عن حل ثابت $y_P = -\\frac{b}{a}$
3. الحل العام: $y = y_H + y_P = Ce^{ax} - \\frac{b}{a}$

### إيجاد $C$ بشرط ابتدائي
إذا كان $y(x_0) = y_0$ معطى، نعوّض لإيجاد $C$.

### مثال محلول
حل $y' - 2y = 4$ مع $y(0) = 1$
- **الحل المتجانس**: $y_H = Ce^{2x}$
- **حل ثابت**: $y_P = -\\frac{4}{2} = -2$
- **الحل العام**: $y = Ce^{2x} - 2$
- **استعمال الشرط**: $y(0) = C - 2 = 1 \\Rightarrow C = 3$
- **الحل الخاص**: $y(x) = 3e^{2x} - 2$

### تطبيقات
- النمو السكاني: $y' = ky$ → نمو أسي
- التبريد: $y' = -k(y - T_{amb})$
- شحن مكثفة: $y' = -\\frac{1}{RC}y + \\frac{E}{RC}$

### نقاط أساسية
- y' = ay → حل: y = Ce^(ax)
- y' = ay + b → حل: y = Ce^(ax) - b/a
- شرط ابتدائي يحدد C
- التطبيقات: نمو، تبريد، كهرباء`,
          durationMin: 45,
          keyPoints: [
            "y' = ay ⟹ y = Ce^(ax)",
            "y' = ay + b ⟹ y = Ce^(ax) - b/a",
            "شرط ابتدائي يحدد C",
            "تطبيقات: نمو، تبريد",
          ],
        },
      ],
      exercises: [
        {
          title: "حل معادلة تفاضلية بشرط ابتدائي",
          statement: "حل المعادلة التفاضلية $y' + 3y = 6$ مع الشرط $y(0) = 5$",
          hint: "الشكل القياسي: y' = -3y + 6, ثم y = Ce^(-3x) + 2",
          solution: `$y' = -3y + 6$ → $a = -3, b = 6$
**الحل العام**: $y = Ce^{-3x} - \\frac{6}{-3} = Ce^{-3x} + 2$
**استعمال الشرط**: $y(0) = C + 2 = 5 \\Rightarrow C = 3$
**الحل الخاص**: $y(x) = 3e^{-3x} + 2$`,
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 5,
          tags: ["معادلة تفاضلية", "شرط ابتدائي"],
        },
      ],
    },
  ],
};

// ============================================================
//  تصدير كل الوحدات للسنة الثانية ثانوي
// ============================================================
export const curriculum2AS: UnitSeed[] = [
  unit2AS_LimitsContinuity,
  unit2AS_Exponential,
  unit2AS_SpaceGeometry,
  unit2AS_SpaceDotProduct,
  unit2AS_Logarithm,
  unit2AS_Probability,
  unit2AS_Sequences,
  unit2AS_DifferentialEquations,
];
