#!/usr/bin/env bash
# Build without voiceover: captions + SFX only.
set -euo pipefail
cd "$(dirname "$0")"
ENGINE=../../skills/stick-figure/engine
export NODE_PATH=${NODE_PATH:-/opt/node22/lib/node_modules}
WORKERS=${WORKERS:-4}
python3 gen_words.py > /dev/null
python3 audio.py
mkdir -p seg; find seg -name '*.mp4' -delete
N=$(grep -c "SHOTS.push" web/shots.js); pids=()
for ((w = 0; w < WORKERS; w++)); do
  ids=""; for ((i = w; i < N; i += WORKERS)); do ids="${ids:+$ids,}$i"; done
  node "$ENGINE/tools/render.js" segments "$ids" > "seg/log$w.txt" 2>&1 & pids+=($!)
done
for p in "${pids[@]}"; do wait "$p"; done
[ "$(ls seg/shot_??.mp4 | wc -l)" -eq "$N" ] || { echo "a shot failed, see seg/log*.txt"; exit 1; }
for f in seg/shot_??.mp4; do echo "file '$PWD/$f'"; done > seg/list.txt
ffmpeg -v error -y -f concat -safe 0 -i seg/list.txt -c copy silent.mp4
ffmpeg -v error -y -i silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy \
  -af "alimiter=limit=0.8:attack=2:release=60,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart mrbeast.mp4
echo done
