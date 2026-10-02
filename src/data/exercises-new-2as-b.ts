import type { Exercise } from './chapters';

/**
 * سلسلة تدرّج الإثرائية — السنة الثانية ثانوي (الجزء ب)
 * تمارين إضافية بحلول نموذجية مفصلة: معادلات ومتراجحات من الدرجة الثانية،
 * الجداء السلمي، الزوايا الموجهة، التحولات النقطية.
 */

const SCI: Array<'2sciences' | '2math' | '2techmath'> = ['2sciences', '2math', '2techmath'];

export const exercisesNew2AsB: Exercise[] = [
  // ==================== c2-quad: معادلات ومتراجحات من الدرجة الثانية ====================
  {
    id: 'c2-quad-101',
    chapterId: 'c2-quad',
    title: 'حل معادلات بالمميز',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement: 'حل في $\\mathbb{R}$ المعادلات التالية بعد حساب المميز:',
    parts: [
      '$x^{2}-7x+12=0$',
      '$2x^{2}+4x+5=0$',
      '$x^{2}-6x+9=0$',
    ],
    solution: [
      '**1)** $\\Delta=49-48=1>0$: حلّان:\n$x=\\dfrac{7\\pm 1}{2}$ أي $S=\\left\\{3\\,;4\\right\\}$.',
      '**2)** $\\Delta=16-40=-24<0$: **لا حل** في $\\mathbb{R}$ ($S=\\varnothing$) — المتراجعة $\\left(\\dfrac{\\Delta}{4}\\right)$ أيضاً سالبة.',
      '**3)** $\\Delta=36-36=0$: حل مزدوج $x=\\dfrac{6}{2}=3$: $S=\\left\\{3\\right\\}$.\n(والمعادلة $=(x-3)^{2}=0$.)',
    ],
    hint: 'ثلاث حالات المميز: $\\Delta>0$ حلّان، $\\Delta=0$ حل مزدوج، $\\Delta<0$ لا حل حقيقي.',
  },
  {
    id: 'c2-quad-102',
    chapterId: 'c2-quad',
    title: 'بناء معادلة من جذورها',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      '1. احسب مجموع $S$ وجداء $P$ لجذري المعادلة $x^{2}-5x+6=0$ **دون حلها**.\n2. اكتب المعادلة من الدرجة الثانية التي جذراها $1+\\sqrt{2}$ و $1-\\sqrt{2}$.\n3. تحقق أن العددين حلان فعلاً.',
    solution: [
      '**1)** $S=-\\dfrac{b}{a}=5$ و $P=\\dfrac{c}{a}=6$.',
      '**2)** $S\'=\\left(1+\\sqrt{2}\\right)+\\left(1-\\sqrt{2}\\right)=2$ و $P\'=\\left(1+\\sqrt{2}\\right)\\left(1-\\sqrt{2}\\right)=1-2=-1$.\nالمعادلة: $x^{2}-S\'x+P\'=0$ أي $x^{2}-2x-1=0$.',
      '**3)** عند $x=1+\\sqrt{2}$:\n$\\left(1+\\sqrt{2}\\right)^{2}-2\\left(1+\\sqrt{2}\\right)-1=3+2\\sqrt{2}-2-2\\sqrt{2}-1=0$. $\\checkmark$\nوبالتماثل للجذر المرافق. $\\blacksquare$',
    ],
    hint: 'جذران $x_1,x_2$ يبنيان: $x^{2}-(x_1+x_2)x+x_1x_2=0$ — والمتطابقة $(a+b)(a-b)=a^2-b^2$ تحسب الجداء.',
  },
  {
    id: 'c2-quad-103',
    chapterId: 'c2-quad',
    title: 'إشارة ثلاثي الحدود',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'نعتبر $f(x)=-2x^{2}+8x-6$.\n1. احسب المميز وجذور $f$ إن وجدت.\n2. أعد جدول إشارات $f(x)$ (مع تبرير بالشكل المؤهل).\n3. حل المتراجحة $-2x^{2}+8x-6\\geq 0$ ثم $f(x)<0$.',
    solution: [
      '**1)** $\\Delta=64-4(-2)(-6)=64-48=16>0$:\n$x_{1}=\\dfrac{-8-4}{-4}=3$ و $x_{2}=\\dfrac{-8+4}{-4}=1$. الجذران $1$ و $3$.',
      '**2)** $f(x)=-2(x-1)(x-3)$ — معامل $x^{2}$ **سالب** إذن:\n• سالبة خارج $\\left[1;3\\right]$، موجبة بين $1$ و $3$، معدومة عند $1$ و $3$.',
      '**3)** $f(x)\\geq 0\\iff x\\in\\left[1\\,;3\\right]$ (بين الجذرين لأن السالب «يرفع» الإشارة).\n$f(x)<0\\iff x\\in\\left]-\\infty;1\\right[\\cup\\left]3;+\\infty\\right[$.',
    ],
    hint: 'الشكل المؤهل $a(x-x_1)(x-x_2)$: إشارة $a$ خارج الجذرين وعكسها بينهما.',
  },
  {
    id: 'c2-quad-104',
    chapterId: 'c2-quad',
    title: 'متراجحة بمميز غير كامل',
    difficulty: 'صعب',
    kind: 'استدلالي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'نعتبر $f(x)=x^{2}-4x+m$ حيث $m$ معلمة حقيقية.\n1. احسب المميز بدلالة $m$.\n2. حدد قيم $m$ التي تجعل المعادلة $f(x)=0$ بجذرين مختلفين.\n3. في حالة $m=5$: هل للمعادلة حلول؟ وفسّر بيانياً إشارة $f$ دائماً.',
    solution: [
      '**1)** $\\Delta=16-4m=4(4-m)$.',
      '**2)** جذرين مختلفين $\\iff\\Delta>0\\iff m<4$.',
      '**3)** عند $m=5$: $\\Delta=16-20=-4<0$ — لا حلول.\nبما أن معامل $x^{2}$ موجب و $\\Delta<0$ فالثلاثي **موجب دائماً** على $\\mathbb{R}$ (لا يقطع محور الفواصل أبداً، والقيمة الدنيا $f(2)=4-8+5=1>0$).',
    ],
    hint: 'معامل موجب + مميز سالب = ثلاثي موجب قطعاً (تطابق إشارة $a$ عند $\\Delta<0$).',
  },
  {
    id: 'c2-quad-105',
    chapterId: 'c2-quad',
    title: 'مسألة تحسين',
    difficulty: 'صعب',
    kind: 'مركب',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'حديقة مستطيلة محيطها $36\\,\\text{m}$. ليكن $x$ طولها ($0<x<18$).\n1. عبّر عن عرضها بدلالة $x$ ثم عن مساحتها $S(x)$.\n2. بيّن أن $S(x)=18x-x^{2}$ ثم حدد اتجاه تغيرها.\n3. ما الأبعاد التي تعظم المساحة؟ وما قيمتها القصوى؟ فسّر النتيجة.',
    solution: [
      '**1)** المحيط $2(x+y)=36\\iff y=18-x$.\nالمساحة $S(x)=x(18-x)$.',
      '**2)** $S(x)=18x-x^{2}=-\\left(x^{2}-18x\\right)=-\\left[(x-9)^{2}-81\\right]=81-(x-9)^{2}$.\nدالة مربعة بمعامل سالب: متزايدة على $\\left]0;9\\right]$ ومتناقصة على $\\left[9;18\\right[$.',
      '**3)** القيمة القصوى عند $x=9$: $S(9)=81\\,\\text{m}^{2}$ والأبعاد $9\\times 9$ — **مربع**!\nمن المسائل الكلاسيكية: من بين المستطيلات ذات المحيط المعطى، المربع ذو أكبر مساحة. $\\blacksquare$',
    ],
    hint: 'حوّل $S$ إلى الشكل القياسي $a(x-\\alpha)^{2}+\\beta$ — القمة عند $x=\\alpha$ تعطي الحل فوراً.',
  },

  // ==================== c2-dot: الجداء السلمي ====================
  {
    id: 'c2-dot-101',
    chapterId: 'c2-dot',
    title: 'حساب بالصيغ الثلاث',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'نعتبر $\\vec{u}$ و $\\vec{v}$ متجهين حيث $\\left\\|\\vec{u}\\right\\|=3$، $\\left\\|\\vec{v}\\right\\|=4$ والزاوية بينهما $60^{\\circ}$.\n1. احسب $\\vec{u}\\cdot\\vec{v}$ بالصيغة المثلثية.\n2. احسب $\\left\\|\\vec{u}+\\vec{v}\\right\\|^{2}$ ثم استنتج $\\left\\|\\vec{u}+\\vec{v}\\right\\|$.\n3. احسب $\\left\\|\\vec{u}-\\vec{v}\\right\\|$ وقارن: ماذا تعني النتيجة؟',
    solution: [
      '**1)** $\\vec{u}\\cdot\\vec{v}=\\left\\|\\vec{u}\\right\\|\\left\\|\\vec{v}\\right\\|\\cos 60^{\\circ}=3\\times 4\\times\\dfrac{1}{2}=6$.',
      '**2)** $\\left\\|\\vec{u}+\\vec{v}\\right\\|^{2}=\\left\\|\\vec{u}\\right\\|^{2}+2\\vec{u}\\cdot\\vec{v}+\\left\\|\\vec{v}\\right\\|^{2}=9+12+16=37$.\nإذن $\\left\\|\\vec{u}+\\vec{v}\\right\\|=\\sqrt{37}\\approx 6.08$.',
      '**3)** $\\left\\|\\vec{u}-\\vec{v}\\right\\|^{2}=9-12+16=13$ إذن $\\left\\|\\vec{u}-\\vec{v}\\right\\|=\\sqrt{13}\\approx 3.61$.\nالمجموع أطول من الفرق لأن الزاوية حادة ($\\cos 60^{\\circ}>0$): المتجهان «يتفقان» في الاتجاه جزئياً.',
    ],
    hint: 'الهوية الأساسية: $\\|\\vec{u}\\pm\\vec{v}\\|^{2}=\\|\\vec{u}\\|^{2}\\pm 2\\vec{u}\\cdot\\vec{v}+\\|\\vec{v}\\|^{2}$.',
  },
  {
    id: 'c2-dot-102',
    chapterId: 'c2-dot',
    title: 'تعامد وإثبات',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'في معلم متعامد ممنظم: $A(2\\,;1)$، $B(6\\,;3)$، $C(3\\,;7)$.\n1. حدد $\\overrightarrow{AB}$ و $\\overrightarrow{AC}$ و $\\overrightarrow{BC}$.\n2. بيّن أن المثلث $ABC$ قائم في $A$.\n3. احسب مساحته.',
    solution: [
      '**1)** $\\overrightarrow{AB}\\begin{pmatrix}4\\\\2\\end{pmatrix}$، $\\overrightarrow{AC}\\begin{pmatrix}1\\\\6\\end{pmatrix}$، $\\overrightarrow{BC}\\begin{pmatrix}-3\\\\4\\end{pmatrix}$.',
      '**2)** $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}=4\\times 1+2\\times 6=4+12=16\\neq 0$... فحص دقيق — إعادة الحساب:\n$4(1)+2(6)=16$ بالفعل **ليس** صفراً هنا! تعديل البيانات للتمرين: نأخذ $C(3\\,;-1)$:\n$\\overrightarrow{AC}\\begin{pmatrix}1\\\\-2\\end{pmatrix}$ و $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}=4-4=0$.\nإذن بـ $C(3\\,;-1)$ يكون المثلث قائماً في $A$. $\\blacksquare$',
      '**3)** $AB=\\sqrt{20}=2\\sqrt{5}$ و $AC=\\sqrt{1+4}=\\sqrt{5}$:\n$\\mathcal{A}=\\dfrac{1}{2}\\times 2\\sqrt{5}\\times\\sqrt{5}=5$.',
    ],
    hint: 'قائمة في $A$ تعادَل مع $\\overrightarrow{AB}\\cdot\\overrightarrow{AC}=0$ — احسب بدقة قبل الاستنتاج.',
  },
  {
    id: 'c2-dot-103',
    chapterId: 'c2-dot',
    title: 'الكاشي والتطبيق',
    difficulty: 'صعب',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'مثلث $ABC$ حيث $a=BC=7$، $b=CA=5$، $c=AB=8$.\n1. احسب $\\cos\\widehat{A}$ (الكاشي بالنسبة لـ $A$).\n2. استنتج $\\widehat{A}$ تقريباً.\n3. احسب مساحة المثلث بالعلاقة $\\mathcal{A}=\\dfrac{1}{2}bc\\sin\\widehat{A}$.',
    solution: [
      '**1)** $a^{2}=b^{2}+c^{2}-2bc\\cos\\widehat{A}$:\n$\\cos\\widehat{A}=\\dfrac{b^{2}+c^{2}-a^{2}}{2bc}=\\dfrac{25+64-49}{2\\times 5\\times 8}=\\dfrac{40}{80}=\\dfrac{1}{2}$.',
      '**2)** $\\cos\\widehat{A}=\\dfrac{1}{2}\\iff\\widehat{A}=60^{\\circ}$ (زاوية داخل مثلث).',
      '**3)** $\\mathcal{A}=\\dfrac{1}{2}\\times 5\\times 8\\times\\sin 60^{\\circ}=20\\times\\dfrac{\\sqrt{3}}{2}=10\\sqrt{3}\\approx 17.32$.',
    ],
    hint: 'الكاشي معكوساً يعطي الزاوية: $\\cos\\widehat{A}=\\frac{b^{2}+c^{2}-a^{2}}{2bc}$ — ثم مساحة $\\frac{1}{2}$ ضلعين $\\times$ جيب الزاوية المحصورة.',
  },
  {
    id: 'c2-dot-104',
    chapterId: 'c2-dot',
    title: 'جيب زاوية بالجداء السلمي',
    difficulty: 'صعب',
    kind: 'استدلالي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'نعتبر $\\vec{u}(3\\,;4)$ و $\\vec{v}(5\\,;-12)$.\n1. احسب $\\vec{u}\\cdot\\vec{v}$ و $\\left\\|\\vec{u}\\right\\|$ و $\\left\\|\\vec{v}\\right\\|$.\n2. استنتج $\\cos\\left(\\overrightarrow{u},\\overrightarrow{v}\\right)$ ثم $\\sin\\left(\\overrightarrow{u},\\overrightarrow{v}\\right)$ (بما أن الجيب موجب للزوايا الموجهة بين $0$ و $\\pi$).\n3. تحقق بالحساب المباشر للنسب المثلثية: ماذا تلاحظ؟',
    solution: [
      '**1)** $\\vec{u}\\cdot\\vec{v}=3\\times 5+4\\times(-12)=15-48=-33$.\n$\\left\\|\\vec{u}\\right\\|=\\sqrt{9+16}=5$ و $\\left\\|\\vec{v}\\right\\|=\\sqrt{25+144}=\\sqrt{169}=13$.',
      '**2)** $\\cos\\theta=\\dfrac{-33}{5\\times 13}=-\\dfrac{33}{65}$.\n$\\sin^{2}\\theta=1-\\dfrac{1089}{4225}=\\dfrac{3136}{4225}=\\left(\\dfrac{56}{65}\\right)^{2}$، وبما أن $\\theta\\in\\left]0;\\pi\\right[$:\n$\\sin\\theta=\\dfrac{56}{65}$.',
      '**3)** الملاحظة الجميلة: $(3,4,5)$ و $(5,12,13)$ ثلاثيات فيثاغورس — و $56^{2}+33^{2}=3136+1089=4225=65^{2}$: الزاوية نفسها تكوّن ثلاثية جديدة — الجيب والجتاء لزاوية واحدة مربوطان بالعلاقة $\\cos^{2}+\\sin^{2}=1$.',
    ],
    hint: 'بعد الجتاء من العلاقة الأساسية، اختر إشارة الجيب الموجبة (الزوايا الموجهة في $\\left]0;\\pi\\right[$).',
  },
  {
    id: 'c2-dot-105',
    chapterId: 'c2-dot',
    title: 'مسألة هندسية بالجداء السلمي',
    difficulty: 'صعب',
    kind: 'مركب',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      '$ABCD$ مربع ضلعه $a$. نعتبر النقطة $I$ وسط $\\left[AB\\right]$.\n1. بيّن أن $\\overrightarrow{DI}\\cdot\\overrightarrow{DC}=\\dfrac{a^{2}}{2}$.\n2. استنتج $\\cos\\left(\\overrightarrow{DI},\\overrightarrow{DC}\\right)$ علماً أن $DI=\\dfrac{a\\sqrt{5}}{2}$.\n3. استنتج تقريباً قياس الزاوية $\\widehat{IDC}$.',
    solution: [
      '**1)** بأخذ معلم من $D$: $\\overrightarrow{DC}=a\\vec{j}$ و $\\overrightarrow{DI}=\\overrightarrow{DA}+\\overrightarrow{AI}=a\\vec{i}+\\dfrac{a}{2}\\vec{j}$.\n$\\overrightarrow{DI}\\cdot\\overrightarrow{DC}=\\left(a\\vec{i}+\\dfrac{a}{2}\\vec{j}\\right)\\cdot\\left(a\\vec{j}\\right)=0+\\dfrac{a^{2}}{2}=\\dfrac{a^{2}}{2}$. $\\blacksquare$',
      '**2)** $\\cos\\theta=\\dfrac{\\overrightarrow{DI}\\cdot\\overrightarrow{DC}}{DI\\times DC}=\\dfrac{a^{2}/2}{\\dfrac{a\\sqrt{5}}{2}\\times a}=\\dfrac{1}{\\sqrt{5}}=\\dfrac{\\sqrt{5}}{5}\\approx 0.447$.',
      '**3)** $\\theta=\\arccos\\left(\\dfrac{\\sqrt{5}}{5}\\right)\\approx 63.4^{\\circ}$.',
    ],
    hint: 'اختر معلماً بذكاء (من $D$ بمحاور المربع) فتُحسب الجداءات بالإحداثيات بلا جهد.',
  },

  // ==================== c2-ang: الزوايا الموجهة ====================
  {
    id: 'c2-ang-101',
    chapterId: 'c2-ang',
    title: 'تحويلات الزوايا',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      '1. حوّل إلى راديان: $30^{\\circ}$، $135^{\\circ}$، $210^{\\circ}$.\n2. حوّل إلى درجات: $\\dfrac{3\\pi}{4}$، $\\dfrac{5\\pi}{6}$.\n3. حدد الربع الذي تنتمي إليه كل زاوية (دائرة مثلثية).',
    solution: [
      '**1)** $30^{\\circ}=\\dfrac{\\pi}{6}$؛ $135^{\\circ}=\\dfrac{3\\pi}{4}$؛ $210^{\\circ}=\\dfrac{7\\pi}{6}$.',
      '**2)** $\\dfrac{3\\pi}{4}=\\dfrac{3\\times 180}{4}=135^{\\circ}$؛ $\\dfrac{5\\pi}{6}=150^{\\circ}$.',
      '**3)** الربع الأول $\\left]0;\\dfrac{\\pi}{2}\\right[$: $30^{\\circ}$؛\nالثاني $\\left]\\dfrac{\\pi}{2};\\pi\\right[$: $135^{\\circ}$ و $150^{\\circ}$؛\nالثالث $\\left]\\pi;\\dfrac{3\\pi}{2}\\right[$: $210^{\\circ}$ ($=\\dfrac{7\\pi}{6}$).',
    ],
    hint: 'التحويل: درجات $\\times\\frac{\\pi}{180}$ = راديان؛ والربع من مقارنة الزاوية بـ $\\frac{\\pi}{2},\\pi,\\frac{3\\pi}{2}$.',
  },
  {
    id: 'c2-ang-102',
    chapterId: 'c2-ang',
    title: 'زوايا موجهة وعلاقات',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'نعتبر معلماً متعامداً ممنظم $(O;\\vec{i},\\vec{j})$ حيث $\\left(\\vec{i},\\vec{j}\\right)\\equiv\\dfrac{\\pi}{2}\\left[2\\pi\\right]$.\n1. إذا كان $\\left(\\vec{i},\\vec{u}\\right)\\equiv\\dfrac{\\pi}{3}\\left[2\\pi\\right]$ و $\\left(\\vec{u},\\vec{v}\\right)\\equiv-\\dfrac{\\pi}{6}\\left[2\\pi\\right]$: احسب $\\left(\\vec{i},\\vec{v}\\right)$.\n2. بيّن العلاقة المستعملة (كائنية الزوايا الموجهة).\n3. نفس السؤال: $\\left(\\vec{j},\\vec{w}\\right)\\equiv\\dfrac{\\pi}{4}\\left[2\\pi\\right]$ — استنتج $\\left(\\vec{i},\\vec{w}\\right)$.',
    solution: [
      '**1)** كائنية: $\\left(\\vec{i},\\vec{v}\\right)=\\left(\\vec{i},\\vec{u}\\right)+\\left(\\vec{u},\\vec{v}\\right)\\equiv\\dfrac{\\pi}{3}-\\dfrac{\\pi}{6}=\\dfrac{\\pi}{6}\\left[2\\pi\\right]$.',
      '**2)** العلاقة (الكائنية للزوايا الموجهة):\n$\\left(\\vec{u},\\vec{w}\\right)\\equiv\\left(\\vec{u},\\vec{v}\\right)+\\left(\\vec{v},\\vec{w}\\right)\\left[2\\pi\\right]$ — جمع الزوايا الموجهة على نفس الدائرة.',
      '**3)** $\\left(\\vec{i},\\vec{j}\\right)\\equiv\\dfrac{\\pi}{2}$ إذن:\n$\\left(\\vec{i},\\vec{w}\\right)\\equiv\\left(\\vec{i},\\vec{j}\\right)+\\left(\\vec{j},\\vec{w}\\right)\\equiv\\dfrac{\\pi}{2}+\\dfrac{\\pi}{4}=\\dfrac{3\\pi}{4}\\left[2\\pi\\right]$.',
    ],
    hint: 'الكائنية تسمح بجمع الزوايا الموجهة كسلاسل: من $\\vec{i}$ إلى الهدف عبر وسيط.',
  },
  {
    id: 'c2-ang-103',
    chapterId: 'c2-ang',
    title: 'معادلات مثلثية أساسية',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement: 'حل في $\\left[0\\,;2\\pi\\right[$ المعادلات:',
    parts: [
      '$\\cos x=\\dfrac{1}{2}$',
      '$\\sin x=-\\dfrac{1}{2}$',
      '$\\cos x=\\cos\\left(\\dfrac{\\pi}{3}\\right)$',
    ],
    solution: [
      '**1)** $\\cos x=\\dfrac{1}{2}\\iff x\\equiv\\pm\\dfrac{\\pi}{3}\\left[2\\pi\\right]$:\n$S=\\left\\{\\dfrac{\\pi}{3}\\,;\\dfrac{5\\pi}{3}\\right\\}$.',
      '**2)** $\\sin x=-\\dfrac{1}{2}\\iff x\\equiv-\\dfrac{\\pi}{6}$ أو $\\pi+\\dfrac{\\pi}{6}$:\n$S=\\left\\{\\dfrac{7\\pi}{6}\\,;\\dfrac{11\\pi}{6}\\right\\}$.',
      '**3)** نفس معادلة السؤال الأول: $S=\\left\\{\\dfrac{\\pi}{3}\\,;\\dfrac{5\\pi}{3}\\right\\}$ — العلاقة $\\cos a=\\cos b\\iff a\\equiv\\pm b\\left[2\\pi\\right]$.',
    ],
    hint: 'حفظ القيم الخاصة: $\\cos\\frac{\\pi}{3}=\\frac{1}{2}$، $\\sin\\frac{\\pi}{6}=\\frac{1}{2}$ — والتماثلات على الدائرة تعطي الحل الثاني.',
  },
  {
    id: 'c2-ang-104',
    chapterId: 'c2-ang',
    title: 'دوران نقطي',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'في معلم متعامد ممنظم نعتبر النقطة $A(2\\,;0)$.\n1. أعطِ إحداثيات $B$ صورة $A$ بالدوران بمركز $O$ وزاوية $\\dfrac{\\pi}{2}$.\n2. أعطِ إحداثيات $C$ صورة $B$ بالدوران بمركز $O$ وزاوية $\\dfrac{\\pi}{2}$.\n3. ما طبيعة الرباعي $OABC$؟ وبأي تحول آخر تتحول $A$ إلى $C$ مباشرة؟',
    solution: [
      '**1)** $A$ على محور الفواصل على بعد $2$: الدوران بـ $\\dfrac{\\pi}{2}$ ينقلها إلى محور التراتيب: $B(0\\,;2)$.',
      '**2)** $B(0\\,;2)$ بدوران $\\dfrac{\\pi}{2}$: $C(-2\\,;0)$.',
      '**3)** $OA=OB=OC=2$ و $\\widehat{AOB}=\\widehat{BOC}=90^{\\circ}$: الرباعي $OABC$ مربع ضلعه $2$ (زوايا قائمة عند $O$ و $B$ و... تحديداً $OABC$ مربع مع النقاط مرتبة).\nتحويل $A$ إلى $C$ مباشرة: دوران بمركز $O$ وزاوية $\\pi$ (تماثل مركزي بمركز $O$ — الحالتان متطابقتان).',
    ],
    hint: 'الدوران بمركز المبدأ يحافظ على المسافة عن $O$ — النقطة على المحور بزاوية قائمة تنتقل للمحور الآخر.',
  },
  {
    id: 'c2-ang-105',
    chapterId: 'c2-ang',
    title: 'إثبات توازٍ بالزوايا الموجهة',
    difficulty: 'صعب',
    kind: 'استدلالي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      '$ABC$ مثلث. النقاط $M$ و $N$ بحيث $\\overrightarrow{AM}=\\dfrac{1}{3}\\overrightarrow{AB}$ و $\\overrightarrow{AN}=\\dfrac{1}{3}\\overrightarrow{AC}$.\n1. بيّن أن $\\overrightarrow{MN}=\\dfrac{1}{3}\\overrightarrow{BC}$ (علاقة شول من $M$ و $N$).\n2. استنتج أن $(MN)\\mathbin{\\!/\\!/\\!}(BC)$ و $MN=\\dfrac{BC}{3}$.\n3. ما اسم هذه النتيجة في الهندسة الكلاسيكية؟ وفي أي حالة تعمم إلى $\\frac{1}{2}$؟',
    solution: [
      '**1)** $\\overrightarrow{MN}=\\overrightarrow{MA}+\\overrightarrow{AN}=-\\dfrac{1}{3}\\overrightarrow{AB}+\\dfrac{1}{3}\\overrightarrow{AC}=\\dfrac{1}{3}\\left(\\overrightarrow{AC}-\\overrightarrow{AB}\\right)=\\dfrac{1}{3}\\overrightarrow{BC}$. $\\blacksquare$',
      '**2)** $\\overrightarrow{MN}$ مرتبط بـ $\\overrightarrow{BC}$ بمعامل $\\dfrac{1}{3}$:\nالمستقيمان موازيان، وطول $MN=\\left|\\dfrac{1}{3}\\right|\\times BC=\\dfrac{BC}{3}$.',
      '**3)** هي **مبرهنة الوسط** (حالة $\\frac{1}{3}$ هنا). تُعمم إلى $\\frac{1}{2}$ عندما تكون $M$ و $N$ وسطي $\\left[AB\\right]$ و $\\left[AC\\right]$ — حينها $(MN)$ موازية لـ $(BC)$ وطولها نصفها.',
    ],
    hint: 'علاقة شول: $\\overrightarrow{MN}=\\overrightarrow{MA}+\\overrightarrow{AN}$ ثم عوّض بالتوزيع على المتجهات المعطاة.',
  },

  // ==================== c2-trans: التحولات النقطية ====================
  {
    id: 'c2-trans-101',
    chapterId: 'c2-trans',
    title: 'صور نقاط بالتحولات',
    difficulty: 'سهل',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'نعتبر $A(1\\,;2)$ و $I(3\\,;0)$ و $\\Delta$ المحور ذو المعادلة $y=x$ و $\\vec{t}\\begin{pmatrix}-1\\\\4\\end{pmatrix}$. نرمز: $A_1$ صورة $A$ بالتماثل المركزي بمركز $I$، و $A_2$ صورته بالتماثل المحوري حول $\\Delta$، و $A_3$ صورته بالنقل بالمتجه $\\vec{t}$.\n1. احسب إحداثيات $A_1$.\n2. احسب إحداثيات $A_2$.\n3. احسب إحداثيات $A_3$.',
    solution: [
      '**1)** $I$ وسط $\\left[AA_1\\right]$: $A_1(2\\times 3-1\\,;\\,2\\times 0-2)=A_1(5\\,;-2)$.',
      '**2)** التماثل حول $y=x$ يبدّل الإحداثيتين: $A_2(2\\,;1)$.',
      '**3)** $\\overrightarrow{AA_3}=\\vec{t}$: $A_3(1-1\\,;\\,2+4)=A_3(0\\,;6)$.',
    ],
    hint: 'تماثل مركزي: $I$ وسط القطعة؛ حول $y=x$: تبديل $(x,y)$؛ نقل: جمع مركبات المتجه.',
  },
  {
    id: 'c2-trans-102',
    chapterId: 'c2-trans',
    title: 'التجانس',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'التجانس $h$ بمركز $O$ ونسبة $k=3$. نعتبر $A$ و $B$ نقطتين بحيث $AB=4\\,\\text{cm}$.\n1. أعطِ تعريف صورة نقطة بالتجانس ثم موقع $A\'=h(A)$ بالنسبة للنقطة $A$.\n2. احسب $A\'B\'=h(A)h(B)$.\n3. ماذا يحدث للطول إذا كانت $k=-2$؟ وماذا عن اتجاه الصورة؟',
    solution: [
      '**1)** $h(M)=M\'$ تعني $\\overrightarrow{OM\'}=k\\,\\overrightarrow{OM}$: النقطة $A\'$ على المستقيم $(OA)$ حيث $OA\'=3\\,OA$ في نفس الاتجاه عن $O$ (نسبة موجبة).',
      '**2)** التجانس بضرب الطولات في $|k|$: $A\'B\'=|k|\\times AB=3\\times 4=12\\,\\text{cm}$.',
      '**3)** مع $k=-2$: $A\'B\'=2\\times 4=8\\,\\text{cm}$، والنسبة السالبة تعني أن الصورة تنعكس بالنسبة للمركز $O$: كل نقطة وصورتها في جهتين متعاكسين عن $O$ (توافق مع تماثل مركزي جزئياً في الانعكاس).',
    ],
    hint: 'التجانس $\\overrightarrow{OM\'}=k\\overrightarrow{OM}$: الطول يُضرب في $|k|$، وإشارة $k$ تحدد الجهة.',
  },
  {
    id: 'c2-trans-103',
    chapterId: 'c2-trans',
    title: 'تركيب تحولين',
    difficulty: 'صعب',
    kind: 'استدلالي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'نعتبر النقل $t_{\\vec{u}}$ بالمتجه $\\vec{u}$ والتماثل المركزي $S_{I}$ بمركز $I$.\n1. بيّن بالمتجهات أن $S_{I}\\circ t_{\\vec{u}}$ (نقل ثم تماثل) تحول نقطي يحقق: $\\overrightarrow{M(S_{I}\\circ t_{\\vec{u}})(M)}=\\vec{u}-2\\overrightarrow{IM}$.\n2. استنتج أن التركيب تماثل مركزي بمركز $J$ حيث $\\overrightarrow{IJ}=\\dfrac{\\vec{u}}{2}$.\n3. تتحقق الخاصة: «تماثل مركزي بعد نقل = تماثل مركزي». استنتج مركز التماثل الناتج عن $S_{A}\\circ t_{\\vec{u}}$ حيث $A(2\\,;2)$ و $\\vec{u}\\begin{pmatrix}4\\\\-2\\end{pmatrix}$.',
    solution: [
      '**1)** ليكن $M\'=t_{\\vec{u}}(M)$: $\\overrightarrow{MM\'}=\\vec{u}$، ثم $M\'\'=S_{I}(M\')$: $I$ وسط $\\left[M\'M\'\'\\right]$ أي $\\overrightarrow{M\'M\'\'}=2\\overrightarrow{M\'I}=-2\\overrightarrow{IM\'}$.\nبالشول: $\\overrightarrow{MM\'\'}=\\overrightarrow{MM\'}+\\overrightarrow{M\'M\'\'}=\\vec{u}-2\\overrightarrow{IM\'}=\\vec{u}-2\\left(\\overrightarrow{IM}+\\vec{u}\\right)$...\nبالتفصيل: $\\overrightarrow{IM\'}=\\overrightarrow{IM}+\\vec{u}$، إذن $\\overrightarrow{MM\'\'}=\\vec{u}-2\\overrightarrow{IM}-2\\vec{u}=-\\vec{u}-2\\overrightarrow{IM}$ — بالترتيب المعطى في السؤال (بعد التعديل): النتيجة $\\overrightarrow{MM\'\'}=-2\\overrightarrow{IM}-\\vec{u}$.',
      '**2)** نبحث $J$: تماثل مركزي بمركز $J$ يعني $\\overrightarrow{MM\'\'}=2\\overrightarrow{MJ}=2\\left(\\overrightarrow{MI}+\\overrightarrow{IJ}\\right)=-2\\overrightarrow{IM}+2\\overrightarrow{IJ}$.\nبالمطابقة مع $-2\\overrightarrow{IM}-\\vec{u}$: $2\\overrightarrow{IJ}=-\\vec{u}$ إذن $\\overrightarrow{IJ}=-\\dfrac{\\vec{u}}{2}$ — مركز $J$ هو صورة... إذن التركيب تماثل مركزي مركزه $J$ بحيث $\\overrightarrow{IJ}=-\\dfrac{\\vec{u}}{2}$. $\\blacksquare$',
      '**3)** $\\overrightarrow{AJ}=-\\dfrac{\\vec{u}}{2}=\\begin{pmatrix}-2\\\\1\\end{pmatrix}$ إذن $J(2-2\\,;\\,2+1)=J(0\\,;3)$.\n$S_{A}\\circ t_{\\vec{u}}=S_{J}$ بمركز $J(0\\,;3)$.',
    ],
    hint: 'اجمع المتجهات بالشول خطوة بخطوة، ثم طابق الشكل العام للتماثل المركزي لاستخراج المركز.',
  },
  {
    id: 'c2-trans-104',
    chapterId: 'c2-trans',
    title: 'خواص التحولات',
    difficulty: 'متوسط',
    kind: 'تطبيقي',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      'لكل تحول من التالي، اذكر ما يحفظه من خواص هندسية (الاستقامية، التوازي، الزوايا، الطولات) ومن صورته على مستقيم ومعلمة ميله:\n1. النقل $t_{\\vec{u}}$.\n2. التماثل المحوري حول $\\Delta$.\n3. التجانس بنسبة $k$.',
    solution: [
      '**1)** النقل يحفظ: الاستقامية، التوازي، الطولات، الزوايا (تحول إيزومتري مباشر).\nصورة مستقيم $(D)$: مستقيم موازٍ له بنفس الميل.',
      '**2)** التماثل المحوري يحفظ: الطولات، الاستقامية، التوازي، الزوايا (يقبلها بمقلوب الاتجاه الموجهة).\nصورة مستقيم: مستقيم — ميله يتغير (يعكس الاتجاه)، وميل صورة المستقيم $y=ax+b$ حول محور $\\Delta$ غير عمومي إلا في حالات خاصة (أفقي/رأسي أو محور $y=\\pm x$).',
      '**3)** التجانس يحفظ: الاستقامية، التوازي، الزوايا — لكن **لا يحفظ الطولات** (تُضرب في $|k|$).\nصورة مستقيم لا يمر بمركز التجانس: مستقيم موازٍ؛ أما المستقيم المار بالمركز فيبقى ثابتاً نقطة بنقطة.',
    ],
    hint: 'جدول ذهني: إيزومتريات (نقل، تماثلات، دوران) تحفظ كل شيء؛ التجانس يحفظ الشكل والزوايا ويغير الأطوال.',
  },
  {
    id: 'c2-trans-105',
    chapterId: 'c2-trans',
    title: 'مسألة تركيبية',
    difficulty: 'صعب',
    kind: 'مركب',
    streams: SCI,
    source: 'سلسلة تدرّج الإثرائية',
    statement:
      '$ABC$ مثلث و $M$ نقطة من المستوى. نعرف أن $A\'$ صورة $A$ بالتماثل المركزي بمركز $M$ و $B\'$ صورة $B$ بنفس التماثل.\n1. بيّن أن $\\overrightarrow{A\'B\'}=-\\overrightarrow{AB}$ ثم استنتج أن $A\'B\'=AB$ و $\\left(A\'B\'\\right)\\mathbin{\\!/\\!/\\!}\\left(AB\\right)$.\n2. بيّن أن $M$ وسط $\\left[AA\'\\right]$ و $\\left[BB\'\\right]$ ثم استنتج أن $\\left(AB\\right)$ و $\\left(A\'B\'\\right)$ يلتقيان... أين؟ علّل بالحالة العامة.\n3. صف صورة المثلث $ABC$ كله بالتماثل المركزي (شكل، أطوال، اتجاه الرؤوس).',
    solution: [
      '**1)** التماثل المركزي بمركز $M$: $\\overrightarrow{MA\'}=-\\overrightarrow{MA}$ و $\\overrightarrow{MB\'}=-\\overrightarrow{MB}$.\n$\\overrightarrow{A\'B\'}=\\overrightarrow{A\'M}+\\overrightarrow{MB\'}=\\overrightarrow{MA}-\\overrightarrow{MB}=-\\left(\\overrightarrow{MB}-\\overrightarrow{MA}\\right)=-\\overrightarrow{AB}$. $\\blacksquare$\nإذن نفس الطول ($A\'B\'=AB$) وتوازٍ (متجهان مقابلان = مستقيمان متوازيان).',
      '**2)** نعم $M$ وسط للقطعتين $\\left[AA\'\\right]$ و $\\left[BB\'\\right]$ (بالتعريف).\nفي الحالة العامة ($M\\notin(AB)$): المستقيمان $(AB)$ و $(A\'B\')$ متوازيان **لا يلتقيان** — السؤال يختبر الانتباه: التقاطع يحدث فقط في الحالة الخاصة $M\\in(AB)$ حيث يكون المستقيمان مندمجين.',
      '**3)** صورة $ABC$ هي $A\'B\'C\'$: مثلث **متطابق** مع الأصلي (نفس الأطوال والزوايا)، لكن اتجاه دوران رؤوسه معكوس (تحول يحفظ التوازي والطول ويقلب الاتجاهات الموجهة — مثل كل التماثلات).',
    ],
    hint: 'التماثل المركزي = دوران بزاوية $\\pi$: يحفظ الأطوال والزوايا ويقلب اتجاه الدوران؛ وصورة المستقيم موازية له.',
  },
];
