import * as THREE from 'three';
import { materials } from './materials.js';
import { glowSprite } from './props.js';

const shadow = o => { o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } }); return o; };
const std = (color, rough = 0.6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
const phys = (color, extra = {}) => new THREE.MeshPhysicalMaterial({ color, ...extra });
export const box = (w, h, d, mat, p = [0, 0, 0], r = [0, 0, 0]) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(...p); m.rotation.set(...r); return m;
};
const cyl = (rt, rb, h, mat, p = [0, 0, 0], seg = 32) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(...p); return m; };
const sph = (r, mat, p = [0, 0, 0], s = [1, 1, 1]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), mat); m.position.set(...p); m.scale.set(...s); return m; };

export const GOLD = phys(0xf2c14e, { metalness: 1, roughness: 0.22, clearcoat: 0.6 });
export const SILVER = phys(0xd8dce2, { metalness: 1, roughness: 0.25 });
export const BRONZE = phys(0xc27a3e, { metalness: 1, roughness: 0.3 });

// ---------- canvas text ----------
export function textTexture(lines, { w = 1024, h = 512, bg = '#ffffff', fg = '#111', font = 'Cap', size = 150, radius = 40, border = null, sub = null } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  if (bg) {
    x.fillStyle = bg; x.beginPath(); x.roundRect(0, 0, w, h, radius); x.fill();
    if (border) { x.strokeStyle = border; x.lineWidth = 18; x.beginPath(); x.roundRect(9, 9, w - 18, h - 18, radius - 6); x.stroke(); }
  }
  x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
  lines = Array.isArray(lines) ? lines : [lines];
  const lh = size * 1.08, y0 = h / 2 - (lines.length - 1) * lh / 2;
  lines.forEach((l, i) => {
    let s = size; x.font = `700 ${s}px ${font}, sans-serif`;
    while (x.measureText(l).width > w * 0.88 && s > 20) { s -= 4; x.font = `700 ${s}px ${font}, sans-serif`; }
    x.fillText(l, w / 2, y0 + i * lh);
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
// a board on a post or a flat panel: sign(text, {w, h}) plane facing +z
export function sign(lines, { w = 1.2, h = 0.6, post = 0, bg = '#ffffff', fg = '#16233a', size = 150, border = null, emissive = 0, frame = 0x6b4a2c } = {}) {
  const g = new THREE.Group();
  const tex = textTexture(lines, { w: 1024, h: Math.round(1024 * h / w), bg, fg, size, border });
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, transparent: !bg, emissive: emissive ? 0xffffff : 0, emissiveMap: emissive ? tex : null, emissiveIntensity: emissive });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); face.position.z = 0.016; g.add(face);
  if (bg) g.add(box(w + 0.04, h + 0.04, 0.03, std(frame, 0.7)));
  if (post) { g.position.y = 0; face.position.y += post; g.children[g.children.length - 1].position.y = post; g.add(cyl(0.025, 0.025, post, std(frame, 0.7), [0, post / 2, -0.01])); }
  g.face = face;
  return shadow(g);
}

// ---------- ground ----------
export function ground(scene, color = 0x7fbf5a, r = 14) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 64), std(color, 0.95));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.001; m.receiveShadow = true; scene.add(m); return m;
}
export function tree(h = 2.2, seed = 0) {
  const g = new THREE.Group();
  g.add(cyl(0.07, 0.1, h * 0.5, std(0x7a5233, 0.9), [0, h * 0.25, 0], 12));
  const lm = std([0x3f9a47, 0x4caf50, 0x2f8a3e][seed % 3], 0.85);
  for (let i = 0; i < 4; i++) {
    const a = i * 2.1 + seed;
    g.add(sph(h * (0.22 - i * 0.02), lm, [Math.cos(a) * h * 0.1, h * (0.58 + i * 0.09), Math.sin(a) * h * 0.1]));
  }
  return shadow(g);
}
export function palm(h = 2.6) {
  const g = new THREE.Group();
  const tm = std(0x9c7a4f, 0.9);
  for (let i = 0; i < 6; i++) g.add(cyl(0.06, 0.075, h / 6, tm, [Math.sin(i * 0.3) * 0.05 * i, h / 12 + i * h / 6, 0], 10));
  const lm = std(0x2e9e4a, 0.8, 0, { side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) {
    const l = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 1.1), lm);
    const piv = new THREE.Group(); piv.position.set(0.25, h, 0); piv.rotation.y = i / 7 * Math.PI * 2; g.add(piv);
    l.position.set(0, 0, 0.5); l.rotation.set(-Math.PI / 2 + 0.5, 0, 0); piv.add(l);
  }
  return shadow(g);
}

