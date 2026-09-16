// ============================================================
//  بيانات المنهاج الرسمي — السنة الثالثة شعبة رياضيات (3AS-Math)
//  إشراف بيداغوجي: الأستاذ عدلي أسعد
//  مرتّب حسب تدرّج وزارة التربية الوطنية 2022
// ============================================================
//  27 أسبوعًا — 189 ساعة (7 ساعات/أسبوع)
//  الفصل 1: الدوال العددية (اشتقاقية واستمرارية) (14h) + الدالتان الأسية واللوغاريتمية (14h) +
//           الدوال العددية (النهايات) (7h) + التزائد المقارن ودراسة الدوال (14h) +
//           المتتاليات العددية (14h) + معالجة (7h)
//  الفصل 2: الدوال الأصلية والحساب التكاملي (21h) + الأعداد والحساب (21h) +
//           الإحصاء والاحتمالات (14h) + معالجة (7h)
//  الفصل 3: الأعداد المركبة والتحولات النقلية (21h) + الهندسة في الفضاء (21h) + معالجة (7h)
// ============================================================

import type { UnitSeed } from "./curriculum";
import {
  unitFunctionsStudy,
  unitSequences,
  unitExponentialLogarithm,
  unitProbability,
  unitComplexNumbers,
  unitSpaceGeometry,
  unitArithmeticDivisibility,
} from "./curriculum";
import {
  unitIntegration,
  unitDifferentialEquations,
} from "./curriculum-extra-units";

// ============================================================
//  وحدة إضافية لـ 3AS: الاستمرارية والاشتقاقية (مأخوذة من محتوى unitFunctionsStudy)
// ============================================================
const unit3ASMath_ContinuityDerivatives: UnitSeed = {
  ...unitFunctionsStudy,
  stream: "MATHEMATICS",
  trimester: 1,
  order: 1,
};

// ============================================================
//  تصدير المنهاج الكامل للسنة الثالثة شعبة رياضيات
// ============================================================
export const curriculum3ASMath: UnitSeed[] = [
  // === الفصل الأول (T1) ===
  unit3ASMath_ContinuityDerivatives,    // 1. الدوال العددية (اشتقاقية واستمرارية)
  unitExponentialLogarithm,             // 2. الدالتان الأسية واللوغاريتمية
  unitSequences,                        // 3. المتتاليات العددية
  // === الفصل الثاني (T2) ===
  unitIntegration,                      // 4. الدوال الأصلية والحساب التكاملي
  unitArithmeticDivisibility,           // 5. الأعداد والحساب
  unitProbability,                      // 6. الإحصاء والاحتمالات
  // === الفصل الثالث (T3) ===
  unitComplexNumbers,                   // 7. الأعداد المركبة والتحولات النقلية
  unitSpaceGeometry,                    // 8. الهندسة في الفضاء
  unitDifferentialEquations,            // 9. المعادلات التفاضلية (إضافية)
];
