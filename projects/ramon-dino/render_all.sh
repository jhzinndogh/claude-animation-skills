#!/bin/bash
cd "$(dirname "$0")"
export GL=swiftshader CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
D=130.83; N=4; FPS=24
for i in $(seq 0 $((N-1))); do
  A=$(python3 -c "print(round($D*$i/$N*$FPS)/$FPS)"); B=$(python3 -c "print(round($D*($i+1)/$N*$FPS)/$FPS if $i<$N-1 else $D)")
  node render.mjs video part$i.mp4 $FPS $A $B > log$i.txt 2>&1 &
done
wait
printf "file 'part0.mp4'\nfile 'part1.mp4'\nfile 'part2.mp4'\nfile 'part3.mp4'\n" > parts.txt
ffmpeg -v error -y -f concat -safe 0 -i parts.txt -c copy silent.mp4
ffmpeg -v error -y -i silent.mp4 -i audio/vo.wav -map 0:v -map 1:a -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 18 -pix_fmt yuv420p -af "apad,loudnorm=I=-14:TP=-1.5" -c:a aac -b:a 192k -shortest ramon-dino.mp4
echo DONE
