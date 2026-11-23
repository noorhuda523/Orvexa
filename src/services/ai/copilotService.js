/**
 * ORVEXA — AI Copilot Service (Frontend Prototype)
 * Provides context-aware workspace intelligence, natural language query handling,
 * and conversational persistence for the global Orvexa AI Copilot drawer.
 */
import { readTasks, readWf, newId } from '../../utils/storage';
import { getDashboardOverview } from '../../utils/analyticsData';

const COPILOT_STORAGE_KEY = 'nx-ai-copilot-conversations';

export const QUICK_PROMPTS = [
  'Summarize active workspace tasks & identify blockers',
  'Inspect workflow automation health & error rates',
  'Generate sprint standup summary for the team',
  'Recommend priority tasks to balance team capacity',
  'What automation workflows have the highest run volume?',
  'Draft an operational risk report for Sprint 4',
];

export function readCopilotMessages() {
  try {
    const raw = localStorage.getItem(COPILOT_STORAGE_KEY);
    if (!raw) {
      const initial = [
        {
          id: 'msg-init-1',
          sender: 'ai',
          content:
            'Hello! I am your **Orvexa AI Copilot**. I have real-time visibility into your workspace tasks, automated workflows, and operational telemetry.\n\nAsk me anything about your current workload, or choose a quick prompt below to get started.',
          timestamp: Date.now() - 1000 * 60 * 5,
          suggestedActions: [
            { label: 'Summarize Tasks', query: 'Summarize active workspace tasks & identify blockers' },
            { label: 'Check Workflows', query: 'Inspect workflow automation health & error rates' },
            { label: 'Sprint Standup', query: 'Generate sprint standup summary for the team' },
          ],
        },
      ];
      localStorage.setItem(COPILOT_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function saveCopilotMessages(messages) {
  try {
    localStorage.setItem(COPILOT_STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new Event('nx-copilot-updated'));
  } catch (err) {
    console.error('Failed to save Copilot conversation:', err);
  }
}

export function clearCopilotMessages() {
  try {
    localStorage.removeItem(COPILOT_STORAGE_KEY);
    window.dispatchEvent(new Event('nx-copilot-updated'));
    return readCopilotMessages();
  } catch (err) {
    console.error('Failed to clear Copilot messages:', err);
    return [];
  }
}

/**
 * Generates an intelligent, context-aware simulated response based on actual workspace state.
 */
export async function sendCopilotQuery(promptText) {
  const tasks = readTasks();
  const workflows = readWf();
  const overview = getDashboardOverview();

  const q = promptText.toLowerCase().trim();

  // Task analysis
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'done');

  // Workflow analysis
  const activeWf = workflows.filter((w) => w.status === 'active');
  const draftWf = workflows.filter((w) => w.status === 'draft');
  const pausedWf = workflows.filter((w) => w.status === 'paused');

  // Simulated latency
  await new Promise((res) => setTimeout(res, 450));

  let replyText = '';
  let actions = [];

  if (q.includes('task') || q.includes('blocker') || q.includes('todo') || q.includes('backlog')) {
    replyText = `### Workspace Task Intelligence

I analyzed **${tasks.length} tasks** across your current active boards:

- **In Progress:** ${inProgressCount} tasks currently under active development.
- **To-Do Backlog:** ${todoCount} tasks queued for upcoming execution.
- **Completed:** ${doneCount} tasks successfully resolved.

${
  highPriority.length > 0
    ? `> **Attention Needed:** There ${highPriority.length === 1 ? 'is' : 'are'} **${highPriority.length} high-priority item(s)** still pending:\n` +
      highPriority.map((t) => `> - **${t.title}** (Assigned to *${t.assignee || 'Unassigned'}*)`).join('\n')
    : `> All high-priority items are currently on schedule with no detected SLA breaches.`
}

**Recommended Action:** Focus sprint effort on clearing in-progress tickets before pulling from the backlog to minimize WIP congestion.`;

    actions = [
      { label: 'View Tasks Board', link: '/app/tasks' },
      { label: 'Filter High Priority', query: 'Show only high priority tasks' },
    ];
  } else if (q.includes('workflow') || q.includes('automation') || q.includes('dag') || q.includes('pipeline')) {
    replyText = `### Workflow Automation Health

Your workspace currently has **${workflows.length} configured workflows**:

- **Active Pipelines:** ${activeWf.length} running with autonomous event listeners.
- **Draft & Paused:** ${draftWf.length + pausedWf.length} pending staging or verification.
- **Average Execution Success Rate:** ${overview.stats.successRate.value} (${overview.stats.successRate.badge}).
- **Total Executions Today:** ${overview.stats.totalExecutions.value}.

Top active automation workflows:
${workflows.slice(0, 3).map((w) => `- **${w.name}**: ${w.status.toUpperCase()} (${w.runs || 0} runs recorded)`).join('\n')}

**Optimization Note:** Execution latency remains stable at 248ms across primary webhook ingress gateways.`;

    actions = [
      { label: 'Open Workflows Builder', link: '/app/workflows' },
      { label: 'Inspect Analytics', link: '/app/analytics' },
    ];
  } else if (q.includes('standup') || q.includes('daily') || q.includes('summary') || q.includes('brief')) {
    replyText = `### Daily Workspace Standup Brief

**Operational Status:** All core services and automated pipelines operational.

**Sprint Progress Summary:**
1. **Velocity:** ${doneCount} tasks delivered out of ${tasks.length} total sprint backlog items (${Math.round((doneCount / (tasks.length || 1)) * 100)}% completion).
2. **Current Focus:** ${inProgressCount} active items currently being worked by team members.
3. **Automations:** ${activeWf.length} workflows executed ${overview.stats.totalExecutions.value} events with zero critical failures.

**Immediate Priorities for Today:**
- Resolve pending high-priority items.
- Verify production deployment webhooks.
- Review incoming integration telemetry.`;

    actions = [
      { label: 'Export Standup Note', action: 'copy' },
      { label: 'Check Tasks', link: '/app/tasks' },
    ];
  } else if (q.includes('capacity') || q.includes('balance') || q.includes('team') || q.includes('rebalance')) {
    replyText = `### Team Capacity & Workload Distribution

Based on assigned sprint tickets:
- Active backlog size: **${todoCount + inProgressCount} pending tasks**.
- Estimated sprint completion velocity: **~4.2 tasks / day**.
- Team workload index is balanced within recommended operating thresholds.

**Proactive Recommendation:** Reassign secondary maintenance tasks if new high-severity bugs are logged before the end of the sprint cycle.`;

    actions = [
      { label: 'View Team Members', link: '/app/team' },
      { label: 'Go to Tasks', link: '/app/tasks' },
    ];
  } else {
    replyText = `### Orvexa AI Copilot Analysis

I processed your query regarding: *"**${promptText.trim()}**"*

Here is the operational context from your current workspace:
- **Active Tasks:** ${todoCount + inProgressCount} open items across sprint queues.
- **Automated Workflows:** ${activeWf.length} active triggers executing seamlessly.
- **Operational Health:** 99.4% uptime with stable throughput.

You can ask me to draft project updates, balance task loads, generate workflow DAG structures, or analyze team throughput trends anytime.`;

    actions = [
      { label: 'Summarize Tasks', query: 'Summarize active workspace tasks & identify blockers' },
      { label: 'Check Workflows', query: 'Inspect workflow automation health & error rates' },
    ];
  }

  return {
    id: `msg-${newId()}`,
    sender: 'ai',
    content: replyText,
    timestamp: Date.now(),
    suggestedActions: actions,
  };
}
