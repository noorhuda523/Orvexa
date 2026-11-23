import React, { useState } from 'react';
import { Btn } from '../components/Button';
import { useToast } from '../components/Toast';
import { Badge, Chips, PageCta, Table } from '../components/ui';
import { D, R, useScrollReveal } from '../hooks/useScrollReveal';
import { lsSet } from '../utils/storage';
import { useApp } from '../context/AppContext';
const h = React.createElement;

const PLANS=[
  {n:'Starter',p:[0,0],d:'For trying Orvexa on your own.',f:['1 user','3 active flows','Basic shared memory','Community support'],cta:'Start free'},
  {n:'Pro',p:[12,10],d:'For people who live in Orvexa every day.',f:['Unlimited flows','Full shared memory','Priority support','Version history'],cta:'Choose Pro',hot:1},
  {n:'Team',p:[24,20],d:'For teams that need control.',f:['Roles and permissions','Audit log','Shared workspaces','Admin controls'],cta:'Talk to us'}];

const COMP=[['Users','1','Up to 10','Up to 50'],['Active flows','3','Unlimited','Unlimited'],['Shared memory','Basic','Full','Full'],['Roles and permissions','No','No','Yes'],['Audit log','No','No','Yes'],['Support','Community','Priority','Priority']];

const FAQ=[
  ['Can I switch plans anytime?','Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from workspace settings.'],
  ['Is there a free trial for Pro?','Yes. All paid plans include a 14-day free trial with no upfront commitment.'],
  ['What happens to my data?','Your data is encrypted both in transit and at rest, and can be exported or managed at any time.'],
  ['Is there a free plan?','Yes. Starter is free forever and requires no credit card.']];

function PricingView({go}){
  const ref=useScrollReveal('pricing'), toast=useToast(), [yr,setYr]=useState(true);
  const YR='Yearly: 2 months free';
  const pick=pl=>{
    if(pl.n==='Team'){go('contact');return}
    lsSet('nx-plan',pl.n);
    toast(pl.n+' selected.');go('signup');
  };
  return h('div',{ref,className:'pg'},
    h('div',{className:'wrap ph'},D('ring',{width:300,height:300,right:'-4%',top:'8%'},-.15),
      h('h1',R(0),'Simple pricing, no surprises'),
      h('p',R(1,'lead'),'Choose the ideal plan to scale your team’s workflows and productivity.'),
      h('div',{...R(2),style:{'--i':2,marginTop:24}},h(Chips,{items:['Monthly',YR],value:yr?YR:'Monthly',onPick:v=>setYr(v!=='Monthly')}))),
    h('div',{className:'wrap'},
      h('div',{className:'grid plans'},PLANS.map((pl,i)=>h('div',{...R(i,'card plan'+(pl.hot?' hot':'')),key:pl.n},
        pl.hot&&h('div',null,h(Badge,null,'Most popular')),
        h('h3',null,pl.n),h('p',{className:'pd'},pl.d),
        h('div',{className:'price'},'$'+pl.p[yr?1:0],h('small',null,pl.p[0]?' per user / month':' forever')),
        h('ul',{className:'pl'},pl.f.map(x=>h('li',{key:x},x))),
        h(Btn,{v:pl.hot?'pri':'sec',onClick:()=>pick(pl)},pl.cta))))),
    h('section',{className:'alt'},h('div',{className:'wrap'},
      h('h2',R(0),'Compare plans'),h('p',R(1,'sub'),'Everything in Starter is also in Pro and Team.'),
      h('div',R(2),h(Table,{head:['Feature','Starter','Pro','Team'],rows:COMP})))),
    h('section',null,h('div',{className:'wrap'},
      h('h2',R(0),'Questions'),h('p',R(1,'sub'),'Short answers to common questions.'),
      h('div',{className:'faq'},FAQ.map((x,i)=>h('details',{...R(i),key:i},h('summary',null,x[0]),h('p',null,x[1])))))),
    h(PageCta,{title:'Start building with Orvexa today.',start:()=>go('signup')}));
}

export { COMP, FAQ, PLANS };
export default function Pricing() {
  const app = useApp();
  return h(PricingView, app);
}
