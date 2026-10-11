#!/usr/bin/env python3
"""
Bay-Kun Anime Shorts renderer — Episode 1 (1AS): قاعدة الإشارات في الضرب
1080x1920 @ 12fps, mouth-flip animation synced to Algerian Arabic TTS.
"""
import math
import random
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

BASE = Path('/home/z/my-project/assets/anime')
CUT = BASE / 'cut'
AUDIO = BASE / 'audio'
FRAMES = BASE / 'frames'
OUT_DIR = Path('/home/z/my-project/download/anime_shorts')
FRAMES.mkdir(exist_ok=True)
OUT_DIR.mkdir(exist_ok=True, parents=True)

W, H = 1080, 1920
FPS = 12

# ---------- palette ----------
NAVY_TOP = (10, 14, 38)
NAVY_MID = (24, 28, 66)
NAVY_BOT = (12, 15, 40)
GOLD = (255, 204, 64)
GOLD_BRIGHT = (255, 228, 120)
GOLD_DIM = (198, 162, 70)
WHITE = (246, 248, 255)
WHITE70 = (198, 204, 228)
GREEN = (96, 224, 132)
RED = (255, 108, 92)
PANEL_BG = (8, 11, 30)
BUBBLE_BG = (252, 253, 255)
INK = (17, 23, 50)

# ---------- fonts ----------
F_XB = str(BASE / 'fonts/Tajawal-ExtraBold.ttf')
F_B = str(BASE / 'fonts/Tajawal-Bold.ttf')
F_R = str(BASE / 'fonts/Tajawal-Regular.ttf')
F_MATH = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def font(path, size):
    return ImageFont.truetype(path, size)


def is_ar(text):
    return any('\u0600' <= c <= '\u06FF' for c in text)


def tdraw(draw, xy, text, f, fill, anchor='mm'):
    """Draw text with proper RTL shaping when Arabic."""
    if is_ar(text):
        draw.text(xy, text, font=f, fill=fill, anchor=anchor,
                  direction='rtl', language='ar')
    else:
        draw.text(xy, text, font=f, fill=fill, anchor=anchor)


def text_w(draw, text, f):
    if is_ar(text):
        return draw.textlength(text, font=f, direction='rtl', language='ar')
    return draw.textlength(text, font=f)


def glow_text(img, xy, text, f, fill, glow=GOLD, radius=12, anchor='mm'):
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    tdraw(d, xy, text, f, glow + (170,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius))
    img.alpha_composite(layer)
    d2 = ImageDraw.Draw(img)
    tdraw(d2, xy, text, f, fill, anchor)


# ---------- background ----------
random.seed(42)
DOTS = [(random.randint(20, W - 20), random.randint(60, H - 260),
         random.randint(2, 5), random.random() * 6.28,
         0.6 + random.random() * 1.6) for _ in range(110)]


def make_bg():
    img = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        if y < H // 2:
            t = y / (H / 2)
            c = tuple(int(NAVY_TOP[i] + (NAVY_MID[i] - NAVY_TOP[i]) * t) for i in range(3))
        else:
            t = (y - H / 2) / (H / 2)
            c = tuple(int(NAVY_MID[i] + (NAVY_BOT[i] - NAVY_MID[i]) * t) for i in range(3))
        d.rectangle((0, y, W, y + 1), fill=c + (255,))
    # soft golden glow behind character
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((240, 980, 840, 1580), fill=(255, 190, 60, 42))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    img.alpha_composite(glow)
    return img


BG = make_bg()


def draw_dots(img, t):
    d = ImageDraw.Draw(img)
    for (x, y, r, ph, sp) in DOTS:
        a = int(90 + 110 * (0.5 + 0.5 * math.sin(t * sp + ph)))
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 214, 100, a))


# ---------- reusable UI pieces ----------
def chip(img, cx, cy, text, f_size=34):
    d = ImageDraw.Draw(img)
    f = font(F_B, f_size)
    w = text_w(d, text, f)
    pad, hpad = 30, 16
    box = (cx - w / 2 - pad, cy - f_size / 2 - hpad, cx + w / 2 + pad, cy + f_size / 2 + hpad)
    d.rounded_rectangle(box, radius=(box[3] - box[1]) / 2, fill=(20, 26, 58, 220),
                        outline=GOLD + (255,), width=2)
    tdraw(d, (cx, cy - 2), text, f, GOLD_BRIGHT)


