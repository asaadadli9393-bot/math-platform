"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useOverallStats, useStudentStore } from "@/lib/student-store";
import { curriculum } from "@/data/curriculum";
import { difficultyLabels } from "@/lib/curriculum-types";
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  RotateCcw,
  Star,
  Award,
} from "lucide-react";

const streamLabels: Record<string, string> = {
  ALL: "كل الشعب",
  EXPERIMENTAL_SCIENCES: "علوم تجريبية",
  MATHEMATICS: "رياضيات",
  TECHNICAL_MATH: "تقني رياضي",
};

export function StudentDashboard() {
  const stats = useOverallStats();
  const attempts = useStudentStore((s) => s.attempts);
  const quizAttempts = useStudentStore((s) => s.quizAttempts);
  const unitProgress = useStudentStore((s) => s.unitProgress);
  const profile = useStudentStore((s) => s.profile);
  const resetProgress = useStudentStore((s) => s.resetProgress);
  const favoriteUnits = useStudentStore((s) => s.favoriteUnits);

  // إحصائيات إضافية
  const totalExercisesAvailable = React.useMemo(() => {
    return curriculum.reduce(
      (acc, unit) => acc + unit.chapters.reduce((a, c) => a + c.exercises.length, 0),
      0
    );
  }, []);

  const completedExercises = stats.successful;
  const overallProgress =
    totalExercisesAvailable > 0
      ? (completedExercises / totalExercisesAvailable) * 100
      : 0;

  // آخر النشاطات (آخر 5 محاولات)
  const recentActivity = attempts.slice(0, 5);

  // توزيع حسب الصعوبة
  const difficultyStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    attempts.forEach((a) => {
      if (a.selfRated) {
        stats[a.difficulty] = (stats[a.difficulty] || 0) + 1;
      }
    });
    return stats;
  }, [attempts]);

  // الأنشطة الأسبوعية (للرسم البياني البسيط)
  const weeklyActivity = React.useMemo(() => {
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const result: { day: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      const dayCount = attempts.filter((a) => {
        const attemptDate = new Date(a.attemptedAt);
        return (
          attemptDate.getFullYear() === date.getFullYear() &&
          attemptDate.getMonth() === date.getMonth() &&
          attemptDate.getDate() === date.getDate()
        );
      }).length;
      result.push({ day: dayName, count: dayCount });
    }
    return result;
  }, [attempts]);

  const maxWeekly = Math.max(...weeklyActivity.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* الترحيب */}
      <Card className="bg-gradient-to-l from-primary/10 via-accent/5 to-transparent border-r-4 border-primary">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                مرحباً {profile?.name || "أيها الطالب"} 👋
              </h2>
              <p className="text-muted-foreground">
                {profile?.stream ? streamLabels[profile.stream] : "اختر شعبتك أولاً"} —
                {profile?.grade || "السنة الثالثة ثانوي"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetProgress}>
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* البطاقات الإحصائية الرئيسية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          title="إجمالي المحاولات"
          value={stats.totalAttempts}
          color="text-amber-600 bg-amber-100"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          title="نسبة النجاح"
          value={`${stats.successRate.toFixed(0)}%`}
          color="text-green-600 bg-green-100"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          title="متوسط الاختبارات"
          value={`${stats.avgQuizScore.toFixed(0)}%`}
          color="text-primary bg-primary/10"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="وحدات مبدوءة"
          value={stats.unitsStarted}
          color="text-blue-600 bg-blue-100"
        />
      </div>

      {/* التقدم العام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            التقدم العام في المنهاج
          </CardTitle>
          <CardDescription>
            {completedExercises} من أصل {totalExercisesAvailable} تمرين منجزة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={overallProgress} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{overallProgress.toFixed(1)}% مكتمل</span>
              <span>
                {totalExercisesAvailable - completedExercises} تمرين متبقية
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="units" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="units">تقدم الوحدات</TabsTrigger>
          <TabsTrigger value="activity">النشاط الأخير</TabsTrigger>
          <TabsTrigger value="weekly">النشاط الأسبوعي</TabsTrigger>
        </TabsList>

        {/* تقدم الوحدات */}
        <TabsContent value="units" className="space-y-3 mt-4">
          {curriculum.map((unit) => {
            const progress = unitProgress[unit.slug];
            const completion = progress?.completion || 0;
            const exercisesDone = progress?.exercisesDone || 0;
            const totalExercises = unit.chapters.reduce(
              (a, c) => a + c.exercises.length,
              0
            );
            const isFavorite = favoriteUnits.includes(unit.slug);
            return (
              <Card key={unit.slug} className="overflow-hidden">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isFavorite && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                      <h3 className="font-bold">{unit.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {streamLabels[unit.stream]}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {completion.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={completion} className="h-2 mb-2" />
                  <div className="text-xs text-muted-foreground">
                    {exercisesDone} / {totalExercises} تمرين منجز
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* النشاط الأخير */}
        <TabsContent value="activity" className="space-y-2 mt-4">
          {recentActivity.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>لا يوجد نشاط بعد. ابدأ بأول تمرين!</p>
              </CardContent>
            </Card>
          ) : (
            recentActivity.map((a, idx) => (
              <Card key={idx} className="border-r-2 border-r-primary">
                <CardContent className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {a.selfRated ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                    <div>
                      <div className="font-semibold text-sm">{a.exerciseTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {difficultyLabels[a.difficulty as keyof typeof difficultyLabels] || a.difficulty}
                        {" • "}
                        {new Date(a.attemptedAt).toLocaleDateString("ar-DZ", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <Badge variant={a.selfRated ? "default" : "secondary"}>
                    {a.selfRated ? "نجاح" : "محاولة"}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* النشاط الأسبوعي */}
        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">النشاط خلال آخر 7 أيام</CardTitle>
              <CardDescription>عدد التمارين المنجزة كل يوم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-32">
                {weeklyActivity.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex-1 flex items-end">
                      <div
                        className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                        style={{
                          height: `${(d.count / maxWeekly) * 100}%`,
                          minHeight: d.count > 0 ? "8px" : "2px",
                        }}
                        title={`${d.count} تمرين`}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{d.day}</div>
                    <div className="text-xs font-bold">{d.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* توزيع الصعوبة */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">توزيع النجاحات حسب الصعوبة</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(difficultyStats).length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  لا توجد بيانات بعد
                </p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(difficultyStats).map(([diff, count]) => (
                    <div
                      key={diff}
                      className="flex items-center justify-between p-2 rounded bg-muted/40"
                    >
                      <span className="text-sm">
                        {difficultyLabels[diff as keyof typeof difficultyLabels] || diff}
                      </span>
                      <Badge>{count} تمرين</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className={`inline-flex p-2 rounded-lg ${color} mb-2`}>{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );
}
