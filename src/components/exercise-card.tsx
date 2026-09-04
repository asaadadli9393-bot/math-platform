"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MarkdownMath } from "@/components/math-renderer";
import { ChevronDown, Lightbulb, CheckCircle2, Clock, Award, Eye, EyeOff } from "lucide-react";
import { difficultyLabels, difficultyColors, exerciseTypeLabels, type ExerciseDifficulty, type ExerciseType } from "@/lib/curriculum-types";
import { useStudentStore, type AttemptRecord } from "@/lib/student-store";
import { useToast } from "@/hooks/use-toast";

interface ExerciseCardProps {
  exercise: {
    title: string;
    statement: string;
    hint?: string;
    solution: string;
    methodology?: string;
    difficulty: ExerciseDifficulty;
    type: ExerciseType;
    points: number;
    tags?: string[];
  };
  exerciseId: string;
  unitSlug: string;
  chapterSlug: string;
}

export function ExerciseCard({
  exercise,
  exerciseId,
  unitSlug,
  chapterSlug,
}: ExerciseCardProps) {
  const [showHint, setShowHint] = React.useState(false);
  const [showSolution, setShowSolution] = React.useState(false);
  const [userAnswer, setUserAnswer] = React.useState("");
  const [startTime] = React.useState(Date.now());
  const [selfRated, setSelfRated] = React.useState<boolean | null>(null);

  const addAttempt = useStudentStore((s) => s.addAttempt);
  const setUnitProgress = useStudentStore((s) => s.setUnitProgress);
  const { toast } = useToast();

  const handleSelfRate = (success: boolean) => {
    const timeSpentSec = Math.floor((Date.now() - startTime) / 1000);
    setSelfRated(success);

    const attempt: AttemptRecord = {
      exerciseId,
      exerciseTitle: exercise.title,
      unitSlug,
      chapterSlug,
      difficulty: exercise.difficulty,
      selfRated: success,
      timeSpentSec,
      score: success ? exercise.points : 0,
      attemptedAt: new Date().toISOString(),
    };
    addAttempt(attempt);

    if (success) {
      toast({
        title: "أحسنت! 🎉",
        description: `تم تسجيل نجاحك في "${exercise.title}".`,
      });
    } else {
      toast({
        title: "لا بأس — حاول مجدداً",
        description: "راجع الحل النموذجي وحاول تمريناً آخر.",
      });
    }
  };

  const pointsLabel = `${exercise.points}/20`;

  return (
    <Card className="exercise-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg leading-relaxed mb-2">
              {exercise.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className={`${difficultyColors[exercise.difficulty]} border`}>
                {difficultyLabels[exercise.difficulty]}
              </Badge>
              <Badge variant="outline">
                {exerciseTypeLabels[exercise.type]}
              </Badge>
              <Badge variant="secondary">
                <Award className="w-3 h-3 ml-1" />
                {pointsLabel}
              </Badge>
              {exercise.tags?.map((tag, i) => (
                <Badge key={i} variant="ghost">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* نص التمرين */}
        <div className="bg-muted/40 rounded-lg p-4 border-r-2 border-accent">
          <div className="text-sm font-bold text-accent-foreground mb-2 flex items-center gap-2">
            <span className="text-accent">▼</span> نص التمرين
          </div>
          <MarkdownMath content={exercise.statement} />
        </div>

        {/* التلميح */}
        {exercise.hint && (
          <Collapsible open={showHint} onOpenChange={setShowHint}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-accent">
                <Lightbulb className="w-4 h-4 ml-2" />
                {showHint ? "إخفاء التلميح" : "إظهار التلميح"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-amber-50 dark:bg-amber-950/20 border-r-2 border-amber-400 rounded-md p-3 text-sm">
                <span className="font-bold text-amber-700 dark:text-amber-300">تلميح: </span>
                <MarkdownMath content={exercise.hint} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* مساحة الإجابة */}
        <div>
          <label className="text-sm font-bold mb-2 block flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            مساحة الإجابة الذاتية
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="اكتب إجابتك هنا (يمكنك استعمال LaTeX بين $...$ للرياضيات)..."
            className="w-full min-h-32 p-3 rounded-md border border-border bg-background font-amiri leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            dir="rtl"
          />
        </div>

        {/* التقييم الذاتي */}
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-md">
          <span className="text-sm font-bold">هل وصلت إلى الحل بنفسك؟</span>
          <Button
            size="sm"
            variant={selfRated === true ? "default" : "outline"}
            onClick={() => handleSelfRate(true)}
            className="gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> نعم، نجحت
          </Button>
          <Button
            size="sm"
            variant={selfRated === false ? "destructive" : "outline"}
            onClick={() => handleSelfRate(false)}
            className="gap-1"
          >
            <Clock className="w-4 h-4" /> لا، سأحاول مجدداً
          </Button>
        </div>

        {/* الحل النموذجي */}
        <Collapsible open={showSolution} onOpenChange={setShowSolution}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              {showSolution ? (
                <>
                  <EyeOff className="w-4 h-4" /> إخفاء الحل النموذجي
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> إظهار الحل النموذجي المفصل
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="bg-green-50 dark:bg-green-950/20 border-r-4 border-green-500 rounded-md p-4">
              <div className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                الحل النموذجي خطوة بخطوة
              </div>
              <MarkdownMath content={exercise.solution} />
              {exercise.methodology && (
                <div className="mt-4 pt-3 border-t border-green-300 dark:border-green-700">
                  <div className="text-sm font-bold text-green-900 dark:text-green-200 mb-1">
                    📐 المنهجية الرسمية
                  </div>
                  <p className="text-sm italic">{exercise.methodology}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
