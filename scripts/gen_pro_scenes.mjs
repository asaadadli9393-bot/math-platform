/* ============================================================
 * توليد المشاهد السينمائية — إنتاج v2 «الإخراج الاحترافي»
 *  1) «فندق اللانهاية» (3AS — النهايات)           hl-*.png
 *  2) «صفر: العدد الذي أرعب العالم» (1AS)          zr-*.png
 * نفس عالم السلسلة «عوالم الرياضيات»: البطل بالسترة الزمردية
 * + شخصيات جديدة ثابتة الطابع — بلا أي نصوص داخل الصور
 * ============================================================ */
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/assets/pro_v2/raw';
const SIZE = '1344x768';

const STYLE =
  'modern Japanese anime film style, cinematic wide composition, vibrant colors, dramatic lighting, ' +
  'highly detailed background art, high budget anime movie aesthetic, atmospheric, ' +
  'NO text, NO letters, NO numbers, NO words, NO symbols, NO watermark, NO subtitles';

const HERO =
  'a 16 year old anime boy hero with messy dark brown hair, large expressive eyes, ' +
  'wearing an emerald green hoodie and dark pants';

const FRIEND =
  'a 15 year old anime girl with a dark braided ponytail, amber eyes, an indigo scarf ' +
  'over a neat school uniform';

const PORTER =
  'a giant gentle elderly anime hotel porter with a long white beard, round golden glasses, ' +
  'a burgundy uniform with gold buttons and a red fez';

const SAGE =
  'an elderly wise anime scholar with a long silver beard, a deep blue robe embroidered ' +
  'with gold constellations';

const MERCHANT =
  'a middle-aged Baghdad merchant wearing a white turban and an amber vest over a cream robe';

