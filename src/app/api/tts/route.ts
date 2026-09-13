import { NextRequest, NextResponse } from "next/server";
import { tts } from "@/lib/llm";

// ============================================================
//  API لتوليد الصوت من النص (TTS) — يدعم العربية
//  يستعمل Pollinations TTS السحابي (مجاني، بدون مفتاح)
// ============================================================

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { text, speed = 1.0, voice = "tongtong" } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "النص مطلوب" }, { status: 400 });
    }

    if (text.length > 1024) {
      return NextResponse.json(
        { error: "النص طويل جداً (الحد الأقصى 1024 حرفاً)" },
        { status: 400 }
      );
    }

    // توليد الصوت عبر Pollinations (مجاني)
    const result = await tts(text.trim(), voice);

    const buffer = Buffer.from(new Uint8Array(result.audio));

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": `audio/${result.format}`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("TTS API Error:", msg);
    return NextResponse.json(
      { error: "فشل توليد الصوت", details: msg },
      { status: 500 }
    );
  }
}
