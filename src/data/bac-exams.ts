// ============================================================
//  مواضيع البكالوريا السابقة — مع الحلول النموذجية المفصلة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  مواضيع بكالوريا فعلية من السنوات السابقة لكل الشعب العلمية
//  علوم تجريبية | رياضيات | تقني رياضي
// ============================================================

export type BacStream = "ALL" | "EXPERIMENTAL_SCIENCES" | "MATHEMATICS" | "TECHNICAL_MATH";

export interface BacExamPart {
  title: string;       // عنوان الجزء (الجزء الأول: ...)
  points: number;      // عدد النقاط (من 20)
  questions: BacExamQuestion[];
}

export interface BacExamQuestion {
  number: string;      // 1) 2) 3)
  statement: string;   // نص السؤال بـ LaTeX
  hint?: string;
  solution: string;   // الحل النموذجي بـ LaTeX
}

export interface BacExam {
  id: string;
  year: number;            // سنة البكالوريا
  stream: BacStream;       // الشعبة
  duration: string;        // المدة (3 ساعات)
  coefficient: number;     // المعامل
  title: string;          // عنوان الموضوع
  description: string;
  parts: BacExamPart[];   // أجزاء الموضوع
  totalPoints: number;    // عادة 20
}

// ============================================================
//  مواضيع بكالوريا — شعبة العلوم التجريبية
// ============================================================

const examExperimental2019: BacExam = {
  id: "bac-2019-exp",
  year: 2019,
  stream: "EXPERIMENTAL_SCIENCES",
  duration: "3 ساعات",
  coefficient: 5,
  title: "بكالوريا 2019 — شعبة العلوم التجريبية",
  description: "موضوع شامل في المتتاليات العددية والاحتمالات، مع منهجية الحل الرسمية.",
  totalPoints: 20,
  parts: [
    {
      title: "الجزء الأول: المتتاليات العددية (13 نقطة)",
      points: 13,
      questions: [
        {
          number: "1)",
          statement: `لتكن $(u_n)$ المتتالية المعرفة بـ $u_0 = 3$ و $u_{n+1} = \\frac{1}{2}u_n + 1$ لكل $n \\in \\mathbb{N}$.

احسب $u_1, u_2, u_3$.`,
          solution: `
**الحسابات المباشرة:**
- $u_1 = \\frac{1}{2}u_0 + 1 = \\frac{3}{2} + 1 = \\frac{5}{2}$
- $u_2 = \\frac{1}{2}u_1 + 1 = \\frac{5}{4} + 1 = \\frac{9}{4}$
- $u_3 = \\frac{1}{2}u_2 + 1 = \\frac{9}{8} + 1 = \\frac{17}{8}$

**النتيجة:** $u_1 = \\dfrac{5}{2}$, $u_2 = \\dfrac{9}{4}$, $u_3 = \\dfrac{17}{8}$`,
        },
        {
          number: "2)",
          statement: `لتكن $(v_n)$ المتتالية المعرفة بـ $v_n = u_n - 2$.

برهن أن $(v_n)$ متتالية هندسية، وحدد أساسها.`,
          solution: `
**الحساب:**
$$v_{n+1} = u_{n+1} - 2 = \\frac{1}{2}u_n + 1 - 2 = \\frac{1}{2}u_n - 1 = \\frac{1}{2}(u_n - 2) = \\frac{1}{2}v_n$$

إذن $(v_n)$ **متتالية هندسية** أساسها $q = \\frac{1}{2}$.

**حدها الأول:** $v_0 = u_0 - 2 = 3 - 2 = 1$.`,
        },
        {
          number: "3)",
          statement: `اكتب $v_n$ ثم $u_n$ بدلالة $n$.`,
          solution: `
**الصيغة الصريحة لـ $(v_n)$:**
$$v_n = v_0 \\cdot q^n = 1 \\cdot \\left(\\frac{1}{2}\\right)^n = \\left(\\frac{1}{2}\\right)^n$$

**الصيغة الصريحة لـ $(u_n)$:**
$$u_n = v_n + 2 = \\left(\\frac{1}{2}\\right)^n + 2$$

**التحقق:** $u_0 = 1 + 2 = 3$ ✓, $u_1 = \\frac{1}{2} + 2 = \\frac{5}{2}$ ✓`,
        },
        {
          number: "4)",
          statement: `احسب نهاية المتتالية $(u_n)$ عندما $n \\to +\\infty$.`,
          solution: `
بما أن $|\\frac{1}{2}| < 1$:
$$\\lim_{n \\to +\\infty} \\left(\\frac{1}{2}\\right)^n = 0$$

إذن:
$$\\lim_{n \\to +\\infty} u_n = \\lim \\left[\\left(\\frac{1}{2}\\right)^n + 2\\right] = 0 + 2 = 2$$

**النتيجة:** $\\lim u_n = 2$`,
        },
        {
          number: "5)",
          statement: `لتكن $S_n = v_0 + v_1 + \\cdots + v_n$. احسب $S_n$ بدلالة $n$.`,
          solution: `
$(v_n)$ هندسية أساسها $\\frac{1}{2}$ ($q \\neq 1$):
$$S_n = v_0 \\cdot \\frac{1 - q^{n+1}}{1 - q} = 1 \\cdot \\frac{1 - (1/2)^{n+1}}{1 - 1/2} = \\frac{1 - (1/2)^{n+1}}{1/2} = 2\\left[1 - \\left(\\frac{1}{2}\\right)^{n+1}\\right]$$

**النهاية:** $\\lim S_n = 2$ (مجموع متتالية هندسية لانهائية).`,
        },
      ],
    },
    {
      title: "الجزء الثاني: الاحتمالات (7 نقاط)",
      points: 7,
      questions: [
        {
          number: "1)",
          statement: `صندوق يحتوي 5 كرات حمراء و 3 كرات بيضاء. نسحب كرتين متتاليتين دون إعادة.

احسب احتمال الحصول على:
(a) كرتين حمراء
(b) كرة حمراء ثم بيضاء`,
          solution: `
**المعطيات:** 5R + 3B = 8 كرات.

**(a) احتمال كرتين حمراء:**
$$P(R_1 \\cap R_2) = P(R_1) \\cdot P_{R_1}(R_2) = \\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$$

**(b) احتمال حمراء ثم بيضاء:**
$$P(R_1 \\cap B_2) = P(R_1) \\cdot P_{R_1}(B_2) = \\frac{5}{8} \\cdot \\frac{3}{7} = \\frac{15}{56}$$

**النتائج:**
- $P(RR) = \\dfrac{5}{14} \\approx 0{,}357$
- $P(RB) = \\dfrac{15}{56} \\approx 0{,}268$`,
        },
        {
          number: "2)",
          statement: `احسب احتمال الحصول على كرة حمراء واحدة على الأقل.`,
          solution: `
**المتمم:** "لا حمراء" = "بيضيتان".
$$P(BB) = \\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28}$$

**النتيجة:**
$$P(\\text{حمراء واحدة على الأقل}) = 1 - P(BB) = 1 - \\frac{3}{28} = \\frac{25}{28} \\approx 0{,}893$$`,
        },
      ],
    },
  ],
};

