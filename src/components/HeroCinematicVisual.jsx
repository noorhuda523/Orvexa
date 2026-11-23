import React, { useEffect, useRef, useState } from 'react';

/**
 * HeroCinematicVisual
 * Seamless cinematic visual representing Orvexa's AI intelligence & workflow automation:
 * - Flowing connected data streams & glowing connection paths
 * - Intelligent workflow nodes with active data pulses (purple #7047EB & cyan #65D5CA)
 * - Fluid geometric network with subtle interactive parallax
 * - Respects prefers-reduced-motion, pauses when off-screen for maximum performance
 * - Video fallback support (muted, autoplay, loop, playsInline)
 */
export default function HeroCinematicVisual({ videoSrc = null, posterSrc = null }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [videoError, setVideoError] = useState(!videoSrc);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse parallax
    let mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Generate intelligent workflow nodes
    const nodeCount = width < 768 ? 20 : 38;
    const nodes = [];
    const colors = ['#7047EB', '#8B75F5', '#65D5CA', '#A78BFA'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.8 + 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        isHub: i % 6 === 0, // Primary intelligent hubs
      });
    }

    // Packet pulses traveling along connection paths
    const packets = [];
    for (let i = 0; i < 8; i++) {
      packets.push({
        from: Math.floor(Math.random() * nodeCount),
        to: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
        color: i % 2 === 0 ? '#7047EB' : '#65D5CA',
      });
    }

    // Visibility observer to pause loop when not on screen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    let time = 0;

    const render = () => {
      if (!isVisible || reducedMotion) {
        if (!reducedMotion) animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const parallaxX = (mouse.x - width / 2) * 0.035;
      const parallaxY = (mouse.y - height / 2) * 0.035;

      // Draw subtle luminous ambient backdrop glow
      const grad = ctx.createRadialGradient(
        width / 2 + parallaxX,
        height / 2 + parallaxY,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.6
      );
      grad.addColorStop(0, 'rgba(237, 231, 255, 0.45)');
      grad.addColorStop(0.5, 'rgba(224, 247, 245, 0.2)');
      grad.addColorStop(1, 'rgba(248, 249, 252, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce at boundaries
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        n.pulse += 0.03;
        const currentRadius = n.radius + (n.isHub ? Math.sin(n.pulse) * 1.2 : 0);

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = width < 768 ? 120 : 170;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(n.x + parallaxX, n.y + parallaxY);
            ctx.lineTo(n2.x + parallaxX, n2.y + parallaxY);
            ctx.strokeStyle = `rgba(112, 71, 235, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw Node Core
        ctx.beginPath();
        ctx.arc(n.x + parallaxX, n.y + parallaxY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = n.isHub ? 12 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Hub Ring
        if (n.isHub) {
          ctx.beginPath();
          ctx.arc(n.x + parallaxX, n.y + parallaxY, currentRadius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(112, 71, 235, 0.25)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw flowing data packets along workflow channels
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.from = Math.floor(Math.random() * nodes.length);
          p.to = Math.floor(Math.random() * nodes.length);
        }

        const n1 = nodes[p.from];
        const n2 = nodes[p.to];
        if (n1 && n2) {
          const px = n1.x + (n2.x - n1.x) * p.progress + parallaxX;
          const py = n1.y + (n2.y - n1.y) * p.progress + parallaxY;

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="hero-cinematic-container" aria-hidden="true">
      {videoSrc && !videoError ? (
        <video
          className="hero-cinematic-video"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        />
      ) : null}
      <canvas ref={canvasRef} className="hero-cinematic-canvas" />
      <div className="hero-cinematic-overlay" />
    </div>
  );
}
