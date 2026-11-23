import { R, useScrollReveal } from '../hooks/useScrollReveal';

// Shared layout for Privacy and Terms: heading, table of contents, sections.
export default function LegalPage({ title, updated, sections }) {
  const ref = useScrollReveal('legal');
  const jump = (i) => { const el = document.getElementById('sec-' + i); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return (
    <div ref={ref} className="pg">
      <div className="wrap ph">
        <h1 {...R(0)}>{title}</h1>
        <p {...R(1, 'lead')}>Last updated {updated}. Official terms and platform policies governing the Orvexa workspace.</p>
      </div>
      <div className="wrap legal">
        <nav className="toc" aria-label="On this page">{sections.map(([h], i) => <button key={i} onClick={() => jump(i)}>{h}</button>)}</nav>
        <article>{sections.flatMap(([h, p], i) => [<h2 key={'h' + i} id={'sec-' + i}>{h}</h2>, <p key={'p' + i}>{p}</p>])}</article>
      </div>
    </div>
  );
}
