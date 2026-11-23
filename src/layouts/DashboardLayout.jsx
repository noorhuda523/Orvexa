import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Btn } from '../components/Button';
import { Modal, Overlay } from '../components/Modal';
import NotificationBell from '../components/NotificationBell';
import SkipLink from '../components/SkipLink';
import { Avatar, CloseBtn } from '../components/ui';
import { useApp } from '../context/AppContext';
import { routeFor } from '../data/routes';
import usePageMeta from '../hooks/usePageMeta';
import { lsGet, lsSet, readTasks, readWf } from '../utils/storage';
import { SPRING } from '../motion/variants';
import { ScrollToTopButton } from '../components/ScrollControls';
import { LuSparkles, LuBot, LuFileText } from 'react-icons/lu';
import AICopilotModal from '../components/ai/AICopilotModal';
import ProfileDropdown from '../components/ProfileDropdown';

export default function DashboardLayout() {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return <Shell />;
}

function Shell() {
  const { user, profile, unread, go, signOut } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const route = routeFor(location.pathname);
  const mainRef = usePageMeta();

  const [open, setOpen] = useState(false);
  const [conf, setConf] = useState(false);
  const [min, setMin] = useState(() => lsGet('nx-sbmin') === '1');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const toggleMin = () => {
    const next = !min;
    setMin(next);
    lsSet('nx-sbmin', next ? '1' : '0');
  };

  // Keyboard shortcut Ctrl+K for Search, Ctrl+J for AI Copilot
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setCopilotOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const NAV_SECTIONS = [
    {
      title: 'WORKSPACE',
      items: [
        {
          key: 'app-dashboard',
          label: 'Dashboard',
          tooltip: 'Your workspace at a glance.',
          path: '/app',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          ),
        },
        {
          key: 'app-tasks',
          label: 'Tasks',
          path: '/app/tasks',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
            </svg>
          ),
        },
        {
          key: 'app-workflows',
          label: 'Workflows',
          path: '/app/workflows',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="6" height="6" rx="1" />
              <rect x="15" y="15" width="6" height="6" rx="1" />
              <path d="M9 6h6a3 3 0 0 1 3 3v6" />
            </svg>
          ),
        },
        {
          key: 'app-analytics',
          label: 'Analytics',
          tooltip: 'Understand performance. Discover trends. Make better decisions.',
          path: '/app/analytics',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'AI WORKSPACE',
      items: [
        {
          key: 'app-agents',
          label: 'AI Agents',
          tooltip: 'Autonomous AI Agents Studio',
          path: '/app/agents',
          icon: <LuBot size={18} />,
        },
        {
          key: 'app-playground',
          label: 'Playground',
          tooltip: 'Interactive AI Playground & Prompt Studio',
          path: '/app/playground',
          icon: <LuSparkles size={18} />,
        },
        {
          key: 'app-content-generator',
          label: 'Content Studio',
          tooltip: 'AI Content & Copy Generator',
          path: '/app/content-generator',
          icon: <LuFileText size={18} />,
        },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          key: 'app-integrations',
          label: 'Integrations',
          path: '/app/integrations',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
            </svg>
          ),
        },
        {
          key: 'app-team',
          label: 'Team',
          path: '/app/team',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        },
        {
          key: 'app-notifications',
          label: 'Notifications',
          path: '/app/notifications',
          badge: unread > 0 ? unread : null,
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        {
          key: 'app-settings',
          label: 'Settings',
          path: '/app/settings',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Command palette items
  const commandResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const pages = [
      { name: 'Dashboard', path: '/app', cat: 'Navigation' },
      { name: 'Workflows & Automation', path: '/app/workflows', cat: 'Navigation' },
      { name: 'Tasks Board & List', path: '/app/tasks', cat: 'Navigation' },
      { name: 'Analytics & Telemetry', path: '/app/analytics', cat: 'Navigation' },
      { name: 'AI Agents Studio', path: '/app/agents', cat: 'AI' },
      { name: 'AI Playground', path: '/app/playground', cat: 'AI' },
      { name: 'AI Content Studio', path: '/app/content-generator', cat: 'AI' },
      { name: 'Connected Integrations', path: '/app/integrations', cat: 'Navigation' },
      { name: 'Team & Permissions', path: '/app/team', cat: 'Navigation' },
      { name: 'Notifications Center', path: '/app/notifications', cat: 'Navigation' },
      { name: 'Account Settings', path: '/app/settings', cat: 'Settings' },
      { name: 'Security & 2FA', path: '/app/settings/security', cat: 'Settings' },
      { name: 'Billing & Subscription', path: '/app/settings/billing', cat: 'Settings' },
      { name: 'API Keys', path: '/app/settings/api', cat: 'Settings' },
      { name: 'Help & Documentation', path: '/app/help', cat: 'Support' },
      { name: 'User Profile', path: '/app/profile', cat: 'Profile' },
    ];

    if (!q) return pages.slice(0, 8);
    return pages.filter((p) => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
  }, [searchQuery]);

  // Dynamic breadcrumb label
  const breadcrumb = useMemo(() => {
    if (location.pathname === '/app') return 'Dashboard';
    if (location.pathname.startsWith('/app/workflows')) return 'Workflows';
    if (location.pathname.startsWith('/app/tasks')) return 'Tasks';
    if (location.pathname.startsWith('/app/analytics')) return 'Analytics';
    if (location.pathname.startsWith('/app/agents')) return 'AI Agents';
    if (location.pathname.startsWith('/app/playground')) return 'AI Playground';
    if (location.pathname.startsWith('/app/content-generator')) return 'Content Studio';
    if (location.pathname.startsWith('/app/integrations')) return 'Integrations';
    if (location.pathname.startsWith('/app/team')) return 'Team';
    if (location.pathname.startsWith('/app/notifications')) return 'Notifications';
    if (location.pathname.startsWith('/app/help')) return 'Help Center';
    if (location.pathname.startsWith('/app/profile')) return 'Profile';
    if (location.pathname.startsWith('/app/settings')) return 'Settings';
    return 'Workspace';
  }, [location.pathname]);

  const renderNavSection = (sec) => (
    <div key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}>
      {!min && (
        <div
          style={{
            padding: '6px 14px 4px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#74758A',
            letterSpacing: '0.06em',
            userSelect: 'none',
          }}
        >
          {sec.title}
        </div>
      )}
      {sec.items.map((item) => {
        const active = item.path === '/app'
          ? location.pathname === '/app'
          : location.pathname.startsWith(item.path);

        return (
          <button
            key={item.key}
            className={'nx-sidebar-nav-item' + (active ? ' active' : '')}
            aria-current={active ? 'page' : undefined}
            title={item.tooltip || item.label}
            onClick={() => {
              setOpen(false);
              navigate(item.path);
            }}
          >
            <span className="nx-nav-icon">{item.icon}</span>
            {!min && <span className="nx-nav-label">{item.label}</span>}
            {item.badge && !min && (
              <span className="nx-nav-unread-badge">{item.badge}</span>
            )}
            {active && (
              <motion.span
                className="nx-sidebar-active-indicator"
                layoutId="sidebar-active"
                transition={SPRING.smooth}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={'app nx-app-shell' + (min ? ' min' : '')}>
      <SkipLink />

      {/* Modern SaaS Light Sidebar */}
      <motion.aside
        className="nx-app-sidebar"
        animate={{ width: min ? 72 : 248 }}
        transition={SPRING.smooth}
      >
        {/* Brand Header */}
        <div className="nx-sb-brand-header">
          <div
            className="nx-sb-brand"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            title="Go to Orvexa Homepage"
            aria-label="Orvexa Home"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/');
              }
            }}
            style={{
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.82';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div className="nx-sb-logo-circle">
              <span>O</span>
            </div>
            {!min && (
              <div className="nx-sb-logo-text">
                <span className="nx-sb-brand-title">Orvexa</span>
                <span className="nx-sb-workspace-pill">Pro Workspace</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="nx-sb-collapse-toggle"
            onClick={toggleMin}
            title={min ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {min ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        </div>

        {/* Navigation Section */}
        <nav aria-label="Main Navigation" className="nx-sb-nav-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {NAV_SECTIONS.map(renderNavSection)}
        </nav>

        <div className="grow" />

        {/* Help Center link */}
        <div className="nx-sb-secondary-links">
          <button
            type="button"
            className={'nx-sidebar-nav-item' + (location.pathname.startsWith('/app/help') ? ' active' : '')}
            onClick={() => navigate('/app/help')}
            title="Help Center"
          >
            <span className="nx-nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            {!min && <span className="nx-nav-label">Help Center</span>}
          </button>
        </div>

        {/* Upgrade to Pro Card */}
        {!min && (
          <div className="nx-sb-upgrade-card">
            <div className="nx-sb-uc-badge">
              <span>PRO PLAN</span>
            </div>
            <h4 className="nx-sb-uc-title">Unlock Full Automation</h4>
            <p className="nx-sb-uc-desc">Unlimited workflow runs, custom webhooks, and team analytics.</p>
            <button
              type="button"
              className="nx-sb-uc-btn"
              onClick={() => go('pricing')}
            >
              Upgrade Workspace →
            </button>
          </div>
        )}

        {/* User Profile Row */}
        <div className="nx-sb-user-card">
          <div
            className="nx-sb-user-avatar"
            onClick={() => go('app-profile')}
            style={{ cursor: 'pointer' }}
          >
            <Avatar
              name={user?.name || 'Noor-Ul-Huda'}
              size={36}
              color="#7047EB"
              src={profile.avatar}
            />
          </div>
          {!min && (
            <div
              className="nx-sb-user-meta"
              onClick={() => go('app-profile')}
              style={{ cursor: 'pointer', flex: 1 }}
            >
              <span className="nx-sb-user-name">{user?.name || 'Noor-Ul-Huda'}</span>
              <span className="nx-sb-user-sub">{user?.plan || 'Pro Workspace'}</span>
            </div>
          )}
          {!min && (
            <button
              className="nx-sb-signout-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                setConf(true);
              }}
              title="Sign out of workspace"
              aria-label="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content Column */}
      <div className="acol nx-main-content-col">
        {/* Global Topbar */}
        <header className="tb nx-global-topbar">
          <button className="tog sbtn" aria-label="Open menu" onClick={() => setOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Breadcrumb Indicator */}
          <div className="nx-topbar-breadcrumb">
            <span
              className="nx-tb-root"
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              title="Go to Orvexa Homepage"
              aria-label="Orvexa Home"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/');
                }
              }}
              style={{
                cursor: 'pointer',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#7047EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '';
              }}
            >
              Orvexa
            </span>
            <span className="nx-tb-sep">/</span>
            <span className="nx-tb-active">{breadcrumb}</span>
          </div>

          {/* Global Search Bar with Ctrl+K Pill */}
          <div
            className="nx-topbar-search"
            onClick={() => setSearchOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSearchOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="nx-search-placeholder">
              Search workflows, tasks, documentation…
            </span>
            <kbd className="nx-search-kbd">Ctrl K</kbd>
          </div>

          <div className="tb-actions-right nx-tb-actions">
            {location.pathname.startsWith('/app/tasks') && (
              <button
                type="button"
                className="nx-tb-cta-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('nx-create-task'))}
              >
                + New Task
              </button>
            )}

            {location.pathname.startsWith('/app/workflows') && (
              <button
                type="button"
                className="nx-tb-cta-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('nx-create-workflow'))}
              >
                + Create Workflow
              </button>
            )}

            <button
              type="button"
              onClick={() => setCopilotOpen(true)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
                border: '1px solid #8B75F5',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(112, 71, 235, 0.1)',
                transition: 'all 0.15s ease',
              }}
              title="Open Orvexa AI Copilot (Ctrl+J)"
            >
              <LuSparkles size={14} />
              <span>Ask AI</span>
              <kbd
                style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: '#FFFFFF',
                  color: '#7047EB',
                  border: '1px solid #E9E8F1',
                  fontWeight: 600,
                }}
              >
                Ctrl J
              </kbd>
            </button>

            <NotificationBell />

            <ProfileDropdown
              user={user}
              profile={profile}
              onSignOut={signOut}
            />
          </div>
        </header>

        {/* Page Content View */}
        <main
          ref={mainRef}
          tabIndex={-1}
          style={{ position: 'relative', zIndex: 1, minWidth: 0, width: '100%', flex: 1 }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', minHeight: '100%' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Global Command Palette / Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <Overlay side={false} label="Command Palette" onClose={() => setSearchOpen(false)}>
            <div className="nx-command-palette-modal">
              <div className="nx-cp-search-head">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or search workspace…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="nx-cp-input"
                />
                <button
                  type="button"
                  className="nx-cp-esc-btn"
                  onClick={() => setSearchOpen(false)}
                >
                  ESC
                </button>
              </div>

              <div className="nx-cp-results-list">
                <span className="nx-cp-section-label">Quick Jump to Navigation</span>
                {commandResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="nx-cp-item"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate(item.path);
                    }}
                  >
                    <div className="nx-cp-item-left">
                      <span className="nx-cp-dot">›</span>
                      <span className="nx-cp-name">{item.name}</span>
                    </div>
                    <span className="nx-cp-cat">{item.cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <Overlay side label="App menu" onClose={() => setOpen(false)}>
            <CloseBtn onClick={() => setOpen(false)} />
            <div
              className="nx-mobile-brand"
              onClick={() => {
                setOpen(false);
                navigate('/');
              }}
              role="button"
              tabIndex={0}
              title="Go to Orvexa Homepage"
              aria-label="Orvexa Home"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E9E8F1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div className="nx-sb-logo-circle" style={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                <span>O</span>
              </div>
              <strong style={{ fontSize: '1rem', color: '#19182B' }}>Orvexa</strong>
            </div>
            <nav className="dnav nx-mobile-nav-list" style={{ padding: '12px' }}>
              {NAV_SECTIONS.map(renderNavSection)}
              <button
                type="button"
                className="nx-sidebar-nav-item"
                onClick={() => {
                  setOpen(false);
                  navigate('/app/help');
                }}
              >
                Help Center
              </button>
            </nav>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Sign-out Confirmation Modal */}
      <AnimatePresence>
        {conf && (
          <Modal title="Sign out of Orvexa Workspace?" onClose={() => setConf(false)}>
            <p className="note" style={{ marginTop: 0, marginBottom: 18 }}>
              You will be signed out of this active session. Workspace configurations, tasks, and pipelines remain safely preserved in local storage.
            </p>
            <div className="cta">
              <Btn
                onClick={() => {
                  setConf(false);
                  signOut();
                }}
              >
                Sign out
              </Btn>
              <Btn v="sec" onClick={() => setConf(false)}>
                Cancel
              </Btn>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Global Orvexa AI Copilot Slide-over */}
      <AICopilotModal isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />

      <ScrollToTopButton />
    </div>
  );
}
