import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LuBot,
  LuSparkles,
  LuSend,
  LuSlidersHorizontal,
  LuBookOpen,
  LuWrench,
  LuTrash2,
  LuCopy,
  LuCheck,
  LuRefreshCw,
  LuClock,
  LuWorkflow,
  LuListTodo,
  LuFileText,
  LuChartNoAxesCombined,
  LuTrendingUp,
  LuCircleHelp,
} from 'react-icons/lu';
import { readAgents, recordExecution } from '../services/ai/agentService';
import { readTasks, readWf } from '../utils/storage';

const ICON_MAP = {
  LuWorkflow,
  LuListTodo,
  LuFileText,
  LuChartNoAxesCombined,
  LuTrendingUp,
  LuCircleHelp,
  LuBot,
};

const AGENT_PROMPTS = {
  'agent-workflow-asst': [
    'How should we structure an automated retry trigger for webhook timeouts?',
    'Identify bottlenecks in our customer lead qualification pipeline.',
    'Suggest a DAG architecture for real-time Slack incident notifications.',
  ],
  'agent-task-manager': [
    'Triage high-priority tasks and highlight upcoming SLA risks.',
    'How can we balance capacity between frontend and backend sprint items?',
    'Generate a daily sprint standup summary for the team.',
  ],
  'agent-content-creator': [
    'Draft an executive announcement for our v2.4 platform upgrade.',
    'Write a concise technical task spec for implementing webhook rate limiting.',
    'Create an incident post-mortem email for our enterprise customers.',
  ],
  'agent-analytics-analyst': [
    'Calculate the estimated monthly time savings from our 4 active workflows.',
    'Explain the correlation between pipeline throughput and error spikes.',
    'Summarize our workspace operational health metrics for Q3.',
  ],
  'agent-productivity-coach': [
    'Design a 4-hour deep work time-blocking schedule for our dev sprint.',
    'How can our team reduce context-switching during incident triage?',
    'Recommend focus intervals based on our current task backlog.',
  ],
  'agent-support-assistant': [
    'How do I configure incoming webhook triggers in Orvexa?',
    'What are the keyboard shortcuts available in the workspace?',
    'Explain how to invite team members and set up role permissions.',
  ],
};

