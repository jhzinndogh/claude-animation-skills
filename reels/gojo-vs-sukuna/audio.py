import numpy as np, soundfile as sf, json
from scipy import signal
SR = 44100
import json as _j, os as _os
WARP = _j.load(open('audio/warp.json')) if _os.path.exists('audio/warp.json') else None
def toNew(x):
    if not WARP: return x
    A = WARP['anchors']
    if x <= A[0][0]: return x - A[0][0] + A[0][1]
    for i in range(len(A) - 1):
        if x <= A[i + 1][0]: k = (x - A[i][0]) / (A[i + 1][0] - A[i][0]); return A[i][1] + k * (A[i + 1][1] - A[i][1])
    return x - A[-1][0] + A[-1][1]
DUR = (WARP['new_end'] + 0.6 if WARP else 72.1) + 0.6
N = int(DUR * SR)
rng = np.random.default_rng(3)
def T(n): return np.arange(n) / SR
def env(n, a=.005, d=.2, curve=4):
    t = T(n); e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4)); return e
def place(buf, x, at, g=1.0):
    i = int(toNew(at) * SR); j = min(len(buf), i + len(x))
    if i < 0 or i >= len(buf): return
    buf[i:j] += x[:j - i] * g
def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), min(hi / (SR / 2), .99)], 'band'); return signal.lfilter(b, a, x)
def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)

# ---------------- SFX ----------------
def whoosh(dur=.35, up=True):
    n = int(dur * SR); x = rng.standard_normal(n); t = T(n)
    lo, hi = bp(x, 250, 1200), bp(x, 1500, 6000); k = np.linspace(0, 1, n) if up else np.linspace(1, 0, n)
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return (lo * (1 - k) + hi * k) * e * 1.6
def thud(f0=70, dur=.35, g=1):
    n = int(dur * SR); t = T(n); f = f0 * (1 + 1.5 * np.exp(-t * 30))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12)
    x += lp(rng.standard_normal(n), 900) * np.exp(-t * 40) * .6
    return x * g
def clang(f0=520, dur=1.0):
    n = int(dur * SR); t = T(n); x = np.zeros(n)
    for k, (r, a, d) in enumerate([(1, 1, 5), (2.76, .6, 7), (5.4, .4, 10), (8.9, .25, 14), (1.5, .5, 6)]):
        x += a * np.sin(2 * np.pi * f0 * r * t + k) * np.exp(-t * d)
    x += hp(rng.standard_normal(n), 2000) * np.exp(-t * 60) * .8
    return x * .5 + thud(90, dur, .7)[:n]
def pluck(f, dur=.5, bright=.5):
    n = int(dur * SR); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = bright * buf[i % p] + (1 - bright) * .5 * (buf[i % p] + buf[(i + 1) % p]) * .996 if False else .5 * (buf[i % p] + buf[(i + 1) % p]) * .995
    return out
def chime(f=1760, dur=.8):
    n = int(dur * SR); t = T(n)
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.01 * t) + .3 * np.sin(2 * np.pi * f * 3 * t)) * np.exp(-t * 6) * np.minimum(1, t / .003) * .5
def sparkle_sfx():
    out = np.zeros(int(.7 * SR))
    for i, f in enumerate([2093, 2637, 3136, 4186]): place(out, chime(f, .5) * .5, i * .05)
    return out
def tick(): n = int(.04 * SR); t = T(n); return hp(rng.standard_normal(n), 3000) * np.exp(-t * 200) * .8 + np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 150) * .4
def pop(f=600):
    n = int(.12 * SR); t = T(n); fr = f * (1 + 2 * t * 10); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 40)
def boing(f=220, dur=.5):
    n = int(dur * SR); t = T(n); fr = f * (1 + .35 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 3)) * (1 + t)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 5) * .6
def tweet():
    out = np.zeros(int(1.2 * SR))
    for i in range(4):
        n = int(.1 * SR); t = T(n); fr = 3200 + 900 * np.sin(2 * np.pi * 30 * t)
        place(out, np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * t / .1) * .25, i * .25)
    return out
def scribble(dur=.18):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1500, 6000) * (0.5 + .5 * np.sin(2 * np.pi * 30 * t)) * np.sin(np.pi * t / dur) * .5
def riser(dur=2.8):
    n = int(dur * SR); t = T(n); f = 200 * (2 ** (t / dur * 2.5))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .3 + bp(rng.standard_normal(n), 800, 5000) * .3 * (t / dur)
    return x * (t / dur) ** 2
