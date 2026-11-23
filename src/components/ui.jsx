import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../data/demoData';
import { D, R } from '../hooks/useScrollReveal';
const h = React.createElement;

function PageCta({title,start}){
  return h('section',{className:'band aur'},D('ring',{width:240,height:240,right:'6%',top:'-60px'},.12),
    h('div',{className:'wrap'},h('h2',R(0),title),
      h('div',{style:{marginTop:24}},h('button',{...R(1,'btn pri'),onClick:start},'Get Started'))));
}

const Card=(f,i,icon)=>h('div',{...R(i,'card'),key:i},
  icon!=null?h('svg',{viewBox:'0 0 24 24','aria-hidden':'true'},h('path',{d:ICONS[icon]})):null,
  h('h3',null,f[0]),h('p',null,f[1]));

function Chips({items,value,onPick}){
  return h('div',{className:'chips',role:'group'},items.map(x=>h('button',{key:x,className:'chip','aria-pressed':x===value,onClick:()=>onPick(x)},x)));
}

const Ic=d=>h('svg',{className:'ic',viewBox:'0 0 24 24','aria-hidden':'true'},h('path',{d}));

const Badge=({children})=>h('span',{className:'bdg'},children);

const Avatar=({name='?',size=32,color,src})=>src?h('img',{className:'av avimg',src,alt:'',style:{width:size,height:size},'aria-hidden':'true'}):h('span',{className:'av',style:{width:size,height:size,fontSize:size*.42,...(color?{background:color}:null)},'aria-hidden':'true'},(name.trim()[0]||'?').toUpperCase());

const EmptyState=({title,text,action})=>h('div',{className:'empty'},h('h3',null,title),text&&h('p',null,text),action);

function Field({label,error,hint,as='input',children,...p}){
  const id=React.useId();
  return h('div',{className:'fld'},h('label',{htmlFor:id},label),
    h(as,{id,'aria-invalid':!!error,'aria-describedby':(error||hint)?id+'-m':undefined,...p},children),
    (error||hint)&&h('p',{id:id+'-m',className:error?'err':'hint',role:error?'alert':undefined},error||hint));
}

function Dropdown({label,button,items}){
  const [o,setO]=useState(false),ref=useRef(null);
  useEffect(()=>{
    if(!o)return;
    const d=e=>{if(!ref.current.contains(e.target))setO(false)},k=e=>{if(e.key==='Escape')setO(false)};
    addEventListener('mousedown',d);addEventListener('keydown',k);
    return()=>{removeEventListener('mousedown',d);removeEventListener('keydown',k)};
  },[o]);
  return h('div',{className:'dd',ref},
    h('button',{className:'ddb','aria-haspopup':'menu','aria-expanded':o,'aria-label':label,onClick:()=>setO(!o)},button),
    o&&h('div',{className:'menu',role:'menu'},items.map((it,i)=>it.sep?h('hr',{key:i}):
      h('button',{key:i,role:'menuitem',className:it.danger?'danger':'',onClick:()=>{setO(false);it.onClick()}},it.label))));
}

const Logo=({go})=>h('button',{className:'logo',onClick:()=>go('home'),'aria-label':'Orvexa home'},h('i'),'Orvexa');

const CloseBtn=({onClick})=>h('button',{className:'tog x',onClick,'aria-label':'Close menu'},'×');

function Pw({label,error,hint,...p}){
  const id=React.useId(), [show,setShow]=useState(false);
  return h('div',{className:'fld'},h('label',{htmlFor:id},label),
    h('div',{className:'pwrap'},
      h('input',{id,type:show?'text':'password','aria-invalid':!!error,'aria-describedby':(error||hint)?id+'-m':undefined,...p}),
      h('button',{type:'button',className:'pwt','aria-label':show?'Hide password':'Show password','aria-pressed':show,onClick:()=>setShow(!show)},show?'Hide':'Show')),
    (error||hint)&&h('p',{id:id+'-m',className:error?'err':'hint',role:error?'alert':undefined},error||hint));
}

const Table=({head,rows})=>h('div',{className:'tw'},h('table',null,
  h('thead',null,h('tr',null,head.map((x,i)=>h('th',{key:i,scope:'col'},x)))),
  h('tbody',null,rows.map((r,i)=>h('tr',{key:i},r.map((c,j)=>h(j?'td':'th',{key:j,scope:j?undefined:'row'},c)))))));

const Tag=({tone,children})=>h('span',{className:'bdg'+(tone?' '+tone:'')},children);

const Box=({title,right,children})=>h('div',{className:'box'},h('div',{className:'bh'},h('h3',null,title),right),children);

export { Avatar, Badge, Box, Card, Chips, CloseBtn, Dropdown, EmptyState, Field, Ic, Logo, PageCta, Pw, Table, Tag };
