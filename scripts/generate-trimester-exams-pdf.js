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
const { trimesterExamsContentExtra } = require("../src/data/trimester-exams-content-extra.ts");
const examsContent = [...trimesterExamsContent, ...trimesterExamsContentExtra];

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
      .map((q, qi) => `<p class="q">${processMathContent(q)}</p>`)
      .join("");
    return `
      <div class="ex">
        <h3>${ex.statement.replace(/\*\*/g, "")}</h3>
        ${questionsHTML}
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
@page{size:A4;margin:1.8cm 1.5cm 2cm 1.5cm}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#ffffff}
body{font-family:'Cairo','Amiri',Tahoma,Arial,sans-serif;direction:rtl;color:#000;line-height:1.85;font-size:13px;max-width:210mm;margin:0 auto;padding:0}
/* رأس الصفحة — معلومات الامتحان */
.header{border:2px solid #000;padding:10px 14px;margin-bottom:18px;text-align:center;font-size:12px}
.header .title{font-size:16px;font-weight:900;margin-bottom:4px}
.header .meta{display:flex;justify-content:space-around;flex-wrap:wrap;gap:10px;margin-top:6px;font-size:11px}
.header .meta div{padding:2px 8px;border:1px solid #999;border-radius:3px}
/* كل تمرين */
.ex{margin-bottom:22px;page-break-inside:avoid}
.ex h3{font-size:14px;font-weight:700;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:10px;text-align:right;color:#000}
.ex p.q{margin:8px 0;padding-right:22px;text-indent:-22px;font-size:13px;line-height:1.9}
.ex p.q strong{color:#000}
/* تذييل */
.footer{margin-top:30px;padding-top:8px;border-top:1px solid #999;text-align:center;font-size:10px;color:#666}
/* KaTeX */
.katex{font-size:1.0em}
.katex-display{margin:8px 0;text-align:center}
</style>
</head>
<body>
<div class="header">
  <div class="title">${exam.title}</div>
  <div class="meta">
    <div><strong>المؤسسة:</strong> منصة الرياضيات — الأستاذ عدلي أسعد</div>
    <div><strong>السنة الدراسية:</strong> 2026/2027</div>
  </div>
  <div class="meta">
    <div><strong>المستوى:</strong> ${exam.stream}</div>
    <div><strong>المدة:</strong> ${exam.duration}</div>
    <div><strong>التاريخ:</strong> ${exam.date}</div>
  </div>
</div>
${exercisesHTML}
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
  const exercisesHTML = exam.solution.exercises.map((ex, idx) => {
    const stepsHTML = (ex.steps || [])
      .map((s, si) => `<p class="step">${processMathContent(s)}</p>`)
      .join("");
    return `
      <div class="ex">
        <h3>${ex.statement.replace(/\*\*/g, "")}</h3>
        ${stepsHTML}
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
/* رأس الصفحة */
.header{border:2px solid #000;padding:10px 14px;margin-bottom:18px;text-align:center;font-size:12px}
.header .title{font-size:16px;font-weight:900;margin-bottom:4px}
.header .meta{display:flex;justify-content:space-around;flex-wrap:wrap;gap:10px;margin-top:6px;font-size:11px}
.header .meta div{padding:2px 8px;border:1px solid #999;border-radius:3px}
/* كل تمرين */
.ex{margin-bottom:22px;page-break-inside:avoid}
.ex h3{font-size:14px;font-weight:700;border-bottom:2px solid #000;padding-bottom:4px;margin-bottom:10px;text-align:right;color:#000}
.ex p.step{margin:6px 0;padding-right:22px;text-indent:-22px;font-size:13px;line-height:1.9}
.ex p.step strong{color:#000;background:#f0f0f0;padding:1px 4px;border-radius:2px}
/* تذييل */
.footer{margin-top:30px;padding-top:8px;border-top:1px solid #999;text-align:center;font-size:10px;color:#666}
/* KaTeX */
.katex{font-size:1.0em}
.katex-display{margin:8px 0;text-align:center}
</style>
</head>
<body>
<div class="header">
  <div class="title">✅ الحل النموذجي — ${exam.title}</div>
  <div class="meta">
    <div><strong>المؤسسة:</strong> منصة الرياضيات — الأستاذ عدلي أسعد</div>
    <div><strong>السنة الدراسية:</strong> 2026/2027</div>
  </div>
  <div class="meta">
    <div><strong>المستوى:</strong> ${exam.stream}</div>
    <div><strong>المدة:</strong> ${exam.duration}</div>
    <div><strong>عدد التمارين:</strong> ${exam.topic.exercises.length}</div>
  </div>
</div>
${exercisesHTML}
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
