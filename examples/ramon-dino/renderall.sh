#!/bin/bash
cd "$(dirname "$0")"
export GL=swiftshader CHROME=/opt/pw-browsers/chromium
B=(0 31 62 93 125)
for i in 0 1 2 3; do
  node render.mjs video parts/p$i.mp4 24 ${B[$i]} ${B[$((i+1))]} > parts/log$i.txt 2>&1 &
done
wait
echo done
