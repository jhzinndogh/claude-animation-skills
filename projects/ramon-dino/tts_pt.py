# pt-BR voiceover with Kokoro + word timings spread by syllable-ish weight inside each sentence.
import json, sys, os, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
KIT = os.path.realpath(os.path.join(os.path.dirname(__file__), "..", "..", "kit"))
voice = sys.argv[1] if len(sys.argv) > 1 else "pm_alex"
speed = float(sys.argv[2]) if len(sys.argv) > 2 else 1.15
k = Kokoro(f"{KIT}/models/kokoro-v1.0.onnx", f"{KIT}/models/voices-v1.0.bin")
os.makedirs("audio", exist_ok=True)
lines = json.load(open("script.json"))
out, t, words = [], 0.0, []
for i, line in enumerate(lines):
    s, sr = k.create(line, voice=voice, speed=speed, lang="pt-br")
    a = np.abs(s); idx = np.where(a > 0.01)[0]
    s = s[max(0, idx[0] - int(.02*sr)): idx[-1] + int(.05*sr)]
    dur = len(s)/sr
    ws = line.split()
    wt = [len(re.findall(r'[aeiouáéíóúâêôãõà]+', w.lower())) + (2 if re.search(r'\d', w) else 0) + 0.6 for w in ws]
    # pauses after punctuation
    wt2 = [x + (1.2 if re.search(r'[.,?!:;]$', w) else 0) for x, w in zip(wt, ws)]
    tot = sum(wt2); acc = 0
    for w, x, x2 in zip(ws, wt, wt2):
        st = t + dur*acc/tot; acc += x2
        words.append({"w": w, "s": round(st, 3), "e": round(st + dur*x/tot, 3)})
    out.append(s)
    gap = 0.18 + (0.15 if line.rstrip().endswith(('?', '!')) or i == 0 else 0)
    out.append(np.zeros(int(gap*sr), dtype=s.dtype))
    print(i, round(t, 2), round(dur, 2), line[:50]); t += dur + gap
vo = np.concatenate(out); sf.write("audio/vo.wav", vo, sr)
json.dump(words, open("audio/vo.words.json", "w"), ensure_ascii=False, indent=0)
print("total", len(vo)/sr)
