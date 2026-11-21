// Props and sets for the Ramon Dino short: park, town, gym, stage, trophies, signs, flag, rocket, dinosaur...
import * as THREE from 'three';
import { materials } from './materials.js';
import { glowSprite } from './props.js';
import { rng } from './textures.js';

export const shadow = o => { o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); return o; };
export const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...o });
export function mesh(geo, mat, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) {
  const m = new THREE.Mesh(geo, mat); m.position.set(...p); m.rotation.set(...r); m.scale.set(...s); return m;
}
export const box = (w, h, d, mat, p, r) => mesh(new THREE.BoxGeometry(w, h, d), mat, p, r);
export const cyl = (rt, rb, h, mat, p, r, seg = 24) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, p, r);
export const ball = (rad, mat, p, s) => mesh(new THREE.SphereGeometry(rad, 32, 24), mat, p, [0, 0, 0], s);

let G = null;
export function mats() {
  if (G) return G;
  G = {
    gold: new THREE.MeshPhysicalMaterial({ color: 0xffbf3a, metalness: 1, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
    silver: new THREE.MeshPhysicalMaterial({ color: 0xd8dde4, metalness: 1, roughness: 0.22, clearcoat: 0.5 }),
    bronze: new THREE.MeshPhysicalMaterial({ color: 0xc2763a, metalness: 1, roughness: 0.28, clearcoat: 0.4 }),
    steel: new THREE.MeshPhysicalMaterial({ color: 0xc8ccd2, metalness: 1, roughness: 0.3 }),
    black: std(0x141416, { roughness: 0.5 }),
    gloss: new THREE.MeshPhysicalMaterial({ color: 0x0b0b10, roughness: 0.18, metalness: 0.2, clearcoat: 1 }),
    white: std(0xf4f2ee, { roughness: 0.45 }),
    grass: std(0x5fae3e, { roughness: 0.95 }),
    dirt: std(0xb7835a, { roughness: 1 }),
    path: std(0xd7c4a3, { roughness: 1 }),
    trunk: std(0x7a4f2e, { roughness: 0.9 }),
    leaf: [std(0x3f9a3a, { flatShading: true, roughness: 0.85 }), std(0x2f8a40, { flatShading: true, roughness: 0.85 }), std(0x5bb345, { flatShading: true, roughness: 0.85 })],
    paintBlue: new THREE.MeshPhysicalMaterial({ color: 0x2a6fd6, roughness: 0.35, clearcoat: 0.6 }),
    paintYellow: new THREE.MeshPhysicalMaterial({ color: 0xf5c518, roughness: 0.35, clearcoat: 0.6 }),
    paintRed: new THREE.MeshPhysicalMaterial({ color: 0xe0352b, roughness: 0.35, clearcoat: 0.6 }),
    rubber: std(0x1b1b1d, { roughness: 0.6 }),
    leather: std(0x6b3f22, { roughness: 0.55 }),
    paper: std(0xfbf6ea, { roughness: 0.8 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x23405f, roughness: 0.05, metalness: 0.3, clearcoat: 1 }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x2fb4e8, roughness: 0.05, transmission: 0, clearcoat: 1, emissive: 0x0a5f8a, emissiveIntensity: 0.4 }),
    green: std(0x2fbf5a, { roughness: 0.5 }),
    dino: new THREE.MeshPhysicalMaterial({ color: 0x46b04a, roughness: 0.5, clearcoat: 0.3 }),
    dinoBelly: std(0xc9e27a, { roughness: 0.6 }),
  };
  return G;
}

// ---------- text on a plane (canvas) ----------
export function textCanvas(lines, { w = 1024, h = 256, bg = '#ffffff', fg = '#141414', weight = 900, radius = 30, border = null, size = 0.8 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (bg) {
    g.fillStyle = bg; g.beginPath(); g.roundRect(0, 0, w, h, radius); g.fill();
    if (border) { g.lineWidth = 14; g.strokeStyle = border; g.beginPath(); g.roundRect(7, 7, w - 14, h - 14, radius); g.stroke(); }
  }
  lines = Array.isArray(lines) ? lines : [lines];
  const lh = h / lines.length;
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, i) => {
    let px = lh * size;
    g.font = `${weight} ${px}px Sign, sans-serif`;
    while (g.measureText(t).width > w * 0.88 && px > 8) { px -= 2; g.font = `${weight} ${px}px Sign, sans-serif`; }
    g.fillText(t, w / 2, lh * (i + 0.5) + px * 0.04);
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
export function sign(lines, width = 1, height = 0.25, o = {}) {
  const tex = textCanvas(lines, { w: 1024, h: Math.round(1024 * height / width), ...o });
  const mat = o.glow
    ? new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: THREE.DoubleSide })
    : new THREE.MeshStandardMaterial({ map: tex, transparent: !o.bg, roughness: 0.6, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: o.emit ?? 0.25 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  return m;
}
// a sign on posts
export function postSign(lines, w = 1.6, h = 0.5, o = {}) {
  const g = new THREE.Group(); const M = mats();
  const s = sign(lines, w, h, { bg: o.bg || '#1f6b3a', fg: o.fg || '#ffffff', border: o.border || '#f4f0e0', radius: 24 });
  s.position.y = o.y ?? 1.6; g.add(s);
  const back = box(w + 0.04, h + 0.04, 0.03, std(0x3a3a3a), [0, s.position.y, -0.02]); g.add(back);
  for (const x of [-w * 0.38, w * 0.38]) g.add(cyl(0.03, 0.03, s.position.y, M.steel, [x, s.position.y / 2, -0.05]));
  return shadow(g);
}

// ---------- nature / town ----------
export function groundDisc(mat, r = 40, y = 0.0) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 64), mat); m.rotation.x = -Math.PI / 2; m.position.y = y; m.receiveShadow = true; return m;
}
export function tree(seed = 1, s = 1) {
  const r = rng(seed); const M = mats(); const g = new THREE.Group();
  g.add(cyl(0.08 * s, 0.12 * s, 1.6 * s, M.trunk, [0, 0.8 * s, 0], [0, 0, 0], 8));
  const n = 3 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const rad = (0.55 + r() * 0.4) * s;
    const m = mesh(new THREE.IcosahedronGeometry(rad, 1), M.leaf[i % 3], [(r() - 0.5) * 0.7 * s, (1.8 + r() * 0.8) * s, (r() - 0.5) * 0.7 * s]);
    g.add(m);
  }
  return shadow(g);
}
export function house(color = 0xf2c94c, roofColor = 0xc0492f, seed = 1) {
  const g = new THREE.Group(); const M = mats();
  const wall = std(color, { roughness: 0.85 });
  g.add(box(2.2, 1.7, 1.8, wall, [0, 0.85, 0]));
  const roof = mesh(new THREE.ConeGeometry(1.75, 0.9, 4), std(roofColor, { roughness: 0.7, flatShading: true }), [0, 2.15, 0], [0, Math.PI / 4, 0], [1.05, 1, 0.85]);
  g.add(roof);
  g.add(box(0.45, 0.95, 0.05, std(0x6b4024), [-0.45, 0.48, 0.91]));
  for (const x of [0.45]) { g.add(box(0.55, 0.45, 0.05, M.glass, [x, 1.05, 0.91])); g.add(box(0.62, 0.06, 0.07, M.white, [x, 0.8, 0.92])); }
  return shadow(g);
}
export function skyline(seed = 3, n = 26) {
  const r = rng(seed); const g = new THREE.Group();
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#7d8ea6'; x.fillRect(0, 0, 64, 128);
  for (let i = 0; i < 4; i++) for (let k = 0; k < 10; k++) { x.fillStyle = r() > 0.6 ? '#ffe6a0' : '#2f3e55'; x.fillRect(4 + i * 15, 4 + k * 12.4, 10, 8); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  for (let i = 0; i < n; i++) {
    const w = 0.8 + r() * 1.2, h = 2 + r() * 7, d = 0.8 + r() * 1.2;
    const tt = t.clone(); tt.repeat.set(Math.max(1, Math.round(w)), Math.max(1, Math.round(h / 2))); tt.needsUpdate = true;
    const m = box(w, h, d, new THREE.MeshStandardMaterial({ map: tt, roughness: 0.6, color: new THREE.Color().setHSL(0.6, 0.1, 0.65 + r() * 0.3) }), [(i - n / 2) * 1.25 + r() * 0.4, h / 2, -r() * 4]);
    g.add(m);
  }
  return shadow(g);
}
export function mansion() {
  const g = new THREE.Group(); const M = mats();
  const wall = std(0xf3f1ec, { roughness: 0.5 });
  g.add(box(7, 2.4, 3.2, wall, [0, 1.2, 0]));
  g.add(box(4.6, 2.0, 2.6, wall, [0.9, 3.4, -0.2]));
  g.add(box(7.3, 0.12, 3.5, std(0x3a3a3e), [0, 2.45, 0]));
  g.add(box(5.0, 0.12, 3.0, std(0x3a3a3e), [0.9, 4.45, -0.2]));
  for (let i = 0; i < 4; i++) g.add(box(1.3, 1.8, 0.05, M.glass, [-2.6 + i * 1.75, 1.15, 1.61]));
  for (let i = 0; i < 3; i++) g.add(box(1.2, 1.4, 0.05, M.glass, [-0.6 + i * 1.5, 3.4, 1.11]));
  g.add(box(4.2, 0.25, 2.2, std(0xd9d2c3), [0, 0.12, 3.1]));
  const pool = box(3.8, 0.05, 1.8, M.water, [0, 0.26, 3.1]); g.add(pool);
  g.add(box(0.06, 1.1, 0.06, M.steel, [-2.2, 0.55, 4.6]));
  return shadow(g);
}

// ---------- outdoor gym ----------
export function pullupBar(w = 1.3, h = 2.35) {
  const g = new THREE.Group(); const M = mats();
  for (const x of [-w / 2, w / 2]) g.add(cyl(0.045, 0.05, h, M.paintBlue, [x, h / 2, 0]));
  g.add(mesh(new THREE.CylinderGeometry(0.022, 0.022, w + 0.1, 16), M.steel, [0, h - 0.06, 0], [0, 0, Math.PI / 2]));
  g.userData.barY = h - 0.06;
  return shadow(g);
}
export function parallelBars(len = 1.6, gap = 0.56, h = 1.2) {
  const g = new THREE.Group(); const M = mats();
  for (const x of [-gap / 2, gap / 2]) {
    g.add(mesh(new THREE.CylinderGeometry(0.022, 0.022, len, 16), M.steel, [x, h, 0], [Math.PI / 2, 0, 0]));
    for (const z of [-len / 2 + 0.1, len / 2 - 0.1]) g.add(cyl(0.04, 0.045, h, M.paintYellow, [x, h / 2, z]));
  }
  g.userData.h = h; g.userData.gap = gap;
  return shadow(g);
}
export function bench() {
  const g = new THREE.Group(); const M = mats();
  for (let i = 0; i < 3; i++) g.add(box(1.4, 0.04, 0.12, std(0x8a5a32), [0, 0.45, -0.14 + i * 0.14]));
  g.add(box(1.4, 0.04, 0.12, std(0x8a5a32), [0, 0.78, -0.26], [0.25, 0, 0]));
  for (const x of [-0.6, 0.6]) { g.add(box(0.05, 0.45, 0.4, M.black, [x, 0.22, 0])); g.add(box(0.05, 0.4, 0.05, M.black, [x, 0.65, -0.25])); }
  return shadow(g);
}
export function dumbbell(s = 1) {
  const g = new THREE.Group(); const M = mats();
  g.add(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.34, 12), M.steel, [0, 0, 0], [0, 0, Math.PI / 2]));
  for (const x of [-0.13, 0.13]) g.add(mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.07, 24), M.rubber, [x, 0, 0], [0, 0, Math.PI / 2]));
  g.scale.setScalar(s);
  return shadow(g);
}
export function soccerBall(r = 0.11) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#f6f6f6'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#151515';
  const R = rng(4);
  for (let i = 0; i < 12; i++) { const px = (i % 6) * 43 + (i > 5 ? 21 : 0), py = i > 5 ? 90 : 38; x.beginPath(); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; x.lineTo(px + Math.cos(a) * 12, py + Math.sin(a) * 12 * 0.7); } x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return shadow(ball(r, new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.4, clearcoat: 0.5 })));
}

