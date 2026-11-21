import * as THREE from 'three';
import { makeHuman } from './human.js';
import { glowSprite, sparks } from './props.js';
import { sign, ground, tree, palm, pullBar, dumbbell, barbell, gymRoom, ricePlate, table, trophy, medal, flag, stage, confetti, podium, house, mansion, skyline, suitcase, ball, rocket, globe, dino, cardProp, cash, heart, box, GOLD, SILVER, BRONZE } from './props2.js';
import { kf, lerp, smooth, easeOut, easeIn, easeInOut, range, clamp, V, cam, place, shake, ikArm } from './anim.js';

export const CAPTIONS = [
  [0.00, 'Como um garoto'],
  [0.86, 'do Acre'],
  [1.46, 'que não tinha'],
  [2.11, 'dinheiro nem pra pagar'],
  [3.15, 'a academia e vivia'],
  [4.30, 'à base de arroz'],
  [5.23, 'e ovo'],
  [5.83, 'se tornou o primeiro'],
  [6.88, 'homem brasileiro a vencer'],
  [8.14, 'a categoria Classic Physique'],
  [9.40, 'no Mr. Olympia?'],
  [10.62, 'Essa é a história'],
  [11.64, 'de Ramon Dino'],
  [12.68, 'Nascido em 1995'],
  [13.84, 'em Rio Branco'],
  [14.88, 'no Acre'],
  [15.67, 'Ramon Rocha Queiroz'],
  [16.83, 'cresceu no bairro'],
  [17.84, 'Xavier Maia'],
  [18.82, 'Na infância'],
  [19.54, 'ele era como'],
  [20.42, 'qualquer outro garoto'],
  [21.55, 'gostava de jogar'],
  [22.44, 'futebol e praticar'],
  [23.43, 'capoeira'],
  [24.16, 'Aos 14 anos'],
  [25.06, 'conheceu a musculação'],
  [26.16, 'e se apaixonou'],
  [27.18, 'mas a falta'],
  [27.84, 'de dinheiro falou'],
  [28.72, 'mais alto e ele'],
  [29.67, 'precisou sair da academia'],
  [31.27, 'Só que ele não'],
  [32.04, 'parou'],
  [32.62, 'Sem condições de pagar'],
  [33.78, 'mensalidade'],
  [34.62, 'passou a treinar'],
  [35.46, 'calistenia todos os dias'],
  [36.74, 'ao ar livre'],
  [37.61, 'no Horto Florestal'],
  [38.58, 'de Rio Branco'],
  [39.62, 'E foi ali'],
  [40.34, 'nas barras do parque'],
  [41.33, 'que o físico'],
  [42.03, 'dele começou a chamar'],
  [43.11, 'atenção'],
  [43.78, 'O começo no fisiculturismo'],
  [45.38, 'foi na raça'],
  [46.39, 'Pra conseguir competir'],
  [47.72, 'Ramon vendia itens'],
  [48.77, 'pessoais e fazia'],
  [49.67, 'rifas pra pagar'],
  [50.58, 'passagens e hotel'],
  [51.96, 'A dieta?'],
  [52.48, 'Basicamente arroz e ovo'],
  [53.78, 'porque era o que'],
  [54.58, 'cabia no bolso'],
  [55.52, 'Mesmo assim'],
  [56.35, 'em 2018 ele veio'],
  [57.43, 'pra São Paulo'],
  [58.34, 'venceu o Mr. Olympia'],
  [59.55, 'Brasil e conquistou'],
  [60.56, 'o seu Pro Card'],
  [61.72, 'Mas voltou pro'],
  [62.51, 'Acre ainda sem'],
  [63.43, 'patrocínio'],
  [64.39, 'A vida dele'],
  [65.19, 'só mudou de verdade'],
  [66.28, 'em 2020'],
  [66.91, 'quando foi convidado'],
  [67.94, 'pelo Toguro para'],
  [68.97, 'a Mansão Maromba'],
  [70.20, 'Lá'],
  [70.53, 'conheceu Renato Cariani'],
  [71.96, 'fechou grandes patrocínios'],
  [73.27, 'ganhou o apelido'],
  [74.32, 'de Dinossauro do Acre'],
  [75.56, 'e finalmente pôde'],
  [76.61, 'viver cem por cento'],
  [77.61, 'do esporte'],
  [78.55, 'Daí pra frente'],
  [79.45, 'foi foguete'],
  [80.45, 'Venceu o Arnold Classic'],
  [81.95, 'Ohio em 2023'],
  [83.04, 'e foi vice-campeão'],
  [84.28, 'do Mr. Olympia duas'],
  [85.62, 'vezes'],
  [86.40, 'Depois de um 2024'],
  [87.46, 'difícil'],
  [88.06, 'em que ficou'],
  [88.78, 'em quarto lugar'],
  [89.79, 'ele reformulou toda'],
  [91.02, 'a sua equipe'],
  [92.20, 'O resultado?'],
  [93.50, 'Em 2025'],
  [94.20, 'Ramon fez história'],
  [95.23, 'e conquistou o título'],
  [96.60, 'da Classic Physique'],
  [97.49, 'no Mr. Olympia'],
  [98.54, 'colocando o Brasil'],
  [99.70, 'no topo do mundo'],
  [101.14, 'Hoje em dia'],
  [101.95, 'casado com Vitória Viana'],
  [103.27, 'e pai de dois'],
  [104.01, 'filhos'],
  [104.44, 'Ramon é um dos'],
  [105.30, 'maiores nomes do esporte'],
  [106.50, 'no planeta'],
  [107.42, 'Mesmo depois de ficar'],
  [108.57, 'em terceiro lugar'],
  [109.52, 'no Mr. Olympia de 2026'],
  [111.01, 'ele deixou claro'],
  [111.96, 'que a caminhada'],
  [112.91, 'não para'],
  [113.57, 'e já está'],
  [114.28, 'focado em retomar'],
  [115.35, 'o cinturão no próximo'],
  [116.62, 'ano'],
  [117.27, 'A história do Dino'],
  [118.30, 'prova que o lugar'],
  [119.22, 'de onde você'],
  [119.97, 'sai não define'],
  [120.72, 'até onde você'],
  [121.58, 'pode chegar'],
  [122.46, 'E aí'],
  [122.91, 'você acha que o'],
  [123.77, 'Ramon recupera o título'],
  [125.05, 'no próximo Olympia?'],
  [126.30, 'Comenta aqui embaixo'],
  [127.45, 'e já segue'],
  [128.13, 'o perfil pra mais'],
  [129.00, 'histórias como essa', 130.33],
];
export const DURATION = 130.83;

// [fadeInStart, fullStart, fullEnd, fadeOutEnd] to black
export const FADES = [[31.0, 31.2, 31.27, 31.45], [92.0, 92.18, 92.2, 92.4]];

// ---------------- characters ----------------
const SKIN = 0x8d5a3b, HAIR = 0x120d0a;
function ramon(kind) {
  const o = { skin: SKIN, hair: HAIR, beard: HAIR };
  let h;
  if (kind === 'kid') { h = makeHuman('tee', { ...o, top: 0xf7d21c, shorts: 0x1f5fd0, shoe: 0xffffff, beardOn: false, thin: true }); h.s = 0.62; }
  else if (kind === 'teen') { h = makeHuman('tee', { ...o, top: 0xffffff, shorts: 0x2b2d33, shoe: 0x2f6fdb, beardOn: false, thin: true }); h.s = 0.95; }
  else if (kind === 'calis') { h = makeHuman('shirtless', { ...o, shorts: 0x1f1f24, shoe: 0x6a6d75, beardOn: false, thin: true }); h.s = 0.97; }
  else if (kind === 'calis2') { h = makeHuman('shirtless', { ...o, shorts: 0x1f1f24, shoe: 0x6a6d75, muscle: 0.55 }); h.s = 1; }
  else if (kind === 'pro') { h = makeHuman('shirtless', { ...o, shorts: 0x14245e, muscle: 1 }); h.s = 1; }
  else if (kind === 'casual') { h = makeHuman('tee', { ...o, top: 0x1d1d22, shorts: 0x4a4f5a, shoe: 0xf4f4f4, muscle: 1, longShorts: true }); h.s = 1; }
  else if (kind === 'gym') { h = makeHuman('tank', { ...o, top: 0x2f6fdb, shorts: 0x1d1d22, shoe: 0xf4f4f4, muscle: 1 }); h.s = 1; }
  h.root.scale.setScalar(h.s);
  return h;
}
function person(top, { skin = 0xd99b7a, hair = 0x3a2618, shorts = 0x3a3f4a, s = 1, ...rest } = {}) {
  const h = makeHuman('tee', { skin, hair, beard: hair, top, shorts, shoe: 0x222222, longShorts: true, ...rest });
  h.s = s; h.root.scale.setScalar(s); return h;
}

