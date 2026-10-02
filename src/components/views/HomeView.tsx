'use client';

import Image from 'next/image';
import { useState, useSyncExternalStore } from 'react';
import {
  ArrowDown,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  Bot,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Crown,
  Database,
  GraduationCap,
  Layers,
  Lightbulb,
  Lock,
  Sparkles,
  Spline,
  Target,
  Trophy,
  UserCheck,
} from 'lucide-react';
import { chaptersOfYear } from '@/data/chapters';
import { exercisesOfYear, EXERCISE_COUNT } from '@/data/exercises';
import { LEVELS, type YearId } from '@/data/curriculum';
import { DEVOIR_PAPERS } from '@/data/devoir-pdfs';
import { ALL_EXAM_PAPERS } from '@/data/exams-docs';
import { CHAIN_PDFS, BAC_COMPILATIONS } from '@/data/chain-pdfs';
import { LIBRARY_CHAINS } from '@/data/library-chains';
import { BAC_SOLUTION_CHAINS, BAC_SOLUTION_STATS } from '@/data/bac-solutions';
import { BAC_OFFICIAL_STATS } from '@/data/bac-official';
import { ChapterIcon, SectionTitle, THEME_STYLES } from '@/components/shared';
import { MathText } from '@/components/math-renderer';

/* موعد بكالوريا 2027 (تقريبي — أول أسبوع يونيو) لحساب العدّ التنازلي */
const BAC_2027_ISO = '2027-06-06T08:00:00+01:00';

const emptySubscribe = () => () => {};
function getDaysSnapshot(): number {
  return Math.max(0, Math.ceil((new Date(BAC_2027_ISO).getTime() - Date.now()) / 86400000));
}
function getDaysServerSnapshot(): number | null {
  return null;
}
/** عدّ تنازلي لبكالوريا 2027 — يُحسب على العميل فقط لتفادي اختلاف الخادم */
function useDaysToBac(): number | null {
  return useSyncExternalStore(emptySubscribe, getDaysSnapshot, getDaysServerSnapshot);
}

const HERO_HEADLINE: Record<YearId, string> = {
  '1as': 'ابدأ الرياضيات بأساس متين — التفوق في البكالوريا يُبنى من السنة الأولى',
  '2as': 'سنتك الحاسمة: رسّخ الأساسات الآن وارفع معدلك في الرياضيات',
  '3as': 'طريقك إلى بكالوريا رياضيات ممتازة يبدأ من هنا',
};

const HERO_SUB: Record<YearId, string> = {
  '1as': 'السنة الأولى ثانوي — جذعا علوم وتكنولوجيا وآداب',
  '2as': 'السنة الثانية ثانوي — من علوم ورياضيات إلى تسيير وآداب',
  '3as': 'السنة الثالثة ثانوي — التحضير للبكالوريا',
};

/** التمرين المعروض في «عارض الجودة» — أول حل من سلاسل حلول البكالوريا */
const SHOWCASE_CHAIN = BAC_SOLUTION_CHAINS[0];
const SHOWCASE_EX = SHOWCASE_CHAIN.exercises[0];

export type HomeViewTarget =
  | 'curriculum'
  | 'chapters'
  | 'bank'
  | 'quiz'
  | 'dashboard'
  | 'aitutor'
  | 'graphing'
  | 'chains'
  | 'exams'
  | 'courses'
  | 'library'
  | 'subscribe';

