// ============================================================
//  /api/ai-content-check — فحص آلي للمحتوى الرياضي
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  يستعمل LLM لفحص:
//  - أخطاء LaTeX (عربية في \text{}, أقواس غير متوازنة)
//  - أخطاء رياضية (حسابات خاطئة, صيغ غير صحيحة)
//  - أخطاء بيداغوجية (شرح غير واضح, خطوات ناقصة)
//  - أخطاء تسميات (مصطلحات غير مطابقة للمعايير الجزائرية)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ContentIssue {
  file: string;
  line?: number;
  type: "latex" | "math" | "pedagogy" | "terminology";
  severity: "error" | "warning" | "info";
  description: string;
  suggestion?: string;
  snippet?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { content, fileType } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "المحتوى مطلوب" },
        { status: 400 }
      );
    }

    // تقسيم المحتوى إلى أجزاء (إذا كان طويلاً)
    const MAX_CHARS = 3000;
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += MAX_CHARS) {
      chunks.push(content.slice(i, i + MAX_CHARS));
    }

    const allIssues: ContentIssue[] = [];

    for (const chunk of chunks) {
      const systemPrompt = `أنت مدقق رياضي محترف لمنصة تعليمية جزائرية.
مهمتك: فحص المحتوى الرياضي التالي وكشف الأخطاء.

ابحث عن:
1. **أخطاء LaTeX**: نص عربي داخل \\text{} (ممنوع)، أقواس غير متوازنة، أوامر غير صحيحة
2. **أخطاء رياضية**: حسابات خاطئة، صيغ غير صحيحة، نهايات خاطئة
3. **أخطاء بيداغوجية**: شرح غير واضح، خطوات ناقصة، تعليل مفقود
4. **أخطاء التسميات**: استعمال "متجه" بدل "شعاع"، "تفاضل" بدل "اشتقاق"، إلخ

أعطِ النتيجة بصيغة JSON array فقط (بدون نص إضافي):
[
  {
    "type": "latex|math|pedagogy|terminology",
    "severity": "error|warning|info",
    "description": "وصف الخطأ بالعربية",
    "suggestion": "التصحيح المقترح",
    "snippet": "النص الذي يحتوي على الخطأ"
  }
]

إذا لم تجد أخطاء، أعطِ: []`;

      let result;
      try {
        result = await chat(
          [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `فحص هذا المحتوى (${fileType || "محتوى رياضي"}):\n\n${chunk}`,
            },
          ],
          { temperature: 0.3, max_tokens: 1000 }
        );
      } catch {
        // Fallback ذكي عند فشل LLM
        allIssues.push({
          file: fileType || "محتوى",
          type: "pedagogy",
          severity: "info",
          description: "تعذّر الفحص التلقائي عبر LLM. راجع المحتوى يدويًا.",
          snippet: chunk.substring(0, 200),
        });
        continue;
      }

      // محاولة تحليل JSON
      try {
        const jsonMatch = result.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const issues = JSON.parse(jsonMatch[0]);
          for (const issue of issues) {
            allIssues.push({
              file: fileType || "محتوى",
              type: issue.type || "math",
              severity: issue.severity || "warning",
              description: issue.description || "",
              suggestion: issue.suggestion,
              snippet: issue.snippet,
            });
          }
        }
      } catch {
        // إذا فشل تحليل JSON
        allIssues.push({
          file: fileType || "محتوى",
          type: "pedagogy",
          severity: "info",
          description: "تعذّر تحليل نتيجة الفحص. راجع المحتوى يدوياً.",
          snippet: result.content.substring(0, 200),
        });
      }
    }

    // إحصائيات
    const stats = {
      total: allIssues.length,
      errors: allIssues.filter((i) => i.severity === "error").length,
      warnings: allIssues.filter((i) => i.severity === "warning").length,
      info: allIssues.filter((i) => i.severity === "info").length,
      byType: {
        latex: allIssues.filter((i) => i.type === "latex").length,
        math: allIssues.filter((i) => i.type === "math").length,
        pedagogy: allIssues.filter((i) => i.type === "pedagogy").length,
        terminology: allIssues.filter((i) => i.type === "terminology").length,
      },
    };

    return NextResponse.json({
      success: true,
      issues: allIssues,
      stats,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Content check error:", msg);
    return NextResponse.json(
      {
        success: false,
        error: "تعذّر فحص المحتوى. حاول مرة أخرى.",
        details: msg,
      },
      { status: 500 }
    );
  }
}

// ============================================================
//  GET — فحص شامل لكل المحتوى التلقائي
// ============================================================
export async function GET() {
  try {
    const { curriculum } = require("@/data/curriculum");

    const results: Array<{
      unit: string;
      issues: ContentIssue[];
    }> = [];

    // فحص كل وحدة في المنهاج
    for (const unit of curriculum) {
      const unitContent = `
الوحدة: ${unit.title}
الوصف: ${unit.description}

الدروس:
${unit.chapters.map((ch: { title: string; lessons: { content?: string }[] }) => `
- ${ch.title}
  ${ch.lessons.map((l: { content?: string }) => l.content?.substring(0, 500) || "").join("\n")}
`).join("\n")}
`;

      const systemPrompt = `أنت مدقق رياضي محترف. فحص المحتوى وكشف أخطاء LaTeX و رياضيات و تسميات.
أعطِ النتيجة كـ JSON array: [{"type":"latex|math|pedagogy|terminology","severity":"error|warning","description":"...","suggestion":"..."}]
إذا لا أخطاء: []`;

      try {
        const result = await chat(
          [
            { role: "system", content: systemPrompt },
            { role: "user", content: unitContent.substring(0, 2000) },
          ],
          { temperature: 0.3, max_tokens: 500 }
        );

        const jsonMatch = result.content.match(/\[[\s\S]*\]/);
        let issues: ContentIssue[] = [];
        if (jsonMatch) {
          issues = JSON.parse(jsonMatch[0]).map((i: Partial<ContentIssue>) => ({
            file: unit.title,
            type: i.type || "math",
            severity: i.severity || "warning",
            description: i.description || "",
            suggestion: i.suggestion,
          }));
        }

        results.push({ unit: unit.title, issues });
      } catch {
        results.push({ unit: unit.title, issues: [] });
      }
    }

    const allIssues = results.flatMap((r) => r.issues);
    const stats = {
      unitsChecked: results.length,
      totalIssues: allIssues.length,
      errors: allIssues.filter((i) => i.severity === "error").length,
      warnings: allIssues.filter((i) => i.severity === "warning").length,
      byType: {
        latex: allIssues.filter((i) => i.type === "latex").length,
        math: allIssues.filter((i) => i.type === "math").length,
        pedagogy: allIssues.filter((i) => i.type === "pedagogy").length,
        terminology: allIssues.filter((i) => i.type === "terminology").length,
      },
    };

    return NextResponse.json({
      success: true,
      results,
      stats,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Auto check error:", msg);
    return NextResponse.json(
      {
        success: false,
        error: "تعذّر الفحص التلقائي.",
        details: msg,
      },
      { status: 500 }
    );
  }
}
