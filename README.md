# Nexora

A frontend-only SaaS portfolio project: marketing site, auth screens and a full demo app (dashboard, tasks, workflows, team, notifications, help center, profile and eight settings sections).
Built with **React 18, Vite, React Router 6 and Three.js**. There is **no backend and no database**: everything is demo data and `localStorage`.

> Nothing here is real. Sign-in is a demo session, passwords are never stored, payments, emails, integrations and workflow runs are simulated, and everything you enter stays in your own browser.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
```

Requires Node 18+. `npm install` creates `package-lock.json`; commit it. Try the app with **Continue as demo user** on the sign-in page (Pro plan, sample team and data).

## Routes

| Path | Page | Layout |
|---|---|---|
| `/` `/features` `/solutions` `/pricing` `/about` `/contact` | marketing pages | `MarketingLayout` |
| `/changelog` `/privacy` `/terms` | changelog and legal pages | `MarketingLayout` |
| `/signin` `/signup` | demo auth (redirects to `/app` if signed in) | `AuthLayout` |
| `/app` | dashboard | `DashboardLayout` (needs a demo session) |
| `/app/tasks` `/app/workflows` | task list and board, workflow builder with simulated runs | |
| `/app/team` | members, invitations, roles, seat limits by plan | |
| `/app/notifications` | inbox (also the bell in the top bar) | |
| `/app/help` | searchable help center and support requests | |
| `/app/profile` | photo upload, bio, links, skills, profile strength, public preview | |
| `/app/settings/…` | `account`, `security`, `notifications`, `appearance`, `billing`, `integrations`, `api`, `data` (each has its own URL) | |
| anything else | `NotFound` | |

## What the settings do

| Section | Functional parts |
|---|---|
| Account | change email (also updates the demo account list), language / timezone / date format, delete account (type DELETE) |
| Security | change password with strength meter, two-factor setup with recovery codes (copy / download), active sessions, sign-in history |
| Notifications | channel matrix (email / push / in-app), digest, quiet hours |
| Appearance | theme Light / Dark / System, density, text size, reduced motion. Applied app-wide and remembered |
| Billing | plan usage meters, upgrade / downgrade with limit checks, card form (Luhn, expiry, CVC; only brand and last 4 digits kept), invoices you can download |
| Integrations | connect / disconnect six services with a simulated authorization step |
| API keys | create (full key shown once, copy to clipboard), revoke |
| Data & privacy | export everything as JSON, reset sample data, clear all data, privacy switches |

## Structure

```
src/
  main.jsx, App.jsx          providers + route table
  layouts/                   MarketingLayout, AuthLayout, DashboardLayout (sidebar shell, route guard)
  pages/                     one file per route; pages/settings/ holds the eight settings panels
  components/                Navbar, Footer, ThemeToggle, Button, Modal, AuroraBackground
                             + ui.jsx (Field, Badge, Table, Chips, Dropdown, Card...), Switch, ConfirmDialog,
                               NotificationBell, LegalPage, Toast, AuthForm, SkipLink
  context/AppContext.jsx     demo session, profile, notifications, appearance, navigation (useApp())
  hooks/                     useTheme, useScrollReveal, usePageMeta, useLocalState
  three/HeroSphere.jsx       the 3D hero (lazy-loaded from Home, so other pages never download Three.js)
  data/                      demoData.js (sample tasks, workflows, runs), content.js (team, notifications, FAQ, changelog, legal text), routes.js
  utils/                     storage.js (all localStorage access), dates.js, validation.js, validation_extra.js, browser.js (download, clipboard, image resize), dom.js
  styles/                    variables.css (light/dark tokens), global.css, product.css, aurora.css, animations.css
public/                      favicon.svg, _redirects (Netlify SPA fallback), images/
```

## How the main pieces work

- **Theme**: `index.html` applies the saved theme before first paint; `useTheme` supports light, dark and system. All colours are tokens in `variables.css`.
- **Scroll reveal**: elements get `R(i)` props; `useScrollReveal` toggles `.on` with an `IntersectionObserver`, so animations replay every time an element re-enters view. Reduced motion (OS setting or *Settings → Appearance*) is respected.
- **Aurora**: pure CSS in `aurora.css`. `<AuroraBackground/>` sets `data-aurora="on"` on `<html>` for marketing and auth pages; the app layout does not render it.
- **Demo session and profile**: `AppContext` + `utils/storage.js` + `hooks/useLocalState`. The password is only length-checked and never stored.
- **localStorage keys** (all prefixed `nx-`): `accounts`, `acctprefs`, `apikeys`, `appearance`, `card`, `integrations`, `messages`, `notifprefs`, `notifs`, `plan`, `privacy`, `profile`, `sbmin`, `security`, `sessions`, `tasks`, `taskview`, `team`, `theme`, `tickets`, `user`, `workflows`. *Settings → Data & privacy* exports, resets or clears them.
- **Three.js**: colour management is switched off so the sphere keeps its original colours. If WebGL is unavailable the CSS orb is shown instead.

## Deploying

- **Netlify**: build command `npm run build`, publish directory `dist`. `public/_redirects` makes deep links like `/pricing` work.
- **Hosts without rewrite rules**: swap `BrowserRouter` for `HashRouter` in `src/main.jsx` (one line); routes then look like `/#/pricing`.

## Code style note

Components that came from the original single-file build use `React.createElement` (`const h = React.createElement`) instead of JSX. Files written later (layouts, `App`, navbar, context, the new pages and all settings panels) use JSX. Both are plain React and can be mixed.

## Verification status

Checked in a sandbox without network access: the project was bundled with esbuild and exercised in headless Chromium (179 checks) in both development (StrictMode, React warnings) and production mode. The checks cover every route and deep link, the route guard, 404s, theme and system theme, scroll-reveal replay, sign-up to dashboard, tasks, workflows, team invites and seat limits, notifications, help requests, profile photo / bio / links / skills, all eight settings sections (including file downloads and clipboard copy), account deletion, browser back/forward, the mobile menu, **layout at 390px and 360px phone widths**, reduced motion, and no console errors. Screenshots of the new screens were also reviewed by eye.
**Not run there:** `npm install`, `vite build`, and real `react-router-dom` / `three` (they could not be downloaded; the test used minimal stand-ins, and the sphere was checked only through its CSS fallback). Run `npm install && npm run build` once on your machine and open the sphere in a real browser.