// ---------- food ----------
export function riceAndEggs() {
  const g = new THREE.Group(); const M = mats();
  const plateP = [new THREE.Vector2(0, 0), new THREE.Vector2(0.1, 0), new THREE.Vector2(0.13, 0.012), new THREE.Vector2(0.15, 0.022), new THREE.Vector2(0.152, 0.026), new THREE.Vector2(0.11, 0.014), new THREE.Vector2(0, 0.012)];
  g.add(mesh(new THREE.LatheGeometry(plateP, 48), new THREE.MeshPhysicalMaterial({ color: 0xf8f8f8, roughness: 0.15, clearcoat: 1, side: THREE.DoubleSide })));
  const r = rng(12);
  const grain = new THREE.CapsuleGeometry(0.0028, 0.007, 2, 6);
  const rice = new THREE.InstancedMesh(grain, std(0xfffdf6, { roughness: 0.5 }), 900);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < 900; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.075;
    const x = -0.035 + Math.cos(a) * d, z = 0.01 + Math.sin(a) * d * 0.9;
    const y = 0.014 + 0.045 * Math.max(0, 1 - (d / 0.075) ** 2) * r() ** 0.3;
    e.set(r() * 6, r() * 6, r() * 6); q.setFromEuler(e);
    m4.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1)); rice.setMatrixAt(i, m4);
  }
  g.add(rice);
  const eggW = std(0xffffff, { roughness: 0.35 });
  const yolk = new THREE.MeshPhysicalMaterial({ color: 0xffa51a, roughness: 0.15, clearcoat: 1, emissive: 0x552200, emissiveIntensity: 0.25 });
  for (const [x, z, s] of [[0.06, -0.035, 1], [0.05, 0.06, 0.9]]) {
    const w = mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.008, 9), eggW, [x, 0.018, z], [0, r() * 3, 0], [s * (1 + r() * 0.2), 1, s]);
    g.add(w);
    g.add(mesh(new THREE.SphereGeometry(0.026, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), yolk, [x + 0.004, 0.02, z], [0, 0, 0], [1, 0.7, 1]));
  }
  const fork = new THREE.Group();
  fork.add(box(0.012, 0.004, 0.14, M.steel, [0, 0, 0]));
  for (let i = 0; i < 4; i++) fork.add(box(0.003, 0.003, 0.04, M.steel, [-0.0055 + i * 0.0037, 0, 0.088]));
  fork.position.set(0.17, 0.004, 0.0); fork.rotation.y = 0.2; g.add(fork);
  return shadow(g);
}
export function table(w = 1.2, d = 0.8, h = 0.75) {
  const g = new THREE.Group(); const M = materials();
  g.add(box(w, 0.05, d, M.wood, [0, h, 0]));
  for (const x of [-w / 2 + 0.06, w / 2 - 0.06]) for (const z of [-d / 2 + 0.06, d / 2 - 0.06]) g.add(box(0.05, h, 0.05, M.woodDark, [x, h / 2, z]));
  g.userData.h = h + 0.025;
  return shadow(g);
}

