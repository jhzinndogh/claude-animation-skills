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
DUR = (WARP['new_end'] + 0.6 if WARP else 51.5) + 0.6
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


def buzzer(dur=.35):
    n = int(dur * SR); t = T(n); x = np.sign(np.sin(2 * np.pi * 140 * t)) * .5 + np.sign(np.sin(2 * np.pi * 147 * t)) * .5
    return lp(x, 2500) * np.minimum(1, t / .01) * np.minimum(1, (dur - t) / .03) * .5
def servo(dur=.6):
    n = int(dur * SR); t = T(n); f = 900 + 300 * np.sin(2 * np.pi * 1.5 * t)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .3 + bp(rng.standard_normal(n), 1500, 4000) * .3
    return x * np.sin(np.pi * t / dur) * .6
def siren(dur):
    n = int(dur * SR); t = T(n); f = np.where((t * 2.2) % 1 < .5, 720, 960)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR); x = lp(np.sign(x) * .3 + x * .7, 3000)
    return x * np.minimum(1, t / .2) * np.minimum(1, (dur - t) / .2) * .35
def psst(dur=.45):
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 3000, 9000)
    e = np.where(t < .08, t / .08, 1) * np.exp(-np.maximum(0, t - .08) * 4); return x * e
def click():
    n = int(.05 * SR); t = T(n); return (hp(rng.standard_normal(n), 2500) * np.exp(-t * 150) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * .6) * .8
def whistle(notes, t0, buf, g=.25):
    for i, (dt, m, d) in enumerate(notes):
        n = int(d * SR); t = T(n); f = midi(m) * (1 + .01 * np.sin(2 * np.pi * 6 * t))
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) + bp(rng.standard_normal(n), 2000, 5000) * .08
        place(buf, x * np.minimum(1, t / .03) * np.minimum(1, (d - t) / .05) * g, t0 + dt)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def bulb_buzz(dur):
    n = int(dur * SR); t = T(n); return (np.sin(2 * np.pi * 120 * t) + .5 * np.sin(2 * np.pi * 240 * t)) * .08 * np.minimum(1, t / .3)

sfx = np.zeros(N)
whips = [2.1, 3.72, 5.8, 9.2, 14.0, 20.92, 23.95, 28.0, 32.75, 36.8, 46.0, 48.9]
for w in whips: place(sfx, whoosh(.36), w - .22, .35)
# 0 gate slam + HUD
place(sfx, whoosh(.32, False), 0.0, .45); place(sfx, clang(260, 1.4), .32, .5); place(sfx, thud(45, .6, 1.0), .32, .45)
place(sfx, pop(700), .48, .4); place(sfx, tick(), .55, .4); place(sfx, chime(1568, .5), .6, .2)
for k in range(5): place(sfx, thud(120, .1, .25), .2 + k * .39)   # guard boots
# 1 searchlights
place(sfx, drone_s := (np.sin(2 * np.pi * 55 * T(int(1.7 * SR))) * .3 * np.minimum(1, T(int(1.7 * SR)) / .3)), 2.1, .5)
# 2 calendar
for i in range(10): place(sfx, tick() * .5, 3.87 + i * .11, .3)
for i in range(3): place(sfx, scribble(.2), 5.0 + i * .19, .55)
# 3 solitary door
place(sfx, whoosh(.5, False), 5.9, .3); place(sfx, clang(140, 1.6), 6.42, .5); place(sfx, thud(40, .8, 1.2), 6.42, .5)
place(sfx, bulb_buzz(1.2), 6.45, .6); place(sfx, heartbeat(), 6.9, .5)
# 4 cameras + guards
place(sfx, servo(.9), 7.65, .35); place(sfx, servo(.9), 8.2, .3)
for k in range(5): place(sfx, thud(95, .12, .5), 7.62 + k * .39, .6)
place(sfx, tick(), 8.4, .4); place(sfx, chime(1320, .5), 8.45, .2)
# 5 gauge
place(sfx, pop(500), 9.25, .45); place(sfx, chime(880, .6), 9.4, .25)
for at in (10.15, 11.05): place(sfx, buzzer(), at, .45); place(sfx, pop(400), at, .3)
for at, n in ((10.3, 4), (11.2, 4)):
    for k in range(n): place(sfx, tick(), at + k * .06, .35)
