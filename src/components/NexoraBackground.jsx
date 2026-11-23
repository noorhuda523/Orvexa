import React from 'react';

/**
 * NexoraBackground — Clean, Modern, Executive SaaS Background.
 * Provides a minimal, distraction-free backdrop:
 * - Layer 1: Subtle deep ambient gradient
 * - Layer 2: Precision matrix grid pattern
 * Background 3D wireframe animations have been completely removed for a sleek, professional look.
 */
export default function NexoraBackground() {
  return (
    <>
      <div aria-hidden="true" className="nx-bg-gradient" />
      <div aria-hidden="true" className="nx-bg-grid" />
    </>
  );
}
