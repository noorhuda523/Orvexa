/**
 * Dashboard3DOrb — Signature Interactive 3D floating object on the main dashboard.
 * Inspired by Framer interactive 3D hero widgets.
 * Reacts to pointer hover with acceleration, dynamic refraction, and orbital rotation.
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Dashboard3DOrb({ size = 110 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (REDUCED) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const w = size;
    const h = size;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.z = 4.2;

    // Lighting
    const isLight = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light';
    const pointLight1 = new THREE.PointLight(isLight ? 0x7C3AED : 0x9A6CF4, isLight ? 4.5 : 5, 20);
    pointLight1.position.set(-3, 3, 3);
    const pointLight2 = new THREE.PointLight(isLight ? 0x75E0D1 : 0x75E0D1, isLight ? 3.5 : 4, 20);
    pointLight2.position.set(3, -2, 2);
    const ambientLight = new THREE.AmbientLight(isLight ? 0xF8F9FE : 0x07040D, isLight ? 2.5 : 1.5);
    scene.add(pointLight1, pointLight2, ambientLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x9A6CF4,
      emissive: isLight ? 0x5B21B6 : 0x3B1578,
      specular: 0xC4B5FD,
      shininess: 100,
      transparent: true,
      opacity: isLight ? 0.8 : 0.85,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Outer wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x75E0D1,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    rootGroup.add(wireMesh);

    // Orbiting satellite ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.025, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xC4B5FD,
      transparent: true,
      opacity: 0.65,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    rootGroup.add(ringMesh);

    // Secondary ring
    const ring2Geo = new THREE.TorusGeometry(1.65, 0.015, 6, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x7C3AED,
      transparent: true,
      opacity: 0.5,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = Math.PI / 6;
    rootGroup.add(ring2Mesh);

    // Particles around the orb
    const P_COUNT = 36;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(P_COUNT * 3);
    for (let i = 0; i < P_COUNT; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const r = 1.3 + Math.random() * 0.7;
      pPositions[i * 3] = Math.cos(th) * Math.sqrt(1 - u * u) * r;
      pPositions[i * 3 + 1] = u * r;
      pPositions[i * 3 + 2] = Math.sin(th) * Math.sqrt(1 - u * u) * r;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xBDE4DF,
      transparent: true,
      opacity: 0.85,
    });
    const pPoints = new THREE.Points(pGeo, pMat);
    rootGroup.add(pPoints);

    // Pointer tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouse.targetX = (e.clientX - cx) / (rect.width * 1.5);
      mouse.targetY = (e.clientY - cy) / (rect.height * 1.5);
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    let raf;
    let t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.018;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      rootGroup.rotation.y = t * 0.4 + mouse.x * 1.2;
      rootGroup.rotation.x = Math.sin(t * 0.3) * 0.15 + mouse.y * 1.2;

      wireMesh.rotation.y = -t * 0.5;
      wireMesh.rotation.z = t * 0.2;

      ringMesh.rotation.z = t * 0.35;
      ring2Mesh.rotation.y = -t * 0.3;

      pPoints.rotation.y = -t * 0.25;

      // Pulse floating
      rootGroup.position.y = Math.sin(t * 1.2) * 0.08;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [size]);

  if (REDUCED) {
    return (
      <div className="db-3d-orb-fallback" style={{ width: size, height: size }}>
        <div className="db-3d-orb-dot" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={'db-3d-orb-wrap' + (hovered ? ' hovered' : '')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        cursor: 'grab',
      }}
      title="Interactive 3D Workspace Core"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          display: 'block',
          filter: 'none',
          transition: 'filter 0.3s ease',
        }}
      />
    </div>
  );
}