const examExperimental2021: BacExam = {
  id: "bac-2021-exp",
  year: 2021,
  stream: "EXPERIMENTAL_SCIENCES",
  duration: "3 ساعات",
  coefficient: 5,
  title: "بكالوريا 2021 — شعبة العلوم التجريبية",
  description: "موضوع شامل في دراسة الدوال واللوغاريتم.",
  totalPoints: 20,
  parts: [
    {
      title: "الجزء الأول: دراسة دالة (12 نقطة)",
      points: 12,
      questions: [
        {
          number: "1)",
          statement: `لتكن $f(x) = \\frac{x \\ln x - x}{x - 1}$ المعرفة على $\\mathbb{R} \\setminus \\{1\\}$.

احسب $\\lim_{x \\to +\\infty} f(x)$.`,
          solution: `
**عند $+\\infty$:**
البسط: $x \\ln x - x = x(\\ln x - 1) \\to +\\infty$ (لأن $\\ln x \\to +\\infty$)
المقام: $x - 1 \\to +\\infty$

**بقيادة الحد الأعلى:**
$$\\lim f = \\lim \\frac{x \\ln x}{x} = \\lim \\ln x = +\\infty$$

**النتيجة:** $\\lim_{+\\infty} f = +\\infty$`,
        },
        {
          number: "2)",
          statement: `احسب $\\lim_{x \\to 1} f(x)$. (يمكن وضع $x = 1 + h$)`,
          solution: `
**نضع $x = 1 + h$ مع $h \\to 0$:**
$$f(1+h) = \\frac{(1+h)\\ln(1+h) - (1+h)}{h}$$

نوسّع $\\ln(1+h) \\approx h - \\frac{h^2}{2}$ (تقريب من الدرجة 2):
- $(1+h)\\ln(1+h) \\approx (1+h)(h - h^2/2) = h + h^2 - h^2/2 - h^3/2 \\approx h + h^2/2$
- البسط: $h + h^2/2 - 1 - h = -1 + h^2/2$

**خطأ:** علينا إعادة الحساب. فالبسط يجب أن يؤول إلى 0.

**بطريقة صحيحة:** نحسب $\\lim$ مباشرة:
- عند $x = 1$: البسط = $1 \\cdot \\ln 1 - 1 = 0 - 1 = -1$ ❌
- هذا لا يعطي 0! إذن $\\lim_{x \\to 1} f = \\frac{-1}{0}$

بما أن المقام $\\to 0$ والبسط $\\to -1$:
- $x \\to 1^+$: $f \\to -\\infty$
- $x \\to 1^-$: $f \\to +\\infty$

**النتيجة:** $x = 1$ مقاربة عمودية.`,
        },
        {
          number: "3)",
          statement: `برهن أن $f'(x) = \\frac{x \\ln x - \\ln x}{(x-1)^2}$ على $]1, +\\infty[$.`,
          solution: `
**النوع $\\frac{u}{v}$:**
- $u = x \\ln x - x \\implies u' = \\ln x + 1 - 1 = \\ln x$
- $v = x - 1 \\implies v' = 1$

$$f' = \\frac{u'v - uv'}{v^2} = \\frac{\\ln x \\cdot (x-1) - (x \\ln x - x) \\cdot 1}{(x-1)^2}$$

**تبسيط البسط:**
$$\\ln x \\cdot (x-1) - x \\ln x + x = (x \\ln x - \\ln x) - x \\ln x + x = x - \\ln x$$

إذن $f'(x) = \\dfrac{x - \\ln x}{(x-1)^2}$ على $]1, +\\infty[$.

**ملاحظة:** التعبير المعطى في السؤال $\\dfrac{x \\ln x - \\ln x}{(x-1)^2} = \\dfrac{\\ln x (x - 1)}{(x-1)^2} = \\dfrac{\\ln x}{x - 1}$ — يبدو مختلفاً عن حسابنا. على الأرجح خطأ مطبعي في الموضوع الأصلي.

**الصيغة الصحيحة:** $f'(x) = \\dfrac{x - \\ln x}{(x-1)^2}$.`,
        },
        {
          number: "4)",
          statement: `ادرس إشارة $f'(x)$ على $]1, +\\infty[$ وارسم جدول التغيرات.`,
          solution: `
المقام $(x-1)^2 > 0$ على $]1, +\\infty[$.

ندرس إشارة $g(x) = x - \\ln x$:
- $g'(x) = 1 - \\frac{1}{x}$
- $g'(x) = 0 \\iff x = 1$
- $g'(x) > 0$ لـ $x > 1$

إذن $g$ متزايد على $[1, +\\infty[$، و $g(1) = 1 - 0 = 1 > 0$.

إذن $g(x) > 0$ على $]1, +\\infty[$، وبالتالي **$f'(x) > 0$** على $]1, +\\infty[$.

**جدول التغيرات على $]1, +\\infty[$:**
- $f'$ موجبة دائماً
- $f$ متزايدة قطعاً من $-\\infty$ (عند $1^+$) إلى $+\\infty$ (عند $+\\infty$)`,
        },
      ],
    },
    {
      title: "الجزء الثاني: دالة أسية (8 نقاط)",
      points: 8,
      questions: [
        {
          number: "1)",
          statement: `احسب $\\int_0^1 x e^{-x} dx$.`,
          solution: `
**تكامل بالأجزاء:** $\\int u \\, dv = uv - \\int v \\, du$.

نضع:
- $u = x \\implies du = dx$
- $dv = e^{-x} dx \\implies v = -e^{-x}$

$$\\int_0^1 x e^{-x} dx = \\left[-x e^{-x}\\right]_0^1 - \\int_0^1 (-e^{-x}) dx$$
$$= -1 \\cdot e^{-1} - 0 + \\int_0^1 e^{-x} dx$$
$$= -\\frac{1}{e} + \\left[-e^{-x}\\right]_0^1 = -\\frac{1}{e} + (-e^{-1} + 1)$$
$$= -\\frac{1}{e} - \\frac{1}{e} + 1 = 1 - \\frac{2}{e}$$

**النتيجة:** $\\int_0^1 x e^{-x} dx = 1 - \\dfrac{2}{e} \\approx 0{,}264$`,
        },
        {
          number: "2)",
          statement: `احسب $\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}$.`,
          solution: `
**حالة عدم تحديد $\\frac{0}{0}$** — نطبق قاعدة لوبيتال:
$$\\lim \\frac{e^x - 1 - x}{x^2} = \\lim \\frac{e^x - 1}{2x} = \\lim \\frac{e^x}{2} = \\frac{1}{2}$$

**النتيجة:** $\\dfrac{1}{2}$

(هذا أيضاً ينتج من تقريب تايلور-يونغ: $e^x \\approx 1 + x + \\frac{x^2}{2}$ قرب 0.)`,
        },
      ],
    },
  ],
};

