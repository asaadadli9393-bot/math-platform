// ============================================================
//  scripts/generate-bac-exams-pdf.js
//  يولّد PDF لامتحانات البكالوريا (موضوع + حل + سلّم تنقيط)
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  لكل امتحان بكالوريا:
//  1. ملف الموضوع (نص الأسئلة فقط)
//  2. ملف الحل النموذجي المفصّل
//  3. ملف سلّم التنقيط الرسمي (توزيع النقاط)
// ============================================================

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const { bacExams } = require("../src/data/bac-exams.ts");
const { bacExamsExtra } = require("../src/data/bac-exams-extra.ts");
const { bacExamsComplete } = require("../src/data/bac-exams-complete.ts");
const allBacExams = [...bacExams, ...bacExamsExtra, ...bacExamsComplete];

const outputDir = path.join(__dirname, "..", "public", "bac-exams");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ============================================================
//  دوال مساعدة
// ============================================================

function processMathContent(text) {
  if (!text) return "";
  let html = text;
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');
  return '<p>' + html + '</p>';
}

function streamLabel(stream) {
  const labels = {
    "EXPERIMENTAL_SCIENCES": "شعبة العلوم التجريبية",
    "MATHEMATICS": "شعبة الرياضيات",
    "TECHNICAL_MATH": "شعبة التقني رياضي",
    "ALL": "شعب علمية",
  };
  return labels[stream] || stream;
}

// ============================================================
//  توليد HTML للموضوع
// ============================================================

