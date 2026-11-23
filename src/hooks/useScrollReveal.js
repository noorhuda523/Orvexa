import React, { useRef, useEffect } from 'react';
import { reduce } from '../utils/dom';
const h = React.createElement;

const R = (i = 0, c = '') => ({ className: (c + ' rv').trim(), 'data-r': 1, style: { '--i': i } });

const D = (cls, style, p) => h('div', { className: 'deco ' + cls + ' px', 'data-p': p, style, 'aria-hidden': 'true' });

function useScrollReveal(page) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;
    const els = [...root.querySelectorAll('[data-r]')];
    const dec = [...root.querySelectorAll('[data-p]')];
    const calm = reduce();
    const un = [];

    if (calm || !('IntersectionObserver' in window)) {
      els.forEach((e) => {
        e.classList.remove('rv');
        e.classList.add('on');
      });
    } else {
      // Replay: show on enter, reset on leave (works smoothly when scrolling down and up)
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((x) => {
            const e = x.target;
            clearTimeout(e._t);
            if (x.isIntersecting) {
              e.classList.add('on');
              e._t = setTimeout(() => e.classList.add('done'), 1500);
            } else {
              e.classList.remove('on', 'done');
            }
          }),
        { threshold: 0.05, rootMargin: '0px 0px -6% 0px' }
      );
      els.forEach((e) => io.observe(e));
      un.push(() => {
        io.disconnect();
        els.forEach((e) => clearTimeout(e._t));
      });
    }

    if (!calm && dec.length) {
      let raf = 0;
      const upd = () => {
        raf = 0;
        const mid = window.innerHeight / 2;
        dec.forEach((e) => {
          const b = e.parentNode.getBoundingClientRect();
          if (b.bottom < -200 || b.top > window.innerHeight + 200) return;
          e.style.setProperty('--py', ((b.top + b.height / 2 - mid) * e.dataset.p).toFixed(1) + 'px');
        });
      };
      const on = () => {
        if (!raf) raf = requestAnimationFrame(upd);
      };
      window.addEventListener('scroll', on, { passive: true });
      window.addEventListener('resize', on);
      upd();
      un.push(() => {
        window.removeEventListener('scroll', on);
        window.removeEventListener('resize', on);
        cancelAnimationFrame(raf);
      });
    }

    return () => un.forEach((f) => f());
  }, []);

  return ref;
}

export { D, R, useScrollReveal };
