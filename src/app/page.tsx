'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { BarChart3, BookMarked, BookOpen, BookOpenCheck, CalendarRange, ClipboardList, Crown, GraduationCap, Home as HomeIcon, Layers, Mail, Sigma, Spline, Sparkles } from 'lucide-react';
import HomeView from '@/components/views/HomeView';
import CurriculumView from '@/components/views/CurriculumView';
import ChaptersView from '@/components/views/ChaptersView';
import BankView from '@/components/views/BankView';
import ChainsView from '@/components/views/ChainsView';
import ExamsView from '@/components/views/ExamsView';
import QuizView from '@/components/views/QuizView';
import DashboardView from '@/components/views/DashboardView';
import CoursesView from '@/components/views/CoursesView';
import SubscribeView from '@/components/views/SubscribeView';
import AdminView from '@/components/views/AdminView';
import GraphingView from '@/components/views/GraphingView';
import { useProgress } from '@/lib/progress';
import { useLevel } from '@/lib/level';
import { useSubscription, PROFESSOR_EMAIL } from '@/lib/subscription';
import { LEVELS, type StreamId, type YearId } from '@/data/curriculum';
import { EXERCISE_COUNT } from '@/data/exercises';

type View = 'home' | 'curriculum' | 'chapters' | 'bank' | 'exams' | 'chains' | 'quiz' | 'dashboard' | 'courses' | 'graphing' | 'subscribe' | 'admin';

const NAV: { id: View; label: string; short?: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'الرئيسية', icon: HomeIcon },
  { id: 'curriculum', label: 'التدرج السنوي', short: 'التدرج', icon: CalendarRange },
  { id: 'chapters', label: 'الفصول', icon: Layers },
  { id: 'bank', label: 'بنك التمارين', short: 'التمارين', icon: BookOpenCheck },
  { id: 'exams', label: 'الفروض والاختبارات', short: 'الاختبارات', icon: ClipboardList },
  { id: 'chains', label: 'السلاسل', icon: BookMarked },
  { id: 'courses', label: 'الدورات', icon: BookOpen },
  { id: 'graphing', label: 'لوحة الرسم', short: 'الرسم', icon: Spline },
  { id: 'quiz', label: 'اختبار', icon: Sparkles },
  { id: 'dashboard', label: 'تقدمي', icon: BarChart3 },
];

/** قائمة الهاتف = القائمة الأساسية + الاشتراك */
const NAV_MOBILE: typeof NAV = [...NAV, { id: 'subscribe', label: 'الاشتراك', icon: Crown }];

/** مبدّل المستوى الدراسي (أولى / ثانية / ثالثة) */
function LevelSwitcher({
  year,
  onSelect,
  compact = false,
}: {
  year: YearId;
  onSelect: (l: YearId) => void;
  compact?: boolean;
}) {
  return (
    <div className={`inline-flex shrink-0 rounded-xl bg-stone-100 p-1 ring-1 ring-stone-200 ${compact ? 'gap-0.5' : 'gap-1'}`}>
      {LEVELS.map((l) => (
        <button
          key={l.id}
          onClick={() => onSelect(l.id)}
          title={l.name}
          className={`rounded-lg font-extrabold transition ${
            compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
          } ${
            year === l.id
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25'
              : 'text-stone-500 hover:bg-white hover:text-emerald-800'
          }`}
        >
          {l.shortName}
        </button>
      ))}
    </div>
  );
}

