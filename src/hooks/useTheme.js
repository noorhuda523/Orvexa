import { useEffect } from 'react';

/**
 * useTheme — Strictly Light Theme across the entire Nexora application.
 * Dark mode, system mode, and automatic dark theme are completely disabled.
 */
export function useTheme() {
  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
    try {
      localStorage.setItem('nx-theme', 'light');
    } catch (e) {}
  }, []);

  return {
    theme: 'light',
    themePref: 'light',
    setTheme: () => {},
    toggleTheme: () => {},
  };
}

export default useTheme;

