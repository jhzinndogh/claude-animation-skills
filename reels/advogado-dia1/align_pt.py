import json, re, soundfile as sf
lines = json.load(open('audio/lines.json'))
a, sr = sf.read('audio/vo.wav'); dur = len(a)/sr
words = []
for L in lines:
    ws = L['text'].split()
    wt = [len(re.sub(r'[^\wÀ-ú]', '', w)) + 2 + (4 if re.search(r'[.,?!:]$', w) else 0) for w in ws]
    tot = sum(wt); t = L['start']
    for w, k in zip(ws, wt):
        d = L['dur'] * k / tot
        words.append({'w': w, 's': round(t, 3), 'e': round(t + d, 3), 'line': L['i']}); t += d
json.dump(words, open('audio/words_new.json', 'w'), indent=0)
json.dump(words, open('audio/words_ref.json', 'w'), indent=0)
warp = {'anchors': [[w['s'], w['s']] for w in words], 'old_end': words[-1]['e'], 'new_end': dur}
json.dump(warp, open('audio/warp.json', 'w'))
open('web/words.js', 'w').write('const WORDS=' + json.dumps(words, ensure_ascii=False) + ';')
open('web/warp.js', 'w').write('window.WARP=' + json.dumps(warp) + ';')
print(dur, len(words))
