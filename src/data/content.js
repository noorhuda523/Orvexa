// Static sample content for the product screens. Everything here is demo data.
export const TIMEZONES = ['UTC', 'Asia/Karachi', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Europe/London', 'Europe/Paris', 'Europe/Istanbul', 'Africa/Cairo', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Sao_Paulo', 'Australia/Sydney', 'Pacific/Auckland'];
export const LANGS = ['English', 'اردو (Urdu)', 'हिन्दी (Hindi)', 'العربية (Arabic)', 'Español', 'Français', 'Deutsch'];
export const PLAN_LIMITS = { Starter: { tasks: 25, workflows: 3, seats: 1 }, Pro: { tasks: null, workflows: null, seats: 10 }, Team: { tasks: null, workflows: null, seats: 50 } };
export const PRICE = { Starter: [0, 0], Pro: [12, 10], Team: [24, 20] }; // [monthly, yearly per month] per seat
export const ROLES = [['admin', 'Admin', 'Manage members, billing and every workflow.'], ['member', 'Member', 'Create and edit tasks and workflows.'], ['viewer', 'Viewer', 'Read-only access.']];
export const SEED_NOTIFS = [
  { t: 'Welcome to Orvexa', b: 'Take the tour: create a task, then run a workflow.', type: 'info', m: 5, to: 'app-tasks' },
  { t: 'Your weekly summary is ready', b: 'You completed 24 tasks last week. Nice work.', type: 'success', m: 90, to: 'app-dashboard' },
  { t: 'Dana Lee commented on Launch checklist', b: '“Can we move the review to Thursday?”', type: 'info', m: 300 },
  { t: 'Receipt filing was skipped once', b: 'Monday’s run did not finish. Check the workflow.', type: 'warn', m: 1560, to: 'app-workflows' },
  { t: 'Security tip', b: 'Turn on two-factor authentication in Settings.', type: 'info', m: 3000, to: 'app-settings' }];
export const NOTIF_CATS = ['Task reminders', 'Workflow results', 'Team activity', 'Product news', 'Billing'];
export const NOTIF_CHANNELS = ['Email', 'Push', 'In-app'];
export const INTEGRATIONS = [
  ['slack', 'Slack', 'Post workflow results to a channel.', ['See channel names', 'Post messages']],
  ['github', 'GitHub', 'Turn issues and pull requests into tasks.', ['Read repositories', 'Read issues']],
  ['gcal', 'Google Calendar', 'Plan your week from your events.', ['Read events']],
  ['notion', 'Notion', 'Sync notes with your shared memory.', ['Read pages']],
  ['linear', 'Linear', 'Keep issues and tasks in step.', ['Read issues']],
  ['zapier', 'Zapier', 'Connect Orvexa to thousands of apps.', ['Trigger zaps']]];
export const SESSIONS_SEED = [
  { id: 's2', name: 'iPhone 15 · Safari', place: 'London, UK', when: '2 hours ago' },
  { id: 's3', name: 'MacBook Pro · Chrome', place: 'New York, US', when: 'Yesterday' }];
export const LOGINS = [
  ['Today, 09:12', 'Chrome on Windows', 'London, UK', 'Success'], ['Yesterday, 21:40', 'Safari on iOS', 'London, UK', 'Success'],
  ['Oct 25, 08:03', 'Chrome on macOS', 'New York, US', 'Success'], ['Oct 22, 14:27', 'Firefox on Linux', 'Unknown', 'Blocked'], ['Oct 19, 10:55', 'Chrome on Windows', 'London, UK', 'Success']];
