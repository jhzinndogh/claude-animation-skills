import numpy as np, soundfile as sf, json, re
from scipy import signal
SR = 44100
DUR = 60.6
N = int(DUR * SR)
rng = np.random.default_rng(3)
def T(n): return np.arange(n) / SR
def place(buf, x, at, g=1.0):
    i = int(at * SR); j = min(len(buf), i + len(x))
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


def midi(m): return 440 * 2 ** ((m - 69) / 12)
def noise(d): return rng.standard_normal(int(d * SR))
def crowd(dur):
    n = int(dur * SR); t = T(n); x = bp(noise(dur), 300, 3000) * .6 + bp(noise(dur), 900, 1800) * .5
    return x * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .4) * (0.8 + .2 * np.sin(2 * np.pi * 1.3 * t))
def rustle(dur=.25):
    n = int(dur * SR); t = T(n); return bp(noise(dur), 2500, 9000) * (0.5 + .5 * np.sign(np.sin(2 * np.pi * 23 * t))) * np.sin(np.pi * t / dur) * .7
def crackle(dur):
    n = int(dur * SR); x = np.zeros(n); k = rng.random(n) < 0.004; x[k] = rng.uniform(-1, 1, k.sum()); return hp(x, 1500) * 2 + bp(noise(dur), 3000, 7000) * .15
def cricket(dur):
    n = int(dur * SR); t = T(n); g = (np.sin(2 * np.pi * 28 * t) > 0) * (np.sin(2 * np.pi * 1.6 * t) > .2)
    return np.sin(2 * np.pi * 4300 * t) * g * .25
def clock_tick(): return tick() * .6
def slam(): return thud(55, .5, 1.0) + clang(140, .5) * .25
def sad_trombone(t0, g=1.0):
    for i, (m, d) in enumerate([(55, .32), (54, .32), (53, .32), (52, 1.0)]):
        n = int(d * SR); t = T(n); f = midi(m) * (1 + (.02 * np.sin(2 * np.pi * 6 * t) if i == 3 else 0)); ph = np.cumsum(f) / SR
        x = lp(np.sign(np.sin(2 * np.pi * ph)) * .5 + (2 * (ph % 1) - 1) * .5, 1200) * np.minimum(1, t / .02) * np.minimum(1, (d - t) / .05)
        place(sfx, x * .35, t0 + i * .32, g)
def chaching(t0, g=1.0):
    place(sfx, hp(noise(.08), 2000) * np.exp(-T(int(.08 * SR)) * 40), t0, .5 * g)
    place(sfx, chime(1568, .9), t0 + .08, .9 * g); place(sfx, chime(2093, 1.0), t0 + .16, .9 * g)
def beep(f=880, d=.12):
    n = int(d * SR); t = T(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, (d - t) / .01) * .5
def boom(d=1.2):
    n = int(d * SR); t = T(n); return thud(45, d, 1.2) + lp(noise(d), 400) * np.exp(-t * 3) * .8
def fanfare(t0, g=1.0):
    for i, m in enumerate([72, 76, 79, 84]): place(sfx, chime(midi(m), 1.4), t0 + i * .1, .8 * g)
    for m in (60, 64, 67, 72): place(sfx, chime(midi(m), 1.8), t0 + .45, .5 * g)
def crunch():
    d = .25; n = int(d * SR); t = T(n); x = np.zeros(n); k = rng.random(n) < .02; x[k] = 1; return bp(x + noise(d) * .3, 800, 6000) * np.exp(-t * 14) * 1.4

sfx = np.zeros(N)
# whooshes on every whip transition
for w in [3.65, 6.3, 8.05, 12.55, 14.65, 19.1, 22.0, 32.0, 34.55, 38.3, 40.0, 44.5, 46.2, 47.25, 49.05, 51.1, 53.05, 55.4]: place(sfx, whoosh(.36), w - .22, .35)
# caption pops, very quiet
W = json.load(open('audio/words.json')); chunks = []; cur = None
for i, w in enumerate(W):
    prev = W[i - 1] if i else None
    brk = cur is None or len(cur['w']) >= 2 or len(' '.join(cur['w'] + [w['w']])) > 13 or (prev and re.search(r'[.,?!:]$', prev['w'])) or (prev and prev['line'] != w['line'])
    if brk: cur = {'w': [w['w']], 's': w['s']}; chunks.append(cur)
    else: cur['w'].append(w['w'])
