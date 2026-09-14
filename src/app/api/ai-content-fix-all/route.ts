// ============================================================
//  /api/ai-content-fix-all — إصلاح شامل تلقائي للمنصة كاملة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  يفحص كل وحدة + درس + تمرين في المنهاج
//  ويُطبّق القالب الموحّد + يصلح الأخطاء تلقائيًا
//  ويرجع تقريرًا شاملاً بالنتيجة.
//
//  الاستعمال:
//    POST /api/ai-content-fix-all
//    Authorization: Bearer adli2024
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60; // أقصى مدة على Vercel

interface FixedItem {
  unit: string;
  chapter?: string;
  lesson?: string;
  type: "lesson" | "exercise" | "exam";
  original: string;
  fixed: string;
  changes: Array<{ type: string; description: string }>;
  provider: string;
  model: string;
  success: boolean;
  error?: string;
}

export async function POST(req: NextRequest) {
  // التحقق من الصلاحية
  const authHeader = req.headers.get("authorization");
  const adminKey = process.env.ADMIN_KEY || "adli2024";
  if (authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json(
      { error: "غير مصرّح. استعمل Authorization: Bearer adli2024" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const options = {
      dryRun: body.dryRun === true, // تجفاف: فحص فقط بدون إصلاح
      limit: body.limit || 0, // 0 = كل المحتوى
      unitsOnly: body.unitsOnly || [], // قائمة وحدات محددة (بالعناوين)
    };

    // استيراد المنهاج
    const { curriculum } = require("@/data/curriculum");
    const { bacExams } = require("@/data/bac-exams");

    const fixedItems: FixedItem[] = [];
    const stats = {
      totalChecked: 0,
      totalFixed: 0,
      totalErrors: 0,
      byUnit: {} as Record<string, { checked: number; fixed: number; errors: number }>,
    };

    const templateGuide = `القالب الموحد لكل درس:
1. عنوان رئيسي (## عنوان)
2. تعريف (### تعريف)
3. خاصية (### خاصية)
4. أمثلة محلولة (### أمثلة)
5. نقاط أساسية (### نقاط أساسية)
لا تستعمل نصاً عربياً داخل \\text{} في LaTeX.`;

    // فحص وإصلاح كل وحدة + دروسها
    for (const unit of curriculum) {
      // فلترة إن حُدّدت وحدات معينة
      if (options.unitsOnly.length > 0 && !options.unitsOnly.includes(unit.title)) {
        continue;
      }

      if (!stats.byUnit[unit.title]) {
        stats.byUnit[unit.title] = { checked: 0, fixed: 0, errors: 0 };
      }

      // لكل فصل
      for (const chapter of unit.chapters || []) {
        // لكل درس
        for (const lesson of chapter.lessons || []) {
          stats.totalChecked++;
          stats.byUnit[unit.title].checked++;

          if (options.limit > 0 && stats.totalChecked > options.limit) {
            break;
          }

          const content = lesson.content || "";
          if (!content || content.length < 50) continue;

          const systemPrompt = `أنت مساعد ذكي لإصلاح وإثراء المحتوى الرياضي الجزائري.
${templateGuide}
القواعد: استعمل المصطلحات الجزائرية الرسمية (شعاع، اشتقاق، نهاية، لوغاريتم نيبيري).
أعد المحتوى المصلح كاملاً ثم قائمة التغييرات:
---CONTENT---
[المحتوى المصلح]
---CHANGES---
1. [نوع]: [وصف]
---END---`;

          const item: FixedItem = {
            unit: unit.title,
            chapter: chapter.title,
            lesson: lesson.title,
            type: "lesson",
            original: content.substring(0, 500),
            fixed: content,
            changes: [],
            provider: "local",
            model: "no-change",
            success: false,
          };

          try {
            const result = await chat(
              [
                { role: "system", content: systemPrompt },
                { role: "user", content: content.substring(0, 2000) },
              ],
              { temperature: 0.3, max_tokens: 1200 }
            );

            const answer = result.content;
            const contentMatch = answer.match(/---CONTENT---\n?([\s\S]*?)---(?:CHANGES|END)/);
            const changesMatch = answer.match(/---CHANGES---\n?([\s\S]*?)---END---/);

            const fixedContent = contentMatch?.[1]?.trim() || content;
            const changes: Array<{ type: string; description: string }> = [];
            if (changesMatch) {
              const lines = changesMatch[1].trim().split("\n");
              for (const line of lines) {
                const m = line.match(/^\d+\.\s*\[?(\w+)\]?:\s*(.+)/);
                if (m) {
                  changes.push({ type: m[1] || "fix", description: m[2].substring(0, 200) });
                }
              }
            }

            item.fixed = fixedContent;
            item.changes = changes;
            item.provider = result.provider;
            item.model = result.model;
            item.success = true;
            stats.totalFixed++;
            stats.byUnit[unit.title].fixed++;
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            item.error = msg;
            item.success = false;
            stats.totalErrors++;
            stats.byUnit[unit.title].errors++;
          }

          fixedItems.push(item);

          // إن لم يكن dryRun، نُحدّث المحتوى في الذاكرة (لا نحفظه في DB في هذا السكربت)
          // في الإصدار الحقيقي، يجب تحديث قاعدة البيانات هنا
          if (!options.dryRun && item.success) {
            // TODO: تحديث lesson.content في قاعدة البيانات
            // مؤقتًا: نرجع المحتوى المصلح للـ client ليقرّر ما يفعله به
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        dryRun: options.dryRun,
      },
      results: fixedItems,
      summary: {
        totalUnits: Object.keys(stats.byUnit).length,
        totalItems: fixedItems.length,
        successful: fixedItems.filter((i) => i.success).length,
        failed: fixedItems.filter((i) => !i.success).length,
        averageChanges:
          fixedItems.length > 0
            ? (
                fixedItems.reduce((acc, i) => acc + i.changes.length, 0) / fixedItems.length
              ).toFixed(1)
            : "0",
      },
      message: options.dryRun
        ? `اكتمل الفحص التجريبي لـ ${stats.totalChecked} عنصر، ${stats.totalFixed} قابل للإصلاح.`
        : `اكتمل الإصلاح الشامل: ${stats.totalFixed}/${stats.totalChecked} عنصر مُصلح بنجاح، ${stats.totalErrors} خطأ.`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Fix-all error:", msg);
    return NextResponse.json(
      {
        success: false,
        error: "تعذّر الإصلاح الشامل.",
        details: msg,
      },
      { status: 500 }
    );
  }
}

// GET — فحص فقط (dry run) للمعاينة قبل الإصلاح الفعلي
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const adminKey = process.env.ADMIN_KEY || "adli2024";
  if (authHeader !== `Bearer ${adminKey}`) {
    return NextResponse.json(
      { error: "غير مصرّح" },
      { status: 401 }
    );
  }

  // إعادة توجيه إلى POST مع dryRun=true
  const body = { dryRun: true, limit: 10 }; // أول 10 عناصر فقط للمعاينة
  // محاولة جلب البيانات مباشرة
  try {
    const { curriculum } = require("@/data/curriculum");
    const preview: Array<{
      unit: string;
      chapter: string;
      lesson: string;
      contentLength: number;
    }> = [];
    let count = 0;
    for (const unit of curriculum) {
      for (const chapter of unit.chapters || []) {
        for (const lesson of chapter.lessons || []) {
          if (count >= 10) break;
          preview.push({
            unit: unit.title,
            chapter: chapter.title,
            lesson: lesson.title,
            contentLength: (lesson.content || "").length,
          });
          count++;
        }
        if (count >= 10) break;
      }
      if (count >= 10) break;
    }
    return NextResponse.json({
      success: true,
      preview,
      totalUnits: curriculum.length,
      message: "هذه معاينة. استعمل POST لإصلاح فعلي.",
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: "فشل تحميل المعاينة", details: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