// ---------------- poses ----------------
const STAND = {
  lSh: [0.05, 0, 0.16], rSh: [0.05, 0, -0.16], lEl: [-0.25, 0, 0], rEl: [-0.25, 0, 0],
  lHip: [0, 0, 0.07], rHip: [0, 0, -0.07], lAn: [0, 0, -0.07], rAn: [0, 0, 0.07],
};
const idle = (t, k = 1) => Math.sin(t * 1.6) * 0.015 * k;
function stand(h, t, extra = {}) {
  const p = { ...STAND, ...extra };
  p.chest = [idle(t) + (extra.chest?.[0] || 0), extra.chest?.[1] || 0, extra.chest?.[2] || 0];
  h.setPose(p);
}
// arm IK with targets in the character's own (unscaled) coordinates
function arm(h, side, T, P, hint = [0, 0, 1]) {
  h.root.updateMatrixWorld(true);
  const q = h.root.getWorldQuaternion(new THREE.Quaternion());
  ikArm(h, side, h.root.localToWorld(V(...T)), h.root.localToWorld(V(...P)), V(...hint).applyQuaternion(q), 0.3 * h.s, 0.335 * h.s);
}
function dblBiceps(h, k = 1, t = 0) {
  const f = Math.sin(t * 9) * 0.006;
  for (const s of [1, -1]) {
    const k2 = s > 0 ? 'l' : 'r';
    const T = [lerp(s * 0.25, s * 0.43, k), lerp(0.98, 1.68 + f, k), lerp(0.12, 0.02, k)];
    arm(h, k2, T, [s * 0.95, lerp(1.0, 1.32, k), -0.25], [0, 0, 1]);
  }
}
function overhead(h, k = 1, w = 0.1) {
  for (const s of [1, -1]) arm(h, s > 0 ? 'l' : 'r', [lerp(s * 0.25, s * w, k), lerp(1.0, 2.02, k), lerp(0.1, 0.12, k)], [s * 0.8, 1.55, -0.2], [0, 1, 0]);
}
function handsOnHips(h) {
  for (const s of [1, -1]) arm(h, s > 0 ? 'l' : 'r', [s * 0.21, 0.98, 0.03], [s * 0.75, 1.15, -0.25], [-s, 0, 0]);
}
function wave(h, t, side = 'r') {
  const s = side === 'l' ? 1 : -1;
  arm(h, side, [s * (0.38 + Math.sin(t * 9) * 0.07), 1.78, 0.12], [s * 0.7, 1.25, -0.3], [0, 0, 1]);
}
function walk(h, t, sp = 1, extra = {}) {
  const p = t * 6.5 * sp, s = Math.sin(p), c = Math.cos(p);
  h.setPose({
    ...STAND, lHip: [-0.42 * s, 0, 0.05], rHip: [0.42 * s, 0, -0.05],
    lKn: [Math.max(0, 0.8 * c) + 0.08, 0, 0], rKn: [Math.max(0, -0.8 * c) + 0.08, 0, 0],
    lSh: [0.38 * s, 0, 0.12], rSh: [-0.38 * s, 0, -0.12], lEl: [-0.45, 0, 0], rEl: [-0.45, 0, 0],
    chest: [0.03, 0.06 * s, 0], drop: -0.025 * Math.abs(c), ...extra,
  });
}
const SIT = { lHip: [-1.5, 0, 0.12], rHip: [-1.5, 0, -0.12], lKn: [1.45, 0, 0], rKn: [1.45, 0, 0], lSh: [0.1, 0, 0.12], rSh: [0.1, 0, -0.12], lEl: [-1.2, 0, 0], rEl: [-1.2, 0, 0], spine: [0.25, 0, 0], neck: [0.35, 0, 0], drop: -0.33 };
// pull-up on a bar at world height barY, centre x0/z0. k: 0 hanging .. 1 chin over bar
function pullUp(h, bar, k) {
  const barY = bar.position.y + bar.barY;
  const s = h.s;
  h.root.position.set(bar.position.x, barY - s * lerp(1.98, 1.58, k), bar.position.z + 0.0);
  h.setPose({ lHip: [-0.15, 0, 0.05], rHip: [-0.25, 0, -0.05], lKn: [0.9, 0, 0], rKn: [1.1, 0, 0], neck: [-0.15 * k, 0, 0], chest: [-0.05, 0, 0], spine: [-0.05, 0, 0] });
  for (const sd of [1, -1]) {
    h.root.updateMatrixWorld(true);
    const Tw = V(bar.position.x + sd * 0.32 * s, barY, bar.position.z + 0.0);
    const T = h.root.worldToLocal(Tw.clone());
    arm(h, sd > 0 ? 'l' : 'r', [T.x, T.y, T.z], [sd * 0.9, 1.3, 0.25], [0, 1, 0]);
  }
}
function attach(h, side, obj, pos = [0, -0.08, 0.02], rot = [0, 0, 0]) {
  h.j[side + 'Wr'].add(obj); obj.position.set(...pos); obj.rotation.set(...rot);
  return obj;
}
const dofAt = (c, p, ap = 0.003, mb = 0.008) => ({ focus: c.position.distanceTo(p), aperture: ap, maxblur: mb });

// stage scene with Ramon in posing trunks
function stageShot(makeStage, opts = {}) {
  const scene = makeStage({ shadowSize: 3.5, sun: opts.sun ?? 1.4, sunDir: [-2, 7, 5] });
  const st = stage(scene, opts);
  const r = ramon(opts.kind || 'pro'); r.root.position.set(0, st.top, 0.3); scene.add(r.root);
  return { scene, st, r };
}

