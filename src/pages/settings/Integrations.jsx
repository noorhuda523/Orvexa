import { useState } from 'react';
import { Btn } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import { Box, Tag } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { INTEGRATIONS } from '../../data/content';
import useLocalState from '../../hooks/useLocalState';

export default function Integrations() {
  const { toast, notify } = useApp();
  const [on, setOn] = useLocalState('nx-integrations', { slack: Date.now() - 20 * 864e5 });
  const [ask, setAsk] = useState(null); // {id, mode:'connect'|'disconnect'}
  const item = ask && INTEGRATIONS.find((i) => i[0] === ask.id);
  const connect = () => { setOn({ ...on, [ask.id]: Date.now() }); notify(item[1] + ' connected', 'Demo only: no data is shared with ' + item[1] + '.', 'success', 'app-settings'); toast(item[1] + ' connected (simulated)'); setAsk(null); };
  const disconnect = () => { const n = { ...on }; delete n[ask.id]; setOn(n); toast(item[1] + ' disconnected'); setAsk(null); };
  return (
    <>
      <Box title="Integrations" right={<Tag>{Object.keys(on).length + ' connected'}</Tag>}>
        <p className="note" style={{ marginTop: 0 }}>Connect the tools your team already uses. In this demo, connecting only changes what is saved in your browser.</p>
        <div className="cards3">
          {INTEGRATIONS.map(([id, name, desc]) => (
            <div className="ic3" key={id}>
              <span className="lg" aria-hidden="true">{name[0]}</span>
              <div>
                <b>{name}</b><p>{desc}</p>
                {on[id] ? <><small style={{ color: 'var(--muted)' }}>Connected {new Date(on[id]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small><Btn v="sec" sm onClick={() => setAsk({ id, mode: 'disconnect' })}>Disconnect</Btn></>
                  : <Btn sm onClick={() => setAsk({ id, mode: 'connect' })}>Connect</Btn>}
              </div>
            </div>
          ))}
        </div>
      </Box>
      {ask && ask.mode === 'connect' && (
        <Modal title={'Connect ' + item[1]} onClose={() => setAsk(null)}>
          <p className="note" style={{ marginTop: 0 }}>Orvexa will be able to:</p>
          <ul className="scopes">{item[3].map((s) => <li key={s}>{s}</li>)}</ul>
          <p className="note">Simulated authorization. No real account is contacted.</p>
          <div className="cta"><Btn onClick={connect}>Authorize</Btn><Btn v="sec" onClick={() => setAsk(null)}>Cancel</Btn></div>
        </Modal>
      )}
      {ask && ask.mode === 'disconnect' && <ConfirmDialog title={'Disconnect ' + item[1] + '?'} danger confirmLabel="Disconnect" onClose={() => setAsk(null)} onConfirm={disconnect}>Workflows that use {item[1]} will stop posting there.</ConfirmDialog>}
    </>
  );
}
