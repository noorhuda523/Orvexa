import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Account from './settings/Account';
import Security from './settings/Security';
import NotificationPrefs from './settings/NotificationPrefs';
import Appearance from './settings/Appearance';
import Billing from './settings/Billing';
import Integrations from './settings/Integrations';
import ApiKeys from './settings/ApiKeys';
import DataPrivacy from './settings/DataPrivacy';

const TABS = [
  {
    key: 'account',
    label: 'Account',
    desc: 'Personal details & profile email',
    component: Account,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
  },
  {
    key: 'security',
    label: 'Security & 2FA',
    desc: 'Passwords, recovery codes & sessions',
    component: Security,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    key: 'notifications',
    label: 'Notifications',
    desc: 'Alert categories & quiet hours',
    component: NotificationPrefs,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    key: 'appearance',
    label: 'Appearance',
    desc: 'Density, font scale & motion',
    component: Appearance,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    key: 'billing',
    label: 'Billing & Plan',
    desc: 'Subscription, usage & invoices',
    component: Billing,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    key: 'integrations',
    label: 'Integrations',
    desc: 'Authorized apps & connections',
    component: Integrations,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" />
      </svg>
    ),
  },
  {
    key: 'api',
    label: 'API Keys',
    desc: 'Workspace access tokens',
    component: ApiKeys,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8 2 10l5 5 1.5-1.5L10 15l1.5-1.5L13 15l1.5-1.5L16 15l5-5-3.5-3.5Z" />
      </svg>
    ),
  },
  {
    key: 'data',
    label: 'Data & Privacy',
    desc: 'Export records & sandbox controls',
    component: DataPrivacy,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function Settings() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const seg = pathname.split('/')[3] || 'account';
  const activeTab = TABS.find((t) => t.key === seg) || TABS[0];
  const ActivePanel = activeTab.component;

  return (
    <div className="pg apppg nx-settings-page">
      {/* Header */}
      <div className="nx-page-header">
        <div className="nx-header-left">
          <div className="nx-header-breadcrumbs">
            <span>Workspace</span>
            <span className="nx-bc-sep">/</span>
            <span className="nx-bc-current">Settings & Preferences</span>
          </div>
          <h1 className="nx-page-title">Workspace Configuration</h1>
          <p className="nx-page-sub">
            Manage your account credentials, team security parameters, notification triggers, and subscriptions.
          </p>
        </div>
      </div>

      <div className="nx-settings-layout">
        {/* Navigation Sidebar */}
        <nav className="nx-settings-nav" aria-label="Settings subpages">
          {TABS.map((tab) => {
            const isCurrent = activeTab.key === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={`nx-set-tab-btn ${isCurrent ? 'active' : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() =>
                  navigate('/app/settings' + (tab.key === 'account' ? '' : '/' + tab.key))
                }
              >
                <span className="nx-set-icon">{tab.icon}</span>
                <div className="nx-set-text">
                  <span className="nx-set-label">{tab.label}</span>
                  <span className="nx-set-desc">{tab.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Content Panel */}
        <main className="nx-settings-content-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="nx-set-panel-head">
                <h2>{activeTab.label}</h2>
                <p>{activeTab.desc}</p>
              </div>
              <div className="nx-set-panel-body">
                <ActivePanel />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
