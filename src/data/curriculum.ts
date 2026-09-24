/**
 * التدرج السنوي الرسمي لمادة الرياضيات — السنوات الأولى والثانية والثالثة ثانوي
 * المصدر: التدرجات السنوية 2022-2023 — المفتشية العامة للتربية الوطنية
 *         مديرية التعليم الثانوي العام والتكنولوجي — وزارة التربية الوطنية
 */

export type YearId = '1as' | '2as' | '3as';

export interface LevelInfo {
  id: YearId;
  name: string;
  shortName: string;
  description: string;
}

export const LEVELS: LevelInfo[] = [
  {
    id: '1as',
    name: 'السنة الأولى ثانوي',
    shortName: 'أولى',
    description: 'جذع مشترك (علوم وتكنولوجيا / آداب) — بناء المكتسبات الأساسية',
  },
  {
    id: '2as',
    name: 'السنة الثانية ثانوي',
    shortName: 'ثانية',
    description: 'توجيه شعبي (علوم، رياضيات، تقني رياضي، تسيير واقتصاد، آداب)',
  },
  {
    id: '3as',
    name: 'السنة الثالثة ثانوي',
    shortName: 'ثالثة',
    description: 'التحضير للبكالوريا — الشعب العلمية والأدبية',
  },
];

export function getLevel(id: YearId): LevelInfo {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[2];
}

export type StreamId =
  | '1sciences'
  | '1arts'
  | '2sciences'
  | '2math'
  | '2techmath'
  | '2economy'
  | '2literature'
  | 'sciences'
  | 'math'
  | 'techmath'
  | 'economy'
  | 'literature';

export interface StreamInfo {
  id: StreamId;
  year: YearId;
  name: string;
  shortName: string;
  weeklyHours: number;
  totalHours: number;
  totalWeeks: number;
  color: string; // tailwind classes for chips
  description: string;
}

export type PlanKind = 'assessment' | 'chapter' | 'remedial';

export interface PlanRow {
  kind: PlanKind;
  label: string; // اسم المحور كما ورد في التدرج
  chapterId?: string; // ربط بالفصل في بنك التمارين
  weeks: number;
  hours: number;
}

export const STREAMS: StreamInfo[] = [
  // ==================== السنة الأولى ثانوي ====================
  {
    id: '1sciences',
    year: '1as',
    name: 'جذع مشترك علوم وتكنولوجيا',
    shortName: 'جذع علوم',
    weeklyHours: 6,
    totalHours: 162,
    totalWeeks: 27,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'جذع مشترك علوم وتكنولوجيا — 6 ساعات أسبوعياً',
  },
  {
    id: '1arts',
    year: '1as',
    name: 'جذع مشترك آداب',
    shortName: 'جذع آداب',
    weeklyHours: 3,
    totalHours: 81,
    totalWeeks: 27,
    color: 'bg-stone-100 text-stone-800 border-stone-300',
    description: 'جذع مشترك آداب — 3 ساعات أسبوعياً',
  },
  // ==================== السنة الثانية ثانوي ====================
  {
    id: '2sciences',
    year: '2as',
    name: 'علوم تجريبية (ثانية)',
    shortName: 'علوم',
    weeklyHours: 5,
    totalHours: 135,
    totalWeeks: 27,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'شعبة علوم تجريبية — السنة الثانية — 5 ساعات أسبوعياً',
  },
  {
    id: '2math',
    year: '2as',
    name: 'رياضيات (ثانية)',
    shortName: 'رياضيات',
    weeklyHours: 7,
    totalHours: 189,
    totalWeeks: 27,
    color: 'bg-violet-100 text-violet-800 border-violet-200',
    description: 'شعبة رياضيات — السنة الثانية — 7 ساعات أسبوعياً',
  },
  {
    id: '2techmath',
    year: '2as',
    name: 'تقني رياضي (ثانية)',
    shortName: 'تقني رياضي',
    weeklyHours: 6,
    totalHours: 162,
    totalWeeks: 27,
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'شعبة تقني رياضي — السنة الثانية — 6 ساعات أسبوعياً',
  },
  {
    id: '2economy',
    year: '2as',
    name: 'تسيير واقتصاد (ثانية)',
    shortName: 'تسيير',
    weeklyHours: 3,
    totalHours: 81,
    totalWeeks: 27,
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'شعبة تسيير واقتصاد — السنة الثانية — 3 ساعات أسبوعياً',
  },
  {
    id: '2literature',
    year: '2as',
    name: 'آداب وفلسفة + لغات أجنبية (ثانية)',
    shortName: 'آداب',
    weeklyHours: 2,
    totalHours: 54,
    totalWeeks: 27,
    color: 'bg-stone-100 text-stone-800 border-stone-300',
    description: 'شعب آداب وفلسفة ولغات — السنة الثانية — ساعتان أسبوعياً',
  },
  // ==================== السنة الثالثة ثانوي ====================
  {
    id: 'sciences',
    year: '3as',
    name: 'علوم تجريبية',
    shortName: 'علوم',
    weeklyHours: 5,
    totalHours: 135,
    totalWeeks: 27,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'شعبة علوم تجريبية — 5 ساعات أسبوعياً',
  },
  {
    id: 'math',
    year: '3as',
    name: 'رياضيات',
    shortName: 'رياضيات',
    weeklyHours: 7,
    totalHours: 189,
    totalWeeks: 27,
    color: 'bg-violet-100 text-violet-800 border-violet-200',
    description: 'شعبة رياضيات — 7 ساعات أسبوعياً',
  },
  {
    id: 'techmath',
    year: '3as',
    name: 'تقني رياضي',
    shortName: 'تقني رياضي',
    weeklyHours: 6,
    totalHours: 162,
    totalWeeks: 27,
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'شعبة تقني رياضي — 6 ساعات أسبوعياً',
  },
  {
    id: 'economy',
    year: '3as',
    name: 'تسيير واقتصاد',
    shortName: 'تسيير',
    weeklyHours: 4,
    totalHours: 108,
    totalWeeks: 27,
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'شعبة تسيير واقتصاد — 4 ساعات أسبوعياً',
  },
  {
    id: 'literature',
    year: '3as',
    name: 'آداب وفلسفة + لغات أجنبية',
    shortName: 'آداب',
    weeklyHours: 2,
    totalHours: 54,
    totalWeeks: 27,
    color: 'bg-stone-100 text-stone-800 border-stone-300',
    description: 'شعب آداب وفلسفة ولغات أجنبية — ساعتان أسبوعياً',
  },
];