def waves(dur):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 700, 2)
    return x * (0.5 + .5 * np.sin(2 * np.pi * t / 4.5) ** 2) * .5
def heartbeat():
    out = np.zeros(int(.8 * SR)); place(out, thud(55, .3, .8), 0); place(out, thud(50, .3, .6), .22); return out


def slash_sfx(dur=.16):
    n = int(dur * SR); t = T(n); x = hp(rng.standard_normal(n), 2500) * np.exp(-t * 25)
    f = 3000 * np.exp(-t * 10); x += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * .3
    return x
def glass(dur=1.0):
    out = np.zeros(int(dur * SR)); n = len(out); t = T(n)
    out += hp(rng.standard_normal(n), 3000) * np.exp(-t * 9) * .7
    for i in range(10): place(out, chime(2500 + rng.random() * 3500, .4) * .35, rng.random() * .3)
    return out
def boom(dur=1.6, g=1):
    n = int(dur * SR); t = T(n); x = thud(42, dur, 1.2)[:n] + lp(rng.standard_normal(n), 500) * np.exp(-t * 3) * .9
    return x * g
def crackle(dur):
    n = int(dur * SR); x = np.zeros(n); idx = rng.integers(0, n, int(dur * 120)); x[idx] = rng.standard_normal(len(idx))
    return bp(x, 800, 6000) * 2 + lp(rng.standard_normal(n), 400) * .3
def buzzer(dur=.6):
    n = int(dur * SR); t = T(n); ph = (180 * t) % 1; return lp(np.sign(np.sin(2 * np.pi * ph)), 2000) * .4 * np.minimum(1, (dur - t) / .05)
def rumble(dur):
    n = int(dur * SR); t = T(n); return lp(rng.standard_normal(n), 120, 2) * 2.5 * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3)

sfx = np.zeros(N)
for w in [3.84, 9.68, 14.88, 24.9, 27.8, 39.7, 42.0, 49.1, 54.9, 63.9]: place(sfx, whoosh(.36), w - .22, .4)
# A hook
place(sfx, boom(1.2), .25, .9); place(sfx, clang(300, .8), .25, .35); place(sfx, sparkle_sfx(), 1.35, .4)
# B1 / B2
place(sfx, riser(1.7), 3.9, .45); place(sfx, boom(1.0), 5.59, .7)
place(sfx, pop(500), 6.56, .45); place(sfx, thud(80, .3), 7.2, .7); place(sfx, pop(560), 7.92, .45); place(sfx, thud(80, .3), 8.45, .7); place(sfx, boing(240, .5), 8.75, .45)
# C / D / E
place(sfx, rumble(2.6), 9.7, .5); place(sfx, sparkle_sfx(), 11.78, .45); place(sfx, chime(1760, 1.0), 11.8, .2)
place(sfx, whoosh(.3), 12.45, .4); place(sfx, chime(880, 1.2) * .6, 12.75, .45); place(sfx, chime(660, 1.2) * .5, 12.8, .35)
place(sfx, riser(.4), 13.4, .35); place(sfx, boom(1.4), 13.85, .7)
# F / G / H
place(sfx, rumble(2.5), 14.9, .7); place(sfx, thud(55, .5), 16.18, .6)
place(sfx, pop(420), 17.9, .5); place(sfx, pop(380), 18.12, .5)
for i in range(10): place(sfx, scribble(.12), 18.6 + i * .25, .35)
place(sfx, boom(1.3), 21.7, .95); place(sfx, clang(120, .6) * .4, 21.7)
place(sfx, pop(600), 23.35, .4)
# I domain clash
place(sfx, rumble(2.9), 24.9, .6)
for i in range(14): place(sfx, clang(700 + (i % 4) * 90, .25) * .25, 25.0 + i * .2)
# J1 / J2 flashback
place(sfx, tick(), 27.85, .5); place(sfx, pop(520), 29.76, .45)
for h in [.45, 1.0, 1.6, 2.2, 2.8]: place(sfx, thud(70, .3, 1), 31.4 + h, .7); place(sfx, hp(rng.standard_normal(int(.08 * SR)), 1500) * .4, 31.4 + h)
# K / L
place(sfx, tick(), 36.45, .7); place(sfx, pop(300), 36.47, .5)
place(sfx, clang(420, .9), 38.6, .55)
place(sfx, boom(1.0), 41.55, .7); place(sfx, glass(1.0), 41.55, .6)
# M1 / M2
place(sfx, tick(), 43.1, .7); place(sfx, pop(700), 43.12, .4); place(sfx, clang(900, .5) * .4, 44.5)
for h in [.3, .65, 1.0, 1.35, 1.7, 2.05, 2.4]: place(sfx, thud(110, .2, .9), 45.6 + h, .55); place(sfx, clang(1100, .2) * .2, 45.6 + h)
place(sfx, buzzer(.7), 48.65, .5)
# N shrine slashes
for i in range(46): place(sfx, slash_sfx(), 49.4 + i / 9 + rng.random() * .05, .35)
place(sfx, glass(1.2), 52.0, .8); place(sfx, boom(.8), 52.0, .5); place(sfx, glass(1.2), 53.7, .8); place(sfx, boom(.8), 53.7, .5)
# O
place(sfx, heartbeat(), 55.3, .6); place(sfx, heartbeat(), 56.1, .6); place(sfx, glass(1.2), 57.5, .8)
# P finisher
for i in range(10): place(sfx, slash_sfx(), 59.0 + i / 10, .35)
place(sfx, crackle(1.3), 59.7, .4); place(sfx, whoosh(.4), 60.95, .55); place(sfx, boom(2.0, 1.2), 61.3, 1.0); place(sfx, crackle(1.5), 61.3, .5)
# Q / R
place(sfx, boom(.8), 62.85, .5); place(sfx, sparkle_sfx(), 62.9, .4)
place(sfx, boing(260, .45), 64.3, .4); place(sfx, pop(650), 68.3, .5)

