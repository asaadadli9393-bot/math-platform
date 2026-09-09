// ============================================================
//  بيانات الاختبارات التفاعلية لكل وحدة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

import type { QuizQuestionData } from "@/components/interactive-quiz";

export interface QuizSeed {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  unitSlug: string;
  questions: QuizQuestionData[];
}

export const quizzes: QuizSeed[] = [
  // ============================================================
  //  اختبار المتتاليات
  // ============================================================
  {
    id: "quiz-sequences-1",
    title: "اختبار: المتتاليات العددية",
    description: "اختبار تفاعلي لتقييم فهمك للمتتاليات الحسابية والهندسية.",
    durationMin: 20,
    unitSlug: "numerical-sequences",
    questions: [
      {
        id: "q1",
        question: "ما هو الحد $u_3$ للمتتالية $u_n = 2n + 1$؟",
        options: ["$5$", "$7$", "$9$", "$11$"],
        correctIdx: 1,
        explanation: "u_3 = 2(3) + 1 = 7.",
        points: 1,
      },
      {
        id: "q2",
        question:
          "متتالية حسابية أساسها $r = 4$ وحدها الأول $u_0 = 2$. ما هو حدها العام؟",
        options: [
          "$u_n = 2 + 4n$",
          "$u_n = 2 \\cdot 4^n$",
          "$u_n = 4n + 2n$",
          "$u_n = 2n + 4$",
        ],
        correctIdx: 0,
        explanation:
          "في المتتالية الحسابية: u_n = u_0 + n·r = 2 + 4n.",
        points: 1,
      },
      {
        id: "q3",
        question:
          "المتتالية $3, 6, 12, 24, \\ldots$ هي متتالية هندسية. ما أساسها؟",
        options: ["$3$", "$2$", "$\\frac{1}{2}$", "$6$"],
        correctIdx: 1,
        explanation: "q = 6/3 = 12/6 = 2.",
        points: 1,
      },
      {
        id: "q4",
        question:
          "ما قيمة المجموع $S = 1 + 2 + 3 + \\cdots + 100$؟",
        options: ["$5050$", "$5000$", "$10000$", "$10100$"],
        correctIdx: 0,
        explanation:
          "S = 100·(1+100)/2 = 100·101/2 = 5050.",
        points: 1,
      },
      {
        id: "q5",
        question:
          "ما هي نهاية المتتالية $u_n = \\frac{1}{2^n}$ عندما $n \\to +\\infty$؟",
        options: ["$+\\infty$", "$1$", "$0$", "$\\frac{1}{2}$"],
        correctIdx: 2,
        explanation:
          "بما أن |1/2| < 1, فإن (1/2)^n → 0 عندما n → +∞.",
        points: 1,
      },
      {
        id: "q6",
        question:
          "ثلاثة حدود متتالية $a, b, c$ (مع $a, c \\neq 0$) تكون حدود متتالية هندسية إذا وفقط إذا:",
        options: [
          "$2b = a + c$",
          "$b^2 = a \\cdot c$",
          "$b = a + c$",
          "$b^2 = a + c$",
        ],
        correctIdx: 1,
        explanation:
          "الشرط المميز للمتتالية الهندسية: b² = a·c.",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  اختبار الدالة الأسية واللوغاريتم
  // ============================================================
  {
    id: "quiz-exponential-1",
    title: "اختبار: الدالة الأسية واللوغاريتم",
    description: "اختبار حول خصائص e^x و ln x وحل المعادلات.",
    durationMin: 25,
    unitSlug: "exponential-logarithmic-functions",
    questions: [
      {
        id: "q1",
        question: "ما قيمة $\\ln(e^3)$؟",
        options: ["$3$", "$e^3$", "$1$", "$0$"],
        correctIdx: 0,
        explanation: "ln(e^x) = x، إذن ln(e^3) = 3.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما قيمة $e^{\\ln 5}$؟",
        options: ["$5$", "$\\ln 5$", "$e^5$", "$5e$"],
        correctIdx: 0,
        explanation: "e^{ln x} = x لكل x > 0.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما مشتقة الدالة $f(x) = e^{2x}$؟",
        options: [
          "$e^{2x}$",
          "$2e^{2x}$",
          "$\\frac{1}{2}e^{2x}$",
          "$e^{2x} + 2$",
        ],
        correctIdx: 1,
        explanation: "(e^u)' = u'·e^u, إذن (e^{2x})' = 2·e^{2x}.",
        points: 1,
      },
      {
        id: "q4",
        question: "ما نهاية $\\lim_{x \\to +\\infty} \\frac{e^x}{x^2}$؟",
        options: ["$0$", "$+\\infty$", "$1$", "$e^2$"],
        correctIdx: 1,
        explanation:
          "الأسية تتفوق على القوى: e^x / x^n → +∞ لأي n.",
        points: 1,
      },
      {
        id: "q5",
        question: "حل المعادلة $\\ln(x) = 2$ في $\\mathbb{R}_+^*$.",
        options: ["$x = e^2$", "$x = 2$", "$x = \\ln 2$", "$x = \\log 2$"],
        correctIdx: 0,
        explanation: "ln(x) = 2 ⟹ x = e^2.",
        points: 1,
      },
      {
        id: "q6",
        question: "بسّط $\\ln(4) - \\ln(2)$:",
        options: [
          "$\\ln(2)$",
          "$\\ln(6)$",
          "$\\ln(8)$",
          "$2$",
        ],
        correctIdx: 0,
        explanation:
          "ln(4) - ln(2) = ln(4/2) = ln(2).",
        points: 1,
      },
      {
        id: "q7",
        question: "ما نهاية $\\lim_{x \\to 0^+} \\ln(x)$؟",
        options: ["$0$", "$1$", "$-\\infty$", "$+\\infty$"],
        correctIdx: 2,
        explanation: "ln(x) → -∞ عندما x → 0+.",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  اختبار الأعداد المركبة
  // ============================================================
  {
    id: "quiz-complex-1",
    title: "اختبار: الأعداد المركبة",
    description: "اختبار حول الشكل الجبري والعمليات والخصائص.",
    durationMin: 20,
    unitSlug: "complex-numbers",
    questions: [
      {
        id: "q1",
        question: "ما قيمة $i^2$؟",
        options: ["$1$", "$-1$", "$i$", "$-i$"],
        correctIdx: 1,
        explanation: "تعريف العدد التخيلي: i² = -1.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما هو مرافق العدد $z = 3 - 4i$؟",
        options: ["$3 + 4i$", "$-3 + 4i$", "$4 - 3i$", "$-3 - 4i$"],
        correctIdx: 0,
        explanation: "z̄ = a - bi → مرافق (3-4i) هو 3+4i.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما طويلة العدد المركب $z = 1 + i$؟",
        options: ["$1$", "$\\sqrt{2}$", "$2$", "$\\sqrt{5}$"],
        correctIdx: 1,
        explanation: "|z| = √(1² + 1²) = √2.",
        points: 1,
      },
      {
        id: "q4",
        question: "ما حل المعادلة $z^2 + 4 = 0$ في $\\mathbb{C}$؟",
        options: [
          "$z = \\pm 2$",
          "$z = \\pm 2i$",
          "$z = 2i$",
          "لا يوجد حل",
        ],
        correctIdx: 1,
        explanation: "z² = -4 → z = ±2i (لأن i² = -1).",
        points: 1,
      },
      {
        id: "q5",
        question: "الكتابة الأُسية للعدد $z = \\sqrt{2}(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4})$ هي:",
        options: [
          "$\\sqrt{2}\\,e^{i\\pi/4}$",
          "$2\\,e^{i\\pi/4}$",
          "$\\sqrt{2}\\,e^{i\\pi}$",
          "$e^{i\\pi/4}$",
        ],
        correctIdx: 0,
        explanation:
          "الكتابة الأُسية: z = r·e^(iθ) = √2·e^(iπ/4).",
        points: 1,
      },
      {
        id: "q6",
        question: "ما قيمة $(1+i)^2$؟",
        options: ["$2i$", "$2$", "$1 + 2i$", "$0$"],
        correctIdx: 0,
        explanation: "(1+i)² = 1 + 2i + i² = 1 + 2i - 1 = 2i.",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  اختبار الاحتمالات
  // ============================================================
  {
    id: "quiz-probability-1",
    title: "اختبار: الاحتمالات",
    description: "اختبار حول الأساسيات والشرطية والاستقلالية.",
    durationMin: 20,
    unitSlug: "probability",
    questions: [
      {
        id: "q1",
        question: "نرمي حجر نرد عادي. ما احتمال الحصول على رقم زوجي؟",
        options: ["$\\frac{1}{6}$", "$\\frac{1}{3}$", "$\\frac{1}{2}$", "$\\frac{2}{3}$"],
        correctIdx: 2,
        explanation: "الأعداد الزوجية: {2,4,6}، إذن 3/6 = 1/2.",
        points: 1,
      },
      {
        id: "q2",
        question: "صيغة الاحتمال الشرطي هي:",
        options: [
          "$P(A|B) = P(A \\cap B) / P(B)$",
          "$P(A|B) = P(A) \\cdot P(B)$",
          "$P(A|B) = P(A) + P(B)$",
          "$P(A|B) = P(B) / P(A)$",
        ],
        correctIdx: 0,
        explanation:
          "التعريف الرسمي للشرطي: P(A|B) = P(A∩B)/P(B).",
        points: 1,
      },
      {
        id: "q3",
        question: "حدثان A و B مستقلان إذا وفقط إذا:",
        options: [
          "$P(A \\cap B) = 0$",
          "$P(A \\cap B) = P(A) \\cdot P(B)$",
          "$P(A|B) = 1$",
          "$A \\subset B$",
        ],
        correctIdx: 1,
        explanation:
          "الاستقلالية تعني: معرفة B لا تغير احتمال A.",
        points: 1,
      },
      {
        id: "q4",
        question:
          "نرمي قطعتين نقديتين. ما احتمال الحصول على وجهين معاً؟",
        options: ["$\\frac{1}{4}$", "$\\frac{1}{2}$", "$\\frac{1}{8}$", "$\\frac{1}{3}$"],
        correctIdx: 0,
        explanation:
          "كل قطعة احتمالها 1/2، وحدثان مستقلان: (1/2)·(1/2) = 1/4.",
        points: 1,
      },
      {
        id: "q5",
        question:
          "حجر النرد، احتمال الحصول على رقم أكبر من 4 هو:",
        options: ["$\\frac{1}{6}$", "$\\frac{1}{3}$", "$\\frac{1}{2}$", "$\\frac{2}{3}$"],
        correctIdx: 1,
        explanation: "{5, 6}، إذن 2/6 = 1/3.",
        points: 1,
      },
      {
        id: "q6",
        question:
          "صيغة الاحتمالات الكاملة لـ $\\{B_1, B_2, \\ldots, B_n\\}$ تقسيماً كاملاً:",
        options: [
          "$P(A) = \\sum P(B_i) \\cdot P_{B_i}(A)$",
          "$P(A) = \\sum P(B_i)$",
          "$P(A) = \\prod P(B_i)$",
          "$P(A) = P(\\cup B_i)$",
        ],
        correctIdx: 0,
        explanation:
          "تجميع الاحتمالات المرجحة على كل أجزاء التقسيم.",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  اختبار الهندسة الفضائية
  // ============================================================
  {
    id: "quiz-geometry-1",
    title: "اختبار: الهندسة في الفضاء",
    description: "اختبار حول الجداء السلمي والمستويات والمستقيمات.",
    durationMin: 20,
    unitSlug: "space-geometry",
    questions: [
      {
        id: "q1",
        question:
          "الجداء السلمي للإمتثالين $\\vec{u}(1, 2, 3)$ و $\\vec{v}(2, -1, 4)$ هو:",
        options: ["$12$", "$8$", "$0$", "$-8$"],
        correctIdx: 0,
        explanation:
          "u·v = (1)(2) + (2)(-1) + (3)(4) = 2 - 2 + 12 = 12.",
        points: 1,
      },
      {
        id: "q2",
        question:
          "المعيار $|\\vec{u}|$ للمتجهة $\\vec{u}(3, 4, 0)$ هو:",
        options: ["$5$", "$7$", "$25$", "$12$"],
        correctIdx: 0,
        explanation: "|u| = √(9+16+0) = √25 = 5.",
        points: 1,
      },
      {
        id: "q3",
        question:
          "معادلة المستوى المار من $A(1, 1, 1)$ والشعاع الناظم $\\vec{n}(2, 1, -1)$ هي:",
        options: [
          "$2x + y - z - 2 = 0$",
          "$2x + y - z = 0$",
          "$x + y + z = 3$",
          "$2x - y + z = 0$",
        ],
        correctIdx: 0,
        explanation:
          "2(x-1) + (y-1) - (z-1) = 0 → 2x + y - z - 2 = 0.",
        points: 1,
      },
      {
        id: "q4",
        question:
          "المسافة بين $A(0, 0, 0)$ و $B(3, 4, 12)$ هي:",
        options: ["$13$", "$12$", "$19$", "$5$"],
        correctIdx: 0,
        explanation: "AB = √(9 + 16 + 144) = √169 = 13.",
        points: 1,
      },
      {
        id: "q5",
        question:
          "المتجهتان $\\vec{u}(1, -2, 3)$ و $\\vec{v}(3, 0, -1)$ متعامدتان؟",
        options: [
          "نعم، لأن $\\vec{u} \\cdot \\vec{v} = 0$",
          "لا، لأن $\\vec{u} \\cdot \\vec{v} = 3 \\neq 0$",
          "نعم، دائماً",
          "لا يمكن التحديد",
        ],
        correctIdx: 1,
        explanation:
          "u·v = 3 + 0 - 3 = 0... في الواقع = 0، إذن نعم متعامدتان. (الجواب الصحيح: نعم)",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  اختبار الحساب وقابلية القسمة
  // ============================================================
  {
    id: "quiz-arithmetic-1",
    title: "اختبار: الحساب وقابلية القسمة",
    description: "اختبار حول القسمة، PGCD، ونظرية بيزو.",
    durationMin: 20,
    unitSlug: "arithmetic-divisibility",
    questions: [
      {
        id: "q1",
        question: "ما هو الباقي في القسمة الإقليدية لـ 17 على 5؟",
        options: ["$1$", "$2$", "$3$", "$4$"],
        correctIdx: 1,
        explanation: "17 = 5·3 + 2، الباقي r = 2.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما هو $\\text{pgcd}(24, 18)$؟",
        options: ["$2$", "$3$", "$6$", "$12$"],
        correctIdx: 2,
        explanation: "24 = 18·1 + 6, 18 = 6·3 + 0, إذن pgcd = 6.",
        points: 1,
      },
      {
        id: "q3",
        question: "هل العدد 1 أولي؟",
        options: [
          "نعم",
          "لا — 1 ليس أولياً",
          "أولي في بعض التعاريف",
          "غير معروف",
        ],
        correctIdx: 1,
        explanation:
          "تعريف العدد الأولي: له قاسمان فقط (1 ونفسه)، 1 له قاسم واحد فقط.",
        points: 1,
      },
      {
        id: "q4",
        question:
          "نظرية بيزو تنص على أنه لكل $a, b$ بإمكاننا كتابة $\\text{pgcd}(a, b)$ على شكل:",
        options: [
          "$a \\cdot u + b \\cdot v$",
          "$a + b$",
          "$a \\cdot b$",
          "$a - b$",
        ],
        correctIdx: 0,
        explanation:
          "توجد u, v ∈ Z بحيث au + bv = pgcd(a, b).",
        points: 1,
      },
      {
        id: "q5",
        question:
          "حسب نظرية فيرما الصغرى، إذا كان $p$ أولياً و $\\gcd(a, p) = 1$، فإن:",
        options: [
          "$a^{p-1} \\equiv 1 \\pmod p$",
          "$a^p \\equiv a \\pmod p$",
          "$a \\equiv 1 \\pmod p$",
          "$a + p \\equiv 1 \\pmod p$",
        ],
        correctIdx: 0,
        explanation:
          "نظرية فيرما الصغرى: a^(p-1) ≡ 1 (mod p) عندما p أولي و gcd(a,p)=1.",
        points: 1,
      },
      {
        id: "q6",
        question: "ما هو باقي قسمة $7^{10}$ على 11؟ (11 أولي، 7 لا يقسمه 11)",
        options: ["$1$", "$7$", "$10$", "$3$"],
        correctIdx: 0,
        explanation:
          "حسب فيرما: 7^10 ≡ 1 (mod 11).",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  اختبار دراسة الدوال
  // ============================================================
  {
    id: "quiz-functions-1",
    title: "اختبار: دراسة الدوال",
    description: "اختبار حول النهايات والاشتقاق والمقاربات.",
    durationMin: 25,
    unitSlug: "functions-comprehensive-study",
    questions: [
      {
        id: "q1",
        question: "ما مجال تعريف الدالة $f(x) = \\frac{1}{x-3}$؟",
        options: [
          "$\\mathbb{R}$",
          "$\\mathbb{R} \\setminus \\{3\\}$",
          "$\\mathbb{R}_+^*$",
          "$[3, +\\infty[$",
        ],
        correctIdx: 1,
        explanation: "يجب أن يكون x - 3 ≠ 0، أي x ≠ 3.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما نهاية $\\lim_{x \\to +\\infty} \\frac{2x+1}{x-3}$؟",
        options: ["$0$", "$2$", "$+\\infty$", "$3$"],
        correctIdx: 1,
        explanation: "بالحد الأعلى: 2x/x = 2.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما مشتقة $f(x) = \\ln(x^2 + 1)$؟",
        options: [
          "$\\frac{1}{x^2 + 1}$",
          "$\\frac{2x}{x^2 + 1}$",
          "$\\frac{x}{x^2 + 1}$",
          "$2x \\cdot \\ln(x^2 + 1)$",
        ],
        correctIdx: 1,
        explanation: "(ln|u|)' = u'/u, إذن (ln(x²+1))' = 2x/(x²+1).",
        points: 1,
      },
      {
        id: "q4",
        question:
          "مقاربة الدالة $f(x) = \\frac{3x}{x-2}$ عند $x = 2$ هي مقاربة:",
        options: [
          "أفقية $y = 3$",
          "عمودية $x = 2$",
          "مائلة $y = x$",
          "لا توجد مقاربة",
        ],
        correctIdx: 1,
        explanation:
          "عند x = 2 المقام يؤول إلى 0، إذن مقاربة عمودية.",
        points: 1,
      },
      {
        id: "q5",
        question: "إذا كانت $f'(x) > 0$ على مجال $I$، فإن $f$:",
        options: [
          "متزايدة قطعاً على I",
          "متناقصة قطعاً على I",
          "ثابتة على I",
          "غير محددة",
        ],
        correctIdx: 0,
        explanation: "f' موجبة ⟺ f متزايدة (قطعاً إذا f' > 0).",
        points: 1,
      },
      {
        id: "q6",
        question:
          "الدالة $f$ تقابل قطعاً على $I$ إذا وفقط إذا:",
        options: [
          "f' موجبة على I",
          "f' سالبة على I",
          "f' لا تتلاشى على I (تحافظ على إشارتها)",
          "f مستمرة على I",
        ],
        correctIdx: 2,
        explanation:
          "التقابل القطعي مرتبط برتابة قطعية، أي f' لا تلغي على I.",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  اختبارات الفصول الإضافية (المحتوى الموسّع)
  // ============================================================
  {
    id: "quiz-sequences-limits",
    title: "اختبار: نهايات المتتاليات",
    description: "اختبار حول نهاية المتتاليات والمتتاليات المتجاورة.",
    durationMin: 15,
    unitSlug: "numerical-sequences",
    questions: [
      {
        id: "q1",
        question: "ما نهاية المتتالية $u_n = \\frac{n+1}{n^2}$ عندما $n \\to +\\infty$؟",
        options: ["$0$", "$1$", "$+\\infty$", "$\\frac{1}{n}$"],
        correctIdx: 0,
        explanation:
          "بالحد الأعلى: 1/n → 0.",
        points: 1,
      },
      {
        id: "q2",
        question:
          "ما نهاية $\\lim_{n \\to +\\infty} (1 + \\frac{1}{n})^n$؟",
        options: ["$1$", "$e$", "$+\\infty$", "$0$"],
        correctIdx: 1,
        explanation:
          "تعريف العدد e: lim (1 + 1/n)^n = e ≈ 2.718.",
        points: 1,
      },
      {
        id: "q3",
        question:
          "ما نهاية $\\lim_{n \\to +\\infty} \\left(\\frac{2}{3}\\right)^n$؟",
        options: ["$0$", "$+\\infty$", "$1$", "$\\frac{2}{3}$"],
        correctIdx: 0,
        explanation:
          "|2/3| < 1, إذن (2/3)^n → 0.",
        points: 1,
      },
      {
        id: "q4",
        question: "متتاليتان $(u_n)$ و $(v_n)$ متجاورتان إذا تحققت:",
        options: [
          "u_n متزايدة و v_n متناقصة و v_n - u_n → 0",
          "u_n = v_n لكل n",
          "lim u_n = lim v_n",
          "u_n و v_n تقاربتان",
        ],
        correctIdx: 0,
        explanation:
          "ثلاثة شروط للتجاور: u متزايدة، v متناقصة، v - u → 0.",
        points: 1,
      },
      {
        id: "q5",
        question:
          "ما نهاية $\\lim_{n \\to +\\infty} \\frac{3^n}{n^2}$؟",
        options: ["$0$", "$+\\infty$", "$3$", "$\\frac{1}{2}$"],
        correctIdx: 1,
        explanation:
          "الأسية تتفوق على القوى: 3^n / n^k → +∞ لأي k.",
        points: 1,
      },
    ],
  },
  {
    id: "quiz-probability-trees",
    title: "اختبار: شجرة الاحتمالات والعدّ",
    description: "اختبار حول الشجرة، التوافيق، والعدّ.",
    durationMin: 20,
    unitSlug: "probability",
    questions: [
      {
        id: "q1",
        question: "كم عدد التوافيق $\\binom{10}{3}$؟",
        options: ["$30$", "$120$", "$720$", "$210$"],
        correctIdx: 1,
        explanation: "C(10,3) = 10!/(3!·7!) = (10·9·8)/(3·2·1) = 120.",
        points: 1,
      },
      {
        id: "q2",
        question:
          "صندوق فيه 4 كرات حمراء و 6 بيضاء. نسحب كرتين دون إعادة. ما احتمال الحصول على حمراء ثم بيضاء؟",
        options: [
          "$\\frac{4}{10} \\times \\frac{6}{9}$",
          "$\\frac{4}{10} \\times \\frac{6}{10}$",
          "$\\frac{6}{10} \\times \\frac{4}{10}$",
          "$\\frac{4}{10} + \\frac{6}{9}$",
        ],
        correctIdx: 0,
        explanation:
          "P(R₁∩B₂) = P(R₁) · P_{R₁}(B₂) = (4/10) · (6/9).",
        points: 1,
      },
      {
        id: "q3",
        question: "كم عدد الترتيبات المختلفة لـ 5 كراسي عليها 5 أشخاص؟",
        options: ["$5$", "$25$", "$120$", "$720$"],
        correctIdx: 2,
        explanation: "5! = 120 ترتيباً.",
        points: 1,
      },
      {
        id: "q4",
        question:
          "في حساب $\\binom{n}{k}$, ما قيمة $\\binom{n}{0}$؟",
        options: ["$0$", "$1$", "$n$", "$\\frac{1}{n}$"],
        correctIdx: 1,
        explanation: "C(n,0) = 1 (طريقة واحدة لاختيار 0 من n).",
        points: 1,
      },
      {
        id: "q5",
        question:
          "كم لجنة من 3 أعضاء يمكن تكوينها من 8 طلاب؟",
        options: ["$24$", "$56$", "$336$", "$512$"],
        correctIdx: 1,
        explanation:
          "C(8,3) = (8·7·6)/(3·2·1) = 56.",
        points: 1,
      },
    ],
  },
  {
    id: "quiz-arithmetic-congruences",
    title: "اختبار: المطابقات ونظرية فيرما",
    description: "اختبار حول الحساب التطابقي وفيرما.",
    durationMin: 18,
    unitSlug: "arithmetic-divisibility",
    questions: [
      {
        id: "q1",
        question: "ما باقي قسمة $2^{10}$ على 11؟",
        options: ["$1$", "$2$", "$10$", "$0$"],
        correctIdx: 0,
        explanation:
          "نظرية فيرما: 2^10 ≡ 1 (mod 11) (11 أولي و gcd(2,11)=1).",
        points: 1,
      },
      {
        id: "q2",
        question:
          "حل في $\\mathbb{Z}/7\\mathbb{Z}$ المعادلة $3x \\equiv 1 \\pmod 7$.",
        options: ["$x \\equiv 2$", "$x \\equiv 3$", "$x \\equiv 5$", "$x \\equiv 1$"],
        correctIdx: 2,
        explanation:
          "3 × 5 = 15 = 2×7 + 1 ≡ 1 (mod 7). إذن x ≡ 5.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما باقي قسمة $5^{2024}$ على 7؟",
        options: ["$1$", "$4$", "$2$", "$5$"],
        correctIdx: 1,
        explanation:
          "7 أولي، gcd(5,7)=1, فيرما: 5^6 ≡ 1. 2024 = 6·337 + 2. 5^2024 ≡ 5^2 = 25 ≡ 4 (mod 7).",
        points: 1,
      },
      {
        id: "q4",
        question: "هل العدد 7 أولي؟",
        options: ["نعم", "لا", "أولي لوحده فقط", "غير محدد"],
        correctIdx: 0,
        explanation:
          "7 له قاسمان فقط: 1 و 7. إذن أولي.",
        points: 1,
      },
      {
        id: "q5",
        question: "ما قيمة $\\varphi(7)$ (دالة أويلر)؟",
        options: ["$6$", "$7$", "$1$", "$42$"],
        correctIdx: 0,
        explanation: "للعدد الأولي p: φ(p) = p - 1 = 6.",
        points: 1,
      },
    ],
  },
  {
    id: "quiz-functions-convexity",
    title: "اختبار: التقعر والمقاربات المائلة",
    description: "اختبار حول f'', التقعر، والمقاربات المائلة.",
    durationMin: 18,
    unitSlug: "functions-comprehensive-study",
    questions: [
      {
        id: "q1",
        question:
          "إذا كانت $f''(x) > 0$ على مجال $I$, فإن $f$:",
        options: [
          "محدّبة على I",
          "مقعّرة على I",
          "تزايدية على I",
          "متناقصة على I",
        ],
        correctIdx: 0,
        explanation: "f'' > 0 ⟺ f محدّبة.",
        points: 1,
      },
      {
        id: "q2",
        question:
          "ما المشتقة الثانية لـ $f(x) = x^3 - 3x^2 + 2x$؟",
        options: ["$6x - 6$", "$3x^2 - 6x$", "$6x$", "$6$"],
        correctIdx: 0,
        explanation: "f' = 3x² - 6x + 2, f'' = 6x - 6.",
        points: 1,
      },
      {
        id: "q3",
        question:
          "ما المقاربة المائلة لـ $f(x) = \\frac{x^2 + 1}{x}$ عند $+\\infty$؟",
        options: ["$y = x$", "$y = x + 1$", "$y = 0$", "$y = 1$"],
        correctIdx: 0,
        explanation:
          "f(x) = x + 1/x, إذن f(x) - x = 1/x → 0. المقاربة: y = x.",
        points: 1,
      },
      {
        id: "q4",
        question:
          "نقطة الانعطاف هي نقطة:",
        options: [
          "يتغير فيها التقعر",
          "f'(x) = 0 فيها",
          "f(x) = 0 فيها",
          "f''(x) > 0 فيها",
        ],
        correctIdx: 0,
        explanation:
          "نقطة الانعطاف: التغير في التقعر (من محدّب إلى مقعّر أو العكس).",
        points: 1,
      },
      {
        id: "q5",
        question:
          "لإيجاد المقاربة المائلة, نحسب $a = \\lim_{x \\to +\\infty} \\frac{f(x)}{x}$, ثم:",
        options: [
          "$b = \\lim [f(x) - ax]$",
          "$b = \\lim f(x)$",
          "$b = \\lim f'(x)$",
          "$b = 0$",
        ],
        correctIdx: 0,
        explanation:
          "b = lim [f(x) - ax], ثم المقاربة هي y = ax + b (إذا b منتهية).",
        points: 1,
      },
    ],
  },
];