place(sfx, riser(.6), 11.6, .5); place(sfx, siren(1.9), 12.1, .16)
place(sfx, clang(220, 1.2), 12.56, .45); place(sfx, thud(50, .5, 1), 12.56, .4)
for at in (12.75, 13.2, 13.65): place(sfx, clang(900, .4) * .5, at, .35); place(sfx, click(), at, .4)
# 6 cell 402
for k in range(4): place(sfx, thud(110, .1, .35), 14.05 + k * .39)
place(sfx, pop(650), 15.5, .45); place(sfx, sparkle_sfx(), 15.55, .35)
# 7 uniform + spoon
place(sfx, boing(240, .35), 16.85, .3); place(sfx, sparkle_sfx(), 17.85, .25)
place(sfx, whoosh(.25), 18.4, .3); place(sfx, chime(2093, .9), 18.62, .45); place(sfx, sparkle_sfx(), 18.7, .3)
for k in range(3): place(sfx, tweet()[:int(.3 * SR)] * .8, 19.15 + k * .25, .35)   # crickets
# 8 clock
for k in range(12): place(sfx, tick(), 19.86 + k * .09, .5 if k % 2 == 0 else .3)
# 9 yard
place(sfx, tweet(), 21.1, .4); place(sfx, tweet(), 22.2, .3)
place(sfx, pop(600), 23.12, .5); place(sfx, boing(300, .3), 23.12, .3); place(sfx, pop(750), 23.36, .5); place(sfx, boing(360, .3), 23.36, .3)
# 10 rookie + card
whistle([(0, 79, .25), (.3, 83, .25), (.6, 81, .2), (.85, 79, .35)], 24.0, sfx, .25)
place(sfx, whoosh(.5, False), 25.25, .25); place(sfx, click(), 25.9, .7); place(sfx, click(), 26.05, .45); place(sfx, click(), 26.15, .3)
place(sfx, sparkle_sfx(), 26.2, .45); place(sfx, chime(1760, 1.0), 26.25, .3)
# 11 blind spot
place(sfx, servo(1.2), 28.1, .3); place(sfx, servo(1.2), 29.6, .25)
place(sfx, thud(45, .8, .9), 29.85, .45); place(sfx, psst(), 30.6, .45); place(sfx, psst(.3), 31.0, .3)
place(sfx, scribble(.3), 31.25, .5); place(sfx, pop(520), 31.3, .4)
# 12 freeze
place(sfx, whoosh(.6, False), 32.8, .3); place(sfx, pop(620), 33.8, .45); place(sfx, pop(760), 33.92, .4)
place(sfx, pop(900), 34.7, .4); place(sfx, chime(1320, .6), 34.75, .2)
# 13/14 choices
place(sfx, pop(500), 36.85, .5); place(sfx, pop(620), 37.05, .5); place(sfx, chime(1046, .7), 37.25, .3)
place(sfx, pop(800), 39.85, .4); place(sfx, heartbeat(), 40.0, .45)
place(sfx, whoosh(.3), 40.9, .3); place(sfx, chime(1175, .7), 41.05, .3)
for k in range(4): place(sfx, scribble(.15), 44.85 + k * .12, .35)
# 15 comments
for k in range(10): place(sfx, pop(900 + (k % 3) * 150) * .5, 46.2 + k * .2, .25)
place(sfx, sparkle_sfx(), 46.85, .4); place(sfx, thud(50, .6, 1), 48.2, .45); place(sfx, clang(300, .6) * .4, 48.2, .3)
# 16 CTA
place(sfx, pop(560), 48.95, .5); place(sfx, click(), 49.37, .5); place(sfx, sparkle_sfx(), 49.42, .3); place(sfx, chime(1568, 1.2), 49.45, .2)

# ---------------- music ----------------
plk_cache = {}
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
DM = [(38, (62, 65, 69)), (43, (62, 67, 71)), (38, (62, 65, 69)), (45, (61, 64, 67))]
DMAJ = [(38, (62, 66, 69)), (43, (62, 67, 71)), (45, (61, 64, 69)), (38, (62, 66, 69))]
motif = [(0, 74), (.5, 77), (1, 81), (2, 79), (2.5, 77), (3, 76)]
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
                if t + bt * BEAT < t1: place(music, glock(m, 1.0, .35), t + bt * BEAT, g)
        t += 4 * BEAT; bar += 1
def sneak(t0, t1, g=1.0):
    steps = [38, 38, 41, 40, 39, 38, 36, 37]
    t = t0; i = 0
    while t < t1 - .05:
        place(music, reed(steps[i % 8] + 12, .2, .8), t, g); place(music, pizz(steps[i % 8], .35, .6), t, g)
        t += BEAT; i += 1
def pulse(t0, t1, g=1.0, notes=(38, 38, 38, 41)):
    t = t0; i = 0
    while t < t1 - .05:
        place(music, pizz(notes[i % len(notes)], .4, .7), t, g); t += BEAT / 2; i += 1
# arrangement
place(music, strings((38, 45, 50), 2.0, .5), .3)
sneak(2.1, 7.62, .8); place(music, strings((50, 57, 62), 5.5, .3), 2.1)
pulse(7.62, 12.08, .7); place(music, strings((50, 57, 62, 65), 4.5, .3), 7.62)
place(music, strings((50, 56, 62), 2.0, .45), 12.08)
playful(14.0, 20.92, DM, .75, glock_on=False)
sneak(20.92, 28.0, .7)
pulse(28.0, 32.75, .6, (38, 38, 39, 38)); place(music, strings((50, 53, 57), 4.8, .35), 28.0)
place(music, strings((50, 57, 62, 65), 4.0, .4), 32.75)
for k, m in enumerate([62, 65, 69, 72]): place(music, glock(m, .9, .25), 33.0 + k * .3)
pulse(36.8, 46.0, .55, (38, 45, 41, 45)); place(music, strings((50, 57, 62), 9.2, .3), 36.8)
for t0 in (36.8, 40.95): 
    for (bt, m) in motif[:3]: place(music, glock(m, .9, .25), t0 + bt * BEAT)
playful(46.0, DUR - 1.0, DMAJ, .9)
place(music, strings((50, 57, 62, 66), 2.0, .45), 49.4)
for m in (62, 66, 69, 74): place(music, glock(m + 12, 1.3, .22), 49.42)
music = lp(music, 6000)

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
