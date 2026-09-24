'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Filter,
  FolderArchive,
  Lightbulb,
  ListChecks,
  Lock,
  NotebookPen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MathText } from '@/components/math-renderer';
import { SectionTitle, StreamChip } from '@/components/shared';
import type { YearId } from '@/data/curriculum';
import { streamsOfYear } from '@/data/curriculum';
import { chaptersOfYear } from '@/data/chapters';
import { EXAMS, type ExamExercise, type ExamKind, type ExamPaper } from '@/data/exams';
import { DEVOIR_PAPERS, DEVOIR_SEASONS, type DevoirPaper } from '@/data/devoir-pdfs';

const KIND_BADGE: Record<ExamKind, string> = {
  'فرض مراقبة مستمرة': 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'اختبار فصلي': 'bg-violet-50 text-violet-800 ring-violet-200',
  'اختبار محاكاة للبكالوريا': 'bg-rose-50 text-rose-800 ring-rose-200',
};

const TERMS: Array<1 | 2 | 3> = [1, 2, 3];
const KINDS: ExamKind[] = ['فرض مراقبة مستمرة', 'اختبار فصلي', 'اختبار محاكاة للبكالوريا'];
const TERM_NAME: Record<number, string> = { 1: 'الأول', 2: 'الثاني', 3: 'الثالث' };

/* ================= سطر تمرين داخل ورقة ================= */

function ExamExerciseRow({
  ex,
  number,
  revealed,
  onReveal,
  locked,
}: {
  ex: ExamExercise;
  number: number;
  revealed: boolean;
  onReveal: () => void;
  locked: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 bg-stone-50/70 px-4 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-xs font-black text-white">
          {number}
        </span>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-800">
          {ex.points} ن
        </span>
        <div className="mr-auto">
          {locked ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-800 ring-1 ring-amber-300">
              <Lock className="h-3.5 w-3.5" />
              الحل للمشتركين
            </span>
          ) : (
            <button
              onClick={revealed ? undefined : onReveal}
              disabled={revealed}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                revealed
                  ? 'cursor-default bg-stone-200 text-stone-500'
                  : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 active:scale-[0.98]'
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {revealed ? 'الحل ظاهر' : 'الحل النموذجي'}
            </button>
          )}
        </div>
      </div>
      <div className="px-4 py-3.5 text-[15px] leading-9 text-stone-800">
        <MathText content={ex.statement} />
        {ex.parts && (
          <ol className="mt-1 list-decimal space-y-1 pr-5">
            {ex.parts.map((p, i) => (
              <li key={i} className="leading-8">
                <MathText content={p} />
              </li>
            ))}
          </ol>
        )}
      </div>
      {revealed && (
        <div className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-4">
          <h5 className="mb-2 flex items-center gap-2 text-xs font-black text-emerald-900">
            <span className="inline-flex h-5 items-center rounded-md bg-emerald-700 px-2 text-[10px] text-white">
              الحل النموذجي
            </span>
            التمرين {number}
          </h5>
          <div className="math-scroll min-w-0 text-[15px] leading-9 text-stone-800">
            <MathText content={ex.solution} />
          </div>
        </div>
      )}
    </article>
  );
}

/* ================= بطاقة ورقة امتحان ================= */

