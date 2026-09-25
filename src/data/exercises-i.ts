// ============================================================
//  دفعة إثرائية جديدة — السنة الثانية ثانوي (جزء 1)
//  تمارين مستوحاة من نمط فروض واختبارات السنة الثانية ثانوي في الجزائر
//  صياغة وإعداد: الأستاذ عدلي اسعد — مع حلول نموذجية مفصلة
//  تركز على الفصول ذات العدد القليل من التمارين
// ============================================================

import type { Exercise } from './chapters';

export const exercisesI: Exercise[] = [
  // ================= النهايات =================
  {
    id: 'c2-limits-x1',
    chapterId: 'c2-limits',
    title: 'نهايات بالتعويض المباشر',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    source: 'نمط فروض المراقبة المستمرة — صياغة الأستاذ عدلي اسعد',
    statement: 'احسب النهايات الآتية:\n1. $\\lim_{x \\to 3} \\left(2x^2 - 5x + 1\\right)$\n2. $\\lim_{x \\to +\\infty} \\left(5 - x\\right)$\n3. $\\lim_{x \\to 1} \\sqrt{x^2 + 8}$',
    hint: 'الدوال المجموعة والمجداء والتركيب كلها متصلة في نقاط مجالها — جرب التعويض المباشر أولاً.',
    solution: [
      'بالتعويض المباشر لأن الدالة كثيرة الحدود متصلة على $\\mathbb{R}$: $\\lim_{x \\to 3}\\left(2x^2 - 5x + 1\\right) = 2 \\times 9 - 15 + 1 = 18 - 15 + 1 = 4$.',
      '$\\lim_{x \\to +\\infty} (5 - x)$: عندما $x$ يكبر بلا حدود فإن $-x$ يصغر بلا حدود، إذن $\\lim_{x \\to +\\infty} (5 - x) = -\\infty$.',
      'الدالة $x \\mapsto \\sqrt{x^2 + 8}$ متصلة في $1$ لأن $x^2 + 8 > 0$ هناك، إذن بالتعويض: $\\lim_{x \\to 1} \\sqrt{x^2 + 8} = \\sqrt{1 + 8} = \\sqrt{9} = 3$.',
    ],
  },
  {
    id: 'c2-limits-x2',
    chapterId: 'c2-limits',
    title: 'أشكال غير معينة: الاستخراج والتحليل',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: 'احسب النهايات الآتية موضحاً الصيغة غير المعينة إن وُجدت:\n1. $\\lim_{x \\to +\\infty} \\dfrac{2x^2 + 1}{3x^2 - 5}$\n2. $\\lim_{x \\to 3} \\dfrac{x^2 - 9}{x - 3}$\n3. $\\lim_{x \\to +\\infty} \\left(x^2 - 3x\\right)$',
    hint: 'عند $+\\infty$ استخرج أعلى قوة، وعند شكل $\\frac{0}{0}$ حلّل البسط والمقام إلى عوامل.',
    solution: [
      'شكل غير معين $\\frac{\\infty}{\\infty}$: نستخرج $x^2$ من البسط والمقام:\n$\\lim_{x \\to +\\infty} \\dfrac{x^2\\left(2 + \\frac{1}{x^2}\\right)}{x^2\\left(3 - \\frac{5}{x^2}\\right)} = \\dfrac{2 + 0}{3 - 0} = \\dfrac{2}{3}$\nلأن $\\lim_{x \\to +\\infty} \\dfrac{1}{x^2} = 0$.',
      'بالتعويض نحصل على شكل $\\frac{0}{0}$: نحلل $x^2 - 9 = (x - 3)(x + 3)$:\n$\\lim_{x \\to 3} \\dfrac{(x-3)(x+3)}{x-3} = \\lim_{x \\to 3} (x + 3) = 6$.',
      'شكل غير معين $\\infty - \\infty$: نعيد الكتابة $x^2 - 3x = x(x - 3)$؛ بما أن $x \\to +\\infty$ و $(x - 3) \\to +\\infty$ فإن جداءهما $\\lim_{x \\to +\\infty} \\left(x^2 - 3x\\right) = +\\infty$.',
    ],
  },
  {
    id: 'c2-limits-x3',
    chapterId: 'c2-limits',
    title: 'المقاربات من دراسة النهايات',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: 'لتكن الدالة $f(x) = \\dfrac{2x + 1}{x - 1}$ المعرفة على $\\mathbb{R} \\setminus \\{1\\}$.\n1. احسب $\\lim_{x \\to +\\infty} f(x)$ و $\\lim_{x \\to -\\infty} f(x)$ ثم استنتج مستقيماً مقارباً.\n2. احسب $\\lim_{x \\to 1^+} f(x)$ و $\\lim_{x \\to 1^-} f(x)$ ثم استنتج مستقيماً مقارباً ثانياً.',
    hint: 'المقارب الأفقي يُقرأ من النهايات عند $\\pm\\infty$، والعمودي من النهاية اللانهائية عند حد محظور.',
    solution: [
      'نستخرج $x$: $f(x) = \\dfrac{x\\left(2 + \\frac{1}{x}\\right)}{x\\left(1 - \\frac{1}{x}\\right)} \\xrightarrow[x \\to \\pm\\infty]{} \\dfrac{2}{1} = 2$.\nإذن $\\lim_{x \\to \\pm\\infty} f(x) = 2$، ومنه المستقيم $y = 2$ مقارب أفقي لمنحنى $f$ عند $+\\infty$ و $-\\infty$.',
      'عند $x = 1$ المقام ينعدم والبسط يساوي $3 \\neq 0$:\n• من اليمين: $x - 1 > 0$ صغير جداً إذن $\\lim_{x \\to 1^+} f(x) = +\\infty$.\n• من اليسار: $x - 1 < 0$ صغير جداً إذن $\\lim_{x \\to 1^-} f(x) = -\\infty$.\nالمستقيم $x = 1$ مقارب عمودي لمنحنى $f$، والمنحنى يصعد فوقه من اليمين ويهبط تحته من اليسار.',
    ],
  },

  // ================= الزوايا الموجهة =================
  {
    id: 'c2-ang-x1',
    chapterId: 'c2-ang',
    title: 'التحويل بين الدرجات والراديان',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: '1. اكتب بالراديان الزوايا الآتية: $30^{\\circ}$ ، $135^{\\circ}$ ، $240^{\\circ}$ ، $-60^{\\circ}$.\n2. اكتب بالدرجات الزوايا: $\\dfrac{\\pi}{4}$ ، $\\dfrac{5\\pi}{3}$ ، $-\\dfrac{3\\pi}{2}$.',
    hint: '$\\pi$ راديان تقابل $180^{\\circ}$؛ اضرب في $\\dfrac{\\pi}{180}$ أو في $\\dfrac{180}{\\pi}$ حسب الاتجاه.',
    solution: [
      'نضرب في $\\dfrac{\\pi}{180}$:\n• $30^{\\circ} = \\dfrac{30\\pi}{180} = \\dfrac{\\pi}{6}$\n• $135^{\\circ} = \\dfrac{135\\pi}{180} = \\dfrac{3\\pi}{4}$\n• $240^{\\circ} = \\dfrac{240\\pi}{180} = \\dfrac{4\\pi}{3}$\n• $-60^{\\circ} = -\\dfrac{60\\pi}{180} = -\\dfrac{\\pi}{3}$',
      'نضرب في $\\dfrac{180}{\\pi}$:\n• $\\dfrac{\\pi}{4} = \\dfrac{180}{4} = 45^{\\circ}$\n• $\\dfrac{5\\pi}{3} = \\dfrac{5 \\times 180}{3} = 300^{\\circ}$\n• $-\\dfrac{3\\pi}{2} = -\\dfrac{3 \\times 180}{2} = -270^{\\circ}$',
    ],
  },
  {
    id: 'c2-ang-x2',
    chapterId: 'c2-ang',
    title: 'قيم مثلثية وخواص التناظر',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: '1. تذكر قيم $\\cos$ و $\\sin$ للزوايا $\\dfrac{\\pi}{6}$ و $\\dfrac{\\pi}{4}$ و $\\dfrac{\\pi}{3}$.\n2. باستعمال خواص التناظر، احسب $\\cos\\dfrac{5\\pi}{6}$ و $\\sin\\dfrac{7\\pi}{4}$ و $\\cos\\left(-\\dfrac{\\pi}{3}\\right)$.',
    hint: '$\\dfrac{5\\pi}{6} = \\pi - \\dfrac{\\pi}{6}$ و $\\dfrac{7\\pi}{4} = 2\\pi - \\dfrac{\\pi}{4}$؛ تذكر: $\\cos(\\pi - x) = -\\cos x$ و $\\cos(2\\pi - x) = \\cos x$.',
    solution: [
      'الجدول المرجعي:\n• $\\cos\\dfrac{\\pi}{6} = \\dfrac{\\sqrt{3}}{2}$ و $\\sin\\dfrac{\\pi}{6} = \\dfrac{1}{2}$\n• $\\cos\\dfrac{\\pi}{4} = \\sin\\dfrac{\\pi}{4} = \\dfrac{\\sqrt{2}}{2}$\n• $\\cos\\dfrac{\\pi}{3} = \\dfrac{1}{2}$ و $\\sin\\dfrac{\\pi}{3} = \\dfrac{\\sqrt{3}}{2}$',
      '• $\\dfrac{5\\pi}{6}$ تقابل $\\dfrac{\\pi}{6}$ بتناظر محوري حول محور الأراتيب، إذن $\\cos\\dfrac{5\\pi}{6} = -\\cos\\dfrac{\\pi}{6} = -\\dfrac{\\sqrt{3}}{2}$.\n• $\\dfrac{7\\pi}{4} = 2\\pi - \\dfrac{\\pi}{4}$ تناظر حول محور الفواصل، إذن $\\sin\\dfrac{7\\pi}{4} = -\\sin\\dfrac{\\pi}{4} = -\\dfrac{\\sqrt{2}}{2}$.\n• الدالة $\\cos$ زوجية: $\\cos\\left(-\\dfrac{\\pi}{3}\\right) = \\cos\\dfrac{\\pi}{3} = \\dfrac{1}{2}$.',
    ],
  },
  {
    id: 'c2-ang-x3',
    chapterId: 'c2-ang',
    title: 'برهان علاقات ثم توظيفها',
    difficulty: 'متوسط',
    kind: 'استدلالي',
    streams: ['2sciences', '2math', '2techmath'],
    statement: '1. برهن باستعمال الدائرة المثلثية أنّه لكل حقيقي $x$: $\\cos(\\pi - x) = -\\cos x$ و $\\sin(\\pi - x) = \\sin x$.\n2. استنتج قيم $\\cos\\dfrac{2\\pi}{3}$ و $\\sin\\dfrac{11\\pi}{6}$.',
    hint: 'النقطتان الممثلتان لـ $x$ و $\\pi - x$ متناظرتان حول محور الأراتيب.',
    solution: [
      'لنمثل النقطتين $M$ و $M\'$ على الدائرة المثلثية المقابلتين لـ $x$ و $\\pi - x$. النقطتان $M(x)$ و $M\'(\\pi - x)$ لهما نفس الترتيبة لأن $\\pi - x$ تقابل $x$ بتناظر محوري حول محور الأراتيب، مع أبسيطين متقابلين بالعكس.\nإذن: $\\cos(\\pi - x) = -\\cos x$ و $\\sin(\\pi - x) = \\sin x$. ✓',
      '• $\\dfrac{2\\pi}{3} = \\pi - \\dfrac{\\pi}{3}$ إذن $\\cos\\dfrac{2\\pi}{3} = -\\cos\\dfrac{\\pi}{3} = -\\dfrac{1}{2}$.\n• $\\dfrac{11\\pi}{6} = 2\\pi - \\dfrac{\\pi}{6}$، وبما أن $\\sin(2\\pi - x) = -\\sin x$ فإن $\\sin\\dfrac{11\\pi}{6} = -\\sin\\dfrac{\\pi}{6} = -\\dfrac{1}{2}$.',
    ],
  },

  // ================= التحولات النقطية =================
  {
    id: 'c2-trans-x1',
    chapterId: 'c2-trans',
    title: 'معادلات مثلثية أساسية',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: 'حل في $\\mathbb{R}$ المعادلات الآتية:\n1. $\\sin x = \\dfrac{\\sqrt{3}}{2}$\n2. $\\cos x = -\\dfrac{1}{2}$',
    hint: 'ابدأ بحلول الفترة $[0, 2\\pi[$ ثم أضف $2k\\pi$؛ تذكر: $\\sin a = \\sin b \\iff a = b + 2k\\pi$ أو $a = \\pi - b + 2k\\pi$.',
    solution: [
      'نعلم أن $\\sin\\dfrac{\\pi}{3} = \\dfrac{\\sqrt{3}}{2}$، و $\\sin x = \\sin\\dfrac{\\pi}{3}$ إذا وفقط إذا كان:\n$x = \\dfrac{\\pi}{3} + 2k\\pi$ أو $x = \\pi - \\dfrac{\\pi}{3} + 2k\\pi = \\dfrac{2\\pi}{3} + 2k\\pi$ حيث $k \\in \\mathbb{Z}$.\nمجموعة الحلول: $S = \\left\\{\\dfrac{\\pi}{3} + 2k\\pi,\\ \\dfrac{2\\pi}{3} + 2k\\pi\\right\\}_{k \\in \\mathbb{Z}}$.',
      'نعلم أن $\\cos\\dfrac{2\\pi}{3} = -\\dfrac{1}{2}$ (من تمرين الزوايا الموجهة)، و $\\cos x = \\cos\\dfrac{2\\pi}{3}$ إذا وفقط إذا كان:\n$x = \\dfrac{2\\pi}{3} + 2k\\pi$ أو $x = -\\dfrac{2\\pi}{3} + 2k\\pi$ حيث $k \\in \\mathbb{Z}$.\nمجموعة الحلول: $S = \\left\\{\\pm\\dfrac{2\\pi}{3} + 2k\\pi\\right\\}_{k \\in \\mathbb{Z}}$.',
    ],
  },
  {
    id: 'c2-trans-x2',
    chapterId: 'c2-trans',
    title: 'الحلول العامة ومتراجحة',
    difficulty: 'متوسط',
    kind: 'استدلالي',
    streams: ['2sciences', '2math', '2techmath'],
    statement: '1. حل في $\\mathbb{R}$: $\\cos x = \\cos\\dfrac{\\pi}{5}$ ثم $\\sin x = \\sin\\dfrac{\\pi}{7}$.\n2. باستعمال الدائرة المثلثية، حل على $[0, 2\\pi]$ المتراجحة: $\\sin x \\geq 0$.',
    hint: '$\\cos a = \\cos b \\iff a = b + 2k\\pi$ أو $a = -b + 2k\\pi$؛ أما $\\sin x \\geq 0$ فتقرأ من نصف الدائرة العلوي.',
    solution: [
      '• $\\cos x = \\cos\\dfrac{\\pi}{5} \\iff x = \\dfrac{\\pi}{5} + 2k\\pi$ أو $x = -\\dfrac{\\pi}{5} + 2k\\pi$، $k \\in \\mathbb{Z}$.\n• $\\sin x = \\sin\\dfrac{\\pi}{7} \\iff x = \\dfrac{\\pi}{7} + 2k\\pi$ أو $x = \\pi - \\dfrac{\\pi}{7} + 2k\\pi = \\dfrac{6\\pi}{7} + 2k\\pi$، $k \\in \\mathbb{Z}$.',
      'ترتيبة نقطة الدائرة المقابلة للعدد $x$ موجبة إذا وفقط إذا كانت النقطة في النصف العلوي من الدائرة، أي إذا كان $x$ في $[0, \\pi]$ (لوحدة قريبة).\nإذن حلول $\\sin x \\geq 0$ على $[0, 2\\pi]$ هي: $S = [0, \\pi]$.\nوتعميم على $\\mathbb{R}$: $x \\in [2k\\pi,\\ (2k+1)\\pi]$ حيث $k \\in \\mathbb{Z}$.',
    ],
  },
  {
    id: 'c2-trans-x3',
    chapterId: 'c2-trans',
    title: 'العلاقة الأساسية cos²+sin²=1',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: 'نفرض أن $x$ عدد حقيقي ينتمي إلى $\\left]0, \\dfrac{\\pi}{2}\\right[$ و $\\cos x = \\dfrac{1}{3}$.\n1. احسب $\\sin x$.\n2. استنتج $\\tan x$ بشكل مبسط.\n3. تحقق من نتيجتك بالتقريب إلى $10^{-2}$.',
    hint: 'طبّق $\\cos^2 x + \\sin^2 x = 1$ مع الانتباه إلى إشارة $\\sin x$ على $\\left]0, \\dfrac{\\pi}{2}\\right[$.',
    solution: [
      'بما أن $x \\in \\left]0, \\dfrac{\\pi}{2}\\right[$ فإن $\\sin x > 0$، ومن العلاقة $\\cos^2 x + \\sin^2 x = 1$:\n$\\sin x = \\sqrt{1 - \\cos^2 x} = \\sqrt{1 - \\dfrac{1}{9}} = \\sqrt{\\dfrac{8}{9}} = \\dfrac{2\\sqrt{2}}{3}$.',
      '$\\tan x = \\dfrac{\\sin x}{\\cos x} = \\dfrac{\\frac{2\\sqrt{2}}{3}}{\\frac{1}{3}} = 2\\sqrt{2}$.',
      'بالقيم التقريبية: $\\sin x \\approx \\dfrac{2 \\times 1.414}{3} \\approx 0.94$ و $\\tan x \\approx 2 \\times 1.414 \\approx 2.83$.\nتحقق: $\\left(\\dfrac{1}{3}\\right)^2 + (0.94)^2 \\approx 0.11 + 0.89 = 1$ ✓ — العلاقة الأساسية محترمة.',
    ],
  },

  // ================= هندسة الفضاء =================
  {
    id: 'c2-space-x1',
    chapterId: 'c2-space',
    title: 'إحداثيات متجهات في الفضاء',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath'],
    statement: 'في الفضاء المنسوب إلى معلم متعامد ممنوح النقط: $A(1, 0, 2)$ ، $B(3, -1, 1)$ ، $C(2, 1, 4)$.\n1. احسب إحداثيات $\\overrightarrow{AB}$ و $\\overrightarrow{AC}$ ثم $\\overrightarrow{AB} + \\overrightarrow{AC}$.\n2. احسب $\\left\\| \\overrightarrow{AB} \\right\\|$.\n3. أوجد إحداثيات النقطة $D$ بحيث تكون $ABDC$ متوازي أضلاع.',
    hint: '$\\overrightarrow{AB} = (x_B - x_A,\\ y_B - y_A,\\ z_B - z_A)$؛ و $ABDC$ متوازي أضلاع يعني $\\overrightarrow{AD} = \\overrightarrow{AB} + \\overrightarrow{AC}$.',
    solution: [
      '$\\overrightarrow{AB} = (3 - 1,\\ -1 - 0,\\ 1 - 2) = (2,\\ -1,\\ -1)$\n$\\overrightarrow{AC} = (2 - 1,\\ 1 - 0,\\ 4 - 2) = (1,\\ 1,\\ 2)$\n$\\overrightarrow{AB} + \\overrightarrow{AC} = (2 + 1,\\ -1 + 1,\\ -1 + 2) = (3,\\ 0,\\ 1)$',
      '$\\left\\| \\overrightarrow{AB} \\right\\| = \\sqrt{2^2 + (-1)^2 + (-1)^2} = \\sqrt{4 + 1 + 1} = \\sqrt{6}$',
      '$ABDC$ متوازي أضلاع $\\iff \\overrightarrow{AD} = \\overrightarrow{AB} + \\overrightarrow{AC} = (3, 0, 1)$.\nإذن $D = A + (3, 0, 1) = (1 + 3,\\ 0 + 0,\\ 2 + 1) = (4,\\ 0,\\ 3)$.\n**تحقق:** $\\overrightarrow{CD} = (4 - 2,\\ 0 - 1,\\ 3 - 4) = (2, -1, -1) = \\overrightarrow{AB}$ ✓ — الأضلاع المتقابلة متوازية ومتقايسة.',
    ],
  },
  {
    id: 'c2-space-x2',
    chapterId: 'c2-space',
    title: 'استقامة نقط في الفضاء',
    difficulty: 'متوسط',
    kind: 'استدلالي',
    streams: ['2sciences', '2math', '2techmath'],
    statement: 'ممنوح النقط: $A(0, 1, 2)$ ، $B(1, 2, 3)$ ، $C(2, 3, 4)$ ، $D(3, 4, 5)$.\n1. برهن أن النقط $A$ و $B$ و $C$ في استقامة واحدة.\n2. هل تنتمي النقطة $D$ إلى المستقيم $(AB)$؟ برهن.\n3. حدد النقطة $E$ بحيث $B$ منتصف $[AE]$.',
    hint: 'احسب $\\overrightarrow{AB}$ و $\\overrightarrow{AC}$ وابحث عن علاقة نسبيّة بينهما.',
    solution: [
      '$\\overrightarrow{AB} = (1, 1, 1)$ و $\\overrightarrow{AC} = (2, 2, 2)$.\nنلاحظ أن $\\overrightarrow{AC} = 2\\,\\overrightarrow{AB}$، إذن المتجهتان مرتبطتان خطياً (متوازيتان) ولديهما نقطة مشتركة $A$، ومنه النقط $A$ و $B$ و $C$ **في استقامة واحدة**. ✓',
      '$\\overrightarrow{AD} = (3, 3, 3) = 3\\,\\overrightarrow{AB}$، إذن $\\overrightarrow{AD}$ و $\\overrightarrow{AB}$ متوازيان والنقطتان $A$ و $D$ تنتميان لنفس المستقيم المار بـ $A$ وباتجاه $(1,1,1)$.\nإذن **نعم**، النقطة $D$ تنتمي إلى المستقيم $(AB)$ — بل النقط الأربع كلها على مستقيم واحد.',
      '$B$ منتصف $[AE] \\iff \\overrightarrow{AB} = \\overrightarrow{BE} \\iff E = 2B - A$.\n$E = (2 \\times 1 - 0,\\ 2 \\times 2 - 1,\\ 2 \\times 3 - 2) = (2,\\ 3,\\ 4) = C$.\nإذن $E = C$: أي أن $B$ منتصف $[AC]$ — وهذا متسق تماماً مع $\\overrightarrow{AC} = 2\\overrightarrow{AB}$ المثبتة في السؤال 1. ✓',
    ],
  },

  // ================= المتتاليات =================
  {
    id: 'c2-seq-x1',
    chapterId: 'c2-seq',
    title: 'متتالية حسابية من حدين',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: 'متتالية حسابية $(u_n)$ حيث $u_1 = 5$ و $u_4 = 17$.\n1. احسب أساسها $r$ ثم اكتب $u_n$ بدلالة $n$.\n2. احسب $u_{10}$.\n3. احسب مجموع عشرة حدودها الأولى $S = u_1 + u_2 + \\cdots + u_{10}$.',
    hint: 'في المتتالية الحسابية: $u_p = u_q + (p - q)\\,r$؛ ومجموع حدود متتالية حسابية: عدد الحدود × (الحد الأول + الحد الأخير) ÷ 2.',
    solution: [
      'لدينا $u_4 = u_1 + (4 - 1)\\,r$ إذن $17 = 5 + 3r$ ومنه $r = \\dfrac{17 - 5}{3} = 4$.\nوبما أن $u_1 = 5$ فإن: $u_n = u_1 + (n - 1)\\,r = 5 + 4(n - 1) = 4n + 1$.',
      '$u_{10} = 4 \\times 10 + 1 = 41$.\n**تحقق:** $u_4 = 17 = 5 + 3 \\times 4$ ✓ و $u_{10} = u_4 + 6 \\times 4 = 17 + 24 = 41$ ✓',
      'مجموع حدود متتالية حسابية يساوي عدد الحدود مضروباً في متوسط الحد الأول والحد الأخير:\n$S = \\dfrac{10 \\times (u_1 + u_{10})}{2} = \\dfrac{10 \\times (5 + 41)}{2} = \\dfrac{10 \\times 46}{2} = 230$',
    ],
  },
  {
    id: 'c2-seq-x2',
    chapterId: 'c2-seq',
    title: 'متتالية هندسية ومسألة حد',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: 'متتالية هندسية $(b_n)$ بحدها الأول $b_1 = 3$ وحدها الثالث $b_3 = 27$ حيث الحدود كلها موجبة.\n1. احسب أساسها $q$ ثم اكتب $b_n$ بدلالة $n$.\n2. احسب $b_6$.\n3. حدد أصغر عدد طبيعي $n$ بحيث $b_n \\geq 243$.',
    hint: '$b_3 = b_1 \\times q^2$؛ وتذكّر أن $243 = 3^5$.',
    solution: [
      'لدينا $b_3 = b_1 \\times q^2$ إذن $27 = 3q^2$ ومنه $q^2 = 9$.\nوبما أن حدود المتتالية موجبة فإن $q > 0$ إذن $q = 3$ (ونستبعد $q = -3$).\nإذن: $b_n = b_1 \\times q^{n-1} = 3 \\times 3^{n-1} = 3^n$.',
      '$b_6 = 3^6 = 729$.',
      '$b_n \\geq 243 \\iff 3^n \\geq 3^5 \\iff n \\geq 5$ (لأن الدالة $x \\mapsto 3^x$ متزايدة تماماً).\nأصغر عدد طبيعي هو $n = 5$.\n**تحقق:** $b_4 = 81 < 243$ و $b_5 = 243$ ✓',
    ],
  },
  {
    id: 'c2-seq-x3',
    chapterId: 'c2-seq',
    title: 'متتالية محدودة بنقطة ثابتة',
    difficulty: 'صعب',
    kind: 'استدلالي',
    streams: ['2sciences', '2math', '2techmath'],
    statement: 'متتالية معرفة بـ $u_0 = 2$ و $u_{n+1} = 3u_n - 4$ لكل $n \\in \\mathbb{N}$.\n1. احسب $u_1$ و $u_2$. ماذا تلاحظ؟\n2. نضع $v_n = u_n - 2$؛ برهن أن $(v_n)$ هندسية أساسها $3$.\n3. استنتج قيمة $u_n$ لكل $n \\in \\mathbb{N}$.',
    hint: 'احسب $v_{n+1}$ بدلالة $v_n$؛ وحدّ $v_0$ قد يكون خاصاً...',
    solution: [
      '$u_1 = 3 \\times 2 - 4 = 2$ و $u_2 = 3 \\times 2 - 4 = 2$.\nنلاحظ أن المتتالية **ثابتة** عند القيمة $2$ — وهذا حالة خاصة لطيفة: نقطة الانطلاق هي نفسها النقطة الثابتة للعلاقة التراجعية $x \\mapsto 3x - 4$.',
      '$v_{n+1} = u_{n+1} - 2 = 3u_n - 4 - 2 = 3u_n - 6 = 3(u_n - 2) = 3v_n$.\nإذن $(v_n)$ هندسية أساسها $q = 3$ وحدها الأول $v_0 = u_0 - 2 = 2 - 2 = 0$.\nوهنا الفخ الأنيق: حد أول **معدوم** — لذلك $v_n = 0 \\times 3^n = 0$ لكل $n$.',
      'من $v_n = 0$ لكل $n \\in \\mathbb{N}$ نستنتج: $u_n = v_n + 2 = 2$ لكل $n \\in \\mathbb{N}$.\n**برهان آخر بالتراجع:** إن كان $u_n = 2$ فإن $u_{n+1} = 3 \\times 2 - 4 = 2$؛ ولأن $u_0 = 2$ فبالتراجع الرياضي تكون $u_n = 2$ لكل $n$. ✓',
    ],
  },

  // ================= الجداء السلمي =================
  {
    id: 'c2-dot-x1',
    chapterId: 'c2-dot',
    title: 'جداء سلمي بالإحداثيات وتعامد',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy'],
    statement: 'في معلم متعامد ممنوح المتجهات: $\\vec{u}(2, 3)$ ، $\\vec{v}(-1, 2)$ ، $\\vec{w}(6, -4)$.\n1. احسب $\\vec{u} \\cdot \\vec{v}$ و $\\vec{u} \\cdot \\vec{w}$.\n2. أيّ الزوجين $\\vec{u}, \\vec{v}$ أو $\\vec{u}, \\vec{w}$ يمثل متجهتين عموديتين؟ علّل.\n3. احسب $\\left\\| \\vec{u} \\right\\|$ ثم استنتج $\\cos\\left(\\vec{u}, \\vec{v}\\right)$ تقريبياً.',
    hint: '$\\vec{u} \\cdot \\vec{v} = x x\' + y y\'$؛ التعامد يعادل انعدام الجداء السلمي.',
    solution: [
      '$\\vec{u} \\cdot \\vec{v} = 2 \\times (-1) + 3 \\times 2 = -2 + 6 = 4$\n$\\vec{u} \\cdot \\vec{w} = 2 \\times 6 + 3 \\times (-4) = 12 - 12 = 0$',
      'بما أن $\\vec{u} \\cdot \\vec{w} = 0$ فإن **$\\vec{u}$ و $\\vec{w}$ عموديان**.\nأما $\\vec{u} \\cdot \\vec{v} = 4 \\neq 0$ فهما غير عموديين.',
      '$\\left\\| \\vec{u} \\right\\| = \\sqrt{2^2 + 3^2} = \\sqrt{13}$ و $\\left\\| \\vec{v} \\right\\| = \\sqrt{(-1)^2 + 2^2} = \\sqrt{5}$.\n$\\cos\\left(\\vec{u}, \\vec{v}\\right) = \\dfrac{\\vec{u} \\cdot \\vec{v}}{\\left\\| \\vec{u} \\right\\| \\left\\| \\vec{v} \\right\\|} = \\dfrac{4}{\\sqrt{13} \\times \\sqrt{5}} = \\dfrac{4}{\\sqrt{65}} \\approx 0.50$\nالزاوية حادة تقارب $60^{\\circ}$.',
    ],
  },
  {
    id: 'c2-dot-x2',
    chapterId: 'c2-dot',
    title: 'مثلث قائم والجداء السلمي',
    difficulty: 'متوسط',
    kind: 'استدلالي',
    streams: ['2sciences', '2math', '2techmath'],
    statement: 'مثلث $ABC$ حيث $AB = 4$ و $AC = 3$ و $BC = 5$.\n1. بين أن المثلث $ABC$ قائم في $A$.\n2. احسب $\\cos\\widehat{B}$ ثم استنتج $\\overrightarrow{BC} \\cdot \\overrightarrow{BA}$.\n3. برهن أنّه في كل مثلث قائم في $A$: $\\overrightarrow{BC} \\cdot \\overrightarrow{BA} = AB^2$.',
    hint: 'فكّر في عكس مبرهنة فيثاغورس للسؤال 1، وفي صيغة الجداء السلمي بالأطوال والزاوية للسؤال 2.',
    solution: [
      'لدينا $AB^2 + AC^2 = 16 + 9 = 25 = 5^2 = BC^2$.\nبحسب **عكس مبرهنة فيثاغورس** فإن المثلث $ABC$ قائم في $A$. ✓',
      'في المثلث القائم في $A$: الجاور $\\widehat{B}$ المجاور له هو $AB$ والوتر $BC$، إذن:\n$\\cos\\widehat{B} = \\dfrac{AB}{BC} = \\dfrac{4}{5}$\nوبصيغة الجداء السلمي بالأطوال والزاوية:\n$\\overrightarrow{BC} \\cdot \\overrightarrow{BA} = \\left\\| \\overrightarrow{BC} \\right\\| \\times \\left\\| \\overrightarrow{BA} \\right\\| \\times \\cos\\widehat{B} = 5 \\times 4 \\times \\dfrac{4}{5} = 16$',
      'بالتعميم: في مثلث قائم في $A$ لدينا $\\cos\\widehat{B} = \\dfrac{AB}{BC}$، إذن:\n$\\overrightarrow{BC} \\cdot \\overrightarrow{BA} = BC \\times BA \\times \\dfrac{AB}{BC} = BA \\times AB = AB^2$\n**تفسير هندسي:** إسقاط $B$ عمودياً على $(BA)$ هو $B$ نفسها، فإسقاط $\\overrightarrow{BC}$ على $\\overrightarrow{BA}$ يساوي $\\overrightarrow{BA}$ طولاً باتجاهها، وجداؤهما السلمي $AB \\times AB = AB^2$. ✓',
    ],
  },

  // ================= معادلات الدرجة 2 =================
  {
    id: 'c2-quad-x1',
    chapterId: 'c2-quad',
    title: 'معادلات من الدرجة الثانية',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy', '2literature'],
    statement: '1. حل في $\\mathbb{R}$: $x^2 - 6x + 8 = 0$.\n2. حل في $\\mathbb{R}$: $2x^2 + 3x - 2 = 0$.\n3. باستعمال وضع مناسب، حل في $\\mathbb{R}$: $x^4 - 6x^2 + 8 = 0$.',
    hint: 'احسب المميز $\\Delta = b^2 - 4ac$؛ وللسؤال 3 ضع $X = x^2$ مع الانتباه إلى شرط $X \\geq 0$.',
    solution: [
      '$\\Delta = (-6)^2 - 4 \\times 1 \\times 8 = 36 - 32 = 4 > 0$ ولدينا $\\sqrt{\\Delta} = 2$:\n$x_1 = \\dfrac{6 - 2}{2} = 2$ و $x_2 = \\dfrac{6 + 2}{2} = 4$\nمجموعة الحلول: $S = \\{2,\\ 4\\}$.\n**تحقق سريع:** مجموع الحلول $= 6$ (المقابل لإشارة $b$) وجداؤهما $= 8$ (المقابل لـ $c$) ✓',
      '$\\Delta = 3^2 - 4 \\times 2 \\times (-2) = 9 + 16 = 25 > 0$ و $\\sqrt{\\Delta} = 5$:\n$x_1 = \\dfrac{-3 - 5}{4} = -2$ و $x_2 = \\dfrac{-3 + 5}{4} = \\dfrac{1}{2}$\nمجموعة الحلول: $S = \\left\\{-2,\\ \\dfrac{1}{2}\\right\\}$.',
      'نضع $X = x^2$ (حيث $X \\geq 0$) فتصبح المعادلة: $X^2 - 6X + 8 = 0$ وهي نفسها معادلة السؤال 1 بحلول $X = 2$ أو $X = 4$ — وكلاهما مقبول لأنهما موجبان.\n• $x^2 = 2 \\iff x = \\sqrt{2}$ أو $x = -\\sqrt{2}$\n• $x^2 = 4 \\iff x = 2$ أو $x = -2$\nمجموعة الحلول: $S = \\left\\{-2,\\ -\\sqrt{2},\\ \\sqrt{2},\\ 2\\right\\}$',
    ],
  },
  {
    id: 'c2-quad-x2',
    chapterId: 'c2-quad',
    title: 'إشارة ثلاثي الحد ومتراجحات',
    difficulty: 'متوسط',
    kind: 'استدلالي',
    streams: ['2sciences', '2math', '2techmath', '2economy', '2literature'],
    statement: 'ليكن $f(x) = x^2 - 4x + 3$.\n1. حل المعادلة $f(x) = 0$ ثم ضع جدول إشارات $f$.\n2. استنتج مجموعة حلول المتراجحة $f(x) \\leq 0$.\n3. حل المتراجحة: $x^2 - 4x + 3 > 0$.',
    hint: 'ثلاثي الحد ذو معامل رئيسي موجب يكون سالباً **بين** الجذرين وموجباً خارجهما.',
    solution: [
      '$\\Delta = 16 - 12 = 4$ و $\\sqrt{\\Delta} = 2$: الجذران $x_1 = \\dfrac{4 - 2}{2} = 1$ و $x_2 = \\dfrac{4 + 2}{2} = 3$.\nجدول الإشارات: $f$ موجبة على $\\left]-\\infty, 1\\right[$، منعدمة عند $1$، سالبة على $\\left]1, 3\\right[$، منعدمة عند $3$، موجبة على $\\left]3, +\\infty\\right[$.',
      'حلول $f(x) \\leq 0$ هي القيم التي تكون فيها $f$ سالبة أو منعدمة، أي بين الجذرين معهما:\n$S = [1,\\ 3]$',
      '$f(x) > 0$ خارج الجذرين مع استبعادهما (متراجحة صارمة):\n$S = \\left]-\\infty, 1\\right[ \\cup \\left]3, +\\infty\\right[$',
    ],
  },

  // ================= الإحصاء =================
  {
    id: 'c2-stat-x1',
    chapterId: 'c2-stat',
    title: 'متوسط ووسيط ومنوال',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy', '2literature'],
    statement: 'حصل $15$ تلميذاً في اختبار رياضيات على النقاط الآتية مع تكراراتها: النقطة $8$ بتكرار $2$، والنقطة $10$ بتكرار $3$، والنقطة $12$ بتكرار $5$، والنقطة $14$ بتكرار $3$، والنقطة $16$ بتكرار $2$.\n1. احسب المتوسط الحسابي $\\bar{x}$.\n2. حدد الوسيط والمنوال.\n3. أحسب المدى، ثم علّق على تماثل السلسلة.',
    hint: 'المتوسط $= \\dfrac{\\sum n_i x_i}{N}$؛ والوسيط قيمة الحد الذي يفصل السلسلة المنتظمة نصفين متساويين.',
    solution: [
      'المجموع الكلي: $N = 2 + 3 + 5 + 3 + 2 = 15$.\nحاصل الجداءات: $2 \\times 8 + 3 \\times 10 + 5 \\times 12 + 3 \\times 14 + 2 \\times 16 = 16 + 30 + 60 + 42 + 32 = 180$.\nالمتوسط الحسابي: $\\bar{x} = \\dfrac{180}{15} = 12$.',
      'التراكمات التصاعدية: $2, 5, 10, 13, 15$ — الحد الثامن (نصف $15$ يقع بين $7.5$) يقع في القيمة $12$ إذن الوسيط $= 12$.\nالمنوال = القيمة ذات التكرار الأكبر ($5$) إذن المنوال $= 12$.',
      'المدى $= 16 - 8 = 8$.\n**ملاحظة:** المتوسط = الوسيط = المنوال $= 12$، والتكرارات متناظرة حول $12$ ($2, 3, 5, 3, 2$) — سلسلة متناظرة تمام التماثل حول قيمتها المركزية، وهذا يدل على توزيع منسجم للنقاط حول المتوسط.',
    ],
  },

  // ================= النسب والمؤشرات =================
  {
    id: 'c2-ratio-x1',
    chapterId: 'c2-ratio',
    title: 'معاملات التعدد والمؤشرات',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: ['2sciences', '2math', '2techmath', '2economy', '2literature'],
    statement: '1. منتج ارتفع سعره بنسبة $20\\%$ ثم انخفض في السنة الموالية بنسبة $20\\%$. هل عاد سعره الأصلي؟ احسب النسبة الإجمالية للتغير.\n2. سعر سلعة كان $5000$ دج في السنة الأساس أصبح $5200$ دج. احسب مؤشره.\n3. سعر آخر مؤشره $112$: ما نسبة تغيره بالنسبة للسنة الأساس؟',
    hint: 'التعدد بنسبة $t\\%$ يقابله معامل $1 + \\dfrac{t}{100}$؛ والمعاملات الإجمالية تُضرب بعضها ببعض.',
    solution: [
      '• الارتفاع: معامل $1 + \\dfrac{20}{100} = 1.2$\n• الانخفاض: معامل $1 - \\dfrac{20}{100} = 0.8$\nالمعامل الإجمالي: $1.2 \\times 0.8 = 0.96 = 1 - 0.04$.\nإذن السعر النهائي **لا يعود** للأصلي بل ينخفض إجمالاً بنسبة **$4\\%$** — لاحظ أن الانخفاض $20\\%$ يحسب من سعر أعلى، فتأثيره أكبر من الارتفاع السابق.',
      'المؤشر $= \\dfrac{5200}{5000} \\times 100 = 104$.\nأي أن السعر ارتفع بنسبة $4\\%$ بالنسبة للسنة الأساس.',
      'مؤشر $112$ يعني نسبة تغير $\\dfrac{112 - 100}{100} \\times 100\\% = 12\\%$ — ارتفاع بنسبة $12\\%$ بالنسبة للسنة الأساس (مؤشر السنة الأساس هو $100$ دائماً).',
    ],
  },
];
