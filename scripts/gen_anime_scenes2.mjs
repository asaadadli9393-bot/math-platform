/* توليد مشاهد قصتي أنمي جديدتين:
 *  1) «√2: العدد المحظور» (1AS — الأعداد الحقيقية)    rs-*.png
 *  2) «قفزة النسر: أسرار الدرجة الثانية» (2AS)        qd-*.png
 * نفس البطل والأسلوب: أنمي سينمائي + بطل بسترة زمردية + بلا نصوص
 */
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/assets/anime_raw';
const SIZE = '1344x768';

const STYLE =
  'modern Japanese anime film style, cinematic wide composition, vibrant colors, dramatic lighting, ' +
  'highly detailed background art, high budget anime movie aesthetic, atmospheric, ' +
  'NO text, NO letters, NO numbers, NO words, NO symbols, NO watermark, NO subtitles';

const HERO =
  'a 16 year old anime boy hero with messy dark brown hair, large expressive eyes, ' +
  'wearing an emerald green hoodie and dark pants';

const SCENES = [
  /* ---------- قصة الأعداد الحقيقية (1AS) ---------- */
  {
    file: 'rs-cover.png',
    prompt:
      `Epic establishing shot: ${HERO} standing on a vast glowing golden number line stretching across a surreal ancient-Greek marble landscape toward the horizon, the line splits into two branches far away: one branch made of neat ordered stone tiles, the other glowing with mysterious violet infinite sparks, floating geometric shapes in the sky, sense of wonder, ${STYLE}`,
  },
  {
    file: 'rs-s1.png',
    prompt:
      `Harmonious ancient geometric village at golden hour: perfect squares, circles and rectangles built from white marble and glowing golden ratio stones, orderly floating number tiles like puzzle pieces in the sky, ${HERO} walking confidently through the center admiring the perfect order, warm peaceful atmosphere, ${STYLE}`,
  },
  {
    file: 'rs-s2.png',
    prompt:
      `Mystery discovery moment: ${HERO} kneeling beside a giant glowing square drawn with luminous blue chalk lines on ancient marble floor, measuring its diagonal with a golden measuring rope, the diagonal glowing with an impossible violet light that escapes the neat grid, his eyes wide with astonishment, dramatic side lighting, ${STYLE}`,
  },
  {
    file: 'rs-s3.png',
    prompt:
      `Dramatic storm scene: ${HERO} standing on a cliff above a turbulent dark sea at night holding a glowing golden line segment that cannot fit into any stone tile, crashing waves and lightning in background, wind blowing his hoodie, tense determined expression, an ancient secret that must be protected, ${STYLE}`,
  },
  {
    file: 'rs-s4.png',
    prompt:
      `Triumphant dawn finale: ${HERO} walking forward on the number line as it expands beyond an old cracked wall into an infinite glowing horizon, infinite shimmering decimal dust sparkles flowing from the line like a river of stars, warm sunrise gold and emerald colors, hopeful back view three-quarter angle, ${STYLE}`,
  },
  /* ---------- قصة الدرجة الثانية (2AS) ---------- */
  {
    file: 'qd-cover.png',
    prompt:
      `Epic establishing shot: ${HERO} standing at the edge of a vast canyon, a magnificent glowing golden parabola arc bridge of light spanning across the deep canyon toward a floating castle on the other side, birds flying, dramatic clouds, adventure anticipation, the arc perfectly symmetrical, ${STYLE}`,
  },
  {
    file: 'qd-s1.png',
    prompt:
      `Dynamic launch moment: ${HERO} leaping from the cliff riding along a glowing golden parabola arc of light through a bright blue sky with wind streaks and motion lines, his hoodie fluttering, exhilarated expression, sparkles trailing behind him along the curve, sense of speed and flight, ${STYLE}`,
  },
  {
    file: 'qd-s2.png',
    prompt:
      `Serene summit moment: ${HERO} floating at the very top of the glowing parabola arc high in the sky, a radiant glowing point of light beneath his feet, a vertical beam of soft light passing through this highest point as a symmetry axis, clouds far below, peaceful powerful atmosphere, blue and gold palette, ${STYLE}`,
  },
  {
    file: 'qd-s3.png',
    prompt:
      `Tense decision moment: ${HERO} mid-air facing a dark stone wall obstacle on the parabola arc, below him two glowing landing platforms of golden light on the far side of the wall, his face determined calculating the jump, dramatic sunset orange and deep blue contrast, epic duel atmosphere, ${STYLE}`,
  },
  {
    file: 'qd-s4.png',
    prompt:
      `Triumphant finale: ${HERO} landing safely on the floating castle balcony, the glowing golden parabola arc shining behind him across the canyon like a rainbow bridge at sunset, arms raised in victory, warm golden light, floating petals and sparkles, back view three-quarter angle, victorious atmosphere, ${STYLE}`,
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();

  for (const scene of SCENES) {
    const outPath = path.join(OUT_DIR, scene.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 50000) {
      console.log(`⏭  موجود مسبقاً، تخطي: ${scene.file}`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        console.log(`🎨 توليد ${scene.file} (محاولة ${attempt})...`);
        const res = await zai.images.generations.create({ prompt: scene.prompt, size: SIZE });
        const b64 = res?.data?.[0]?.base64;
        if (!b64) throw new Error('رد فارغ من API');
        const buf = Buffer.from(b64, 'base64');
        if (buf.length < 50000) throw new Error(`صورة صغيرة جداً (${buf.length}B)`);
        fs.writeFileSync(outPath, buf);
        console.log(`✓ ${scene.file} — ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
        ok = true;
      } catch (e) {
        console.error(`✗ ${scene.file}: ${e.message}`);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
    if (!ok) {
      console.error(`⛔ فشل نهائي: ${scene.file}`);
      process.exitCode = 1;
    }
  }
  console.log('انتهى التوليد.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
