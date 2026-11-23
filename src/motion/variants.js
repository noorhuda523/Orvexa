/**
 * Nexora Motion Design System
 * Single source of truth for all animation values.
 * Use these everywhere — never write one-off durations or easings.
 */

/* ─── Timing tokens ──────────────────────────────────────────────────────── */
export const DUR = {
  instant: 0.1,
  fast:    0.2,
  base:    0.35,
  slow:    0.55,
  xslow:   0.8,
};

export const EASE = {
  out:     [0.16, 1, 0.3, 1],
  in:      [0.4, 0, 1, 1],
  inOut:   [0.4, 0, 0.2, 1],
  spring:  'spring',
};

export const SPRING = {
  snappy:  { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 },
  smooth:  { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 },
  bouncy:  { type: 'spring', stiffness: 320, damping: 18 },
  gentle:  { type: 'spring', stiffness: 180, damping: 24 },
};

/* ─── Page transitions ───────────────────────────────────────────────────── */
export const pageVariants = {
  initial:  { opacity: 0, y: 16, scale: 0.99 },
  animate:  { opacity: 1, y: 0,  scale: 1,
    transition: { duration: DUR.base, ease: EASE.out, staggerChildren: 0.06 } },
  exit:     { opacity: 0, y: -8, scale: 0.99,
    transition: { duration: DUR.fast, ease: EASE.in } },
};

/* ─── Card animations ─────────────────────────────────────────────────────── */
export const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: DUR.base, ease: EASE.out },
  }),
};

export const hoverCard = {
  rest:  { scale: 1,    y: 0,  boxShadow: '0 0 0 0 rgba(121,80,242,0)' },
  hover: { scale: 1.02, y: -4, boxShadow: '0 12px 32px rgba(121,80,242,.18)',
    transition: SPRING.smooth },
  tap:   { scale: 0.98, transition: SPRING.snappy },
};

/* ─── List stagger ────────────────────────────────────────────────────────── */
export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const listItem = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: DUR.base, ease: EASE.out } },
};

export const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0,  transition: { duration: DUR.base, ease: EASE.out } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.base } },
};

/* ─── Modal / Overlay ─────────────────────────────────────────────────────── */
export const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.fast } },
  exit:    { opacity: 0, transition: { duration: DUR.fast, delay: 0.05 } },
};

export const modalVariants = {
  hidden:  { opacity: 0, scale: 0.94, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: SPRING.smooth },
  exit:    { opacity: 0, scale: 0.96, y: 12,
    transition: { duration: DUR.fast, ease: EASE.in } },
};

export const slideUp = {
  hidden:  { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0,
    transition: SPRING.smooth },
  exit:    { opacity: 0, y: '100%',
    transition: { duration: DUR.fast } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0,
    transition: SPRING.smooth },
  exit:    { opacity: 0, x: '100%',
    transition: { duration: DUR.fast } },
};

/* ─── Toast ──────────────────────────────────────────────────────────────── */
export const toastVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: SPRING.snappy },
  exit:    { opacity: 0, y: 8,  scale: 0.97,
    transition: { duration: DUR.fast } },
};

/* ─── Nav / sidebar ──────────────────────────────────────────────────────── */
export const sidebarItem = {
  rest:  { x: 0, opacity: 0.7 },
  hover: { x: 3, opacity: 1, transition: { duration: DUR.fast, ease: EASE.out } },
  tap:   { scale: 0.97 },
};

/* ─── Indicator bar ──────────────────────────────────────────────────────── */
export const barGrow = (pct) => ({
  hidden:  { scaleX: 0 },
  visible: { scaleX: pct / 100,
    transition: { duration: DUR.slow, ease: EASE.out, delay: 0.2 } },
});

/* ─── Shimmer skeleton ───────────────────────────────────────────────────── */
export const skeleton = {
  animate: {
    background: [
      'linear-gradient(90deg, var(--bg2) 0%, var(--line) 50%, var(--bg2) 100%)',
      'linear-gradient(90deg, var(--line) 0%, var(--bg2) 50%, var(--line) 100%)',
    ],
    transition: { repeat: Infinity, duration: 1.4, ease: 'linear' },
  },
};
