import { useState } from 'react';
import { Btn } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import Switch from '../../components/Switch';
import { Box, Field, Pw, Table, Tag } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { LOGINS, SESSIONS_SEED } from '../../data/content';
import useLocalState from '../../hooks/useLocalState';
import { copyText, deviceLabel, downloadFile, randomHex } from '../../utils/browser';
import { ago } from '../../utils/dates';
import { PWL, pwScore } from '../../utils/validation';

const makeCodes = () => Array.from({ length: 8 }, () => { const h = randomHex(8); return h.slice(0, 4) + '-' + h.slice(4); });

export default function Security() {
  const { toast, notify } = useApp();
  const [sec, setSec] = useLocalState('nx-security', { twofa: false, codes: [], changed: null });
  const [sessions, setSessions] = useLocalState('nx-sessions', () => [{ id: 'cur', name: deviceLabel(), place: 'This device', when: 'Active now', current: true }, ...SESSIONS_SEED]);
  const [f, setF] = useState({ cur: '', nw: '', cf: '' });
  const [er, setEr] = useState({});
  const [step, setStep] = useState(null); // null | 'setup' | 'codes'
  const [code, setCode] = useState(''), [codeErr, setCodeErr] = useState('');
  const [off, setOff] = useState(false);
  const sc = pwScore(f.nw);

  const submitPw = (e) => {
    e.preventDefault();
    const x = {};
    if (f.cur.length < 8) x.cur = 'Enter your current password.';
    if (f.nw.length < 8) x.nw = 'Use at least 8 characters.';
    else if (f.nw === f.cur) x.nw = 'Choose a different password from your current one.';
    else if (sc < 2) x.nw = 'Make it stronger: mix upper and lower case, numbers or symbols.';
    if (f.cf !== f.nw) x.cf = 'Passwords do not match.';
    setEr(x);
    if (Object.keys(x).length) { toast('Please fix the highlighted fields.', 'err'); return; }
    setSec({ ...sec, changed: Date.now() }); setF({ cur: '', nw: '', cf: '' });
    notify('Password changed', 'Demo only: passwords are never stored.', 'success');
    toast('Password updated (simulated)');
  };
  const verify = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) return setCodeErr('Enter the 6-digit code (any six digits work in this demo).');
    setSec({ ...sec, twofa: true, codes: makeCodes() }); setCode(''); setCodeErr(''); setStep('codes');
    notify('Two-factor authentication is on', 'Keep your recovery codes somewhere safe.', 'success');
  };
  const revoke = (id) => { setSessions(sessions.filter((s) => s.id !== id)); toast('Session signed out'); };

  return (
    <>
      <Box title="Password">
        <form onSubmit={submitPw} noValidate>
          <p className="note" style={{ marginTop: 0 }}>{sec.changed ? 'Last changed ' + ago(sec.changed) + '.' : 'Demo only: passwords are never stored.'}</p>
          <Pw label="Current password" value={f.cur} onChange={(e) => { setF({ ...f, cur: e.target.value }); setEr({ ...er, cur: '' }); }} error={er.cur} autoComplete="current-password" />
          <Pw label="New password" value={f.nw} onChange={(e) => { setF({ ...f, nw: e.target.value }); setEr({ ...er, nw: '' }); }} error={er.nw} hint={f.nw ? 'Strength: ' + PWL[sc] : 'At least 8 characters'} autoComplete="new-password" />
          {f.nw && <div className="meter" aria-hidden="true"><i className={'s' + sc} style={{ width: sc * 25 + '%' }} /></div>}
          <Pw label="Confirm new password" value={f.cf} onChange={(e) => { setF({ ...f, cf: e.target.value }); setEr({ ...er, cf: '' }); }} error={er.cf} autoComplete="new-password" />
          <Btn type="submit">Update password</Btn>
        </form>
      </Box>
      <Box title="Two-factor authentication" right={<Tag tone={sec.twofa ? '' : 'wn'}>{sec.twofa ? 'On' : 'Off'}</Tag>}>
        <div className="kv">
          <span><b>Authenticator app</b><small>Ask for a 6-digit code when you sign in on a new device.</small></span>
          <Switch label="Two-factor authentication" checked={sec.twofa} onChange={(on) => (on ? setStep('setup') : setOff(true))} />
        </div>
        {sec.twofa && <div className="kv"><span><b>Recovery codes</b><small>{sec.codes.length} unused codes</small></span><Btn v="sec" onClick={() => setStep('codes')}>View codes</Btn></div>}
      </Box>
      <Box title="Active sessions" right={<Btn v="sec" disabled={sessions.length < 2} onClick={() => { setSessions(sessions.filter((s) => s.current)); toast('Signed out of other sessions'); }}>Sign out others</Btn>}>
        {sessions.map((s) => (
          <div className="kv" key={s.id}><span><b>{s.name}</b>{s.current && <> <Tag>This device</Tag></>}<small>{s.place} · {s.when}</small></span>{!s.current && <button className="lk dg" onClick={() => revoke(s.id)}>Sign out</button>}</div>
        ))}
      </Box>
      <Box title="Recent sign-ins">
        <Table head={['When', 'Device', 'Location', 'Result']} rows={LOGINS.map((l) => [l[0], l[1], l[2], <Tag key="r" tone={l[3] === 'Blocked' ? 'err' : ''}>{l[3]}</Tag>])} />
      </Box>
      {step === 'setup' && (
        <Modal title="Set up two-factor authentication" onClose={() => setStep(null)}>
          <form onSubmit={verify} noValidate>
            <p className="note" style={{ marginTop: 0 }}>Demo only. In a real app you would scan a QR code. Use this sample key in your authenticator app, then enter any six digits.</p>
            <code className="code" style={{ marginBottom: 14 }}>NXRA 24DM 7K2Q</code>
            <Field label="6-digit code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => { setCode(e.target.value); setCodeErr(''); }} error={codeErr} autoFocus />
            <div className="cta"><Btn type="submit">Verify and turn on</Btn><Btn v="sec" onClick={() => setStep(null)}>Cancel</Btn></div>
          </form>
        </Modal>
      )}
      {step === 'codes' && (
        <Modal title="Recovery codes" onClose={() => setStep(null)}>
          <p className="note" style={{ marginTop: 0 }}>Each code works once. Store them somewhere safe. These are sample codes.</p>
          <code className="code" style={{ marginBottom: 16 }}>{sec.codes.join('\n')}</code>
          <div className="cta">
            <Btn v="sec" onClick={async () => toast((await copyText(sec.codes.join('\n'))) ? 'Codes copied' : 'Copy failed', 'ok')}>Copy</Btn>
            <Btn v="sec" onClick={() => downloadFile('orvexa-recovery-codes.txt', 'Orvexa demo recovery codes\n\n' + sec.codes.join('\n') + '\n')}>Download</Btn>
            <Btn onClick={() => setStep(null)}>Done</Btn>
          </div>
        </Modal>
      )}
      {off && <ConfirmDialog title="Turn off two-factor authentication?" danger confirmLabel="Turn off" onClose={() => setOff(false)} onConfirm={() => { setSec({ ...sec, twofa: false, codes: [] }); setOff(false); toast('Two-factor authentication is off'); }}>Your account will be less secure.</ConfirmDialog>}
    </>
  );
}
