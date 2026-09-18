'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, Clock, Layers, Sparkles } from 'lucide-react';
import { CourseCard } from '@/components/course-card';
import { courses, getCoursesStats, type Course } from '@/data/courses';
import { premiumCourses } from '@/data/premium-courses';

function CoursesView({ onSelectCourse, onSubscribe, isSubscribed }: { onSelectCourse: (c: Course) => void; onSubscribe?: () => void; isSubscribed?: boolean }) {
  const [filterStream, setFilterStream] = React.useState<"ALL" | Course["stream"]>("ALL");
  const [filterLevel, setFilterLevel] = React.useState<"ALL" | Course["level"]>("ALL");
  const stats = getCoursesStats();

  // ✅ دمج الدورات المميزة (Premium) مع الدورات المجانية
  // الدورات المميزة تظهر أولاً في القائمة
  const allCourses = [...premiumCourses, ...courses];

  const filteredCourses = allCourses.filter((c) => {
    if (filterStream !== "ALL" && c.stream !== filterStream && c.stream !== "ALL") return false;
    if (filterLevel !== "ALL" && c.level !== filterLevel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary mb-3">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          الدورات الشاملة
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          دورات تدريبية متكاملة من إعداد الأستاذ عدلي أسعد، تغطي كل محاور منهاج
          السنة الثالثة ثانوي. كل دورة تحتوي على وحدات (modules) متتالية، مع دروس
          مفصلة، تمارين محلولة، ونقاط أساسية.
        </p>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">دورة شاملة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Layers className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalModules}</div>
            <div className="text-xs text-muted-foreground">وحدة (حلقة)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalExercises}</div>
            <div className="text-xs text-muted-foreground">تمرين محلول</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalDurationHours}</div>
            <div className="text-xs text-muted-foreground">ساعة تدريس</div>
          </CardContent>
        </Card>
      </div>

      {/* المرشحات */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-start">
            <div>
              <div className="text-sm font-bold mb-2">الشعبة:</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={filterStream === "ALL" ? "default" : "outline"} onClick={() => setFilterStream("ALL")}>
                  كل الشعب
                </Button>
                <Button size="sm" variant={filterStream === "EXPERIMENTAL_SCIENCES" ? "default" : "outline"} onClick={() => setFilterStream("EXPERIMENTAL_SCIENCES")}>
                  علوم تجريبية
                </Button>
                <Button size="sm" variant={filterStream === "MATHEMATICS" ? "default" : "outline"} onClick={() => setFilterStream("MATHEMATICS")}>
                  رياضيات
                </Button>
                <Button size="sm" variant={filterStream === "TECHNICAL_MATH" ? "default" : "outline"} onClick={() => setFilterStream("TECHNICAL_MATH")}>
                  تقني رياضي
                </Button>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2">المستوى:</div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={filterLevel === "ALL" ? "default" : "outline"} onClick={() => setFilterLevel("ALL")}>
                  كل المستويات
                </Button>
                <Button size="sm" variant={filterLevel === "BEGINNER" ? "default" : "outline"} onClick={() => setFilterLevel("BEGINNER")}>
                  تأسيسي
                </Button>
                <Button size="sm" variant={filterLevel === "INTERMEDIATE" ? "default" : "outline"} onClick={() => setFilterLevel("INTERMEDIATE")}>
                  متوسط
                </Button>
                <Button size="sm" variant={filterLevel === "ADVANCED" ? "default" : "outline"} onClick={() => setFilterLevel("ADVANCED")}>
                  متقدم
                </Button>
                <Button size="sm" variant={filterLevel === "BAC_EXAM" ? "default" : "outline"} onClick={() => setFilterLevel("BAC_EXAM")}>
                  مستوى البكالوريا
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            عرض <strong className="text-primary">{filteredCourses.length}</strong> من أصل <strong>{stats.total}</strong> دورة
          </div>
        </CardContent>
      </Card>

      {/* رسالة الأستاذ */}
      <Card className="bg-gradient-to-l from-primary/5 to-accent/5 border-r-4 border-primary">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <img
              src="/teachers/adli-asad.jpg"
              alt="الأستاذ عدلي أسعد"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary flex-shrink-0"
            />
            <div>
              <div className="font-bold text-primary mb-1">رسالة من الأستاذ عدلي أسعد</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                أحبائي الطلاب، صممت هذه الدورات لتكون رفيقتكم في رحلة التفوق. كل دورة
                تأخذكم من حيث أنتم، وترفعكم إلى مستوى البكالوريا. ابدؤوا بالأساسيات،
                ثم انتقلوا للدورات المتقدمة. وأنا معكم في كل خطوة!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الدورات */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد دورات مطابقة للمرشحات المختارة.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={onSelectCourse} isSubscribed={isSubscribed} onSubscribe={onSubscribe} />
          ))}
        </div>
      )}

      {/* دعوة للسلاسل */}
      <Card className="bg-accent/10 border-r-4 border-accent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">هل لديك سلاسل تريد إضافتها؟</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                إذا كان لديك سلاسل تمارين، ملخصات، أو محاضرات، شاركها معنا وسنحوّلها
                إلى دورات شاملة تُضاف للمنصة. هدفنا إثراء المحتوى التعليمي معاً!
              </p>
              <p className="text-sm font-bold text-accent-foreground">
                📩 تواصل مع الأستاذ عدلي أسعد لإضافة سلاسلك.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===================================================
//  عرض المواضيع الشاملة (ComprehensiveTopicsView)
//  يعرض كل البكالوريات الشاملة: الجزائرية + الأجنبية
// ===================================================


export default CoursesView;