// ============ A 0.00 skinny kid on the park bar ============
function shotA({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  ground(scene); for (const [x, z, i] of [[-2.2, -2.5, 0], [2.4, -3, 1], [-3.5, -5, 2], [1, -6, 0], [4, -5.5, 2]]) { const t = tree(2.6, i); t.position.set(x, 0, z); scene.add(t); }
  const bar = pullBar(); scene.add(bar);
  const r = ramon('calis'); scene.add(r.root);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const k = 0.5 - 0.5 * Math.cos(t * 3.4);
      pullUp(r, bar, k); r.setMouth(0.1 * k);
      const kk = easeInOut(range(t, 0, 3.15));
      place(c, [lerp(1.4, 0.9, kk), lerp(1.4, 1.6, kk), lerp(3.6, 3.0, kk)], [0, 1.5, 0]);
      return { dof: dofAt(c, V(0, 1.6, 0), 0.002), exposure: 1.0 };
    },
  };
}
// ============ B 3.15 rice and eggs ============
function shotB({ makeStage }) {
  const scene = makeStage({ shadowSize: 1 });
  const tb = table(1.2, 0.8, 0.75, 0xb07a4a); scene.add(tb);
  const pl = ricePlate(); pl.position.set(0, tb.top, 0); scene.add(pl);
  const fork = box(0.012, 0.004, 0.2, SILVER, [0.26, tb.top + 0.005, 0.02], [0, 0.2, 0]); scene.add(fork);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.1, 24), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.1, clearcoat: 1 })); cup.position.set(-0.3, tb.top + 0.05, -0.1); cup.castShadow = true; scene.add(cup);
  const steam = []; for (let i = 0; i < 6; i++) { const g = glowSprite(0xffffff, 0.08); scene.add(g); steam.push(g); }
  const c = cam(34);
  return {
    scene, camera: c,
    update(t) {
      steam.forEach((g, i) => { const p = (t * 0.35 + i / 6) % 1; g.position.set(Math.sin(p * 6 + i) * 0.03, tb.top + 0.08 + p * 0.35, Math.cos(i) * 0.04); g.material.opacity = 0.25 * Math.sin(p * Math.PI); g.scale.setScalar(0.06 + p * 0.1); });
      const a = lerp(-0.5, 0.3, easeInOut(range(t, 0, 2.7)));
      place(c, [Math.sin(a) * 0.62, tb.top + lerp(0.5, 0.38, range(t, 0, 2.7)), Math.cos(a) * 0.62], [0, tb.top + 0.03, 0]);
      return { dof: dofAt(c, V(0, tb.top, 0), 0.02, 0.012) };
    },
  };
}
// ============ C 5.83 the champion lifts the trophy ============
function shotC({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'MR. OLYMPIA', sub: 'CLASSIC PHYSIQUE' });
  const tr = trophy(1.1); scene.add(tr);
  const cf = confetti(260, 7); scene.add(cf);
  const fl = flag(1.5, 1.05); fl.position.set(-1.7, 1.9, -0.6); scene.add(fl);
  const pole = box(0.03, 2.4, 0.03, SILVER, [-2.47, 1.6, -0.6]); scene.add(pole);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.2, 1.2));
      stand(r, t, { neck: [-0.2 * k, 0, 0] }); overhead(r, k, 0.12); r.setMouth(0.8 * k);
      r.root.updateMatrixWorld(true);
      const a = r.j.lWr.getWorldPosition(V(0, 0, 0)), b = r.j.rWr.getWorldPosition(V(0, 0, 0));
      tr.position.copy(a).add(b).multiplyScalar(0.5).add(V(0, -0.02, 0.02));
      cf.update(t - 0.6); fl.update(t);
      st.spot.intensity = 22;
      const kk = easeInOut(range(t, 0, 4.8));
      const s = shake(t, 1.2);
      place(c, [lerp(0.9, -0.5, kk) + s[0], lerp(1.2, 1.5, kk) + s[1], lerp(3.9, 4.6, kk)], [0, 1.8, 0.3]);
      return { dof: dofAt(c, V(0, 1.8, 0.3), 0.0015), bloom: 0.8 };
    },
  };
}
// ============ D 10.62 title ============
function shotD({ makeStage }) {
  const scene = makeStage({ shadowSize: 2.5 });
  const r = ramon('pro'); scene.add(r.root);
  const s1 = sign('RAMON DINO', { w: 1.9, h: 0.55, bg: '#f2c14e', fg: '#14245e', size: 230, border: '#14245e', frame: 0xc99a2a }); s1.position.set(0, 2.45, -1); scene.add(s1);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.1, 0.6));
      stand(r, t, { lHip: [0, 0, 0.14], rHip: [0, 0, -0.14], lAn: [0, 0, -0.14], rAn: [0, 0, 0.14] }); dblBiceps(r, k, t);
      r.setMouth(0.15);
      s1.position.y = lerp(3.3, 2.45, easeOut(range(t, 0, 0.7))); s1.rotation.z = Math.sin(t * 2) * 0.02;
      place(c, [0.2, lerp(1.45, 1.6, range(t, 0, 2)), lerp(4.0, 3.7, range(t, 0, 2))], [0, 1.7, 0]);
      return { dof: dofAt(c, V(0, 1.6, 0), 0.0015) };
    },
  };
}
// ============ E 12.68 Rio Branco, 1995 ============
function shotE({ makeStage }) {
  const scene = makeStage({ shadowSize: 5 });
  ground(scene, 0x86c060);
  const hs = house(0xf2d27a); hs.position.set(0.2, 0, -1.2); scene.add(hs);
  const hs2 = house(0xa8d8f0, 0xb04a32); hs2.position.set(-2.1, 0, -1.8); hs2.rotation.y = 0.3; scene.add(hs2);
  for (const [x, z, i] of [[2.2, -2, 0], [-3.4, -3.5, 1], [3.6, -4, 2]]) { const t = tree(2.4, i); t.position.set(x, 0, z); scene.add(t); }
  const s1 = sign(['RIO BRANCO', 'ACRE'], { w: 1.1, h: 0.6, post: 1.1, bg: '#1e7d3a', fg: '#fff', size: 150, frame: 0x8a8d94 }); s1.position.set(-0.55, 0, 0.6); s1.rotation.y = 0.25; scene.add(s1);
  const s2 = sign('1995', { w: 0.8, h: 0.42, bg: '#ffffff', fg: '#14245e', size: 260 }); s2.position.set(0.95, 1.95, -0.4); scene.add(s2);
  const r = ramon('kid'); r.root.position.set(0.55, 0, 0.2); r.root.rotation.y = -0.2; scene.add(r.root);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t); wave(r, t); r.setMouth(0.25);
      s2.position.y = 1.95 + Math.sin(t * 2) * 0.03;
      const k = easeInOut(range(t, 0, 3));
      place(c, [lerp(-0.3, 0.2, k), lerp(1.9, 1.35, k), lerp(6.4, 5.4, k)], [0.15, 1.05, -0.4]);
      return { dof: dofAt(c, V(0.4, 0.8, 0), 0.0012) };
    },
  };
}
// ============ F 15.67 the kid, Xavier Maia ============
function shotF({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  ground(scene, 0x86c060);
  const road = box(1.6, 0.01, 14, new THREE.MeshStandardMaterial({ color: 0xc9a77c, roughness: 1 }), [0, 0.005, -4]); road.receiveShadow = true; scene.add(road);
  const hs = house(0xf0a8a0); hs.position.set(-1.9, 0, -2); hs.rotation.y = 0.5; scene.add(hs);
  const hs2 = house(0xf2d27a); hs2.position.set(2.0, 0, -3); hs2.rotation.y = -0.5; scene.add(hs2);
  const s1 = sign(['BAIRRO', 'XAVIER MAIA'], { w: 0.9, h: 0.45, post: 1.25, bg: '#2f6fdb', fg: '#fff', size: 150, frame: 0x8a8d94 }); s1.position.set(0.62, 0.35, -0.7); s1.rotation.y = -0.2; scene.add(s1);
  const r = ramon('kid'); r.root.position.set(0, 0, 0.3); scene.add(r.root);
  const c = cam(34);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { neck: [-0.15, 0.1, 0] }); handsOnHips(r); r.setMouth(0.3 + 0.1 * Math.sin(t * 3));
      const k = easeInOut(range(t, 0, 3.2));
      place(c, [lerp(-0.6, -0.3, k), lerp(0.8, 0.95, k), lerp(2.5, 2.1, k)], [0.25, 1.0, 0]);
      return { dof: dofAt(c, V(0, 0.9, 0.3), 0.004) };
    },
  };
}
// ============ G 18.82 football ============
function shotG({ makeStage }) {
  const scene = makeStage({ shadowSize: 4 });
  ground(scene, 0x5fb04a);
  const lineM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  scene.add(box(0.06, 0.005, 8, lineM, [-2, 0.004, -2]));
  const goal = new THREE.Group(); for (const x of [-0.9, 0.9]) goal.add(box(0.06, 1.2, 0.06, lineM, [x, 0.6, 0])); goal.add(box(1.86, 0.06, 0.06, lineM, [0, 1.2, 0])); goal.position.set(2.0, 0, -3.4); goal.rotation.y = -0.4; scene.add(goal);
  const r = ramon('kid'); r.root.position.set(-0.3, 0, 0.3); r.root.rotation.y = 0.9; scene.add(r.root);
  const bl = ball(); bl.scale.setScalar(0.7); scene.add(bl);
  const c = cam(38);
  const TK = 2.6;
  const start = V(-0.0, 0.077, 0.48);
  const dir = V(2.0, 0, -3.4).sub(start).normalize();
  return {
    scene, camera: c,
    update(t) {
      const pre = t < TK;
      if (t < 2.0) { walk(r, t, 1.1); r.root.position.set(lerp(-1.4, -0.5, t / 2.0), 0, lerp(0.95, 0.65, t / 2.0)); }
      else {
        r.root.position.set(lerp(-0.5, -0.32, range(t, 2, TK)), 0, lerp(0.65, 0.6, range(t, 2, TK)));
        const wind = smooth(range(t, 2.0, TK - 0.15)), kick = easeOut(range(t, TK - 0.15, TK + 0.25));
        stand(r, t, { rHip: [lerp(0.6 * wind, -1.1, kick), 0, -0.07], rKn: [lerp(1.0 * wind, 0.1, kick), 0, 0], lKn: [0.25, 0, 0], drop: -0.04, lSh: [-0.6, 0, 0.5], rSh: [0.5, 0, -0.4], spine: [0.1 * kick, 0, 0] });
      }
      r.setMouth(t > TK ? 0.6 : 0.2);
      const bt = Math.max(0, t - TK);
      bl.position.copy(start).addScaledVector(dir, bt * 3.2).add(V(0, bt * 2.2 - bt * bt * 2.0, 0));
      bl.position.y = Math.max(0.077, bl.position.y);
      bl.rotation.x = -bt * 20;
      const k = easeInOut(range(t, 0, 3.6));
      place(c, [lerp(-2.2, -1.9, k), lerp(0.9, 1.0, k), lerp(2.8, 2.3, k)], [lerp(-0.6, 0.2, k), 0.55, 0.3]);
      return { dof: dofAt(c, V(-0.3, 0.5, 0.5), 0.0015) };
    },
  };
}
// ============ H 22.44 capoeira ============
function shotH({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  ground(scene, 0xd8b98a);
  const r = ramon('kid'); scene.add(r.root);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const g = Math.sin(t * 4.5);
      const kick = smooth(range(t, 0.7, 1.05)) * (1 - smooth(range(t, 1.35, 1.7)));
      r.root.rotation.y = lerp(0.3, -0.5, kick);
      r.setPose({
        ...STAND, drop: -0.12, spine: [0.15, 0, -0.35 * kick], chest: [0.1, 0, -0.15 * kick],
        lHip: [-0.5 + 0.3 * g * (1 - kick), 0, 0.25], lKn: [0.7, 0, 0],
        rHip: [lerp(0.6 - 0.3 * g, -0.6, kick), 0, lerp(-0.2, -1.35, kick)], rKn: [lerp(0.5, 0.05, kick), 0, 0],
        lSh: [-1.2, 0, 0.4], lEl: [-1.3, 0, 0], rSh: [0.3, 0, -0.5], rEl: [-0.4, 0, 0], neck: [0, 0.2, 0.2 * kick],
      });
      r.setMouth(0.15);
      place(c, [lerp(0.9, 0.6, range(t, 0, 1.7)), 0.75, 2.1], [0, 0.65, 0]);
      return { dof: dofAt(c, V(0, 0.6, 0), 0.002) };
    },
  };
}
// ============ I 24.16 teen discovers the gym ============
function shotI({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  gymRoom(scene);
  const r = ramon('teen'); r.root.position.set(0, 0, 0.2); scene.add(r.root);
  const db = dumbbell(0.28); attach(r, 'r', db, [0, -0.06, 0.02], [0, 0, 0]);
  const hearts = [0, 1, 2].map(() => { const hh = heart(); scene.add(hh); return hh; });
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const cu = 0.5 - 0.5 * Math.cos(t * 3.6);
      stand(r, t, { neck: [0.1, -0.35, 0] });
      arm(r, 'r', [-0.24, lerp(0.98, 1.42, cu), lerp(0.1, 0.22, cu)], [-0.3, 1.1, -0.5], [0, 0, 1]);
      r.setMouth(0.35);
      hearts.forEach((hh, i) => { const p = (t * 0.45 + i / 3) % 1; hh.position.set(-0.15 + i * 0.15 + Math.sin(p * 7) * 0.05, 1.75 * r.s + p * 0.6, 0.3); hh.scale.setScalar(0.6 + p * 0.5); hh.visible = t > 1.6; hh.rotation.y = Math.sin(t * 2 + i) * 0.4; });
      const k = easeInOut(range(t, 0, 3));
      place(c, [lerp(0.8, 0.5, k), lerp(1.35, 1.45, k), lerp(2.8, 2.3, k)], [-0.05, 1.3, 0]);
      return { dof: dofAt(c, V(0, 1.35, 0.2), 0.003) };
    },
  };
}
// ============ J 27.18 no money, leaves the gym ============
function shotJ({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  gymRoom(scene);
  const r = ramon('teen'); scene.add(r.root);
  const s1 = sign(['MENSALIDADE', 'R$ 80,00'], { w: 1.1, h: 0.62, bg: '#ffffff', fg: '#c62828', size: 140, border: '#c62828' }); s1.position.set(0.95, 1.6, -0.9); s1.rotation.y = -0.3; scene.add(s1);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      if (t < 2.0) {
        r.root.position.set(0, 0, 0); r.root.rotation.y = 0.3;
        const sh = smooth(range(t, 0.3, 0.8)) * (1 - smooth(range(t, 1.5, 1.9)));
        stand(r, t, { neck: [lerp(-0.05, 0.35, smooth(range(t, 1.0, 1.8))), 0.5 - 0.5 * smooth(range(t, 0.6, 1.2)), 0] });
        for (const s of [1, -1]) arm(r, s > 0 ? 'l' : 'r', [s * lerp(0.26, 0.45, sh), lerp(0.98, 1.2, sh), lerp(0.05, 0.25, sh)], [s * 0.8, 1.1, -0.3], [0, 1, 0]);   // empty-hands shrug
        r.setMouth(0.05);
      } else {
        const w = t - 2.0;
        r.root.rotation.y = -1.9; r.root.position.set(-w * 0.7, 0, w * 0.1);
        walk(r, t, 0.8, { neck: [0.35, 0, 0], spine: [0.12, 0, 0] });
        r.setMouth(0);
      }
      const k = easeInOut(range(t, 0, 3.9));
      place(c, [lerp(0.4, 0.2, k), 1.4, lerp(3.2, 3.6, k)], [lerp(0.2, -0.6, k), 1.25, -0.3]);
      return { dof: dofAt(c, V(0, 1.3, 0), 0.0015) };
    },
  };
}
// ============ K 31.27 he didn't stop ============
function shotK({ makeStage }) {
  const scene = makeStage({ shadowSize: 1.5 });
  const r = ramon('calis'); scene.add(r.root);
  const c = cam(30);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.1, 0.6));
      stand(r, t, { neck: [-0.05, 0, 0] });
      arm(r, 'r', [-0.15, lerp(1.0, 1.42, k), lerp(0.1, 0.35, k)], [-0.6, 1.1, 0.0], [0, 0, 1]);
      r.setMouth(0);
      const s = shake(t, 0.6);
      place(c, [0.15 + s[0], lerp(1.25, 1.3, t) + s[1], lerp(1.35, 1.15, range(t, 0, 1.3))], [0, 1.58, 0]);
      return { dof: dofAt(c, V(0, 1.65, 0.1), 0.006) };
    },
  };
}
function park(scene) {
  ground(scene, 0x6fb655, 18);
  const trees = [[-2.5, -2.4, 0], [2.6, -2.8, 1], [-4.2, -5, 2], [0.8, -6.5, 0], [4.4, -5.5, 2], [-1.2, -8, 1], [3, -9, 0], [-5.5, -1, 1]];
  for (const [x, z, i] of trees) { const t = tree(3.0, i); t.position.set(x, 0, z); scene.add(t); }
  const path = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.9, 64), new THREE.MeshStandardMaterial({ color: 0xd4bf98, roughness: 1 })); path.rotation.x = -Math.PI / 2; path.position.set(0, 0.004, -1.5); path.receiveShadow = true; scene.add(path);
}
// ============ L 32.62 calisthenics every day ============
function shotL({ makeStage }) {
  const scene = makeStage({ shadowSize: 4 });
  park(scene);
  const bar = pullBar(); scene.add(bar);
  const bar2 = pullBar(1.2, 1.0); bar2.position.set(1.6, 0, -0.6); scene.add(bar2);
  const r = ramon('calis'); scene.add(r.root);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      const k = 0.5 - 0.5 * Math.cos(t * 3.2);
      pullUp(r, bar, k); r.setMouth(0.25 * k);
      const a = lerp(-0.7, 0.2, easeInOut(range(t, 0, 4.1)));
      place(c, [Math.sin(a) * 3.8, 1.55, Math.cos(a) * 3.8], [0, 1.45, 0]);
      return { dof: dofAt(c, V(0, 1.5, 0), 0.0015) };
    },
  };
}
// ============ M 36.74 Horto Florestal sign ============
function shotM({ makeStage }) {
  const scene = makeStage({ shadowSize: 4 });
  park(scene);
  const s1 = sign(['HORTO FLORESTAL', 'RIO BRANCO - AC'], { w: 1.1, h: 0.5, post: 1.4, bg: '#1e7d3a', fg: '#ffffff', size: 130, frame: 0x6b4a2c }); s1.position.set(-0.2, 0, 1.0); s1.rotation.y = 0.35; scene.add(s1);
  const bar = pullBar(); bar.position.set(0.6, 0, -1.2); scene.add(bar);
  const r = ramon('calis'); scene.add(r.root);
  const sun = glowSprite(0xfff1b0, 2.2); sun.position.set(-6, 9, -20); scene.add(sun);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      pullUp(r, bar, 0.5 - 0.5 * Math.cos(t * 3.0));
      const k = easeInOut(range(t, 0, 2.9));
      place(c, [lerp(-0.9, -0.5, k), lerp(1.25, 1.4, k), lerp(3.6, 3.2, k)], [-0.1, 1.35, 0]);
      return { dof: dofAt(c, V(-0.6, 1.3, 1.0), 0.003) };
    },
  };
}
// ============ N 39.62 the physique gets attention ============
function shotN({ makeStage }) {
  const scene = makeStage({ shadowSize: 4 });
  park(scene);
  const bar = pullBar(); scene.add(bar);
  const r = ramon('calis2'); scene.add(r.root);
  const p1 = person(0xe85d3a, { skin: 0xc68a63 }); p1.root.position.set(1.0, 0, -0.5); p1.root.rotation.y = Math.atan2(-1.0, 0.5); scene.add(p1.root);
  const p2 = person(0x3a9ad9, { skin: 0xe3b08f, longHair: true, beardOn: false, hair: 0x5a3a1e }); p2.root.position.set(1.5, 0, 0.1); p2.root.rotation.y = Math.atan2(-1.5, -0.1); scene.add(p2.root);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      pullUp(r, bar, t < 1.4 ? 0.5 - 0.5 * Math.cos(t * 4.4) : 1);
      const wow = smooth(range(t, 1.2, 1.7));
      for (const [p, sd] of [[p1, 1], [p2, -1]]) { stand(p, t + sd, { neck: [-0.2, 0, 0], head: [-0.1, 0, 0] }); p.setMouth(0.85 * wow); }
      arm(p1, 'r', [-0.12, lerp(1.0, 1.72, wow), 0.15], [-0.5, 1.2, 0.2], [0, 0, 1]);
      arm(p2, 'l', [0.1, lerp(1.0, 1.7, wow), 0.15], [0.5, 1.2, 0.2], [0, 0, 1]);
      const k = easeInOut(range(t, 0, 4.1));
      place(c, [lerp(2.6, 2.2, k), lerp(1.5, 1.6, k), lerp(3.4, 3.0, k)], [lerp(0.6, 0.3, k), 1.5, 0.3]);
      return { dof: dofAt(c, V(0.5, 1.5, 0.3), 0.0015) };
    },
  };
}
// ============ O 43.78 first bodybuilding stage ============
function shotO({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'FISICULTURISMO', sub: 'AMADOR', kind: 'calis2', lights: 2 });
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.3, 0.8));
      stand(r, t, { lHip: [0, 0, 0.14], rHip: [0, 0, -0.14] }); dblBiceps(r, k, t); r.setMouth(0.2);
      st.spot.intensity = 18;
      const kk = easeInOut(range(t, 0, 2.6));
      place(c, [lerp(-0.8, 0.4, kk), 1.5, lerp(4.6, 4.1, kk)], [0, 1.65, 0.3]);
      return { dof: dofAt(c, V(0, 1.6, 0.3), 0.0012), bloom: 0.6 };
    },
  };
}
// ============ P 46.39 selling things, raffles ============
function shotP({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  ground(scene, 0xc7c9cc);
  const tb = table(1.6, 0.7, 0.75, 0x9a6a42); tb.position.set(0, 0, 0.4); scene.add(tb);
  const items = [[box(0.3, 0.12, 0.15, new THREE.MeshStandardMaterial({ color: 0xe23b3b, roughness: 0.5 })), -0.5], [box(0.36, 0.24, 0.05, new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 })), -0.05], [box(0.25, 0.25, 0.25, new THREE.MeshStandardMaterial({ color: 0xc89a62, roughness: 0.9 })), 0.45]];
  for (const [m, x] of items) { m.position.set(x, tb.top + m.geometry.parameters.height / 2, 0.45); m.castShadow = true; scene.add(m); }
  const tags = ['R$ 50', 'R$ 120', 'R$ 30'].map((p, i) => { const s = sign(p, { w: 0.22, h: 0.1, bg: '#ffeb3b', fg: '#111', size: 300, frame: 0xd0b000 }); s.position.set(items[i][1], tb.top + 0.36, 0.55); scene.add(s); return s; });
  const s1 = sign(['RIFA', 'R$ 5'], { w: 0.9, h: 0.6, bg: '#ffffff', fg: '#1f6fe0', size: 200, border: '#1f6fe0' }); s1.position.set(0, 1.9, -0.5); scene.add(s1);
  const r = ramon('calis2'); r.root.position.set(0.0, 0, -0.25); scene.add(r.root);
  const tk = sign('Nº 07', { w: 0.14, h: 0.08, bg: '#ff8a65', fg: '#fff', size: 400, frame: 0xff8a65 }); attach(r, 'r', tk, [0, -0.11, 0.05], [0, 0, 0]);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { neck: [0.05, 0, 0] });
      arm(r, 'r', [-0.18, 1.3 + Math.sin(t * 5) * 0.03, 0.4], [-0.6, 1.0, 0], [0, 0, 1]);
      r.setMouth(0.3 + 0.25 * Math.sin(t * 7) ** 2);
      tags.forEach((s, i) => s.rotation.z = Math.sin(t * 2 + i) * 0.08);
      const k = easeInOut(range(t, 0, 3.3));
      place(c, [lerp(0.8, 0.3, k), lerp(1.55, 1.45, k), lerp(3.3, 2.8, k)], [0, 1.25, 0.1]);
      return { dof: dofAt(c, V(0, 1.2, 0.3), 0.0015) };
    },
  };
}
// ============ Q 49.67 tickets and hotel ============
function shotQ({ makeStage }) {
  const scene = makeStage({ shadowSize: 4 });
  ground(scene, 0xb9bec6, 20);
  const road = box(30, 0.01, 1.4, new THREE.MeshStandardMaterial({ color: 0x5a5f66, roughness: 1 }), [0, 0.006, 0]); road.receiveShadow = true; scene.add(road);
  const s1 = sign('PASSAGEM', { w: 1.0, h: 0.36, post: 1.3, bg: '#1f6fe0', fg: '#fff', size: 190, frame: 0x8a8d94 }); s1.position.set(-1.3, 0, -1.2); scene.add(s1);
  const s2 = sign('HOTEL', { w: 0.8, h: 0.36, post: 1.3, bg: '#c62828', fg: '#fff', size: 220, frame: 0x8a8d94 }); s2.position.set(2.2, 0, -1.2); scene.add(s2);
  const r = ramon('casual'); r.root.rotation.y = Math.PI / 2; scene.add(r.root);
  r.j.upperBody.scale.set(1.0, 1, 0.95);
  const sc = suitcase(); scene.add(sc);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      const x = lerp(-2.4, 1.8, t / 2.3);
      r.root.position.set(x, 0, 0.1); walk(r, t, 1.0);
      arm(r, 'l', [0.3, 0.9, -0.05], [0.6, 1.2, -0.3], [0, 0, 1]);
      sc.position.set(x + 0.0, 0.06 + Math.abs(Math.sin(t * 6.5)) * 0.015, 0.45); sc.rotation.z = 0.0;
      place(c, [x * 0.6 + 0.2, 1.5, 4.2], [x * 0.75 + 0.1, 1.1, 0]);
      return { dof: dofAt(c, V(x, 1.1, 0.1), 0.0012) };
    },
  };
}
// ============ R 51.96 rice and eggs diet ============
function shotR({ makeStage }) {
  const scene = makeStage({ shadowSize: 2 });
  const tb = table(1.4, 0.8, 0.75, 0xb07a4a); tb.position.set(0, 0, 0.35); scene.add(tb);
  const plates = [-0.45, 0, 0.45].map((x, i) => { const p = ricePlate(); p.position.set(x, tb.top, 0.45 - (i === 1 ? 0.08 : 0)); scene.add(p); return p; });
  const s1 = sign(['ARROZ', '+ OVO'], { w: 0.9, h: 0.55, bg: '#ffffff', fg: '#e09400', size: 190, border: '#e09400' }); s1.position.set(0.0, 2.05, -0.6); scene.add(s1);
  const r = ramon('calis2'); r.root.position.set(0, 0, -0.25); scene.add(r.root);
  const fork = box(0.012, 0.18, 0.006, SILVER); attach(r, 'r', fork, [0, -0.1, 0.05], [0.4, 0, 0]);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const e = 0.5 - 0.5 * Math.cos(t * 4.2);
      stand(r, t, { neck: [0.2 - 0.1 * e, 0, 0], lHip: [-0.25, 0, 0.07], rHip: [-0.25, 0, -0.07], lKn: [0.25, 0, 0], rKn: [0.25, 0, 0], drop: -0.05 });
      arm(r, 'r', [-0.1, lerp(1.05, 1.5, e), lerp(0.42, 0.18, e)], [-0.6, 1.1, 0.1], [0, 1, 0]);
      arm(r, 'l', [0.3, 0.98, 0.3], [0.7, 1.1, 0], [0, 1, 0]);
      r.setMouth(0.25 * (1 - e) + 0.05);
      const k = easeInOut(range(t, 0, 3.5));
      place(c, [lerp(-0.7, -0.4, k), lerp(1.7, 1.55, k), lerp(2.7, 2.3, k)], [0, 1.25, 0.2]);
      return { dof: dofAt(c, V(0, 1.2, 0.2), 0.002) };
    },
  };
}
// ============ S 55.52 São Paulo, 2018 ============
function shotS({ makeStage }) {
  const scene = makeStage({ shadowSize: 5 });
  ground(scene, 0xa7adb6, 30);
  const sk = skyline(11); sk.position.set(0, 0, -5); scene.add(sk);
  const s1 = sign(['SÃO PAULO', '2018'], { w: 1.3, h: 0.7, post: 1.2, bg: '#14245e', fg: '#fff', size: 170, frame: 0x8a8d94 }); s1.position.set(1.0, 0, -0.6); s1.rotation.y = -0.3; scene.add(s1);
  const r = ramon('casual'); scene.add(r.root);
  const sc = suitcase(0x2f6fdb); scene.add(sc);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      if (t < 1.9) { r.root.position.set(-0.4, 0, lerp(2.5, 0.6, t / 1.9)); r.root.rotation.y = 0; walk(r, t); arm(r, 'r', [-0.3, 0.9, 0.0], [-0.6, 1.2, -0.3]); }
      else { r.root.position.set(-0.4, 0, 0.6); r.root.rotation.y = -0.6 * smooth(range(t, 1.9, 2.3)); stand(r, t, { neck: [-0.3, 0.2, 0] }); arm(r, 'r', [-0.3, 0.9, 0.0], [-0.6, 1.2, -0.3]); }
      r.setMouth(t > 2.1 ? 0.6 : 0);
      r.root.updateMatrixWorld(true);
      const hp = r.j.rWr.getWorldPosition(V(0, 0, 0));
      sc.position.set(hp.x, 0.0, hp.z + 0.05); sc.rotation.y = r.root.rotation.y;
      const k = easeInOut(range(t, 0, 2.8));
      place(c, [lerp(-1.4, -1.6, k), lerp(0.7, 0.6, k), lerp(4.6, 4.2, k)], [0.1, lerp(1.4, 1.8, k), -1]);
      return { dof: dofAt(c, V(-0.4, 1.2, 0.6), 0.0012) };
    },
  };
}
// ============ T 58.34 Mr Olympia Brasil, Pro Card ============
function shotT({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'MR. OLYMPIA', sub: 'BRASIL 2018', kind: 'calis2' });
  const md = medal(GOLD); scene.add(md);
  const card = cardProp(); scene.add(card);
  const gl = glowSprite(0xffe08a, 1.0); scene.add(gl);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { lHip: [0, 0, 0.14], rHip: [0, 0, -0.14] });
      const k = easeOut(range(t, 0.0, 0.4));
      dblBiceps(r, k, t); r.setMouth(0.5);
      r.root.updateMatrixWorld(true);
      const nk = r.j.chest.localToWorld(V(0, 0.18, 0.2));
      md.position.copy(nk);
      const ck = easeOut(range(t, 1.9, 2.6));
      card.position.set(lerp(0, 0.0, ck), lerp(0.8, 2.4, ck), lerp(0.9, 1.0, ck)); card.rotation.y = lerp(3, 0, ck); card.scale.setScalar(lerp(0.3, 1.5, ck)); card.visible = t > 1.9;
      gl.position.copy(card.position).add(V(0, 0, -0.05)); gl.material.opacity = ck * 0.8; gl.scale.setScalar(1.2 * ck + 0.01);
      st.spot.intensity = 20;
      const kk = easeInOut(range(t, 0, 3.4));
      place(c, [lerp(0.5, 0.1, kk), lerp(1.6, 1.8, kk), lerp(4.0, 3.5, kk)], [0, lerp(1.6, 2.0, kk), 0.3]);
      return { dof: dofAt(c, V(0, 1.8, 0.5), 0.0012), bloom: 0.7 };
    },
  };
}
// ============ U 61.72 back to Acre, no sponsor ============
function shotU({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  ground(scene, 0x86c060);
  const hs = house(0xf2d27a); hs.position.set(0.8, 0, -2.0); scene.add(hs);
  const t1 = tree(2.6, 1); t1.position.set(-1.8, 0, -2.4); scene.add(t1);
  const s1 = sign('ACRE', { w: 0.8, h: 0.32, post: 1.2, bg: '#1e7d3a', fg: '#fff', size: 200, frame: 0x8a8d94 }); s1.position.set(-1.0, 0, -0.6); scene.add(s1);
  const s2 = sign(['PATROCÍNIO', '0'], { w: 1.0, h: 0.6, bg: '#ffffff', fg: '#c62828', size: 150, border: '#c62828' }); s2.position.set(0.55, 1.85, -0.4); s2.rotation.y = -0.25; scene.add(s2);
  const sc = suitcase(0x2f6fdb); sc.rotation.y = Math.PI / 2; scene.add(sc);
  const r = ramon('casual'); r.root.position.set(0, 0, 0.32); scene.add(r.root);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      r.setPose({ ...SIT, neck: [0.45 + 0.05 * Math.sin(t), 0, 0] });
      arm(r, 'l', [0.12, 0.8, 0.55], [0.6, 0.8, 0.2], [0, 1, 0]); arm(r, 'r', [-0.12, 0.8, 0.55], [-0.6, 0.8, 0.2], [0, 1, 0]);
      r.setMouth(0);
      s2.rotation.z = Math.sin(t * 1.5) * 0.03;
      const k = easeInOut(range(t, 0, 2.7));
      place(c, [lerp(0.3, -0.1, k), lerp(1.2, 1.15, k), lerp(3.4, 2.9, k)], [0.1, 1.0, 0]);
      return { dof: dofAt(c, V(0, 0.9, 0.3), 0.0015) };
    },
  };
}
// ============ V 64.39 the mansion, 2020 ============
function shotV({ makeStage }) {
  const scene = makeStage({ shadowSize: 6, sunDir: [-4, 7, 5] });
  ground(scene, 0x76c058, 25);
  const mn = mansion(); mn.position.set(0, 0, -2.2); scene.add(mn);
  for (const [x, z] of [[-2.8, -0.6], [2.9, -0.4], [-3.2, -3.5]]) { const p = palm(2.8); p.position.set(x, 0, z); scene.add(p); }
  const s1 = sign(['MANSÃO MAROMBA', '2020'], { w: 1.8, h: 0.6, bg: '#111111', fg: '#f2c14e', size: 140, frame: 0x222222, emissive: 0.15 }); s1.position.set(-0.4, 3.35, -1.2); scene.add(s1);
  const r = ramon('casual'); scene.add(r.root);
  const sc = suitcase(0x2f6fdb); scene.add(sc);
  const g = person(0xf4f4f4, { skin: 0xd09a72, cap: 0x111111, shorts: 0x1d1d22, muscle: 0.7 }); g.root.position.set(1.0, 0, 0.9); g.root.rotation.y = -0.6; scene.add(g.root);
  const c = cam(42);
  return {
    scene, camera: c,
    update(t) {
      const wk = t < 3.2;
      r.root.rotation.y = 2.6;
      r.root.position.set(lerp(-0.9, -0.1, range(t, 0, 3.2)), 0, lerp(2.8, 1.2, range(t, 0, 3.2)));
      if (wk) walk(r, t); else stand(r, t);
      if (!wk) wave(r, t, 'l');
      arm(r, 'r', [-0.3, 0.9, 0.0], [-0.6, 1.2, -0.3]);
      r.root.updateMatrixWorld(true);
      const hp = r.j.rWr.getWorldPosition(V(0, 0, 0)); sc.position.set(hp.x, 0, hp.z); sc.rotation.y = r.root.rotation.y;
      stand(g, t); wave(g, t + 0.5); g.setMouth(0.6);
      r.root.rotation.y = lerp(2.6, 2.6, 1);
      const k = easeInOut(range(t, 0, 5.8));
      place(c, [lerp(-0.5, 0.6, k), lerp(1.2, 1.9, k), lerp(6.8, 6.2, k)], [0.2, 1.4, -0.6]);
      return { dof: dofAt(c, V(0.3, 1.2, 1.0), 0.0008) };
    },
  };
}
// ============ W 70.20 new friends, sponsorships ============
function shotW({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  gymRoom(scene);
  const r = ramon('casual'); r.root.position.set(-0.42, 0, 0); r.root.rotation.y = 1.25; scene.add(r.root);
  const b = person(0x2f6fdb, { skin: 0xe3b08f, hair: 0x2a2a2a, shorts: 0x2b2d33, muscle: 0.4, beardOn: false }); b.root.position.set(0.42, 0, 0); b.root.rotation.y = -1.25; scene.add(b.root);
  const s1 = sign('PATROCÍNIO', { w: 1.3, h: 0.36, bg: '#2e9e4a', fg: '#ffffff', size: 180 }); s1.position.set(0, 2.15, -0.9); scene.add(s1);
  const notes = []; for (let i = 0; i < 14; i++) { const n = cash(); n.scale.setScalar(1.2); scene.add(n); notes.push(n); }
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { neck: [0, 0.1, 0] }); stand(b, t + 1, { neck: [0, -0.1, 0] });
      const sh = Math.sin(t * 9) * 0.035;
      r.root.updateMatrixWorld(true);
      const H = V(0, 1.05 + sh, 0.05);
      for (const [h, sd] of [[r, 'r'], [b, 'r']]) {
        const L = h.root.worldToLocal(H.clone());
        arm(h, sd, [L.x, L.y, L.z], [-0.7, 0.9, -0.4], [0, 1, 0]);
      }
      r.setMouth(0.4); b.setMouth(0.3);
      notes.forEach((n, i) => { const p = ((t - 1.0) * 0.45 + i / 14) % 1; n.visible = t > 1.0; n.position.set(-1 + (i * 0.37) % 2, 2.6 - p * 2.6, -0.3 + (i % 3) * 0.3); n.rotation.set(t * 2 + i, t + i, i); });
      const k = easeInOut(range(t, 0, 3.1));
      place(c, [lerp(-0.2, 0.2, k), lerp(1.45, 1.55, k), lerp(3.0, 2.6, k)], [0, 1.4, 0]);
      return { dof: dofAt(c, V(0, 1.3, 0), 0.0015) };
    },
  };
}
// ============ X 73.27 "Dinossauro do Acre" ============
function shotX({ makeStage }) {
  const scene = makeStage({ shadowSize: 4 });
  ground(scene, 0x86c060);
  const d = dino(); d.position.set(0.3, 0, -1.6); d.rotation.y = -0.4; d.scale.setScalar(1.7); scene.add(d);
  const r = ramon('pro'); r.root.position.set(0, 0, 0.4); scene.add(r.root);
  const s1 = sign(['DINOSSAURO', 'DO ACRE'], { w: 1.15, h: 0.5, bg: '#f2c14e', fg: '#14245e', size: 150, border: '#14245e', frame: 0xc99a2a }); s1.position.set(-0.35, 2.65, -0.4); s1.rotation.y = 0.2; scene.add(s1);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      const roar = smooth(range(t, 0.5, 0.9));
      stand(r, t, { neck: [-0.15 * roar, 0, 0], lHip: [0, 0, 0.16], rHip: [0, 0, -0.16], chest: [-0.05 * roar, 0, 0] });
      for (const s of [1, -1]) arm(r, s > 0 ? 'l' : 'r', [s * 0.18, lerp(1.0, 1.1, roar), lerp(0.1, 0.3, roar)], [s * 0.9, 1.25, 0.2], [0, 0, 1]);   // "most muscular" crab
      r.setMouth(roar * 0.95);
      d.jaw.rotation.z = -0.35 * roar; d.jaw.position.y = 1.58 - 0.06 * roar;
      d.scale.setScalar(1.7 + 0.05 * Math.sin(t * 20) * roar);
      const s = shake(t, 1 + 3 * roar);
      place(c, [lerp(0.9, 1.1, range(t, 0, 2.3)) + s[0], 1.1 + s[1], lerp(4.2, 3.7, range(t, 0, 2.3))], [0, 1.65, -0.4]);
      return { dof: dofAt(c, V(0, 1.6, 0.4), 0.0012) };
    },
  };
}
// ============ Y 75.56 living 100% from the sport ============
function shotY({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  gymRoom(scene);
  const r = ramon('gym'); r.root.position.set(0, 0, 0.3); scene.add(r.root);
  const bb = barbell(1.5); scene.add(bb);
  const frame = box(2.1, 0.26, 0.05, new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }), [0, 2.55, -1.2]); scene.add(frame);
  const fill = box(2.0, 0.18, 0.06, new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x1a8a40, emissiveIntensity: 0.6 }), [0, 2.55, -1.17]); scene.add(fill);
  const s1 = sign('100% DO ESPORTE', { w: 1.9, h: 0.4, bg: null, fg: '#14245e', size: 170 }); s1.position.set(0, 2.95, -1.2); scene.add(s1);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const k = easeInOut(range(t, 0.2, 2.2));
      fill.scale.x = Math.max(0.01, k); fill.position.x = -1.0 + k;
      const p = 0.5 - 0.5 * Math.cos(t * 3.2);
      stand(r, t, { lHip: [0, 0, 0.15], rHip: [0, 0, -0.15] });
      const y = lerp(1.48, 2.05, p);
      for (const s of [1, -1]) arm(r, s > 0 ? 'l' : 'r', [s * 0.32, y, 0.08], [s * 0.9, 1.25, -0.1], [0, 1, 0]);
      bb.position.set(0, (y - 0.07) * r.s, 0.3 + 0.1);
      r.setMouth(0.4 * p);
      const kk = easeInOut(range(t, 0, 3));
      place(c, [lerp(-0.5, 0.2, kk), 1.6, lerp(3.6, 3.3, kk)], [0, 1.85, -0.3]);
      return { dof: dofAt(c, V(0, 1.7, 0.3), 0.0012) };
    },
  };
}
// ============ Z 78.55 it took off like a rocket ============
function shotZ({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  ground(scene, 0x9aa3ad);
  const pad = box(1.6, 0.12, 1.6, new THREE.MeshStandardMaterial({ color: 0x555a62, roughness: 0.8 }), [0, 0.06, 0]); scene.add(pad);
  const rk = rocket(); scene.add(rk);
  const lb = sign('DINO', { w: 0.34, h: 0.16, bg: '#14245e', fg: '#f2c14e', size: 300, frame: 0x14245e }); lb.position.set(0, 0.75, 0.255); rk.add(lb);
  const flames = [0, 1, 2].map(i => { const g = glowSprite([0xffd27a, 0xff8a3a, 0xff5a2a][i], 0.5); scene.add(g); return g; });
  const smoke = []; for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 1, transparent: true })); scene.add(m); smoke.push(m); }
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      const y = 0.12 + 4.0 * easeIn(range(t, 0.25, 1.9)) * 1.5;
      rk.position.set(Math.sin(t * 40) * 0.006, y, 0);
      flames.forEach((f, i) => { f.position.set(0, y - 0.05 - i * 0.18, 0.05); f.scale.setScalar((0.7 - i * 0.12) * (1 + 0.15 * Math.sin(t * 50 + i))); f.material.opacity = 0.9; });
      smoke.forEach((m, i) => { const a = i / 24 * Math.PI * 2, p = clamp(t * 0.8 - (i % 4) * 0.08, 0, 1); m.position.set(Math.cos(a) * (0.3 + p * 1.6), 0.2 + p * 0.25, Math.sin(a) * (0.3 + p * 1.6)); m.scale.setScalar(0.4 + p * 1.6); m.material.opacity = 0.9 * (1 - p * 0.6); });
      place(c, [0.3, 1.0, 5.0], [0, lerp(1.2, Math.min(y, 6) * 0.85 + 0.6, range(t, 0.2, 1.9)), 0]);
      return { bloom: 1.0 };
    },
  };
}
// ============ AA 80.45 Arnold Classic 2023 ============
function shotAA({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'ARNOLD CLASSIC', sub: 'OHIO 2023', color: '#5a0e12', fg: '#ffffff' });
  const tr = trophy(0.9); scene.add(tr);
  const cf = confetti(160, 11); scene.add(cf);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.6, 1.4));
      stand(r, t, { neck: [-0.1 * k, 0, 0] }); overhead(r, k); r.setMouth(0.7 * k);
      r.root.updateMatrixWorld(true);
      const a = r.j.lWr.getWorldPosition(V(0, 0, 0)), b = r.j.rWr.getWorldPosition(V(0, 0, 0));
      tr.position.copy(a).add(b).multiplyScalar(0.5).add(V(0, -0.02, 0.02));
      cf.update(t - 1.0); st.spot.intensity = 22;
      const kk = easeInOut(range(t, 0, 2.6));
      place(c, [lerp(-0.6, 0.5, kk), 1.4, lerp(4.4, 4.0, kk)], [0, 1.85, 0.3]);
      return { dof: dofAt(c, V(0, 1.8, 0.3), 0.0012), bloom: 0.7 };
    },
  };
}
// ============ AB 83.04 runner-up twice ============
function shotAB({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  const pd = podium(['2', '1', '3']); scene.add(pd);
  const r = ramon('pro'); r.root.position.copy(pd.tops[0]); scene.add(r.root);
  const w = person(0x1d1d22, { skin: 0xe3b08f, hair: 0x2a1a10, muscle: 1 }); w.root.position.copy(pd.tops[1]); scene.add(w.root);
  const md = medal(SILVER); scene.add(md);
  const s1 = sign(['VICE', '2022 • 2023'], { w: 1.2, h: 0.55, bg: '#d8dce2', fg: '#14245e', size: 150 }); s1.position.set(-0.75, 2.85, -0.6); scene.add(s1);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { neck: [0, 0.1, 0] }); handsOnHips(r); r.setMouth(0.1);
      stand(w, t + 1); overhead(w, 0.85, 0.35); w.setMouth(0.6);
      r.root.updateMatrixWorld(true); md.position.copy(r.j.chest.localToWorld(V(0, 0.18, 0.2)));
      const k = easeInOut(range(t, 0, 3.4));
      place(c, [lerp(-1.3, -0.9, k), lerp(1.6, 1.8, k), lerp(4.2, 3.6, k)], [-0.45, 1.9, 0]);
      return { dof: dofAt(c, V(-0.75, 1.9, 0), 0.0015) };
    },
  };
}
// ============ AC 86.40 4th place in 2024 ============
function shotAC({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  const pd = podium(['2', '1', '3']); scene.add(pd);
  const others = [0, 1, 2].map(i => { const p = person([0x1d1d22, 0x2a2a35, 0x3a2a2a][i], { skin: [0xe3b08f, 0xd9a07a, 0xf0c2a0][i], muscle: 1 }); p.root.position.copy(pd.tops[i]); scene.add(p.root); return p; });
  const r = ramon('pro'); r.root.position.set(1.45, 0, 0.5); r.root.rotation.y = -0.3; scene.add(r.root);
  const s1 = sign(['2024', '4º LUGAR'], { w: 0.95, h: 0.55, bg: '#ffffff', fg: '#c62828', size: 150, border: '#c62828' }); s1.position.set(1.05, 2.3, -0.1); scene.add(s1);
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      others.forEach((p, i) => { stand(p, t + i); if (i === 1) overhead(p, 0.9, 0.35); });
      stand(r, t, { neck: [0.4, 0, 0], spine: [0.1, 0, 0], lSh: [0.1, 0, 0.1], rSh: [0.1, 0, -0.1] }); r.setMouth(0);
      const k = easeInOut(range(t, 0, 3.4));
      place(c, [lerp(1.8, 2.0, k), lerp(1.5, 1.4, k), lerp(3.6, 3.1, k)], [lerp(0.6, 1.1, k), 1.45, 0.2]);
      return { dof: dofAt(c, V(1.45, 1.3, 0.5), 0.0015) };
    },
  };
}
// ============ AD 89.79 new team ============
function shotAD({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  gymRoom(scene);
  const r = ramon('gym'); scene.add(r.root);
  const team = [[0x2e9e4a, -0.8, 0.6, 0xd09a72], [0xe85d3a, 0.8, 0.6, 0xe3b08f], [0x6a3ab5, 0.0, 1.0, 0x9a6a4a]].map(([col, x, z, sk]) => { const p = person(col, { skin: sk, s: 0.95 }); p.root.position.set(x, 0, z); p.root.lookAt(0, 0, 0); p.root.rotation.y += 0; scene.add(p.root); return p; });
  const clip = box(0.2, 0.28, 0.015, new THREE.MeshStandardMaterial({ color: 0x8a5a2b }));
  attach(team[0], 'l', clip, [0, -0.1, 0.06], [0.3, 0, 0]);
  const s1 = sign('NOVA EQUIPE', { w: 1.5, h: 0.38, bg: '#14245e', fg: '#fff', size: 180 }); s1.position.set(0, 2.3, -1.0); scene.add(s1);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t); handsOnHips(r); r.setMouth(0.15);
      team.forEach((p, i) => { stand(p, t + i * 0.7, { neck: [0.05, 0, 0] }); p.setMouth(0.3 * Math.abs(Math.sin(t * 6 + i))); });
      arm(team[0], 'l', [0.15, 1.2, 0.35], [0.6, 1.0, 0], [0, 1, 0]);
      arm(team[1], 'r', [-0.2, 1.3 + Math.sin(t * 4) * 0.05, 0.4], [-0.6, 1.0, 0], [0, 0, 1]);
      const a = lerp(0.6, 1.3, easeInOut(range(t, 0, 2.6)));
      place(c, [Math.sin(a) * 4.0, 2.1, Math.cos(a) * 4.0], [0, 1.25, 0.3]);
      return { dof: dofAt(c, V(0, 1.3, 0.3), 0.0015) };
    },
  };
}
// ============ AE 92.20 lights on ============
function shotAE({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'MR. OLYMPIA', sub: '2025', sun: 0.15 });
  scene.userData.sky.visible = false;
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { neck: [0.25, 0, 0] }); r.setMouth(0);
      st.glows.forEach((g, i) => { const on = smooth(range(t, 0.1 + i * 0.18, 0.2 + i * 0.18)); g.material.opacity = on; });
      st.spot.intensity = 28 * smooth(range(t, 0.85, 1.0));
      place(c, [0, 1.5, lerp(5.6, 5.2, t / 1.3)], [0, 1.6, 0]);
      return { exposure: 0.55 + 0.4 * smooth(range(t, 0.8, 1.2)), bloom: 1.0 };
    },
  };
}
// ============ AF 93.50 2025: the pose ============
function shotAF({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'MR. OLYMPIA', sub: '2025', sun: 0.6, signY: 3.2 });
  const c = cam(34);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.15, 0.7));
      stand(r, t, { lHip: [0, 0, 0.15], rHip: [0, 0, -0.15], neck: [-0.05 * k, 0, 0] });
      dblBiceps(r, k, t); r.setMouth(0.35 * k);
      st.spot.intensity = 26;
      const a = lerp(-0.45, 0.35, easeInOut(range(t, 0, 4)));
      const R = lerp(3.4, 2.7, easeInOut(range(t, 0, 4)));
      place(c, [Math.sin(a) * R, lerp(1.3, 1.7, range(t, 0, 4)), 0.3 + Math.cos(a) * R], [0, 2.15, 0.3]);
      return { dof: dofAt(c, V(0, 1.8, 0.3), 0.0018), bloom: 0.8, exposure: 0.95 };
    },
  };
}
// ============ AG 97.49 champion with Brazil's flag ============
function shotAG({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'CAMPEÃO', sub: 'CLASSIC PHYSIQUE 2025' });
  const tr = trophy(1.15); scene.add(tr);
  const fl = flag(2.6, 1.8); fl.position.set(0, 2.35, -1.6); scene.add(fl);
  const cf = confetti(320, 5, [3.5, 3.4, 2.5]); scene.add(cf);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const k = easeOut(range(t, 0.1, 0.9));
      stand(r, t, { neck: [-0.25 * k, 0, 0] }); overhead(r, k, 0.12); r.setMouth(0.9 * k);
      r.root.updateMatrixWorld(true);
      const a = r.j.lWr.getWorldPosition(V(0, 0, 0)), b = r.j.rWr.getWorldPosition(V(0, 0, 0));
      tr.position.copy(a).add(b).multiplyScalar(0.5).add(V(0, -0.02, 0.02));
      fl.update(t); cf.update(t + 0.4); st.spot.intensity = 24;
      const kk = easeInOut(range(t, 0, 3.65));
      const s = shake(t, 1.0);
      place(c, [lerp(0.4, -0.2, kk) + s[0], lerp(0.8, 1.3, kk) + s[1], lerp(3.6, 4.6, kk)], [0, lerp(2.0, 1.9, kk), 0]);
      return { dof: dofAt(c, V(0, 1.9, 0.3), 0.0012), bloom: 0.9 };
    },
  };
}
// ============ AH 101.14 family ============
function shotAH({ makeStage }) {
  const scene = makeStage({ shadowSize: 4 });
  ground(scene, 0x86c060);
  const hs = house(0xf7f7f4, 0x3a4250); hs.position.set(0, 0, -2.6); hs.scale.setScalar(1.6); scene.add(hs);
  const r = ramon('casual'); r.root.position.set(-0.35, 0, 0.2); scene.add(r.root);
  const v = person(0xe85d8a, { skin: 0xd8a27c, hair: 0x2a1a10, longHair: true, beardOn: false, dress: true, shorts: 0xe85d8a, s: 0.93 }); v.root.position.set(0.35, 0, 0.2); scene.add(v.root);
  const k1 = person(0xf7d21c, { skin: 0xb07a55, hair: 0x120d0a, beardOn: false, s: 0.45, shorts: 0x1f5fd0 }); k1.root.position.set(-0.05, 0, 0.75); scene.add(k1.root);
  const k2 = person(0x2fb8ff, { skin: 0xb07a55, hair: 0x120d0a, beardOn: false, s: 0.55, shorts: 0x1d1d22 }); k2.root.position.set(0.85, 0, 0.6); scene.add(k2.root);
  const hearts = [0, 1, 2, 3].map(() => { const h = heart(); scene.add(h); return h; });
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t); stand(v, t + 1);
      arm(r, 'l', [0.45, 1.42, -0.05], [0.4, 1.3, -0.4], [0, 0, 1]);   // arm round her shoulders
      r.setMouth(0.35); v.setMouth(0.35);
      stand(k1, t + 2); wave(k1, t); k1.setMouth(0.5);
      stand(k2, t + 3); wave(k2, t + 1, 'l'); k2.setMouth(0.4);
      hearts.forEach((h, i) => { const p = (t * 0.4 + i / 4) % 1; h.position.set(-0.6 + i * 0.4 + Math.sin(p * 6) * 0.05, 1.9 + p * 0.7, 0.2); h.scale.setScalar(0.7 + p * 0.6); h.rotation.y = Math.sin(t * 2 + i) * 0.5; });
      const k = easeInOut(range(t, 0, 3.3));
      place(c, [lerp(-0.4, 0.3, k), lerp(1.4, 1.35, k), lerp(4.0, 3.5, k)], [0.1, 1.15, 0.3]);
      return { dof: dofAt(c, V(0, 1.2, 0.3), 0.0012) };
    },
  };
}
// ============ AI 104.44 one of the biggest names on the planet ============
function shotAI({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  scene.children.forEach(o => { if (o.material && o.material.isShadowMaterial) o.visible = false; });
  const gb = globe(); gb.scale.setScalar(1.6); gb.position.y = -0.0; scene.add(gb);
  const r = ramon('pro'); r.root.position.set(0, 1.6, 0); scene.add(r.root);
  const stars = []; for (let i = 0; i < 30; i++) { const g = glowSprite(0xffffff, 0.06); g.position.set((i * 1.37 % 6) - 3, 1 + (i * 2.13 % 4), -3 - (i % 5)); scene.add(g); stars.push(g); }
  const c = cam(40);
  return {
    scene, camera: c,
    update(t) {
      gb.rotation.y = t * 0.35;
      stand(r, t, { lHip: [0, 0, 0.15], rHip: [0, 0, -0.15] }); dblBiceps(r, easeOut(range(t, 0.2, 0.7)), t); r.setMouth(0.3);
      stars.forEach((g, i) => g.material.opacity = 0.4 + 0.4 * Math.sin(t * 3 + i));
      const a = lerp(-0.5, 0.5, easeInOut(range(t, 0, 3)));
      place(c, [Math.sin(a) * 4.3, lerp(1.4, 2.4, range(t, 0, 3)), Math.cos(a) * 5.4], [0, 2.0, 0]);
      return { dof: dofAt(c, V(0, 2.4, 0), 0.0008), bloom: 0.6 };
    },
  };
}
// ============ AJ 107.42 third place in 2026 ============
function shotAJ({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  const pd = podium(['2', '1', '3']); scene.add(pd);
  const ps = [0, 1].map(i => { const p = person([0x1d1d22, 0x2a2a35][i], { skin: [0xf0c2a0, 0xe3b08f][i], muscle: 1 }); p.root.position.copy(pd.tops[i]); scene.add(p.root); return p; });
  const r = ramon('pro'); r.root.position.copy(pd.tops[2]); scene.add(r.root);
  const md = medal(BRONZE); scene.add(md);
  const s1 = sign(['2026', '3º LUGAR'], { w: 1.0, h: 0.55, bg: '#c27a3e', fg: '#ffffff', size: 150 }); s1.position.set(0.75, 2.7, -0.6); scene.add(s1);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      ps.forEach((p, i) => { stand(p, t + i); if (i === 1) overhead(p, 0.85, 0.35); });
      stand(r, t, { neck: [0.05, 0, 0] }); r.setMouth(0.05);
      arm(r, 'r', [-0.05, 1.15, 0.3], [-0.6, 1.0, 0], [0, 1, 0]);   // looks at the medal
      r.root.updateMatrixWorld(true); md.position.copy(r.j.chest.localToWorld(V(0, 0.18, 0.2)));
      const k = easeInOut(range(t, 0, 3.6));
      place(c, [lerp(1.6, 1.2, k), lerp(1.5, 1.7, k), lerp(3.8, 3.2, k)], [0.55, lerp(1.6, 1.75, k), 0]);
      return { dof: dofAt(c, V(0.75, 1.7, 0), 0.0015) };
    },
  };
}
// ============ AK 111.01 the walk doesn't stop ============
function shotAK({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  ground(scene, 0x86c060, 40);
  const road = box(1.6, 0.01, 80, new THREE.MeshStandardMaterial({ color: 0x5a5f66, roughness: 1 }), [0, 0.006, -30]); road.receiveShadow = true; scene.add(road);
  const dashes = []; for (let i = 0; i < 30; i++) { const d = box(0.08, 0.012, 0.6, new THREE.MeshStandardMaterial({ color: 0xffffff }), [0, 0.008, 2 - i * 2]); scene.add(d); dashes.push(d); }
  for (let i = 0; i < 12; i++) { const t = tree(2.6, i); t.position.set((i % 2 ? 1 : -1) * (2.0 + (i % 3) * 0.6), 0, 1 - i * 3.2); scene.add(t); }
  const r = ramon('gym'); scene.add(r.root);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const z = -t * 1.1;
      r.root.position.set(0.25, 0, z); r.root.rotation.y = Math.PI; walk(r, t, 1.1, { neck: [-0.05, 0, 0] });
      place(c, [lerp(0.9, 0.5, range(t, 0, 3.3)), 1.3, z - 2.4], [0.2, 1.5, z]);
      return { dof: dofAt(c, V(0.25, 1.5, z), 0.002) };
    },
  };
}
// ============ AL 114.28 focused on the belt ============
function shotAL({ makeStage }) {
  const scene = makeStage({ shadowSize: 3 });
  gymRoom(scene);
  const r = ramon('gym'); r.root.position.set(0, 0, 0); scene.add(r.root);
  const bb = barbell(1.5); scene.add(bb);
  const tr = trophy(1.3); tr.position.set(1.2, 1.15, -1.2); scene.add(tr);
  const ped = box(0.4, 1.1, 0.4, new THREE.MeshStandardMaterial({ color: 0x14245e, roughness: 0.5 }), [1.2, 0.55, -1.2]); scene.add(ped);
  const gl = glowSprite(0xffe08a, 1.4); gl.position.set(1.2, 1.5, -1.25); scene.add(gl);
  const s1 = sign('2027', { w: 0.6, h: 0.3, bg: '#f2c14e', fg: '#14245e', size: 230, frame: 0xc99a2a }); s1.position.set(1.2, 2.15, -1.2); scene.add(s1);
  const c = cam(38);
  return {
    scene, camera: c,
    update(t) {
      const sq = 0.5 - 0.5 * Math.cos(t * 2.6);
      r.setPose({ ...STAND, drop: -0.38 * sq, lHip: [-1.1 * sq, 0, 0.2], rHip: [-1.1 * sq, 0, -0.2], lKn: [1.9 * sq, 0, 0], rKn: [1.9 * sq, 0, 0], lAn: [-0.6 * sq, 0, -0.1], rAn: [-0.6 * sq, 0, 0.1], spine: [0.35 * sq, 0, 0], neck: [-0.35 * sq, 0, 0] });
      r.root.updateMatrixWorld(true);
      const bw = r.j.chest.localToWorld(V(0, 0.32, -0.12));
      bb.position.copy(bw);
      for (const s of [1, -1]) { const L = r.root.worldToLocal(bw.clone().add(V(s * 0.42, 0.0, 0.02))); arm(r, s > 0 ? 'l' : 'r', [L.x, L.y, L.z], [s * 0.8, 1.0, 0.2], [0, 1, 0]); }
      r.setMouth(0.5 * sq);
      gl.material.opacity = 0.6 + 0.2 * Math.sin(t * 3);
      const k = easeInOut(range(t, 0, 3));
      place(c, [lerp(-1.4, -1.1, k), lerp(1.1, 1.3, k), lerp(3.0, 2.7, k)], [0.4, 1.2, -0.4]);
      return { dof: dofAt(c, V(0, 1.3, 0), 0.0012), bloom: 0.7 };
    },
  };
}
// ============ AM 117.27 where you come from doesn't define... ============
function shotAM({ makeStage }) {
  const { scene, st, r } = stageShot(makeStage, { label: 'BRASIL', sub: null, color: '#009c3b', fg: '#ffdf00' });
  const fl = flag(1.6, 1.12); scene.add(fl);
  const pole = box(0.025, 1.9, 0.025, SILVER); scene.add(pole);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { neck: [-0.05, 0, 0], lHip: [0, 0, 0.12], rHip: [0, 0, -0.12] });
      arm(r, 'r', [-0.32, 2.0, 0.15], [-0.8, 1.6, -0.2], [0, 1, 0]);
      arm(r, 'l', [0.43, 1.66 + Math.sin(t * 9) * 0.006, 0.02], [0.95, 1.32, -0.25], [0, 0, 1]);
      r.setMouth(0.25);
      r.root.updateMatrixWorld(true);
      const hp = r.j.rWr.getWorldPosition(V(0, 0, 0));
      pole.position.set(hp.x, hp.y + 0.1, hp.z);
      fl.position.set(hp.x - 0.8, hp.y + 0.55, hp.z); fl.update(t);
      st.spot.intensity = 22;
      const a = lerp(0.5, -0.4, easeInOut(range(t, 0, 5.2)));
      place(c, [Math.sin(a) * 3.3, lerp(1.3, 1.7, range(t, 0, 5.2)), 0.3 + Math.cos(a) * 3.3], [-0.2, 1.95, 0.3]);
      return { dof: dofAt(c, V(0, 1.9, 0.3), 0.0012), bloom: 0.8 };
    },
  };
}
// ============ AN 122.46 comment and follow ============
function shotAN({ makeStage }) {
  const scene = makeStage({ shadowSize: 2.5 });
  const r = ramon('casual'); scene.add(r.root);
  const c = cam(36);
  return {
    scene, camera: c,
    update(t) {
      stand(r, t, { neck: [0, 0.1 * Math.sin(t * 1.3), 0] });
      if (t < 3.8) { const k = easeOut(range(t, 0.2, 0.6)); arm(r, 'r', [lerp(-0.25, -0.12, k), lerp(1.0, 1.48, k), lerp(0.1, 0.55, k)], [-0.6, 1.2, 0.1], [0, 0, 1]); arm(r, 'l', [0.21, 0.98, 0.03], [0.75, 1.15, -0.25], [-1, 0, 0]); }
      else { const k = easeOut(range(t, 3.8, 4.3)); arm(r, 'r', [-0.15, lerp(1.48, 0.95, k), lerp(0.55, 0.5, k)], [-0.6, 1.2, 0.1], [0, 0, 1]); arm(r, 'l', [0.3, 1.3 + Math.sin(t * 8) * 0.05 * k, 0.35], [0.7, 1.0, 0], [0, 0, 1]); }
      r.setMouth(0.3 + 0.3 * Math.abs(Math.sin(t * 6)));
      const k = easeInOut(range(t, 0, 8.4));
      place(c, [lerp(0.25, -0.15, k), lerp(1.55, 1.5, k), lerp(2.5, 2.2, k)], [0, 1.45, 0]);
      return { dof: dofAt(c, V(0, 1.5, 0.2), 0.003) };
    },
  };
}

const LIST = [
  [0.0, shotA], [3.15, shotB], [5.83, shotC], [10.62, shotD], [12.68, shotE], [15.67, shotF], [18.82, shotG], [22.44, shotH],
  [24.16, shotI], [27.18, shotJ], [31.27, shotK], [32.62, shotL], [36.74, shotM], [39.62, shotN], [43.78, shotO], [46.39, shotP],
  [49.67, shotQ], [51.96, shotR], [55.52, shotS], [58.34, shotT], [61.72, shotU], [64.39, shotV], [70.2, shotW], [73.27, shotX],
  [75.56, shotY], [78.55, shotZ], [80.45, shotAA], [83.04, shotAB], [86.4, shotAC], [89.79, shotAD], [92.2, shotAE], [93.5, shotAF],
  [97.49, shotAG], [101.14, shotAH], [104.44, shotAI], [107.42, shotAJ], [111.01, shotAK], [114.28, shotAL], [117.27, shotAM], [122.46, shotAN],
];
export const SHOTS = LIST.map(([start, build], i) => ({ start, end: i + 1 < LIST.length ? LIST[i + 1][0] : DURATION + 1, build }));