function generateTopicHTML(exam) {
  const partsHTML = exam.parts.map((part, pi) => {
    const questionsHTML = (part.questions || [])
      .map((q) => `<div class="q">
        <div class="q-head">السؤال ${q.number} <span class="pts">${q.points || 0} نقطة</span></div>
        <div class="q-body">${processMathContent(q.statement)}</div>
      </div>`).join("");
    return `
      <div class="part">
        <h3>${part.title}</h3>
        ${questionsHTML}
      </div>
    `;
  }).join("");

  const totalPointsCheck = exam.parts.reduce((sum, p) => sum + p.questions.reduce((s, q) => s + (q.points || 0), 0), 0);

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>${exam.title} — الموضوع</title>
<link rel="stylesheet" href="/katex/katex.min.css">
<script src="/katex/katex.min.js"></script>
<script src="/katex/auto-render.min.js"></script>
<style>
@page{size:A4;margin:1.8cm 1.5cm 2cm 1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#ffffff}
body{font-family:'Cairo','Amiri',Tahoma,Arial,sans-serif;direction:rtl;color:#000;line-height:1.85;font-size:13px;max-width:210mm;margin:0 auto;padding:0}
.header{border:2px solid #000;padding:10px 14px;margin-bottom:18px;text-align:center;font-size:12px}
.header .title{font-size:16px;font-weight:900;margin-bottom:4px}
.header .subtitle{font-size:11px;color:#444;margin-bottom:6px}
.header .meta{display:flex;justify-content:space-around;flex-wrap:wrap;gap:10px;margin-top:6px;font-size:11px}
.header .meta div{padding:2px 8px;border:1px solid #999;border-radius:3px}
.warn{background:#fff8e1;border:1px solid #f5c842;padding:8px 12px;margin-bottom:18px;text-align:center;font-size:11px;border-radius:4px}
.part{margin-bottom:24px;page-break-inside:avoid}
.part h3{font-size:14px;font-weight:700;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:12px;text-align:right}
.q{margin:10px 0;padding:8px 0;border-bottom:1px dashed #ccc;page-break-inside:avoid}
.q-head{font-weight:700;margin-bottom:6px;font-size:12px;display:flex;justify-content:space-between;align-items:center}
.q-head .pts{font-size:11px;background:#e8e8e8;padding:2px 8px;border-radius:3px;border:1px solid #999}
.q-body{font-size:13px;line-height:1.9;padding-right:14px}
.q-body strong{color:#000}
.footer{margin-top:30px;padding-top:8px;border-top:1px solid #999;text-align:center;font-size:10px;color:#666}
.katex{font-size:1.0em}
.katex-display{margin:8px 0;text-align:center}
</style>
</head>
<body>
<div class="header">
  <div class="title">${exam.title}</div>
  <div class="subtitle">الأستاذ عدلي أسعد — منصة الرياضيات</div>
  <div class="meta">
    <div><strong>السنة:</strong> ${exam.year}</div>
    <div><strong>الشعبة:</strong> ${streamLabel(exam.stream)}</div>
    <div><strong>المدة:</strong> ${exam.duration}</div>
    <div><strong>المعامل:</strong> ${exam.coefficient}</div>
    <div><strong>المجموع:</strong> ${totalPointsCheck}/${exam.totalPoints}</div>
  </div>
</div>
<div class="warn">
  ⚠️ يُمنع استعمال الآلة الحاسبة في بعض المواضيع. اقرأ التعليمات بعناية. ساعة الرسم المعتمدة هي CTM-991ES.
</div>
${partsHTML}
<div class="footer">
  منصة الرياضيات — الأستاذ عدلي أسعد | asaadadli9393@gmail.com | الجزائر 🇩🇿
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ],
    throwOnError: false
  });
});
</script>
</body>
</html>`;
}

// ============================================================
//  توليد HTML للحل النموذجي
// ============================================================

function generateSolutionHTML(exam) {
  const partsHTML = exam.parts.map((part, pi) => {
    const questionsHTML = (part.questions || [])
      .map((q) => `<div class="q">
        <div class="q-head">السؤال ${q.number} <span class="pts">${q.points || 0} نقطة</span></div>
        <div class="q-body">${processMathContent(q.solution)}</div>
      </div>`).join("");
    return `
      <div class="part">
        <h3>${part.title}</h3>
        ${questionsHTML}
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>${exam.title} — الحل النموذجي</title>
<link rel="stylesheet" href="/katex/katex.min.css">
<script src="/katex/katex.min.js"></script>
<script src="/katex/auto-render.min.js"></script>
<style>
@page{size:A4;margin:1.8cm 1.5cm 2cm 1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#ffffff}
body{font-family:'Cairo','Amiri',Tahoma,Arial,sans-serif;direction:rtl;color:#000;line-height:1.85;font-size:13px;max-width:210mm;margin:0 auto;padding:0}
.header{border:2px solid #000;padding:10px 14px;margin-bottom:18px;text-align:center;font-size:12px}
.header .title{font-size:16px;font-weight:900;margin-bottom:4px}
.header .subtitle{font-size:11px;color:#444;margin-bottom:6px}
.header .meta{display:flex;justify-content:space-around;flex-wrap:wrap;gap:10px;margin-top:6px;font-size:11px}
.header .meta div{padding:2px 8px;border:1px solid #999;border-radius:3px}
.part{margin-bottom:24px;page-break-inside:avoid}
.part h3{font-size:14px;font-weight:700;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:12px;text-align:right}
.q{margin:10px 0;padding:10px;background:#f8f9fa;border-right:3px solid #444;border-radius:3px;page-break-inside:avoid}
.q-head{font-weight:700;margin-bottom:6px;font-size:12px;display:flex;justify-content:space-between;align-items:center}
.q-head .pts{font-size:11px;background:#e8e8e8;padding:2px 8px;border-radius:3px;border:1px solid #999}
.q-body{font-size:13px;line-height:1.9;padding-right:14px}
.q-body strong{background:#fff3a3;padding:1px 4px;border-radius:2px}
.footer{margin-top:30px;padding-top:8px;border-top:1px solid #999;text-align:center;font-size:10px;color:#666}
.katex{font-size:1.0em}
.katex-display{margin:8px 0;text-align:center}
</style>
</head>
<body>
<div class="header">
  <div class="title">✅ الحل النموذجي — ${exam.title}</div>
  <div class="subtitle">الحل النموذجي الرسمي المفصّل — الأستاذ عدلي أسعد</div>
  <div class="meta">
    <div><strong>السنة:</strong> ${exam.year}</div>
    <div><strong>الشعبة:</strong> ${streamLabel(exam.stream)}</div>
    <div><strong>المدة:</strong> ${exam.duration}</div>
  </div>
</div>
${partsHTML}
<div class="footer">
  منصة الرياضيات — الأستاذ عدلي أسعد | asaadadli9393@gmail.com | الجزائر 🇩🇿
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ],
    throwOnError: false
  });
});
</script>
</body>
</html>`;
}

// ============================================================
//  توليد HTML لسلّم التنقيط
// ============================================================

function generateRubricHTML(exam) {
  let qNum = 0;
  let totalAssigned = 0;
  const partsHTML = exam.parts.map((part, pi) => {
    const questionsHTML = (part.questions || []).map((q) => {
      qNum++;
      totalAssigned += q.points || 0;
      const rubricItems = (q.rubric && q.rubric.length > 0) ? q.rubric : [
        `الإجابة الصحيحة الكاملة: ${q.points} نقطة`,
        `نقص جزئي: -0.5 لكل خطأ منهجي`,
        `غياب التعليل: -0.25`,
      ];
      const rubricHTML = rubricItems.map((r) => `<li>${processMathContent(r)}</li>`).join("");
      return `
        <div class="q">
          <div class="q-head">السؤال ${q.number} <span class="pts">${q.points || 0} / ${exam.totalPoints}</span></div>
          <ul class="rubric">${rubricHTML}</ul>
        </div>
      `;
    }).join("");
    return `
      <div class="part">
        <h3>${part.title} — المجموع: ${part.points} نقطة</h3>
        ${questionsHTML}
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>${exam.title} — سلّم التنقيط</title>
<link rel="stylesheet" href="/katex/katex.min.css">
<script src="/katex/katex.min.js"></script>
<script src="/katex/auto-render.min.js"></script>
<style>
@page{size:A4;margin:1.8cm 1.5cm 2cm 1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#ffffff}
body{font-family:'Cairo','Amiri',Tahoma,Arial,sans-serif;direction:rtl;color:#000;line-height:1.7;font-size:12px;max-width:210mm;margin:0 auto;padding:0}
.header{border:2px solid #000;padding:10px 14px;margin-bottom:18px;text-align:center;font-size:12px;background:#fff8e1}
.header .title{font-size:16px;font-weight:900;margin-bottom:4px}
.header .subtitle{font-size:11px;color:#444;margin-bottom:6px}
.header .meta{display:flex;justify-content:space-around;flex-wrap:wrap;gap:10px;margin-top:6px;font-size:11px}
.header .meta div{padding:2px 8px;border:1px solid #999;border-radius:3px;background:#fff}
.summary{background:#f0f7ff;border:2px solid #4477aa;padding:10px 14px;margin-bottom:18px;border-radius:4px;font-size:12px}
.summary h4{font-size:13px;color:#224466;margin-bottom:6px}
.summary ul{list-style:none;padding:0}
.summary li{padding:3px 0;border-bottom:1px dotted #ccc}
.part{margin-bottom:18px;page-break-inside:avoid}
.part h3{font-size:13px;font-weight:700;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:8px;text-align:right;background:#f5f5f5;padding:6px 8px}
.q{margin:8px 0;padding:8px;border:1px solid #ddd;border-radius:3px;page-break-inside:avoid}
.q-head{font-weight:700;margin-bottom:6px;font-size:11px;display:flex;justify-content:space-between;align-items:center;padding-bottom:4px;border-bottom:1px solid #eee}
.q-head .pts{font-size:11px;background:#444;color:#fff;padding:2px 8px;border-radius:3px}
.rubric{padding-right:20px;font-size:11px;line-height:1.7}
.rubric li{margin-bottom:4px;padding:2px 6px;background:#fafafa;border-radius:2px}
.footer{margin-top:25px;padding-top:8px;border-top:1px solid #999;text-align:center;font-size:10px;color:#666}
.katex{font-size:1.0em}
.katex-display{margin:6px 0;text-align:center}
</style>
</head>
<body>
<div class="header">
  <div class="title">🎯 سلّم التنقيط الرسمي</div>
  <div class="subtitle">${exam.title} — الأستاذ عدلي أسعد</div>
  <div class="meta">
    <div><strong>السنة:</strong> ${exam.year}</div>
    <div><strong>الشعبة:</strong> ${streamLabel(exam.stream)}</div>
    <div><strong>المجموع الكلي:</strong> ${totalAssigned} / ${exam.totalPoints}</div>
  </div>
</div>
<div class="summary">
  <h4>📋 تعليمات التصحيح</h4>
  <ul>
    <li>• تُمنح النقطة كاملة عند الإجابة الصحيحة الكاملة (الحساب + التعليل).</li>
    <li>• تُخصم 0.25 نقطة عند غياب التعليل أو خطأ في الصياغة الرياضية.</li>
    <li>• تُخصم 0.5 نقطة عند خطأ منهجي يؤثر على النتيجة.</li>
    <li>• لا تُخصم نقاط على الأخطاء الحسابية غير المؤثرة على المنهجية.</li>
    <li>• <strong>النقطة 0</strong>: عند غياب الإجابة أو خطأ جوهري في الفهم.</li>
    <li>• <strong>المجموع النهائي يُقَعَّد على 20</strong> (إن كان أكثر، يُعتبر 20).</li>
  </ul>
</div>
${partsHTML}
<div class="footer">
  سلّم التنقيط الرسمي — منصة الرياضيات | الأستاذ عدلي أسعد | asaadadli9393@gmail.com
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ],
    throwOnError: false
  });
});
</script>
</body>
</html>`;
}

// ============================================================
//  التشغيل الرئيسي
// ============================================================

async function main() {
  console.log(`🚀 توليد ${allBacExams.length * 3} ملف PDF لامتحانات البكالوريا (${allBacExams.length} امتحان × 3 ملفات)...`);

  // توليد HTML
  for (const exam of allBacExams) {
    // الموضوع
    const topicFile = path.join(outputDir, `${exam.id}-topic.html`);
    fs.writeFileSync(topicFile, generateTopicHTML(exam), "utf-8");
    console.log(`✅ ${exam.id}-topic.html`);

    // الحل
    const solFile = path.join(outputDir, `${exam.id}-solution.html`);
    fs.writeFileSync(solFile, generateSolutionHTML(exam), "utf-8");
    console.log(`✅ ${exam.id}-solution.html`);

    // سلّم التنقيط
    const rubFile = path.join(outputDir, `${exam.id}-rubric.html`);
    fs.writeFileSync(rubFile, generateRubricHTML(exam), "utf-8");
    console.log(`✅ ${exam.id}-rubric.html`);
  }

  console.log(`\n📄 توليد PDF عبر Playwright...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const exam of allBacExams) {
    for (const suffix of ["topic", "solution", "rubric"]) {
      const slug = `${exam.id}-${suffix}`;
      const url = `http://localhost:3000/bac-exams/${slug}.html`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        await page.waitForTimeout(2000);
        const pdfFile = path.join(outputDir, `${slug}.pdf`);
        await page.pdf({
          path: pdfFile,
          format: 'A4',
          printBackground: true,
          margin: { top: '1.8cm', bottom: '2cm', left: '1.5cm', right: '1.5cm' }
        });
        console.log(`📄 ${slug}.pdf ✓`);
      } catch (err) {
        console.error(`❌ ${slug}.pdf:`, err.message);
      }
    }
  }

  await browser.close();
  console.log(`\n🎉 تم توليد ${allBacExams.length * 3} ملفات PDF في ${outputDir}`);
}

main().catch((err) => {
  console.error("خطأ:", err);
  process.exit(1);
});
