'use client';

import Image from 'next/image';
import { BookOpenCheck, Bot, CalendarRange, Database, GraduationCap, Layers, Target, Trophy, UserCheck } from 'lucide-react';
import { chaptersOfYear } from '@/data/chapters';
import { exercisesOfYear } from '@/data/exercises';
import { LEVELS, streamsOfYear, type YearId } from '@/data/curriculum';
import { ChapterIcon, SectionTitle, THEME_STYLES } from '@/components/shared';
import { RichText } from '@/lib/tex';

const HERO_FORMULAS: Record<YearId, string[]> = {
  '1as': [
    'القسمة الإقليدية: $a=bq+r,\\; 0\\leq r<b$',
    'المتطابقات: $(a-b)(a+b)=a^2-b^2$',
    'دائرة مركزها $(a,b)$: $(x-a)^2+(y-b)^2=r^2$',
    'الوسط المرجح: $\\bar{x}=\\dfrac{1}{N}\\sum n_i x_i$',
  ],
  '2as': [
    'اشتقاق جداء: $(uv)\'=u\'v+uv\'$',
    'مستقيم مقارب أفقي: $\\lim_{x\\to\\pm\\infty}f(x)=\\ell$',
    'الجداء السلمي: $\\vec{u}\\cdot\\vec{v}=\\|\\vec{u}\\|\\,\\|\\vec{v}\\|\\cos\\theta$',
    'متتالية حسابية: $u_n=u_0+nr$',
  ],
  '3as': [
    'النهاية المرجعية: $\\lim_{x\\to 0}\\dfrac{\\ln(1+x)}{x}=1$',
    'المكاملة بالتجزئة: $\\int_a^b u\'v\\,dx=[uv]_a^b-\\int_a^b uv\'\\,dx$',
    'قانون ذا الحدين: $P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}$',
    'الدوران المركب: $z\'=e^{i\\theta}(z-\\omega)+\\omega$',
  ],
};

const HERO_SUB: Record<YearId, string> = {
  '1as': 'السنة الأولى ثانوي — جذعا علوم وتكنولوجيا وآداب',
  '2as': 'السنة الثانية ثانوي — من علوم ورياضيات إلى تسيير وآداب',
  '3as': 'السنة الثالثة ثانوي — التحضير للبكالوريا',
};

