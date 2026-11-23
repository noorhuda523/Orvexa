// Route table. Keys are used by the UI (go('pricing')); paths are what the router sees.
export const ROUTES = {
  home: { path: '/', kind: 'pub', title: 'Orvexa: Orchestrate. Automate. Accelerate.', label: 'Home' },
  features: { path: '/features', kind: 'pub', title: 'Features | Orvexa', label: 'Features' },
  solutions: { path: '/solutions', kind: 'pub', title: 'Solutions | Orvexa', label: 'Solutions' },
  pricing: { path: '/pricing', kind: 'pub', title: 'Pricing | Orvexa', label: 'Pricing' },
  about: { path: '/about', kind: 'pub', title: 'About | Orvexa', label: 'About' },
  contact: { path: '/contact', kind: 'pub', title: 'Contact | Orvexa', label: 'Contact' },
  changelog: { path: '/changelog', kind: 'pub', title: 'Changelog | Orvexa', label: 'Changelog' },
  privacy: { path: '/privacy', kind: 'pub', title: 'Privacy Policy | Orvexa', label: 'Privacy' },
  terms: { path: '/terms', kind: 'pub', title: 'Terms of Service | Orvexa', label: 'Terms' },
  signin: { path: '/signin', kind: 'auth', title: 'Sign in | Orvexa', label: 'Sign in' },
  signup: { path: '/signup', kind: 'auth', title: 'Sign up | Orvexa', label: 'Sign up' },
  'app-dashboard': { path: '/app', kind: 'app', title: 'Dashboard | Orvexa', label: 'Dashboard' },
  'app-workflows': { path: '/app/workflows', kind: 'app', title: 'Workflows | Orvexa', label: 'Workflows' },
  'app-tasks': { path: '/app/tasks', kind: 'app', title: 'Tasks | Orvexa', label: 'Tasks' },
  'app-analytics': { path: '/app/analytics', kind: 'app', title: 'Analytics | Orvexa', label: 'Analytics' },
  'app-agents': { path: '/app/agents', kind: 'app', title: 'AI Agents Studio | Orvexa', label: 'AI Agents' },
  'app-playground': { path: '/app/playground', kind: 'app', title: 'AI Playground | Orvexa', label: 'AI Playground' },
  'app-content-generator': { path: '/app/content-generator', kind: 'app', title: 'Content Generator | Orvexa', label: 'Content Studio' },
  'app-integrations': { path: '/app/integrations', kind: 'app', title: 'Integrations | Orvexa', label: 'Integrations' },
  'app-team': { path: '/app/team', kind: 'app', title: 'Team | Orvexa', label: 'Team' },
  'app-notifications': { path: '/app/notifications', kind: 'app', title: 'Notifications | Orvexa', label: 'Notifications' },
  'app-help': { path: '/app/help', kind: 'app', title: 'Help center | Orvexa', label: 'Help center' },
  'app-profile': { path: '/app/profile', kind: 'app', title: 'Profile | Orvexa', label: 'Profile' },
  'app-settings': { path: '/app/settings', kind: 'app', title: 'Settings | Orvexa', label: 'Settings', prefix: true },
};
export const NOT_FOUND = { key: '404', kind: 'pub', title: 'Page not found | Orvexa', label: 'Not found' };

export const PATHS = Object.fromEntries(Object.entries(ROUTES).map(([k, r]) => [k, r.path]));

export const routeFor = (pathname) => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  let key = Object.keys(ROUTES).find((k) => ROUTES[k].path === clean);
  if (!key) key = Object.keys(ROUTES).find((k) => ROUTES[k].prefix && clean.startsWith(ROUTES[k].path + '/'));
  return key ? { key, ...ROUTES[key] } : NOT_FOUND;
};

export const PUB_NAV = ['home', 'features', 'solutions', 'pricing', 'about', 'contact'];
export const FOOTER_COLS = [
  ['Product', ['features', 'solutions', 'pricing', 'changelog']],
  ['Company', ['about', 'contact']],
  ['Legal', ['privacy', 'terms']],
  ['Account', ['signin', 'signup']],
];
export const APP_NAV = [
  ['app-dashboard', 'Dashboard', 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z'],
  ['app-tasks', 'Tasks', 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2'],
  ['app-workflows', 'Workflows', 'M5 5h5v5H5zM14 14h5v5h-5zM10 7.5h4.5a2 2 0 0 1 2 2V14'],
  ['app-team', 'Team', 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5'],
  ['app-notifications', 'Notifications', 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7zM10 20a2 2 0 0 0 4 0'],
  ['app-help', 'Help center', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01'],
  ['app-profile', 'Profile', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6'],
  ['app-settings', 'Settings', 'M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6'],
];
