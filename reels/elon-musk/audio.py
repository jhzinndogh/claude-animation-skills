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
DUR = 60.0
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


def boom(dur=1.6):
    n = int(dur * SR); t = T(n)
    x = lp(rng.standard_normal(n), 400, 2) * np.exp(-t * 3) * 1.6 + thud(42, dur, 1.2)[:n] + bp(rng.standard_normal(n), 1500, 7000) * np.exp(-t * 18) * .6
    return x
def rumble(dur):
    n = int(dur * SR); t = T(n); return lp(rng.standard_normal(n), 220, 2) * 2.2 * np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .2) + bp(rng.standard_normal(n), 600, 3000) * .25 * np.minimum(1, t / dur)
def beep(f=1000, d=.12): n = int(d * SR); t = T(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, t / .005) * np.minimum(1, (d - t) / .01) * .5
def kaching():
    out = np.zeros(int(1.2 * SR)); place(out, clang(1200, .4) * .4, 0); place(out, chime(2637, 1.0), .08); place(out, chime(3520, .9), .14); return out
def thunder():
    n = int(2.2 * SR); t = T(n); x = lp(rng.standard_normal(n), 300, 2) * (np.exp(-t * 2) + .5 * np.exp(-np.maximum(0, t - .3) * 3) * (t > .3)) * 2
    return x + hp(rng.standard_normal(n), 2000) * np.exp(-t * 30) * .7
def zap(): n = int(.25 * SR); t = T(n); f = 1800 * np.exp(-t * 8) + 200; return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 14) * .25
def scrape(d=.8): n = int(d * SR); t = T(n); return bp(rng.standard_normal(n), 200, 1200) * np.sin(np.pi * t / d) * .7
def up_tone(d=1.0): n = int(d * SR); t = T(n); f = 300 * 2 ** (t / d * 2); return np.sin(2 * np.pi * np.cumsum(f) / SR) * .3 * np.minimum(1, t / .05) * np.exp(-np.maximum(0, t - d * .8) * 10)

sfx = np.zeros(N)
for w in [2.8, 6.4, 8.05, 10.05, 15.65, 19.4, 22.05, 25.35, 29.5, 31.7, 33.4, 40.05, 43.25, 44.55, 46.7, 48.1, 50.15, 53.05, 55.75, 58.5]:
    place(sfx, whoosh(.36), w - .22, .4)
# 0 shove + stairs
place(sfx, whoosh(.3), .45, .4)
for i, a in enumerate([.68, .8, .92]): place(sfx, thud(120 - i * 15, .15, .6), a)
place(sfx, thud(55, .5, 1), 1.05); place(sfx, pop(400), 1.05, .4); place(sfx, tweet(), 1.15, .5)
# 1 hospital
for a in [1.95, 2.42]: place(sfx, beep(1000), a, .35)
# 2 rocket blows up
place(sfx, rumble(1.6), 2.95, .5); place(sfx, boom(), 4.48, .9)
# 3 counter
for i in range(26): place(sfx, tick(), 4.95 + 1.15 * (i / 26) ** .7, .3)
place(sfx, kaching(), 6.1, .6)
# 4 reveal
place(sfx, riser(1.0), 6.45, .25); place(sfx, sparkle_sfx(), 7.3, .4)
# 5 savanna
place(sfx, pop(500), 8.6, .4)
for i in range(6): place(sfx, thud(160, .06, .2), 8.2 + i * .35)
# 6 bullies
place(sfx, boing(260, .4), 12.05, .4); place(sfx, pop(700), 12.55, .35); place(sfx, pop(800), 12.65, .35)
# 7 books
place(sfx, whoosh(.6), 13.65, .3); place(sfx, sparkle_sfx(), 13.8, .4)
# 8 code
place(sfx, pop(600), 16.15, .4); place(sfx, chime(1568, .8), 16.2, .4); place(sfx, pop(900), 18.15, .4)
for i in range(14): place(sfx, tick(), 18.65 + i * .055 + (i % 3) * .01, .45)
# 9 sale
place(sfx, kaching(), 21.1, .6)
for i in range(6): place(sfx, chime(2093 + i * 120, .3) * .4, 21.15 + i * .05)
# 10 PayPal
place(sfx, whoosh(.5), 22.95, .3)
for a in [23.95, 24.1, 24.95]: place(sfx, thud(70, .35, .9), a); place(sfx, chime(2637, .4) * .3, a)
# 11 beach
place(sfx, pop(500), 25.85, .4); place(sfx, whoosh(.4), 26.8, .45); place(sfx, thud(140, .2, .7), 26.9); place(sfx, scrape(1.2), 27.45, .5)
# 12 crazy
place(sfx, boing(200, .6), 31.25, .5); place(sfx, pop(500), 31.25, .4)
# 13 car
place(sfx, whoosh(.9), 31.6, .6); place(sfx, zap(), 32.4, .5); place(sfx, zap(), 32.55, .5)
# 14 rocket
place(sfx, sparkle_sfx(), 33.5, .25)
# 15 nightmare
place(sfx, pop(300), 34.8, .4); place(sfx, thunder(), 35.95, .8)
for a in [36.45, 36.95, 37.45]: place(sfx, boom(1.2), a, .75)
# 16 broke
for i in range(4): place(sfx, heartbeat(), 37.95 + i * .55, .55)
place(sfx, scribble(), 38.8, .5); place(sfx, scribble(), 39.4, .5)
# 17 fourth launch
place(sfx, rumble(2.4), 40.3, .55); place(sfx, riser(2.2), 40.4, .3)
place(sfx, sparkle_sfx(), 42.65, .5); place(sfx, chime(1046, 1.2), 42.65, .5)
for i in range(8): place(sfx, pop(500 + i * 90), 42.65 + i * .04, .2)
# 18 contract
place(sfx, pop(600), 43.35, .3); place(sfx, thud(60, .3, .9), 43.95)
# 19 tesla
place(sfx, up_tone(1.0), 44.75, .5); place(sfx, pop(700), 45.75, .4); place(sfx, sparkle_sfx(), 45.8, .35)
# 20 landing
place(sfx, rumble(1.0), 46.7, .45); place(sfx, thud(50, .5, 1), 47.75); place(sfx, hp(rng.standard_normal(int(.4 * SR)), 600) * np.exp(-T(int(.4 * SR)) * 8) * .4, 47.75)
# 21 empire
for a, f in [(48.15, 600), (48.6, 750), (49.9, 900)]: place(sfx, pop(f), a, .5); place(sfx, chime(f * 2, .5) * .4, a)
# 22 richest
for i in range(10): place(sfx, chime(2637 + (i % 3) * 300, .25) * .25, 50.3 + i * .25)
place(sfx, whoosh(.4, False), 51.3, .3); place(sfx, clang(900, .6) * .4, 51.7); place(sfx, sparkle_sfx(), 51.72, .4); place(sfx, pop(800), 51.75, .4)
# 23 genius / madman / dice
place(sfx, pop(600), 53.1, .4); place(sfx, chime(1568, .6), 53.12, .35); place(sfx, boing(300, .5), 53.45, .5)
for i in range(9): place(sfx, tick(), 54.65 + i * .075, .6)
place(sfx, thud(110, .2, .8), 55.35); place(sfx, sparkle_sfx(), 55.36, .4)
# 24 mars
place(sfx, rumble(2.6), 55.8, .25); place(sfx, pop(500), 56.95, .4)
# 25 comment
place(sfx, pop(700), 58.6, .5); place(sfx, boing(400, .4), 58.7, .3)