// ---------- park / calisthenics ----------
export function pullBar(h = 2.15, w = 1.3) {
  const g = new THREE.Group();
  const m = phys(0x3f6fb5, { metalness: 0.6, roughness: 0.35 });
  for (const s of [-1, 1]) g.add(cyl(0.035, 0.035, h, m, [s * w / 2, h / 2, 0], 16));
  const bar = cyl(0.018, 0.018, w, SILVER, [0, h - 0.04, 0], 16); bar.rotation.z = Math.PI / 2; g.add(bar);
  g.barY = h - 0.04;
  return shadow(g);
}

// ---------- gym ----------
export function dumbbell(len = 0.3) {
  const g = new THREE.Group(); const dm = std(0x2a2b2f, 0.45, 0.6);
  const h = cyl(0.016, 0.016, len, SILVER); h.rotation.z = Math.PI / 2; g.add(h);
  for (const s of [-1, 1]) { const p = cyl(0.055, 0.055, 0.06, dm, [s * len * 0.42, 0, 0], 6); p.rotation.z = Math.PI / 2; g.add(p); }
  return shadow(g);
}
export function barbell(len = 1.7) {
  const g = new THREE.Group();
  const b = cyl(0.014, 0.014, len, SILVER, [0, 0, 0], 16); b.rotation.z = Math.PI / 2; g.add(b);
  const pm = [std(0xd33b3b, 0.5), std(0x2f6fdb, 0.5)];
  for (const s of [-1, 1]) for (let i = 0; i < 2; i++) { const p = cyl(0.2 - i * 0.04, 0.2 - i * 0.04, 0.045, pm[i], [s * (len * 0.4 + i * 0.05), 0, 0], 36); p.rotation.z = Math.PI / 2; g.add(p); }
  return shadow(g);
}
export function gymRoom(scene, { door = true } = {}) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), std(0x2c2f36, 0.9)); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.002; floor.receiveShadow = true; scene.add(floor);
  const wall = box(10, 3.2, 0.1, std(0xe9edf2, 0.9), [0, 1.6, -2.4]); wall.receiveShadow = true; scene.add(wall);
  const stripe = box(10, 0.25, 0.02, std(0xf3b23a, 0.6), [0, 1.2, -2.34]); scene.add(stripe);
  // dumbbell rack
  const rack = new THREE.Group(); rack.position.set(-1.4, 0, -1.9);
  rack.add(box(1.6, 0.06, 0.4, std(0x40444c, 0.5, 0.5), [0, 0.7, 0])); rack.add(box(1.6, 0.06, 0.4, std(0x40444c, 0.5, 0.5), [0, 0.35, 0]));
  for (const s of [-1, 1]) rack.add(box(0.05, 0.75, 0.4, std(0x40444c, 0.5, 0.5), [s * 0.78, 0.37, 0]));
  for (let i = 0; i < 5; i++) for (const y of [0.78, 0.43]) { const d = dumbbell(0.26); d.rotation.y = Math.PI / 2; d.scale.setScalar(0.8); d.position.set(-0.6 + i * 0.3, y, 0); rack.add(d); }
  scene.add(shadow(rack));
  const bench = new THREE.Group(); bench.position.set(1.3, 0, -1.2);
  bench.add(box(0.35, 0.08, 1.2, std(0x1b1c20, 0.6), [0, 0.45, 0])); bench.add(box(0.08, 0.45, 0.08, SILVER, [0, 0.22, 0.45])); bench.add(box(0.08, 0.45, 0.08, SILVER, [0, 0.22, -0.45]));
  scene.add(shadow(bench));
  const s = sign('ACADEMIA', { w: 1.6, h: 0.42, bg: '#1f6fe0', fg: '#fff', size: 190 }); s.position.set(0.3, 2.45, -2.33); scene.add(s);
  return { floor, wall };
}

