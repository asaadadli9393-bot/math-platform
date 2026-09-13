"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MarkdownMath } from "@/components/math-renderer";
import { Sparkles, Send, Loader2, RotateCcw, MessageCircle, Trash2, BookOpen, Calculator, TrendingUp, Sigma, Dices, Zap } from "lucide-react";
import { curriculum } from "@/data/curriculum";

// ============================================================
//  المساعد الذكي المتطور — منصة الرياضيات | الأستاذ عدلي أسعد
//  ذاكرة محادثة + أزرار سريعة + مستوعب المنهاج
// ============================================================

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  { icon: Calculator, label: "حل معادلة", prompt: "كيف أحل المعادلة $x^2 - 5x + 6 = 0$؟" },
  { icon: TrendingUp, label: "احسب نهاية", prompt: "كيف أحسب $\\lim_{x \\to +\\infty} \\frac{3x^2 + 1}{x^2 - 4}$؟" },
  { icon: Sigma, label: "اشتق دالة", prompt: "كيف أحسب مشتقة $f(x) = x^2 e^x$؟" },
  { icon: Dices, label: "احتمالات", prompt: "اشرح التوزيع ذي الحدين" },
  { icon: Zap, label: "نظرية", prompt: "اشرح مبرهنة القيم الوسيطة" },
  { icon: BookOpen, label: "متتالية", prompt: "كيف أدرس رتابة متتالية عودية؟" },
];

const SUGGESTED_QUESTIONS = [
  "كيف أحل معادلة من الدرجة الثانية؟",
  "ما هو تعريف النهاية؟",
  "اشرح لي المتتاليات الحسابية",
  "كيف أحسب مشتقة دالة كسرية؟",
  "ما هي الأعداد المركبة؟",
  "كيف أدرس رتابة دالة؟",
  "كيف أحسب تكامل بالتجزئة؟",
  "اشرح الجداء السلمي في الفضاء",
];

export function AIAssistant() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: `السلام عليكم 👋 أنا المساعد الذكي المتطور لمنصة الرياضيات.

يمكنني مساعدتك في:
- **الدوال**: مجال تعريف، نهايات، اشتقاق، تغيرات
- **المتتاليات**: حسابية، هندسية، عودية، نهايات
- **الدوال الأسية واللوغاريتمية**: خصائص، معادلات
- **الأعداد المركبة**: شكل جبري، أسي، هندسة
- **الاحتمالات**: شرطية، توزيع ذي الحدين
- **الحساب التكاملي**: تكامل بالتجزئة، تغيير متغير
- **هندسة الفضاء**: جداء سلمي، شعاعي، مستويات
- **الحساب**: قسمة إقليدية، بيزو، فيرما

اكتب سؤالك بالعربية واستعمل LaTeX للمعادلات (مثلاً: $x^2 + 1$).
يمكنك أيضاً استخدام الأزرار السريعة أدناه! ⬇️`,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text.trim(),
          history: updatedMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages([...updatedMessages, { role: "assistant", content: data.answer }]);
      } else {
        setError(data.error || "تعذّر الحصول على إجابة. حاول مرة أخرى.");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.");
    }
    setLoading(false);
  };

  const resetChat = () => {
    setMessages([messages[0]]);
    setError(null);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>المساعد الذكي</CardTitle>
              <CardDescription>يجيب على أسئلة الرياضيات بالعربية + LaTeX</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetChat} className="gap-1">
            <RotateCcw className="w-4 h-4" />
            محادثة جديدة
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* الأزرار السريعة */}
        {messages.length <= 1 && (
          <div className="space-y-3">
            <div className="text-sm font-bold text-muted-foreground flex items-center gap-1">
              <Zap className="w-4 h-4" />
              إجراءات سريعة:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(action.prompt)}
                  className="gap-2 justify-start"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              ))}
            </div>

            <div className="text-sm font-bold text-muted-foreground mt-3">
              أو اسأل مباشرة:
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Button
                  key={q}
                  variant="ghost"
                  size="sm"
                  onClick={() => sendMessage(q)}
                  className="text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* الرسائل */}
        <div ref={scrollRef} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.role === "assistant" ? (
                  <MarkdownMath content={msg.content} />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-end">
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">جارٍ التفكير...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2">
                <span>⚠️ {error}</span>
                <Button size="sm" variant="outline" onClick={() => sendMessage(messages[messages.length - 1].content)}>
                  إعادة
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* مربع الإدخال */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="اكتب سؤالك هنا..."
            disabled={loading}
          />
          <Button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} size="icon">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          المساعد الذكي يستعمل الذكاء الاصطناعي — قد يخطئ أحياناً. راجع الحلول.
        </p>
      </CardContent>
    </Card>
  );
}
