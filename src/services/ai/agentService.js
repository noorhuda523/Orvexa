/**
 * ORVEXA — AI Agent Management & State Service (Frontend-Only Prototype)
 * Handles agent persistence, prebuilt agent profiles, and simulated execution history.
 */
import { newId } from '../../utils/storage';

export const PREBUILT_AGENTS = [
  {
    id: 'agent-workflow-asst',
    name: 'Orvexa Workflow Assistant',
    description: 'Specializes in analyzing operational bottlenecks, structuring automation triggers, and optimizing multi-step pipeline DAGs.',
    category: 'Workflow & Automation',
    icon: 'LuWorkflow',
    color: '#7047EB',
    status: 'active',
    instructions: {
      role: 'Senior Workflow Automation Architect',
      personality: 'Analytical, precise, and solution-driven',
      objective: 'Optimize workflow execution speed and ensure error-free pipeline transitions.',
      responseStyle: 'Structured markdown with clear action steps and node recommendations.',
    },
    capabilities: [
      'Workflow guidance & DAG design',
      'Trigger & condition validation',
      'Bottleneck detection',
      'Pipeline optimization',
    ],
    behavior: {
      tone: 'Professional & Direct',
      creativity: 0.3,
      responseLength: 'Detailed',
      requireConfirmation: true,
    },
    knowledge: [
      'Orvexa DAG Engine Architecture v2.4',
      'Webhook & Event Trigger Standards',
      'Retry & Fallback Handling Protocols',
    ],
    actions: ['Suggest Workflow', 'Validate Nodes', 'Optimize Pipeline'],
    executionCount: 142,
    lastInteraction: '10 mins ago',
    isPrebuilt: true,
  },
  {
    id: 'agent-task-manager',
    name: 'AI Task Manager',
    description: 'Evaluates sprint backlogs, balances team capacity, triages overdue tickets, and produces daily milestone summaries.',
    category: 'Task Management',
    icon: 'LuListTodo',
    color: '#16B890',
    status: 'active',
    instructions: {
      role: 'Agile Workspace Task Coordinator',
      personality: 'Organized, encouraging, and proactive',
      objective: 'Keep sprint velocity high and prevent task SLA breaches.',
      responseStyle: 'Concise bullet points with priority tags and suggested assignees.',
    },
    capabilities: [
      'Sprint backlog triage',
      'Due date & SLA risk tracking',
      'Priority balancing',
      'Daily milestone digests',
    ],
    behavior: {
      tone: 'Productive & Focused',
      creativity: 0.2,
      responseLength: 'Concise',
      requireConfirmation: true,
    },
    knowledge: [
      'Sprint SLA Guidelines & Target Metrics',
      'Kanban Column Routing Rules',
    ],
    actions: ['Create Task', 'Reassign Task', 'Generate Daily Brief'],
    executionCount: 284,
    lastInteraction: '25 mins ago',
    isPrebuilt: true,
  },
  {
    id: 'agent-content-creator',
    name: 'AI Content Creator',
    description: 'Drafts executive briefs, client status emails, task specifications, and marketing release announcements with brand voice.',
    category: 'Content & Copy',
    icon: 'LuFileText',
    color: '#EC4899',
    status: 'active',
    instructions: {
      role: 'SaaS Technical Writer & Communications Strategist',
      personality: 'Polished, articulate, and adaptable',
      objective: 'Produce high-clarity written communications and documentation.',
      responseStyle: 'Engaging, publication-ready prose formatted with headers and bullet points.',
    },
    capabilities: [
      'Email & memo drafting',
      'Technical specification writing',
      'Project brief creation',
      'Tone transformation',
    ],
    behavior: {
      tone: 'Inspiring & Articulate',
      creativity: 0.7,
      responseLength: 'Comprehensive',
      requireConfirmation: false,
    },
    knowledge: [
      'Orvexa Brand Voice Guidelines 2026',
      'Executive Communication Templates',
    ],
    actions: ['Generate Content', 'Rewrite Copy', 'Summarize Document'],
    executionCount: 310,
    lastInteraction: '1 hour ago',
    isPrebuilt: true,
  },
  {
    id: 'agent-analytics-analyst',
    name: 'AI Analytics Analyst',
    description: 'Interprets workspace throughput, calculates automation ROI, identifies anomaly spikes, and provides quarterly telemetry summaries.',
    category: 'Data & Telemetry',
    icon: 'LuChartNoAxesCombined',
    color: '#0284C7',
    status: 'active',
    instructions: {
      role: 'Workspace Data Intelligence Lead',
      personality: 'Data-driven, methodical, and insightful',
      objective: 'Uncover actionable performance patterns from execution records.',
      responseStyle: 'Empirical data insights with percentage deltas and recommendations.',
    },
    capabilities: [
      'Telemetry trend analysis',
      'Execution failure root-cause audit',
      'Productivity index calculations',
      'Time saved ROI estimation',
    ],
    behavior: {
      tone: 'Analytical & Objective',
      creativity: 0.2,
      responseLength: 'Detailed',
      requireConfirmation: false,
    },
    knowledge: [
      'Workspace Telemetry Benchmark Standards',
      'Throughput & Failure Distribution Formulas',
    ],
    actions: ['Analyze Statistics', 'Generate Audit', 'Calculate ROI'],
    executionCount: 195,
    lastInteraction: '3 hours ago',
    isPrebuilt: true,
  },
  {
    id: 'agent-productivity-coach',
    name: 'AI Productivity Coach',
    description: 'Analyzes personal work patterns, eliminates context switching, and generates structured time-boxed focus schedules.',
    category: 'Productivity',
    icon: 'LuTrendingUp',
    color: '#F4AD4E',
    status: 'active',
    instructions: {
      role: 'Executive Focus & Workflow Performance Coach',
      personality: 'Empathetic, disciplined, and motivating',
      objective: 'Maximize deep work blocks and prevent burnout across complex projects.',
      responseStyle: 'Practical, actionable coaching notes with daily time-blocking tips.',
    },
    capabilities: [
      'Deep work time-blocking',
      'Context-switching reduction',
      'Daily focus schedule creation',
      'Sprint fatigue assessment',
    ],
    behavior: {
      tone: 'Motivating & Structured',
      creativity: 0.5,
      responseLength: 'Balanced',
      requireConfirmation: false,
    },
    knowledge: [
      'Time-Boxing & Pomodoro Focus Paradigms',
      'Deep Work Principles by Cal Newport',
    ],
    actions: ['Create Schedule', 'Recommend Focus Block'],
    executionCount: 88,
    lastInteraction: 'Yesterday',
    isPrebuilt: true,
  },
  {
    id: 'agent-support-assistant',
    name: 'AI Support Assistant',
    description: 'Provides instant guided assistance on Orvexa platform features, integrations, keyboard shortcuts, and troubleshooting.',
    category: 'Customer Support',
    icon: 'LuCircleHelp',
    color: '#8B75F5',
    status: 'active',
    instructions: {
      role: 'Orvexa Platform Specialist & Customer Success Guide',
      personality: 'Patient, welcoming, and clear',
      objective: 'Help users master Orvexa tools and resolve configuration questions.',
      responseStyle: 'Step-by-step numbered instructions with direct page links.',
    },
    capabilities: [
      'Feature tutorials & guidance',
      'Integration troubleshooting',
      'Keyboard shortcuts & command palette assistance',
      'Account & settings support',
    ],
    behavior: {
      tone: 'Friendly & Supportive',
      creativity: 0.3,
      responseLength: 'Concise',
      requireConfirmation: false,
    },
    knowledge: [
      'Orvexa Product Documentation 2026',
      'Webhook & API Integration Setup Guide',
      'Role-Based Access Control Spec',
    ],
    actions: ['Explain Feature', 'Provide Guide', 'Troubleshoot Setup'],
    executionCount: 412,
    lastInteraction: '4 mins ago',
    isPrebuilt: true,
  },
];