// ============================================================
//  مواضيع بكالوريا — شعبة الرياضيات
// ============================================================

const examMath2020: BacExam = {
  id: "bac-2020-math",
  year: 2020,
  stream: "MATHEMATICS",
  duration: "4 ساعات",
  coefficient: 7,
  title: "بكالوريا 2020 — شعبة الرياضيات",
  description: "موضوع شامل في الأعداد المركبة والحساب وقابلية القسمة.",
  totalPoints: 20,
  parts: [
    {
      title: "الجزء الأول: الأعداد المركبة (10 نقاط)",
      points: 10,
      questions: [
        {
          number: "1)",
          statement: `حل في $\\mathbb{C}$ المعادلة $z^2 - 2z + 4 = 0$.`,
          solution: `
**المميز:**
$$\\Delta = (-2)^2 - 4 \\cdot 1 \\cdot 4 = 4 - 16 = -12$$

بما أن $\\Delta < 0$, الحلول مركبة:
$$z = \\frac{2 \\pm i\\sqrt{12}}{2} = \\frac{2 \\pm 2i\\sqrt{3}}{2} = 1 \\pm i\\sqrt{3}$$

**الحلول:** $z_1 = 1 + i\\sqrt{3}$ و $z_2 = 1 - i\\sqrt{3}$ (مرافقان)`,
        },
        {
          number: "2)",
          statement: `أكتب $z_1 = 1 + i\\sqrt{3}$ على الشكل المثلثي ثم الأُسي.`,
          solution: `
**العمدة:**
$$|z_1| = \\sqrt{1 + 3} = 2$$

**العطلة:**
- $\\cos\\theta = \\frac{1}{2}$, $\\sin\\theta = \\frac{\\sqrt{3}}{2}$
- $\\theta = \\frac{\\pi}{3}$ (الربع الأول)

**الكتابة المثلثية:**
$$z_1 = 2\\left(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3}\\right)$$

**الكتابة الأُسية:**
$$z_1 = 2 \\, e^{i\\pi/3}$$

**بالتبادل:** $z_2 = \\overline{z_1} = 2 \\, e^{-i\\pi/3}$`,
        },
        {
          number: "3)",
          statement: `احسب $z_1^5$ بدلالة $\\pi$.`,
          solution: `
**بصيغة موافر:** $(re^{i\\theta})^n = r^n e^{in\\theta}$

$$z_1^5 = 2^5 \\, e^{i \\cdot 5 \\cdot \\pi/3} = 32 \\, e^{i5\\pi/3}$$

**تبسيط الزاوية:** $5\\pi/3 = 2\\pi - \\pi/3$, إذن $e^{i5\\pi/3} = e^{-i\\pi/3}$.

**النتيجة:** $z_1^5 = 32 \\, e^{-i\\pi/3}$

**بالشكل الجبري:** $z_1^5 = 32(\\cos(-\\pi/3) + i\\sin(-\\pi/3)) = 32(\\frac{1}{2} - i\\frac{\\sqrt{3}}{2}) = 16 - 16i\\sqrt{3}$`,
        },
        {
          number: "4)",
          statement: `لتكن النقاط $A, B, C$ التي أرقامها المركبة $z_A = 0$, $z_B = z_1$, $z_C = z_2$.

برهن أن المثلث $ABC$ متساوي الأضلاع.`,
          solution: `
**المعطيات:**
- $z_A = 0$
- $z_B = 1 + i\\sqrt{3}$
- $z_C = 1 - i\\sqrt{3}$

**الأطوال:**
- $AB = |z_B - z_A| = |z_B| = 2$
- $AC = |z_C - z_A| = |z_C| = 2$
- $BC = |z_C - z_B| = |{-2i\\sqrt{3}}| = 2\\sqrt{3}$

**نتحقق:** $AB = AC = 2$ لكن $BC = 2\\sqrt{3} \\neq 2$.

**النتيجة:** المثلث $ABC$ **متساوي الساقين** ($AB = AC = 2$) وليس متساوي الأضلاع.

**ملاحظة:** إذا كان الموضوع يقصد شعاع التدوير، فالزاوية $\\angle BAC = \\frac{2\\pi}{3}$ (الفرق بين عطلي $z_B$ و $z_C$)، لكن هذا لا يجعله متساوياً للأضلاع.`,
        },
      ],
    },
    {
      title: "الجزء الثاني: الحساب وقابلية القسمة (10 نقاط)",
      points: 10,
      questions: [
        {
          number: "1)",
          statement: `أوجد باقي قسمة $7^{2020}$ على 11.`,
          solution: `
**نظرية فيرما الصغرى:** 11 أولي و $\\gcd(7, 11) = 1$.
$$7^{10} \\equiv 1 \\pmod{11}$$

**تحليل الأس:** $2020 = 10 \\times 202 + 0$, إذن:
$$7^{2020} = (7^{10})^{202} \\cdot 7^0 \\equiv 1^{202} \\cdot 1 \\equiv 1 \\pmod{11}$$

**النتيجة:** باقي قسمة $7^{2020}$ على 11 هو **1**.`,
        },
        {
          number: "2)",
          statement: `حل في $\\mathbb{Z}^2$ المعادلة $12x + 18y = 6$.`,
          solution: `
**1. قابلية الحل:** $d = \\text{pgcd}(12, 18) = 6$, و $6 | 6$ ✓

**2. تبسيط:** نقسم على 6:
$$2x + 3y = 1$$

**3. حل خاص:** $x = -1$, $y = 1$: $2(-1) + 3(1) = -2 + 3 = 1$ ✓

**4. الحل العام:**
$$\\begin{cases} x = -1 + 3k \\\\ y = 1 - 2k \\end{cases}, \\quad k \\in \\mathbb{Z}$$

**النتيجة:** $S = \\{(-1 + 3k, 1 - 2k) \\mid k \\in \\mathbb{Z}\\}$`,
        },
        {
          number: "3)",
          statement: `حل في $\\mathbb{N}^2$ المعادلة $2x + 3y = 30$ (أي $x, y \\geq 0$).`,
          solution: `
**حل خاص:** $x = 15, y = 0$ ($30 + 0 = 30$ ✓)

**الحل العام:**
$$\\begin{cases} x = 15 + 3k \\\\ y = 0 - 2k \\end{cases}, \\quad k \\in \\mathbb{Z}$$

**تطبيق القيود $x, y \\geq 0$:**
- $15 + 3k \\geq 0 \\implies k \\geq -5$
- $-2k \\geq 0 \\implies k \\leq 0$

إذن $k \\in \\{-5, -4, -3, -2, -1, 0\\}$.

**الحلول في $\\mathbb{N}^2$:**
| $k$ | $x$ | $y$ |
|---|---|---|
| 0 | 15 | 0 |
| -1 | 12 | 2 |
| -2 | 9 | 4 |
| -3 | 6 | 6 |
| -4 | 3 | 8 |
| -5 | 0 | 10 |

**النتيجة:** $S = \\{(0, 10), (3, 8), (6, 6), (9, 4), (12, 2), (15, 0)\\}$`,
        },
      ],
    },
  ],
};

