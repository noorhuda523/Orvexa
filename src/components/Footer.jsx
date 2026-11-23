import { useApp } from '../context/AppContext';
import { FOOTER_COLS, ROUTES } from '../data/routes';

export default function Footer() {
  const { go } = useApp();
  return (
    <footer className="nx-footer">
      <div className="wrap fgrid">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <span className="footer-logo-dot" />
            <b>Orvexa</b>
          </div>
          <p>Orchestrate. Automate. Accelerate.</p>
        </div>
        {FOOTER_COLS.map(([title, keys]) => (
          <div key={title} className="footer-links-col">
            <b>{title}</b>
            {keys.map((k) => (
              <button key={k} className="fl" onClick={() => go(k)}>
                {ROUTES[k].label}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="wrap fine">© 2026 Orvexa. All rights reserved.</div>

      {/* Signature Giant Reference Watermark */}
      <div className="footer-watermark" aria-hidden="true">
        Orvexa
      </div>
    </footer>
  );
}
