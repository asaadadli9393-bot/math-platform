'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown, Eye, Filter, Lightbulb, RotateCcw, Search, X } from 'lucide-react';
import { CHAPTERS, type Difficulty, type Exercise } from '@/data/chapters';
import { EXERCISES, EXERCISE_COUNT } from '@/data/exercises';
import { STREAMS, type StreamId } from '@/data/curriculum';
import { DIFF_STYLES, SectionTitle, StreamChip } from '@/components/shared';
import { RichText } from '@/lib/tex';

const DIFFICULTIES: Difficulty[] = ['سهل', 'متوسط', 'صعب', 'بكالوريا'];
const KINDS = ['تطبيقي', 'استدلالي', 'مركب'] as const;

function ExerciseCard({
  ex,
  number,
  solved,
  onToggleSolved,
  revealed,
  onReveal,
}: {
  ex: Exercise;
  number: number;
  solved: boolean;
  onToggleSolved: () => void;
  revealed: boolean;
  onReveal: () => void;
}) {
  const chapter = CHAPTERS.find((c) => c.id === ex.chapterId)!;
  const [showHint, setShowHint] = useState(false);

  return (
    <article
      id={`ex-${ex.id}`}
      className={`scroll-mt-24 overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        solved ? 'border-emerald-400 ring-1 ring-emerald-200' : 'border-stone-200'
      }`}
    >
      {/* header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 bg-stone-50/70 px-4 py-3 sm:px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white">
          {number}
        </span>
        <h3 className="text-sm font-extrabold text-stone-900 sm:text-base">
          <RichText text={ex.title} />
        </h3>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${DIFF_STYLES[ex.difficulty]}`}>
          {ex.difficulty}
        </span>
        <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
          {ex.kind}
        </span>
        <span className="hidden rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500 sm:inline">
          {chapter.shortTitle}
        </span>
        {ex.source && (
          <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
            {ex.source}
          </span>
        )}
        <div className="mr-auto flex items-center gap-1.5">
          {ex.streams.map((sid) => (
            <StreamChip key={sid} id={sid} />
          ))}
        </div>
      </div>

      {/* statement */}
      <div className="px-4 py-4 sm:px-5">
        <div className="text-[15px] leading-9 text-stone-800">
          <RichText text={ex.statement} />
        </div>
        {ex.parts && (
          <ol className="mt-4 space-y-2.5 border-r-2 border-emerald-200 pr-4">
            {ex.parts.map((p, i) => (
              <li key={i} className="text-sm leading-8 text-stone-700">
                <span className="ml-1.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-md bg-emerald-100 px-1.5 text-xs font-black text-emerald-800">
                  {i + 1}
                </span>
                <RichText text={p} className="align-middle" />
              </li>
            ))}
          </ol>
        )}

        {/* hint */}
        {ex.hint && (
          <div className="mt-4">
            <button
              onClick={() => setShowHint((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-800 ring-1 ring-amber-200 transition hover:bg-amber-100"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {showHint ? 'إخفاء التلميح' : 'تلميح'}
            </button>
            {showHint && (
              <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-8 text-amber-900">
                <RichText text={ex.hint} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* solution + actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 bg-stone-50/60 px-4 py-3 sm:px-5">
        <button
          onClick={revealed ? undefined : onReveal}
          disabled={revealed}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
            revealed
              ? 'cursor-default bg-stone-200 text-stone-500'
              : 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 active:scale-[0.98]'
          }`}
        >
          <Eye className="h-4 w-4" />
          {revealed ? 'الحل ظاهر' : 'الحل النموذجي'}
        </button>
        <button
          onClick={onToggleSolved}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition active:scale-[0.98] ${
            solved
              ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
              : 'border border-stone-300 bg-white text-stone-600 hover:border-emerald-400 hover:text-emerald-700'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          {solved ? 'أتممت هذا التمرين' : 'وسم كمنجز'}
        </button>
      </div>

      {revealed && (
        <div className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-5 sm:px-6">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-emerald-900">
            <span className="inline-flex h-6 items-center rounded-md bg-emerald-700 px-2 text-[11px] text-white">
              الحل النموذجي
            </span>
            {ex.title}
          </h4>
          <ol className="space-y-4">
            {ex.solution.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                  {i + 1}
                </span>
                <div className="math-scroll min-w-0 flex-1 text-[15px] leading-9 text-stone-800">
                  <RichText text={step} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

export default function BankView({
  initialChapterId,
  solved,
  revealed,
  onToggleSolved,
  onReveal,
}: {
  initialChapterId?: string;
  solved: string[];
  revealed: string[];
  onToggleSolved: (id: string) => void;
  onReveal: (id: string) => void;
}) {
  const [chapter, setChapter] = useState<string>(initialChapterId ?? 'all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [kind, setKind] = useState<(typeof KINDS)[number] | 'all'>('all');
  const [stream, setStream] = useState<StreamId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [onlyUnsolved, setOnlyUnsolved] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim();
    return EXERCISES.filter((e) => {
      if (chapter !== 'all' && e.chapterId !== chapter) return false;
      if (difficulty !== 'all' && e.difficulty !== difficulty) return false;
      if (kind !== 'all' && e.kind !== kind) return false;
      if (stream !== 'all' && !e.streams.includes(stream)) return false;
      if (onlyUnsolved && solved.includes(e.id)) return false;
      if (q && !(e.title.includes(q) || e.statement.includes(q) || (e.source ?? '').includes(q))) return false;
      return true;
    });
  }, [chapter, difficulty, kind, stream, query, onlyUnsolved, solved]);

  const reset = () => {
    setChapter('all');
    setDifficulty('all');
    setKind('all');
    setStream('all');
    setQuery('');
    setOnlyUnsolved(false);
  };

  const hasFilters = chapter !== 'all' || difficulty !== 'all' || kind !== 'all' || stream !== 'all' || query || onlyUnsolved;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <SectionTitle
        eyebrow="بنك التمارين الشامل"
        title={`${EXERCISE_COUNT} تمريناً بحلول نموذجية مفصلة`}
        sub="فلتر حسب الفصل والصعوبة والنوع والشعبة. كل تمرين يعرض بيان القضية وأسئلته، مع تلميح اختياري وحل نموذجي خطوة بخطوة، ووسم المنجز يتتبع تقدمك تلقائياً."
      />

      {/* Filters */}
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

        {/* search */}
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في التمارين (كلمة مفتاحية، مصدر...)"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pr-10 pl-4 text-sm font-semibold text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* chapter select */}
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-bold text-stone-500">الفصل</label>
          <div className="relative">
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 py-2.5 pr-4 pl-9 text-sm font-bold text-stone-800 outline-none transition focus:border-emerald-500 focus:bg-white"
            >
              <option value="all">كل الفصول</option>
              {CHAPTERS.map((c, i) => (
                <option key={c.id} value={c.id}>
                  الفصل {i + 1}: {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
        </div>

        {/* difficulty chips */}
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-bold text-stone-500">الصعوبة</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDifficulty('all')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-extrabold transition ${
                difficulty === 'all' ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300'
              }`}
            >
              الكل
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(difficulty === d ? 'all' : d)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-extrabold transition ${
                  difficulty === d ? 'border-emerald-700 bg-emerald-700 text-white' : `${DIFF_STYLES[d]} hover:brightness-95`
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* kind + stream + unsolved */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-stone-500">النوع</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as typeof kind)}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-bold text-stone-800 outline-none focus:border-emerald-500"
            >
              <option value="all">كل الأنواع</option>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-stone-500">الشعبة</label>
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value as StreamId | 'all')}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-bold text-stone-800 outline-none focus:border-emerald-500"
            >
              <option value="all">كل الشعب</option>
              {STREAMS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-bold text-stone-700 transition hover:border-emerald-300">
              <input
                type="checkbox"
                checked={onlyUnsolved}
                onChange={(e) => setOnlyUnsolved(e.target.checked)}
                className="h-4 w-4 accent-emerald-700"
              />
              غير المنجزة فقط
            </label>
          </div>
        </div>
      </div>

      {/* result count */}
      <div className="mb-4 flex items-center justify-between text-sm font-bold text-stone-500">
        <span>
          النتائج: <span className="text-emerald-800">{filtered.length}</span> تمريناً
        </span>
        <span className="hidden text-xs font-semibold text-stone-400 sm:inline">
          المنجز: {solved.length} من {EXERCISE_COUNT}
        </span>
      </div>

      {/* list */}
      <div className="space-y-5">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <Filter className="mx-auto mb-3 h-8 w-8 text-stone-300" />
            <p className="font-bold text-stone-600">لا توجد تمارين مطابقة للفلاتر الحالية</p>
            <button onClick={reset} className="mt-3 text-sm font-extrabold text-emerald-700 hover:underline">
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
        {filtered.map((ex) => (
          <ExerciseCard
            key={ex.id}
            ex={ex}
            number={EXERCISES.findIndex((e) => e.id === ex.id) + 1}
            solved={solved.includes(ex.id)}
            onToggleSolved={() => onToggleSolved(ex.id)}
            revealed={revealed.includes(ex.id)}
            onReveal={() => onReveal(ex.id)}
          />
        ))}
      </div>
    </div>
  );
}
