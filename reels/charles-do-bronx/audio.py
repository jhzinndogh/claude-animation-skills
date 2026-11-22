import numpy as np, soundfile as sf, json
from scipy import signal
SR = 44100
import json as _j, os as _os, re
WARP = _j.load(open('audio/warp.json')) if _os.path.exists('audio/warp.json') else None
def toNew(x):
    if not WARP: return x
    A = WARP['anchors']
    if x <= A[0][0]: return x - A[0][0] + A[0][1]
    for i in range(len(A) - 1):
        if x <= A[i + 1][0]: k = (x - A[i][0]) / (A[i + 1][0] - A[i][0]); return A[i][1] + k * (A[i + 1][1] - A[i][1])
    return x - A[-1][0] + A[-1][1]
SHOTS = json.load(open('audio/shots.json')); WORDS = json.load(open('audio/words.json'))
DUR = SHOTS[-1]['e'] + 0.3
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


def crowd(dur, g=1.0):
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 300, 2800) + .5 * bp(rng.standard_normal(n), 2500, 6000)
    e = np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .6) * (0.8 + .2 * np.sin(2 * np.pi * 1.3 * t))
    return x * e * .5 * g
def boo(dur):
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 150, 700) * (0.7 + .3 * np.sin(2 * np.pi * 2 * t))
    return x * np.minimum(1, t / .2) * np.minimum(1, (dur - t) / .3) * .7
def rip():
    n = int(.35 * SR); t = T(n); return bp(rng.standard_normal(n), 1200, 7000) * (0.5 + .5 * np.sign(np.sin(2 * np.pi * 45 * t))) * np.exp(-t * 6)
def beep(): n = int(.12 * SR); t = T(n); return np.sin(2 * np.pi * 1760 * t) * np.minimum(1, t / .003) * np.minimum(1, (.12 - t) / .02) * .4
def S(i): return SHOTS[i]['s']
def wf(li, w, nth=0):
    m = [x for x in WORDS if x['line'] == li and re.sub(r"[^\wÀ-ÿ-]", "", x['w']) == w]
    return (m[nth] if len(m) > nth else m[0])['s']
sfx = np.zeros(N)
for i, s in enumerate(SHOTS[:-1]):
    if s['tr'] == 'whip': place(sfx, whoosh(.36), s['e'] - .22, .35)
