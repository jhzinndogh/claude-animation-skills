# Portuguese Kokoro VO, phrase by phrase so word timings stay accurate.
# tts_pt.py voice speed [out]  -> audio/vo_<voice>.wav, audio/vo.words.json (display words with times), audio/lines.json
import json, sys, os, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro, EspeakConfig
import espeakng_loader
KIT = "/home/user/claude-animation-skills/kit"
k = Kokoro(f"{KIT}/models/kokoro-v1.0.onnx", f"{KIT}/models/voices-v1.0.bin",
           espeak_config=EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=espeakng_loader.get_data_path()))
voice = sys.argv[1]; speed = float(sys.argv[2]); only = int(sys.argv[3]) if len(sys.argv) > 3 else 99
SAY = [(r"Mr\. Olympia", "Míster Olímpia"), (r"\bOlympia\b", "Olímpia"), (r"Classic Physique", "Clássic Fízic"),
       (r"Arnold Classic Ohio", "Árnold Clássic, Ohaio"), (r"Pro Card", "Pró Cárd"), (r"100%", "cem por cento"),
       (r"\bpra\b", "prá"), (r"\bpro\b", "pru"), (r"Toguro", "Togúro"), (r"Cariani", "Cariâni"), (r"Dino\b", "Díno"),
       (r"Rocha", "Rócha"), (r"Xavier", "Chavier")]
def say(t):
    for a, b in SAY: t = re.sub(a, b, t)
    return t
def trim(s, sr):
    idx = np.where(np.abs(s) > 0.01)[0]
    return s[max(0, idx[0] - int(.02 * sr)): idx[-1] + int(.04 * sr)]
def weight(w):  # rough spoken length of a word
    w = say(w); v = len(re.findall(r"[aeiouáéíóúâêôãõà]", w.lower())) or 1
    return v + 0.15 * len(w) + (2.5 if re.search(r"\d", w) else 0)
lines = json.load(open("script.json"))[:only]
out, words, t, sr = [], [], 0.0, 24000
for li, line in enumerate(lines):
    phrases = re.findall(r"[^,:?]+[,:?]?", line)
    for pi, ph in enumerate(phrases):
        ph = ph.strip()
        if not ph: continue
        s, sr = k.create(say(ph), voice=voice, speed=speed, lang="pt-br")
        s = trim(s, sr); d = len(s) / sr
        ws = ph.split(); W = [weight(w) for w in ws]; tot = sum(W); acc = 0.06 * d
        for w, x in zip(ws, W):
            dur = 0.9 * d * x / tot
            words.append({"w": w, "s": round(t + acc, 3), "e": round(t + acc + dur, 3), "line": li}); acc += dur
        out.append(s); t += d
        last = pi == len(phrases) - 1
        gap = (0.32 if line.endswith("?") else 0.22) if last else (0.18 if ph.endswith(("?", ":")) else 0.07)
        out.append(np.zeros(int(gap * sr), np.float32)); t += gap
vo = np.concatenate(out); os.makedirs("audio", exist_ok=True)
sf.write(f"audio/vo_{voice}.wav", vo, sr)
json.dump(words, open("audio/vo.words.json", "w"), ensure_ascii=False, indent=0)
print(voice, f"{len(vo)/sr:.2f}s")
