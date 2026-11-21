// Shared cast, poses, sets and camera helpers for the Ramon Dino short.
import * as THREE from 'three';
import { makePerson } from './human.js';
import { glowSprite } from './props.js';
import * as P from './props2.js';
import { lerp, smooth, easeInOut, range, V, place, shake, ikArm } from './anim.js';
import { rng } from './textures.js';

// ---------- cast ----------
const SKIN = 0x8b5a3c;
const R = { skin: SKIN, hair: 0x15100c };
export const CAST = {
  kid: { ...R, shirt: 0xf2c230, pants: 0x2f5fb0, bottom: 'shorts', beard: false, headScale: 1.22, shoes: 0x2a2a2a },
  capoeira: { ...R, shirt: 0xf6f6f2, pants: 0xf6f6f2, top: 'tee', bottom: 'pants', beard: false, headScale: 1.2, shoes: null },
  teen: { ...R, shirt: 0x1e8a4c, pants: 0x30303a, bottom: 'shorts', beard: false, headScale: 1.06, shoes: 0xf0f0f0 },
  cali: { ...R, top: 'tank', shirt: 0xf3f3f3, pants: 0x1c1c20, bottom: 'shorts', bulk: 0.22, stubble: 0.3, shoes: 0x202020 },
  young: { ...R, top: 'tee', shirt: 0xd94b2b, pants: 0x2b3a55, bottom: 'pants', bulk: 0.45, shoes: 0xf2f2f2 },
  amateur: { ...R, top: 'none', bottom: 'trunks', pants: 0x1b4fc4, bulk: 0.6, oil: true },
  pro: { ...R, skin: 0x7a4527, top: 'none', bottom: 'trunks', pants: 0x111111, bulk: 1, oil: true },
  casual: { ...R, shirt: 0x161618, pants: 0x2b3a55, bulk: 0.9, shoes: 0xf2f2f2 },
  gymPro: { ...R, top: 'tank', shirt: 0x161618, pants: 0x2a2a30, bottom: 'shorts', bulk: 0.95, shoes: 0x202020 },
  wife: { skin: 0xc8916a, hair: 0x2a1a10, top: 'dress', shirt: 0xe0507a, bottom: 'bare', beard: false, longHair: true, shoes: 0xf2d6c4 },
  son: { skin: 0xa36b47, hair: 0x15100c, shirt: 0x2a6fd6, pants: 0xf0f0f0, bottom: 'shorts', beard: false, headScale: 1.3, shoes: 0xf2f2f2 },
  daughter: { skin: 0xa36b47, hair: 0x1a1210, top: 'dress', shirt: 0xf5c518, bottom: 'bare', beard: false, longHair: true, headScale: 1.3, shoes: 0xf2f2f2 },
  rival: { skin: 0x3b3f4c, hair: 0x22242a, top: 'none', bottom: 'trunks', pants: 0x15161a, bulk: 0.9, beard: false },
  guyA: { skin: 0xe0b090, hair: 0x6b4423, shirt: 0x3b7dd8, pants: 0x3a3a40, shoes: 0x202020, quiff: true },
  guyB: { skin: 0x6b4028, hair: 0x111111, shirt: 0xf09a2a, pants: 0x2b3a55, shoes: 0xf0f0f0, beard: false },
  team1: { skin: 0xc58c63, hair: 0x2a1a10, shirt: 0x1d8a3e, pants: 0x202020, shoes: 0xf0f0f0, quiff: true },
  team2: { skin: 0x6b4028, hair: 0x111111, shirt: 0x1d8a3e, pants: 0x202020, shoes: 0xf0f0f0, beard: false },
  team3: { skin: 0xe8c0a0, hair: 0x4a2e1a, shirt: 0x1d8a3e, pants: 0x202020, shoes: 0xf0f0f0, top: 'dress', bottom: 'bare', longHair: true, beard: false },
};
export function person(key, scale = 1, extra = {}) {
  const h = makePerson({ ...CAST[key], ...extra });
  h.root.scale.setScalar(scale);
  return h;
}