# 0 hook: monitor beeps, wheelchair roll
for k in range(7): place(sfx, beep(), .15 + k / 1.6, .35)
place(sfx, whoosh(.7, False), 1.9, .3)
# 1 belt: crowd, flash, sparkle
place(sfx, crowd(4.0), S(1), .5); place(sfx, sparkle_sfx(), S(1) + .9, .45); place(sfx, clang(700, .8), S(1) + .9, .3)
# 2 name card
place(sfx, crowd(2.5, .6), S(2), .35); place(sfx, pop(500), S(2) + .2, .4)
# 3 1989 + banner
place(sfx, pop(600), S(3) + .25, .45); place(sfx, pop(800), S(3) + 1.2, .4); place(sfx, waves(3.6), S(3), .15)
# 4 kid runs (footsteps)
for k in range(10): place(sfx, thud(160, .06, .25), S(4) + .2 + k * .24)
# 5 tray, bubble, coins
place(sfx, pop(700), S(5) + 1.8, .4)
for k in range(3): place(sfx, chime(2093 + k * 200, .4), S(5) + 3.8 + k * .35, .35)
# 6 collapse
place(sfx, thud(55, .5, 1), S(6) + .6, .9); place(sfx, heartbeat(), S(6) + .7, .6)
# 7 diagnosis banners + heartbeat
for k in range(4): place(sfx, heartbeat(), S(7) + .2 + k * .9, .35)
place(sfx, pop(600), wf(5, 'febre'), .4); place(sfx, pop(750), wf(5, 'sopro'), .4)
# 8 two years: calendar flips
for k in range(int((S(9) - S(8)) * 6)): place(sfx, tick(), S(8) + k / 6, .18)
place(sfx, pop(600), S(8) + .6, .4)
# 9 no sports stamp
place(sfx, thud(60, .4, .9), wf(7, 'nada'), .7)
# 10 rip
place(sfx, rip(), S(10) + .5, .7); place(sfx, sparkle_sfx(), S(10) + .7, .3)
# 11 dojo: 12 anos pop, the throw
place(sfx, pop(650), S(11) + .1, .45); place(sfx, whoosh(.6), S(11) + 2.0, .4); place(sfx, thud(60, .4, 1), S(11) + 2.7, .9); place(sfx, tweet(), S(11) + 2.9, .4)
# 12 medals
for k in range(9): place(sfx, chime(1568 + (k % 4) * 260, .5), S(12) + .3 + k * .2, .3)
# 13 debut
place(sfx, crowd(3.4, .5), S(13), .35); place(sfx, pop(600), wf(10, '2010'), .45); place(sfx, pop(800), wf(10, '20'), .4)
# 14 shove
place(sfx, thud(70, .4, 1), S(14) + .5, .8); place(sfx, boing(200, .5), S(14) + .8, .4)
# 15 scale: needle ticks + sizzle
for k in range(10): place(sfx, tick(), S(15) + k * .18, .2)
# 16 losses: one hit per X
for k in range(3): place(sfx, thud(50, .35, .8), S(16) + .15 + k * .35, .6)
# 17 amarelão: boos + bubble pops
place(sfx, boo(S(18) - S(17)), S(17), .35)
tA = wf(11, 'amarelão')
for k in range(4): place(sfx, pop(500 + k * 100), tA + k * .25, .4)
# 18 key turn + step up
place(sfx, tick(), S(18) + .5, .6); place(sfx, clang(900, .6), S(18) + .8, .35); place(sfx, boing(260, .45), S(18) + 1.0, .4); place(sfx, thud(65, .35, .8), S(18) + 1.6, .6)
# 19 streak: one punch per win
dur = S(20) - S(19)
for k in range(11): place(sfx, thud(80 + k * 4, .25, .9), S(19) + .3 + k * (dur - .8) / 11, .55)
place(sfx, crowd(dur, .8), S(19), .35)
# 20 KO
tK = wf(14, 'nocauteou') + .25
place(sfx, pop(600), wf(14, '2021') - .1, .45); place(sfx, whoosh(.2), tK - .15, .5); place(sfx, thud(45, .7, 1.2), tK, 1.0); place(sfx, clang(300, .8), tK, .35)
place(sfx, crowd(S(21) - tK + 2.0, 1.2), tK + .1, .55)
# 21 belt on
place(sfx, sparkle_sfx(), S(21) + .8, .45); place(sfx, clang(800, .9), S(21) + .8, .25)
# 22 giants fall
dur = S(23) - S(22)
for k in range(3): place(sfx, thud(40, .6, 1.1), S(22) + .5 + k * (dur - 1) / 3 + .4, .8)
# 23 chisel
for k in range(8): place(sfx, clang(1400 + k * 40, .25) * .4, S(23) + .3 + k * 1.4 / 8, .3)
# 24 records: risers + #1 pops
place(sfx, riser(.9), S(24), .3); place(sfx, pop(900), S(24) + .9, .45)
t2 = wf(16, 'mais', 1); place(sfx, riser(.9), t2, .3); place(sfx, pop(1000), t2 + .9, .45)
# 25 pan up the mountain
place(sfx, riser(S(26) - S(25)), S(25), .35); place(sfx, sparkle_sfx(), S(26) - .4, .35)
# 26 the scream: crowd goes wild
place(sfx, crowd(S(27) - S(26) + .5, 1.4), S(26), .6); place(sfx, boing(180, .5), wf(17, 'sem'), .35); place(sfx, pop(700), wf(17, 'nome'), .5)
# 27 top 5 rows
for k in range(5): place(sfx, pop(500 + k * 80), S(27) + .2 + k * .15, .35)
# 28 comment bubble
place(sfx, pop(700), S(28), .5)
for k in range(4): place(sfx, boing(300, .3), S(28) + .3 + k * .6, .12)

# ---------------- music: playful underscore, minor while it's hard, major once the key turns ----------------
music = np.zeros(N); plk_cache = {}
BPM = 132
E8 = 60 / BPM / 2
# D minor, 6/8 helpers
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

playful(0, S(1), DM, .5, glock_on=False, stabs=False)
place(music, strings((50, 57, 62), S(1) + .3, .3), 0)
for (bt, m) in motif: place(music, glock(m, 1.0, .35), S(1) + .9 + bt * BEAT * .5)
playful(S(1), S(3), DMAJ, .8)
playful(S(3), S(6), DM, .75, glock_on=False)
place(music, strings((50, 57, 62), S(10) - S(6) + .3, .4), S(6))
for k in range(int((S(10) - S(6)) / (BEAT * 1.5))): place(music, pizz([38, 45][k % 2], .6, .5), S(6) + .1 + k * BEAT * 1.5)
playful(S(10), S(15), DM, .85)
sneak(S(15), S(18) - .2, .8)
place(music, strings((50, 56, 62), S(18) - S(15), .3), S(15))
for k, m in enumerate([62, 66, 69, 74, 78, 81]): place(music, glock(m, .9, .3), S(18) + .6 + k * .12)
playful(S(18), S(25), DMAJ, .9)
place(music, strings((50, 57, 62, 66), S(25) - S(18), .3), S(18))
place(music, strings((50, 57, 62, 66), S(27) - S(25), .5), S(25))
playful(S(25), S(28) + 1.0, DMAJ, 1.0)
end = SHOTS[-1]['e'] - 1.2
for m in (62, 66, 69, 74): place(music, pizz(m - 12, .8, .5), end); place(music, glock(m + 12, 1.3, .3), end)
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
