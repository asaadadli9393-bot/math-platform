"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MarkdownMath } from "@/components/math-renderer";
import { ChevronLeft, Clock, Award, FileText, Eye, EyeOff, Lightbulb, BookOpen } from "lucide-react";
import type { BacExam } from "@/data/bac-exams";
import { streamLabelsBac } from "@/data/bac-exams";

interface BacExamCardProps {
  exam: BacExam;
}

export function BacExamCard({ exam }: BacExamCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [showHint, setShowHint] = React.useState<Record<string, boolean>>({});

  const toggleHint = (key: string) => {
    setShowHint((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
      <CardHeader className="bg-gradient-to-l from-primary/10 to-transparent">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{exam.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-primary">
                <Award className="w-3 h-3 ml-1" />
                {exam.year}
              </Badge>
              <Badge variant="secondary">
                <FileText className="w-3 h-3 ml-1" />
                {streamLabelsBac[exam.stream]}
              </Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 ml-1" />
                {exam.duration}
              </Badge>
              <Badge variant="outline">المعامل: {exam.coefficient}</Badge>
              <Badge variant="outline">{exam.totalPoints} نقطة</Badge>
            </div>
          </div>
          <Button
            size="sm"
            variant={expanded ? "outline" : "default"}
            onClick={() => setExpanded(!expanded)}
            className="gap-1"
          >
            {expanded ? (
              <>
                <EyeOff className="w-4 h-4" /> إخفاء الحلول
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> عرض الموضوع والحلول
              </>
            )}
          </Button>
        </div>
        <CardDescription className="mt-2">{exam.description}</CardDescription>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-6 space-y-6">
          {exam.parts.map((part, pi) => (
            <div
              key={pi}
              className="border-r-4 border-primary pr-4 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary">{part.title}</h3>
                <Badge variant="outline">{part.points}/20</Badge>
              </div>

              {part.questions.map((q, qi) => {
                const hintKey = `${pi}-${qi}`;
                const hintVisible = showHint[hintKey];
                return (
                  <div
                    key={qi}
                    className="bg-card border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <Badge variant="default" className="flex-shrink-0">
                        {q.number}
                      </Badge>
                      <div className="flex-1 bg-muted/40 rounded-md p-3 border-r-2 border-accent">
                        <MarkdownMath content={q.statement} />
                      </div>
                    </div>

                    {q.hint && (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleHint(hintKey)}
                          className="text-amber-700 gap-1"
                        >
                          <Lightbulb className="w-4 h-4" />
                          {hintVisible ? "إخفاء التلميح" : "إظهار التلميح"}
                        </Button>
                        {hintVisible && (
                          <div className="bg-amber-50 dark:bg-amber-950/20 border-r-2 border-amber-400 rounded-md p-3 text-sm mt-2">
                            <span className="font-bold text-amber-700 dark:text-amber-300">تلميح: </span>
                            <MarkdownMath content={q.hint} />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-green-50 dark:bg-green-950/20 border-r-4 border-green-500 rounded-md p-3">
                      <div className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" />
                        الحل النموذجي
                      </div>
                      <MarkdownMath content={q.solution} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* ملخص الموضوع */}
          <div className="bg-primary/5 border-r-4 border-primary p-4 rounded-md">
            <div className="font-bold text-primary mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" />
              ملخص الموضوع
            </div>
            <ul className="text-sm space-y-1 pr-6 list-disc">
              <li>عدد الأجزاء: {exam.parts.length}</li>
              <li>إجمالي الأسئلة: {exam.parts.reduce((a, p) => a + p.questions.length, 0)}</li>
              <li>النقاط: {exam.totalPoints}/20</li>
              <li>المدة: {exam.duration}</li>
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
