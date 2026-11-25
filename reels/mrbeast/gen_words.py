# No voiceover: caption timings come straight from the script's timecodes.
import json, re
SECTIONS = [
 (0, 8, ["Ele foi expulso de casa pela própria mãe por largar a faculdade pra gravar vídeos.",
         "Anos depois, construiu o maior canal da história do YouTube.",
         "Essa é a história de MrBeast."]),
 (8, 22, ["Jimmy Donaldson começou a postar vídeos aos 13 anos, gravando gameplay no quarto com um microfone péssimo.",
          "Por mais de cinco anos, quase ninguém assistia.",
          "Mesmo assim, ele ficou obcecado pelo algoritmo, estudando todos os dias o que fazia um vídeo viralizar,",
          "até decidir largar a faculdade pra apostar tudo na internet."]),
 (22, 40, ["A mãe não aceitou e colocou ele pra fora de casa.",
           "Sem plano B, em 2017 ele fez uma loucura: sentou na frente da câmera e contou até 100 mil por mais de 40 horas seguidas.",
           "O vídeo explodiu.",
           "Quando fechou o primeiro patrocínio de 10 mil dólares, ele não comprou nada pra si: entregou o dinheiro inteiro na rua e filmou.",
           "Ali nascia a fórmula dele."]),
 (40, 53, ["A regra era simples: reinvestir cada centavo no próximo vídeo pra fazer algo ainda mais absurdo.",
           "Ele recriou Round 6 na vida real, deu ilhas particulares, lançou a própria marca de chocolates e ultrapassou centenas de milhões de inscritos, virando um bilionário da internet."]),
 (53, 60, ["Do garoto que quase ninguém assistia ao rei absoluto do YouTube.",
           "Se você ganhasse 1 milhão de dólares num desafio do MrBeast, qual seria a primeira coisa que faria?",
           "Comenta aí embaixo!"]),
]
words, line = [], 0
for t0, t1, sents in SECTIONS:
    t0 += .1; t1 -= .25
    toks = [(si, w) for si, s in enumerate(sents) for w in s.split()]
    wt = [len(re.sub(r'\W', '', w)) * .9 + 2.2 + (1.8 if re.search(r'[.,:!?]$', w) else 0) for _, w in toks]
    k = (t1 - t0) / sum(wt); t = t0; last = None
    for (si, w), x in zip(toks, wt):
        d = x * k
        if si != last: print(line + si, round(t, 2), ' '.join(s for s in sents[si].split()[:5])); last = si
        words.append({"w": w, "s": round(t, 3), "e": round(t + d * .92, 3), "line": line + si})
        t += d
    line += len(sents)
open('web/words.js', 'w').write('const WORDS=' + json.dumps(words, ensure_ascii=False) + ';')
json.dump(words, open('audio/words.json', 'w'), ensure_ascii=False, indent=0)
