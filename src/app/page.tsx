'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, BookOpenCheck, CalendarRange, GraduationCap, Home as HomeIcon, Layers, Sigma, Sparkles } from 'lucide-react';
import HomeView from '@/components/views/HomeView';
import CurriculumView from '@/components/views/CurriculumView';
import ChaptersView from '@/components/views/ChaptersView';
import BankView from '@/components/views/BankView';
import QuizView from '@/components/views/QuizView';
import DashboardView from '@/components/views/DashboardView';
import { useProgress } from '@/lib/progress';
import { EXERCISE_COUNT } from '@/data/exercises';
import type { StreamId } from '@/data/curriculum';

type View = 'home' | 'curriculum' | 'chapters' | 'bank' | 'quiz' | 'dashboard';

const NAV: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'الرئيسية', icon: HomeIcon },
  { id: 'curriculum', label: 'التدرج السنوي', icon: CalendarRange },
  { id: 'chapters', label: 'الفصول', icon: Layers },
  { id: 'bank', label: 'بنك التمارين', icon: BookOpenCheck },
  { id: 'quiz', label: 'اختبار', icon: Sparkles },
  { id: 'dashboard', label: 'تقدمي', icon: BarChart3 },
];

export default function Page() {
  const [view, setView] = useState<View>('home');
  const [chapterFocus, setChapterFocus] = useState<string | undefined>(undefined);
  const { state, toggleSolved, markRevealed, addQuizResult, resetAll } = useProgress();

  const navigate = useCallback((v: View, chapterId?: string) => {
    setView(v);
    setChapterFocus(chapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* ============ Navbar ============ */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <button onClick={() => navigate('home')} className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-bl from-emerald-700 to-teal-800 text-white shadow-md">
              <Sigma className="h-5 w-5" />
            </span>
            <span className="text-right leading-tight">
              <span className="block text-base font-black text-stone-900">
                تدرّج <span className="text-emerald-700">3AS</span>
              </span>
              <span className="block text-[10px] font-bold text-stone-400">الرياضيات • تدرج 2022-2023</span>
            </span>
          </button>

          <nav className="mr-auto hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => navigate(n.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-extrabold transition ${
                  view === n.id
                    ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => navigate('quiz')}
            className="mr-auto inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98] lg:mr-3 lg:hidden"
          >
            <Sparkles className="h-4 w-4" />
            اختبار
          </button>
        </div>

        {/* mobile nav */}
        <nav
          className="border-t border-stone-100 bg-white/95 lg:hidden"
          aria-label="التنقل للهاتف"
        >
          <div className="custom-scroll mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-2">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => navigate(n.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-extrabold transition ${
                  view === n.id ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* ============ Main ============ */}
      <main className="flex-1">
        {view === 'home' && <HomeView onNavigate={navigate} />}
        {view === 'curriculum' && <CurriculumView onOpenChapter={(id) => navigate('chapters', id)} />}
        {view === 'chapters' && (
          <ChaptersView
            key={chapterFocus ?? 'chapters-root'}
            initialChapterId={chapterFocus}
            onOpenBank={(id) => navigate('bank', id)}
          />
        )}
        {view === 'bank' && (
          <BankView
            key={chapterFocus ?? 'bank-root'}
            initialChapterId={chapterFocus}
            solved={state.solved}
            revealed={state.revealed}
            onToggleSolved={toggleSolved}
            onReveal={markRevealed}
          />
        )}
        {view === 'quiz' && (
          <QuizView
            onRecord={(r: { score: number; total: number; stream: StreamId }) =>
              addQuizResult({ ...r, date: new Date().toISOString() })
            }
          />
        )}
        {view === 'dashboard' && (
          <DashboardView state={state} onReset={resetAll} onOpenBank={(id) => navigate('bank', id)} />
        )}
      </main>

      {/* ============ Footer ============ */}
      <footer className="mt-auto border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-bl from-emerald-700 to-teal-800 text-white">
                  <Sigma className="h-4.5 w-4.5" />
                </span>
                <span className="text-base font-black text-stone-900">تدرّج 3AS</span>
              </div>
              <p className="text-xs leading-6 text-stone-500">
                منصة تعليمية للرياضيات — السنة الثالثة ثانوي. بنك تمارين بحلول نموذجية ({EXERCISE_COUNT} تمريناً)
                متوافق مع التدرجات السنوية الرسمية 2022-2023 الصادرة عن وزارة التربية الوطنية.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
              <div>
                <h4 className="mb-2 font-black text-stone-700">المنصة</h4>
                <ul className="space-y-1.5 font-bold text-stone-500">
                  <li><button onClick={() => navigate('curriculum')} className="hover:text-emerald-700">التدرج السنوي</button></li>
                  <li><button onClick={() => navigate('chapters')} className="hover:text-emerald-700">الفصول والملخصات</button></li>
                  <li><button onClick={() => navigate('bank')} className="hover:text-emerald-700">بنك التمارين</button></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-black text-stone-700">التمرن</h4>
                <ul className="space-y-1.5 font-bold text-stone-500">
                  <li><button onClick={() => navigate('quiz')} className="hover:text-emerald-700">اختبار مخصص</button></li>
                  <li><button onClick={() => navigate('dashboard')} className="hover:text-emerald-700">لوحة التقدم</button></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-black text-stone-700">الشعب</h4>
                <ul className="space-y-1.5 font-bold text-stone-500">
                  <li>علوم تجريبية • رياضيات</li>
                  <li>تقني رياضي • تسيير</li>
                  <li>آداب ولغات</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-stone-100 pt-5 text-[11px] font-semibold text-stone-400 sm:flex-row">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              مع تمنياتنا بالنجاح والتفوق في البكالوريا
            </span>
            <span>المحتوى التعليمي وفق المناهج الرسمية الجزائرية — 2022/2023</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
