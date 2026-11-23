

const DAYMS=864e5;

const today0=()=>{const d=new Date();d.setHours(0,0,0,0);return d};

const isoOf=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');

const addDays=n=>{const d=today0();d.setDate(d.getDate()+n);return d};

const daysTo=iso=>Math.round((new Date(iso+'T00:00:00')-today0())/DAYMS);

const dueText=n=>n<0?'Overdue':n===0?'Today':n===1?'Tomorrow':'In '+n+' days';

const fmtDay=iso=>new Date(iso+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});

const ago=ts=>{const m=Math.round((Date.now()-ts)/6e4);return m<1?'Just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' hr ago':Math.round(m/1440)+' d ago'};

export { DAYMS, addDays, ago, daysTo, dueText, fmtDay, isoOf, today0 };
