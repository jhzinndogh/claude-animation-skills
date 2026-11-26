import sys
sys.argv=['x','pm_alex','1.12']
p='/home/user/claude-animation-skills/skills/stick-figure/engine/tools/tts_kokoro.py'
src=open(p).read().replace('os.path.realpath(__file__)',repr(p)).replace('lang="en-us"','lang="pt-br"')
exec(src)
