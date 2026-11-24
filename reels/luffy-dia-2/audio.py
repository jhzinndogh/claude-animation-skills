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
DUR = (WARP['new_end'] + 0.6 if WARP else 37.4) + 0.6
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

def scratch():
    n = int(.35 * SR); t = T(n); f = 1800 * np.exp(-t * 6) + 200
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .4 + bp(rng.standard_normal(n), 400, 3000) * .6
    return x * np.exp(-t * 5)
def shing():
    n = int(.9 * SR); t = T(n); x = np.zeros(n)
    for r, a in [(1, 1), (1.51, .6), (2.37, .4), (3.9, .25)]: x += a * np.sin(2 * np.pi * 2300 * r * t) * np.exp(-t * 5)
    return x * .3 + hp(rng.standard_normal(n), 4000) * np.exp(-t * 30) * .4
def growl(dur=.9):
    n = int(dur * SR); t = T(n); f = 55 + 15 * np.sin(2 * np.pi * 7 * t)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) + lp(rng.standard_normal(n), 300) * 2) * np.sin(np.pi * t / dur) * .5
def hiss(dur=.6):
    n = int(dur * SR); t = T(n); return hp(rng.standard_normal(n), 3000) * np.sin(np.pi * t / dur) * .4
def click():
    n = int(.08 * SR); t = T(n); return hp(rng.standard_normal(n), 1500) * np.exp(-t * 120) + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 90) * .5
def bang():
    n = int(.5 * SR); t = T(n); return lp(rng.standard_normal(n), 2500) * np.exp(-t * 18) * .9 + thud(60, .5, .6)[:n]
def boom():
    out = thud(40, 1.2, 1.4); n = len(out); t = T(n); return out + lp(rng.standard_normal(n), 400) * np.exp(-t * 4) * .7

