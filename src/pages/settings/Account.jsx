import { useState } from 'react';
import { Btn } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Box, Field, Pw } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { LANGS, TIMEZONES } from '../../data/content';
import useLocalState from '../../hooks/useLocalState';
import { clearDemoData, readAcc } from '../../utils/storage';
import { EMAIL } from '../../utils/validation';

const opts = (a) => a.map((x) => <option key={x} value={x}>{x}</option>);

export default function Account() {
  const { user, profile, updateProfile, changeEmail, resetAppState, signOut, toast, notify } = useApp();
  const [pref, setPref] = useLocalState('nx-acctprefs', { lang: 'English', datefmt: 'DD/MM/YYYY', week: 'Monday' });
  const [emailOpen, setEmailOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [ne, setNe] = useState(''), [pw, setPw] = useState(''), [er, setEr] = useState({}), [typed, setTyped] = useState('');
  const zones = TIMEZONES.includes(profile.timezone) ? TIMEZONES : [profile.timezone, ...TIMEZONES];
  const save = (k) => (e) => { setPref({ ...pref, [k]: e.target.value }); toast('Preference saved'); };

  const saveEmail = (e) => {
    e.preventDefault();
    const x = {}, v = ne.trim().toLowerCase();
    if (!EMAIL.test(v)) x.ne = 'Enter a valid email, like name@company.com.';
    else if (v === user.email) x.ne = 'That is already your email.';
    else if (readAcc().some((a) => a.email === v)) x.ne = 'Another demo account already uses that email.';
    if (pw.length < 8) x.pw = 'Enter your password (at least 8 characters).';
    setEr(x);
    if (Object.keys(x).length) return;
    changeEmail(v); setEmailOpen(false); setNe(''); setPw('');
    notify('Email address changed', 'Your sign-in email is now ' + v + '.', 'success');
    toast('Email updated');
  };
  const del = () => { clearDemoData(); resetAppState(); setDelOpen(false); signOut(); toast('Your demo account was deleted.'); };

  return (
    <>
      <Box title="Email address">
        <div className="kv"><span><b>{user.email}</b><small>You sign in with this address. Demo only: no email is ever sent.</small></span><Btn v="sec" onClick={() => { setEmailOpen(true); setEr({}); }}>Change email</Btn></div>
      </Box>
      <Box title="Regional preferences">
        <div className="frow">
          <Field label="Language" as="select" value={pref.lang} onChange={save('lang')} hint="The demo interface is English only.">{opts(LANGS)}</Field>
          <Field label="Timezone" as="select" value={profile.timezone} onChange={(e) => { updateProfile({ timezone: e.target.value }); toast('Timezone saved'); }}>{opts(zones)}</Field>
        </div>
        <div className="frow">
          <Field label="Date format" as="select" value={pref.datefmt} onChange={save('datefmt')}>{opts(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'])}</Field>
          <Field label="First day of the week" as="select" value={pref.week} onChange={save('week')}>{opts(['Monday', 'Sunday', 'Saturday'])}</Field>
        </div>
      </Box>
      <Box title="Danger zone">
        <div className="kv"><span><b>Delete account</b><small>Removes your demo account and all data saved in this browser.</small></span><Btn v="dng" onClick={() => { setDelOpen(true); setTyped(''); }}>Delete account</Btn></div>
      </Box>
      {emailOpen && (
        <Modal title="Change email" onClose={() => setEmailOpen(false)}>
          <form onSubmit={saveEmail} noValidate>
            <Field label="New email" type="email" value={ne} onChange={(e) => { setNe(e.target.value); setEr({ ...er, ne: '' }); }} error={er.ne} autoFocus />
            <Pw label="Confirm with your password" value={pw} onChange={(e) => { setPw(e.target.value); setEr({ ...er, pw: '' }); }} error={er.pw} hint="Demo only: your password is not stored or checked." autoComplete="current-password" />
            <div className="cta"><Btn type="submit">Update email</Btn><Btn v="sec" onClick={() => setEmailOpen(false)}>Cancel</Btn></div>
          </form>
        </Modal>
      )}
      {delOpen && (
        <Modal title="Delete your account?" onClose={() => setDelOpen(false)}>
          <p className="note" style={{ marginTop: 0 }}>This removes your tasks, workflows, team, profile and settings from this browser, then signs you out.</p>
          <Field label="Type DELETE to confirm" value={typed} onChange={(e) => setTyped(e.target.value)} />
          <div className="cta"><Btn v="dng" disabled={typed !== 'DELETE'} onClick={del}>Delete account</Btn><Btn v="sec" onClick={() => setDelOpen(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </>
  );
}
