import { NextRequest, NextResponse } from "next/server";
import { tts } from "@/lib/llm";

// ============================================================
//  API لتوليد الصوت من النص (TTS) — يدعم العربية
//  يستعمل نظام متعدد المزوّدين:
//    1) Google Translate TTS (مجاني، يدعم العربية ممتاز)
//    2) Pollinations TTS (مجاني، بدون مفتاح)
//    3) Fallback WAV فارغ (44 بايت header)
// ============================================================

export const runtime = "nodejs";
export const maxDuration = 30;

// WAV فارغ (44 بايت header فقط) — يُرجع عند فشل كل المزوّدين
const EMPTY_WAV = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
  0x66, 0x6d, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00,
  0x44, 0xac, 0x00, 0x00, 0x88, 0x58, 0x01, 0x00, 0x02, 0x00, 0x10, 0x00,
  0x64, 0x61, 0x74, 0x61, 0x00, 0x00, 0x00, 0x00,
]);

export async function POST(req: NextRequest) {
  try {
    const { text, speed = 1.0, voice = "ar" } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "النص مطلوب" }, { status: 400 });
    }

    if (text.length > 1024) {
      return NextResponse.json(
        { error: "النص طويل جداً (الحد الأقصى 1024 حرفاً)" },
        { status: 400 }
      );
    }

    // توليد الصوت عبر النظام متعدد المزوّدين
    const result = await tts(text.trim(), voice);
    const buffer = Buffer.from(new Uint8Array(result.audio));

    // إن كان fallback فارغ، نرجع WAV header
    if (result.provider === "fallback-empty" || buffer.length < 100) {
      return new NextResponse(EMPTY_WAV, {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
          "Content-Length": EMPTY_WAV.length.toString(),
          "X-TTS-Status": "fallback",
          "X-Message": "TTS unavailable, returning empty audio",
          "Cache-Control": "no-cache",
        },
      });
    }

    // إرجاع MP3 الحقيقي
    const contentType = result.format === "mp3" ? "audio/mpeg" : `audio/${result.format}`;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "X-TTS-Provider": result.provider,
        "Cache-Control": "public, max-age=86400", // cache 24 ساعة
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("TTS API Error:", msg);
    // إرجاع WAV فارغ بدلًا من HTTP 500 (لا يكسر client)
    return new NextResponse(EMPTY_WAV, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": EMPTY_WAV.length.toString(),
        "X-TTS-Status": "error",
        "X-Error": msg.slice(0, 200),
        "Cache-Control": "no-cache",
      },
    });
  }
}