// ---------- poses ----------
export const idle = (t, k = 1) => Math.sin(t * 1.6) * 0.012 * k;
export const STAND = {
  lSh: [0.05, 0, 0.16], rSh: [0.05, 0, -0.16], lEl: [-0.25, 0, 0], rEl: [-0.25, 0, 0],
  lHip: [0, 0, 0.07], rHip: [0, 0, -0.07], lAn: [0, 0, -0.07], rAn: [0, 0, 0.07],
};
export const BIG = { lSh: [0.05, 0, 0.42], rSh: [0.05, 0, -0.42], lEl: [-0.35, 0, 0], rEl: [-0.35, 0, 0], lHip: [0, 0, 0.12], rHip: [0, 0, -0.12], lAn: [0, 0, -0.12], rAn: [0, 0, 0.12] };
export const DBI = { ...BIG, lSh: [-0.15, 0, 1.45], lEl: [0, 0, 1.95], rSh: [-0.15, 0, -1.45], rEl: [0, 0, -1.95], chest: [-0.05, 0, 0] };
export const CHEER = { ...BIG, lSh: [-0.1, 0, 2.65], lEl: [0, 0, 0.35], rSh: [-0.1, 0, -2.65], rEl: [0, 0, -0.35], neck: [-0.15, 0, 0] };
export const SIT = { ...STAND, drop: -0.47, lHip: [-1.55, 0, 0.1], rHip: [-1.55, 0, -0.1], lKn: [1.5, 0, 0], rKn: [1.5, 0, 0], lAn: [0.05, 0, 0], rAn: [0.05, 0, 0], spine: [0.12, 0, 0] };
export function pose(h, t, base, extra = {}) {
  const p = { ...base, ...extra };
  const c = p.chest || [0, 0, 0];
  p.chest = [c[0] + idle(t), c[1], c[2]];
  h.setPose(p);
}
export function blend(a, b, k) {
  const o = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (key === 'drop') { o.drop = lerp(a.drop || 0, b.drop || 0, k); continue; }
    const va = a[key] || [0, 0, 0], vb = b[key] || [0, 0, 0]; o[key] = [0, 1, 2].map(i => lerp(va[i], vb[i], k));
  }
  return o;
}
export function walk(t, f = 1.7) {
  const ph = t * f * Math.PI * 2, s = Math.sin(ph);
  return {
    lHip: [-0.45 * s, 0, 0.05], rHip: [0.45 * s, 0, -0.05],
    lKn: [0.1 + 0.55 * Math.max(0, Math.sin(ph - 1.2)), 0, 0], rKn: [0.1 + 0.55 * Math.max(0, -Math.sin(ph - 1.2)), 0, 0],
    lSh: [0.35 * s, 0, 0.14], rSh: [-0.35 * s, 0, -0.14], lEl: [-0.35, 0, 0], rEl: [-0.35, 0, 0],
    drop: -0.025 * Math.abs(Math.cos(ph)), chest: [0.04, 0, 0],
  };
}
export function handsOnHips(h, w = 0.21) {
  for (const [s, k] of [[1, 'l'], [-1, 'r']]) {
    h.root.updateMatrixWorld(true);
    const T = h.root.localToWorld(V(s * w, 0.98, 0.03));
    const Pp = h.root.localToWorld(V(s * 0.75, 1.15, -0.25));
    const hint = h.root.localToWorld(V(-s, 0, 0)).sub(h.root.getWorldPosition(V(0, 0, 0)));
    ikArm(h, k, T, Pp, hint);
  }
}
// two hands to world targets
export function grab(h, lT, rT, { lPole, rPole, hint = V(0, 0, 1) } = {}) {
  h.root.updateMatrixWorld(true);
  const o = h.root.getWorldPosition(V(0, 0, 0));
  const out = (s) => h.root.localToWorld(V(s * 1.2, 0.9, 0.4));
  if (lT) ikArm(h, 'l', lT, lPole || out(1), hint);
  if (rT) ikArm(h, 'r', rT, rPole || out(-1), hint);
}

// ---------- camera ----------
export function move(c, t, dur, p0, p1, l0, l1, { amp = 0.5, seed = 0, ease = easeInOut } = {}) {
  const k = ease(range(t, 0, dur));
  const s = shake(t, amp, seed);
  const p = p0.map((v, i) => lerp(v, p1[i], k)), l = l0.map((v, i) => lerp(v, l1[i], k));
  place(c, [p[0] + s[0], p[1] + s[1], p[2] + s[2]], l);
  return c.position.distanceTo(V(...l));
}
export function orbit(c, t, dur, { center = [0, 1.2, 0], r0 = 3, r1 = 3, a0 = 0, a1 = 0.3, y0 = 1.4, y1 = 1.4, look = null, amp = 0.4 } = {}) {
  const k = easeInOut(range(t, 0, dur));
  const a = lerp(a0, a1, k), r = lerp(r0, r1, k), s = shake(t, amp);
  place(c, [center[0] + Math.sin(a) * r + s[0], lerp(y0, y1, k) + s[1], center[2] + Math.cos(a) * r], look || center);
  return r;
}
export const dofAt = (c, p, ap = 0.002, mb = 0.008) => ({ focus: c.position.distanceTo(p), aperture: ap, maxblur: mb });

