"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MathText, MarkdownMath } from "@/components/math-renderer";
import { Clock, Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { useStudentStore, type QuizAttemptRecord } from "@/lib/student-store";
import { useToast } from "@/hooks/use-toast";

export interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation?: string;
  points: number;
}

interface InteractiveQuizProps {
  quizId: string;
  title: string;
  description: string;
  questions: QuizQuestionData[];
  durationMin?: number;
}

export function InteractiveQuiz({
  quizId,
  title,
  description,
  questions,
  durationMin = 30,
}: InteractiveQuizProps) {
  const [currentQ, setCurrentQ] = React.useState(0);
  const [answers, setAnswers] = React.useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(durationMin * 60);
  const [startTime] = React.useState(Date.now());

  const addQuizAttempt = useStudentStore((s) => s.addQuizAttempt);
  const { toast } = useToast();

  React.useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = idx;
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = answers.reduce<number>(
      (acc, ans, i) => acc + (ans === questions[i].correctIdx ? 1 : 0),
      0
    );
    const score = (correct / questions.length) * 100;
    const timeSpentSec = Math.floor((Date.now() - startTime) / 1000);

    const record: QuizAttemptRecord = {
      quizId,
      quizTitle: title,
      score,
      correctCount: correct,
      totalCount: questions.length,
      answers: answers.map((a) => a ?? -1),
      timeSpentSec,
      attemptedAt: new Date().toISOString(),
    };
    addQuizAttempt(record);

    if (score >= 50) {
      toast({
        title: "أحسنت! 🎉",
        description: `نتيجتك: ${score.toFixed(1)}% — تجاوزت نسبة النجاح.`,
      });
    } else {
      toast({
        title: "حاول مجدداً",
        description: `نتيجتك: ${score.toFixed(1)}% — راجع الدروس وأعد المحاولة.`,
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setCurrentQ(0);
    setTimeLeft(durationMin * 60);
  };

  const currentQuestion = questions[currentQ];
  const correct = answers.reduce<number>(
    (acc, ans, i) => acc + (ans === questions[i].correctIdx ? 1 : 0),
    0
  );
  const score = (correct / questions.length) * 100;
  const allAnswered = answers.every((a) => a !== null);

  if (submitted) {
    return (
      <Card className="border-2 border-primary">
        <CardHeader className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-amber-500 mb-2" />
          <CardTitle className="text-2xl">نتيجة الاختبار</CardTitle>
          <CardDescription>{title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className={`text-5xl font-bold ${score >= 50 ? "text-green-600" : "text-red-600"}`}>
              {score.toFixed(1)}%
            </div>
            <Progress value={score} className="h-3" />
            <div className="text-muted-foreground">
              {correct} من {questions.length} إجابات صحيحة
            </div>
            <Badge variant={score >= 50 ? "default" : "destructive"}>
              {score >= 50 ? "ناجح 🎉" : "لم ينجح"}
            </Badge>
          </div>

          <div className="space-y-3 mt-6">
            <h3 className="font-bold text-lg mb-3">المراجعة التفصيلية:</h3>
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correctIdx;
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-md border-r-4 ${
                    isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : "border-red-500 bg-red-50 dark:bg-red-950/20"
                  }`}
                >
                  <div className="font-bold mb-2 flex items-start gap-2">
                    <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <MathText content={q.question} />
                  </div>
                  <div className="text-sm space-y-1 pr-6">
                    <div>
                      <span className="text-muted-foreground">إجابتك: </span>
                      <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                        {userAns !== null ? (
                          <MathText content={q.options[userAns]} />
                        ) : (
                          "—"
                        )}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div>
                        <span className="text-muted-foreground">الإجابة الصحيحة: </span>
                        <span className="text-green-700">
                          <MathText content={q.options[q.correctIdx]} />
                        </span>
                      </div>
                    )}
                    {q.explanation && (
                      <div className="mt-2 text-muted-foreground italic">
                        <span className="font-bold">تفسير: </span>
                        <MathText content={q.explanation} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleReset} className="w-full gap-2" variant="outline">
            <RotateCcw className="w-4 h-4" />
            إعادة الاختبار
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline">
            سؤال {currentQ + 1} / {questions.length}
          </Badge>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className={`font-mono ${timeLeft < 60 ? "text-red-600" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2" />
        <CardTitle className="text-xl mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/40 rounded-lg p-4 border-r-2 border-accent">
          <div className="font-bold mb-2 text-lg">
            <MathText content={currentQuestion.question} />
          </div>
        </div>

        <RadioGroup
          value={String(answers[currentQ] ?? "")}
          onValueChange={(v) => handleSelect(parseInt(v))}
          className="space-y-2"
        >
          {currentQuestion.options.map((opt, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={String(idx)} id={`opt-${idx}`} />
              <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer">
                <MathText content={opt} />
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            السابق
          </Button>
          {currentQ < questions.length - 1 ? (
            <Button onClick={() => setCurrentQ((q) => q + 1)}>
            التالي
            <ArrowLeft className="w-4 h-4 mr-2 rotate-180" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              variant="default"
            >
              <Trophy className="w-4 h-4 ml-2" />
              تسليم الاختبار
            </Button>
          )}
        </div>

        {!allAnswered && currentQ === questions.length - 1 && (
          <p className="text-sm text-amber-600 text-center">
            ⚠ أجب على جميع الأسئلة قبل التسليم
          </p>
        )}
      </CardContent>
    </Card>
  );
}
