/**
 * Workflow3DCanvas — Interactive 3D Workflow Visualization.
 * Inspired by Framer interactive node graphs.
 * Visualizes the workflow triggers and steps as 3D interconnected glowing nodes
 * with traveling photon light pulses and mouse camera orbit.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Workflow3DCanvas({ workflow, height = 220 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (REDUCED || !workflow) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch {
      return;
    }

    const setSize = () => {
      const w = container.clientWidth || 500;
      const h = height;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (container.clientWidth || 500) / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Lights
    const isLight = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light';
    const purpleLight = new THREE.PointLight(0x9A6CF4, isLight ? 4.5 : 5, 30);
    purpleLight.position.set(-5, 4, 3);
    const cyanLight = new THREE.PointLight(0x75E0D1, isLight ? 3.5 : 4, 30);
    cyanLight.position.set(5, -4, 3);
    const ambientLight = new THREE.AmbientLight(isLight ? 0xF8F9FE : 0x07040D, isLight ? 2.2 : 1.2);
    scene.add(purpleLight, cyanLight, ambientLight);

    const group = new THREE.Group();
    scene.add(group);

    // Node count: 1 trigger + action steps
    const wfActions = (workflow && (workflow.actions || workflow.a || workflow.steps)) || [];
    const stepsCount = wfActions.length;
    const totalNodes = 1 + stepsCount;
    const spacing = Math.min(3.2, 8.5 / Math.max(totalNodes, 1));
    const startX = -((totalNodes - 1) * spacing) / 2;

    const nodeMeshes = [];
    const curvePoints = [];

    // Trigger Node (Electric Violet)
    const triggerPos = new THREE.Vector3(startX, Math.sin(0) * 0.4, 0);
    curvePoints.push(triggerPos);

    const trigGeo = new THREE.IcosahedronGeometry(0.48, 1);
    const trigMat = new THREE.MeshPhongMaterial({
      color: 0x9A6CF4,
      emissive: 0x3E1878,
      specular: 0xC4B5FD,
      shininess: 90,
      flatShading: true,
    });
    const trigMesh = new THREE.Mesh(trigGeo, trigMat);
    trigMesh.position.copy(triggerPos);
    group.add(trigMesh);
    nodeMeshes.push(trigMesh);

    // Wireframe halo for trigger (Soft Lilac)
    const trigHaloGeo = new THREE.TorusGeometry(0.68, 0.02, 6, 28);
    const trigHaloMat = new THREE.MeshBasicMaterial({ color: 0xC4B5FD, transparent: true, opacity: 0.7 });
    const trigHalo = new THREE.Mesh(trigHaloGeo, trigHaloMat);
    trigHalo.position.copy(triggerPos);
    group.add(trigHalo);

    // Action Nodes (Turquoise / Lilac / Deep Purple alternates)
    for (let i = 0; i < stepsCount; i++) {
      const x = startX + (i + 1) * spacing;
      const y = Math.sin((i + 1) * 1.2) * 0.45;
      const pos = new THREE.Vector3(x, y, 0);
      curvePoints.push(pos);

      const isLast = i === stepsCount - 1;
      const color = isLast ? 0x75E0D1 : (i % 2 === 0 ? 0xC4B5FD : 0x7C3AED);
      const emissive = isLast ? 0x1A5750 : (i % 2 === 0 ? 0x483568 : 0x381068);

      const actGeo = new THREE.OctahedronGeometry(0.42);
      const actMat = new THREE.MeshPhongMaterial({
        color,
        emissive,
        specular: 0xffffff,
        shininess: 90,
        flatShading: true,
      });
      const actMesh = new THREE.Mesh(actGeo, actMat);
      actMesh.position.copy(pos);
      group.add(actMesh);
      nodeMeshes.push(actMesh);

      const actHaloGeo = new THREE.TorusGeometry(0.6, 0.018, 6, 24);
      const actHaloMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
      const actHalo = new THREE.Mesh(actHaloGeo, actHaloMat);
      actHalo.position.copy(pos);
      group.add(actHalo);
    }

    // Connectors — 3D Spline Curve connecting the nodes
    let curveMesh;
    if (curvePoints.length >= 2) {
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.04, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x140E26,
        transparent: true,
        opacity: 0.75,
      });
      curveMesh = new THREE.Mesh(tubeGeo, tubeMat);
      group.add(curveMesh);
    }

    // Traveling photons / light packets along the connections
    const PHOTON_COUNT = Math.max(3, stepsCount * 2);
    const pGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x75E0D1 });
    const photons = [];
    for (let i = 0; i < PHOTON_COUNT; i++) {
      const pm = new THREE.Mesh(pGeo, pMat);
      group.add(pm);
      photons.push({ mesh: pm, progress: i / PHOTON_COUNT });
    }

    let spline = curvePoints.length >= 2 ? new THREE.CatmullRomCurve3(curvePoints) : null;

    // Mouse Parallax Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.8;
      mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.6;
    };
    container.addEventListener('pointermove', onMove, { passive: true });
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(setSize);
      ro.observe(container);
    }
    window.addEventListener('resize', setSize);
    setSize();

    // Animation Loop
    let raf, t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.016;

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      group.rotation.y = mouse.x * 0.8 + Math.sin(t * 0.4) * 0.06;
      group.rotation.x = -mouse.y * 0.6 + Math.cos(t * 0.3) * 0.04;

      // Animate node rotations
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y = t * (0.8 + idx * 0.2);
        mesh.rotation.x = Math.sin(t * 1.2 + idx) * 0.3;
      });
      trigHalo.rotation.z = -t * 0.6;

      // Animate traveling photons
      if (spline) {
        photons.forEach(p => {
          p.progress = (p.progress + 0.006) % 1;
          const pos = spline.getPoint(p.progress);
          if (pos) p.mesh.position.copy(pos);
        });
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      container.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', setSize);
      try {
        if (renderer) renderer.dispose();
        if (scene) scene.clear();
      } catch {}
    };
  }, [workflow, height]);

  if (REDUCED) return null;

  return (
    <div
      ref={containerRef}
      className="wf-3d-visual-wrap"
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(121,80,242,0.1) 0%, var(--card) 85%)',
        border: '1px solid var(--line)',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 14,
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--cyan)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--cyan)',
            boxShadow: '0 0 8px var(--cyan)',
            display: 'inline-block',
          }}
        />
        Interactive 3D Pipeline
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }} />
    </div>
  );
}

