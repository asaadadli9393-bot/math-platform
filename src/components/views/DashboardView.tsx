'use client';

import { Award, BarChart3, CheckCircle2, History, RotateCcw, Target, Trophy } from 'lucide-react';
import { CHAPTERS } from '@/data/chapters';
import { EXERCISES, EXERCISE_COUNT } from '@/data/exercises';
import { getStream } from '@/data/curriculum';
import { ChapterIcon, SectionTitle, THEME_STYLES } from '@/components/shared';
import type { ProgressState } from '@/lib/progress';

export default function DashboardView({
  state,
  onReset,
  onOpenBank,
}: {
  state: ProgressState;
  onReset: () => void;
  onOpenBank: (chapterId: string) => void;
}) {
  const solved = state.solved;
  const pct = Math.round((solved.length / EXERCISE_COUNT) * 100);
  const bacSolved = EXERCISES.filter((e) => solved.includes(e.id) && e.difficulty === 'بكالوريا').length;
  const quizzes = state.quizResults;
  const avgQuiz = quizzes.length
    ? Math.round((quizzes.reduce((s, q) => s + (q.total ? q.score / q.total : 0), 0) / quizzes.length) * 100)
    : null;

  const topQuiz = quizzes.length
    ? quizzes.reduce((best, q) => (q.total && (!best.total || q.score / q.total > best.score / best.total) ? q : best), quizzes[0])
    : null;

  const stats = [
    { icon: CheckCircle2, label: 'تمارين منجزة', value: `${solved.length} / ${EXERCISE_COUNT}`, cls: 'text-emerald-700' },
    { icon: Target, label: 'نسبة الإنجاز الكلية', value: `${pct}%`, cls: 'text-amber-600' },
    { icon: Trophy, label: 'تمارين بكالوريا منجزة', value: `${bacSolved}`, cls: 'text-violet-700' },
    { icon: BarChart3, label: 'متوسط الاختبارات', value: avgQuiz === null ? '—' : `${avgQuiz}%`, cls: 'text-teal-700' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SectionTitle
        eyebrow="لوحة التقدم"
        title="تقدمك الشخصي"
        sub="بياناتك محفوظة محلياً في متصفحك (localStorage) — لا حساب ولا إرسال لأي جهة. وسم «أتممت التمرين» في بنك التمارين يغذي هذه اللوحة مباشرة."
      />

      {/* stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <s.icon className={`mb-2 h-6 w-6 ${s.cls}`} />
            <div className="text-2xl font-black text-stone-900">{s.value}</div>
            <div className="mt-1 text-xs font-bold text-stone-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* overall progress */}
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-stone-900">الإنجاز الكلي لبنك التمارين</h3>
          <span className="text-sm font-black text-emerald-700">{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-gradient-to-l from-emerald-600 via-emerald-500 to-teal-400 transition-all duration-700"
            style={{ width: `${Math.max(pct, 1.5)}%` }}
          />
        </div>
      </div>

      {/* per-chapter */}
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 text-base font-extrabold text-stone-900">الإنجاز حسب الفصل</h3>
        <div className="space-y-4">
          {CHAPTERS.map((c, i) => {
            const total = EXERCISES.filter((e) => e.chapterId === c.id).length;
            const done = EXERCISES.filter((e) => e.chapterId === c.id && solved.includes(e.id)).length;
            const p = total ? Math.round((done / total) * 100) : 0;
            const th = THEME_STYLES[c.theme];
            return (
              <button
                key={c.id}
                onClick={() => onOpenBank(c.id)}
                className="group block w-full text-right"
              >
                <div className="mb-1.5 flex items-center gap-2.5">
                  <span className={`rounded-lg ${th.bg} p-1.5 text-white`}>
                    <ChapterIcon name={c.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-bold text-stone-700 group-hover:text-emerald-800">
                    الفصل {i + 1}: {c.shortTitle}
                  </span>
                  <span className="mr-auto text-xs font-black text-stone-400">
                    {done}/{total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full ${th.bg} transition-all duration-700`}
                    style={{ width: `${Math.max(p, done ? 2 : 0)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* quiz history */}
      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-extrabold text-stone-900">
            <History className="h-5 w-5 text-emerald-700" />
            سجل الاختبارات
          </h3>
          {topQuiz && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-800 ring-1 ring-amber-200">
              <Award className="h-3.5 w-3.5" />
              أفضل نتيجة: {topQuiz.score}/{topQuiz.total}
            </span>
          )}
        </div>
        {quizzes.length === 0 ? (
          <p className="py-6 text-center text-sm font-bold text-stone-400">
            لم تنشئ اختباراً بعد — اذهب إلى «اختبار» وأطلق أول محاولة.
          </p>
        ) : (
          <div className="space-y-2.5">
            {quizzes.map((q, i) => {
              const p = q.total ? Math.round((q.score / q.total) * 100) : 0;
              const st = getStream(q.stream as never);
              return (
                <div
                  key={i}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/70 px-4 py-3"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${
                      p >= 80 ? 'bg-emerald-600' : p >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  >
                    {p}%
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-stone-800">
                      {q.score} من {q.total} — شعبة {st.shortName}
                    </div>
                    <div className="text-xs font-semibold text-stone-400">
                      {new Date(q.date).toLocaleDateString('ar-DZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* danger zone */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center">
        <p className="text-sm font-bold leading-7 text-rose-900">
          إعادة تعيين كل التقدم: ستحذف وسوم «المنجز» وسجل الاختبارات نهائياً من هذا المتصفح.
        </p>
        <button
          onClick={onReset}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-extrabold text-rose-700 transition hover:bg-rose-100 active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" />
          إعادة التعيين
        </button>
      </div>
    </div>
  );
}
