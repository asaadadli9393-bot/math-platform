'use client';

import * as React from 'react';
import {
  AlertTriangle, ArrowLeft, BookOpen, BookOpenCheck, ChevronDown,
  Globe, GraduationCap, KeyRound, MonitorPlay, ShieldCheck,
  X,
} from 'lucide-react';
import { MarkdownMath, MathText } from '@/components/math-renderer';
import { getEncyclopedia } from '@/data/encyclopedia';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WORLD_RESOURCES, GLOSSARY, STUDY_METHOD } from '@/data/world-library';
import { CHAPTERS, CHAPTERS_3AS, type Chapter } from '@/data/chapters';
import { CHAPTERS_1AS } from '@/data/chapters-1as';
import { CHAPTERS_2AS } from '@/data/chapters-2as';

import type { YearId } from '@/data/curriculum';

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

/** شارة صغيرة موحدة */
function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ring-1 ${className}`}>
      {children}
    </span>
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
  const [yearTab, setYearTab] = React.useState<YearId>(year);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const tabChapters = YEAR_CHAPTERS[yearTab];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* ================= الرأس ================= */}
      <div className="text-center">
        <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 shadow-lg shadow-emerald-700/20">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h1 className="academic-divider mx-auto text-3xl font-black text-stone-900 md:text-4xl">
          الموسوعة المعرفية للرياضيات
        </h1>
        <p className="mx-auto mt-3 max-w-3xl leading-7 text-stone-600">
          استخلصنا المفاهيم والقوانين والأمثلة المحلولة من أشهر مراجع تدريس الرياضيات في العالم —
          خان أكاديمي، يفان مونكا، ملاحظات بول، 3Blue1Brown وأخرى — ثم <b className="text-teal-700">أعدنا صياغتها بالعربية
          بأسلوب منصتنا</b>: موسوعة كاملة لكل محور من محاورك {CHAPTERS.length} — شرح مبسّط، قوانين جاهزة للمراجعة،
          أمثلة بأسلوب التصحيح الرسمي، وأخطاء شائعة تُفقد الدرجات — <b className="text-emerald-700">دون مغادرة المنصة أبداً</b>.
          المنهج الجزائري مشتق من المنهج الفرنسي، لذا صيغ المحتوى ليطابق مفاهيمك تماماً بالجودة التي تشرح بها عالمياً.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Chip className="bg-teal-50 text-teal-800 ring-teal-200">
            <BookOpen className="h-3 w-3" />
            {CHAPTERS.length} محوراً بموسوعة كاملة
          </Chip>
          <Chip className="bg-emerald-50 text-emerald-800 ring-emerald-200">
            <GraduationCap className="h-3 w-3" />
            منهجية مراجعة من 5 خطوات
          </Chip>
          <Chip className="bg-amber-50 text-amber-800 ring-amber-200">
            {GLOSSARY.length} مصطلحاً في القاموس الثلاثي
          </Chip>
          <Chip className="bg-stone-100 text-stone-700 ring-stone-200">
            محتوى أصلي من إعداد المنصة — مجاني بالكامل
          </Chip>
        </div>
      </div>

      {/* ================= منهجية الاستفادة ================= */}
      <section aria-label="منهجية الاستفادة">
        <h2 className="mb-3 text-xl font-black text-stone-900">كيف تراجع بأقصى فائدة؟ 5 خطوات</h2>
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

      {/* ================= الموسوعة المعرفية ================= */}
      <section aria-label="الموسوعة المعرفية">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-stone-900">موسوعة المحاور: شرح كامل لكل فصل من فصولك</h2>
            <p className="mt-1 max-w-3xl text-sm text-stone-500">
              لكل فصل: الجوهر بأبسط لغة، ثم المفاهيم والقوانين، فالأمثلة المحلولة بأسلوب التصحيح الرسمي، وأخيراً
              «الأخطاء الشائعة» التي يُفقد فيها التلاميذ درجاتهم كل سنة — محتوى أصلي من إعداد المنصة، مسترشد بأفضل طرق التدريس العالمية.
            </p>
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
            const ency = getEncyclopedia(ch.id);
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
                      <span className="block text-[11px] font-bold text-stone-400">{ency ? 'موسوعة كاملة' : 'محتوى الفصل'}</span>
                    </span>
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                  <CardContent className="space-y-5 border-t border-stone-100 pt-4">
                    {ency ? (
                      <>
                        {/* سطر الإسناد — نص مرجعي بلا روابط */}
                        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-violet-50 p-3 ring-1 ring-violet-100">
                          <ShieldCheck className="h-4 w-4 shrink-0 text-violet-600" />
                          <span className="text-[12px] font-black text-violet-900">مفاهيم مستخلصة من مراجع عالمية موثوقة وأُعيدت صياغتها أصلاً بأسلوب المنصة:</span>
                          {ency.sources.map((s) => {
                            const res = WORLD_RESOURCES.find((r) => r.id === s.rid);
                            if (!res) return null;
                            return (
                              <span
                                key={s.rid}
                                title={s.note}
                                className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-violet-800 ring-1 ring-violet-200"
                              >
                                {res.name}
                              </span>
                            );
                          })}
                        </div>

                        {/* الجوهر */}
                        <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                          <p className="text-[13.5px] font-extrabold leading-7 text-emerald-900">
                            <span className="ml-1.5 inline-block rounded-lg bg-emerald-700 px-2 py-0.5 text-[11px] font-black text-white">الجوهر</span>
                            {' '}
                            <MathText content={ency.headline} />
                          </p>
                        </div>

                        {/* المفاهيم الأساسية */}
                        <section>
                          <h4 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-black text-emerald-800">
                            <BookOpen className="h-4 w-4" />
                            المفاهيم الأساسية
                          </h4>
                          <div className="space-y-2.5">
                            {ency.concepts.map((b) => (
                              <div key={b.title} className="rounded-xl bg-white p-4 ring-1 ring-emerald-100">
                                <h5 className="mb-1.5 flex items-center gap-2 text-[13px] font-black text-stone-900">
                                  <span className="h-4 w-1 shrink-0 rounded-full bg-emerald-500" />
                                  <MathText content={b.title} />
                                </h5>
                                <MarkdownMath content={b.body} className="text-[13.5px]" />
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* القوانين والخاصيات */}
                        <section>
                          <h4 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-black text-teal-800">
                            <KeyRound className="h-4 w-4" />
                            القوانين والخاصيات
                          </h4>
                          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                            {ency.laws.map((b) => (
                              <div key={b.title} className="rounded-xl bg-teal-50/50 p-4 ring-1 ring-teal-100">
                                <h5 className="mb-1.5 flex items-center gap-2 text-[13px] font-black text-teal-900">
                                  <span className="h-4 w-1 shrink-0 rounded-full bg-teal-500" />
                                  <MathText content={b.title} />
                                </h5>
                                <MarkdownMath content={b.body} className="text-[13px]" />
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* أمثلة محلولة */}
                        <section>
                          <h4 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-black text-amber-800">
                            <GraduationCap className="h-4 w-4" />
                            أمثلة محلولة بأسلوب التصحيح
                          </h4>
                          <div className="space-y-2.5">
                            {ency.examples.map((b) => (
                              <div key={b.title} className="rounded-xl bg-amber-50/60 p-4 ring-1 ring-amber-100">
                                <h5 className="mb-1.5 flex items-center gap-2 text-[13px] font-black text-amber-900">
                                  <span className="h-4 w-1 shrink-0 rounded-full bg-amber-500" />
                                  <MathText content={b.title} />
                                </h5>
                                <MarkdownMath content={b.body} className="text-[13.5px]" />
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* الأخطاء الشائعة */}
                        <div className="rounded-xl bg-rose-50 p-4 ring-1 ring-rose-100">
                          <h4 className="mb-2.5 flex items-center gap-1.5 text-[14px] font-black text-rose-800">
                            <AlertTriangle className="h-4 w-4" />
                            أخطاء شائعة تُفقد الدرجات
                          </h4>
                          <ul className="space-y-1.5">
                            {ency.pitfalls.map((p) => (
                              <li key={p} className="flex items-start gap-2 text-[13px] font-bold leading-6 text-rose-900">
                                <X className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-500" />
                                <MathText content={p} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <p className="text-[13px] leading-6 text-stone-600">{ch.intro}</p>
                    )}

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
                      <Button
                        onClick={onOpenTutor}
                        variant="outline"
                        className="gap-1.5 rounded-xl border-emerald-200 font-extrabold text-emerald-800 hover:bg-emerald-50"
                      >
                        <MonitorPlay className="h-4 w-4" />
                        اسأل المدرس الذكي عن هذا المحور
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* ================= قاموس المصطلحات ================= */}
      <section aria-label="قاموس المصطلحات">
        <h2 className="mb-1 text-xl font-black text-stone-900">قاموس المصطلحات: عربي ↔ فرنسي ↔ إنجليزي</h2>
        <p className="mb-3 text-sm text-stone-500">
          مفتاحك لفهم المصطلح نفسه أينما واجهك: في الكتاب المدرسي، في ملخصات الأرشيف، وفي كل مراجع الرياضيات —
          المصطلح الذي تعرفه بالعربية وما يقابله بالفرنسية والإنجليزية.
        </p>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-right">
                    <th className="px-4 py-3 font-black text-stone-700">بالعربية</th>
                    <th className="px-4 py-3 font-black text-stone-700">بالفرنسية</th>
                    <th className="px-4 py-3 font-black text-stone-700">بالإنجليزية</th>
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
          كل محتوى الموسوعة أصلي من إعداد فريق المنصة: استخلصنا المفاهيم الرياضية المشتركة في أفضل مراجع العالم
          وأعدنا كتابتها بالعربية بأسلوب مبسّط ومتوافق مع المنهج الجزائري. لأي محور تريد التوسع فيه أكثر:
          اسأل المدرس الذكي، وحل من بنك التمارين — وكل ذلك من دون مغادرة تدرّج.
        </p>
      </div>
    </div>
  );
}
