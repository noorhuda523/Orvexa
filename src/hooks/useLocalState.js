import { useCallback, useState } from 'react';
import { lsJson, lsSetJson } from '../utils/storage';

// useState that is saved to localStorage (frontend-only persistence).
export default function useLocalState(key, initial) {
  const [value, setValue] = useState(() => lsJson(key, typeof initial === 'function' ? initial() : initial));
  const set = useCallback((next) => setValue((prev) => {
    const n = typeof next === 'function' ? next(prev) : next;
    lsSetJson(key, n);
    return n;
  }), [key]);
  return [value, set];
}
