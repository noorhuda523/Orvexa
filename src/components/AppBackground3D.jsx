/**
 * AppBackground3D
 * Premium Three.js floating geometry backdrop for the Nexora app shell.
 * Uses the already-installed `three` package — no extra deps.
 * Respects prefers-reduced-motion and pauses when hidden.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function AppBackground3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (REDUCED) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ─── Renderer ─────────────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    /* ─── Scene / Camera ───────────────────────────────────────────────── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    /* ─── Lights ───────────────────────────────────────────────────────── */
    const purpleLight = new THREE.PointLight(0x7950F2, 3, 20);
    purpleLight.position.set(-4, 4, 4);
    const cyanLight = new THREE.PointLight(0x19C7E8, 2, 20);
    cyanLight.position.set(4, -3, 3);
    const ambient = new THREE.AmbientLight(0x0D1733, 0.6);
    scene.add(purpleLight, cyanLight, ambient);

    /* ─── Materials ────────────────────────────────────────────────────── */
    const wirePurple = new THREE.MeshBasicMaterial({ color: 0x7950F2, wireframe: true, transparent: true, opacity: 0.12 });
    const wireCyan   = new THREE.MeshBasicMaterial({ color: 0x19C7E8, wireframe: true, transparent: true, opacity: 0.09 });
    const glassP = new THREE.MeshPhongMaterial({ color: 0x7950F2, transparent: true, opacity: 0.04, shininess: 80, side: THREE.DoubleSide });
    const glassC = new THREE.MeshPhongMaterial({ color: 0x19C7E8, transparent: true, opacity: 0.04, shininess: 80, side: THREE.DoubleSide });

    /* ─── Geometry factory ─────────────────────────────────────────────── */
    const makeShape = (geo, mat, x, y, z, scale = 1) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.scale.setScalar(scale);
      scene.add(m);
      return m;
    };

    const objects = [
      // Icosahedrons (solid + wire dual-layer)
      makeShape(new THREE.IcosahedronGeometry(1.1, 1),  glassP,   -4.5,  2.5,  -2,   1),
      makeShape(new THREE.IcosahedronGeometry(1.1, 1),  wirePurple, -4.5, 2.5, -2, 1),
      makeShape(new THREE.IcosahedronGeometry(0.75, 1), glassC,    4.2, -2.0, -1.5, 1),
      makeShape(new THREE.IcosahedronGeometry(0.75, 1), wireCyan,  4.2, -2.0, -1.5, 1),
      // Octahedrons
      makeShape(new THREE.OctahedronGeometry(0.65),    wireCyan,   -2.5, -2.8, -0.5, 1),
      makeShape(new THREE.OctahedronGeometry(0.5),     wirePurple,  2.8,  2.5, -1,   1),
      // Torus
      makeShape(new THREE.TorusGeometry(0.8, 0.06, 6, 22), wireCyan,   3.5,  1.5, -2, 1),
      makeShape(new THREE.TorusGeometry(0.6, 0.05, 6, 22), wirePurple,-3.0, -1.5, -1, 1),
      // Rings
      makeShape(new THREE.TorusGeometry(1.4, 0.02, 4, 40), wirePurple, 0, 0, -3.5, 1),
    ];

    /* ─── Particles ────────────────────────────────────────────────────── */
    const count = 120;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.022, color: 0x7950F2, transparent: true, opacity: 0.45 });
    scene.add(new THREE.Points(pGeo, pMat));

    /* ─── Mouse influence ──────────────────────────────────────────────── */
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    /* ─── Float seeds ──────────────────────────────────────────────────── */
    const seeds = objects.map(() => ({
      rx: (Math.random() - 0.5) * 0.004,
      ry: (Math.random() - 0.5) * 0.006,
      floatAmp: 0.12 + Math.random() * 0.1,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
    }));

    /* ─── Resize handler ───────────────────────────────────────────────── */
    const onResize = () => {
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    /* ─── RAF loop ─────────────────────────────────────────────────────── */
    let raf, t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.016;

      objects.forEach((obj, i) => {
        const s = seeds[i];
        obj.rotation.x += s.rx;
        obj.rotation.y += s.ry;
        obj.position.y += Math.sin(t * s.floatSpeed + s.floatOffset) * s.floatAmp * 0.008;
      });

      // Gentle camera drift following mouse
      camera.position.x += (mouse.x - camera.position.x) * 0.025;
      camera.position.y += (-mouse.y - camera.position.y) * 0.025;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    tick();

    /* ─── Cleanup ──────────────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  if (REDUCED) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65,
      }}
    />
  );
}