// ---------- sets ----------
export const SKY = {
  night: [0x06050c, 0x100b22, 0x1c1236, 0x07060c],
  dusk: [0x2d3d78, 0x7a6a9a, 0xf0a87a, 0x6a5060],
  indoor: [0x5e6470, 0x7d8592, 0x9aa2ae, 0x4a4e55],
  space: [0x050816, 0x0d1640, 0x2a2470, 0x050816],
};
export function park(scene, { seed = 1, trees = 14, ground = 'grass', radius = [4, 13] } = {}) {
  const M = P.mats();
  scene.add(P.groundDisc(ground === 'grass' ? M.grass : M.dirt, 60));
  const r = rng(seed);
  for (let i = 0; i < trees; i++) {
    const a = -Math.PI * 0.85 + r() * Math.PI * 1.7, d = radius[0] + r() * (radius[1] - radius[0]);
    const tr = P.tree(seed * 10 + i, 0.9 + r() * 0.7); tr.position.set(Math.sin(a) * d, 0, -Math.cos(a) * d); scene.add(tr);
  }
}
export function stage(makeStage, { wall = 0x3a1a6a, beams = true, sun = 2.2, spot = 3.5, rimColor = 0xb58cff, shadowSize = 3, sunDir = [-1.5, 6, 4] } = {}) {
  const scene = makeStage({ sky: SKY.night, ground: [0x000000, 0.55], hemi: 0.22, rim: 2.6, sun, sunDir, env: 0.6, shadowSize });
  scene.userData.rim.color.set(rimColor);
  scene.add(P.stageSet({ color: wall }));
  const bs = [];
  if (beams) for (const [x, col] of [[-2.4, 0xfff0d0], [0, 0xffe2a8], [2.4, 0xfff0d0]]) { const b = P.beam(col, [x, 6.5, -1.8], [x * 0.25, 0, 0.2], 0.85, 0.11); scene.add(b); bs.push(b); }
  const sp = new THREE.SpotLight(0xfff0dd, spot, 0, 0.42, 0.7, 0); sp.position.set(0.5, 7, 2.5); sp.target.position.set(0, 1, 0); scene.add(sp, sp.target);
  return { scene, beams: bs, spot: sp };
}
export function gym(makeStage, { sign = true } = {}) {
  const scene = makeStage({ sky: SKY.indoor, ground: [0x000000, 0.45], hemi: 0.6, sun: 2.0, rim: 1.0 });
  const M = P.mats();
  scene.add(P.groundDisc(P.std(0x2a2b2f, { roughness: 0.9 }), 30));
  scene.add(P.box(12, 4, 0.1, P.std(0xb8bcc4, { roughness: 0.8 }), [0, 2, -2.2]));
  scene.add(P.box(5, 2.0, 0.02, M.glass, [0, 1.3, -2.14]));
  const rack = new THREE.Group();
  rack.add(P.box(2.6, 0.05, 0.4, M.black, [0, 0.45, 0]), P.box(2.6, 0.05, 0.4, M.black, [0, 0.8, 0]));
  for (let i = 0; i < 7; i++) { for (const y of [0.52, 0.87]) { const d = P.dumbbell(0.55 + i * 0.05); d.rotation.y = Math.PI / 2; d.position.set(-1.1 + i * 0.37, y, 0); rack.add(d); } }
  rack.position.set(1.4, 0, -1.7); scene.add(P.shadow(rack));
  if (sign) { const s = P.sign('ACADEMIA', 2.2, 0.45, { bg: '#d62b2b', fg: '#ffffff', radius: 20 }); s.position.set(-1.6, 3.0, -2.1); scene.add(s); }
  return scene;
}
export function stars(n = 600, seed = 3) {
  const r = rng(seed); const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const v = V(r() - 0.5, r() * 0.9 - 0.1, r() - 0.5).normalize().multiplyScalar(60); pos.set([v.x, v.y, v.z], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true, toneMapped: false }));
  p.frustumCulled = false; return p;
}
// heart sprite
let _heart;
export function heart(size = 0.12) {
  if (!_heart) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#ff3d6e'; x.beginPath(); x.moveTo(64, 112); x.bezierCurveTo(10, 70, 6, 30, 36, 22); x.bezierCurveTo(52, 18, 62, 28, 64, 40);
    x.bezierCurveTo(66, 28, 76, 18, 92, 22); x.bezierCurveTo(122, 30, 118, 70, 64, 112); x.fill();
    _heart = new THREE.CanvasTexture(c); _heart.colorSpace = THREE.SRGBColorSpace;
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: _heart, transparent: true, toneMapped: false, depthWrite: false }));
  s.scale.setScalar(size); return s;
}
export function popIn(t, t0, d = 0.35) {   // 0 -> overshoot -> 1
  const k = range(t, t0, t0 + d);
  if (k <= 0) return 0.0001;
  return 1 + Math.sin(k * Math.PI) * 0.25 * (1 - k) + (k < 1 ? (smooth(k) - 1) : 0);
}
export { P, glowSprite };
