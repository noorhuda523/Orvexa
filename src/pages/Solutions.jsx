import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PageCta } from '../components/ui';
import { LuCheck, LuSparkles } from '../components/Icon';

export default function Solutions() {
  const { go, start } = useApp();
  const ref = useScrollReveal('solutions');
  const [activeSolution, setActiveSolution] = useState('engineering');

  const solutions = {
    engineering: {
      title: 'Engineering & DevOps Teams',
      badge: 'High-Velocity Shipping',
      headline: 'Ship faster with autonomous triage and unified pipelines',
      desc: 'Keep pull requests, deployments, error alerts, and team communication in lockstep. Orvexa acts as your engineering copilot, eliminating repetitive release busywork.',
      highlights: [
        'Automatic commit and PR release notes generated in seconds',
        'Real-time P1/P2 error triage and automated Slack dispatch',
        'Zero glue scripts required to connect GitHub, Docker, and CloudWatch',
      ],
      flowTitle: 'Automated Release & Incident Flow',
      flowSteps: [
        { label: 'GitHub PR merged to main branch', tag: 'Trigger' },
        { label: 'Orvexa AI drafts release digest & updates tickets', tag: 'AI Assist' },
        { label: 'Automated deploy triggers with live health telemetry', tag: 'Execute' },
        { label: 'Release announcement posted to Slack #eng-releases', tag: 'Notify' },
      ],
    },
    operations: {
      title: 'Operations & IT Teams',
      badge: 'Process Optimization',
      headline: 'Automate routine requests and keep workflows running quietly',
      desc: 'Say goodbye to scattered forms and manual status tracking. Route approvals, file recurring paperwork, and monitor activity across the organization autonomously.',
      highlights: [
        'Trigger-based request routing based on department and urgency',
        'Recurring administrative sequences run on schedules with zero intervention',
        'Comprehensive audit trails and real-time execution status history',
      ],
      flowTitle: 'Autonomous Operations Flow',
      flowSteps: [
        { label: 'Employee submits hardware or access request', tag: 'Trigger' },
        { label: 'Orvexa checks manager approvals & policy compliance', tag: 'Evaluate' },
        { label: 'Provisions credentials and updates inventory table', tag: 'Action' },
        { label: 'Confirms completion via automated email digest', tag: 'Complete' },
      ],
    },
    product: {
      title: 'Product & Project Managers',
      badge: 'Smart Task Management',
      headline: 'Full transparency, organized tasks, and real-time sprint velocity',
      desc: 'Bring your product specs, sprint boards, and stakeholder updates into one centralized environment. Let AI handle the status chasing so you can focus on building.',
      highlights: [
        'Real-time task velocity meters and completion tracking',
        'Automated executive sprint summaries with 1 click',
        'Instant alignment between Jira, Linear, Notion, and Slack',
      ],
      flowTitle: 'Sprint Velocity & Tracking Flow',
      flowSteps: [
        { label: 'Sprint milestone reaches completion deadline', tag: 'Trigger' },
        { label: 'AI compiles velocity metrics, completed tasks & blockers', tag: 'Analysis' },
        { label: 'Formats polished executive summary and visual charts', tag: 'Content Gen' },
        { label: 'Dispatches briefing to stakeholders and updates board', tag: 'Notify' },
      ],
    },
    leadership: {
      title: 'Founders & Leadership',
      badge: 'Centralized Visibility',
      headline: 'High-level operational intelligence and measurable productivity',
      desc: 'Gain instant clarity on team bandwidth, active workflows, and system reliability without sitting through endless status meetings or context switching.',
      highlights: [
        'Centralized dashboard unifying all work streams and key metrics',
        'Predictive recommendations to prevent delivery bottlenecks',
        'Clear visibility into hours saved and organizational output',
      ],
      flowTitle: 'Executive Insight & Governance Flow',
      flowSteps: [
        { label: 'Weekly operational reporting interval arrives', tag: 'Schedule' },
        { label: 'Aggregates task velocity and workflow health across teams', tag: 'Compile' },
        { label: 'Generates strategic KPI insights and recommendations', tag: 'Insight' },
        { label: 'Presents interactive executive dashboard report', tag: 'Dashboard' },
      ],
    },
  };

  const curr = solutions[activeSolution];

  return (
    <div ref={ref} className="pg solutions-page">
      {/* ─── Hero Section ─── */}
      <section className="solutions-hero-section">
        <div className="wrap ph text-center" style={{ padding: '60px 0 36px' }}>
          <div data-r="1" className="huly-hero-badge rv" style={{ '--i': 0 }}>
            <span>
              <LuSparkles size={12} style={{ marginRight: 6 }} />
              TAILORED WORKFLOW SOLUTIONS
            </span>
          </div>
          <h1 data-r="1" className="huly-hero-title rv" style={{ '--i': 1 }}>
            Engineered for every team <br />
            <span className="huly-gradient-text">driving modern work.</span>
          </h1>
          <p data-r="1" className="huly-hero-sub rv" style={{ '--i': 2, maxWidth: 660 }}>
            Discover how Orvexa's AI assistance, workflow automation, and smart task management adapt seamlessly to your specific operational workflows.
          </p>

          {/* Solution Category Tabs */}
          <div data-r="1" className="hero-feature-pills-row rv" style={{ '--i': 3, marginTop: 24 }}>
            {Object.entries(solutions).map(([key, sol]) => (
              <button
                key={key}
                className={`hero-pill-badge ${activeSolution === key ? 'active' : ''}`}
                onClick={() => setActiveSolution(key)}
                style={{
                  cursor: 'pointer',
                  background: activeSolution === key ? 'var(--purple-grad)' : undefined,
                  color: activeSolution === key ? '#FFFFFF' : undefined,
                  borderColor: activeSolution === key ? 'transparent' : undefined,
                }}
              >
                {sol.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Detailed Solution Showcase ─── */}
      <section className="solution-detail-section">
        <div className="wrap">
          <div data-r="1" className="solution-detail-card rv rv-scale" style={{ '--i': 0 }}>
            <div className="sdc-copy">
              <span className="split-badge">{curr.badge}</span>
              <h2>{curr.headline}</h2>
              <p className="sdc-desc">{curr.desc}</p>

              <ul className="sdc-checklist">
                {curr.highlights.map((h, i) => (
                  <li key={i}>
                    <span className="sdc-check">
                      <LuCheck size={13} strokeWidth={2.5} />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="cta" style={{ marginTop: 28 }}>
                <button className="btn pri" onClick={start}>
                  Deploy this Solution →
                </button>
                <button className="btn sec" onClick={() => go('pricing')}>
                  View Plans
                </button>
              </div>
            </div>

            <div className="sdc-flow-panel">
              <div className="sdc-flow-header">
                <span className="sdc-flow-title">{curr.flowTitle}</span>
                <span className="sdc-flow-status">Active Pipeline</span>
              </div>

              <div className="sdc-flow-steps">
                {curr.flowSteps.map((step, idx) => (
                  <div key={idx} className="sdc-step-item">
                    <div className="sdc-step-left">
                      <span className="sdc-step-num">{idx + 1}</span>
                      {idx < curr.flowSteps.length - 1 && <span className="sdc-step-connector" />}
                    </div>
                    <div className="sdc-step-right">
                      <div className="sdc-step-top">
                        <span className="sdc-step-tag">{step.tag}</span>
                      </div>
                      <div className="sdc-step-desc">{step.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <PageCta title="Transform How Your Team Works" start={start} />
    </div>
  );
}
