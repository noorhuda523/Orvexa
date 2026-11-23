import React, { useState } from 'react';
const h = React.createElement;

const ToastCtx=React.createContext(()=>{});

const useToast=()=>React.useContext(ToastCtx);

function ToastProvider({children}){
  const [ts,setTs]=useState([]);
  const push=React.useCallback((s,t='ok')=>{const id=Math.random();setTs(a=>[...a,{id,s,t}]);setTimeout(()=>setTs(a=>a.filter(x=>x.id!==id)),3500)},[]);
  return h(ToastCtx.Provider,{value:push},children,h('div',{className:'toasts',role:'status','aria-live':'polite'},ts.map(x=>h('div',{key:x.id,className:'toast '+x.t},x.s))));
}

export { ToastCtx, ToastProvider, useToast };
