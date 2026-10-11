#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إنتاج الحلقات المتحركة لسلسلة «أنمي الرياضيات» — خط الإنتاج المثبت:
صور القصة المولّدة بالذكاء الاصطناعي (public/anime/*) + تعليق صوتي جزائري
(edge-tts ar-DZ-IsmaelNeural) + إطارات عمودية 1080×1920 بـ PIL+raqm+Tajawal
+ حركة Ken Burns بـ ffmpeg → MP4 H.264+AAC+faststart.

الاستعمال:
  /home/z/.venv/bin/python3 scripts/render_episodes.py quadratic   # الحلقة 2 (2AS)
  /home/z/.venv/bin/python3 scripts/render_episodes.py complex     # الحلقة 3 (3AS)
  /home/z/.venv/bin/python3 scripts/render_episodes.py all
"""
import asyncio, json, os, subprocess, sys

BASE = "/home/z/my-project"
PUB = f"{BASE}/public/anime"
FONT_B = f"{BASE}/assets/fonts/Tajawal-Bold.ttf"
FONT_M = f"{BASE}/assets/fonts/Tajawal-Medium.ttf"
FONT_R = f"{BASE}/assets/fonts/Tajawal-Regular.ttf"
VOICE = "ar-DZ-IsmaelNeural"
FPS = 25
W, H = 1080, 1920

# ============================ محتوى الحلقات ============================
EPISODES = {
    # ----------------- الحلقة 2: القفزة الكبرى (2AS) -----------------
    "quadratic": dict(
        out=f"{PUB}/ep-quadratic.mp4",
        work=f"{BASE}/assets/ep_quadratic",
        scenes=[
            dict(
                key="intro", img=f"{PUB}/qd-cover.jpg",
                caption="القفزة الكبرى: أسرار الدرجة الثانية",
                sub="أنمي الرياضيات — الحلقة ٢",
                tts="قفزةٌ واحدةٌ فوق الهاوية… ومعادلةٌ واحدةٌ تقرر: هل تصل؟ وإلى أين؟ هذه هي قصة الدوال من الدرجة الثانية — القفزة الكبرى.",
            ),
            dict(
                key="s1", img=f"{PUB}/qd-s1.jpg",
                caption="قوسٌ واحد يحكي معادلة كاملة",
                tts="يقف بطلنا أمام هاويةٍ عميقة لا يعبرها إلا بقوسٍ من الضوء. مسارُ القفزة يرسم دالةً من الدرجة الثانية: a في x تربيع، زائد b في x، زائد c. والمعامل a هو من يكتب شخصية القصة: إذا كان موجباً انفتح القوس نحو الأعلى، وإذا كان سالباً صار قمةً وقفزة — وقفزتنا اليوم قفزة نسر.",
            ),
            dict(
                key="s2", img=f"{PUB}/qd-s2.jpg",
                caption="القمة: أعلى ما يستطيع الوصول",
                tts="في منتصف القفزة بالضبط يبلغ البطلُ القمة: أعلى نقطةٍ في القوس. وكل قوسٍ تكون قمته في منتصف جذريه إن وجدا، ويمرُّ فوقها محورُ تماثلٍ عمودي: القوس على يمينه مرآةٌ لما على شماله. إحداثي القمة يُحسب في لمح البصر: ناقص b على اثنين في a. من يعرف قمته… يعرف أقصى ما يصل إليه.",
            ),
            dict(
                key="s3", img=f"{PUB}/qd-s3.jpg",
                caption="المميّز يقرر: هل تصل قفزتك؟",
                tts="فجأة ظهر الجدار: منصةٌ عالية تعترض القوس. هل يعبر البطل فوقها؟ هنا يظهر البطل الخفي: المميّز. يساوي b تربيعاً ناقص أربعة a c. إن كان موجباً قطعَ القوسُ خطَّ الهدف في نقطتين: قفزةٌ ناجحة بهبوطين ممكنين. وإن كان يساوياً الصفر لامسه لمسةً واحدة بالكاد. وإن كان سالباً… فالسقوط قبل الهدف.",
            ),
            dict(
                key="s4", img=f"{PUB}/qd-s4.jpg",
                caption="جدول الإشارة: خريطة القفزة",
                tts="هبط البطل سالماً — لكن الحكاية تكمل بقراءة الإشارة. في الدالة التي قمتها نحو الأعلى: الدالة موجبة بين الجذرين، وسالبة خارجهما. القاعدة الذهبية: خارج الجذرين إشارة a، وبينهما إشارتها المقلوبة. من يحمل هذه الخريطة… أي درجةٍ ثانية في الامتحان تصبح قصةً يعرف نهايتها مسبقاً.",
            ),
            dict(
                key="outro", img=f"{PUB}/qd-cover.jpg",
                caption="تابع القصة التفاعلية في منصة تدرّج",
                tts="القفزة الكبرى: أسرار الدرجة الثانية. إن أردتَ إتقان هذا الفصل، تابع القصةَ الكاملة بتفاعلها ومعادلاتها وتمارينها في منصة تدرّج — تحت إشراف الأستاذ عدلي اسعد.",
                outro=True,
            ),
        ],
    ),
    # ----------------- الحلقة 3: العالم الموازي (3AS) -----------------
    "complex": dict(
        out=f"{PUB}/ep-complex.mp4",
        work=f"{BASE}/assets/ep_complex",
        scenes=[
            dict(
                key="intro", img=f"{PUB}/cn-cover.jpg",
                caption="الأعداد المركبة: العالم الموازي",
                sub="أنمي الرياضيات — الحلقة ٣",
                tts="معادلةٌ «مستحيلة»… وبوابةٌ إلى عالمٍ لم يكن أحدٌ يظن وجوده. هذه هي قصة الأعداد المركبة — العالم الموازي.",
            ),
            dict(
                key="s1", img=f"{PUB}/cn-s1.jpg",
                caption="المعادلة التي هزّت عالم ℝ",
                tts="في عالمٍ يُدعى R كان كل شيءٍ منظماً: لكل معادلةٍ حلُّها المعروف. حتى التقى بطلنا — تلميذ السنة الثالثة ثانوي — بالمعادلة التي هزت عالمه: x تربيع زائد واحد يساوي صفراً. المميّز سالب… ولا يوجد عددٌ حقيقي يُربَّع فيصبح سالباً. الجدران لا تُكسر من الداخل.",
            ),
            dict(
                key="s2", img=f"{PUB}/cn-s2.jpg",
                caption="i: بوابة العالم الموازي",
                tts="ثم ظهرت البوابة. الرياضيُ الإيطالي كاردانو قال جملةً صادمةً لعصره: ولو كان لا بد أن يوجد حلٌّ… فليكن عدداً من عالمٍ آخر! وهكذا وُلدت الوحدة التخيلية i، قانونُها الوحيد الذي يحكم كل شيء: مربعها يساوي ناقصاً واحداً. اسمها تخيلية… لكنها تعمل اليوم في الهاتف نفسه الذي بين يديك.",
            ),
            dict(
                key="s3", img=f"{PUB}/cn-s3.jpg",
                caption="كل عدد مركب نقطة في المستوي",
                tts="عبر البوابة انفتح عالمٌ لا خطٌّ واحد فيه، بل مستوٍ كامل: المستوي المركب. كل عددٍ مركب z يساوي a زائد i في b، يقف في نقطةٍ إحداثياه a وب: الأفقي جزءٌ حقيقي، والعمودي جزءٌ تخيلي. كل معادلةٍ مستحيلة في العالم القديم… لها عنوانٌ واضح في هذا العالم الجديد.",
            ),
            dict(
                key="s4", img=f"{PUB}/cn-s4.jpg",
                caption="المعامل مسافة… والسعة زاوية",
                tts="وكل عددٍ مركب له قوتان خفيتان: المعامل يقيس بُعده عن نقطة الأصل، والسعة تحدد اتجاهه. مسافةٌ وزاوية… موقعٌ كامل في المستوي. بهذه اللغة نفسها تصف الفيزياءُ التيارات المترددة، ويصف المهندسون دوران الطائرات وإشارات الراديو.",
            ),
            dict(
                key="s5", img=f"{PUB}/cn-s5.jpg",
                caption="لا معادلة بلا حل بعد اليوم",
                tts="وعاد البطلُ إلى عالمه فسقطت المعادلةُ المستحيلة أمام قوته الجديدة: حلّان كاملان — i وناقص i. ومبرهنةُ الجبر الأساسية تضمن أن كل معادلةٍ من الدرجة n لها بالضبط n حلٌّ في العالم المركب. لم تعد هناك معادلةٌ بلا حلّ… أبداً.",
            ),
            dict(
                key="outro", img=f"{PUB}/cn-cover.jpg",
                caption="تابع القصة التفاعلية في منصة تدرّج",
                tts="الأعداد المركبة: العالم الموازي. إن أردتَ إتقان هذا الفصل، تابع القصةَ الكاملة بتفاعلها ومعادلاتها وتمارينها في منصة تدرّج — تحت إشراف الأستاذ عدلي اسعد.",
                outro=True,
            ),
        ],
    ),
}

# ============================ 1) التعليق الصوتي ============================
async def tts_all(work, scenes):
    import edge_tts
    os.makedirs(f"{work}/audio", exist_ok=True)
    for i, sc in enumerate(scenes):
        out = f"{work}/audio/seg{i}.mp3"
        if os.path.exists(out) and os.path.getsize(out) > 8000:
            print(f"  [tts] seg{i} موجود — تخطي"); continue
        com = edge_tts.Communicate(sc["tts"], VOICE, rate="-4%")
        await com.save(out)
        print(f"  [tts] seg{i} → {os.path.getsize(out)//1024} KB")

def dur_of(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", path], capture_output=True, text=True)
    return float(r.stdout.strip())

# ============================ 2) تركيب الإطارات ============================
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

def compose(work, sc, idx):
    os.makedirs(f"{work}/stills", exist_ok=True)
    src = Image.open(sc["img"]).convert("RGB")  # 1344x768
    scale = H / src.height
    bg = src.resize((int(src.width * scale), H), Image.LANCZOS)
    x0 = (bg.width - W) // 2
    bg = bg.crop((x0, 0, x0 + W, H)).filter(ImageFilter.GaussianBlur(26))
    bg = ImageEnhance.Brightness(bg).enhance(0.40)
    canvas = bg.convert("RGBA")

    d = ImageDraw.Draw(canvas)
    for yy in range(int(H * 0.62), H):
        a = int(120 * (yy - H * 0.62) / (H * 0.38))
        d.line([(0, yy), (W, yy)], fill=(0, 0, 0, a))

    fw = 980
    fh = int(src.height * fw / src.width)
    fg = src.resize((fw, fh), Image.LANCZOS)
    mask = rounded_mask((fw, fh), 26)
    fx, fy = (W - fw) // 2, 470
    glow = Image.new("RGBA", (fw + 24, fh + 24), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle([0, 0, fw + 23, fh + 23], radius=32, fill=(255, 200, 60, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(10))
    canvas.alpha_composite(glow, (fx - 12, fy - 12))
    canvas.paste(fg, (fx, fy), mask)

    f_badge = load_font(FONT_M, 34)
    tw, th = text_w(d, "عوالم الرياضيات", f_badge)
    bw, bh = tw + 76, 64
    d.rounded_rectangle([(W - bw) // 2, 84, (W + bw) // 2, 84 + bh],
                        radius=bh // 2, fill=(0, 0, 0, 150))
    ar_text(d, (W // 2, 84 + bh // 2 - 2), "عوالم الرياضيات", f_badge, (255, 214, 102, 255))

    if sc.get("sub"):
        f_sub = load_font(FONT_M, 42)
        ar_text(d, (W // 2, fy - 60), sc["sub"], f_sub, (255, 255, 255, 235))

    f_cap = load_font(FONT_B, 54)
    cw, ch = text_w(d, sc["caption"], f_cap)
    band_h = 118
    by = 1150
    pad_x = 64
    bx0, bx1 = (W - cw) // 2 - pad_x, (W + cw) // 2 + pad_x
    d.rounded_rectangle([max(30, bx0), by, min(W - 30, bx1), by + band_h],
                        radius=30, fill=(0, 0, 0, 165))
    d.rounded_rectangle([max(30, bx0), by, min(W - 30, bx1), by + 6],
                        radius=3, fill=(255, 200, 60, 220))
    ar_text(d, (W // 2, by + band_h // 2 - 2), sc["caption"], f_cap, (255, 255, 255, 255))

    f_sig = load_font(FONT_R, 30)
    ar_text(d, (W // 2, H - 78), "منصة تدرّج — تحت إشراف الأستاذ عدلي اسعد",
            f_sig, (255, 255, 255, 165))

    out = f"{work}/stills/still{idx}.jpg"
    canvas.convert("RGB").save(out, quality=92)
    return out

# ============================ 3) مقاطع ffmpeg ============================
def seg_ok(work, idx, expected_dur):
    """التحقق من أن المقطع موجود وسليم (مدته مطابقة ±0.5s)."""
    seg = f"{work}/segs/seg{idx}.mp4"
    if not os.path.exists(seg) or os.path.getsize(seg) < 100000:
        return False
    try:
        return abs(dur_of(seg) - expected_dur) < 0.6
    except Exception:
        return False

def build_segment(work, sc, idx, dur, first, last):
    still = f"{work}/stills/still{idx}.jpg"
    audio = f"{work}/audio/seg{idx}.mp3"
    os.makedirs(f"{work}/segs", exist_ok=True)
    seg = f"{work}/segs/seg{idx}.mp4"
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

# ============================ التنفيذ ============================
def render_episode(name, seg_range=None, concat_only=False):
    ep = EPISODES[name]
    work, scenes, out = ep["work"], ep["scenes"], ep["out"]
    os.makedirs(work, exist_ok=True)
    print(f"\n================= الحلقة: {name} =================")

    print("== 1) التعليق الصوتي ==")
    asyncio.run(tts_all(work, scenes))

    print("== 2) المدد الزمنية ==")
    for i, sc in enumerate(scenes):
        a = dur_of(f"{work}/audio/seg{i}.mp3")
        sc["audio"] = a
        sc["dur"] = round(a + 1.1, 2)
        print(f"  seg{i} [{sc['key']}] صوت={a:.2f}s مقطع={sc['dur']}s")

    if concat_only:
        n = len(scenes)
    else:
        print("== 3) تركيب الإطارات ==")
        for i, sc in enumerate(scenes):
            still = f"{work}/stills/still{i}.jpg"
            if seg_range and not (seg_range[0] <= i <= seg_range[1]):
                continue
            if not os.path.exists(still):
                compose(work, sc, i)
                print(f"  still{i} ✓")
            else:
                print(f"  still{i} موجود — تخطي")

        print("== 4) بناء المقاطع ==")
        n = len(scenes)
        for i, sc in enumerate(scenes):
            if seg_range and not (seg_range[0] <= i <= seg_range[1]):
                continue
            if seg_ok(work, i, sc["dur"]):
                print(f"  seg{i}.mp4 سليم — تخطي")
                continue
            build_segment(work, sc, i, sc["dur"], first=(i == 0 and seg_range is None), last=(i == n - 1 and seg_range is None))
            print(f"  seg{i}.mp4 ✓ ({sc['dur']}s)")

    print("== 5) الدمج النهائي ==")
    lst = f"{work}/list.txt"
    with open(lst, "w") as f:
        for i in range(n):
            f.write(f"file '{work}/segs/seg{i}.mp4'\n")
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst,
                        "-c", "copy", "-movflags", "+faststart", out],
                       capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-800:]); sys.exit(1)

    total = dur_of(out)
    size = os.path.getsize(out) / 1048576
    print(f"\n🎬 الحلقة جاهزة: {out}")
    print(f"   المدة: {total:.1f}s | الحجم: {size:.1f} MB")
    json.dump({sc["key"]: sc.get("dur") for sc in scenes},
              open(f"{work}/timings.json", "w"), indent=1)
    return total

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    mode = sys.argv[2] if len(sys.argv) > 2 else "full"  # full | seg:a-b | concat
    targets = list(EPISODES.keys()) if which == "all" else [which]
    for t in targets:
        if t not in EPISODES:
            print(f"حلقة غير معروفة: {t} — المتاح: {list(EPISODES)}"); sys.exit(1)
        rng = None
        concat_only = False
        if mode.startswith("seg:"):
            a, b = mode.split(":")[1].split("-")
            rng = (int(a), int(b))
        elif mode == "concat":
            concat_only = True
        render_episode(t, seg_range=rng, concat_only=concat_only)
