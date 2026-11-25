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


sfx = np.zeros(N)
def taiko(g=1): return thud(60, .6, g) + thud(120, .15, .3 * g)[:int(.6 * SR)].tolist() * 0 if False else thud(58, .6, g)
def roar(dur=2.2):
    n = int(dur * SR); t = T(n); x = rng.standard_normal(n)
    f = 70 + 40 * np.sin(2 * np.pi * 3 * t)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * .8 + np.sign(np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)) * .25
    e = np.minimum(1, t / .08) * np.exp(-np.maximum(0, t - .9) * 2.2)
    return (lp(x, 900) * 1.6 + bp(x, 200, 2500) * .7 + tone) * e
def drone(f, dur, g=.3):
    n = int(dur * SR); t = T(n); x = sum(np.sin(2 * np.pi * f * k * t + k) / k for k in (1, 2, 3)) + .4 * np.sin(2 * np.pi * f * 1.005 * t)
    e = np.minimum(1, t / 1.0) * np.minimum(1, (dur - t) / .8); return lp(x, 900) * e * g
def drip(): n = int(.15 * SR); t = T(n); f = 1400 - 6000 * t; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * .5
def splash_sfx(): n = int(.9 * SR); t = T(n); return bp(rng.standard_normal(n), 400, 5000) * np.exp(-t * 5) * 1.2 + thud(70, .4, .8)[:n].tolist() * 0 if False else bp(rng.standard_normal(int(.9*SR)), 400, 5000) * np.exp(-T(int(.9*SR)) * 5) * 1.2
def fire(dur):
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 300, 3000) * (0.6 + .4 * np.sin(2 * np.pi * 7 * t) ** 2)
    return x * np.minimum(1, t / .4) * np.minimum(1, (dur - t) / .3) * .6

# whips
for w in [1.75, 4.35, 5.9, 15.0 * 0 + 14.98, 20.2 * 0 + 20.18, 28.63, 31.98, 41.98, 54.98]: place(sfx, whoosh(.36), w - .22, .35)
place(sfx, pop(500), 0.1, .4); place(sfx, sparkle_sfx(), 2.5, .3); place(sfx, pop(650), 2.45, .35)
place(sfx, whoosh(.5), 3.05, .35); place(sfx, scribble(), 3.5, .5)
for i in range(6): place(sfx, thud(150, .08, .3), 4.4 + i * .24)
place(sfx, riser(3.0), 8.6, .35); place(sfx, fire(1.0), 10.7, .5); place(sfx, chime(1760, 1.0), 11.3, .3)
place(sfx, whoosh(1.0, False), 11.6, .5); place(sfx, splash_sfx(), 12.95, .7); place(sfx, thud(55, .6, .8), 12.95)
for d in [13.8, 14.6, 16.2, 17.1, 26.0, 34.0, 39.0, 47.0, 52.0]: place(sfx, drip(), d, .35)
place(sfx, heartbeat(), 17.7, .5); place(sfx, heartbeat(), 18.4, .55); place(sfx, clang(160, 1.0) * .4, 19.05, .6)
place(sfx, roar(2.4), 22.5, .9); place(sfx, thud(45, .8, 1.0), 22.5)
place(sfx, fire(2.5), 27.4, .5); place(sfx, pop(400), 28.65, .35)
place(sfx, fire(5.0), 32.6, .45); place(sfx, pop(700), 35.1, .4)
for i in range(3): place(sfx, boing(260 - i * 30, .4), 35.6 + i * .1, .3)
place(sfx, whoosh(.6), 37.85, .4); place(sfx, scribble(.3), 40.6, .6); place(sfx, sparkle_sfx(), 40.7, .3)
for i in range(3): place(sfx, pop(500 + i * 120), 42.1 + i * .15, .35)
place(sfx, whoosh(.3), 44.55, .3); place(sfx, pop(600), 44.6, .4); place(sfx, fire(4.5), 44.7, .3)
place(sfx, whoosh(.3), 49.65, .3); place(sfx, pop(800), 49.7, .4); place(sfx, chime(1320, 1.0), 49.75, .3)
place(sfx, roar(1.2), 55.3, .45); place(sfx, thud(50, .5, .8), 55.35)
place(sfx, pop(700), 56.6, .4); place(sfx, pop(900), 57.8, .4); place(sfx, tick(), 58.4, .6); place(sfx, sparkle_sfx(), 58.45, .3)

# music: dark drone + taiko pulse, tension builds, lighter tag at the end
music = np.zeros(N)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
place(music, drone(midi(38), 8.2, .25), 0); place(music, drone(midi(45), 8.2, .15), 0)
place(music, drone(midi(36), 17.5, .3), 8.0); place(music, drone(midi(43), 17.5, .18), 8.0)
place(music, drone(midi(34), 17.5, .32), 25.0); place(music, drone(midi(41), 17.5, .2), 25.0)
place(music, drone(midi(38), 13.5, .25), 42.0); place(music, drone(midi(45), 13.5, .2), 42.0)
place(music, drone(midi(38), 5.0, .25), 55.0)
beat = .5
for k in range(int(60 / beat)):
    tt = k * beat
    if 12.7 < tt < 22.4: continue  # quiet in the corridor until the roar
    g = .5 if k % 4 == 0 else (.25 if k % 2 == 0 else 0)
    if tt > 25: g *= 1.3
    if g: place(music, thud(55, .5, g), tt)
mel = [62, 65, 69, 67, 65, 62, 60, 62]
for i in range(16):
    tt = 0.2 + i * .5
    place(music, pluck(midi(mel[i % 8] + 12), .45) * .35, tt)
for i in range(26):
    tt = 42.2 + i * .5
    place(music, pluck(midi(mel[(i * 3) % 8] + 12), .45) * .3, tt)
music = lp(music, 5000)
mix = music * .5 + sfx * .6
mix = np.stack([mix, mix], 1)
fade = np.ones(N); fl = int(.6 * SR); fade[-fl:] = np.linspace(1, 0, fl); mix *= fade[:, None]
mix = mix / np.max(np.abs(mix)) * .89
sf.write('audio/mix.wav', mix, SR)
print('done', mix.shape)