// ---------- food ----------
export function ricePlate() {
  const g = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.14, 0], [0.16, 0.012], [0.2, 0.03], [0.205, 0.034]].map(p => new THREE.Vector2(...p)), 48), phys(0xf6f6f2, { roughness: 0.15, clearcoat: 1 }));
  g.add(plate);
  const rm = std(0xf8f4ea, 0.9);
  for (let i = 0; i < 60; i++) { const a = i * 2.39, r = 0.09 * Math.sqrt(i / 60); g.add(sph(0.022, rm, [-0.04 + Math.cos(a) * r, 0.03 + 0.04 * (1 - r / 0.09), Math.sin(a) * r], [1, 0.8, 1])); }
  for (const [x, z] of [[0.08, 0.03], [0.04, -0.09]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.012, 24), std(0xffffff, 0.4)); w.position.set(x, 0.03, z); w.scale.z = 0.85; g.add(w);
    g.add(sph(0.028, phys(0xffb020, { roughness: 0.1, clearcoat: 1 }), [x + 0.005, 0.04, z], [1, 0.6, 1]));
  }
  return shadow(g);
}
export function table(w = 1.2, d = 0.7, h = 0.75, color = 0xb07a4a) {
  const g = new THREE.Group(); const m = std(color, 0.7);
  g.add(box(w, 0.05, d, m, [0, h, 0]));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(0.05, h, 0.05, m, [sx * (w / 2 - 0.05), h / 2, sz * (d / 2 - 0.05)]));
  g.top = h + 0.025;
  return shadow(g);
}

// ---------- trophy, medal, flag ----------
export function trophy(s = 1) {
  const g = new THREE.Group();
  const pts = [[0, 0], [0.09, 0], [0.09, 0.03], [0.06, 0.04], [0.06, 0.09], [0.03, 0.1], [0.02, 0.18], [0.03, 0.2], [0.1, 0.24], [0.13, 0.32], [0.14, 0.42], [0.135, 0.42], [0.12, 0.33], [0, 0.3]].map(p => new THREE.Vector2(...p));
  const cup = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), GOLD); cup.material.side = THREE.DoubleSide; g.add(cup);
  g.add(box(0.2, 0.08, 0.2, std(0x1b1b1f, 0.4, 0.2), [0, -0.04, 0]));
  for (const sx of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 10, 24, Math.PI * 1.2), GOLD); h.position.set(sx * 0.14, 0.34, 0); h.rotation.z = sx > 0 ? -1.2 : Math.PI + 1.2; g.add(h); }
  const st = sph(0.035, GOLD, [0, 0.47, 0]); g.add(st);
  g.scale.setScalar(s);
  return shadow(g);
}
export function medal(mat = GOLD) {
  const g = new THREE.Group();
  const d = cyl(0.05, 0.05, 0.01, mat); d.rotation.x = Math.PI / 2; g.add(d);
  for (const s of [-1, 1]) g.add(box(0.03, 0.16, 0.004, std(0x1e8a3a, 0.7), [s * 0.035, 0.08, -0.004], [0, 0, s * 0.4]));
  return shadow(g);
}
export function flagTexture() {
  const c = document.createElement('canvas'); c.width = 700; c.height = 490; const x = c.getContext('2d');
  x.fillStyle = '#009c3b'; x.fillRect(0, 0, 700, 490);
  x.fillStyle = '#ffdf00'; x.beginPath(); x.moveTo(350, 45); x.lineTo(655, 245); x.lineTo(350, 445); x.lineTo(45, 245); x.closePath(); x.fill();
  x.fillStyle = '#002776'; x.beginPath(); x.arc(350, 245, 122, 0, Math.PI * 2); x.fill();
  x.strokeStyle = '#fff'; x.lineWidth = 16; x.beginPath(); x.arc(350, 420, 220, -Math.PI * 0.73, -Math.PI * 0.27); x.stroke();
  x.fillStyle = '#fff'; for (let i = 0; i < 18; i++) { x.beginPath(); x.arc(270 + (i * 47) % 160, 240 + (i * 31) % 90, 4, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// waving flag: call .update(t)
export function flag(w = 1.2, h = 0.84) {
  const geo = new THREE.PlaneGeometry(w, h, 30, 12);
  const base = geo.attributes.position.array.slice();
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: flagTexture(), side: THREE.DoubleSide, roughness: 0.7 }));
  m.castShadow = true;
  m.update = (t) => {
    const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      const u = (base[i] + w / 2) / w;
      p[i + 2] = Math.sin(base[i] * 5 - t * 6) * 0.06 * u + Math.sin(base[i + 1] * 4 - t * 3) * 0.02 * u;
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
  };
  m.update(0);
  return m;
}

