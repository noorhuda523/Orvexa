import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PUB_NAV, ROUTES, routeFor } from '../data/routes';
import { Btn } from './Button';
import { Overlay } from './Modal';
import { CloseBtn, Ic, Logo } from './ui';

export default function Navbar() {
  const { user, go, signOut } = useApp();
  const { pathname } = useLocation();
  const page = routeFor(pathname).key;
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);

  const link = (k) => (
    <button key={k} aria-current={page === k ? 'page' : undefined} onClick={() => go(k)}>
      {ROUTES[k].label}
    </button>
  );

  return (
    <>
      <header className="nx-header">
        <div className="wrap nav">
          <Logo go={go} />
          <nav className="links" aria-label="Main">{PUB_NAV.map(link)}</nav>
          <div className="right">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Btn sm onClick={() => go('app-dashboard')}>Dashboard</Btn>
                <Btn v="sec" sm onClick={signOut}>Sign out</Btn>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Btn v="sec" sm className="hide-m" onClick={() => go('signin')}>Sign in</Btn>
                <Btn sm onClick={() => go('signup')}>Get started →</Btn>
              </div>
            )}
            <button className="tog burger" aria-label="Open menu" onClick={() => setOpen(true)}>
              {Ic('M4 6h16M4 12h16M4 18h16')}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <Overlay side label="Menu" onClose={() => setOpen(false)}>
          <CloseBtn onClick={() => setOpen(false)} />
          <nav className="dnav">{PUB_NAV.map(link)}</nav>
          {user ? (
            <div className="cta" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn onClick={() => go('app-dashboard')}>Dashboard</Btn>
              <Btn v="sec" onClick={signOut}>Sign out</Btn>
            </div>
          ) : (
            <div className="cta" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn onClick={() => go('signup')}>Get started →</Btn>
              <Btn v="sec" onClick={() => go('signin')}>Sign in</Btn>
            </div>
          )}
        </Overlay>
      )}
    </>
  );
}