export default function AIPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Runtime parameters
  const [creativity, setCreativity] = useState(0.3);
  const [responseLength, setResponseLength] = useState('Detailed');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const all = readAgents();
    setAgents(all);
    const paramId = searchParams.get('agent');
    if (paramId && all.some((a) => a.id === paramId)) {
      setSelectedAgentId(paramId);
    } else if (all.length > 0) {
      setSelectedAgentId(all[0].id);
    }
  }, [searchParams]);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  useEffect(() => {
    if (activeAgent) {
      setCreativity(activeAgent.behavior?.creativity ?? 0.3);
      setResponseLength(activeAgent.behavior?.responseLength || 'Detailed');
      // Set initial welcome message for this agent
      setMessages([
        {
          id: `init-${activeAgent.id}`,
          sender: 'agent',
          content: `Hello! I am **${activeAgent.name}**.\n\n*Role:* ${activeAgent.instructions?.role || 'AI Assistant'}\n*Objective:* ${activeAgent.instructions?.objective || 'Assist your workspace.'}\n\nHow can I help optimize your workspace today?`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [activeAgent?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSelectAgent = (id) => {
    setSelectedAgentId(id);
    setSearchParams({ agent: id });
  };

  const handleSend = async (queryText = inputVal) => {
    const text = queryText.trim();
    if (!text || loading || !activeAgent) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputVal('');
    setLoading(true);

    // Simulate AI inference delay
    const latencyMs = Math.floor(Math.random() * 120) + 220;
    await new Promise((res) => setTimeout(res, latencyMs));

    // Formulate contextual simulated response
    const tasks = readTasks();
    const workflows = readWf();

    let reply = '';
    const q = text.toLowerCase();

    if (activeAgent.id === 'agent-workflow-asst' || q.includes('workflow') || q.includes('dag')) {
      reply = `### Recommended Workflow Automation Strategy\n\n` +
        `Based on our analysis of your workspace's **${workflows.length} active workflows**, here is the optimal pipeline structure:\n\n` +
        `1. **Trigger Ingestion:** Configure an event webhook with strict JSON schema validation.\n` +
        `2. **Condition Gate:** Filter events where payload status is \`"verified"\`.\n` +
        `3. **Autonomous Action:** Dispatch notifications to targeted slack channel & record telemetry.\n` +
        `4. **Fault Tolerance:** Apply exponential backoff (initial 500ms, 3 retry attempts).\n\n` +
        `> **Latency Impact:** Projected execution time is **~180ms**, well within your 500ms target SLA.`;
    } else if (activeAgent.id === 'agent-task-manager' || q.includes('task') || q.includes('sprint')) {
      const openTasks = tasks.filter((t) => t.status !== 'done');
      reply = `### Sprint Backlog & Priority Assessment\n\n` +
        `Current sprint backlog status: **${openTasks.length} open tasks** remaining.\n\n` +
        `**Key Observations:**\n` +
        `- **High Priority Items:** ${tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length} ticket(s) need immediate attention.\n` +
        `- **Capacity Distribution:** Balanced evenly across active contributors.\n` +
        `- **Suggested Focus:** Resolve in-progress items before picking up new to-do tickets.\n\n` +
        `*Would you like me to draft an updated sprint standup card for the team?*`;
    } else if (activeAgent.id === 'agent-content-creator' || q.includes('draft') || q.includes('email') || q.includes('write')) {
      reply = `### Draft Communication\n\n` +
        `**Subject:** Orvexa Workspace Update — Operational Milestones\n\n` +
        `Hi Team,\n\n` +
        `Here is our progress update regarding: **${text}**.\n\n` +
        `- **Execution Throughput:** All scheduled pipelines operating at 99.4% success rate.\n` +
        `- **Milestones Reached:** Core capabilities validated with zero regressions.\n` +
        `- **Next Phase:** Staging verification and end-to-end integration tests.\n\n` +
        `Best regards,\n` +
        `Orvexa Operations`;
    } else if (activeAgent.id === 'agent-analytics-analyst' || q.includes('analytic') || q.includes('metric') || q.includes('roi')) {
      reply = `### Telemetry & Productivity Analytics\n\n` +
        `- **Total Workflows Monitored:** ${workflows.length}\n` +
        `- **Estimated Monthly Time Saved:** 34.8 hours\n` +
        `- **Average Pipeline Latency:** 248ms (p95: 410ms)\n` +
        `- **System Reliability:** 99.6% across 1,420 automated executions\n\n` +
        `**Recommendation:** Automation ROI is trending +14% month-over-month. Continuing to automate webhook ingress will further reduce manual triage latency.`;
    } else {
      reply = `### ${activeAgent.name} Analysis\n\n` +
        `I processed your prompt regarding: **"${text}"**.\n\n` +
        `**Context Evaluation:**\n` +
        `- Mode: ${creativity < 0.4 ? 'Strict Deterministic' : 'Creative & Exploratory'}\n` +
        `- Active Knowledge Base: ${activeAgent.knowledge?.slice(0, 2).join(', ') || 'Default'}\n` +
        `- Actions Available: ${activeAgent.actions?.slice(0, 3).join(', ') || 'Analysis'}\n\n` +
        `Everything in your workspace is currently operating within expected thresholds.`;
    }

    const agentMsg = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      content: reply,
      timestamp: Date.now(),
      latency: `${latencyMs}ms`,
    };

    setMessages([...nextMessages, agentMsg]);
    setLoading(false);

    // Record execution history
    recordExecution({
      agentId: activeAgent.id,
      agentName: activeAgent.name,
      interactionTitle: text.slice(0, 35) + '...',
      prompt: text,
      responsePreview: reply.slice(0, 80) + '...',
      latency: `${latencyMs}ms`,
    });
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleClear = () => {
    if (!activeAgent) return;
    setMessages([
      {
        id: `init-${activeAgent.id}`,
        sender: 'agent',
        content: `Conversation cleared. I am ready to assist you.`,
        timestamp: Date.now(),
      },
    ]);
  };

  const IconComp = activeAgent ? ICON_MAP[activeAgent.icon] || LuBot : LuBot;
  const suggestedPrompts = activeAgent ? AGENT_PROMPTS[activeAgent.id] || [] : [];

  return (
    <div
      className="nx-page-container"
      style={{
        padding: '20px 28px',
        maxWidth: '1500px',
        margin: '0 auto',
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="nx-hero-heading" style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#19182B' }}>
              AI Agent Playground
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#EDE7FF',
                color: '#7047EB',
              }}
            >
              Interactive Tester
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#74758A' }}>
            Test prompts, tweak temperature, and observe simulated agent reasoning in real-time.
          </p>
        </div>

        {/* Agent Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#74758A' }}>Active Agent:</span>
          <select
            value={selectedAgentId}
            onChange={(e) => handleSelectAgent(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #E9E8F1',
              backgroundColor: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              color: '#19182B',
              outline: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(25, 24, 43, 0.04)',
            }}
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Two-Panel Playground Workspace */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '20px',
          minHeight: 0,
        }}
      >
        {/* LEFT PANEL: Agent Inspector & Tuning Controls */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 2px 8px rgba(25, 24, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '20px',
            gap: '20px',
          }}
        >
          {/* Agent Identity Card */}
          {activeAgent && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#F8F9FC',
                borderRadius: '10px',
                border: '1px solid #E9E8F1',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: `${activeAgent.color || '#7047EB'}15`,
                  color: activeAgent.color || '#7047EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}
              >
                <IconComp />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#19182B',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {activeAgent.name}
                </h3>
                <span style={{ fontSize: '12px', color: '#74758A' }}>{activeAgent.category}</span>
              </div>
            </div>
          )}

          {/* Role & Objective */}
          {activeAgent && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                System Persona
              </label>
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#F8F9FC',
                  border: '1px solid #E9E8F1',
                  fontSize: '12px',
                  color: '#19182B',
                  lineHeight: 1.4,
                }}
              >
                <strong>Role:</strong> {activeAgent.instructions?.role || 'Assistant'}<br />
                <strong>Tone:</strong> {activeAgent.behavior?.tone || 'Professional'}
              </div>
            </div>
          )}

          {/* Runtime Tuning: Temperature Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#19182B' }}>
                Creativity / Temp: {creativity}
              </label>
              <span style={{ fontSize: '11px', color: '#74758A' }}>
                {creativity < 0.4 ? 'Strict' : 'Exploratory'}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={creativity}
              onChange={(e) => setCreativity(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#7047EB' }}
            />
          </div>

          {/* Response Length */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
              Response Length
            </label>
            <select
              value={responseLength}
              onChange={(e) => setResponseLength(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #E9E8F1',
                fontSize: '12px',
                color: '#19182B',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value="Concise">Concise</option>
              <option value="Detailed">Detailed</option>
              <option value="Comprehensive">Comprehensive</option>
            </select>
          </div>

          {/* Knowledge Base */}
          {activeAgent && activeAgent.knowledge?.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                In-Memory Knowledge ({activeAgent.knowledge.length})
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeAgent.knowledge.map((k, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '11px',
                      color: '#74758A',
                      padding: '4px 8px',
                      backgroundColor: '#F8F9FC',
                      borderRadius: '4px',
                      border: '1px solid #E9E8F1',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <LuBookOpen size={11} color="#7047EB" />
                    <span>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Capabilities */}
          {activeAgent && activeAgent.capabilities?.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#19182B', marginBottom: '6px' }}>
                Active Capabilities
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {activeAgent.capabilities.map((c, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: '#EDE7FF',
                      color: '#7047EB',
                      fontWeight: 500,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Interactive Chat Stream */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E9E8F1',
            boxShadow: '0 2px 8px rgba(25, 24, 43, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Top Chat Stream Header */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #E9E8F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16B890' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#19182B' }}>
                {activeAgent ? activeAgent.name : 'AI Playground'}
              </span>
              <span style={{ fontSize: '12px', color: '#74758A' }}>• Online</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#74758A',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}
              >
                <LuTrash2 size={13} />
                Clear
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '100%',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '14px 18px',
                      borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      backgroundColor: isUser ? '#7047EB' : '#F8F9FC',
                      color: isUser ? '#FFFFFF' : '#19182B',
                      border: isUser ? 'none' : '1px solid #E9E8F1',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      boxShadow: isUser ? '0 2px 8px rgba(112, 71, 235, 0.25)' : 'none',
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {m.content}
                    </div>

                    {!isUser && (
                      <div
                        style={{
                          marginTop: '10px',
                          paddingTop: '8px',
                          borderTop: '1px solid #E9E8F1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '11px',
                          color: '#74758A',
                        }}
                      >
                        <span style={{ fontFamily: 'monospace' }}>
                          Latency: {m.latency || '240ms'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.content)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#74758A',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                          }}
                        >
                          {copiedId === m.id ? (
                            <>
                              <LuCheck size={12} color="#16B890" />
                              <span style={{ color: '#16B890' }}>Copied</span>
                            </>
                          ) : (
                            <>
                              <LuCopy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: '#EDE7FF',
                    color: '#7047EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LuSparkles size={14} />
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span className="nx-typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7047EB' }} />
                  <span className="nx-typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B75F5', animationDelay: '0.2s' }} />
                  <span className="nx-typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EDE7FF', animationDelay: '0.4s' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#74758A', marginLeft: '6px' }}>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pills */}
          {suggestedPrompts.length > 0 && (
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: '#F8F9FC',
                borderTop: '1px solid #E9E8F1',
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
              }}
            >
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E9E8F1',
                    fontSize: '12px',
                    color: '#19182B',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(25, 24, 43, 0.03)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid #E9E8F1', backgroundColor: '#FFFFFF' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#F8F9FC',
                borderRadius: '10px',
                border: '1px solid #E9E8F1',
                padding: '8px 12px',
              }}
            >
              <input
                type="text"
                placeholder={`Ask ${activeAgent ? activeAgent.name : 'AI'} a question or assign a task...`}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#19182B',
                }}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || loading}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: inputVal.trim() ? '#7047EB' : '#E9E8F1',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: inputVal.trim() ? 'pointer' : 'default',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <LuSend size={13} />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