// ---------- stage ----------
export function stage(scene, opts = {}) {
  const { label = 'OLYMPIA', sub = null, color = '#0d1b3d', fg = '#f2c14e', lights = 4 } = opts;
  const g = new THREE.Group(); scene.add(g);
  const plat = box(6, 0.4, 3, std(0x15171c, 0.35, 0.3), [0, 0.2, -0.5]); g.add(plat);
  g.add(box(6.02, 0.04, 0.04, std(0xf2c14e, 0.3, 1, { emissive: 0x6a4a00, emissiveIntensity: 0.5 }), [0, 0.4, 1.0]));
  const back = box(6, 3.4, 0.1, std(0x0b1430, 0.6), [0, 2.1, -1.9]); g.add(back);
  const s = sign(sub ? [label, sub] : label, { w: 2.0, h: 0.8, bg: color, fg, size: sub ? 150 : 210, border: '#f2c14e', emissive: 0.35 }); s.position.set(0, opts.signY ?? 2.8, -1.83); g.add(s);
  const glows = [];
  for (let i = 0; i < lights; i++) {
    const x = -2.4 + i * 4.8 / Math.max(1, lights - 1);
    const can = cyl(0.08, 0.12, 0.2, std(0x222, 0.5, 0.5), [x, 3.8, 0.4]); g.add(can);
    const gl = glowSprite(0xfff2c8, 0.6); gl.position.set(x, 3.7, 0.5); scene.add(gl); glows.push(gl);
  }
  shadow(g); plat.receiveShadow = true;
  g.top = 0.4; g.glows = glows;
  const spot = new THREE.SpotLight(0xfff0d0, 0, 12, 0.35, 0.6, 1.2); spot.position.set(0, 5.5, 3); spot.target.position.set(0, 1.2, 0); spot.castShadow = true; scene.add(spot, spot.target);
  g.spot = spot;
  return g;
}
// confetti points: update(t)
export function confetti(n = 220, seed = 3, area = [3, 3, 2]) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const g = new THREE.Group();
  const cols = [0xf2c14e, 0x009c3b, 0xffdf00, 0x2f6fdb, 0xffffff];
  const geo = new THREE.PlaneGeometry(0.03, 0.05);
  const mats = cols.map(c => new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 0.5, metalness: c === 0xf2c14e ? 0.8 : 0 }));
  const ps = [];
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(geo, mats[i % mats.length]); g.add(m);
    ps.push({ m, x: (r() - 0.5) * area[0], y0: area[1] + r() * 2.5, z: (r() - 0.5) * area[2], sp: 0.4 + r() * 0.5, ph: r() * 6, rs: 2 + r() * 5 });
  }
  g.update = (t) => {
    for (const p of ps) {
      const y = p.y0 - t * p.sp * 1.6;
      p.m.visible = t > 0 && y > 0.02;
      p.m.position.set(p.x + Math.sin(t * 1.5 + p.ph) * 0.1, Math.max(0.02, y), p.z + Math.cos(t * 1.3 + p.ph) * 0.08);
      p.m.rotation.set(t * p.rs + p.ph, t * p.rs * 0.7, p.ph);
    }
  };
  return g;
}
export function podium(labels = ['2', '1', '3']) {
  const g = new THREE.Group();
  const hs = [0.5, 0.75, 0.35], cols = [0xd8dce2, 0xf2c14e, 0xc27a3e];
  const xs = [-0.75, 0, 0.75];
  g.tops = [];
  for (let i = 0; i < 3; i++) {
    g.add(box(0.72, hs[i], 0.7, std(0xf4f5f7, 0.5), [xs[i], hs[i] / 2, 0]));
    const s = sign(labels[i], { w: 0.32, h: 0.28, bg: '#' + cols[i].toString(16).padStart(6, '0'), fg: '#16233a', size: 360, frame: cols[i] });
    s.position.set(xs[i], hs[i] / 2, 0.36); s.scale.setScalar(0.95); g.add(s);
    g.tops.push(new THREE.Vector3(xs[i], hs[i], 0));
  }
  return shadow(g);
}

