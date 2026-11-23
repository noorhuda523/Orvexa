import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Btn } from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { Modal } from '../components/Modal';
import { Avatar, Field } from '../components/ui';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { PLAN_LIMITS, ROLES, seedTeam } from '../data/content';
import useLocalState from '../hooks/useLocalState';
import { EMAIL } from '../utils/validation';
import { readPlan, readTasks } from '../utils/storage';
import { ago } from '../utils/dates';
import { ACT } from '../data/demoData';
import CountUp from '../components/CountUp';
import TiltCard from '../components/TiltCard';
import { cardVariants, staggerContainer, DUR, SPRING } from '../motion/variants';

/* ─── Icon helper ─────────────────────────────────────────────────────────── */
const Ic = ({ d, size = 18, cls = '', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={'tm-ic ' + cls} style={style} aria-hidden="true"><path d={d} /></svg>
);

/* ─── Role badge colors ───────────────────────────────────────────────────── */
const ROLE_COLOR = { admin: '#9A6CF4', member: '#75E0D1', viewer: '#C4B5FD', owner: '#7C3AED' };
const ROLE_LABEL = { admin: 'Admin', member: 'Member', viewer: 'Viewer', owner: 'Owner' };

/* ─── Progress bar with animated Framer Motion fill ──────────────────────── */
function ProgressBar({ pct, color = '#9A6CF4' }) {
  return (
    <div className="tm-prog-track" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        className="tm-prog-fill"
        initial={{ width: 0 }}
        animate={{ width: Math.min(100, pct) + '%' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}, #75E0D1)`,
          borderRadius: 'inherit',
        }}
      />
    </div>
  );
}