const AGENTS_STORAGE_KEY = 'nx-ai-agents';
const EXECUTION_STORAGE_KEY = 'nx-ai-executions';

export function readAgents() {
  try {
    const raw = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (!raw) {
      saveAgents(PREBUILT_AGENTS);
      return PREBUILT_AGENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PREBUILT_AGENTS;
  } catch {
    return PREBUILT_AGENTS;
  }
}

export function saveAgents(agents) {
  try {
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
    window.dispatchEvent(new Event('nx-agents-updated'));
  } catch (err) {
    console.error('Failed to save AI agents:', err);
  }
}

export function getAgentById(id) {
  const all = readAgents();
  return all.find((a) => a.id === id) || all[0];
}

export function createAgent(data) {
  const all = readAgents();
  const created = {
    ...data,
    id: data.id || `agent-custom-${newId()}`,
    status: data.status || 'active',
    executionCount: 0,
    lastInteraction: 'Just created',
    createdAt: Date.now(),
    isPrebuilt: false,
  };
  const next = [created, ...all];
  saveAgents(next);
  return created;
}

export function updateAgent(id, data) {
  const all = readAgents();
  const next = all.map((a) => (a.id === id ? { ...a, ...data, updatedAt: Date.now() } : a));
  saveAgents(next);
}

export function deleteAgent(id) {
  const all = readAgents();
  const next = all.filter((a) => a.id !== id);
  saveAgents(next);
}

export function duplicateAgent(id) {
  const all = readAgents();
  const target = all.find((a) => a.id === id);
  if (!target) return null;
  const dup = {
    ...target,
    id: `agent-custom-${newId()}`,
    name: `${target.name} (Copy)`,
    executionCount: 0,
    lastInteraction: 'Just duplicated',
    createdAt: Date.now(),
    isPrebuilt: false,
  };
  const next = [dup, ...all];
  saveAgents(next);
  return dup;
}

export function readExecutionHistory() {
  try {
    const raw = localStorage.getItem(EXECUTION_STORAGE_KEY);
    if (!raw) {
      const initialHistory = [
        {
          id: 'exec-1',
          agentId: 'agent-workflow-asst',
          agentName: 'Orvexa Workflow Assistant',
          interactionTitle: 'Triage GitHub Webhook Latency',
          prompt: 'How can I optimize our GitHub incident webhook to reduce triage delay?',
          responsePreview: 'Batch notifications into 15-minute dispatch windows and add an automated severity filter.',
          timestamp: Date.now() - 1000 * 60 * 15,
          latency: '340ms',
          status: 'Completed',
        },
        {
          id: 'exec-2',
          agentId: 'agent-task-manager',
          agentName: 'AI Task Manager',
          interactionTitle: 'Sprint Backlog Priority Balancing',
          prompt: 'Review high-priority tasks and identify overdue items.',
          responsePreview: 'Found 1 overdue item in Sprint 4. Recommended reassigning to available team capacity.',
          timestamp: Date.now() - 1000 * 60 * 55,
          latency: '220ms',
          status: 'Completed',
        },
        {
          id: 'exec-3',
          agentId: 'agent-content-creator',
          agentName: 'AI Content Creator',
          interactionTitle: 'Executive Release Digest Draft',
          prompt: 'Draft an executive announcement for our v2.4 autonomous workflow launch.',
          responsePreview: 'Subject: Orvexa v2.4 — Accelerated Operational Throughput & Autonomous Pipelines...',
          timestamp: Date.now() - 1000 * 60 * 140,
          latency: '480ms',
          status: 'Completed',
        },
      ];
      localStorage.setItem(EXECUTION_STORAGE_KEY, JSON.stringify(initialHistory));
      return initialHistory;
    }
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function recordExecution({ agentId, agentName, interactionTitle, prompt, responsePreview, latency = '280ms' }) {
  try {
    const history = readExecutionHistory();
    const entry = {
      id: `exec-${newId()}`,
      agentId,
      agentName,
      interactionTitle: interactionTitle || prompt.slice(0, 40) + '...',
      prompt,
      responsePreview,
      timestamp: Date.now(),
      latency,
      status: 'Completed',
    };
    const next = [entry, ...history].slice(0, 50);
    localStorage.setItem(EXECUTION_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('nx-executions-updated'));
    return entry;
  } catch (err) {
    console.error('Failed to record AI execution:', err);
  }
}
