/**
 * TiltCard — wraps any element with a GPU-accelerated perspective tilt
 * and cursor-following spotlight glare.
 * Inspired by Framer interactive card design.
 */
import { useRef, useCallback, useState } from 'react';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function TiltCard({
  children,
  className = '',
  style = {},
  max = 7,
  scale = 1.015,
  glare = false,
  disabled = false,
  ...props
}) {
  const ref = useRef(null);
  const raf = useRef(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const onMove = useCallback((e) => {
    if (REDUCED || disabled) return;
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      el.style.transform = `perspective(800px) rotateY(${dx * max}deg) rotateX(${-dy * max}deg) scale3d(${scale},${scale},${scale})`;
      if (glare) {
        el.style.setProperty('--gx', `${x}px`);
        el.style.setProperty('--gy', `${y}px`);
        setGlarePos({ x, y, opacity: 1 });
      }
    });
  }, [disabled, max, scale, glare]);

  const onLeave = useCallback(() => {
    if (REDUCED || disabled) return;
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transition = 'transform 0.45s cubic-bezier(0.2,0.8,0.2,1)';
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    if (glare) {
      setGlarePos(prev => ({ ...prev, opacity: 0 }));
    }
    setTimeout(() => { if (el) el.style.transition = ''; }, 450);
  }, [disabled, glare]);

  return (
    <div
      ref={ref}
      className={'tilt-card ' + className}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
      {glare && !REDUCED && !disabled && (
        <div
          aria-hidden="true"
          className="tilt-glare"
          style={{ opacity: glarePos.opacity }}
        />
      )}
    </div>
  );
}
