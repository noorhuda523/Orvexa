import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Btn } from '../components/Button';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import CountUp from '../components/CountUp';
import { TaskForm } from './Tasks';
import { fmtDay } from '../utils/dates';
import { newId, readTasks, readWf, saveTasks, saveWf } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { getDashboardOverview } from '../utils/analyticsData';
import {
  fadeUp,
  staggerContainer,
  cardVariants,
  EASE,
  SPRING,
} from '../motion/variants';
import {
  LuZap,
  LuCheck,
  LuLink,
  LuSparkles,
  LuUsers,
  LuWorkflow,
  LuClock3,
  LuListTodo,
  LuCalendar,
  LuTrendingUp,
  LuLayers,
  LuPlay,
  LuPlus,
  LuArrowRight,
  LuCircleAlert,
  LuBot,
} from 'react-icons/lu';

import {
  ChartCard,
  AreaChart,
  DoughnutChart,
  SparklineChart,
  CHART_COLORS,
} from '../components/charts';

export default function Dashboard() {
  const { user, go } = useApp();
  const navigate = useNavigate();
  const toast = useToast();

  const [tasks, setTasks] = useState(readTasks);
  const [workflows, setWorkflows] = useState(readWf);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [now, setNow] = useState(new Date());

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  // Sync when storage updates
  useEffect(() => {
    const handleStorage = () => {
      setTasks(readTasks());
      setWorkflows(readWf());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('wf-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('wf-updated', handleStorage);
    };
  }, []);

  const greeting = useMemo(() => {
    const hr = now.getHours();
    const rawName = user?.name || 'Noor-Ul-Huda';
    const name = rawName === 'Demo User' || rawName === 'Demo' ? 'Noor-Ul-Huda' : rawName;
    if (hr < 12) return `Good morning, ${name}`;
    if (hr < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  }, [now, user]);

  // Centralized dashboard overview data
  const overview = useMemo(() => {
    return getDashboardOverview();
  }, [tasks, workflows]);

  /* ─── Compact Chart.js Configurations for Dashboard ────────────────────── */

  // C. 7-Day Recent Workflow Activity (Simple & Compact)
  const recentActivityChartData = useMemo(() => {
    return {
      labels: overview.workflowActivity.labels,
      datasets: [
        {
          label: 'Executions',
          data: overview.workflowActivity.success,
          borderColor: CHART_COLORS.primary,
          fill: true,
          tension: 0.35,
        },
      ],
    };
  }, [overview]);

  // D. Task Status Distribution (Compact Doughnut)
  const taskStatusDoughnutData = useMemo(() => {
    const dist = overview.taskDistribution;
    return {
      labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
      datasets: [
        {
          data: [dist.completed, dist.inProgress, dist.pending, dist.overdue],
          backgroundColor: [
            CHART_COLORS.green,
            CHART_COLORS.primary,
            CHART_COLORS.orange,
            CHART_COLORS.red,
          ],
          borderColor: '#FFFFFF',
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  }, [overview]);

  // Recent Workspace Activities
  const recentActivities = useMemo(() => {
    return [
      {
        id: 'act-1',
        title: "Autonomous Incident Pipeline triaged Issue #342",
        category: 'Workflow Executed',
        time: '4 mins ago',
        status: 'Success',
        dotColor: '#16B890',
        icon: <LuZap size={14} />,
      },
      {
        id: 'act-2',
        title: "Task 'Refactor OAuth2 token refresh' completed",
        category: 'Task Completed',
        time: '18 mins ago',
        status: 'Done',
        dotColor: '#7047EB',
        icon: <LuCheck size={14} />,
      },
      {
        id: 'act-3',
        title: "Integration 'GitHub Repository Webhook' synchronized",
        category: 'Integration Connected',
        time: '1 hour ago',
        status: 'Active',
        dotColor: '#54C9D1',
        icon: <LuLink size={14} />,
      },
      {
        id: 'act-4',
        title: "Weekly Client Performance Digest generated",
        category: 'AI Summary',
        time: '3 hours ago',
        status: 'Success',
        dotColor: '#9A80F5',
        icon: <LuSparkles size={14} />,
      },
    ];
  }, []);

  const handleTaskToggle = (t) => {
    const nextStatus = t.status === 'done' ? 'todo' : 'done';
    const next = tasks.map((x) => (x.id === t.id ? { ...x, status: nextStatus } : x));
    setTasks(next);
    saveTasks(next);
    toast(nextStatus === 'done' ? `Marked '${t.title}' completed` : `Moved '${t.title}' to Pending`);
  };

  const persistTask = (t) => {
    let next;
    if (t.id) {
      next = tasks.map((x) => (x.id === t.id ? t : x));
      toast('Task updated');
    } else {
      next = [{ ...t, id: newId() }, ...tasks];
      toast('Task created');
    }
    setTasks(next);
    saveTasks(next);
    setNewTaskOpen(false);
    setEditTask(null);
  };

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'done')
      .sort((a, b) => (a.due || '').localeCompare(b.due || ''))
      .slice(0, 5);
  }, [tasks]);

  return (
    <div className="pg apppg nx-dashboard-page" style={{ padding: '24px 32px 64px', maxWidth: 1440, margin: '0 auto' }}>
      {/* ── 1. Welcome Header (Workspace Command Center) ── */}
      <motion.div
        className="nx-dash-header"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: 24 }}
      >
        <div className="nx-dash-header-left">
          <h1 className="nx-dash-greeting">{greeting}</h1>
          <p className="nx-dash-subtitle">
            Here's your operational overview for today. {overview.kpis.activeTasks} active tasks and {overview.kpis.activeWorkflows} automated pipelines running.
          </p>
          <div className="nx-dash-date-badge">
            <LuCalendar size={14} />
            <span>
              {now.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="nx-dash-header-actions">
          <Btn v="sec" onClick={() => setNewTaskOpen(true)}>
            <LuPlus size={15} style={{ marginRight: 4 }} />
            New Task
          </Btn>
          <Btn onClick={() => go('app-workflows')}>
            <LuZap size={15} style={{ marginRight: 4 }} />
            New Workflow
          </Btn>
        </div>
      </motion.div>

      {/* ── AI Daily Brief & Autonomous Workspace Highlights ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #EDE7FF',
          boxShadow: '0 4px 16px rgba(112, 71, 235, 0.06)',
          padding: '20px 24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8FF 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              <LuSparkles />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#19182B' }}>
                  Orvexa AI Daily Brief
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: '#EDE7FF',
                    color: '#7047EB',
                  }}
                >
                  LIVE SYNTHESIS
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#74758A' }}>
                Real-time operational summary computed from current sprint queues & pipeline telemetry.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => navigate('/app/agents')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#F8F9FC',
                border: '1px solid #E9E8F1',
                color: '#19182B',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <LuBot size={13} color="#7047EB" />
              AI Agents Studio
            </button>
            <button
              type="button"
              onClick={() => navigate('/app/playground')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: '#7047EB',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(112, 71, 235, 0.25)',
              }}
            >
              <LuPlay size={11} />
              Open Playground
            </button>
          </div>
        </div>

        {/* 3 Key Operational Insights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E9E8F1',
              fontSize: '12px',
              lineHeight: 1.5,
              color: '#19182B',
            }}
          >
            <strong style={{ color: '#7047EB' }}>Sprint Velocity: </strong>
            {overview.kpis.completedTasks} completed out of {tasks.length} sprint tickets ({Math.round((overview.kpis.completedTasks / (tasks.length || 1)) * 100)}% progress). Team velocity remains on track.
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E9E8F1',
              fontSize: '12px',
              lineHeight: 1.5,
              color: '#19182B',
            }}
          >
            <strong style={{ color: '#16B890' }}>Pipeline Reliability: </strong>
            {overview.kpis.activeWorkflows} active autonomous workflows running at {overview.stats?.successRate?.value || '99.8%'} uptime with zero fatal exceptions.
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E9E8F1',
              fontSize: '12px',
              lineHeight: 1.5,
              color: '#19182B',
            }}
          >
            <strong style={{ color: '#F4AD4E' }}>Priority Triage: </strong>
            {tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length} high-priority ticket(s) currently open. Focus capacity to meet Friday release target.
          </div>
        </div>

        {/* AI Quick Actions Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#74758A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Actions:
          </span>
          <button
            type="button"
            onClick={() => navigate('/app/tasks')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#F8F9FC',
              border: '1px solid #E9E8F1',
              fontSize: '11px',
              color: '#19182B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Triage High-Priority Tasks
            <LuArrowRight size={10} color="#7047EB" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/workflows')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#F8F9FC',
              border: '1px solid #E9E8F1',
              fontSize: '11px',
              color: '#19182B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Inspect Autonomous Triggers
            <LuArrowRight size={10} color="#7047EB" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/content-generator')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#F8F9FC',
              border: '1px solid #E9E8F1',
              fontSize: '11px',
              color: '#19182B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Draft Team Standup Note
            <LuArrowRight size={10} color="#7047EB" />
          </button>
        </div>
      </motion.div>

      {/* ── 2. Four Workspace Status KPI Cards (At-a-Glance) ── */}
      <motion.div
        className="nx-kpi-grid-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ marginBottom: 24 }}
      >
        {/* Card 1: Total Workflows */}
        <motion.div
          className="nx-kpi-card"
          variants={cardVariants}
          custom={0}
          whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(112, 71, 235, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => go('app-workflows')}
          role="button"
          tabIndex={0}
        >
          <div className="nx-kpi-head">
            <span className="nx-kpi-label">Total Workflows</span>
            <div className="nx-kpi-icon-pill purple">
              <LuWorkflow size={15} />
            </div>
          </div>
          <div className="nx-kpi-metric-row">
            <div className="nx-kpi-val">
              <CountUp to={overview.kpis.totalWorkflows} duration={700} />
            </div>
            <span className="nx-kpi-badge up">Live</span>
          </div>
          <p className="nx-kpi-comparison">{overview.kpis.activeWorkflows} pipelines active right now</p>
          <div style={{ height: 26, marginTop: 4 }}>
            <SparklineChart data={overview.sparklines.workflows} color={CHART_COLORS.primary} fill height={26} />
          </div>
        </motion.div>

        {/* Card 2: Active Tasks */}
        <motion.div
          className="nx-kpi-card"
          variants={cardVariants}
          custom={1}
          whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(112, 71, 235, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => go('app-tasks')}
          role="button"
          tabIndex={0}
        >
          <div className="nx-kpi-head">
            <span className="nx-kpi-label">Active Tasks</span>
            <div className="nx-kpi-icon-pill cyan">
              <LuListTodo size={15} />
            </div>
          </div>
          <div className="nx-kpi-metric-row">
            <div className="nx-kpi-val">
              <CountUp to={overview.kpis.activeTasks} duration={700} />
            </div>
            <span className="nx-kpi-badge up" style={{ color: '#7047EB', background: '#F1F0FA' }}>In Progress</span>
          </div>
          <p className="nx-kpi-comparison">Assigned across your current sprint</p>
          <div style={{ height: 26, marginTop: 4 }}>
            <SparklineChart data={overview.sparklines.activeTasks} color={CHART_COLORS.cyan} fill height={26} />
          </div>
        </motion.div>

        {/* Card 3: Completed Tasks */}
        <motion.div
          className="nx-kpi-card"
          variants={cardVariants}
          custom={2}
          whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(22, 184, 144, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => go('app-tasks')}
          role="button"
          tabIndex={0}
        >
          <div className="nx-kpi-head">
            <span className="nx-kpi-label">Completed Tasks</span>
            <div className="nx-kpi-icon-pill green">
              <LuCheck size={15} />
            </div>
          </div>
          <div className="nx-kpi-metric-row">
            <div className="nx-kpi-val">
              <CountUp to={overview.kpis.completedTasks} duration={700} />
            </div>
            <span className="nx-kpi-badge up">
              <LuTrendingUp size={11} /> On Track
            </span>
          </div>
          <p className="nx-kpi-comparison">Total milestones marked done</p>
          <div style={{ height: 26, marginTop: 4 }}>
            <SparklineChart data={overview.sparklines.completedTasks} color={CHART_COLORS.green} fill height={26} />
          </div>
        </motion.div>

        {/* Card 4: Time Saved Today */}
        <motion.div
          className="nx-kpi-card"
          variants={cardVariants}
          custom={3}
          whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(154, 128, 245, 0.15)' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="nx-kpi-head">
            <span className="nx-kpi-label">Time Saved Today</span>
            <div className="nx-kpi-icon-pill lilac">
              <LuClock3 size={15} />
            </div>
          </div>
          <div className="nx-kpi-metric-row">
            <div className="nx-kpi-val">
              {overview.kpis.timeSavedToday}
              <span className="nx-kpi-unit">hrs</span>
            </div>
            <span className="nx-kpi-badge up">+1.2h</span>
          </div>
          <p className="nx-kpi-comparison">Automated by AI execution pipelines</p>
          <div style={{ height: 26, marginTop: 4 }}>
            <SparklineChart data={overview.sparklines.timeSavedToday} color={CHART_COLORS.secondary} fill height={26} />
          </div>
        </motion.div>
      </motion.div>

      {/* ── 3. Operational Visuals (Compact 7-Day Line & Status Doughnut) ── */}
      <div className="nx-dashboard-charts-grid" style={{ marginBottom: 24 }}>
        {/* C. 7-Day Recent Workflow Activity Overview */}
        <ChartCard
          title="Recent Workflow Activity"
          subtitle="Automated executions over the last 7 days."
          height={240}
          actions={
            <button
              type="button"
              className="nx-dash-text-link"
              onClick={() => go('app-analytics')}
              style={{ fontSize: '0.82rem' }}
            >
              Full Analytics →
            </button>
          }
        >
          <AreaChart data={recentActivityChartData} height={240} yTitle="Runs" />
        </ChartCard>

        {/* D. Task Status Distribution (Compact Doughnut) */}
        <ChartCard
          title="Task Status Summary"
          subtitle="Current operational breakdown across your workspace."
          height={240}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, minHeight: 160 }}>
              <DoughnutChart
                data={taskStatusDoughnutData}
                centerValue={`${overview.taskDistribution.total}`}
                centerLabel="Total Tasks"
                height={160}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, paddingTop: 6, borderTop: '1px solid #F1F0FA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#74758A' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS.green }} />
                <span>Done ({overview.taskDistribution.completed})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#74758A' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS.primary }} />
                <span>Doing ({overview.taskDistribution.inProgress})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#74758A' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS.orange }} />
                <span>Pending ({overview.taskDistribution.pending})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#74758A' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS.red }} />
                <span>Overdue ({overview.taskDistribution.overdue})</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ── 4. Action-Oriented Operational Workspace: My Tasks & Active Workflows ── */}
      <div className="nx-dash-bottom-grid" style={{ marginBottom: 24 }}>
        {/* E. Upcoming / High-Priority Tasks Checklist */}
        <div className="nx-dash-card-box">
          <div className="nx-dash-card-head">
            <div>
              <h3 className="nx-dash-card-title">My Tasks & Milestones</h3>
              <p className="nx-dash-card-subtitle">Upcoming items requiring action.</p>
            </div>
            <button
              type="button"
              className="nx-dash-text-link"
              onClick={() => go('app-tasks')}
            >
              Open Tasks Board →
            </button>
          </div>

          <div className="nx-dash-tasks-list">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((t) => (
                <div key={t.id} className="nx-dash-task-row">
                  <button
                    type="button"
                    className={`nx-task-check-circle ${t.status === 'done' ? 'checked' : ''}`}
                    onClick={() => handleTaskToggle(t)}
                    title={t.status === 'done' ? 'Mark pending' : 'Mark done'}
                  >
                    {t.status === 'done' && <LuCheck size={11} strokeWidth={3} />}
                  </button>
                  <div className="nx-dash-task-meta" onClick={() => setEditTask(t)}>
                    <span className="nx-dash-task-name">{t.title}</span>
                    <span className="nx-dash-task-due">Due: {fmtDay(t.due)}</span>
                  </div>
                  <span className={`nx-dash-pri-badge ${t.pri ? t.pri.toLowerCase() : 'med'}`}>
                    {t.pri || 'Med'}
                  </span>
                </div>
              ))
            ) : (
              <div className="nx-empty-msg">
                <p>All caught up! No pending tasks due today.</p>
                <Btn v="sec" onClick={() => setNewTaskOpen(true)}>Add New Task</Btn>
              </div>
            )}
          </div>
        </div>

        {/* F. Active Workflows Status */}
        <div className="nx-dash-card-box">
          <div className="nx-dash-card-head">
            <div>
              <h3 className="nx-dash-card-title">Active Workflows</h3>
              <p className="nx-dash-card-subtitle">Pipelines actively listening for triggers.</p>
            </div>
            <button
              type="button"
              className="nx-dash-text-link"
              onClick={() => go('app-workflows')}
            >
              Manage All →
            </button>
          </div>

          <div className="nx-dash-workflows-table">
            <table className="nx-mini-table">
              <thead>
                <tr>
                  <th>Workflow</th>
                  <th>Trigger</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(workflows.length > 0 ? workflows : [
                  { id: 'wf1', name: 'GitHub Incident Triager', trigger: 'task-created' },
                  { id: 'wf2', name: 'Weekly Client Executive Digest', trigger: 'scheduled' },
                  { id: 'wf3', name: 'Automated Slack Ops Alert', trigger: 'email' },
                ]).slice(0, 4).map((w, idx) => (
                  <tr key={w.id || idx}>
                    <td>
                      <strong>{w.name}</strong>
                    </td>
                    <td>
                      <span className="nx-tag-pill">{w.trigger || 'automated'}</span>
                    </td>
                    <td>
                      <span className="nx-live-dot">● Active</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="organix-tool-btn"
                        style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                        onClick={() => go('app-workflows')}
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 5. Recent Activity Feed & Practical AI Next-Action Recommendations ── */}
      <div className="nx-dash-analytics-split" style={{ marginBottom: 24 }}>
        {/* G. Recent Activity Feed */}
        <div className="nx-dash-card-box nx-activity-card" style={{ flex: 1 }}>
          <div className="nx-dash-card-head">
            <div>
              <h3 className="nx-dash-card-title">Recent Activity</h3>
              <p className="nx-dash-card-subtitle">Audited events & workspace operations.</p>
            </div>
            <button
              type="button"
              className="nx-dash-text-link"
              onClick={() => go('app-notifications')}
            >
              View All Notifications →
            </button>
          </div>

          <motion.div
            className="nx-activity-feed-list"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {recentActivities.map((act, idx) => (
              <motion.div
                key={act.id}
                variants={fadeUp}
                custom={idx}
                whileHover={{ x: 4, transition: SPRING.smooth }}
                className="nx-activity-feed-row"
              >
                <div
                  className="nx-act-icon-bubble"
                  style={{ background: `${act.dotColor}18`, color: act.dotColor }}
                >
                  {act.icon}
                </div>
                <div className="nx-act-content">
                  <span className="nx-act-title">{act.title}</span>
                  <div className="nx-act-meta">
                    <span className="nx-act-cat">{act.category}</span>
                    <span className="nx-act-sep">·</span>
                    <span className="nx-act-time">{act.time}</span>
                  </div>
                </div>
                <span className="nx-act-status-chip" style={{ color: act.dotColor }}>
                  {act.status}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* H. AI Workspace Quick Insights (Action-Oriented) */}
        <div className="nx-dash-card-box" style={{ flex: 1 }}>
          <div className="nx-dash-card-head">
            <div>
              <h3 className="nx-dash-card-title">Workspace Quick Insights</h3>
              <p className="nx-dash-card-subtitle">Practical recommended next actions.</p>
            </div>
            <span className="nx-tag-pill" style={{ background: '#EDE7FF', color: '#7047EB', fontWeight: 700 }}>
              AI Assistant
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: '#F8F9FC',
              border: '1px solid #E9E8F1',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EDE7FF', color: '#7047EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LuZap size={16} />
              </div>
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#19182B', display: 'block', marginBottom: 3 }}>
                  Incident Triager Saved 18m Today
                </strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#74758A', lineHeight: 1.4 }}>
                  Automated routing resolved 4 GitHub issues directly to Slack channels without manual triage delays.
                </p>
              </div>
            </div>

            <div style={{
              background: '#F8F9FC',
              border: '1px solid #E9E8F1',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF4E8', color: '#F4AD4E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LuClock3 size={16} />
              </div>
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#19182B', display: 'block', marginBottom: 3 }}>
                  Upcoming Sprint Milestone Due
                </strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#74758A', lineHeight: 1.4 }}>
                  1 high-priority task is scheduled for delivery today. Check the task board to maintain sprint velocity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {newTaskOpen && (
        <Modal title="Create New Task" onClose={() => setNewTaskOpen(false)}>
          <TaskForm task={null} onSave={persistTask} onClose={() => setNewTaskOpen(false)} />
        </Modal>
      )}

      {editTask !== null && (
        <Modal title="Edit Task" onClose={() => setEditTask(null)}>
          <TaskForm task={editTask} onSave={persistTask} onClose={() => setEditTask(null)} />
        </Modal>
      )}
    </div>
  );
}
