'use client';

import { BookOpenCheck, CalendarRange, Database, GraduationCap, Layers, Target, Trophy } from 'lucide-react';
import { CHAPTERS } from '@/data/chapters';
import { EXERCISES } from '@/data/exercises';
import { ANNUAL_PLANS, STREAMS } from '@/data/curriculum';
import { ChapterIcon, SectionTitle, THEME_STYLES } from '@/components/shared';
import { RichText } from '@/lib/tex';

export default function HomeView({
  onNavigate,
}: {
  onNavigate: (view: 'curriculum' | 'chapters' | 'bank' | 'quiz' | 'dashboard', chapterId?: string) => void;
}) {
  const totalHours = STREAMS.reduce((s, st) => s + st.totalHours, 0);
  const bacCount = EXERCISES.filter((e) => e.difficulty === 'بكالوريا').length;

  const stats = [
    { icon: Layers, value: `${CHAPTERS.length}`, label: 'فصلاً دراسياً' },
    { icon: Database, value: `${EXERCISES.length}`, label: 'تمريناً بحل نموذجي' },
    { icon: GraduationCap, value: `${STREAMS.length}`, label: 'شعب مغطاة' },
    { icon: CalendarRange, value: `${totalHours}`, label: 'ساعة في التدرج الرسمي' },
  ];

  const features = [
    {
      icon: CalendarRange,
      title: 'متوافقة مع تدرج 2022-2023',
      desc: 'بنية الفصول وترتيبها وأحجامها الساعية مستخرجة مباشرة من وثيقة التدرجات السنوية الرسمية الصادرة عن المفتشية العامة للتربية الوطنية، لكل شعبة على حدة.',
    },
    {
      icon: Database,
      title: 'بنك تمارين شامل ومصنّف',
      desc: 'كل تمرين موسوم بالفصل والصعوبة والنوع والشعب المستهدفة، مع حل نموذجي مفصل خطوة بخطوة وتلميح قبل الحل، وبطاقات خاصة بأنماط البكالوريا.',
    },
    {
      icon: BookOpenCheck,
      title: 'ملخصات وصيغ أساسية',
      desc: 'لكل فصل ملخص منظّم للتعريفات والمبرهنات والصيغ الجوهرية بعرض رياضي دقيق (KaTeX)، ليكون مرجعك السريع قبل الحل.',
    },
    {
      icon: Trophy,
      title: 'اختبار وتتبع للتقدم',
      desc: 'أنشئ اختباراً مخصصاً من بنك التمارين حسب شعبتك، وسجّل تقدمك تلقائياً: التمارين المنجزة، نتائج الاختبارات، ونسبة إتمام كل فصل.',
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
                متوافقة مع التدرجات السنوية الرسمية 2022-2023
              </div>
              <h1 className="text-4xl font-black leading-[1.25] sm:text-5xl lg:text-[3.4rem]">
                منصة <span className="text-amber-300">تدرّج</span> للرياضيات
                <span className="mt-2 block text-2xl font-bold text-emerald-100 sm:text-3xl">
                  السنة الثالثة ثانوي — بنك تمارين شامل بالحلول
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-100/90 sm:text-lg">
                {CHAPTERS.length} فصلاً مرتبة وفق التدرج الرسمي، و{EXERCISES.length} تمريناً مصنفاً بالصعوبة والنوع مع حلول
                نموذجية مفصلة، وملخصات وصيغ أساسية لكل فصل — لشعب علوم تجريبية ورياضيات وتقني رياضي وتسيير واقتصاد وآداب.
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
                المصدر: التدرجات السنوية — المادة: رياضيات، المستوى: السنة الثالثة ثانوي، سبتمبر 2022 — وزارة التربية الوطنية.
              </p>
            </div>

            {/* Formula card */}
            <div className="float-soft hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur lg:block">
              <div className="mb-3 flex items-center gap-2 text-emerald-200">
                <BookOpenCheck className="h-5 w-5" />
                <span className="text-sm font-bold">من ملاحظات المنصة</span>
              </div>
              <div className="space-y-3 text-stone-100">
                <RichText
                  className="text-base"
                  text={'النهاية المرجعية: $\\lim_{x\\to 0}\\dfrac{\\ln(1+x)}{x}=1$'}
                />
                <RichText className="text-base" text={'المكاملة بالتجزئة: $\\int_a^b u\'v\\,dx=[uv]_a^b-\\int_a^b uv\'\\,dx$'} />
                <RichText
                  className="text-base"
                  text={'قانون ذا الحدين: $P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}$'}
                />
                <RichText
                  className="text-base"
                  text={'الدوران المركب: $z\'=e^{i\\theta}(z-\\omega)+\\omega$'}
                />
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

      {/* ============ Features ============ */}
      <section className="paper bg-stone-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="لماذا منصة تدرّج؟"
            title="أدوات مصممة لنجاح البكالوريا"
            sub="بنيت المنصة حول ثلاثة مرتكزات: الوفاء بالتدرج الرسمي في الترتيب والحجم الساعي، تمارين متدرجة الصعوبة بحلول نموذجية، وتتبع شخصي لتقدمك في كل فصل."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100"
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
            eyebrow="الفصول"
            title={`${CHAPTERS.length} فصلاً وفق ترتيب التدرج`}
            sub="من الاشتقاقية والاستمرارية إلى هندسة الفضاء والحساب — مرتبة كما وردت في جداول بناء التعلمات للوثيقة الرسمية."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((c, i) => {
              const th = THEME_STYLES[c.theme];
              const count = EXERCISES.filter((e) => e.chapterId === c.id).length;
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
            eyebrow="الشعب"
            title="مغطاة بالكامل وفق الوثيقة"
            sub="لكل شعبة تدرجها الأسبوعي الخاص بأحجامه الساعية، مع معالجات بيداغوجية والفصول الموازية بين الشعب."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STREAMS.map((s) => (
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
                <h3 className="text-lg font-extrabold text-stone-900">جاهز للاختبار؟ {bacCount} تمارين من نمط البكالوريا بانتظارك</h3>
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
