import json, re, sys
sys.path.insert(0, '.')
import captions as C
C.SMALL = {'a','o','as','os','um','uma','de','do','da','dos','das','em','no','na','nos','nas','e','que','pra','por','com','se','ao','à','mais','é','foi','nem','mas','ele','seu','sua','já'}
words = json.load(open('audio/vo.words.json'))
PAIRS = [('Classic','Physique'),('Mister','Olympia'),('Mister','Olympia?'),('Mister','Olympia,'),('Rio','Branco'),('Rio','Branco,'),('Rio','Branco.'),('Ramon','Dino.'),('Pro','Card.'),('Arnold','Classic'),('Xavier','Maia.'),('Renato','Cariani,'),('Vitória','Viana')]
m = []
for w in words:
    if m and (m[-1]['w'].split('\u00a0')[-1], w['w']) in PAIRS:
        m[-1] = {'w': m[-1]['w'] + '\u00a0' + w['w'], 's': m[-1]['s'], 'e': w['e']}
    else: m.append(dict(w))
words = m
for w in words: w['w'] = w['w'].replace('Mister', 'Mr.')
print('export const CAPTIONS = [')
gs = C.chunks(words)
for i, g in enumerate(gs):
    text = re.sub(r'[.,;:]+$', '', ' '.join(x['w'] for x in g)).replace("'", "\\'")
    text = text.replace('\u00a0', ' ')
    end = f", {g[-1]['e'] + .3:.2f}" if i == len(gs) - 1 else ''
    print(f"  [{g[0]['s']:.2f}, '{text}'{end}],")
print('];')
print(f'export const DURATION = {words[-1]["e"] + .8:.2f};')