def chip_row(img, cx, cy, texts, f_size=34, gap=16):
    """Two pills side by side, centered."""
    d = ImageDraw.Draw(img)
    f = font(F_B, f_size)
    ws = [text_w(d, t, f) + 60 for t in texts]
    total = sum(ws) + gap
    x = cx - total / 2
    for t, w in zip(texts, ws):
        box = (x, cy - f_size / 2 - 16, x + w, cy + f_size / 2 + 16)
        d.rounded_rectangle(box, radius=(box[3] - box[1]) / 2,
                            fill=(20, 26, 58, 220), outline=GOLD + (255,), width=2)
        tdraw(d, (x + w / 2, cy - 2), t, f, GOLD_BRIGHT)
        x += w + gap


def panel(img, box, radius=42):
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(box, radius=radius, fill=PANEL_BG + (238,),
                        outline=GOLD + (255,), width=4)


def bubble(img, lines, f_size=42, bottom=940, max_w=820):
    d = ImageDraw.Draw(img)
    f = font(F_B, f_size)
    lh = int(f_size * 1.5)
    widths = [text_w(d, t, f) for t in lines]
    tw = max(widths)
    bw = min(max_w, tw + 76)
    bh = lh * len(lines) + 44
    cx = W / 2
    top = bottom - bh
    box = (cx - bw / 2, top, cx + bw / 2, bottom)
    # tail
    d.polygon([(cx - 26, bottom - 2), (cx + 26, bottom - 2), (cx, bottom + 26)],
              fill=BUBBLE_BG + (255,))
    d.rounded_rectangle(box, radius=34, fill=BUBBLE_BG + (255,))
    y = top + 26
    for t in lines:
        tdraw(d, (cx, y + lh / 2), t, f, INK)
        y += lh
    return top


def rtl_row(img, cy, segs, x_right, gap_w=26, anchor_y='mm'):
    """Draw colored segments right-to-left. segs = [(text, font, fill), ...]"""
    d = ImageDraw.Draw(img)
    cur = x_right
    for text, f, fill in segs:
        w = text_w(d, text, f)
        tdraw(d, (cur, cy), text, f, fill, anchor='rm')
        cur -= w + gap_w


def ltr_center_row(img, cy, segs, gap_w=18):
    """Centered left-to-right colored segments. segs = [(text, font, fill), ...]"""
    d = ImageDraw.Draw(img)
    ws = [text_w(d, t, f) for (t, f, _) in segs]
    total = sum(ws) + gap_w * (len(segs) - 1)
    x = W / 2 - total / 2
    for (t, f, fill), w in zip(segs, ws):
        tdraw(d, (x, cy), t, f, fill, anchor='lm')
        x += w + gap_w


# ---------- overlay builders ----------
def ov_s1():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    chip_row(img, W / 2, 105, ['الحلقة 1', 'السنة الأولى ثانوي'])
    glow_text(img, (W / 2, 285), 'باي-كن', font(F_XB, 150), GOLD_BRIGHT, glow=GOLD, radius=18)
    glow_text(img, (W / 2, 425), 'مرشدك في الرياضيات', font(F_B, 56), WHITE70, glow=(80, 90, 160), radius=10)
    bubble(img, ['سلام عليكم! أنا باي-كن', 'صديقك في الرياضيات!'])
    return img


def ov_s2():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    chip_row(img, W / 2, 105, ['الحلقة 1', 'السنة الأولى ثانوي'])
    glow_text(img, (W / 2, 290), 'قاعدة الإشارات', font(F_XB, 110), GOLD_BRIGHT, glow=GOLD, radius=16)
    glow_text(img, (W / 2, 415), 'في الضرب', font(F_XB, 84), WHITE, glow=(80, 90, 160), radius=10)
    bubble(img, ['هل أنت مستعد؟'])
    return img


BOARD_TOP, BOARD_BOT = 300, 850


def board_img(rows, title=None):
    """rows: list of (cy, segs, highlighted)"""
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    chip_row(img, W / 2, 105, ['الحلقة 1', 'السنة الأولى ثانوي'])
    panel(img, (70, BOARD_TOP, W - 70, BOARD_BOT))
    cy = BOARD_TOP + 40
    if title:
        f = font(F_B, 46)
        tdraw(ImageDraw.Draw(img), (W / 2, cy + 26), title, f, GOLD_DIM)
        cy += 92
    d = ImageDraw.Draw(img)
    for (ry, segs, hl) in rows:
        if hl:
            d.rounded_rectangle((110, ry - 62, W - 110, ry + 62), radius=26,
                                fill=(255, 204, 64, 26), outline=GOLD_DIM + (200,), width=2)
        ltr_center_row(img, ry, segs)
    return img


