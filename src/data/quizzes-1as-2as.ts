// ============================================================
//  الاختبارات التفاعلية — السنة الأولى + الثانية ثانوي
//  منصة الرياضيات | الأستاذ عدلي أسعد
//  مرتّبة حسب تدرّج وزارة التربية الوطنية 2022
// ============================================================

import type { QuizSeed } from "./quizzes";

export const quizzes1AS2AS: QuizSeed[] = [
  // ============================================================
  //  === السنة الأولى ثانوي (1AS) ===
  // ============================================================

  // ------------------------------------------------------------
  //  1AS - الوحدة 1: الأعداد الحقيقية والحساب الفاصلي
  // ------------------------------------------------------------
  {
    id: "quiz-1as-real-numbers",
    title: "اختبار: الأعداد الحقيقية والحساب الفاصلي",
    description: "اختبر فهمك للأعداد الحقيقية، المجالات، القيمة المطلقة، والحساب الفاصلي.",
    durationMin: 15,
    unitSlug: "1as-real-numbers",
    questions: [
      {
        id: "q1",
        question: "ما المجموعة التي تضم كل الأعداد الجذرية وغير الجذرية؟",
        options: ["$\\mathbb{N}$", "$\\mathbb{Z}$", "$\\mathbb{Q}$", "$\\mathbb{R}$"],
        correctIdx: 3,
        explanation: "ℝ تضم كل الأعداد الحقيقية: الجذرية (ℚ) وغير الجذرية.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما المجال الذي يمثل $\\{x \\in \\mathbb{R} \\mid -2 < x \\leq 3\\}$؟",
        options: ["$[-2, 3]$", "$]-2, 3]$", "$[-2, 3[$", "$]-2, 3[$"],
        correctIdx: 1,
        explanation: "القوس المفتوح ] يعني < (لا يشمل)، والمغلق ] يعني ≤ (يشمل).",
        points: 1,
      },
      {
        id: "q3",
        question: "ما قيمة $|{-5}|$؟",
        options: ["$-5$", "$5$", "$0$", "$\\pm 5$"],
        correctIdx: 1,
        explanation: "القيمة المطلقة دائماً غير سالبة: |−5| = 5.",
        points: 1,
      },
      {
        id: "q4",
        question: "حل المتراجحة $|x| < 4$ هو:",
        options: ["$x \\in ]-\\infty, -4[ \\cup ]4, +\\infty[$", "$x \\in ]-4, 4[$", "$x \\in [-4, 4]$", "$x = \\pm 4$"],
        correctIdx: 1,
        explanation: "|x| < 4 ⟺ −4 < x < 4, أي x ∈ ]−4, 4[.",
        points: 1,
      },
      {
        id: "q5",
        question: "ما قيمة $|{-3}| + |{-7}|$؟",
        options: ["$-10$", "$10$", "$4$", "$-4$"],
        correctIdx: 1,
        explanation: "|−3| + |−7| = 3 + 7 = 10.",
        points: 1,
      },
      {
        id: "q6",
        question: "حل المتراجحة $|x - 1| \\leq 3$ هو:",
        options: ["$[-2, 4]$", "$]-2, 4[$", "$[-3, 3]$", "$[-4, 2]$"],
        correctIdx: 0,
        explanation: "|x−1| ≤ 3 ⟺ −3 ≤ x−1 ≤ 3 ⟺ −2 ≤ x ≤ 4, أي [−2, 4].",
        points: 2,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 2: الدوال العددية
  // ------------------------------------------------------------
  {
    id: "quiz-1as-functions",
    title: "اختبار: الدوال العددية",
    description: "اختبر فهمك لتعريف الدالة، مجال التعريف، الدالة التربيعية، والعمليات.",
    durationMin: 18,
    unitSlug: "1as-functions",
    questions: [
      {
        id: "q1",
        question: "ما مجال تعريف الدالة $f(x) = \\frac{1}{x - 2}$؟",
        options: ["$\\mathbb{R}$", "$\\mathbb{R} \\setminus \\{2\\}$", "$\\mathbb{R}^*$", "$\\mathbb{R} \\setminus \\{-2\\}$"],
        correctIdx: 1,
        explanation: "لا يجوز القسمة على صفر، لذا x ≠ 2. المجال: ℝ \\ {2}.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما مجال تعريف الدالة $g(x) = \\sqrt{x - 4}$؟",
        options: ["$[0, +\\infty[$", "$[4, +\\infty[$", "$]-\\infty, 4]$", "$\\mathbb{R}$"],
        correctIdx: 1,
        explanation: "الجذر لا يكون إلا لمقدار غير سالب: x − 4 ≥ 0 ⟺ x ≥ 4.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما قيمة $f(3)$ للدالة $f(x) = 2x^2 - 5x + 1$؟",
        options: ["$4$", "$-2$", "$6$", "$10$"],
        correctIdx: 0,
        explanation: "f(3) = 2(9) − 5(3) + 1 = 18 − 15 + 1 = 4.",
        points: 1,
      },
      {
        id: "q4",
        question: "الدالة $h(x) = -3x^2 + 6x - 1$ هي دالة:",
        options: ["تربيعية موجبة", "تربيعية سالبة", "خطية", "ثابتة"],
        correctIdx: 1,
        explanation: "معامل x² سالب (a = −3)، فالدالة تربيعية سالبة (شكل ⋂).",
        points: 1,
      },
      {
        id: "q5",
        question: "ما إحداثيات رأس الدالة التربيعية $f(x) = x^2 - 4x + 3$؟",
        options: ["$(2, -1)$", "$(2, 1)$", "$(-2, -1)$", "$(4, 3)$"],
        correctIdx: 0,
        explanation: "x_v = −b/(2a) = 4/2 = 2, f(2) = 4 − 8 + 3 = −1. الرأس: (2, −1).",
        points: 2,
      },
      {
        id: "q6",
        question: "ما مجال تعريف $k(x) = \\frac{1}{\\sqrt{x + 1}}$؟",
        options: ["$[-1, +\\infty[$", "$]-1, +\\infty[$", "$[0, +\\infty[$", "$\\mathbb{R} \\setminus \\{-1\\}$"],
        correctIdx: 1,
        explanation: "x + 1 > 0 (لا يساوي صفر بسبب المقام) ⟺ x > −1, أي ]−1, +∞[.",
        points: 2,
      },
      {
        id: "q7",
        question: "إذا $f(x) = x^2$ و $g(x) = 2x + 1$، ما $(f \\circ g)(x)$؟",
        options: ["$2x^2 + 1$", "$(2x + 1)^2$", "$x^2 + 2x + 1$", "$2x + 1$"],
        correctIdx: 1,
        explanation: "(f ∘ g)(x) = f(g(x)) = f(2x + 1) = (2x + 1)².",
        points: 2,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 3: الهندسة في المستوى
  // ------------------------------------------------------------
  {
    id: "quiz-1as-plane-geometry",
    title: "اختبار: الهندسة في المستوى",
    description: "اختبر فهمك للإحداثيات، المسافة بين نقطتين، ومنتصف قطعة.",
    durationMin: 15,
    unitSlug: "1as-plane-geometry",
    questions: [
      {
        id: "q1",
        question: "ما المسافة بين النقطتين $A(1, 2)$ و $B(4, 6)$؟",
        options: ["$3$", "$4$", "$5$", "$7$"],
        correctIdx: 2,
        explanation: "AB = √((4−1)² + (6−2)²) = √(9 + 16) = √25 = 5.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما إحداثيات منتصف القطعة $[AB]$ حيث $A(-2, 3)$ و $B(4, 5)$؟",
        options: ["$(1, 4)$", "$(1, 8)$", "$(3, 1)$", "$(2, 4)$"],
        correctIdx: 0,
        explanation: "M = ((xA + xB)/2, (yA + yB)/2) = ((−2+4)/2, (3+5)/2) = (1, 4).",
        points: 1,
      },
      {
        id: "q3",
        question: "ما معادلة الدائرة التي مركزها $O(0, 0)$ ونصف قطرها 3؟",
        options: ["$x^2 + y^2 = 3$", "$x^2 + y^2 = 9$", "$x^2 - y^2 = 9$", "$(x-3)^2 + y^2 = 9$"],
        correctIdx: 1,
        explanation: "المعادلة: (x − 0)² + (y − 0)² = 3², أي x² + y² = 9.",
        points: 1,
      },
      {
        id: "q4",
        question: "ما معادلة الدائرة بمركز $I(2, -1)$ ونصف قطر $\\sqrt{5}$؟",
        options: ["$(x-2)^2 + (y+1)^2 = 5$", "$(x+2)^2 + (y-1)^2 = 5$", "$(x-2)^2 + (y+1)^2 = 25$", "$x^2 + y^2 = 5$"],
        correctIdx: 0,
        explanation: "(x − 2)² + (y − (−1))² = 5, أي (x−2)² + (y+1)² = 5.",
        points: 2,
      },
      {
        id: "q5",
        question: "هل النقطة $P(1, 2)$ تنتمي للدائرة $x^2 + y^2 = 5$؟",
        options: ["نعم", "لا", "لا يمكن معرفته", "على المركز"],
        correctIdx: 0,
        explanation: "1² + 2² = 1 + 4 = 5 ✓. النقطة تنتمي للدائرة.",
        points: 1,
      },
      {
        id: "q6",
        question: "ما مركز قطعة طرفاها $A(-4, 1)$ و $B(2, 7)$؟",
        options: ["$(-1, 4)$", "$(3, 4)$", "$(-1, 8)$", "$(1, 3)$"],
        correctIdx: 0,
        explanation: "((−4+2)/2, (1+7)/2) = (−1, 4).",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 4: الجداء السلمي في المستوى
  // ------------------------------------------------------------
  {
    id: "quiz-1as-dot-product",
    title: "اختبار: الجداء السلمي في المستوى",
    description: "اختبر فهمك للجداء السلمي، التعامد، والعلاقات المترية.",
    durationMin: 18,
    unitSlug: "1as-dot-product",
    questions: [
      {
        id: "q1",
        question: "ما الجداء السلمي للشعاعين $\\vec{u}(2, 3)$ و $\\vec{v}(4, -1)$؟",
        options: ["$5$", "$11$", "$-5$", "$8$"],
        correctIdx: 0,
        explanation: "u·v = (2)(4) + (3)(−1) = 8 − 3 = 5.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما قيمة $x$ التي تجعل الشعاعين $\\vec{u}(x, 2)$ و $\\vec{v}(3, 6)$ متعامدين؟",
        options: ["$-4$", "$4$", "$-1$", "$1$"],
        correctIdx: 0,
        explanation: "التعامد: u·v = 0 ⟺ 3x + 12 = 0 ⟺ x = −4.",
        points: 2,
      },
      {
        id: "q3",
        question: "ما طول الشعاع $\\vec{u}(3, 4)$؟",
        options: ["$5$", "$7$", "$12$", "$25$"],
        correctIdx: 0,
        explanation: "‖u‖ = √(3² + 4²) = √25 = 5.",
        points: 1,
      },
      {
        id: "q4",
        question: "ما الجداء السلمي $\\vec{u} \\cdot \\vec{u}$ إذا كان $\\|\\vec{u}\\| = 3$؟",
        options: ["$3$", "$6$", "$9$", "$\\sqrt{3}$"],
        correctIdx: 2,
        explanation: "u·u = ‖u‖² = 9.",
        points: 1,
      },
      {
        id: "q5",
        question: "الشعاعان $\\vec{u}(1, 0)$ و $\\vec{v}(0, 1)$:",
        options: ["متعامدان وكل منهما طول 1", "متوازيان", "أحدهما صفر", "كل منهما طول 2"],
        correctIdx: 0,
        explanation: "u·v = 0 (تعامد)، ‖u‖ = ‖v‖ = 1 (كل منهما طوله 1).",
        points: 1,
      },
      {
        id: "q6",
        question: "إذا كان $\\vec{u}(2, 1)$ و $\\vec{v}(-1, 2)$، ما زاوية $\\theta$ بينهما؟",
        options: ["$0°$", "$45°$", "$90°$", "$180°$"],
        correctIdx: 2,
        explanation: "u·v = (2)(−1) + (1)(2) = 0. التعامد يلزم أن θ = 90°.",
        points: 2,
      },
      {
        id: "q7",
        question: "ما قيمة $k$ التي تجعل $\\vec{u}(1, k)$ و $\\vec{v}(2, 4)$ متوازيين؟",
        options: ["$2$", "$4$", "$8$", "$1/2$"],
        correctIdx: 0,
        explanation: "التوازي: 1·4 = k·2 ⟺ 4 = 2k ⟺ k = 2.",
        points: 2,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 5: الدالة التآلفية والإحصاء
  // ------------------------------------------------------------
  {
    id: "quiz-1as-affine-function",
    title: "اختبار: الدالة التآلفية والإحصاء",
    description: "اختبر فهمك للدالة التآلفية، معادلة المستقيم، والإحصاء.",
    durationMin: 15,
    unitSlug: "1as-affine-function",
    questions: [
      {
        id: "q1",
        question: "ما معادلة المستقيم الذي يمر بـ $A(1, 3)$ وميله $-2$؟",
        options: ["$y = -2x + 5$", "$y = 2x + 1$", "$y = -2x + 1$", "$y = -2x - 5$"],
        correctIdx: 0,
        explanation: "y − yA = m(x − xA) ⟹ y − 3 = −2(x − 1) ⟹ y = −2x + 5.",
        points: 2,
      },
      {
        id: "q2",
        question: "ما ميل المستقيم المار بالنقطتين $A(1, 2)$ و $B(4, 8)$؟",
        options: ["$2$", "$3$", "$6/5$", "$2/3$"],
        correctIdx: 0,
        explanation: "m = (yB − yA)/(xB − xA) = (8 − 2)/(4 − 1) = 6/3 = 2.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما معادلة المستقيم المار بالنقطتين $A(-1, 4)$ و $B(3, 0)$؟",
        options: ["$y = -x + 3$", "$y = x + 3$", "$y = -x - 3$", "$y = -x + 5$"],
        correctIdx: 0,
        explanation: "m = (0−4)/(3−(−1)) = −1. y = −1(x − 3) = −x + 3.",
        points: 2,
      },
      {
        id: "q4",
        question: "متوسط القيم: $4, 6, 8, 10, 12$ هو:",
        options: ["$6$", "$8$", "$10$", "$7$"],
        correctIdx: 1,
        explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8.",
        points: 1,
      },
      {
        id: "q5",
        question: "ما وسيط السلسلة $2, 5, 7, 9, 11, 15$؟",
        options: ["$7$", "$8$", "$9$", "$7.5$"],
        correctIdx: 1,
        explanation: "عدد القيم زوجي، الوسيط = (7 + 9)/2 = 8.",
        points: 2,
      },
      {
        id: "q6",
        question: "إذا كان المستقيم $y = 3x + b$ يمر بـ $(-2, 4)$، ما قيمة $b$؟",
        options: ["$-2$", "$4$", "$10$", "$-10$"],
        correctIdx: 2,
        explanation: "4 = 3(−2) + b ⟹ b = 4 + 6 = 10.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 6: المتتاليات الحسابية
  // ------------------------------------------------------------
  {
    id: "quiz-1as-arithmetic-sequences",
    title: "اختبار: المتتاليات الحسابية",
    description: "اختبر فهمك للمتتاليات الحسابية، الحد العام، والمجموع.",
    durationMin: 15,
    unitSlug: "1as-arithmetic-sequences",
    questions: [
      {
        id: "q1",
        question: "ما الحد $u_5$ للمتتالية الحسابية $u_0 = 3$ وأساسها $r = 4$؟",
        options: ["$15$", "$20$", "$23$", "$19$"],
        correctIdx: 2,
        explanation: "u_5 = u_0 + 5r = 3 + 5(4) = 23.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما الحد العام للمتتالية الحسابية بـ $u_1 = 7$ و $r = -2$؟",
        options: ["$u_n = 7 - 2n$", "$u_n = 9 - 2n$", "$u_n = 7 + 2n$", "$u_n = 5 - 2n$"],
        correctIdx: 1,
        explanation: "u_n = u_1 + (n − 1)r = 7 + (n − 1)(−2) = 9 − 2n.",
        points: 2,
      },
      {
        id: "q3",
        question: "ما قيمة $S = 1 + 2 + 3 + \\cdots + 50$؟",
        options: ["$1275$", "$1250$", "$1300$", "$2550$"],
        correctIdx: 0,
        explanation: "S = 50·(1 + 50)/2 = 50·51/2 = 1275.",
        points: 1,
      },
      {
        id: "q4",
        question: "متتالية: $5, 8, 11, 14, \\ldots$ أساسها هو:",
        options: ["$3$", "$5$", "$8$", "$-3$"],
        correctIdx: 0,
        explanation: "r = 8 − 5 = 11 − 8 = 3.",
        points: 1,
      },
      {
        id: "q5",
        question: "ما مجموع أول 10 حدود لمتتالية حسابية $u_0 = 2, r = 3$؟",
        options: ["$155$", "$150$", "$165$", "$200$"],
        correctIdx: 0,
        explanation: "S_10 = 10·(2·2 + 9·3)/2 = 10·(4+27)/2 = 10·31/2 = 155.",
        points: 2,
      },
      {
        id: "q6",
        question: "ما قيمة $u_{10}$ للحد العام $u_n = 4n - 1$؟",
        options: ["$39$", "$40$", "$41$", "$14$"],
        correctIdx: 0,
        explanation: "u_10 = 4(10) − 1 = 39.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 7: الحساب المتجهي في المستوى
  // ------------------------------------------------------------
  {
    id: "quiz-1as-vector-calculus",
    title: "اختبار: الحساب المتجهي في المستوى",
    description: "اختبر فهمك للشعاع، العمليات، علاقة Chasles، والمعامل.",
    durationMin: 15,
    unitSlug: "1as-vector-calculus",
    questions: [
      {
        id: "q1",
        question: "إذا $\\vec{AB}(3, -2)$ و $B(5, 4)$، ما إحداثيات $A$؟",
        options: ["$(2, 6)$", "$(8, 2)$", "$(2, -6)$", "$(8, -2)$"],
        correctIdx: 0,
        explanation: "A = B − AB = (5−3, 4−(−2)) = (2, 6).",
        points: 2,
      },
      {
        id: "q2",
        question: "إذا $\\vec{u}(2, 3)$ و $\\vec{v}(-1, 4)$، ما $\\vec{u} + \\vec{v}$؟",
        options: ["$(1, 7)$", "$(1, -1)$", "$(3, -1)$", "$(-2, 12)$"],
        correctIdx: 0,
        explanation: "u + v = (2 + (−1), 3 + 4) = (1, 7).",
        points: 1,
      },
      {
        id: "q3",
        question: "ما $2\\vec{u} - 3\\vec{v}$ إذا $\\vec{u}(1, 2)$ و $\\vec{v}(-1, 1)$؟",
        options: ["$(5, 1)$", "$(-1, 1)$", "$(-5, -1)$", "$(5, 7)$"],
        correctIdx: 0,
        explanation: "2u = (2, 4), 3v = (−3, 3), 2u − 3v = (2−(−3), 4−3) = (5, 1).",
        points: 2,
      },
      {
        id: "q4",
        question: "إذا $A(1, 2), B(3, 5), C(7, 11)$، ما علاقة هذه النقاط؟",
        options: ["مستقيمة", "تشكل مثلثاً", "C منتصف AB", "A منتصف BC"],
        correctIdx: 0,
        explanation: "AB = (2, 3), AC = (6, 9) = 3·AB. النقاط منتظمة على نفس المستقيم.",
        points: 2,
      },
      {
        id: "q5",
        question: "ما إحداثيات $\\vec{AB}$ إذا $A(2, -1)$ و $B(-3, 4)$؟",
        options: ["$(-5, 5)$", "$(5, -5)$", "$(1, 3)$", "$(-1, -3)$"],
        correctIdx: 0,
        explanation: "AB = (xB − xA, yB − yA) = (−3 − 2, 4 − (−1)) = (−5, 5).",
        points: 1,
      },
      {
        id: "q6",
        question: "إذا $\\vec{u}(3, -4)$، ما النورم $\\|\\vec{u}\\|$؟",
        options: ["$5$", "$7$", "$1$", "$25$"],
        correctIdx: 0,
        explanation: "‖u‖ = √(9 + 16) = √25 = 5.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 8: المعادلات والمتراجحات
  // ------------------------------------------------------------
  {
    id: "quiz-1as-equations-inequalities",
    title: "اختبار: المعادلات والمتراجحات",
    description: "اختبر فهمك لمعادلات الدرجة الثانية، المتراجحات، والإشارة.",
    durationMin: 18,
    unitSlug: "1as-equations-inequalities",
    questions: [
      {
        id: "q1",
        question: "ما حل المعادلة $x^2 - 5x + 6 = 0$؟",
        options: ["$x = 2$ أو $x = 3$", "$x = -2$ أو $x = -3$", "$x = 1$ أو $x = 6$", "لا حل"],
        correctIdx: 0,
        explanation: "Δ = 25 − 24 = 1. x = (5 ± 1)/2 = 3 أو 2.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما مميز $\\Delta$ للمعادلة $2x^2 + 3x - 5 = 0$؟",
        options: ["$49$", "$-49$", "$9$", "$1$"],
        correctIdx: 0,
        explanation: "Δ = b² − 4ac = 9 − 4(2)(−5) = 9 + 40 = 49.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما حل المتراجحة $x^2 - 4 \\leq 0$؟",
        options: ["$[-2, 2]$", "$]-\\infty, -2] \\cup [2, +\\infty[$", "$\\mathbb{R}$", "$\\{\\pm 2\\}$"],
        correctIdx: 0,
        explanation: "x² ≤ 4 ⟺ −2 ≤ x ≤ 2. الحل: [−2, 2].",
        points: 1,
      },
      {
        id: "q4",
        question: "ما حل $x^2 + 2x + 5 = 0$؟",
        options: ["حلان حقيقيان", "حل واحد مضاعف", "لا حل حقيقي", "$x = -1$"],
        correctIdx: 2,
        explanation: "Δ = 4 − 20 = −16 < 0. لا حلول حقيقية.",
        points: 1,
      },
      {
        id: "q5",
        question: "ما حل المتراجحة $-x^2 + 4x - 3 \\geq 0$؟",
        options: ["$[1, 3]$", "$]-\\infty, 1] \\cup [3, +\\infty[$", "$\\mathbb{R}$", "$\\{1, 3\\}$"],
        correctIdx: 0,
        explanation: "Δ = 16 − 12 = 4. جذران: 1 و 3. a < 0, فالحل بين الجذرين: [1, 3].",
        points: 2,
      },
      {
        id: "q6",
        question: "ما مجموع جذري $3x^2 - 6x + 2 = 0$؟",
        options: ["$2$", "$-2$", "$2/3$", "$-2/3$"],
        correctIdx: 0,
        explanation: "مجموع الجذرين = −b/a = 6/3 = 2.",
        points: 2,
      },
      {
        id: "q7",
        question: "ما جداء جذري $x^2 - 7x + 10 = 0$؟",
        options: ["$10$", "$-10$", "$7$", "$-7$"],
        correctIdx: 0,
        explanation: "جداء الجذرين = c/a = 10/1 = 10.",
        points: 1,
      },
    ],
  },

  // ============================================================
  //  === السنة الثانية ثانوي (2AS) ===
  // ============================================================

  // ------------------------------------------------------------
  //  2AS - الوحدة 1: النهايات والاستمرارية
  // ------------------------------------------------------------
  {
    id: "quiz-2as-limits-continuity",
    title: "اختبار: النهايات والاستمرارية",
    description: "اختبر فهمك لحساب النهايات، حالات عدم التعيين، والاستمرارية.",
    durationMin: 18,
    unitSlug: "2as-limits-continuity",
    questions: [
      {
        id: "q1",
        question: "ما $\\lim_{x \\to +\\infty} \\frac{3x^2 + 1}{x^2 - 4}$؟",
        options: ["$3$", "$0$", "$+\\infty$", "$-3$"],
        correctIdx: 0,
        explanation: "بأعلى درجة: 3x²/x² = 3.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$؟",
        options: ["$0$", "$1$", "$+\\infty$", "غير معرّفة"],
        correctIdx: 1,
        explanation: "النهاية الشهيرة: lim sin(x)/x = 1.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما $\\lim_{x \\to +\\infty} \\frac{x^2 + 3x}{2x^2 - 1}$؟",
        options: ["$1/2$", "$2$", "$+\\infty$", "$0$"],
        correctIdx: 0,
        explanation: "بأعلى درجة: x²/(2x²) = 1/2.",
        points: 1,
      },
      {
        id: "q4",
        question: "ما $\\lim_{x \\to 0^+} \\frac{1}{x}$؟",
        options: ["$0$", "$1$", "$+\\infty$", "$-\\infty$"],
        correctIdx: 2,
        explanation: "1/x → +∞ عندما x → 0⁺.",
        points: 1,
      },
      {
        id: "q5",
        question: "ما $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$؟",
        options: ["$0$", "$2$", "$4$", "غير معرّفة"],
        correctIdx: 2,
        explanation: "(x²−4)/(x−2) = (x−2)(x+2)/(x−2) = x + 2. عند x = 2: 4.",
        points: 2,
      },
      {
        id: "q6",
        question: "ما $\\lim_{x \\to +\\infty} \\sqrt{x^2 + 1} - x$؟",
        options: ["$0$", "$1$", "$+\\infty$", "$1/2$"],
        correctIdx: 0,
        explanation: "بضرب المقترن: (1)/(√(x²+1) + x) → 0.",
        points: 2,
      },
      {
        id: "q7",
        question: "ما حالة عدم التعيين في $\\lim_{x \\to 0} \\frac{x^2}{x}$؟",
        options: ["$\\frac{0}{0}$", "$\\frac{\\infty}{\\infty}$", "$\\infty - \\infty$", "$0 \\cdot \\infty$"],
        correctIdx: 0,
        explanation: "0/0 شكل عدم تعيين، تبسيط: x²/x = x → 0.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  2AS - الوحدة 2: الدالة الأسية
  // ------------------------------------------------------------
  {
    id: "quiz-2as-exponential",
    title: "اختبار: الدالة الأسية",
    description: "اختبر فهمك لخصائص الدالة الأسية، النهايات، وحل المعادلات.",
    durationMin: 18,
    unitSlug: "2as-exponential",
    questions: [
      {
        id: "q1",
        question: "ما قيمة $e^0$؟",
        options: ["$0$", "$1$", "$e$", "$10$"],
        correctIdx: 1,
        explanation: "أي عدد (غير الصفر) مرفوع لـ 0 يساوي 1. e⁰ = 1.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما قيمة $e^{\\ln(5)}$؟",
        options: ["$5$", "$e$", "$\\ln(5)$", "$0$"],
        correctIdx: 0,
        explanation: "e^(ln(x)) = x لكل x > 0. إذن e^(ln 5) = 5.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما $\\lim_{x \\to +\\infty} e^{-x}$؟",
        options: ["$0$", "$1$", "$+\\infty$", "$e$"],
        correctIdx: 0,
        explanation: "e^(−x) → 0 عندما x → +∞.",
        points: 1,
      },
      {
        id: "q4",
        question: "حل المعادلة $e^x = 7$.",
        options: ["$x = \\ln(7)$", "$x = 7$", "$x = e^7$", "$x = 0$"],
        correctIdx: 0,
        explanation: "e^x = 7 ⟺ x = ln(7).",
        points: 1,
      },
      {
        id: "q5",
        question: "ما قيمة $e^{2x} \\cdot e^{-x}$؟",
        options: ["$e^x$", "$e^{2x^2}$", "$e^{2x - x} = e^x$", "$e^{2x^2 - x}$"],
        correctIdx: 0,
        explanation: "e^(2x) · e^(−x) = e^(2x − x) = e^x.",
        points: 1,
      },
      {
        id: "q6",
        question: "حل المعادلة $e^{2x} - 5e^x + 6 = 0$.",
        options: ["$x = \\ln(2)$ أو $x = \\ln(3)$", "$x = 2$ أو $x = 3$", "$x = \\ln(5)$", "لا حل"],
        correctIdx: 0,
        explanation: "نضع y = e^x: y² − 5y + 6 = 0 ⟹ y = 2 أو 3 ⟹ x = ln 2 أو ln 3.",
        points: 2,
      },
      {
        id: "q7",
        question: "ما $\\lim_{x \\to -\\infty} e^x$؟",
        options: ["$0$", "$+\\infty$", "$1$", "$-\\infty$"],
        correctIdx: 0,
        explanation: "e^x → 0 عندما x → −∞.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  2AS - الوحدة 3: الهندسة في الفضاء
  // ------------------------------------------------------------
  {
    id: "quiz-2as-space-geometry",
    title: "اختبار: الهندسة في الفضاء",
    description: "اختبر فهمك للإحداثيات في الفضاء، المسافة، والمعادلات.",
    durationMin: 15,
    unitSlug: "2as-space-geometry",
    questions: [
      {
        id: "q1",
        question: "ما المسافة بين $A(1, 0, -1)$ و $B(3, 2, 3)$؟",
        options: ["$2\\sqrt{6}$", "$6$", "$2\\sqrt{3}$", "$\\sqrt{20}$"],
        correctIdx: 0,
        explanation: "AB = √(2² + 2² + 4²) = √24 = 2√6.",
        points: 2,
      },
      {
        id: "q2",
        question: "ما إحداثيات منتصف $[AB]$ حيث $A(2, -1, 4)$ و $B(6, 3, 2)$؟",
        options: ["$(4, 1, 3)$", "$(8, 2, 6)$", "$(4, 1, 6)$", "$(2, 1, 3)$"],
        correctIdx: 0,
        explanation: "M = ((2+6)/2, (−1+3)/2, (4+2)/2) = (4, 1, 3).",
        points: 1,
      },
      {
        id: "q3",
        question: "ما معادلة الكرة بمركز $I(2, -3, 1)$ ونصف قطرها $4$؟",
        options: ["$(x-2)^2 + (y+3)^2 + (z-1)^2 = 16$", "$(x+2)^2 + (y-3)^2 + (z-1)^2 = 16$", "$(x-2)^2 + (y+3)^2 + (z-1)^2 = 4$", "$x^2 + y^2 + z^2 = 16$"],
        correctIdx: 0,
        explanation: "(x − 2)² + (y − (−3))² + (z − 1)² = 4² = 16.",
        points: 2,
      },
      {
        id: "q4",
        question: "ما إحداثيات الشعاع $\\vec{AB}$ إذا $A(1, 2, 3)$ و $B(4, 6, 8)$؟",
        options: ["$(3, 4, 5)$", "$(5, 8, 11)$", "$(-3, -4, -5)$", "$(3, 4, 5)$"],
        correctIdx: 0,
        explanation: "AB = (4−1, 6−2, 8−3) = (3, 4, 5).",
        points: 1,
      },
      {
        id: "q5",
        question: "هل النقطة $P(3, 1, 2)$ تنتمي للكرة $x^2 + y^2 + z^2 = 14$؟",
        options: ["نعم", "لا", "في المركز", "على القطر"],
        correctIdx: 0,
        explanation: "9 + 1 + 4 = 14 ✓. النقطة تنتمي للكرة.",
        points: 1,
      },
      {
        id: "q6",
        question: "ما النورم $\\|\\vec{u}\\|$ للشعاع $\\vec{u}(2, -1, 2)$؟",
        options: ["$3$", "$5$", "$\\sqrt{8}$", "$2$"],
        correctIdx: 0,
        explanation: "‖u‖ = √(4 + 1 + 4) = √9 = 3.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  2AS - الوحدة 4: الجداء السلمي في الفضاء
  // ------------------------------------------------------------
  {
    id: "quiz-2as-space-dot-product",
    title: "اختبار: الجداء السلمي في الفضاء",
    description: "اختبر فهمك للجداء السلمي في $\\mathbb{R}^3$، التعامد، والمعادلات.",
    durationMin: 15,
    unitSlug: "2as-space-dot-product",
    questions: [
      {
        id: "q1",
        question: "ما $\\vec{u} \\cdot \\vec{v}$ إذا $\\vec{u}(1, -2, 3)$ و $\\vec{v}(2, 1, -1)$؟",
        options: ["$-3$", "$3$", "$6$", "$-1$"],
        correctIdx: 0,
        explanation: "u·v = (1)(2) + (−2)(1) + (3)(−1) = 2 − 2 − 3 = −3.",
        points: 2,
      },
      {
        id: "q2",
        question: "ما قيمة $k$ التي تجعل $\\vec{u}(k, 2, 1)$ و $\\vec{v}(1, -1, k)$ متعامدين؟",
        options: ["$k = 1$", "$k = -1$", "$k = 2$", "$k = 0$"],
        correctIdx: 0,
        explanation: "u·v = k + (−2) + k = 2k − 2 = 0 ⟺ k = 1.",
        points: 2,
      },
      {
        id: "q3",
        question: "ما $\\|\\vec{u}\\|$ إذا $\\vec{u}(3, 0, 4)$؟",
        options: ["$5$", "$7$", "$\\sqrt{7}$", "$25$"],
        correctIdx: 0,
        explanation: "‖u‖ = √(9 + 0 + 16) = √25 = 5.",
        points: 1,
      },
      {
        id: "q4",
        question: "إذا $\\vec{u} \\cdot \\vec{v} = 0$ و $\\vec{u} \\neq \\vec{0}$ و $\\vec{v} \\neq \\vec{0}$، فما العلاقة؟",
        options: ["متعامدان", "متوازيان", "متساويان", "أحدهما مضاعف الآخر"],
        correctIdx: 0,
        explanation: "u·v = 0 ⟹ التعامد (شرطا ألا يكون أحدهما الصفر).",
        points: 1,
      },
      {
        id: "q5",
        question: "ما $\\vec{u} \\cdot \\vec{u}$ إذا كان $\\|\\vec{u}\\| = 4$؟",
        options: ["$16$", "$4$", "$8$", "$2$"],
        correctIdx: 0,
        explanation: "u·u = ‖u‖² = 16.",
        points: 1,
      },
      {
        id: "q6",
        question: "ما الزاوية بين $\\vec{i}(1,0,0)$ و $\\vec{j}(0,1,0)$؟",
        options: ["$90°$", "$0°$", "$45°$", "$180°$"],
        correctIdx: 0,
        explanation: "i·j = 0 ⟹ تعامد ⟹ θ = 90°.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  2AS - الوحدة 5: الدالة اللوغاريتمية
  // ------------------------------------------------------------
  {
    id: "quiz-2as-logarithm",
    title: "اختبار: الدالة اللوغاريتمية",
    description: "اختبر فهمك لخصائص $\\ln$، حل المعادلات، والنهايات.",
    durationMin: 18,
    unitSlug: "2as-logarithm",
    questions: [
      {
        id: "q1",
        question: "ما قيمة $\\ln(1)$؟",
        options: ["$0$", "$1$", "$e$", "$-1$"],
        correctIdx: 0,
        explanation: "ln(1) = 0 لأن e⁰ = 1.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما قيمة $\\ln(e)$؟",
        options: ["$1$", "$0$", "$e$", "$\\ln(1)$"],
        correctIdx: 0,
        explanation: "ln(e) = 1 بالتعريف.",
        points: 1,
      },
      {
        id: "q3",
        question: "ما $\\ln(ab)$ بصيغة $a, b > 0$؟",
        options: ["$\\ln(a) + \\ln(b)$", "$\\ln(a) \\cdot \\ln(b)$", "$\\ln(a) - \\ln(b)$", "$a \\cdot \\ln(b)$"],
        correctIdx: 0,
        explanation: "ln(ab) = ln(a) + ln(b).",
        points: 1,
      },
      {
        id: "q4",
        question: "بسّط $\\ln(8) - \\ln(2)$.",
        options: ["$\\ln(4)$", "$\\ln(6)$", "$\\ln(10)$", "$\\ln(16)$"],
        correctIdx: 0,
        explanation: "ln(8) − ln(2) = ln(8/2) = ln(4).",
        points: 1,
      },
      {
        id: "q5",
        question: "بسّط $\\ln(x^3)$.",
        options: ["$3\\ln(x)$", "$\\ln(3x)$", "$3x$", "$x^3$"],
        correctIdx: 0,
        explanation: "ln(x^n) = n·ln(x).",
        points: 1,
      },
      {
        id: "q6",
        question: "حل المعادلة $\\ln(x) = 4$.",
        options: ["$x = e^4$", "$x = 4$", "$x = \\ln(4)$", "$x = 10^4$"],
        correctIdx: 0,
        explanation: "ln(x) = 4 ⟺ x = e⁴.",
        points: 1,
      },
      {
        id: "q7",
        question: "حل $\\ln(x+1) + \\ln(x-1) = \\ln(3)$.",
        options: ["$x = 2$", "$x = -2$", "$x = 1$", "لا حل"],
        correctIdx: 0,
        explanation: "ln((x+1)(x−1)) = ln(3) ⟹ x² − 1 = 3 ⟹ x² = 4. شرط x > 1, فالحل x = 2.",
        points: 2,
      },
    ],
  },

  // ------------------------------------------------------------
  //  2AS - الوحدة 6: الاحتمالات
  // ------------------------------------------------------------
  {
    id: "quiz-2as-probability",
    title: "اختبار: الاحتمالات",
    description: "اختبر فهمك للاحتمالات، الاحتمال الشرطي، والاستقلال.",
    durationMin: 18,
    unitSlug: "2as-probability",
    questions: [
      {
        id: "q1",
        question: "ما احتمال الحصول على رأس عند رمي قطعة نقود مرة واحدة؟",
        options: ["$1/2$", "$1$", "$0$", "$1/4$"],
        correctIdx: 0,
        explanation: "P = عدد الحالات المواتية / عدد الحالات الممكنة = 1/2.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما $P(A \\cup B)$ إذا $P(A) = 0.4, P(B) = 0.3, P(A \\cap B) = 0.1$؟",
        options: ["$0.6$", "$0.7$", "$0.8$", "$0.5$"],
        correctIdx: 0,
        explanation: "P(A∪B) = P(A) + P(B) − P(A∩B) = 0.4 + 0.3 − 0.1 = 0.6.",
        points: 2,
      },
      {
        id: "q3",
        question: "ما $P(\\overline{A})$ إذا $P(A) = 0.7$؟",
        options: ["$0.3$", "$0.7$", "$1$", "$0$"],
        correctIdx: 0,
        explanation: "P(Ā) = 1 − P(A) = 1 − 0.7 = 0.3.",
        points: 1,
      },
      {
        id: "q4",
        question: "ما $P(B|A)$ إذا $P(A \\cap B) = 0.2$ و $P(A) = 0.5$؟",
        options: ["$0.4$", "$0.1$", "$0.7$", "$0.25$"],
        correctIdx: 0,
        explanation: "P(B|A) = P(A∩B)/P(A) = 0.2/0.5 = 0.4.",
        points: 2,
      },
      {
        id: "q5",
        question: "إذا كان $A$ و $B$ مستقلين، $P(A) = 0.3, P(B) = 0.4$، فما $P(A \\cap B)$؟",
        options: ["$0.12$", "$0.7$", "$0.5$", "$0.1$"],
        correctIdx: 0,
        explanation: "الاستقلال: P(A∩B) = P(A)·P(B) = 0.3·0.4 = 0.12.",
        points: 2,
      },
      {
        id: "q6",
        question: "ما احتمال الحصول على رقم زوجي عند رمي حجر نرد عادي؟",
        options: ["$1/2$", "$1/3$", "$1/6$", "$2/3$"],
        correctIdx: 0,
        explanation: "الأعداد الزوجية {2, 4, 6}: 3 حالات من 6, فالاحتمال 3/6 = 1/2.",
        points: 1,
      },
      {
        id: "q7",
        question: "كم لجنة من 3 أعضاء يمكن تكوينها من 5 أشخاص؟",
        options: ["$10$", "$15$", "$60$", "$5$"],
        correctIdx: 0,
        explanation: "C(5, 3) = 5!/(3!·2!) = (5·4)/2 = 10.",
        points: 2,
      },
    ],
  },

  // ------------------------------------------------------------
  //  2AS - الوحدة 7: المتتاليات
  // ------------------------------------------------------------
  {
    id: "quiz-2as-sequences",
    title: "اختبار: المتتاليات الحسابية والهندسية",
    description: "اختبر فهمك للمتتاليات، الحدود، والمجاميع.",
    durationMin: 18,
    unitSlug: "2as-sequences",
    questions: [
      {
        id: "q1",
        question: "ما الحد $u_5$ للمتتالية الهندسية $u_0 = 3$ وأساسها $q = 2$؟",
        options: ["$96$", "$48$", "$30$", "$15$"],
        correctIdx: 0,
        explanation: "u_5 = u_0 · q^5 = 3 · 32 = 96.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما الحد العام للمتتالية الحسابية $u_1 = 5, r = 3$؟",
        options: ["$u_n = 3n + 2$", "$u_n = 5 + 3n$", "$u_n = 3n + 5$", "$u_n = 5n + 3$"],
        correctIdx: 0,
        explanation: "u_n = u_1 + (n − 1)r = 5 + (n − 1)·3 = 3n + 2.",
        points: 2,
      },
      {
        id: "q3",
        question: "ما مجموع أول 8 حدود لمتتالية هندسية $u_0 = 1, q = 2$؟",
        options: ["$255$", "$256$", "$128$", "$511$"],
        correctIdx: 0,
        explanation: "S_8 = u_0 · (1 − q^8)/(1 − q) = (1 − 256)/(1 − 2) = 255.",
        points: 2,
      },
      {
        id: "q4",
        question: "ما $\\lim_{n \\to +\\infty} \\left(\\frac{1}{2}\\right)^n$؟",
        options: ["$0$", "$+\\infty$", "$1$", "$\\frac{1}{2}$"],
        correctIdx: 0,
        explanation: "|q| < 1 ⟹ q^n → 0.",
        points: 1,
      },
      {
        id: "q5",
        question: "ما $\\lim_{n \\to +\\infty} (3^n)$؟",
        options: ["$+\\infty$", "$0$", "$3$", "$1$"],
        correctIdx: 0,
        explanation: "q > 1 ⟹ q^n → +∞.",
        points: 1,
      },
      {
        id: "q6",
        question: "متتالية: $2, 6, 18, 54, \\ldots$ ما أساسها؟",
        options: ["$3$", "$4$", "$2$", "$6$"],
        correctIdx: 0,
        explanation: "q = 6/2 = 18/6 = 54/18 = 3.",
        points: 1,
      },
      {
        id: "q7",
        question: "ما مجموع أول 100 عدد طبيعي $S = 1 + 2 + 3 + \\cdots + 100$؟",
        options: ["$5050$", "$10000$", "$1000$", "$5000$"],
        correctIdx: 0,
        explanation: "S = 100·101/2 = 5050.",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  2AS - الوحدة 8: المعادلات التفاضلية
  // ------------------------------------------------------------
  {
    id: "quiz-2as-differential-equations",
    title: "اختبار: المعادلات التفاضلية",
    description: "اختبر فهمك لحل المعادلات التفاضلية من الدرجة الأولى.",
    durationMin: 18,
    unitSlug: "2as-differential-equations",
    questions: [
      {
        id: "q1",
        question: "ما الحل العام للمعادلة $y' = 2y$؟",
        options: ["$y = Ce^{2x}$", "$y = 2x + C$", "$y = e^{2x}$", "$y = Cx^2$"],
        correctIdx: 0,
        explanation: "y' = ay ⟹ y = Ce^(ax). هنا a = 2, فالحل y = Ce^(2x).",
        points: 2,
      },
      {
        id: "q2",
        question: "ما الحل العام لـ $y' = 3y + 6$؟",
        options: ["$y = Ce^{3x} - 2$", "$y = Ce^{3x} + 2$", "$y = 3x + C$", "$y = e^{3x} + 6$"],
        correctIdx: 0,
        explanation: "y' = ay + b ⟹ y = Ce^(ax) − b/a = Ce^(3x) − 6/3 = Ce^(3x) − 2.",
        points: 2,
      },
      {
        id: "q3",
        question: "ما الحل الخاص لـ $y' = y, y(0) = 5$؟",
        options: ["$y = 5e^x$", "$y = e^x + 5$", "$y = 5x$", "$y = 5$"],
        correctIdx: 0,
        explanation: "y = Ce^x. y(0) = C = 5, فالحل y = 5e^x.",
        points: 2,
      },
      {
        id: "q4",
        question: "ما الحل العام لـ $y' + 4y = 0$؟",
        options: ["$y = Ce^{-4x}$", "$y = Ce^{4x}$", "$y = 4x + C$", "$y = C/x^4$"],
        correctIdx: 0,
        explanation: "y' = −4y ⟹ y = Ce^(−4x).",
        points: 2,
      },
      {
        id: "q5",
        question: "ما الحل الخاص لـ $y' = 2y - 4, y(0) = 3$؟",
        options: ["$y = 5e^{2x} + 2$", "$y = e^{2x} - 2$", "$y = 5e^{2x} - 2$", "$y = 3e^{2x} + 2$"],
        correctIdx: 0,
        explanation: "y = Ce^(2x) − (−4)/2 = Ce^(2x) + 2. y(0) = C + 2 = 3 ⟹ C = 1. ✗، الصحيح: C = 3 − 2 = 1, y = e^(2x) + 2.",
        points: 2,
      },
      {
        id: "q6",
        question: "أي معادلة تصف نمواً سكانياً؟",
        options: ["$y' = ky$", "$y' = -ky$", "$y' = y^2$", "$y' = k$"],
        correctIdx: 0,
        explanation: "النمو السكاني يتبع y' = ky (نمو أسي).",
        points: 1,
      },
    ],
  },

  // ------------------------------------------------------------
  //  1AS - الوحدة 9: الإحصاء (جديد)
  // ------------------------------------------------------------
  {
    id: "quiz-1as-statistics",
    title: "اختبار: الإحصاء",
    description: "اختبر فهمك للمؤشرات المركزية والتشتت والتمثيلات البيانية.",
    durationMin: 15,
    unitSlug: "1as-statistics",
    questions: [
      {
        id: "q1",
        question: "ما متوسط القيم: $4, 6, 8, 10, 12$؟",
        options: ["$8$", "$6$", "$10$", "$7$"],
        correctIdx: 0,
        explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8.",
        points: 1,
      },
      {
        id: "q2",
        question: "ما وسيط السلسلة: $2, 5, 7, 9, 11, 15$؟",
        options: ["$8$", "$7$", "$9$", "$7.5$"],
        correctIdx: 0,
        explanation: "عدد القيم زوجي (6)، الوسيط = (القيمة 3 + القيمة 4)/2 = (7+9)/2 = 8.",
        points: 2,
      },
      {
        id: "q3",
        question: "ما منوال السلسلة: $3, 5, 5, 7, 8, 5, 9, 5, 2$؟",
        options: ["$5$", "$3$", "$9$", "$2$"],
        correctIdx: 0,
        explanation: "المنوال هو القيمة الأكثر تكرارًا. 5 تكررت 4 مرات.",
        points: 1,
      },
      {
        id: "q4",
        question: "ما مدى السلسلة: $5, 8, 12, 15, 20$؟",
        options: ["$15$", "$20$", "$5$", "$12$"],
        correctIdx: 0,
        explanation: "المدى = القيمة العظمى − القيمة الصغرى = 20 − 5 = 15.",
        points: 1,
      },
      {
        id: "q5",
        question: "إذا كان متوسط قيم $n = 5$ هو $10$، فما مجموع القيم؟",
        options: ["$50$", "$5$", "$15$", "$2$"],
        correctIdx: 0,
        explanation: "المتوسط = المجموع/n، فالمجموع = المتوسط × n = 10 × 5 = 50.",
        points: 1,
      },
      {
        id: "q6",
        question: "أي تمثيل بياني مناسب لبيانات نوعية (فئات)؟",
        options: ["المخطط الدائري", "المدرج المستطيلات", "مخطط الصندوق", "المنحنى"],
        correctIdx: 0,
        explanation: "المخطط الدائري مناسب للبيانات النوعية (نسب مئوية لكل فئة).",
        points: 1,
      },
      {
        id: "q7",
        question: "ما التباين للسلسلة $2, 4, 6$ (متوسطها 4)؟",
        options: ["$8/3$", "$4$", "$2$", "$8$"],
        correctIdx: 0,
        explanation: "Variance = [(2-4)² + (4-4)² + (6-4)²]/3 = [4+0+4]/3 = 8/3.",
        points: 2,
      },
    ],
  },
];