export default function HomeView({
  year,
  onNavigate,
  onSetLevel,
}: {
  year: YearId;
  onNavigate: (
    view: 'curriculum' | 'chapters' | 'bank' | 'quiz' | 'dashboard' | 'aitutor' | 'graphing',
    chapterId?: string,
  ) => void;
  onSetLevel: (l: YearId) => void;
}) {
  const chapters = chaptersOfYear(year);
  const exercises = exercisesOfYear(year);
  const streams = streamsOfYear(year);
  const totalHours = streams.reduce((s, st) => s + st.totalHours, 0);
  const bacCount = exercises.filter((e) => e.difficulty === 'بكالوريا').length;
  const level = LEVELS.find((l) => l.id === year)!;

  const stats = [
    { icon: Layers, value: `${chapters.length}`, label: 'فصلاً دراسياً' },
    { icon: Database, value: `${exercises.length}`, label: 'تمريناً بحل نموذجي' },
    { icon: GraduationCap, value: `${streams.length}`, label: 'شعب مغطاة' },
    { icon: CalendarRange, value: `${totalHours}`, label: 'ساعة في التدرج الرسمي' },
  ];

  const features = [
    {
      icon: Bot,
      title: 'المدرّس الذكي — تدرّج AI',
      desc: 'مساعد ذكاء اصطناعي خاص بالمنصة: يشرح الدروس ويرشدك خطوة بخطوة لحل التمارين بمنهجية البكالوريا، بصيغ رياضية دقيقة ويعرف مستواك الدراسي. مجاني بحد يومي، وغير محدود للمشتركين.',
      view: 'aitutor' as const,
      highlight: true,
    },
    {
      icon: CalendarRange,
      title: 'متوافقة مع تدرج 2022-2023',
      desc: 'بنية الفصول وترتيبها وأحجامها الساعية مستخرجة مباشرة من وثيقة التدرجات السنوية الرسمية الصادرة عن المفتشية العامة للتربية الوطنية، لكل شعبة وعلى كل مستوى من السنوات الثلاث.',
    },
    {
      icon: Database,
      title: 'بنك تمارين شامل ومصنّف',
      desc: 'كل تمرين موسوم بالفصل والصعوبة والنوع والشعب المستهدفة، مع حل نموذجي مفصل خطوة بخطوة وتلميح قبل الحل، وتمارين مختارة بأنماط الفروض والاختبارات والبكالوريا.',
    },
    {
      icon: BookOpenCheck,
      title: 'ملخصات وصيغ أساسية',
      desc: 'لكل فصل ملخص منظّم للتعريفات والمبرهنات والصيغ الجوهرية بعرض رياضي دقيق (KaTeX)، ليكون مرجعك السريع قبل الحل.',
    },
    {
      icon: Trophy,
      title: 'اختبار وتتبع للتقدم',
      desc: 'أنشئ اختباراً مخصصاً من بنك التمارين حسب شعبتك ومستواك، وسجّل تقدمك تلقائياً: التمارين المنجزة، نتائج الاختبارات، ونسبة إتمام كل فصل.',
    },
  ];

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-950 via-emerald-900 to-teal-900 text-white">
        <div className="hero-grid absolute inset-0" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-200">
                <Target className="h-4 w-4" />
                السنوات الأولى والثانية والثالثة ثانوي — تدرج 2022-2023
              </div>
              <h1 className="text-4xl font-black leading-[1.25] sm:text-5xl lg:text-[3.4rem]">
                منصة <span className="text-amber-300">تدرّج</span> للرياضيات
                <span className="mt-2 block text-2xl font-bold text-emerald-100 sm:text-3xl">
                  {HERO_SUB[year]} — بنك تمارين شامل بالحلول
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-100/90 sm:text-lg">
                {chapters.length} فصلاً مرتباً وفق التدرج الرسمي، و{exercises.length} تمريناً مصنفاً بالصعوبة والنوع مع حلول
                نموذجية مفصلة، وملخصات وصيغ أساسية لكل فصل — تغطية كاملة لشعب مستوى {level.name}.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('bank')}
                  className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-base font-extrabold text-emerald-950 shadow-lg shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
                >
                  <BookOpenCheck className="h-5 w-5 transition group-hover:-translate-x-0.5" />
                  ابدأ من بنك التمارين
                </button>
                <button
                  onClick={() => onNavigate('curriculum')}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-white/5 px-6 py-3 text-base font-bold text-white backdrop-blur transition hover:bg-white/10 active:scale-[0.98]"
                >
                  <CalendarRange className="h-5 w-5" />
                  استعرض التدرج السنوي
                </button>
              </div>
              <p className="mt-6 text-xs text-emerald-200/70">
                المصدر: التدرجات السنوية — المادة: رياضيات — {level.name} — سبتمبر 2022 — وزارة التربية الوطنية.
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
                  أستاذ مادة الرياضيات بالتعليم الثانوي — مؤلف منصة math-adli — يشرف بيداغوجياً على محتوى «تدرّج»:
                  مواءمة الفصول مع التدرجات الرسمية، ومتابعة جودة الحلول النموذجية.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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

      {/* ============ Level chooser ============ */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="السنوات الثلاث"
            title="اختر مستواك الدراسي"
            sub="المنصة تغطي السنوات الثلاث معاً: تدرج رسمي، فصول، ملخصات وبنك تمارين لكل سنة وشعبة — اختر مستواك للانتقال إلى محتواه."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {LEVELS.map((l) => {
              const chCount = chaptersOfYear(l.id).length;
              const exCount = exercisesOfYear(l.id).length;
              const stCount = streamsOfYear(l.id).length;
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
                        المستوى الحالي
                      </span>
                    )}
                  </div>
                  <p className="min-h-10 text-sm font-bold leading-7 text-stone-600">{l.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-extrabold text-stone-500">
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1">{chCount} فصول</span>
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1">{exCount} تمارين</span>
                    <span className="rounded-lg bg-stone-100 px-2.5 py-1">{stCount} شعب</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Features ============ */}
      <section className="paper bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="لماذا منصة تدرّج؟"
            title="أدوات مصممة للنجاح والتفوق"
            sub="بنيت المنصة حول ثلاثة مرتكزات: الوفاء بالتدرج الرسمي في الترتيب والحجم الساعي لكل سنة وشعبة، تمارين متدرجة الصعوبة بحلول نموذجية، وتتبع شخصي لتقدمك في كل فصل."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                onClick={f.view ? () => onNavigate(f.view) : undefined}
                role={f.view ? 'button' : undefined}
                tabIndex={f.view ? 0 : undefined}
                onKeyDown={
                  f.view
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') onNavigate(f.view);
                      }
                    : undefined
                }
                className={`group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 ${
                  f.view ? 'cursor-pointer' : ''
                } ${
                  'highlight' in f && f.highlight
                    ? 'ring-2 ring-emerald-500/30 hover:ring-emerald-500/60'
                    : ''
                }`}
              >
                <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-extrabold text-stone-900">{f.title}</h3>
                <p className="text-sm leading-7 text-stone-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Chapters preview ============ */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow={`فصول ${level.name}`}
            title={`${chapters.length} فصلاً وفق ترتيب التدرج`}
            sub="مرتبة كما وردت في جداول بناء التعلمات للوثيقة الرسمية — اضغط أي فصل لملخصه وصيغه وتمارينه."
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

      {/* ============ Streams ============ */}
      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow={`شعب ${level.name}`}
            title="مغطاة بالكامل وفق الوثيقة"
            sub="لكل شعبة تدرجها الأسبوعي الخاص بأحجامها الساعية، مع معالجات بيداغوجية والفصول الموازية بين الشعب."
          />
          <div className={`grid gap-4 ${streams.length <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-5'}`}>
            {streams.map((s) => (
              <button
                key={s.id}
                onClick={() => onNavigate('curriculum')}
                className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
              >
                <div className={`mx-auto mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${s.color}`}>
                  {s.shortName}
                </div>
                <div className="text-2xl font-black text-stone-900">{s.weeklyHours}س</div>
                <div className="text-xs font-bold text-stone-500">أسبوعياً × {s.totalWeeks} أسبوعاً</div>
                <div className="mt-2 text-sm font-extrabold text-emerald-700">{s.totalHours} ساعة إجمالاً</div>
              </button>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Trophy className="h-10 w-10 shrink-0 text-amber-500" />
              <div className="flex-1">
                <h3 className="text-lg font-extrabold text-stone-900">
                  {bacCount > 0
                    ? `جاهز للاختبار؟ ${bacCount} تمارين من نمط البكالوريا بانتظارك`
                    : 'جاهز للتمرن؟ اختبر نفسك الآن من بنك التمارين'}
                </h3>
                <p className="mt-1 text-sm leading-7 text-stone-600">
                  أنشئ اختباراً مخصصاً من بنك التمارين حسب شعبتك وعدد الأسئلة، وسجل نتيجتك في لوحة التقدم.
                </p>
              </div>
              <button
                onClick={() => onNavigate('quiz')}
                className="shrink-0 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-emerald-800 active:scale-[0.98]"
              >
                أنشئ اختباراً
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
