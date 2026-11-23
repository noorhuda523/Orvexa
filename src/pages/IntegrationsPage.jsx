import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Btn } from '../components/Button';
import { Modal } from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import useLocalState from '../hooks/useLocalState';
import {
  fadeUp,
  staggerContainer,
  cardVariants,
  SPRING,
} from '../motion/variants';
import { LuCheck, LuShieldCheck } from '../components/Icon';

const INTEGRATIONS_CATALOG = [
  {
    id: 'slack',
    name: 'Slack',
    cat: 'Communication',
    iconColor: '#E01E5A',
    iconLetter: 'S',
    desc: 'Real-time incident notifications, trigger execution alerts, and slash command controls.',
    scopes: ['Read public channels', 'Post interactive notifications', 'Listen to webhook events'],
    popular: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    cat: 'Developer Tools',
    iconColor: '#24292F',
    iconLetter: 'GH',
    desc: 'Automate issue triage, PR review reminders, commit verification, and repo status sync.',
    scopes: ['Read repository events', 'Create issues and comments', 'Check commit status'],
    popular: true,
  },
  {
    id: 'jira',
    name: 'Jira Software',
    cat: 'Developer Tools',
    iconColor: '#0052CC',
    iconLetter: 'J',
    desc: 'Sync workflow tickets, automate sprint backlog grooming, and update ticket lifecycle states.',
    scopes: ['Read sprint backlog', 'Create and modify Jira issues', 'Post worklogs'],
    popular: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    cat: 'Productivity',
    iconColor: '#000000',
    iconLetter: 'N',
    desc: 'Publish AI generated meeting summaries, doc sync, and team workspace wikis automatically.',
    scopes: ['Read team databases', 'Append pages and blocks', 'Manage doc comments'],
    popular: true,
  },
  {
    id: 'linear',
    name: 'Linear',
    cat: 'Productivity',
    iconColor: '#5E6AD2',
    iconLetter: 'L',
    desc: 'High-speed issue tracking sync, automated cycle milestone tracking, and bug triage.',
    scopes: ['Read project roadmaps', 'Create and update issues', 'Trigger cycle status'],
    popular: true,
  },
  {
    id: 'google-drive',
    name: 'Google Drive & Docs',
    cat: 'Storage & Cloud',
    iconColor: '#4285F4',
    iconLetter: 'GD',
    desc: 'Export executive summaries, auto-archive audit reports, and store workflow artifacts.',
    scopes: ['Read selected folder files', 'Create Google Docs', 'Manage file permissions'],
  },
  {
    id: 'discord',
    name: 'Discord',
    cat: 'Communication',
    iconColor: '#5865F2',
    iconLetter: 'D',
    desc: 'Broadcast release notifications and automated server status to community or team channels.',
    scopes: ['Send webhooks to channels', 'Read bot interactions', 'Manage status alerts'],
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    cat: 'Storage & Cloud',
    iconColor: '#FF9900',
    iconLetter: 'AWS',
    desc: 'CloudWatch anomaly triggers, S3 log ingestion, and Lambda serverless automation dispatch.',
    scopes: ['CloudWatch metrics read', 'S3 event triggers', 'Invoke specified Lambda functions'],
  },
  {
    id: 'webhooks',
    name: 'Custom Webhooks',
    cat: 'Developer Tools',
    iconColor: '#7047EB',
    iconLetter: 'WH',
    desc: 'Connect custom internal REST APIs, payload signature verification, and HTTPS hooks.',
    scopes: ['Receive inbound JSON payloads', 'Dispatch outbound authenticated HTTPS calls'],
    popular: true,
  },
];

const CATEGORIES = ['All', 'Communication', 'Developer Tools', 'Productivity', 'Storage & Cloud'];