// ---------- stage / awards ----------
export function trophy(s = 1, M = mats().gold) {
  const g = new THREE.Group();
  const prof = [[0, 0], [0.045, 0], [0.05, 0.01], [0.02, 0.03], [0.014, 0.09], [0.03, 0.11], [0.08, 0.14], [0.105, 0.2], [0.11, 0.28], [0.115, 0.3], [0.1, 0.3], [0.095, 0.2], [0, 0.17]].map(([x, y]) => new THREE.Vector2(x, y));
  const cup = mesh(new THREE.LatheGeometry(prof, 48), M); cup.material = M; g.add(cup);
  cup.position.y = 0.12;
  for (const sx of [-1, 1]) {
    const h = mesh(new THREE.TorusGeometry(0.06, 0.012, 10, 24, Math.PI * 1.2), M, [sx * 0.11, 0.35, 0], [0, 0, sx > 0 ? -Math.PI * 0.6 : Math.PI * 0.4]);
    g.add(h);
  }
  g.add(box(0.16, 0.05, 0.16, mats().black, [0, 0.025, 0]));
  g.add(box(0.13, 0.07, 0.13, mats().gloss, [0, 0.085, 0]));
  g.add(box(0.08, 0.035, 0.002, M, [0, 0.085, 0.066]));
  g.scale.setScalar(s);
  return shadow(g);
}
export function medal(kind = 'silver', label = '2º') {
  const g = new THREE.Group(); const M = mats();
  const m = M[kind];
  g.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 40), m, [0, 0, 0], [Math.PI / 2, 0, 0]));
  const face = sign(label, 0.08, 0.08, { bg: null, fg: '#2a1a05', size: 0.7, emit: 0 });
  face.position.z = 0.0065; g.add(face);
  for (const sx of [-1, 1]) g.add(box(0.03, 0.17, 0.004, std(0x1d8a3e), [sx * 0.03, 0.12, -0.003], [0, 0, -sx * 0.32]));
  return shadow(g);
}
export function podium(labels = ['2º', '1º', '3º']) {
  const g = new THREE.Group(); const M = mats();
  const hs = [0.45, 0.65, 0.3];
  const tops = [];
  labels.forEach((l, i) => {
    const x = (i - 1) * 0.95, h = hs[i];
    g.add(box(0.92, h, 0.8, new THREE.MeshPhysicalMaterial({ color: 0xf1f1f1, roughness: 0.3, clearcoat: 0.5 }), [x, h / 2, 0]));
    const s = sign(l, 0.4, 0.22, { bg: null, fg: '#1d1d22', size: 0.9, emit: 0 }); s.position.set(x, h - 0.15, 0.402); g.add(s);
    tops.push(new THREE.Vector3(x, h, 0));
  });
  g.userData.tops = tops;
  return shadow(g);
}
export function belt() {
  const g = new THREE.Group(); const M = mats();
  g.add(box(1.2, 0.15, 0.02, mats().leather.clone().setValues ? std(0x161616, { roughness: 0.4 }) : M.black, [0, 0, -0.012]));
  const plate = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 48), M.gold, [0, 0, 0], [Math.PI / 2, 0, 0], [1.25, 1, 0.9]); g.add(plate);
  g.add(mesh(new THREE.TorusGeometry(0.19, 0.012, 10, 48), M.gold, [0, 0, 0.016], [0, 0, 0], [1.25, 0.9, 1]));
  const star = sign('★', 0.22, 0.22, { bg: null, fg: '#8a5a00', size: 0.9, emit: 0 }); star.position.z = 0.017; g.add(star);
  for (const x of [-0.42, 0.42]) { g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.025, 32), M.gold, [x, 0, 0], [Math.PI / 2, 0, 0], [1, 1, 1.1])); }
  return shadow(g);
}
export function flagTexture() {
  const c = document.createElement('canvas'); c.width = 700; c.height = 490; const x = c.getContext('2d');
  x.fillStyle = '#009c3b'; x.fillRect(0, 0, 700, 490);
  x.fillStyle = '#ffdf00'; x.beginPath(); x.moveTo(350, 42); x.lineTo(658, 245); x.lineTo(350, 448); x.lineTo(42, 245); x.closePath(); x.fill();
  x.fillStyle = '#002776'; x.beginPath(); x.arc(350, 245, 122, 0, Math.PI * 2); x.fill();
  x.save(); x.beginPath(); x.arc(350, 245, 122, 0, Math.PI * 2); x.clip();
  x.strokeStyle = '#ffffff'; x.lineWidth = 22; x.beginPath(); x.arc(330, 470, 270, -Math.PI * 0.82, -Math.PI * 0.18); x.stroke();
  const r = rng(8); x.fillStyle = '#ffffff'; for (let i = 0; i < 22; i++) { x.beginPath(); x.arc(250 + r() * 200, 255 + r() * 100, 2 + r() * 2.5, 0, 7); x.fill(); }
  x.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
// waving flag; group.update(t). Pole at local x=0, cloth extends to +x
export function flag(w = 1.2, poleH = 2.6) {
  const g = new THREE.Group(); const M = mats();
  g.add(cyl(0.02, 0.025, poleH, M.steel, [0, poleH / 2, 0]));
  g.add(ball(0.04, M.gold, [0, poleH + 0.02, 0]));
  const h = w * 0.7;
  const geo = new THREE.PlaneGeometry(w, h, 40, 20); geo.translate(w / 2, 0, 0);
  const base = geo.attributes.position.array.slice();
  const cloth = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: flagTexture(), side: THREE.DoubleSide, roughness: 0.75 }));
  cloth.position.y = poleH - h / 2 - 0.02; cloth.castShadow = true; g.add(cloth);
  g.update = (t, amp = 1) => {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], y = base[i * 3 + 1];
      const k = x / w;
      p.setZ(i, Math.sin(x * 5 - t * 6 + y * 1.5) * 0.07 * k * amp + Math.sin(x * 9 - t * 9) * 0.02 * k * amp);
      p.setY(i, y - k * k * 0.05 * amp);
    }
    p.needsUpdate = true; geo.computeVertexNormals();
  };
  g.update(0);
  return shadow(g);
}
export function stageSet({ wall = true, color = 0x3a1a6a } = {}) {
  const g = new THREE.Group(); const M = mats();
  const floor = groundDisc(new THREE.MeshPhysicalMaterial({ color: 0x0c0c12, roughness: 0.22, metalness: 0.3, clearcoat: 1 }), 30, 0.0005); g.add(floor);
  const edge = box(9, 0.04, 0.04, std(0xffcc55, { emissive: 0xffaa33, emissiveIntensity: 2 }), [0, 0.02, 1.6]); g.add(edge);
  if (wall) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d');
    const gr = x.createRadialGradient(256, 300, 20, 256, 300, 360); gr.addColorStop(0, '#' + new THREE.Color(color).getHexString()); gr.addColorStop(1, '#05040a');
    x.fillStyle = gr; x.fillRect(0, 0, 512, 512);
    x.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < 512; i += 16) x.fillRect(i, 0, 2, 512);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const w = mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), [0, 4.5, -3.5]); g.add(w);
  }
  return g;
}
// volumetric-looking beam from a point down to a target
export function beam(color = 0xfff1d0, top = [0, 6, 0], bottom = [0, 0, 0], r = 0.9, op = 0.16) {
  const a = new THREE.Vector3(...top), b = new THREE.Vector3(...bottom);
  const L = a.distanceTo(b);
  const geo = new THREE.CylinderGeometry(0.06, r, L, 32, 1, true);
  const mat = new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(color) }, op: { value: op } },
    vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = uv.y; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 c; uniform float op; varying float vY; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(abs(dot(vN, vV)), 1.5); gl_FragColor = vec4(c, op * f * (0.25 + 0.75*vY)); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().sub(b).normalize());
  m.userData.op = op;
  return m;
}
// deterministic confetti: update(t)
export function confetti(n = 300, colors = [0x009c3b, 0xffdf00, 0xffffff, 0x2a6fd6], area = [4, 3, 3], y0 = 4, seed = 5) {
  const r = rng(seed);
  const geo = new THREE.PlaneGeometry(0.03, 0.045);
  const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.5, metalness: 0.3, emissive: 0xffffff, emissiveIntensity: 0.15 });
  const im = new THREE.InstancedMesh(geo, mat, n); im.frustumCulled = false;
  const P = [];
  for (let i = 0; i < n; i++) {
    P.push({ x: (r() - 0.5) * area[0], z: (r() - 0.5) * area[2], y: y0 + r() * area[1], v: 0.35 + r() * 0.35, s: 2 + r() * 6, ph: r() * 6, a: r() * 6 });
    im.setColorAt(i, new THREE.Color(colors[i % colors.length]));
  }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1), pv = new THREE.Vector3();
  im.update = (t) => {
    for (let i = 0; i < n; i++) {
      const p = P[i]; const tt = Math.max(0, t);
      pv.set(p.x + Math.sin(tt * 1.3 + p.ph) * 0.15, p.y - tt * p.v * 1.4, p.z + Math.cos(tt * 1.1 + p.ph) * 0.15);
      e.set(tt * p.s + p.a, tt * p.s * 0.7, p.ph); q.setFromEuler(e);
      m4.compose(pv, q, t < 0 ? new THREE.Vector3(0, 0, 0) : one); im.setMatrixAt(i, m4);
    }
    im.instanceMatrix.needsUpdate = true;
  };
  im.update(-1);
  return im;
}
// simple silhouette crowd
export function crowd(n = 24, seed = 2, w = 6, rows = 3) {
  const r = rng(seed); const g = new THREE.Group();
  const cols = [0x2a2a35, 0x35303a, 0x1f2a38, 0x3a2f2a, 0x2c3a2f];
  const people = [];
  for (let i = 0; i < n; i++) {
    const p = new THREE.Group(); const m = std(cols[i % cols.length], { roughness: 0.9 });
    const sk = std([0x8b5a3c, 0xc58c63, 0xe0b090, 0x6b4028][i % 4], { roughness: 0.8 });
    p.add(mesh(new THREE.CapsuleGeometry(0.18, 0.5, 6, 12), m, [0, 0.95, 0]));
    p.add(ball(0.12, sk, [0, 1.45, 0]));
    const arm = mesh(new THREE.CapsuleGeometry(0.04, 0.3, 4, 8), m, [0.2, 1.4, 0], [0, 0, -0.3]); p.add(arm); p.userData.arm = arm;
    const row = i % rows;
    p.position.set((r() - 0.5) * w, 0, -row * 0.7 + (r() - 0.5) * 0.2);
    p.userData.ph = r() * 6; p.userData.up = r() > 0.4;
    g.add(p); people.push(p);
  }
  g.update = (t, cheer = 0) => {
    for (const p of people) {
      p.position.y = cheer * Math.max(0, Math.sin(t * 7 + p.userData.ph)) * 0.08;
      p.userData.arm.rotation.z = p.userData.up ? -0.3 - cheer * 2.4 + Math.sin(t * 8 + p.userData.ph) * 0.2 * cheer : -0.3;
      p.userData.arm.position.y = p.userData.up ? 1.4 + cheer * 0.25 : 1.4;
    }
  };
  return shadow(g);
}

