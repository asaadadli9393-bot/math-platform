// ============================================================
//  /api/progress — تتبع تقدم الطالب
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  GET: يُرجع ملخص تقدم المستخدم الحالي
//    - تمارين منجزة (إجمالي)
//    - متوسط النقاط
//    - نسبة النجاح
//    - وحدات مُستهلّة
//    - اختبارات مُجابة + متوسطها
//    - سجل آخر 30 يوم (للرسم البياني)
//    - شارات (badges) مُكتسبة
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt";

export const runtime = "nodejs";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
}

/**
 * يحسب الشارات بناءً على إحصائيات المستخدم.
 */
function computeBadges(stats: {
  exercisesDone: number;
  quizzesPassed: number;
  unitsStarted: number;
  studyMinutes: number;
  perfectScores: number;
}): Badge[] {
  return [
    {
      id: "first-step",
      title: "الخطوة الأولى",
      description: "أكمل أول تمرين",
      icon: "🎯",
      earned: stats.exercisesDone >= 1,
    },
    {
      id: "ten-exercises",
      title: "مجتهد",
      description: "أكمل 10 تمارين",
      icon: "📚",
      earned: stats.exercisesDone >= 10,
      progress: Math.min(100, (stats.exercisesDone / 10) * 100),
    },
    {
      id: "fifty-exercises",
      title: "مثابر",
      description: "أكمل 50 تمرينًا",
      icon: "💪",
      earned: stats.exercisesDone >= 50,
      progress: Math.min(100, (stats.exercisesDone / 50) * 100),
    },
    {
      id: "hundred-exercises",
      title: "بطل",
      description: "أكمل 100 تمرين",
      icon: "🏆",
      earned: stats.exercisesDone >= 100,
      progress: Math.min(100, (stats.exercisesDone / 100) * 100),
    },
    {
      id: "first-quiz",
      title: "أول اختبار",
      description: "أكمل أول اختبار",
      icon: "📝",
      earned: stats.quizzesPassed >= 1,
    },
    {
      id: "quiz-master",
      title: "ملك الاختبارات",
      description: "أجب 5 اختبارات بنجاح",
      icon: "👑",
      earned: stats.quizzesPassed >= 5,
      progress: Math.min(100, (stats.quizzesPassed / 5) * 100),
    },
    {
      id: "perfect-score",
      title: "العلامة الكاملة",
      description: "احصل على 20/20 في تمرين",
      icon: "⭐",
      earned: stats.perfectScores >= 1,
    },
    {
      id: "explorer",
      title: "مستكشف",
      description: "ابدأ 3 وحدات",
      icon: "🧭",
      earned: stats.unitsStarted >= 3,
      progress: Math.min(100, (stats.unitsStarted / 3) * 100),
    },
    {
      id: "scholar",
      title: "دارس",
      description: "ادرس 60 دقيقة على المنصة",
      icon: "⏰",
      earned: stats.studyMinutes >= 60,
      progress: Math.min(100, (stats.studyMinutes / 60) * 100),
    },
    {
      id: "marathoner",
      title: "ماراثوني",
      description: "ادرس 300 دقيقة على المنصة",
      icon: "🔥",
      earned: stats.studyMinutes >= 300,
      progress: Math.min(100, (stats.studyMinutes / 300) * 100),
    },
  ];
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getCurrentUser(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "غير مُسجّل الدخول" },
        { status: 401 }
      );
    }

    // إحصائيات التمارين
    const attempts = await db.exerciseAttempt.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });
    const exercisesDone = attempts.length;
    const successfulAttempts = attempts.filter((a) => a.selfRated).length;
    const scoredAttempts = attempts.filter((a) => a.score !== null);
    const avgScore =
      scoredAttempts.length > 0
        ? scoredAttempts.reduce((s, a) => s + (a.score ?? 0), 0) /
          scoredAttempts.length
        : 0;
    const perfectScores = attempts.filter((a) => a.score === 20).length;

    // إحصائيات الوحدات
    const unitProgress = await db.unitProgress.findMany({
      where: { userId: payload.userId },
    });
    const unitsStarted = unitProgress.length;

    // إحصائيات الاختبارات
    const quizResults = await db.quizResult.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });
    const quizzesPassed = quizResults.filter(
      (q) => q.score >= 50
    ).length;

    // سجل آخر 30 يوم
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentProgress = await db.progressRecord.findMany({
      where: {
        userId: payload.userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: "asc" },
    });
    const studyMinutes = recentProgress.reduce(
      (s, r) => s + r.studyMinutes,
      0
    );

    // تجميع حسب اليوم للرسم البياني
    const dailyStats = new Map<string, { exercises: number; minutes: number; score: number }>();
    for (const r of recentProgress) {
      const dayKey = r.date.toISOString().slice(0, 10);
      const existing = dailyStats.get(dayKey) || { exercises: 0, minutes: 0, score: 0 };
      existing.exercises += r.exercisesCompleted;
      existing.minutes += r.studyMinutes;
      existing.score += r.scoreEarned;
      dailyStats.set(dayKey, existing);
    }
    const dailyChart = Array.from(dailyStats.entries()).map(([day, s]) => ({
      day,
      ...s,
    }));

    const badges = computeBadges({
      exercisesDone,
      quizzesPassed,
      unitsStarted,
      studyMinutes,
      perfectScores,
    });
    const earnedBadges = badges.filter((b) => b.earned);

    return NextResponse.json({
      success: true,
      stats: {
        exercisesDone,
        successfulAttempts,
        successRate:
          exercisesDone > 0 ? (successfulAttempts / exercisesDone) * 100 : 0,
        avgScore,
        perfectScores,
        unitsStarted,
        quizzesCount: quizResults.length,
        quizzesPassed,
        avgQuizScore:
          quizResults.length > 0
            ? quizResults.reduce((s, q) => s + q.score, 0) / quizResults.length
            : 0,
        studyMinutes,
        studyHours: Math.round((studyMinutes / 60) * 10) / 10,
      },
      dailyChart,
      badges,
      earnedBadges,
      recentAttempts: attempts.slice(0, 10).map((a) => ({
        id: a.id,
        exerciseId: a.exerciseId,
        selfRated: a.selfRated,
        score: a.score,
        timeSpentSec: a.timeSpentSec,
        createdAt: a.createdAt,
      })),
      recentQuizzes: quizResults.slice(0, 10).map((q) => ({
        id: q.id,
        quizId: q.quizId,
        score: q.score,
        correctCount: q.correctCount,
        totalCount: q.totalCount,
        createdAt: q.createdAt,
      })),
    });
  } catch (err) {
    console.error("[progress] خطأ:", err);
    return NextResponse.json(
      { success: false, error: "تعذّر جلب بيانات التقدم" },
      { status: 500 }
    );
  }
}
