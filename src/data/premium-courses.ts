// ============================================================
//  الدورات المميزة (Premium) — منصة الرياضيات | الأستاذ عدلي أسعد
//  5 دورات شاملة مع سلاسل تمارين وحلول نموذجية مفصلة
// ============================================================

import type { Course } from "@/data/courses";

// ============================================================
//  الدورة 1: المتتاليات العددية — 6 وحدات + 18 تمرين
// ============================================================
const courseSuites: Course = {
  id: "course-suites-2027",
  slug: "suites-2027",
  title: "المتتاليات العددية",
  subtitle: "من التعريف إلى المتتاليات المتجاورة وحساب النهايات",
  description: "دورة شاملة في المتتاليات العددية: تعريف، حدود، علاقات تكرارية، رتابة، متتاليات حسابية وهندسية، نهايات، متتاليات متجاورة.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 180,
  modulesCount: 6,
  coverColor: "#2D6A4F",
  icon: "TrendingUp",
  tags: ["متتاليات", "نهايات", "حسابية", "هندسية"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/suite2027.pdf",
  modules: [
    {
      id: "suites-1", order: 1,
      title: "تعريف المتتالية وكتاباتها",
      durationMin: 30,
      description: "تعريف، كتابة صريحة وتكرارية، حساب الحدود",
      content: "## تعريف المتتالية\n\nالمتتالية العددية دالة معرفة على $\\mathbb{N}$ (أو جزء منه) قيمها في $\\mathbb{R}$.\n\n### الكتابة الصريحة: $u_n = f(n)$\n### الكتابة التكرارية: $u_{n+1} = g(u_n)$ مع $u_0$ معلوم",
      keyPoints: ["متتالية = دالة على N", "كتابة صريحة vs تكرارية", "حساب الحدود الأولى"],
      exercises: [
        {
          statement: "**التمرين 1** — لتكن $(u_n)$ المعرفة بـ $u_n = 4n - 1$. احسب $u_0, u_1, u_2, u_{10}$ ثم احسب $u_{n+1} - u_n$ واستنتج طبيعة المتتالية.",
          hint: "التعويض المباشر ثم حساب الفرق",
          solution: "$u_0 = -1, u_1 = 3, u_2 = 7, u_{10} = 39$\n\n$u_{n+1} - u_n = 4(n+1) - 1 - (4n - 1) = 4n + 4 - 1 - 4n + 1 = 4$\n\nالفرق ثابت $= 4$، إذن $(u_n)$ **متتالية حسابية** أساسها $r = 4$.",
        },
        {
          statement: "**التمرين 2** — لتكن $(u_n)$ المعرفة بـ $u_0 = 2$ و $u_{n+1} = 3u_n + 1$. احسب $u_1, u_2, u_3$.",
          hint: "التعويض المتتالي في العلاقة التكرارية",
          solution: "$u_1 = 3(2) + 1 = 7$\n$u_2 = 3(7) + 1 = 22$\n$u_3 = 3(22) + 1 = 67$\n\nالقيم: $2, 7, 22, 67, \\ldots$ — متتالية متزايدة بسرعة.",
        },
        {
          statement: "**التمرين 3** — برهن بالتراجع أن $u_n > 0$ لكل $n \\in \\mathbb{N}$ حيث $u_0 = 1$ و $u_{n+1} = \\sqrt{u_n + 2}$.",
          hint: "برهنة بالتراجع على n",
          solution: "**التهيئة:** $u_0 = 1 > 0$ ✓\n\n**الفرضية:** نفرض $u_n > 0$ لـ $n$ معين.\n\n**النتيجة:** $u_{n+1} = \\sqrt{u_n + 2}$. بما أن $u_n > 0$، فإن $u_n + 2 > 2 > 0$، إذن $\\sqrt{u_n + 2} > 0$، أي $u_{n+1} > 0$ ✓\n\n**الخلاصة:** بالتراجع، $u_n > 0$ لكل $n \\in \\mathbb{N}$.",
        },
      ],
    },
    {
      id: "suites-2", order: 2,
      title: "المتتاليات الحسابية",
      durationMin: 30,
      description: "تعريف، حد عام، مجموع حدود",
      content: "## المتتالية الحسابية\n\n### التعريف: $u_{n+1} - u_n = r$ (ثابت)\n### الحد العام: $u_n = u_0 + nr$\n### المجموع: $S_n = \\frac{(n+1)(u_0 + u_n)}{2}$\n### خاصية: $u_n = \\frac{u_{n-1} + u_{n+1}}{2}$",
      keyPoints: ["r ثابت", "u_n = u_0 + nr", "S_n = (n+1)(u_0+u_n)/2"],
      exercises: [
        {
          statement: "**التمرين 4 (بكالوريا 2010)** — متتالية حسابية أساسها $r = -3$ و $u_5 = 14$.\n1. احسب $u_0$.\n2. احسب $S_{10}$ (مجموع أول 11 حد).",
          hint: "استعمل u_n = u_0 + nr ثم S_n",
          solution: "**1)** $u_5 = u_0 + 5r \\implies 14 = u_0 + 5(-3) \\implies u_0 = 14 + 15 = 29$\n\n**2)** $u_{10} = 29 + 10(-3) = -1$\n\n$S_{10} = \\frac{11 \\times (29 + (-1))}{2} = \\frac{11 \\times 28}{2} = 154$",
        },
        {
          statement: "**التمرين 5** — $(u_n)$ متتالية حسابية حيث $u_3 = 7$ و $u_7 = 19$. احسب الأساس $r$ و $u_0$ ثم اكتب الحد العام.",
          hint: "حل نظام معادلتين: u_3 = u_0 + 3r و u_7 = u_0 + 7r",
          solution: "$u_3 = u_0 + 3r = 7$\n$u_7 = u_0 + 7r = 19$\n\nبالطرح: $4r = 12 \\implies r = 3$\n\n$u_0 = 7 - 3(3) = -2$\n\nالحد العام: $\\boxed{u_n = -2 + 3n = 3n - 2}$",
        },
        {
          statement: "**التمرين 6** — احسب مجموع الأعداد الصحيحة من 1 إلى 100: $S = 1 + 2 + 3 + \\cdots + 100$.",
          hint: "متتالية حسابية: u_0 = 1, r = 1, u_{99} = 100",
          solution: "هذه متتالية حسابية $u_n = 1 + n$، $n$ من 0 إلى 99.\n\n$S = \\frac{100 \\times (1 + 100)}{2} = \\frac{100 \\times 101}{2} = 5050$",
        },
      ],
    },
    {
      id: "suites-3", order: 3,
      title: "المتتاليات الهندسية",
      durationMin: 30,
      description: "تعريف، حد عام، مجموع حدود",
      content: "## المتتالية الهندسية\n\n### التعريف: $\\frac{u_{n+1}}{u_n} = q$ (ثابت)\n### الحد العام: $u_n = u_0 \\times q^n$\n### المجموع ($q \\neq 1$): $S_n = u_0 \\frac{1 - q^{n+1}}{1 - q}$\n### خاصية: $u_n^2 = u_{n-1} \\times u_{n+1}$",
      keyPoints: ["q ثابت", "u_n = u_0 * q^n", "S_n = u_0(1-q^(n+1))/(1-q)"],
      exercises: [
        {
          statement: "**التمرين 7** — متتالية هندسية $u_0 = 3$ و $q = \\frac{1}{2}$.\n1. احسب $u_5$.\n2. احسب $S_4$.\n3. احسب $\\lim_{n \\to +\\infty} S_n$.",
          hint: "استعمل الصيغتين u_n = u_0*q^n و S_n",
          solution: "**1)** $u_5 = 3 \\times \\left(\\frac{1}{2}\\right)^5 = 3 \\times \\frac{1}{32} = \\frac{3}{32}$\n\n**2)** $S_4 = 3 \\times \\frac{1 - \\left(\\frac{1}{2}\\right)^5}{1 - \\frac{1}{2}} = 3 \\times \\frac{1 - \\frac{1}{32}}{\\frac{1}{2}} = 3 \\times \\frac{\\frac{31}{32}}{\\frac{1}{2}} = 3 \\times \\frac{31}{16} = \\frac{93}{16}$\n\n**3)** بما أن $|q| = \\frac{1}{2} < 1$، فإن $q^{n+1} \\to 0$:\n$\\lim S_n = \\frac{u_0}{1 - q} = \\frac{3}{1 - \\frac{1}{2}} = 6$",
        },
        {
          statement: "**التمرين 8 (بكالوريا 2013)** — $(u_n)$ متتالية هندسية حيث $u_1 = 6$ و $u_4 = 162$.\n1. احسب الأساس $q$ و $u_0$.\n2. احسب $S_5$.",
          hint: "u_4/u_1 = q^3",
          solution: "**1)** $\\frac{u_4}{u_1} = q^3 \\implies \\frac{162}{6} = q^3 \\implies q^3 = 27 \\implies q = 3$\n\n$u_1 = u_0 \\times q \\implies 6 = u_0 \\times 3 \\implies u_0 = 2$\n\n**2)** $S_5 = 2 \\times \\frac{1 - 3^6}{1 - 3} = 2 \\times \\frac{1 - 729}{-2} = 728$",
        },
      ],
    },
    {
      id: "suites-4", order: 4,
      title: "المتتاليات الحسابية-الهندسية",
      durationMin: 30,
      description: "u_{n+1} = a*u_n + b — تحويل لـ v_n = u_n - α",
      content: "## المتتالية الحسابية-الهندسية\n\n### الشكل: $u_{n+1} = a \\cdot u_n + b$ ($a \\neq 1$)\n### النقطة الثابتة: $\\alpha = \\frac{b}{1-a}$\n### التحويل: $v_n = u_n - \\alpha$ → هندسية بأساس $a$\n### النتيجة: $u_n = \\alpha + (u_0 - \\alpha) \\cdot a^n$",
      keyPoints: ["α = b/(1-a)", "v_n = u_n - α هندسية", "u_n = α + (u_0-α)*a^n"],
      exercises: [
        {
          statement: "**التمرين 9 (بكالوريا 2008)** — $(u_n)$ معرفة بـ $u_0 = 5$ و $u_{n+1} = \\frac{2}{3}u_n + 2$.\n1. احسب $u_1, u_2, u_3$.\n2. لتكن $v_n = u_n - 6$. برهن أن $(v_n)$ هندسية وحدد أساسها.\n3. اكتب $u_n$ بدلالة $n$ واحسب $\\lim u_n$.",
          hint: "α = b/(1-a) = 2/(1-2/3) = 6",
          solution: "**1)** $u_1 = \\frac{2}{3}(5)+2 = \\frac{16}{3} \\approx 5.33$\n$u_2 = \\frac{2}{3}\\cdot\\frac{16}{3}+2 = \\frac{50}{9} \\approx 5.56$\n$u_3 \\approx 5.70$\n\n**2)** $v_{n+1} = u_{n+1} - 6 = \\frac{2}{3}u_n + 2 - 6 = \\frac{2}{3}(u_n - 6) = \\frac{2}{3}v_n$\nإذن $(v_n)$ هندسية أساسها $q = \\frac{2}{3}$ و $v_0 = 5 - 6 = -1$.\n\n**3)** $v_n = -\\left(\\frac{2}{3}\\right)^n$، إذن $u_n = 6 - \\left(\\frac{2}{3}\\right)^n$\n\nبما أن $|\\frac{2}{3}| < 1$: $\\lim u_n = 6$",
          plot: {
            title: "تقارب المتتالية (u_n) نحو α = 6",
            functions: [],
            sequence: { values: [5, 5.33, 5.56, 5.70, 5.80, 5.87, 5.91, 5.94, 5.96, 5.97, 5.98, 5.99, 6], color: "#A4133C", connect: true, fixedPoint: 6, showValues: false, label: "u_n" },
            xRange: [0, 12], yRange: [4, 7], height: 320,
          },
        },
        {
          statement: "**التمرين 10** — $(u_n)$ معرفة بـ $u_0 = 1$ و $u_{n+1} = \\frac{1}{2}u_n + \\frac{1}{3}$.\n1. أوجد النقطة الثابتة $\\alpha$.\n2. برهن أن $v_n = u_n - \\alpha$ هندسية.\n3. اكتب $u_n$ بدلالة $n$.",
          hint: "α = b/(1-a) = (1/3)/(1-1/2) = 2/3",
          solution: "**1)** $\\alpha = \\frac{\\frac{1}{3}}{1 - \\frac{1}{2}} = \\frac{\\frac{1}{3}}{\\frac{1}{2}} = \\frac{2}{3}$\n\n**2)** $v_{n+1} = u_{n+1} - \\frac{2}{3} = \\frac{1}{2}u_n + \\frac{1}{3} - \\frac{2}{3} = \\frac{1}{2}\\left(u_n - \\frac{2}{3}\\right) = \\frac{1}{2}v_n$\nإذن $(v_n)$ هندسية أساسها $q = \\frac{1}{2}$ و $v_0 = 1 - \\frac{2}{3} = \\frac{1}{3}$.\n\n**3)** $v_n = \\frac{1}{3}\\left(\\frac{1}{2}\\right)^n$, $u_n = \\frac{2}{3} + \\frac{1}{3}\\left(\\frac{1}{2}\\right)^n$\n\n$\\lim u_n = \\frac{2}{3}$",
          plot: {
            title: "تقارب المتتالية (u_n) نحو α = 2/3",
            functions: [],
            sequence: { values: [1, 0.83, 0.75, 0.71, 0.69, 0.68, 0.675, 0.67, 0.668, 0.667, 0.667], color: "#A4133C", connect: true, fixedPoint: 0.667, showValues: false, label: "u_n" },
            xRange: [0, 10], yRange: [0.5, 1.1], height: 320,
          },
        },
      ],
    },
    {
      id: "suites-5", order: 5,
      title: "رتابة المتتاليات",
      durationMin: 30,
      description: "دراسة رتابة بـ u_{n+1} - u_n أو بطريقة الدالة المساعدة",
      content: "## رتابة المتتالية\n\n### الطريقة 1: $u_{n+1} - u_n$\n- $> 0$: متزايدة\n- $< 0$: متناقصة\n\n### الطريقة 2: دراسة دالة $f$ حيث $u_{n+1} = f(u_n)$\n- إذا $f$ متزايدة و $u_1 \\geq u_0$: $(u_n)$ متزايدة\n- إذا $f$ متزايدة و $u_1 \\leq u_0$: $(u_n)$ متناقصة",
      keyPoints: ["u_{n+1} - u_n", "طريقة الدالة f", "التقارب بالتراجع"],
      exercises: [
        {
          statement: "**التمرين 11** — $(u_n)$ معرفة بـ $u_0 = 2$ و $u_{n+1} = \\frac{u_n}{2} + 1$. ادرس رتابة $(u_n)$.",
          hint: "احسب u_{n+1} - u_n = (u_n + 2)/2 - u_n",
          solution: "$u_{n+1} - u_n = \\frac{u_n}{2} + 1 - u_n = 1 - \\frac{u_n}{2} = \\frac{2 - u_n}{2}$\n\nبما أن $(u_n)$ تتقارب نحو $\\alpha = 2$ (النقطة الثابتة) و $u_0 = 2$:\n- $u_0 = 2 \\implies u_1 = 2$, $u_{n+1} = u_n$ دائماً\n- إذن $(u_n)$ **ثابتة** ($u_n = 2$ لكل $n$)\n\nلو $u_0 < 2$ (مثلاً $u_0 = 0$): $u_1 = 1 > u_0$ → متزايدة\nلو $u_0 > 2$ (مثلاً $u_0 = 4$): $u_1 = 3 < u_0$ → متناقصة",
        },
        {
          statement: "**التمرين 12 (بكالوريا 2016)** — $(u_n)$ معرفة بـ $u_0 = 0$ و $u_{n+1} = \\sqrt{2u_n + 8}$.\n1. برهن بالتراجع أن $0 \\leq u_n \\leq 4$.\n2. برهن أن $(u_n)$ متزايدة.\n3. استنتج تقاربها وحد نهايتها.",
          hint: "u_{n+1}^2 - u_n^2 = -(u_n-4)(u_n+2)",
          solution: "**1) التراجع:** $u_0 = 0 \\in [0,4]$ ✓. نفرض $0 \\leq u_n \\leq 4$:\n$u_{n+1} = \\sqrt{2u_n + 8}$, من $0 \\leq u_n \\leq 4$: $8 \\leq 2u_n+8 \\leq 16$, إذن $\\sqrt{8} \\leq u_{n+1} \\leq 4$, وبصفة خاصة $0 \\leq u_{n+1} \\leq 4$ ✓\n\n**2) الرتابة:** $u_{n+1}^2 - u_n^2 = (2u_n+8) - u_n^2 = -(u_n^2 - 2u_n - 8) = -(u_n-4)(u_n+2)$\nعلى $[0,4]$: $u_n - 4 \\leq 0$ و $u_n + 2 > 0$, إذن $-(u_n-4)(u_n+2) \\geq 0$, أي $u_{n+1} \\geq u_n$ → **متزايدة** ✓\n\n**3) التقارب:** متزايدة + مقيدة ← متقاربة. لنهايتها $\\ell$: $\\ell^2 = 2\\ell + 8 \\implies \\ell = 4$ أو $\\ell = -2$ (مرفوض). $\\boxed{\\lim u_n = 4}$",
          plot: {
            title: "تقارب u_n نحو α = 4",
            functions: [{ expr: "Math.sqrt(2*x+8)", color: "#3b82f6", label: "f(x)=√(2x+8)" }, { expr: "x", color: "#9ca3af", label: "y=x", dashed: true }],
            sequence: { values: [0, 2.83, 3.70, 3.92, 3.98, 3.995, 4, 4], color: "#A4133C", connect: true, fixedPoint: 4, showValues: true, label: "u_n" },
            xRange: [-0.5, 5], yRange: [-0.5, 5], height: 360,
          },
        },
      ],
    },
    {
      id: "suites-6", order: 6,
      title: "النهايات والمتتاليات المتجاورة",
      durationMin: 30,
      description: "نهايات مرجعية، متتاليات متجاورة، نظرية الحجر",
      content: "## النهايات المرجعية\n\n- $\\lim n = +\\infty$\n- $\\lim \\frac{1}{n} = 0$\n- $\\lim \\frac{\\ln n}{n} = 0$\n- $\\lim \\frac{e^n}{n} = +\\infty$\n- $\\lim \\sqrt{n} = +\\infty$\n\n## المتتاليات المتجاورة\n\n$(u_n)$ و $(v_n)$ متجاورتان إذن $\\lim (u_n - v_n) = 0$\n\n### نظرية الحجر\nإذا تقاربت $(u_n)$ نحو $\\ell$ و $(v_n)$ مجاورة لها، فإن $(v_n)$ تتقارب أيضاً نحو $\\ell$.",
      keyPoints: ["نهايات مرجعية", "تجاور = lim(u_n-v_n)=0", "نظرية الحجر"],
      exercises: [
        {
          statement: "**التمرين 13** — احسب النهايات التالية:\n1. $\\lim_{n \\to +\\infty} \\frac{3n^2 - 5n + 1}{2n^2 + n - 3}$\n2. $\\lim_{n \\to +\\infty} \\frac{n^3 + n}{n^2 - 1}$\n3. $\\lim_{n \\to +\\infty} \\frac{e^n}{n^2 + 1}$\n4. $\\lim_{n \\to +\\infty} \\frac{\\ln n}{n}$",
          hint: "بقيادة الحد الأعلى لكل متتالية",
          solution: "**1)** $\\lim \\frac{3n^2}{2n^2} = \\frac{3}{2}$ (نفس الدرجة)\n\n**2)** $\\lim \\frac{n^3}{n^2} = \\lim n = +\\infty$ (الدرجة 3 > الدرجة 2)\n\n**3)** $\\lim \\frac{e^n}{n^2} = +\\infty$ (الأسية تتفوق على كثيرة الحدود)\n\n**4)** $\\lim \\frac{\\ln n}{n} = 0$ (اللوغاريتم يتباطأ عن كثيرة الحدود)",
        },
        {
          statement: "**التمرين 14 (بكالوريا 2017)** — لتكن $(u_n)$ متتالية حيث $u_n = \\frac{n+1}{n}$ و $(v_n) = u_n - \\frac{n^2+1}{n^2}$.\n1. برهن أن $(u_n)$ و $(v_n)$ متجاورتان.\n2. احسب $\\lim u_n$ ثم استنتج $\\lim v_n$.",
          hint: "احسب lim(u_n - v_n) ثم استعمل نظرية الحجر",
          solution: "$u_n - v_n = \\frac{n+1}{n} - \\frac{n^2+1}{n^2} = \\frac{n(n+1) - (n^2+1)}{n^2} = \\frac{n^2+n-n^2-1}{n^2} = \\frac{n-1}{n^2}$\n\n$\\lim (u_n - v_n) = \\lim \\frac{n-1}{n^2} = 0$ → **متجاورتان** ✓\n\n$\\lim u_n = \\lim \\frac{n+1}{n} = 1$, إذن بنظرية الحجر: $\\lim v_n = 1$",
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة 2: الدالة الأسية — 5 وحدات + 15 تمرين
// ============================================================
const courseExp: Course = {
  id: "course-exp-2027",
  slug: "exp-2027",
  title: "الدالة الأسية",
  subtitle: "من التعريف إلى دراسة الدوال الأُسية الشاملة",
  description: "دورة شاملة في الدالة الأسية: تعريف، خاصيات، نهايات، اشتقاق، دراسة دوال، معادلات ومتراجحات.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 150,
  modulesCount: 5,
  coverColor: "#A4133C",
  icon: "TrendingUp",
  tags: ["أسية", "e^x", "اشتقاق"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/exp2027.pdf",
  modules: [
    {
      id: "exp-1", order: 1,
      title: "تعريف الدالة الأسية وخصائصها",
      durationMin: 30,
      description: "تعريف e^x، الخاصيات الجبرية",
      content: "## الدالة الأسية $e^x$\n\n### التعريف\n$\\exp(x) = e^x$ هي الدالة العكسية لـ $\\ln(x)$ على $\\mathbb{R}$.\n\n### الخاصيات الجبرية\n- $e^{a+b} = e^a \\cdot e^b$\n- $e^{a-b} = \\frac{e^a}{e^b}$\n- $(e^a)^n = e^{na}$\n- $e^0 = 1$, $e^1 = e \\approx 2{,}718$",
      keyPoints: ["e^x عكس ln", "e^{a+b}=e^a·e^b", "e ≈ 2.718"],
      exercises: [
        {
          statement: "**التمرين 1** — بسّط التعابير التالية:\n1. $\\frac{e^{2x+1}}{e^{x-3}}$\n2. $(e^{3x})^2 \\cdot e^{-x}$\n3. $e^{x+1} \\cdot e^{2x-3} \\cdot e^{-x+2}$",
          hint: "استعمل e^(a+b) = e^a·e^b و e^(a-b) = e^a/e^b",
          solution: "**1)** $\\frac{e^{2x+1}}{e^{x-3}} = e^{(2x+1)-(x-3)} = e^{x+4}$\n\n**2)** $(e^{3x})^2 \\cdot e^{-x} = e^{6x} \\cdot e^{-x} = e^{5x}$\n\n**3)** $e^{x+1} \\cdot e^{2x-3} \\cdot e^{-x+2} = e^{(x+1)+(2x-3)+(-x+2)} = e^{2x}$",
        },
        {
          statement: "**التمرين 2** — حل في $\\mathbb{R}$: $e^{3x-1} = e^{x+5}$",
          hint: "e^a = e^b ⟺ a = b",
          solution: "$e^{3x-1} = e^{x+5} \\iff 3x - 1 = x + 5 \\iff 2x = 6 \\iff x = 3$\n\nالتحقق: $e^{3(3)-1} = e^8$ و $e^{3+5} = e^8$ ✓\n\n$\\boxed{S = \\{3\\}}$",
        },
        {
          statement: "**التمرين 3** — حل في $\\mathbb{R}$: $e^{2x} - 5e^x + 6 = 0$",
          hint: "ضع X = e^x، حل المعادلة التربيعية في X",
          solution: "نضع $X = e^x > 0$:\n$X^2 - 5X + 6 = 0$\n$\\Delta = 25 - 24 = 1$\n$X = \\frac{5 \\pm 1}{2}$ → $X_1 = 3$ أو $X_2 = 2$\n\n- $e^x = 3 \\implies x = \\ln 3$\n- $e^x = 2 \\implies x = \\ln 2$\n\n$\\boxed{S = \\{\\ln 2, \\ln 3\\}}$",
        },
      ],
    },
    {
      id: "exp-2", order: 2,
      title: "النهايات المرجعية للدالة الأسية",
      durationMin: 25,
      description: "نهايات e^x عند ±∞، مقارنة مع كثيرة الحدود",
      content: "## النهايات المرجعية\n\n$$\\lim_{x \\to +\\infty} e^x = +\\infty \\quad ; \\quad \\lim_{x \\to -\\infty} e^x = 0$$\n$$\\lim_{x \\to +\\infty} \\frac{e^x}{x} = +\\infty \\quad ; \\quad \\lim_{x \\to -\\infty} x e^x = 0$$\n$$\\lim_{x \\to +\\infty} \\frac{e^x}{x^n} = +\\infty \\quad (\\forall n \\in \\mathbb{N})$$\n\n**قاعدة**: الأسية تغلب كثيرة الحدود عند $+\\infty$.",
      keyPoints: ["e^x → +∞ عند +∞", "e^x → 0 عند -∞", "أسية تغلب كثيرة الحدود"],
      exercises: [
        {
          statement: "**التمرين 4** — احسب النهايات:\n1. $\\lim_{x \\to +\\infty} \\frac{e^{2x}}{x^3}$\n2. $\\lim_{x \\to -\\infty} (x + 1) e^{2x}$\n3. $\\lim_{x \\to +\\infty} \\frac{x^2 - 1}{e^x + 1}$\n4. $\\lim_{x \\to 0} \\frac{e^x - 1}{x}$",
          hint: "الأسية تغلب كثيرة الحدود عند +∞؛ عند -∞: e^(سالب) → 0",
          solution: "**1)** $\\lim \\frac{e^{2x}}{x^3} = +\\infty$ (الأسية تغلب كثيرة الحدود)\n\n**2)** $\\lim_{x \\to -\\infty} (x+1) e^{2x} = (-\\infty) \\times 0^+ = 0$ ($e^{2x} \\to 0$ أسرع من $|x+1| \\to \\infty$)\n\n**3)** $\\lim \\frac{x^2}{e^x} = 0$ (الأسية تغلب كثيرة الحدود)\n\n**4)** $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$ (نهاية مرجعية: مشتقة $e^x$ عند 0)",
        },
        {
          statement: "**التمرين 5** — ادرس النهاية: $\\lim_{x \\to +\\infty} e^x - x^2$ و $\\lim_{x \\to -\\infty} e^{-x} + x$.",
          hint: "عند +∞: e^x تهيمن. عند -∞: e^{-x} → +∞",
          solution: "**1)** $\\lim (e^x - x^2) = +\\infty$ لأن $e^x$ تتفوق على $x^2$.\n\n**2)** $\\lim_{x \\to -\\infty} e^{-x} + x = +\\infty + (-\\infty)$ غير معيّن.\nنعالج: $e^{-x} \\to +\\infty$ أسرع من $|x| \\to +\\infty$.\nإذن $\\lim (e^{-x} + x) = +\\infty$.",
        },
      ],
    },
    {
      id: "exp-3", order: 3,
      title: "اشتقاق الدالة الأسية ودراسة الدوال",
      durationMin: 35,
      description: "مشتقة e^x، دوال مركبة، دراسة شاملة",
      content: "## اشتقاق الدالة الأسية\n\n### المشتقة الأولى: $(e^x)' = e^x$\n### دوال مركبة:\n- $(e^{ax+b})' = a \\cdot e^{ax+b}$\n- $(e^{u(x)})' = u'(x) \\cdot e^{u(x)}$\n- $(e^{-x})' = -e^{-x}$\n\n### جداء: $(f \\cdot e^x)' = f' \\cdot e^x + f \\cdot e^x = (f' + f) e^x$",
      keyPoints: ["(e^x)' = e^x", "(e^u)' = u'·e^u", "(f·e^x)' = (f'+f)·e^x"],
      exercises: [
        {
          statement: "**التمرين 6** — اشطب الدوال التالية:\n1. $f(x) = e^{3x-1}$\n2. $g(x) = x \\cdot e^x$\n3. $h(x) = \\frac{e^x}{x}$\n4. $k(x) = e^{x^2}$",
          hint: "(e^u)' = u'·e^u، (uv)' = u'v + uv'",
          solution: "**1)** $f'(x) = 3 e^{3x-1}$\n\n**2)** $g'(x) = 1 \\cdot e^x + x \\cdot e^x = (x+1) e^x$\n\n**3)** $h'(x) = \\frac{e^x \\cdot x - e^x}{x^2} = \\frac{(x-1) e^x}{x^2}$\n\n**4)** $k'(x) = 2x \\cdot e^{x^2}$",
        },
        {
          statement: "**التمرين 7** — ادرس تغيرات الدالة $f(x) = (x-2)e^x$ على $\\mathbb{R}$.",
          hint: "f'(x) = (x-1)e^x، ادرس إشارة x-1",
          solution: "$f'(x) = 1 \\cdot e^x + (x-2) e^x = (x-1) e^x$\n\n$e^x > 0$ دائماً، إذن إشارة $f'$ = إشارة $x - 1$.\n\n| $x$ | $-\\infty$ | 1 | $+\\infty$ |\n|-----|-----------|---|-----------|\n| $f'$ | $-$ | 0 | $+$ |\n| $f$ | $\\searrow$ | $-e$ | $\\nearrow$ |\n\n$f$ متناقصة على $]-\\infty, 1]$ ومتزايدة على $[1, +\\infty[$.\n\nأدنى محلي عند $x = 1$: $f(1) = -e \\approx -2{,}718$",
          plot: {
            title: "منحنى f(x) = (x-2)·e^x",
            functions: [{ expr: "(x-2)*Math.exp(x)", color: "#A4133C", label: "f(x)", width: 3 }],
            xRange: [-3, 4], yRange: [-5, 10], height: 360,
            points: [{ x: 1, y: -Math.E, label: "أدنى (1, -e)", color: "#f59e0b" }],
          },
        },
        {
          statement: "**التمرين 8** — لتكن $f(x) = (ax + b)e^{-x} + 1$. عين $a$ و $b$ بحيث $f(0) = 0$ و $f'(0) = -1$.",
          hint: "f(0) = b + 1 = 0 و f'(0) = (a-b) - 1",
          solution: "$f(0) = (0+b)e^0 + 1 = b + 1 = 0 \\implies b = -1$\n\n$f'(x) = a e^{-x} + (ax+b)(-e^{-x}) = (a - ax - b) e^{-x}$\n\n$f'(0) = (a - b) = a + 1 = -1 \\implies a = -2$\n\nإذن $f(x) = (-2x - 1) e^{-x} + 1$",
        },
      ],
    },
    {
      id: "exp-4", order: 4,
      title: "معادلات ومتراجحات أُسية",
      durationMin: 30,
      description: "حل معادلات ومتراجحات باستعمال e^x و ln",
      content: "## المعادلات الأُسية\n\n### $e^{f(x)} = e^{g(x)} \\iff f(x) = g(x)$\n### $e^{f(x)} = k > 0 \\iff f(x) = \\ln k$\n### $e^{f(x)} = e^{g(x)} \\iff f(x) = g(x)$\n\n## المتراجحات\n### $e^{f(x)} > e^{g(x)} \\iff f(x) > g(x)$\n### $e^{f(x)} > 1 \\iff f(x) > 0$",
      keyPoints: ["e^f = e^g ⟺ f = g", "e^f = k ⟺ f = ln(k)", "e^f > e^g ⟺ f > g"],
      exercises: [
        {
          statement: "**التمرين 9** — حل في $\\mathbb{R}$: $e^{x^2-3} = e^{2x}$",
          hint: "e^f = e^g ⟺ f = g",
          solution: "$x^2 - 3 = 2x \\iff x^2 - 2x - 3 = 0$\n$\\Delta = 4 + 12 = 16$\n$x = \\frac{2 \\pm 4}{2}$ → $x = 3$ أو $x = -1$\n\n$\\boxed{S = \\{-1, 3\\}}$",
        },
        {
          statement: "**التمرين 10** — حل في $\\mathbb{R}$: $e^{2x} + e^x - 2 = 0$ و $e^{2x} - 3e^x + 2 \\leq 0$.",
          hint: "ضع X = e^x > 0",
          solution: "**المعادلة:** $X^2 + X - 2 = 0$, $\\Delta = 9$, $X = 1$ أو $X = -2$ (مرفوض)\n$e^x = 1 \\implies x = 0$\n\n**المتراجحة:** $X^2 - 3X + 2 \\leq 0$, $(X-1)(X-2) \\leq 0$\n$1 \\leq X \\leq 2$, $1 \\leq e^x \\leq 2$, $0 \\leq x \\leq \\ln 2$\n\n$\\boxed{S = [0, \\ln 2]}$",
        },
      ],
    },
    {
      id: "exp-5", order: 5,
      title: "مسألة شاملة: دراسة دالة أُسية",
      durationMin: 30,
      description: "دراسة كاملة لدالة أُسية مع مقاربة",
      content: "## مسألة شاملة\n\nتتضمن: حساب مشتقة، دراسة رتابة، مقاربات، مناقشة بيانية لـ $f(x) = m$.",
      keyPoints: ["دراسة شاملة", "مقاربة", "مناقشة بيانية"],
      exercises: [
        {
          statement: "**التمرين 11 (مسألة شاملة)** — لتكن $f(x) = (x+1)e^{-x} + 1$.\n1. احسب $\\lim_{x \\to +\\infty} f(x)$ و $\\lim_{x \\to -\\infty} f(x)$.\n2. احسب $f'(x)$ واذكر جدول التغيرات.\n3. اكتب معادلة المماس عند $x = -1$.\n4. ناقش بيانياً عدد حلول $f(x) = 2$.",
          hint: "f'(x) = -x·e^(-x); عند +∞: e^(-x)→0",
          solution: "**1)** $\\lim_{+\\infty} f(x) = 0 + 1 = 1$ (مقاربة أفقية $y = 1$)\n$\\lim_{-\\infty} f(x) = +\\infty$ (لأن $(x+1)e^{-x} \\to +\\infty$)\n\n**2)** $f'(x) = e^{-x} - (x+1)e^{-x} = -x e^{-x}$\n$e^{-x} > 0$ دائماً، إشارة $f'$ = إشارة $-x$:\n- $f' > 0$ على $]-\\infty, 0[$ (متزايدة)\n- $f' = 0$ عند $x = 0$\n- $f' < 0$ على $]0, +\\infty[$ (متناقصة)\n\nأقصى عند $x = 0$: $f(0) = 1 + 1 = 2$\n\n**3)** $f(-1) = 0 + 1 = 1$, $f'(-1) = e > 0$\nالمماس: $y = e(x+1) + 1$\n\n**4)** $f(x) = 2$: من جدول التغيرات، أقصى قيمة هي $f(0) = 2$، إذن:\n- $m > 2$: لا حل\n- $m = 2$: حل وحيد $x = 0$\n- $1 < m < 2$: حلان\n- $m \\leq 1$: حل وحيد",
          plot: {
            title: "منحنى f(x) = (x+1)·e^(-x) + 1",
            functions: [{ expr: "(x+1)*Math.exp(-x)+1", color: "#A4133C", label: "f(x)", width: 3 }, { expr: "1", color: "#3b82f6", label: "y=1 (مقاربة)", dashed: true }],
            xRange: [-3, 6], yRange: [-1, 5], height: 360,
            points: [{ x: 0, y: 2, label: "أقصى (0,2)", color: "#f59e0b" }, { x: -1, y: 1, label: "A(-1,1)", color: "#10b981" }],
          },
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة 3: اللوغاريتم النيبيري — 5 وحدات + 15 تمرين
// ============================================================
const courseLn: Course = {
  id: "course-ln-2027",
  slug: "ln-2027",
  title: "اللوغاريتم النيبيري",
  subtitle: "من التعريف إلى دراسة الدوال اللوغاريتمية",
  description: "دورة شاملة في اللوغاريتم النيبيري: تعريف، خاصيات، نهايات، اشتقاق، دراسة دوال لوغاريتمية، معادلات ومتراجحات.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 150,
  modulesCount: 5,
  coverColor: "#1E40AF",
  icon: "Sigma",
  tags: ["لوغاريتم", "ln", "اشتقاق"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/ln2027.pdf",
  modules: [
    {
      id: "ln-1", order: 1,
      title: "تعريف اللوغاريتم النيبيري",
      durationMin: 30,
      description: "تعريف ln، الخاصيات الجبرية",
      content: "## اللوغاريتم النيبيري $\\ln(x)$\n\n### التعريف\n$\\ln(x)$ الدالة العكسية لـ $e^x$ على $]0, +\\infty[$.\n$$\\ln(e^x) = x \\quad ; \\quad e^{\\ln x} = x$$\n\n### الخاصيات الجبرية\n- $\\ln(ab) = \\ln a + \\ln b$\n- $\\ln\\left(\\frac{a}{b}\\right) = \\ln a - \\ln b$\n- $\\ln(a^n) = n \\ln a$\n- $\\ln(1) = 0$, $\\ln(e) = 1$",
      keyPoints: ["ln عكس e^x", "مجال: ]0,+∞[", "ln(ab)=ln(a)+ln(b)"],
      exercises: [
        {
          statement: "**التمرين 1** — بسّط:\n1. $\\ln(8) - 2\\ln(2)$\n2. $\\ln(\\sqrt{e})$\n3. $\\ln\\left(\\frac{e^3}{e^2}\\right)$\n4. $\\ln(x^2) - \\ln(x)$ لـ $x > 0$",
          hint: "استعمل ln(a^n) = n·ln(a) و ln(a/b) = ln(a) - ln(b)",
          solution: "**1)** $\\ln(2^3) - 2\\ln(2) = 3\\ln 2 - 2\\ln 2 = \\ln 2$\n\n**2)** $\\ln(e^{1/2}) = \\frac{1}{2}$\n\n**3)** $\\ln(e^3) - \\ln(e^2) = 3 - 2 = 1$\n\n**4)** $2\\ln(x) - \\ln(x) = \\ln(x)$",
        },
        {
          statement: "**التمرين 2** — حل في $]0, +\\infty[$: $\\ln(x) + \\ln(x-1) = \\ln(6)$",
          hint: "ln(a) + ln(b) = ln(ab)، شرط a > 0 و b > 0",
          solution: "شرط: $x > 0$ و $x - 1 > 0$، أي $x > 1$.\n\n$\\ln(x(x-1)) = \\ln(6) \\iff x(x-1) = 6 \\iff x^2 - x - 6 = 0$\n\n$\\Delta = 1 + 24 = 25$, $x = \\frac{1 \\pm 5}{2}$\n\n$x_1 = 3 > 1$ ✓ و $x_2 = -2 < 1$ ✗\n\n$\\boxed{S = \\{3\\}}$",
        },
        {
          statement: "**التمرين 3** — حل: $\\ln(x^2 - 4) \\leq \\ln(5)$",
          hint: "ln(f(x)) ≤ ln(k) ⟺ 0 < f(x) ≤ k",
          solution: "شرط: $x^2 - 4 > 0$, أي $|x| > 2$.\n\n$\\ln(x^2-4) \\leq \\ln(5) \\iff x^2 - 4 \\leq 5 \\iff x^2 \\leq 9 \\iff |x| \\leq 3$\n\nمع الشرط $|x| > 2$: $2 < |x| \\leq 3$\n\n$\\boxed{S = [-3, -2[ \\cup ]2, 3]}$",
        },
      ],
    },
    {
      id: "ln-2", order: 2,
      title: "نهايات اللوغاريتم",
      durationMin: 25,
      description: "نهايات ln عند 0+ و ±∞",
      content: "## النهايات المرجعية\n\n$$\\lim_{x \\to 0^+} \\ln x = -\\infty \\quad ; \\quad \\lim_{x \\to +\\infty} \\ln x = +\\infty$$\n$$\\lim_{x \\to +\\infty} \\frac{\\ln x}{x} = 0 \\quad ; \\quad \\lim_{x \\to 0^+} x \\ln x = 0$$\n$$\\lim_{x \\to +\\infty} \\frac{\\ln x}{x^n} = 0 \\quad (\\forall n > 0)$$\n\n**قاعدة**: اللوغاريتم يتباطأ عن كثيرة الحدود.",
      keyPoints: ["ln(0+) = -∞", "ln(+∞) = +∞", "ln(x)/x → 0"],
      exercises: [
        {
          statement: "**التمرين 4** — احسب:\n1. $\\lim_{x \\to +\\infty} \\frac{\\ln(x^2)}{x}$\n2. $\\lim_{x \\to 0^+} x^2 \\ln(x)$\n3. $\\lim_{x \\to +\\infty} \\frac{x}{\\ln(x)}$\n4. $\\lim_{x \\to 1} \\frac{\\ln x}{x - 1}$",
          hint: "ln(x)/x → 0; x^a·ln(x) → 0 عند 0+; ln(x)/(x-1) → 1 (مشتقة)",
          solution: "**1)** $\\frac{\\ln(x^2)}{x} = \\frac{2\\ln x}{x} \\to 2 \\times 0 = 0$\n\n**2)** $x^2 \\ln x = x \\cdot (x \\ln x) \\to (+\\infty) \\times 0 = 0$ (بقيادة $x$)\nفي الحقيقة: $x^2 \\ln x \\to 0^+ \\times (-\\infty)$, نضع $x = e^{-t}$: $e^{-2t} \\cdot (-t) = -\\frac{t}{e^{2t}} \\to 0$\n\n**3)** $\\frac{x}{\\ln x} = \\frac{1}{\\frac{\\ln x}{x}} \\to \\frac{1}{0^+} = +\\infty$\n\n**4)** $\\lim_{x \\to 1} \\frac{\\ln x}{x-1} = 1$ (مشتقة $\\ln x$ عند $x = 1$)",
        },
      ],
    },
    {
      id: "ln-3", order: 3,
      title: "اشتقاق اللوغاريتم",
      durationMin: 30,
      description: "مشتقة ln(x)، دوال مركبة",
      content: "## اشتقاق اللوغاريتم\n\n### المشتقة: $(\\ln x)' = \\frac{1}{x}$ على $]0, +\\infty[$\n### دوال مركبة:\n- $(\\ln|u|)' = \\frac{u'}{u}$\n- $(\\ln(ax+b))' = \\frac{a}{ax+b}$\n- $(x \\ln x - x)' = \\ln x$",
      keyPoints: ["(ln x)' = 1/x", "(ln|u|)' = u'/u", "(x·ln(x)-x)' = ln(x)"],
      exercises: [
        {
          statement: "**التمرين 5** — اشطب:\n1. $f(x) = \\ln(x^2 + 1)$\n2. $g(x) = x \\ln x - x$\n3. $h(x) = \\frac{\\ln x}{x}$\n4. $k(x) = \\ln(\\ln x)$",
          hint: "(ln u)' = u'/u; (uv)' = u'v + uv'",
          solution: "**1)** $f'(x) = \\frac{2x}{x^2+1}$\n\n**2)** $g'(x) = \\ln x + 1 - 1 = \\ln x$\n\n**3)** $h'(x) = \\frac{\\frac{1}{x} \\cdot x - \\ln x}{x^2} = \\frac{1 - \\ln x}{x^2}$\n\n**4)** $k'(x) = \\frac{1/x}{\\ln x} = \\frac{1}{x \\ln x}$",
        },
        {
          statement: "**التمرين 6** — ادرس تغيرات $f(x) = \\frac{\\ln x}{x}$ على $]0, +\\infty[$.",
          hint: "f'(x) = (1-ln x)/x²",
          solution: "$f'(x) = \\frac{1 - \\ln x}{x^2}$\n\n$x^2 > 0$ دائماً، إذن إشارة $f'$ = إشارة $1 - \\ln x$.\n\n$1 - \\ln x \\geq 0 \\iff \\ln x \\leq 1 \\iff x \\leq e$\n\n- $f$ متزايدة على $]0, e]$\n- $f$ متناقصة على $[e, +\\infty[$\n- أقصى عند $x = e$: $f(e) = \\frac{1}{e} \\approx 0{,}368$\n\n$\\lim_{0^+} f = -\\infty$, $\\lim_{+\\infty} f = 0$ (مقاربة أفقية $y = 0$)",
          plot: {
            title: "منحنى f(x) = ln(x)/x",
            functions: [{ expr: "Math.log(x)/x", color: "#A4133C", label: "f(x)=ln(x)/x", width: 3 }, { expr: "0", color: "#3b82f6", label: "y=0", dashed: true }],
            xRange: [0.05, 15], yRange: [-2, 0.5], height: 360,
            points: [{ x: Math.E, y: 1/Math.E, label: "أقصى (e, 1/e)", color: "#f59e0b" }],
          },
        },
      ],
    },
    {
      id: "ln-4", order: 4,
      title: "معادلات ومتراجحات لوغاريتمية",
      durationMin: 30,
      description: "حل معادلات ومتراجحات بـ ln",
      content: "## المعادلات اللوغاريتمية\n\n### $\\ln f(x) = \\ln g(x) \\iff f(x) = g(x) > 0$\n### $\\ln f(x) = k \\iff f(x) = e^k$\n### $\\ln f(x) \\leq \\ln g(x) \\iff 0 < f(x) \\leq g(x)$",
      keyPoints: ["ln f = ln g ⟺ f = g > 0", "ln f = k ⟺ f = e^k", "ln f ≤ ln g ⟺ 0 < f ≤ g"],
      exercises: [
        {
          statement: "**التمرين 7** — حل: $\\ln(x+2) + \\ln(x-3) = \\ln(4)$",
          hint: "ln(a)+ln(b)=ln(ab); شرط: a>0 و b>0",
          solution: "شرط: $x+2>0$ و $x-3>0$, أي $x > 3$.\n\n$\\ln((x+2)(x-3)) = \\ln(4) \\iff (x+2)(x-3) = 4$\n\n$x^2 - x - 6 = 4 \\iff x^2 - x - 10 = 0$\n\n$\\Delta = 1 + 40 = 41$, $x = \\frac{1 \\pm \\sqrt{41}}{2}$\n\n$x_1 = \\frac{1+\\sqrt{41}}{2} \\approx 3{,}7 > 3$ ✓\n$x_2 = \\frac{1-\\sqrt{41}}{2} < 0 < 3$ ✗\n\n$\\boxed{S = \\left\\{\\frac{1+\\sqrt{41}}{2}\\right\\}}$",
        },
        {
          statement: "**التمرين 8** — حل: $\\ln(2x-1) \\geq 0$",
          hint: "ln(f) ≥ 0 ⟺ f ≥ 1 (مع f > 0)",
          solution: "شرط: $2x-1 > 0$, أي $x > \\frac{1}{2}$.\n\n$\\ln(2x-1) \\geq 0 \\iff 2x-1 \\geq e^0 = 1 \\iff x \\geq 1$\n\nمع الشرط $x > \\frac{1}{2}$: $\\boxed{S = [1, +\\infty[}$",
        },
      ],
    },
    {
      id: "ln-5", order: 5,
      title: "مسألة شاملة: دراسة دالة لوغاريتمية",
      durationMin: 35,
      description: "دراسة كاملة لدالة لوغاريتمية مع مقاربة وتكامل",
      content: "## مسألة شاملة\n\nدراسة شاملة لدالة من نوع $f(x) = ax + b + \\frac{c}{x}$ أو $f(x) = \\frac{\\ln x}{x}$.",
      keyPoints: ["دراسة شاملة", "مقاربة + رتابة", "تكامل"],
      exercises: [
        {
          statement: "**التمرين 9 (مسألة شاملة)** — لتكن $f(x) = x - \\frac{\\ln x}{x}$ على $]0, +\\infty[$.\n1. ادرس النهايات عند $0^+$ و $+\\infty$.\n2. برهن أن $f'(x) = \\frac{x^2 + \\ln x - 1}{x^2}$.\n3. برهن أن $f(x) \\geq 1$ لكل $x > 0$ (استعمل $g(x) = x^2 + \\ln x - 1$).\n4. ناقش بيانياً عدد حلول $f(x) = 0$.",
          hint: "g'(x) = 2x + 1/x > 0; g(1) = 0",
          solution: "**1)** $\\lim_{0^+} \\frac{\\ln x}{x} = -\\infty$, إذن $\\lim_{0^+} f(x) = 0 - (-\\infty) = +\\infty$\n$\\lim_{+\\infty} f(x) = +\\infty - 0 = +\\infty$\n\n**2)** $f'(x) = 1 - \\frac{1 - \\ln x}{x^2} = \\frac{x^2 - 1 + \\ln x}{x^2} = \\frac{x^2 + \\ln x - 1}{x^2}$\n\n**3)** $g(x) = x^2 + \\ln x - 1$, $g'(x) = 2x + \\frac{1}{x} > 0$ على $]0, +\\infty[$\n$g(1) = 1 + 0 - 1 = 0$\nبما أن $g$ متزايدة و $g(1) = 0$: $g(x) < 0$ على $]0,1[$ و $g(x) > 0$ على $]1,+\\infty[$\nإذن $f$ متناقصة على $]0,1]$ ومتزايدة على $[1,+\\infty[$\nأدنى عند $x=1$: $f(1) = 1 - 0 = 1 > 0$\nإذن $f(x) \\geq 1 > 0$ لكل $x > 0$.\n\n**4)** بما أن $f(x) \\geq 1 > 0$، فالمعادلة $f(x) = 0$ **ليس لها حل**.",
          plot: {
            title: "منحنى f(x) = x - ln(x)/x",
            functions: [{ expr: "x - Math.log(x)/x", color: "#A4133C", label: "f(x)", width: 3 }, { expr: "x", color: "#3b82f6", label: "y=x (مقاربة)", dashed: true }],
            xRange: [0.1, 6], yRange: [-1, 6], height: 360,
            points: [{ x: 1, y: 1, label: "أدنى (1,1)", color: "#f59e0b" }],
          },
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة 4: الأعداد المركبة — 4 وحدات + 12 تمرين
// ============================================================
const courseComplex: Course = {
  id: "course-complex-2027",
  slug: "complex-2027",
  title: "الأعداد المركبة",
  subtitle: "من الكتابة الجبرية إلى الصيغة الأسية والهندسة",
  description: "دورة شاملة في الأعداد المركبة: حل معادلات، كتابة جبرية ومثلثية وأسية، تمثيل هندسي، تطبيقات.",
  stream: "MATHEMATICS",
  level: "ADVANCED",
  totalDurationMin: 120,
  modulesCount: 4,
  coverColor: "#7C3AED",
  icon: "CircleDot",
  tags: ["أعداد مركبة", "z", "هندسة"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/complex2027.pdf",
  modules: [
    {
      id: "complex-1", order: 1,
      title: "تعريف الأعداد المركبة",
      durationMin: 30,
      description: "مجموعة C، الكتابة الجبرية، المرافق",
      content: "## مجموعة $\\mathbb{C}$\n\n### التعريف\n$\\mathbb{C} = \\{a + bi \\mid a, b \\in \\mathbb{R}, i^2 = -1\\}$\n\n### الكتابة الجبرية: $z = a + bi$\n- $\\text{Re}(z) = a$, $\\text{Im}(z) = b$\n- المرافق: $\\bar{z} = a - bi$\n- الطويلة: $|z| = \\sqrt{a^2 + b^2}$",
      keyPoints: ["i² = -1", "z = a+bi", "|z| = √(a²+b²)"],
      exercises: [
        {
          statement: "**التمرين 1** — حل في $\\mathbb{C}$: $z^2 + 2z + 5 = 0$",
          hint: "Δ = b²-4ac = 4-20 = -16 = (4i)²",
          solution: "$\\Delta = 4 - 20 = -16 = (4i)^2$\n\n$z = \\frac{-2 \\pm 4i}{2} = -1 \\pm 2i$\n\n$\\boxed{z_1 = -1 + 2i, \\quad z_2 = -1 - 2i}$",
        },
        {
          statement: "**التمرين 2** — احسب:\n1. $(3 + 2i)(1 - 4i)$\n2. $\\frac{2+i}{1-i}$\n3. $|3+4i|$ و $|\\overline{3+4i}|$",
          hint: "اضرب واجمع; للقسمة اضرب في المرافق",
          solution: "**1)** $3 - 12i + 2i - 8i^2 = 3 - 10i + 8 = 11 - 10i$\n\n**2)** $\\frac{2+i}{1-i} \\times \\frac{1+i}{1+i} = \\frac{(2+i)(1+i)}{1+1} = \\frac{2+2i+i+i^2}{2} = \\frac{1+3i}{2}$\n\n**3)** $|3+4i| = \\sqrt{9+16} = 5$; $|\\overline{3+4i}| = |3-4i| = 5$",
        },
        {
          statement: "**التمرين 3** — حل $z^3 = -8i$ في $\\mathbb{C}$.",
          hint: "اكتب z = re^(iθ), ثم r³ = 8 و 3θ = -π/2 + 2kπ",
          solution: "نكتب $z = re^{i\\theta}$:\n$r^3 e^{3i\\theta} = 8e^{-i\\pi/2}$\n\n$r^3 = 8 \\implies r = 2$\n$3\\theta = -\\frac{\\pi}{2} + 2k\\pi \\implies \\theta = -\\frac{\\pi}{6} + \\frac{2k\\pi}{3}$\n\n- $k=0$: $\\theta = -\\frac{\\pi}{6}$, $z_1 = 2e^{-i\\pi/6} = \\sqrt{3} - i$\n- $k=1$: $\\theta = \\frac{\\pi}{2}$, $z_2 = 2e^{i\\pi/2} = 2i$\n- $k=2$: $\\theta = \\frac{7\\pi}{6}$, $z_3 = 2e^{7i\\pi/6} = -\\sqrt{3} - i$",
        },
      ],
    },
    {
      id: "complex-2", order: 2,
      title: "الكتابة المثلثية والأسية",
      durationMin: 30,
      description: "الشكل المثلثي والأس، صيغة Moivre",
      content: "## الكتابة المثلثية والأسية\n\n### $z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}$\n### $r = |z|$, $\\theta = \\arg(z)$\n### صيغة Moivre: $(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$\n### ضرب: $z_1 \\cdot z_2 = r_1 r_2 e^{i(\\theta_1 + \\theta_2)}$",
      keyPoints: ["z = r·e^(iθ)", "Moivre: (cos θ + i sin θ)^n", "ضرب: r₁r₂·e^(i(θ₁+θ₂))"],
      exercises: [
        {
          statement: "**التمرين 4** — أكتب $z = 1 + i$ بالصيغة المثلثية والأسية.",
          hint: "r = |z| = √2, θ = arctan(1/1) = π/4",
          solution: "$r = \\sqrt{1^2 + 1^2} = \\sqrt{2}$\n$\\theta = \\arctan\\left(\\frac{1}{1}\\right) = \\frac{\\pi}{4}$\n\n**مثلثية:** $z = \\sqrt{2}\\left(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4}\\right)$\n\n**أسية:** $z = \\sqrt{2} \\, e^{i\\pi/4}$",
        },
        {
          statement: "**التمرين 5** — استعمل صيغة Moivre لحساب $(1 + i)^6$.",
          hint: "z = √2·e^(iπ/4), z^6 = (√2)^6 · e^(6iπ/4) = 8·e^(3iπ/2)",
          solution: "$(1+i)^6 = \\left(\\sqrt{2} \\, e^{i\\pi/4}\\right)^6 = (\\sqrt{2})^6 \\cdot e^{6i\\pi/4} = 8 \\, e^{3i\\pi/2}$\n\n$e^{3i\\pi/2} = \\cos\\frac{3\\pi}{2} + i\\sin\\frac{3\\pi}{2} = -i$\n\n$\\boxed{(1+i)^6 = -8i}$",
        },
      ],
    },
    {
      id: "complex-3", order: 3,
      title: "التمثيل الهندسي للأعداد المركبة",
      durationMin: 30,
      description: "نقطة، صورة، أعداد وحلول هندسية",
      content: "## التمثيل الهندسي\n\n### النقطة $M(z)$: إحداثيات $(\\text{Re}(z), \\text{Im}(z))$\n### المسافة: $|z_A - z_B| = AB$\n### الزاوية: $\\arg\\left(\\frac{z_B - z_A}{z_C - z_A}\\right) = \\widehat{BAC}$\n### المستقيم: $\\text{Im}(z) = 0$ → محور الفواصل",
      keyPoints: ["M(z) = (Re(z), Im(z))", "AB = |zB - zA|", "arg((zB-zA)/(zC-zA)) = BAC"],
      exercises: [
        {
          statement: "**التمرين 6** — لتكن $A(2+i)$ و $B(3+3i)$ و $C(1+2i)$.\n1. احسب $AB$, $AC$, $BC$.\n2. برهن أن المثلث $ABC$ قائم في $A$.\n3. احسب مساحة المثلث $ABC$.",
          hint: "AB = |zB-zA|; قائم إذا AB² + AC² = BC²",
          solution: "**1)** $AB = |(3+3i)-(2+i)| = |1+2i| = \\sqrt{5}$\n$AC = |(1+2i)-(2+i)| = |-1+i| = \\sqrt{2}$\n$BC = |(1+2i)-(3+3i)| = |-2-i| = \\sqrt{5}$\n\n**2)** $AB^2 + AC^2 = 5 + 2 = 7 \\neq BC^2 = 5$. ليس قائماً في $A$.\n\n$AB^2 + BC^2 = 5 + 5 = 10 \\neq AC^2 = 2$. ليس قائماً في $B$.\n\n$AC^2 + BC^2 = 2 + 5 = 7 \\neq AB^2 = 5$. ليس قائماً في $C$.\n\nالمثلث $ABC$ ليس قائماً.\n\n**3)** بالصيغة: $\\mathcal{A} = \\frac{1}{2}|\\text{Im}((z_B-z_A)\\overline{(z_C-z_A)})|$\n$= \\frac{1}{2}|\\text{Im}((1+2i)(-1-i)| = \\frac{1}{2}|\\text{Im}(-1-i-2i-2i^2)| = \\frac{1}{2}|\\text{Im}(1-3i)| = \\frac{3}{2}$",
        },
      ],
    },
    {
      id: "complex-4", order: 4,
      title: "مسألة شاملة: المعادلات والمضلعات",
      durationMin: 30,
      description: "حل معادلات درجة عالية، مضلعات منتظمة",
      content: "## مسائل شاملة\n\n### $z^n = k$: استعمل الصيغة الأسية\n### مضلع منتظم: $z_k = re^{2ik\\pi/n}$\n### جذر $n$-th للوحدة: $\\omega_k = e^{2ik\\pi/n}$",
      keyPoints: ["z^n = k → n حلول", "مضلع منتظم", "جذور الوحدة"],
      exercises: [
        {
          statement: "**التمرين 7 (مسألة شاملة)** — حل $z^4 = -16$ ثم استنتج أن النقاط صور الحلول تشكل مربعاً.",
          hint: "z = 2·e^(i(π/4 + kπ/2)), k=0,1,2,3",
          solution: "$z^4 = 16 e^{i\\pi}$, إذن $z = 2 e^{i(\\pi/4 + k\\pi/2)}$ لـ $k = 0,1,2,3$:\n\n- $z_0 = 2e^{i\\pi/4} = \\sqrt{2}(1+i)$\n- $z_1 = 2e^{3i\\pi/4} = \\sqrt{2}(-1+i)$\n- $z_2 = 2e^{5i\\pi/4} = \\sqrt{2}(-1-i)$\n- $z_3 = 2e^{7i\\pi/4} = \\sqrt{2}(1-i)$\n\nكل نقطة على دائرة نصف قطرها 2، والفرق بين زاويتين متتاليتين هو $\\frac{\\pi}{2}$ (90°), إذن النقاط تشكل **مربعاً** ✓",
        },
      ],
    },
  ],
};

// ============================================================
//  الدورة 5: الاحتمالات — 4 وحدات + 12 تمرين
// ============================================================
const courseProba: Course = {
  id: "course-proba-2027",
  slug: "proba-2027",
  title: "الاحتمالات",
  subtitle: "من المتراجحة إلى التوزيعات الاحتمالية ومبرهنة بايز",
  description: "دورة شاملة في الاحتمالات: تعريف، خاصيات، احتمال شرطي، استقلالية، توزيع ثنائي، بايز.",
  stream: "ALL",
  level: "ADVANCED",
  totalDurationMin: 120,
  modulesCount: 4,
  coverColor: "#059669",
  icon: "Dices",
  tags: ["احتمالات", "توزيع", "بايز"],
  isPublished: true,
  createdAt: "2027-09-01",
  isPremium: true,
  pdfUrl: "/courses/proba2027.pdf",
  modules: [
    {
      id: "proba-1", order: 1,
      title: "تعريف الاحتمالات والخاصيات",
      durationMin: 30,
      description: "الكون، الأحداث، الاحتمال، الخاصيات",
      content: "## الاحتمالات\n\n### $0 \\leq P(A) \\leq 1$\n### $P(\\Omega) = 1$\n### $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$\n### $P(\\bar{A}) = 1 - P(A)$\n### حالة التساوي: $P(A) = \\frac{|A|}{|\\Omega|}$",
      keyPoints: ["0 ≤ P(A) ≤ 1", "P(A∪B) = P(A)+P(B)-P(A∩B)", "P(Ā) = 1-P(A)"],
      exercises: [
        {
          statement: "**التمرين 1** — نرمي نرداً متوازناً. ما احتمال:\n1. الحصول على عدد زوجي؟\n2. الحصول على عدد أكبر من 4؟\n3. الحصول على عدد زوجي أو أكبر من 4؟",
          hint: "Ω = {1,2,3,4,5,6}; A = زوجي = {2,4,6}; B = > 4 = {5,6}",
          solution: "$\\Omega = \\{1,2,3,4,5,6\\}$, $|\\Omega| = 6$\n\n**1)** $A = \\{2,4,6\\}$, $P(A) = \\frac{3}{6} = \\frac{1}{2}$\n\n**2)** $B = \\{5,6\\}$, $P(B) = \\frac{2}{6} = \\frac{1}{3}$\n\n**3)** $A \\cup B = \\{2,4,5,6\\}$, $P(A \\cup B) = \\frac{4}{6} = \\frac{2}{3}$\n\nتحقق: $P(A) + P(B) - P(A \\cap B) = \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{6} = \\frac{3+2-1}{6} = \\frac{4}{6} = \\frac{2}{3}$ ✓",
        },
        {
          statement: "**التمرين 2** — من مجموعة 52 ورقة، نسحب ورقتين دون إعادة. ما احتمال:\n1. ورقتان من نفس النوع؟\n2. ورقتان أحمران؟",
          hint: "C(52,2) = 1326; C(13,2) = 78 لكل نوع; C(26,2) = 325 للأحمر",
          solution: "$|\\Omega| = C_{52}^2 = \\frac{52 \\times 51}{2} = 1326$\n\n**1)** 4 أنواع، كل نوع 13 ورقة:\n$P = \\frac{4 \\times C_{13}^2}{C_{52}^2} = \\frac{4 \\times 78}{1326} = \\frac{312}{1326} = \\frac{12}{51} = \\frac{4}{17}$\n\n**2)** 26 ورقة حمراء:\n$P = \\frac{C_{26}^2}{C_{52}^2} = \\frac{325}{1326} = \\frac{25}{102}$",
        },
      ],
    },
    {
      id: "proba-2", order: 2,
      title: "الاحتمال الشرطي والاستقلالية",
      durationMin: 30,
      description: "P_A(B), استقلالية حدثين, نظرية الاحتمالات الكاملة",
      content: "## الاحتمال الشرطي\n\n### $P_A(B) = \\frac{P(A \\cap B)}{P(A)}$\n### حدثان مستقلان: $P(A \\cap B) = P(A) \\times P(B)$\n### نظرية الاحتمالات الكاملة: $P(B) = \\sum P(A_i) P_{A_i}(B)$",
      keyPoints: ["P_A(B) = P(A∩B)/P(A)", "مستقل: P(A∩B)=P(A)·P(B)", "احتمالات كاملة"],
      exercises: [
        {
          statement: "**التمرين 3** — جرة فيها 5 كرات حمراء و 3 بيضاء. نسحب كرتين.\n1. ما احتمال أن تكون الثانية حمراء علمًا أن الأولى حمراء (دون إعادة)؟\n2. هل الحدثان مستقلان؟",
          hint: "P(A∩B) = (5/8)·(4/7); P(B) = 5/8",
          solution: "$A$: الأولى حمراء, $B$: الثانية حمراء.\n\n$P(A) = \\frac{5}{8}$, $P(A \\cap B) = \\frac{5}{8} \\times \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}$\n\n**1)** $P_A(B) = \\frac{P(A \\cap B)}{P(A)} = \\frac{5/14}{5/8} = \\frac{8}{14} = \\frac{4}{7}$\n\n**2)** $P(B) = \\frac{5}{8}$ (بالتماثل). $P(A) \\times P(B) = \\frac{25}{64} \\neq \\frac{5}{14} = P(A \\cap B)$\n\n**غير مستقلان** ✗",
        },
        {
          statement: "**التمرين 4 (مبرهنة بايز)** — مرض يصيب 1% من السكان. فحص كشف المرض:\n- لو مريض: 90% إيجابي\n- لو سليم: 5% إيجابي كاذب\nما احتمال أن يكون الشخص مريضاً علمًا أن الفحص إيجابي؟",
          hint: "P(M|+) = P(+|M)·P(M) / P(+) ; P(+) = P(+|M)·P(M) + P(+|S)·P(S)",
          solution: "$M$: مريض, $P(M) = 0.01$; $\\bar{M}$: سليم, $P(\\bar{M}) = 0.99$\n$P(+|M) = 0.90$; $P(+|\\bar{M}) = 0.05$\n\n$P(+) = P(+|M)P(M) + P(+|\\bar{M})P(\\bar{M}) = 0.90 \\times 0.01 + 0.05 \\times 0.99 = 0.009 + 0.0495 = 0.0585$\n\n$P(M|+) = \\frac{P(+|M) \\times P(M)}{P(+)} = \\frac{0.009}{0.0585} \\approx 15{,}4\\%$\n\nأي حوالي 15% فقط — معظم الإيجابيات كاذبة!",
        },
      ],
    },
    {
      id: "proba-3", order: 3,
      title: "التوزيع الثنائي",
      durationMin: 30,
      description: "تجارب Bernoulli، B(n,p), المتوقع والتباين",
      content: "## التوزيع الثنائي $B(n, p)$\n\n### $P(X = k) = C_n^k p^k (1-p)^{n-k}$\n### المتوقع: $E(X) = np$\n### التباين: $V(X) = np(1-p)$\n### شرط: $n$ تجارب مستقلة، احتمال النجاح $p$ ثابت",
      keyPoints: ["P(X=k) = C(n,k)·p^k·(1-p)^(n-k)", "E(X) = np", "V(X) = np(1-p)"],
      exercises: [
        {
          statement: "**التمرين 5** — نرمي نرداً 10 مرات. $X$ = عدد مرات الحصول على 6.\n1. ما توزيع $X$؟\n2. احسب $P(X = 2)$.\n3. احسب $E(X)$ و $V(X)$.",
          hint: "p = 1/6; B(10, 1/6)",
          solution: "**1)** $X \\sim B(10, \\frac{1}{6})$ (10 تجارب مستقلة، $p = \\frac{1}{6}$)\n\n**2)** $P(X=2) = C_{10}^2 \\left(\\frac{1}{6}\\right)^2 \\left(\\frac{5}{6}\\right)^8 = 45 \\times \\frac{1}{36} \\times \\frac{390625}{1679616} \\approx 0.2907$\n\n**3)** $E(X) = 10 \\times \\frac{1}{6} = \\frac{5}{3} \\approx 1{,}67$\n$V(X) = 10 \\times \\frac{1}{6} \\times \\frac{5}{6} = \\frac{25}{36} \\approx 0{,}69$",
        },
        {
          statement: "**التمرين 6** — مصنع ينتج 5% قطع معيبة. من 20 قطعة، ما احتمال:\n1. لا توجد قطعة معيبة؟\n2. قطعة معيبة واحدة على الأقل؟\n3. 3 قطع معيبة بالضبط؟",
          hint: "X ~ B(20, 0.05)",
          solution: "$X \\sim B(20, 0.05)$, $p = 0.05$, $q = 0.95$\n\n**1)** $P(X=0) = 0.95^{20} \\approx 0.3585$\n\n**2)** $P(X \\geq 1) = 1 - P(X=0) = 1 - 0.3585 = 0.6415$\n\n**3)** $P(X=3) = C_{20}^3 (0.05)^3 (0.95)^{17} = 1140 \\times 0.000125 \\times 0.4181 \\approx 0.0596$",
        },
      ],
    },
    {
      id: "proba-4", order: 4,
      title: "مسألة شاملة: التوزيع فوق الهندسي",
      durationMin: 30,
      description: "سحب دون إعادة، H(N, N_p, n)",
      content: "## التوزيع فوق الهندسي $H(N, N_p, n)$\n\n### سحب $n$ عنصراً من مجموعة $N$ تحتوي $N_p$ عنصر بنوع معين\n### $P(X = k) = \\frac{C_{N_p}^k \\cdot C_{N-N_p}^{n-k}}{C_N^n}$\n### المتوقع: $E(X) = n \\cdot \\frac{N_p}{N}$",
      keyPoints: ["H(N, Np, n)", "سحب دون إعادة", "E(X) = n·Np/N"],
      exercises: [
        {
          statement: "**التمرين 7 (مسألة شاملة)** — صندوق فيه 10 كرات: 4 حمراء و 6 بيضاء. نسحب 3 كرات دون إعادة. $X$ = عدد الكرات الحمراء المسحوبة.\n1. ما توزيع $X$؟\n2. احسب $P(X=0)$, $P(X=1)$, $P(X=2)$, $P(X=3)$.\n3. احسب $E(X)$.\n4. ما احتمال سحب كرة حمراء واحدة على الأقل؟",
          hint: "X ~ H(10, 4, 3); E(X) = 3·4/10 = 1.2",
          solution: "$X \\sim H(10, 4, 3)$ (سحب 3 من 10، 4 حمراء)\n\n$|\\Omega| = C_{10}^3 = 120$\n\n**2)** \n$P(X=0) = \\frac{C_4^0 \\cdot C_6^3}{120} = \\frac{20}{120} = \\frac{1}{6}$\n$P(X=1) = \\frac{C_4^1 \\cdot C_6^2}{120} = \\frac{4 \\times 15}{120} = \\frac{1}{2}$\n$P(X=2) = \\frac{C_4^2 \\cdot C_6^1}{120} = \\frac{6 \\times 6}{120} = \\frac{3}{10}$\n$P(X=3) = \\frac{C_4^3 \\cdot C_6^0}{120} = \\frac{4}{120} = \\frac{1}{30}$\n\n**3)** $E(X) = 3 \\times \\frac{4}{10} = \\frac{12}{10} = 1{,}2$\n\n**4)** $P(X \\geq 1) = 1 - P(X=0) = 1 - \\frac{1}{6} = \\frac{5}{6}$",
        },
      ],
    },
  ],
};

// ============================================================
//  تصدير كل الدورات المميزة
// ============================================================

export const premiumCourses: Course[] = [
  courseSuites,
  courseExp,
  courseLn,
  courseComplex,
  courseProba,
];

export function getPremiumCoursesStats() {
  return {
    total: premiumCourses.length,
    totalModules: premiumCourses.reduce((acc, c) => acc + c.modulesCount, 0),
    totalDurationMin: premiumCourses.reduce((acc, c) => acc + c.totalDurationMin, 0),
    totalExercises: premiumCourses.reduce(
      (acc, c) => acc + c.modules.reduce((a, m) => a + m.exercises.length, 0),
      0
    ),
  };
}
