/**
 * التدرج السنوي الرسمي لمادة الرياضيات — السنة الثالثة ثانوي
 * المصدر: التدرجات السنوية 2022-2023 — المفتشية العامة للتربية الوطنية
 *         مديرية التعليم الثانوي العام والتكنولوجي — وزارة التربية الوطنية
 */

export type StreamId = 'sciences' | 'math' | 'techmath' | 'economy' | 'literature';

export interface StreamInfo {
  id: StreamId;
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
  {
    id: 'sciences',
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
    name: 'آداب وفلسفة + لغات أجنبية',
    shortName: 'آداب',
    weeklyHours: 2,
    totalHours: 54,
    totalWeeks: 27,
    color: 'bg-stone-100 text-stone-800 border-stone-300',
    description: 'شعب آداب وفلسفة ولغات أجنبية — ساعتان أسبوعياً',
  },
];

/**
 * التدرج الأسبوعي كما ورد في الوثيقة الرسمية (جداول بناء التعلمات).
 * الترتيب والأسابيع والحجم الساعي مطابقون للوثيقة.
 */
export const ANNUAL_PLANS: Record<StreamId, PlanRow[]> = {
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
  return ANNUAL_PLANS[stream]
    .filter((r) => r.chapterId === chapterId)
    .reduce((s, r) => s + r.hours, 0);
}

export function getStream(id: StreamId): StreamInfo {
  return STREAMS.find((s) => s.id === id) ?? STREAMS[0];
}
