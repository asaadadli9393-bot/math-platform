#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
مؤلّف الموسيقى التصويرية والمؤثرات — خط الإنتاج v2
يولّد مونتاجاً موسيقياً متصلاً (thematic underscores) + مؤثرات:
whoosh / boom / shimmer / chime — كلها مُصنّعة رقمياً بـ numpy (مجاني 100%).
"""
import numpy as np, wave, os, sys

SR = 44100
OUT = "/home/z/my-project/assets/pro_v2/music"
os.makedirs(OUT, exist_ok=True)

def hz(midi): return 440.0 * 2 ** ((midi - 69) / 12)

def env_ar(n, a=0.02, r=0.4):
    """هجوم-انحلال"""
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e

def tone(f, dur, amp=0.2, harm=((1, 1), (2, 0.32), (3, 0.12)), a=0.02, r=0.35, vib=0.0, detune=0.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = f * (1 + detune)
    if vib > 0:
        fr = fr * (1 + vib * np.sin(2 * np.pi * 5.2 * t))
    sig = np.zeros(n)
    for m, g in harm:
        sig += g * np.sin(2 * np.pi * fr * m * t + 0.3 * m)
    sig *= amp * env_ar(n, a, r)
    return sig

def pluck(f, dur, amp=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    e = np.exp(-t * 6.5)
    sig = np.zeros(n)
    for m, g in ((1, 1), (2, 0.45), (3, 0.2), (4, 0.08)):
        sig += g * np.sin(2 * np.pi * f * m * t)
    return amp * e * sig

def pad(chord, dur, amp=0.11):
    n = int(dur * SR)
    sig = np.zeros(n)
    for m in chord:
        sig += tone(hz(m), dur, amp / len(chord) * 2.2, harm=((1, 1), (2, 0.22), (3, 0.07)),
                    a=dur * 0.3, r=dur * 0.4, vib=0.004)
        sig += tone(hz(m), dur, amp / len(chord) * 1.1, harm=((1, 1),),
                    a=dur * 0.35, r=dur * 0.45, detune=0.0016)
    return sig

def kick(amp=0.5):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    fr = 110 * np.exp(-t * 9) + 42
    return amp * np.sin(2 * np.pi * fr * t) * np.exp(-t * 7)

def timpani(f, amp=0.5):
    n = int(1.1 * SR)
    t = np.arange(n) / SR
    sig = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t))
    return amp * sig * np.exp(-t * 4)

# ---------------- المؤثرات ----------------
def sfx_whoosh(dur=0.8, up=True, amp=0.5):
    n = int(dur * SR)
    rng = np.random.default_rng(7)
    noise = rng.standard_normal(n)
    k = np.ones(160) / 160  # lowpass متحرك
    lp = np.convolve(noise, k, mode="same")
    t = np.linspace(0, 1, n)
    env = np.sin(np.pi * t) ** 2
    sig = lp * env
    # مسح طيفي تقريبي: مزج ضوضاء خامّة تتصاعد
    hi = noise * env * 0.25
    sig = sig * 0.8 + hi * (t if up else (1 - t))
    return amp * sig / (np.max(np.abs(sig)) + 1e-9) * 0.9

def sfx_boom(amp=0.85):
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    fr = 88 * np.exp(-t * 3.2) + 34
    sig = np.sin(2 * np.pi * fr * t) * np.exp(-t * 2.6)
    rng = np.random.default_rng(3)
    th = np.convolve(rng.standard_normal(n), np.ones(900) / 900, mode="same") * np.exp(-t * 6)
    return amp * (sig * 0.85 + th * 0.35)

def sfx_shimmer(dur=1.6, amp=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    rng = np.random.default_rng(11)
    for f in (2093, 2637, 3136, 3520, 4186):
        st = rng.uniform(0, 0.35)
        i0 = int(st * SR)
        m = n - i0
        sig[i0:] += np.sin(2 * np.pi * f * t[:m]) * np.exp(-t[:m] * 3.5) * rng.uniform(0.4, 1.0)
    return amp * sig / (np.max(np.abs(sig)) + 1e-9)

def chime(f=1568, amp=0.22, dur=2.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * f * t + 3.2 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 2.2)
    return amp * sig

# ---------------- التآلفات ----------------
DM = [50, 57, 62, 65]; BB = [46, 53, 58, 62]; FF = [53, 57, 60, 65]; CC = [48, 55, 60, 64]
AM = [45, 52, 57, 60]; FM7 = [53, 57, 60, 64]; EM = [52, 55, 59, 64]; GG = [43, 55, 59, 62]

def arp_notes(chord, bass_shift=12):
    return [chord[0] + bass_shift, chord[1] + bass_shift, chord[2] + bass_shift, chord[1] + bass_shift]

def bar(chord, dur=2.0, pad_amp=0.11, arp=False, arp_amp=0.11, drums=False, step=0.25):
    n = int(dur * SR)
    sig = pad(chord, dur, pad_amp)
    if arp:
        k = int(dur / step)
        for i in range(k):
            f = hz(arp_notes(chord)[i % 4] + 12)
            s = pluck(f, step * 2.2, arp_amp)
            j = int(i * step * SR)
            sig[j:j + len(s)] += s[: max(0, n - j)]
    if drums:
        kd = kick(0.42)
        sig[: len(kd)] += kd
        kd2 = kick(0.3)
        j = int(dur / 2 * SR)
        sig[j:j + len(kd2)] += kd2[: max(0, n - j)]
    return sig

def theme(prog, reps=1, bar_dur=2.0, **kw):
    sig = []
    for _ in range(reps):
        for c in prog:
            sig.append(bar(c, bar_dur, **kw))
    return np.concatenate(sig)

def t_intro(dur):   return theme([DM, BB, FF, CC], reps=max(1, round(dur / 8)), bar_dur=2.0,
                                 arp=True, arp_amp=0.13, drums=True)
def t_mystery(dur): return theme([AM, FM7, AM, EM], reps=max(1, round(dur / 8)), bar_dur=2.6,
                                 pad_amp=0.10, arp=True, arp_amp=0.075)
def t_wonder(dur):  return theme([FF, CC, DM, BB], reps=max(1, round(dur / 8)), bar_dur=2.2,
                                 pad_amp=0.105, arp=True, arp_amp=0.115)
def t_epic(dur):    return theme([DM, BB, FF, CC], reps=max(1, round(dur / 8)), bar_dur=1.85,
                                 arp=True, arp_amp=0.15, drums=True)
def t_outro(dur):   return theme([FF, CC, FF], reps=max(1, round(dur / 9)), bar_dur=2.4,
                                 pad_amp=0.10, arp=True, arp_amp=0.08)

THEMES = dict(intro=t_intro, mystery=t_mystery, wonder=t_wonder, epic=t_epic, outro=t_outro)

def write_wav(path, sig):
    sig = sig / (np.max(np.abs(sig)) + 1e-9)
    data = (sig * 32767 * 0.92).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(data.tobytes())

def build_track_v2(sections, path):
    """مونتاج متصل: كل مقطع يبدأ عند نهاية السابق مطروحاً منه التداخل"""
    XF = 1.4
    starts, cur = [], 0
    sigs = []
    for name, dur in sections:
        s = THEMES[name](dur + 0.3)
        reps = max(1, int(np.ceil((dur + 0.3) * SR / len(s))))
        s = np.tile(s, reps)[: int((dur + 0.3) * SR)]
        sigs.append(s)
        starts.append(cur)
        cur += len(s) - (int(XF * SR) if len(sigs) > 1 else 0)
    total = starts[-1] + len(sigs[-1])
    out = np.zeros(total + SR)
    for st, s in zip(starts, sigs):
        n = len(s)
        seg = out[st: st + n]
        if len(seg) < n:
            s = s[: len(seg)]
        if st > 0:
            # منحنى دخول قوة متساوية على XF
            m = min(int(XF * SR), len(s))
            s = s.copy()
            w = np.sqrt(np.linspace(0, 1, m))
            s[:m] *= w
        out[st: st + len(s)] += s
    write_wav(path, out[:total])
    return total / SR

if __name__ == "__main__":
    # المؤثرات
    write_wav(f"{OUT}/sfx_whoosh.wav", sfx_whoosh())
    write_wav(f"{OUT}/sfx_whoosh_long.wav", sfx_whoosh(1.1))
    write_wav(f"{OUT}/sfx_boom.wav", sfx_boom())
    write_wav(f"{OUT}/sfx_shimmer.wav", sfx_shimmer())
    write_wav(f"{OUT}/sfx_chime.wav", chime())
    print("SFX done")
    # عينة مونتاج للاختبار
    d = build_track_v2([("intro", 9), ("mystery", 12), ("wonder", 10), ("epic", 8), ("outro", 7)],
                       f"{OUT}/_test_track.wav")
    print(f"test track {d:.1f}s done")