sfx = np.zeros(N)
whips = [2.1, 4.05, 9.95, 14.3, 17.95, 20.88, 22.75, 28.85, 30.78, 34.55, 35.62, 38.22, 40.3, 41.4, 44.48, 47.0, 48.72, 50.52]
for w in whips: place(sfx, whoosh(.36), w - .22, .33)
place(sfx, waves(2.4), 0, .25); place(sfx, waves(4.0), 48.7, .25)
# hook + choice
place(sfx, pop(500), .02, .45); place(sfx, pop(700), .32, .35)
place(sfx, thud(120, .2, .5), 3.12); place(sfx, chime(1320, .8), 3.55, .35)
for i in range(7): place(sfx, pop(900 + i * 60), 2.45 + i * .2, .12)
place(sfx, pop(600), 4.86, .3)
place(sfx, pop(450), 6.97, .35); place(sfx, pop(800), 7.82, .3)
# problem
place(sfx, scratch(), 8.83, .55); place(sfx, boing(180, .4), 9.0, .3)
# Zoro
place(sfx, pop(650), 12.47, .3); place(sfx, thud(70, .4, .9), 13.42); place(sfx, clang(300, .6) * .4, 13.42, .4)
place(sfx, scribble(.3), 14.62, .5)
place(sfx, pop(450), 16.77, .35); place(sfx, growl(), 16.95, .7); place(sfx, thud(110, .2, .5), 17.22)
# Helmeppo
place(sfx, pop(500), 18.72, .35); place(sfx, pop(380), 20.05, .35)
# wall jump
place(sfx, whoosh(.8), 20.95, .4); place(sfx, thud(65, .4), 21.83, .6)
# offer
place(sfx, pop(700), 22.82, .3); place(sfx, hp(rng.standard_normal(int(.15 * SR)), 1200) * np.exp(-T(int(.15 * SR)) * 30) * .6, 23.3, .5)
place(sfx, shing(), 24.07, .45); place(sfx, pop(500), 25.7, .35); place(sfx, sparkle_sfx(), 25.75, .3)
place(sfx, sparkle_sfx(), 26.95, .35)
# Morgan
place(sfx, riser(1.25), 27.6, .45)
place(sfx, boom(), 28.85, .75); place(sfx, clang(160, 1.0), 28.86, .45); place(sfx, hiss(.7), 30.1, .45)
# squad
for i in range(8): place(sfx, thud(130, .12, .4), 30.85 + i * .09)
for i in range(5): place(sfx, click(), 31.78 + i * .05, .45)
place(sfx, thud(60, .5, .8), 33.5); place(sfx, thud(60, .4, .6), 33.95)
for k in (.1, .3, .5): place(sfx, pop(800), 34.55 + k, .25)
# freeze + choices
place(sfx, tick(), 35.62, .6); place(sfx, boing(240, .6), 35.8, .45)
place(sfx, pop(520), 36.08, .4); place(sfx, pop(620), 36.38, .4)
# option 1
place(sfx, pop(600), 38.22, .3)
for i in range(5): place(sfx, thud(140, .08, .3), 38.25 + i * .15)
place(sfx, boom() * .8, 39.22, .7); place(sfx, clang(200, .6), 39.22, .4)
place(sfx, whoosh(.4, False), 40.3, .3); place(sfx, shing(), 40.64, .55)
place(sfx, boing(200, .3), 42.25, .3); place(sfx, thud(70, .3, 1.0), 42.48); place(sfx, pop(300), 42.48, .4)
place(sfx, boing(220, .3), 43.75, .3); place(sfx, boom(), 44.0, .8); place(sfx, tweet(), 44.15, .4)
# option 2
place(sfx, pop(600), 44.48, .3)
place(sfx, boing(260, .6), 45.03, .45); place(sfx, hp(rng.standard_normal(int(.2 * SR)), 900) * np.exp(-T(int(.2 * SR)) * 20) * .8, 45.88, .55)
place(sfx, whoosh(.55), 46.03, .45); place(sfx, thud(70, .3, .6), 46.58)
for i in range(14): place(sfx, thud(150, .07, .3), 47.02 + i * .12)
for k in (0, .5, 1.0, .65, 1.15): place(sfx, bang() * .5, 47.0 + k, .35)
place(sfx, chime(880, 1.4), 48.9, .3); place(sfx, chime(660, 1.4), 49.2, .25)
# CTA
place(sfx, pop(500), 52.5, .45); place(sfx, pop(700), 52.75, .35)
place(sfx, pop(550), 55.1, .4); place(sfx, click(), 55.75, .7); place(sfx, sparkle_sfx(), 55.85, .4)

# ---------------- music (procedural sea-shanty jig, D minor, 6/8) ----------------
BPM = 132  # dotted-quarter = beat; eighth = 60/BPM/... use eighth duration
E8 = 60 / BPM / 2 * 1.0  # eighth note seconds (6/8 feel)
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
# adventure open
playful(0, 8.85, DMAJ, .85)
# the problem: lighter minor groove under Zoro / Helmeppo
playful(9.95, 20.88, DM, .7, glock_on=False)
place(music, strings((50, 57, 62), 4.3, .25), 9.95)
# the jump + offer: back to major, glock on
playful(20.88, 27.55, DMAJ, .8)
# Morgan + the squad: tension
place(music, strings((50, 56, 62), 8.0, .5), 27.6)
for k in range(14): place(music, thud(55, .4, .5), 28.85 + k * BEAT)
drone(28.85, 35.6, .9)
# freeze: held chord + question glocks
place(music, strings((50, 57, 62, 65), 2.6, .4), 35.62)
for k, m in enumerate([74, 77, 81, 79, 76]): place(music, glock(m, 1.0, .3), 35.9 + k * .45)
# options
playful(38.22, 44.48, DMAJ, .9)
playful(44.48, 50.52, DM, .85)
# Koby alone
place(music, strings((50, 53, 57), 2.0, .45), 50.52)
for k, m in enumerate([62, 60, 57]): place(music, pizz(m - 12, .8, .5), 50.6 + k * .6)
# call to action
playful(52.5, 56.6, DMAJ, .9)
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), 56.6); place(music, glock(m + 12, 1.3, .25), 56.6)
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
