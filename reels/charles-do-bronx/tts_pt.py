# pt-BR voice with Kokoro, synthesised phrase by phrase so phrase boundaries are exact;
# words inside a phrase are spread by phoneme count. Writes audio/vo.wav, audio/words.json, web/words.js.
#   tts_pt.py [voice] [speed]
import json, sys, os, re, shutil, tempfile, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro, EspeakConfig
import espeakng_loader
KIT = "/home/user/claude-animation-skills/kit/models/"
data = espeakng_loader.get_data_path(); short = os.path.join(tempfile.gettempdir(), "kokoro-espeak-ng-data")
if not os.path.exists(os.path.join(short, "phontab")): shutil.rmtree(short, ignore_errors=True); shutil.copytree(data, short)
k = Kokoro(KIT + "kokoro-v1.0.onnx", KIT + "voices-v1.0.bin", espeak_config=EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=short))
voice = sys.argv[1] if len(sys.argv) > 1 else "pm_alex"; speed = float(sys.argv[2]) if len(sys.argv) > 2 else 1.1
# how each on-screen word is spoken
SAY = {"7": "sete", "12": "doze", "20": "vinte", "11": "onze", "5": "cinco", "1989": "mil novecentos e oitenta e nove",
       "2010": "dois mil e dez", "2021": "dois mil e vinte e um", "UFC": "u éfe cê", "MMA": "eme eme á", "Chandler": "Tchéndler",
       "Bronx": "Brônquis", "jiu-jitsu": "jiu jítsu", "pra": "pra", "peso-leve": "peso leve"}
def spoken(w):
    core = re.sub(r"[^\wÀ-ÿ-]", "", w); return SAY.get(core, core)
def phon(s): return max(1, len(re.sub(r"[^a-zà-ÿ]", "", s.lower())))
lines = json.load(open("script.json"))
out, words, t, SR = [], [], 0.0, 24000
for li, line in enumerate(lines):
    phrases = [p.strip() for p in re.split(r"(?<=[,:])\s+", line) if p.strip()]
    for pi, ph in enumerate(phrases):
        ws = ph.split(); txt = " ".join(spoken(w) for w in ws)
        if ph.endswith("?"): txt += "?"
        s, sr = k.create(txt, voice=voice, speed=speed, lang="pt-br"); SR = sr
        a = np.abs(s); idx = np.where(a > .01)[0]; s = s[max(0, idx[0] - int(.02 * sr)): idx[-1] + int(.05 * sr)]
        d = len(s) / sr; wts = [phon(spoken(w)) + 1.5 for w in ws]; tot = sum(wts); c = 0
        for w, wt in zip(ws, wts):
            words.append({"w": w, "s": round(t + d * c / tot, 3), "e": round(t + d * (c + wt) / tot, 3), "line": li}); c += wt
        out.append(s); t += d
        last = pi == len(phrases) - 1
        gap = (.32 if li == 0 or line.endswith("?") else .2) if last else .08
        out.append(np.zeros(int(gap * sr), dtype=s.dtype)); t += gap
vo = np.concatenate(out); sf.write("audio/vo.wav", vo, SR)
json.dump(words, open("audio/words.json", "w"), ensure_ascii=False, indent=0)
open("web/words.js", "w").write("const WORDS=" + json.dumps(words, ensure_ascii=False) + ";\nconst LINES=" + json.dumps([min(w['s'] for w in words if w['line'] == i) for i in range(len(lines))]) + ";")
open("web/warp.js", "w").write("window.WARP=null;")
print(f"{voice} total {len(vo)/SR:.2f}s, {len(words)} words")
for i in range(len(lines)): print(i, min(w['s'] for w in words if w['line'] == i))