export default function HomeView({
  year,
  onNavigate,
  onSetLevel,
}: {
  year: YearId;
  onNavigate: (view: HomeViewTarget, chapterId?: string) => void;
  onSetLevel: (l: YearId) => void;
}) {
  const chapters = chaptersOfYear(year);
  const exercises = exercisesOfYear(year);
  const level = LEVELS.find((l) => l.id === year)!;
  const daysToBac = useDaysToBac();
  const [showSolution, setShowSolution] = useState(false);

  const docsCount = LIBRARY_CHAINS.length + CHAIN_PDFS.length + BAC_COMPILATIONS.length;
  const bacSolCount = BAC_SOLUTION_STATS.totalExercises + BAC_OFFICIAL_STATS.totalExercises;

  const stats = [
    { icon: Database, value: `${EXERCISE_COUNT}`, label: 'تمرين بحل نموذجي مفصّل' },
    { icon: ClipboardList, value: `${DEVOIR_PAPERS.length + ALL_EXAM_PAPERS.length}`, label: 'ورقة فرض واختبار (تفاعلية + أرشيف)' },
    { icon: Layers, value: `${docsCount}`, label: 'وثيقة وسلسلة PDF منتقاة' },
    { icon: Trophy, value: `${bacSolCount}`, label: 'حلاً نموذجياً لمواضيع البكالوريا' },
  ];

  const features = [
    {
      icon: Trophy,
      title: 'مواضيع البكالوريا 2008–2026 مع الحلول',
      desc: 'تجميعات أسئلة البكالوريا الحقيقية مرتبة حسب المحاور، مقرونة بحلول نموذجية مفصلة بنفس منهجية شبكات التصحيح الرسمية — من الدورة الأولى إلى الأحدث.',
      view: 'chains' as const,
      highlight: true,
    },
    {
      icon: BookOpenCheck,
      title: 'سلاسل دروس الدعم',
      desc: 'سلاسل PDF لكل فصل: من التمارين الأساسية إلى أنماط الامتحانات، مع الحلول النموذجية والتمثيلات البيانية — تُدرَّس بها القاعدة ثم تُحلّ بها.',
      view: 'chains' as const,
    },
    {
      icon: ClipboardList,
      title: 'أرشيف الفروض والاختبارات الحقيقية',
      desc: `${DEVOIR_PAPERS.length} ورقة عبر مواسم دراسية كاملة من أرشيف الأستاذ: فروض مراقبة مستمرة، اختبارات فصلية، واختبارات محاكاة للبكالوريا — للسنتين الأولى والثانية والثالثة.`,
      view: 'exams' as const,
    },
    {
      icon: BookOpen,
      title: 'دورات مبسّطة من الصفر',
      desc: 'دروس مكتوبة بأسلوب سهل مع أمثلة محلولة وتمارين تطبيقية تتفاعل معها داخل المنصة — للفهم قبل الحفظ، ومن التمرين إلى الامتحان.',
      view: 'courses' as const,
    },
    {
      icon: Bot,
      title: 'المدرّس الذكي — تدرّج AI',
      desc: 'اسأله أي سؤال في الرياضيات وسيشرحه لك خطوة بخطوة بمنهجية البكالوريا ويعرف مستواك الدراسي. جرّبه مجاناً الآن — وغير محدود للمشتركين.',
      view: 'aitutor' as const,
      highlight: true,
    },
    {
      icon: Spline,
      title: 'لوحة الرسم — GeoGebra',
      desc: 'ارسم الدوال والتمثيلات البيانية مباشرة من المتصفح لتفهم سلوك الدالة: المقاربات، التقعر، نقاط التقاطع — أداة الأستاذ بين يديك.',
      view: 'graphing' as const,
    },
  ];

  const steps = [
    {
      n: '1',
      title: 'اختر مستواك وشعبتك',
      desc: 'أولى، ثانية، أو ثالثة ثانوي — المنصة تضبط نفسها على فصولك وترتيب التدرج الرسمي لشعبتك تلقائياً.',
    },
    {
      n: '2',
      title: 'تمرّن بالحلول النموذجية',
      desc: 'حل التمرين أولاً، ثم اكشف الحل النموذجي خطوة بخطوة وقارن منهجيتك بالمنهجية الرسمية — هذا سرّ رفع المعدل.',
    },
    {
      n: '3',
      title: 'تتبّع تقدمك حتى البكالوريا',
      desc: 'سجّل نتائجك، راقب نسبة إنجاز كل فصل، وأنشئ اختبارات محاكاة — تدخل قاعة الامتحان وأنت تعرف مستواك بالأرقام.',
    },
  ];

  const faq = [
    {
      q: 'هل المحتوى المجاني كافٍ للمذاكرة؟',
      a: 'نعم — بنك التمارين كاملاً بحلوله النموذجية، والفصول والملخصات، والفروض والاختبارات التفاعلية، والمدرس الذكي (بحد يومي): كلها مجانية بدون تسجيل. المميز يفتح مكتبة الأستاذ الكاملة (137 وثيقة)، وحلول البكالوريا الكاملة، والسلاسل الحصرية، وحصص Zoom المباشرة.',
    },
    {
      q: 'كيف أدفع ثمن الاشتراك؟',
      a: 'بريدي موب BaridiMob أو حساب بريدي CCP أو البطاقة الذهبية — ترسل طلبك من صفحة الاشتراك، يرد عليك الأستاذ بتفاصيل الدفع خلال 24 ساعة كأقصى حد، وبعد الدفع يصلك كود التفعيل في بريدك وتُفتح كل المزايا فوراً.',
    },
    {
      q: 'هل الحلول مفصّلة فعلاً؟',
      a: 'انزل إلى قسم «شاهد الجودة بعينك» في هذه الصفحة واكشف حلاً نموذجياً كاملاً مجاناً — هو نفسه مستوى التفصيل في كل حلول المنصة: كل خطوة مبررة كما يصححها أستاذ البكالوريا.',
    },
    {
      q: 'هل تعمل المنصة على الهاتف؟',
      a: 'نعم، صُمّمت المنصة أولاً للهاتف: المعادلات الرياضية تُعرض بجودة عالية، الحلول قابلة للقراءة بوضوح، وتقدمك محفوظ تلقائياً على جهازك.',
    },
  ];

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-950 via-emerald-900 to-teal-900 text-white">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/15 px-4 py-1.5 text-sm font-bold text-amber-200">
                  <Trophy className="h-4 w-4" />
                  {daysToBac === null ? 'بكالوريا 2027' : `بكالوريا 2027 — متبقّى ${daysToBac} يوماً`}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-200">
                  <Target className="h-4 w-4" />
                  {HERO_SUB[year]}
                </span>
              </div>
              <h1 className="text-3xl font-black leading-[1.35] sm:text-4xl lg:text-[2.9rem] lg:leading-[1.3]">
                {HERO_HEADLINE[year]}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-100/90 sm:text-lg">
                {EXERCISE_COUNT} تمرين مصنّف بالفصل والصعوبة مع حلول نموذجية مفصلة خطوة بخطوة، و{DEVOIR_PAPERS.length} ورقة فرض
                واختبار حقيقية عبر المواسم، و{docsCount} وثيقة وسلسلة PDF منتقاة، و{bacSolCount} حلاً نموذجياً لمواضيع البكالوريا
                2008–2026 — كل ذلك تحت إشراف الأستاذ عدلي اسعد.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('bank')}
                  className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-base font-extrabold text-emerald-950 shadow-lg shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
                >
                  <BookOpenCheck className="h-5 w-5 transition group-hover:-translate-x-0.5" />
                  ابدأ التمرن مجاناً الآن
                </button>
                <a
                  href="#quality-showcase"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-white/5 px-6 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/10 active:scale-[0.98]"
                >
                  <Lightbulb className="h-5 w-5 text-amber-300" />
                  شاهد حلاً نموذجياً للبكالوريا
                  <ArrowDown className="h-4 w-4" />
                </a>
              </div>
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-emerald-200/80">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> بدون تسجيل — افتح وتمرّن فوراً</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> المحتوى الأساسي مجاني 100%</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> مصمّمة للهاتف أولاً</span>
              </p>
            </div>

            {/* Professor supervision card */}
            <div className="float-soft overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <div className="relative h-56 sm:h-64 lg:h-56">
                <Image
                  src="/teacher-adli.jpg"
                  alt="الأستاذ عدلي اسعد — أستاذ مادة الرياضيات"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />
              </div>
              <div className="p-5">
                <div className="mb-1 flex items-center gap-2 text-amber-300">
                  <UserCheck className="h-4.5 w-4.5" />
                  <span className="text-xs font-bold">الإشراف البيداغوجي</span>
                </div>
                <h2 className="text-xl font-black text-white">الأستاذ عدلي اسعد</h2>
                <p className="mt-1 text-xs leading-6 text-emerald-100/80">
                  أستاذ مادة الرياضيات بالتعليم الثانوي — يشرف بيداغوجياً على كل محتوى «تدرّج»: اختيار التمارين، جودة الحلول
                  النموذجية، ومواءمة الفصول مع التدرجات الرسمية لكل شعبة.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition hover:bg-white/10 sm:p-5"
              >
                <s.icon className="mx-auto mb-2 h-6 w-6 text-amber-300" />
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="mt-1 text-xs font-semibold text-emerald-100/80 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ عارض الجودة — حل نموذجي مجاني ============ */}
      <section id="quality-showcase" className="scroll-mt-20 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="شاهد الجودة بعينك — قبل أن تدفع دجّاً واحداً"
            title="هكذا تبدو حلولنا النموذجية"
            sub="هذا حل كامل لتمرين من نمط بكالوريا المتتاليات — اكشف الحل بنفسك وقيّم مستوى التفصيل. نفس المستوى بالضبط في كل حلول المنصة."
          />
          <div className="overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-lg shadow-emerald-100/60">
            <div className="flex flex-wrap items-center gap-2 border-b border-emerald-100 bg-gradient-to-l from-emerald-50 to-teal-50/60 px-4 py-3 sm:px-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-emerald-700 to-teal-800 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                <Trophy className="h-3.5 w-3.5" />
                نمط بكالوريا — المتتاليات العددية
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-200">
                معاينة مجانية كاملة
              </span>
              <span className="mr-auto hidden text-[11px] font-bold text-stone-400 sm:block">{SHOWCASE_CHAIN.title}</span>
            </div>
            <div className="px-4 py-5 text-[15px] leading-9 text-stone-800 sm:px-6">
              <MathText content={SHOWCASE_EX.statement} />
            </div>
            <div className="border-t border-amber-100 bg-amber-50/60 px-4 py-2.5 text-xs leading-7 text-amber-900 sm:px-6">
              <span className="font-black">تلميح: </span>
              <MathText content={SHOWCASE_EX.hint ?? ''} />
            </div>
            <div className="px-4 py-4 sm:px-6">
              {!showSolution ? (
                <button
                  onClick={() => setShowSolution(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald-700/25 transition hover:bg-emerald-800 active:scale-[0.98]"
                >
                  <Lightbulb className="h-4 w-4" />
                  اكشف الحل النموذجي كاملاً — مجاناً
                </button>
              ) : (
                <div className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-4 sm:-mx-4 sm:-mb-4 sm:px-6">
                  <h5 className="mb-2 flex items-center gap-2 text-xs font-black text-emerald-900">
                    <span className="inline-flex h-5 items-center rounded-md bg-emerald-700 px-2 text-[10px] text-white">
                      الحل النموذجي
                    </span>
                    مفصّل خطوة بخطوة
                  </h5>
                  <div className="math-scroll min-w-0 text-[15px] leading-9 text-stone-800">
                    <MathText content={SHOWCASE_EX.solution} />
                  </div>
                  <div className="mt-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
                    <Lock className="h-5 w-5 shrink-0 text-amber-600" />
                    <p className="flex-1 text-sm font-bold leading-6 text-amber-900">
                      هذا التمرين مجاني للمعاينة — باقي الـ {BAC_SOLUTION_STATS.totalExercises} حلاً النموذجياً لمواضيع البكالوريا
                      2008–2026 بانتظارك مع الاشتراك المميز.
                    </p>
                    <button
                      onClick={() => onNavigate('subscribe')}
                      className="shrink-0 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
                    >
                      اشترك وافتح كل الحلول
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ الموسوعة المعرفية — إبراز ============ */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-teal-900 via-emerald-900 to-emerald-950 py-16 text-white">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-1.5 text-xs font-black text-emerald-200 ring-1 ring-emerald-300/30">
                <BookMarked className="h-3.5 w-3.5" />
                ميزة مجانية بالكامل — لا تحتاج حتى اشتراكاً
              </div>
              <h2 className="text-2xl font-black leading-snug md:text-3xl">
                الموسوعة المعرفية: كل محاورك الـ {chapters.length} مشروحة هنا بالكامل
              </h2>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-8 text-emerald-100/90">
                استخلصنا المفاهيم والقوانين والأمثلة المحلولة من أشهر مراجع الرياضيات العالمية وأعدنا صياغتها بالعربية
                بأسلوب مبسّط يطابق منهجك تماماً: شرح «الجوهر» لكل فصل، قوانين جاهزة للمراجعة، أمثلة بأسلوب التصحيح الرسمي،
                وأخطاء شائعة تُفقد الدرجات — ثم تمارين تفاعلية مباشرة تحت كل درس لتجرب فهمك فوراً.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5 text-[12px] font-extrabold">
                <span className="rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/15">شرح مبسّط لكل فصل</span>
                <span className="rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/15">قوانين جاهزة للمراجعة</span>
                <span className="rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/15">أمثلة محلولة</span>
                <span className="rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/15">أخطاء تُفقد الدرجات</span>
                <span className="rounded-full bg-amber-400/20 px-3.5 py-1.5 text-amber-200 ring-1 ring-amber-300/30">تمارين تفاعلية فورية</span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('library')}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-emerald-900 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-50 active:scale-[0.98]"
                >
                  <BookMarked className="h-4 w-4" />
                  اقرأ موسوعتك الآن — مجاناً
                </button>
                <button
                  onClick={() => onNavigate('chapters')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/10 active:scale-[0.98]"
                >
                  <Layers className="h-4 w-4" />
                  أو ابدأ من فصولك وملخصاتها
                </button>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur-sm">
              {chapters.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => onNavigate('library')}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-white/10 px-4 py-3 text-right transition hover:bg-white/20"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-black text-white">{c.shortTitle}</span>
                      <span className="block text-[11px] font-bold text-emerald-200/80">موسوعة كاملة + تمارين تفاعلية</span>
                    </span>
                  </span>
                  <ArrowDown className="h-4 w-4 shrink-0 rotate-90 text-emerald-300 transition group-hover:-translate-x-1" />
                </button>
              ))}
              <p className="pt-1 text-center text-[11px] font-bold text-emerald-200/70">
                + {Math.max(chapters.length - 4, 0)} محوراً آخر بنفس الجودة داخل الموسوعة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Features ============ */}
      <section className="paper bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="كل ما تحتاجه لرفع معدلك"
            title="منصة واحدة تغنيك عن ملاح الورق والمواقع المتفرقة"
            sub="مواضيع البكالوريا، سلاسل الدعم، أرشيف الفروض، الدورات المبسّطة، مدرس ذكي، ولوحة رسم — كل أدوات النجاح في مكان واحد ومنظّمة حسب فصولك."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <button
                key={f.title}
                onClick={() => onNavigate(f.view)}
                className={`group rounded-2xl border border-stone-200 bg-white p-6 text-right shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 ${
                  'highlight' in f && f.highlight ? 'ring-2 ring-emerald-500/30 hover:ring-emerald-500/60' : ''
                }`}
              >
                <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-stone-900">{f.title}</h3>
                <p className="text-sm leading-7 text-stone-600">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3 خطوات ============ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="خطتك للنجاح"
            title="3 خطوات فقط تفصلك عن مستوى جديد"
            sub="منهجية بسيطة يعتمدها الأوائل: فهم من الملخص، ترسّخ بالتمرين، ثم قياس مستمر حتى يوم الامتحان."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-stone-200 bg-stone-50/60 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-xl font-black text-white shadow-md shadow-emerald-600/25">
                  {s.n}
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-stone-900">{s.title}</h3>
                <p className="text-sm leading-7 text-stone-600">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ArrowDown className="absolute -bottom-7 right-1/2 hidden h-6 w-6 translate-x-1/2 text-stone-300 md:block" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              جرّب الآن: أنشئ اختباراً مجانياً من بنك التمارين
            </button>
          </div>
        </div>
      </section>

      {/* ============ Level chooser ============ */}
      <section className="bg-stone-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="السنوات الثلاث"
            title="ابدأ من مستواك الدراسي"
            sub="تدرج رسمي، فصول، ملخصات، سلاسل وبنك تمارين لكل سنة وشعبة — اضغط مستواك للانتقال إليه مباشرة."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {LEVELS.map((l) => {
              const chCount = chaptersOfYear(l.id).length;
              const exCount = exercisesOfYear(l.id).length;
              const active = l.id === year;
              return (
                <button
                  key={l.id}
                  onClick={() => onSetLevel(l.id)}
                  className={`group rounded-2xl border p-6 text-right shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    active
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-200'
                      : 'border-stone-200 bg-white hover:border-emerald-300 hover:shadow-emerald-100'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`inline-flex rounded-xl px-3 py-1.5 text-sm font-black ${
                        active ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                      }`}
                    >
                      {l.name}
                    </span>
                    {active && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-black text-amber-800 ring-1 ring-amber-200">
                        مستواك الحالي
                      </span>
                    )}
                  </div>
                  <p className="min-h-10 text-sm font-bold leading-7 text-stone-600">{l.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-extrabold text-stone-500">
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1">{chCount} فصول</span>
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1">{exCount} تمارين</span>
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1">ملخصات وصيغ</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Chapters preview ============ */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow={`فصول ${level.name}`}
            title={`${chapters.length} فصلاً — ملخّص وصيغ وتمارين لكل فصل`}
            sub="مرتبة وفق التدرج الرسمي: اضغط أي فصل لتقرأ ملخصه وصيغه الجوهرية ثم تمرّن على تمارينه بالحلول."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((c, i) => {
              const th = THEME_STYLES[c.theme];
              const count = exercises.filter((e) => e.chapterId === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => onNavigate('chapters', c.id)}
                  className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 text-right shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100"
                >
                  <div className={`absolute -left-6 -top-6 h-16 w-16 rounded-full ${th.soft}`} />
                  <div className="relative flex items-start gap-4">
                    <div className={`rounded-xl ${th.bg} p-3 text-white shadow-md`}>
                      <ChapterIcon name={c.icon} className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`text-xs font-black ${th.text}`}>الفصل {i + 1}</span>
                      </div>
                      <h3 className="text-base font-extrabold leading-7 text-stone-900">{c.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-stone-500">{c.intro}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs font-bold text-stone-400">
                        <span className="inline-flex items-center gap-1">
                          <Database className="h-3.5 w-3.5" />
                          {count} تمارين
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {c.streams.length} شعب
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('chapters')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 active:scale-[0.98]"
            >
              <Layers className="h-4 w-4" />
              عرض كل الفصول وملخصاتها
            </button>
          </div>
        </div>
      </section>

      {/* ============ سلّم القيمة: مجاني أم مميز ============ */}
      <section className="bg-gradient-to-b from-stone-50 to-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="مجاني أم مميز؟ أنت تقرر"
            title="ابدأ مجاناً — وارقِ فقط عندما تحتاج المكتبة الكاملة"
            sub="لا فخ ولا رسوم خفية: المحتوى الأساسي مجاني للأبد بدون تسجيل، والاشتراك يفتح أرشيف الأستاذ الكامل وحلول البكالوريا التفصيلية."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-stone-200 bg-white p-6 sm:p-8">
              <div className="mb-1 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-xl font-black text-stone-900">الباقة المجانية</h3>
              </div>
              <div className="mb-5 text-3xl font-black text-emerald-700">
                0 دج <span className="text-sm font-bold text-stone-400">للأبد — بدون تسجيل</span>
              </div>
              <ul className="space-y-2.5 text-sm leading-7 text-stone-600">
                {[
                  `بنك ${EXERCISE_COUNT} تمرين بالحلول النموذجية المفصلة`,
                  'كل الفصول والملخصات والصيغ الجوهرية',
                  'الفروض والاختبارات التفاعلية + محاكاة البكالوريا',
                  'المدرّس الذكي تدرّج AI (بحد يومي) + لوحة الرسم',
                  'تتبّع تقدمك الشخصي على جهازك',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('bank')}
                className="mt-6 w-full rounded-xl border-2 border-emerald-700 px-6 py-3 text-sm font-extrabold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.98]"
              >
                ابدأ التمرن مجاناً
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/80 to-white p-6 shadow-lg shadow-amber-400/10 sm:p-8">
              <div className="absolute left-0 top-0 rounded-br-xl bg-amber-400 px-3 py-1 text-xs font-black text-emerald-950">
                للمتفوقين الجديين
              </div>
              <div className="mb-1 flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="text-xl font-black text-stone-900">الاشتراك المميز</h3>
              </div>
              <div className="mb-1 text-3xl font-black text-emerald-700">
                3000 دج <span className="text-sm font-bold text-stone-400">/ سنة — أو 500 دج شهرياً</span>
              </div>
              <p className="mb-5 text-xs font-bold text-amber-700">
                السنوي = أقل من 9 دج في اليوم — ثمن قطعة حلوى تفتح لك عاماً كاملاً من أرشيف الأستاذ.
              </p>
              <ul className="space-y-2.5 text-sm leading-7 text-stone-600">
                {[
                  `مكتبة الأستاذ الكاملة: ${LIBRARY_CHAINS.length} وثيقة PDF منتقاة`,
                  `تجميعات البكالوريا 2008–2026 + ${bacSolCount} حلاً نموذجياً مفصلاً`,
                  'التصحيح الرسمي الشامل لموضوعي بكالوريا 2024 بشبكات التصحيح',
                  'السلاسل الحصرية من أرشيف الأستاذ مع الحلول',
                  'المدرّس الذكي بدون حدود + حصص Zoom المباشرة',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-1.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate('subscribe')}
                className="mt-6 w-full rounded-xl bg-amber-400 px-6 py-3 text-sm font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                اشترك الآن — تفعيل فوري بالكود
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ أسئلة سريعة ============ */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="أسئلة يدور في ذهن كل تلميذ"
            title="أسئلة سريعة — إجابات صريحة"
          />
          <div className="space-y-3">
            {faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-stone-200 bg-stone-50/60 p-4 open:bg-white open:shadow-md">
                <summary className="cursor-pointer list-none text-sm font-black text-stone-800 marker:hidden sm:text-base">
                  <span className="ml-2 inline-block text-emerald-600 transition group-open:rotate-90">◂</span>
                  {f.q}
                </summary>
                <p className="mt-3 border-t border-stone-100 pt-3 text-sm leading-7 text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA الأخير ============ */}
      <section className="bg-gradient-to-bl from-emerald-950 via-emerald-900 to-teal-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-black sm:text-3xl">
            كل يوم بلا تمرين هو فرصة ينتزعها منك منافسك
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-emerald-100/85 sm:text-base">
            {EXERCISE_COUNT} تمرين و{DEVOIR_PAPERS.length} ورقة امتحان تنتظرك الآن — ابدأ بأول تمرين في فصلك الأول، والباقي يأتي تلقائياً.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('bank')}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-3.5 text-base font-extrabold text-emerald-950 shadow-lg shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
            >
              <BookOpenCheck className="h-5 w-5" />
              ابدأ التمرن مجاناً
            </button>
            <button
              onClick={() => onNavigate('subscribe')}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-white/5 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/10 active:scale-[0.98]"
            >
              <Crown className="h-5 w-5 text-amber-300" />
              افتح المحتوى المميز
            </button>
          </div>
          <p className="mt-6 text-[11px] text-emerald-200/60">
            محتوى المنصة موائم مع التدرجات السنوية الرسمية لمادة الرياضيات (2022-2023) الصادرة عن المفتشية العامة — وزارة التربية الوطنية.
          </p>
        </div>
      </section>
    </div>
  );
}
