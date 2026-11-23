Place your licensed Allegra font files here:
- allegra.woff2
- allegra.woff
- allegra.ttf

The CSS @font-face definition in src/styles/global.css is pre-configured to automatically load:
  url('/fonts/allegra.woff2') format('woff2'),
  url('/fonts/allegra.woff') format('woff'),
  url('/fonts/allegra.ttf') format('truetype');

Primary hero headings across all website pages and dashboard views are styled with:
  font-family: var(--font-hero, 'Allegra', 'Plus Jakarta Sans', sans-serif);
