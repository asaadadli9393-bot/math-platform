import { NextRequest, NextResponse } from "next/server";

// ============================================================
//  API المساعد الذكي — منصة الرياضيات | الأستاذ عدلي أسعد
//  يستعمل z-ai-web-dev-sdk للإجابة على أسئلة الرياضيات بالعربية
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const { question, history } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "السؤال مطلوب" }, { status: 400 });
    }

    // استيراد z-ai-web-dev-sdk
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    // بناء الـ prompt بالعربية — متطور مع سياق المنهاج
    const systemPrompt = `أنت مساعد ذكي متطور لمنصة الرياضيات للأستاذ عدلي أسعد، مخصص لطلبة السنة الثالثة ثانوي في الجزائر (الشعب العلمية: علوم تجريبية، رياضيات، تقني رياضي).

مهمتك: الإجابة على أسئلة الرياضيات بالعربية الفصحى بأسلوب واضح وpedagogique.

المنهاج المقرر (تدرّج 2022):
- الفصل 1: دراسة الدوال (نهايات، استمرارية، اشتقاق) + المتتاليات
- الفصل 2: الدالة الأسية + اللوغاريتم النيبيري + الأعداد المركبة + الاحتمالات
- الفصل 3: الحساب التكاملي + المعادلات التفاضلية + هندسة الفضاء + الحساب (شعبة رياضيات)

قواعد الإجابة:
1. اكتب بالعربية الفصحى
2. استعمل LaTeX للمعادلات بين $...$ (سطري) أو $$...$$ (بلوك)
3. اشرح خطوة بخطوة مع التعليق على كل خطوة
4. لا تبدأ بـ "السلام عليكم" إلا في أول محادثة فقط
5. لو لم تفهم السؤال، اطلب توضيحاً
6. لو السؤال ليس رياضيات، اعتذر بأدب وحوّل للرياضيات
7. اذكر اسم المحور المناسب من المنهاج إذا كان السؤال مرتبطاً به
8. اقترح تمريناً مشابهاً في نهاية الإجابة
9. مدة الإجابة: 200-500 كلمة
10. استعمل المصطلحات الجزائرية الرسمية: شعاع (بدل متجه)، اشتقاق (بدل تفاضل)، نهاية (بدل حد)، لوغاريتم نيبيري

مستوى الأسئلة: بكالوريا (Terminale S in Algeria).`;

    // بناء رسائل المحادثة مع الذاكرة
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // إضافة تاريخ المحادثة (آخر 6 رسائل)
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          });
        }
      }
    }

    // إضافة السؤال الحالي
    messages.push({ role: "user", content: question });

    const response = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const answer = response.choices?.[0]?.message?.content || "عذراً، لم أتمكن من الإجابة. حاول مرة أخرى.";

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "تعذّر الاتصال بالمساعد الذكي. حاول مرة أخرى.",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
