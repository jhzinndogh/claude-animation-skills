#!/usr/bin/env python3
"""Jackie Chan hook in the /low-poly style: hook.json -> hook.mp4 (+ sheet). Optional "audio" in the spec is muxed in.

    python3 build.py hook.json [--snap 1.0,5.5]
"""
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / 'kit'))
import anim  # noqa: E402

DEFAULTS = {'dur': 11.6, 'cutB': 4.8, 'cutC': 9.2, 'captions': [], 'audio': None}

if __name__ == '__main__':
    anim.build(HERE / 'hook.html', DEFAULTS, duration=lambda s: s['dur'], three=True)
    spec_path = Path(sys.argv[1]).resolve()
    spec = json.loads(spec_path.read_text())
    if spec.get('audio') and '--snap' not in sys.argv:
        vid = spec_path.with_suffix('.mp4'); out = spec_path.with_name(spec_path.stem + '.voice.mp4')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', vid, '-i', spec_path.parent / spec['audio'], '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out], check=True)
        print(f'with voice: {out}')
