"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudentStore } from "@/lib/student-store";
import { useOverallStats } from "@/lib/student-store";
import { curriculum } from "@/data/curriculum";
import { difficultyLabels } from "@/lib/curriculum-types";
import {
  Shield,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Award,
  Calendar,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ParentPortal() {
  const profile = useStudentStore((s) => s.profile);
  const attempts = useStudentStore((s) => s.attempts);
  const quizAttempts = useStudentStore((s) => s.quizAttempts);
  const unitProgress = useStudentStore((s) => s.unitProgress);
  const stats = useOverallStats();

  const [accessCode, setAccessCode] = React.useState("");
  const [granted, setGranted] = React.useState(false);
  const { toast } = useToast();

  const handleAccess = () => {
    // في الإصدار الحقيقي: التحقق من رمز وولي الأمر من قاعدة البيانات
    // هنا: نقبل أي رمز من 4 أرقام للعرض التجريبي
    if (accessCode.length >= 4) {
      setGranted(true);
      toast({
        title: "تم الدخول",
        description: "مرحباً بك في فضاء متابعة ولي الأمر.",
      });
    } else {
      toast({
        title: "رمز غير صالح",
        description: "أدخل رمزاً صالحاً (4 أرقام على الأقل).",
        variant: "destructive",
      });
    }
  };

  if (!granted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Shield className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle>فضاء أولياء الأمور</CardTitle>
          <CardDescription>
            هذا الفضاء خاص بأولياء الأمور لمتابعة تقدم أبنائهم. أدخل رمز الوصول
            المُسلَّم إليك من المنصة.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-code">رمز الوصول</Label>
            <Input
              id="access-code"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="••••"
              className="text-center tracking-widest"
              onKeyDown={(e) => e.key === "Enter" && handleAccess()}
            />
          </div>
          <Button onClick={handleAccess} className="w-full">
            دخول الفضاء
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            للحصول على رمز الوصول، يرجى التواصل مع إدارة المنصة أو الأستاذ عدلي أسعد.
          </p>
        </CardContent>
      </Card>
    );
  }

  // تحليل التقدم وحالات القلق
  const weakUnits = curriculum.filter((unit) => {
    const p = unitProgress[unit.slug];
    return p && p.averageScore < 50 && p.exercisesDone > 0;
  });

  const strongUnits = curriculum.filter((unit) => {
    const p = unitProgress[unit.slug];
    return p && p.averageScore >= 75 && p.exercisesDone > 0;
  });

  const lastActivity = attempts[0];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-l from-secondary/30 via-accent/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <User className="w-10 h-10 text-primary" />
            <div>
              <h2 className="text-xl font-bold">متابعة الطالب: {profile?.name || "—"}</h2>
              <p className="text-sm text-muted-foreground">
                {profile?.grade || "السنة الثالثة ثانوي"} •{" "}
                {profile?.city || "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ملخص الأداء */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
            <div className="text-2xl font-bold">{stats.successful}</div>
            <div className="text-xs text-muted-foreground">تمارين منجزة بنجاح</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <div className="text-2xl font-bold">{stats.successRate.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">نسبة النجاح العامة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Award className="w-6 h-6 text-amber-600 mb-2" />
            <div className="text-2xl font-bold">{stats.avgQuizScore.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">متوسط الاختبارات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Clock className="w-6 h-6 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{stats.quizCount}</div>
            <div className="text-xs text-muted-foreground">اختبارات مُجتازة</div>
          </CardContent>
        </Card>
      </div>

      {/* آخر نشاط */}
      {lastActivity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              آخر نشاط للطالب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm">
              <Badge variant={lastActivity.selfRated ? "default" : "secondary"}>
                {lastActivity.selfRated ? "نجاح" : "محاولة"}
              </Badge>
              <span className="font-semibold">{lastActivity.exerciseTitle}</span>
              <span className="text-muted-foreground">
                {new Date(lastActivity.attemptedAt).toLocaleDateString("ar-DZ", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* حالات القلق — وحدات ضعيفة */}
      {weakUnits.length > 0 && (
        <Card className="border-2 border-amber-400 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              نقاط تحتاج إلى اهتمام ({weakUnits.length})
            </CardTitle>
            <CardDescription>
              الوحدات التالية تحتاج إلى مراجعة إضافية. ننصح بالتواصل مع الأستاذ لمزيد من
              الدعم.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {weakUnits.map((unit) => {
              const p = unitProgress[unit.slug];
              return (
                <div
                  key={unit.slug}
                  className="flex items-center justify-between p-2 rounded bg-background"
                >
                  <span className="text-sm">{unit.title}</span>
                  <Badge variant="destructive">
                    متوسط: {p.averageScore.toFixed(0)}%
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* نقاط القوة — وحدات ممتازة */}
      {strongUnits.length > 0 && (
        <Card className="border-2 border-green-400 bg-green-50/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-green-700">
              <Award className="w-5 h-5" />
              نقاط القوة ({strongUnits.length})
            </CardTitle>
            <CardDescription>
              الوحدات التي يبدع فيها الطالب — شجّعه على الاستمرار.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {strongUnits.map((unit) => {
              const p = unitProgress[unit.slug];
              return (
                <div
                  key={unit.slug}
                  className="flex items-center justify-between p-2 rounded bg-background"
                >
                  <span className="text-sm">{unit.title}</span>
                  <Badge className="bg-green-600">
                    متوسط: {p.averageScore.toFixed(0)}%
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* تفصيل تقدم الوحدات */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">تفصيل تقدم الوحدات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {curriculum.map((unit) => {
            const p = unitProgress[unit.slug];
            const completion = p?.completion || 0;
            const total = unit.chapters.reduce((a, c) => a + c.exercises.length, 0);
            const done = p?.exercisesDone || 0;
            return (
              <div key={unit.slug} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{unit.title}</span>
                  <span className="text-muted-foreground">
                    {done} / {total} ({completion.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={completion} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* نتائج آخر الاختبارات */}
      {quizAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">نتائج آخر الاختبارات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quizAttempts.slice(0, 5).map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded border-r-2 border-r-primary bg-muted/30"
              >
                <div>
                  <div className="font-semibold text-sm">{q.quizTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(q.attemptedAt).toLocaleDateString("ar-DZ", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-left">
                  <Badge variant={q.score >= 50 ? "default" : "destructive"}>
                    {q.score.toFixed(0)}%
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {q.correctCount} / {q.totalCount} صحيحة
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* رسالة من الأستاذ عدلي أسعد */}
      <Card className="bg-primary/5 border-r-4 border-primary">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary shadow-sm">
                <img
                  src="/teachers/adli-asad.jpg"
                  alt="الأستاذ عدلي أسعد"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <div className="font-bold mb-1 text-primary">رسالة من الأستاذ عدلي أسعد</div>
              <div className="text-xs text-muted-foreground mb-2">المشرف البيداغوجي والمؤسس</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ولي الأمر الكريم، شكراً لمتابعتكم. تعاوننا هو مفتاح نجاح أبنائنا.
                في حالة وجود أي ملاحظة أو قلق، لا تترددوا في الاتصال بي عبر
                المنصة. معاً نبني جيلاً متفوقاً بإذن الله.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
