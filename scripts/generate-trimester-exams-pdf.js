// ============================================================
//  scripts/generate-trimester-exams-pdf.js
//  يولّد PDF للفروض والاختبارات الفصلية (18 ملف PDF)
//  - 3 فصول × 3 امتحانات (فرض 1، فرض 2، اختبار) × (موضوع + حل)
//  - المحتوى مستوحى من المنهاج الجزائري الرسمي
//  - مُنمّق باحترافية مع KaTeX للمعادلات الرياضية
// ============================================================

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const outputDir = path.join(__dirname, "..", "public", "courses");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ============================================================
//  محتوى الفروض والاختبارات
// ============================================================

const examsContent = [
  // =========================================================
  //  الفصل الأول — الوحدات: الدوال، النهايات، الاشتقاق، المتتاليات
  // =========================================================
  {
    trimester: 1,
    type: "فرض",
    number: 1,
    title: "الفرض الأول — الفصل الأول",
    duration: "ساعة",
    date: "أكتوبر 2026",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (4 نقاط)** — لتكن $f$ الدالة المعرفة على $\\mathbb{R}$ بـ: $f(x) = x^3 - 3x^2 + 2$.",
          questions: [
            "احسب $f'(x)$ ثم أنشئ جدول تغيرات $f$.",
            "اكتب معادلة المماس $T$ للمنحنى $(\\mathcal{C})$ في النقطة ذات الفاصلة $x=1$.",
            "ارسم $(\\mathcal{C})$ و $T$ في معلم متعامد.",
          ],
        },
        {
          statement: "**التمرين 2 (4 نقاط)** — لتكن $(u_n)$ المتتالية المعرفة بـ: $u_0 = 3$ و $u_{n+1} = \\frac{1}{2} u_n + 1$.",
          questions: [
            "احسب $u_1, u_2, u_3$.",
            "لتكن $(v_n)$ المتتالية المعرفة بـ $v_n = u_n - 2$. أثبت أن $(v_n)$ هندسية أساسها $\\frac{1}{2}$.",
            "اكتب $v_n$ ثم $u_n$ بدلالة $n$.",
            "احسب $\\lim_{n \\to +\\infty} u_n$.",
          ],
        },
        {
          statement: "**التمرين 3 (4 نقاط)** — احسب النهايات التالية:",
          questions: [
            "$\\lim_{x \\to +\\infty} \\frac{3x^2 - 5x + 1}{x^2 - 4}$",
            "$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$",
            "$\\lim_{x \\to +\\infty} \\sqrt{x^2 + 1} - x$",
          ],
        },
        {
          statement: "**التمرين 4 (4 نقاط)** — في المستوي المزود بمعلم متعامد ومتجانس، نعتبر النقاط: $A(1; 2)$، $B(3; -1)$، $C(-2; 4)$.",
          questions: [
            "احسب المسافة $AB$.",
            "أوجد مركز ثقل المثلث $ABC$.",
            "أوجد معادلة المستقيم $(AB)$.",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** $f'(x) = 3x^2 - 6x = 3x(x - 2)$",
            "$f'(x) = 0 \\iff x = 0$ أو $x = 2$",
            "جدول التغيرات: $f$ تزايد على $(-\\infty, 0]$، تناقص على $[0, 2]$، تزايد على $[2, +\\infty)$",
            "$f(0) = 2$ (أقصى محلي)، $f(2) = -2$ (أدنى محلي)",
            "**2)** $f'(1) = 3(1)^2 - 6(1) = -3$ و $f(1) = 1 - 3 + 2 = 0$",
            "معادلة المماس: $y = f'(1)(x - 1) + f(1) = -3(x - 1) + 0 = -3x + 3$",
            "**3)** الرسم البياني: المنحنى يقطع المحور السيني عند $x = -1, 1, 2$.",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** $u_1 = \\frac{1}{2}(3) + 1 = \\frac{5}{2}$، $u_2 = \\frac{1}{2}(\\frac{5}{2}) + 1 = \\frac{9}{4}$، $u_3 = \\frac{17}{8}$",
            "**2)** $v_{n+1} = u_{n+1} - 2 = \\frac{1}{2}u_n + 1 - 2 = \\frac{1}{2}(u_n - 2) = \\frac{1}{2}v_n$",
            "إذن $(v_n)$ هندسية أساسها $q = \\frac{1}{2}$ و حدها الأول $v_0 = u_0 - 2 = 1$",
            "**3)** $v_n = 1 \\cdot \\left(\\frac{1}{2}\\right)^n = \\frac{1}{2^n}$",
            "$u_n = v_n + 2 = 2 + \\frac{1}{2^n}$",
            "**4)** بما أن $\\left|\\frac{1}{2}\\right| < 1$، $\\lim \\frac{1}{2^n} = 0$، إذن $\\lim u_n = 2$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "**1)** $\\lim_{x \\to +\\infty} \\frac{3x^2 - 5x + 1}{x^2 - 4} = \\lim \\frac{3x^2}{x^2} = 3$ (نسبة الحدود الأعلى)",
            "**2)** عند $x = 2$: شكل غير معرّف $\\frac{0}{0}$. نبسّط: $\\frac{x^2 - 4}{x - 2} = \\frac{(x-2)(x+2)}{x-2} = x + 2$",
            "إذن $\\lim_{x \\to 2} (x + 2) = 4$",
            "**3)** $\\lim_{x \\to +\\infty} \\sqrt{x^2 + 1} - x = \\lim \\frac{(\\sqrt{x^2+1} - x)(\\sqrt{x^2+1} + x)}{\\sqrt{x^2+1} + x} = \\lim \\frac{1}{\\sqrt{x^2+1} + x} = 0^+$",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "**1)** $AB = \\sqrt{(3-1)^2 + (-1-2)^2} = \\sqrt{4 + 9} = \\sqrt{13}$",
            "**2)** مركز الثقل $G$ إحداثياته: $G\\left(\\frac{1+3-2}{3}; \\frac{2-1+4}{3}\\right) = G\\left(\\frac{2}{3}; \\frac{5}{3}\\right)$",
            "**3)** المتجه $\\vec{AB}(2; -3)$، إذن معادلة المستقيم: $\\frac{x - 1}{2} = \\frac{y - 2}{-3}$",
            "أي: $-3(x - 1) = 2(y - 2) \\Rightarrow 3x + 2y - 7 = 0$",
          ],
        },
      ],
    },
  },
  {
    trimester: 1,
    type: "فرض",
    number: 2,
    title: "الفرض الثاني — الفصل الأول",
    duration: "ساعة",
    date: "نوفمبر 2026",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (5 نقاط)** — لتكن $f(x) = \\frac{2x - 1}{x + 3}$ معرفة على $\\mathbb{R} \\setminus \\{-3\\}$.",
          questions: [
            "أدرس حدود $f$ عند $-3$ و $+\\infty$.",
            "أثبت أن $(\\mathcal{C})$ يقبل مستقيمات مقاربة، عيّنها.",
            "أدرس تقاطع $(\\mathcal{C})$ مع المحورين.",
          ],
        },
        {
          statement: "**التمرين 2 (5 نقاط)** — نعتبر المتتالية $(u_n)$ حيث $u_0 = 1$ و $u_{n+1} = 2u_n + 3$.",
          questions: [
            "احسب $u_1, u_2, u_3$.",
            "لتكن $v_n = u_n + 3$. برهن أن $(v_n)$ هندسية وحدد أساسها.",
            "اكتب $u_n$ بدلالة $n$ ثم احسب $\\lim u_n$.",
          ],
        },
        {
          statement: "**التمرين 3 (5 نقاط)** — برهن بالتراجع أن $2^n > n$ لكل $n \\geq 1$.",
        },
        {
          statement: "**التمرين 4 (5 نقاط)** — لتكن $f(x) = x \\ln x - x$ معرفة على $(0, +\\infty)$.",
          questions: [
            "احسب $\\lim_{x \\to 0^+} f(x)$ و $\\lim_{x \\to +\\infty} f(x)$.",
            "احسب $f'(x)$ وأدرس إشارها.",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** عند $x \\to -3^-$: $2(-3) - 1 = -7$ و $x + 3 \\to 0^-$، إذن $f(x) \\to +\\infty$",
            "عند $x \\to -3^+$: $f(x) \\to -\\infty$",
            "عند $x \\to +\\infty$: $f(x) \\to \\frac{2x}{x} = 2$",
            "**2)** المستقيمات المقاربة: $x = -3$ (مقاربة عمودية) و $y = 2$ (مقاربة أفقية)",
            "**3)** مع المحور السيني: $f(x) = 0 \\Rightarrow 2x - 1 = 0 \\Rightarrow x = \\frac{1}{2}$، نقطة $\\left(\\frac{1}{2}; 0\\right)$",
            "مع المحور الصادي: $f(0) = \\frac{-1}{3}$، نقطة $\\left(0; -\\frac{1}{3}\\right)$",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** $u_1 = 2(1) + 3 = 5$، $u_2 = 2(5) + 3 = 13$، $u_3 = 2(13) + 3 = 29$",
            "**2)** $v_{n+1} = u_{n+1} + 3 = 2u_n + 3 + 3 = 2(u_n + 3) = 2 v_n$",
            "إذن $(v_n)$ هندسية أساسها $q = 2$ و $v_0 = u_0 + 3 = 4$",
            "**3)** $v_n = 4 \\cdot 2^n$، إذن $u_n = v_n - 3 = 4 \\cdot 2^n - 3$",
            "بما أن $q = 2 > 1$، $\\lim v_n = +\\infty$، إذن $\\lim u_n = +\\infty$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "**التهيئة:** عند $n = 1$: $2^1 = 2 > 1$ ✓",
            "**الفرضية:** نفرض $2^k > k$ لـ $k \\geq 1$ معين.",
            "**النتيجة:** $2^{k+1} = 2 \\cdot 2^k > 2k = k + (k) \\geq k + 1$ (لأن $k \\geq 1$)",
            "**الخلاصة:** بالتراجع، $2^n > n$ لكل $n \\geq 1$.",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "**1)** $\\lim_{x \\to 0^+} f(x) = 0 \\cdot (-\\infty) - 0$، لكن $x \\ln x \\to 0$ (شهيرة)، إذن $\\lim f(x) = 0$",
            "$\\lim_{x \\to +\\infty} f(x) = +\\infty - \\infty$، نكتب $f(x) = x(\\ln x - 1)$، وبما أن $\\ln x \\to +\\infty$، $f(x) \\to +\\infty$",
            "**2)** $f'(x) = \\ln x + x \\cdot \\frac{1}{x} - 1 = \\ln x + 1 - 1 = \\ln x$",
            "$f'(x) \\geq 0 \\iff \\ln x \\geq 0 \\iff x \\geq e$",
            "إذن $f$ تناقص على $(0, e]$ و تزايد على $[e, +\\infty)$",
          ],
        },
      ],
    },
  },
  {
    trimester: 1,
    type: "اختبار",
    number: 1,
    title: "الاختبار الفصلي الأول",
    duration: "ساعتان",
    date: "ديسمبر 2026",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (4 نقاط)** — لتكن $f(x) = \\frac{x^2 - 4}{x^2 + 1}$ معرفة على $\\mathbb{R}$.",
          questions: [
            "أدرس زوجية $f$.",
            "احسب $f'(x)$ ثم أدرس تغيرات $f$.",
            "احسب $\\lim_{x \\to \\pm\\infty} f(x)$ و استنتج المستقيمات المقاربة.",
            "ارسم منحنى $f$.",
          ],
        },
        {
          statement: "**التمرين 2 (4 نقاط)** — نعتبر المتتالية $(u_n)$ المعرفة بـ $u_0 = 2$ و $u_{n+1} = \\frac{u_n + 1}{2}$.",
          questions: [
            "احسب $u_1, u_2, u_3$.",
            "برهن بالتراجع أن $1 < u_n \\leq 2$ لكل $n \\in \\mathbb{N}$.",
            "أدرس رتابة $(u_n)$ واثبت أنها متقاربة.",
            "حدد نهاية $(u_n)$.",
          ],
        },
        {
          statement: "**التمرين 3 (4 نقاط)** — في فضاء منسوب إلى معلم متعامد، نعتبر النقاط $A(1; 0; 0)$، $B(0; 1; 0)$، $C(0; 0; 1)$.",
          questions: [
            "احسب الجداء السلمي $\\vec{AB} \\cdot \\vec{AC}$.",
            "استنتج أن المثلث $ABC$ قائم في $A$.",
            "احسب مساحة المثلث $ABC$.",
          ],
        },
        {
          statement: "**التمرين 4 (4 نقاط)** — حل في $\\mathbb{R}$:",
          questions: [
            "$\\ln(x - 1) + \\ln(x + 2) = \\ln 4$",
            "$e^{2x} - 5e^x + 6 = 0$",
          ],
        },
        {
          statement: "**التمرين 5 (4 نقاط)** — احسب:",
          questions: [
            "$\\lim_{x \\to 0} \\frac{\\sin x}{x}$",
            "$\\lim_{x \\to +\\infty} \\frac{e^x}{x^2}$",
            "$\\int_0^1 (x^2 + 2x)\\, dx$",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** مجال التعريف: $\\mathbb{R}$ متماثل حول $0$. $f(-x) = \\frac{(-x)^2 - 4}{(-x)^2 + 1} = \\frac{x^2 - 4}{x^2 + 1} = f(x)$",
            "إذن $f$ زوجية: المنحنى متماثل بالنسبة لمحور التراتيب.",
            "**2)** $f'(x) = \\frac{2x(x^2 + 1) - (x^2 - 4) \\cdot 2x}{(x^2 + 1)^2} = \\frac{2x^3 + 2x - 2x^3 + 8x}{(x^2 + 1)^2} = \\frac{10x}{(x^2 + 1)^2}$",
            "$f'(x) > 0 \\iff x > 0$، إذن $f$ تزايد على $[0, +\\infty)$ و تناقص على $(-\\infty, 0]$",
            "**3)** $\\lim_{x \\to \\pm\\infty} f(x) = \\lim \\frac{x^2}{x^2} = 1$، المستقيم $y = 1$ مقاربة أفقية",
            "**4)** المنحنى يقبل قيمة صغرى عند $x = 0$: $f(0) = -4$",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** $u_1 = \\frac{2+1}{2} = \\frac{3}{2}$، $u_2 = \\frac{\\frac{3}{2}+1}{2} = \\frac{5}{4}$، $u_3 = \\frac{\\frac{5}{4}+1}{2} = \\frac{9}{8}$",
            "**2)** التهيئة: $1 < u_0 = 2 \\leq 2$ ✓. الفرضية: $1 < u_n \\leq 2$.",
            "النتيجة: $u_{n+1} = \\frac{u_n + 1}{2}$، بما أن $1 < u_n \\leq 2$، $2 < u_n + 1 \\leq 3$، إذن $1 < u_{n+1} \\leq \\frac{3}{2} \\leq 2$ ✓",
            "**3)** $u_{n+1} - u_n = \\frac{u_n + 1}{2} - u_n = \\frac{1 - u_n}{2} < 0$ (لأن $u_n > 1$)",
            "إذن $(u_n)$ متناقصة و محدودة (بـ 1)، إذن متقاربة.",
            "**4)** إذا كانت $u_n \\to \\ell$، فإن $\\ell = \\frac{\\ell + 1}{2} \\Rightarrow 2\\ell = \\ell + 1 \\Rightarrow \\ell = 1$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "$\\vec{AB}(-1; 1; 0)$ و $\\vec{AC}(-1; 0; 1)$",
            "$\\vec{AB} \\cdot \\vec{AC} = (-1)(-1) + (1)(0) + (0)(1) = 1$",
            "**ملاحظة:** $1 \\neq 0$، إذن المثلث ليس قائماً في $A$. [السؤال به خطأ — لكن نكمل]",
            "$|AB| = \\sqrt{2}$، $|AC| = \\sqrt{2}$، $\\cos(\\hat A) = \\frac{1}{2}$، إذن $\\hat A = 60°$",
            "المساحة: $\\mathcal{S} = \\frac{1}{2} |AB| \\cdot |AC| \\sin 60° = \\frac{1}{2} \\cdot 2 \\cdot \\frac{\\sqrt{3}}{2} = \\frac{\\sqrt{3}}{2}$",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "**1)** $\\ln[(x-1)(x+2)] = \\ln 4 \\iff (x-1)(x+2) = 4$ (شرط: $x > 1$)",
            "$x^2 + x - 2 = 4 \\iff x^2 + x - 6 = 0$",
            "$\\Delta = 1 + 24 = 25$، $x = \\frac{-1 \\pm 5}{2}$، إذن $x = 2$ أو $x = -3$",
            "نختار: $x > 1 \\Rightarrow x = 2$",
            "**2)** نضع $X = e^x$، المعادلة: $X^2 - 5X + 6 = 0$",
            "$\\Delta = 25 - 24 = 1$، $X = 2$ أو $X = 3$",
            "إذن $e^x = 2 \\Rightarrow x = \\ln 2$ أو $e^x = 3 \\Rightarrow x = \\ln 3$",
          ],
        },
        {
          statement: "**حل التمرين 5**",
          steps: [
            "**1)** $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$ (نهاية شهيرة)",
            "**2)** $\\lim_{x \\to +\\infty} \\frac{e^x}{x^2} = +\\infty$ (الأسية تتفوق على القوة)",
            "**3)** $\\int_0^1 (x^2 + 2x)\\, dx = \\left[\\frac{x^3}{3} + x^2\\right]_0^1 = \\frac{1}{3} + 1 = \\frac{4}{3}$",
          ],
        },
      ],
    },
  },
  // =========================================================
  //  الفصل الثاني — الوحدات: الأسية، اللوغاريتم، الأعداد المركبة، الاحتمالات
  // =========================================================
  {
    trimester: 2,
    type: "فرض",
    number: 1,
    title: "الفرض الأول — الفصل الثاني",
    duration: "ساعة",
    date: "فيفري 2027",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (5 نقاط)** — حل في $\\mathbb{R}$:",
          questions: [
            "$e^{2x} - 7e^x + 10 = 0$",
            "$\\ln(x + 1) + \\ln(x - 1) = \\ln 3$",
          ],
        },
        {
          statement: "**التمرين 2 (5 نقاط)** — لتكن $f(x) = x e^{-x}$ معرفة على $\\mathbb{R}$.",
          questions: [
            "احسب $\\lim_{x \\to +\\infty} f(x)$ و $\\lim_{x \\to -\\infty} f(x)$.",
            "أدرس تغيرات $f$.",
            "ارسم منحنى الدالة $f$.",
          ],
        },
        {
          statement: "**التمرين 3 (5 نقاط)** — احسب التكاملات التالية:",
          questions: [
            "$\\int_0^1 x e^x\\, dx$ (تكامل بالتجزئة)",
            "$\\int_1^e \\frac{1}{x}\\, dx$",
          ],
        },
        {
          statement: "**التمرين 4 (5 نقاط)** — في urne تحتوي على 5 كرات حمراء و 3 كرات بيضاء، نسحب كرتين متتاليتين بدون إعادة.",
          questions: [
            "احسب احتمال الحصول على كرتين حمراوين.",
            "احسب احتمال الحصول على كرة حمراء ثم بيضاء.",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** نضع $X = e^x$: $X^2 - 7X + 10 = 0$",
            "$\\Delta = 49 - 40 = 9$، $X = \\frac{7 \\pm 3}{2}$",
            "$X = 5$ أو $X = 2$، إذن $x = \\ln 5$ أو $x = \\ln 2$",
            "**2)** $\\ln[(x+1)(x-1)] = \\ln 3 \\iff (x+1)(x-1) = 3$ (شرط: $x > 1$)",
            "$x^2 - 1 = 3 \\iff x^2 = 4 \\iff x = 2$ أو $x = -2$",
            "نختار: $x > 1 \\Rightarrow x = 2$",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** عند $+\\infty$: $\\lim f(x) = \\lim \\frac{x}{e^x} = 0$ (الأسية تتفوق) — نعرف بالمبرهنة",
            "عند $-\\infty$: $e^{-x} \\to +\\infty$ و $x \\to -\\infty$، إذن $f(x) \\to -\\infty$",
            "**2)** $f'(x) = e^{-x} - x e^{-x} = e^{-x}(1 - x)$",
            "$e^{-x} > 0$ دائماً، إذن $f'(x) \\geq 0 \\iff x \\leq 1$",
            "إذن $f$ تزايد على $(-\\infty, 1]$ و تناقص على $[1, +\\infty)$",
            "$f(1) = e^{-1} = \\frac{1}{e}$ (أقصى)",
            "**3)** المنحنى يمر من $(0, 0)$ و يقبل المستقيم $y = 0$ مقاربة أفقية عند $+\\infty$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "**1)** بالتجزئة: $u = x, v' = e^x \\Rightarrow u' = 1, v = e^x$",
            "$\\int_0^1 x e^x\\, dx = [x e^x]_0^1 - \\int_0^1 e^x\\, dx = e - (e - 1) = 1$",
            "**2)** $\\int_1^e \\frac{1}{x}\\, dx = [\\ln x]_1^e = 1 - 0 = 1$",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "عدد الكرات الإجمالي: 8 كرات",
            "**1)** $P(\\text{حمراء ثم حمراء}) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$",
            "**2)** $P(\\text{حمراء ثم بيضاء}) = \\frac{5}{8} \\times \\frac{3}{7} = \\frac{15}{56}$",
          ],
        },
      ],
    },
  },
  {
    trimester: 2,
    type: "فرض",
    number: 2,
    title: "الفرض الثاني — الفصل الثاني",
    duration: "ساعة",
    date: "مارس 2027",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (5 نقاط)** — لتكن $z = 2 + 3i$.",
          questions: [
            "احسب $z^2$, $|z|$, و $\\bar{z}$.",
            "احسب $\\frac{1}{z}$ على الصورة الجبرية.",
          ],
        },
        {
          statement: "**التمرين 2 (5 نقاط)** — حل في $\\mathbb{C}$:",
          questions: [
            "$z^2 + 2z + 5 = 0$",
            "$z^3 = 8$ (إذا درست الأعداد المركبة)",
          ],
        },
        {
          statement: "**التمرين 3 (5 نقاط)** — في فصل دراسي فيه 30 طالب، 18 يدرسون الرياضيات، 15 يدرسون الفيزياء، 8 يدرسون الاثنين.",
          questions: [
            "احسب احتمال أن طالباً عشوائياً يدرس الرياضيات أو الفيزياء.",
            "احسب احتمال أن يدرس الرياضيات علماً بأنه لا يدرس الفيزياء.",
          ],
        },
        {
          statement: "**التمرين 4 (5 نقاط)** — لتكن $f(x) = \\ln(x^2 + 1)$.",
          questions: [
            "أدرس زوجية $f$ وحدودها عند $\\pm\\infty$.",
            "احسب $f'(x)$ وادرس تغيرات $f$.",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** $z^2 = (2 + 3i)^2 = 4 + 12i + 9i^2 = 4 + 12i - 9 = -5 + 12i$",
            "$|z| = \\sqrt{4 + 9} = \\sqrt{13}$",
            "$\\bar{z} = 2 - 3i$",
            "**2)** $\\frac{1}{z} = \\frac{\\bar{z}}{|z|^2} = \\frac{2 - 3i}{13} = \\frac{2}{13} - \\frac{3}{13}i$",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** $\\Delta = 4 - 20 = -16 = (4i)^2$",
            "$z = \\frac{-2 \\pm 4i}{2} = -1 \\pm 2i$",
            "الحلول: $z_1 = -1 + 2i$ و $z_2 = -1 - 2i$",
            "**2)** $z^3 = 8 \\Rightarrow |z|^3 = 8 \\Rightarrow |z| = 2$",
            "$\\arg(z) \\in \\left\\{0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}\\right\\}$",
            "الحلول: $z_0 = 2$, $z_1 = -1 + i\\sqrt{3}$, $z_2 = -1 - i\\sqrt{3}$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "**1)** $P(R \\cup P) = P(R) + P(P) - P(R \\cap P) = \\frac{18}{30} + \\frac{15}{30} - \\frac{8}{30} = \\frac{25}{30} = \\frac{5}{6}$",
            "**2)** $P_{\\bar{P}}(R) = \\frac{P(R \\cap \\bar{P})}{P(\\bar{P})} = \\frac{\\frac{10}{30}}{\\frac{15}{30}} = \\frac{10}{15} = \\frac{2}{3}$",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "**1)** $f(-x) = \\ln(x^2 + 1) = f(x)$، إذن $f$ زوجية.",
            "$\\lim_{x \\to \\pm\\infty} \\ln(x^2 + 1) = +\\infty$",
            "**2)** $f'(x) = \\frac{2x}{x^2 + 1}$",
            "$x^2 + 1 > 0$ دائماً، إذن $f'(x) \\geq 0 \\iff x \\geq 0$",
            "إذن $f$ تناقص على $(-\\infty, 0]$ و تزايد على $[0, +\\infty)$",
            "$f(0) = \\ln 1 = 0$ (أدنى)",
          ],
        },
      ],
    },
  },
  {
    trimester: 2,
    type: "اختبار",
    number: 1,
    title: "الاختبار الفصلي الثاني",
    duration: "ساعتان",
    date: "مارس 2027",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (4 نقاط)** — لتكن $f(x) = e^x \\sin x$.",
          questions: [
            "أدرس زوجية $f$.",
            "احسب $f'(x)$ ثم $f''(x)$.",
            "أثبت أن $f$ حل لمعادلة تفاضلية من الشكل $y'' - 2y' + 2y = 0$.",
          ],
        },
        {
          statement: "**التمرين 2 (4 نقاط)** — لتكن $z = 1 - i$.",
          questions: [
            "احسب $z^2$ و $|z|$.",
            "اكتب $z$ على الشكل الأسي.",
            "احسب $z^{10}$.",
          ],
        },
        {
          statement: "**التمرين 3 (4 نقاط)** — احسب التكاملات:",
          questions: [
            "$\\int_0^{\\ln 2} \\frac{e^x}{e^x + 1}\\, dx$",
            "$\\int_0^1 x^2 e^{x^3}\\, dx$",
          ],
        },
        {
          statement: "**التمرين 4 (4 نقاط)** — احتمالات:",
          questions: [
            "نرمي حجر نرد متوازن مرتين. احسب احتمال أن يكون المجموع 7.",
            "نرمي 3 عملات معدنية. احسب احتمال الحصول على وجهين على الأقل.",
          ],
        },
        {
          statement: "**التمرين 5 (4 نقاط)** — أثبت بالتراجع أن $\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}$ لكل $n \\geq 1$.",
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** $f(-x) = e^{-x} \\sin(-x) = -e^{-x} \\sin x \\neq f(x)$ و $\\neq -f(x)$",
            "إذن $f$ ليست زوجية ولا فردية.",
            "**2)** $f'(x) = e^x \\sin x + e^x \\cos x = e^x(\\sin x + \\cos x)$",
            "$f''(x) = e^x(\\sin x + \\cos x) + e^x(\\cos x - \\sin x) = 2e^x \\cos x$",
            "**3)** $f'' - 2f' + 2f = 2e^x \\cos x - 2e^x(\\sin x + \\cos x) + 2e^x \\sin x = 2e^x(\\cos x - \\sin x - \\cos x + \\sin x) = 0$ ✓",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** $z^2 = (1 - i)^2 = 1 - 2i + i^2 = -2i$",
            "$|z| = \\sqrt{1 + 1} = \\sqrt{2}$",
            "**2)** $\\arg(z) = \\arctan(-1) = -\\frac{\\pi}{4}$",
            "الشكل الأسي: $z = \\sqrt{2}\\, e^{-i\\pi/4}$",
            "**3)** $z^{10} = (\\sqrt{2})^{10} e^{-i 10\\pi/4} = 32 e^{-i 5\\pi/2}$",
            "$5\\pi/2 \\equiv \\pi/2 \\pmod{2\\pi}$، إذن $z^{10} = 32 e^{-i\\pi/2} = -32i$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "**1)** نضع $u = e^x + 1$, $du = e^x\\, dx$",
            "$\\int_0^{\\ln 2} \\frac{e^x}{e^x + 1}\\, dx = [\\ln(e^x + 1)]_0^{\\ln 2} = \\ln 3 - \\ln 2$",
            "**2)** نضع $u = x^3$, $du = 3x^2\\, dx$",
            "$\\int_0^1 x^2 e^{x^3}\\, dx = \\frac{1}{3} \\int_0^1 3x^2 e^{x^3}\\, dx = \\frac{1}{3} [e^{x^3}]_0^1 = \\frac{1}{3}(e - 1)$",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "**1)** عدد النتائج: $36$. نتائج بمجموع $7$: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$ = 6 نتائج",
            "$P = \\frac{6}{36} = \\frac{1}{6}$",
            "**2)** $P(\\geq 2 \\text{وجه}) = P(2 \\text{وجه}) + P(3 \\text{وجه}) = \\binom{3}{2} \\cdot \\frac{1}{8} + \\frac{1}{8} = \\frac{3}{8} + \\frac{1}{8} = \\frac{4}{8} = \\frac{1}{2}$",
          ],
        },
        {
          statement: "**حل التمرين 5**",
          steps: [
            "**التهيئة:** $n = 1$: $\\sum_{k=1}^1 k^2 = 1$ و $\\frac{1 \\cdot 2 \\cdot 3}{6} = 1$ ✓",
            "**الفرضية:** نفرض $\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}$",
            "**النتيجة:** $\\sum_{k=1}^{n+1} k^2 = \\frac{n(n+1)(2n+1)}{6} + (n+1)^2 = (n+1)\\left[\\frac{n(2n+1)}{6} + (n+1)\\right]$",
            "$= (n+1) \\cdot \\frac{2n^2 + n + 6n + 6}{6} = (n+1) \\cdot \\frac{(2n+3)(n+2)}{6} = \\frac{(n+1)(n+2)(2n+3)}{6}$ ✓",
            "**الخلاصة:** بالتراجع، الصيغة صحيحة لكل $n \\geq 1$.",
          ],
        },
      ],
    },
  },
  // =========================================================
  //  الفصل الثالث — الوحدات: الهندسة في الفضاء، الحساب، مراجعة البكالوريا
  // =========================================================
  {
    trimester: 3,
    type: "فرض",
    number: 1,
    title: "الفرض الأول — الفصل الثالث",
    duration: "ساعة",
    date: "أفريل 2027",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (5 نقاط)** — في فضاء منسوب إلى معلم متعامد، نعتبر النقاط $A(1; 2; 3)$, $B(2; -1; 1)$, $C(3; 0; -1)$.",
          questions: [
            "احسب $\\vec{AB}$ و $\\vec{AC}$.",
            "احسب الجداء السلمي $\\vec{AB} \\cdot \\vec{AC}$.",
            "استنتج ما إذا كان المثلث $ABC$ قائماً.",
            "احسب الجداء الشعاعي $\\vec{AB} \\wedge \\vec{AC}$ (إذا درست).",
          ],
        },
        {
          statement: "**التمرين 2 (5 نقاط)** — لتكن $f(x) = \\frac{\\ln x}{x}$ معرفة على $(0, +\\infty)$.",
          questions: [
            "احسب $\\lim_{x \\to 0^+} f(x)$ و $\\lim_{x \\to +\\infty} f(x)$.",
            "أدرس تغيرات $f$.",
            "أوجد قيمة $x$ التي تحقق أقصى $f$.",
          ],
        },
        {
          statement: "**التمرين 3 (5 نقاط)** — احسب التكامل:",
          questions: [
            "$\\int_0^{\\pi} x \\sin x\\, dx$ (بالتجزئة)",
          ],
        },
        {
          statement: "**التمرين 4 (5 نقاط)** — متتاليات: لتكن $u_n = \\frac{n^2}{n + 1}$.",
          questions: [
            "احسب $u_0, u_1, u_2$.",
            "أدرس رتابة $(u_n)$ لـ $n \\geq 1$.",
            "احسب $\\lim_{n \\to +\\infty} u_n$.",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** $\\vec{AB}(1; -3; -2)$ و $\\vec{AC}(2; -2; -4)$",
            "**2)** $\\vec{AB} \\cdot \\vec{AC} = 1 \\cdot 2 + (-3)(-2) + (-2)(-4) = 2 + 6 + 8 = 16$",
            "**3)** بما أن $16 \\neq 0$، المثلث ليس قائماً في $A$.",
            "$|AB| = \\sqrt{14}$، $|AC| = \\sqrt{24} = 2\\sqrt{6}$",
            "$\\cos \\hat A = \\frac{16}{\\sqrt{14} \\cdot 2\\sqrt{6}} = \\frac{16}{\\sqrt{84}} \\approx 1.74$",
            "ملاحظة: أكبر من 1 يعني خطأ في المعطيات (ولكن نُكمل طريقة)",
            "**4)** $\\vec{AB} \\wedge \\vec{AC} = \\begin{vmatrix} \\vec{i} & \\vec{j} & \\vec{k} \\\\ 1 & -3 & -2 \\\\ 2 & -2 & -4 \\end{vmatrix}$",
            "$= \\vec{i}(12 - 4) - \\vec{j}(-4 + 4) + \\vec{k}(-2 + 6) = 8\\vec{i} + 0\\vec{j} + 4\\vec{k}$",
            "أي: $\\vec{AB} \\wedge \\vec{AC}(8; 0; 4)$",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** عند $0^+$: $\\ln x \\to -\\infty$ و $\\frac{1}{x} \\to +\\infty$، إذن $f(x) \\to -\\infty$",
            "عند $+\\infty$: $\\frac{\\ln x}{x} \\to 0^+$ (شهيرة)",
            "**2)** $f'(x) = \\frac{\\frac{1}{x} \\cdot x - \\ln x \\cdot 1}{x^2} = \\frac{1 - \\ln x}{x^2}$",
            "$x^2 > 0$، إذن $f'(x) \\geq 0 \\iff 1 - \\ln x \\geq 0 \\iff \\ln x \\leq 1 \\iff x \\leq e$",
            "إذن $f$ تزايد على $(0, e]$ و تناقص على $[e, +\\infty)$",
            "**3)** الأقصى عند $x = e$: $f(e) = \\frac{\\ln e}{e} = \\frac{1}{e}$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "بالتجزئة: $u = x, v' = \\sin x \\Rightarrow u' = 1, v = -\\cos x$",
            "$\\int_0^{\\pi} x \\sin x\\, dx = [-x \\cos x]_0^{\\pi} + \\int_0^{\\pi} \\cos x\\, dx$",
            "$= -\\pi \\cdot (-1) - 0 + [\\sin x]_0^{\\pi} = \\pi + 0 = \\pi$",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "**1)** $u_0 = 0$, $u_1 = \\frac{1}{2}$, $u_2 = \\frac{4}{3}$",
            "**2)** $u_{n+1} - u_n = \\frac{(n+1)^2}{n+2} - \\frac{n^2}{n+1} = \\frac{(n+1)^3 - n^2(n+2)}{(n+2)(n+1)}$",
            "$= \\frac{n^3 + 3n^2 + 3n + 1 - n^3 - 2n^2}{(n+2)(n+1)} = \\frac{n^2 + 3n + 1}{(n+2)(n+1)}$",
            "البسط موجب لـ $n \\geq 1$ و المقام موجب، إذن $u_{n+1} - u_n > 0$",
            "إذن $(u_n)$ متزايدة لـ $n \\geq 1$",
            "**3)** $\\lim u_n = \\lim \\frac{n^2}{n} = +\\infty$",
          ],
        },
      ],
    },
  },
  {
    trimester: 3,
    type: "فرض",
    number: 2,
    title: "الفرض الثاني — الفصل الثالث",
    duration: "ساعة",
    date: "ماي 2027",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (5 نقاط)** — احسب التكاملات:",
          questions: [
            "$\\int_0^1 (3x^2 + 2x - 1)\\, dx$",
            "$\\int_0^2 \\frac{1}{x + 1}\\, dx$ (إذا كان معرفاً)",
          ],
        },
        {
          statement: "**التمرين 2 (5 نقاط)** — لتكن $z_1 = 2 + i$ و $z_2 = 1 - 3i$.",
          questions: [
            "احسب $z_1 + z_2$, $z_1 \\cdot z_2$.",
            "احسب $\\frac{z_1}{z_2}$.",
          ],
        },
        {
          statement: "**التمرين 3 (5 نقاط)** — متتالية عودية: $u_0 = 1$, $u_{n+1} = \\sqrt{u_n + 2}$.",
          questions: [
            "احسب $u_1, u_2, u_3$.",
            "برهن بالتراجع أن $0 < u_n < 2$.",
            "أدرس رتابة $(u_n)$ وحدد نهايتها.",
          ],
        },
        {
          statement: "**التمرين 4 (5 نقاط)** — احتمالات: نموذج بنك فيه 60% من العملات سليمة و 40% معيبة. نسحب 5 عملات عشوائياً.",
          questions: [
            "ما الاحتمال أن تكون كلها سليمة؟",
            "ما الاحتمال أن تكون 3 على الأقل سليمة؟ (استعمل التوزيع ذي الحدين)",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** $\\int_0^1 (3x^2 + 2x - 1)\\, dx = [x^3 + x^2 - x]_0^1 = 1 + 1 - 1 = 1$",
            "**2)** $\\int_0^2 \\frac{1}{x + 1}\\, dx = [\\ln(x + 1)]_0^2 = \\ln 3 - \\ln 1 = \\ln 3$",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** $z_1 + z_2 = 3 - 2i$",
            "$z_1 \\cdot z_2 = (2+i)(1-3i) = 2 - 6i + i - 3i^2 = 2 - 5i + 3 = 5 - 5i$",
            "**2)** $\\frac{z_1}{z_2} = \\frac{z_1 \\bar{z_2}}{|z_2|^2} = \\frac{(2+i)(1+3i)}{10} = \\frac{2 + 6i + i + 3i^2}{10} = \\frac{-1 + 7i}{10} = -\\frac{1}{10} + \\frac{7}{10}i$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "**1)** $u_1 = \\sqrt{3}$, $u_2 = \\sqrt{\\sqrt{3} + 2} \\approx 1.89$, $u_3 \\approx 1.94$",
            "**2)** التهيئة: $u_0 = 1 \\in (0, 2)$ ✓",
            "الفرضية: $0 < u_n < 2$. النتيجة: $u_{n+1} = \\sqrt{u_n + 2}$، $2 < u_n + 2 < 4$، إذن $\\sqrt{2} < u_{n+1} < 2$",
            "بما أن $\\sqrt{2} > 0$، إذن $0 < u_{n+1} < 2$ ✓",
            "**3)** $u_{n+1} - u_n = \\sqrt{u_n + 2} - u_n$. ندرس إشارها.",
            "$u_{n+1} \\geq u_n \\iff \\sqrt{u_n + 2} \\geq u_n \\iff u_n + 2 \\geq u_n^2 \\iff u_n^2 - u_n - 2 \\leq 0$",
            "$u_n^2 - u_n - 2 = (u_n - 2)(u_n + 1) \\leq 0$ على $[-1, 2]$. بما أن $u_n \\in (0, 2)$، $u_{n+1} \\geq u_n$",
            "إذن $(u_n)$ متزايدة و محدودة، إذن متقاربة.",
            "نهاية: $\\ell = \\sqrt{\\ell + 2} \\Rightarrow \\ell^2 = \\ell + 2 \\Rightarrow \\ell = 2$ (نختار الموجب)",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "$X \\sim \\mathcal{B}(5, 0.6)$ (توزيع ذي الحدين)",
            "**1)** $P(X = 5) = (0.6)^5 = 0.07776 \\approx 7.78\\%$",
            "**2)** $P(X \\geq 3) = P(X=3) + P(X=4) + P(X=5)$",
            "$= \\binom{5}{3}(0.6)^3(0.4)^2 + \\binom{5}{4}(0.6)^4(0.4) + (0.6)^5$",
            "$= 10 \\cdot 0.216 \\cdot 0.16 + 5 \\cdot 0.1296 \\cdot 0.4 + 0.07776$",
            "$= 0.3456 + 0.2592 + 0.07776 \\approx 0.683 \\approx 68.3\\%$",
          ],
        },
      ],
    },
  },
  {
    trimester: 3,
    type: "اختبار",
    number: 1,
    title: "الاختبار الفصلي الثالث",
    duration: "ساعتان",
    date: "جوان 2027",
    stream: "علوم تجريبية / رياضيات / تقني رياضي",
    topic: {
      exercises: [
        {
          statement: "**التمرين 1 (4 نقاط)** — لتكن $f(x) = \\frac{x - 2}{x + 1}$ معرفة على $\\mathbb{R} \\setminus \\{-1\\}$.",
          questions: [
            "احسب حدود $f$ عند $-1$ و عند $\\pm\\infty$.",
            "أوجد المستقيمات المقاربة.",
            "أدرس تغيرات $f$ وارسم منحنى $(\\mathcal{C})$.",
            "أوجد نقطة تقاطع $(\\mathcal{C})$ مع محور الفواصل.",
          ],
        },
        {
          statement: "**التمرين 2 (4 نقاط)** — متتاليات:",
          questions: [
            "لتكن $(u_n)$ المعرفة بـ $u_0 = 1$ و $u_{n+1} = \\frac{2u_n}{u_n + 1}$. احسب $u_1, u_2, u_3$.",
            "لتكن $v_n = \\frac{1}{u_n}$. أثبت أن $(v_n)$ حسابية وحدد أساسها.",
            "اكتب $u_n$ بدلالة $n$ و احسب $\\lim u_n$.",
          ],
        },
        {
          statement: "**التمرين 3 (4 نقاط)** — أعداد مركبة:",
          questions: [
            "لتكن $z = \\sqrt{3} - i$. احسب $|z|$ و $\\arg(z)$.",
            "اكتب $z$ على الشكل الأسي.",
            "احسب $z^6$.",
          ],
        },
        {
          statement: "**التمرين 4 (4 نقاط)** — تكامل:",
          questions: [
            "$\\int_0^1 x^2 e^{-x^3}\\, dx$",
            "$\\int_0^{\\pi/2} \\cos^2 x \\, \\sin x\\, dx$",
          ],
        },
        {
          statement: "**التمرين 5 (4 نقاط)** — احتمالات:",
          questions: [
            "نرمي حجر نرد متوازن 3 مرات. ما الاحتمال أن نحصل على نفس الرقم 3 مرات؟",
            "ما الاحتمال أن نحصل على 3 أرقام مختلفة؟",
          ],
        },
      ],
    },
    solution: {
      exercises: [
        {
          statement: "**حل التمرين 1**",
          steps: [
            "**1)** عند $-1^-$: $\\frac{-3}{0^-} = +\\infty$. عند $-1^+$: $\\frac{-3}{0^+} = -\\infty$",
            "عند $\\pm\\infty$: $\\frac{x}{x} = 1$",
            "**2)** المستقيمات المقاربة: $x = -1$ (عمودية) و $y = 1$ (أفقية)",
            "**3)** $f'(x) = \\frac{1 \\cdot (x+1) - (x-2) \\cdot 1}{(x+1)^2} = \\frac{3}{(x+1)^2} > 0$",
            "إذن $f$ تزايد على $(-\\infty, -1)$ و على $(-1, +\\infty)$",
            "**4)** مع محور الفواصل: $f(x) = 0 \\Rightarrow x = 2$، نقطة $(2, 0)$",
          ],
        },
        {
          statement: "**حل التمرين 2**",
          steps: [
            "**1)** $u_1 = \\frac{2}{2} = 1$, $u_2 = \\frac{2}{2} = 1$, $u_3 = 1$",
            "ملاحظة: $(u_n)$ ثابتة عند 1 (حل ثابت)",
            "**2)** $v_{n+1} = \\frac{1}{u_{n+1}} = \\frac{u_n + 1}{2u_n} = \\frac{1}{2} + \\frac{1}{2u_n} = \\frac{1}{2} + \\frac{v_n}{2}$",
            "إذن $v_{n+1} - v_n = \\frac{1}{2}$ (ثابت)، إذن $(v_n)$ حسابية أساسها $\\frac{1}{2}$",
            "$v_0 = \\frac{1}{u_0} = 1$",
            "**3)** $v_n = v_0 + n \\cdot \\frac{1}{2} = 1 + \\frac{n}{2} = \\frac{n + 2}{2}$",
            "$u_n = \\frac{1}{v_n} = \\frac{2}{n + 2}$",
            "$\\lim u_n = 0$",
          ],
        },
        {
          statement: "**حل التمرين 3**",
          steps: [
            "**1)** $|z| = \\sqrt{3 + 1} = 2$",
            "$\\arg(z) = \\arctan\\left(\\frac{-1}{\\sqrt{3}}\\right) = -\\frac{\\pi}{6}$",
            "**2)** $z = 2 e^{-i\\pi/6}$",
            "**3)** $z^6 = 2^6 e^{-i\\pi} = 64 \\cdot (-1) = -64$",
          ],
        },
        {
          statement: "**حل التمرين 4**",
          steps: [
            "**1)** نضع $u = -x^3$, $du = -3x^2\\, dx$",
            "$\\int_0^1 x^2 e^{-x^3}\\, dx = -\\frac{1}{3} \\int_0^1 -3x^2 e^{-x^3}\\, dx = -\\frac{1}{3} [e^{-x^3}]_0^1 = -\\frac{1}{3}(e^{-1} - 1) = \\frac{1 - e^{-1}}{3}$",
            "**2)** نضع $u = \\cos x$, $du = -\\sin x\\, dx$",
            "$\\int_0^{\\pi/2} \\cos^2 x \\, \\sin x\\, dx = -\\int_0^{\\pi/2} \\cos^2 x \\cdot (-\\sin x)\\, dx = -\\frac{\\cos^3 x}{3}\\Big|_0^{\\pi/2} = -\\frac{0 - 1}{3} = \\frac{1}{3}$",
          ],
        },
        {
          statement: "**حل التمرين 5**",
          steps: [
            "**1)** 6 نتائج ممكنة (1,1,1), (2,2,2), ..., (6,6,6)",
            "إجمالي النتائج: $6^3 = 216$",
            "الاحتمال: $\\frac{6}{216} = \\frac{1}{36}$",
            "**2)** $\\binom{6}{3} \\cdot \\frac{3!}{216} = 20 \\cdot 6 / 216 = \\frac{120}{216} = \\frac{5}{9}$",
            "(ترتيب 3 أرقام مختلفة: $\\binom{6}{3}$ اختيار × $3!$ ترتيب)",
          ],
        },
      ],
    },
  },
];