/* ─── Member Card ─────────────────────────────────────────────────────────── */
function MemberCard({ member, tasks, isOwner, onEdit, onRemove, onView }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const assigned = tasks.filter(t => t.assignee === member.id || t.assignee === member.email).length;
  // Use seed assignments since tasks don't have real assignees — distribute evenly for demo
  const assignedCount = isOwner ? Math.max(0, tasks.filter((_, i) => i % 4 === 0).length) : assigned;
  const completedCount = isOwner
    ? tasks.filter(t => t.status === 'done').length
    : tasks.filter((t, i) => t.status === 'done' && i % 3 === 0).length;
  const totalForMember = assignedCount + completedCount;
  const pct = totalForMember > 0 ? Math.round(completedCount / totalForMember * 100) : 0;
  const role = isOwner ? 'owner' : member.role;

  return (
    <div className="tm-card">
      <div className="tm-card-head">
        <div className="tm-card-avatar">
          <Avatar name={isOwner ? member.name : (member.name || member.email)} size={52}
            color={ROLE_COLOR[role]} />
          <span className={'tm-status-dot ' + (member.status === 'Invited' ? 'invited' : 'active')} />
        </div>
        <div style={{ position: 'relative' }}>
          <button className="tm-menu-btn" onClick={() => setMenuOpen(o => !o)}
            aria-label="Member options" aria-expanded={menuOpen}>
            <Ic d="M12 5h.01M12 12h.01M12 19h.01" size={18} />
          </button>
          {menuOpen && (
            <div className="tm-menu" role="menu">
              <button className="tm-menu-item" role="menuitem" onClick={() => { onView(member); setMenuOpen(false); }}>
                <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={14} />
                View profile
              </button>
              {!isOwner && (
                <>
                  <button className="tm-menu-item" role="menuitem" onClick={() => { onEdit(member); setMenuOpen(false); }}>
                    <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18 2a2 2 0 0 1 3 3l-9 9-4 1 1-4z" size={14} />
                    Edit role
                  </button>
                  <button className="tm-menu-item danger" role="menuitem" onClick={() => { onRemove(member); setMenuOpen(false); }}>
                    <Ic d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" size={14} />
                    Remove
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <button className="tm-card-body" onClick={() => onView(member)}>
        <div className="tm-member-name">{isOwner ? member.name : (member.name || member.email.split('@')[0])}</div>
        <div className="tm-member-email">{isOwner ? member.email : member.email}</div>
        <span className="tm-role-badge" style={{ '--rc': ROLE_COLOR[role] }}>
          {ROLE_LABEL[role] || role}
        </span>
        <span className={'tm-status-chip ' + (member.status === 'Invited' ? 'invited' : 'active')}>
          {member.status === 'Invited' ? 'Pending' : 'Active'}
        </span>
      </button>

      <div className="tm-card-stats">
        <div className="tm-stat-row">
          <span className="tm-stat-label">Completion</span>
          <span className="tm-stat-val">{pct}%</span>
        </div>
        <ProgressBar pct={pct} color={ROLE_COLOR[role]} />
        <div className="tm-mini-stats">
          <div className="tm-mini-stat">
            <span className="tm-mini-num" style={{ color: '#9A6CF4' }}>{totalForMember}</span>
            <span className="tm-mini-label">Assigned</span>
          </div>
          <div className="tm-mini-stat">
            <span className="tm-mini-num" style={{ color: '#75E0D1' }}>{completedCount}</span>
            <span className="tm-mini-label">Done</span>
          </div>
          <div className="tm-mini-stat">
            <span className="tm-mini-num" style={{ color: '#C4B5FD' }}>{totalForMember - completedCount}</span>
            <span className="tm-mini-label">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Member Detail Panel ─────────────────────────────────────────────────── */
function MemberDetail({ member, tasks, isOwner, onClose, onRemove }) {
  const role = isOwner ? 'owner' : member.role;
  const completedTasks = tasks.filter(t => t.status === 'done').slice(0, 4);
  const pendingTasks = tasks.filter(t => t.status !== 'done').slice(0, 4);

  return (
    <div className="tm-detail">
      <div className="tm-detail-top">
        <button className="tm-close-btn" onClick={onClose} aria-label="Close">
          <Ic d="M18 6L6 18M6 6l12 12" size={18} />
        </button>
        <div className="tm-detail-avatar">
          <Avatar name={member.name || member.email} size={72} color={ROLE_COLOR[role]} />
          <span className={'tm-status-dot large ' + (member.status === 'Invited' ? 'invited' : 'active')} />
        </div>
        <div className="tm-detail-name">{member.name || member.email.split('@')[0]}</div>
        <div className="tm-detail-email">{member.email}</div>
        <div className="tm-detail-badges">
          <span className="tm-role-badge" style={{ '--rc': ROLE_COLOR[role] }}>{ROLE_LABEL[role] || role}</span>
          <span className={'tm-status-chip ' + (member.status === 'Invited' ? 'invited' : 'active')}>
            {member.status === 'Invited' ? 'Pending invitation' : 'Active'}
          </span>
        </div>
      </div>

      <div className="tm-detail-section">
        <div className="tm-detail-section-title">Workload</div>
        <div className="tm-workload-grid">
          {[
            ['Assigned', pendingTasks.length + completedTasks.length, '#9A6CF4'],
            ['Completed', completedTasks.length, '#75E0D1'],
            ['Pending', pendingTasks.length, '#C4B5FD'],
          ].map(([l, v, c]) => (
            <div key={l} className="tm-workload-stat">
              <div className="tm-workload-num" style={{ color: c }}>{v}</div>
              <div className="tm-workload-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tm-detail-section">
        <div className="tm-detail-section-title">Completion Rate</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProgressBar pct={completedTasks.length + pendingTasks.length > 0 ? Math.round(completedTasks.length / (completedTasks.length + pendingTasks.length) * 100) : 0} color={ROLE_COLOR[role]} />
          <span style={{ fontSize: '.85rem', fontWeight: 700, color: ROLE_COLOR[role], flexShrink: 0 }}>
            {completedTasks.length + pendingTasks.length > 0
              ? Math.round(completedTasks.length / (completedTasks.length + pendingTasks.length) * 100)
              : 0}%
          </span>
        </div>
      </div>

      {pendingTasks.length > 0 && (
        <div className="tm-detail-section">
          <div className="tm-detail-section-title">Pending Tasks</div>
          <div className="tm-task-list">
            {pendingTasks.map(t => (
              <div key={t.id} className="tm-task-item">
                <span className="tm-task-dot" style={{ background: t.pri === 'High' ? '#FF5A79' : t.pri === 'Med' ? '#A081BD' : '#75E0D1' }} />
                <span className="tm-task-name">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isOwner && (
        <div className="tm-detail-actions">
          <Btn v="dng" onClick={() => { onRemove(member); onClose(); }}>Remove member</Btn>
        </div>
      )}

      {member.at && (
        <p className="note" style={{ textAlign: 'center', marginTop: 8 }}>
          Joined {ago(member.at)}
        </p>
      )}
    </div>
  );
}

/* ─── Workload Section ────────────────────────────────────────────────────── */
function WorkloadSection({ allMembers, owner, tasks }) {
  const everyone = [{ ...owner, role: 'owner', status: 'Active', isOwner: true }, ...allMembers];
  return (
    <div className="db-card tm-workload-card">
      <div className="db-card-header">
        <div className="db-card-title">
          <Ic d="M3 3v18h18M9 17l3-5 3 3 4-6" size={18} cls="tm-title-ic" />
          Team Workload
        </div>
      </div>
      <div className="tm-workload-table">
        {everyone.map((m, i) => {
          const role = m.isOwner ? 'owner' : m.role;
          const total = tasks.length > 0 ? Math.max(1, Math.round(tasks.length / everyone.length * (1 + (i % 3) * 0.3))) : 0;
          const done = Math.round(total * (0.3 + (i * 0.15) % 0.6));
          const pct = total > 0 ? Math.round(done / total * 100) : 0;
          return (
            <div key={m.id || 'owner'} className="tm-wl-row">
              <div className="tm-wl-member">
                <Avatar name={m.name || m.email} size={32} color={ROLE_COLOR[role]} />
                <div>
                  <div className="tm-wl-name">{m.name || m.email.split('@')[0]}</div>
                  <div className="tm-wl-role" style={{ color: ROLE_COLOR[role] }}>{ROLE_LABEL[role]}</div>
                </div>
              </div>
              <div className="tm-wl-bar">
                <ProgressBar pct={pct} color={ROLE_COLOR[role]} />
              </div>
              <div className="tm-wl-numbers">
                <span style={{ color: '#75E0D1', fontWeight: 700 }}>{done}</span>
                <span className="note">/{total}</span>
              </div>
              <div className="tm-wl-pct" style={{ color: ROLE_COLOR[role] }}>{pct}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Team Component ─────────────────────────────────────────────────── */
export default function Team() {
  const toast = useToast();
  const { user, go, notify } = useApp();
  const plan = user.plan || readPlan();
  const limit = PLAN_LIMITS[plan].seats;
  const [members, setMembers] = useLocalState('nx-team', () => seedTeam(plan));
  const tasks = readTasks();
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [invite, setInvite] = useState(null);
  const [er, setEr] = useState('');
  const [rm, setRm] = useState(null);
  const [limitHit, setLimitHit] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [editMember, setEditMember] = useState(null);

  const used = 1 + members.length;
  const active = members.filter(m => m.status === 'Active').length + 1;
  const invited = members.filter(m => m.status === 'Invited').length;

  const shown = members.filter(m => {
    const mQ = !q.trim() || (m.name + m.email).toLowerCase().includes(q.toLowerCase());
    const mR = roleFilter === 'All' || m.role === roleFilter;
    return mQ && mR;
  });

  const openInvite = () => {
    if (used >= limit) setLimitHit(true);
    else { setInvite({ email: '', role: 'member' }); setEr(''); }
  };

  const send = e => {
    e.preventDefault();
    const email = invite.email.trim().toLowerCase();
    if (!EMAIL.test(email)) return setEr('Enter a valid email, like name@company.com.');
    if (email === user.email || members.some(m => m.email === email))
      return setEr('That person is already on your team.');
    setMembers([...members, { id: 'm' + Date.now().toString(36), name: '', email, role: invite.role, status: 'Invited', at: Date.now() }]);
    setInvite(null);
    notify('Invitation sent', email + ' has been invited as ' + invite.role + '.', 'success', 'app-team');
    toast('Invitation sent to ' + email + '.');
  };

  const setRole = (id, role) => { setMembers(members.map(m => m.id === id ? { ...m, role } : m)); toast('Role updated'); };

  return (
    <div className="pg apppg tm-page">

      {/* Header */}
      <div className="tm-header">
        <div>
          <h2 className="tm-title">Team</h2>
          <p className="tm-desc">Manage your people, roles, and team performance.</p>
        </div>
        <Btn onClick={openInvite}>
          <Ic d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M20 16v6M17 19h6" size={14} style={{ marginRight: 6 }} />
          Invite Member
        </Btn>
      </div>

      {/* Stats */}
      <motion.div
        className="tm-stats-row"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Total Members', value: used, icon: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5', color: '#9A6CF4', sub: `${limit - used} seats free` },
          { label: 'Active Members', value: active, icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6', color: '#75E0D1', sub: `${invited} pending invite${invited !== 1 ? 's' : ''}` },
          { label: 'Tasks in Workspace', value: tasks.length, icon: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2', color: '#C4B5FD', sub: `${tasks.filter(t => t.status !== 'done').length} open` },
          { label: 'Tasks Completed', value: tasks.filter(t => t.status === 'done').length, icon: 'M20 6L9 17l-5-5', color: '#7C3AED', sub: tasks.length ? `${Math.round(tasks.filter(t => t.status === 'done').length / tasks.length * 100)}% rate` : '0%' },
        ].map((s, i) => (
          <TiltCard key={i} max={5} scale={1.01}>
            <motion.div
              className="tm-stat-card"
              style={{ '--tsc': s.color }}
              variants={cardVariants}
              custom={i}
              whileHover={{ borderColor: s.color }}
            >
              <div className="tm-stat-icon"><Ic d={s.icon} size={16} /></div>
              <div className="tm-stat-val"><CountUp to={s.value} duration={700} /></div>
              <div className="tm-stat-label">{s.label}</div>
              {s.sub && <div className="tm-stat-sub">{s.sub}</div>}
            </motion.div>
          </TiltCard>
        ))}
      </motion.div>

      {/* Toolbar */}
      <div className="tm-toolbar">
        <div className="tm-search-wrap">
          <Ic d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" size={15} cls="tm-search-ic" />
          <input className="tm-search" type="search" placeholder="Search members…"
            aria-label="Search members" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select className="sel sel-sm" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} aria-label="Filter by role">
          <option value="All">All roles</option>
          {ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <span className="note">{used} / {limit} seats used</span>
      </div>

      {/* Member Grid — Owner card first */}
      <motion.div
        className="tm-grid"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants} custom={0}>
          <TiltCard max={6}>
            <MemberCard
              member={{ ...user, status: 'Active', id: 'owner' }}
              tasks={tasks}
              isOwner={true}
              onView={() => setViewMember({ ...user, status: 'Active', role: 'owner', id: 'owner' })}
              onEdit={() => {}}
              onRemove={() => {}}
            />
          </TiltCard>
        </motion.div>
        <AnimatePresence>
        {shown.map((m, i) => (
          <motion.div key={m.id} variants={cardVariants} custom={i + 1}>
            <TiltCard max={6}>
              <MemberCard member={m} tasks={tasks}
                isOwner={false}
                onView={() => setViewMember(m)}
                onEdit={() => setEditMember(m)}
                onRemove={() => setRm(m)} />
            </TiltCard>
          </motion.div>
        ))}
        </AnimatePresence>
        {shown.length === 0 && members.length > 0 && (
          <div className="tm-empty" style={{ gridColumn: '1/-1' }}>
            <Ic d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5" size={40} cls="tm-empty-ic" />
            <p>No members match your search.</p>
          </div>
        )}
      </motion.div>

      {/* Workload section */}
      <WorkloadSection allMembers={members} owner={user} tasks={tasks} />

      {/* Recent Activity */}
      <div className="db-card">
        <div className="db-card-header">
          <div className="db-card-title">
            <Ic d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 5v5l4 2" size={18} cls="tm-title-ic" />
            Recent Team Activity
          </div>
        </div>
        <ul className="db-timeline" style={{ padding: '16px 20px' }}>
          {ACT.map((a, i) => (
            <li key={i} className="db-tl-item">
              <div className="db-tl-left">
                <Avatar name={a[0]} size={32} color={['#9A6CF4', '#75E0D1', '#C4B5FD', '#7C3AED', '#BDE4DF'][i % 5]} />
                <div className="db-tl-line" />
              </div>
              <div className="db-tl-body">
                <div className="db-tl-main"><strong>{a[0]}</strong> {a[1]}</div>
                <div className="db-tl-time">{a[2]}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Roles reference */}
      <div className="db-card">
        <div className="db-card-header">
          <div className="db-card-title">
            <Ic d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6" size={18} cls="tm-title-ic" />
            Roles & Permissions
          </div>
        </div>
        <div className="tm-roles-grid">
          {[['owner', 'Owner', 'Full access to all settings, billing, and members.'],
            ...ROLES.map(([k, l, d]) => [k, l, d])].map(([k, l, d]) => (
            <div key={k} className="tm-role-card">
              <div className="tm-role-name" style={{ color: ROLE_COLOR[k] }}>{l}</div>
              <div className="tm-role-desc">{d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {invite && (
        <Modal title="Invite a teammate" onClose={() => setInvite(null)}>
          <form onSubmit={send} noValidate>
            <Field label="Email" type="email" value={invite.email}
              onChange={e => { setInvite({ ...invite, email: e.target.value }); setEr(''); }}
              error={er} autoFocus />
            <Field label="Role" as="select" value={invite.role}
              onChange={e => setInvite({ ...invite, role: e.target.value })}>
              {ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </Field>
            <div className="cta">
              <Btn type="submit">Send invitation</Btn>
              <Btn v="sec" onClick={() => setInvite(null)}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit role modal */}
      {editMember && (
        <Modal title="Edit role" onClose={() => setEditMember(null)}>
          <Field label="Role" as="select" value={editMember.role}
            onChange={e => setEditMember({ ...editMember, role: e.target.value })}>
            {ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </Field>
          <div className="cta">
            <Btn onClick={() => { setRole(editMember.id, editMember.role); setEditMember(null); }}>Save</Btn>
            <Btn v="sec" onClick={() => setEditMember(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Member detail slide-over */}
      {viewMember && (
        <Modal title="Member profile" onClose={() => setViewMember(null)}>
          <MemberDetail
            member={viewMember}
            tasks={tasks}
            isOwner={viewMember.id === 'owner' || viewMember.email === user.email}
            onClose={() => setViewMember(null)}
            onRemove={m => { setViewMember(null); setRm(m); }}
          />
        </Modal>
      )}

      {/* Remove confirm */}
      {rm && (
        <ConfirmDialog title="Remove member?" danger confirmLabel="Remove"
          onClose={() => setRm(null)}
          onConfirm={() => { setMembers(members.filter(m => m.id !== rm.id)); setRm(null); toast('Member removed'); }}>
          {rm.email} will lose access to this workspace.
        </ConfirmDialog>
      )}

      {/* Limit dialog */}
      {limitHit && (
        <ConfirmDialog title="Seat limit reached" confirmLabel="See plans"
          onClose={() => setLimitHit(false)}
          onConfirm={() => { setLimitHit(false); go('app-settings'); }}>
          Your {plan} plan includes {limit} {limit === 1 ? 'seat' : 'seats'}. Upgrade under Settings → Billing.
        </ConfirmDialog>
      )}
    </div>
  );
}