for c in chunks: place(sfx, pop(900), c['s'], .06)
# 0 thrown out
place(sfx, whoosh(.5), 0.0, .5); place(sfx, thud(60, .45, 1), .6, .8); place(sfx, boing(240, .5), .62, .4)
place(sfx, whoosh(.4), 1.1, .3); place(sfx, thud(80, .3, .8), 1.6, .6); place(sfx, whoosh(.4), 1.6, .25)
place(sfx, slam(), 2.45, .8)
# 1 game set: crowd + cash
place(sfx, crowd(2.7), 3.65, .35)
for i in range(10): place(sfx, rustle(.2), 3.8 + i * .25, .25)
# 2 title
place(sfx, boom(1.0), 6.3, .5); place(sfx, sparkle_sfx(), 6.4, .4)
# 3 bedroom gameplay, bad mic
for i in range(40): place(sfx, tick(), 8.2 + i * .1 + rng.random() * .04, .18)
place(sfx, crackle(1.1), 11.45, .5)
# 4 nobody watching
place(sfx, cricket(2.1), 12.55, .5)
for k in range(6): place(sfx, tick(), 12.6 + k * .34, .5)
# 5 obsessed
for i in range(9): place(sfx, scribble(), 14.75 + i * .29, .45)
for i in range(30): place(sfx, clock_tick(), 14.7 + i * .15, .3)
place(sfx, boing(400, .5), 17.15, .3)
# 6 drops college, all in
place(sfx, whoosh(.5), 19.4, .4); place(sfx, clang(300, .6), 19.98, .5)
for i in range(12): place(sfx, tick(), 20.4 + i * .05, .5)
place(sfx, pop(500), 20.95, .5); place(sfx, sparkle_sfx(), 21.0, .3)
# 7 mom, door slam, rain, sad trombone
place(sfx, slam(), 23.25, 1.0); place(sfx, lp(noise(1.3), 3000) * .3, 23.35, .4)
sad_trombone(23.4, .7)
# 8 counting for 40 hours
place(sfx, chime(1320, 1.0) * .5, 24.65, .3)
tt = 26.95
while tt < 30.8: place(sfx, tick(), tt, .35); tt += max(.035, .14 - (tt - 26.95) * .03)
place(sfx, riser(1.2), 29.8, .5)
# 9 blows up
place(sfx, boom(1.3), 31.0, .9); place(sfx, sparkle_sfx(), 31.15, .4)
# 10 sponsorship
chaching(32.3, .8)
# 11 gives it away
for i in range(4): place(sfx, rustle(.18), 34.9 + i * .2, .35)
place(sfx, boing(300, .4), 35.95, .35)
for i in range(5): place(sfx, pop(700 + i * 120), 35.95 + i * .15, .3)
# 12 formula
for i in range(4): place(sfx, scribble(.15), 38.3 + i * .25, .5)
place(sfx, chime(1760, .9), 39.2, .5)
# 13 reinvest
for i in range(28): place(sfx, chime(2600 + (i % 3) * 300, .2) * .5, 40.1 + i * .155, .25)
for k in range(4): place(sfx, pop(450 + k * 120), 40.4 + k * .9, .45)
place(sfx, boom(.8), 43.1, .5)
# 14 game show lights
for k in range(5): place(sfx, beep(660 if k % 2 else 990, .15), 44.5 + k / 2.4, .4)
place(sfx, crowd(1.7), 44.5, .2)
# 15 island
place(sfx, waves(1.1), 46.2, .4); place(sfx, sparkle_sfx(), 46.25, .45)
# 16 chocolate
place(sfx, whoosh(.3, False), 47.25, .4); place(sfx, thud(90, .25, .7), 47.6, .5); place(sfx, crunch(), 48.25, .9)
# 17 subscribers
for i in range(34): place(sfx, tick(), 49.1 + i * .05, .3)
place(sfx, chime(2093, 1.0), 50.4, .6); place(sfx, pop(600), 50.4, .4)
# 18 billionaire
chaching(51.3, .8)
for i in range(14): place(sfx, chime(2400 + (i % 4) * 250, .25) * .5, 51.5 + i * .1, .25)
# 19 from nothing to king
place(sfx, cricket(.9), 53.05, .35); place(sfx, whoosh(.6), 53.85, .5); fanfare(54.4, .8)
# 20 the question
place(sfx, clang(900, .3) * .4, 55.9, .5); place(sfx, sparkle_sfx(), 56.0, .45)
for i in range(3): place(sfx, pop(500 + i * 150), 57.6 + i * .2, .45)
# 21 comment below
place(sfx, pop(700), 59.0, .6); place(sfx, boing(260, .5), 59.3, .4)

out = sfx / (np.max(np.abs(sfx)) + 1e-9) * .89
fl = int(.4 * SR); out[-fl:] *= np.linspace(1, 0, fl)
sf.write('audio/mix.wav', np.stack([out, out], 1), SR)
print('done', 20 * np.log10(np.sqrt(np.mean(out ** 2))))
