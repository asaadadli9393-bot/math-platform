// ============================================================
//  scripts/generate-trimester-exams-pdf.js
//  يولّد PDF للفروض والاختبارات الفصلية (18 ملف PDF)
//  - 3 فصول × 3 امتحانات × (موضوع + حل) = 18 ملف
//  - محتوى شامل (4-5 تمارين لكل امتحان، 8-12 سؤال لكل تمرين)
//  - مستوى بكالوريا حقيقي مع براهين و مسائل مركّبة
// ============================================================

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

// قراءة المحتوى من ملفات TS
const { trimesterExamsContent } = require("../src/data/trimester-exams-content.ts");
const { trimesterExamsContentP2 } = require("../src/data/trimester-exams-content-2.ts");
const examsContent = [...trimesterExamsContent, ...trimesterExamsContentP2];

const outputDir = path.join(__dirname, "..", "public", "courses");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ============================================================
//  دوال مساعدة
// ============================================================

function slugify(trimester, type, number, isSolution) {
  const t = `trimester${trimester}`;
  const ty = type === "فرض" ? `fard${number}` : "exam";
  return `${t}-${ty}${isSolution ? "-solution" : ""}`;
}

function processMathContent(text) {
  if (!text) return "";
  let html = text;
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^\s*(\d+\)|•|-)\s+(.*)$/gm, '<li>$2</li>');
  html = html.replace(/\n/g, '<br/>');
  return html;
}

// ============================================================
//  توليد HTML للموضوع
// ============================================================

