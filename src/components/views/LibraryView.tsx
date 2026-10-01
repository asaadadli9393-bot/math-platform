'use client';

import * as React from 'react';
import {
  ArrowLeft, BookOpen, BookOpenCheck, Calculator, Check, ChevronDown, ExternalLink,
  FileCheck, Globe, Library, Lightbulb, MonitorPlay, Search, ShieldCheck, Youtube,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WORLD_RESOURCES, RES_TYPE_LABELS, RES_LANG_LABELS, GLOSSARY, STUDY_METHOD, type ResLang, type ResType } from '@/data/world-library';
import { UNIT_PICKS } from '@/data/unit-picks';
import { CHAPTERS, CHAPTERS_3AS, type Chapter } from '@/data/chapters';
import { CHAPTERS_1AS } from '@/data/chapters-1as';
import { CHAPTERS_2AS } from '@/data/chapters-2as';

import type { YearId } from '@/data/curriculum';

const TYPE_ICONS: Record<ResType, React.ComponentType<{ className?: string }>> = {
  lessons: BookOpen,
  practice: BookOpenCheck,
  video: MonitorPlay,
  tools: Calculator,
  encyclopedia: Library,
  exams: FileCheck,
};

const YEAR_TABS: { id: YearId; label: string }[] = [
  { id: '1as', label: 'أولى ثانوي' },
  { id: '2as', label: 'ثانية ثانوي' },
  { id: '3as', label: 'ثالثة ثانوي (بكالوريا)' },
];

const YEAR_CHAPTERS: Record<YearId, Chapter[]> = {
  '1as': CHAPTERS_1AS,
  '2as': CHAPTERS_2AS,
  '3as': CHAPTERS_3AS,
};

const LANG_STYLES: Record<ResLang, string> = {
  ar: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  fr: 'bg-amber-50 text-amber-800 ring-amber-200',
  en: 'bg-stone-100 text-stone-700 ring-stone-200',
};

const TYPE_STYLES: Record<ResType, string> = {
  lessons: 'bg-teal-50 text-teal-800 ring-teal-200',
  practice: 'bg-lime-50 text-lime-800 ring-lime-200',
  video: 'bg-rose-50 text-rose-800 ring-rose-200',
  tools: 'bg-violet-50 text-violet-800 ring-violet-200',
  encyclopedia: 'bg-stone-100 text-stone-700 ring-stone-200',
  exams: 'bg-orange-50 text-orange-800 ring-orange-200',
};

