"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, X, BookOpen, Calculator, TrendingUp, CircleDot, Dices, Box, Sigma, Divide, FileText, ClipboardCheck, Trophy, Video, Sparkles, Sun, Moon, Calendar, Check, Trash2 } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { MarkdownMath } from "@/components/math-renderer";

// ============================================================
//  SearchView — محرك بحث شامل في المنصة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

interface SearchResult {
  type: "lesson" | "exercise" | "unit" | "exam";
  unitTitle: string;
  unitSlug: string;
  chapterTitle: string;
  title: string;
  snippet: string;
  icon: string;
}

export function SearchView({ onNavigate }: { onNavigate: (view: string, slug?: string) => void }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [searching, setSearching] = React.useState(false);

  // بناء فهرس المحتوى
  const contentIndex = React.useMemo(() => {
    const index: SearchResult[] = [];
    for (const unit of curriculum) {
      for (const chapter of unit.chapters) {
        // إضافة الدروس
        for (const lesson of chapter.lessons) {
          index.push({
            type: "lesson",
            unitTitle: unit.title,
            unitSlug: unit.slug,
            chapterTitle: chapter.title,
            title: lesson.title,
            snippet: lesson.content?.substring(0, 150) || "",
            icon: unit.icon,
          });
        }
        // إضافة التمارين
        for (const exercise of chapter.exercises) {
          index.push({
            type: "exercise",
            unitTitle: unit.title,
            unitSlug: unit.slug,
            chapterTitle: chapter.title,
            title: exercise.title,
            snippet: exercise.statement?.substring(0, 150) || "",
            icon: unit.icon,
          });
        }
      }
    }
    return index;
  }, []);

  // البحث
  React.useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/);
    
    const filtered = contentIndex.filter((item) => {
      const searchText = `${item.title} ${item.snippet} ${item.unitTitle} ${item.chapterTitle}`.toLowerCase();
      return terms.every((term) => searchText.includes(term));
    }).slice(0, 20);
    
    setResults(filtered);
    setSearching(false);
  }, [query, contentIndex]);

  const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    lesson: BookOpen,
    exercise: FileText,
    unit: Calculator,
    exam: Trophy,
  };

  const typeLabels: Record<string, string> = {
    lesson: "درس",
    exercise: "تمرين",
    unit: "وحدة",
    exam: "امتحان",
  };

  // اقتراحات سريعة
  const suggestions = [
    "نهاية",
    "اشتقاق",
    "متتالية",
    "أعداد مركبة",
    "احتمالات",
    "تكامل",
    "معادلة تفاضلية",
    "جداء سلمي",
    "قسمة إقليدية",
    "لوغاريتم",
    "دالة أسية",
    "متتالية متجاورة",
  ];

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-3">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          البحث في المنصة
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ابحث في كل الدروس، التمارين، و الوحدات. اكتب كلمة أو عبارة.
        </p>
      </div>

      {/* صندوق البحث */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب كلمة للبحث... مثلاً: نهاية، اشتقاق، متتالية..."
              className="pr-10 text-lg"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* اقتراحات سريعة */}
          {!query && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground font-bold">اقتراحات شائعة:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نتائج البحث */}
      {searching ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">جارٍ البحث...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            وجدنا <strong className="text-primary">{results.length}</strong> نتيجة
          </p>
          {results.map((result, idx) => {
            const Icon = typeIcons[result.type] || FileText;
            return (
              <Card
                key={idx}
                className="cursor-pointer hover:shadow-md transition-all border-r-4 border-primary/30 hover:border-primary"
                onClick={() => onNavigate("curriculum", result.unitSlug)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[result.type]}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {result.unitTitle}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-base mb-1">{result.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.snippet}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : query.length >= 2 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>لا توجد نتائج لـ "{query}"</p>
            <p className="text-xs mt-2">جرّب كلمات أخرى أو تصفّح المنهاج</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

// ============================================================
//  StudentNotes — ملاحظات شخصية للطلاب
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

export function StudentNotes() {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [newNote, setNewNote] = React.useState("");
  const [newTag, setNewTag] = React.useState("");
  const [filterTag, setFilterTag] = React.useState<string | null>(null);

  // تحميل الملاحظات من localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("student-notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // حفظ
  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("student-notes", JSON.stringify(updated));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      content: newNote.trim(),
      tag: newTag.trim() || "عام",
      date: new Date().toLocaleDateString("ar-DZ"),
    };
    saveNotes([note, ...notes]);
    setNewNote("");
    setNewTag("");
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  interface Note {
    id: string;
    content: string;
    tag: string;
    date: string;
  }

  const allTags = Array.from(new Set(notes.map((n) => n.tag)));
  const filteredNotes = filterTag ? notes.filter((n) => n.tag === filterTag) : notes;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          ملاحظاتي الشخصية
        </CardTitle>
        <CardDescription>دوّن ملاحظاتك أثناء الدراسة — محفوظة على جهازك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* إضافة ملاحظة */}
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="اكتب ملاحظتك هنا..."
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="تصنيف (مثلاً: نهايات، اشتقاق)"
              className="flex-1"
            />
            <Button onClick={addNote} disabled={!newNote.trim()} className="gap-2">
              <FileText className="w-4 h-4" />
              حفظ
            </Button>
          </div>
        </div>

        {/* فلترة بالتصنيف */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filterTag === null ? "default" : "outline"}
              onClick={() => setFilterTag(null)}
            >
              الكل ({notes.length})
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                size="sm"
                variant={filterTag === tag ? "default" : "outline"}
                onClick={() => setFilterTag(tag)}
              >
                {tag} ({notes.filter((n) => n.tag === tag).length})
              </Button>
            ))}
          </div>
        )}

        {/* قائمة الملاحظات */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              لا توجد ملاحظات بعد. ابدأ بكتابة أول ملاحظة!
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 bg-muted/30 rounded-lg border-r-2 border-primary/30 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Badge variant="outline" className="text-xs mb-1">{note.tag}</Badge>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteNote(note.id)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
//  StudyPlanner — مخطط دراسة أسبوعي
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

interface StudyTask {
  id: string;
  day: string;
  unit: string;
  task: string;
  duration: string;
  done: boolean;
}

const defaultPlan: StudyTask[] = [
  { id: "1", day: "السبت", unit: "دراسة الدوال", task: "مراجعة: مجال التعريف + النهايات", duration: "ساعة", done: false },
  { id: "2", day: "الأحد", unit: "المتتاليات", task: "حل 5 تمارين على المتتاليات الحسابية", duration: "ساعة ونصف", done: false },
  { id: "3", day: "الإثنين", unit: "الدوال الأسية", task: "مراجعة خصائص الدالة الأسية", duration: "ساعة", done: false },
  { id: "4", day: "الثلاثاء", unit: "الأعداد المركبة", task: "حل 3 تمارين على الشكل الأسي", duration: "ساعة ونصف", done: false },
  { id: "5", day: "الأربعاء", unit: "الاحتمالات", task: "مراجعة التوزيع ذي الحدين", duration: "ساعة", done: false },
  { id: "6", day: "الخميس", unit: "التكامل", task: "حل 3 تمارين تكامل بالتجزئة", duration: "ساعتان", done: false },
  { id: "7", day: "الجمعة", unit: "مراجعة شاملة", task: "حل موضوع بكالوريا كامل (3 ساعات)", duration: "3 ساعات", done: false },
];

export function StudyPlanner() {
  const [plan, setPlan] = React.useState<StudyTask[]>(defaultPlan);

  React.useEffect(() => {
    const saved = localStorage.getItem("study-plan");
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const savePlan = (updated: StudyTask[]) => {
    setPlan(updated);
    localStorage.setItem("study-plan", JSON.stringify(updated));
  };

  const toggleDone = (id: string) => {
    savePlan(plan.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const completed = plan.filter((t) => t.done).length;
  const progress = (completed / plan.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          مخطط الدراسة الأسبوعي
        </CardTitle>
        <CardDescription>
          خطة دراسية منظمة لكل أيام الأسبوع — محفوظة على جهازك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* شريط التقدّم */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold">تقدّم الأسبوع</span>
            <span className="text-primary font-bold">{completed}/{plan.length} ({Math.round(progress)}%)</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* المهام */}
        <div className="space-y-2">
          {plan.map((task) => (
            <div
              key={task.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                task.done
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-card border-border hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleDone(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.done
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-muted-foreground/30 hover:border-primary"
                }`}
              >
                {task.done && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">{task.day}</Badge>
                  <Badge variant="outline" className="text-xs">{task.unit}</Badge>
                  <Badge variant="outline" className="text-xs">⏱️ {task.duration}</Badge>
                </div>
                <p className={`text-sm ${task.done ? "line-through text-muted-foreground" : ""}`}>
                  {task.task}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* إعادة تعيين */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => savePlan(plan.map((t) => ({ ...t, done: false })))}
        >
          إعادة تعيين الأسبوع
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================
//  DarkModeToggle — زر تبديل الوضع الليلي
// ============================================================

export function DarkModeToggle() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("dark-mode");
    if (saved === "true") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("dark-mode", newDark.toString());
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      title={dark ? "الوضع النهاري" : "الوضع الليلي"}
    >
      {dark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
