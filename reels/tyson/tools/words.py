# No voiceover: spread the caption words over each section window, weighted by length, with pauses at punctuation.
import json, re
SECT = [(0.15, 7.8), (8.1, 21.8), (22.1, 37.8), (38.1, 52.8), (53.1, 59.4)]
lines = json.load(open('script.json'))
words = []; li = 0
for (t0, t1), sents in zip(SECT, lines):
    toks = []
    for s in sents:
        ws = s.split()
        for k, w in enumerate(ws):
            pause = .55 if k == len(ws) - 1 else (.28 if re.search(r'[,:]$', w) else 0)
            toks.append((w, li, .16 + .055 * len(re.sub(r'\W', '', w)), pause))
        li += 1
    toks[-1] = toks[-1][:3] + (0,)
    tot = sum(d + p for _, _, d, p in toks); k = (t1 - t0) / tot; t = t0
    for w, l, d, p in toks:
        words.append({'w': w, 's': round(t, 3), 'e': round(t + d * k, 3), 'line': l}); t += (d + p) * k
json.dump(words, open('audio/words.json', 'w'), indent=0, ensure_ascii=False)
open('web/words.js', 'w').write('const WORDS=' + json.dumps(words, ensure_ascii=False) + ';')
open('web/warp.js', 'w').write('window.WARP=null;')
for w in words: print(f"{w['s']:6.2f} {w['w']}")
