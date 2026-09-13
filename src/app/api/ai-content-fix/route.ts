// ============================================================
//  /api/ai-content-fix — إصلاح آلي + إثراء + توحيد القالب
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { content, mode } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "المحتوى مطلوب" }, { status: 400 });
    }

    const templateGuide = `القالب الموحد لكل درس:
1. عنوان رئيسي (## عنوان)
2. تعريف (### تعريف)
3. خاصية (### خاصية)
4. أمثلة محلولة (### أمثلة)
5. نقاط أساسية (### نقاط أساسية)
لا تستعمل نصاً عربياً داخل \\text{} في LaTeX.`;

    const systemPrompt = `أنت مساعد ذكي متطور لإصلاح وإثراء المحتوى الرياضي.
${templateGuide}
القواعد: استعمل المصطلحات الجزائرية الرسمية (شعاع، اشتقاق، نهاية، لوغاريتم نيبيري).
أعد المحتوى المصلح كاملاً ثم قائمة التغييرات:
---CONTENT---
[المحتوى المصلح]
---CHANGES---
1. [نوع]: [وصف]
---END---`;

    const result = await chat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: content.substring(0, 2500) },
      ],
      { temperature: 0.3, max_tokens: 1500 }
    );

    const answer = result.content;

    // استخراج
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

    return NextResponse.json({
      success: true,
      result: {
        original: content,
        fixed: fixedContent,
        changes,
        provider: result.provider,
        model: result.model,
        stats: {
          totalChanges: changes.length,
          byType: changes.reduce((acc, c) => {
            acc[c.type] = (acc[c.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Content fix error:", msg);
    return NextResponse.json(
      { success: false, error: "تعذّر الإصلاح.", details: msg },
      { status: 500 }
    );
  }
}
