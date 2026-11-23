import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PageCta } from '../components/ui';
import {
  LuBot,
  LuZap,
  LuListTodo,
  LuSparkles,
  LuChartNoAxesCombined,
  LuLightbulb,
  LuTimer,
  LuTarget,
  LuPalette,
  LuRocket,
  LuCheck,
} from '../components/Icon';

export default function Features() {
  const { start } = useApp();
  const ref = useScrollReveal('features');
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: 'All Capabilities' },
    { id: 'plan', label: 'PLAN' },
    { id: 'create', label: 'CREATE' },
    { id: 'automate', label: 'AUTOMATE' },
    { id: 'improve', label: 'IMPROVE' },
  ];

  const features = [
    {
      id: 'ai-assist',
      cat: 'create',
      icon: <LuBot size={22} color="#7047EB" />,
      title: 'AI Assistance',
      desc: 'Understands complex user requirements and provides intelligent, context-aware support across every project and task.',
      badge: 'CREATE',
      bullets: [
        'Natural language instruction parsing',
        'Multi-step operational breakdown',
        'Autonomous error recovery guidance',
      ],
    },
    {
      id: 'wf-auto',
      cat: 'automate',
      icon: <LuZap size={22} color="#7047EB" />,
      title: 'Workflow Automation',
      desc: 'Creates and manages automated task sequences that execute reliably with zero manual glue code or brittle scripts.',
      badge: 'AUTOMATE',
      bullets: [
        'Drag-and-drop trigger & action sequences',
        'Real-time execution telemetry and diagnostics',
        'Automatic retry on transient API failures',
      ],
    },
    {
      id: 'task-mgmt',
      cat: 'plan',
      icon: <LuListTodo size={22} color="#7047EB" />,
      title: 'Smart Task Management',
      desc: 'Organizes tasks, tracks completion velocity, and manages activities with visual status pipelines and priority indicators.',
      badge: 'PLAN',
      bullets: [
        'Dual List and Board views',
        'Priority scoring and due date tracking',
        'Direct linkage to active automation pipelines',
      ],
    },
    {
      id: 'content-gen',
      cat: 'create',
      icon: <LuSparkles size={22} color="#7047EB" />,
      title: 'AI Content Generation',
      desc: 'Helps generate, refine, and summarize documentation, technical specs, stakeholder updates, and briefs in seconds.',
      badge: 'CREATE',
      bullets: [
        'Automated release notes from commits',
        'Executive sprint summaries with 1-click',
        'Contextual replies and notification drafts',
      ],
    },
    {
      id: 'intel-analysis',
      cat: 'improve',
      icon: <LuChartNoAxesCombined size={22} color="#7047EB" />,
      title: 'Intelligent Analysis',
      desc: 'Processes platform information and telemetry to generate deep, actionable operational insights and performance trends.',
      badge: 'IMPROVE',
      bullets: [
        'Real-time workflow success rate curves',
        'Task throughput and velocity analytics',
        'Automated anomaly and delay detection',
      ],
    },
    {
      id: 'proc-opt',
      cat: 'improve',
      icon: <LuLightbulb size={22} color="#7047EB" />,
      title: 'Process Optimization',
      desc: 'Continuously analyzes workflow run history to uncover bottlenecks, redundant steps, and high-impact optimizations.',
      badge: 'IMPROVE',
      bullets: [
        'Execution duration heatmaps',
        'Suggested sequence parallelization',
        'Resource waste and delay elimination',
      ],
    },
    {
      id: 'activity-track',
      cat: 'improve',
      icon: <LuTimer size={22} color="#7047EB" />,
      title: 'Activity Tracking',
      desc: 'Monitors workflow execution, audit trails, and completed tasks in real time across the workspace with live feeds.',
      badge: 'IMPROVE',
      bullets: [
        'Sub-second event logging and audit history',
        'Team contributor tracking and timeline logs',
        'Live system notification dispatch',
      ],
    },
    {
      id: 'smart-recs',
      cat: 'improve',
      icon: <LuTarget size={22} color="#7047EB" />,
      title: 'Smart Recommendations',
      desc: 'Proactively suggests workflow improvements, automations, and fixes based on historical project signals.',
      badge: 'IMPROVE',
      bullets: [
        'Predictive schedule optimizations',
        'Suggested task delegation and routing',
        'Pre-emptive failure prevention alerts',
      ],
    },
    {
      id: 'customization',
      cat: 'plan',
      icon: <LuPalette size={22} color="#7047EB" />,
      title: 'User Customization',
      desc: 'Allows users and teams to personalize their working environment, views, roles, widgets, and third-party integrations.',
      badge: 'PLAN',
      bullets: [
        'Customizable dashboards and KPI widgets',
        'Flexible workspace density & font controls',
        'Granular team permissions and role policies',
      ],
    },
    {
      id: 'prod-mgmt',
      cat: 'plan',
      icon: <LuRocket size={22} color="#7047EB" />,
      title: 'Productivity Management',
      desc: 'Helps users eliminate repetitive busywork, save valuable hours, and focus on high-impact strategic craft.',
      badge: 'PLAN',
      bullets: [
        '18+ hours saved per teammate every week',
        'Zero manual context-switching across apps',
        'Unified centralized operating environment',
      ],
    },
  ];

  const filteredFeatures = activeTab === 'all'
    ? features
    : features.filter((f) => f.cat === activeTab);

  // Interactive AI Playground demo state
  const [promptIdx, setPromptIdx] = useState(0);
  const promptSamples = [
    {
      q: 'Automate weekly deployment review and notify team on Slack',
      a: 'Created Workflow: "Weekly Deploy Review" → Triggers every Friday at 16:00 UTC → Fetches GitHub release tags → Generates executive digest → Dispatches message to Slack #eng-releases.',
    },
    {
      q: 'Triage incoming customer tickets and prioritize critical bugs',
      a: 'Configured Pipeline: Analyzes incoming tickets via AI → Identifies severity P1/P2 → Automatically tags priority as Urgent → Assigns to on-call engineer and opens Jira issue.',
    },
    {
      q: 'Summarize sprint velocity and open blockers',
      a: 'Generated Digest: Sprint 24 achieved 88% completion (42 tasks done, 6 in progress). Highlighted 2 potential blockers in API auth dependencies with mitigation plan.',
    },
  ];

  return (
    <div ref={ref} className="pg features-page">
      {/* ─── Hero Section ─── */}
      <div className="wrap ph text-center" style={{ padding: '60px 0 40px' }}>
        <div data-r="1" className="huly-hero-badge rv" style={{ '--i': 0 }}>
          <span>
            <LuSparkles size={12} style={{ marginRight: 6 }} />
            10 KEY PLATFORM CAPABILITIES
          </span>
        </div>
        <h1 data-r="1" className="huly-hero-title rv" style={{ '--i': 1 }}>
          Everything you need to <br />
          <span className="huly-gradient-text">automate, manage, and scale.</span>
        </h1>
        <p data-r="1" className="huly-hero-sub rv" style={{ '--i': 2, maxWidth: 640 }}>
          Explore the full suite of Orvexa features engineered to simplify workflows, automate repetitive tasks, improve productivity, and help teams work intelligently.
        </p>

        {/* Category Filter Pills */}
        <div data-r="1" className="hero-feature-pills-row rv" style={{ '--i': 3, marginTop: 24 }}>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`hero-pill-badge ${activeTab === c.id ? 'active' : ''}`}
              onClick={() => setActiveTab(c.id)}
              style={{
                cursor: 'pointer',
                background: activeTab === c.id ? 'var(--purple-grad)' : undefined,
                color: activeTab === c.id ? '#FFFFFF' : undefined,
                borderColor: activeTab === c.id ? 'transparent' : undefined,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 10 Features Grid ─── */}
      <section className="features-detail-section">
        <div className="wrap">
          <div className="features-showcase-grid">
            {filteredFeatures.map((f, idx) => (
              <div key={f.id} data-r="1" className="feat-card-full rv" style={{ '--i': idx % 3 }}>
                <div className="fcf-header">
                  <span className="fcf-icon">{f.icon}</span>
                  <span className="fcf-badge">{f.badge}</span>
                </div>
                <h3>{f.title}</h3>
                <p className="fcf-desc">{f.desc}</p>
                <ul className="fcf-bullets">
                  {f.bullets.map((b) => (
                    <li key={b}>
                      <span className="fcf-check">
                        <LuCheck size={11} strokeWidth={2.5} />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Interactive AI Playground Section ─── */}
      <section className="interactive-ai-section">
        <div className="wrap">
          <div data-r="1" className="section-center-head rv" style={{ '--i': 0 }}>
            <span className="split-badge">Live Interactive Capability</span>
            <h2>See Orvexa Intelligence in Action</h2>
            <p className="sub">
              Select a sample prompt below to see how Orvexa instantly transforms natural instructions into executable workflows.
            </p>
          </div>

          <div data-r="1" className="interactive-ai-box rv rv-scale" style={{ '--i': 1 }}>
            <div className="iab-tabs">
              {promptSamples.map((p, i) => (
                <button
                  key={i}
                  className={`iab-tab-btn ${promptIdx === i ? 'active' : ''}`}
                  onClick={() => setPromptIdx(i)}
                >
                  Prompt 0{i + 1}
                </button>
              ))}
            </div>

            <div className="iab-content">
              <div className="iab-prompt-bar">
                <span className="iab-spark">
                  <LuSparkles size={14} />
                </span>
                <span className="iab-prompt-text">"{promptSamples[promptIdx].q}"</span>
              </div>
              <div className="iab-response-box">
                <div className="iab-resp-header">
                  <span className="iab-resp-dot" />
                  <strong>Orvexa Engine Result</strong>
                  <span className="iab-resp-time">Generated in 0.4s</span>
                </div>
                <p className="iab-resp-text">{promptSamples[promptIdx].a}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <PageCta title="Ready to Experience Orvexa?" start={start} />
    </div>
  );
}
