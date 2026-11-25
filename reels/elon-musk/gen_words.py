# No voiceover: time every word from the script's section blocks, weighted by syllable-ish length.
import json, re
lines = json.load(open('script.json'))
blocks = [(0, 2, 0.15, 7.9), (3, 4, 8.1, 21.9), (5, 7, 22.1, 39.9), (8, 9, 40.1, 52.9), (10, 12, 53.1, 59.4)]
words = []
for a, b, t0, t1 in blocks:
    toks = []
    for li in range(a, b + 1):
        ws = [w for w in lines[li].split() if re.search(r'[\wÀ-ÿ]', w)]
        for k, w in enumerate(ws):
            v = len(re.findall(r'[aeiouáéíóúâêôãõà]+', w.lower())) or 1
            wt = .55 + .32 * v
            pause = .9 if (k == len(ws) - 1) else (.45 if re.search(r'[,:]$', w) else 0)
            toks.append([w, li, wt, pause])
    tot = sum(t[2] + t[3] for t in toks); sc = (t1 - t0) / tot; t = t0
    for w, li, wt, pause in toks:
        d = wt * sc; words.append({'w': w, 's': round(t, 3), 'e': round(t + d, 3), 'line': li}); t += d + pause * sc
json.dump(words, open('audio/words.json', 'w'), indent=0, ensure_ascii=False)
open('web/words.js', 'w').write('const WORDS=' + json.dumps(words, ensure_ascii=False) + ';')
open('web/warp.js', 'w').write('window.WARP=null;')
for w in words: print(f"{w['s']:6.2f} {w['w']}")
