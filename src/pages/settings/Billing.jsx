import { useState } from 'react';
import { Btn } from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import { Badge, Box, Chips, EmptyState, Field, Table, Tag } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { PLAN_LIMITS, PRICE } from '../../data/content';
import useLocalState from '../../hooks/useLocalState';
import { downloadFile } from '../../utils/browser';
import { lsSet, readPlan, readTasks, readTeam, readWf } from '../../utils/storage';
import { cardBrand, expiryOk, luhn } from '../../utils/validation_extra';

const YR = 'Yearly: 2 months free';
const PLANS = Object.keys(PRICE);
const Meter = ({ label, used, limit }) => {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return (
    <div>
      <div className="kv" style={{ padding: 0, border: 0 }}><span>{label}</span><small>{used}{limit ? ' / ' + limit : ' · Unlimited'}</small></div>
      {limit ? <div className={'bar' + (pct >= 100 ? ' hi' : '')} role="progressbar" aria-label={label} aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit}><i style={{ width: pct + '%' }} /></div> : null}
    </div>
  );
};

export default function Billing() {
  const { user, updateUser, notify, toast } = useApp();
  const plan = user.plan || readPlan();
  const [yr, setYr] = useState(true);
  const [target, setTarget] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [card, setCard] = useLocalState('nx-card', () => ({ brand: 'Visa', last4: '4242', exp: '08/28', name: user.name }));
  const [cf, setCf] = useState({ name: '', num: '', exp: '', cvc: '' }), [er, setEr] = useState({});
  const seats = 1 + readTeam(plan).length, tasks = readTasks().length, flows = readWf().length;
  const lim = PLAN_LIMITS[plan], price = PRICE[plan][yr ? 1 : 0];

  const blockers = (name) => {
    const l = PLAN_LIMITS[name], b = [];
    if (l.seats && seats > l.seats) b.push('You have ' + seats + ' team members, but ' + name + ' includes ' + l.seats + '. Remove ' + (seats - l.seats) + ' first.');
    if (l.workflows && flows > l.workflows) b.push('You have ' + flows + ' workflows, but ' + name + ' allows ' + l.workflows + '.');
    if (l.tasks && tasks > l.tasks) b.push('You have ' + tasks + ' tasks, but ' + name + ' allows ' + l.tasks + '.');
    return b;
  };
  const change = () => {
    lsSet('nx-plan', target); updateUser({ plan: target });
    notify('Plan changed to ' + target, 'Billing is simulated. Nothing was charged.', 'success', 'app-settings');
    toast('You are now on the ' + target + ' plan (simulated)'); setTarget(null);
  };
  const saveCard = (e) => {
    e.preventDefault();
    const x = {};
    if (!cf.name.trim()) x.name = 'Enter the name on the card.';
    if (!luhn(cf.num)) x.num = 'Enter a valid card number. The test number 4242 4242 4242 4242 works.';
    if (!expiryOk(cf.exp)) x.exp = 'Use a future date as MM/YY.';
    if (!/^\d{3,4}$/.test(cf.cvc)) x.cvc = '3 or 4 digits.';
    setEr(x);
    if (Object.keys(x).length) return;
    const d = cf.num.replace(/\D/g, '');
    setCard({ brand: cardBrand(d), last4: d.slice(-4), exp: cf.exp.replace(/\s/g, ''), name: cf.name.trim() });
    setCardOpen(false); setCf({ name: '', num: '', exp: '', cvc: '' }); toast('Payment method updated (nothing was stored except the last 4 digits)');
  };
  const invoices = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
    const id = 'INV-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + '-' + (1006 - i);
    return { id, date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), amount: '$' + (PRICE[plan][0] * seats).toFixed(2) };
  });
  const download = (inv) => downloadFile(inv.id + '.txt', ['ORVEXA (portfolio demo)', 'Invoice ' + inv.id, 'Date: ' + inv.date, 'Billed to: ' + user.name + ' <' + user.email + '>', 'Plan: ' + plan + ' x ' + seats + ' seat(s)', 'Amount: ' + inv.amount, 'Status: Paid', '', 'This is a sample document. No payment was taken.'].join('\n'));
  const blocked = target ? blockers(target) : [];

  return (
    <>
      <Box title="Current plan" right={<Badge>{plan}</Badge>}>
        <div className="kv"><span><b>{plan} plan</b><small>{price ? '$' + price + ' per seat per month' + (yr ? ', billed yearly' : '') : 'Free forever'}</small></span><Chips items={['Monthly', YR]} value={yr ? YR : 'Monthly'} onPick={(v) => setYr(v !== 'Monthly')} /></div>
        <div className="usage" style={{ marginTop: 14 }}>
          <Meter label="Tasks" used={tasks} limit={lim.tasks} />
          <Meter label="Workflows" used={flows} limit={lim.workflows} />
          <Meter label="Team seats" used={seats} limit={lim.seats} />
        </div>
      </Box>
      <Box title="Change plan">
        <div className="plans2">
          {PLANS.map((n) => (
            <div key={n} className={'pc' + (n === plan ? ' cur' : '')}>
              <span>{n}</span>
              <b>${PRICE[n][yr ? 1 : 0]}<small> / seat / mo</small></b>
              <small style={{ color: 'var(--muted)' }}>{PLAN_LIMITS[n].seats} seat{PLAN_LIMITS[n].seats > 1 ? 's' : ''} max{PLAN_LIMITS[n].workflows ? ', ' + PLAN_LIMITS[n].workflows + ' flows' : ', unlimited flows'}</small>
              {n === plan ? <Btn v="sec" disabled>Current plan</Btn> : <Btn v={PLANS.indexOf(n) > PLANS.indexOf(plan) ? 'pri' : 'sec'} onClick={() => setTarget(n)}>{PLANS.indexOf(n) > PLANS.indexOf(plan) ? 'Upgrade' : 'Downgrade'}</Btn>}
            </div>
          ))}
        </div>
      </Box>
      <Box title="Payment method" right={<Badge>Simulated</Badge>}>
        <div className="kv"><span><b>{card.brand} ending in {card.last4}</b><small>Expires {card.exp} · {card.name}</small></span><Btn v="sec" onClick={() => { setCardOpen(true); setEr({}); }}>Update card</Btn></div>
      </Box>
      <Box title="Invoices">
        {plan === 'Starter' ? <EmptyState title="No invoices on the free plan" text="Upgrade to a paid plan to see monthly invoices here." /> : (
          <Table head={['Invoice', 'Date', 'Amount', 'Status', <span key="a" className="sr">Download</span>]} rows={invoices.map((i) => [i.id, i.date, i.amount, <Tag key="s">Paid</Tag>, <button key="d" className="lk" aria-label={'Download ' + i.id} onClick={() => download(i)}>Download</button>])} />
        )}
      </Box>
      {target && (
        <ConfirmDialog title={(PLANS.indexOf(target) > PLANS.indexOf(plan) ? 'Upgrade' : 'Downgrade') + ' to ' + target + '?'} confirmLabel={blocked.length ? 'Not available' : 'Confirm change'} onClose={() => setTarget(null)} onConfirm={blocked.length ? () => setTarget(null) : change}>
          {blocked.length ? blocked.map((b) => <p key={b} style={{ margin: '0 0 8px' }}>{b}</p>) : 'Billing is simulated: nothing will be charged. Your plan limits update straight away.'}
        </ConfirmDialog>
      )}
      {cardOpen && (
        <Modal title="Update payment method" onClose={() => setCardOpen(false)}>
          <form onSubmit={saveCard} noValidate>
            <Field label="Name on card" value={cf.name} onChange={(e) => setCf({ ...cf, name: e.target.value })} error={er.name} autoComplete="cc-name" />
            <Field label="Card number" inputMode="numeric" placeholder="4242 4242 4242 4242" value={cf.num} onChange={(e) => setCf({ ...cf, num: e.target.value.replace(/[^\d ]/g, '').slice(0, 23) })} error={er.num} autoComplete="cc-number" />
            <div className="frow">
              <Field label="Expiry (MM/YY)" placeholder="08/29" value={cf.exp} onChange={(e) => setCf({ ...cf, exp: e.target.value })} error={er.exp} autoComplete="cc-exp" />
              <Field label="CVC" inputMode="numeric" maxLength={4} value={cf.cvc} onChange={(e) => setCf({ ...cf, cvc: e.target.value.replace(/\D/g, '') })} error={er.cvc} autoComplete="cc-csc" />
            </div>
            <p className="note" style={{ marginTop: 0 }}>Demo only. Do not enter a real card. Only the brand and last 4 digits are kept in this browser.</p>
            <div className="cta"><Btn type="submit">Save card</Btn><Btn v="sec" onClick={() => setCardOpen(false)}>Cancel</Btn></div>
          </form>
        </Modal>
      )}
    </>
  );
}
