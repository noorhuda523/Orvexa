/**
 * ORVEXA — Project-Wide 3D Tilt Hover Engine
 * High-performance, zero re-render, 60fps GPU-accelerated 3D tilt.
 * Strictly no glow, natural elevation, and smooth return physics.
 */

const CARD_SELECTORS = [
  '.card',
  '.nx-kpi-card',
  '.nx-akpi-card',
  '.nx-chart-card',
  '.nx-dash-card-box',
  '.nx-dash-activity-card',
  '.nx-purpose-card',
  '.purpose-card',
  '.nx-benefit-card',
  '.nx-step-card',
  '.nx-testimonial-card',
  '.testimonial-card',
  '.feat-card-full',
  '.sol-card',
  '.about-mission-card',
  '.organix-task-card',
  '.nx-wf-card',
  '.nx-wf-template-card',
  '.nx-agent-card',
  '.nx-agent-template-card',
  '.nx-playground-card',
  '.nx-prompt-card',
  '.nx-content-card',
  '.nx-output-card',
  '.nx-integration-card',
  '.nx-team-card',
  '.team-member-card',
  '.nx-profile-card',
  '.nx-settings-card',
  '.nx-tilt-card',
  '[data-tilt]',
].join(', ');

const EXCLUDE_SELECTORS = [
  '[data-no-tilt]',
  '.react-flow',
  '.react-flow__node',
  '.react-flow__pane',
  '.nx-flow-canvas',
  '.nx-modal-dialog',
  '.modal',
  'button',
  'input',
  'textarea',
  'select',
].join(', ');

export function initGlobalTilt(options = {}) {
  if (typeof window === 'undefined') return () => {};

  // Respect prefers-reduced-motion
  const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaReducedMotion.matches) return () => {};

  // Only enable on devices with precise pointer (desktop/laptop mouse)
  const mediaPointerFine = window.matchMedia('(pointer: fine) and (hover: hover)');
  if (!mediaPointerFine.matches) return () => {};

  const maxTilt = options.max ?? 6; // Max 6 degrees tilt
  const perspective = options.perspective ?? 1000; // 1000px perspective
  const scale = options.scale ?? 1.012; // Subtle 1.2% zoom
  const translateY = options.translateY ?? -4; // Subtle 4px elevation

  let activeCard = null;
  let rafId = null;
  let cardRect = null;
  let mouseX = 0;
  let mouseY = 0;
  let resetTimer = null;

  const updateCardTransform = () => {
    if (!activeCard || !cardRect) return;

    const width = cardRect.width;
    const height = cardRect.height;
    if (width === 0 || height === 0) return;

    const x = mouseX - cardRect.left;
    const y = mouseY - cardRect.top;

    const centerX = width / 2;
    const centerY = height / 2;

    // Relative offset normalized from -1 to +1
    const percentX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
    const percentY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

    // Tilt calculations:
    // Cursor near top -> rotX > 0 (tilts backward)
    // Cursor near bottom -> rotX < 0 (tilts forward)
    // Cursor on right -> rotY > 0 (tilts right)
    // Cursor on left -> rotY < 0 (tilts left)
    const rotX = -percentY * maxTilt;
    const rotY = percentX * maxTilt;

    activeCard.style.transform = `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(${translateY}px) scale(${scale})`;
    rafId = null;
  };

  const resetCard = (card) => {
    if (!card) return;
    card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      if (activeCard !== card) {
        card.style.transform = '';
        card.style.transition = '';
        card.style.willChange = '';
        card.style.transformStyle = '';
      }
    }, 450);
  };

  const handlePointerMove = (e) => {
    // Ignore touch inputs
    if (e.pointerType === 'touch') return;

    // Check if target or any parent matches an excluded element
    if (e.target.closest(EXCLUDE_SELECTORS) && !e.target.closest(CARD_SELECTORS)) {
      if (activeCard) {
        resetCard(activeCard);
        activeCard = null;
      }
      return;
    }

    const targetCard = e.target.closest(CARD_SELECTORS);

    // If leaving card
    if (!targetCard) {
      if (activeCard) {
        resetCard(activeCard);
        activeCard = null;
      }
      return;
    }

    // Entering a new card
    if (targetCard !== activeCard) {
      if (activeCard) {
        resetCard(activeCard);
      }
      activeCard = targetCard;
      cardRect = activeCard.getBoundingClientRect();

      activeCard.style.willChange = 'transform';
      activeCard.style.transformStyle = 'preserve-3d';
      activeCard.style.transition = 'transform 0.08s ease-out';
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(updateCardTransform);
    }
  };

  const handlePointerLeave = () => {
    if (activeCard) {
      resetCard(activeCard);
      activeCard = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  document.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
  window.addEventListener('scroll', handlePointerLeave, { passive: true });

  return () => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerleave', handlePointerLeave);
    window.removeEventListener('scroll', handlePointerLeave);
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(resetTimer);
    if (activeCard) resetCard(activeCard);
  };
}
