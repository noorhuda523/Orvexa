import { useState } from 'react';
import { Btn } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import Switch from '../../components/Switch';
import { Box, Table } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { seedTasks, seedWf } from '../../data/demoData';
import useLocalState from '../../hooks/useLocalState';
import { downloadFile } from '../../utils/browser';
import { clearDemoData, lsJson, saveTasks, saveWf } from '../../utils/storage';

const cnt = (k) => { const a = lsJson(k, null); return Array.isArray(a) ? String(a.length) : 'Sample set'; };

export default function DataPrivacy() {
  const { toast, resetAppState, signOut } = useApp();
  const [dlg, setDlg] = useState(null);
  const [, bump] = useState(0);
  const [pv, setPv] = useLocalState('nx-privacy', { analytics: false, tips: true, publicProfile: false });
  const flip = (k, label) => { setPv({ ...pv, [k]: !pv[k] }); toast(label + (pv[k] ? ' off' : ' on')); };

  const exportAll = () => {
    const out = {};
    Object.keys(localStorage).filter((k) => k.startsWith('nx-')).forEach((k) => { const raw = localStorage.getItem(k); try { out[k] = JSON.parse(raw); } catch (e) { out[k] = raw; } });
    downloadFile('orvexa-data-export.json', JSON.stringify({ exportedAt: new Date().toISOString(), note: 'Demo data saved in this browser.', data: out }, null, 2), 'application/json');
    toast('Export downloaded');
  };
  const reset = () => { saveTasks(seedTasks()); saveWf(seedWf()); setDlg(null); bump((n) => n + 1); toast('Sample tasks and workflows restored'); };
  const clearAll = () => { clearDemoData(); resetAppState(); setDlg(null); signOut(); toast('All demo data cleared'); };

  return (
    <>
      <Box title="Privacy">
        {[['analytics', 'Product analytics', 'Share anonymous usage to improve Orvexa. Demo only: nothing is collected.'], ['tips', 'Personalised tips', 'Show tips based on how you use the app.'], ['publicProfile', 'Public profile', 'Let others see your profile preview.']].map(([k, l, d]) => (
          <div className="kv" key={k}><span><b>{l}</b><small>{d}</small></span><Switch label={l} checked={pv[k]} onChange={() => flip(k, l)} /></div>
        ))}
      </Box>
      <Box title="Your data">
        <p className="note" style={{ marginTop: 0 }}>Everything lives in this browser. Nothing is stored on a server.</p>
        <Table head={['Item', 'Saved']} rows={[['Tasks', cnt('nx-tasks')], ['Workflows', cnt('nx-workflows')], ['Team members', cnt('nx-team')], ['Notifications', cnt('nx-notifs')], ['Contact messages', cnt('nx-messages')], ['Support requests', cnt('nx-tickets')], ['API keys', cnt('nx-apikeys')]]} />
        <div className="cta" style={{ marginTop: 16 }}>
          <Btn onClick={exportAll}>Export my data (JSON)</Btn>
          <Btn v="sec" onClick={() => setDlg('reset')}>Reset sample data</Btn>
          <Btn v="dng" onClick={() => setDlg('clear')}>Clear all my data</Btn>
        </div>
      </Box>
      {dlg === 'reset' && <ConfirmDialog title="Reset sample data?" confirmLabel="Reset" onClose={() => setDlg(null)} onConfirm={reset}>Your tasks and workflows will be replaced by the original samples, including run history.</ConfirmDialog>}
      {dlg === 'clear' && <ConfirmDialog title="Clear all my data?" danger confirmLabel="Clear everything" onClose={() => setDlg(null)} onConfirm={clearAll}>This removes your tasks, workflows, team, profile, settings and demo accounts from this browser, then signs you out.</ConfirmDialog>}
    </>
  );
}