def fm(size):
    return font(F_MATH, size)


def ov_s3a():
    return board_img([(BOARD_TOP + 135, [('(+) × (+)', fm(74), WHITE), (' = ', fm(64), WHITE70), ('(+)', fm(80), GREEN)], True)])


def ov_s3b():
    return board_img([
        (BOARD_TOP + 135, [('(+) × (+)', fm(74), WHITE), (' = ', fm(64), WHITE70), ('(+)', fm(80), GREEN)], False),
        (BOARD_TOP + 305, [('(+) × (−)', fm(74), WHITE), (' = ', fm(64), WHITE70), ('(−)', fm(80), RED)], True),
    ])


def ov_s3c():
    return board_img([
        (BOARD_TOP + 135, [('(+) × (+)', fm(74), WHITE), (' = ', fm(64), WHITE70), ('(+)', fm(80), GREEN)], False),
        (BOARD_TOP + 305, [('(+) × (−)', fm(74), WHITE), (' = ', fm(64), WHITE70), ('(−)', fm(80), RED)], False),
        (BOARD_TOP + 475, [('(−) × (−)', fm(74), WHITE), (' = ', fm(64), WHITE70), ('(+)', fm(80), GREEN)], True),
    ])


def ov_s4():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    chip_row(img, W / 2, 105, ['الحلقة 1', 'السنة الأولى ثانوي'])
    panel(img, (70, BOARD_TOP, W - 70, BOARD_BOT))
    glow_text(img, (W / 2, BOARD_TOP + 95), 'القاعدة الذهبية', font(F_XB, 72), GOLD_BRIGHT, glow=GOLD, radius=14)
    fr = font(F_XB, 76)
    fw = font(F_B, 76)
    rtl_row(img, BOARD_TOP + 300, [('موجب', fr, GREEN), (':', fw, WHITE70), ('المتشابهان', fw, WHITE)],
            x_right=W - 150)
    rtl_row(img, BOARD_TOP + 470, [('سالب', fr, RED), (':', fw, WHITE70), ('المختلفان', fw, WHITE)],
            x_right=W - 150)
    return img


def ov_s5a():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    chip_row(img, W / 2, 105, ['الحلقة 1', 'السنة الأولى ثانوي'])
    panel(img, (70, BOARD_TOP, W - 70, BOARD_BOT))
    ltr_center_row(img, BOARD_TOP + 270, [('(−3) × (−5)', fm(96), WHITE), (' = ?', fm(90), WHITE70)])
    bubble(img, ['جرّب بنفسك!'])
    return img


def ov_s5b():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    chip_row(img, W / 2, 105, ['الحلقة 1', 'السنة الأولى ثانوي'])
    panel(img, (70, BOARD_TOP, W - 70, BOARD_BOT))
    ltr_center_row(img, BOARD_TOP + 150, [('(−3) × (−5)', fm(74), WHITE70)])
    glow_text(img, (W / 2, BOARD_TOP + 370), '+15', font(F_MATH, 165), GOLD_BRIGHT, glow=GOLD, radius=22)
    bubble(img, ['المتشابهان، إذن الناتج', 'موجب خمسة عشر!'])
    return img


def ov_s6():
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_text(img, (W / 2, 380), 'π', font(F_MATH, 165), GOLD_BRIGHT, glow=GOLD, radius=24)
    glow_text(img, (W / 2, 520), 'منصة الرياضيات للثانوي', font(F_XB, 84), WHITE, glow=(80, 90, 160), radius=12)
    tdraw(ImageDraw.Draw(img), (W / 2, 615), 'تحت إشراف الأستاذ عدلي اسعد', font(F_B, 44), GOLD_DIM)
    chip(img, W / 2, 700, 'math-adli.vercel.app', f_size=42)
    glow_text(img, (W / 2, 788), 'شارك الفيديو مع زملائك!', font(F_B, 48), GOLD_BRIGHT, glow=GOLD, radius=10)
    bubble(img, ['أحسنت! إلى اللقاء!'])
    return img


