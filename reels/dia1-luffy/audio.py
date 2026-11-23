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

sfx = np.zeros(N)
def crack():
    n = int(.35 * SR); t = T(n); return hp(rng.standard_normal(n), 1200) * np.exp(-t * 18) * .9 + thud(80, .35, .9)
def splash():
    n = int(.6 * SR); t = T(n); return bp(rng.standard_normal(n), 400, 4000) * np.exp(-t * 7) * .8
def rumble(dur):
    n = int(dur * SR); t = T(n); return lp(rng.standard_normal(n), 160, 2) * (0.6 + .4 * np.sin(2 * np.pi * .7 * t)) * np.minimum(1, t / .5) * np.minimum(1, (dur - t) / .4) * 2.2
def scrub(dur):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1800, 7000) * (0.5 + .5 * np.sin(2 * np.pi * 1.6 * t) ** 2) * .35
whips = [1.92, 5.36, 8.48, 12.24, 18.88, 23.79, 26.40, 37.36, 47.28, 51.04, 59.20, 64.56, 66.96, 74.00]
for w in whips: place(sfx, whoosh(.36), w - .22, .35)
place(sfx, waves(8.6), 0, .25); place(sfx, waves(12), 12.24, .2); place(sfx, waves(8), 51.04, .18); place(sfx, waves(6), 82.64, .15)
# A barrel bursts, Luffy stretches
place(sfx, crack(), .35, .8); place(sfx, whoosh(.5), .3, .3); place(sfx, boing(240, .5), .65, .35)
place(sfx, pop(500), 4.52, .35)                                   # B "?"
place(sfx, thud(50, .6, 1.0), 7.06, .6); place(sfx, crack() * .5, 7.06, .4)   # C cannon
place(sfx, pop(600), 8.68, .3); place(sfx, pop(700), 10.33, .45); place(sfx, sparkle_sfx(), 11.23, .35)   # D meat, crown
place(sfx, sparkle_sfx(), 12.24, .25)                                         # E flashback
place(sfx, rumble(3.8), 15.12, .4); place(sfx, whoosh(.4), 16.85, .35); place(sfx, thud(110, .2, .6), 17.27, .5); place(sfx, splash(), 17.3, .25)   # F
place(sfx, sparkle_sfx(), 20.08, .35); place(sfx, chime(1568, .9), 20.9, .25); place(sfx, boing(200, .7), 22.13, .45); place(sfx, pop(900), 23.62, .4)  # G
for t0 in (.18, .88, 1.76): place(sfx, pop(650), 23.79 + t0, .4); place(sfx, thud(90, .25, .6), 23.79 + t0 + .42, .45)   # H
for i in range(5): place(sfx, thud(150, .08, .3), 26.4 + i * .33, .4)        # I footsteps
place(sfx, scrub(3.0), 26.5, .5); place(sfx, pop(800), 29.6, .4); place(sfx, scrub(3.3), 30.9, .5)
place(sfx, thud(45, .6, .8), 32.98, .5); place(sfx, clang(150, .7) * .4, 32.98, .3)   # J portrait sting
place(sfx, pop(600), 35.48, .3); place(sfx, sparkle_sfx(), 35.6, .35)
place(sfx, crack(), 39.44, 1.0); place(sfx, thud(40, .8, 1.0), 39.44, .7)     # K door bursts
for st in (40.1, 40.6, 41.1): place(sfx, thud(55, .3, .8), st, .5)
place(sfx, whoosh(.3), 41.4, .3); place(sfx, clang(220, .8) * .4, 41.68, .5)
place(sfx, whoosh(.3), 43.55, .4); place(sfx, clang(300, .8), 43.84, .5); place(sfx, boing(180, .9), 43.88, .55); place(sfx, tweet(), 44.1, .45)   # L
place(sfx, boing(260, .5), 46.7, .3)
place(sfx, boing(150, .9), 47.58, .4); place(sfx, riser(1.25), 47.6, .45); place(sfx, whoosh(.25), 48.75, .55)   # M pistol
place(sfx, crack(), 48.95, 1.0); place(sfx, thud(38, .9, 1.0), 48.95, .8); place(sfx, clang(420, .9), 48.95, .4)
place(sfx, whoosh(.9, False), 49.3, .35); place(sfx, chime(2637, .6), 50.48, .45); place(sfx, sparkle_sfx(), 50.5, .3)   # N twinkle
place(sfx, sparkle_sfx(), 53.9, .25)                                          # O sea
place(sfx, tick(), 55.6, .8); place(sfx, pop(300), 55.62, .4)                 # P freeze
for t0 in (56.8, 57.05, 57.3): place(sfx, pop(700), t0, .4)
place(sfx, pop(500), 58.45, .4)
place(sfx, pop(650), 59.2, .35); place(sfx, pop(750), 63.1, .35)             # Q1
place(sfx, chime(1975, 1.2) * .6, 66.26, .35); place(sfx, clang(900, .8) * .3, 66.26, .3)   # Q2 Zoro reveal
place(sfx, pop(650), 66.96, .35); place(sfx, thud(90, .25, .6), 69.71, .45)   # R
place(sfx, whoosh(.7), 71.5, .35); place(sfx, sparkle_sfx(), 72.2, .35); place(sfx, pop(800), 71.86, .4)
place(sfx, pop(650), 74.0, .35); place(sfx, whoosh(.6), 74.8, .4); place(sfx, thud(90, .25, .6), 76.0, .45)   # S1
place(sfx, pop(400), 77.36, .5); place(sfx, whoosh(.4, False), 77.36, .3)     # S2 poof
place(sfx, thud(40, .7, 1.0), 79.46, .7); place(sfx, sparkle_sfx(), 81.11, .4); place(sfx, chime(1318, 1.2), 81.11, .3)
place(sfx, pop(500), 82.64, .45)                                              # T
for i in range(3): place(sfx, pop(600 + i * 120), 82.89 + i * .12, .35)
place(sfx, pop(900), 83.52, .45); place(sfx, pop(650), 86.04, .4); place(sfx, tick(), 86.8, .9); place(sfx, pop(1000), 86.84, .4)

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
playful(0, 12.24, DM, .8, glock_on=False)
for (bt, m) in motif: place(music, glock(m, 1.0, .3), 1.95 + bt * BEAT * .5)
# flashback: soft pad + glock
place(music, strings((50, 57, 62), 6.7, .35), 12.2)
for k, m in enumerate([74, 77, 81, 79, 77, 76, 74, 69]): place(music, glock(m, 1.0, .22), 12.3 + k * BEAT)
for k in range(6): place(music, pizz([38, 45][k % 2], .6, .5), 15.1 + k * BEAT * 1.2)
# present day: bright
playful(18.88, 26.4, DMAJ, .8)
# the hold: tiptoe
sneak(26.4, 35.4, .7); place(music, strings((50, 57, 62), 9.0, .22), 26.4)
place(music, strings((50, 57, 62, 66), 2.0, .4), 35.4)
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .3), 35.5 + k * .2)
# Alvida: tension
drone(37.36, 47.28, .9); sneak(39.6, 43.0, 1.0)
place(music, strings((50, 56, 62), 4.0, .35), 43.2)
# pistol: silence, then a big chord on the hit
for m in (38, 50, 57, 62, 66): place(music, pizz(m, 1.2, .8), 48.95)
place(music, strings((50, 57, 62, 66, 69), 2.0, .55), 48.95)
# free ship + options
playful(51.04, 55.6, DMAJ, .9)
place(music, strings((50, 57, 62, 66), 3.6, .3), 55.6)
playful(59.2, 82.64, DM, .6, glock_on=True)
playful(82.64, 87.9, DMAJ, .9)
place(music, strings((50, 57, 62, 66), 1.4, .5), 87.6)
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), 87.7); place(music, glock(m + 12, 1.3, .25), 87.7)
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
