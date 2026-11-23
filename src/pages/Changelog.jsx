import { CHANGELOG } from '../data/content';
import { R, useScrollReveal } from '../hooks/useScrollReveal';

export default function Changelog() {
  const ref = useScrollReveal('changelog');
  return (
    <div ref={ref} className="pg">
      <div className="wrap ph">
        <h1 {...R(0)}>Changelog</h1>
        <p {...R(1, 'lead')}>New features, improvements and fixes in Orvexa.</p>
      </div>
      <div className="wrap tl2">
        {CHANGELOG.map((r) => (
          <div key={r.v} {...R(0, 'rel')}>
            <div><h2>v{r.v}</h2><small>{r.d}</small></div>
            <ul>{r.items.map(([t, x], j) => <li key={j}><span className={'chg ' + t}>{t}</span><span>{x}</span></li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}
