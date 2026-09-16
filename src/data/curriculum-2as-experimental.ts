// ============================================================
//  بيانات المنهاج الرسمي — السنة الثانية شعبة علوم تجريبية (2AS-Experimental)
//  إشراف بيداغوجي: الأستاذ عدلي أسعد
//  مرتّب حسب تدرّج وزارة التربية الوطنية 2022
// ============================================================
//  27 أسبوعًا — 135 ساعة (5 ساعات/أسبوع)
//  الفصل 1: الدوال (13h) + الاشتقاقية (12h) + الاحتمالات (15h) + المرجح (5h) + معالجة (5h)
//  الفصل 2: المرجح-تابع (5h) + النهايات (10h) + الزوايا الموجهة (10h) + التحولات النقلية (5h) + الجداء السلمي (10h) + المتتاليات (5h) + معالجة (5h)
//  الفصل 3: المتتاليات-تابع (7h) + الهندسة في الفضاء (18h) + معالجة (5h)
// ============================================================

import type { UnitSeed } from "./curriculum";
import { shared2AS_Units } from "./curriculum-2as-scientific-units";

// ============================================================
//  تصدير المنهاج الكامل للسنة الثانية شعبة علوم تجريبية
// ============================================================
export const curriculum2ASExperimental: UnitSeed[] = [
  // === الفصل الأول (T1) ===
  shared2AS_Units.Functions,
  shared2AS_Units.Derivatives,
  shared2AS_Units.Probability,
  shared2AS_Units.Barycenter,
  // === الفصل الثاني (T2) ===
  shared2AS_Units.Limits,
  shared2AS_Units.DirectedAngles,
  shared2AS_Units.Transformations,
  shared2AS_Units.ScalarProduct,
  shared2AS_Units.Sequences,
  // === الفصل الثالث (T3) ===
  shared2AS_Units.SpaceGeometry,
];
