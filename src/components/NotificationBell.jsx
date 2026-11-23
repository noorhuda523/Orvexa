import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ago } from '../utils/dates';
import { Ic } from './ui';

// Bell button in the top bar with a small inbox popover.
export default function NotificationBell() {
  const { notifs, unread, markRead, markAllRead, go } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const d = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('mousedown', d); addEventListener('keydown', k);
    return () => { removeEventListener('mousedown', d); removeEventListener('keydown', k); };
  }, [open]);
  return (
    <div className="dd" ref={ref}>
      <button className="tog bellb" aria-label={'Notifications' + (unread ? ', ' + unread + ' unread' : '')} aria-expanded={open} onClick={() => setOpen(!open)}>
        {Ic('M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7zM10 20a2 2 0 0 0 4 0')}
        {unread > 0 && <span className="bdot">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="menu bellpop" role="dialog" aria-label="Notifications">
          <div className="bph"><b>Notifications</b><button className="lk" onClick={markAllRead}>Mark all read</button></div>
          {notifs.slice(0, 5).map((n) => (
            <button key={n.id} className={'nrow' + (n.read ? '' : ' u')} onClick={() => { markRead(n.id); setOpen(false); if (n.to) go(n.to); }}>
              <span className="nt">{n.t}</span><small>{ago(n.at)}</small>
            </button>
          ))}
          {!notifs.length && <p className="note" style={{ padding: '8px 12px', margin: 0 }}>You’re all caught up.</p>}
          <button className="lk bpv" onClick={() => { setOpen(false); go('app-notifications'); }}>View all notifications</button>
        </div>
      )}
    </div>
  );
}