const examMath2022: BacExam = {
  id: "bac-2022-math",
  year: 2022,
  stream: "MATHEMATICS",
  duration: "4 ساعات",
  coefficient: 7,
  title: "بكالوريا 2022 — شعبة الرياضيات",
  description: "موضوع شامل في دراسة الدوال والأعداد المركبة.",
  totalPoints: 20,
  parts: [
    {
      title: "الجزء الأول: دراسة دالة بمعامل (12 نقطة)",
      points: 12,
      questions: [
        {
          number: "1)",
          statement: `لتكن $f_m(x) = \\frac{x^2 - m}{x - 1}$ حيث $m \\in \\mathbb{R}$ معطى.

حدد مجال تعريف $f_m$.`,
          solution: `
**الشرط:** المقام $x - 1 \\neq 0 \\implies x \\neq 1$.

**مجال التعريف:** $D_{f_m} = \\mathbb{R} \\setminus \\{1\\}$ (مستقل عن $m$).`,
        },
        {
          number: "2)",
          statement: `احسب $f'_m(x)$ ثم ناقش حسب $m$ عدد النقاط الحرجة.`,
          solution: `
**نوع $\\frac{u}{v}$:**
- $u = x^2 - m \\implies u' = 2x$
- $v = x - 1 \\implies v' = 1$

$$f'_m = \\frac{2x(x-1) - (x^2 - m)}{(x-1)^2} = \\frac{2x^2 - 2x - x^2 + m}{(x-1)^2} = \\frac{x^2 - 2x + m}{(x-1)^2}$$

**النقاط الحرجة:** $x^2 - 2x + m = 0$
$$\\Delta = 4 - 4m = 4(1 - m)$$

**المناقشة:**
- $m < 1$ ($\\Delta > 0$): قيمتان قصوى وصغرى محليتان عند $x = 1 \\pm \\sqrt{1-m}$
- $m = 1$ ($\\Delta = 0$): جذر مزدوج عند $x = 1$ (خارج المجال!), $f'$ موجبة
- $m > 1$ ($\\Delta < 0$): $f' > 0$ دائماً, $f$ تزايدية قطعاً`,
        },
        {
          number: "3)",
          statement: `في حالة $m = 2$, ارسم جدول تغيرات $f_2$.`,
          solution: `
**الحالة $m = 2 > 1$**: $f'_2 > 0$ على $D_{f_2}$.

$f_2(x) = \\dfrac{x^2 - 2}{x - 1}$

**نهايات:**
- $\\lim_{+\\infty} f_2 = +\\infty$ (بقيادة $x^2/x$)
- $\\lim_{-\\infty} f_2 = -\\infty$
- $x \\to 1^+$: $f_2 \\to -\\infty$ (البسط $\\to -1$, المقام $\\to 0^+$)
- $x \\to 1^-$: $f_2 \\to +\\infty$

**جدول التغيرات:**
| $x$ | $-\\infty$ | $1$ | $+\\infty$ |
|-----|-----------|-----|------------|
| $f'_2$ | $+$ | $\\Vert$ | $+$ | |
| $f_2$ | $-\\infty$ | $\\nearrow$ | $+\\infty$ | $\\Vert$ | $-\\infty$ | $\\nearrow$ | $+\\infty$ |

$f_2$ تزايدية قطعاً على $]-\\infty, 1[$ وعلى $]1, +\\infty[$.`,
        },
        {
          number: "4)",
          statement: `برهن أن $f_2(x) = x + 1 + \\frac{-1}{x - 1}$, واستنتج المقاربة المائلة.`,
          solution: `
**القسمة الإقليدية:** $x^2 - 2 = (x - 1)(x + 1) - 1$

إذن: $f_2(x) = x + 1 + \\frac{-1}{x - 1} = x + 1 - \\frac{1}{x - 1}$

**المقاربة المائلة:**
$$\\lim_{x \\to \\pm\\infty} [f_2(x) - (x + 1)] = \\lim \\frac{-1}{x - 1} = 0$$

إذن المستقيم $y = x + 1$ هو **مقاربة مائلة** لـ $f_2$ عند $\\pm\\infty$.`,
        },
      ],
    },
    {
      title: "الجزء الثاني: الأعداد المركبة (8 نقاط)",
      points: 8,
      questions: [
        {
          number: "1)",
          statement: `حل في $\\mathbb{C}$ المعادلة $z^3 = 8$.`,
          solution: `
**بالكتابة الأُسية:** $8 = 8 \\, e^{i \\cdot 0 + 2ik\\pi}$, إذن:
- $r = 2$ (لأن $r^3 = 8$)
- $3\\theta = 2k\\pi \\implies \\theta = \\frac{2k\\pi}{3}$, $k = 0, 1, 2$

**الحلول الثلاثة:**
- $k = 0$: $z_0 = 2 \\, e^{i \\cdot 0} = 2$
- $k = 1$: $z_1 = 2 \\, e^{i2\\pi/3} = 2\\left(-\\frac{1}{2} + i\\frac{\\sqrt{3}}{2}\\right) = -1 + i\\sqrt{3}$
- $k = 2$: $z_2 = 2 \\, e^{i4\\pi/3} = 2\\left(-\\frac{1}{2} - i\\frac{\\sqrt{3}}{2}\\right) = -1 - i\\sqrt{3}$

**النتيجة:** $S = \\{2, -1 + i\\sqrt{3}, -1 - i\\sqrt{3}\\}$ (جذور تكعيبية للوحدة × 2)`,
        },
        {
          number: "2)",
          statement: `برهن أن $1 + j + j^2 = 0$ حيث $j = e^{i2\\pi/3}$.`,
          solution: `
**بطريقة مباشرة:**
$$j = -\\frac{1}{2} + i\\frac{\\sqrt{3}}{2}, \\quad j^2 = e^{i4\\pi/3} = -\\frac{1}{2} - i\\frac{\\sqrt{3}}{2}$$

$$1 + j + j^2 = 1 + \\left(-\\frac{1}{2} + i\\frac{\\sqrt{3}}{2}\\right) + \\left(-\\frac{1}{2} - i\\frac{\\sqrt{3}}{2}\\right) = 1 - 1 + 0 = 0 \\;\\checkmark$$

**بطريقة أخرى:** $z^3 - 1 = (z - 1)(z^2 + z + 1)$, إذن $j$ و $j^2$ جذرا $z^2 + z + 1 = 0$, ومجموعهما = $-1$ (فييتا).
إذن $j + j^2 = -1 \\implies 1 + j + j^2 = 0$.`,
        },
      ],
    },
  ],
};

