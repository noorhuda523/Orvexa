import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ScrollProgressBar — A sleek, glowing purple gradient bar pinned at the very top
 * that dynamically reflects scroll progress (0% to 100%) as the user scrolls up and down.
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const current = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
          setProgress(current);
        } else {
          setProgress(0);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="scroll-progress-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        className="scroll-progress-bar"
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #7C3AED 0%, #6366F1 100%)',
          boxShadow: 'none',
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
}

/**
 * ScrollToTopButton — Floating action button that smoothly slides and fades in
 * when the user scrolls down, and animates smooth scrolling back to top on click.
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > 280);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Scroll to top"
          title="Back to top"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stt-icon"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
          <span className="stt-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * ScrollDownIndicator — Hero section scroll down cue with an animated bouncing chevron
 * that smoothly scrolls down to the target section when clicked.
 */
export function ScrollDownIndicator({ targetId = 'overview', label = 'Scroll to explore' }) {
  const handleScrollDown = useCallback(() => {
    const el = document.getElementById(targetId) || document.querySelector('.partner-strip-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: 580, behavior: 'smooth' });
    }
  }, [targetId]);

  return (
    <button
      className="scroll-down-cue-btn"
      onClick={handleScrollDown}
      aria-label="Scroll down to explore features"
    >
      <span className="sdc-mouse">
        <span className="sdc-wheel" />
      </span>
      <span className="sdc-label">{label}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sdc-chevron"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}
