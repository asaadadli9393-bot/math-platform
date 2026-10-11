// Generate Bay-Kun anime character pose variants via z-ai image edit
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const DIR = '/home/z/my-project/assets/anime';

function toDataUrl(p) {
  return `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;
}

async function edit(name, prompt, src, out, size = '768x1344') {
  const zai = await ZAI.create();
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await zai.images.generations.edit({
        prompt,
        images: [{ url: toDataUrl(src) }],
        size,
      });
      const b64 = response?.data?.[0]?.base64;
      if (!b64) throw new Error('empty base64');
      fs.writeFileSync(out, Buffer.from(b64, 'base64'));
      console.log(`OK ${name} -> ${out}`);
      return;
    } catch (e) {
      console.error(`attempt ${attempt} failed for ${name}: ${e.message}`);
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

const KEEP = 'keep everything else exactly identical: same cute chibi anime boy, same messy dark navy hair, same golden-brown eyes, same navy blue hoodie, same jeans and white sneakers, same night sky background with golden sparkles, same warm golden rim lighting, same cel shading anime style';

const tasks = [
  // 1) fix chest symbol to Pi (from base)
  ['pi', 'Replace the golden X letter symbol on the boy\'s hoodie chest with a large glowing golden Greek letter Pi (π) mathematical symbol, ' + KEEP],
];

// generic usage: node anime_edit_frames.mjs <src> <out> <prompt>
const [src, out, prompt] = process.argv.slice(2);
if (!src || !out || !prompt) {
  console.error('usage: node anime_edit_frames.mjs <src> <out> <prompt>');
  process.exit(1);
}
await edit('custom', prompt, `${DIR}/${src}`, `${DIR}/${out}`);
console.log('done');
