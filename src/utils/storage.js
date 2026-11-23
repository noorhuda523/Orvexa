import { seedTeam } from '../data/content';
import { seedTasks, seedWf } from '../data/demoData';

const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

const SK='nx-user';

export const DEFAULT_DEMO_USER = {
  name: 'Noor-Ul-Huda',
  email: 'noorulhuda@orvexa.dev',
  plan: 'Pro',
  role: 'Workspace Admin',
};

const readUser = () => {
  try {
    const raw = localStorage.getItem(SK);
    if (raw) {
      const u = JSON.parse(raw);
      if (u && (u.name === 'Demo User' || u.name === 'Demo')) {
        u.name = 'Noor-Ul-Huda';
        if (!u.email || u.email === 'demo@nexora.dev' || u.email === 'noorulhuda@nexora.dev') u.email = 'noorulhuda@orvexa.dev';
        try { localStorage.setItem(SK, JSON.stringify(u)); } catch (e) {}
      }
      return u || DEFAULT_DEMO_USER;
    }
    // Initial visit or fresh session: initialize DEFAULT_DEMO_USER so workspace is immediately accessible
    lsSet(SK, JSON.stringify(DEFAULT_DEMO_USER));
    return DEFAULT_DEMO_USER;
  } catch (e) {
    return DEFAULT_DEMO_USER;
  }
};

const ACC='nx-accounts';

const readAcc=()=>{try{const a=JSON.parse(localStorage.getItem(ACC)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}};

const saveAcc=a=>{try{localStorage.setItem(ACC,JSON.stringify(a.slice(-20)))}catch(e){}};

const readPlan=()=>{try{return localStorage.getItem('nx-plan')||'Starter'}catch(e){return'Starter'}};

const readTasks=()=>{try{const a=JSON.parse(localStorage.getItem('nx-tasks'));if(Array.isArray(a))return a}catch(e){}return seedTasks()};

const saveTasks=a=>{try{localStorage.setItem('nx-tasks',JSON.stringify(a))}catch(e){}};

const newId=()=>'t'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);

const normalizeWf=(w,i)=>{
  if(!w||typeof w!=='object')return null;
  const name=w.name||w.n||('Workflow '+(i+1));
  const description=w.description||w.desc||'';
  const trigger=w.trigger||w.t||'scheduled';
  const actions=Array.isArray(w.actions)?w.actions:(Array.isArray(w.a)?w.a:(Array.isArray(w.steps)?w.steps:['notify']));
  return {
    ...w,
    id:w.id||('w'+(i+1)),
    name,
    description,
    trigger,
    actions,
    steps:actions,
    on:w.on!==undefined?!!w.on:true,
    runs:Array.isArray(w.runs)?w.runs:[],
    createdAt:w.createdAt||Date.now()-86400000,
    updatedAt:w.updatedAt||Date.now()
  };
};

const readWf=()=>{
  try{
    const raw=localStorage.getItem('nx-workflows');
    if(raw){
      const a=JSON.parse(raw);
      if(Array.isArray(a)&&a.length>0){
        const norm=a.map(normalizeWf).filter(Boolean);
        if(norm.length>0)return norm;
      }
    }
  }catch(e){}
  return seedWf();
};

const saveWf=a=>{try{localStorage.setItem('nx-workflows',JSON.stringify(a))}catch(e){}};

const lsJson=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};

const dataKeys=ks=>ks.filter(k=>k.startsWith('nx-')&&k!=='nx-theme');

const syncAcc=(a,email,p)=>Array.isArray(a)?a.map(x=>x.email===email?{...x,...p}:x):a;
export const lsGet=(k,d=null)=>{try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
export const lsRemove=k=>{try{localStorage.removeItem(k)}catch(e){}};
export const lsSetJson=(k,v)=>lsSet(k,JSON.stringify(v));
export const pushMessage=m=>{try{const a=JSON.parse(localStorage.getItem('nx-messages')||'[]');a.push(m);localStorage.setItem('nx-messages',JSON.stringify(a.slice(-20)))}catch(e){}};
export const writeUser = (u) => {
  lsSet(SK, JSON.stringify(u));
  try { localStorage.removeItem('nx-logged-out'); } catch (e) {}
};
export const clearUser = () => {
  lsRemove(SK);
  try { localStorage.setItem('nx-logged-out', 'true'); } catch (e) {}
};
export const updateStoredUser=(user,p)=>{const n={...user,...p};writeUser(n);try{const raw=localStorage.getItem(ACC);if(raw)localStorage.setItem(ACC,JSON.stringify(syncAcc(JSON.parse(raw),n.email,p)))}catch(e){}return n};
export const clearDemoData=()=>{try{dataKeys(Object.keys(localStorage)).forEach(k=>localStorage.removeItem(k))}catch(e){}};

export { ACC, SK, dataKeys, lsJson, lsSet, newId, readAcc, readPlan, readTasks, readUser, readWf, saveAcc, saveTasks, saveWf, syncAcc };
export const readTeam = (plan) => { const a = lsJson('nx-team', null); return Array.isArray(a) ? a : seedTeam(plan); };