function ExamCard({
  exam,
  isPremium,
  onSubscribe,
}: {
  exam: ExamPaper;
  isPremium: boolean;
  onSubscribe: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const locked = exam.premium && !isPremium;
  const totalPoints = exam.exercises.reduce((s, ex) => s + ex.points, 0);
  const chapters = exam.chapterIds
    .map((id) => chaptersOfYear(exam.year).find((c) => c.id === id)?.shortTitle)
    .filter(Boolean);
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-wrap items-center gap-2 px-4 py-4 text-right transition hover:bg-stone-50 sm:px-5"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            exam.kind === 'اختبار محاكاة للبكالوريا' ? 'bg-rose-600' : 'bg-emerald-700'
          } text-white shadow-md`}
        >
          {exam.kind === 'اختبار محاكاة للبكالوريا' ? (
            <Sparkles className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-stone-900 sm:text-base">{exam.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ${KIND_BADGE[exam.kind]}`}>
              {exam.kind}
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              الثلاثي {exam.term}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              <Clock className="h-3 w-3" />
              {exam.durationMin} د
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              {totalPoints}/20
            </span>
            <StreamChip id={exam.stream} />
            {locked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-300">
                <Lock className="h-3 w-3" />
                الحلول مميزة
              </span>
            )}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-stone-100 px-4 py-4 sm:px-5">
          {chapters.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-stone-500">
              <ListChecks className="h-3.5 w-3.5 text-emerald-700" />
              المحاور:
              {chapters.map((c) => (
                <span key={c} className="rounded-md bg-stone-100 px-2 py-0.5 font-extrabold text-stone-600">
                  {c}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-3">
            {exam.exercises.map((ex, i) => (
              <ExamExerciseRow
                key={i}
                ex={ex}
                number={i + 1}
                revealed={revealed.includes(i)}
                onReveal={() => setRevealed((r) => (r.includes(i) ? r : [...r, i]))}
                locked={locked}
              />
            ))}
          </div>
          {locked && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Lock className="h-6 w-6 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-amber-900">الحلول النموذجية لهذه الورقة للمشتركين المميزين</p>
                <p className="text-xs leading-6 text-amber-700">
                  اشترك للوصول الفوري إلى الحل المفصل خطوة بخطوة لكل تمارين الورقة، مع كل بنك السلاسل والاختبارات.
                </p>
              </div>
              <button
                onClick={onSubscribe}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                <Lock className="h-4 w-4" />
                اشترك الآن
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ================= أرشيف الفروض والاختبارات الحقيقية (PDF) ================= */

function DevoirRow({ d }: { d: DevoirPaper }) {
  return (
    <article className="group flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 transition hover:border-emerald-300 hover:shadow-sm sm:flex-nowrap">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${
          d.kind === 'فرض' ? 'bg-teal-700' : 'bg-violet-700'
        }`}
      >
        {d.mock ? <Sparkles className="h-4 w-4" /> : d.kind === 'فرض' ? <NotebookPen className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[13px] font-extrabold text-stone-900 sm:text-sm" title={d.title}>
          {d.title}
        </h4>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ring-1 ${
              d.kind === 'فرض' ? 'bg-teal-50 text-teal-800 ring-teal-200' : 'bg-violet-50 text-violet-800 ring-violet-200'
            }`}
          >
            {d.kind}
          </span>
          {d.term && (
            <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[10.5px] font-bold text-stone-500">
              الفصل {TERM_NAME[d.term]}
            </span>
          )}
          {d.stream && (
            <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[10.5px] font-bold text-stone-600">
              {d.stream}
            </span>
          )}
          {d.hasCorrection && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-extrabold text-amber-800 ring-1 ring-amber-200">
              <Lightbulb className="h-3 w-3" />
              مع التصحيح
            </span>
          )}
          {d.mock && (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10.5px] font-extrabold text-rose-700 ring-1 ring-rose-200">
              نمط بكالوريا
            </span>
          )}
          <span className="hidden text-[10.5px] font-semibold text-stone-400 sm:inline">
            {d.pages} صفحات · {(d.sizeKB / 1024).toFixed(1)} MB
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          فتح الورقة
        </a>
        <a
          href={d.url}
          download
          title="تنزيل"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function DevoirArchive({ year }: { year: YearId }) {
  const papers = useMemo(() => {
    const list = DEVOIR_PAPERS.filter((d) => d.year === year);
    const sy = (s: string | null) => (s ? parseInt(s.slice(0, 4)) || 0 : 0);
    return [...list].sort((a, b) => {
      if (sy(a.season) !== sy(b.season)) return sy(b.season) - sy(a.season);
      const ta = a.term ?? 9, tb = b.term ?? 9;
      if (ta !== tb) return ta - tb;
      const ka = a.kind === 'فرض' ? 0 : 1, kb = b.kind === 'فرض' ? 0 : 1;
      if (ka !== kb) return ka - kb;
      return a.title.localeCompare(b.title, 'ar');
    });
  }, [year]);
  const streamsPresent = useMemo(
    () => Array.from(new Set(papers.map((d) => d.stream).filter(Boolean) as string[])),
    [papers],
  );
  const [seasonF, setSeasonF] = useState('all');
  const [termF, setTermF] = useState<'all' | 1 | 2>('all');
  const [kindF, setKindF] = useState<'all' | 'فرض' | 'اختبار'>('all');
  const [streamF, setStreamF] = useState('all');

  const filtered = useMemo(
    () =>
      papers.filter(
        (d) =>
          (seasonF === 'all' || d.season === seasonF) &&
          (termF === 'all' || d.term === termF) &&
          (kindF === 'all' || d.kind === kindF) &&
          (streamF === 'all' || d.stream === streamF),
      ),
    [papers, seasonF, termF, kindF, streamF],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, DevoirPaper[]>();
    for (const d of filtered) {
      const k = d.season ?? 'موسم غير محدد';
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(d);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const hasFilters = seasonF !== 'all' || termF !== 'all' || kindF !== 'all' || streamF !== 'all';
  const reset = () => {
    setSeasonF('all');
    setTermF('all');
    setKindF('all');
    setStreamF('all');
  };

  if (papers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
        <FolderArchive className="mx-auto mb-3 h-9 w-9 text-stone-300" />
        <p className="font-bold text-stone-600">لا تتوفر أوراق أرشيف حقيقية لهذا المستوى حالياً</p>
        <p className="mt-1 text-sm leading-7 text-stone-500">
          أوراق هذا المستوى متاحة في تبويب «الأوراق التفاعلية» أعلاه، مع حلول نموذجية مفصلة لكل تمرين.
        </p>
      </div>
    );
  }

  const selCls =
    'w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-bold text-stone-800 outline-none transition focus:border-emerald-500 focus:bg-white';

  return (
    <div>
      {/* الفلاتر */}
      <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500">
            <Filter className="h-4 w-4 text-emerald-700" />
            تصفية الأرشيف
          </span>
          {hasFilters && (
            <button
              onClick={reset}
              className="mr-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              إعادة تعيين
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-stone-500">الموسم الدراسي</label>
            <select value={seasonF} onChange={(e) => setSeasonF(e.target.value)} className={selCls}>
              <option value="all">كل المواسم</option>
              {DEVOIR_SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-stone-500">الفصل</label>
            <select
              value={String(termF)}
              onChange={(e) => setTermF(e.target.value === 'all' ? 'all' : (Number(e.target.value) as 1 | 2))}
              className={selCls}
            >
              <option value="all">كل الفصول</option>
              <option value="1">الفصل الأول</option>
              <option value="2">الفصل الثاني</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-stone-500">نوع الورقة</label>
            <select
              value={kindF}
              onChange={(e) => setKindF(e.target.value === 'all' ? 'all' : (e.target.value as 'فرض' | 'اختبار'))}
              className={selCls}
            >
              <option value="all">الكل</option>
              <option value="فرض">فروض</option>
              <option value="اختبار">اختبارات</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-stone-500">الشعبة</label>
            <select value={streamF} onChange={(e) => setStreamF(e.target.value)} className={selCls}>
              <option value="all">كل الشعب</option>
              {streamsPresent.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm font-bold text-stone-500">
        النتائج: <span className="text-emerald-800">{filtered.length}</span> ورقة من أصل {papers.length}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-stone-300" />
          <p className="font-bold text-stone-600">لا توجد أوراق مطابقة للفلاتر الحالية</p>
          <button onClick={reset} className="mt-3 text-sm font-extrabold text-emerald-700 hover:underline">
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="space-y-7">
          {grouped.map(([season, items]) => (
            <section key={season}>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="flex items-center gap-2 text-sm font-black text-stone-800">
                  <span className="inline-flex h-7 items-center rounded-lg bg-stone-800 px-3 text-xs font-black text-white">
                    موسم {season}
                  </span>
                  <span className="text-xs font-bold text-stone-400">{items.length} ورقة</span>
                </h3>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
              <div className="space-y-2.5">
                {items.map((d) => (
                  <DevoirRow key={d.id} d={d} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-xs leading-6 text-stone-500">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <p>
          نصيحة الأستاذ في الأرشيف: اختر ورقة من موسم قريب، أنجزها في ظروف حقيقية بلا مسودة خارجية، ثم قارن إجابتك
          بالتصحيح إن وُجد. الأوراق القديمة ليست للترفيه: كل ورقة تكشف لك أسلوب الأساتذة في صياغة الأسئلة عبر
          المواسم، وهذا ما يجعلك تتعرف على نمط السؤال قبل أن تقرأه كاملاً في الامتحان الحقيقي.
        </p>
      </div>
    </div>
  );
}

/* ================= صفحة الفروض والاختبارات ================= */

type Tab = 'interactive' | 'archive';

export default function ExamsView({
  year,
  isPremium,
  onSubscribe,
}: {
  year: YearId;
  isPremium: boolean;
  onSubscribe: () => void;
}) {
  const papers = useMemo(() => EXAMS.filter((e) => e.year === year).sort((a, b) => a.term - b.term), [year]);
  const archiveCount = useMemo(() => DEVOIR_PAPERS.filter((d) => d.year === year).length, [year]);
  const [tab, setTab] = useState<Tab>('interactive');

  const streams = streamsOfYear(year);
  const [streamFilter, setStreamFilter] = useState('all');
  const [termFilter, setTermFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [kindFilter, setKindFilter] = useState<'all' | ExamKind>('all');
  const filtered = useMemo(
    () =>
      papers.filter(
        (p) =>
          (streamFilter === 'all' || p.stream === streamFilter) &&
          (termFilter === 'all' || p.term === termFilter) &&
          (kindFilter === 'all' || p.kind === kindFilter),
      ),
    [papers, streamFilter, termFilter, kindFilter],
  );
  const hasFilters = streamFilter !== 'all' || termFilter !== 'all' || kindFilter !== 'all';
  const reset = () => {
    setStreamFilter('all');
    setTermFilter('all');
    setKindFilter('all');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <SectionTitle
        eyebrow="بنك الفروض والاختبارات"
        title={`${papers.length} ورقة تفاعلية بحلول مفصلة + ${archiveCount} ورقة أرشيف حقيقية`}
        sub="أوراق فروض مراقبة مستمرة واختبارات فصلية ومحاكاة بكالوريا بإعداد الأستاذ عدلي اسعد بتوزيع نقاط حقيقي وحل نموذجي مفصل لكل تمرين، إضافة إلى أرشيف أوراق حقيقية منتقاة من خزانة الأستاذ عبر أكثر من 15 موسماً دراسياً (2008 → 2022)."
      />

      {/* التبويبان */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
        <button
          onClick={() => setTab('interactive')}
          className={`flex flex-wrap items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-extrabold transition sm:text-sm ${
            tab === 'interactive' ? 'bg-emerald-700 text-white shadow-md' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          الأوراق التفاعلية
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] ${
              tab === 'interactive' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            {papers.length}
          </span>
        </button>
        <button
          onClick={() => setTab('archive')}
          className={`flex flex-wrap items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-extrabold transition sm:text-sm ${
            tab === 'archive' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <FolderArchive className="h-4 w-4" />
          أرشيف الأوراق الحقيقية
          <span
            className={`rounded-full px-2 py-0.5 text-[10.5px] ${
              tab === 'archive' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            {archiveCount}
          </span>
        </button>
      </div>

      {tab === 'archive' ? (
        <DevoirArchive year={year} />
      ) : (
        <>
          {/* الفلاتر */}
          <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-stone-500">
                <Filter className="h-4 w-4 text-emerald-700" />
                الفلاتر
              </span>
              {hasFilters && (
                <button
                  onClick={reset}
                  className="mr-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  إعادة تعيين
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-500">الشعبة</label>
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-bold text-stone-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                >
                  <option value="all">كل الشعب</option>
                  {streams.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-500">الثلاثي</label>
                <select
                  value={String(termFilter)}
                  onChange={(e) => setTermFilter(e.target.value === 'all' ? 'all' : (Number(e.target.value) as 1 | 2 | 3))}
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-bold text-stone-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                >
                  <option value="all">كل الثلاثيات</option>
                  {TERMS.map((t) => (
                    <option key={t} value={t}>
                      الثلاثي {TERM_NAME[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-stone-500">نوع الورقة</label>
                <select
                  value={kindFilter}
                  onChange={(e) => setKindFilter(e.target.value === 'all' ? 'all' : (e.target.value as ExamKind))}
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-bold text-stone-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                >
                  <option value="all">كل الأنواع</option>
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between text-sm font-bold text-stone-500">
            <span>
              النتائج: <span className="text-emerald-800">{filtered.length}</span> ورقة امتحان
            </span>
            <span className="hidden items-center gap-1.5 text-xs font-semibold text-stone-400 sm:inline-flex">
              <Lightbulb className="h-3.5 w-3.5" />
              الحلول تُكشف تدريجياً لكل تمرين على حدة
            </span>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                <FileText className="mx-auto mb-3 h-8 w-8 text-stone-300" />
                <p className="font-bold text-stone-600">لا توجد أوراق مطابقة للفلاتر الحالية</p>
                <button onClick={reset} className="mt-3 text-sm font-extrabold text-emerald-700 hover:underline">
                  إعادة تعيين الفلاتر
                </button>
              </div>
            )}
            {filtered.map((exam) => (
              <ExamCard key={exam.id} exam={exam} isPremium={isPremium} onSubscribe={onSubscribe} />
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-xs leading-6 text-stone-500">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <p>
              نصيحة الأستاذ: أنجز كل ورقة في ظروفها الحقيقية (المدة المحددة، بدون مسودة خارجية) قبل الكشف عن الحل النموذجي،
              ثم قارن خطواتك بالحل وأعد التمرين الذي أخطأت فيه بعد 48 ساعة — هذه الطريقة ترفع معدل الاستظهار إلى أقصاه.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
