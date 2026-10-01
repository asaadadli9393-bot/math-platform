/**
 * الموسوعة المعرفية — استخلاص المحتوى المعرفي من المكتبات العالمية للرياضيات
 * وإعادة صياغته بالعربية بأسلوب المنصة، مطابقاً للمنهج الجزائري (تدرج 2022-2023).
 *
 * كل مدخل يخدم فصلاً من فصول المنصة ويحتوي:
 * - headline: جوهر الفصل في جملة بلغة التلميذ
 * - concepts: المفاهيم الأساسية المستخلصة (تعريفات مبسطة)
 * - laws: القوانين والخاصيات (جداول وصيغ KaTeX)
 * - examples: أمثلة محلولة خطوة بخطوة بأسلوب التصحيح الرسمي
 * - pitfalls: الأخطاء الشائعة التي تُفقد الدرجات
 * - sources: المصادر العالمية الموثوقة التي استُخلص منها المحتوى (rid = معرف في world-library.ts)
 *
 * الترميز اللاتكسي يتوافق مع MarkdownMath: $..$ سطري، $$..$$ عرض، **..** عريض، |..| جداول.
 * ملاحظة تقنية: استخدم الفاصلة المطبوعة ’ في الكلمات الفرنسية (ليس \').
 */

export interface EncyBlock {
  title: string;
  body: string;
}

export interface EncySource {
  rid: string;
  note: string;
}

export interface EncyclopediaEntry {
  chapterId: string;
  headline: string;
  concepts: EncyBlock[];
  laws: EncyBlock[];
  examples: EncyBlock[];
  pitfalls: string[];
  sources: EncySource[];
}

import { ENCYCLOPEDIA_1AS } from './encyclopedia-1as';
import { ENCYCLOPEDIA_2AS_A, ENCYCLOPEDIA_2AS_B } from './encyclopedia-2as';
import { ENCYCLOPEDIA_3AS_A, ENCYCLOPEDIA_3AS_B } from './encyclopedia-3as';

export const ENCYCLOPEDIA: EncyclopediaEntry[] = [
  ...ENCYCLOPEDIA_1AS,
  ...ENCYCLOPEDIA_2AS_A,
  ...ENCYCLOPEDIA_2AS_B,
  ...ENCYCLOPEDIA_3AS_A,
  ...ENCYCLOPEDIA_3AS_B,
];

export const ENCYCLOPEDIA_MAP: ReadonlyMap<string, EncyclopediaEntry> = new Map(
  ENCYCLOPEDIA.map((e) => [e.chapterId, e]),
);

export function getEncyclopedia(chapterId: string): EncyclopediaEntry | undefined {
  return ENCYCLOPEDIA_MAP.get(chapterId);
}
