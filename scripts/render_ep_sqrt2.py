#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إنتاج الحلقة المتحركة: «جذر ٢ — العدد المحظور» (1AS)
صور القصة المولّدة بالذكاء الاصطناعي (public/anime/rs-*) + تعليق صوتي
جزائري (edge-tts ar-DZ-IsmaelNeural) + إطارات عمودية 1080×1920
مكتوبة بـ PIL+raqm+Tajawal + حركة Ken Burns بـ ffmpeg → MP4 H.264+AAC.
"""
import asyncio, json, os, subprocess, sys

BASE = "/home/z/my-project"
PUB = f"{BASE}/public/anime"
WORK = f"{BASE}/assets/ep_sqrt2"
FONT_B = f"{BASE}/assets/fonts/Tajawal-Bold.ttf"
FONT_M = f"{BASE}/assets/fonts/Tajawal-Medium.ttf"
FONT_R = f"{BASE}/assets/fonts/Tajawal-Regular.ttf"
VOICE = "ar-DZ-IsmaelNeural"
FPS = 25
W, H = 1080, 1920

os.makedirs(f"{WORK}/audio", exist_ok=True)
os.makedirs(f"{WORK}/stills", exist_ok=True)
os.makedirs(f"{WORK}/segs", exist_ok=True)

# ---------------- محتوى الحلقة ----------------
SCENES = [
    dict(
        key="intro", img=f"{PUB}/rs-cover.jpg",
        caption="جذر ٢: العدد المحظور",
        sub="أنمي الرياضيات — الحلقة ١",
        tts="في عالمٍ مثالي… ظهر عددٌ حظرته المدرسةُ نفسها. هذه هي قصة الجذر التربيعي للعدد اثنين: العدد المحظور.",
    ),
    dict(
        key="s1", img=f"{PUB}/rs-s1.jpg",
        caption="عالمٌ ظنّ أن كل الأعداد كسور",
        tts="منذ أكثر من ألفين وخمسمئة سنة، كانت مدرسة فيثاغورس مقتنعةً بأن كل عددٍ في الوجود كسرٌ: نسبةُ عددين صحيحين. الأطوالُ والزوايا والنجوم… كلُّها بقياسٍ كسري. عالمٌ منظمٌ لا يحتمل الغموض.",
    ),
    dict(
        key="s2", img=f"{PUB}/rs-s2.jpg",
        caption="سؤالٌ بسيط… كسر عالم المثاليين",
        tts="ثم سأل تلميذٌ سؤالاً بسيطاً: ما طولُ قطر مربعٍ ضلعه واحد؟ طبّقوا مبرهنةَ معلّمهم: واحدٌ تربيع زائد واحدٍ تربيع يساوي القطر تربيعاً. إذن القطرُ يساوي جذر اثنين. قالوا: بسيط، هذا كسرٌ ما. لكنهم جرّبوا وجرّبوا… وكلُّ الكسور فشلت!",
    ),
    dict(
        key="s3", img=f"{PUB}/rs-s3.jpg",
        caption="هيباسوس: لا يوجد كسرٌ يساوي جذر ٢!",
        tts="أثبت الشابُّ هيباسوس برهاناً مذهلاً: لا يوجد أصلاً كسرٌ يساوي جذر اثنين! فرضيةُ الكسر تنهارُ من داخلها: العددان يصيران زوجين معاً، والكسرُ لم يكن مختزلاً. تناقضٌ هزَّ عالمَهم المثالي كله.",
    ),
    dict(
        key="s4", img=f"{PUB}/rs-s4.jpg",
        caption="وُلد ℝ — العالم الأوسع",
        tts="وُلد بذلك نوعٌ جديد: الأعدادُ غير الناطقية. لكن الرياضياتيين لم يهزموا — بل وسّعوا عالمهم: مجموعةُ الأعداد الحقيقية. خطُّ أعدادٍ ممتلئٌ بلا فجوات: الكسور وغير الناطقية جنباً إلى جنب. الدرسُ الخالد: عندما تنهار فكرةٌ نعتمدها… نقفُ على فكرةٍ أكبر.",
    ),
    dict(
        key="outro", img=f"{PUB}/rs-cover.jpg",
        caption="منصة تدرّج — رياضيات بحكاية",
        tts="جذر اثنين: عددٌ حظرته الكسور، فوسّعت الرياضياتُ عالمها. إن أردتَ إتقان هذا الفصل، تابع القصةَ الكاملة بتفاعلها ومعادلاتها في منصة تدرّج — تحت إشراف الأستاذ عدلي اسعد.",
        outro=True,
    ),
]

# ---------------- 1) التعليق الصوتي ----------------
async def tts_all():
    import edge_tts
    for i, sc in enumerate(SCENES):
        out = f"{WORK}/audio/seg{i}.mp3"
        if os.path.exists(out) and os.path.getsize(out) > 8000:
            print(f"  [tts] seg{i} موجود — تخطي"); continue
        com = edge_tts.Communicate(sc["tts"], VOICE, rate="-4%")
        await com.save(out)
        print(f"  [tts] seg{i} → {os.path.getsize(out)//1024} KB")

def dur_of(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", path], capture_output=True, text=True)
    return float(r.stdout.strip())

# ---------------- 2) تركيب الإطارات ----------------
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

def load_font(path, size):
    return ImageFont.truetype(path, size)

def ar_text(draw, xy, text, font, fill, anchor="mm"):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor,
              direction="rtl", language="ar")

def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m

def text_w(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font, direction="rtl", language="ar")
    return b[2] - b[0], b[3] - b[1]

def compose(sc, idx):
    src = Image.open(sc["img"]).convert("RGB")  # 1344x768
    # --- الخلفية: تغطية + ضباب + تعتيم ---
    scale = H / src.height
    bg = src.resize((int(src.width * scale), H), Image.LANCZOS)
    x0 = (bg.width - W) // 2
    bg = bg.crop((x0, 0, x0 + W, H)).filter(ImageFilter.GaussianBlur(26))
    bg = ImageEnhance.Brightness(bg).enhance(0.40)
    canvas = bg.convert("RGBA")

    d = ImageDraw.Draw(canvas)
    # تدرّج سفلي لوضوح الشريط
    for yy in range(int(H * 0.62), H):
        a = int(120 * (yy - H * 0.62) / (H * 0.38))
        d.line([(0, yy), (W, yy)], fill=(0, 0, 0, a))

    # --- الصورة الأمامية ---
    fw = 980
    fh = int(src.height * fw / src.width)  # ≈560
    fg = src.resize((fw, fh), Image.LANCZOS)
    mask = rounded_mask((fw, fh), 26)
    fx, fy = (W - fw) // 2, 470
    # توهج خفيف
    glow = Image.new("RGBA", (fw + 24, fh + 24), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle([0, 0, fw + 23, fh + 23], radius=32, fill=(255, 200, 60, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(10))
    canvas.alpha_composite(glow, (fx - 12, fy - 12))
    canvas.paste(fg, (fx, fy), mask)

    # --- الشارة العلوية ---
    f_badge = load_font(FONT_M, 34)
    tw, th = text_w(d, "عوالم الرياضيات", f_badge)
    bw, bh = tw + 76, 64
    d.rounded_rectangle([(W - bw) // 2, 84, (W + bw) // 2, 84 + bh],
                        radius=bh // 2, fill=(0, 0, 0, 150))
    ar_text(d, (W // 2, 84 + bh // 2 - 2), "عوالم الرياضيات", f_badge, (255, 214, 102, 255))

    # --- شريط العنوان الفرعي للمقدمة ---
    if sc.get("sub"):
        f_sub = load_font(FONT_M, 42)
        ar_text(d, (W // 2, fy - 60), sc["sub"], f_sub, (255, 255, 255, 235))

    # --- شريط الترجمة/التعليق ---
    f_cap = load_font(FONT_B, 54)
    cw, ch = text_w(d, sc["caption"], f_cap)
    band_h = 118
    by = 1150
    pad_x = 64
    bx0, bx1 = (W - cw) // 2 - pad_x, (W + cw) // 2 + pad_x
    d.rounded_rectangle([max(30, bx0), by, min(W - 30, bx1), by + band_h],
                        radius=30, fill=(0, 0, 0, 165))
    # خط ذهبي علوي رفيع للشريط
    d.rounded_rectangle([max(30, bx0), by, min(W - 30, bx1), by + 6],
                        radius=3, fill=(255, 200, 60, 220))
    ar_text(d, (W // 2, by + band_h // 2 - 2), sc["caption"], f_cap, (255, 255, 255, 255))

    # --- توقيع المنصة ---
    f_sig = load_font(FONT_R, 30)
    ar_text(d, (W // 2, H - 78), "منصة تدرّج — تحت إشراف الأستاذ عدلي اسعد",
            f_sig, (255, 255, 255, 165))

    out = f"{WORK}/stills/still{idx}.jpg"
    canvas.convert("RGB").save(out, quality=92)
    return out

# ---------------- 3) مقاطع ffmpeg ----------------
def build_segment(sc, idx, dur, first, last):
    still = f"{WORK}/stills/still{idx}.jpg"
    audio = f"{WORK}/audio/seg{idx}.mp3"
    seg = f"{WORK}/segs/seg{idx}.mp4"
    frames = max(2, round(dur * FPS))
    inc = round(0.11 / frames, 6)
    if idx % 2 == 0:
        z = f"min(1.0+{inc}*on,1.12)"
    else:
        z = f"max(1.12-{inc}*on,1.0)"
    vf = (f"scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,"
          f"zoompan=z='{z}':d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS}")
    if first:
        vf += ",fade=t=in:st=0:d=0.6"
    if last:
        vf += f",fade=t=out:st={max(0.0, dur - 0.9):.2f}:d=0.9"
    vf += ",format=yuv420p"
    af = f"apad=pad_dur=2.0,atrim=0:{dur:.2f},afade=t=out:st={max(0.0, dur - 0.45):.2f}:d=0.45"
    # إطار مدخل واحد فقط — zoompan يولّد frames إطاراً من دونه (تجنب انفجار -loop -t)
    cmd = ["ffmpeg", "-y", "-loop", "1", "-i", still,
           "-i", audio,
           "-filter_complex", f"[0:v]{vf}[v];[1:a]{af}[a]",
           "-map", "[v]", "-map", "[a]",
           "-frames:v", str(frames),
           "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
           "-c:a", "aac", "-b:a", "128k", "-ar", "44100", seg]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-1200:]); sys.exit(1)
    return seg

# ---------------- التنفيذ ----------------
def main():
    print("== 1) التعليق الصوتي ==")
    asyncio.run(tts_all())

    print("== 2) المدد الزمنية ==")
    for i, sc in enumerate(SCENES):
        a = dur_of(f"{WORK}/audio/seg{i}.mp3")
        sc["audio"] = a
        sc["dur"] = round(a + 1.1, 2)  # هدوء تنفّسي
        print(f"  seg{i} [{sc['key']}] صوت={a:.2f}s مقطع={sc['dur']}s")

    print("== 3) تركيب الإطارات ==")
    for i, sc in enumerate(SCENES):
        compose(sc, i)
        print(f"  still{i} ✓")

    print("== 4) بناء المقاطع ==")
    n = len(SCENES)
    for i, sc in enumerate(SCENES):
        build_segment(sc, i, sc["dur"], first=(i == 0), last=(i == n - 1))
        print(f"  seg{i}.mp4 ✓ ({sc['dur']}s)")

    print("== 5) الدمج النهائي ==")
    lst = f"{WORK}/list.txt"
    with open(lst, "w") as f:
        for i in range(n):
            f.write(f"file '{WORK}/segs/seg{i}.mp4'\n")
    out = f"{PUB}/ep-sqrt2.mp4"
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                        "-c", "copy", "-movflags", "+faststart", out],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-800:]); sys.exit(1)

    total = dur_of(out)
    size = os.path.getsize(out) / 1048576
    print(f"\n🎬 الحلقة جاهزة: {out}")
    print(f"   المدة: {total:.1f}s | الحجم: {size:.1f} MB")
    json.dump({k: sc.get("dur") for k, sc in zip([s["key"] for s in SCENES], SCENES)},
              open(f"{WORK}/timings.json", "w"), indent=1)

if __name__ == "__main__":
    main()