/** شارة صغيرة موحدة */
function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ${className}`}>
      {children}
    </span>
  );
}

/** كرت مصدر عالمي واحد */
function ResourceCard({ res, chapterTitles }: { res: (typeof WORLD_RESOURCES)[number]; chapterTitles: string[] }) {
  return (
    <Card className="flex h-full flex-col transition hover:shadow-lg hover:shadow-emerald-700/5">
      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-black leading-snug text-stone-900">{res.name}</h3>
            <Chip className={res.free === 'مجاني' ? 'shrink-0 bg-emerald-600 text-white ring-emerald-600' : 'shrink-0 bg-amber-400 text-emerald-950 ring-amber-400'}>
              {res.free}
            </Chip>
          </div>
          <p dir="ltr" className="mt-0.5 text-left text-[11px] font-bold text-stone-400">{res.original}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {res.langs.map((l) => (
            <Chip key={l} className={LANG_STYLES[l]}>{RES_LANG_LABELS[l]}</Chip>
          ))}
          {res.types.map((t) => {
            const Icon = TYPE_ICONS[t];
            return (
              <Chip key={t} className={TYPE_STYLES[t]}>
                <Icon className="h-3 w-3" />
                {RES_TYPE_LABELS[t]}
              </Chip>
            );
          })}
        </div>

        <p className="flex items-start gap-1.5 rounded-lg bg-emerald-50/60 p-2.5 text-[11.5px] font-semibold leading-5 text-emerald-900 ring-1 ring-emerald-100">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          {res.trust}
        </p>

        <p className="text-[13px] leading-6 text-stone-600">{res.description}</p>

        <ul className="space-y-1">
          {res.highlights.map((h) => (
            <li key={h} className="flex items-start gap-1.5 text-[12px] font-bold text-stone-700">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              {h}
            </li>
          ))}
        </ul>

        {chapterTitles.length > 0 && (
          <p className="text-[11px] font-bold text-stone-500">
            يخدم محاورك:{' '}
            <span className="text-stone-700">{chapterTitles.slice(0, 3).join('، ')}{chapterTitles.length > 3 ? ` و${chapterTitles.length - 3} محاور أخرى` : ''}</span>
          </p>
        )}

        <p className="mt-auto flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-[11.5px] font-bold leading-5 text-amber-900 ring-1 ring-amber-100">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          {res.tip}
        </p>

        <div className="flex gap-2">
          <a
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2.5 text-sm font-extrabold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            <ExternalLink className="h-4 w-4" />
            زيارة الموقع
          </a>
          {res.youtube && (
            <a
              href={res.youtube}
              target="_blank"
              rel="noopener noreferrer"
              title="القناة على يوتيوب"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 active:scale-[0.98]"
            >
              <Youtube className="h-4 w-4" />
              يوتيوب
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LibraryView({
  year,
  onOpenChapter,
  onOpenTutor,
  onOpenBank,
}: {
  year: YearId;
  onOpenChapter: (id: string) => void;
  onOpenTutor: () => void;
  onOpenBank: (chapterId?: string) => void;
}) {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'ALL' | ResType>('ALL');
  const [langFilter, setLangFilter] = React.useState<'ALL' | ResLang>('ALL');
  const [yearTab, setYearTab] = React.useState<YearId>(year);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const chById = React.useMemo(() => new Map(CHAPTERS.map((c) => [c.id, c])), []);

  const chapterTitlesOf = React.useCallback(
    (ids: string[]) =>
      ids.map((id) => chById.get(id)?.shortTitle ?? '').filter(Boolean),
    [chById],
  );

  const filteredRes = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return WORLD_RESOURCES.filter((r) => {
      if (typeFilter !== 'ALL' && !r.types.includes(typeFilter)) return false;
      if (langFilter !== 'ALL' && !r.langs.includes(langFilter)) return false;
      if (!q) return true;
      const hay = [
        r.name,
        r.original,
        r.description,
        r.trust,
        ...chapterTitlesOf(r.chapters),
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [search, typeFilter, langFilter, chapterTitlesOf]);

  const tabChapters = YEAR_CHAPTERS[yearTab];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* ================= الرأس ================= */}
      <div className="text-center">
        <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 shadow-lg shadow-emerald-700/20">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h1 className="academic-divider mx-auto text-3xl font-black text-stone-900 md:text-4xl">
          المكتبة العالمية للرياضيات
        </h1>
        <p className="mx-auto mt-3 max-w-3xl leading-7 text-stone-600">
          اخترنا لك يدوياً <b className="text-emerald-700">{WORLD_RESOURCES.length} مصدراً عالمياً موثوقاً</b> — من خان أكاديمي
          إلى جامعة MIT مروراً بأفضل أساتذة فرنسا — وقدّمناه بلغة مبسطة مع تحديد دقيق للمحاور الجزائرية التي يخدمها كل مصدر.
          المنهج الجزائري مشتق من المنهج الفرنسي، لذا ستجد في هذه المصادر نفس مفاهيمك يشرحها العالم، مجاناً وبأعلى جودة.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Chip className="bg-emerald-50 text-emerald-800 ring-emerald-200">
            <Globe className="h-3 w-3" />
            {WORLD_RESOURCES.length} مصدراً موثوقاً
          </Chip>
          <Chip className="bg-teal-50 text-teal-800 ring-teal-200">
            <BookOpen className="h-3 w-3" />
            {CHAPTERS.length} محوراً دراسياً مربوطاً بالمصادر
          </Chip>
          <Chip className="bg-amber-50 text-amber-800 ring-amber-200">
            {GLOSSARY.length} مصطلحاً في القاموس الثلاثي
          </Chip>
          <Chip className="bg-stone-100 text-stone-700 ring-stone-200">
            الاستخدام الأساسي مجاني في كل المصادر
          </Chip>
        </div>
      </div>

      {/* ================= منهجية الاستفادة ================= */}
      <section aria-label="منهجية الاستفادة">
        <h2 className="mb-3 text-xl font-black text-stone-900">كيف تستفيد منها بأقصى فائدة؟ 5 خطوات</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STUDY_METHOD.map((s) => (
            <Card key={s.title} className="border-emerald-100 bg-white/70">
              <CardContent className="p-4">
                <div className="mb-1.5 text-sm font-black text-emerald-700">{s.title}</div>
                <p className="text-[12px] leading-5 text-stone-600">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={onOpenTutor} className="gap-1.5 rounded-xl bg-emerald-700 font-extrabold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800">
            <MonitorPlay className="h-4 w-4" />
            اسأل المدرس الذكي عن أي مفهوم
          </Button>
          <Button onClick={() => onOpenBank()} variant="outline" className="gap-1.5 rounded-xl border-emerald-200 font-extrabold text-emerald-800 hover:bg-emerald-50">
            <BookOpenCheck className="h-4 w-4" />
            طبّق ما تتعلمه في بنك التمارين
          </Button>
        </div>
      </section>

      {/* ================= دليل المحاور ================= */}
      <section aria-label="دليل المحاور">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900">دليل المحاور: كل فصل… وأفضل المصادر العالمية له</h2>
            <p className="mt-1 text-sm text-stone-500">اختر سنتك، افتح الفصل، وستجد مرتبة أمامه أفضل الموارد العالمية لشرحه والتمرن عليه.</p>
          </div>
          <div className="inline-flex shrink-0 rounded-xl bg-stone-100 p-1 ring-1 ring-stone-200">
            {YEAR_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setYearTab(t.id); setExpanded(null); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                  yearTab === t.id ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25' : 'text-stone-500 hover:bg-white hover:text-emerald-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tabChapters.map((ch) => {
            const picks = UNIT_PICKS[ch.id] ?? [];
            const open = expanded === ch.id;
            return (
              <Card key={ch.id} className={open ? 'col-span-1 border-emerald-300 ring-2 ring-emerald-200 md:col-span-2 xl:col-span-3' : ''}>
                <button
                  onClick={() => setExpanded(open ? null : ch.id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-right"
                  aria-expanded={open}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <BookOpen className="h-4.5 w-4.5" />
                    </span>
                    <span>
                      <span className="block font-black text-stone-900">{ch.shortTitle}</span>
                      <span className="block text-[11px] font-bold text-stone-400">{picks.length} مصادر عالمية مقترحة</span>
                    </span>
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                  <CardContent className="space-y-3 border-t border-stone-100 pt-4">
                    <p className="text-[13px] leading-6 text-stone-600">{ch.intro}</p>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                      {picks.map((p) => {
                        const res = WORLD_RESOURCES.find((r) => r.id === p.rid);
                        if (!res) return null;
                        return (
                          <div key={p.rid} className="flex flex-col gap-2 rounded-xl bg-stone-50 p-3.5 ring-1 ring-stone-100">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-black text-stone-800">{res.name}</span>
                              <div className="flex shrink-0 gap-1">
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="فتح الموقع"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-800"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                                {res.youtube && (
                                  <a
                                    href={res.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="القناة على يوتيوب"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white transition hover:bg-rose-700"
                                  >
                                    <Youtube className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-[12px] font-semibold leading-5 text-stone-600">{p.tip}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button
                        onClick={() => onOpenChapter(ch.id)}
                        className="gap-1.5 rounded-xl bg-emerald-700 font-extrabold text-white hover:bg-emerald-800"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        افتح الفصل في المنصة (ملخص + قوانين + تمارين)
                      </Button>
                      <Button
                        onClick={() => onOpenBank(ch.id)}
                        variant="outline"
                        className="gap-1.5 rounded-xl border-emerald-200 font-extrabold text-emerald-800 hover:bg-emerald-50"
                      >
                        <BookOpenCheck className="h-4 w-4" />
                        تمارين هذا الفصل
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* ================= دليل المصادر ================= */}
      <section aria-label="دليل المصادر العالمية">
        <h2 className="mb-1 text-xl font-black text-stone-900">دليل المصادر العالمية الكامل</h2>
        <p className="mb-3 text-sm text-stone-500">
          كل مصدر يفتح في نافذة جديدة، مجاني الاستخدام الأساسي، ومراجعته يدوية من فريق المنصة.
        </p>

        {/* المرشحات */}
        <Card className="mb-4">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم المصدر أو المفهوم أو المحور… (مثال: المتتاليات، احتمالات، Desmos)"
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pr-10 pl-4 text-sm font-bold text-stone-800 outline-none transition placeholder:font-semibold placeholder:text-stone-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-black text-stone-500">النوع:</span>
                {(['ALL', ...(Object.keys(RES_TYPE_LABELS) as ResType[])] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition ${
                      typeFilter === t ? 'bg-emerald-700 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {t === 'ALL' ? 'الكل' : RES_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-black text-stone-500">اللغة:</span>
                {(['ALL', 'ar', 'fr', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLangFilter(l)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold transition ${
                      langFilter === l ? 'bg-emerald-700 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {l === 'ALL' ? 'الكل' : RES_LANG_LABELS[l]}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-stone-400">{filteredRes.length} نتيجة</span>
            </div>
          </CardContent>
        </Card>

        {filteredRes.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-stone-200 p-10 text-center">
            <Search className="mx-auto mb-2 h-8 w-8 text-stone-300" />
            <p className="font-black text-stone-500">لا نتائج مطابقة — جرّب كلمة أخرى أو أزل بعض المرشحات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRes.map((r) => (
              <ResourceCard key={r.id} res={r} chapterTitles={chapterTitlesOf(r.chapters)} />
            ))}
          </div>
        )}
      </section>

      {/* ================= قاموس المصطلحات ================= */}
      <section aria-label="قاموس المصطلحات">
        <h2 className="mb-1 text-xl font-black text-stone-900">قاموس المصطلحات: عربي ↔ فرنسي ↔ إنجليزي</h2>
        <p className="mb-3 text-sm text-stone-500">
          مفتاحك لقراءة أي مصدر عالمي: المصطلح الذي تعرفه بالعربية، وسنراه بالفرنسية والإنجليزية في المصادر.
        </p>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-right">
                    <th className="px-4 py-3 font-black text-stone-700">بالعربية</th>
                    <th className="px-4 py-3 font-black text-stone-700">بالفرنسية (المصادر الفرنسية)</th>
                    <th className="px-4 py-3 font-black text-stone-700">بالإنجليزية (المصادر العالمية)</th>
                  </tr>
                </thead>
                <tbody>
                  {GLOSSARY.map((g) => (
                    <tr key={g.ar} className="border-b border-stone-50 transition hover:bg-emerald-50/40">
                      <td className="px-4 py-2.5 font-extrabold text-stone-800">{g.ar}</td>
                      <td dir="ltr" className="px-4 py-2.5 text-left font-bold text-amber-700">{g.fr}</td>
                      <td dir="ltr" className="px-4 py-2.5 text-left font-bold text-teal-700">{g.en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ================= ملاحظة ختامية ================= */}
      <div className="rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-100">
        <p className="mx-auto max-w-3xl text-sm font-bold leading-7 text-emerald-900">
          جميع الروابط أعلاه تفتح في نافذة جديدة، والمصادر مجانية الاستخدام الأساسي. اختيار المصادر عمل يدوي مستمر:
          إن وجدت رابطاً توقف عن العمل أو مصدراً تستحق الإضافة، أخبر الأستاذ — فالمكتبة تنمو بمدخلات تلاميذها.
        </p>
      </div>
    </div>
  );
}
