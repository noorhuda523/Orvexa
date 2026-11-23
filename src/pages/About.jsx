import React from 'react';
import { useApp } from '../context/AppContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { PageCta } from '../components/ui';
import {
  LuSparkles,
  LuRefreshCw,
  LuLink,
  LuZap,
  LuTrendingUp,
  LuTarget,
} from '../components/Icon';

export default function About() {
  const { start } = useApp();
  const ref = useScrollReveal('about');

  const principles = [
    {
      num: '01',
      title: 'Simplify Complex Tasks',
      desc: 'We believe operations should be straightforward. Our AI assistance interprets high-level goals and breaks them into logical, transparent steps.',
      icon: <LuSparkles size={20} color="#7047EB" />,
    },
    {
      num: '02',
      title: 'Automate Repetitive Work',
      desc: 'Teams lose countless hours moving information between fragmented apps. Orvexa eliminates manual busywork with autonomous background workflows.',
      icon: <LuRefreshCw size={20} color="#7047EB" />,
    },
    {
      num: '03',
      title: 'Connect Organized Workflows',
      desc: 'Silos create friction. Orvexa links tasks, team discussions, third-party APIs, and notifications into harmonious execution pipelines.',
      icon: <LuLink size={20} color="#7047EB" />,
    },
    {
      num: '04',
      title: 'Radical Productivity Multipliers',
      desc: 'By accelerating execution speed and handling routine administrative chores, we help teammates reclaim 15+ hours each week for high-value craft.',
      icon: <LuZap size={20} color="#7047EB" />,
    },
    {
      num: '05',
      title: 'Data-Driven AI Insights',
      desc: 'Operational decisions should be informed by reality. Orvexa provides real-time telemetry, execution history, and predictive recommendations.',
      icon: <LuTrendingUp size={20} color="#7047EB" />,
    },
    {
      num: '06',
      title: 'A Centralized Operating Workspace',
      desc: 'One single, elegant environment brings projects, tasks, workflows, documents, and team members together in unified focus.',
      icon: <LuTarget size={20} color="#7047EB" />,
    },
  ];

  const milestones = [
    { stat: '15+ hrs', label: 'Average weekly time saved per teammate' },
    { stat: '99.98%', label: 'Platform reliability and workflow uptime' },
    { stat: '10x', label: 'Faster incident triage and task routing' },
    { stat: '100%', label: 'Data ownership and client privacy control' },
  ];

  return (
    <div ref={ref} className="pg about-page">
      {/* ─── Hero Section ─── */}
      <section className="about-hero-section">
        <div className="wrap ph text-center" style={{ padding: '60px 0 36px' }}>
          <div data-r="1" className="huly-hero-badge rv" style={{ '--i': 0 }}>
            <span>
              <LuSparkles size={12} style={{ marginRight: 6 }} />
              PURPOSE & MISSION
            </span>
          </div>
          <h1 data-r="1" className="huly-hero-title rv" style={{ '--i': 1 }}>
            Empowering teams to work <br />
            <span className="huly-gradient-text">more intelligently with AI.</span>
          </h1>
          <p data-r="1" className="huly-hero-sub rv" style={{ '--i': 2, maxWidth: 680 }}>
            Orvexa is an AI-powered SaaS platform designed to simplify workflows, automate repetitive tasks, improve productivity, and provide a centralized environment for managing modern work.
          </p>
        </div>
      </section>

      {/* ─── Mission Narrative Section ─── */}
      <section className="about-mission-section">
        <div className="wrap">
          <div data-r="1" className="about-mission-card rv rv-scale" style={{ '--i': 0 }}>
            <div className="amc-copy">
              <span className="split-badge">Our Philosophy</span>
              <h2>Why We Built Orvexa</h2>
              <p>
                Modern work has become fragmented across dozens of disconnected tools. Engineers, product teams, and managers spend significant portions of their week copying data, running manual status checks, and coordinating handoffs.
              </p>
              <p>
                We asked a fundamental question: what if your workspace had built-in intelligence that orchestrated your tasks, automated your routine sequences, and gave you clear insights before blockers even arise?
              </p>
              <p>
                That is Orvexa. An intelligent operating system for forward-thinking teams who want to build faster, stay organized, and eliminate unnecessary friction.
              </p>
            </div>

            <div className="amc-stats-grid">
              {milestones.map((m, idx) => (
                <div key={m.label} className="amc-stat-box" style={{ '--i': idx }}>
                  <div className="amc-stat-num">{m.stat}</div>
                  <div className="amc-stat-lbl">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 Guiding Pillars ─── */}
      <section className="about-pillars-section">
        <div className="wrap">
          <div data-r="1" className="section-center-head rv" style={{ '--i': 0 }}>
            <span className="split-badge">Core Pillars</span>
            <h2>How Orvexa Delivers Value</h2>
            <p className="sub">
              Every feature and architectural decision at Orvexa is anchored in these six foundational commitments.
            </p>
          </div>

          <div className="purpose-grid" style={{ marginTop: 32 }}>
            {principles.map((p, idx) => (
              <div key={p.title} data-r="1" className="purpose-card rv" style={{ '--i': idx }}>
                <div className="purpose-card-header">
                  <span className="purpose-icon">{p.icon}</span>
                  <span className="purpose-num">{p.num}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <PageCta title="Ready to Build Smarter with Orvexa?" start={start} />
    </div>
  );
}
