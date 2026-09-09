"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MarkdownMath } from "@/components/math-renderer";
import { FunctionPlot } from "@/components/function-plot";
import {
  Clock,
  Award,
  BookOpen,
  ChevronLeft,
  Lightbulb,
  CheckCircle2,
  PlayCircle,
  Calendar,
  Lock,
  ShieldCheck,
} from "lucide-react";
import type { Course, CourseModule } from "@/data/courses";
import {
  courseStreamLabels,
  courseLevelLabels,
  courseLevelColors,
} from "@/data/courses";

// خريطة الأيقونات (يجب أن تتطابق مع الأسماء في courses.ts)
import {
  Sprout,
  LineChart,
  Target,
  Box,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout,
  LineChart,
  Target,
  Box,
};

interface CourseCardProps {
  course: Course;
  onOpen: (course: Course) => void;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
}

export function CourseCard({ course, onOpen, isSubscribed = true, onSubscribe }: CourseCardProps) {
  const Icon = iconMap[course.icon] || BookOpen;
  const isLocked = course.isPremium && !isSubscribed;

  const handleClick = () => {
    if (isLocked && onSubscribe) {
      onSubscribe();
      return;
    }
    onOpen(course);
  };

  return (
    <Card
      className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group ${isLocked ? "opacity-80" : ""}`}
      onClick={handleClick}
    >
      <div
        className="h-32 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${course.coverColor}, ${course.coverColor}dd)` }}
      >
        <Icon className="w-16 h-16 text-white opacity-90" />
        <Badge className="absolute top-3 right-3 bg-white/90 text-foreground">
          <Calendar className="w-3 h-3 ml-1" />
          {course.createdAt}
        </Badge>
        <Badge
          className={`absolute top-3 left-3 ${courseLevelColors[course.level]} border`}
        >
          {courseLevelLabels[course.level]}
        </Badge>
        {course.isPremium && (
          <Badge className="absolute bottom-3 left-3 bg-amber-500 text-white">
            <ShieldCheck className="w-3 h-3 ml-1" />
            مدفوعة
          </Badge>
        )}
      </div>

      <CardContent className="pt-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
            {isLocked && <Lock className="w-4 h-4 text-amber-600" />}
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground italic">{course.subtitle}</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">
            <BookOpen className="w-3 h-3 ml-1" />
            {course.modulesCount} وحدات
          </Badge>
          <Badge variant="outline">
            <Clock className="w-3 h-3 ml-1" />
            {Math.round(course.totalDurationMin / 60)} ساعة
          </Badge>
          <Badge variant="secondary">
            {courseStreamLabels[course.stream]}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {course.tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {isLocked ? (
          <Button variant="outline" className="w-full mt-2 gap-2 border-amber-500 text-amber-700" onClick={(e) => { e.stopPropagation(); onSubscribe?.(); }}>
            <Lock className="w-4 h-4" />
            اشترك لفتح الدورة
          </Button>
        ) : (
          <Button className="w-full mt-2 gap-2" onClick={(e) => { e.stopPropagation(); onOpen(course); }}>
            <PlayCircle className="w-4 h-4" />
            {course.isPremium ? "ابدأ الدورة المميزة" : "ابدأ الدورة"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export function CourseDetail({ course, onBack }: CourseDetailProps) {
  const Icon = iconMap[course.icon] || BookOpen;

  return (
    <div className="space-y-6">
      {/* زر العودة */}
      <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
        <ChevronLeft className="w-4 h-4 rotate-180" />
        عودة لكل الدورات
      </Button>

      {/* رأس الدورة */}
      <Card
        className="overflow-hidden border-2"
        style={{ borderColor: course.coverColor }}
      >
        <div
          className="h-32 flex items-center justify-center relative"
          style={{ background: `linear-gradient(135deg, ${course.coverColor}, ${course.coverColor}cc)` }}
        >
          <Icon className="w-20 h-20 text-white" />
        </div>
        <CardContent className="pt-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: course.coverColor }}>
              {course.title}
            </h1>
            <p className="text-muted-foreground italic text-lg">{course.subtitle}</p>
          </div>

          <p className="leading-relaxed text-base">{course.description}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Badge
              className={courseLevelColors[course.level]}
              variant="outline"
            >
              <Award className="w-3 h-3 ml-1" />
              {courseLevelLabels[course.level]}
            </Badge>
            <Badge variant="secondary">
              {courseStreamLabels[course.stream]}
            </Badge>
            <Badge variant="outline">
              <BookOpen className="w-3 h-3 ml-1" />
              {course.modulesCount} وحدة
            </Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 ml-1" />
              {Math.round(course.totalDurationMin / 60)} ساعة ({course.totalDurationMin} دقيقة)
            </Badge>
            <Badge variant="outline">
              <Calendar className="w-3 h-3 ml-1" />
              نُشرت في {course.createdAt}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {course.tags.map((tag, i) => (
              <Badge key={i} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* قائمة الوحدات */}
      <div>
        <h2 className="text-2xl font-bold mb-4 academic-divider">
          وحدات الدورة ({course.modules.length})
        </h2>
        <Accordion type="multiple" className="space-y-3">
          {course.modules.map((module) => (
            <CourseModuleView key={module.id} module={module} course={course} />
          ))}
        </Accordion>
      </div>

      {/* خاتمة الدورة */}
      <Card className="bg-gradient-to-l from-primary/10 to-accent/10 border-r-4 border-primary">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <img
              src="/teachers/adli-asad.jpg"
              alt="الأستاذ عدلي أسعد"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary flex-shrink-0"
            />
            <div>
              <div className="font-bold text-primary mb-1">رسالة ختامية من الأستاذ عدلي أسعد</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                أحسنت بإتمام هذه الدورة! تذكر دائماً: التعلم رحلة، وليس وجهة.
                استعمل ما تعلمته في حل التمارين والمواضيع. والرياضيات مهارة، تحتاج
                الممارسة المستمرة. أنا فخور بك، وأراك في القمة بإذن الله!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseModuleView({ module, course }: { module: CourseModule; course: Course }) {
  return (
    <AccordionItem
      value={module.id}
      className="border rounded-lg overflow-hidden"
      style={{ borderRightColor: course.coverColor, borderRightWidth: "4px" }}
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline bg-muted/30">
        <div className="flex items-center gap-3 text-right flex-1">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ background: course.coverColor }}
          >
            {module.order}
          </div>
          <div className="flex-1">
            <div className="font-bold text-base">{module.title}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {module.durationMin} دقيقة
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {module.exercises.length} تمارين
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-4">
        {/* وصف الوحدة */}
        <div className="bg-muted/40 rounded-md p-3 text-sm italic border-r-2 border-primary/30">
          {module.description}
        </div>

        {/* محتوى الدرس */}
        <div>
          <h4 className="font-bold mb-2 text-primary flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            الدرس
          </h4>
          <div className="bg-card border border-border rounded-lg p-4">
            <MarkdownMath content={module.content} />
          </div>
        </div>

        {/* النقاط الأساسية */}
        {module.keyPoints.length > 0 && (
          <div>
            <h4 className="font-bold mb-2 text-accent-foreground flex items-center gap-2">
              <Award className="w-4 h-4" />
              النقاط الأساسية
            </h4>
            <ul className="space-y-1 pr-6 list-disc">
              {module.keyPoints.map((kp, i) => (
                <li key={i} className="text-sm">{kp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* التمارين */}
        {module.exercises.length > 0 && (
          <div>
            <h4 className="font-bold mb-2 text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              تمارين محلولة ({module.exercises.length})
            </h4>
            <div className="space-y-3">
              {module.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="border border-border rounded-lg p-3 bg-card"
                >
                  <div className="bg-muted/40 rounded-md p-3 mb-3 border-r-2 border-accent">
                    <div className="font-bold mb-1 text-sm text-accent-foreground">
                      تمرين {i + 1}
                    </div>
                    <MarkdownMath content={ex.statement} />
                  </div>
                  {ex.hint && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border-r-2 border-amber-400 rounded-md p-2 text-sm mb-2">
                      <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        تلميح:
                      </span>
                      <MarkdownMath content={ex.hint} />
                    </div>
                  )}
                  <div className="bg-green-50 dark:bg-green-950/20 border-r-2 border-green-500 rounded-md p-3">
                    <div className="font-bold mb-1 text-sm text-green-800 dark:text-green-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      الحل:
                    </div>
                    <MarkdownMath content={ex.solution} />
                    {ex.plot && (
                      <div className="mt-4 pt-3 border-t border-green-300 dark:border-green-700">
                        <div className="text-sm font-bold text-green-900 dark:text-green-200 mb-2">📈 الرسم البياني للمنحنى</div>
                        <FunctionPlot functions={ex.plot.functions} xRange={ex.plot.xRange} yRange={ex.plot.yRange} points={ex.plot.points} sequence={ex.plot.sequence} title={ex.plot.title} height={ex.plot.height ?? 320} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
