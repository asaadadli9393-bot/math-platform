// ============================================================
//  تكامل بنوك التمارين — ربط التمارين بالفصول المناسبة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  هذا الملف يربط التمارين المُنشأة في البنوك بفصول المنهاج
//  ليدمجها تلقائياً في واجهة المنصة.
// ============================================================

import type { ExerciseSeed } from "./curriculum";
import {
  bankSequencesChapter1,
  bankSequencesChapter2,
  bankExponentialChapter1,
  bankExponentialChapter2,
} from "./bank-sequences-exponential";
import {
  bankComplexChapter1,
  bankComplexChapter2,
  bankProbabilityChapter1,
} from "./bank-complex-probability";
import { bankProbabilityChapter2 } from "./bank-probability-ch2-extra";
import {
  bankGeometryChapter1,
  bankGeometryChapter2,
  bankArithmeticChapter1,
  bankArithmeticChapter2,
} from "./bank-geometry-arithmetic";
import {
  bankFunctionsChapter1,
  bankFunctionsChapter2,
} from "./bank-functions";

// خريطة: slug الفصل → قائمة التمارين الإضافية
export const bankExercisesByChapter: Record<string, ExerciseSeed[]> = {
  // الوحدة 1: المتتاليات
  "sequences-introduction": bankSequencesChapter1,
  "arithmetic-geometric-sequences": bankSequencesChapter2,

  // الوحدة 2: الدوال الأسية واللوغاريتمية
  "exponential-function": bankExponentialChapter1,
  "logarithm": bankExponentialChapter2,

  // الوحدة 3: الأعداد المركبة
  "complex-algebraic-form": bankComplexChapter1,
  "complex-polar-form": bankComplexChapter2,

  // الوحدة 4: الاحتمالات
  "conditional-probability": bankProbabilityChapter1,
  "probability-trees": bankProbabilityChapter2,

  // الوحدة 5: الهندسة في الفضاء
  "scalar-product": bankGeometryChapter1,
  "planes-lines-intersections": bankGeometryChapter2,

  // الوحدة 6: الحساب وقابلية القسمة
  "divisibility-gcd": bankArithmeticChapter1,
  "diophantine-applications": bankArithmeticChapter2,

  // الوحدة 7: دراسة الدوال
  "function-complete-study": bankFunctionsChapter1,
  "parametric-functions": bankFunctionsChapter2,
};

// دالة لإحصاء التمارين
export function getBankStats() {
  let total = 0;
  const byChapter: Record<string, number> = {};
  for (const [slug, exercises] of Object.entries(bankExercisesByChapter)) {
    byChapter[slug] = exercises.length;
    total += exercises.length;
  }
  return { total, byChapter };
}
