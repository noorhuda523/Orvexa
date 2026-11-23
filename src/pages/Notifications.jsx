import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Btn } from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { ago } from '../utils/dates';
import {
  fadeUp,
  staggerContainer,
  SPRING,
} from '../motion/variants';
import { LuZap, LuCheck, LuLock, LuSparkles } from '../components/Icon';

const CATEGORIES = ['All', 'Unread', 'Workflows', 'Tasks', 'Team & Security'];

export default function Notifications() {
  const { notifs, unread, markRead, markAllRead, removeNotif, clearNotifs, go, toast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [clearConfirm, setClearConfirm] = useState(false);

  const filtered = notifs.filter((n) => {
    if (selectedFilter === 'Unread') return !n.read;
    if (selectedFilter === 'Workflows') {
      return (n.t || '').toLowerCase().includes('workflow') || (n.b || '').toLowerCase().includes('workflow');
    }
    if (selectedFilter === 'Tasks') {
      return (n.t || '').toLowerCase().includes('task') || (n.b || '').toLowerCase().includes('task');
    }
    if (selectedFilter === 'Team & Security') {
      return (
        (n.t || '').toLowerCase().includes('team') ||
        (n.t || '').toLowerCase().includes('security') ||
        (n.t || '').toLowerCase().includes('password')
      );
    }
    return true;
  });

  const getIconForNotif = (n) => {
    const title = (n.t || '').toLowerCase();
    if (title.includes('workflow') || title.includes('pipeline')) {
      return { icon: <LuZap size={15} />, color: '#7047EB', bg: '#EDE7FF' };
    }
    if (title.includes('task')) {
      return { icon: <LuCheck size={15} />, color: '#16B890', bg: 'rgba(22, 184, 144, 0.12)' };
    }
    if (title.includes('security') || title.includes('password') || title.includes('auth')) {
      return { icon: <LuLock size={15} />, color: '#F4AD4E', bg: 'rgba(244, 173, 78, 0.12)' };
    }
    return { icon: <LuSparkles size={15} />, color: '#8B75F5', bg: '#F1F0FA' };
  };

  return (
    <div className="pg apppg nx-notifications-page">
      {/* Header */}
      <div className="nx-page-header">
        <div className="nx-header-left">
          <div className="nx-header-breadcrumbs">
            <span>Workspace</span>
            <span className="nx-bc-sep">/</span>
            <span className="nx-bc-current">Notifications Center</span>
          </div>
          <h1 className="nx-page-title">Notifications & Workspace Alerts</h1>
          <p className="nx-page-sub">
            Real-time execution updates, team collaboration mentions, and system logs.
          </p>
        </div>

        <div className="nx-header-actions">
          <Btn
            v="sec"
            disabled={unread === 0}
            onClick={() => {
              markAllRead();
              toast('All notifications marked as read');
            }}
          >
            Mark All Read
          </Btn>
          <Btn
            v="sec"
            disabled={notifs.length === 0}
            onClick={() => setClearConfirm(true)}
          >
            Clear All
          </Btn>
        </div>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="nx-notif-filter-bar">
        <div className="nx-category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`nx-cat-pill ${selectedFilter === cat ? 'active' : ''}`}
              onClick={() => setSelectedFilter(cat)}
            >
              {cat}
              {cat === 'Unread' && unread > 0 && (
                <span className="nx-badge-counter">{unread}</span>
              )}
            </button>
          ))}
        </div>

        <div className="nx-notif-meta-note">
          {unread} unread of {notifs.length} total alerts
        </div>
      </div>

      {/* Notifications List */}
      <div className="nx-notifs-container">
        {filtered.length > 0 ? (
          <motion.div
            className="nx-notifs-list"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((n, idx) => {
              const iconStyle = getIconForNotif(n);
              return (
                <motion.div
                  key={n.id}
                  variants={fadeUp}
                  custom={idx}
                  whileHover={{ x: 4, transition: SPRING.smooth }}
                  className={`nx-notif-item ${n.read ? 'is-read' : 'is-unread'}`}
                >
                  <div
                    className="nx-notif-avatar-box"
                    style={{ background: iconStyle.bg, color: iconStyle.color }}
                  >
                    {iconStyle.icon}
                  </div>

                  <div className="nx-notif-content-col">
                    <div className="nx-notif-title-row">
                      <h4 className="nx-notif-title">{n.t}</h4>
                      {!n.read && <span className="nx-unread-dot" />}
                    </div>
                    {n.b && <p className="nx-notif-body">{n.b}</p>}
                    <span className="nx-notif-timestamp">{ago(n.at)}</span>
                  </div>

                  <div className="nx-notif-actions-col">
                    {n.to && (
                      <button
                        type="button"
                        className="nx-btn-link-action"
                        onClick={() => {
                          markRead(n.id);
                          go(n.to);
                        }}
                      >
                        Open →
                      </button>
                    )}
                    <button
                      type="button"
                      className="nx-btn-link-action muted"
                      onClick={() => markRead(n.id, !n.read)}
                    >
                      {n.read ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button
                      type="button"
                      className="nx-btn-link-action danger"
                      onClick={() => {
                        removeNotif(n.id);
                        toast('Notification removed');
                      }}
                      title="Delete notification"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="nx-empty-notifs-card">
            <div className="nx-empty-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7047EB" strokeWidth="2">
                <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3>
              {selectedFilter === 'Unread'
                ? 'No unread notifications'
                : 'All caught up!'}
            </h3>
            <p>
              When pipelines run, tasks change state, or teammates collaborate, new alerts will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Dialog */}
      {clearConfirm && (
        <ConfirmDialog
          title="Clear all notifications?"
          danger
          confirmLabel="Clear All Alerts"
          onClose={() => setClearConfirm(false)}
          onConfirm={() => {
            clearNotifs();
            setClearConfirm(false);
            toast('Notifications inbox cleared.');
          }}
        >
          This will permanently remove all past notifications from your workspace inbox.
        </ConfirmDialog>
      )}
    </div>
  );
}