// ---------- story props ----------
export function wallet() {
  const g = new THREE.Group(); const M = mats();
  const l = box(0.11, 0.09, 0.008, M.leather, [-0.055, 0, 0]); const r = box(0.11, 0.09, 0.008, M.leather, [0.055, 0, 0]);
  const L = new THREE.Group(); L.add(l); L.rotation.y = 0.35; g.add(L);
  const R = new THREE.Group(); R.add(r); R.rotation.y = -0.35; g.add(R);
  const inside = std(0x4a2a14); L.add(box(0.1, 0.08, 0.002, inside, [-0.055, 0, 0.005])); R.add(box(0.1, 0.08, 0.002, inside, [0.055, 0, 0.005]));
  return shadow(g);
}
export function envelope(label = 'CONVITE') {
  const g = new THREE.Group();
  const paper = std(0xfaf3e0, { roughness: 0.7 });
  g.add(box(0.3, 0.2, 0.006, paper));
  const shp = new THREE.Shape(); shp.moveTo(-0.15, 0.1); shp.lineTo(0.15, 0.1); shp.lineTo(0, -0.02); shp.closePath();
  g.add(mesh(new THREE.ShapeGeometry(shp), std(0xf0e4c4, { side: THREE.DoubleSide }), [0, 0, 0.0035]));
  g.add(ball(0.022, std(0xc0282c, { roughness: 0.4 }), [0, -0.015, 0.006], [1, 1, 0.25]));
  const s = sign(label, 0.22, 0.05, { bg: null, fg: '#7a1d10', emit: 0 }); s.position.set(0, -0.065, 0.004); g.add(s);
  return shadow(g);
}
export function tub(color = 0xe0352b, label = 'WHEY') {
  const g = new THREE.Group();
  const tex = textCanvas([label], { w: 512, h: 256, bg: '#' + new THREE.Color(color).getHexString(), fg: '#ffffff', radius: 0 });
  const side = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4 });
  const capM = std(0x18181a, { roughness: 0.4 });
  g.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 32), [side, capM, capM], [0, 0.1, 0], [0, -Math.PI / 2, 0]));
  g.add(cyl(0.083, 0.083, 0.04, capM, [0, 0.22, 0]));
  return shadow(g);
}
export function raffleSheet() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 700; const x = c.getContext('2d');
  x.fillStyle = '#fffdf5'; x.fillRect(0, 0, 512, 700);
  x.fillStyle = '#d62b2b'; x.font = '900 92px Sign, sans-serif'; x.textAlign = 'center'; x.fillText('RIFA', 256, 100);
  x.font = '700 26px Sign, sans-serif'; x.fillStyle = '#333'; x.fillText('AJUDE O RAMON A COMPETIR!', 256, 145);
  x.strokeStyle = '#999'; x.lineWidth = 2; x.font = '700 22px Sign, sans-serif';
  const R = rng(3);
  for (let i = 0; i < 6; i++) for (let k = 0; k < 8; k++) {
    const px = 36 + i * 74, py = 180 + k * 62; x.strokeRect(px, py, 66, 54);
    x.fillStyle = '#555'; x.fillText(String(i * 8 + k + 1).padStart(2, '0'), px + 33, py + 24);
    if (R() > 0.45) { x.fillStyle = '#1d5fd1'; x.font = 'italic 700 16px sans-serif'; x.fillText('pago', px + 33, py + 45); x.font = '700 22px Sign, sans-serif'; }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return shadow(mesh(new THREE.PlaneGeometry(0.3, 0.41), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: 0.8 })));
}
export function airplane() {
  const g = new THREE.Group(); const M = mats();
  const body = std(0xf6f7fa, { roughness: 0.35, metalness: 0.2 });
  g.add(mesh(new THREE.CapsuleGeometry(0.35, 3.2, 12, 24), body, [0, 0, 0], [0, 0, Math.PI / 2]));
  g.add(mesh(new THREE.BoxGeometry(1.1, 0.06, 4.2), body, [0.1, -0.1, 0]));
  g.add(mesh(new THREE.BoxGeometry(0.5, 0.05, 1.4), body, [-1.75, 0.05, 0]));
  g.add(mesh(new THREE.BoxGeometry(0.6, 0.9, 0.06), std(0x1d8a3e), [-1.75, 0.5, 0], [0, 0, -0.3]));
  for (const z of [-0.9, 0.9]) g.add(mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.55, 20), M.steel, [0.25, -0.33, z], [0, 0, Math.PI / 2]));
  for (let i = 0; i < 9; i++) for (const z of [-0.33, 0.33]) g.add(ball(0.05, M.glass, [1.2 - i * 0.28, 0.1, z], [1, 1, 0.4]));
  g.add(box(3.4, 0.05, 0.71, std(0xffdf00), [0, -0.12, 0]));
  return shadow(g);
}
export function rocket() {
  const g = new THREE.Group(); const M = mats();
  const body = new THREE.MeshPhysicalMaterial({ color: 0xf5f5f5, roughness: 0.3, clearcoat: 0.6 });
  g.add(cyl(0.32, 0.36, 1.8, body, [0, 1.3, 0], [0, 0, 0], 40));
  g.add(mesh(new THREE.ConeGeometry(0.32, 0.8, 40), M.paintRed, [0, 2.6, 0]));
  g.add(cyl(0.38, 0.3, 0.3, M.steel, [0, 0.3, 0], [0, 0, 0], 40));
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2;
    const f = box(0.04, 0.6, 0.45, M.paintRed, [Math.sin(a) * 0.4, 0.55, Math.cos(a) * 0.4], [0, a, 0]); g.add(f);
  }
  g.add(mesh(new THREE.TorusGeometry(0.14, 0.03, 10, 32), M.steel, [0, 1.75, 0.33]));
  g.add(ball(0.13, M.glass, [0, 1.75, 0.3], [1, 1, 0.5]));
  g.add(box(0.5, 0.18, 0.02, std(0x009c3b), [0, 1.2, 0.35]));
  const flame = new THREE.Group(); flame.position.y = 0.15; g.add(flame);
  const fm = new THREE.MeshBasicMaterial({ color: 0xffa030, transparent: true, opacity: 0.9, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false });
  const cone = mesh(new THREE.ConeGeometry(0.26, 1.2, 24, 1, true), fm, [0, -0.6, 0], [Math.PI, 0, 0]); flame.add(cone);
  const core = mesh(new THREE.ConeGeometry(0.14, 0.7, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff4c0, transparent: true, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false }), [0, -0.35, 0], [Math.PI, 0, 0]); flame.add(core);
  const gl = glowSprite(0xff9a40, 1.6); gl.position.y = -0.4; flame.add(gl);
  g.flame = flame; g.flameCone = cone;
  return shadow(g);
}
// smoke puffs, deterministic: update(t, origin)
export function smoke(n = 40, seed = 9) {
  const r = rng(seed); const g = new THREE.Group();
  const P = [];
  for (let i = 0; i < n; i++) {
    const m = ball(0.3, std(0xeeeeee, { roughness: 1, transparent: true }), [0, 0, 0]);
    m.material = m.material.clone(); g.add(m);
    P.push({ m, t0: i * 0.07, dx: (r() - 0.5) * 2, dz: (r() - 0.5) * 2, s: 0.6 + r() * 0.8 });
  }
  g.update = (t, origin) => {
    for (const p of P) {
      const a = t - p.t0;
      if (a < 0) { p.m.visible = false; continue; }
      p.m.visible = true;
      p.m.position.set(origin.x + p.dx * a * 1.2, Math.max(0.2, origin.y - a * 0.5) + a * 0.15, origin.z + p.dz * a * 1.2);
      p.m.scale.setScalar(p.s * (0.4 + a * 1.1));
      p.m.material.opacity = Math.max(0, 1 - a / 2.6);
    }
  };
  return g;
}
export function dino() {
  const g = new THREE.Group(); const M = mats();
  const body = new THREE.Group(); body.position.y = 1.2; g.add(body);
  body.add(ball(0.55, M.dino, [0, 0, 0], [0.8, 1, 0.75]));
  body.add(ball(0.42, M.dinoBelly, [0, -0.05, 0.18], [0.7, 0.9, 0.6]));
  const tail = mesh(new THREE.ConeGeometry(0.32, 1.4, 20), M.dino, [0, -0.35, -0.75], [-1.9, 0, 0]); body.add(tail);
  const neck = new THREE.Group(); neck.position.set(0, 0.45, 0.15); body.add(neck);
  const head = new THREE.Group(); head.position.set(0, 0.25, 0.1); neck.add(head);
  head.add(ball(0.3, M.dino, [0, 0, 0.12], [0.85, 0.8, 1.2]));
  const jaw = new THREE.Group(); jaw.position.set(0, -0.08, 0.05); head.add(jaw);
  jaw.add(ball(0.24, M.dino, [0, -0.06, 0.18], [0.8, 0.4, 1.15]));
  jaw.add(ball(0.2, std(0xb8323a), [0, -0.02, 0.2], [0.7, 0.2, 1.0]));
  const toothM = std(0xffffff, { roughness: 0.3 });
  for (let i = 0; i < 6; i++) { const a = (i / 5 - 0.5) * 1.6; head.add(mesh(new THREE.ConeGeometry(0.025, 0.07, 6), toothM, [Math.sin(a) * 0.2, -0.12, 0.2 + Math.cos(a) * 0.2], [Math.PI, 0, 0])); }
  for (const s of [-1, 1]) {
    head.add(ball(0.07, std(0xffffff, { roughness: 0.2 }), [s * 0.14, 0.13, 0.22]));
    head.add(ball(0.035, std(0x111111, { roughness: 0.1 }), [s * 0.15, 0.14, 0.28]));
    head.add(ball(0.08, M.dino, [s * 0.14, 0.2, 0.18], [1, 0.4, 1]));
    const arm = mesh(new THREE.CapsuleGeometry(0.05, 0.22, 4, 10), M.dino, [s * 0.32, 0.15, 0.32], [-0.9, 0, s * 0.3]); body.add(arm);
    const leg = new THREE.Group(); leg.position.set(s * 0.25, -0.35, 0); body.add(leg);
    leg.add(mesh(new THREE.CapsuleGeometry(0.17, 0.35, 6, 12), M.dino, [0, -0.25, 0]));
    leg.add(mesh(new THREE.CapsuleGeometry(0.1, 0.25, 6, 12), M.dino, [0, -0.6, 0.05]));
    leg.add(ball(0.13, M.dino, [0, -0.8, 0.15], [1, 0.5, 1.6]));
  }
  for (let i = 0; i < 5; i++) body.add(mesh(new THREE.ConeGeometry(0.06, 0.14, 4), std(0xf5a623, { flatShading: true }), [0, 0.5 - i * 0.2, -0.38 - i * 0.12], [-0.4 - i * 0.2, 0, 0]));
  g.userData = { body, neck, head, jaw };
  g.roar = (v) => { jaw.rotation.x = v * 0.6; head.rotation.x = -v * 0.35; };
  return shadow(g);
}
export function globe(seed = 6) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const x = c.getContext('2d');
  x.fillStyle = '#1f66c9'; x.fillRect(0, 0, 1024, 512);
  const r = rng(seed);
  const blob = (cx, cy, s, n) => { for (let i = 0; i < n; i++) { x.beginPath(); x.ellipse(cx + (r() - 0.5) * s, cy + (r() - 0.5) * s * 0.8, s * (0.15 + r() * 0.25), s * (0.12 + r() * 0.2), r() * 3, 0, 7); x.fill(); } };
  x.fillStyle = '#3fae4a';
  blob(300, 330, 140, 14); blob(260, 150, 170, 16); blob(560, 170, 150, 14); blob(580, 320, 130, 12); blob(800, 160, 220, 18); blob(860, 360, 90, 8);
  x.fillStyle = '#f0f4f8'; x.fillRect(0, 0, 1024, 22); x.fillRect(0, 490, 1024, 22);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return mesh(new THREE.SphereGeometry(1, 64, 48), new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.5, clearcoat: 0.6 }));
}
export function tv() {
  const g = new THREE.Group(); const M = mats();
  g.add(box(0.6, 0.38, 0.05, M.black, [0, 0.25, 0]));
  g.add(box(0.56, 0.34, 0.01, std(0x223355, { roughness: 0.1 }), [0, 0.25, 0.026]));
  g.add(box(0.2, 0.05, 0.12, M.black, [0, 0.025, 0]));
  g.add(box(0.03, 0.08, 0.03, M.black, [0, 0.08, 0]));
  return shadow(g);
}
export function sneaker(color = 0xe0352b) {
  const g = new THREE.Group();
  g.add(ball(0.06, std(color, { roughness: 0.5 }), [0, 0.05, 0], [0.9, 0.8, 2.2]));
  g.add(box(0.11, 0.03, 0.27, std(0xf6f6f6), [0, 0.015, 0]));
  return shadow(g);
}
