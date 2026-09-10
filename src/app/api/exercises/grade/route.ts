// ============================================================
//  /api/exercises/grade — تسجيل محاولة تمرين + تصحيح ذاتي
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST { exerciseId, exerciseTitle, unitSlug, chapterSlug, difficulty,
//         answer, selfRated, score?, timeSpentSec? }
//  - يحفظ المحاولة في DB إذا كان المستخدم مُسجّلاً
//  - يُرجع { success: true, attempt }
//  - يعمل أيضًا للمستخدمين غير المُسجّلين (يرجع success فقط)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      exerciseId,
      exerciseTitle,
      unitSlug,
      chapterSlug,
      difficulty,
      answer,
      selfRated,
      score,
      timeSpentSec,
    } = body || {};

    if (!exerciseId || !answer) {
      return NextResponse.json(
        { success: false, error: "exerciseId و answer مطلوبان" },
        { status: 400 }
      );
    }

    const payload = await getCurrentUser(req);

    // إذا لم يكن مُسجّل الدخول، نُرجع نجاحًا فقط (يُسجَّل في localStorage فقط)
    if (!payload) {
      return NextResponse.json({
        success: true,
        attempt: {
          exerciseId,
          exerciseTitle,
          unitSlug,
          chapterSlug,
          difficulty,
          answer,
          selfRated: !!selfRated,
          score: typeof score === "number" ? score : null,
          timeSpentSec: timeSpentSec ?? null,
          stored: false,
        },
      });
    }

    // حفظ في DB
    const attempt = await db.exerciseAttempt.create({
      data: {
        userId: payload.userId,
        exerciseId: String(exerciseId),
        answer: String(answer).slice(0, 10000),
        selfRated: !!selfRated,
        score: typeof score === "number" ? score : null,
        timeSpentSec: typeof timeSpentSec === "number" ? timeSpentSec : null,
      },
    });

    // تحديث تقدّم الوحدة
    if (unitSlug) {
      const existing = await db.unitProgress.findUnique({
        where: {
          userId_unitId: { userId: payload.userId, unitId: unitSlug },
        },
      });

      if (existing) {
        await db.unitProgress.update({
          where: { id: existing.id },
          data: {
            exercisesDone: existing.exercisesDone + 1,
            lastVisitedAt: new Date(),
          },
        });
      } else {
        await db.unitProgress.create({
          data: {
            userId: payload.userId,
            unitId: unitSlug,
            exercisesDone: 1,
            lastVisitedAt: new Date(),
          },
        });
      }
    }

    // إضافة سجل تقدم يومي
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const studyMin = timeSpentSec ? Math.max(1, Math.round(timeSpentSec / 60)) : 1;
    await db.progressRecord.create({
      data: {
        userId: payload.userId,
        date: today,
        exercisesCompleted: 1,
        scoreEarned: typeof score === "number" ? score : 0,
        studyMinutes: studyMin,
      },
    });

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        stored: true,
      },
    });
  } catch (err) {
    console.error("[grade] خطأ:", err);
    return NextResponse.json(
      { success: false, error: "تعذّر حفظ المحاولة" },
      { status: 500 }
    );
  }
}
