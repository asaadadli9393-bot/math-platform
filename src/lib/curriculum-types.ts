// ============================================================
//  أنواع البيانات للمنهاج التعليمي
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

export type ExerciseDifficulty =
  | "PREREQUISITE"
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "BAC_LEVEL"
  | "BAC_EXAM";

export type ExerciseType =
  | "DIRECT_APPLICATION"
  | "METHOD_EXERCISE"
  | "PROBLEM"
  | "TRUE_FALSE"
  | "MULTIPLE_CHOICE"
  | "DEMONSTRATION";

export type StudentStream =
  | "EXPERIMENTAL_SCIENCES"
  | "MATHEMATICS"
  | "TECHNICAL_MATH";

// عناوين عربية لأنواع الصعوبة
export const difficultyLabels: Record<ExerciseDifficulty, string> = {
  PREREQUISITE: "مكتسبات قبلية",
  BEGINNER: "تأسيسي",
  INTERMEDIATE: "متوسط",
  ADVANCED: "متقدم",
  BAC_LEVEL: "مستوى بكالوريا",
  BAC_EXAM: "موضوع بكالوريا",
};

// عناوين عربية لأنواع التمارين
export const exerciseTypeLabels: Record<ExerciseType, string> = {
  DIRECT_APPLICATION: "تطبيق مباشر",
  METHOD_EXERCISE: "تمرين منهجي",
  PROBLEM: "مسألة",
  TRUE_FALSE: "صحيح/خطأ",
  MULTIPLE_CHOICE: "اختيار من متعدد",
  DEMONSTRATION: "برهان",
};

// عناوين عربية للشعب
export const streamLabels: Record<string, string> = {
  ALL: "كل الشعب العلمية",
  EXPERIMENTAL_SCIENCES: "علوم تجريبية",
  MATHEMATICS: "رياضيات",
  TECHNICAL_MATH: "تقني رياضي",
};

// ألوان حسب الصعوبة (للشارات)
export const difficultyColors: Record<ExerciseDifficulty, string> = {
  PREREQUISITE: "bg-blue-100 text-blue-800 border-blue-300",
  BEGINNER: "bg-green-100 text-green-800 border-green-300",
  INTERMEDIATE: "bg-amber-100 text-amber-800 border-amber-300",
  ADVANCED: "bg-orange-100 text-orange-800 border-orange-300",
  BAC_LEVEL: "bg-red-100 text-red-800 border-red-300",
  BAC_EXAM: "bg-purple-100 text-purple-800 border-purple-300",
};
