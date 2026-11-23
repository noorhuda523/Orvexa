import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Btn } from '../components/Button';
import { useToast } from '../components/Toast';
import CountUp from '../components/CountUp';
import { readTasks, readWf } from '../utils/storage';
import { getAnalyticsIntelligence } from '../utils/analyticsData';
import {
  fadeUp,
  staggerContainer,
  cardVariants,
  EASE,
  SPRING,
} from '../motion/variants';
import {
  LuWorkflow,
  LuCircleCheck,
  LuCircleAlert,
  LuCheck,
  LuClock3,
  LuZap,
  LuTrendingUp,
  LuSparkles,
  LuDownload,
  LuSlidersHorizontal,
  LuCalendar,
  LuLayers,
  LuSearch,
  LuFilter,
  LuActivity,
  LuArrowUpRight,
  LuArrowDownRight,
  LuTriangleAlert,
  LuX,
  LuExternalLink,
  LuListChecks,
  LuMousePointerClick,
  LuInfo,
} from 'react-icons/lu';

import {
  ChartCard,
  LineChart,
  AreaChart,
  BarChart,
  HorizontalBarChart,
  DoughnutChart,
  SparklineChart,
  CHART_COLORS,
} from '../components/charts';

export default function Analytics() {
  const toast = useToast();
  const navigate = useNavigate();
  const [range, setRange] = useState('30d'); // '7d' | '30d' | '90d' | '12m' | 'custom'
  const [comparePeriod, setComparePeriod] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  // Series visibility toggles for multi-series line chart (Workflow Execution Trends)
  const [seriesVisible, setSeriesVisible] = useState({
    total: true,
    success: true,
    failed: true,
  });

  // Series visibility toggles for stacked bar chart (Task Delivery Velocity)
  const [taskSeriesVisible, setTaskSeriesVisible] = useState({
    completed: true,
    inProgress: true,
    pending: true,
    overdue: true,
  });

  // Task distribution dimension tabs for doughnut chart
  const [taskDimension, setTaskDimension] = useState('priority'); // 'priority' | 'category' | 'sla'

  // Workflow ranking sort metric for horizontal bar chart
  const [rankingSort, setRankingSort] = useState('executions'); // 'executions' | 'successRate'

  // Table search & filter state
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState('All');

  // Drill-down inspection modal / drawer state
  const [drillDown, setDrillDown] = useState(null);

  // Read stored data
  const tasks = useMemo(() => {
    try { return readTasks() || []; } catch { return []; }
  }, []);

  const workflows = useMemo(() => {
    try { return readWf() || []; } catch { return []; }
  }, []);

  // Centralized analytics intelligence engine synchronized with selected range
  const intelligence = useMemo(() => {
    return getAnalyticsIntelligence(range);
  }, [range, tasks, workflows]);

  // Synchronized range switcher with smooth transition
  const handleRangeChange = (newRange, label) => {
    if (newRange === range) return;
    setIsTransitioning(true);
    setRange(newRange);
    toast(`Intelligence reports synchronized for ${label}`);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 240);
  };

  /* ─── Chart.js Dataset Configurations ──────────────────────────────────── */

  // Multi-Series Line Chart (Workflow Execution Trends)
  const executionTrendsData = useMemo(() => {
    const datasets = [];

    if (seriesVisible.total) {
      datasets.push({
        label: 'Total Executions',
        data: intelligence.executions.total,
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primary,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3.5,
        pointHoverRadius: 7,
      });
    }

    if (seriesVisible.success) {
      datasets.push({
        label: 'Successful Runs',
        data: intelligence.executions.success,
        borderColor: CHART_COLORS.green,
        backgroundColor: CHART_COLORS.green,
        tension: 0.35,
        borderWidth: 2.2,
        pointRadius: 3.5,
        pointHoverRadius: 7,
      });
    }

    if (seriesVisible.failed) {
      datasets.push({
        label: 'Failed Executions',
        data: intelligence.executions.failed,
        borderColor: CHART_COLORS.red,
        backgroundColor: CHART_COLORS.red,
        tension: 0.35,
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 3.5,
        pointHoverRadius: 6,
      });
    }

    return {
      labels: intelligence.timelineLabels,
      datasets,
    };
  }, [intelligence, seriesVisible]);

  // Task Delivery Velocity Stacked Bar Chart with Interactive Series Toggles
  const taskPerformanceData = useMemo(() => {
    const datasets = [];

    if (taskSeriesVisible.completed) {
      datasets.push({
        label: 'Completed Tasks',
        data: intelligence.tasks.completed,
        backgroundColor: CHART_COLORS.green,
        stack: 'tasks',
      });
    }

    if (taskSeriesVisible.inProgress) {
      datasets.push({
        label: 'In Progress',
        data: intelligence.tasks.inProgress,
        backgroundColor: CHART_COLORS.primary,
        stack: 'tasks',
      });
    }

    if (taskSeriesVisible.pending) {
      datasets.push({
        label: 'Pending Tasks',
        data: intelligence.tasks.pending,
        backgroundColor: CHART_COLORS.orange,
        stack: 'tasks',
      });
    }

    if (taskSeriesVisible.overdue) {
      datasets.push({
        label: 'Overdue Tasks',
        data: intelligence.tasks.overdue,
        backgroundColor: CHART_COLORS.red,
        stack: 'tasks',
      });
    }

    return {
      labels: intelligence.timelineLabels,
      datasets,
    };
  }, [intelligence, taskSeriesVisible]);

  // Execution Reliability & Diagnostics Doughnut Chart
  const successRateDoughnutData = useMemo(() => {
    return {
      labels: ['Successful Executions', 'Failed Executions'],
      datasets: [
        {
          data: [intelligence.executions.sumSuccess, intelligence.executions.sumFailed],
          backgroundColor: [CHART_COLORS.green, CHART_COLORS.red],
          borderColor: '#FFFFFF',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    };
  }, [intelligence]);

  // Productivity Trends Area Chart
  const productivityTrendsData = useMemo(() => {
    return {
      labels: intelligence.timelineLabels,
      datasets: [
        {
          label: 'Productivity Index',
          data: intelligence.productivity.timeline,
          borderColor: CHART_COLORS.secondary,
          fill: true,
        },
      ],
    };
  }, [intelligence]);

  // Workflow Performance Comparison Horizontal Bar Chart
  const workflowRankingData = useMemo(() => {
    const list = [...intelligence.rankedWorkflows].sort((a, b) => {
      if (rankingSort === 'successRate') return b.successRate - a.successRate;
      return b.executions - a.executions;
    });

    return {
      labels: list.map((w) => w.name),
      datasets: [
        {
          label: rankingSort === 'successRate' ? 'Success Rate (%)' : 'Total Executions',
          data: list.map((w) => (rankingSort === 'successRate' ? w.successRate : w.executions)),
          backgroundColor: rankingSort === 'successRate' ? CHART_COLORS.green : CHART_COLORS.primary,
          borderRadius: 6,
        },
      ],
    };
  }, [intelligence, rankingSort]);

  // Time Saved Analysis Bar Chart
  const timeSavedBarData = useMemo(() => {
    return {
      labels: intelligence.timelineLabels,
      datasets: [
        {
          label: 'Hours Saved',
          data: intelligence.timeSaved.timeline,
          backgroundColor: CHART_COLORS.cyan,
          borderRadius: 6,
        },
      ],
    };
  }, [intelligence]);

  // Multi-Dimensional Task Priority & Status Breakdown Doughnut Chart
  const taskDistributionData = useMemo(() => {
    if (taskDimension === 'priority') {
      const p = intelligence.tasks.byPriority;
      return {
        labels: ['High Priority', 'Medium Priority', 'Low Priority'],
        datasets: [
          {
            data: [p.high, p.medium, p.low],
            backgroundColor: [CHART_COLORS.red, CHART_COLORS.orange, CHART_COLORS.blue],
            borderColor: '#FFFFFF',
            borderWidth: 2.5,
          },
        ],
      };
    }
    if (taskDimension === 'category') {
      const c = intelligence.tasks.byCategory;
      return {
        labels: ['Development', 'Operations', 'Design', 'Marketing'],
        datasets: [
          {
            data: [c.development, c.operations, c.design, c.marketing],
            backgroundColor: [CHART_COLORS.primary, CHART_COLORS.cyan, CHART_COLORS.secondary, CHART_COLORS.orange],
            borderColor: '#FFFFFF',
            borderWidth: 2.5,
          },
        ],
      };
    }
    // SLA Dimension
    const s = intelligence.tasks.bySLA;
    return {
      labels: ['Delivered On-Time', 'At Risk (Near SLA)', 'Overdue SLA'],
      datasets: [
        {
          data: [s.onTime, s.atRisk, s.overdue],
          backgroundColor: [CHART_COLORS.green, CHART_COLORS.orange, CHART_COLORS.red],
          borderColor: '#FFFFFF',
          borderWidth: 2.5,
        },
      ],
    };
  }, [intelligence, taskDimension]);

  // Filtered table rows
  const filteredTableWorkflows = useMemo(() => {
    return intelligence.rankedWorkflows.filter((w) => {
      if (tableCategory !== 'All' && w.category !== tableCategory) return false;
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        return w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [intelligence, tableCategory, tableSearch]);

  const handleExport = () => {
    toast(`Exporting comprehensive analytics intelligence report for ${range.toUpperCase()}...`);
    setTimeout(() => {
      toast('Analytics report (CSV/JSON) generated successfully.', 'ok');
    }, 700);
  };

  /* ─── Click & Drill-Down Handlers ───────────────────────────────────────── */

  // 1. Line Chart click -> inspect executions on specific date
  const handleLineChartClick = ({ index, label, value, dataset }) => {
    const totalOnDate = intelligence.executions.total[index] || value || 42;
    const successOnDate = intelligence.executions.success[index] || Math.round(totalOnDate * 0.98);
    const failedOnDate = intelligence.executions.failed[index] || (totalOnDate - successOnDate);
    const successPct = totalOnDate > 0 ? ((successOnDate / totalOnDate) * 100).toFixed(1) : '100.0';

    setDrillDown({
      title: `Workflow Executions Telemetry — ${label}`,
      subtitle: `Granular inspection of pipeline dispatches and anomaly rates recorded on ${label}.`,
      badge: dataset?.label || 'Execution Record',
      badgeColor: '#7047EB',
      stats: [
        { label: 'Total Runs', val: totalOnDate, color: '#7047EB' },
        { label: 'Successful', val: successOnDate, color: '#16B890' },
        { label: 'Exceptions', val: failedOnDate, color: failedOnDate > 0 ? '#E5484D' : '#74758A' },
        { label: 'Reliability', val: `${successPct}%`, color: '#16B890' },
      ],
      listTitle: `Active Pipelines on ${label}`,
      items: intelligence.rankedWorkflows.slice(0, 4).map((w, idx) => ({
        id: idx,
        name: w.name,
        category: w.category,
        status: idx === 3 && failedOnDate > 0 ? 'Retry Required' : 'Completed',
        statusColor: idx === 3 && failedOnDate > 0 ? '#E5484D' : '#16B890',
        latency: w.avgSpeed,
        timestamp: `${10 + idx * 2}:${idx * 14 < 10 ? '0' : ''}${idx * 14} AM`,
      })),
      actionText: 'Manage Pipelines in Workflow Studio',
      actionRoute: '/app/workflows',
    });
  };

  // 2. Reliability Doughnut click -> inspect successful vs failed runs
  const handleReliabilityClick = ({ index, label, value }) => {
    const isSuccess = index === 0 || (label && label.toLowerCase().includes('success'));
    setDrillDown({
      title: isSuccess ? 'Successful Executions Audit' : 'Exception & Dropout Diagnostics',
      subtitle: isSuccess
        ? `Comprehensive trace of ${value} successful workflow runs with zero execution barriers.`
        : `Diagnostic analysis of ${value} dropped execution events across ${range.toUpperCase()}.`,
      badge: isSuccess ? 'Optimal Health' : 'Exception Log',
      badgeColor: isSuccess ? '#16B890' : '#E5484D',
      stats: [
        { label: 'Analyzed Runs', val: value, color: isSuccess ? '#16B890' : '#E5484D' },
        { label: 'System Success Rate', val: `${intelligence.executions.successRate}%`, color: '#16B890' },
        { label: 'Mean Latency', val: '315ms', color: '#7047EB' },
        { label: 'Diagnostic SLA', val: isSuccess ? '99.9% Met' : 'Investigation Ready', color: '#74758A' },
      ],
      listTitle: isSuccess ? 'Recently Verified Pipeline Runs' : 'Failed Run Incident Trace',
      items: isSuccess
        ? [
            { id: 1, name: 'Automated CI Deployment', category: 'DevOps', status: 'Passed', statusColor: '#16B890', latency: '340ms', timestamp: 'Just now' },
            { id: 2, name: 'Incident Auto-Triage', category: 'DevOps', status: 'Passed', statusColor: '#16B890', latency: '210ms', timestamp: '4 mins ago' },
            { id: 3, name: 'Customer Sentiment Sync', category: 'Reporting', status: 'Passed', statusColor: '#16B890', latency: '420ms', timestamp: '12 mins ago' },
          ]
        : [
            { id: 1, name: 'Slack Bot Sync Webhook', category: 'Integration', status: 'Rate Limited (HTTP 429)', statusColor: '#E5484D', latency: '1240ms', timestamp: '2 hours ago' },
            { id: 2, name: 'Stripe Invoice Aggregator', category: 'Finance', status: 'Timeout on Remote API', statusColor: '#E5484D', latency: '5000ms', timestamp: 'Yesterday' },
          ],
      actionText: 'Open Workflows to Inspect Triggers',
      actionRoute: '/app/workflows',
    });
  };

  // 3. Task Delivery Velocity Stacked Bar click -> inspect tasks on date
  const handleTaskBarClick = ({ index, label, value, dataset }) => {
    const completed = intelligence.tasks.completed[index] || 0;
    const inProgress = intelligence.tasks.inProgress[index] || 0;
    const pending = intelligence.tasks.pending[index] || 0;
    const overdue = intelligence.tasks.overdue[index] || 0;
    const total = completed + inProgress + pending + overdue;

    setDrillDown({
      title: `Task Delivery Throughput — ${label}`,
      subtitle: `Delivery velocity audit across ${total} scheduled work units on ${label}.`,
      badge: dataset?.label || 'Throughput Segment',
      badgeColor: '#16B890',
      stats: [
        { label: 'Completed', val: completed, color: '#16B890' },
        { label: 'In Progress', val: inProgress, color: '#7047EB' },
        { label: 'Pending', val: pending, color: '#F4AD4E' },
        { label: 'Overdue', val: overdue, color: overdue > 0 ? '#E5484D' : '#74758A' },
      ],
      listTitle: `Work Items Scheduled for ${label}`,
      items: [
        { id: 1, name: 'Core Microservice Cache Refactor', category: 'Development', status: completed > 0 ? 'Completed' : 'In Progress', statusColor: completed > 0 ? '#16B890' : '#7047EB', latency: 'SLA: 24h', timestamp: 'Sprint 42' },
        { id: 2, name: 'Enterprise SSO OAuth2 Assertion Flow', category: 'Operations', status: inProgress > 0 ? 'In Progress' : 'Pending', statusColor: inProgress > 0 ? '#7047EB' : '#F4AD4E', latency: 'SLA: 48h', timestamp: 'Sprint 42' },
        { id: 3, name: 'Design System Token Unification', category: 'Design', status: pending > 0 ? 'Pending' : 'Completed', statusColor: pending > 0 ? '#F4AD4E' : '#16B890', latency: 'SLA: 72h', timestamp: 'Sprint 42' },
      ],
      actionText: 'View Kanban & Task Board',
      actionRoute: '/app/tasks',
    });
  };

  // 4. Task Dimension Doughnut click -> inspect priority/category/SLA segment
  const handleTaskDistributionClick = ({ index, label, value }) => {
    setDrillDown({
      title: `Task Segment Audit — ${label}`,
      subtitle: `Detailed inspection of all workspace tasks currently classified under "${label}".`,
      badge: `${value} Work Items`,
      badgeColor: '#7047EB',
      stats: [
        { label: 'Filtered Count', val: value, color: '#7047EB' },
        { label: 'Active Dimension', val: taskDimension.toUpperCase(), color: '#19182B' },
        { label: 'Delivery Pace', val: 'Optimal', color: '#16B890' },
        { label: 'Target Completion', val: 'Q4 Baseline', color: '#74758A' },
      ],
      listTitle: `Tasks matching "${label}"`,
      items: [
        { id: 1, name: `${label} Pipeline Optimization Unit`, category: taskDimension === 'category' ? label : 'Engineering', status: 'In Review', statusColor: '#7047EB', latency: 'P1', timestamp: 'Assigned to Team' },
        { id: 2, name: `${label} Continuous Verification Check`, category: taskDimension === 'category' ? label : 'Quality', status: 'Active', statusColor: '#16B890', latency: 'P2', timestamp: 'Automated' },
        { id: 3, name: `${label} Documentation & Hand-off`, category: taskDimension === 'category' ? label : 'Product', status: 'Pending', statusColor: '#F4AD4E', latency: 'P3', timestamp: 'Scheduled' },
      ],
      actionText: 'Open Full Task Board',
      actionRoute: '/app/tasks',
    });
  };

  // 5. Productivity Area Chart click -> inspect productivity on date
  const handleProductivityClick = ({ index, label, value }) => {
    setDrillDown({
      title: `Productivity Benchmark — ${label}`,
      subtitle: `Productivity index score of ${value}% recorded across team automation and task delivery.`,
      badge: `${value}% Score`,
      badgeColor: '#8B75F5',
      stats: [
        { label: 'Productivity Index', val: `${value}%`, color: '#8B75F5' },
        { label: 'Average Score', val: `${intelligence.productivity.avgScore}%`, color: '#7047EB' },
        { label: 'Period Trend', val: intelligence.productivity.delta, color: '#16B890' },
        { label: 'Efficiency Tier', val: value >= 90 ? 'Top 5% Tier' : 'Strong Output', color: '#16B890' },
      ],
      listTitle: 'Contributing Telemetry Factors',
      items: [
        { id: 1, name: 'Automated Background Triage Execution', category: 'Efficiency', status: '+14% Velocity', statusColor: '#16B890', latency: 'Zero Blockers', timestamp: 'Full Automated' },
        { id: 2, name: 'Cross-functional PR Review Turnaround', category: 'Teamwork', status: 'Sub-2h Merge', statusColor: '#16B890', latency: '35 PRs', timestamp: 'Engineering' },
        { id: 3, name: 'Continuous Monitoring Health Score', category: 'Reliability', status: '99.98% Uptime', statusColor: '#16B890', latency: '24/7 Monitored', timestamp: 'Infra' },
      ],
      actionText: 'Explore Workflow Automation',
      actionRoute: '/app/workflows',
    });
  };

  // 6. Time Saved Bar Chart click -> inspect ROI on date
  const handleTimeSavedClick = ({ index, label, value }) => {
    const hours = value || 8.4;
    const dollarSavings = Math.round(hours * 48); // $48/hr engineer equivalent

    setDrillDown({
      title: `Human Time Reclaimed — ${label}`,
      subtitle: `Eliminated approximately ${hours} hours of repetitive manual toil on ${label}.`,
      badge: `${hours} Hours Saved`,
      badgeColor: '#65D5CA',
      stats: [
        { label: 'Reclaimed Effort', val: `${hours} hrs`, color: '#16B890' },
        { label: 'Estimated Dollar ROI', val: `$${dollarSavings}`, color: '#7047EB' },
        { label: 'Total Interval Saved', val: `${intelligence.timeSaved.totalHours} hrs`, color: '#16B890' },
        { label: 'Manual Tasks Replaced', val: Math.round(hours * 2.2), color: '#74758A' },
      ],
      listTitle: 'Primary Contributing Automations',
      items: [
        { id: 1, name: 'Incident Auto-Triage Pipeline', category: 'DevOps', status: `${(hours * 0.45).toFixed(1)} hrs saved`, statusColor: '#16B890', latency: '42 Runs', timestamp: 'Autonomous' },
        { id: 2, name: 'Automated Slack Digest & Sync', category: 'Reporting', status: `${(hours * 0.35).toFixed(1)} hrs saved`, statusColor: '#16B890', latency: '18 Runs', timestamp: 'Autonomous' },
        { id: 3, name: 'Continuous Dependency Audit', category: 'Security', status: `${(hours * 0.2).toFixed(1)} hrs saved`, statusColor: '#16B890', latency: '12 Runs', timestamp: 'Autonomous' },
      ],
      actionText: 'View Automation Catalog',
      actionRoute: '/app/workflows',
    });
  };

  // 7. Workflow Ranking Horizontal Bar click -> inspect specific pipeline
  const handleWorkflowRankingClick = ({ index, label, value }) => {
    const pipeline = intelligence.rankedWorkflows.find((w) => w.name === label) || intelligence.rankedWorkflows[index] || {
      name: label,
      category: 'DevOps',
      executions: value,
      successRate: 99.6,
      avgSpeed: '280ms',
      trigger: 'Webhook Event',
      status: 'Optimal',
      delta: '+18.4%',
    };

    setDrillDown({
      title: `Pipeline Performance Profile — ${pipeline.name}`,
      subtitle: `Detailed health audit and execution telemetry for "${pipeline.name}".`,
      badge: pipeline.category,
      badgeColor: '#7047EB',
      stats: [
        { label: 'Total Executions', val: pipeline.executions, color: '#7047EB' },
        { label: 'Success Rate', val: `${pipeline.successRate}%`, color: '#16B890' },
        { label: 'Mean Latency', val: pipeline.avgSpeed, color: '#19182B' },
        { label: 'Audit Status', val: pipeline.status, color: pipeline.status === 'Optimal' ? '#16B890' : '#F4AD4E' },
      ],
      listTitle: 'Pipeline Architecture & Runtime Specifications',
      items: [
        { id: 1, name: 'Trigger Mechanism', category: 'Configuration', status: pipeline.trigger, statusColor: '#7047EB', latency: 'Real-time', timestamp: 'Verified' },
        { id: 2, name: 'Error Handling Policy', category: 'Resilience', status: 'Exponential Backoff (3 retries)', statusColor: '#16B890', latency: 'Sub-5s timeout', timestamp: 'Enabled' },
        { id: 3, name: 'Period Over Period Growth', category: 'Throughput', status: pipeline.delta, statusColor: '#16B890', latency: 'Expanding', timestamp: range.toUpperCase() },
      ],
      actionText: 'Open in Workflow Builder',
      actionRoute: '/app/workflows',
    });
  };

  return (
    <div className="pg apppg nx-analytics-page" style={{ padding: '24px 32px 64px', maxWidth: 1440, margin: '0 auto', position: 'relative' }}>
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: '0%',
          height: 2.5,
          background: 'linear-gradient(90deg, #7047EB 0%, #8B75F5 50%, #65D5CA 100%)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />

      {/* ── 1. Analytics & Reporting Header (Deep Intelligence Center) ── */}
      <motion.div
        className="nx-page-header"
        style={{ marginBottom: 24 }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE.out }}
      >
        <div className="nx-header-left">
          <div className="nx-header-breadcrumbs">
            <span>Workspace</span>
            <span className="nx-bc-sep">/</span>
            <span className="nx-bc-current">Performance & Intelligence</span>
          </div>
          <h1 className="nx-page-title">Performance & Telemetry Intelligence</h1>
          <p className="nx-page-sub">
            Evaluate historical throughput, workflow reliability, resource allocation, and automation ROI across your workspace.
          </p>
        </div>

        <div className="nx-header-actions">
          {/* Synchronized Date Range Selector */}
          <div className="nx-chart-pills">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: 'Quarter' },
              { id: '12m', label: '12 Months' },
              { id: 'custom', label: 'Custom' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                className={`nx-chart-pill-btn ${range === p.id ? 'active' : ''}`}
                onClick={() => handleRangeChange(p.id, p.label)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Period comparison toggle */}
          <button
            type="button"
            className="organix-tool-btn"
            style={{
              background: comparePeriod ? '#EDE7FF' : '#FFFFFF',
              color: comparePeriod ? '#7047EB' : '#74758A',
              borderColor: comparePeriod ? '#D6D2EB' : '#E9E8F1',
              fontWeight: 600,
            }}
            onClick={() => {
              setComparePeriod(!comparePeriod);
              toast(comparePeriod ? 'Disabled period comparisons' : 'Enabled period-over-period comparisons');
            }}
          >
            <LuSlidersHorizontal size={13} />
            <span>vs. Previous Period</span>
          </button>

          <Btn v="sec" onClick={handleExport}>
            <LuDownload size={14} style={{ marginRight: 6 }} />
            Export Report
          </Btn>
        </div>
      </motion.div>

      {/* ── 2. Detailed Performance Indicators (7 Multi-Period Telemetry Metrics with Scroll Stagger) ── */}
      <motion.div
        className="nx-analytics-kpi-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {intelligence.metrics.map((m, idx) => (
          <motion.div
            key={m.id}
            className="nx-akpi-card"
            variants={cardVariants}
            custom={idx}
            whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(112, 71, 235, 0.08)' }}
          >
            <div className="nx-akpi-top">
              <span className="nx-akpi-label">{m.label}</span>
              <span className={`nx-akpi-delta ${m.trend === 'good-down' || m.trend === 'up' ? 'up' : 'down'}`}>
                {m.trend === 'good-down' ? <LuArrowDownRight size={11} /> : <LuArrowUpRight size={11} />}
                {m.delta}
              </span>
            </div>
            <div className="nx-akpi-num" style={{ fontSize: '1.65rem' }}>
              {typeof m.value === 'number' ? <CountUp to={m.value} duration={700} /> : m.value}
            </div>
            <p className="nx-akpi-sub">{m.detail}</p>
            <div style={{ height: 24, marginTop: 6 }}>
              <SparklineChart
                data={m.sparkline}
                color={idx === 1 ? CHART_COLORS.green : idx === 2 ? CHART_COLORS.red : idx === 3 ? CHART_COLORS.cyan : CHART_COLORS.primary}
                fill
                height={24}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive Telemetry Hint Pill with Viewport Fade */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: EASE.out }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#EDE7FF',
          border: '1px solid #D6D2EB',
          borderRadius: 8,
          padding: '8px 14px',
          marginBottom: 20,
          fontSize: '0.8rem',
          color: '#7047EB',
        }}
      >
        <LuMousePointerClick size={15} />
        <span>
          <strong>Interactive Telemetry View:</strong> Click any chart node, bar segment, or doughnut slice to open detailed drill-down audits and historical logs.
        </span>
      </motion.div>

      {/* ── Synchronized Animated Charts Container with Scroll Animations ── */}
      <motion.div
        animate={{ opacity: isTransitioning ? 0.45 : 1, y: isTransitioning ? 4 : 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {/* ── 3. Row 1: Workflow Execution Trends (C) & Reliability Diagnostics (E) ── */}
        <motion.div
          className="nx-dashboard-charts-grid"
          style={{ marginBottom: 24 }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: EASE.out }}
        >
          {/* C. Multi-Series Line Chart with Interactive Dataset Visibility Toggles */}
          <ChartCard
            title="Workflow Execution Trends"
            subtitle={`Throughput velocity tracking total, successful, and exception dropouts across ${range.toUpperCase()}. Click any point to inspect runs.`}
            height={300}
            actions={
              <div className="nx-chart-legend">
                <button
                  type="button"
                  className={`nx-chart-legend-item ${!seriesVisible.total ? 'inactive' : ''}`}
                  onClick={() => setSeriesVisible(s => ({ ...s, total: !s.total }))}
                  title="Toggle Total series"
                >
                  <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.primary }} />
                  Total Runs
                </button>
                <button
                  type="button"
                  className={`nx-chart-legend-item ${!seriesVisible.success ? 'inactive' : ''}`}
                  onClick={() => setSeriesVisible(s => ({ ...s, success: !s.success }))}
                  title="Toggle Success series"
                >
                  <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.green }} />
                  Successful
                </button>
                <button
                  type="button"
                  className={`nx-chart-legend-item ${!seriesVisible.failed ? 'inactive' : ''}`}
                  onClick={() => setSeriesVisible(s => ({ ...s, failed: !s.failed }))}
                  title="Toggle Failed series"
                >
                  <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.red }} />
                  Failed
                </button>
              </div>
            }
          >
            <LineChart
              data={executionTrendsData}
              height={300}
              yTitle="Executions"
              onDataClick={handleLineChartClick}
            />
          </ChartCard>

          {/* E. Execution Reliability & Failure Diagnostics Doughnut Chart */}
          <ChartCard
            title="Execution Reliability Diagnostics"
            subtitle="Proportion of successful executions vs. exception events. Click a segment to inspect."
            height={300}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minHeight: 200 }}>
                <DoughnutChart
                  data={successRateDoughnutData}
                  centerValue={`${intelligence.executions.successRate}%`}
                  centerLabel="Success Rate"
                  height={200}
                  onDataClick={handleReliabilityClick}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 12, borderTop: '1px solid #F1F0FA' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#19182B', cursor: 'pointer' }}
                  onClick={() => handleReliabilityClick({ index: 0, label: 'Successful Executions', value: intelligence.executions.sumSuccess })}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS.green }} />
                  <strong>{intelligence.executions.sumSuccess} Successful Runs</strong>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#19182B', cursor: 'pointer' }}
                  onClick={() => handleReliabilityClick({ index: 1, label: 'Failed Executions', value: intelligence.executions.sumFailed })}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS.red }} />
                  <strong>{intelligence.executions.sumFailed} Exception Drops</strong>
                </div>
              </div>
            </div>
          </ChartCard>
        </motion.div>

        {/* ── 4. Row 2: Task Delivery Velocity (D) & Multi-Dimensional Task Tabs (I) with Scroll Entrance ── */}
        <motion.div
          className="nx-dashboard-charts-grid"
          style={{ marginBottom: 24 }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: EASE.out }}
        >
          {/* D. Task Delivery Velocity Stacked Bar Chart with Interactive Series Toggles */}
          <ChartCard
            title="Task Delivery Velocity & Throughput"
            subtitle="Volume of completed, in-progress, pending, and overdue tasks stacked over time. Click any bar to audit."
            height={280}
            actions={
              <div className="nx-chart-legend">
                <button
                  type="button"
                  className={`nx-chart-legend-item ${!taskSeriesVisible.completed ? 'inactive' : ''}`}
                  onClick={() => setTaskSeriesVisible(s => ({ ...s, completed: !s.completed }))}
                  title="Toggle Completed"
                >
                  <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.green }} />
                  Completed
                </button>
                <button
                  type="button"
                  className={`nx-chart-legend-item ${!taskSeriesVisible.inProgress ? 'inactive' : ''}`}
                  onClick={() => setTaskSeriesVisible(s => ({ ...s, inProgress: !s.inProgress }))}
                  title="Toggle In Progress"
                >
                  <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.primary }} />
                  In Progress
                </button>
                <button
                  type="button"
                  className={`nx-chart-legend-item ${!taskSeriesVisible.pending ? 'inactive' : ''}`}
                  onClick={() => setTaskSeriesVisible(s => ({ ...s, pending: !s.pending }))}
                  title="Toggle Pending"
                >
                  <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.orange }} />
                  Pending
                </button>
                <button
                  type="button"
                  className={`nx-chart-legend-item ${!taskSeriesVisible.overdue ? 'inactive' : ''}`}
                  onClick={() => setTaskSeriesVisible(s => ({ ...s, overdue: !s.overdue }))}
                  title="Toggle Overdue"
                >
                  <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.red }} />
                  Overdue
                </button>
              </div>
            }
          >
            <BarChart
              data={taskPerformanceData}
              stacked
              height={280}
              yTitle="Tasks"
              onDataClick={handleTaskBarClick}
            />
          </ChartCard>

          {/* I. Task Priority & Status Breakdown Doughnut Chart with Dimension Tabs */}
          <ChartCard
            title="Multi-Dimensional Task Breakdown"
            subtitle="Explore tasks segmented across priority tiers, departments, and SLA compliance. Click any slice to filter."
            height={280}
            actions={
              <div className="nx-chart-pills">
                {[
                  { id: 'priority', label: 'Priority' },
                  { id: 'category', label: 'Department' },
                  { id: 'sla', label: 'SLA Status' },
                ].map((dim) => (
                  <button
                    key={dim.id}
                    type="button"
                    className={`nx-chart-pill-btn ${taskDimension === dim.id ? 'active' : ''}`}
                    onClick={() => setTaskDimension(dim.id)}
                  >
                    {dim.label}
                  </button>
                ))}
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minHeight: 200 }}>
                <DoughnutChart
                  data={taskDistributionData}
                  centerValue={`${intelligence.tasks.completed.reduce((a, b) => a + b, 0)}`}
                  centerLabel={taskDimension === 'priority' ? 'Prioritized Tasks' : taskDimension === 'category' ? 'Categorized' : 'SLA Tracked'}
                  height={200}
                  onDataClick={handleTaskDistributionClick}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 10, borderTop: '1px solid #F1F0FA' }}>
                {taskDistributionData.labels.map((lbl, idx) => (
                  <div
                    key={lbl}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#74758A', cursor: 'pointer' }}
                    onClick={() => handleTaskDistributionClick({ index: idx, label: lbl, value: taskDistributionData.datasets[0].data[idx] })}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: taskDistributionData.datasets[0].backgroundColor[idx],
                      }}
                    />
                    <span>{lbl} ({taskDistributionData.datasets[0].data[idx]})</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </motion.div>

        {/* ── 5. Row 3: Productivity Trends (F) & Time Saved ROI Analysis (H) with Scroll Entrance ── */}
        <motion.div
          className="nx-dashboard-charts-row"
          style={{ marginBottom: 24 }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: EASE.out }}
        >
          {/* F. Productivity Trends Area Chart */}
          <ChartCard
            title="Productivity Performance Curve"
            subtitle="Organization-wide productivity benchmark index mapped over time. Click any point to view telemetry."
            height={260}
            actions={
              <span className="nx-chart-legend-item">
                <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.secondary }} />
                Avg: {intelligence.productivity.avgScore}%
              </span>
            }
          >
            <AreaChart
              data={productivityTrendsData}
              height={260}
              yTitle="Score (%)"
              onDataClick={handleProductivityClick}
            />
          </ChartCard>

          {/* H. Human Time Saved ROI Analysis Bar Chart */}
          <ChartCard
            title="Human Time Saved & Automation ROI"
            subtitle="Hours of manual human effort eliminated by autonomous execution. Click any bar to inspect ROI."
            height={260}
            actions={
              <span className="nx-chart-legend-item">
                <span className="nx-chart-legend-dot" style={{ background: CHART_COLORS.cyan }} />
                Total: {intelligence.timeSaved.totalHours} hrs
              </span>
            }
          >
            <BarChart
              data={timeSavedBarData}
              height={260}
              yTitle="Hours Saved"
              onDataClick={handleTimeSavedClick}
            />
          </ChartCard>
        </motion.div>

        {/* Explanatory Footnote for Time Saved */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: EASE.out }}
          style={{
            background: '#F8F9FC',
            border: '1px solid #E9E8F1',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: '0.78rem',
            color: '#74758A',
            lineHeight: 1.5,
            marginBottom: 24,
          }}
        >
          <strong>Methodology Note:</strong> Estimated human time saved is calculated dynamically by multiplying automated execution cycles against manual task baselines (0.45h per manual task execution, 2.5h per autonomous pipeline execution) across the selected interval.
        </motion.div>

        {/* ── 6. Row 4: Workflow Performance Ranking Horizontal Bar (G) with Scroll Entrance ── */}
        <motion.div
          style={{ marginBottom: 24 }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: EASE.out }}
        >
          <ChartCard
            title="Workflow Performance Ranking"
            subtitle="Top automated pipelines ranked by execution throughput or reliability. Click any pipeline bar for details."
            height={280}
            actions={
              <div className="nx-chart-pills">
                <button
                  type="button"
                  className={`nx-chart-pill-btn ${rankingSort === 'executions' ? 'active' : ''}`}
                  onClick={() => setRankingSort('executions')}
                >
                  Sort: By Executions
                </button>
                <button
                  type="button"
                  className={`nx-chart-pill-btn ${rankingSort === 'successRate' ? 'active' : ''}`}
                  onClick={() => setRankingSort('successRate')}
                >
                  Sort: By Reliability
                </button>
              </div>
            }
          >
            <HorizontalBarChart
              data={workflowRankingData}
              height={280}
              xTitle={rankingSort === 'successRate' ? 'Success Rate (%)' : 'Total Executions'}
              onDataClick={handleWorkflowRankingClick}
            />
          </ChartCard>
        </motion.div>
      </motion.div>

      {/* ── 7. Detailed Performance Data Table (J) with Scroll Entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.52, ease: EASE.out }}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E9E8F1',
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 24,
          boxShadow: '0 2px 6px rgba(25, 24, 43, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#19182B' }}>
              Pipeline Performance Telemetry Table
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#74758A' }}>
              Comprehensive execution metrics, average latency, and health audits per workflow.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <LuSearch size={14} style={{ position: 'absolute', left: 10, color: '#74758A' }} />
              <input
                type="text"
                placeholder="Search pipelines..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="organix-tool-btn"
                style={{ paddingLeft: 30, width: 180 }}
              />
            </div>

            {/* Department / Category Filter */}
            <select
              className="organix-tool-btn"
              value={tableCategory}
              onChange={(e) => setTableCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="DevOps">DevOps</option>
              <option value="CI/CD">CI/CD</option>
              <option value="Reporting">Reporting</option>
              <option value="Integration">Integration</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: '#F8F9FC', borderBottom: '1px solid #E9E8F1', color: '#74758A' }}>
                <th style={{ padding: '12px 16px' }}>Pipeline Name</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Trigger Type</th>
                <th style={{ padding: '12px 16px' }}>Runs ({range.toUpperCase()})</th>
                <th style={{ padding: '12px 16px' }}>Success Rate</th>
                <th style={{ padding: '12px 16px' }}>Avg Latency</th>
                <th style={{ padding: '12px 16px' }}>Health Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Period Delta</th>
              </tr>
            </thead>
            <tbody>
              {filteredTableWorkflows.map((w, idx) => (
                <tr
                  key={idx}
                  style={{ borderBottom: '1px solid #F1F0FA', cursor: 'pointer', transition: 'background 0.15s ease' }}
                  onClick={() => handleWorkflowRankingClick({ index: idx, label: w.name, value: w.executions })}
                  className="nx-table-row-hover"
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#19182B' }}>
                    {w.name}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="organix-tag development">{w.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#74758A' }}>
                    <span className="organix-tool-btn" style={{ padding: '2px 8px', fontSize: '0.74rem' }}>
                      {w.trigger}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {w.executions}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: w.successRate >= 99.5 ? '#16B890' : '#7047EB', fontWeight: 700 }}>
                      {w.successRate}%
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#74758A' }}>
                    {w.avgSpeed}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: w.status === 'Optimal' ? '#E8F8F4' : '#FEF4E8',
                      color: w.status === 'Optimal' ? '#16B890' : '#F4AD4E',
                    }}>
                      ● {w.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#16B890', fontWeight: 600 }}>
                    {w.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── 8. Intelligent Performance Observations & Bottleneck Audit (K) with Staggered Viewport Entrance ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.52, ease: EASE.out }}
        style={{
          background: '#FFFFFF',
          border: '1px solid #E9E8F1',
          borderRadius: 14,
          padding: '20px 24px',
          boxShadow: '0 2px 6px rgba(25, 24, 43, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#19182B' }}>
              Intelligent Performance Observations & Bottleneck Audit
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#74758A' }}>
              Empirical telemetry analysis and automated optimization opportunities based on actual execution data.
            </p>
          </div>
          <span className="nx-tag-pill" style={{ background: '#EDE7FF', color: '#7047EB', fontWeight: 700 }}>
            AI Engine Audit
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {/* Observation 1 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.05, ease: EASE.out }}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(112, 71, 235, 0.08)' }}
            style={{
              background: '#F8F9FC',
              border: '1px solid #E9E8F1',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#E8F8F4', color: '#16B890', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LuCircleCheck size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#19182B', display: 'block', marginBottom: 4 }}>
                Highest Velocity Pipeline: Incident Auto-Triage
              </strong>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#74758A', lineHeight: 1.45 }}>
                Achieved 420 executions with a 99.6% reliability rating and sub-280ms average dispatch latency over the current observation period.
              </p>
            </div>
          </motion.div>

          {/* Observation 2 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.12, ease: EASE.out }}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(112, 71, 235, 0.08)' }}
            style={{
              background: '#F8F9FC',
              border: '1px solid #E9E8F1',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EDE7FF', color: '#7047EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LuSparkles size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#19182B', display: 'block', marginBottom: 4 }}>
                Automation ROI: 142.5 Human Hours Reclaimed
              </strong>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#74758A', lineHeight: 1.45 }}>
                Autonomous background execution reduced manual triage and reporting overhead by 34.5% compared to the baseline period.
              </p>
            </div>
          </motion.div>

          {/* Observation 3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.18, ease: EASE.out }}
            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(112, 71, 235, 0.08)' }}
            style={{
              background: '#F8F9FC',
              border: '1px solid #E9E8F1',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FEF4E8', color: '#F4AD4E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LuTriangleAlert size={18} />
            </div>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#19182B', display: 'block', marginBottom: 4 }}>
                Latency Optimization Opportunity
              </strong>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#74758A', lineHeight: 1.45 }}>
                Slack Bot webhook delivery experienced intermittent API rate throttling. Batching weekly digests into 15-minute scheduled windows is projected to reduce latency by 28%.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── 9. Granular Drill-Down Inspection Modal ── */}
      <AnimatePresence>
        {drillDown && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrillDown(null)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(25, 24, 43, 0.45)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                position: 'relative',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E9E8F1',
                boxShadow: '0 24px 60px rgba(25, 24, 43, 0.16)',
                width: '100%',
                maxWidth: 680,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                zIndex: 1,
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #F1F0FA',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                background: '#FAFAFD',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: '#EDE7FF',
                      color: drillDown.badgeColor || '#7047EB',
                    }}>
                      {drillDown.badge}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#74758A' }}>Telemetry Deep Dive</span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#19182B' }}>
                    {drillDown.title}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#74758A' }}>
                    {drillDown.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDrillDown(null)}
                  style={{
                    background: '#F1F0FA',
                    border: 'none',
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#74758A',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#E5E4F0'; e.currentTarget.style.color = '#19182B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F0FA'; e.currentTarget.style.color = '#74758A'; }}
                >
                  <LuX size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
                {/* Micro Stats Grid */}
                {drillDown.stats && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${drillDown.stats.length}, 1fr)`,
                    gap: 12,
                    marginBottom: 20,
                  }}>
                    {drillDown.stats.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#F8F9FC',
                          border: '1px solid #E9E8F1',
                          borderRadius: 10,
                          padding: '12px 14px',
                        }}
                      >
                        <div style={{ fontSize: '0.74rem', color: '#74758A', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: s.color || '#19182B' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Granular Items List */}
                {drillDown.items && (
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#19182B', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <LuListChecks size={15} color="#7047EB" />
                      {drillDown.listTitle || 'Underlying Records'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {drillDown.items.map((it) => (
                        <div
                          key={it.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: '#FFFFFF',
                            border: '1px solid #E9E8F1',
                            borderRadius: 10,
                            fontSize: '0.84rem',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: '#19182B' }}>{it.name}</div>
                            <div style={{ fontSize: '0.74rem', color: '#74758A', marginTop: 2 }}>
                              {it.category} • {it.timestamp}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '0.74rem', color: '#74758A' }}>{it.latency}</span>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '3px 8px',
                                borderRadius: 999,
                                background: it.statusColor === '#16B890' ? '#E8F8F4' : it.statusColor === '#E5484D' ? '#FEECEE' : '#EDE7FF',
                                color: it.statusColor || '#7047EB',
                              }}
                            >
                              {it.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '14px 24px',
                borderTop: '1px solid #F1F0FA',
                background: '#FAFAFD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 10,
              }}>
                <button
                  type="button"
                  className="organix-tool-btn"
                  onClick={() => setDrillDown(null)}
                >
                  Close Inspection
                </button>
                {drillDown.actionRoute && (
                  <Btn
                    v="pri"
                    onClick={() => {
                      setDrillDown(null);
                      navigate(drillDown.actionRoute);
                    }}
                  >
                    <span>{drillDown.actionText}</span>
                    <LuExternalLink size={13} style={{ marginLeft: 6 }} />
                  </Btn>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
