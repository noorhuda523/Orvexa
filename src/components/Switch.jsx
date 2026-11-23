// Accessible on/off switch (role="switch").
export default function Switch({ checked, onChange, label, disabled }) {
  return <button type="button" className="sw" role="switch" aria-checked={!!checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} />;
}
