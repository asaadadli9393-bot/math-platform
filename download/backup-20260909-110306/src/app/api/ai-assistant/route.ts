import { NextRequest, NextResponse } from "next/server";

// ============================================================
//  API المساعد الذكي — منصة الرياضيات | الأستاذ عدلي أسعد
//  يستعمل z-ai-web-dev-sdk للإجابة على أسئلة الرياضيات بالعربية
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "السؤال مطلوب" }, { status: 400 });
    }

    // استيراد z-ai-web-dev-sdk
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    // بناء الـ prompt بالعربية
    const systemPrompt = `أنت مساعد ذكي لمنصة الرياضيات للأستاذ عدلي أسعد، مخصص لطلبة السنة الثالثة ثانوي في الجزائر (الشعب العلمية).
مهمتك: الإجابة على أسئلة الرياضيات بالعربية الفصحى بأسلوب واضح و pédagogique.

قواعد الإجابة:
1. اكتب بالعربية الفصحى
2. استعمل LaTeX للمعادلات بين $...$ (سطري) أو $$...$$ (بلوك)
3. اشرح خطوة بخطوة
4. ابدأ بـ "السلام عليكم 👋" فقط في أول رسالة
5. لو لم تفهم السؤال، اطلب توضيحاً
6. لو السؤال ليس رياضيات، اعتذر بأدب وحوّل للرياضيات
7. مدة الإجابة: 200-500 كلمة`;

    const userMessage = context
      ? `السياق: ${context}\n\nالسؤال: ${question}`
      : question;

    const response = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
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