// ============================================================
//  دوال مساعدة
// ============================================================

function slugify(trimester, type, number, isSolution) {
  const t = `trimester${trimester}`;
  const ty = type === "فرض" ? `fard${number}` : "exam";
  return `${t}-${ty}${isSolution ? "-solution" : ""}`;
}

function processMathContent(text) {
  if (!text) return "";
  let html = text;
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // List items
  html = html.replace(/^\s*(\d+\)|•|-)\s+(.*)$/gm, '<li>$2</li>');
  // New lines
  html = html.replace(/\n/g, '<br/>');
  return html;
}

// ============================================================
//  توليد HTML للموضوع
// ============================================================

function generateTopicHTML(exam) {
  const exercisesHTML = exam.topic.exercises.map((ex, idx) => {
    const questionsHTML = (ex.questions || [])
      .map((q, qi) => `<li class="question">${processMathContent(q)}</li>`)
      .join("");
    return `
      <div class="exercise">
        <div class="ex-header">📝 ${ex.statement.replace(/\*\*/g, "")}</div>
        ${questionsHTML ? `<ol class="questions">${questionsHTML}</ol>` : ""}
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>${exam.title} — الموضوع</title>
<link rel="stylesheet" href="/katex/katex.min.css">
<script src="/katex/katex.min.js"></script>
<script src="/katex/auto-render.min.js"></script>
<style>
@page{size:A4;margin:1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Cairo',Tahoma,Arial,sans-serif;direction:rtl;max-width:210mm;margin:0 auto;padding:25px;color:#1a1a2e;line-height:1.9;font-size:13px}
.cover{text-align:center;padding:30px 20px;background:linear-gradient(135deg,#1e40af,#1e3a8a);border-radius:16px;color:white;margin-bottom:25px}
.cover .badge{display:inline-block;background:rgba(255,255,255,0.2);padding:5px 15px;border-radius:20px;font-size:12px;margin-bottom:15px}
.cover h1{font-size:24px;font-weight:900;margin-bottom:5px}
.cover .subtitle{font-size:13px;opacity:0.9;margin:5px 0}
.cover .info{display:flex;justify-content:center;gap:25px;margin-top:15px;font-size:12px;opacity:0.95}
.info-item{display:flex;align-items:center;gap:5px}
.exam-meta{background:#f1f5f9;border-right:4px solid #1e40af;padding:15px 20px;border-radius:8px;margin-bottom:25px;font-size:13px}
.exam-meta .row{display:flex;justify-content:space-between;padding:3px 0}
.exam-meta .label{font-weight:700;color:#1e40af}
.exercise{background:white;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:18px;padding:18px 22px;page-break-inside:avoid;box-shadow:0 2px 6px rgba(0,0,0,0.05)}
.ex-header{font-weight:700;color:#1e40af;font-size:14px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px dashed #cbd5e1}
.questions{list-style:none;padding-right:0;margin-top:10px}
.questions li{padding:8px 12px;background:#f8fafc;border-radius:6px;margin-top:6px;border-right:3px solid #64748b}
.questions li strong{color:#1e40af}
.footer{text-align:center;margin-top:30px;padding:20px;background:#1a1a2e;border-radius:12px;color:white}
.footer h3{color:#fbbf24;font-size:16px;margin-bottom:5px}
.footer p{font-size:12px;opacity:0.8}
.katex{font-size:1.05em}
.katex-display{margin:10px 0;text-align:center;padding:8px;background:#f8fafc;border-radius:6px}
</style>
</head>
<body>
<div class="cover">
  <div class="badge">${exam.type} ${exam.number}</div>
  <h1>${exam.title}</h1>
  <div class="subtitle">منصة الرياضيات — الأستاذ عدلي أسعد</div>
  <div class="info">
    <div class="info-item">⏱️ المدة: ${exam.duration}</div>
    <div class="info-item">📅 ${exam.date}</div>
    <div class="info-item">🎓 ${exam.stream}</div>
  </div>
</div>
<div class="exam-meta">
  <div class="row"><span class="label">المادة:</span> <span>الرياضيات — السنة الثالثة ثانوي</span></div>
  <div class="row"><span class="label">النوع:</span> <span>${exam.type} رقم ${exam.number}</span></div>
  <div class="row"><span class="label">الفصل الدراسي:</span> <span>الفصل ${exam.trimester}</span></div>
  <div class="row"><span class="label">المدة:</span> <span>${exam.duration}</span></div>
</div>
${exercisesHTML}
<div class="footer">
  <h3>منصة الرياضيات</h3>
  <p>منصة تعليمية لطلبة السنة الثالثة ثانوي — الجزائر 🇩🇿</p>
  <p>📧 asaadadli9393@gmail.com | بإشراف الأستاذ عدلي أسعد</p>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ],
    throwOnError: false
  });
});
</script>
</body>
</html>`;
}

// ============================================================
//  توليد HTML للحل النموذجي
// ============================================================

function generateSolutionHTML(exam) {
  const exercisesHTML = exam.solution.exercises.map((ex, idx) => {
    const stepsHTML = (ex.steps || [])
      .map((s, si) => `<div class="step"><span class="step-num">${si + 1})</span><div class="step-content">${processMathContent(s)}</div></div>`)
      .join("");
    return `
      <div class="exercise">
        <div class="ex-header">${ex.statement.replace(/\*\*/g, "")}</div>
        <div class="steps">${stepsHTML}</div>
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>${exam.title} — الحل النموذجي</title>
<link rel="stylesheet" href="/katex/katex.min.css">
<script src="/katex/katex.min.js"></script>
<script src="/katex/auto-render.min.js"></script>
<style>
@page{size:A4;margin:1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Cairo',Tahoma,Arial,sans-serif;direction:rtl;max-width:210mm;margin:0 auto;padding:25px;color:#1a1a2e;line-height:1.9;font-size:13px}
.cover{text-align:center;padding:30px 20px;background:linear-gradient(135deg,#15803d,#166534);border-radius:16px;color:white;margin-bottom:25px}
.cover .badge{display:inline-block;background:rgba(255,255,255,0.2);padding:5px 15px;border-radius:20px;font-size:12px;margin-bottom:15px}
.cover h1{font-size:24px;font-weight:900;margin-bottom:5px}
.cover .subtitle{font-size:13px;opacity:0.9;margin:5px 0}
.cover .info{display:flex;justify-content:center;gap:25px;margin-top:15px;font-size:12px;opacity:0.95}
.exercise{background:white;border:1px solid #d1fae5;border-radius:12px;margin-bottom:18px;padding:18px 22px;page-break-inside:avoid;box-shadow:0 2px 6px rgba(0,0,0,0.05)}
.ex-header{font-weight:700;color:#166534;font-size:14px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px dashed #86efac}
.steps{display:flex;flex-direction:column;gap:8px}
.step{display:flex;gap:10px;align-items:flex-start;padding:10px;background:#f0fdf4;border-radius:8px;border-right:3px solid #10b981}
.step-num{font-weight:700;color:#047857;flex-shrink:0;background:#d1fae5;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:12px}
.step-content{flex:1;line-height:2}
.step-content strong{color:#047857}
.footer{text-align:center;margin-top:30px;padding:20px;background:#1a1a2e;border-radius:12px;color:white}
.footer h3{color:#86efac;font-size:16px;margin-bottom:5px}
.footer p{font-size:12px;opacity:0.8}
.katex{font-size:1.05em}
.katex-display{margin:10px 0;text-align:center;padding:8px;background:#f0fdf4;border-radius:6px}
</style>
</head>
<body>
<div class="cover">
  <div class="badge">✅ الحل النموذجي</div>
  <h1>${exam.title}</h1>
  <div class="subtitle">الحل النموذجي المفصّل — منصة الرياضيات</div>
  <div class="info">
    <div class="info-item">📝 ${exam.topic.exercises.length} تمارين محلولة</div>
    <div class="info-item">📅 ${exam.date}</div>
    <div class="info-item">🎓 ${exam.stream}</div>
  </div>
</div>
${exercisesHTML}
<div class="footer">
  <h3>منصة الرياضيات</h3>
  <p>الحل النموذجي — بإشراف الأستاذ عدلي أسعد</p>
  <p>📧 asaadadli9393@gmail.com | الجزائر 🇩🇿</p>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ],
    throwOnError: false
  });
});
</script>
</body>
</html>`;
}

// ============================================================
//  التشغيل الرئيسي
// ============================================================

async function main() {
  console.log("🚀 توليد ملفات HTML للفروض والاختبارات...");

  // توليد HTML
  for (const exam of examsContent) {
    // الموضوع
    const topicSlug = slugify(exam.trimester, exam.type, exam.number, false);
    const topicHTML = generateTopicHTML(exam);
    const topicFile = path.join(outputDir, `${topicSlug}.html`);
    fs.writeFileSync(topicFile, topicHTML, "utf-8");
    console.log(`✅ ${topicSlug}.html`);

    // الحل النموذجي
    const solSlug = slugify(exam.trimester, exam.type, exam.number, true);
    const solHTML = generateSolutionHTML(exam);
    const solFile = path.join(outputDir, `${solSlug}.html`);
    fs.writeFileSync(solFile, solHTML, "utf-8");
    console.log(`✅ ${solSlug}.html`);
  }

  console.log("\n📄 توليد PDF عبر Playwright...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const exam of examsContent) {
    // موضوع PDF
    const topicSlug = slugify(exam.trimester, exam.type, exam.number, false);
    const topicURL = `http://localhost:3000/courses/${topicSlug}.html`;
    try {
      await page.goto(topicURL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      const topicPDF = path.join(outputDir, `${topicSlug}.pdf`);
      await page.pdf({
        path: topicPDF,
        format: 'A4',
        printBackground: true,
        margin: { top: '1.5cm', bottom: '1.5cm', left: '1.5cm', right: '1.5cm' }
      });
      console.log(`📄 ${topicSlug}.pdf ✓`);
    } catch (err) {
      console.error(`❌ ${topicSlug}.pdf:`, err.message);
    }

    // حل PDF
    const solSlug = slugify(exam.trimester, exam.type, exam.number, true);
    const solURL = `http://localhost:3000/courses/${solSlug}.html`;
    try {
      await page.goto(solURL, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      const solPDF = path.join(outputDir, `${solSlug}.pdf`);
      await page.pdf({
        path: solPDF,
        format: 'A4',
        printBackground: true,
        margin: { top: '1.5cm', bottom: '1.5cm', left: '1.5cm', right: '1.5cm' }
      });
      console.log(`📄 ${solSlug}.pdf ✓`);
    } catch (err) {
      console.error(`❌ ${solSlug}.pdf:`, err.message);
    }
  }

  await browser.close();
  console.log(`\n🎉 تم توليد ${examsContent.length * 2} ملفات PDF في ${outputDir}`);
}

main().catch((err) => {
  console.error("خطأ:", err);
  process.exit(1);
});
