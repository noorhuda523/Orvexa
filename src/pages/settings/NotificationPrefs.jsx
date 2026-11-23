import Switch from '../../components/Switch';
import { Box, Chips, Table } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { NOTIF_CATS, NOTIF_CHANNELS } from '../../data/content';
import useLocalState from '../../hooks/useLocalState';

const init = () => ({
  matrix: Object.fromEntries(NOTIF_CATS.flatMap((c) => NOTIF_CHANNELS.map((ch) => [c + '|' + ch, !(c === 'Product news' && ch === 'Push')]))),
  digest: 'Daily', quiet: { on: false, from: '22:00', to: '07:00' },
});

export default function NotificationPrefs() {
  const { toast } = useApp();
  const [p, setP] = useLocalState('nx-notifprefs', init);
  const flip = (c, ch) => { setP({ ...p, matrix: { ...p.matrix, [c + '|' + ch]: !p.matrix[c + '|' + ch] } }); toast('Preference saved'); };
  return (
    <>
      <Box title="Notification channels">
        <p className="note" style={{ marginTop: 0 }}>Choose how you hear about activity. Demo only: no emails or push messages are ever sent.</p>
        <div className="tw"><table className="mx">
          <thead><tr><th scope="col">Activity</th>{NOTIF_CHANNELS.map((ch) => <th key={ch} scope="col">{ch}</th>)}</tr></thead>
          <tbody>{NOTIF_CATS.map((c) => (
            <tr key={c}><th scope="row">{c}</th>{NOTIF_CHANNELS.map((ch) => <td key={ch}><Switch label={c + ' by ' + ch} checked={p.matrix[c + '|' + ch]} onChange={() => flip(c, ch)} /></td>)}</tr>
          ))}</tbody>
        </table></div>
      </Box>
      <Box title="Email digest">
        <Chips items={['Instant', 'Daily', 'Weekly']} value={p.digest} onPick={(d) => { setP({ ...p, digest: d }); toast('Digest set to ' + d.toLowerCase()); }} />
      </Box>
      <Box title="Quiet hours">
        <div className="kv"><span><b>Pause notifications</b><small>No alerts during these hours.</small></span><Switch label="Quiet hours" checked={p.quiet.on} onChange={(on) => { setP({ ...p, quiet: { ...p.quiet, on } }); toast(on ? 'Quiet hours on' : 'Quiet hours off'); }} /></div>
        {p.quiet.on && (
          <div className="frow" style={{ marginTop: 14 }}>
            <label className="fld"><span>From</span><input type="time" value={p.quiet.from} onChange={(e) => setP({ ...p, quiet: { ...p.quiet, from: e.target.value } })} /></label>
            <label className="fld"><span>To</span><input type="time" value={p.quiet.to} onChange={(e) => setP({ ...p, quiet: { ...p.quiet, to: e.target.value } })} /></label>
          </div>
        )}
      </Box>
    </>
  );
}
