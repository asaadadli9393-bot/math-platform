import { NextRequest, NextResponse } from "next/server";

// ============================================================
//  API لتوليد الصوت من النص (TTS) — يدعم العربية
//  يستعمل z-ai-web-dev-sdk السحابي — يعمل على كل الأجهزة
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const { text, speed = 1.0 } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "النص مطلوب" }, { status: 400 });
    }

    if (text.length > 1024) {
      return NextResponse.json(
        { error: "النص طويل جداً (الحد الأقصى 1024 حرفاً)" },
        { status: 400 }
      );
    }

    // استيراد z-ai-web-dev-sdk (backend only)
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    // توليد الصوت
    const response = await zai.audio.tts.create({
      input: text.trim(),
      voice: "tongtong",
      speed: Math.min(Math.max(speed, 0.5), 2.0),
      response_format: "wav",
      stream: false,
    });

    // استخراج البيانات الصوتية
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    // إرجاع الصوت كـ WAV
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("TTS API Error:", error);
    return NextResponse.json(
      { error: "فشل توليد الصوت" },
      { status: 500 }
    );
  }
}
