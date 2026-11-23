import { addDays, isoOf } from '../utils/dates';

const ICONS=[
  'M4 5h16v10H9l-5 4z',
  'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  'M13 2L5 14h6l-1 8 8-12h-6z',
  'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'
];

const FEATURES=[
  ['Ask in plain words','Describe the task and Orvexa drafts it, schedules it or files it for you.'],
  ['One shared memory','Notes, docs and chats stay linked, so you never hunt for context again.'],
  ['Automations, no setup','Turn work you repeat into flows that run quietly in the background.'],
  ['Private by default','Your data stays in your workspace and you decide who can see it.']
];

const STEPS=[
  ['Connect your tools','Link email, calendar, docs and chat in a few clicks.'],
  ['Tell Orvexa the goal','Write what you need done. No templates to learn.'],
  ['Let it run','Orvexa handles the steps and flags anything that needs you.'],
  ['Review and refine','Check the result, adjust it, and save it as a repeatable flow.']
];

const DEMO={name:'Noor-Ul-Huda',email:'noorulhuda@orvexa.dev',plan:'Pro'};

const SEED=[
  ['Finalize dashboard design','Med',0,'doing','Design'],
  ['Process sales data for report','High',0,'doing','Analytics'],
  ['Update API integration','High',1,'doing','Development'],
  ['Prepare monthly summary','Med',2,'doing','Reports'],
  ['Fix responsiveness issues','Med',2,'doing','Development'],
  ['Refactor auth middleware','High',3,'doing','Development'],
  ['Conduct user testing round 2','Med',4,'doing','Design'],
  ['Sync marketing metrics','Low',5,'doing','Analytics'],
  ['Update terms and privacy copy','Low',6,'doing','Reports'],
  ['Optimize database queries','High',7,'doing','Development'],
  ['Audit webhook delivery rate','Med',8,'doing','Analytics'],
  ['Configure staging cluster','High',9,'doing','Development'],
  ['Customer onboarding flow','Low',-1,'done','Design'],
  ['Stripe webhook integration','High',-2,'done','Development'],
  ['Q3 metrics rollup','Med',-3,'done','Reports'],
  ['Hero illustration update','Low',-4,'done','Design'],
  ['CI/CD pipeline speedup','High',-5,'done','Development'],
  ['Export yearly audit report','Med',-6,'done','Reports'],
  ['Setup DNS records','Low',-7,'done','Development'],
  ['Clean obsolete telemetry events','Low',-8,'done','Analytics'],
  ['Team permissions review','Med',-9,'done','Design'],
  ['Deploy v1.2 release to prod','High',-10,'done','Development'],
  ['Database index migration','High',-1,'todo','Development'],
  ['Security vulnerability patch','High',-2,'todo','Development'],
];

const seedTasks=()=>SEED.map((t,i)=>({id:'t'+(i+1),title:t[0],pri:t[1],due:isoOf(addDays(t[2])),status:t[3],category:t[4]||'General'}));

const RANGES={'7 days':{n:7,delta:'+12%',hrs:'6.5',runs:38},'30 days':{n:30,delta:'+8%',hrs:'27',runs:164}};

const chartData=n=>Array.from({length:n},(_,i)=>n===7?[3,5,2,6,4,1,3][i]:((i*7)%9)+2);

const chartLabels=n=>Array.from({length:n},(_,i)=>{
  const d=addDays(-(n-1-i));
  return{full:d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}),tick:n===7?d.toLocaleDateString('en-GB',{weekday:'short'}):(i%5===0?String(d.getDate()):'')};
});

const RUNS=[['Weekly summary','','Completed','12 min ago','4s'],['Receipt filing','','Completed','1 hour ago','9s'],['Meeting reminders','wn','Skipped','3 hours ago','1s'],['Archive old threads','','Completed','Yesterday','22s'],['Release note draft','err','Failed','Yesterday','6s']];

const ACT=[['Dana Lee','commented on Launch checklist','8 min ago'],['Orvexa','drafted the weekly summary','12 min ago'],['Sam Ortiz','completed Update pricing page copy','2 hours ago'],['Orvexa','filed 3 receipts for Finance','Yesterday'],['You','created the task Investor update','2 days ago']];

const SEEDWF=[
  {n:'Content Automation Flow',desc:'Runs daily at 9:00 AM · 12 tasks',on:true,t:'scheduled',a:['summary','notify','email']},
  {n:'Data Processing Pipeline',desc:'Runs on file upload · 8 tasks',on:true,t:'form',a:['create-task','status','notify']},
  {n:'Marketing Campaign Flow',desc:'Last run: 2 days ago · 6 tasks',on:false,t:'email',a:['email','notify']},
  {n:'Task Reminder & Notification',desc:'Get notified about important tasks across channels.',on:true,t:'task-created',a:['notify','assign']},
];

const NOW=Date.now();
const seedWf=()=>SEEDWF.map((w,i)=>({
  id:'w'+(i+1),
  name:w.n,
  description:w.desc,
  on:w.on,
  trigger:w.t,
  steps:w.a, // legacy compat
  actions:w.a,
  runs:i===0?[
    {at:NOW-3600000,status:'Success',totalMs:3800,steps:[{label:'Trigger fired',status:'Success',result:'Trigger fired',duration:'0.12s'},{label:'Generate summary',status:'Success',result:'Completed successfully',duration:'1.20s'},{label:'Send notification',status:'Success',result:'Step executed',duration:'0.85s'},{label:'Send email',status:'Success',result:'Action dispatched',duration:'0.89s'}]},
    {at:NOW-90000000,status:'Success',totalMs:4100,steps:[{label:'Trigger fired',status:'Success',result:'Trigger fired',duration:'0.11s'},{label:'Generate summary',status:'Success',result:'Output generated',duration:'1.50s'},{label:'Send notification',status:'Success',result:'Completed successfully',duration:'0.90s'},{label:'Send email',status:'Success',result:'Action dispatched',duration:'0.98s'}]},
    {at:NOW-176400000,status:'Failed',totalMs:2900,steps:[{label:'Trigger fired',status:'Success',result:'Trigger fired',duration:'0.10s'},{label:'Generate summary',status:'Success',result:'Output generated',duration:'1.30s'},{label:'Send notification',status:'Failed',result:'Gateway timeout',duration:'1.50s'},{label:'Send email',status:'Failed',result:'Rate limit exceeded',duration:'0.80s'}]},
  ]:[],
  createdAt:NOW-(i+1)*86400000*7,
  updatedAt:NOW-(i)*86400000*2,
}));

const COLORS=[['#9A6CF4','Electric Violet'],['#75E0D1','Mint Cyan'],['#C4B5FD','Soft Lilac'],['#7C3AED','Deep Purple'],['#BDE4DF','Seafoam Ice']];

const PLAN_NAMES=['Starter','Pro','Team'];

const PREFS0={weekly:true,due:true,news:false};

const NOTIFS=[['weekly','Weekly summary','A recap of your week.'],['due','Task reminders','A nudge when a task is due.'],['news','Product news','Occasional updates about Orvexa.']];

export { ACT, COLORS, DEMO, FEATURES, ICONS, NOTIFS, PLAN_NAMES, PREFS0, RANGES, RUNS, SEED, SEEDWF, STEPS, chartData, chartLabels, seedTasks, seedWf };