function generateTopicHTML(exam) {
  const exercisesHTML = exam.topic.exercises.map((ex, idx) => {
    const questionsHTML = (ex.questions || [])
      .map((q, qi) => `<li class="question">${processMathContent(q)}</li>`)
      .join("");
    return `
      <div class="exercise">
        <div class="ex-header">📝 ${ex.statement.replace(/\*\*/g, "")}</div>
        ${questionsHTML ? `<ol class="questions">${questionsHTML}</ol>` : ""}
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>${exam.title} — الموضوع</title>
<link rel="stylesheet" href="/katex/katex.min.css">
<script src="/katex/katex.min.js"></script>
<script src="/katex/auto-render.min.js"></script>
<style>
@page{size:A4;margin:1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Cairo',Tahoma,Arial,sans-serif;direction:rtl;max-width:210mm;margin:0 auto;padding:25px;color:#1a1a2e;line-height:1.9;font-size:12px}
.cover{text-align:center;padding:35px 20px;background:linear-gradient(135deg,#1e40af,#1e3a8a);border-radius:16px;color:white;margin-bottom:25px;page-break-after:avoid}
.cover .badge{display:inline-block;background:rgba(255,255,255,0.2);padding:6px 18px;border-radius:20px;font-size:12px;margin-bottom:15px}
.cover h1{font-size:24px;font-weight:900;margin-bottom:5px}
.cover .subtitle{font-size:13px;opacity:0.9;margin:5px 0}
.cover .info{display:flex;justify-content:center;flex-wrap:wrap;gap:20px;margin-top:18px;font-size:11px;opacity:0.95}
.info-item{display:flex;align-items:center;gap:5px}
.exam-meta{background:#f1f5f9;border-right:4px solid #1e40af;padding:15px 20px;border-radius:8px;margin-bottom:25px;font-size:12px}
.exam-meta .row{display:flex;justify-content:space-between;padding:3px 0}
.exam-meta .label{font-weight:700;color:#1e40af}
.exercise{background:white;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:20px;padding:18px 22px;page-break-inside:avoid;box-shadow:0 2px 6px rgba(0,0,0,0.05)}
.ex-header{font-weight:700;color:#1e40af;font-size:14px;margin-bottom:12px;padding-bottom:10px;border-bottom:2px dashed #cbd5e1;line-height:1.6}
.questions{list-style:none;padding-right:0;margin-top:10px}
.questions li{padding:10px 12px;background:#f8fafc;border-radius:6px;margin-top:8px;border-right:3px solid #64748b;line-height:1.8}
.questions li strong{color:#1e40af}
.footer{text-align:center;margin-top:30px;padding:20px;background:#1a1a2e;border-radius:12px;color:white;page-break-inside:avoid}
.footer h3{color:#fbbf24;font-size:16px;margin-bottom:5px}
.footer p{font-size:11px;opacity:0.8}
.katex{font-size:1.0em}
.katex-display{margin:10px 0;text-align:center;padding:8px;background:#f8fafc;border-radius:6px;overflow-x:auto}
</style>
</head>
<body>
<div class="cover">
  <div class="badge">${exam.type} ${exam.number}</div>
  <h1>${exam.title}</h1>
  <div class="subtitle">منصة الرياضيات — الأستاذ عدلي أسعد</div>
  <div class="info">
    <div class="info-item">⏱️ المدة: ${exam.duration}</div>
    <div class="info-item">📅 ${exam.date}</div>
    <div class="info-item">🎓 ${exam.stream}</div>
  </div>
</div>
<div class="exam-meta">
  <div class="row"><span class="label">المادة:</span> <span>الرياضيات — السنة الثالثة ثانوي</span></div>
  <div class="row"><span class="label">النوع:</span> <span>${exam.type} رقم ${exam.number}</span></div>
  <div class="row"><span class="label">الفصل الدراسي:</span> <span>الفصل ${exam.trimester}</span></div>
  <div class="row"><span class="label">المدة:</span> <span>${exam.duration}</span></div>
  <div class="row"><span class="label">عدد التمارين:</span> <span>${exam.topic.exercises.length} تمارين شاملة</span></div>
</div>
${exercisesHTML}
<div class="footer">
  <h3>منصة الرياضيات</h3>
  <p>منصة تعليمية لطلبة السنة الثالثة ثانوي — الجزائر 🇩🇿</p>
  <p>📧 asaadadli9393@gmail.com | بإشراف الأستاذ عدلي أسعد</p>
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
  const exercisesHTML = exam.solution.exercises.map((ex, idx) => {
    const stepsHTML = (ex.steps || [])
      .map((s, si) => `<div class="step"><span class="step-num">${si + 1})</span><div class="step-content">${processMathContent(s)}</div></div>`)
      .join("");
    return `
      <div class="exercise">
        <div class="ex-header">${ex.statement.replace(/\*\*/g, "")}</div>
        <div class="steps">${stepsHTML}</div>
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
@page{size:A4;margin:1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Cairo',Tahoma,Arial,sans-serif;direction:rtl;max-width:210mm;margin:0 auto;padding:25px;color:#1a1a2e;line-height:1.9;font-size:12px}
.cover{text-align:center;padding:35px 20px;background:linear-gradient(135deg,#15803d,#166534);border-radius:16px;color:white;margin-bottom:25px;page-break-after:avoid}
.cover .badge{display:inline-block;background:rgba(255,255,255,0.2);padding:6px 18px;border-radius:20px;font-size:12px;margin-bottom:15px}
.cover h1{font-size:24px;font-weight:900;margin-bottom:5px}
.cover .subtitle{font-size:13px;opacity:0.9;margin:5px 0}
.cover .info{display:flex;justify-content:center;flex-wrap:wrap;gap:20px;margin-top:18px;font-size:11px;opacity:0.95}
.exercise{background:white;border:1px solid #d1fae5;border-radius:12px;margin-bottom:20px;padding:18px 22px;page-break-inside:avoid;box-shadow:0 2px 6px rgba(0,0,0,0.05)}
.ex-header{font-weight:700;color:#166534;font-size:14px;margin-bottom:12px;padding-bottom:10px;border-bottom:2px dashed #86efac;line-height:1.6}
.steps{display:flex;flex-direction:column;gap:10px}
.step{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;background:#f0fdf4;border-radius:8px;border-right:3px solid #10b981}
.step-num{font-weight:700;color:#047857;flex-shrink:0;background:#d1fae5;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:11px}
.step-content{flex:1;line-height:1.9}
.step-content strong{color:#047857}
.footer{text-align:center;margin-top:30px;padding:20px;background:#1a1a2e;border-radius:12px;color:white;page-break-inside:avoid}
.footer h3{color:#86efac;font-size:16px;margin-bottom:5px}
.footer p{font-size:11px;opacity:0.8}
.katex{font-size:1.0em}
.katex-display{margin:10px 0;text-align:center;padding:8px;background:#f0fdf4;border-radius:6px;overflow-x:auto}
</style>
</head>
<body>
<div class="cover">
  <div class="badge">✅ الحل النموذجي المفصّل</div>
  <h1>${exam.title}</h1>
  <div class="subtitle">الحل النموذجي الشامل — منصة الرياضيات</div>
  <div class="info">
    <div class="info-item">📝 ${exam.topic.exercises.length} تمارين محلولة</div>
    <div class="info-item">📅 ${exam.date}</div>
    <div class="info-item">🎓 ${exam.stream}</div>
  </div>
</div>
${exercisesHTML}
<div class="footer">
  <h3>منصة الرياضيات</h3>
  <p>الحل النموذجي — بإشراف الأستاذ عدلي أسعد</p>
  <p>📧 asaadadli9393@gmail.com | الجزائر 🇩🇿</p>
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
  console.log(`🚀 توليد ${examsContent.length * 2} ملفات HTML للفروض والاختبارات...`);

  // توليد HTML
  for (const exam of examsContent) {
    const topicSlug = slugify(exam.trimester, exam.type, exam.number, false);
    const topicHTML = generateTopicHTML(exam);
    fs.writeFileSync(path.join(outputDir, `${topicSlug}.html`), topicHTML, "utf-8");
    console.log(`✅ ${topicSlug}.html`);

    const solSlug = slugify(exam.trimester, exam.type, exam.number, true);
    const solHTML = generateSolutionHTML(exam);
    fs.writeFileSync(path.join(outputDir, `${solSlug}.html`), solHTML, "utf-8");
    console.log(`✅ ${solSlug}.html`);
  }

  console.log(`\n📄 توليد ${examsContent.length * 2} ملفات PDF عبر Playwright...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const exam of examsContent) {
    const topicSlug = slugify(exam.trimester, exam.type, exam.number, false);
    const topicURL = `http://localhost:3000/courses/${topicSlug}.html`;
    try {
      await page.goto(topicURL, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.pdf({
        path: path.join(outputDir, `${topicSlug}.pdf`),
        format: 'A4',
        printBackground: true,
        margin: { top: '1.5cm', bottom: '1.5cm', left: '1.5cm', right: '1.5cm' }
      });
      console.log(`📄 ${topicSlug}.pdf ✓`);
    } catch (err) {
      console.error(`❌ ${topicSlug}.pdf:`, err.message);
    }

    const solSlug = slugify(exam.trimester, exam.type, exam.number, true);
    const solURL = `http://localhost:3000/courses/${solSlug}.html`;
    try {
      await page.goto(solURL, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.pdf({
        path: path.join(outputDir, `${solSlug}.pdf`),
        format: 'A4',
        printBackground: true,
        margin: { top: '1.5cm', bottom: '1.5cm', left: '1.5cm', right: '1.5cm' }
      });
      console.log(`📄 ${solSlug}.pdf ✓`);
    } catch (err) {
      console.error(`❌ ${solSlug}.pdf:`, err.message);
    }
  }

  await browser.close();
  console.log(`\n🎉 تم توليد ${examsContent.length * 2} ملفات PDF في ${outputDir}`);
}

main().catch((err) => {
  console.error("خطأ:", err);
  process.exit(1);
});
