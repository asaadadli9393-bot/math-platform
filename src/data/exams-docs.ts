import type { YearId, StreamId } from './curriculum';
import type { ExamKind, ExamPaper } from './exams';
import { EXAMS } from './exams';
import { EXAMS_1AS } from './exams-1as';
import { EXAMS_2AS } from './exams-2as';
import { EXAMS_3AS } from './exams-3as';
import { EXAMS_EXTRA_1AS } from './exams-extra-1as';
import { EXAMS_EXTRA_2AS } from './exams-extra-2as';

/* ============================================================
   ربط بنك «وثائق الفروض والاختبارات» التفصيلي بعرض المنصة.
   أوراق السنوات (exams-1as/2as/3as + الأوراق التدريبية الإضافية)
   مكتوبة بأسلوب المنصة الموحد: توزيع نقاط حقيقي، حل نموذجي مفصل
   خطوة بخطوة، تلميح لكل تمرين، وملاحظة منهجية لكل ورقة.
   هذا الملف يوحّد الشكل ويحوّله إلى ExamPaper كما يعرضه ExamsView.
   ============================================================ */

/** نوع الورقة في الوثائق: فرض مراقبة مستمرة أو اختبار فصلي */
export type ExamDocKind = 'devoir' | 'term';

export interface ExamDocExercise {
  id: string;
  topic: string;
  points: number;
  title: string;
  statement: string;
  parts?: string[];
  solution: string[];
  hint?: string;
}

export interface ExamDoc {
  id: string;
  year: YearId;
  streams: StreamId[];
  trimester: 1 | 2 | 3;
  kind: ExamDocKind;
  seq: number;
  title: string;
  durationMin: number;
  topics: string[];
  note?: string;
  exercises: ExamDocExercise[];
}

const KIND_MAP: Record<ExamDocKind, ExamKind> = {
  devoir: 'فرض مراقبة مستمرة',
  term: 'اختبار فصلي',
};

/** تحويل وثيقة تفصيلية إلى ورقة منسّقة بأسلوب المنصة */
export function examDocToPaper(doc: ExamDoc): ExamPaper {
  return {
    id: doc.id,
    title: doc.title,
    year: doc.year,
    stream: doc.streams[0],
    streams: doc.streams,
    term: doc.trimester,
    kind: KIND_MAP[doc.kind],
    durationMin: doc.durationMin,
    chapterIds: [],
    topics: doc.topics,
    note: doc.note,
    premium: false,
    exercises: doc.exercises.map((ex) => {
      const solLines = [...ex.solution];
      if (ex.hint) solLines.push(`💡 **تلميح الأستاذ:** ${ex.hint}`);
      return {
        points: ex.points,
        statement: ex.statement,
        parts: ex.parts,
        solution: solLines.join('\n\n'),
      };
    }),
  };
}

/** كل وثائق الفروض والاختبارات (السنوات الثلاث + الأوراق التدريبية) */
export const EXAM_DOCS: ExamDoc[] = [
  ...EXAMS_1AS,
  ...EXAMS_EXTRA_1AS,
  ...EXAMS_2AS,
  ...EXAMS_EXTRA_2AS,
  ...EXAMS_3AS,
];

/** الأوراق المنسّقة الواردة من الوثائق */
export const DOC_PAPERS: ExamPaper[] = EXAM_DOCS.map(examDocToPaper);

/** كل أوراق المنصة: الأوراق الأساسية + الأوراق الوثائقية المنسّقة */
export const ALL_EXAM_PAPERS: ExamPaper[] = [...EXAMS, ...DOC_PAPERS];

/** أوراق سنة دراسية معينة مرتبة حسب الفصل ثم النوع */
export function examPapersOfYear(year: YearId): ExamPaper[] {
  return ALL_EXAM_PAPERS.filter((e) => e.year === year).sort((a, b) => {
    if (a.term !== b.term) return a.term - b.term;
    const ka = a.kind === 'فرض مراقبة مستمرة' ? 0 : a.kind === 'اختبار فصلي' ? 1 : 2;
    const kb = b.kind === 'فرض مراقبة مستمرة' ? 0 : b.kind === 'اختبار فصلي' ? 1 : 2;
    if (ka !== kb) return ka - kb;
    return a.title.localeCompare(b.title, 'ar');
  });
}
