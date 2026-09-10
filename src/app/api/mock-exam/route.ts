// ============================================================
//  /api/mock-exam — توليد امتحان تجريبي عشوائي
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  GET ?count=10&stream=EXPERIMENTAL_SCIENCES&difficulty=BAC_LEVEL
//    - يختار أسئلة عشوائية من بنك الأسئلة (quizzes + premium-courses)
//    - يُرجع: { success: true, exam: { id, questions, totalPoints, durationMin } }
//  POST { examId, answers: { [questionId]: selectedIdx }, timeSpentSec }
//    - يصحّح الامتحان ويحفظ النتيجة
//    - يُرجع: { success: true, result: { score, correctCount, ... } }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt";
import { quizzes } from "@/data/quizzes";

export const runtime = "nodejs";

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation?: string;
  points: number;
  source: string; // مصدر السؤال (quiz id أو course slug)
}

/**
 * يخلط مصفوفة (Fisher-Yates).
 */
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * يجمع كل أسئلة الاختبارات في مصفوفة واحدة.
 */
function collectAllQuestions(): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      all.push({
        id: `${quiz.id}__${q.id}`,
        question: q.question,
        options: q.options,
        correctIdx: q.correctIdx,
        explanation: q.explanation,
        points: q.points || 1,
        source: quiz.title,
      });
    }
  }
  return all;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const count = Math.min(50, Math.max(5, parseInt(url.searchParams.get("count") || "10", 10)));
    const durationMin = Math.min(180, Math.max(10, parseInt(url.searchParams.get("duration") || "30", 10)));

    const allQuestions = collectAllQuestions();
    if (allQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "لا توجد أسئلة متاحة" },
        { status: 500 }
      );
    }

    const selected = shuffle(allQuestions).slice(0, Math.min(count, allQuestions.length));
    const totalPoints = selected.reduce((s, q) => s + q.points, 0);
    const examId = `exam-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    return NextResponse.json({
      success: true,
      exam: {
        id: examId,
        title: "امتحان تجريبي عشوائي",
        durationMin,
        totalPoints,
        questionsCount: selected.length,
        questions: selected,
      },
    });
  } catch (err) {
    console.error("[mock-exam GET] خطأ:", err);
    return NextResponse.json(
      { success: false, error: "تعذّر توليد الامتحان" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examId, answers, timeSpentSec } = body || {};
    if (!examId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { success: false, error: "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    // إعادة تجميع الأسئلة (الامتحان يُولَّد عشوائيًا، نعيد بناءه من نفس الأسئلة)
    // في الحل الحقيقي، يجب تخزين examId في DB. هنا نعتمد على إرسال العميل للإجابات.
    // سنقبل userAnswers كـ { questionId: selectedIdx }

    // ملاحظة: هذا التطبيق يفترض أن العميل يرسل الأسئلة مع إجاباته.
    // للحصول على الحل الكامل، نخزّن الأسئلة في DB عند GET ثم نسترجعها في POST.
    // هنا نطبّق نسخة مبسّطة تعتمد على الإرسال:

    const submittedQuestions: ExamQuestion[] = body.questions || [];
    if (submittedQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: "الأسئلة مفقودة" },
        { status: 400 }
      );
    }

    let correctCount = 0;
    let earnedPoints = 0;
    let totalPoints = 0;
    const corrections: Array<{
      questionId: string;
      userAnswer: number | null;
      correctIdx: number;
      isCorrect: boolean;
      explanation?: string;
    }> = [];

    for (const q of submittedQuestions) {
      totalPoints += q.points;
      const userAnswer = answers[q.id] ?? null;
      const isCorrect = userAnswer === q.correctIdx;
      if (isCorrect) {
        correctCount++;
        earnedPoints += q.points;
      }
      corrections.push({
        questionId: q.id,
        userAnswer,
        correctIdx: q.correctIdx,
        isCorrect,
        explanation: q.explanation,
      });
    }

    const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const score20 = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 200) / 10 : 0;

    // حفظ النتيجة في DB إذا كان المستخدم مُسجّلاً
    let storedResultId: string | null = null;
    const payload = await getCurrentUser(req);
    if (payload) {
      // نحاول حفظها كـ QuizResult مع quizId وهمي "mock-exam"
      try {
        // نتأكد من وجود quiz وهمي
        const existingQuiz = await db.quiz.findUnique({
          where: { id: "mock-exam" },
        });
        if (!existingQuiz) {
          await db.quiz.create({
            data: {
              id: "mock-exam",
              title: "امتحان تجريبي عشوائي",
              description: "امتحان يُولَّد عشوائيًا من بنك الأسئلة",
              durationMin: 30,
              passScore: 50,
            },
          });
        }

        const result = await db.quizResult.create({
          data: {
            userId: payload.userId,
            quizId: "mock-exam",
            score: scorePercent,
            correctCount,
            totalCount: submittedQuestions.length,
            answers: JSON.stringify(answers),
            timeSpentSec: timeSpentSec ?? null,
          },
        });
        storedResultId = result.id;
      } catch (dbErr) {
        console.warn("[mock-exam] تعذّر حفظ النتيجة:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        id: storedResultId,
        score: scorePercent,
        score20,
        correctCount,
        totalCount: submittedQuestions.length,
        earnedPoints,
        totalPoints,
        timeSpentSec: timeSpentSec ?? null,
        corrections,
        passed: scorePercent >= 50,
      },
    });
  } catch (err) {
    console.error("[mock-exam POST] خطأ:", err);
    return NextResponse.json(
      { success: false, error: "تعذّر تصحيح الامتحان" },
      { status: 500 }
    );
  }
}
