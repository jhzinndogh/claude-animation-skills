# usage: sheet.sh name t1,t2,...
export NODE_PATH=/opt/node22/lib/node_modules
node ../../skills/stick-figure/engine/tools/render.js stills "$2" 2>&1 | grep -v "^\[page\]" | head -5
python3 - "$1" "$2" <<'P'
import sys;from PIL import Image
ts=[float(x) for x in sys.argv[2].split(',')];ims=[Image.open(f'stills/s_{t:.2f}.jpg').resize((360,640)) for t in ts]
m=Image.new('RGB',(360*min(4,len(ims)),640*((len(ims)+3)//4)))
for i,im in enumerate(ims): m.paste(im,((i%4)*360,(i//4)*640))
m.save(sys.argv[1]+'.jpg')
P
