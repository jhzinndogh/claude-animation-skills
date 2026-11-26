# Kokoro pt-BR voice per line + word timings by syllable-weighted spread inside each line
import json, os, re, sys, numpy as np, soundfile as sf
KIT = "/home/user/claude-animation-skills/kit"
from kokoro_onnx import Kokoro
k = Kokoro(f"{KIT}/models/kokoro-v1.0.onnx", f"{KIT}/models/voices-v1.0.bin")
voice = sys.argv[1] if len(sys.argv) > 1 else "pm_alex"; speed = float(sys.argv[2]) if len(sys.argv) > 2 else 1.15
lines = json.load(open("script.json")); os.makedirs("audio", exist_ok=True)
REP = {"um": "1", "dois": "2", "três": "3", "onze": "11"}
out, t, words = [], 0.0, []
for i, L in enumerate(lines):
    s, sr = k.create(L, voice=voice, speed=speed, lang="pt-br")
    a = np.abs(s); idx = np.where(a > .01)[0]; s = s[max(0, idx[0]-int(.02*sr)): idx[-1]+int(.05*sr)]
    dur = len(s)/sr
    toks = L.split()
    wts = [max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", w.lower()))) + (1.2 if re.search(r"[,.:?!…]$", w) else 0) for w in toks]
    tot = sum(wts); c = 0
    for w, wt in zip(toks, wts):
        bare = re.sub(r"[^\wçãõáéíóúâêô]", "", w.lower())
        prev = toks[toks.index(w)-1] if toks.index(w) else ""
        disp = REP[bare] + w[len(w.rstrip(",.:?!…")):] if bare in REP and (prev.lower() in ("dia", "opção") or bare == "onze") else w
        words.append({"w": disp, "s": round(t + dur*c/tot, 3), "e": round(t + dur*(c+wt*.85)/tot, 3), "line": i}); c += wt
    meta_s = t
    out.append(s); gap = .14 + (.15 if L.rstrip().endswith(("?", "!", "…")) or i == 0 else 0)
    out.append(np.zeros(int(gap*sr), dtype=s.dtype)); t += dur + gap
vo = np.concatenate(out); sf.write("audio/vo.wav", vo, sr)
json.dump(words, open("audio/words_new.json", "w"))
open("web/words.js", "w").write("const WORDS=" + json.dumps(words, ensure_ascii=False) + ";")
open("web/warp.js", "w").write("window.WARP=null;")
LS = [[min(w["s"] for w in words if w["line"]==i), max(w["e"] for w in words if w["line"]==i)] for i in range(len(lines))]
open("web/lines.js", "w").write("const LINES=" + json.dumps(LS) + "; const VO_END=" + str(round(t, 3)) + ";")
print("total", round(t, 2)); [print(i, x) for i, x in enumerate(LS)]
