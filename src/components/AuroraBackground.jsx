import { useEffect } from 'react';

// The aurora corner glows are pure CSS (src/styles/aurora.css). Rendering this component turns them on
// by setting data-aurora="on" on <html>; the dashboard layout does not render it, so the app stays clean.
export default function AuroraBackground() {
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.aurora = 'on';
    return () => { delete el.dataset.aurora; };
  }, []);
  return null;
}
