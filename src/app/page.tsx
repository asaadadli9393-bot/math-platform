"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { MarkdownMath } from "@/components/math-renderer";
import { ExerciseCard } from "@/components/exercise-card";
import { InteractiveQuiz } from "@/components/interactive-quiz";
import { StudentDashboard } from "@/components/student-dashboard";
import { ParentPortal } from "@/components/parent-portal";
import { curriculum, getCurriculumStats } from "@/data/curriculum";
import { quizzes } from "@/data/quizzes";
import { bacExams, getBacExamsStats, streamLabelsBac, type BacStream } from "@/data/bac-exams";
import { BacExamCard } from "@/components/bac-exam-card";
import { courses, getCoursesStats, courseStreamLabels, courseLevelLabels, type Course } from "@/data/courses";
import { CourseCard, CourseDetail } from "@/components/course-card";
import {
  difficultyLabels,
  difficultyColors,
  streamLabels,
  type ExerciseDifficulty,
} from "@/lib/curriculum-types";
import { useStudentStore } from "@/lib/student-store";
import {
  GraduationCap,
  BookOpen,
  Calculator,
  Sigma,
  CircleDot,
  Dices,
  Box,
  Divide,
  LineChart,
  TrendingUp,
  User,
  LayoutDashboard,
  Users,
  Menu,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Heart,
  Phone,
  Mail,
  MapPin,
  Quote,
  Eye,
  FileText,
  Trophy,
  Clock,
  Calendar,
  PlayCircle,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// خريطة الأيقونات
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Sigma,
  CircleDot,
  Dices,
  Box,
  Divide,
  LineChart,
  Calculator,
};

type MainView = "home" | "curriculum" | "unit" | "quiz" | "exams" | "courses" | "course-detail" | "dashboard" | "parent" | "about";

