import { Box, Chips } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { LuSun } from '../../components/Icon';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

export default function Appearance() {
  const { prefs, setPrefs, toast } = useApp();
  const set = (patch, msg) => { setPrefs({ ...prefs, ...patch }); toast(msg); };

  return (
    <>
      <Box title="Workspace Theme">
        <p className="note" style={{ marginTop: 0 }}>
          Orvexa is designed with an exclusive, high-contrast Light Theme for optimal clarity and focus.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="bdg info" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <LuSun size={13} style={{ marginRight: 6 }} />
            Permanent Light Theme Active
          </span>
        </div>
      </Box>
      <Box title="Density">
        <p className="note" style={{ marginTop: 0 }}>Compact fits more on screen in tables and lists.</p>
        <Chips items={['Comfortable', 'Compact']} value={cap(prefs.density)} onPick={(d) => set({ density: d.toLowerCase() }, d + ' density')} />
      </Box>
      <Box title="Text size">
        <Chips items={['Default', 'Large']} value={cap(prefs.fontsize)} onPick={(s) => set({ fontsize: s.toLowerCase() }, 'Text size: ' + s.toLowerCase())} />
      </Box>
      <Box title="Motion">
        <p className="note" style={{ marginTop: 0 }}>Reduce turns off animations, including scroll effects and canvas visuals.</p>
        <Chips items={['System', 'Reduce']} value={cap(prefs.motion)} onPick={(m) => set({ motion: m.toLowerCase() }, 'Motion: ' + m.toLowerCase())} />
      </Box>
    </>
  );
}
