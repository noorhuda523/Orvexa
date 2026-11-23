/**
 * RotatingText — Dynamic animated rotating headline text.
 * Smoothly cycles through key value propositions using 3D perspective,
 * blur, and peacock gradient typography.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REDUCED = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DEFAULT_WORDS = [
  'Build Faster.',
  'Automate Flows.',
  'Ship 10x Quicker.',
  'Scale Seamlessly.',
  'Collaborate Better.',
];

export default function RotatingText({
  words = DEFAULT_WORDS,
  interval = 4500,
  className = '',
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (REDUCED || words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  if (REDUCED) {
    return (
      <span className={`rotating-text-wrap ${className}`}>
        <span className="rotating-text-word">{words[0]}</span>
      </span>
    );
  }

  return (
    <span className={`rotating-text-wrap ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)', rotateX: -35 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
          exit={{ opacity: 0, y: -28, filter: 'blur(8px)', rotateX: 35 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rotating-text-word"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