# ---------------- music: dark taiko pulse in D minor ----------------
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def saw_pad(f, dur, g=.2):
    n = int(dur * SR); t = T(n); vib = 1 + .004 * np.sin(2 * np.pi * 5.5 * t)
    ph = np.cumsum(f * vib) / SR; x = 2 * (ph % 1) - 1 + .6 * (2 * ((ph * 1.005) % 1) - 1)
    x = lp(x, 1400); e = np.minimum(1, t / .06) * np.minimum(1, (dur - t) / .08)
    return x * e * g
mel = [62, 65, 69, 67, 65, 64, 62, 64, 65, 64, 62, 61, 62, 65, 69, 72, 70, 69, 67, 65, 64, 62, 61, 62]  # 24 eighths = 4 bars of 6/8
chords = [(50, 57, 62, 65), (48, 55, 60, 64), (46, 53, 58, 62), (45, 52, 57, 61)]
plk_cache = {}
def plk(m, dur):
    k = (m, round(dur, 2))
    if k not in plk_cache: plk_cache[k] = pluck(midi(m), dur)
    return plk_cache[k]
music = np.zeros(N)
def jig(t0, t1, g=1.0, mel_on=True, bass_on=True, pad_on=True, drum=True, mel_g=.55):
    t = t0; i = 0
    while t < t1:
        bar = (i // 6) % 4; ch = chords[bar]
        if bass_on and i % 6 == 0: place(music, plk(ch[0] - 12, E8 * 6) * .7, t, g)
        if pad_on and i % 6 == 0:
            for m in ch[1:]: place(music, saw_pad(midi(m), min(E8 * 6, t1 - t)), t, g * .25)
        if mel_on and i % 3 == 0: place(music, plk(mel[i % 24], E8 * 3) * .8, t, g * mel_g)
        # light percussion: frame drum on 1 and 4
        if drum and i % 6 == 0: place(music, thud(100, .12, .15), t, g)
        t += E8; i += 1
def drone(t0, t1, g=1.0):
    n = int((t1 - t0) * SR); t = T(n)
    x = (np.sin(2 * np.pi * 73.4 * t) + .5 * np.sin(2 * np.pi * 110 * t + 1) + .3 * np.sin(2 * np.pi * 146.8 * t * 1.003)) * (0.7 + .3 * np.sin(2 * np.pi * .3 * t))
    x *= np.minimum(1, t / .4) * np.minimum(1, (t1 - t0 - t) / .4)
    place(music, x * .25, t0, g)
# ---- whimsical comedic underscore (replaces jig) ----
music = np.zeros(N)
BEAT = 60 / 104
def pizz(m, dur=.45, g=1.0):
    k = ('pz', m, round(dur, 2))
    if k not in plk_cache:
        x = pluck(midi(m), dur); n = len(x); t = T(n)
        x = bp(x, 180, 3500) * np.exp(-t * 7) + bp(rng.standard_normal(n), 1500, 5000) * np.exp(-t * 300) * .15
        plk_cache[k] = x / (np.max(np.abs(x)) + 1e-9)
    return plk_cache[k] * g
def glock(m, dur=1.2, g=1.0):
    n = int(dur * SR); t = T(n); f = midi(m)
    x = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + .15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12))
    return x * np.exp(-t * 3.5) * np.minimum(1, t / .002) * .5 * g