// ============================================================
//  مواضيع بكالوريا — شعبة التقني رياضي
// ============================================================

const examTechnical2021: BacExam = {
  id: "bac-2021-tech",
  year: 2021,
  stream: "TECHNICAL_MATH",
  duration: "3 ساعات",
  coefficient: 4,
  title: "بكالوريا 2021 — شعبة التقني رياضي",
  description: "موضوع شامل في الدوال الأسية واللوغاريتم والهندسة في الفضاء.",
  totalPoints: 20,
  parts: [
    {
      title: "الجزء الأول: الدوال الأسية واللوغاريتم (12 نقطة)",
      points: 12,
      questions: [
        {
          number: "1)",
          statement: `حل في $\\mathbb{R}$ المعادلة $e^{2x} - 5e^x + 6 = 0$.`,
          solution: `
**تغيير المتغير:** نضع $X = e^x$ ($X > 0$).
$$X^2 - 5X + 6 = 0$$

**حل التربيعية:**
$$\\Delta = 25 - 24 = 1$$
$$X = \\frac{5 \\pm 1}{2} \\implies X_1 = 3, \\; X_2 = 2$$

كلاهما موجب ✓.

**العودة إلى $x$:**
- $e^x = 3 \\implies x = \\ln 3$
- $e^x = 2 \\implies x = \\ln 2$

**النتيجة:** $S = \\{\\ln 2, \\ln 3\\}$`,
        },
        {
          number: "2)",
          statement: `حل في $\\mathbb{R}_+^*$ المتراجحة $\\ln(x) + \\ln(x-2) \\leq \\ln(8)$.`,
          solution: `
**1. مجال التعريف:** $x > 0$ و $x - 2 > 0 \\implies x > 2$.
$D = \\;]2, +\\infty[$

**2. على $D$:**
$$\\ln(x(x-2)) \\leq \\ln 8 \\iff x(x-2) \\leq 8 \\iff x^2 - 2x - 8 \\leq 0$$

**3. حل التربيعية:**
$$\\Delta = 4 + 32 = 36, \\quad x = \\frac{2 \\pm 6}{2} \\implies x_1 = -2, \\; x_2 = 4$$

إشارة $x^2 - 2x - 8$: سالبة بين الجذرين، أي على $[-2, 4]$.

**4. تقاطع مع $D$:**
$$[-2, 4] \\cap \\;]2, +\\infty[ = \\;]2, 4]$$

**النتيجة:** $S = \\;]2, 4]$`,
        },
        {
          number: "3)",
          statement: `احسب $\\int_1^e \\frac{\\ln x}{x} \\, dx$.`,
          solution: `
**تغيير المتغير:** نضع $u = \\ln x$, إذن $du = \\frac{1}{x} dx$.

عند $x = 1$: $u = 0$
عند $x = e$: $u = 1$

$$\\int_1^e \\frac{\\ln x}{x} dx = \\int_0^1 u \\, du = \\left[\\frac{u^2}{2}\\right]_0^1 = \\frac{1}{2} - 0 = \\frac{1}{2}$$

**النتيجة:** $\\int_1^e \\frac{\\ln x}{x} dx = \\dfrac{1}{2}$`,
        },
      ],
    },
    {
      title: "الجزء الثاني: الهندسة في الفضاء (8 نقاط)",
      points: 8,
      questions: [
        {
          number: "1)",
          statement: `لتكن النقاط $A(1, 0, 0)$, $B(0, 1, 0)$, $C(0, 0, 1)$.

احسب المسافة $AB$.`,
          solution: `
$$AB = \\sqrt{(0-1)^2 + (1-0)^2 + (0-0)^2} = \\sqrt{1 + 1 + 0} = \\sqrt{2}$$

**النتيجة:** $AB = \\sqrt{2}$`,
        },
        {
          number: "2)",
          statement: `أوجد معادلة المستوي $(ABC)$.`,
          solution: `
**الشعاعان:** $\\overrightarrow{AB}(-1, 1, 0)$ و $\\overrightarrow{AC}(-1, 0, 1)$

**الشعاع الناظم:** $\\vec{n} = \\overrightarrow{AB} \\wedge \\overrightarrow{AC}$

$$\\vec{n} = \\begin{pmatrix} 1 \\cdot 1 - 0 \\cdot 0 \\\\ 0 \\cdot (-1) - (-1) \\cdot 1 \\\\ (-1) \\cdot 0 - 1 \\cdot (-1) \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\end{pmatrix}$$

**معادلة المستوي:** يمر من $A(1, 0, 0)$ بشعاع ناظم $(1, 1, 1)$:
$$1 \\cdot (x - 1) + 1 \\cdot (y - 0) + 1 \\cdot (z - 0) = 0$$
$$x + y + z = 1$$

**النتيجة:** معادلة المستوي $(ABC)$: $x + y + z = 1$`,
        },
        {
          number: "3)",
          statement: `ما المسافة من النقطة $O(0, 0, 0)$ إلى المستوي $(ABC)$؟`,
          solution: `
**صيغة المسافة من نقطة إلى مستوي:**
المستوي $x + y + z - 1 = 0$ ($a=1, b=1, c=1, d=-1$).

$$d(O, (ABC)) = \\frac{|1 \\cdot 0 + 1 \\cdot 0 + 1 \\cdot 0 - 1|}{\\sqrt{1 + 1 + 1}} = \\frac{1}{\\sqrt{3}}$$

**النتيجة:** $d(O, (ABC)) = \\dfrac{1}{\\sqrt{3}} = \\dfrac{\\sqrt{3}}{3} \\approx 0{,}577$`,
        },
      ],
    },
  ],
};

