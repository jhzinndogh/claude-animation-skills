import json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro, EspeakConfig
import espeakng_loader
KIT = "/home/user/claude-animation-skills/kit"
k = Kokoro(f"{KIT}/models/kokoro-v1.0.onnx", f"{KIT}/models/voices-v1.0.bin",
           espeak_config=EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=espeakng_loader.get_data_path()))
SAY = {"Mark Grayson": "Márk Grêisson", "Omni-Man": "Ômni Mén", "17": "dezessete", "Opção 1": "Opção um", "Opção 2": "Opção dois", "Opção 3": "Opção três", "Dia 2": "Dia dois", "Dia 1": "Dia um", "…": ","}
lines = json.load(open("script.json")); out = []; meta = []; t = 0; GAP = .14
for i, L in enumerate(lines):
    s = L
    for a, b in SAY.items(): s = s.replace(a, b)
    x, sr = k.create(s, voice="pm_alex", speed=1.12, lang="pt-br")
    idx = np.where(np.abs(x) > .01)[0]; x = x[max(0, idx[0] - 400): idx[-1] + 1200]
    meta.append({"i": i, "start": t, "dur": len(x) / sr}); out += [x, np.zeros(int(GAP * sr), x.dtype)]; t += len(x) / sr + GAP
sf.write("audio/vo.wav", np.concatenate(out), sr); json.dump(meta, open("audio/lines.json", "w")); print(t)
words = []
for m, L in zip(meta, lines):
    ws = L.split(); wt = [max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", w.lower()))) + (1.2 if re.search(r"[.,:?!…]$", w) else 0) for w in ws]
    tot = sum(wt); c = m["start"]
    for w, q in zip(ws, wt):
        d = m["dur"] * q / tot; words.append({"w": w, "s": round(c, 3), "e": round(c + d, 3), "line": m["i"]}); c += d
json.dump(words, open("audio/words_new.json", "w"))
open("web/words.js", "w").write("const WORDS=" + json.dumps(words, ensure_ascii=False) + ";")
open("web/warp.js", "w").write("window.WARP=null;")
for m in meta: print(round(m["start"], 2), round(m["dur"], 2))
