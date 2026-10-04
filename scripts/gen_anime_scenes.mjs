/* توليد مشاهد قصة أنمي «الأعداد المركبة: العالم الموازي»
 * أسلوب موحد: أنمي ياباني سينمائي + بطل ثابت (فتى بسترة زمردية)
 * بلا أي نصوص داخل الصور — الرياضيات تُعرض حقيقية بـ KaTeX فوقها
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
  {
    file: 'cn-cover.png',
    prompt:
      `Epic establishing shot: ${HERO} standing on a long glowing golden number-line road made of light segments stretching across a surreal twilight plain toward the horizon, floating luminous orbs of light in the sky, emerald green and gold color palette, sense of wonder and the beginning of an adventure, ${STYLE}`,
  },
  {
    file: 'cn-s1.png',
    prompt:
      `${HERO} standing small before a massive dark crimson energy barrier wall rising from cracked ground in a surreal desert of faintly glowing geometric shapes, ominous red glow, dramatic long shadows, tension and impossibility, the boy looks up at the wall, ${STYLE}`,
  },
  {
    file: 'cn-s2.png',
    prompt:
      `${HERO} reaching his hand toward a floating magical glowing door portal crackling with violet-purple energy, swirling luminous particles and sparks around it, deep starry night sky, awe and hope on his face, magical isekai portal atmosphere, ${STYLE}`,
  },
  {
    file: 'cn-s3.png',
    prompt:
      `Breathtaking vista of a surreal new world built on a vast glowing two-dimensional grid plane: two luminous axis lines crossing far away, one golden horizontal and one violet vertical, floating islands and stars above, ${HERO} standing on a glowing point of the grid looking at the endless plane, wonder and discovery, ${STYLE}`,
  },
  {
    file: 'cn-s4.png',
    prompt:
      `Dynamic anime power-up moment: ${HERO} glowing with emerald energy aura, a bright arrow beam of golden light extending from his chest toward the distance, a glowing circular arc sweeping around him like a mystical compass ring, floating energy particles, heroic determined pose, epic lighting, ${STYLE}`,
  },
  {
    file: 'cn-s5.png',
    prompt:
      `Triumphant finale: ${HERO} standing on a hilltop at golden dawn, two crossing beams of light forming an X shape in the sky behind him, warm sunrise colors, floating sparkles and petals, peaceful victorious atmosphere, back view three-quarter angle, ${STYLE}`,
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
