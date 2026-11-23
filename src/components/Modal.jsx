import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
const h = React.createElement;

const trapTarget=(list,active,shift)=>{if(!list.length)return null;const a=list[0],z=list[list.length-1];return shift&&active===a?z:(!shift&&active===z?a:null)};

function Overlay({onClose,side,label,children}){
  const ref=useRef(null);
  useEffect(()=>{
    const prev=document.activeElement,k=e=>{
      if(e.key==='Escape')onClose();
      if(e.key==='Tab'&&ref.current){const t=trapTarget([...ref.current.querySelectorAll('button,input,select,textarea,a[href]')].filter(x=>!x.disabled&&x.offsetParent!==null),document.activeElement,e.shiftKey);if(t){e.preventDefault();t.focus()}}
    };
    addEventListener('keydown',k);document.body.style.overflow='hidden';
    const f=ref.current?.querySelector('input,select,textarea')||ref.current?.querySelector('button');if(f)f.focus();
    return()=>{removeEventListener('keydown',k);document.body.style.overflow='';if(prev&&prev.focus)prev.focus()};
  },[]);
  const el = h('div',{className:'ov'+(side?' side':''),onMouseDown:e=>{if(e.target===e.currentTarget)onClose()}},
    h('div',{ref,className:'sheet',role:'dialog','aria-modal':'true','aria-label':label},children));
  return typeof document !== 'undefined' ? createPortal(el, document.body) : el;
}

const Modal=({title,onClose,children})=>h(Overlay,{onClose,label:title},
  h('div',{className:'mh'},h('h3',null,title),h('button',{className:'tog x',onClick:onClose,'aria-label':'Close'},'×')),children);

export { Modal, Overlay, trapTarget };
export default Modal;
