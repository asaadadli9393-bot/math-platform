// ============================================================
//  ملف الدمج — الدروس المعرفية الكاملة للدورات المميزة
//  تجميع كل الدروس الغنية من الملفات الجزئية
// ============================================================

import { RICH_LESSONS_SUITES } from "./course-lessons-rich-a";
import { RICH_LESSONS_EXP } from "./course-lessons-rich-b";
import { RICH_LESSONS_LN } from "./course-lessons-rich-c";
import { RICH_LESSONS_COMPLEX } from "./course-lessons-rich-d";
import { RICH_LESSONS_PROBA } from "./course-lessons-rich-e";

export const RICH_LESSONS: Record<string, string> = {
  ...RICH_LESSONS_SUITES,
  ...RICH_LESSONS_EXP,
  ...RICH_LESSONS_LN,
  ...RICH_LESSONS_COMPLEX,
  ...RICH_LESSONS_PROBA,
};
