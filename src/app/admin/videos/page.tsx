"use client";

// ============================================================
//  /app/admin/videos — صفحة رفع الفيديوهات
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  - رفع ملف MP4 عبر /api/admin/upload-video (Bearer ADMIN_KEY)
//    يحفظ الملف في public/videos/{lessonSlug}.mp4
//  - دليل إنشاء الفيديوهات:
//    * Explain Everything (لوحة تفاعلية)
//    * OBS Studio (تسجيل الشاشة)
//    * Notability (iPad)
//  - يقرأ التوكن من localStorage (STORAGE_KEY = "math_admin_key")
// ============================================================

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Video as VideoIcon,
  Upload,
  ArrowRight,
  Monitor,
  Tablet,
  PenTool,
  RefreshCw,
  CheckCircle2,
  FileVideo,
  ExternalLink,
  Lock,
  AlertTriangle,
} from "lucide-react";

const STORAGE_KEY = "math_admin_key";

// ============================================================
//  أنواع
// ============================================================

interface UploadResult {
  success: boolean;
  video?: {
    title: string;
    lessonSlug: string;
    fileName: string;
    filePath: string;
    fileSize: number;
  };
  error?: string;
}

// ============================================================
//  الصفحة الرئيسية
// ============================================================

export default function AdminVideosPage() {
  const { toast } = useToast();
  const [token, setToken] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // استرجاع التوكن من localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setToken(saved);
    } catch {
      // تجاهل
    }
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <RefreshCw className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!token) {
    return <NoAccessScreen />;
  }

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <VideoIcon className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">رفع الفيديوهات</h1>
              <p className="text-xs text-muted-foreground">
                منصة الرياضيات — الأستاذ عدلي أسعد
              </p>
            </div>
          </div>
          <a
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-sm font-medium hover:bg-accent"
          >
            <ArrowRight className="size-4" />
            العودة للوحة
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-4 px-4 py-6">
        <UploadCard token={token} onError={toast} />
        <GuideCard />
      </main>

      <footer className="border-t bg-background py-4">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          © منصة الرياضيات — الأستاذ عدلي أسعد
        </div>
      </footer>
    </div>
  );
}

// ============================================================
//  شاشة "لا يوجد وصول"
// ============================================================

function NoAccessScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4" dir="rtl">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-destructive/10">
            <Lock className="size-7 text-destructive" />
          </div>
          <CardTitle>يجب تسجيل الدخول</CardTitle>
          <CardDescription>
            للوصول إلى صفحة رفع الفيديوهات، سجّل الدخول إلى لوحة الإدارة أولاً.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="/admin"
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowRight className="size-4" />
            الذهاب إلى لوحة الإدارة
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
//  بطاقة رفع فيديو
// ============================================================

