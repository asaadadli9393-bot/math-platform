"use client";

// ============================================================
//  @/components/mock-exam-view.tsx — وضع الامتحان التجريبي
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { MarkdownMath as MathRenderer } from "@/components/math-renderer";
import {
  Clock,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trophy,
  AlertCircle,
} from "lucide-react";

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation?: string;
  points: number;
  source: string;
}

interface Exam {
  id: string;
  title: string;
  durationMin: number;
  totalPoints: number;
  questionsCount: number;
  questions: ExamQuestion[];
}

interface Correction {
  questionId: string;
  userAnswer: number | null;
  correctIdx: number;
  isCorrect: boolean;
  explanation?: string;
}

interface ExamResult {
  id: string | null;
  score: number;
  score20: number;
  correctCount: number;
  totalCount: number;
  earnedPoints: number;
  totalPoints: number;
  timeSpentSec: number | null;
  corrections: Correction[];
  passed: boolean;
}

type Phase = "config" | "exam" | "result";

export function MockExamView() {
  const [phase, setPhase] = useState<Phase>("config");
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMin, setDurationMin] = useState(30);
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // بدء الامتحان
  async function startExam() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/mock-exam?count=${questionCount}&duration=${durationMin}`);
      const data = await res.json();
      if (data.success) {
        setExam(data.exam);
        setAnswers({});
        setResult(null);
        setCurrentIdx(0);
        setTimeLeft(durationMin * 60);
        setPhase("exam");
      } else {
        setError(data.error || "تعذّر توليد الامتحان");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم");
    }
    setLoading(false);
  }

  // مؤقّت تنازلي
  useEffect(() => {
    if (phase === "exam" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            // تسليم تلقائي عند انتهاء الوقت
            submitExam(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, timeLeft]);

  // تسليم الامتحان
  const submitExam = useCallback(
    async (auto = false) => {
      if (!exam) return;
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(true);
      setError(null);
      try {
        const timeSpent = durationMin * 60 - timeLeft;
        const res = await fetch("/api/mock-exam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: exam.id,
            answers,
            questions: exam.questions,
            timeSpentSec: timeSpent,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setResult(data.result);
          setPhase("result");
        } else {
          setError(data.error || "تعذّر تصحيح الامتحان");
        }
      } catch {
        setError("تعذّر الاتصال بالخادم");
      }
      setLoading(false);
    },
    [exam, answers, timeLeft, durationMin]
  );

  // إعادة تعيين
  function reset() {
    setPhase("config");
    setExam(null);
    setAnswers({});
    setResult(null);
    setError(null);
    setTimeLeft(0);
    setCurrentIdx(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  const isTimeLow = timeLeft > 0 && timeLeft < 60;

  // =====================================================
  //  واجهة الإعداد (config)
  // =====================================================
  if (phase === "config") {
    return (
      <div className="max-w-2xl mx-auto p-6" dir="rtl">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">امتحان تجريبي عشوائي</h2>
          <p className="text-muted-foreground mb-6">
            اختبر استعدادك للبكالوريا بامتحان يُولَّد عشوائيًا من بنك الأسئلة، مع تصحيح فوري ومؤقّت زمني.
          </p>

          <div className="space-y-4 text-right">
            <div className="space-y-2">
              <Label>عدد الأسئلة</Label>
              <div className="flex gap-2 justify-center">
                {[5, 10, 15, 20].map((n) => (
                  <Button
                    key={n}
                    variant={questionCount === n ? "default" : "outline"}
                    onClick={() => setQuestionCount(n)}
                    className="w-16"
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>المدة (دقائق)</Label>
              <div className="flex gap-2 justify-center">
                {[15, 30, 60, 90].map((d) => (
                  <Button
                    key={d}
                    variant={durationMin === d ? "default" : "outline"}
                    onClick={() => setDurationMin(d)}
                    className="w-20"
                  >
                    {d} د
                  </Button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              onClick={startExam}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? "..." : (
                <>
                  <Play className="w-4 h-4 ml-2" />
                  ابدأ الامتحان
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // =====================================================
  //  واجهة الامتحان (exam)
  // =====================================================
  if (phase === "exam" && exam) {
    const q = exam.questions[currentIdx];
    const answeredCount = Object.keys(answers).length;
    const progressPct = (answeredCount / exam.questionsCount) * 100;

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6" dir="rtl">
        {/* الرأس: المؤقّت + التقدم */}
        <Card className="p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${isTimeLow ? "text-red-600 animate-pulse" : "text-amber-600"}`} />
              <span className={`font-mono text-lg font-bold ${isTimeLow ? "text-red-600" : ""}`}>
                {formatTime(timeLeft)}
              </span>
              <Badge variant="outline" className="ml-2">
                {answeredCount} / {exam.questionsCount}
              </Badge>
            </div>
            <Button
              variant="destructive"
              onClick={() => submitExam(false)}
              disabled={loading}
            >
              <Send className="w-4 h-4 ml-2" />
              تسليم
            </Button>
          </div>
          <Progress value={progressPct} className="mt-3 h-2" />
        </Card>

        {/* السؤال الحالي */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">السؤال {currentIdx + 1} من {exam.questionsCount}</Badge>
            <Badge variant="secondary">{q.points} نقطة</Badge>
          </div>

          <div className="text-lg leading-relaxed mb-6">
            <MathRenderer content={q.question} />
          </div>

          <RadioGroup
            value={String(answers[q.id] ?? "")}
            onValueChange={(v) => {
              if (v) {
                setAnswers((a) => ({ ...a, [q.id]: parseInt(v, 10) }));
              }
            }}
            className="space-y-3"
          >
            {q.options.map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                  answers[q.id] === idx ? "border-amber-500 bg-amber-50" : ""
                }`}
              >
                <RadioGroupItem
                  value={String(idx)}
                  id={`q-${q.id}-${idx}`}
                  className="mt-1"
                />
                <div className="flex-1">
                  <MathRenderer content={opt} />
                </div>
              </label>
            ))}
          </RadioGroup>

          <Separator className="my-4" />

          {/* التنقل بين الأسئلة */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
            >
              السابق
            </Button>

            <div className="flex flex-wrap gap-1 max-w-md overflow-x-auto">
              {exam.questions.map((qq, i) => (
                <button
                  key={qq.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-7 h-7 text-xs rounded-md border transition-colors ${
                    i === currentIdx
                      ? "bg-amber-500 text-white border-amber-500"
                      : answers[qq.id] !== undefined
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentIdx((i) => Math.min(exam.questionsCount - 1, i + 1))}
              disabled={currentIdx === exam.questionsCount - 1}
            >
              التالي
            </Button>
          </div>
        </Card>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    );
  }

  // =====================================================
  //  واجهة النتائج (result)
  // =====================================================
  if (phase === "result" && result) {
    const passed = result.passed;
    const scorePct = result.score;

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-6" dir="rtl">
        {/* بطاقة النتيجة الرئيسية */}
        <Card className={`p-8 text-center mb-4 ${passed ? "bg-gradient-to-br from-green-50 to-emerald-100" : "bg-gradient-to-br from-amber-50 to-orange-100"}`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${passed ? "bg-green-500" : "bg-amber-500"}`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-white" />
            ) : (
              <AlertCircle className="w-10 h-10 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {passed ? "مبروك! نجحت" : "حاول مرة أخرى"}
          </h2>
          <div className="text-5xl font-bold mb-2">
            {scorePct}%
          </div>
          <div className="text-lg text-muted-foreground mb-4">
            {result.correctCount} / {result.totalCount} إجابة صحيحة
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="outline">
              النقطة: {result.score20} / 20
            </Badge>
            <Badge variant="outline">
              {result.earnedPoints} / {result.totalPoints} نقطة
            </Badge>
            {result.timeSpentSec && (
              <Badge variant="outline">
                الزمن: {formatTime(result.timeSpentSec)}
              </Badge>
            )}
          </div>
        </Card>

        {/* مراجعة الإجابات */}
        {exam && (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">مراجعة الإجابات</h3>
            <div className="space-y-4">
              {exam.questions.map((q, idx) => {
                const correction = result.corrections.find((c) => c.questionId === q.id);
                const userAns = correction?.userAnswer ?? null;
                const isCorrect = correction?.isCorrect ?? false;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold mb-2">
                          {idx + 1}. <MathRenderer content={q.question} />
                        </div>
                        <div className="text-sm space-y-1">
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded-md ${
                                optIdx === q.correctIdx
                                  ? "bg-green-200 font-semibold"
                                  : optIdx === userAns && !isCorrect
                                  ? "bg-red-200"
                                  : ""
                              }`}
                            >
                              <MathRenderer content={opt} />
                              {optIdx === q.correctIdx && (
                                <span className="text-green-700 mr-2">✓</span>
                              )}
                              {optIdx === userAns && !isCorrect && (
                                <span className="text-red-700 mr-2">✗ إجابتك</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {correction?.explanation && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                            <strong>التفسير:</strong> <MathRenderer content={correction.explanation} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* زر إعادة المحاولة */}
        <div className="text-center mt-6">
          <Button onClick={reset} size="lg">
            <RefreshCw className="w-4 h-4 ml-2" />
            امتحان جديد
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
