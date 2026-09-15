// ============================================================
//  بيانات المنهاج الرسمي — السنة الأولى ثانوي (1AS)
//  الشعب العلمية: علوم تجريبية | رياضيات | تقني رياضي
//  إشراف بيداغوجي: الأستاذ عدلي أسعد
//  مرتّب حسب تدرّج وزارة التربية الوطنية 2022
// ============================================================
//  المحتوى: 9 وحدات كبرى مرتّبة حسب التدرّج الرسمي 2022:
//  الفصل 1: الأعداد الحقيقية + الدوال العددية + الهندسة
//  الفصل 2: الجداء السلمي + الدالة التآلفية + الإحصاء
//  الفصل 3: المتتاليات + الحساب المتجهي + المعادلات
// ============================================================

import type { UnitSeed } from "./curriculum";

// ============================================================
//  الوحدة 1: الأعداد الحقيقية والحساب الفاصلي (الفصل 1)
// ============================================================
const unit1AS_RealNumbers: UnitSeed = {
  slug: "1as-real-numbers",
  title: "الأعداد الحقيقية والحساب الفاصلي",
  description:
    "ترتيب الأعداد الحقيقية، الحساب الفاصلي، القيم المطلقة، المجالات. وحدة تأسيسية ضرورية لكل ما يليها في التحليل الرياضي. (التدرّج المقرر: الفصل الأول، المحور 1)",
  order: 1,
  icon: "Hash",
  color: "#1E40AF",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "real-numbers-intervals",
      title: "الأعداد الحقيقية والمجالات",
      description: "تعريف الأعداد الحقيقية، ترتيبها، المجالات وأنواعها",
      prerequisites: "المكتسبات الابتدائية والمتوسطة في الأعداد.",
      lessons: [
        {
          slug: "real-numbers-set",
          title: "مجموعة الأعداد الحقيقية ℝ",
          content: `## مجموعة الأعداد الحقيقية $\\mathbb{R}$

### تعريف
الأعداد الحقيقية هي كل الأعداد التي يمكن تمثيلها بنقاط على مستقيم منتهي يسمى **المستقيم العددي**. تضم:
- الأعداد الطبيعية $\\mathbb{N} = \\{0, 1, 2, 3, \\ldots\\}$
- الأعداد الصحيحة النسبية $\\mathbb{Z} = \\{\\ldots, -2, -1, 0, 1, 2, \\ldots\\}$
- الأعداد الجذرية $\\mathbb{Q} = \\left\\{\\frac{p}{q} \\mid p \\in \\mathbb{Z}, q \\in \\mathbb{N}^*\\right\\}$
- الأعداد غير الجذرية $\\mathbb{R} \\setminus \\mathbb{Q}$ (مثل $\\sqrt{2}$، $\\pi$، $e$)

### الترتيب في $\\mathbb{R}$
لكل عددين حقيقيين $a$ و $b$، يتحقق واحد فقط من العلاقات التالية:
$$a < b \\quad \\text{أو} \\quad a = b \\quad \\text{أو} \\quad a > b$$

### خصائص الترتيب
1. **النقل**: $a \\leq b$ و $b \\leq c \\Rightarrow a \\leq c$
2. **الجمع**: $a \\leq b \\Rightarrow a + c \\leq b + c$
3. **الضرب بموجب**: $a \\leq b$ و $c > 0 \\Rightarrow ac \\leq bc$
4. **الضرب بسالب**: $a \\leq b$ و $c < 0 \\Rightarrow ac \\geq bc$

### المجالات
| الترميز | المعنى |
|---------|--------|
| $[a, b]$ | $\\{x \\in \\mathbb{R} \\mid a \\leq x \\leq b\\}$ |
| $]a, b[$ | $\\{x \\in \\mathbb{R} \\mid a < x < b\\}$ |
| $[a, b[$ | $\\{x \\in \\mathbb{R} \\mid a \\leq x < b\\}$ |
| $]a, +\\infty[$ | $\\{x \\in \\mathbb{R} \\mid x > a\\}$ |
| $(-\\infty, +\\infty)$ | $\\mathbb{R}$ |

### نقاط أساسية
- $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$
- كل عدد حقيقي يقابله نقطة واحدة على المستقيم العددي
- الترتيب في $\\mathbb{R}$ كامل: كل مجموعة غير فارغة محدودة من الأعلى لها ثغر أعلى`,
          durationMin: 30,
          keyPoints: [
            "مجموعة ℝ تضم كل الأعداد",
            "الترتيب في ℝ كامل وشامل",
            "المجالات: مغلقة [ ]، مفتوحة ] [",
            "المتراجحات تُحل بإضافة/طرح دون تغيير، أو ضرب بتغيير إذا السالب",
          ],
        },
        {
          slug: "absolute-value",
          title: "القيمة المطلقة",
          content: `## القيمة المطلقة $|x|$

### تعريف
القيمة المطلقة للعدد الحقيقي $x$ هي:
$$|x| = \\begin{cases} x & \\text{إذا } x \\geq 0 \\\\ -x & \\text{إذا } x \\leq 0 \\end{cases}$$

### التفسير الهندسي
$|x|$ تمثل **المسافة** بين النقطة $x$ وأصل المعلم $0$ على المستقيم العددي.
$$|a - b| = d(a, b)$$

### خصائص أساسية
1. $|x| \\geq 0$ و $|x| = 0 \\Leftrightarrow x = 0$
2. $|x \\cdot y| = |x| \\cdot |y|$
3. $\\left|\\frac{x}{y}\\right| = \\frac{|x|}{|y|}$ ($y \\neq 0$)
4. **متراجحة المثلث**: $|x + y| \\leq |x| + |y|$

### معادلات ومتراجحات القيمة المطلقة
- $|x| = a \\Leftrightarrow x = a$ أو $x = -a$ (حيث $a \\geq 0$)
- $|x| \\leq a \\Leftrightarrow -a \\leq x \\leq a$
- $|x| \\geq a \\Leftrightarrow x \\leq -a$ أو $x \\geq a$

### مثال محلول
حل: $|2x - 3| \\leq 5$

$-5 \\leq 2x - 3 \\leq 5$
$-2 \\leq 2x \\leq 8$
$-1 \\leq x \\leq 4$

**المجموعة الحل**: $[-1, 4]$`,
          durationMin: 35,
          keyPoints: [
            "القيمة المطلقة = المسافة من الصفر",
            "|x| ≥ 0 دائماً، |x| = 0 ⟺ x = 0",
            "متراجحة المثلث: |x+y| ≤ |x|+|y|",
            "|x| ≤ a ⟺ -a ≤ x ≤ a",
          ],
        },
      ],
      exercises: [
        {
          title: "حل المتراجحة |x - 2| < 3",
          statement: "حل في ℝ المتراجحة التالية: $|x - 2| < 3$",
          hint: "استعمل الخاصية: $|x - a| < b \\Leftrightarrow a - b < x < a + b$",
          solution: `$|x - 2| < 3 \\Leftrightarrow -3 < x - 2 < 3$
$\\Leftrightarrow -1 < x < 5$
**المجموعة الحل**: $S = ]-1, 5[$`,
          methodology: "القيمة المطلقة |x-a| = المسافة بين x و a على المستقيم العددي.",
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
          tags: ["قيمة مطلقة", "متراجحة"],
        },
        {
          title: "حل المعادلة |2x + 1| = 5",
          statement: "حل في ℝ المعادلة: $|2x + 1| = 5$",
          hint: "|X| = a ⟺ X = a أو X = -a",
          solution: `$|2x + 1| = 5 \\Leftrightarrow 2x + 1 = 5$ أو $2x + 1 = -5$
- الحالة 1: $2x = 4 \\Rightarrow x = 2$
- الحالة 2: $2x = -6 \\Rightarrow x = -3$
**الحلول**: $x = 2$ أو $x = -3$`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["قيمة مطلقة", "معادلة"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 2: الدوال العددية (الفصل 1)
// ============================================================
const unit1AS_Functions: UnitSeed = {
  slug: "1as-functions",
  title: "الدوال العددية",
  description:
    "تعريف الدالة، تمثيلها البياني، بعض الدوال المرجعية (خطية، تآلفية، تربيعية، جذرية). وحدة تأسيسية لدراسة الدوال في السنوات القادمة. (التدرّج المقرر: الفصل الأول، المحور 2)",
  order: 2,
  icon: "TrendingUp",
  color: "#15803D",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "functions-generalities",
      title: "تعاريف عامة على الدوال",
      description: "تعريف الدالة، مجال التعريف، الصورة، التمثيل البياني",
      prerequisites: "الأعداد الحقيقية، المجالات.",
      lessons: [
        {
          slug: "function-definition",
          title: "تعريف الدالة العددية",
          content: `## الدالة العددية

### تعريف
الدالة العددية $f$ هي علاقة تربط كل عنصر $x$ من جزء $D_f$ من $\\mathbb{R}$ بعنصر وحيد $y$ من $\\mathbb{R}$.
$$f: D_f \\to \\mathbb{R}$$
$$x \\mapsto f(x)$$

### مصطلحات أساسية
- **مجال التعريف** $D_f$: مجموعة القيم التي يمكن أن يأخذها $x$
- **صورة $x$**: $f(x)$ القيمة الموافقة لـ $x$
- **صورة الدالة**: $f(D_f) = \\{f(x) \\mid x \\in D_f\\}$
- **منحى الدالة**: المنحني $\\mathcal{C}_f = \\{(x, f(x)) \\mid x \\in D_f\\}$ في معلم متعامد

### الدوال المرجعية
| الدالة | التعبير | مجال التعريف |
|--------|---------|--------------|
| خطية | $f(x) = ax$ | $\\mathbb{R}$ |
| تآلفية | $f(x) = ax + b$ | $\\mathbb{R}$ |
| تربيعية | $f(x) = ax^2$ | $\\mathbb{R}$ |
| جذرية | $f(x) = \\sqrt{x}$ | $[0, +\\infty[$ |
| عكسية | $f(x) = \\frac{1}{x}$ | $\\mathbb{R}^*$ |
| قيمة مطلقة | $f(x) = |x|$ | $\\mathbb{R}$ |

### تساوى دالتين
$f = g \\Leftrightarrow D_f = D_g$ و $\\forall x \\in D_f: f(x) = g(x)$

### مثال
$f(x) = \\frac{x^2 - 4}{x - 2}$ — مجال التعريف $D_f = \\mathbb{R} \\setminus \\{2\\}$
لكل $x \\neq 2$: $f(x) = \\frac{(x-2)(x+2)}{x-2} = x + 2$
إذن $f$ تساوي $g(x) = x + 2$ على $\\mathbb{R} \\setminus \\{2\\}$ (وليس على $\\mathbb{R}$ كله).`,
          durationMin: 35,
          keyPoints: [
            "الدالة تربط كل x بصورة وحيدة f(x)",
            "مجال التعريف D_f = القيم التي يقبلها x",
            "التمثيل البياني = النقاط (x, f(x))",
            "تساوى دالتين يتطلب نفس المجال + نفس القيم",
          ],
        },
        {
          slug: "quadratic-function",
          title: "الدالة التربيعية $ax^2$",
          content: `## الدالة التربيعية $f(x) = ax^2$

### تعريف
الدالة التربيعية المرجعية: $f(x) = ax^2$ حيث $a \\neq 0$.
- **مجال التعريف**: $D_f = \\mathbb{R}$
- **الزوجية**: $f(-x) = f(x)$ → زوجية (تماثل بالنسبة لمحور التراتيب)
- **الإشارية**: $a > 0 \\Rightarrow f(x) > 0$ لكل $x \\neq 0$
- **التغير**: تناقصية على $]-\\infty, 0]$ وتزايدية على $[0, +\\infty[$

### المنحنى البياني
المنحنى $\\mathcal{C}_f$ هو **قطع مكافئ** له:
- رأس في المبدأ $O$
- محور تماثل: محور التراتيب (y'y)
- اتجاه الفتحة: للأعلى إذا $a > 0$، للأسفل إذا $a < 0$

### الدالة $f(x) = a(x - \\alpha)^2 + \\beta$
عامة الدالة التربيعية:
$$f(x) = a(x - \\alpha)^2 + \\beta$$
- رأس القطع المكافئ: $\\Omega(\\alpha, \\beta)$
- محور التماثل: $x = \\alpha$
- **الشكل المطور**: $f(x) = ax^2 + bx + c$ حيث $\\alpha = -\\frac{b}{2a}$

### مثال محلول
$f(x) = 2x^2 - 8x + 5$
- $\\alpha = \\frac{8}{4} = 2$
- $\\beta = f(2) = 8 - 16 + 5 = -3$
- الشكل: $f(x) = 2(x - 2)^2 - 3$
- رأس: $\\Omega(2, -3)$

### نقاط أساسية
- $f(x) = ax^2$ زوجية، تمر عبر O
- رأس القطع المكافئ: $(-b/2a, f(-b/2a))$
- علامة $a$ تحدد اتجاه الفتحة`,
          durationMin: 40,
          keyPoints: [
            "الدالة f(x)=ax² زوجية — تماثل حول محور y",
            "إذا a>0: الفتحة للأعلى، إذا a<0: للأسفل",
            "الرأس عند α = -b/2a",
            "الشكل المطور: f(x) = a(x-α)² + β",
          ],
        },
      ],
      exercises: [
        {
          title: "مجال تعريف الدالة الجذرية",
          statement: "حدد مجال تعريف الدالة $f(x) = \\sqrt{2x - 6}$",
          hint: "يجب أن يكون ما تحت الجذر موجباً أو معدوماً",
          solution: `لوجود $\\sqrt{\\cdot}$ يجب أن يكون: $2x - 6 \\geq 0$
$\\Leftrightarrow 2x \\geq 6$
$\\Leftrightarrow x \\geq 3$
**مجال التعريف**: $D_f = [3, +\\infty[$`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
          tags: ["مجال التعريف", "دالة جذرية"],
        },
        {
          title: "تغيير شكل الدالة التربيعية",
          statement: "اكتب الدالة $f(x) = x^2 - 6x + 5$ على الشكل $a(x - \\alpha)^2 + \\beta$ ثم استنتج رأس القطع المكافئ.",
          hint: "α = -b/2a",
          solution: `$f(x) = x^2 - 6x + 5$
$\\alpha = -\\frac{-6}{2 \\cdot 1} = 3$
$\\beta = f(3) = 9 - 18 + 5 = -4$
**الشكل المطور**: $f(x) = (x - 3)^2 - 4$
**رأس القطع المكافئ**: $\\Omega(3, -4)$`,
          methodology: "نستعمل الشكل المطور لإيجاد الرأس بسهولة.",
          difficulty: "INTERMEDIATE",
          type: "METHOD_EXERCISE",
          points: 4,
          tags: ["دالة تربيعية", "رأس القطع"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 3: الهندسة في المستوى (الفصل 1)
// ============================================================
const unit1AS_PlaneGeometry: UnitSeed = {
  slug: "1as-plane-geometry",
  title: "الهندسة في المستوى",
  description:
    "الإحداثيات في المستوى، المسافة، المعادلات الدائرية، الزوايا. وحدة هندسية تطبيقية. (التدرّج المقرر: الفصل الأول، المحور 3)",
  order: 3,
  icon: "Circle",
  color: "#7C3AED",
  stream: "ALL",
  trimester: 1,
  chapters: [
    {
      slug: "coordinates-distance",
      title: "الإحداثيات والمسافة في المستوى",
      description: "معلم المستوى، إحداثيات نقطة، مسافة بين نقطتين",
      prerequisites: "نظرية فيثاغورس، الحساب الجبري.",
      lessons: [
        {
          slug: "distance-formula",
          title: "المسافة بين نقطتين",
          content: `## المسافة بين نقطتين

### معلم متعامد ممنظم
معلم المستوى $\\mathcal{R} = (O; \\vec{i}, \\vec{j})$ متعامد ممنظم إذا:
- $\\vec{i} \\perp \\vec{j}$
- $\\|\\vec{i}\\| = \\|\\vec{j}\\| = 1$

### إحداثيات نقطة
لكل نقطة $M$ في المستوى يوجد زوج وحيد $(x_M, y_M) \\in \\mathbb{R}^2$ بحيث:
$$\\overrightarrow{OM} = x_M \\vec{i} + y_M \\vec{j}$$

### المسافة بين نقطتين
إذا كان $A(x_A, y_A)$ و $B(x_B, y_B)$ فإن:
$$AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$

### إحداثيات منتصف قطعة
منتصف القطعة $[AB]$ هو:
$$I\\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}\\right)$$

### مثال محلول
$A(1, 2)$ و $B(4, 6)$
- $AB = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$
- منتصف $[AB]$: $I\\left(\\frac{5}{2}, 4\\right)$

### معادلة دائرة
دائرة المركز $\\Omega(x_\\Omega, y_\\Omega)$ والشعاع $R$ معادلتها:
$$(x - x_\\Omega)^2 + (y - y_\\Omega)^2 = R^2$$

### نقاط أساسية
- المسافة = جذر المجموع التربيعي للفرق الإحداثيات
- المنصف: متوسط الإحداثيات
- معادلة الدائرة تستعمل خاصية فيثاغورس`,
          durationMin: 30,
          keyPoints: [
            "AB = √((xᵦ-xₐ)² + (yᵦ-yₐ)²)",
            "منتصف [AB] = ((xₐ+xᵦ)/2, (yₐ+yᵦ)/2)",
            "دائرة: (x-xΩ)² + (y-yΩ)² = R²",
          ],
        },
      ],
      exercises: [
        {
          title: "حساب مسافة ومنتصف",
          statement: "احسب المسافة $AB$ وإحداثيات منتصف $[AB]$ حيث $A(-1, 3)$ و $B(5, -1)$.",
          hint: "AB = √((x_B-x_A)² + (y_B-y_A)²)",
          solution: `$AB = \\sqrt{(5-(-1))^2 + (-1-3)^2} = \\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$
المنتصف $I\\left(\\frac{-1+5}{2}, \\frac{3+(-1)}{2}\\right) = I(2, 1)$`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
          tags: ["مسافة", "منتصف"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 4: الجداء السلمي في المستوى (الفصل 2)
// ============================================================
const unit1AS_DotProduct: UnitSeed = {
  slug: "1as-dot-product",
  title: "الجداء السلمي في المستوى",
  description:
    "تعريف الجداء السلمي، خصائصه، تطبيقاته (تعامد، زوايا، مسافات). أساس الهندسة التحليلية. (التدرّج المقرر: الفصل الثاني، المحور 4)",
  order: 4,
  icon: "ArrowRight",
  color: "#B91C1C",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "dot-product-definition",
      title: "تعريف الجداء السلمي وخصائصه",
      description: "الجداء السلمي بمعناك الإسقاط، الخصائص الجبرية",
      prerequisites: "الإحداثيات، الحساب المتجهي الأساسي.",
      lessons: [
        {
          slug: "dot-product-formula",
          title: "الجداء السلمي",
          content: `## الجداء السلمي $\\vec{u} \\cdot \\vec{v}$

### تعريف هندسي
إذا كان $\\vec{u}$ و $\\vec{v}$ شعاعان غير منعدمين، و $\\theta = (\\vec{u}, \\vec{v})$ فإن:
$$\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\cdot \\|\\vec{v}\\| \\cdot \\cos\\theta$$

### تعريف إحداثي
إذا كان $\\vec{u}(x, y)$ و $\\vec{v}(x', y')$ في معلم متعامد ممنظم فإن:
$$\\vec{u} \\cdot \\vec{v} = xx' + yy'$$

### خصائص
1. **التبادل**: $\\vec{u} \\cdot \\vec{v} = \\vec{v} \\cdot \\vec{u}$
2. **التوزيع**: $\\vec{u} \\cdot (\\vec{v} + \\vec{w}) = \\vec{u} \\cdot \\vec{v} + \\vec{u} \\cdot \\vec{w}$
3. **التجانس**: $\\lambda \\vec{u} \\cdot \\vec{v} = \\lambda (\\vec{u} \\cdot \\vec{v})$
4. **المربع السلمي**: $\\vec{u} \\cdot \\vec{u} = \\|\\vec{u}\\|^2 = x^2 + y^2$
5. **عدم الاستقرار**: $\\vec{u} \\cdot \\vec{u} = 0 \\Leftrightarrow \\vec{u} = \\vec{0}$

### شرط التعامد
$$\\vec{u} \\perp \\vec{v} \\Leftrightarrow \\vec{u} \\cdot \\vec{v} = 0$$

### الزاوية بين شعاعين
$$\\cos\\theta = \\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\cdot \\|\\vec{v}\\|}$$

### مثال محلول
$\\vec{u}(3, 4)$ و $\\vec{v}(2, -1)$
- $\\vec{u} \\cdot \\vec{v} = 3 \\times 2 + 4 \\times (-1) = 6 - 4 = 2$
- $\\|\\vec{u}\\| = \\sqrt{9 + 16} = 5$
- $\\|\\vec{v}\\| = \\sqrt{4 + 1} = \\sqrt{5}$
- $\\cos\\theta = \\frac{2}{5\\sqrt{5}} = \\frac{2\\sqrt{5}}{25}$

### تطبيقات
- إثبات تعامد مستقيمين
- حساب زاوية
- حساب مسافة من نقطة إلى مستقيم
- إيجاد معادلة مستقيم عمودي`,
          durationMin: 40,
          keyPoints: [
            "u⃗·v⃗ = xx' + yy' (صيغة إحداثية)",
            "u⃗·v⃗ = ||u⃗||·||v⃗||·cosθ (صيغة هندسية)",
            "u⃗ ⊥ v⃗ ⟺ u⃗·v⃗ = 0",
            "||u⃗||² = u⃗·u⃗ = x² + y²",
          ],
        },
      ],
      exercises: [
        {
          title: "إثبات تعامد شعاعين",
          statement: "بيّن أن الشعاعين $\\vec{u}(2, 3)$ و $\\vec{v}(-3, 2)$ متعامدان.",
          hint: "u⃗ ⊥ v⃗ ⟺ u⃗·v⃗ = 0",
          solution: `$\\vec{u} \\cdot \\vec{v} = 2 \\times (-3) + 3 \\times 2 = -6 + 6 = 0$
بما أن $\\vec{u} \\cdot \\vec{v} = 0$ فإن $\\vec{u} \\perp \\vec{v}$. ✓`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
          tags: ["جداء سلمي", "تعامد"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 5: الدالة التآلفية والإحصاء (الفصل 2)
// ============================================================
const unit1AS_AffineFunction: UnitSeed = {
  slug: "1as-affine-function",
  title: "الدالة التآلفية والإحصاء",
  description:
    "الدالة الخطية والتآلفية، معادلة مستقيم، الإحصاء الوصفي. وحدة تطبيقية. (التدرّج المقرر: الفصل الثاني، المحور 5)",
  order: 5,
  icon: "BarChart3",
  color: "#0891B2",
  stream: "ALL",
  trimester: 2,
  chapters: [
    {
      slug: "affine-functions",
      title: "الدالة التآلفية ومعادلة المستقيم",
      description: "الدالة الخطية f(x)=ax، التآلفية f(x)=ax+b، معادلة مستقيم",
      prerequisites: "الدوال العددية، الإحداثيات.",
      lessons: [
        {
          slug: "affine-function-def",
          title: "الدالة التآلفية $f(x) = ax + b$",
          content: `## الدالة التآلفية

### تعريف
الدالة **الخطية**: $f(x) = ax$ (تمر من المبدأ)
الدالة **التآلفية**: $f(x) = ax + b$
- **$a$**: المعامل الموجه (الميل)
- **$b$**: الترتيب عند المبدأ

### الخصائص
- مجال التعريف: $D_f = \\mathbb{R}$
- التغير: تزايدية إذا $a > 0$، تناقصية إذا $a < 0$، ثابتة إذا $a = 0$
- منحى الدالة: مستقيم يمر بـ $(0, b)$

### معادلة مستقيم
المستقيم غير عمودي على محور التراتيب له معادلة:
$$y = ax + b$$

### الميل بين نقطتين
إذا كان المستقيم يمر بـ $A(x_A, y_A)$ و $B(x_B, y_B)$ فإن:
$$a = \\frac{y_B - y_A}{x_B - x_A}$$

### مستقيمان متوازيان
$$\\mathcal{D}_1: y = a_1 x + b_1 \\quad \\parallel \\quad \\mathcal{D}_2: y = a_2 x + b_2 \\Leftrightarrow a_1 = a_2$$

### مستقيمان متعامدان
$$\\mathcal{D}_1 \\perp \\mathcal{D}_2 \\Leftrightarrow a_1 \\cdot a_2 = -1$$

### مثال محلول
المستقيم المار من $A(1, 2)$ و $B(3, 8)$:
- $a = \\frac{8 - 2}{3 - 1} = 3$
- $b = y_A - a x_A = 2 - 3 = -1$
- **المعادلة**: $y = 3x - 1$`,
          durationMin: 35,
          keyPoints: [
            "الدالة التآلفية: f(x) = ax + b",
            "الميل بين نقطتين: a = (y₂-y₁)/(x₂-x₁)",
            "متوازيان ⟺ نفس الميل",
            "متعامدان ⟺ حاصل ضرب الميلين = -1",
          ],
        },
      ],
      exercises: [
        {
          title: "إيجاد معادلة مستقيم",
          statement: "أوجد معادلة المستقيم المار بالنقطتين $A(2, -1)$ و $B(4, 5)$.",
          hint: "a = (y_B - y_A)/(x_B - x_A), ثم b = y_A - a·x_A",
          solution: `$a = \\frac{5 - (-1)}{4 - 2} = \\frac{6}{2} = 3$
$b = y_A - ax_A = -1 - 3 \\times 2 = -7$
**المعادلة**: $y = 3x - 7$`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["دالة تآلفية", "معادلة مستقيم"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 6: المتتاليات الحسابية (الفصل 3)
// ============================================================
const unit1AS_ArithmeticSequences: UnitSeed = {
  slug: "1as-arithmetic-sequences",
  title: "المتتاليات الحسابية",
  description:
    "مقدمة في المتتاليات، المتتاليات الحسابية، الحد العام، المجموع. (التدرّج المقرر: الفصل الثالث، المحور 7)",
  order: 6,
  icon: "List",
  color: "#BE185D",
  stream: "ALL",
  trimester: 3,
  chapters: [
    {
      slug: "arithmetic-seq-intro",
      title: "المتتاليات الحسابية",
      description: "تعريف، حد عام، مجموع الحدود الأولى",
      prerequisites: "الحساب الجبري، الدوال.",
      lessons: [
        {
          slug: "arithmetic-sequence-def",
          title: "المتتالية الحسابية",
          content: `## المتتالية الحسابية

### تعريف
المتتالية $(u_n)$ حسابية إذا كان الفرق بين حدين متتاليين ثابت:
$$u_{n+1} - u_n = r \\quad \\text{(أساسها)}$$

### الحد العام
$$u_n = u_0 + nr \\quad \\text{أو} \\quad u_n = u_p + (n - p)r$$

### المجموع
مجموع الحدود الأولى من $u_0$ إلى $u_n$:
$$S_n = u_0 + u_1 + \\cdots + u_n = \\frac{(n + 1)(u_0 + u_n)}{2}$$

بشكل عام: $S = \\frac{(\\text{عدد الحدود})(\\text{الحد الأول} + \\text{الحد الأخير})}{2}$

### مثال محلول
$(u_n)$ متتالية حسابية أساسها $r = 3$ و $u_0 = 5$.
- الحد العام: $u_n = 5 + 3n$
- $u_{10} = 5 + 30 = 35$
- مجموع $u_0 + u_1 + \\cdots + u_{10}$:
  - عدد الحدود = 11
  - $S = \\frac{11 \\times (5 + 35)}{2} = \\frac{11 \\times 40}{2} = 220$

### خصائص
1. ثلاث حدود متتالية $a, b, c$ حسابية $\\Leftrightarrow 2b = a + c$
2. تمثيل النقاط $(n, u_n)$ على مستقيم
3. $u_{n+1} - u_n = r$ ثابت يكفي لإثبات الحسابية

### نقاط أساسية
- أساس المتتالية = الفرق بين حدين متتاليين
- الحد العام: $u_n = u_0 + nr$
- المجموع: متوسط (الحد الأول + الأخير) × عدد الحدود`,
          durationMin: 35,
          keyPoints: [
            "متتالية حسابية ⟺ uₙ₊₁ - uₙ = r ثابت",
            "الحد العام: uₙ = u₀ + nr",
            "المجموع: S = (n+1)(u₀+uₙ)/2",
            "ثلاثة حدود حسابية ⟺ 2b = a+c",
          ],
        },
      ],
      exercises: [
        {
          title: "إيجاد الحد العام",
          statement: "متتالية حسابية أساسها $r = -2$ و $u_5 = 3$. أوجد $u_0$ ثم الحد العام.",
          hint: "u_n = u_0 + nr → u_5 = u_0 + 5r",
          solution: `$u_5 = u_0 + 5r \\Rightarrow 3 = u_0 + 5 \\times (-2) = u_0 - 10$
$\\Rightarrow u_0 = 13$
**الحد العام**: $u_n = 13 - 2n$`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 3,
          tags: ["متتالية حسابية", "حد عام"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 7: الحساب المتجهي (الفصل 3)
// ============================================================
const unit1AS_VectorCalculus: UnitSeed = {
  slug: "1as-vector-calculus",
  title: "الحساب المتجهي في المستوى",
  description:
    "الشعاع، العمليات على الشعاع، الإحداثيات، التطبيقات. (التدرّج المقرر: الفصل الثالث، المحور 8)",
  order: 7,
  icon: "Move",
  color: "#9333EA",
  stream: "ALL",
  trimester: 3,
  chapters: [
    {
      slug: "vectors-basics",
      title: "الشعاع والعمليات",
      description: "تعريف الشعاع، الجمع، الضرب ب scalar",
      prerequisites: "الهندسة الأساسية.",
      lessons: [
        {
          slug: "vector-definition",
          title: "الشعاع في المستوى",
          content: `## الشعاع $\\vec{u}$

### تعريف
الشعاع $\\overrightarrow{AB}$ هو نصف مستقيم موجه من $A$ إلى $B$، يتميز بـ:
- منحى (من A إلى B)
- طول
- اتجاه (موازي للمستقيم AB)

### تساوي شعاعين
$$\\overrightarrow{AB} = \\overrightarrow{CD} \\Leftrightarrow ABDC \\text{ متوازي أضلاع}$$

### العمليات
1. **الجمع**: $\\vec{u} + \\vec{v}$ (قاعدة المتوازي أو الرأس)
2. **الضرب ب scalar**: $\\lambda \\vec{u}$
3. **العكس**: $-\\vec{u}$
4. **الفرق**: $\\vec{u} - \\vec{v} = \\vec{u} + (-\\vec{v})$

### علاقة Chasles
$$\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}$$

### إحداثيات شعاع
إذا كان $\\vec{u} = \\overrightarrow{AB}$ حيث $A(x_A, y_A)$ و $B(x_B, y_B)$:
$$\\vec{u}(x_B - x_A, y_B - y_A)$$

### مثال محلول
$A(1, 2)$، $B(4, 6)$، $C(-2, 3)$
- $\\overrightarrow{AB}(3, 4)$
- $\\overrightarrow{AC}(-3, 1)$
- $\\overrightarrow{AB} + \\overrightarrow{AC} = \\vec{u}(0, 5)$

### نقاط أساسية
- الشعاع = منحى + اتجاه + طول
- Chasles: AB + BC = AC
- إحداثيات: u⃗ = (x_B-x_A, y_B-y_A)`,
          durationMin: 35,
          keyPoints: [
            "الشعاع له منحى واتجاه وطول",
            "Chasles: AB→ + BC→ = AC→",
            "إحداثيات: (x_B-x_A, y_B-y_A)",
            "تساوي الشعاع = متوازي أضلاع",
          ],
        },
      ],
      exercises: [
        {
          title: "تطبيق علاقة Chasles",
          statement: "بسّط الكتابة: $\\overrightarrow{AB} + \\overrightarrow{BC} + \\overrightarrow{CD}$",
          hint: " застبي Chasles مرتين",
          solution: `$\\overrightarrow{AB} + \\overrightarrow{BC} = \\overrightarrow{AC}$ (Chasles)
$\\overrightarrow{AC} + \\overrightarrow{CD} = \\overrightarrow{AD}$ (Chasles)
إذن: $\\overrightarrow{AB} + \\overrightarrow{BC} + \\overrightarrow{CD} = \\overrightarrow{AD}$`,
          difficulty: "BEGINNER",
          type: "DIRECT_APPLICATION",
          points: 2,
          tags: ["شعاع", "Chasles"],
        },
      ],
    },
  ],
};

// ============================================================
//  الوحدة 8: المعادلات والمتراجحات (الفصل 3)
// ============================================================
const unit1AS_EquationsInequalities: UnitSeed = {
  slug: "1as-equations-inequalities",
  title: "حل المعادلات والمتراجحات",
  description:
    "المعادلات من الدرجة الثانية، المتراجحات، الأنظمة. (التدرّج المقرر: الفصل الثالث، المحور 9)",
  order: 8,
  icon: "Equal",
  color: "#D97706",
  stream: "ALL",
  trimester: 3,
  chapters: [
    {
      slug: "quadratic-equations",
      title: "المعادلات والمتراجحات من الدرجة الثانية",
      description: "حل المعادلة ax²+bx+c=0، المميز، الإشارة",
      prerequisites: "الجبر، الدالة التربيعية.",
      lessons: [
        {
          slug: "quadratic-formula",
          title: "حل المعادلة $ax^2 + bx + c = 0$",
          content: `## المعادلة من الدرجة الثانية $ax^2 + bx + c = 0$

### المميز $\\Delta$
$$\\Delta = b^2 - 4ac$$

### حالات المميز
1. **$\\Delta > 0$**: حلان مختلفان
   $$x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a}, \\quad x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}$$

2. **$\\Delta = 0$**: حل مزدوج
   $$x = \\frac{-b}{2a}$$

3. **$\\Delta < 0$**: لا يوجد حل حقيقي

### إشارة كثيرة الحدود $P(x) = ax^2 + bx + c$
- إذا $\\Delta > 0$: إشارة $a$ خارج الجذرين، إشارة $-a$ بينهما
- إذا $\\Delta = 0$: إشارة $a$ دائماً (تتلاشى عند الجذر المزدوج)
- إذا $\\Delta < 0$: إشارة $a$ دائماً

### مجموع وجداء الجذور
إذا كان للحلول $x_1, x_2$:
- **المجموع**: $x_1 + x_2 = -\\frac{b}{a}$
- **الجداء**: $x_1 \\cdot x_2 = \\frac{c}{a}$

### مثال محلول
حل $x^2 - 5x + 6 = 0$
- $\\Delta = 25 - 24 = 1 > 0$
- $x_1 = \\frac{5 - 1}{2} = 2$, $x_2 = \\frac{5 + 1}{2} = 3$
- **الحلول**: $x = 2$ أو $x = 3$

### حل المتراجحة $ax^2 + bx + c \\leq 0$ ($\\Delta > 0$)
**المجموعة الحل**: $[x_1, x_2]$ (حيث $x_1 < x_2$) إذا $a > 0$.

### نقاط أساسية
- Δ = b² - 4ac
- Δ > 0: حلان، Δ = 0: حل مزدوج، Δ < 0: لا حل
- إشارة a خارج الجذرين، -a بينهما
- المجموع = -b/a، الجداء = c/a`,
          durationMin: 45,
          keyPoints: [
            "Δ = b² - 4ac",
            "Δ>0: حلان، Δ=0: حل مزدوج، Δ<0: لا حل",
            "إشارة a خارج الجذرين، -a بينهما",
            "المجموع = -b/a، الجداء = c/a",
          ],
        },
      ],
      exercises: [
        {
          title: "حل معادلة من الدرجة الثانية",
          statement: "حل في $\\mathbb{R}$ المعادلة: $2x^2 - 7x + 3 = 0$",
          hint: "احسب Δ = b²-4ac أولاً",
          solution: `$\\Delta = 49 - 24 = 25 > 0$
$x_1 = \\frac{7 - 5}{4} = \\frac{1}{2}, \\quad x_2 = \\frac{7 + 5}{4} = 3$
**الحلول**: $x = \\frac{1}{2}$ أو $x = 3$`,
          difficulty: "INTERMEDIATE",
          type: "DIRECT_APPLICATION",
          points: 4,
          tags: ["معادلة", "درجة ثانية", "مميز"],
        },
        {
          title: "حل متراجحة من الدرجة الثانية",
          statement: "حل في $\\mathbb{R}$ المتراجحة: $-x^2 + 4x - 3 \\geq 0$",
          hint: "احسب Δ، ارسم جدول الإشارة",
          solution: `$\\Delta = 16 - 12 = 4 > 0$
الجذور: $x_1 = 1, x_2 = 3$
بما أن $a = -1 < 0$ فإن $-P(x) \\geq 0$ بين الجذرين.
**المجموعة الحل**: $[1, 3]$`,
          methodology: "نحل المعادلة أولاً، ثم نستعمل جدول الإشارة مع علامة a.",
          difficulty: "ADVANCED",
          type: "METHOD_EXERCISE",
          points: 5,
          tags: ["متراجحة", "درجة ثانية", "إشارة"],
        },
      ],
    },
  ],
};

// ============================================================
//  تصدير كل الوحدات للسنة الأولى ثانوي
// ============================================================
export const curriculum1AS: UnitSeed[] = [
  unit1AS_RealNumbers,
  unit1AS_Functions,
  unit1AS_PlaneGeometry,
  unit1AS_DotProduct,
  unit1AS_AffineFunction,
  unit1AS_ArithmeticSequences,
  unit1AS_VectorCalculus,
  unit1AS_EquationsInequalities,
];