export const HELP_FAQ = [
  { c: 'Getting started', q: 'How do I create my first task?', a: 'Open Tasks, choose New task, give it a title and a due date, then save. It appears in the list and on your Dashboard.' },
  { c: 'Getting started', q: 'What is a workflow?', a: 'A workflow is an automated trigger plus a list of sequential actions. Orvexa visualises step executions in real-time with full diagnostic history.' },
  { c: 'Tasks', q: 'Can I see my tasks as a board?', a: 'Yes. On the Tasks page switch from List to Board. Change a task’s status from the dropdown on its card.' },
  { c: 'Tasks', q: 'How do I find a task quickly?', a: 'Use the search box and the status, priority and sort controls above the task list.' },
  { c: 'Workflows', q: 'Why does a paused workflow skip its run?', a: 'Paused workflows do not run. Turn the switch on and run the test again.' },
  { c: 'Account and billing', q: 'How do I change my plan?', a: 'Go to Settings, then Billing. Pick a plan and confirm to instantly update your workspace tier.' },
  { c: 'Account and billing', q: 'Where do I download invoices?', a: 'Settings, then Billing, then Invoices. Paid plans list one invoice per month.' },
  { c: 'Security', q: 'How do I turn on two-factor authentication?', a: 'Settings, then Security. Switch on two-factor authentication to secure your workspace.' },
  { c: 'Security', q: 'Is my data stored securely?', a: 'Yes. Workspace settings and state are securely managed with client encryption and granular privacy controls.' }];
export const CHANGELOG = [
  { v: '1.4.0', d: 'Oct 2026', items: [['New', 'Team page with roles and invitations.'], ['New', 'Notifications inbox and a bell in the top bar.'], ['New', 'Help center with search and support requests.'], ['Improved', 'Profile: photo, bio, links, skills and a live public preview.'], ['Improved', 'Settings now has eight sections: security, billing, integrations, API keys and more.']] },
  { v: '1.3.0', d: 'Oct 2026', items: [['New', 'Soft aurora glows in the page corners.'], ['Improved', 'Better contrast for error and warning colours.'], ['Fixed', 'Dialogs now keep keyboard focus inside them.']] },
  { v: '1.2.0', d: 'Sep 2026', items: [['New', 'Workflows with a step builder and run history.'], ['New', 'Task board view and filters.'], ['Improved', 'Dashboard analytics and live orchestration.']] },
  { v: '1.1.0', d: 'Aug 2026', items: [['New', 'Pricing, Solutions and Contact pages.'], ['New', 'Enterprise sign in and workspace onboarding.']] },
  { v: '1.0.0', d: 'Jul 2026', items: [['New', 'First release: Orvexa workspace and 3D experience.']] }];
export const PRIVACY = [
  ['Overview', 'Orvexa is committed to data privacy and transparency across all automated services.'],
  ['What we collect', 'We collect workspace preferences and configuration data required to provide seamless workflow orchestration.'],
  ['Passwords', 'Passwords and sensitive credentials are encrypted and never stored in plain text.'],
  ['Cookies and tracking', 'Orvexa uses privacy-respecting local storage to preserve your active theme and dashboard preferences.'],
  ['Your choices', 'You can export or purge your workspace data at any time under Settings, then Data and privacy.'],
  ['Contact', 'Questions regarding security or privacy? Reach out via our Contact or Help center pages.']];
export const TERMS = [
  ['Acceptance', 'By accessing Orvexa you agree to abide by our standard platform terms of service and acceptable use policies.'],
  ['Platform Services', 'Features including task management, workflow automation, and collaboration tools are provided under your active plan.'],
  ['Your content', 'You retain full ownership of all data, tasks, workflows, and intellectual property within your workspace.'],
  ['Acceptable use', 'Users must comply with all applicable local, national, and international laws.'],
  ['Reliability', 'Orvexa maintains enterprise-grade reliability and automated error recovery protocols.'],
  ['Changes', 'Terms may be updated periodically to reflect new features and service improvements.']];

const DAY = 864e5;
// Sample teammates. The Starter plan has one seat, so it starts with an empty team.
export const seedTeam = (plan) => (plan === 'Starter' ? [] : [
  { id: 'm1', name: 'Dana Lee', email: 'dana@example.com', role: 'admin', status: 'Active', at: Date.now() - 80 * DAY },
  { id: 'm2', name: 'Sam Ortiz', email: 'sam@example.com', role: 'member', status: 'Active', at: Date.now() - 41 * DAY },
  { id: 'm3', name: 'Priya Patel', email: 'priya@example.com', role: 'viewer', status: 'Active', at: Date.now() - 9 * DAY },
]);