// ---------- buildings ----------
export function house(color = 0xf2d27a, roof = 0xc0563a) {
  const g = new THREE.Group();
  g.add(box(1.6, 1.1, 1.3, std(color, 0.85), [0, 0.55, 0]));
  const r = new THREE.Mesh(new THREE.ConeGeometry(1.25, 0.6, 4), std(roof, 0.8)); r.position.y = 1.4; r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 0.85); g.add(r);
  g.add(box(0.32, 0.62, 0.03, std(0x6b4a2c, 0.8), [0.35, 0.31, 0.66]));
  g.add(box(0.36, 0.3, 0.03, std(0x9fd3ff, 0.1, 0, { emissive: 0x204060, emissiveIntensity: 0.2 }), [-0.4, 0.66, 0.66]));
  return shadow(g);
}
export function mansion() {
  const g = new THREE.Group();
  const w = std(0xf7f7f4, 0.7), gl = phys(0x8fc8ff, { roughness: 0.05, metalness: 0.2, clearcoat: 1 });
  g.add(box(4.2, 1.4, 2, w, [0, 0.7, -1]));
  g.add(box(2.6, 1.2, 1.8, w, [-0.6, 2.0, -1.1]));
  g.add(box(4.4, 0.08, 2.2, std(0x30333a, 0.6), [0, 1.42, -1]));
  g.add(box(2.8, 0.08, 2, std(0x30333a, 0.6), [-0.6, 2.62, -1.1]));
  for (let i = 0; i < 4; i++) g.add(box(0.8, 1.1, 0.03, gl, [-1.5 + i, 0.65, 0.01]));
  for (let i = 0; i < 3; i++) g.add(box(0.7, 0.9, 0.03, gl, [-1.5 + i * 0.9, 2.0, -0.19]));
  const pool = box(3.2, 0.05, 1.3, phys(0x2fb8ff, { roughness: 0.05, clearcoat: 1, transmission: 0, emissive: 0x0a4a80, emissiveIntensity: 0.25 }), [0.2, 0.03, 1.3]); g.add(pool);
  g.add(box(3.5, 0.04, 1.6, std(0xe7dcc6, 0.8), [0.2, 0.01, 1.3]));
  return shadow(g);
}
export function skyline(n = 9, seed = 5) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const g = new THREE.Group();
  const cols = [0xb9c4d4, 0x9fb0c6, 0xd5dbe4, 0x8796ab];
  for (let i = 0; i < n; i++) {
    const h = 1.5 + r() * 3.5, w = 0.6 + r() * 0.6;
    const b = box(w, h, w, std(cols[i % 4], 0.6, 0.1), [(i - n / 2) * 0.85, h / 2, -r() * 1.5]);
    g.add(b);
    for (let y = 0.3; y < h - 0.2; y += 0.35) g.add(box(w * 0.8, 0.12, 0.01, phys(0x9fd3ff, { roughness: 0.1, emissive: 0x335577, emissiveIntensity: 0.3 }), [b.position.x, y, b.position.z + w / 2 + 0.006]));
  }
  return shadow(g);
}
export function suitcase(color = 0x2f6fdb) {
  const g = new THREE.Group();
  g.add(box(0.42, 0.55, 0.2, std(color, 0.5), [0, 0.32, 0]));
  g.add(box(0.12, 0.03, 0.03, std(0x222, 0.5), [0, 0.63, 0]));
  for (const sx of [-1, 1]) g.add(sph(0.025, std(0x111, 0.5), [sx * 0.16, 0.025, 0]));
  return shadow(g);
}
export function ball() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#111';
  for (let i = 0; i < 12; i++) { const px = (i * 61) % 256, py = 20 + (i * 37) % 90; x.beginPath(); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; x.lineTo(px + Math.cos(a) * 12, py + Math.sin(a) * 12); } x.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 32, 20), new THREE.MeshStandardMaterial({ map: t, roughness: 0.5 }));
  m.castShadow = true; return m;
}
export function rocket() {
  const g = new THREE.Group();
  const w = phys(0xf4f4f6, { roughness: 0.3, clearcoat: 0.5 }), red = std(0xe23b3b, 0.4);
  g.add(cyl(0.25, 0.25, 1.4, w, [0, 0.9, 0]));
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 32), red); nose.position.y = 1.9; g.add(nose);
  for (let i = 0; i < 3; i++) { const f = box(0.04, 0.4, 0.3, red, [0, 0.35, 0]); const p = new THREE.Group(); p.rotation.y = i / 3 * Math.PI * 2; f.position.z = 0.3; p.add(f); g.add(p); }
  const win = sph(0.09, phys(0x6ab8ff, { roughness: 0.05, clearcoat: 1 }), [0, 1.3, 0.22], [1, 1, 0.5]); g.add(win);
  g.add(cyl(0.18, 0.22, 0.15, std(0x444, 0.4, 0.8), [0, 0.13, 0]));
  return shadow(g);
}
export function globe() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const x = c.getContext('2d');
  x.fillStyle = '#2a7fd4'; x.fillRect(0, 0, 1024, 512);
  x.fillStyle = '#4cb65a';
  const blob = (cx, cy, rx, ry, rot) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); x.fill(); };
  blob(330, 300, 70, 110, 0.4); blob(300, 200, 50, 50, 0); blob(250, 140, 110, 60, 0.2); blob(540, 160, 60, 50, 0); blob(560, 280, 60, 100, 0.1); blob(740, 160, 160, 70, 0); blob(820, 330, 60, 40, 0);
  x.fillStyle = '#eef'; x.fillRect(0, 480, 1024, 32);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }));
  m.receiveShadow = m.castShadow = true; return m;
}
// a cartoon dinosaur (T-rex-ish) made of capsules
export function dino(color = 0x3faa4a) {
  const g = new THREE.Group(); const m = std(color, 0.6), w = std(0xffffff, 0.3), k = std(0x111111, 0.3);
  const body = sph(0.45, m, [0, 1.1, 0], [1.2, 1, 0.9]); body.rotation.z = 0.5; g.add(body);
  const head = sph(0.3, m, [0.55, 1.75, 0], [1.4, 0.9, 0.85]); g.add(head);
  const jaw = sph(0.22, m, [0.62, 1.58, 0], [1.4, 0.5, 0.75]); g.add(jaw);
  for (let i = 0; i < 6; i++) g.add(new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.07, 6), w)).position.set(0.42 + i * 0.07, 1.64, 0.14 - (i % 2) * 0.28);
  for (const s of [-1, 1]) { g.add(sph(0.06, w, [0.72, 1.86, s * 0.17])); g.add(sph(0.032, k, [0.75, 1.87, s * 0.21])); }
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 20), m); tail.position.set(-0.75, 0.8, 0); tail.rotation.z = 1.9; g.add(tail);
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.45, 6, 12), m); leg.position.set(0, 0.4, s * 0.25); g.add(leg);
    g.add(sph(0.12, m, [0.08, 0.05, s * 0.25], [1.6, 0.5, 1]));
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.15, 4, 8), m); arm.position.set(0.4, 1.2, s * 0.25); arm.rotation.z = -0.9; g.add(arm);
  }
  for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 6), std(0xf2c14e, 0.5)); sp.position.set(-0.2 + i * 0.12 - 0.3, 1.5 - i * 0.02 + (i < 2 ? -0.15 : 0), 0); g.add(sp); }
  g.jaw = jaw;
  return shadow(g);
}
export function cardProp(text = 'PRO CARD') {
  const s = sign([text, 'IFBB'], { w: 0.5, h: 0.32, bg: '#f2c14e', fg: '#16233a', size: 170, frame: 0xc99a2a, border: '#16233a' });
  return s;
}
export function phone() {
  const g = new THREE.Group();
  g.add(box(0.075, 0.15, 0.01, std(0x111, 0.3, 0.3)));
  g.add(box(0.068, 0.138, 0.002, std(0x88c8ff, 0.2, 0, { emissive: 0x4488cc, emissiveIntensity: 0.6 }), [0, 0, 0.006]));
  return shadow(g);
}
// stack of banknotes
export function cash() {
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) g.add(box(0.16, 0.008, 0.07, std(0x6fbf73, 0.7), [0, i * 0.009, 0], [0, i * 0.15, 0]));
  return shadow(g);
}
export function heart(color = 0xe23b5a) {
  const s = new THREE.Shape(); s.moveTo(0, -0.1); s.bezierCurveTo(-0.14, 0.0, -0.1, 0.12, 0, 0.06); s.bezierCurveTo(0.1, 0.12, 0.14, 0.0, 0, -0.1);
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }), std(color, 0.3, 0, { emissive: color, emissiveIntensity: 0.3 }));
  return m;
}