const SCENES = [
  /* ================= فندق اللانهاية (hl) ================= */
  {
    file: 'hl-cover.png',
    prompt:
      `Epic night establishing shot: a colossal majestic grand hotel whose twin towers and glowing facade are shaped like a giant infinity symbol, standing alone in a vast starry desert, warm golden windows glowing like stars, a winding road leading to its bright entrance, breathtaking sky full of constellations and a luminous Milky Way, awe and mystery, ${STYLE}`,
  },
  {
    file: 'hl-s1.png',
    prompt:
      `Night arrival scene: ${HERO} and ${FRIEND} walking side by side on a desert road with travel backpacks, seen from behind at three-quarter angle, the colossal glowing grand hotel towering ahead of them in the distance like a palace of light under a starry sky, their faces glancing at each other with excitement and disbelief, warm golden light spilling from the distant entrance, ${STYLE}`,
  },
  {
    file: 'hl-s2.png',
    prompt:
      `Grand hotel lobby interior: an enormous marble hall with a giant crystal chandelier, a very long red carpet leading to a towering reception desk, ${PORTER} bowing warmly in welcome, while ${HERO} and ${FRIEND} stand tiny in front of the desk looking up in wonder, golden warm lighting, vertical grandeur, sense of scale, ${STYLE}`,
  },
  {
    file: 'hl-s3.png',
    prompt:
      `Infinite hotel corridor: an endless corridor of ornate golden doors receding into a glowing vanishing point, each door with a small warm lantern, patterned red carpet stretching to infinity, ${HERO} standing small at the near end looking down the impossible corridor, subtle purple ambient glow far away suggesting endless depth, mysterious and magical atmosphere, ${STYLE}`,
  },
  {
    file: 'hl-s4.png',
    prompt:
      `Colossal magical bus scene: an enormous glowing golden double-length bus stopped in front of the grand hotel entrance at night, a river of countless tiny passenger silhouettes with suitcases stepping off in an endless line stretching beyond the horizon, ${HERO} and ${FRIEND} watching from the steps with open mouths, dramatic warm and purple night lighting, ${STYLE}`,
  },
  {
    file: 'hl-s5.png',
    prompt:
      `Grand observatory scene: a majestic circular observatory room with a giant brass telescope pointed at a huge round window, in the night sky outside a constellation of glowing stars traces a perfect infinity symbol, ${SAGE} raising his hand toward the window, ${HERO} and ${FRIEND} watching in awe with reflected starlight in their eyes, deep blue and gold palette, ${STYLE}`,
  },
  {
    file: 'hl-s6.png',
    prompt:
      `Dawn finale scene: sunrise over the colossal hotel, thousands of its windows glowing and arranging themselves into a giant luminous infinity symbol across the entire facade, ${HERO} and ${FRIEND} standing on the road seen from behind, bathed in warm golden dawn light, sparkles of light drifting in the air, triumphant hopeful atmosphere, ${STYLE}`,
  },
  /* ================= صفر: العدد الذي أرعب العالم (zr) ================= */
  {
    file: 'zr-cover.png',
    prompt:
      `Golden age Baghdad establishing shot: the legendary House of Wisdom with its great golden dome glowing at dusk, the Tigris river reflecting warm lantern light, date palms, scholars walking with scrolls, distant minarets, flying birds, majestic and peaceful, warm amber and deep blue palette, ${STYLE}`,
  },
  {
    file: 'zr-s1.png',
    prompt:
      `House of Wisdom interior: a magnificent grand library hall with towering wooden shelves full of scrolls, scholars reading and writing with reed pens at low desks, globes and astrolabes, warm oil lamps casting golden light, inkwells and parchment everywhere, atmosphere of deep knowledge and curiosity, ${STYLE}`,
  },
  {
    file: 'zr-s2.png',
    prompt:
      `Bustling medieval Baghdad market scene: ${MERCHANT} behind a wooden stall moving small pebbles across a ruled wooden counting board, explaining to ${HERO} who watches with fascination, colorful fabrics and spice sacks around the stall, warm afternoon light, lively crowd silhouettes in background, ${STYLE}`,
  },
  {
    file: 'zr-s3.png',
    prompt:
      `Momentous discovery close-up: an old parchment on a wooden desk with elegant handwriting strokes, a glowing golden empty circle floating just above the parchment radiating soft light rays, a reed pen resting beside an ornate inkwell, ${HERO} leaning in with wide amazed eyes lit by the golden glow, dark warm background focusing all attention on the luminous circle, magical atmosphere, ${STYLE}`,
  },
  {
    file: 'zr-s4.png',
    prompt:
      `Dramatic sea voyage scene at night: an old wooden dhow ship with a lateen sail crossing a stormy dark sea, carrying a treasure chest that glows golden from within with light leaking between its lid, lightning in heavy clouds, distant European coast with a small monastery flickering candlelight, tension and danger, the glowing chest protected like a sacred secret, ${STYLE}`,
  },
  {
    file: 'zr-s5.png',
    prompt:
      `Hopeful sunrise classroom finale: ${HERO} standing at a large school blackboard holding glowing golden chalk, drawing a perfect luminous empty circle on the board, soft golden sunrise light streaming through tall windows, floating geometric shapes and light particles in the air, his face confident and inspired, warm emerald and gold palette, ${STYLE}`,
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();
  const todo = SCENES.filter((s) => !fs.existsSync(path.join(OUT_DIR, s.file)));
  console.log(`المشاهد المطلوبة: ${todo.length}/${SCENES.length}`);
  for (const sc of todo) {
    const out = path.join(OUT_DIR, sc.file);
    let ok = false;
    for (let att = 1; att <= 3 && !ok; att++) {
      try {
        const r = await zai.images.generations.create({ prompt: sc.prompt, size: SIZE });
        const b64 = r?.data?.[0]?.base64;
        if (!b64) throw new Error('no data');
        fs.writeFileSync(out, Buffer.from(b64, 'base64'));
        console.log(`  ✓ ${sc.file} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
        ok = true;
      } catch (e) {
        console.error(`  ✗ ${sc.file} محاولة ${att}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 1500 * att));
      }
    }
    if (!ok) process.exitCode = 1;
  }
  console.log('gen_pro_scenes DONE');
}
main();