export default function IntegrationsPage() {
  const toast = useToast();
  const { notify } = useApp();
  const [connected, setConnected] = useLocalState('nx-integrations', {
    slack: Date.now() - 15 * 864e5,
    github: Date.now() - 5 * 864e5,
  });

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [activeModal, setActiveModal] = useState(null); // { item, mode: 'connect' | 'disconnect' }

  const filtered = INTEGRATIONS_CATALOG.filter((item) => {
    const matchCat = selectedCat === 'All' || item.cat === selectedCat;
    const matchSearch =
      !search.trim() ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const connectedCount = Object.keys(connected).length;

  const handleConnect = (item) => {
    setConnected({ ...connected, [item.id]: Date.now() });
    notify(`${item.name} connected`, `Simulated authorization succeeded for ${item.name}.`, 'success');
    toast(`${item.name} integrated successfully!`);
    setActiveModal(null);
  };

  const handleDisconnect = (item) => {
    const updated = { ...connected };
    delete updated[item.id];
    setConnected(updated);
    toast(`${item.name} disconnected.`);
    setActiveModal(null);
  };

  return (
    <div className="pg apppg nx-integrations-page">
      {/* Header */}
      <div className="nx-page-header">
        <div className="nx-header-left">
          <div className="nx-header-breadcrumbs">
            <span>Workspace</span>
            <span className="nx-bc-sep">/</span>
            <span className="nx-bc-current">Connected Apps</span>
          </div>
          <h1 className="nx-page-title">Integrations & Connected Tools</h1>
          <p className="nx-page-sub">
            Connect your existing development, communication, and productivity stack directly into Orvexa pipelines.
          </p>
        </div>
        <div className="nx-header-actions">
          <div className="nx-connected-badge-pill">
            <span className="nx-cbadge-dot" />
            <strong>{connectedCount}</strong> Active Integrations
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="nx-filter-bar">
        <div className="nx-search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search integrations by name or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="nx-category-pills">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`nx-cat-pill ${selectedCat === c ? 'active' : ''}`}
              onClick={() => setSelectedCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Cards Grid */}
      <motion.div
        className="nx-integrations-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((item, idx) => {
          const isConnected = !!connected[item.id];
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              custom={idx}
              whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(112, 71, 235, 0.1)', transition: SPRING.smooth }}
              className={`nx-int-card ${isConnected ? 'is-connected' : ''}`}
            >
              <div className="nx-int-top">
                <div
                  className="nx-int-icon"
                  style={{ background: item.iconColor, color: '#FFFFFF' }}
                >
                  {item.iconLetter}
                </div>
                <div className="nx-int-badge-wrap">
                  {isConnected ? (
                    <span className="nx-int-status connected">● Connected</span>
                  ) : item.popular ? (
                    <span className="nx-int-status popular">Popular</span>
                  ) : (
                    <span className="nx-int-status available">Available</span>
                  )}
                </div>
              </div>

              <div className="nx-int-body">
                <h3 className="nx-int-name">{item.name}</h3>
                <span className="nx-int-category">{item.cat}</span>
                <p className="nx-int-desc">{item.desc}</p>
              </div>

              <div className="nx-int-footer">
                {isConnected ? (
                  <div className="nx-int-btn-row">
                    <span className="nx-int-date">
                      Connected {new Date(connected[item.id]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                    <button
                      type="button"
                      className="nx-int-action-btn disconnect"
                      onClick={() => setActiveModal({ item, mode: 'disconnect' })}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="nx-int-action-btn connect"
                    onClick={() => setActiveModal({ item, mode: 'connect' })}
                  >
                    Connect →
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Connect Modal */}
      {activeModal && activeModal.mode === 'connect' && (
        <Modal
          title={`Connect ${activeModal.item.name} to Orvexa`}
          onClose={() => setActiveModal(null)}
        >
          <div className="nx-connect-modal-content">
            <div className="nx-cm-icon-row">
              <div
                className="nx-int-icon large"
                style={{ background: activeModal.item.iconColor, color: '#FFFFFF' }}
              >
                {activeModal.item.iconLetter}
              </div>
              <span className="nx-cm-arrow">⇄</span>
              <div className="nx-int-icon large orvexa-brand">
                N
              </div>
            </div>

            <p className="nx-cm-desc">
              Granting access will authorize <strong>Orvexa Workspace Automation</strong> to securely exchange triggers and events with your {activeModal.item.name} organization.
            </p>

            <div className="nx-scopes-box">
              <span className="nx-scopes-title">Requested Permissions & Scopes:</span>
              <ul className="nx-scopes-list">
                {activeModal.item.scopes.map((scope, idx) => (
                  <li key={idx}>
                    <span className="check">
                      <LuCheck size={12} strokeWidth={2.5} />
                    </span>{' '}
                    {scope}
                  </li>
                ))}
              </ul>
            </div>

            <p className="note" style={{ fontSize: '11.5px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <LuShieldCheck size={14} color="#7047EB" />
              Demo Environment: Simulated OAuth 2.0 authorization token will be stored in your local browser sandbox.
            </p>

            <div className="cta" style={{ marginTop: 20 }}>
              <Btn onClick={() => handleConnect(activeModal.item)}>
                Authorize & Connect
              </Btn>
              <Btn v="sec" onClick={() => setActiveModal(null)}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Disconnect Dialog */}
      {activeModal && activeModal.mode === 'disconnect' && (
        <ConfirmDialog
          title={`Disconnect ${activeModal.item.name}?`}
          danger
          confirmLabel="Disconnect Service"
          onClose={() => setActiveModal(null)}
          onConfirm={() => handleDisconnect(activeModal.item)}
        >
          Active workflows that depend on {activeModal.item.name} triggers or dispatch actions will pause until the service is reconnected.
        </ConfirmDialog>
      )}
    </div>
  );
}