# ---------------- music ----------------
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def saw_pad(f, dur, g=.2):
    n = int(dur * SR); t = T(n); vib = 1 + .004 * np.sin(2 * np.pi * 5.5 * t)
    ph = np.cumsum(f * vib) / SR; x = 2 * (ph % 1) - 1 + .6 * (2 * ((ph * 1.005) % 1) - 1)
    x = lp(x, 1400); e = np.minimum(1, t / .06) * np.minimum(1, (dur - t) / .08)
    return x * e * g

plk_cache = {}
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
# progressions (root, chord tones) in midi
DM = [(38, (62, 65, 69)), (43, (62, 67, 71)), (38, (62, 65, 69)), (45, (61, 64, 67))]   # Dm G Dm A7
DMAJ = [(38, (62, 66, 69)), (43, (62, 67, 71)), (45, (61, 64, 69)), (38, (62, 66, 69))]  # D G A D
motif = [(0, 74), (.5, 77), (1, 81), (2, 79), (2.5, 77), (3, 76)]  # glock line over 1 bar
def playful(t0, t1, prog, g=1.0, glock_on=True, stabs=True):
    t = t0; bar = 0
    while t < t1 - .05:
        root, ch = prog[bar % 4]
        place(music, pizz(root, .5, .9), t, g); place(music, pizz(root + 7, .5, .7), t + 2 * BEAT, g)
        if stabs:
            for bt in (1, 3): 
                for m in ch: place(music, pizz(m - 12, .3, .28), t + bt * BEAT, g)
        if glock_on and bar % 2 == 0:
            for (bt, m) in motif:
                mm = m if prog is DM else m + (1 if m % 12 in (5,) else 0)
                if t + bt * BEAT < t1: place(music, glock(mm, 1.0, .35), t + bt * BEAT, g)
        t += 4 * BEAT; bar += 1
def sneak(t0, t1, g=1.0):
    steps = [38, 38, 41, 40, 39, 38, 36, 37]
    t = t0; i = 0
    while t < t1 - .05:
        place(music, reed(steps[i % 8] + 12, .2, .8), t, g); place(music, pizz(steps[i % 8], .35, .6), t, g)
        t += BEAT * (1 if i % 2 == 0 else 1); i += 1

playful(0, 2.8, DM, .6, glock_on=False, stabs=False)
playful(6.4, 34.75, DM, .8)
place(music, strings((50, 57, 62), 5.4, .4), 34.7)
for k in range(10): place(music, pizz([38, 37][k % 2], .6, .55), 34.8 + k * BEAT)
for k, m in enumerate([62, 65, 69, 72, 74, 77, 81, 84]): place(music, glock(m, .9, .28 + k * .02), 40.6 + k * .26)
place(music, strings((50, 57, 62, 66), 3.0, .4), 40.1)
playful(42.65, 53.05, DMAJ, .9)
playful(53.05, 59.4, DM, .7, glock_on=False)
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), 59.3); place(music, glock(m + 12, 1.3, .25), 59.3)
music = lp(music, 6000)

# ---------------- mix: no voiceover, just music + sfx ----------------
mix = music * .55 + sfx * .8
out = np.stack([mix, mix], 1)
fade = np.ones(N); fl = int(.5 * SR); fade[-fl:] = np.linspace(1, 0, fl); out *= fade[:, None]
out = out / np.max(np.abs(out)) * .89
sf.write('audio/mix.wav', out, SR)
print('done', out.shape)
