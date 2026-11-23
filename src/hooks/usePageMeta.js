import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { routeFor } from '../data/routes';

let firstRun = true;

// On every route change: set the document title, scroll to the top and move focus to <main>.
export default function usePageMeta() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  useEffect(() => {
    document.title = routeFor(pathname).title;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (firstRun) { firstRun = false; return; }
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [pathname]);
  return mainRef;
}
