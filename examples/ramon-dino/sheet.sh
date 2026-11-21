#!/bin/bash
# sheet.sh "t1,t2,..." out.png  -> stills + contact sheet (6 per row)
cd "$(dirname "$0")"
rm -rf /tmp/st_$$ && GL=swiftshader CHROME=/opt/pw-browsers/chromium node render.mjs stills "$1" /tmp/st_$$ 2>&1 | grep -v "GL Driver\|404\|ReadPixels" 
ls /tmp/st_$$/*.png | sort -t_ -k2 -n > /tmp/st_$$.txt
python3 - "$2" /tmp/st_$$ <<'PY'
import sys,glob,os
from PIL import Image, ImageDraw
fs=sorted(glob.glob(sys.argv[2]+'/*.png'), key=lambda f: float(os.path.basename(f)[2:-4]))
W,H=240,427; n=len(fs); cols=min(6,n); rows=(n+cols-1)//cols
sh=Image.new('RGB',(cols*W,rows*H),'black')
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize((W,H)); d=ImageDraw.Draw(im); d.text((6,6),os.path.basename(f)[2:-4],fill='yellow')
    sh.paste(im,((i%cols)*W,(i//cols)*H))
sh.save(sys.argv[1])
PY
