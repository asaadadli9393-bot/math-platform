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
  plans,
  paymentMethods,
  digitalProducts,
  formatPrice,
  formatPriceMonthly,
  getPlansStats,
  getProductsStats,
  planLabelsAr,
  productCategoryLabels,
  type Plan,
  type PlanTier,
  type PaymentMethodInfo,
  type DigitalProduct,
} from "@/data/monetization";
import {
  getLessonSummary,
  getVideoSimulation,
  getLessonEnhancementsStats,
} from "@/data/lesson-enhancements";
import { VideoSimulationPlayer } from "@/components/video-simulation-player";
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
  Home,
  CreditCard,
  ShoppingBag,
  Lock,
  Check,
  X,
  Download,
  Zap,
  ShieldCheck,
  Gift,
  RefreshCw,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FunctionPlot } from "@/components/function-plot";
import { AIAssistant } from "@/components/ai-assistant";
import { premiumCourses } from "@/data/premium-courses";

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

type MainView = "home" | "trimesters" | "curriculum" | "unit" | "quiz" | "exams" | "courses" | "course-detail" | "pricing" | "payment" | "payment-product" | "products" | "dashboard" | "parent" | "about" | "admin" | "function-plotter" | "assistant";

// ===================================================
//  مكوّن القفل — يُظهر رسالة للمستخدم غير المشترك
// ===================================================
function LockedContent({ feature, onSubscribe }: { feature: string; onSubscribe: () => void }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/30 mb-4">
        <Lock className="w-10 h-10 text-amber-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">🔒 {feature} مقفل</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
        للوصول إلى {feature} يجب الاشتراك في الاستفادة الكاملة من المنصة.
        اشترك مرة واحدة بـ 500 دج فقط وافتح كل المحتوى.
      </p>
      <Button
        size="lg"
        className="gap-2 bg-primary hover:bg-primary/90"
        onClick={onSubscribe}
      >
        <CreditCard className="w-5 h-5" />
        اشترك الآن — 500 دج
      </Button>
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          دفع آمن
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-amber-500" />
          تفعيل فوري
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          1000+ تمرين
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [view, setView] = React.useState<MainView>("home");
  const [selectedUnitSlug, setSelectedUnitSlug] = React.useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = React.useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [selectedPlanId, setSelectedPlanId] = React.useState<PlanTier | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const stats = getCurriculumStats();
  const profile = useStudentStore((s) => s.profile);
  const updateProfile = useStudentStore((s) => s.updateProfile);
  const setUnitProgress = useStudentStore((s) => s.setUnitProgress);
  const lastVisitedUnit = useStudentStore((s) => s.lastVisitedUnit);
  const setLastVisitedUnit = useStudentStore((s) => s.setLastVisitedUnit);
  const { toast } = useToast();

  // ✅ نظام الاشتراك الأمن — يفحص تاريخ انتهاء الاشتراك فعلياً
  const isSubscribed = useStudentStore((s) => s.isSubscriptionActive());

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
                <Home className="w-4 h-4 ml-2" />
                الرئيسية
              </NavButton>
              <NavButton active={view === "trimesters"} onClick={() => navigateTo("trimesters")}>
                <Calendar className="w-4 h-4 ml-2" />
                الفصول
              </NavButton>
              <NavButton active={view === "curriculum"} onClick={() => navigateTo("curriculum")}>
                <Calculator className="w-4 h-4 ml-2" />
                المنهاج
              </NavButton>
              <NavButton active={view === "exams"} onClick={() => navigateTo("exams")}>
                <Trophy className="w-4 h-4 ml-2" />
                المواضيع
              </NavButton>
              <NavButton active={view === "courses"} onClick={() => navigateTo("courses")}>
                <PlayCircle className="w-4 h-4 ml-2" />
                الدورات
              </NavButton>
              <NavButton active={view === "products"} onClick={() => navigateTo("products")}>
                <ShoppingBag className="w-4 h-4 ml-2" />
                المتجر
              </NavButton>
              <NavButton active={view === "pricing"} onClick={() => navigateTo("pricing")}>
                <CreditCard className="w-4 h-4 ml-2" />
                الباقات
              </NavButton>
              <NavButton active={view === "dashboard"} onClick={() => navigateTo("dashboard")}>
                <LayoutDashboard className="w-4 h-4 ml-2" />
                لوحتي
              </NavButton>
              <NavButton active={view === "about"} onClick={() => navigateTo("about")}>
                <Sparkles className="w-4 h-4 ml-2" />
                عن المنصة
              </NavButton>
              <NavButton active={view === "function-plotter"} onClick={() => navigateTo("function-plotter")}>
                <LineChart className="w-4 h-4 ml-2" />
                رسم الدوال
              </NavButton>
              <NavButton active={false} onClick={() => navigateTo("admin")}>
                <ShieldCheck className="w-4 h-4 ml-2" />
                المشرف
              </NavButton>
              <NavButton active={false} onClick={() => navigateTo("assistant")}>
                <Sparkles className="w-4 h-4 ml-2" />
                المساعد الذكي
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
                    <Home className="w-4 h-4 ml-2" /> الرئيسية
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("trimesters")}>
                    <Calendar className="w-4 h-4 ml-2" /> الفصول الدراسية
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
                  <MobileNavButton onClick={() => navigateTo("products")}>
                    <ShoppingBag className="w-4 h-4 ml-2" /> المتجر
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("pricing")}>
                    <CreditCard className="w-4 h-4 ml-2" /> الباقات والأسعار
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
                  <MobileNavButton onClick={() => navigateTo("function-plotter")}>
                    <LineChart className="w-4 h-4 ml-2" /> رسم الدوال
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("assistant")}>
                    <Sparkles className="w-4 h-4 ml-2" /> المساعد الذكي
                  </MobileNavButton>
                  <MobileNavButton onClick={() => navigateTo("admin")}>
                    <ShieldCheck className="w-4 h-4 ml-2" /> المشرف
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

        {view === "trimesters" && (
          <TrimestersView onSelectUnit={(slug) => navigateTo("unit", slug)} onNavigateCurriculum={() => navigateTo("curriculum")} />
        )}

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

        {view === "exams" && (
          isSubscribed ? <ExamsView /> : <LockedContent feature="المواضيع الشاملة وبكالوريا سابقة" onSubscribe={() => navigateTo("pricing")} />
        )}

        {view === "pricing" && (
          <PricingView
            onSelectPlan={(planId) => {
              setSelectedPlanId(planId);
              setView("payment");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateToDashboard={() => navigateTo("dashboard")}
          />
        )}

        {view === "payment" && selectedPlanId && (
          <PaymentView
            planId={selectedPlanId}
            onBack={() => navigateTo("pricing")}
            onSuccess={(planId, months) => {
              const tier = planId as PlanTier;
              useStudentStore.getState().subscribeToPlan(tier, months);
              toast({
                title: "تم تفعيل اشتراكك بنجاح! 🎉",
                description: `أنت الآن في الباقة ${planLabelsAr[tier]} — لمدة ${months} شهر. استمتع بالكامل!`,
              });
              setView("dashboard");
            }}
          />
        )}

        {view === "products" && (
          isSubscribed ? (
            <ProductsView
              onPurchase={(slug) => {
                setSelectedProductSlug(slug);
                setView("payment-product");
              }}
              onNavigateToPricing={() => navigateTo("pricing")}
            />
          ) : <LockedContent feature="المتجر" onSubscribe={() => navigateTo("pricing")} />
        )}

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

        {view === "admin" && (
          <div className="text-center py-12">
            <ShieldCheck className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">لوحة المشرف</h2>
            <p className="text-muted-foreground mb-4">صفحة الإدارة الكاملة متاحة على المسار المستقل</p>
            <a href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline text-lg font-bold">
              <ShieldCheck className="w-5 h-5" /> /admin
            </a>
          </div>
        )}

        {view === "function-plotter" && <FunctionPlotter />}

        {view === "assistant" && (
          isSubscribed ? <AIAssistant /> : <LockedContent feature="المساعد الذكي" onSubscribe={() => navigateTo("pricing")} />
        )}

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
                    onClick={() => navigateTo("trimesters")}
                    className="hover:text-accent transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Calendar className="w-3 h-3" />
                    الفصول الدراسية
                  </button>
                </li>
                <li>
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
                    onClick={() => navigateTo("products")}
                    className="hover:text-accent transition-colors flex items-center gap-1 font-semibold"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    المتجر
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo("pricing")}
                    className="hover:text-accent transition-colors flex items-center gap-1 font-semibold"
                  >
                    <CreditCard className="w-3 h-3" />
                    الباقات والأسعار
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
      variant={active ? "default" : "outline"}
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
      variant="outline"
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
              onClick={() => onNavigate("trimesters")}
              className="bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 gap-2"
            >
              <Calendar className="w-5 h-5" />
              تصفح حسب الفصول
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
              onClick={() => onNavigate("pricing")}
              className="bg-amber-500 text-white border-amber-600 hover:bg-amber-600 gap-2"
            >
              <CreditCard className="w-5 h-5" />
              اشترك الآن
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
                    <Badge variant="outline" className="text-xs">
                      {streamLabels[unit.stream]}
                    </Badge>
                    <Badge
                      className={`text-xs border ${
                        unit.trimester === 1
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : unit.trimester === 2
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      الفصل {unit.trimester === 1 ? "الأول" : unit.trimester === 2 ? "الثاني" : "الثالث"}
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
//  عرض الفصول الدراسية الثلاثة (Trimesters)
// ===================================================

const trimesterInfo: Record<1 | 2 | 3, {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  badgeColor: string;
  period: string;
  icon: string;
  features: string[];
}> = {
  1: {
    title: "الفصل الأول",
    subtitle: "الأساسيات والتحليل التأسيسي",
    description:
      "الفصل الأول من السنة الدراسية: يضع الأسس المتينة عبر دراسة الدوال والمتتاليات العددية. كل ما يحتاجه الطالب لبناء فهم راسخ قبل التعمق في المنهاج.",
    color: "#2D6A4F",
    gradient: "from-emerald-600 to-green-700",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    period: "سبتمبر — ديسمبر",
    icon: "🌱",
    features: [
      "بناء أساس قوي في دراسة الدوال",
      "إتقان النهايات والاشتقاق",
      "فهم المتتاليات العددية وحلولها",
      "تمهيد للمواضيع المتقدمة في الفصول القادمة",
    ],
  },
  2: {
    title: "الفصل الثاني",
    subtitle: "الدوال المتخصصة والاحتمالات",
    description:
      "الفصل الثاني: تعمق في الدوال الأسية واللوغاريتمية، إدخال الأعداد المركبة (للرياضيات)، ودراسة الاحتمالات. فصل تطبيقي واسع.",
    color: "#7F5539",
    gradient: "from-amber-700 to-orange-700",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    period: "جانفي — مارس",
    icon: "📈",
    features: [
      "إتقان الدالة الأسية واللوغاريتم النيبيري",
      "إدخال عالم الأعداد المركبة (شعبة رياضيات)",
      "دراسة شاملة للاحتمالات والاحتمال الشرطي",
      "تطبيقات فيزيائية واقتصادية للنمو الأُسي",
    ],
  },
  3: {
    title: "الفصل الثالث",
    subtitle: "الهندسة الإفضالية والحساب المتقدم",
    description:
      "الفصل الثالث: دراسة الهندسة في الفضاء، الحساب وقابلية القسمة (للرياضيات)، ومراجعة شاملة قبل امتحان البكالوريا. فصل التحضير النهائي.",
    color: "#1D3557",
    gradient: "from-blue-700 to-indigo-800",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    period: "أفريل — جوان",
    icon: "🎯",
    features: [
      "إتقان الهندسة في الفضاء (الجداء السلمي والشعاعي)",
      "الحساب وقابلية القسمة ونظرية فيرما (شعبة رياضيات)",
      "تطبيقات شاملة لكل ما سبق",
      "تحضير نهائي لامتحان البكالوريا",
    ],
  },
};

function TrimestersView({
  onSelectUnit,
  onNavigateCurriculum,
}: {
  onSelectUnit: (slug: string) => void;
  onNavigateCurriculum: () => void;
}) {
  const [activeTrimester, setActiveTrimester] = React.useState<1 | 2 | 3>(1);
  const favoriteUnits = useStudentStore((s) => s.favoriteUnits);

  const unitsByTrimester = (t: 1 | 2 | 3) =>
    curriculum.filter((u) => u.trimester === t);

  const currentUnits = unitsByTrimester(activeTrimester);
  const info = trimesterInfo[activeTrimester];

  // إحصائيات لكل فصل
  const getTrimesterStats = (t: 1 | 2 | 3) => {
    const units = unitsByTrimester(t);
    return {
      units: units.length,
      chapters: units.reduce((a, u) => a + u.chapters.length, 0),
      exercises: units.reduce(
        (a, u) =>
          a +
          u.chapters.reduce((aa, c) => aa + c.exercises.length, 0),
        0
      ),
    };
  };

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary mb-3">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          الفصول الدراسية الثلاثة
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          منصة الرياضيات مقسّمة وفق المنهاج الرسمي لوزارة التربية الوطنية الجزائرية
          إلى ثلاثة فصول دراسية. كل فصل يحتوي على الوحدات التعليمية المناسبة لتلك
          الفترة، مرتبة تدريجياً لبناء فهم متين عند الطالب.
        </p>
      </div>

      {/* بطاقات الفصول الثلاثة */}
      <div className="grid md:grid-cols-3 gap-4">
        {([1, 2, 3] as const).map((t) => {
          const tInfo = trimesterInfo[t];
          const stats = getTrimesterStats(t);
          const isActive = activeTrimester === t;
          return (
            <Card
              key={t}
              className={`cursor-pointer transition-all hover:-translate-y-1 ${
                isActive
                  ? "border-2 shadow-lg"
                  : "border hover:shadow-md"
              }`}
              style={isActive ? { borderColor: tInfo.color } : {}}
              onClick={() => setActiveTrimester(t)}
            >
              <CardContent className="pt-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tInfo.gradient} text-white text-2xl mb-3`}
                >
                  {tInfo.icon}
                </div>
                <h3 className="font-bold text-xl mb-1">{tInfo.title}</h3>
                <p className="text-sm text-muted-foreground italic mb-3">
                  {tInfo.subtitle}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Clock className="w-3 h-3" />
                  <span>{tInfo.period}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{stats.units} وحدات</Badge>
                  <Badge variant="outline">{stats.chapters} فصول</Badge>
                  <Badge variant="outline">{stats.exercises} تمرين</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* الفصل المُختار — تفاصيل */}
      <Card
        className="overflow-hidden border-2"
        style={{ borderColor: info.color }}
      >
        <div
          className={`bg-gradient-to-l ${info.gradient} text-white p-6`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{info.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{info.title}</h2>
              <p className="text-white/80 italic">{info.subtitle}</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed mb-3">{info.description}</p>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Clock className="w-4 h-4" />
            <span>الفترة: {info.period}</span>
          </div>
        </div>

        <CardContent className="pt-6 space-y-4">
          {/* مميزات الفصل */}
          <div>
            <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: info.color }}>
              <Sparkles className="w-4 h-4" />
              مميزات الفصل
            </h4>
            <ul className="space-y-1 pr-6 list-disc">
              {info.features.map((f, i) => (
                <li key={i} className="text-sm">{f}</li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* وحدات الفصل */}
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: info.color }}>
              <BookOpen className="w-4 h-4" />
              وحدات {info.title} ({currentUnits.length})
            </h4>
            <div className="space-y-3">
              {currentUnits.map((unit) => {
                const Icon = iconMap[unit.icon] || Calculator;
                const isFavorite = favoriteUnits.includes(unit.slug);
                const totalExercises = unit.chapters.reduce(
                  (a, c) => a + c.exercises.length,
                  0
                );
                return (
                  <Card
                    key={unit.slug}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => onSelectUnit(unit.slug)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                          style={{ background: unit.color }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              وحدة {unit.order}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {streamLabels[unit.stream]}
                            </Badge>
                            <Badge
                              className={`text-xs ${info.badgeColor} border`}
                            >
                              {info.title}
                            </Badge>
                            {isFavorite && (
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <h3 className="font-bold mb-1">{unit.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {unit.description}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {unit.chapters.length} فصول
                            </span>
                            <span className="flex items-center gap-1">
                              <Calculator className="w-3 h-3" />
                              {totalExercises} تمرين
                            </span>
                          </div>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* رسالة بيداغوجية */}
      <Card className="bg-gradient-to-l from-primary/5 to-accent/5 border-r-4 border-primary">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <img
              src="/teachers/adli-asad.jpg"
              alt="الأستاذ عدلي أسعد"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary flex-shrink-0"
            />
            <div>
              <div className="font-bold text-primary mb-1">
                كلمة بيداغوجية من الأستاذ عدلي أسعد
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                الفصل الدراسي ليس مجرد فترة زمنية — هو رحلة تعليمية كاملة. كل فصل
                يبني على ما قبله ويمهد لما بعده. ابدأ بالفصل الأول وأتقن أساسياته
                قبل الانتقال. لا تقفز بين الفصول — الترتيب الصحيح هو سر التفوق.
                ومن يُتقن فصله الأول، يجد الفصل الثاني سهلاً. ومن يتقن الثاني،
                يجد الثالث ممتعاً. هكذا تُبنى النجاحات!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* دعوة لعرض المنهاج الكامل */}
      <div className="text-center pt-4">
        <Button variant="outline" onClick={onNavigateCurriculum} className="gap-2">
          <Calculator className="w-4 h-4" />
          عرض المنهاج الكامل (كل الوحدات)
        </Button>
      </div>
    </div>
  );
}

// ===================================================
//  بطاقة الدرس (LessonCard) — مع الملخص والفيديو
// ===================================================

function LessonCard({ lesson }: { lesson: any }) {
  const [showVideo, setShowVideo] = React.useState(false);
  const [showSummary, setShowSummary] = React.useState(false);

  // الحصول على الفيديو والملخص من lesson-enhancements
  const video = React.useMemo(() => getVideoSimulation(lesson.slug), [lesson.slug]);
  const summary = React.useMemo(() => getLessonSummary(lesson.slug), [lesson.slug]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{lesson.title}</CardTitle>
            <CardDescription className="text-xs flex items-center gap-3">
              <span>⏱️ {lesson.durationMin} دقيقة</span>
              {video && (
                <Badge className="bg-primary/10 text-primary border border-primary/30">
                  <Sparkles className="w-3 h-3 ml-1" />
                  فيديو متاح
                </Badge>
              )}
              {summary && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 ml-1" />
                  ملخص نهائي
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* محتوى الدرس */}
        <MarkdownMath content={lesson.content} />

        {/* زر الفيديو المحاكاة */}
        {video && (
          <div className="mt-4 pt-3 border-t border-border">
            <Button
              variant="default"
              className="w-full gap-2 bg-gradient-to-l from-primary to-accent"
              onClick={() => setShowVideo(!showVideo)}
            >
              <Sparkles className="w-4 h-4" />
              {showVideo ? "إخفاء الفيديو المحاكاة" : "▶ مشاهدة الفيديو المحاكاة"}
            </Button>
            {showVideo && (
              <div className="mt-4">
                <VideoSimulationPlayer video={video} lessonTitle={lesson.title} />
              </div>
            )}
          </div>
        )}

        {/* النقاط الأساسية */}
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

        {/* الملخص النهائي */}
        {summary && (
          <div className="mt-4 pt-3 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2 bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-950/40"
              onClick={() => setShowSummary(!showSummary)}
            >
              <Sparkles className="w-4 h-4" />
              {showSummary ? "إخفاء الملخص النهائي" : "📋 عرض الملخص النهائي"}
            </Button>
            {showSummary && (
              <div className="mt-3 bg-gradient-to-l from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-r-4 border-amber-500 rounded-md p-4">
                <div className="font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  الملخص النهائي للدرس
                </div>
                <MarkdownMath content={summary} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ===================================================

function CurriculumView({ onSelectUnit }: { onSelectUnit: (slug: string) => void }) {
  const [filter, setFilter] = React.useState<"ALL" | "MATHEMATICS" | "EXPERIMENTAL_SCIENCES" | "TECHNICAL_MATH">("ALL");
  const [trimesterFilter, setTrimesterFilter] = React.useState<"ALL" | 1 | 2 | 3>("ALL");
  const favoriteUnits = useStudentStore((s) => s.favoriteUnits);
  const toggleFavorite = useStudentStore((s) => s.toggleFavorite);

  const filteredUnits = curriculum.filter(
    (u) => {
      const streamOK = filter === "ALL" || u.stream === filter || u.stream === "ALL";
      const trimesterOK = trimesterFilter === "ALL" || u.trimester === trimesterFilter;
      return streamOK && trimesterOK;
    }
  );

  const trimesterBadge: Record<1 | 2 | 3, string> = {
    1: "bg-emerald-100 text-emerald-800 border-emerald-300",
    2: "bg-amber-100 text-amber-800 border-amber-300",
    3: "bg-blue-100 text-blue-800 border-blue-300",
  };

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
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-sm font-bold self-center ml-2">الشعبة:</span>
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

        {/* مرشح الفصل */}
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-sm font-bold self-center ml-2">الفصل الدراسي:</span>
          <Button
            variant={trimesterFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setTrimesterFilter("ALL")}
          >
            كل الفصول
          </Button>
          <Button
            variant={trimesterFilter === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setTrimesterFilter(1)}
            className={trimesterFilter === 1 ? "bg-emerald-600" : ""}
          >
            الفصل الأول
          </Button>
          <Button
            variant={trimesterFilter === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setTrimesterFilter(2)}
            className={trimesterFilter === 2 ? "bg-amber-700" : ""}
          >
            الفصل الثاني
          </Button>
          <Button
            variant={trimesterFilter === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setTrimesterFilter(3)}
            className={trimesterFilter === 3 ? "bg-blue-700" : ""}
          >
            الفصل الثالث
          </Button>
        </div>
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
                      <Badge variant="outline">{streamLabels[unit.stream]}</Badge>
                      <Badge className={`${trimesterBadge[unit.trimester]} border`}>
                        <Calendar className="w-3 h-3 ml-1" />
                        الفصل {unit.trimester === 1 ? "الأول" : unit.trimester === 2 ? "الثاني" : "الثالث"}
                      </Badge>
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
                      variant="outline"
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
        <Button variant="outline" size="sm" onClick={onBack} className="mb-4 gap-2">
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
                  <Badge variant="outline">{streamLabels[unit.stream]}</Badge>
                  <Badge
                    className={`${
                      unit.trimester === 1
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : unit.trimester === 2
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-blue-100 text-blue-800 border-blue-300"
                    } border`}
                  >
                    <Calendar className="w-3 h-3 ml-1" />
                    الفصل {unit.trimester === 1 ? "الأول" : unit.trimester === 2 ? "الثاني" : "الثالث"}
                  </Badge>
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
                  <LessonCard key={lesson.slug} lesson={lesson} />
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
          variant="outline"
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
//  عرض الباقات والأسعار (Pricing)
// ===================================================

function PricingView({ onSelectPlan, onNavigateToDashboard }: { onSelectPlan: (planId: PlanTier) => void; onNavigateToDashboard: () => void; }) {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");
  const stats = getPlansStats();
  const subscriptionTier = useStudentStore.getState().getSubscriptionTier();
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-primary to-amber-700 mb-3">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          باقات المنصة
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          اختر الباقة المناسبة لك. ادفع مرة واحدة وادخل عالم الرياضيات بلا حدود.
          طرق دفع جزائرية متعددة: CIB، بريدي موب، CCP، تحويل بنكي.
        </p>
      </div>

      {/* مفتاح التبديل بين الشهري والسنوي */}
      <div className="flex justify-center items-center gap-4">
        <span className={billingCycle === "monthly" ? "font-bold text-primary" : "text-muted-foreground"}>
          شهري
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingCycle === "yearly" ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
              billingCycle === "yearly" ? "right-1" : "left-1"
            }`}
          />
        </button>
        <span className={billingCycle === "yearly" ? "font-bold text-primary" : "text-muted-foreground"}>
          سنوي
        </span>
        {billingCycle === "yearly" && (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 border">
            <Zap className="w-3 h-3 ml-1" />
            توفير 33%
          </Badge>
        )}
      </div>

      {/* الباقات */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const isCurrent = subscriptionTier === plan.id;
          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all ${
                plan.isMostPopular
                  ? "border-2 shadow-lg scale-105"
                  : "hover:shadow-md hover:-translate-y-1"
              }`}
              style={plan.isMostPopular ? { borderColor: plan.color } : {}}
            >
              {plan.badge && (
                <div
                  className="absolute top-0 right-0 left-0 py-1 text-center text-xs font-bold text-white"
                  style={{ background: plan.color }}
                >
                  {plan.badge}
                </div>
              )}
              <CardContent className={`pt-6 space-y-4 ${plan.badge ? "mt-4" : ""}`}>
                <div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: plan.color }}>
                    {plan.nameAr}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                <div className="py-3 border-y border-border">
                  <div className="text-3xl font-bold">
                    {plan.monthlyPrice === 0 ? (
                      "مجاناً"
                    ) : (
                      <>
                        {price.toLocaleString("en-US")}
                        <span className="text-base font-normal text-muted-foreground"> دج</span>
                      </>
                    )}
                  </div>
                  {plan.monthlyPrice > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {billingCycle === "monthly" ? "كل شهر" : "كل سنة (توفير " + ((plan.monthlyPrice * 12 - plan.yearlyPrice).toLocaleString("en-US")) + " دج)"}
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full ${
                    isCurrent ? "bg-muted text-muted-foreground" : ""
                  }`}
                  style={!isCurrent ? { background: plan.color, color: "white" } : {}}
                  disabled={isCurrent}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  {isCurrent ? "✓ باقتك الحالية" : plan.cta}
                </Button>

                <ul className="space-y-2 text-sm">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {feat.included ? (
                        <Check
                          className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"
                        />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feat.included
                            ? feat.highlight
                              ? "font-bold"
                              : ""
                            : "text-muted-foreground line-through"
                        }
                      >
                        {feat.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* طرق الدفع المقبولة */}
      <Card className="bg-gradient-to-l from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-bold mb-3 flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              طرق الدفع المقبولة (جزائرية 100%)
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center gap-2 bg-card border-2 rounded-lg px-3 py-2"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="text-right">
                    <div className="font-bold text-sm">{method.nameAr}</div>
                    <div className="text-xs text-muted-foreground">
                      {method.isInstant ? "فوري" : "تأكيد يدوي"} • {method.fee}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ضمانات */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold mb-1">دفع آمن 100%</h4>
            <p className="text-xs text-muted-foreground">
              جميع المعاملات مشفّرة وآمنة. لا نخزّن بيانات بطاقتك.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h4 className="font-bold mb-1">تفعيل فوري</h4>
            <p className="text-xs text-muted-foreground">
              بعد الدفع عبر CIB أو بريدي موب، تُفعّل باقتك خلال ثوانٍ.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Check className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-bold mb-1">إلغاء سهل</h4>
            <p className="text-xs text-muted-foreground">
              يمكنك الإلغاء في أي وقت من لوحة التحكم، دون أي رسوم خفية.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* تجربة مجانية */}
      <Card className="bg-gradient-to-l from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-400">
        <CardContent className="pt-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 mb-3">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">🎁 تجربة مجانية 7 أيام</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            لست متأكدًا؟ جرّب الباقة الأساسية مجاناً لمدة 7 أيام كاملة. بدون أي بطاقة،
            بدون أي التزام. استمتع بكل التمارين والحلول مجاناً!
          </p>
          <Button
            size="lg"
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            onClick={() => {
              useStudentStore.getState().startFreeTrial(7);
              toast({
                title: "🎁 تم تفعيل تجربتك المجانية!",
                description: "استمتع بالباقة الأساسية مجاناً لمدة 7 أيام. استمتع بالكامل!",
              });
              onNavigateToDashboard();
            }}
          >
            <Zap className="w-4 h-4" />
            ابدأ التجربة المجانية
          </Button>
        </CardContent>
      </Card>

      {/* أسئلة شائعة */}
      <Card>
        <CardHeader>
          <CardTitle>الأسئلة الشائعة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-bold mb-1">هل يمكنني الدفع عبر بريدي موب؟</h4>
            <p className="text-sm text-muted-foreground">
              نعم! بريدي موب مدعوم تمامًا. اختر هذه الطريقة عند الدفع، اتبع التعليمات في تطبيق بريدي موب،
              وأدخل رقم العملية.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-1">هل الدفع آمن؟</h4>
            <p className="text-sm text-muted-foreground">
              نعم 100%. عمليات CIB تتم عبر بوابة آمنة مشفّرة، ولا نخزّن بيانات بطاقتك. عمليات بريدي موب
              و CCP تتم من تطبيقك الخاص.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-1">هل يمكنني إلغاء الاشتراك؟</h4>
            <p className="text-sm text-muted-foreground">
              نعم، يمكنك الإلغاء في أي وقت من لوحة التحكم. الاشتراك يستمر حتى نهاية الفترة المدفوعة.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-1">ما الفرق بين الشهري والسنوي؟</h4>
            <p className="text-sm text-muted-foreground">
              السنوي يوفّر 33% (مثلاً 500×12 = 6000، سنوي = 4000). دفعة واحدة لكل السنة.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-1">هل توجد ضمان استرجاع؟</h4>
            <p className="text-sm text-muted-foreground">
              نعم، إذا لم تكن راضياً خلال أول 7 أيام من الاشتراك السنوي، نُعيد لك 100% من المبلغ.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===================================================
//  عرض الدفع (Payment)
// ===================================================

function PaymentView({
  planId,
  onBack,
  onSuccess,
}: {
  planId: PlanTier;
  onBack: () => void;
  onSuccess: (planId: PlanTier, months: number) => void;
}) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethodInfo | null>(null);
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [duration, setDuration] = React.useState<1 | 3 | 6 | 12>(1);
  const [processing, setProcessing] = React.useState(false);

  const plan = plans.find((p) => p.id === planId);
  if (!plan) return null;

  const totalAmount = duration === 1
    ? plan.monthlyPrice
    : duration === 3
    ? plan.monthlyPrice * 3
    : duration === 6
    ? plan.monthlyPrice * 6
    : plan.yearlyPrice;

  const handlePay = () => {
    if (!selectedMethod) return;
    setProcessing(true);
    // محاكاة معالجة الدفع
    setTimeout(() => {
      setProcessing(false);
      onSuccess(planId, duration);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
        <ChevronRight className="w-4 h-4" />
        عودة للباقات
      </Button>

      {/* ملخص الطلب */}
      <Card className="border-2" style={{ borderColor: plan.color }}>
        <CardHeader className="text-white" style={{ background: plan.color }}>
          <CardTitle className="flex items-center justify-between">
            <span>ملخص الطلب</span>
            <span className="text-2xl">{plan.id === "FULL" ? "⭐" : "💳"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">الباقة</span>
            <span className="font-bold">{plan.nameAr}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">المدة</span>
            <div className="flex gap-2">
              {[1, 3, 6, 12].map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={duration === m ? "default" : "outline"}
                  onClick={() => setDuration(m as 1 | 3 | 6 | 12)}
                >
                  {m === 12 ? "سنة" : `${m} شهر`}
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-xl font-bold">
            <span>الإجمالي</span>
            <span style={{ color: plan.color }}>{totalAmount.toLocaleString("en-US")} دج</span>
          </div>
          {duration === 12 && plan.monthlyPrice > 0 && (
            <div className="text-sm text-emerald-600 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              توفير {((plan.monthlyPrice * 12) - plan.yearlyPrice).toLocaleString("en-US")} دج سنوياً!
            </div>
          )}
        </CardContent>
      </Card>

      {/* اختيار طريقة الدفع */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            اختر طريقة الدفع
          </CardTitle>
          <CardDescription>طرق دفع جزائرية آمنة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method);
                  setFormData({});
                }}
                className={`text-right p-4 border-2 rounded-lg transition-all ${
                  selectedMethod?.id === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{method.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold">{method.nameAr}</div>
                    <div className="text-xs text-muted-foreground">{method.description}</div>
                    <div className="text-xs mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {method.isInstant ? "✓ فوري" : "⏱ تأكيد يدوي"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{method.fee}</Badge>
                    </div>
                  </div>
                  {selectedMethod?.id === method.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* نموذج طريقة الدفع */}
      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedMethod.icon}</span>
              {selectedMethod.nameAr} — تعليمات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* التعليمات */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border-r-4 border-blue-400 rounded-md p-4">
              <h4 className="font-bold mb-2 text-blue-700 dark:text-blue-300">طريقة الدفع:</h4>
              <ol className="space-y-1 pr-6 list-decimal text-sm">
                {selectedMethod.instructions.map((instr, i) => (
                  <li key={i}>{instr}</li>
                ))}
              </ol>
            </div>

            {/* الحقول */}
            <div className="space-y-3">
              {selectedMethod.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 mr-1">*</span>}
                  </Label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={formData[field.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="w-full p-2 rounded-md border border-input bg-background"
                    >
                      <option value="">اختر...</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      className="font-mono text-right"
                      dir={field.type === "number" || field.type === "tel" ? "ltr" : "rtl"}
                    />
                  )}
                  {field.helpText && (
                    <p className="text-xs text-muted-foreground">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>

            {/* زر الدفع */}
            <Button
              className="w-full gap-2"
              size="lg"
              style={{ background: selectedMethod.color }}
              disabled={processing}
              onClick={handlePay}
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ معالجة الدفع...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  ادفع {totalAmount.toLocaleString("en-US")} دج بـ {selectedMethod.nameAr}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              معاملة آمنة 100% — بياناتك محمية ومشفّرة
            </p>
          </CardContent>
        </Card>
      )}

      {/* رسالة من الأستاذ */}
      <Card className="bg-primary/5 border-r-4 border-primary">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <img
              src="/teachers/adli-asad.jpg"
              alt="الأستاذ عدلي أسعد"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary flex-shrink-0"
            />
            <div>
              <div className="font-bold text-primary mb-1">كلمة من الأستاذ عدلي أسعد</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                استثمارك في تعليمك هو استثمار في مستقبلك. كل دج تدفعه هنا يعود عليك بأضعاف
                من خلال التفوق في البكالوريا. أنا أضمن لك جودة المحتوى ومتابعة حقيقية.
                لك كل دعائي بالتوفيق!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===================================================
//  عرض المتجر (Products)
// ===================================================

function ProductsView({ onPurchase, onNavigateToPricing }: { onPurchase: (slug: string) => void; onNavigateToPricing: () => void; }) {
  const stats = getProductsStats();
  const profile = useStudentStore((s) => s.profile);
  const ownedProducts = profile?.ownedProducts || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 mb-3">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          متجر المنتجات الرقمية
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ملخصات ذهنية، مواضيع مصححة، حزم تمارين، دروس خاصة.
          منتجات PDF احترافية للتحميل الفوري بعد الشراء.
        </p>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <ShoppingBag className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">منتج رقمي</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Download className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.featured}</div>
            <div className="text-xs text-muted-foreground">منتج مميز</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <CreditCard className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.avgPrice}</div>
            <div className="text-xs text-muted-foreground">متوسط السعر (دج)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{ownedProducts.length}</div>
            <div className="text-xs text-muted-foreground">منتجاتك المُشتراة</div>
          </CardContent>
        </Card>
      </div>

      {/* المنتجات */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {digitalProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            owned={ownedProducts.includes(product.slug)}
            onPurchase={() => onPurchase(product.slug)}
          />
        ))}
      </div>

      {/* دعوة */}
      <Card className="bg-accent/10 border-r-4 border-accent">
        <CardContent className="pt-6 text-center">
          <h3 className="font-bold mb-2">🎁 خصومات خاصة للمشتركين</h3>
          <p className="text-sm text-muted-foreground mb-3">
            المشتركين في الباقة المميزة يحصلون على كل المنتجات الرقمية مجاناً!
          </p>
          <Button
            variant="default"
            onClick={() => onNavigateToPricing()}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <CreditCard className="w-4 h-4" />
            اكتشف الباقات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductCard({
  product,
  owned,
  onPurchase,
}: {
  product: DigitalProduct;
  owned: boolean;
  onPurchase: () => void;
}) {
  const Icon = iconMap[product.icon] || FileText;
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 ${product.isFeatured ? "border-2 border-accent" : ""}`}>
      <div
        className="h-32 flex items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)` }}
      >
        <Icon className="w-16 h-16 text-white opacity-90" />
        {product.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            <Star className="w-3 h-3 ml-1 fill-current" />
            مميز
          </Badge>
        )}
        {owned && (
          <Badge className="absolute top-3 left-3 bg-emerald-500 text-white">
            <Check className="w-3 h-3 ml-1" />
            مشترى
          </Badge>
        )}
      </div>

      <CardContent className="pt-4 space-y-3">
        <div>
          <Badge variant="outline" className="text-xs mb-1">
            {productCategoryLabels[product.category]}
          </Badge>
          <h3 className="font-bold text-lg leading-tight">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{product.format}</Badge>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            {product.rating}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {product.downloads}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.oldPrice.toLocaleString("en-US")} دج
              </span>
            )}
            <span className="text-xl font-bold text-primary">
              {product.price.toLocaleString("en-US")} دج
            </span>
          </div>
        </div>

        <Button
          className="w-full gap-2"
          variant={owned ? "outline" : "default"}
          disabled={owned}
          onClick={onPurchase}
        >
          {owned ? (
            <>
              <Check className="w-4 h-4" />
              تحميل المنتج
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              اشترِ الآن
            </>
          )}
        </Button>
      </CardContent>
    </Card>
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

// ===================================================
//  أداة رسم الدوال التفاعلية — للطالب
// ===================================================
function FunctionPlotter() {
  const [expr, setExpr] = React.useState("x^2");
  const [xMin, setXMin] = React.useState(-5);
  const [xMax, setXMax] = React.useState(5);
  const [color, setColor] = React.useState("#A4133C");
  const [showExamples, setShowExamples] = React.useState(true);

  const examples = [
    { label: "متعددة الحدود", expr: "x^3 - 3*x", range: [-3, 3] as [number, number] },
    { label: "كسرية", expr: "(x^2 - 1)/(x + 2)", range: [-5, 5] as [number, number] },
    { label: "لوغاريتمية", expr: "Math.log(x)", range: [0.1, 10] as [number, number] },
    { label: "أسية", expr: "Math.exp(x)", range: [-3, 3] as [number, number] },
    { label: "مثلثية", expr: "Math.sin(x)", range: [-6.28, 6.28] as [number, number] },
    { label: "جذر", expr: "Math.sqrt(x)", range: [0, 10] as [number, number] },
    { label: "قيمة مطلقة", expr: "Math.abs(x)", range: [-5, 5] as [number, number] },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-3">
          <LineChart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          أداة رسم الدوال التفاعلية
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          اكتب أي دالة رياضية ورسمها بيانياً بشكل تفاعلي. مرّر الماوس لرؤية قيم x.
        </p>
      </div>

      {/* نموذج الإدخال */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" />
            أدخل الدالة
          </CardTitle>
          <CardDescription>استعمل صيغة JavaScript: x^2, Math.sin(x), Math.log(x), Math.exp(x), Math.sqrt(x)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fn-expr" className="block mb-2 font-bold">الدالة f(x) =</Label>
            <Input
              id="fn-expr"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="مثال: x^2 + 2*x - 1"
              className="font-mono text-lg"
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="x-min" className="block mb-2 font-bold">x (أدنى)</Label>
              <Input
                id="x-min"
                type="number"
                value={xMin}
                onChange={(e) => setXMin(parseFloat(e.target.value) || -5)}
                className="font-mono"
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="x-max" className="block mb-2 font-bold">x (أعلى)</Label>
              <Input
                id="x-max"
                type="number"
                value={xMax}
                onChange={(e) => setXMax(parseFloat(e.target.value) || 5)}
                className="font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <Label className="block mb-2 font-bold">لون المنحنى</Label>
            <div className="flex gap-2 flex-wrap">
              {["#A4133C", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-primary border-4" : "border-transparent"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الرسم البياني */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            الرسم البياني
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expr && xMax > xMin ? (
            <FunctionPlot
              functions={[{ expr, color, label: `f(x) = ${expr}`, width: 3 }]}
              xRange={[xMin, xMax]}
              height={400}
              title={`f(x) = ${expr}`}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>⚠️ تأكد من أن x (أعلى) أكبر من x (أدنى)</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* أمثلة جاهزة */}
      {showExamples && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-accent" />
              أمثلة جاهزة — اضغط لتجربتها
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {examples.map((ex, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="text-xs justify-start"
                  onClick={() => {
                    setExpr(ex.expr);
                    setXMin(ex.range[0]);
                    setXMax(ex.range[1]);
                  }}
                >
                  <span className="font-mono">{ex.expr}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-md p-4">
        💡 <strong>تلميح:</strong> يمكنك تجربة دوال معقدة مثل:
        <code className="bg-muted px-2 py-1 rounded mx-1" dir="ltr">(x^3 - 2*x)/(x + 1)</code>
        أو
        <code className="bg-muted px-2 py-1 rounded mx-1" dir="ltr">Math.sin(x) * Math.exp(-x/3)</code>
      </div>
    </div>
  );
}
