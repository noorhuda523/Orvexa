import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import HeroCinematicVisual from '../components/HeroCinematicVisual';
import HeroWorkspacePreview from '../components/HeroWorkspacePreview';
import { ScrollDownIndicator } from '../components/ScrollControls';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PLANS } from './Pricing';
import {
  LuListTodo,
  LuSparkles,
  LuZap,
  LuTrendingUp,
  LuRefreshCw,
  LuLink,
  LuLightbulb,
  LuChartNoAxesCombined,
  LuTarget,
  LuBot,
  LuTimer,
  LuPalette,
  LuRocket,
  LuCheck,
  LuMessageSquare,
  LuCode,
  LuFileText,
  LuFolder,
  LuCircleAlert,
  LuWrench,
  LuBriefcase,
  LuStar,
} from '../components/Icon';

export function HomeView({ go, start }) {
  const ref = useScrollReveal('home');
  const toast = useToast();
  const [emailInput, setEmailInput] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [activePillarTab, setActivePillarTab] = useState(0);
  const [promptQuery, setPromptQuery] = useState('Create an incident escalation workflow for production API errors');
  const [promptResult, setPromptResult] = useState(null);
  const [isAnnual, setIsAnnual] = useState(true);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast('Please enter a valid work email address.');
      return;
    }
    toast('Thanks for subscribing! You will receive our bi-weekly updates.');
    setEmailInput('');
  };

  const handleRunAiDemo = () => {
    setPromptResult({
      title: 'Incident Escalation Workflow Generated',
      trigger: 'Webhook Alert: HTTP 500 spike > 2% over 60s',
      triage: 'AI flags high-priority database connection timeout',
      action: 'Dispatches PagerDuty incident, alerts #eng-ops in Slack, provisions backup replica',
      latency: '280ms',
    });
    toast('AI workflow generated successfully!');
  };

  // 4 Core Product Pillars
  const pillars = [
    {
      id: 'plan',
      badge: '01. PLAN',
      title: 'Smart Task Management & Project Organization',
      tagline: 'Bring clarity to chaos with intelligent task tracking and sprint velocity.',
      points: [
        'Structured list and board views with dynamic priority tagging',
        'Automatic velocity tracking and bottleneck anticipation',
        'Centralized task dependencies with real-time progress indicators',
      ],
      icon: <LuListTodo size={20} color="#7047EB" />,
      kpi: '↑ 34% Sprint Velocity',
    },
    {
      id: 'create',
      badge: '02. CREATE',
      title: 'AI Assistance & Contextual Content Generation',
      tagline: 'Draft technical specs, sprint briefs, and project recaps in seconds.',
      points: [
        'Context-aware AI writes release notes and technical documentation',
        'Summarizes lengthy team discussions into actionable work items',
        'Instant prompt-to-workflow generation with zero glue code',
      ],
      icon: <LuSparkles size={20} color="#7047EB" />,
      kpi: '15+ hrs Saved Weekly',
    },
    {
      id: 'automate',
      badge: '03. AUTOMATE',
      title: 'Connected Workflows & Autonomous Execution',
      tagline: 'Chain your tools, triggers, and actions into resilient pipelines.',
      points: [
        'Visual trigger-to-action workflow builder with live run history',
        'Instant integration with Slack, GitHub, Linear, and Notion',
        'Self-healing automated sequences with error-budget tracking',
      ],
      icon: <LuZap size={20} color="#7047EB" />,
      kpi: '99.98% Run Reliability',
    },
    {
      id: 'improve',
      badge: '04. IMPROVE',
      title: 'Operational Telemetry & Smart Recommendations',
      tagline: 'Unlock actionable insights to refine processes and eliminate friction.',
      points: [
        'Comprehensive audit trails and workflow execution metrics',
        'AI identifies recurring bottlenecks and suggests targeted improvements',
        'Executive dashboards for workload distribution and team efficiency',
      ],
      icon: <LuTrendingUp size={20} color="#7047EB" />,
      kpi: 'Zero Unresolved Bottlenecks',
    },
  ];

  // 6 Core Purposes
  const corePurposes = [
    {
      num: '01',
      title: 'Simplify Complex Work',
      desc: 'Break down multi-stage operations into intuitive, guided steps with contextual AI intelligence.',
      icon: <LuSparkles size={20} color="#7047EB" />,
    },
    {
      num: '02',
      title: 'Automate Repetitive Tasks',
      desc: 'Eliminate hours of manual busywork through trigger-based autonomous execution sequences.',
      icon: <LuRefreshCw size={20} color="#7047EB" />,
    },
    {
      num: '03',
      title: 'Connect Tasks & Tools',
      desc: 'Unify disparate tools, chats, and services into organized, transparent workflows.',
      icon: <LuLink size={20} color="#7047EB" />,
    },
    {
      num: '04',
      title: 'Generate Content with AI',
      desc: 'Draft project specifications, update documentation, and summarize sprint outcomes automatically.',
      icon: <LuLightbulb size={20} color="#7047EB" />,
    },
    {
      num: '05',
      title: 'Monitor Progress in Real Time',
      desc: 'Stay informed with live execution telemetry, task completion meters, and velocity metrics.',
      icon: <LuChartNoAxesCombined size={20} color="#7047EB" />,
    },
    {
      num: '06',
      title: 'Centralize Workspace Operations',
      desc: 'Manage projects, workflows, permissions, and team notifications from a single clean surface.',
      icon: <LuTarget size={20} color="#7047EB" />,
    },
  ];

  // 10 Key Capabilities (Features)
  const keyFeatures = [
    {
      id: 'f1',
      title: 'AI Assistance',
      desc: 'Understands complex requirements and provides real-time contextual guidance across every project.',
      tag: 'Core AI',
      icon: <LuBot size={20} color="#7047EB" />,
    },
    {
      id: 'f2',
      title: 'Workflow Automation',
      desc: 'Build and run automated task sequences that execute reliably with zero manual glue code.',
      tag: 'Autonomous',
      icon: <LuZap size={20} color="#7047EB" />,
    },
    {
      id: 'f3',
      title: 'Smart Task Management',
      desc: 'Organize tasks, track completion velocity, and balance team workloads with visual boards.',
      tag: 'Productivity',
      icon: <LuListTodo size={20} color="#7047EB" />,
    },
    {
      id: 'f4',
      title: 'AI Content Generation',
      desc: 'Generate, refine, and summarize technical briefs, documentation, and client updates in seconds.',
      tag: 'Generative AI',
      icon: <LuSparkles size={20} color="#7047EB" />,
    },
    {
      id: 'f5',
      title: 'Intelligent Analysis',
      desc: 'Process platform information and live telemetry to generate actionable operational insights.',
      tag: 'Analytics',
      icon: <LuChartNoAxesCombined size={20} color="#7047EB" />,
    },
    {
      id: 'f6',
      title: 'Process Optimization',
      desc: 'Continuously analyze workflow run history to identify bottlenecks and speed up cycle times.',
      tag: 'Efficiency',
      icon: <LuLightbulb size={20} color="#7047EB" />,
    },
    {
      id: 'f7',
      title: 'Activity Tracking',
      desc: 'Track workflow executions, audit trails, and completed tasks in real time across the workspace.',
      tag: 'Telemetry',
      icon: <LuTimer size={20} color="#7047EB" />,
    },
    {
      id: 'f8',
      title: 'Smart Recommendations',
      desc: 'Proactively suggests automations, fixes, and process shortcuts based on historical signals.',
      tag: 'Proactive',
      icon: <LuTarget size={20} color="#7047EB" />,
    },
    {
      id: 'f9',
      title: 'User Customization',
      desc: 'Personalize views, dashboard density, notification routing, and workspace integrations.',
      tag: 'Personalization',
      icon: <LuPalette size={20} color="#7047EB" />,
    },
    {
      id: 'f10',
      title: 'Productivity Management',
      desc: 'Eliminate repetitive friction, save valuable engineering hours, and focus on high-impact work.',
      tag: 'Time-Saving',
      icon: <LuRocket size={20} color="#7047EB" />,
    },
  ];

  // FAQs
  const faqs = [
    {
      q: 'What makes Orvexa different from traditional project management tools?',
      a: 'Traditional tools are static record-keepers. Orvexa is an active work orchestration platform: it combines smart task management, autonomous trigger-to-action workflows, and proactive AI assistance into one unified workspace.',
    },
    {
      q: 'Does Orvexa integrate with our existing tool stack?',
      a: 'Yes. Orvexa connects natively with Slack, GitHub, Linear, Notion, Google Workspace, Jira, PagerDuty, and thousands of services through standard webhooks and API keys.',
    },
    {
      q: 'How does Orvexa handle team security and privacy?',
      a: 'Orvexa enforces enterprise-grade security standards. All workspace configurations, credentials, and session tokens are encrypted, and team permissions are strictly governed by granular role-based access control (Admin, Member, Viewer).',
    },
    {
      q: 'Can I start using Orvexa for free?',
      a: 'Yes! The Starter plan is 100% free forever and includes 25 active tasks, 3 automated workflows, and full access to smart task boards and essential AI capabilities.',
    },
    {
      q: 'How does the workflow automation builder work?',
      a: 'Workflows consist of an automated trigger (such as a GitHub webhook, task creation, or schedule) connected to sequential actions (such as automated AI triage, Slack alerts, or task updates) with live step-by-step diagnostic run logs.',
    },
    {
      q: 'Can I customize notification preferences and density?',
      a: 'Absolutely. Orvexa allows every user to customize workspace density (Comfortable vs. Compact), text size, motion preferences, and granular notification categories under Workspace Settings.',
    },
  ];

  return (
    <div ref={ref} className="nx-home-wrapper">
      {/* ─── SECTION 1: HERO SECTION WITH CINEMATIC VISUAL ─────────────── */}
      <section className="nx-hero-section">
        {/* Seamless Cinematic Animated Visual Backdrop */}
        <HeroCinematicVisual />

        <div className="wrap nx-hero-content">
          {/* Top Pill Badge */}
          <div data-r="1" className="nx-badge-pill rv" style={{ '--i': 0 }} onClick={() => go('features')}>
            <span className="nx-badge-dot" />
            <span className="nx-badge-text">Orvexa Intelligent Work Orchestration</span>
            <span className="nx-badge-arrow">→</span>
          </div>

          {/* Main Headline */}
          <h1 data-r="1" className="nx-hero-title rv" style={{ '--i': 1 }}>
            Make Your Work Flow <span className="nx-gradient-text">Smarter.</span>
          </h1>

          {/* Supporting Text */}
          <p data-r="1" className="nx-hero-sub rv" style={{ '--i': 2 }}>
            Bring your tasks, workflows, and ideas together in one intelligent workspace. Automate repetitive work, unlock actionable insights, and focus on what truly matters.
          </p>

          {/* CTAs */}
          <div data-r="1" className="nx-hero-cta rv" style={{ '--i': 3 }}>
            <button className="btn pri nx-btn-large" onClick={start}>
              Start for free <span className="nx-cta-arrow">→</span>
            </button>
            <button className="btn sec nx-btn-large" onClick={() => go('features')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Explore Platform</span>
            </button>
          </div>

          {/* Pillar Quick Tags */}
          <div data-r="1" className="nx-hero-tags rv" style={{ '--i': 3.5 }}>
            <span className="nx-tag-item">
              <LuListTodo size={14} style={{ marginRight: 6 }} /> Smart Tasks
            </span>
            <span className="nx-tag-sep">·</span>
            <span className="nx-tag-item">
              <LuSparkles size={14} style={{ marginRight: 6 }} /> AI Content & Specs
            </span>
            <span className="nx-tag-sep">·</span>
            <span className="nx-tag-item">
              <LuZap size={14} style={{ marginRight: 6 }} /> Connected Workflows
            </span>
            <span className="nx-tag-sep">·</span>
            <span className="nx-tag-item">
              <LuTrendingUp size={14} style={{ marginRight: 6 }} /> Real-Time Analytics
            </span>
          </div>

          {/* ─── SECTION 2: INTERACTIVE PRODUCT INTERFACE PREVIEW ───────── */}
          <div data-r="1" className="nx-preview-frame rv rv-scale" style={{ '--i': 4 }}>
            <HeroWorkspacePreview onAction={start} />
          </div>

          <ScrollDownIndicator targetId="tools-section" label="Scroll to explore" />
        </div>
      </section>

      {/* ─── SECTION 3: TRUSTED TOOLS & INTEGRATION SHOWCASE ───────────── */}
      <section id="tools-section" className="nx-tools-section">
        <div className="wrap">
          <div data-r="1" className="nx-tools-label rv" style={{ '--i': 0 }}>
            Connects seamlessly with the modern tools high-velocity teams rely on
          </div>
          <div data-r="1" className="nx-tools-grid rv" style={{ '--i': 1 }}>
            {[
              { name: 'Slack', icon: <LuMessageSquare size={15} color="#E01E5A" />, tag: 'Alerts & Bot' },
              { name: 'GitHub', icon: <LuCode size={15} color="#24292F" />, tag: 'Issues & PRs' },
              { name: 'Linear', icon: <LuZap size={15} color="#5E6AD2" />, tag: 'Sprint Sync' },
              { name: 'Notion', icon: <LuFileText size={15} color="#000000" />, tag: 'Knowledge Base' },
              { name: 'Google Workspace', icon: <LuFolder size={15} color="#4285F4" />, tag: 'Drive & Cal' },
              { name: 'OpenAI', icon: <LuBot size={15} color="#10A37F" />, tag: 'LLM Orchestration' },
              { name: 'Jira', icon: <LuTarget size={15} color="#0052CC" />, tag: 'Backlog Sync' },
              { name: 'PagerDuty', icon: <LuCircleAlert size={15} color="#06AC38" />, tag: 'On-Call Alerts' },
            ].map((tool, idx) => (
              <div key={tool.name} className="nx-tool-pill" style={{ '--i': idx }}>
                <span className="nx-tool-icon">{tool.icon}</span>
                <span className="nx-tool-name">{tool.name}</span>
                <span className="nx-tool-tag">{tool.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: CORE PURPOSE (WHY ORVEXA EXISTS) ───────────────── */}
      <section className="nx-section nx-purpose-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Core Purpose</span>
            <h2>Why Orvexa Exists</h2>
            <p className="nx-section-desc">
              Everyday work shouldn't be consumed by manual coordination, fragmented spreadsheets, and disconnected tools. Orvexa turns everyday work into intelligent workflows.
            </p>
          </div>

          <div className="nx-purpose-grid">
            {corePurposes.map((p, idx) => (
              <div key={p.num} data-r="1" className="nx-purpose-card rv" style={{ '--i': idx }}>
                <div className="nx-pcard-header">
                  <span className="nx-pcard-icon">{p.icon}</span>
                  <span className="nx-pcard-num">{p.num}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: FOUR MAIN PRODUCT PILLARS ──────────────────────── */}
      <section className="nx-section nx-pillars-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Product Architecture</span>
            <h2>Four Pillars of Intelligent Work Orchestration</h2>
            <p className="nx-section-desc">
              Organized to empower individuals, engineering squads, and cross-functional teams to execute with confidence.
            </p>
          </div>

          {/* Pillars Navigation Row */}
          <div data-r="1" className="nx-pillars-nav rv" style={{ '--i': 1 }}>
            {pillars.map((pil, idx) => (
              <button
                key={pil.id}
                className={`nx-pillar-btn ${activePillarTab === idx ? 'active' : ''}`}
                onClick={() => setActivePillarTab(idx)}
              >
                <span className="nx-pbtn-icon">{pil.icon}</span>
                <span className="nx-pbtn-text">{pil.badge}</span>
              </button>
            ))}
          </div>

          {/* Active Pillar Card Showcase */}
          <div data-r="1" className="nx-pillar-active-card rv" style={{ '--i': 2 }}>
            <div className="nx-pac-left">
              <span className="nx-pac-badge">{pillars[activePillarTab].badge}</span>
              <h3>{pillars[activePillarTab].title}</h3>
              <p className="nx-pac-tagline">{pillars[activePillarTab].tagline}</p>
              <ul className="nx-pac-list">
                {pillars[activePillarTab].points.map((pt, i) => (
                  <li key={i}>
                    <span className="nx-pac-check">
                      <LuCheck size={11} strokeWidth={2.5} />
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="nx-pac-action-row">
                <button className="btn pri" onClick={start}>
                  Experience {pillars[activePillarTab].badge.split('.')[1]} →
                </button>
                <span className="nx-pac-kpi">{pillars[activePillarTab].kpi}</span>
              </div>
            </div>

            <div className="nx-pac-right">
              <div className="nx-pac-visual-frame">
                <div className="nx-pac-vtop">
                  <span className="nx-vdot" />
                  <span className="nx-vdot" />
                  <span className="nx-vdot" />
                  <span className="nx-vtitle">orvexa-orchestration-engine</span>
                </div>
                <div className="nx-pac-vbody">
                  <div className="nx-code-line">
                    <span className="token-fn">orchestrate</span>(<span className="token-str">"{pillars[activePillarTab].id}"</span>)
                  </div>
                  <div className="nx-code-line indent">
                    .<span className="token-prop">status</span>: <span className="token-emerald">"Active & Optimized"</span>
                  </div>
                  <div className="nx-code-line indent">
                    .<span className="token-prop">confidence</span>: <span className="token-purple">99.8%</span>
                  </div>
                  <div className="nx-code-line indent">
                    .<span className="token-prop">executionMode</span>: <span className="token-teal">"Autonomous"</span>
                  </div>
                  <div className="nx-vdivider" />
                  <div className="nx-vmetrics-strip">
                    <div className="nx-vm-item">
                      <span>Latency</span>
                      <strong>240ms</strong>
                    </div>
                    <div className="nx-vm-item">
                      <span>Sync</span>
                      <strong className="text-emerald">Real-time</strong>
                    </div>
                    <div className="nx-vm-item">
                      <span>Audit</span>
                      <strong>Encrypted</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: DETAILED FEATURE SHOWCASE (10 CAPABILITIES BENTO) ── */}
      <section className="nx-section nx-features-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Complete Capabilities</span>
            <h2>Everything Needed to Automate Modern Work</h2>
            <p className="nx-section-desc">
              Ten intelligent capabilities engineered into one cohesive, light-themed workspace.
            </p>
          </div>

          <div className="nx-bento-grid">
            {keyFeatures.map((feat, idx) => (
              <div key={feat.id} data-r="1" className="nx-bento-card rv" style={{ '--i': idx % 4 }}>
                <div className="nx-bento-top">
                  <span className="nx-bento-icon">{feat.icon}</span>
                  <span className="nx-bento-tag">{feat.tag}</span>
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
                <div className="nx-bento-bottom">
                  <span className="nx-bento-link" onClick={() => go('features')}>
                    Learn more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: INTERACTIVE WORKFLOW VISUALIZATION ─────────────── */}
      <section className="nx-section nx-workflow-visual-section">
        <div className="wrap nx-split-layout">
          <div data-r="1" className="nx-split-copy rv rv-left" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Visual Workflow Engine</span>
            <h2>From Simple Events to Multi-Stage Autonomous Pipelines</h2>
            <p className="nx-section-desc">
              Connect external webhooks, scheduled triggers, and task statuses directly into automated workflows. When an event occurs, Orvexa evaluates context and executes resolution with zero manual delay.
            </p>
            <div className="nx-split-bullets">
              <div className="nx-bullet-item">
                <span className="nx-bullet-check">
                  <LuCheck size={11} strokeWidth={2.5} />
                </span>
                <div>
                  <strong>Zero-Code Drag & Drop Builder</strong>
                  <p>Design triggers and sequential action steps visually without writing glue scripts.</p>
                </div>
              </div>
              <div className="nx-bullet-item">
                <span className="nx-bullet-check">
                  <LuCheck size={11} strokeWidth={2.5} />
                </span>
                <div>
                  <strong>Complete Diagnostic Audit Logs</strong>
                  <p>Every step run is recorded with exact payloads, latency times, and error recovery history.</p>
                </div>
              </div>
            </div>
            <div className="nx-cta-row">
              <button className="btn pri" onClick={() => go('app-workflows')}>
                Explore Workflows →
              </button>
              <button className="btn sec" onClick={() => go('solutions')}>
                View Use Cases
              </button>
            </div>
          </div>

          <div data-r="1" className="nx-split-visual rv rv-right" style={{ '--i': 1 }}>
            <div className="nx-flow-demo-card">
              <div className="nx-fdc-header">
                <span className="nx-fdc-badge">Live Execution Flow</span>
                <span className="nx-fdc-status">● Running</span>
              </div>

              <div className="nx-fdc-steps">
                <div className="nx-fstep-item done">
                  <div className="nx-fstep-dot">1</div>
                  <div className="nx-fstep-content">
                    <strong>Trigger: Customer P0 Issue Reported</strong>
                    <span className="nx-fstep-sub">GitHub Issue #342 · Customer Impacting</span>
                  </div>
                </div>
                <div className="nx-fstep-line done" />

                <div className="nx-fstep-item active">
                  <div className="nx-fstep-dot active">2</div>
                  <div className="nx-fstep-content">
                    <strong>AI Analysis & Diagnostic Triage</strong>
                    <span className="nx-fstep-sub">Root cause identified: API Gateway timeout · High priority</span>
                  </div>
                </div>
                <div className="nx-fstep-line" />

                <div className="nx-fstep-item pending">
                  <div className="nx-fstep-dot">3</div>
                  <div className="nx-fstep-content">
                    <strong>Dispatched Workflow Execution</strong>
                    <span className="nx-fstep-sub">Alert Slack #eng-ops, assign Lead DevOps, provision fallback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: AI ASSISTANT EXPERIENCE PREVIEW ────────────────── */}
      <section className="nx-section nx-ai-demo-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Interactive AI Assistant</span>
            <h2>Experience Orvexa's Intelligent Prompt Engine</h2>
            <p className="nx-section-desc">
              Test how Orvexa converts plain English requirements into production-ready workflow blueprints.
            </p>
          </div>

          <div data-r="1" className="nx-ai-tester-card rv" style={{ '--i': 1 }}>
            <div className="nx-ai-input-wrap">
              <input
                type="text"
                value={promptQuery}
                onChange={(e) => setPromptQuery(e.target.value)}
                placeholder="Describe a workflow, task sequence, or automated process..."
                className="nx-ai-input"
              />
              <button className="btn pri nx-ai-btn" onClick={handleRunAiDemo}>
                Synthesize with AI
                <LuSparkles size={14} style={{ marginLeft: 6 }} />
              </button>
            </div>

            {promptResult && (
              <div className="nx-ai-output-box">
                <div className="nx-ai-out-header">
                  <span className="nx-ai-out-title">{promptResult.title}</span>
                  <span className="nx-ai-out-meta">Synthesized in {promptResult.latency}</span>
                </div>
                <div className="nx-ai-out-grid">
                  <div className="nx-ai-out-cell">
                    <span className="nx-cell-label">1. TRIGGER</span>
                    <strong>{promptResult.trigger}</strong>
                  </div>
                  <div className="nx-ai-out-cell">
                    <span className="nx-cell-label">2. INTELLIGENT TRIAGE</span>
                    <strong>{promptResult.triage}</strong>
                  </div>
                  <div className="nx-ai-out-cell">
                    <span className="nx-cell-label">3. AUTONOMOUS ACTION</span>
                    <strong>{promptResult.action}</strong>
                  </div>
                </div>
                <div className="nx-ai-out-footer">
                  <button className="btn pri sm" onClick={start}>
                    Deploy this Workflow in App →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SECTION 9: HOW ORVEXA WORKS (3-STEP ROADMAP) ──────────────── */}
      <section className="nx-section nx-how-it-works-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Simple Onboarding</span>
            <h2>How Orvexa Works in 3 Simple Steps</h2>
            <p className="nx-section-desc">
              No complicated infrastructure or weeks of setup. Connect your workspace in under two minutes.
            </p>
          </div>

          <div className="nx-steps-3-grid">
            <div data-r="1" className="nx-step-card rv" style={{ '--i': 0 }}>
              <div className="nx-step-number">01</div>
              <h3>Connect Tools & Workspaces</h3>
              <p>
                Link your team channels, code repositories, and task lists via Slack, GitHub, Linear, or webhooks.
              </p>
            </div>

            <div data-r="1" className="nx-step-card rv" style={{ '--i': 1 }}>
              <div className="nx-step-number">02</div>
              <h3>Orchestrate with AI Guidance</h3>
              <p>
                Use natural language prompts or visual blocks to build multi-stage workflows and automated task rules.
              </p>
            </div>

            <div data-r="1" className="nx-step-card rv" style={{ '--i': 2 }}>
              <div className="nx-step-number">03</div>
              <h3>Execute & Optimize at Scale</h3>
              <p>
                Watch workflows execute autonomously, receive real-time telemetry, and let AI remove bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: BENEFITS & USE CASES ──────────────────────────── */}
      <section className="nx-section nx-usecases-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Targeted Solutions</span>
            <h2>Built for High-Performing Teams Across Functions</h2>
            <p className="nx-section-desc">
              Tailored workflows designed for engineering, IT operations, product squads, and founders.
            </p>
          </div>

          <div className="nx-usecases-grid">
            <div data-r="1" className="nx-uc-card rv" style={{ '--i': 0 }}>
              <span className="nx-uc-icon">
                <LuWrench size={22} color="#7047EB" />
              </span>
              <h3>Engineering & DevOps</h3>
              <p>
                Automate incident triage, continuous deployment checks, code review routing, and on-call escalation alerts.
              </p>
              <span className="nx-uc-metric">60% faster incident response</span>
            </div>

            <div data-r="1" className="nx-uc-card rv" style={{ '--i': 1 }}>
              <span className="nx-uc-icon">
                <LuRocket size={22} color="#7047EB" />
              </span>
              <h3>Product & Operations</h3>
              <p>
                Synthesize sprint retrospectives, convert customer feedback into prioritized backlog tickets, and sync roadmaps.
              </p>
              <span className="nx-uc-metric">18+ hours saved weekly</span>
            </div>

            <div data-r="1" className="nx-uc-card rv" style={{ '--i': 2 }}>
              <span className="nx-uc-icon">
                <LuBriefcase size={22} color="#7047EB" />
              </span>
              <h3>Leadership & Founders</h3>
              <p>
                Centralize cross-department progress, track delivery velocity, and make high-confidence decisions with AI insights.
              </p>
              <span className="nx-uc-metric">100% operational transparency</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 11: PRICING PLANS ─────────────────────────────────── */}
      <section className="nx-section nx-pricing-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Predictable Pricing</span>
            <h2>Simple, Transparent Plans for Every Team</h2>
            <p className="nx-section-desc">
              Start free today and upgrade as your task volume and automated workflows scale.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="nx-billing-toggle-row">
              <button
                className={`nx-btoggle-btn ${!isAnnual ? 'active' : ''}`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly Billing
              </button>
              <button
                className={`nx-btoggle-btn ${isAnnual ? 'active' : ''}`}
                onClick={() => setIsAnnual(true)}
              >
                Annual Billing <span className="nx-disc-badge">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="nx-pricing-grid">
            {PLANS.map((plan, idx) => {
              const price = isAnnual ? plan.p[1] : plan.p[0];
              return (
                <div
                  key={plan.n}
                  data-r="1"
                  className={`nx-plan-card rv ${plan.hot ? 'hot' : ''}`}
                  style={{ '--i': idx }}
                >
                  {plan.hot && (
                    <span className="nx-plan-ribbon">
                      <LuStar size={11} style={{ marginRight: 4 }} /> Most Popular
                    </span>
                  )}
                  <h3>{plan.n}</h3>
                  <p className="nx-plan-desc">{plan.d}</p>
                  <div className="nx-plan-price">
                    ${price}
                    <small>{price > 0 ? ' per user / month' : ' forever free'}</small>
                  </div>
                  <ul className="nx-plan-features">
                    {plan.f.map((feat) => (
                      <li key={feat}>
                        <span className="nx-pcheck">
                          <LuCheck size={11} strokeWidth={2.5} />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn ${plan.hot ? 'pri' : 'sec'} nx-plan-btn`}
                    onClick={() => {
                      if (plan.n === 'Team') go('contact');
                      else {
                        localStorage.setItem('nx-plan', plan.n);
                        toast(`${plan.n} plan selected.`);
                        go('signup');
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 12: FREQUENTLY ASKED QUESTIONS (FAQ) ──────────────── */}
      <section className="nx-section nx-faq-section">
        <div className="wrap">
          <div data-r="1" className="nx-section-header rv" style={{ '--i': 0 }}>
            <span className="nx-section-kicker">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p className="nx-section-desc">
              Everything you need to know about getting started with Orvexa.
            </p>
          </div>

          <div className="nx-faq-accordion">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} data-r="1" className={`nx-faq-item ${isOpen ? 'open' : ''} rv`} style={{ '--i': idx * 0.5 }}>
                  <button
                    className="nx-faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className="nx-faq-chevron">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="nx-faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECTION 13: STRONG FINAL CTA BANNER ───────────────────────── */}
      <section className="nx-section nx-final-cta-section">
        <div className="wrap">
          <div data-r="1" className="nx-final-cta-card rv rv-scale" style={{ '--i': 0 }}>
            <span className="nx-final-badge">
              <LuSparkles size={12} style={{ marginRight: 6 }} />
              Experience Intelligent Orchestration
            </span>
            <h2>Ready to Make Your Work Flow Smarter?</h2>
            <p>
              Join forward-thinking engineering and product teams using Orvexa to automate repetitive tasks, connect workflows, and focus on what truly matters.
            </p>
            <div className="nx-cta-buttons-row">
              <button className="btn pri nx-btn-large" onClick={start}>
                Start for free today →
              </button>
              <button className="btn sec nx-btn-large" onClick={() => go('contact')}>
                Book an Executive Demo
              </button>
            </div>
            <div className="nx-final-fineprint">
              <span>
                <LuCheck size={12} strokeWidth={2.5} style={{ marginRight: 5 }} /> Free 14-day trial of Pro
              </span>
              <span>
                <LuCheck size={12} strokeWidth={2.5} style={{ marginRight: 5 }} /> No credit card required
              </span>
              <span>
                <LuCheck size={12} strokeWidth={2.5} style={{ marginRight: 5 }} /> Instant 2-minute setup
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 14: NEWSLETTER SUBSCRIBE ──────────────────────────── */}
      <section className="nx-newsletter-section">
        <div data-r="1" className="wrap nx-newsletter-wrap rv" style={{ '--i': 0 }}>
          <div className="nx-news-left">
            <h3>Subscribe to Orvexa Intelligence</h3>
            <p>Get bi-weekly insights on workflow automation, AI orchestration, and engineering productivity.</p>
          </div>
          <form className="nx-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="nx-news-input"
              placeholder="Enter your work email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              aria-label="Newsletter email"
            />
            <button type="submit" className="btn pri nx-news-btn">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const app = useApp();
  return <HomeView {...app} />;
}
