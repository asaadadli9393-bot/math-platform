// ============================================================
//  فهرس المناهج الـ12 الرسمية (2022) — منصة الرياضيات
//  إشراف بيداغوجي: الأستاذ عدلي أسعد
// ============================================================
//  هذا الملف منفصل عن curriculum.ts لتفادي الاعتماد الدائري:
//    - ملفات الـ streams تستورد unitSequences و غيرها من curriculum.ts
//    - هذا الملف يستورد curriculum.ts (بعد اكتماله) و ملفات الـ streams
//    - page.tsx يستورد curriculaByStream من curriculum.ts (re-export)
// ============================================================

import type { UnitSeed } from "./curriculum";
import type { CurriculumKey } from "./curriculum";
import { curriculum1ASSciences } from "./curriculum-1as-sciences";
import { curriculum1ASLiterature } from "./curriculum-1as-literature";
import { curriculum2ASMath } from "./curriculum-2as-math";
import { curriculum2ASTechnicalMath } from "./curriculum-2as-technical-math";
import { curriculum2ASExperimental } from "./curriculum-2as-experimental";
import { curriculum2ASLiterature } from "./curriculum-2as-literature";
import { curriculum2ASEconomy } from "./curriculum-2as-economy";
import { curriculum3ASMath } from "./curriculum-3as-math";
import { curriculum3ASTechnicalMath } from "./curriculum-3as-technical-math";
import { curriculum3ASExperimental } from "./curriculum-3as-experimental";
import { curriculum3ASLiterature } from "./curriculum-3as-literature";
import { curriculum3ASEconomy } from "./curriculum-3as-economy";

// ============================================================
//  المناهج الـ12 الرسمية حسب السنة والشعبة (2022)
//  المفاتيح بصيغة `${year}-${stream}`:
//    year: 1AS | 2AS | 3AS
//    stream: Sciences | Literature | Math | TechnicalMath | Experimental | Economy
// ============================================================
export const curriculaByStream: Record<CurriculumKey, UnitSeed[]> = {
  "1AS-Sciences": curriculum1ASSciences,
  "1AS-Literature": curriculum1ASLiterature,
  "2AS-Math": curriculum2ASMath,
  "2AS-TechnicalMath": curriculum2ASTechnicalMath,
  "2AS-Experimental": curriculum2ASExperimental,
  "2AS-Literature": curriculum2ASLiterature,
  "2AS-Economy": curriculum2ASEconomy,
  "3AS-Math": curriculum3ASMath,
  "3AS-TechnicalMath": curriculum3ASTechnicalMath,
  "3AS-Experimental": curriculum3ASExperimental,
  "3AS-Literature": curriculum3ASLiterature,
  "3AS-Economy": curriculum3ASEconomy,
};

// re-export الأنواع والمناهج الفردية للاستخدام الموحد
export {
  curriculum1ASSciences,
  curriculum1ASLiterature,
  curriculum2ASMath,
  curriculum2ASTechnicalMath,
  curriculum2ASExperimental,
  curriculum2ASLiterature,
  curriculum2ASEconomy,
  curriculum3ASMath,
  curriculum3ASTechnicalMath,
  curriculum3ASExperimental,
  curriculum3ASLiterature,
  curriculum3ASEconomy,
};

export type { CurriculumKey };
