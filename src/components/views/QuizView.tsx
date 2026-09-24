'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, RefreshCcw, Sparkles, XCircle } from 'lucide-react';
import { CHAPTERS, type Exercise } from '@/data/chapters';
import { exercisesOfYear } from '@/data/exercises';
import { streamsOfYear, type StreamId, type YearId } from '@/data/curriculum';
import { SectionTitle } from '@/components/shared';
import { RichText } from '@/lib/tex';

type Phase = 'config' | 'run' | 'result';

function pickRandom(pool: Exercise[], n: number): Exercise[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(n, arr.length));
}

export default function QuizView({
  year,
  onRecord,
}: {
  year: YearId;
  onRecord: (r: { score: number; total: number; stream: StreamId }) => void;
}) {
  const yearExercises = exercisesOfYear(year);
  const yearStreams = streamsOfYear(year);
  const [phase, setPhase] = useState<Phase>('config');
  const [stream, setStream] = useState<StreamId>(yearStreams[0]?.id ?? 'sciences');
  const [count, setCount] = useState(5);
  const [onlyBac, setOnlyBac] = useState(false);
  const [quiz, setQuiz] = useState<Exercise[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);

  const poolSize = useMemo(
    () =>
      yearExercises.filter((e) => e.streams.includes(stream) && (!onlyBac || e.difficulty === 'بكالوريا')).length,
    [yearExercises, stream, onlyBac],
  );

  const start = () => {
    const pool = yearExercises.filter(
      (e) => e.streams.includes(stream) && (!onlyBac || e.difficulty === 'بكالوريا'),
    );
    setQuiz(pickRandom(pool, count));
    setIdx(0);
    setScore(0);
    setRevealed(false);
    setAnswered(false);
    setPhase('run');
  };

  const grade = (ok: boolean) => {
    if (!answered) {
      if (ok) setScore((s) => s + 1);
      setAnswered(true);
    }
  };

  const next = () => {
    if (idx + 1 >= quiz.length) {
      onRecord({ score, total: quiz.length, stream });
      setPhase('result');
    } else {
      setIdx((i) => i + 1);
      setRevealed(false);
      setAnswered(false);
    }
  };

  // ======== CONFIG ========
  if (phase === 'config') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <SectionTitle
          eyebrow="اختبار مخصص"
          title="أنشئ اختبارك من بنك التمارين"
          sub="اختر شعبتك وعدد الأسئلة، وسيسحب النظام تمارين عشوائية مناسبة. بعد عرض الحل النموذجي قيّم نفسك بصدق ليُسجَّل الرصيد في لوحة التقدم."
        />
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <label className="mb-2 block text-sm font-extrabold text-stone-700">الشعبة</label>
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {yearStreams.map((s) => (
              <button
                key={s.id}
                onClick={() => setStream(s.id)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-extrabold transition ${
                  stream === s.id
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300'
                }`}
              >
                {s.shortName}
              </button>
            ))}
          </div>

          <label className="mb-2 block text-sm font-extrabold text-stone-700">عدد الأسئلة: {count}</label>
          <input
            type="range"
            min={3}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mb-2 w-full accent-emerald-700"
          />
          <p className="mb-6 text-xs font-bold text-stone-400">
            متاح في هذا الاختيار: {poolSize} تمريناً
          </p>

          {year === '3as' && (
            <label className="mb-4 flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-bold text-stone-700">
              <input
                type="checkbox"
                checked={onlyBac}
                onChange={(e) => setOnlyBac(e.target.checked)}
                className="h-4 w-4 accent-emerald-700"
              />
              تمارين نمط البكالوريا فقط
            </label>
          )}

          <button
            onClick={start}
            disabled={poolSize === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-base font-extrabold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-5 w-5" />
            ابدأ الاختبار
          </button>
        </div>
      </div>
    );
  }

  // ======== RESULT ========
  if (phase === 'result') {
    const pct = quiz.length ? Math.round((score / quiz.length) * 100) : 0;
    const msg =
      pct >= 80 ? 'أداء ممتاز — أنت في طريقك للامتياز!' : pct >= 50 ? 'بداية جيدة — راجع الحلول للأخطاء' : 'لا تستسلم — أعد قراءة ملخصات الفصول ثم أعد المحاولة';
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-lg">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-black text-white ${
            pct >= 80 ? 'bg-emerald-600' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
          }`}>
            {pct}%
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {score} من {quiz.length}
          </h2>
          <p className="mt-2 text-sm font-bold text-stone-500">{msg}</p>
          <p className="mt-1 text-xs font-semibold text-stone-400">
            تم تسجيل النتيجة في لوحة التقدم ({yearStreams.find((s) => s.id === stream)?.shortName})
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={start}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 active:scale-[0.98]"
            >
              <RefreshCcw className="h-4 w-4" />
              اختبار جديد بنفس الإعدادات
            </button>
            <button
              onClick={() => setPhase('config')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-extrabold text-stone-700 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              تغيير الإعدادات
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======== RUN ========
  const ex = quiz[idx];
  const chapter = CHAPTERS.find((c) => c.id === ex?.chapterId);
  if (!ex) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-stone-500">
          <span>
            السؤال {idx + 1} من {quiz.length}
          </span>
          <span>
            الرصيد الحالي: {score}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-gradient-to-l from-emerald-600 to-teal-500 transition-all duration-500"
            style={{ width: `${((idx + 1) / quiz.length) * 100}%` }}
          />
        </div>
      </div>

      <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 bg-stone-50/70 px-5 py-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-black text-white">
            {idx + 1}
          </span>
          <span className="text-sm font-extrabold text-stone-900">
            <RichText text={ex.title} />
          </span>
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
            {chapter?.shortTitle}
          </span>
          <span className={`mr-auto rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
            ex.difficulty === 'بكالوريا' ? 'bg-violet-100 text-violet-800' : 'bg-stone-100 text-stone-600'
          }`}>
            {ex.difficulty}
          </span>
        </div>

        <div className="px-5 py-5">
          <div className="text-[15px] leading-9 text-stone-800">
            <RichText text={ex.statement} />
          </div>
          {ex.parts && (
            <ol className="mt-4 space-y-2.5 border-r-2 border-emerald-200 pr-4">
              {ex.parts.map((p, i) => (
                <li key={i} className="text-sm leading-8 text-stone-700">
                  <RichText text={`${i + 1}. ${p}`} />
                </li>
              ))}
            </ol>
          )}
        </div>

        {!revealed ? (
          <div className="border-t border-stone-100 bg-stone-50/60 px-5 py-4">
            <button
              onClick={() => setRevealed(true)}
              className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 active:scale-[0.99]"
            >
              جرّبت الحل — اعرض الحل النموذجي
            </button>
          </div>
        ) : (
          <div className="border-t border-emerald-100 bg-emerald-50/50 px-5 py-5">
            <ol className="space-y-3">
              {ex.solution.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <div className="math-scroll min-w-0 flex-1 text-sm leading-8 text-stone-800">
                    <RichText text={step} />
                  </div>
                </li>
              ))}
            </ol>

            {!answered ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => grade(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  أجبت بنجاح
                </button>
                <button
                  onClick={() => grade(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-3 text-sm font-extrabold text-rose-700 transition hover:bg-rose-50 active:scale-[0.98]"
                >
                  <XCircle className="h-4 w-4" />
                  لم أنجح هذه المرة
                </button>
              </div>
            ) : (
              <button
                onClick={next}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.99]"
              >
                {idx + 1 >= quiz.length ? 'النتيجة النهائية' : 'السؤال التالي'}
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </article>
    </div>
  );
}