function UploadCard({
  token,
  onError,
}: {
  token: string;
  onError: (toast: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => void;
}) {
  const toast = onError;
  const [file, setFile] = React.useState<File | null>(null);
  const [lessonSlug, setLessonSlug] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [result, setResult] = React.useState<UploadResult["video"] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setResult(null);
    if (f && !lessonSlug) {
      // نولّد lessonSlug من اسم الملف تلقائياً
      const base = f.name.replace(/\.mp4$/i, "");
      const slug = base
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9_-]/g, "")
        .replace(/-+/g, "-")
        .slice(0, 80);
      setLessonSlug(slug);
      if (!title) setTitle(base);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "تنبيه", description: "اختر ملف MP4 أولاً", variant: "destructive" });
      return;
    }
    if (!lessonSlug.trim()) {
      toast({ title: "تنبيه", description: "أدخل lessonSlug (اسم ملف الفيديو)", variant: "destructive" });
      return;
    }
    if (file.size > 512 * 1024 * 1024) {
      toast({
        title: "ملف كبير جداً",
        description: "الحد الأقصى 500 MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lessonSlug", lessonSlug.trim());
      if (title.trim()) formData.append("title", title.trim());

      // محاكاة تقدم الرفع (لأن fetch لا يوفر تقدّماً فعلياً)
      const progressTimer = setInterval(() => {
        setProgress((p) => Math.min(p + 5, 90));
      }, 200);

      const res = await fetch("/api/admin/upload-video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressTimer);
      setProgress(100);

      const data: UploadResult = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setResult(data.video ?? null);
      toast({ title: "تم الرفع", description: `الفيديو محفوظ في ${data.video?.filePath}` });
      setFile(null);
      setLessonSlug("");
      setTitle("");
      // إعادة تعيين حقل الملف
      const fileInput = document.getElementById("file-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      toast({
        title: "فشل الرفع",
        description: err instanceof Error ? err.message : "خطأ غير معروف",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="size-5" />
          رفع فيديو MP4
        </CardTitle>
        <CardDescription>
          يُرفع الملف إلى <code className="rounded bg-muted px-1">public/videos/{"{lessonSlug}"}.mp4</code>
          ويمكن الوصول إليه عبر الرابط النسبي بعد الرفع.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="file-input">ملف الفيديو (MP4)</Label>
            <Input
              id="file-input"
              type="file"
              accept="video/mp4,.mp4"
              onChange={handleFileChange}
              required
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                <FileVideo className="inline-block size-3 align-text-bottom" />
                {file.name} — {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="lesson-slug">Lesson Slug (اسم الملف)</Label>
              <Input
                id="lesson-slug"
                type="text"
                value={lessonSlug}
                onChange={(e) => setLessonSlug(e.target.value)}
                placeholder="مثلاً: sequences-intro"
                required
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground" dir="ltr">
                الملف النهائي: /videos/{lessonSlug || "{slug}"}.mp4
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">عنوان الفيديو (اختياري)</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مقدمة في المتتاليات"
              />
            </div>
          </div>

          {uploading && progress > 0 && (
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                جارٍ الرفع... {progress}%
              </p>
            </div>
          )}

          <Button type="submit" disabled={uploading || !file || !lessonSlug.trim()}>
            {uploading ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                جارٍ الرفع...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                رفع الفيديو
              </>
            )}
          </Button>

          {result && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                    تم رفع الفيديو بنجاح
                  </p>
                  <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300" dir="ltr">
                    المسار: {result.filePath}
                  </p>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    الحجم: {(result.fileSize / 1024 / 1024).toFixed(1)} MB
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={result.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-100 px-3 text-xs font-medium text-emerald-800 hover:bg-emerald-200 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                    >
                      <ExternalLink className="size-3" />
                      معاينة الفيديو
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================================
//  بطاقة دليل إنشاء الفيديوهات
// ============================================================

function GuideCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="size-5" />
          دليل إنشاء فيديوهات تعليمية
        </CardTitle>
        <CardDescription>
          ثلاث أدوات موصى بها لتسجيل شروحات الرياضيات بالصوت والكتابة اليدوية.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Explain Everything */}
        <GuideItem
          icon={<PenTool className="size-5 text-purple-600" />}
          title="Explain Everything"
          subtitle="لوحة تفاعلية للتسجيل بالكتابة اليدوية"
          steps={[
            "حمّل Explain Everything على جهازك اللوحي (iPad/Android).",
            "أنشئ مشروعاً جديداً واختر خلفية بيضاء (أو شبكة).",
            "اضغط زر التسجيل (الدائرة الحمراء) وابدأ الشرح.",
            "يمكنك إضافة صفحات متعددة لكل خطوة من الحل.",
            "صدّر المشروع بتنسيق MP4: File → Export → Video (MP4).",
            "سمّ الملف الناتج بـ lessonSlug وارفعه هنا.",
          ]}
          link={{ href: "https://explaineverything.com", label: "الموقع الرسمي" }}
        />

        {/* OBS Studio */}
        <GuideItem
          icon={<Monitor className="size-5 text-blue-600" />}
          title="OBS Studio"
          subtitle="تسجيل الشاشة — مجاني ومفتوح المصدر"
          steps={[
            "حمّل OBS Studio من الموقع الرسمي لنظام التشغيل لديك.",
            "أضف مصدر Display Capture لالتقاط الشاشة كاملة.",
            "أضف مصدر Audio Input Capture لالتقاط الميكروفون.",
            "اضبط الإخراج: Settings → Output → Recording Path + Format=mp4.",
            "اضبط الدقة: Settings → Video → 1920×1080، 30 fps.",
            "ابدأ التسجيل (Start Recording)، ثم افتح PowerPoint/OneNote وابدأ الشرح.",
            "توقف التسجيل، ثم سمّ الملف وارفعه هنا.",
          ]}
          link={{ href: "https://obsproject.com", label: "الموقع الرسمي" }}
        />

        {/* Notability */}
        <GuideItem
          icon={<Tablet className="size-5 text-orange-600" />}
          title="Notability (iPad)"
          subtitle="تطبيق الكتابة اليدوية مع تسجيل الصوت"
          steps={[
            "حمّل Notability من App Store على iPad.",
            "أنشئ ملاحظة جديدة وافتحها.",
            "اضغط زر التسجيل (الدائرة الحمراء) في الأعلى.",
            "اكتب الحل بالقلم (Apple Pencil) واشرح بالصوت.",
            "بعد الانتهاء: Share → Export → MP4.",
            "ارفع الملف الناتج هنا.",
          ]}
          link={{ href: "https://notability.com", label: "الموقع الرسمي" }}
        />

        {/* نصائح عامة */}
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">نصائح عامة قبل الرفع:</p>
              <ul className="mt-1 list-disc space-y-1 pr-4 text-sm">
                <li>دقة الفيديو: 1080p (1920×1080) أو 720p كحد أدنى.</li>
                <li>معدل الإطارات: 30 fps كافٍ للشروحات.</li>
                <li>الصوت: ميكروفون هادئ، رياضية واضحة.</li>
                <li>الحجم النهائي: حاول أن يكون أقل من 200 MB للفيديو القصير.</li>
                <li>الاسم: استعمل lessonSlug واضح بالإنجليزية (مثلاً: sequences-ch1-intro).</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GuideItem({
  icon,
  title,
  subtitle,
  steps,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  steps: string[];
  link: { href: string; label: string };
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1 rounded-md border bg-background px-2 text-xs font-medium hover:bg-accent"
            >
              <ExternalLink className="size-3" />
              {link.label}
            </a>
          </div>
          <ol className="mt-3 space-y-1.5 pr-4 text-sm">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