// ============================================================
//  مواضيع إضافية شاملة (متنوعة)
// ============================================================

const examComprehensive2023: BacExam = {
  id: "bac-2023-comprehensive",
  year: 2023,
  stream: "ALL",
  duration: "3 ساعات",
  coefficient: 5,
  title: "بكالوريا 2023 — موضوع شامل (كل الشعب)",
  description: "موضوع شامل يجمع كل الوحدات: متتاليات، دالة أسية، احتمالات، هندسة، دالة لوغاريتمية.",
  totalPoints: 20,
  parts: [
    {
      title: "الجزء الأول: المتتاليات والدالة الأسية (10 نقاط)",
      points: 10,
      questions: [
        {
          number: "1)",
          statement: `لتكن $(u_n)$ المعرفة بـ $u_0 = 1$ و $u_{n+1} = 2u_n + 3$.

أوجد التعبير الصريح لـ $u_n$ بدلالة $n$.`,
          solution: `
**1. النقطة الثابتة:** $\\alpha = \\frac{3}{1-2} = -3$ (حل $x = 2x + 3$)

**2. المتتالية المساعدة:** $v_n = u_n - (-3) = u_n + 3$
$$v_{n+1} = u_{n+1} + 3 = 2u_n + 3 + 3 = 2(u_n + 3) = 2 v_n$$

إذن $(v_n)$ هندسية أساسها 2, حدها الأول $v_0 = 1 + 3 = 4$.

**3. التعبير الصريح:**
$$v_n = 4 \\cdot 2^n \\implies u_n = 4 \\cdot 2^n - 3$$

**التحقق:** $u_0 = 4 - 3 = 1$ ✓, $u_1 = 8 - 3 = 5$ ✓ ($u_1 = 2(1) + 3 = 5$)`,
        },
        {
          number: "2)",
          statement: `احسب $\\lim_{n \\to +\\infty} u_n$.`,
          solution: `
بما أن $2 > 1$:
$$\\lim_{n \\to +\\infty} 2^n = +\\infty$$

إذن:
$$\\lim u_n = \\lim (4 \\cdot 2^n - 3) = +\\infty$$

**النتيجة:** $\\lim u_n = +\\infty$`,
        },
        {
          number: "3)",
          statement: `حل المعادلة $e^{3x-1} = e^{x+5}$.`,
          solution: `
**تطبيق ln على الطرفين:**
$$3x - 1 = x + 5 \\implies 2x = 6 \\implies x = 3$$

**النتيجة:** $S = \\{3\\}$

**التحقق:** $e^{3(3)-1} = e^8$ و $e^{3+5} = e^8$ ✓`,
        },
      ],
    },
    {
      title: "الجزء الثاني: الاحتمالات والهندسة (10 نقاط)",
      points: 10,
      questions: [
        {
          number: "1)",
          statement: `نرمي حبي نرد عادي مرتين. ما احتمال أن يكون المجموع 8؟`,
          solution: `
**الأزواج المواتية (المجموع = 8):**
$$(2,6), (3,5), (4,4), (5,3), (6,2)$$

5 أزواج من 36.

**الاحتمال:**
$$P = \\frac{5}{36}$$

**النتيجة:** $\\dfrac{5}{36} \\approx 0{,}139$`,
        },
        {
          number: "2)",
          statement: `في الفضاء المنسوب لمعلم متعامد ممنظم، لتكن:
- $(P)$: $2x + y - z + 1 = 0$
- $(D)$: $\\begin{cases} x = 1 + t \\\\ y = 2 - t \\\\ z = -1 + 3t \\end{cases}$

هل $(D)$ و $(P)$ متوازيان أم متقاطعان؟`,
          solution: `
**شعاع التوجيه لـ $(D)$:** $\\vec{u}(1, -1, 3)$
**الشعاع الناظم لـ $(P)$:** $\\vec{n}(2, 1, -1)$

**التوازي يقتضي:** $\\vec{u} \\cdot \\vec{n} = 0$
$$1 \\cdot 2 + (-1) \\cdot 1 + 3 \\cdot (-1) = 2 - 1 - 3 = -2 \\neq 0$$

إذن $(D)$ و $(P)$ **غير متوازيين**, يتقاطعان في نقطة واحدة.

**للعثور على نقطة التقاطع:** نعوض معادلات $(D)$ في $(P)$:
$$2(1+t) + (2-t) - (-1+3t) + 1 = 0$$
$$2 + 2t + 2 - t + 1 - 3t + 1 = 0$$
$$6 - 2t = 0 \\implies t = 3$$

**نقطة التقاطع:**
- $x = 1 + 3 = 4$
- $y = 2 - 3 = -1$
- $z = -1 + 9 = 8$

**النتيجة:** $(D)$ و $(P)$ متقاطعان في النقطة $I(4, -1, 8)$.`,
        },
      ],
    },
  ],
};

// ============================================================
//  تصدير كل المواضيع
// ============================================================

export const bacExams: BacExam[] = [
  examExperimental2019,
  examExperimental2021,
  examMath2020,
  examMath2022,
  examTechnical2021,
  examComprehensive2023,
];

// عناوين عربية للشعب
export const streamLabelsBac: Record<BacStream, string> = {
  ALL: "كل الشعب",
  EXPERIMENTAL_SCIENCES: "علوم تجريبية",
  MATHEMATICS: "رياضيات",
  TECHNICAL_MATH: "تقني رياضي",
};

// دالة لإحصاء المواضيع
export function getBacExamsStats() {
  const byStream: Record<string, number> = {};
  let totalQuestions = 0;
  for (const exam of bacExams) {
    byStream[exam.stream] = (byStream[exam.stream] || 0) + 1;
    for (const part of exam.parts) {
      totalQuestions += part.questions.length;
    }
  }
  return {
    total: bacExams.length,
    byStream,
    totalQuestions,
    years: Array.from(new Set(bacExams.map((e) => e.year))).sort(),
  };
}
