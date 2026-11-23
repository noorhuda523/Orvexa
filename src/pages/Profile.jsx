import { useMemo, useRef, useState } from 'react';
import { Btn } from '../components/Button';
import { Avatar, Badge, Box, Field } from '../components/ui';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { COLORS } from '../data/demoData';
import { TIMEZONES } from '../data/content';
import { imageToDataUrl } from '../utils/browser';
import { readTasks, readWf } from '../utils/storage';
import { validateProfile } from '../utils/validation_extra';

const LINKS = [['website', 'Website', 'https://yourname.dev'], ['github', 'GitHub', 'https://github.com/username'], ['linkedin', 'LinkedIn', 'https://linkedin.com/in/username'], ['twitter', 'X / Twitter', 'https://x.com/username']];

export default function Profile() {
  const toast = useToast();
  const { user, profile, updateUser, updateProfile } = useApp();
  const base = useMemo(() => ({
    name: user.name || '', color: user.color || COLORS[0][0], role: profile.role, company: profile.company, location: profile.location,
    timezone: profile.timezone, bio: profile.bio, website: profile.website, github: profile.github, linkedin: profile.linkedin,
    twitter: profile.twitter, skills: profile.skills, avatar: profile.avatar,
  }), [user, profile]);
  const [v, setV] = useState(base);
  const [er, setEr] = useState({});
  const [skill, setSkill] = useState('');
  const [upErr, setUpErr] = useState('');
  const fileRef = useRef(null);
  const dirty = JSON.stringify(v) !== JSON.stringify(base);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); if (er[k]) setEr({ ...er, [k]: '' }); };
  const zones = TIMEZONES.includes(v.timezone) ? TIMEZONES : [v.timezone, ...TIMEZONES];

  const addSkill = () => {
    const s = skill.trim().replace(/,+$/, '');
    if (!s) return;
    if (s.length > 24) return setEr({ ...er, skills: 'Skills can be up to 24 characters.' });
    if (v.skills.length >= 10) return setEr({ ...er, skills: 'You can add up to 10 skills.' });
    if (!v.skills.some((x) => x.toLowerCase() === s.toLowerCase())) setV({ ...v, skills: [...v.skills, s] });
    setSkill(''); setEr({ ...er, skills: '' });
  };
  const onFile = async (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    if (!f) return;
    try { const url = await imageToDataUrl(f); setV((cur) => ({ ...cur, avatar: url })); setUpErr(''); } catch (err) { setUpErr(err.message); }
  };
  const save = (e) => {
    e.preventDefault();
    const x = validateProfile(v); setEr(x);
    if (Object.keys(x).length) { toast('Please fix the highlighted fields.', 'err'); return; }
    const { name, color, ...rest } = v;
    updateUser({ name: name.trim(), color });
    updateProfile({ ...rest, role: rest.role.trim(), company: rest.company.trim(), location: rest.location.trim(), bio: rest.bio.trim() });
    toast('Profile saved');
  };

  const checks = [
    ['Add your name', !!base.name.trim()], ['Upload a photo', !!base.avatar], ['Add your role', !!base.role.trim()],
    ['Write a short bio (20+ characters)', base.bio.trim().length >= 20], ['Add a link', !!(base.website || base.github || base.linkedin || base.twitter)], ['Add three skills', base.skills.length >= 3],
  ];
  const pct = Math.round((checks.filter((c) => c[1]).length / checks.length) * 100);
  const tasksDone = readTasks().filter((t) => t.status === 'done').length;
  const since = new Date(profile.since || Date.now()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  return (
    <div className="pg apppg profx">
      <div className="pcover">
        <Avatar name={v.name} color={v.color} src={v.avatar} size={88} />
        <div>
          <h2>{v.name.trim() || 'Your name'}</h2>
          <p>{[v.role.trim(), v.company.trim() && 'at ' + v.company.trim()].filter(Boolean).join(' ') || 'Add your role'}{v.location.trim() ? ' · ' + v.location.trim() : ''}</p>
          <div className="cta"><Badge>{(user.plan || 'Starter') + ' plan'}</Badge><Badge>{'Member since ' + since}</Badge></div>
        </div>
      </div>
      <div className="pgrid">
        <form className="pform" onSubmit={save} noValidate>
          <Box title="Photo">
            <div className="upl">
              <Avatar name={v.name} color={v.color} src={v.avatar} size={64} />
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} aria-label="Upload photo" />
              <Btn v="sec" onClick={() => fileRef.current.click()}>Upload photo</Btn>
              {v.avatar && <Btn v="sec" onClick={() => setV({ ...v, avatar: '' })}>Remove photo</Btn>}
            </div>
            {upErr && <p className="err" role="alert">{upErr}</p>}
            <p className="tl">Avatar colour (used when there is no photo)</p>
            <div className="swatches" role="radiogroup" aria-label="Avatar colour">
              {COLORS.map(([c, l]) => <button key={c} type="button" role="radio" aria-checked={v.color === c} aria-label={l} title={l} className={'swt' + (v.color === c ? ' on' : '')} style={{ background: c }} onClick={() => setV({ ...v, color: c })} />)}
            </div>
            <p className="note" style={{ margin: 0 }}>Photos are resized and kept only in this browser.</p>
          </Box>
          <Box title="About you">
            <Field label="Display name" value={v.name} onChange={set('name')} error={er.name} autoComplete="name" />
            <div className="frow">
              <Field label="Role" value={v.role} onChange={set('role')} error={er.role} hint="For example Product designer" />
              <Field label="Company" value={v.company} onChange={set('company')} error={er.company} />
            </div>
            <div className="frow">
              <Field label="Location" value={v.location} onChange={set('location')} error={er.location} hint="City and country" />
              <Field label="Timezone" as="select" value={v.timezone} onChange={set('timezone')}>{zones.map((z) => <option key={z} value={z}>{z.replace('_', ' ')}</option>)}</Field>
            </div>
            <Field label="Bio" as="textarea" value={v.bio} onChange={set('bio')} error={er.bio} hint={v.bio.length + ' / 200'} />
            <Field label="Email" value={user.email} readOnly hint="Change your email under Settings, then Account." />
          </Box>
          <Box title="Links">
            {LINKS.map(([k, label, ph]) => <Field key={k} label={label} type="url" placeholder={ph} value={v[k]} onChange={set(k)} error={er[k]} />)}
          </Box>
          <Box title="Skills">
            <Field label="Add a skill" value={skill} onChange={(e) => setSkill(e.target.value)} error={er.skills} hint="Press Enter to add, up to 10"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); } }} />
            {v.skills.length > 0 && <div className="skills">{v.skills.map((s) => <span className="skill" key={s}>{s}<button type="button" aria-label={'Remove ' + s} onClick={() => setV({ ...v, skills: v.skills.filter((x) => x !== s) })}>×</button></span>)}</div>}
          </Box>
          <div className="savebar">
            <span>{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</span>
            <Btn v="sec" disabled={!dirty} onClick={() => { setV(base); setEr({}); setUpErr(''); }}>Discard</Btn>
            <Btn type="submit" disabled={!dirty}>Save changes</Btn>
          </div>
        </form>
        <aside className="pside">
          <Box title="Profile strength" right={<Badge>{pct + '%'}</Badge>}>
            <div className="bar" role="progressbar" aria-label="Profile strength" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><i style={{ width: pct + '%' }} /></div>
            <ul className="todo">{checks.map(([l, d]) => <li key={l} className={d ? 'done' : ''}>{l}</li>)}</ul>
          </Box>
          <Box title="Public preview" right={<Badge>Preview</Badge>}>
            <div className="pvw">
              <Avatar name={v.name} color={v.color} src={v.avatar} size={56} />
              <h4>{v.name.trim() || 'Your name'}</h4>
              <p>{[v.role.trim(), v.company.trim()].filter(Boolean).join(' at ') || 'Role and company'}</p>
              {v.location.trim() && <p>{v.location.trim()}</p>}
              {v.bio.trim() && <p style={{ color: 'var(--text)' }}>{v.bio.trim()}</p>}
              {v.skills.length > 0 && <div className="skills" style={{ margin: 0 }}>{v.skills.map((s) => <span className="skill ro" key={s}>{s}</span>)}</div>}
              {LINKS.filter(([k]) => v[k]).map(([k, l]) => <span className="lnk2" key={k}>{l}: {v[k]}</span>)}
            </div>
          </Box>
          <Box title="Your activity">
            <div className="kv"><span>Tasks completed</span><b>{tasksDone}</b></div>
            <div className="kv"><span>Workflows</span><b>{readWf().length}</b></div>
            <div className="kv"><span>Member since</span><b>{since}</b></div>
          </Box>
        </aside>
      </div>
    </div>
  );
}