export default function HomePage() {
  const [view, setView] = React.useState<MainView>("home");
  const [selectedUnitSlug, setSelectedUnitSlug] = React.useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = React.useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const stats = getCurriculumStats();
  const profile = useStudentStore((s) => s.profile);
  const updateProfile = useStudentStore((s) => s.updateProfile);
  const setUnitProgress = useStudentStore((s) => s.setUnitProgress);
  const lastVisitedUnit = useStudentStore((s) => s.lastVisitedUnit);
  const setLastVisitedUnit = useStudentStore((s) => s.setLastVisitedUnit);
  const { toast } = useToast();

  // التهيئة (Onboarding) عند أول زيارة
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  React.useEffect(() => {
    if (!profile?.onboarded) {
      setOnboardingOpen(true);
    }
  }, [profile]);

  const navigateTo = (target: MainView, unitSlug?: string, quizId?: string) => {
    setView(target);
    if (unitSlug) {
      setSelectedUnitSlug(unitSlug);
      setLastVisitedUnit(unitSlug);
      setUnitProgress(unitSlug, {});
    }
    if (quizId) {
      setSelectedQuizId(quizId);
    }
    setSheetOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedUnit = curriculum.find((u) => u.slug === selectedUnitSlug);
  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);

  return (
    <div className="min-h-screen flex flex-col bg-background pattern-bg" dir="rtl">
      {/* =================================================== */}
      {/*  الرأس (Header) — ثابت في الأعلى                       */}
      {/* =================================================== */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* الشعار */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Sigma className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">منصة الرياضيات</div>
                <div className="text-xs text-muted-foreground leading-tight flex items-center gap-1">
                  <img
                    src="/teachers/adli-asad.jpg"
                    alt="الأستاذ عدلي أسعد"
                    className="w-4 h-4 rounded-full object-cover border border-primary/30"
                  />
                  الأستاذ عدلي أسعد
                </div>
              </div>
            </div>

            {/* القائمة الرئيسية — على الشاشات الكبيرة */}
            <nav className="hidden md:flex items-center gap-2">
              <NavButton active={view === "home"} onClick={() => navigateTo("home")}>
                <BookOpen className="w-4 h-4 ml-2" />
                الرئيسية
              </NavButton>
              <NavButton active={view === "curriculum"} onClick={() => navigateTo("curriculum")}>
                <Calculator className="w-4 h-4 ml-2" />
                المنهاج
              </NavButton>
              <NavButton active={view === "exams"} onClick={() => navigateTo("exams")}>
                <Trophy className="w-4 h-4 ml-2" />
                المواضيع الشاملة
              </NavButton>
              <NavButton active={view === "courses"} onClick={() => navigateTo("courses")}>
                <PlayCircle className="w-4 h-4 ml-2" />
                الدورات
              </NavButton>
              <NavButton active={view === "dashboard"} onClick={() => navigateTo("dashboard")}>
                <LayoutDashboard className="w-4 h-4 ml-2" />
                لوحتي
              </NavButton>
              <NavButton active={view === "parent"} onClick={() => navigateTo("parent")}>
                <Users className="w-4 h-4 ml-2" />
                فضاء ولي الأمر
              </NavButton>
              <NavButton active={view === "about"} onClick={() => navigateTo("about")}>
                <Sparkles className="w-4 h-4 ml-2" />
                عن المنصة
              </NavButton>
            </nav>

            {/* زر القائمة على الجوال */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-right">القائمة</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  <MobileNavButton onClick={() => navigateTo("home")}>
                    <BookOpen className="w-4 h-4 ml-2" /> الرئيسية
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("curriculum")}>
                    <Calculator className="w-4 h-4 ml-2" /> المنهاج
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("exams")}>
                    <Trophy className="w-4 h-4 ml-2" /> المواضيع الشاملة
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("courses")}>
                    <PlayCircle className="w-4 h-4 ml-2" /> الدورات
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("dashboard")}>
                    <LayoutDashboard className="w-4 h-4 ml-2" /> لوحة التحكم
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("parent")}>
                    <Users className="w-4 h-4 ml-2" /> فضاء ولي الأمر
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("about")}>
                    <Sparkles className="w-4 h-4 ml-2" /> عن المنصة
                  </MobileNavButton>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* =================================================== */}
      {/*  المحتوى الرئيسي                                     */}
      {/* =================================================== */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {view === "home" && <HomeView onNavigate={navigateTo} />}

        {view === "curriculum" && (
          <CurriculumView
            onSelectUnit={(slug) => navigateTo("unit", slug)}
          />
        )}

        {view === "unit" && selectedUnit && (
          <UnitView unit={selectedUnit} onBack={() => navigateTo("curriculum")} />
        )}

        {view === "quiz" && selectedQuiz && (
          <QuizSelectionView onSelectQuiz={(id) => navigateTo("quiz", undefined, id)} />
        )}

        {view === "exams" && <ExamsView />}

        {view === "courses" && (
          <CoursesView onSelectCourse={(c) => {
            setSelectedCourse(c);
            setView("course-detail");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        )}

        {view === "course-detail" && selectedCourse && (
          <CourseDetail
            course={selectedCourse}
            onBack={() => navigateTo("courses")}
          />
        )}

        {view === "dashboard" && <StudentDashboard />}

        {view === "parent" && <ParentPortal />}

        {view === "about" && <AboutView />}
      </main>

      {/* =================================================== */}
      {/*  التذييل (Footer)                                    */}
      {/* =================================================== */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sigma className="w-6 h-6" />
                <span className="font-bold">منصة الرياضيات</span>
              </div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                منصة تعليمية تفاعلية لطلبة السنة الثالثة ثانوي (الشعب العلمية)
                في الجزائر، متوافقة كلياً مع المنهاج الرسمي لوزارة التربية الوطنية.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3 academic-divider">المحتوى</h4>
              <ul className="space-y-1 text-sm text-primary-foreground/80">
                {curriculum.map((unit) => (
                  <li key={unit.slug}>
                    <button
                      onClick={() => navigateTo("unit", unit.slug)}
                      className="hover:text-accent transition-colors"
                    >
                      {unit.title}
                    </button>
                  </li>
                ))}
                <li className="pt-2 border-t border-primary-foreground/20 mt-2">
                  <button
                    onClick={() => navigateTo("courses")}
                    className="hover:text-accent transition-colors flex items-center gap-1 font-semibold"
                  >
                    <PlayCircle className="w-3 h-3" />
                    الدورات الشاملة
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("exams")}
                    className="hover:text-accent transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Trophy className="w-3 h-3" />
                    مواضيع البكالوريا
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 academic-divider">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li className="flex items-center gap-2">
                  <img
                    src="/teachers/adli-asad.jpg"
                    alt="الأستاذ عدلي أسعد"
                    className="w-6 h-6 rounded-full object-cover border border-primary-foreground/30"
                  />
                  الأستاذ عدلي أسعد — المشرف البيداغوجي
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@adli-math.dz
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +213 0 00 00 00 00
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  الجزائر — الجمهورية الجزائرية الديمقراطية الشعبية
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-6 bg-primary-foreground/20" />

          <div className="text-center text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} منصة الرياضيات — الأستاذ عدلي أسعد. جميع الحقوق محفوظة.
            <div className="mt-2">
              صُممت بكل حب لطلبة البكالوريا في الجزائر 🇩🇿
            </div>
          </div>
        </div>
      </footer>

      {/* حوار التهيئة */}
      <OnboardingDialog
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onComplete={(p) => {
          updateProfile({ ...p, onboarded: true });
          setOnboardingOpen(false);
          toast({
            title: "أهلاً وسهلاً! 🎉",
            description: `تم تسجيلك بنجاح. ابدأ رحلتك نحو البكالوريا!`,
          });
        }}
      />
    </div>
  );
}

// ===================================================
//  مكوّن المساعدة (Sub-components)
// ===================================================

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className="gap-1"
    >
      {children}
    </Button>
  );
}

function MobileNavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className="justify-start w-full text-right"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

// ===================================================
//  الصفحة الرئيسية
// ===================================================

function HomeView({ onNavigate }: { onNavigate: (v: MainView, s?: string) => void }) {
  const stats = getCurriculumStats();
  return (
    <div className="space-y-8">
      {/* قسم البطل (Hero) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary via-primary/95 to-accent/30 text-primary-foreground p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 text-9xl font-bold">∑</div>
          <div className="absolute bottom-0 right-1/4 text-9xl font-bold">∫</div>
          <div className="absolute top-1/2 right-1/3 text-7xl font-bold">π</div>
          <div className="absolute top-1/4 left-1/3 text-8xl font-bold">∞</div>
        </div>
        <div className="relative z-10 max-w-3xl">
          <Badge className="bg-accent text-accent-foreground mb-4 text-sm py-1 px-3">
            <Sparkles className="w-3 h-3 ml-1" />
            المنصة الرسمية المعتمدة
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            من الصفر إلى البكالوريا
            <br />
            <span className="text-accent">رياضيات السنة الثالثة ثانوي</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-6 leading-relaxed">
            منصة تفاعلية شاملة لطلبة الشعب العلمية في الجزائر — علوم تجريبية،
            رياضيات، وتقني رياضي. متوافقة كلياً مع المنهاج الرسمي لوزارة التربية
            الوطنية، بإشراف بيداغوجي مباشر من الأستاذ عدلي أسعد.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate("curriculum")}
              className="gap-2"
            >
              <BookOpen className="w-5 h-5" />
              ابدأ التعلّم الآن
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("exams")}
              className="bg-accent text-accent-foreground border-accent hover:bg-accent/90 gap-2"
            >
              <Trophy className="w-5 h-5" />
              مواضيع البكالوريا السابقة
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("quiz")}
              className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              <Calculator className="w-5 h-5" />
              اختبار تحديد المستوى
            </Button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-primary-foreground/20">
            <div>
              <div className="text-3xl font-bold text-accent">{stats.units}</div>
              <div className="text-sm text-primary-foreground/80">وحدات تعليمية</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">{stats.chapters}</div>
              <div className="text-sm text-primary-foreground/80">فصول دراسية</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">{stats.lessons}</div>
              <div className="text-sm text-primary-foreground/80">درساً مفصلاً</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">{stats.exercises}+</div>
              <div className="text-sm text-primary-foreground/80">تمرين وحل نموذجي</div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم مميزات المنصة */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-2 academic-divider mx-auto">
          لماذا منصتنا؟
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          تجربة تعلم متكاملة، من المكتسبات القبلية إلى مستوى البكالوريا المتقدم،
          مع متابعة شخصية وآلية.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title="منهجية من الصفر"
            description="نبدأ من المكتسبات القبلية، نرتفع تدريجياً إلى مستويات البكالوريا المتقدمة. لا طالب يُترك خلف الركب."
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="حلول نموذجية مفصلة"
            description="كل تمرين مصحوب بحل خطوة بخطوة بمنهجية رسمية مبرزة، مع إمكانية إظهار التلميح قبل الحل."
          />
          <FeatureCard
            icon={<Calculator className="w-6 h-6" />}
            title="رياضيات LaTeX احترافية"
            description="عرض رياضيات عالي الجودة باستعمال KaTeX — صياغة أنيقة وواضحة لكل التعبيرات والمعادلات."
          />
          <FeatureCard
            icon={<LayoutDashboard className="w-6 h-6" />}
            title="لوحة تتبع التقدم"
            description="إحصائيات دقيقة، رسوم بيانية أسبوعية، نسب نجاح، توزيع حسب الصعوبة — كل شيء في مكان واحد."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="فضاء أولياء الأمور"
            description="متابعة شفافة لتقدم الأبناء: نقاط القوة، نقاط الضعف، النتائج، مع تواصل مباشر مع الأستاذ."
          />
          <FeatureCard
            icon={<Heart className="w-6 h-6" />}
            title="إشراف الأستاذ عدلي أسعد"
            description="منصة تحت إشراف بيداغوجي مباشر، بمحتوى مراجَع بدقة ومتابعة شخصية لكل طالب."
          />
        </div>
      </section>

      {/* قسم الوحدات — معاينة */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold academic-divider">الوحدات التعليمية</h2>
          <Button variant="outline" onClick={() => onNavigate("curriculum")}>
            عرض الكل
            <ChevronLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {curriculum.map((unit) => {
            const Icon = iconMap[unit.icon] || Calculator;
            return (
              <Card
                key={unit.slug}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
                onClick={() => onNavigate("unit", unit.slug)}
              >
                <CardContent className="pt-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-primary-foreground"
                    style={{ background: unit.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      وحدة {unit.order}
                    </Badge>
                    <Badge variant="ghost" className="text-xs">
                      {streamLabels[unit.stream]}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {unit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {unit.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
                    <span>{unit.chapters.length} فصول</span>
                    <span>
                      {unit.chapters.reduce((a, c) => a + c.exercises.length, 0)} تمارين
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* قسم الكلمة التشجيعية من الأستاذ */}
      <section>
        <Card className="bg-gradient-to-l from-accent/10 to-transparent border-r-4 border-accent">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-accent shadow-md">
                  <img
                    src="/teachers/adli-asad.jpg"
                    alt="الأستاذ عدلي أسعد"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <Quote className="w-6 h-6 text-accent mb-2" />
                <p className="text-lg leading-relaxed mb-3 italic">
                  &ldquo;الرياضيات ليست عقبة أمام النجاح، بل هي طريقه. كل تمرين تحلّه
                  يفتح باباً جديداً من أبواب الفهم. ابدأ من حيث أنت، وتقدّم خطوة
                  خطوة — حتى تبلغ القمة بإذن الله.&rdquo;
                </p>
                <div className="text-sm font-bold text-accent-foreground">
                  — الأستاذ عدلي أسعد
                </div>
                <div className="text-xs text-muted-foreground">
                  المشرف البيداغوجي والمؤسس للمنصة
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* قسم الشعب المدعومة */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              الشعب العلمية المدعومة
            </CardTitle>
            <CardDescription>
              المنهاج الرسمي لوزارة التربية الوطنية — الجزائر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <StreamCard
                name="علوم تجريبية"
                description="منهاج متكامل يشمل كل الوحدات السبع، مع تركيز على التطبيقات العلمية."
                color="bg-green-100 text-green-800 border-green-300"
              />
              <StreamCard
                name="رياضيات"
                description="منهاج متعمق يشمل الأعداد المركبة والحساب المتقدم — للمتفوقين رياضياً."
                color="bg-blue-100 text-blue-800 border-blue-300"
              />
              <StreamCard
                name="تقني رياضي"
                description="منهاج مرن يدمج الرياضيات النظرية مع التطبيقات التقنية والهندسية."
                color="bg-amber-100 text-amber-800 border-amber-300"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* دعوة لاتخاذ إجراء */}
      <section className="text-center py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 academic-divider mx-auto">
          جاهز لبدء رحلتك؟
        </h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          آلاف الطلاب بدؤوا من الصفر وبلغوا التفوق في البكالوريا. أنت التالي بإذن الله.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" onClick={() => onNavigate("curriculum")}>
            <BookOpen className="w-5 h-5 ml-2" />
            ابدأ التعلّم
          </Button>
          <Button
            size="lg"
            variant="default"
            onClick={() => onNavigate("courses")}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <PlayCircle className="w-5 h-5" />
            استكشف الدورات
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate("dashboard")}>
            <LayoutDashboard className="w-5 h-5 ml-2" />
            لوحة التحكم
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
      <CardContent className="pt-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">
          {icon}
        </div>
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StreamCard({
  name,
  description,
  color,
}: {
  name: string;
  description: string;
  color: string;
}) {
  return (
    <div className={`p-4 rounded-lg border-2 ${color}`}>
      <h3 className="font-bold mb-2">{name}</h3>
      <p className="text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ===================================================
//  عرض المنهاج الكامل
// ===================================================

function CurriculumView({ onSelectUnit }: { onSelectUnit: (slug: string) => void }) {
  const [filter, setFilter] = React.useState<"ALL" | "MATHEMATICS" | "EXPERIMENTAL_SCIENCES" | "TECHNICAL_MATH">("ALL");
  const favoriteUnits = useStudentStore((s) => s.favoriteUnits);
  const toggleFavorite = useStudentStore((s) => s.toggleFavorite);

  const filteredUnits = curriculum.filter(
    (u) => filter === "ALL" || u.stream === filter || u.stream === "ALL"
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          شجرة المحتوى المعرفي
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          المنهاج الرسمي كاملاً لطلبة السنة الثالثة ثانوي — الشعب العلمية في الجزائر.
          كل وحدة تتضمن دروساً نظرية، تمارين متدرجة، وحلولاً نموذجية مفصلة.
        </p>
      </div>

      {/* مرشحات الشعب */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={filter === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("ALL")}
        >
          كل الوحدات
        </Button>
        <Button
          variant={filter === "EXPERIMENTAL_SCIENCES" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("EXPERIMENTAL_SCIENCES")}
        >
          علوم تجريبية
        </Button>
        <Button
          variant={filter === "MATHEMATICS" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("MATHEMATICS")}
        >
          رياضيات
        </Button>
        <Button
          variant={filter === "TECHNICAL_MATH" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("TECHNICAL_MATH")}
        >
          تقني رياضي
        </Button>
      </div>

      {/* قائمة الوحدات */}
      <div className="space-y-4">
        {filteredUnits.map((unit, idx) => {
          const Icon = iconMap[unit.icon] || Calculator;
          const isFavorite = favoriteUnits.includes(unit.slug);
          const totalExercises = unit.chapters.reduce(
            (a, c) => a + c.exercises.length,
            0
          );
          return (
            <Card
              key={unit.slug}
              className="overflow-hidden hover:shadow-md transition-all"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* الأيقونة */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-primary-foreground flex-shrink-0"
                    style={{ background: unit.color }}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* المعلومات */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline">وحدة {unit.order}</Badge>
                      <Badge variant="ghost">{streamLabels[unit.stream]}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{unit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {unit.description}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {unit.chapters.length} فصول
                      </span>
                      <span className="flex items-center gap-1">
                        <Calculator className="w-3 h-3" />
                        {totalExercises} تمارين
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {unit.chapters.reduce((a, c) => a + c.lessons.length, 0)} دروس
                      </span>
                    </div>
                  </div>

                  {/* الإجراءات */}
                  <div className="flex md:flex-col gap-2 items-center">
                    <Button onClick={() => onSelectUnit(unit.slug)}>
                      دخول الوحدة
                      <ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(unit.slug)}
                      title="إضافة للمفضلة"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFavorite ? "fill-amber-500 text-amber-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================
//  عرض وحدة معينة (فصول + تمارين)
// ===================================================

function UnitView({ unit, onBack }: { unit: any; onBack: () => void }) {
  const Icon = iconMap[unit.icon] || Calculator;

  return (
    <div className="space-y-6">
      {/* رأس الوحدة */}
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 gap-2">
          <ChevronRight className="w-4 h-4" />
          عودة للمنهاج
        </Button>

        <Card
          className="overflow-hidden"
          style={{
            background: `linear-gradient(to left, ${unit.color}10, transparent)`,
          }}
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-primary-foreground flex-shrink-0"
                style={{ background: unit.color }}
              >
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline">وحدة {unit.order}</Badge>
                  <Badge variant="ghost">{streamLabels[unit.stream]}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{unit.title}</h1>
                <p className="text-muted-foreground leading-relaxed">
                  {unit.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الفصول مع المحتوى */}
      <Accordion type="multiple" defaultValue={[unit.chapters[0]?.slug]} className="space-y-3">
        {unit.chapters.map((chapter: any) => (
          <AccordionItem
            key={chapter.slug}
            value={chapter.slug}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-muted/30">
              <div className="flex items-center gap-3 text-right flex-1">
                <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <div className="font-bold">{chapter.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {chapter.lessons.length} دروس • {chapter.exercises.length} تمارين
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-6">
              {/* المكتسبات القبلية */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border-r-4 border-blue-500 p-3 rounded">
                <div className="font-bold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  مراجعة المكتسبات القبلية
                </div>
                <p className="text-sm">{chapter.prerequisites}</p>
              </div>

              {/* الدروس */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg academic-divider">الدروس</h3>
                {chapter.lessons.map((lesson: any) => (
                  <Card key={lesson.slug}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{lesson.title}</CardTitle>
                      <CardDescription className="text-xs">
                        ⏱️ {lesson.durationMin} دقيقة
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MarkdownMath content={lesson.content} />
                      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="font-bold text-sm mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            النقاط الأساسية
                          </div>
                          <ul className="space-y-1 text-sm">
                            {lesson.keyPoints.map((kp: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <ChevronLeft className="w-3 h-3 mt-1 text-primary flex-shrink-0" />
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* التمارين */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg academic-divider">سلسلة التمارين المتدرجة</h3>
                  <Badge variant="secondary">
                    {chapter.exercises.length} تمارين
                  </Badge>
                </div>

                {chapter.exercises.map((exercise: any, idx: number) => (
                  <ExerciseCard
                    key={idx}
                    exercise={exercise}
                    exerciseId={`${unit.slug}-${chapter.slug}-${idx}`}
                    unitSlug={unit.slug}
                    chapterSlug={chapter.slug}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* الاختبارات التفاعلية للوحدة */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            اختبارات تفاعلية لهذه الوحدة
          </CardTitle>
          <CardDescription>
            اختبر فهمك من خلال اختبارات تفاعلية فورية.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quizzes.filter((q) => q.unitSlug === unit.slug).length > 0 ? (
            <div className="space-y-3">
              {quizzes
                .filter((q) => q.unitSlug === unit.slug)
                .map((quiz) => (
                  <QuizPreviewCard key={quiz.id} quiz={quiz} />
                ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              لا توجد اختبارات لهذه الوحدة بعد.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuizPreviewCard({ quiz }: { quiz: any }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Card className="border-r-2 border-primary">
        <CardContent className="py-3 flex items-center justify-between gap-3">
          <div>
            <div className="font-bold">{quiz.title}</div>
            <div className="text-xs text-muted-foreground">
              {quiz.questions.length} أسئلة • {quiz.durationMin} دقيقة
            </div>
          </div>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Calculator className="w-4 h-4 ml-2" />
            ابدأ الاختبار
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">{quiz.title}</DialogTitle>
            <DialogDescription className="text-right">
              {quiz.description}
            </DialogDescription>
          </DialogHeader>
          <InteractiveQuiz
            quizId={quiz.id}
            title={quiz.title}
            description={quiz.description}
            questions={quiz.questions}
            durationMin={quiz.durationMin}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// ===================================================
//  عرض اختيار الاختبارات
// ===================================================

function QuizSelectionView({ onSelectQuiz }: { onSelectQuiz: (id: string) => void }) {
  const [selectedQuizId, setSelectedQuizId] = React.useState<string | null>(null);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);

  if (selectedQuiz) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedQuizId(null)}
          className="gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          عودة للاختبارات
        </Button>
        <InteractiveQuiz
          quizId={selectedQuiz.id}
          title={selectedQuiz.title}
          description={selectedQuiz.description}
          questions={selectedQuiz.questions}
          durationMin={selectedQuiz.durationMin}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 academic-divider mx-auto">
          الاختبارات التفاعلية
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          اختبر نفسك في كل وحدة، واحصل على نتيجة فورية مع تفسير تفصيلي لكل إجابة.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => {
          const unit = curriculum.find((u) => u.slug === quiz.unitSlug);
          const Icon = unit ? iconMap[unit.icon] || Calculator : Calculator;
          return (
            <Card
              key={quiz.id}
              className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
              onClick={() => setSelectedQuizId(quiz.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground flex-shrink-0"
                    style={{ background: unit?.color || "#2D6A4F" }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{quiz.title}</h3>
                    <p className="text-xs text-muted-foreground">{unit?.title}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{quiz.description}</p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline">{quiz.questions.length} أسئلة</Badge>
                  <Badge variant="outline">{quiz.durationMin} دقيقة</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================
//  عرض الدورات الشاملة
// ===================================================

function CoursesView({ onSelectCourse }: { onSelectCourse: (c: Course) => void }) {
  const [filterStream, setFilterStream] = React.useState<"ALL" | Course["stream"]>("ALL");
  const [filterLevel, setFilterLevel] = React.useState<"ALL" | Course["level"]>("ALL");
  const stats = getCoursesStats();

  const filteredCourses = courses.filter((c) => {
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
            <CourseCard key={course.id} course={course} onOpen={onSelectCourse} />
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
//  عرض المواضيع الشاملة والبكالوريات السابقة
// ===================================================

function ExamsView() {
  const [filterStream, setFilterStream] = React.useState<"ALL" | BacStream>("ALL");
  const [filterYear, setFilterYear] = React.useState<number | "ALL">("ALL");
  const stats = getBacExamsStats();

  const filteredExams = bacExams.filter((e) => {
    if (filterStream !== "ALL" && e.stream !== filterStream && e.stream !== "ALL") return false;
    if (filterYear !== "ALL" && e.year !== filterYear) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-3">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          المواضيع الشاملة والبكالوريات السابقة
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          مواضيع بكالوريا فعلية من السنوات السابقة لكل الشعب العلمية،
          مع الحلول النموذجية المفصلة خطوة بخطوة بمنهجية رسمية، بإشراف الأستاذ عدلي أسعد.
        </p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">موضوع بكالوريا</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.years.length}</div>
            <div className="text-xs text-muted-foreground">سنوات (من {Math.min(...stats.years)} إلى {Math.max(...stats.years)})</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <div className="text-xs text-muted-foreground">سؤال مع حل نموذجي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total * 20}</div>
            <div className="text-xs text-muted-foreground">نقطة (20 لكل موضوع)</div>
          </CardContent>
        </Card>
      </div>

      {/* المرشحات */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <div className="text-sm font-bold mb-2">تصفية حسب الشعبة:</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={filterStream === "ALL" ? "default" : "outline"}
                  onClick={() => setFilterStream("ALL")}
                >
                  كل الشعب
                </Button>
                <Button
                  size="sm"
                  variant={filterStream === "EXPERIMENTAL_SCIENCES" ? "default" : "outline"}
                  onClick={() => setFilterStream("EXPERIMENTAL_SCIENCES")}
                >
                  علوم تجريبية
                </Button>
                <Button
                  size="sm"
                  variant={filterStream === "MATHEMATICS" ? "default" : "outline"}
                  onClick={() => setFilterStream("MATHEMATICS")}
                >
                  رياضيات
                </Button>
                <Button
                  size="sm"
                  variant={filterStream === "TECHNICAL_MATH" ? "default" : "outline"}
                  onClick={() => setFilterStream("TECHNICAL_MATH")}
                >
                  تقني رياضي
                </Button>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2">تصفية حسب السنة:</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={filterYear === "ALL" ? "default" : "outline"}
                  onClick={() => setFilterYear("ALL")}
                >
                  كل السنوات
                </Button>
                {stats.years.map((year) => (
                  <Button
                    key={year}
                    size="sm"
                    variant={filterYear === year ? "default" : "outline"}
                    onClick={() => setFilterYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            عرض <strong className="text-primary">{filteredExams.length}</strong> من أصل <strong>{stats.total}</strong> موضوع
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
                أحبائي الطلاب، هذه المواضيع ليست مجرد امتحانات، بل هي خريطة لطريق النجاح.
                كل موضوع هنا يحمل توجيهات وحلولاً نموذجية. حاولوا أولاً حل الموضوع بأنفسكم
                قبل النظر إلى الحل — هذا هو سر التفوق. أعرفكم بأن البكالوريا ليست عدواً،
                بل فرصة لإثبات قدراتكم. أنا معكم في كل خطوة!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المواضيع */}
      <div className="space-y-4">
        {filteredExams.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد مواضيع مطابقة للمرشحات المختارة.</p>
            </CardContent>
          </Card>
        ) : (
          filteredExams
            .slice()
            .sort((a, b) => b.year - a.year)
            .map((exam) => <BacExamCard key={exam.id} exam={exam} />)
        )}
      </div>

      {/* نصيحة في النهاية */}
      <Card className="bg-accent/10 border-r-4 border-accent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Target className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">نصيحة الأستاذ للتعامل مع المواضيع</h3>
              <ul className="text-sm space-y-2 text-muted-foreground pr-6 list-disc leading-relaxed">
                <li>اقرأ الموضوع كاملاً قبل البدء في الحل — هذا يفتح لك الصورة العامة.</li>
                <li>خصص وقتاً لكل جزء (مثلاً: نصف ساعة لكل 5 نقاط).</li>
                <li>ابدأ دائماً بالأسئلة التي تجدها أسهل — هذا يبني الثقة.</li>
                <li>لا تترك سؤالاً فارغاً — حتى محاولة جزئية تستحق نقاطاً.</li>
                <li>راجع الحل النموذجي بعد كل تمرين لتفهم المنهجية الرسمية.</li>
                <li>كرر المواضيع القديمة — البكالوريا يعيد نفس الأنماط!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===================================================

function AboutView() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 academic-divider mx-auto">
          عن المنصة
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          منصة تعليمية تفاعلية متكاملة، صُممت بعناية لخدمة طلبة البكالوريا في الجزائر،
          بإشراف مباشر من الأستاذ عدلي أسعد.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            المشرف البيداغوجي والمؤسس
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-primary shadow-lg">
                <img
                  src="/teachers/adli-asad.jpg"
                  alt="الأستاذ عدلي أسعد - المشرف البيداغوجي"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="font-bold text-2xl mb-1 text-primary">الأستاذ عدلي أسعد</h3>
              <p className="text-sm text-muted-foreground mb-3">
                مشرف بيداغوجي ومؤسس المنصة
              </p>
              <p className="leading-relaxed">
                يلتزم الأستاذ عدلي أسعد بإيصال المعلومة الرياضية بأبسط وأوضح صورة،
                انطلاقاً من قناعته الراسخة بأن كل طالب قادر على بلوغ التفوق إذا توفّرت
                له الظروف المناسبة. أسّس هذه المنصة لتكون جسراً بين الطالب والنجاح في
                امتحان البكالوريا، عبر منهجية تدريجية تبدأ من المكتسبات القبلية وتنتهي
                بمستويات الامتحان المتقدمة.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            رؤيتنا ورسالتنا
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="leading-relaxed">
            <strong className="text-primary">الرسالة:</strong> تمكين كل طالب من الشعب
            العلمية في الجزائر من تجاوز امتحان البكالوريا بنسبة نجاح عالية، عبر
            منصة تعليمية تفاعلية تتبع المنهاج الرسمي لوزارة التربية الوطنية بدقة،
            وتقدم محتوى غنياً ومتدرجاً يبدأ من المكتسبات القبلية ويرتفع تدريجياً
            نحو المستويات المتقدمة. نؤمن بأن التفوق ليس حكراً على فئة معينة، بل هو
            نتيجة عمل منظّم واجتهاد يومي.
          </p>
          <p className="leading-relaxed">
            <strong className="text-primary">الرؤية:</strong> أن نصبح المرجع الرقمي
            الأول لطلبة الرياضيات في الجزائر، منصة تجمع بين الجودة الأكاديمية
            والتقنية الحديثة، وتفتح أبواب التفوق لكل طالب مهما كان مستواه، في أي
            مكان وأي وقت. نسعى لبناء جيل من المتفوقين قادر على المنافسة والإبداع في
            المجالات العلمية.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            المنهجية البيداغوجية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-decimal pr-6">
            <li className="leading-relaxed">
              <strong>مراجعة المكتسبات القبلية:</strong> كل فصل يبدأ بمراجعة دقيقة
              لما يجب أن يعرفه الطالب قبل الانتقال للجديد، مما يضمن بناء متيناً
              للمعرفة.
            </li>
            <li className="leading-relaxed">
              <strong>الدرس النظري المفصّل:</strong> شرح وافٍ لكل مفهوم، مدعّم
              بأمثلة محلولة بالتفصيل ونقاط أساسية مبرزة.
            </li>
            <li className="leading-relaxed">
              <strong>تمارين متدرجة:</strong> من التطبيق المباشر إلى مستوى البكالوريا
              المتقدم، مروراً بالتمارين المنهجية والمسائل الشاملة.
            </li>
            <li className="leading-relaxed">
              <strong>حلول نموذجية مفصلة:</strong> كل تمرين مصحوب بحل خطوة بخطوة
              بمنهجية رسمية مبرزة، مع تلميحات للتشجيع على التفكير قبل النظر للحل.
            </li>
            <li className="leading-relaxed">
              <strong>تقييم ذاتي فوري:</strong> نظام يتيح للطالب تقييم نفسه بعد كل
              تمرين، مع متابعة دقيقة لتقدمه في لوحة التحكم.
            </li>
            <li className="leading-relaxed">
              <strong>اختبارات تفاعلية:</strong> اختبارات قصيرة لكل وحدة، مع تفسير
              لكل إجابة وتتبع النتائج عبر الزمن.
            </li>
            <li className="leading-relaxed">
              <strong>متابعة ولي الأمر:</strong> فضاء خاص يتيح لولي الأمر متابعة
              تقدم ابنه بشفافية، مع تواصل مباشر مع الأستاذ عند الحاجة.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            التقنيات المستعملة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="block mb-1">الواجهة الأمامية:</strong>
              <p className="text-muted-foreground">
                Next.js 16 (App Router) + React 19 + TypeScript 5
              </p>
            </div>
            <div>
              <strong className="block mb-1">التصميم:</strong>
              <p className="text-muted-foreground">
                Tailwind CSS 4 + shadcn/ui + خط Amiri (عربي كلاسيكي)
              </p>
            </div>
            <div>
              <strong className="block mb-1">عرض الرياضيات:</strong>
              <p className="text-muted-foreground">KaTeX — عرض LaTeX سريع ودقيق</p>
            </div>
            <div>
              <strong className="block mb-1">قاعدة البيانات:</strong>
              <p className="text-muted-foreground">
                Prisma ORM + SQLite (قابلة للتوسع إلى PostgreSQL)
              </p>
            </div>
            <div>
              <strong className="block mb-1">إدارة الحالة:</strong>
              <p className="text-muted-foreground">
                Zustand (مع تخزين محلي) + TanStack Query
              </p>
            </div>
            <div>
              <strong className="block mb-1">دعم RTL:</strong>
              <p className="text-muted-foreground">اتجاه RTL كامل لكل العناصر</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===================================================
//  حوار التهيئة (Onboarding)
// ===================================================

function OnboardingDialog({
  open,
  onOpenChange,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onComplete: (p: {
    name: string;
    stream: "EXPERIMENTAL_SCIENCES" | "MATHEMATICS" | "TECHNICAL_MATH";
    grade: string;
    city: string;
  }) => void;
}) {
  const [name, setName] = React.useState("");
  const [stream, setStream] = React.useState<
    "EXPERIMENTAL_SCIENCES" | "MATHEMATICS" | "TECHNICAL_MATH"
  >("EXPERIMENTAL_SCIENCES");
  const [city, setCity] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right text-xl">مرحباً بك في المنصة! 🎉</DialogTitle>
          <DialogDescription className="text-right">
            لإضفاء تجربة مخصّصة لك، نحتاج بعض المعلومات الأساسية.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد الأمين بن علي"
            />
          </div>

          <div className="space-y-2">
            <Label>الشعبة</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant={stream === "EXPERIMENTAL_SCIENCES" ? "default" : "outline"}
                onClick={() => setStream("EXPERIMENTAL_SCIENCES")}
              >
                علوم تجريبية
              </Button>
              <Button
                size="sm"
                variant={stream === "MATHEMATICS" ? "default" : "outline"}
                onClick={() => setStream("MATHEMATICS")}
              >
                رياضيات
              </Button>
              <Button
                size="sm"
                variant={stream === "TECHNICAL_MATH" ? "default" : "outline"}
                onClick={() => setStream("TECHNICAL_MATH")}
              >
                تقني رياضي
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">الولاية (اختياري)</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="مثال: الجزائر العاصمة"
            />
          </div>

          <Button
            className="w-full"
            onClick={() =>
              onComplete({
                name: name || "طالب",
                stream,
                grade: "السنة الثالثة ثانوي",
                city,
              })
            }
          >
            ابدأ رحلتي نحو البكالوريا
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
