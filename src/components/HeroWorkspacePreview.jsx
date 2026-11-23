import React, { useState } from 'react';
import {
  LuListTodo,
  LuSparkles,
  LuZap,
  LuTrendingUp,
  LuCheck,
  LuBot,
  LuTarget,
} from './Icon';

/**
 * HeroWorkspacePreview
 * High-fidelity, interactive SaaS Product Interface Preview for Orvexa.
 * Showcases Orvexa's 4 Core Pillars:
 * 1. PLAN — Smart task management & project velocity
 * 2. CREATE — AI assistance & intelligent content generation
 * 3. AUTOMATE — Connected workflow pipelines & trigger-to-action execution
 * 4. IMPROVE — Real-time telemetry, productivity insights & smart recommendations
 */
export default function HeroWorkspacePreview({ onAction }) {
  const [activePillar, setActivePillar] = useState('automate');
  const [promptInput, setPromptInput] = useState('Triage high-priority incident #342 and notify DevOps');
  const [aiGenerated, setAiGenerated] = useState(true);

  const pillars = [
    { id: 'plan', label: 'PLAN', icon: <LuListTodo size={14} />, tag: 'Smart Tasks' },
    { id: 'create', label: 'CREATE', icon: <LuSparkles size={14} />, tag: 'AI Assistant' },
    { id: 'automate', label: 'AUTOMATE', icon: <LuZap size={14} />, tag: 'Workflows' },
    { id: 'improve', label: 'IMPROVE', icon: <LuTrendingUp size={14} />, tag: 'Analytics' },
  ];

  return (
    <div className="hwp-window">
      {/* Browser Chrome Header */}
      <div className="hwp-browser-bar">
        <div className="hwp-dots">
          <span className="hwp-dot red" />
          <span className="hwp-dot yellow" />
          <span className="hwp-dot green" />
        </div>
        <div className="hwp-address-bar">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hwp-lock-ic">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="hwp-url-text">app.orvexa.ai/workspace/overview</span>
        </div>
        <div className="hwp-live-badge">
          <span className="hwp-pulse-dot" />
          <span>Live Sync</span>
        </div>
      </div>

      {/* Main App Container Inside Preview */}
      <div className="hwp-layout">
        {/* Left Mini Sidebar */}
        <aside className="hwp-sidebar">
          <div className="hwp-brand" onClick={onAction}>
            <div className="hwp-brand-icon">
              <span>N</span>
            </div>
            <div className="hwp-brand-meta">
              <strong>Orvexa</strong>
              <span>Enterprise</span>
            </div>
          </div>

          <nav className="hwp-nav-list">
            <button className="hwp-nav-btn active" onClick={onAction}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />
              </svg>
              <span>Overview</span>
            </button>
            <button className="hwp-nav-btn" onClick={() => { setActivePillar('plan'); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
              </svg>
              <span>Tasks</span>
              <span className="hwp-badge-count">14</span>
            </button>
            <button className="hwp-nav-btn" onClick={() => { setActivePillar('automate'); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span>Workflows</span>
            </button>
            <button className="hwp-nav-btn" onClick={() => { setActivePillar('improve'); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18M9 17l3-5 3 3 4-6" />
              </svg>
              <span>Analytics</span>
            </button>
          </nav>

          <div className="hwp-sidebar-bottom">
            <div className="hwp-user-chip">
              <div className="hwp-avatar">NH</div>
              <div className="hwp-user-info">
                <strong>Noor-Ul-Huda</strong>
                <span>Lead Ops</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Canvas */}
        <main className="hwp-main">
          {/* Topbar */}
          <div className="hwp-topbar">
            <div className="hwp-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <span>Search workflows, tasks, docs...</span>
              <kbd>Ctrl K</kbd>
            </div>

            <div className="hwp-top-actions">
              <div className="hwp-ai-status">
                <span className="hwp-ai-dot" />
                <span>AI Agent Ready</span>
              </div>
              <button className="hwp-quick-btn" onClick={onAction}>
                + New Workflow
              </button>
            </div>
          </div>

          {/* Interactive 4 Pillars Tab Switcher */}
          <div className="hwp-pillar-tabs-row">
            <div className="hwp-pillar-tabs">
              {pillars.map((p) => (
                <button
                  key={p.id}
                  className={`hwp-pillar-tab ${activePillar === p.id ? 'active' : ''}`}
                  onClick={() => setActivePillar(p.id)}
                >
                  <span className="hwp-tab-icon">{p.icon}</span>
                  <span className="hwp-tab-label">{p.label}</span>
                  <span className="hwp-tab-tag">{p.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Content Panel by Pillar */}
          <div className="hwp-dynamic-body">
            {activePillar === 'plan' && (
              <div className="hwp-plan-view">
                <div className="hwp-kpi-grid">
                  <div className="hwp-kpi-card">
                    <span className="hwp-kpi-title">Active Tasks</span>
                    <strong className="hwp-kpi-val">28</strong>
                    <span className="hwp-kpi-meta text-emerald">↑ 12% velocity</span>
                  </div>
                  <div className="hwp-kpi-card">
                    <span className="hwp-kpi-title">Completed This Week</span>
                    <strong className="hwp-kpi-val">64</strong>
                    <span className="hwp-kpi-meta text-purple">98% on-time</span>
                  </div>
                  <div className="hwp-kpi-card">
                    <span className="hwp-kpi-title">Sprint Efficiency</span>
                    <strong className="hwp-kpi-val">94.8%</strong>
                    <span className="hwp-kpi-meta text-emerald">+4.2 hrs saved/day</span>
                  </div>
                </div>

                <div className="hwp-task-rows">
                  <div className="hwp-task-item">
                    <div className="hwp-task-left">
                      <span className="hwp-check-circle" />
                      <div>
                        <strong>Deploy v2.4 Automated Canary Release</strong>
                        <span className="hwp-task-sub">Ops Pipeline · Assigned to Lead Engineer</span>
                      </div>
                    </div>
                    <span className="hwp-pri-badge high">Urgent</span>
                  </div>
                  <div className="hwp-task-item">
                    <div className="hwp-task-left">
                      <span className="hwp-check-circle" />
                      <div>
                        <strong>Synthesize Sprint 14 Retrospective with AI</strong>
                        <span className="hwp-task-sub">Product Management · 3 team comments</span>
                      </div>
                    </div>
                    <span className="hwp-pri-badge medium">Medium</span>
                  </div>
                  <div className="hwp-task-item">
                    <div className="hwp-task-left">
                      <span className="hwp-check-circle checked">
                        <LuCheck size={11} strokeWidth={2.5} />
                      </span>
                      <div>
                        <strong>Sync GitHub webhook triggers with Slack alerts</strong>
                        <span className="hwp-task-sub">Engineering · Completed 20m ago</span>
                      </div>
                    </div>
                    <span className="hwp-pri-badge done">Completed</span>
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'create' && (
              <div className="hwp-create-view">
                <div className="hwp-prompt-box">
                  <div className="hwp-prompt-top">
                    <span className="hwp-prompt-spark">
                      <LuSparkles size={13} />
                    </span>
                    <span>AI Assistant — Content & Specification Generator</span>
                  </div>
                  <div className="hwp-prompt-input-row">
                    <input
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      className="hwp-prompt-input"
                    />
                    <button className="hwp-prompt-btn" onClick={() => setAiGenerated(true)}>
                      Generate
                    </button>
                  </div>
                </div>

                {aiGenerated && (
                  <div className="hwp-ai-result-card">
                    <div className="hwp-ai-res-header">
                      <span className="hwp-ai-badge">AI Specification Ready</span>
                      <span className="hwp-ai-conf">Confidence 99.4% · 340ms</span>
                    </div>
                    <p className="hwp-ai-summary">
                      <strong>Incident Resolution Workflow Drafted:</strong> Automated root-cause inspection executed. 
                      Rollback trigger created, assigned to DevOps lead with automated Slack notification and Jira ticket link.
                    </p>
                    <div className="hwp-ai-actions-row">
                      <button className="hwp-action-pill pri" onClick={onAction}>
                        Execute Workflow →
                      </button>
                      <button className="hwp-action-pill sec" onClick={onAction}>
                        Save Template
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activePillar === 'automate' && (
              <div className="hwp-automate-view">
                <div className="hwp-flow-card">
                  <div className="hwp-flow-header">
                    <span className="hwp-flow-badge">Active Workflow Pipeline</span>
                    <span className="hwp-flow-meta">Autonomous Execution #892</span>
                  </div>

                  <div className="hwp-nodes-chain">
                    <div className="hwp-chain-node">
                      <div className="hwp-node-icon purple">
                        <LuZap size={14} />
                      </div>
                      <div className="hwp-node-info">
                        <strong>Trigger: Bug Alert</strong>
                        <span>GitHub Issue #342</span>
                      </div>
                      <span className="hwp-node-tag">Trigger</span>
                    </div>

                    <div className="hwp-chain-line active">
                      <span className="hwp-pulse-packet" />
                    </div>

                    <div className="hwp-chain-node active">
                      <div className="hwp-node-icon cyan">
                        <LuBot size={14} />
                      </div>
                      <div className="hwp-node-info">
                        <strong>AI Assistant Triage</strong>
                        <span>Root Cause & Priority</span>
                      </div>
                      <span className="hwp-node-tag cyan">AI Decision</span>
                    </div>

                    <div className="hwp-chain-line" />

                    <div className="hwp-chain-node">
                      <div className="hwp-node-icon emerald">
                        <LuCheck size={14} strokeWidth={2.5} />
                      </div>
                      <div className="hwp-node-info">
                        <strong>Dispatched Action</strong>
                        <span>Slack + Jira + Ops Alert</span>
                      </div>
                      <span className="hwp-node-tag emerald">Complete</span>
                    </div>
                  </div>
                </div>

                <div className="hwp-live-stats-bar">
                  <div className="hwp-lstat">
                    <span>Execution Speed</span>
                    <strong>420ms</strong>
                  </div>
                  <div className="hwp-lstat">
                    <span>Error Rate</span>
                    <strong>0.00%</strong>
                  </div>
                  <div className="hwp-lstat">
                    <span>Manual Work Eliminated</span>
                    <strong>100%</strong>
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'improve' && (
              <div className="hwp-improve-view">
                <div className="hwp-kpi-grid">
                  <div className="hwp-kpi-card">
                    <span className="hwp-kpi-title">Weekly Time Saved</span>
                    <strong className="hwp-kpi-val">18.4 hrs</strong>
                    <span className="hwp-kpi-meta text-emerald">↑ 24% vs last sprint</span>
                  </div>
                  <div className="hwp-kpi-card">
                    <span className="hwp-kpi-title">Process Bottlenecks</span>
                    <strong className="hwp-kpi-val">0 Detected</strong>
                    <span className="hwp-kpi-meta text-purple">Optimized by AI</span>
                  </div>
                  <div className="hwp-kpi-card">
                    <span className="hwp-kpi-title">Autonomous Runs</span>
                    <strong className="hwp-kpi-val">1,420</strong>
                    <span className="hwp-kpi-meta text-emerald">100% success rate</span>
                  </div>
                </div>

                <div className="hwp-rec-card">
                  <div className="hwp-rec-left">
                    <span className="hwp-rec-icon">
                      <LuTarget size={15} color="#7047EB" />
                    </span>
                    <div>
                      <strong>Smart Recommendation: Auto-assign pull request reviews</strong>
                      <p>Connecting PR reviews to developer timezone saves an estimated 3.2 hours per release cycle.</p>
                    </div>
                  </div>
                  <button className="hwp-apply-btn" onClick={onAction}>
                    Apply Fix
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