def reed(m, dur=.22, g=1.0):
    n = int(dur * SR); t = T(n); f = midi(m); ph = (f * t) % 1
    x = lp(np.sign(np.sin(2 * np.pi * ph)) * .6 + (2 * ph - 1) * .4, 900)
    return x * np.minimum(1, t / .015) * np.exp(-t * 6) * np.minimum(1, (dur - t) / .03) * .5 * g
def strings(ms, dur, g=1.0):
    n = int(dur * SR); t = T(n); x = np.zeros(n)
    for m in ms:
        for d in (-.004, 0, .005):
            ph = np.cumsum(midi(m) * (1 + d) * (1 + .003 * np.sin(2 * np.pi * 5 * t))) / SR; x += 2 * (ph % 1) - 1
    x = lp(x / (len(ms) * 3), 1100); e = np.minimum(1, t / .5) * np.minimum(1, (dur - t) / .5)
    return x * e * g

music = np.zeros(N)
BEAT = 60 / 140
def taiko(t0, t1, g=1.0, full=True):
    t = t0; i = 0
    while t < t1 - .05:
        if i % 8 in (0, 3, 6) or (full and i % 8 == 7): place(music, thud(55 if i % 8 == 0 else 75, .35, 1.0), t, g)
        if full and i % 2 == 1: place(music, hp(rng.standard_normal(int(.05 * SR)), 5000) * np.exp(-T(int(.05 * SR)) * 80) * .25, t, g)
        t += BEAT / 2; i += 1
def bassline(t0, t1, roots, g=1.0):
    t = t0; i = 0
    while t < t1 - .05:
        place(music, pluck(midi(roots[(i // 8) % len(roots)]), BEAT * .5) * .8, t, g); t += BEAT / 2; i += 1
def pad(t0, t1, ch, g=.4): place(music, strings(ch, t1 - t0), t0, g)
DMIN = (50, 57, 62, 65); BB = (46, 53, 58, 62); GM = (43, 50, 55, 58); AA = (45, 52, 57, 61)
def section(t0, t1, g=1.0, drums=True, bass=True, full=True):
    seq = [DMIN, BB, GM, AA]; L = BEAT * 8; k = 0; t = t0
    while t < t1 - .05:
        e = min(t + L, t1); pad(t, e, seq[k % 4], .35 * g); t = e; k += 1
    if drums: taiko(t0, t1, g, full)
    if bass: bassline(t0, t1, [38, 34, 31, 33], .5 * g)
section(0, 9.68, .9)
section(9.68, 14.88, .7, full=False)
section(14.88, 24.9, 1.0)
section(24.9, 27.8, 1.1)
section(27.8, 39.7, .5, drums=False)              # Shinjuku flashback: strings only
section(39.7, 61.8, 1.05)
pad(61.8, 64.4, (50, 57, 62, 66, 69), .6)          # D major lift for the result
for m in (62, 66, 69, 74): place(music, glock(m + 12, 1.4, .3), 61.85)
section(63.9, DUR - .3, .55, full=False)
music = lp(music, 7000)

# ---------------- VO + mix ----------------
vo, vsr = sf.read('audio/vo.wav')
if vo.ndim > 1: vo = vo.mean(1)
vo = signal.resample_poly(vo, SR, vsr)
vo = hp(vo, 90)
# gentle compression
envv = np.abs(signal.hilbert(vo)); envv = lp(envv, 20)
gain = np.where(envv > .15, (.15 / np.maximum(envv, 1e-6)) ** .4, 1.0); vo = vo * gain
vo = vo / np.max(np.abs(vo)) * .9
VO = np.zeros(N); VO[:min(N, len(vo))] = vo[:N]
# duck music under VO
venv = lp(np.abs(VO), 6); vtrack = np.clip(venv / .05, 0, 1)
duck = 1 - .55 * vtrack
mixL = VO * 1.0 + music * .22 * duck + sfx * .7
mixR = mixL.copy()
out = np.stack([mixL, mixR], 1)
fade = np.ones(N); fl = int(.5 * SR); fade[-fl:] = np.linspace(1, 0, fl); out *= fade[:, None]
pk = np.max(np.abs(out)); out = out / pk * .89
sf.write('audio/mix.wav', out, SR)
print('done', out.shape, 'rms dB', 20 * np.log10(np.sqrt(np.mean(out ** 2))))
