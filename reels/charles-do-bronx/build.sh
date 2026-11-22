#!/usr/bin/env bash
# Build this reel: pt-BR voice + word timings -> mix -> picture -> charles-do-bronx.mp4
#   bash build.sh            (VOICE=1 also regenerates the Kokoro voice)
set -euo pipefail
cd "$(dirname "$0")"
REPO=/home/user/claude-animation-skills; PY=$REPO/kit/.venv/bin/python; ENGINE=$REPO/skills/stick-figure/engine
export NODE_PATH=$REPO/kit/node_modules CHROME=${CHROME:-/opt/pw-browsers/chromium}
WORKERS=${WORKERS:-4}
[ "${VOICE:-0}" = 1 ] && "$PY" tts_pt.py pm_alex 1.2
node dump_shots.js
"$PY" audio.py
rm -rf seg; mkdir -p seg
N=$(grep -c "^S(" web/shots.js); pids=()
for ((w = 0; w < WORKERS; w++)); do ids=""; for ((i = w; i < N; i += WORKERS)); do ids="${ids:+$ids,}$i"; done
  [ -n "$ids" ] && { node "$ENGINE/tools/render.js" segments "$ids" > "seg/log$w.txt" 2>&1 & pids+=($!); }; done
for p in "${pids[@]}"; do wait "$p"; done
[ "$(ls seg/shot_??.mp4 | wc -l)" -eq "$N" ] || { echo "a shot failed, see seg/log*.txt"; exit 1; }
for f in seg/shot_??.mp4; do echo "file '$PWD/$f'"; done > seg/list.txt
ffmpeg -v error -y -f concat -safe 0 -i seg/list.txt -c copy silent.mp4
ffmpeg -v error -y -i silent.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy \
  -af "alimiter=limit=0.8:attack=2:release=60,loudnorm=I=-14:TP=-1.5:LRA=9" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart charles-do-bronx.part.mp4
mv charles-do-bronx.part.mp4 charles-do-bronx.mp4; echo "done: $PWD/charles-do-bronx.mp4"