# ---------- timeline ----------
SCENES = [
    dict(a='a1.mp3',  pair='wave',   ov=ov_s1,  gap=4),
    dict(a='a2.mp3',  pair='wave',   ov=ov_s2,  gap=6),
    dict(a='a3a.mp3', pair='point',  ov=ov_s3a, gap=2),
    dict(a='a3b.mp3', pair='point',  ov=ov_s3b, gap=2),
    dict(a='a3c.mp3', pair='point',  ov=ov_s3c, gap=6),
    dict(a='a4.mp3',  pair='wave',   ov=ov_s4,  gap=6),
    dict(a='a5a.mp3', pair='point',  ov=ov_s5a, gap=4),
    dict(a='a5b.mp3', pair='wave',   ov=ov_s5b, gap=6),
    dict(a='a6.mp3',  pair='thumbs', ov=ov_s6,  gap=0),
]

PAIRS = {
    'wave':   ('f_closed_cut.png', 'f_talk_cut.png'),
    'point':  ('f_point_cut.png', 'f_point_talk_cut.png'),
    'thumbs': ('f_thumbs_cut.png', 'f_thumbs_talk_cut.png'),
}

LEAD_F = 6   # 0.5s intro silence
TAIL_F = 18  # 1.5s outro


def dur(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                        '-of', 'csv=p=0', str(path)], capture_output=True, text=True)
    return float(r.stdout.strip())


def build_timeline():
    items = []
    start_f = LEAD_F
    for sc in SCENES:
        d = dur(AUDIO / sc['a'])
        frames = math.ceil((d * FPS)) + sc['gap']
        items.append(dict(sc=sc, dur=d, start=start_f, frames=frames,
                          a_start=start_f / FPS))
        start_f += frames
    total_f = start_f + TAIL_F
    return items, total_f


# ---------- audio stitching ----------
def decode(path):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 's16le',
                        '-acodec', 'pcm_s16le', '-ar', '24000', '-ac', '1', '-'],
                       capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.int16)


def build_audio(items, total_f):
    total_s = int(total_f / FPS * 24000) + 24000  # +1s safety
    track = np.zeros(total_s, dtype=np.int16)
    for it in items:
        seg = decode(AUDIO / it['sc']['a'])
        s0 = int(it['start'] / FPS * 24000)
        track[s0:s0 + len(seg)] = seg
    # gentle normalization to -3 dBFS peak
    peak = np.abs(track).max()
    if peak > 0:
        track = (track.astype(np.float64) * (0.7 * 32767 / peak)).astype(np.int16)
    wav_path = BASE / 'full_audio.wav'
    with wave.open(str(wav_path), 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(24000)
        wf.writeframes(track.tobytes())
    return wav_path


# ---------- frame rendering ----------
def load_chars():
    chars = {}
    target_h = 900
    for key, (a, b) in PAIRS.items():
        imgs = []
        for name in (a, b):
            im = Image.open(CUT / name).convert('RGBA')
            w = int(im.width * target_h / im.height)
            imgs.append(im.resize((w, target_h), Image.LANCZOS))
        chars[key] = imgs
    return chars


def render():
    items, total_f = build_timeline()
    print(f'total frames: {total_f} ({total_f / FPS:.1f}s)')
    chars = load_chars()
    overlays = {id(it['sc']): it['sc']['ov']() for it in
                {id(x['sc']): x for x in items}.values()}
    # speaking intervals in frame idx
    for i, fi in enumerate(range(total_f)):
        t = fi / FPS
        scene = None
        for it in items:
            if it['start'] <= fi < it['start'] + it['frames']:
                scene = it
                break
        frame = BG.copy()
        draw_dots(frame, t)
        if scene:
            ov = overlays[id(scene['sc'])]
            frame.alpha_composite(ov)
            speaking = (fi / FPS) < (scene['start'] / FPS + scene['dur'])
            pair = chars[scene['sc']['pair']]
            if speaking:
                ch = pair[(fi // 2) % 2]
            else:
                ch = pair[0]
            bob = int(6 * math.sin(2 * math.pi * t / 1.8))
            cw, chh = ch.size
            frame.alpha_composite(ch, (int(W / 2 - cw / 2), 1860 - chh + bob))
        frame.convert('RGB').save(FRAMES / f'f_{fi:05d}.jpg', quality=88)
        if fi % 120 == 0:
            print(f'frame {fi}/{total_f}')
    return items, total_f


if __name__ == '__main__':
    items, total_f = render()
    wav = build_audio(items, total_f)
    print('audio:', wav)
    print('RENDER DONE')
