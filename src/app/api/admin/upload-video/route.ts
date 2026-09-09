// ============================================================
//  /api/admin/upload-video — رفع فيديو MP4 إلى public/videos
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST (multipart/form-data):
//    - file: MP4 file (مطلوب)
//    - lessonSlug: string (مطلوب) — اسم الملف النهائي: {lessonSlug}.mp4
//    - title?: string (اختياري)
//  محمي بـ Authorization: Bearer ADMIN_KEY
//  يحفظ الملف في public/videos/{lessonSlug}.mp4
//  ويعيد URL نسبي: /videos/{lessonSlug}.mp4
// ============================================================

import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 512 * 1024 * 1024; // 500 MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "videos");
const ALLOWED_EXT = [".mp4"];

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * تنظيف اسم lessonSlug ليكون آمناً كاسم ملف:
 * فقط أحرف أبجدية رقمية وشرطات (-) وشرطات سفلية (_).
 */
function sanitizeSlug(slug: string): string {
  const cleaned = slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/_+/g, "_")
    .slice(0, 80);
  return cleaned;
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — Bearer ADMIN_KEY مطلوب" },
      { status: 401 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "متوقع multipart/form-data" },
      { status: 400 }
    );
  }

  const file = form.get("file");
  const lessonSlugRaw = String(form.get("lessonSlug") ?? "").trim();
  const title = String(form.get("title") ?? "").trim() || lessonSlugRaw;

  if (!(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "ملف 'file' مطلوب" },
      { status: 400 }
    );
  }
  if (!lessonSlugRaw) {
    return NextResponse.json(
      { success: false, error: "lessonSlug مطلوب" },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        success: false,
        error: `الملف أكبر من الحد المسموح (500 MB). الحالي: ${Math.round(file.size / 1024 / 1024)} MB`,
      },
      { status: 413 }
    );
  }

  const ext = path.extname(file.name || "").toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    return NextResponse.json(
      {
        success: false,
        error: `الامتداد غير مسموح. المسموح: ${ALLOWED_EXT.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const lessonSlug = sanitizeSlug(lessonSlugRaw);
  if (!lessonSlug) {
    return NextResponse.json(
      { success: false, error: "lessonSlug غير صالح بعد التنظيف" },
      { status: 400 }
    );
  }

  try {
    await ensureUploadDir();

    // اسم الملف النهائي: {lessonSlug}.mp4
    const fileName = `${lessonSlug}.mp4`;
    const filePathAbs = path.join(UPLOAD_DIR, fileName);
    const filePathRel = `/videos/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePathAbs, Buffer.from(arrayBuffer));

    return NextResponse.json({
      success: true,
      video: {
        title,
        lessonSlug,
        fileName,
        filePath: filePathRel,
        fileSize: file.size,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "Upload failed", detail: msg },
      { status: 500 }
    );
  }
}
