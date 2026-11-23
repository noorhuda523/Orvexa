import { useState } from 'react';
import { Btn } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import { Box, Chips, EmptyState, Field, Table } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import useLocalState from '../../hooks/useLocalState';
import { copyText, randomHex } from '../../utils/browser';
import { ago } from '../../utils/dates';

const SCOPES = ['Read-only', 'Read & write', 'Admin'];

export default function ApiKeys() {
  const { toast, notify } = useApp();
  const [keys, setKeys] = useLocalState('nx-apikeys', () => [{ id: 'k1', name: 'Production', prefix: 'nx_live_8f2a', last4: 'c91e', scope: 'Read & write', at: Date.now() - 40 * 864e5, used: '2 hours ago' }]);
  const [create, setCreate] = useState(null); // {name, scope}
  const [er, setEr] = useState('');
  const [fresh, setFresh] = useState(null); // {name, full}
  const [rev, setRev] = useState(null);

  const make = (e) => {
    e.preventDefault();
    const name = create.name.trim();
    if (!name) return setEr('Give the key a name, for example “CI server”.');
    if (name.length > 40) return setEr('Keep the name under 40 characters.');
    if (keys.some((k) => k.name.toLowerCase() === name.toLowerCase())) return setEr('You already have a key with that name.');
    const full = 'nx_live_' + randomHex(24);
    setKeys([{ id: 'k' + Date.now().toString(36), name, prefix: full.slice(0, 12), last4: full.slice(-4), scope: create.scope, at: Date.now(), used: 'Never' }, ...keys]);
    setFresh({ name, full }); setCreate(null);
    notify('API key created', name + ' (' + create.scope + ').', 'success', 'app-settings');
  };
  return (
    <>
      <Box title="API keys" right={<Btn onClick={() => { setCreate({ name: '', scope: 'Read & write' }); setEr(''); }}>Create key</Btn>}>
        <p className="note" style={{ marginTop: 0 }}>Demo only: keys do nothing and no API exists. Treat real keys like passwords.</p>
        {keys.length ? (
          <Table head={['Name', 'Key', 'Access', 'Created', 'Last used', <span key="a" className="sr">Actions</span>]}
            rows={keys.map((k) => [k.name, <code key="c">{k.prefix}…{k.last4}</code>, k.scope, ago(k.at), k.used, <button key="r" className="lk dg" aria-label={'Revoke ' + k.name} onClick={() => setRev(k)}>Revoke</button>])} />
        ) : <EmptyState title="No API keys" text="Create a key to call the Orvexa API from your own code." />}
      </Box>
      <Box title="Example request">
        <code className="code">{'curl https://api.orvexa.example/v1/tasks \\\n  -H "Authorization: Bearer nx_live_your_key_here"'}</code>
      </Box>
      {create && (
        <Modal title="Create API key" onClose={() => setCreate(null)}>
          <form onSubmit={make} noValidate>
            <Field label="Key name" value={create.name} onChange={(e) => { setCreate({ ...create, name: e.target.value }); setEr(''); }} error={er} autoFocus />
            <p className="tl">Access</p>
            <Chips items={SCOPES} value={create.scope} onPick={(s) => setCreate({ ...create, scope: s })} />
            <div className="cta"><Btn type="submit">Create key</Btn><Btn v="sec" onClick={() => setCreate(null)}>Cancel</Btn></div>
          </form>
        </Modal>
      )}
      {fresh && (
        <Modal title="Copy your new key" onClose={() => setFresh(null)}>
          <p className="note" style={{ marginTop: 0 }}>This is the only time the full key is shown. Store it somewhere safe.</p>
          <div className="keyshow"><code className="code" aria-label={'New key for ' + fresh.name}>{fresh.full}</code><Btn v="sec" onClick={async () => toast((await copyText(fresh.full)) ? 'Key copied' : 'Copy failed')}>Copy</Btn></div>
          <div className="cta" style={{ marginTop: 16 }}><Btn onClick={() => setFresh(null)}>Done</Btn></div>
        </Modal>
      )}
      {rev && <ConfirmDialog title="Revoke this key?" danger confirmLabel="Revoke" onClose={() => setRev(null)} onConfirm={() => { setKeys(keys.filter((k) => k.id !== rev.id)); setRev(null); toast('Key revoked'); }}>Anything using “{rev.name}” will stop working immediately.</ConfirmDialog>}
    </>
  );
}
