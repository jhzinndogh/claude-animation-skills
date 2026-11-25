#!/usr/bin/env bash
# Picture + music/SFX only (no voiceover). Run from the reel folder.
set -euo pipefail
E=/home/user/claude-animation-skills/skills/stick-figure/engine; W=${WORKERS:-4}
python3 tools/words.py >/dev/null; python3 audio.py
rm -rf seg; mkdir -p seg; N=$(grep -c "SHOTS.push" web/shots.js); pids=()
for ((w = 0; w < W; w++)); do ids=""; for ((i = w; i < N; i += W)); do ids="${ids:+$ids,}$i"; done
  node $E/tools/render.js segments "$ids" > "seg/log$w.txt" 2>&1 & pids+=($!); done
for p in "${pids[@]}"; do wait "$p"; done
[ "$(ls seg/shot_??.mp4 | wc -l)" -eq "$N" ] || { echo "shot failed"; exit 1; }
for f in seg/shot_??.mp4; do echo "file '$PWD/$f'"; done > seg/list.txt
ffmpeg -v error -y -f concat -safe 0 -i seg/list.txt -c copy silent.mp4
ffmpeg -v error -y -i silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -af "alimiter=limit=0.8:attack=2:release=60,loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart mike-tyson.mp4
echo done