export function streamsOfYear(year: YearId): StreamInfo[] {
  return STREAMS.filter((s) => s.year === year);
}

/**
 * التدرج الأسبوعي كما ورد في الوثيقة الرسمية (جداول بناء التعلمات).
 * الترتيب والأسابيع والحجم الساعي مطابقون للوثيقة.
 */
export const ANNUAL_PLANS: Record<StreamId, PlanRow[]> = {
  // ==================== السنة الأولى ====================
  '1sciences': [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'الأعداد والحساب', chapterId: 'c1-numbers', weeks: 6, hours: 36 },
    { kind: 'chapter', label: 'الدوال (عموميات)', chapterId: 'c1-func', weeks: 2.5, hours: 15 },
    { kind: 'chapter', label: 'الحساب الشعاعي ومعادلة مستقيم', chapterId: 'c1-rn', weeks: 3.5, hours: 21 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'الدوال المرجعية', chapterId: 'c1-ref', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'العبارات الجبرية', chapterId: 'c1-alg', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'الهندسة المستوية', chapterId: 'c1-geo', weeks: 2.5, hours: 15 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'الهندسة في الفضاء', chapterId: 'c1-space', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'الإحصاء', chapterId: 'c1-stat', weeks: 2.5, hours: 15 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 6 },
  ],
  '1arts': [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 3 },
    { kind: 'chapter', label: 'الأعداد والحساب', chapterId: 'c1-numbers', weeks: 9, hours: 27 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 3 },
    { kind: 'chapter', label: 'الأعداد والحساب (تابع)', chapterId: 'c1-numbers', weeks: 1, hours: 3 },
    { kind: 'chapter', label: 'الدوال', chapterId: 'c1-func', weeks: 6, hours: 18 },
    { kind: 'chapter', label: 'الهندسة المستوية', chapterId: 'c1-geo', weeks: 2, hours: 6 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 3 },
    { kind: 'chapter', label: 'الهندسة المستوية (تابع)', chapterId: 'c1-geo', weeks: 1, hours: 3 },
    { kind: 'chapter', label: 'الإحصاء', chapterId: 'c1-stat', weeks: 4, hours: 12 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 3 },
  ],
  // ==================== السنة الثانية ====================
  '2sciences': [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'الدوال', chapterId: 'c2-func', weeks: 2.5, hours: 13 },
    { kind: 'chapter', label: 'الاشتقاقية', chapterId: 'c2-deriv', weeks: 2.5, hours: 12 },
    { kind: 'chapter', label: 'الاحتمالات', chapterId: 'c2-prob', weeks: 3, hours: 15 },
    { kind: 'chapter', label: 'المرجّح', chapterId: 'c2-prob', weeks: 1, hours: 5 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'المرجّح (تابع)', chapterId: 'c2-prob', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'النهايات', chapterId: 'c2-limits', weeks: 2, hours: 10 },
    { kind: 'chapter', label: 'الزوايا الموجهة', chapterId: 'c2-ang', weeks: 2, hours: 10 },
    { kind: 'chapter', label: 'التحولات النقطية', chapterId: 'c2-trans', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'الجداء السلمي', chapterId: 'c2-dot', weeks: 2, hours: 10 },
    { kind: 'chapter', label: 'المتتاليات', chapterId: 'c2-seq', weeks: 1, hours: 5 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'المتتاليات (تابع)', chapterId: 'c2-seq', weeks: 1.5, hours: 7 },
    { kind: 'chapter', label: 'الهندسة في الفضاء', chapterId: 'c2-space', weeks: 3.5, hours: 18 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 5 },
  ],
  '2math': [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 7 },
    { kind: 'chapter', label: 'الدوال', chapterId: 'c2-func', weeks: 3, hours: 21 },
    { kind: 'chapter', label: 'الاشتقاقية', chapterId: 'c2-deriv', weeks: 2.5, hours: 17 },
    { kind: 'chapter', label: 'الاحتمالات', chapterId: 'c2-prob', weeks: 2, hours: 14 },
    { kind: 'chapter', label: 'المرجّح', chapterId: 'c2-prob', weeks: 1.5, hours: 11 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 7 },
    { kind: 'chapter', label: 'النهايات', chapterId: 'c2-limits', weeks: 2.5, hours: 18 },
    { kind: 'chapter', label: 'الزوايا الموجهة', chapterId: 'c2-ang', weeks: 2, hours: 14 },
    { kind: 'chapter', label: 'التحولات النقطية', chapterId: 'c2-trans', weeks: 1.5, hours: 10 },
    { kind: 'chapter', label: 'الجداء السلمي', chapterId: 'c2-dot', weeks: 3, hours: 21 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 7 },
    { kind: 'chapter', label: 'المتتاليات', chapterId: 'c2-seq', weeks: 2, hours: 14 },
    { kind: 'chapter', label: 'الهندسة في الفضاء', chapterId: 'c2-space', weeks: 3, hours: 21 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 7 },
  ],
  '2techmath': [
    { kind: 'assessment', label: 'التقويم التشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'الدوال', chapterId: 'c2-func', weeks: 3, hours: 18 },
    { kind: 'chapter', label: 'الاشتقاقية', chapterId: 'c2-deriv', weeks: 2.5, hours: 15 },
    { kind: 'chapter', label: 'الاحتمالات', chapterId: 'c2-prob', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'المرجّح', chapterId: 'c2-prob', weeks: 1.5, hours: 9 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'النهايات', chapterId: 'c2-limits', weeks: 2.5, hours: 15 },
    { kind: 'chapter', label: 'الزوايا الموجهة', chapterId: 'c2-ang', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'التحولات النقطية', chapterId: 'c2-trans', weeks: 1.5, hours: 9 },
    { kind: 'chapter', label: 'الجداء السلمي', chapterId: 'c2-dot', weeks: 3, hours: 18 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'المتتاليات', chapterId: 'c2-seq', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'الهندسة في الفضاء', chapterId: 'c2-space', weeks: 3, hours: 18 },
    { kind: 'remedial', label: 'المعالجة البيداغوجية', weeks: 1, hours: 6 },
  ],
  '2economy': [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 3 },
    { kind: 'chapter', label: 'النسب والمؤشرات المئوية', chapterId: 'c2-ratio', weeks: 3, hours: 9 },
    { kind: 'chapter', label: 'الإحصاء', chapterId: 'c2-stat', weeks: 3, hours: 9 },
    { kind: 'chapter', label: 'الاحتمالات', chapterId: 'c2-prob', weeks: 2, hours: 6 },
    { kind: 'chapter', label: 'الدوال (عموميات)', chapterId: 'c2-func', weeks: 2, hours: 6 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 3 },
    { kind: 'chapter', label: 'المشتقات', chapterId: 'c2-deriv', weeks: 3, hours: 9 },
    { kind: 'chapter', label: 'السلوك التقاربي', chapterId: 'c2-limits', weeks: 2, hours: 6 },
    { kind: 'chapter', label: 'معادلات ومتراجحات من الدرجة 2 (معادلات خطية / متراجحات / جمل)', chapterId: 'c2-quad', weeks: 3, hours: 9 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 2, hours: 6 },
    { kind: 'chapter', label: 'المتتاليات', chapterId: 'c2-seq', weeks: 4, hours: 12 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 3 },
  ],
  '2literature': [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'النسب والمؤشرات المئوية', chapterId: 'c2-ratio', weeks: 4, hours: 8 },
    { kind: 'chapter', label: 'الإحصاء', chapterId: 'c2-stat', weeks: 2, hours: 4 },
    { kind: 'chapter', label: 'الاحتمالات', chapterId: 'c2-prob', weeks: 3, hours: 6 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'الدوال', chapterId: 'c2-func', weeks: 8, hours: 16 },
    { kind: 'chapter', label: 'المتتاليات', chapterId: 'c2-seq', weeks: 1, hours: 2 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'الدوال (تابع)', chapterId: 'c2-func', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'المتتاليات', chapterId: 'c2-seq', weeks: 4, hours: 8 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 2 },
  ],
  // ==================== السنة الثالثة ====================
  sciences: [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'الدوال العددية (الاشتقاقية والاستمرارية)', chapterId: 'func-deriv', weeks: 2, hours: 10 },
    { kind: 'chapter', label: 'الدالتان الأسية واللوغاريتمية', chapterId: 'exp-log', weeks: 2, hours: 10 },
    { kind: 'chapter', label: 'الدوال العددية (النهايات) — المقارن التزايد ودراسة الدوال', chapterId: 'limits', weeks: 3, hours: 15 },
    { kind: 'chapter', label: 'المتتاليات العددية', chapterId: 'sequences', weeks: 2, hours: 10 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'المتتاليات العددية (تابع)', chapterId: 'sequences', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'الدوال الأولية والحساب التكاملي', chapterId: 'integrals', weeks: 2.5, hours: 13 },
    { kind: 'chapter', label: 'الاحتمالات والإحصاء', chapterId: 'probability', weeks: 2.5, hours: 12 },
    { kind: 'chapter', label: 'الأعداد المركبة', chapterId: 'complex', weeks: 3, hours: 15 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 5 },
    { kind: 'chapter', label: 'التحولات النقطية', chapterId: 'transforms', weeks: 1.5, hours: 8 },
    { kind: 'chapter', label: 'الهندسة في الفضاء', chapterId: 'space', weeks: 3.5, hours: 17 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 5 },
  ],
  math: [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 7 },
    { kind: 'chapter', label: 'الدوال العددية (الاشتقاقية والاستمرارية)', chapterId: 'func-deriv', weeks: 2, hours: 14 },
    { kind: 'chapter', label: 'الدالتان الأسية واللوغاريتمية', chapterId: 'exp-log', weeks: 2, hours: 14 },
    { kind: 'chapter', label: 'الدوال العددية (النهايات)', chapterId: 'limits', weeks: 1, hours: 7 },
    { kind: 'chapter', label: 'المقارن التزايد ودراسة الدوال', chapterId: 'limits', weeks: 2, hours: 14 },
    { kind: 'chapter', label: 'المتتاليات العددية', chapterId: 'sequences', weeks: 2, hours: 14 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 7 },
    { kind: 'chapter', label: 'الدوال الأولية والحساب التكاملي', chapterId: 'integrals', weeks: 3, hours: 21 },
    { kind: 'chapter', label: 'الأعداد والحساب', chapterId: 'arithmetic', weeks: 3, hours: 21 },
    { kind: 'chapter', label: 'الإحصاء والاحتمالات', chapterId: 'probability', weeks: 2, hours: 14 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 7 },
    { kind: 'chapter', label: 'الأعداد المركبة والتحولات النقطية', chapterId: 'complex', weeks: 3, hours: 21 },
    { kind: 'chapter', label: 'الهندسة في الفضاء', chapterId: 'space', weeks: 3, hours: 21 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 7 },
  ],
  techmath: [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'الدوال العددية (الاشتقاقية والاستمرارية)', chapterId: 'func-deriv', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'الدالتان الأسية واللوغاريتمية', chapterId: 'exp-log', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'الدوال العددية (النهايات)', chapterId: 'limits', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'المقارن التزايد ودراسة الدوال', chapterId: 'limits', weeks: 2, hours: 12 },
    { kind: 'chapter', label: 'المتتاليات العددية', chapterId: 'sequences', weeks: 2, hours: 12 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'الدوال الأولية والحساب التكاملي', chapterId: 'integrals', weeks: 3, hours: 18 },
    { kind: 'chapter', label: 'الأعداد والحساب', chapterId: 'arithmetic', weeks: 3, hours: 18 },
    { kind: 'chapter', label: 'الإحصاء والاحتمالات', chapterId: 'probability', weeks: 2, hours: 12 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 6 },
    { kind: 'chapter', label: 'الأعداد المركبة والتحولات النقطية', chapterId: 'complex', weeks: 3, hours: 18 },
    { kind: 'chapter', label: 'الهندسة في الفضاء', chapterId: 'space', weeks: 3, hours: 18 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 6 },
  ],
  economy: [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 4 },
    { kind: 'chapter', label: 'المتتاليات', chapterId: 'sequences', weeks: 4, hours: 16 },
    { kind: 'chapter', label: 'الاشتقاقية والاستمرارية على مجال', chapterId: 'func-deriv', weeks: 2, hours: 8 },
    { kind: 'chapter', label: 'النهايات', chapterId: 'limits', weeks: 1.5, hours: 6 },
    { kind: 'chapter', label: 'دراسة دوال', chapterId: 'limits', weeks: 1.5, hours: 6 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 4 },
    { kind: 'chapter', label: 'الدوال الأسية واللوغاريتمية', chapterId: 'exp-log', weeks: 6, hours: 24 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 4 },
    { kind: 'chapter', label: 'الإحصاء', chapterId: 'probability', weeks: 2, hours: 8 },
    { kind: 'chapter', label: 'الاحتمالات', chapterId: 'probability', weeks: 3, hours: 12 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 4 },
  ],
  literature: [
    { kind: 'assessment', label: 'تقويم تشخيصي لمكتسبات التلاميذ', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'المتتاليات العددية', chapterId: 'sequences', weeks: 7, hours: 14 },
    { kind: 'chapter', label: 'الحساب وأنواعه', chapterId: 'arithmetic', weeks: 2, hours: 4 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'الحساب (تابع)', chapterId: 'arithmetic', weeks: 2, hours: 4 },
    { kind: 'chapter', label: 'الدوال العددية', chapterId: 'limits', weeks: 7, hours: 14 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'الدوال العددية (تابع)', chapterId: 'limits', weeks: 1, hours: 2 },
    { kind: 'chapter', label: 'الإحصاء والاحتمالات', chapterId: 'probability', weeks: 4, hours: 8 },
    { kind: 'remedial', label: 'معالجة بيداغوجية', weeks: 1, hours: 2 },
  ],
};

/** موقع فصل ما في تدرج شعبة معيّنة: "الأسابيع 2-3" */
export function chapterWeekRange(stream: StreamId, chapterId: string): string {
  const rows = ANNUAL_PLANS[stream];
  if (!rows) return '';
  let cursor = 1;
  let start = 0;
  let end = 0;
  let totalH = 0;
  for (const r of rows) {
    const w = Math.ceil(r.weeks);
    if (r.chapterId === chapterId) {
      if (!start) start = cursor;
      end = cursor + w - 1;
      totalH += r.hours;
    }
    cursor += w;
  }
  if (!start) return '';
  return start === end ? `الأسبوع ${start}` : `الأسابيع ${start}-${end}`;
}

export function chapterTotalHours(stream: StreamId, chapterId: string): number {
  return (ANNUAL_PLANS[stream] ?? [])
    .filter((r) => r.chapterId === chapterId)
    .reduce((s, r) => s + r.hours, 0);
}

export function getStream(id: StreamId): StreamInfo {
  return STREAMS.find((s) => s.id === id) ?? STREAMS[0];
}

export function streamYear(id: StreamId): YearId {
  return getStream(id).year;
}
