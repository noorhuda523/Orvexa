/**
 * CountUp — animates a number from 0 to `to` using requestAnimationFrame.
 * Triggers when the element enters the viewport.
 * No library needed.
 */
import { useEffect, useRef, useState } from 'react';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CountUp({ to, duration = 900, suffix = '', prefix = '', decimals = 0, className = '' }) {
  const [val, setVal] = useState(REDUCED ? to : 0);
  const elRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (REDUCED) { setVal(to); return; }
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        obs.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const pct = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - pct, 3); // cubic ease-out
          setVal(Math.round(to * ease * Math.pow(10, decimals)) / Math.pow(10, decimals));
          if (pct < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration, decimals]);

  return (
    <span ref={elRef} className={className} aria-label={prefix + to + suffix}>
      {prefix}{typeof val === 'number' ? (decimals > 0 ? val.toFixed(decimals) : val) : val}{suffix}
    </span>
  );
}
