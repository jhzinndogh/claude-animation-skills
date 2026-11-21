# Ramon Dino — do Acre ao topo do Mr. Olympia

Short vertical (9:16, ~2 min) em 3D feito com o motor de `/zach-d-films`, narrado em português com a voz grátis Kokoro (`pm_alex`).
38 cenas: calistenia no Horto Florestal (em tom de foto antiga), arroz com ovo, Rio Branco 1995, futebol e capoeira,
a academia que ele não podia pagar, rifas, Pro Card, Mansão Maromba, o "Dinossauro do Acre", os pódios (2º, 4º, 1º em 2025, 3º em 2026) e o CTA.

## O que mudou em relação ao exemplo do motor
- `src/human.js`: `makePerson()` — pessoas comuns (camiseta, regata, short, sunga, vestido, cabelo longo) com `bulk` 0..1 para músculos.
- `src/props2.js`: barras do parque, prato de arroz com ovo, troféu, pódio, medalhas, cinturão, bandeira do Brasil tremulando, palco com feixes de luz, confete, plateia, foguete, dinossauro, globo, mansão, cidade.
- `src/story.js`: elenco, poses (duplo bíceps, comemoração, sentado, caminhada), cenários e câmeras.
- `src/main.js`: `makeStage` aceita céu/luzes; filtro sépia (`sepia` no retorno de `update`).
- `tts_pt.py`: narração em pt-BR frase a frase, com tempos de palavra estimados (o alinhador Parakeet só entende inglês).
- `captions.py`: palavras curtas em português e "Mr. Olympia" sempre junto.

## Como gerar
```bash
ln -s ../../kit/node_modules node_modules
../../kit/.venv/bin/python tts_pt.py pm_alex 1.3 && cp audio/vo_pm_alex.wav audio/vo.wav   # opcional: já vem pronto
python3 captions.py audio/vo.words.json      # cole em src/captions.js (CAPS)
./renderall.sh                                # 4 partes em paralelo, 24 fps (GL=swiftshader sem GPU)
for i in 0 1 2 3; do echo "file 'parts/p$i.mp4'"; done > list.txt && ffmpeg -f concat -safe 0 -i list.txt -c copy silent.mp4
ffmpeg -i silent.mp4 -i audio/vo.wav -map 0:v -map 1:a -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 18 -pix_fmt yuv420p \
  -af "apad,loudnorm=I=-14:TP=-1.5" -c:a aac -b:a 192k -shortest ramon-dino.mp4
```
Sem GPU (como num container), cada quadro leva ~5 s por processo; o vídeo inteiro levou ~1 h com 4 processos.
