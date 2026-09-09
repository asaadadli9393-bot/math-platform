"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownMath } from "@/components/math-renderer";
import { Sparkles, Send, Loader2, RotateCcw, MessageCircle } from "lucide-react";

// ============================================================
//  المساعد الذكي — منصة الرياضيات | الأستاذ عدلي أسعد
//  يجيب على أسئلة الرياضيات بالعربية باستعمال z-ai-web-dev-sdk
// ============================================================

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "كيف أحل معادلة من الدرجة الثانية؟",
  "ما هو تعريف النهاية؟",
  "اشرح لي المتتاليات الحسابية",
  "كيف أحسب مشتقة دالة كسرية؟",
  "ما هي الأعداد المركبة؟",
  "كيف أدرس رتابة دالة؟",
];

export function AIAssistant() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "السلام عليكم 👋 أنا المساعد الذكي لمنصة الرياضيات. يمكنني مساعدتك في:\n\n- **المتتاليات العددية**: تعريف، نهايات، رتابة\n- **الدوال**: مجال تعريف، اشتقاق، رتابة، نهايات\n- **الأعداد المركبة**: حل المعادلات، التمثيل الهندسي\n- **الاحتمالات**: التوزيعات، بايز\n- **الحساب التكاملي**: التكامل بالأجزاء\n\nاكتب سؤالك بالعربية واستعمل LaTeX للمعادلات (مثلاً: $x^2 + 1$).",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // التمرير لأسفل عند إضافة رسالة جديدة
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          context: messages.slice(-3).map(m => `${m.role}: ${m.content}`).join("\n"),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "حدث خطأ. حاول مرة أخرى.");
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ عذراً، حدث خطأ. حاول مرة أخرى." }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      }
    } catch (e: any) {
      setError(e.message);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ تعذّر الاتصال. تحقق من الإنترنت." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const reset = () => {
    setMessages([
      {
        role: "assistant",
        content: "السلام عليكم 👋 أنا المساعد الذكي لمنصة الرياضيات. كيف يمكنني مساعدتك؟",
      },
    ]);
    setError(null);
  };

  return (
    <Card className="border-2 border-primary/30 max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-l from-primary to-accent text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              المساعد الذكي
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              اسأل أي سؤال في رياضيات السنة الثالثة ثانوي
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* الرسائل */}
        <div
          ref={scrollRef}
          className="space-y-4 p-4 max-h-[500px] overflow-y-auto"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40"
                }`}
                dir="rtl"
              >
                <MarkdownMath content={msg.content} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted/40 rounded-2xl p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">جاري التفكير...</span>
              </div>
            </div>
          )}
        </div>

        {/* أسئلة مقترحة */}
        {messages.length <= 1 && !loading && (
          <div className="px-4 pb-2">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              أسئلة مقترحة:
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* إدخال الرسالة */}
        <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            disabled={loading}
            dir="rtl"
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>

        {error && (
          <div className="px-4 pb-3 text-sm text-red-600">{error}</div>
        )}
      </CardContent>
    </Card>
  );
}