export default function Page() {
  const [view, setView] = useState<View>('home');
  const [chapterFocus, setChapterFocus] = useState<string | undefined>(undefined);
  const { state, toggleSolved, markRevealed, addQuizResult, resetAll } = useProgress();
  const { year, setLevel } = useLevel();
  const { isPremium, daysLeft } = useSubscription();

  const navigate = useCallback((v: View, chapterId?: string) => {
    setView(v);
    setChapterFocus(chapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectLevel = useCallback(
    (l: YearId) => {
      setLevel(l);
      setChapterFocus(undefined);
      setView('home');
    },
    [setLevel],
  );

  // scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view, year]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* ============ Navbar ============ */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6">
          <button onClick={() => navigate('home')} className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/teacher-adli-avatar.jpg"
              alt="الأستاذ عدلي اسعد"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 border-emerald-600 object-cover shadow-sm"
            />
            <span className="text-right leading-tight">
              <span className="block text-base font-black text-stone-900">
                تدرّج <span className="text-amber-600">للرياضيات</span>
              </span>
              <span className="block text-[10px] font-bold text-emerald-700">تحت إشراف الأستاذ عدلي اسعد</span>
            </span>
          </button>

          <div className="mr-auto hidden lg:block">
            <LevelSwitcher year={year} onSelect={selectLevel} />
          </div>

          {/* حالة الاشتراك / زر الاشتراك (سطح المكتب) */}
          <div className="hidden shrink-0 xl:block">
            {isPremium ? (
              <button
                onClick={() => navigate('subscribe')}
                title={daysLeft === null ? 'اشتراك دائم' : `متبقٍ ${daysLeft} يوماً`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-extrabold text-emerald-800 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
              >
                <Crown className="h-4 w-4 text-amber-500" />
                مميز{daysLeft === null ? ' — دائم' : ''}
              </button>
            ) : (
              <button
                onClick={() => navigate('subscribe')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-sm font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                <Crown className="h-4 w-4" />
                اشترك الآن
              </button>
            )}
          </div>

          <nav className="hidden min-w-0 items-center gap-0.5 xl:flex" aria-label="التنقل الرئيسي">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => navigate(n.id)}
                title={n.short ? n.label : undefined}
                className={`inline-flex items-center whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-extrabold transition ${
                  view === n.id
                    ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
                }`}
              >
                {n.short ?? n.label}
              </button>
            ))}
          </nav>

          <div className="mr-auto lg:hidden">
            <LevelSwitcher year={year} onSelect={selectLevel} compact />
          </div>

          <button
            onClick={() => navigate('quiz')}
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98] sm:inline-flex xl:hidden"
          >
            <Sparkles className="h-4 w-4" />
            اختبار
          </button>
        </div>

        {/* mobile nav */}
        <nav
          className="border-t border-stone-100 bg-white/95 xl:hidden"
          aria-label="التنقل للهاتف"
        >
          <div className="custom-scroll mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2">
            {NAV_MOBILE.map((n) => (
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
        {view === 'home' && <HomeView year={year} onNavigate={navigate} onSetLevel={setLevel} />}
        {view === 'curriculum' && (
          <CurriculumView key={year} year={year} onOpenChapter={(id) => navigate('chapters', id)} />
        )}
        {view === 'chapters' && (
          <ChaptersView
            key={year + (chapterFocus ?? 'chapters-root')}
            year={year}
            initialChapterId={chapterFocus}
            onOpenBank={(id) => navigate('bank', id)}
          />
        )}
        {view === 'bank' && (
          <BankView
            key={year + (chapterFocus ?? 'bank-root')}
            year={year}
            initialChapterId={chapterFocus}
            solved={state.solved}
            revealed={state.revealed}
            onToggleSolved={toggleSolved}
            onReveal={markRevealed}
          />
        )}
        {view === 'quiz' && (
          <QuizView
            key={year}
            year={year}
            onRecord={(r: { score: number; total: number; stream: StreamId }) =>
              addQuizResult({ ...r, date: new Date().toISOString() })
            }
          />
        )}
        {view === 'dashboard' && (
          <DashboardView
            key={year}
            year={year}
            state={state}
            onReset={resetAll}
            onOpenBank={(id) => navigate('bank', id)}
          />
        )}
        {view === 'courses' && (
          <CoursesView
            isSubscribed={isPremium}
            onSelectCourse={() => {}}
            onSubscribe={() => navigate('subscribe')}
          />
        )}
        {view === 'exams' && (
          <ExamsView key={year} year={year} isPremium={isPremium} onSubscribe={() => navigate('subscribe')} />
        )}
        {view === 'chains' && (
          <ChainsView
            key={year}
            year={year}
            isPremium={isPremium}
            onSubscribe={() => navigate('subscribe')}
            onOpenCourses={() => navigate('courses')}
          />
        )}
        {view === 'graphing' && <GraphingView onOpenBank={() => navigate('bank')} />}
        {view === 'subscribe' && <SubscribeView />}
        {view === 'admin' && <AdminView />}
      </main>

      {/* ============ Footer ============ */}
      <footer className="mt-auto border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  src="/teacher-adli-avatar.jpg"
                  alt="الأستاذ عدلي اسعد"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-xl border-2 border-emerald-600 object-cover"
                />
                <span>
                  <span className="block text-base font-black text-stone-900">تدرّج للرياضيات</span>
                  <span className="block text-[11px] font-bold text-emerald-700">تحت إشراف الأستاذ عدلي اسعد</span>
                </span>
              </div>
              <p className="text-xs leading-6 text-stone-500">
                منصة تعليمية شاملة للرياضيات — السنوات الأولى والثانية والثالثة ثانوي. بنك تمارين بحلول نموذجية
                ({EXERCISE_COUNT} تمريناً) متوافق مع التدرجات السنوية الرسمية 2022-2023 الصادرة عن وزارة التربية الوطنية.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
              <div>
                <h4 className="mb-2 font-black text-stone-700">المنصة</h4>
                <ul className="space-y-1.5 font-bold text-stone-500">
                  <li><button onClick={() => navigate('curriculum')} className="hover:text-emerald-700">التدرج السنوي</button></li>
                  <li><button onClick={() => navigate('chapters')} className="hover:text-emerald-700">الفصول والملخصات</button></li>
                  <li><button onClick={() => navigate('bank')} className="hover:text-emerald-700">بنك التمارين</button></li>
                  <li><button onClick={() => navigate('chains')} className="hover:text-emerald-700">سلاسل الأستاذ</button></li>
                  <li><button onClick={() => navigate('subscribe')} className="font-black text-amber-600 hover:text-amber-700">الاشتراك المميز</button></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-black text-stone-700">التمرن</h4>
                <ul className="space-y-1.5 font-bold text-stone-500">
                  <li><button onClick={() => navigate('exams')} className="hover:text-emerald-700">الفروض والاختبارات</button></li>
                  <li><button onClick={() => navigate('graphing')} className="hover:text-emerald-700">لوحة الرسم — GeoGebra</button></li>
                  <li><button onClick={() => navigate('quiz')} className="hover:text-emerald-700">اختبار مخصص</button></li>
                  <li><button onClick={() => navigate('dashboard')} className="hover:text-emerald-700">لوحة التقدم</button></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-black text-stone-700">السنوات</h4>
                <ul className="space-y-1.5 font-bold text-stone-500">
                  <li>أولى ثانوي (جذعان)</li>
                  <li>ثانية ثانوي (5 شعب)</li>
                  <li>ثالثة ثانوي (5 شعب)</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-stone-100 pt-5 text-[11px] font-semibold text-stone-400 sm:flex-row">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              تحت إشراف الأستاذ عدلي اسعد — مع تمنياتنا بالنجاح والتفوق
            </span>
            <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <a href={`mailto:${PROFESSOR_EMAIL}`} className="inline-flex items-center gap-1 text-emerald-700 hover:underline">
                <Mail className="h-3 w-3" />
                <span dir="ltr">{PROFESSOR_EMAIL}</span>
              </a>
              <span className="text-stone-300">|</span>
              <button onClick={() => navigate('admin')} className="text-stone-400 transition hover:text-emerald-700 hover:underline">
                لوحة الأستاذ
              </button>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
