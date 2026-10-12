#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
مهندس الإخراج v2 — «الإخراج الاحترافي» لسلسلة عوالم الرياضيات
تمثيل صوتي متعدد + موسيقى تصويرية متصلة + مؤثرات + حوارات مشكّلة
+ بطاقتا عنوان وخاتمة متحركتان + انتقالات xfade + تدرج سينمائي
+ مكساج نهائي loudnorm. الاستعمال:
  python scripts/render_pro_v2.py hilbert|zero|all
"""
import asyncio, json, os, subprocess, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from episodes_pro import EPISODES, ROLES
import music_synth as MU

from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = "/home/z/my-project"
FONTS = dict(
    b=f"{BASE}/assets/fonts/Tajawal-Bold.ttf",
    m=f"{BASE}/assets/fonts/Tajawal-Medium.ttf",
    r=f"{BASE}/assets/fonts/Tajawal-Regular.ttf",
    dj="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
)
W, H, FPS, T = 1080, 1920, 25, 0.7
GOLD = (255, 214, 102)

def sh(cmd, fail=True):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-1500:])
        if fail:
            sys.exit(1)
    return r

def dur_of(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", p], capture_output=True, text=True)
    return float(r.stdout.strip())

def F(path, size):
    return ImageFont.truetype(path, size)

# ============================ 1) التعليق الصوتي ============================
async def tts_lines(ep, name):
    import edge_tts
    work = ep["work"]
    os.makedirs(f"{work}/audio", exist_ok=True)
    jobs = []
    for si, sec in enumerate(ep["sections"]):
        for li, ln in enumerate(sec["lines"]):
            jobs.append((si, li, ln))
    for si, li, ln in jobs:
        out = f"{work}/audio/l{si}_{li}.mp3"
        if os.path.exists(out) and os.path.getsize(out) > 6000:
            continue
        voice, rate, _, _ = ROLES[ln["role"]]
        com = edge_tts.Communicate(ln["text"], voice, rate=rate)
        await com.save(out)
        print(f"  [tts] {name} l{si}_{li} ({ln['role']}) OK")
    ov = f"{work}/audio/outro.mp3"
    if not (os.path.exists(ov) and os.path.getsize(ov) > 6000):
        com = edge_tts.Communicate(ep["outro"]["voice"], ROLES["narr"][0], rate="-4%")
        await com.save(ov)
        print(f"  [tts] {name} outro OK")

def to_wav(mp3, wav):
    if not os.path.exists(wav):
        sh(["ffmpeg", "-y", "-i", mp3, "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", wav])
    import wave
    with wave.open(wav) as w:
        d = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32767
    return d

# ============================ 2) التركيب البصري ============================
def wrap_rtl(d, text, font, maxw):
    words, lines, cur = text.split(), [], []
    for w in words:
        t = cur + [w]
        if d.textlength(" ".join(t), font=font, direction="rtl", language="ar") <= maxw or not cur:
            cur = t
        else:
            lines.append(" ".join(cur)); cur = [w]
    if cur:
        lines.append(" ".join(cur))
    return lines

def ar(d, xy, text, font, fill, anchor="mm"):
    d.text(xy, text, font=font, fill=fill, anchor=anchor, direction="rtl", language="ar")

def tw(d, text, font):
    b = d.textbbox((0, 0), text, font=font, direction="rtl", language="ar")
    return b[2] - b[0]

def compose_bg(ep, sec, si):
    os.makedirs(f"{ep['work']}/stills", exist_ok=True)
    out = f"{ep['work']}/stills/bg_{sec['key']}.jpg"
    if os.path.exists(out):
        return out
    src = Image.open(sec["img"]).convert("RGB")
    sc = H / src.height
    bg = src.resize((int(src.width * sc), H), Image.LANCZOS)
    x0 = (bg.width - W) // 2
    bg = bg.crop((x0, 0, x0 + W, H))
    bg = bg.filter(ImageFilter.GaussianBlur(26))
    from PIL import ImageEnhance
    bg = ImageEnhance.Brightness(bg).enhance(0.52)
    bg = ImageEnhance.Color(bg).enhance(1.15)
    canvas = bg.convert("RGBA")
    d = ImageDraw.Draw(canvas)
    for yy in range(int(H * 0.30), H):
        a = int(150 * (yy - H * 0.30) / (H * 0.70))
        d.line([(0, yy), (W, yy)], fill=(0, 0, 0, a))
    # اللوحة السينمائية الحادة
    pw = 1016
    ph = int(pw * src.height / src.width)
    px, py = (W - pw) // 2, 410
    fg = src.resize((pw, ph), Image.LANCZOS)
    mask = Image.new("L", (pw, ph), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, pw - 1, ph - 1], radius=22, fill=255)
    shadow = Image.new("RGBA", (pw + 40, ph + 40), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([20, 24, pw + 19, ph + 43], radius=26, fill=(0, 0, 0, 160))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    canvas.alpha_composite(shadow, (px - 20, py - 20))
    glow = Image.new("RGBA", (pw + 16, ph + 16), (0, 0, 0, 0))
    ImageDraw.Draw(glow).rounded_rectangle([0, 0, pw + 15, ph + 15], radius=28, fill=(255, 200, 60, 80))
    glow = glow.filter(ImageFilter.GaussianBlur(9))
    canvas.alpha_composite(glow, (px - 8, py - 8))
    canvas.paste(fg, (px, py), mask)
    canvas.convert("RGB").save(out, quality=93)
    return out

def build_chrome(ep):
    out = f"{ep['work']}/chrome.png"
    if os.path.exists(out):
        return out
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_badge = F(FONTS["m"], 32)
    label = ep["badge"]
    bw = tw(d, label, f_badge) + 120
    d.rounded_rectangle([(W - bw) // 2, 62, (W + bw) // 2, 122], radius=30, fill=(0, 0, 0, 165))
    d.ellipse([(W + bw) // 2 - 84, 84, (W + bw) // 2 - 64, 104], fill=GOLD + (255,))
    ar(d, (W // 2 + 10, 90), label, f_badge, GOLD + (255,))
    f_sig = F(FONTS["r"], 28)
    ar(d, (W // 2, H - 66), "منصة تدرّج — تحت إشراف الأستاذ عدلي اسعد", f_sig, (255, 255, 255, 170))
    img.save(out)
    return out

def math_card(img, d, mc, y0=176):
    form, cap, fnt = mc["formula"], mc["caption"], mc["font"]
    f_form = F(FONTS["dj"] if fnt == "dj" else FONTS["b"], 56)
    f_cap = F(FONTS["m"], 36)
    w1 = tw(d, form, f_form) if fnt == "tj" else d.textlength(form, font=f_form)
    w2 = tw(d, cap, f_cap)
    cw = int(max(w1, w2)) + 120
    ch = 74 + 56
    x0, x1 = (W - cw) // 2, (W + cw) // 2
    d.rounded_rectangle([x0, y0, x1, y0 + ch], radius=24, fill=(8, 10, 26, 210),
                        outline=GOLD + (210,), width=2)
    if fnt == "dj":
        d.text((W // 2, y0 + 40), form, font=f_form, fill=(255, 255, 255, 250), anchor="mm")
    else:
        ar(d, (W // 2, y0 + 40), form, f_form, (255, 255, 255, 250))
    ar(d, (W // 2, y0 + 96), cap, f_cap, (255, 228, 150, 240))

def line_overlay(ep, sec, ln, key, si, li):
    out = f"{ep['work']}/frames/{key}_l{li}.png"
    if os.path.exists(out):
        return out
    os.makedirs(f"{ep['work']}/frames", exist_ok=True)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    _, _, color, disp = ROLES[ln["role"]]
    if disp is None:  # الراوي — شريط أسفل
        f_t = F(FONTS["b"], 50)
        lines = wrap_rtl(d, ln["text"], f_t, 900)
        lh = 64
        bh = len(lines) * lh + 52
        by = 1568 - bh // 2
        d.rounded_rectangle([40, by, W - 40, by + bh], radius=28, fill=(0, 0, 0, 175))
        d.rounded_rectangle([40, by, W - 40, by + 6], radius=3, fill=GOLD + (230,))
        for i, L in enumerate(lines):
            ar(d, (W // 2, by + 34 + lh // 2 + i * lh), L, f_t, (255, 255, 255, 252))
    else:  # حوار — فقاعة متحدث
        size, lh = (52, 68) if len(ln["text"]) <= 110 else (44, 58)
        f_t = F(FONTS["m"], size)
        lines = wrap_rtl(d, ln["text"], f_t, 880)
        th = len(lines) * lh
        bw = min(948, max(tw(d, L, f_t) for L in lines) + 96)
        bh = th + 58
        bx0, bx1 = (W - bw) // 2, (W + bw) // 2
        by1 = 1512
        by0 = by1 - bh
        d.rounded_rectangle([bx0, by0, bx1, by1], radius=32, fill=(10, 12, 26, 205))
        d.rounded_rectangle([bx1 - 12, by0 + 10, bx1 - 2, by1 - 10], radius=5, fill=color + (255,))
        for i, L in enumerate(lines):
            ar(d, (W // 2, by0 + 36 + lh // 2 + i * lh), L, f_t, (255, 255, 255, 252))
        f_name = F(FONTS["b"], 34)
        nw = tw(d, disp, f_name) + 84
        cx0, cx1 = (W - nw) // 2, (W + nw) // 2
        cy1 = by0 - 12
        d.rounded_rectangle([cx0, cy1 - 56, cx1, cy1], radius=28, fill=color + (240,))
        d.ellipse([cx0 + 18, cy1 - 40, cx0 + 38, cy1 - 20], fill=(10, 12, 26, 230))
        ar(d, ((cx0 + cx1) // 2 + 10, cy1 - 28), disp, f_name, (10, 12, 26, 255))
    if "math" in ln:
        math_card(img, d, ln["math"])
    img.save(out)
    return out

def gradient_card(bg_top, bg_bot, glyph):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(bg_top[i] + (bg_bot[i] - bg_top[i]) * t) for i in range(3)))
    glow = Image.new("L", (W, H), 0)
    dg = ImageDraw.Draw(glow)
    dg.ellipse([W // 2 - 700, 340, W // 2 + 700, 1180], fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img = Image.composite(Image.new("RGB", (W, H), (38, 30, 16)), img, glow)
    d = ImageDraw.Draw(img)
    rng = np.random.default_rng(42)
    for _ in range(150):
        x, y = int(rng.uniform(0, W)), int(rng.uniform(0, H))
        r = int(rng.uniform(1, 3))
        a = int(rng.uniform(30, 110))
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 235, 180, a))
    if glyph:
        f_g = ImageFont.truetype(FONTS["dj"], 300)
        d.text((W // 2, 640), glyph, font=f_g, fill=(255, 214, 102, 40), anchor="mm")
    return img, d

def build_title_card(ep):
    out = f"{ep['work']}/stills/title.jpg"
    if os.path.exists(out):
        return out
    t = ep["title"]
    img, d = gradient_card((8, 10, 26), (22, 16, 40), t["glyph"])
    os.makedirs(f"{ep['work']}/stills", exist_ok=True)
    f_big = F(FONTS["b"], 96)
    lines = wrap_rtl(d, t["big"], f_big, 950)
    ty = 760 - (len(lines) - 1) * 40
    for L in lines:
        ar(d, (W // 2, ty), L, f_big, GOLD)
        ty += 108
    d.line([W // 2 - 300, 960, W // 2 - 60, 960], fill=GOLD + (220,), width=3)
    d.line([W // 2 + 60, 960, W // 2 + 300, 960], fill=GOLD + (220,), width=3)
    ar(d, (W // 2, 962), "◆", F(FONTS["dj"], 30), GOLD)
    ar(d, (W // 2, 1050), t["sub"], F(FONTS["m"], 46), (255, 255, 255, 245))
    ar(d, (W // 2, 1130), t["tag"], F(FONTS["r"], 36), (255, 228, 150, 235))
    img.save(out, quality=94)
    return out

def build_outro_card(ep):
    out = f"{ep['work']}/stills/outro.jpg"
    if os.path.exists(out):
        return out
    o = ep["outro"]
    img, d = gradient_card((8, 10, 26), (20, 24, 44), o["glyph"])
    d.line([W // 2 - 280, 690, W // 2 + 280, 690], fill=GOLD + (220,), width=3)
    ar(d, (W // 2, 780), o["big"], F(FONTS["b"], 62), GOLD)
    ar(d, (W // 2, 960), o["lines"][0], F(FONTS["b"], 78), (255, 255, 255, 250))
    ar(d, (W // 2, 1075), o["lines"][1], F(FONTS["m"], 42), (255, 228, 150, 240))
    d.line([W // 2 - 280, 1230, W // 2 + 280, 1230], fill=GOLD + (160,), width=2)
    img.save(out, quality=94)
    return out

# ============================ 3) مقاطع الفيديو ============================
def motion_filter(kind, frames):
    i = round(0.10 / frames, 6)
    cx, cy = "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"
    tail = f":d={frames}:s={W}x{H}:fps={FPS}"
    if kind == "in":
        return f"zoompan=z='min(1.0+{i}*on,1.10)':x='{cx}':y='{cy}'" + tail
    if kind == "out":
        return f"zoompan=z='max(1.10-{i}*on,1.0)':x='{cx}':y='{cy}'" + tail
    if kind == "panR":
        return f"zoompan=z='1.09':x='(iw-iw/zoom)*on/{frames}':y='{cy}'" + tail
    if kind == "panL":
        return f"zoompan=z='1.09':x='(iw-iw/zoom)*(1-on/{frames})':y='{cy}'" + tail
    return f"zoompan=z='1.08':x='(iw-iw/zoom)*0.65*on/{frames}':y='(ih-ih/zoom)*0.35*on/{frames}'" + tail

GRADE = "eq=contrast=1.055:saturation=1.16:brightness=0.008,vignette=angle=PI/4.6,noise=alls=4:allf=t+u"

def seg_ok(path, exp):
    if not os.path.exists(path) or os.path.getsize(path) < 120000:
        return False
    try:
        return abs(dur_of(path) - exp) < 0.7
    except Exception:
        return False

def build_section_segments(ep, timeline):
    os.makedirs(f"{ep['work']}/segs", exist_ok=True)
    chrome = build_chrome(ep)
    for si, sec in enumerate(ep["sections"]):
        seg = f"{ep['work']}/segs/sec_{sec['key']}.mp4"
        if seg_ok(seg, timeline["secs"][si + 1]["dur"]):
            print(f"  [seg] {sec['key']} سليم — تخطي")
            continue
        bg = compose_bg(ep, sec, si)
        ovs = [line_overlay(ep, sec, ln, sec["key"], si, li)
               for li, ln in enumerate(sec["lines"])]
        frames = max(2, round(timeline["secs"][si + 1]["dur"] * FPS))
        vf = f"[0:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840," \
             f"{motion_filter(sec['motion'], frames)},{GRADE},format=rgba[bgm];" \
             f"[bgm][1:v]overlay=0:0[cc]"
        last = "cc"
        for oi in range(len(ovs)):
            s, e = timeline["secs"][si + 1]["lines"][oi]["s"], timeline["secs"][si + 1]["lines"][oi]["e"]
            nxt = f"c{oi}"
            vf += f";[{last}][{oi + 2}:v]overlay=0:0:enable='between(t,{s:.2f},{e:.2f})'[{nxt}]"
            last = nxt
        vf += f";[{last}]format=yuv420p[v]"
        cmd = ["ffmpeg", "-y", "-loop", "1", "-i", bg, "-i", chrome]
        for o in ovs:
            cmd += ["-i", o]
        cmd += ["-filter_complex", vf, "-map", "[v]", "-frames:v", str(frames),
                "-r", str(FPS), "-c:v", "libx264", "-preset", "veryfast", "-crf", "25", seg]
        sh(cmd)
        print(f"  [seg] {sec['key']} ✓ ({timeline['secs'][si]['dur']:.1f}s)")

def build_card_segment(src, dur, kind, out):
    frames = max(2, round(dur * FPS))
    i = round(0.055 / frames, 6)
    z = f"min(1.0+{i}*on,1.055)" if kind == "title" else f"max(1.055-{i}*on,1.0)"
    cx, cy = "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"
    fade = "fade=t=in:st=0:d=0.7" if kind == "title" else f"fade=t=out:st={max(0.0, dur - 1.4):.2f}:d=1.4"
    vf = (f"[0:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,"
          f"zoompan=z='{z}':x='{cx}':y='{cy}':d={frames}:s={W}x{H}:fps={FPS},"
          f"eq=contrast=1.05:saturation=1.12,vignette=angle=PI/4.8,noise=alls=3:allf=t+u,"
          f"{fade},format=yuv420p[v]")
    sh(["ffmpeg", "-y", "-loop", "1", "-i", src, "-filter_complex", vf, "-map", "[v]",
        "-frames:v", str(frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "veryfast",
        "-crf", "24", out])

# ============================ 4) الزمن والمكساج ============================
def compute_timeline(ep):
    secs = [dict(dur=4.8, key="title", lines=[])]
    for si, sec in enumerate(ep["sections"]):
        ls, items = 0.55, []
        for li, ln in enumerate(sec["lines"]):
            wav = f"{ep['work']}/audio/l{si}_{li}.wav"
            d = dur_of(f"{ep['work']}/audio/l{si}_{li}.mp3")
            e = ls + d + 0.28
            items.append(dict(s=round(ls, 2), e=round(e, 2)))
            ls = e + 0.5
        d = max(ls + 1.1, 7.0)
        secs.append(dict(dur=round(d, 2), key=sec["key"], lines=items))
    ov_d = dur_of(f"{ep['work']}/audio/outro.mp3")
    d_out = round(ov_d + 3.4, 2)
    secs.append(dict(dur=d_out, key="outro", lines=[dict(s=0.9, e=0.9 + ov_d + 0.4)]))
    # مواضع البداية مع xfade
    starts, acc = [], 0.0
    for i, s in enumerate(secs):
        starts.append(0.0 if i == 0 else acc - T)
        acc = (0.0 if i == 0 else acc - T) + s["dur"]
    total = acc
    for i, s in enumerate(secs):
        s["start"] = round(starts[i], 2)
    return dict(secs=secs, total=round(total, 2), themes=["intro"] + [s["theme"] for s in ep["sections"]] + ["outro"])

def xfade_chain(ep, timeline):
    segs = [f"{ep['work']}/segs/sec_title.mp4"] + \
           [f"{ep['work']}/segs/sec_{s['key']}.mp4" for s in ep["sections"]] + \
           [f"{ep['work']}/segs/sec_outro.mp4"]
    trs = ep["transitions"]
    out = f"{ep['work']}/video_final.mp4"
    inputs = []
    for s in segs:
        inputs += ["-i", s]
    fc, last, acc = [], "0:v", 0.0
    for i in range(1, len(segs)):
        acc += timeline["secs"][i - 1]["dur"] - T
        lab_n, lab_o = f"x{i}", (f"x{i-1}" if i > 1 else "0:v")
        fc.append(f"[{last}][{i}:v]xfade=transition={trs[i-1]}:duration={T}:offset={acc:.3f}[{lab_n}]")
        last = lab_n
    fc.append(f"[{last}]format=yuv420p[v]")
    sh(["ffmpeg", "-y"] + inputs + ["-filter_complex", ";".join(fc), "-map", "[v]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-r", str(FPS), out])
    return out

def build_master(ep, timeline):
    music_secs = [(th, timeline["secs"][i]["dur"] + T) for i, th in enumerate(timeline["themes"])]
    mpath = f"{ep['work']}/music_track.wav"
    MU.build_track_v2(music_secs, mpath)
    import wave
    with wave.open(mpath) as w:
        mus = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32767
    total_n = int((timeline["total"] + 1.5) * MU.SR)
    if len(mus) < total_n:
        mus = np.pad(mus, (0, total_n - len(mus)))
    mus = mus[:total_n]
    env = np.ones(total_n)
    vbus = np.zeros(total_n)
    def put(bus, sig, t, amp):
        i0 = int(t * MU.SR)
        i1 = min(total_n, i0 + len(sig))
        if i1 > i0:
            bus[i0:i1] += sig[: i1 - i0] * amp
    # أصوات + تنكيم
    for si, sec in enumerate(timeline["secs"]):
        st = sec["start"]
        if si == 0:
            continue
        if si == len(timeline["secs"]) - 1:
            put(vbus, to_wav(f"{ep['work']}/audio/outro.mp3", f"{ep['work']}/audio/outro.wav"), st + 0.9, 1.0)
            s, e = sec["lines"][0]["s"] + st, sec["lines"][0]["e"] + st
            r0, r1 = int((s - 0.2) * MU.SR), int(e * MU.SR)
            r1 = min(r1, total_n)
            if r1 > r0:
                env[r0:r1] = np.minimum(env[r0:r1], 0.3)
        else:
            src = ep["sections"][si - 1]
            for li, ln in enumerate(src["lines"]):
                put(vbus, to_wav(f"{ep['work']}/audio/l{si-1}_{li}.mp3", f"{ep['work']}/audio/l{si-1}_{li}.wav"),
                    st + sec["lines"][li]["s"], 1.0)
                s, e = sec["lines"][li]["s"] + st - 0.18, sec["lines"][li]["e"] + st + 0.35
                a, b_, c_, dd = int(s * MU.SR), int((s + 0.22) * MU.SR), int(e * MU.SR) - int(0.22 * MU.SR), int(e * MU.SR)
                a, b_, c_, dd = max(0, a), min(max(0, b_), total_n), max(0, c_), min(dd, total_n)
                if b_ > a:
                    env[a:b_] = np.minimum(env[a:b_], np.linspace(1, 0.3, b_ - a))
                if c_ > b_:
                    env[b_:c_] = np.minimum(env[b_:c_], 0.3)
                if dd > c_:
                    env[c_:dd] = np.minimum(env[c_:dd], np.linspace(0.3, 1, dd - c_))
                if "math" in ln:
                    put(vbus, MU.sfx_shimmer(1.6, 0.5), st + sec["lines"][li]["s"] + 0.05, 0.5)
    # مؤثرات
    put(vbus, MU.sfx_boom(), 0.22, 0.6)
    put(vbus, MU.sfx_shimmer(), 0.55, 0.42)
    for si in range(1, len(timeline["secs"])):
        put(vbus, MU.sfx_whoosh(0.9, amp=0.5), timeline["secs"][si]["start"] - 0.18, 0.4)
    put(vbus, MU.chime(), timeline["secs"][-1]["start"] + 0.1, 0.45)
    master = mus * env + vbus
    master[-int(2.2 * MU.SR):] *= np.linspace(1, 0, int(2.2 * MU.SR))
    master = master / (np.max(np.abs(master)) + 1e-9) * 0.95
    data = (master * 32767).astype(np.int16)
    with wave.open(f"{ep['work']}/master.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(MU.SR)
        w.writeframes(data.tobytes())
    print(f"  [mix] master.wav ✓ ({len(master)/MU.SR:.1f}s)")

# ============================ التنفيذ ============================
def render_episode(name):
    ep = EPISODES[name]
    os.makedirs(ep["work"], exist_ok=True)
    print(f"\n========== الإخراج الاحترافي: {name} ==========")
    print("== 1) التمثيل الصوتي ==")
    asyncio.run(tts_lines(ep, name))
    print("== 2) الزمن ==")
    tl = compute_timeline(ep)
    print(f"  المدة الكلية المتوقعة: {tl['total']:.1f}s")
    print("== 3) بطاقتا العنوان والخاتمة ==")
    build_title_card(ep)
    build_outro_card(ep)
    tseg, oseg = f"{ep['work']}/segs/sec_title.mp4", f"{ep['work']}/segs/sec_outro.mp4"
    os.makedirs(f"{ep['work']}/segs", exist_ok=True)
    if not seg_ok(tseg, tl["secs"][0]["dur"]):
        build_card_segment(build_title_card(ep), tl["secs"][0]["dur"], "title", tseg)
        print("  seg title ✓")
    if not seg_ok(oseg, tl["secs"][-1]["dur"]):
        build_card_segment(build_outro_card(ep), tl["secs"][-1]["dur"], "outro", oseg)
        print("  seg outro ✓")
    print("== 4) مقاطع المشاهد ==")
    build_section_segments(ep, tl)
    print("== 5) الانتقالات xfade ==")
    vf = xfade_chain(ep, tl)
    print(f"  video_final ✓ ({dur_of(vf):.1f}s)")
    print("== 6) المكساج الصوتي ==")
    build_master(ep, tl)
    print("== 7) اللمسة الأخيرة ==")
    sh(["ffmpeg", "-y", "-i", vf, "-i", f"{ep['work']}/master.wav",
        "-c:v", "copy", "-af", "loudnorm=I=-16:TP=-1.5:LRA=13",
        "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-movflags", "+faststart", ep["out"]])
    d, sz = dur_of(ep["out"]), os.path.getsize(ep["out"]) / 1048576
    print(f"\n🎬 الحلقة جاهزة: {ep['out']}")
    print(f"   المدة: {d:.1f}s ({int(d//60)}:{int(d%60):02d}) | الحجم: {sz:.1f} MB")
    json.dump(tl, open(f"{ep['work']}/timings.json", "w"), ensure_ascii=False, indent=1, default=str)

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    targets = list(EPISODES) if which == "all" else [which]
    for t in targets:
        render_episode(t)
