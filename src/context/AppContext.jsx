import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import useLocalState from '../hooks/useLocalState';
import { useToast } from '../components/Toast';
import { PATHS } from '../data/routes';
import { SEED_NOTIFS } from '../data/content';
import { clearUser, readAcc, readUser, saveAcc, updateStoredUser, writeUser } from '../utils/storage';

const Ctx = createContext(null);
const browserTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } };
const PROFILE0 = () => ({ role: '', company: '', location: '', timezone: browserTz(), bio: '', website: '', github: '', linkedin: '', twitter: '', skills: [], avatar: '', since: Date.now() });
const PREFS0 = { density: 'comfortable', fontsize: 'default', motion: 'system' };
const seedNotifs = () => SEED_NOTIFS.map((n, i) => ({ id: 'n' + (i + 1), t: n.t, b: n.b, type: n.type, to: n.to || null, at: Date.now() - n.m * 60000, read: i > 1 }));
const nid = () => 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// App-wide state: demo session, profile, notifications, appearance and navigation (all frontend-only).
export function AppProvider({ children }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme, themePref, setTheme } = useTheme();
  const [user, setUser] = useState(readUser);
  const [profile, setProfile] = useLocalState('nx-profile', PROFILE0);
  const [notifs, setNotifs] = useLocalState('nx-notifs', seedNotifs);
  const [prefs, setPrefs] = useLocalState('nx-appearance', PREFS0);

  useEffect(() => { const d = document.documentElement.dataset; d.density = prefs.density; d.fs = prefs.fontsize; d.motion = prefs.motion; }, [prefs]);

  const go = useCallback((key) => navigate(PATHS[key] || '/'), [navigate]);
  const start = useCallback(() => go('signup'), [go]);
  const signIn = useCallback((u) => { writeUser(u); setUser(u); navigate('/app'); toast('Welcome back, ' + u.name); }, [navigate, toast]);
  const signOut = useCallback(() => {
    clearUser();
    setUser(null);
    navigate('/signin');
    toast('Signed out successfully');
  }, [navigate, toast]);
  const updateUser = useCallback((patch) => setUser(updateStoredUser(user, patch)), [user]);
  const changeEmail = useCallback((email) => {
    saveAcc(readAcc().map((a) => (a.email === user.email ? { ...a, email } : a)));
    setUser(updateStoredUser(user, { email }));
  }, [user]);
  const updateProfile = useCallback((patch) => setProfile((p) => ({ ...p, ...patch })), [setProfile]);
  const notify = useCallback((t, b = '', type = 'info', to = null) => setNotifs((n) => [{ id: nid(), t, b, type, to, at: Date.now(), read: false }, ...n].slice(0, 50)), [setNotifs]);
  const markRead = useCallback((id, read = true) => setNotifs((n) => n.map((x) => (x.id === id ? { ...x, read } : x))), [setNotifs]);
  const markAllRead = useCallback(() => setNotifs((n) => n.map((x) => ({ ...x, read: true }))), [setNotifs]);
  const removeNotif = useCallback((id) => setNotifs((n) => n.filter((x) => x.id !== id)), [setNotifs]);
  const clearNotifs = useCallback(() => setNotifs([]), [setNotifs]);
  const resetAppState = useCallback(() => { setProfile(PROFILE0()); setNotifs(seedNotifs()); setPrefs(PREFS0); }, [setProfile, setNotifs, setPrefs]);
  const unread = notifs.filter((n) => !n.read).length;

  const value = useMemo(() => ({
    user, theme, themePref, setTheme, go, start, signIn, signOut, updateUser, changeEmail, toast,
    profile, updateProfile, notifs, unread, notify, markRead, markAllRead, removeNotif, clearNotifs, prefs, setPrefs, resetAppState,
  }), [user, theme, themePref, setTheme, go, start, signIn, signOut, updateUser, changeEmail, toast, profile, updateProfile, notifs, unread, notify, markRead, markAllRead, removeNotif, clearNotifs, prefs, setPrefs, resetAppState]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used inside <AppProvider>');
  return c;
}
