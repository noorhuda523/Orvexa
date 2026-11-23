import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
if (THREE.ColorManagement) THREE.ColorManagement.enabled = false; // keep the original (r128) colours
import { R } from '../hooks/useScrollReveal';
import { reduce } from '../utils/dom';
const h = React.createElement;

const PAL={
  dark:{node:0x67e8f9,line:0x8b5cf6,part:0xa78bfa,core:0x8b5cf6,add:true,lo:.45,coreO:.08},
  light:{node:0x6d3fe0,line:0x0891b2,part:0x0e1738,core:0x6d3fe0,add:false,lo:.5,coreO:.07}
};

function hasGL(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl')||c.getContext('experimental-webgl')))}catch(e){return false}}

function HeroSphere({theme}){
  const host=useRef(null), st=useRef(null);
  const [fb,setFb]=useState(()=>!hasGL());
  useEffect(()=>{
    if(fb)return;
    const el=host.current; let r;
    try{r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.outputColorSpace=THREE.LinearSRGBColorSpace}catch(e){setFb(true);return}
    const lite=innerWidth<700, N=lite?150:260, R=1.35;
    r.setPixelRatio(Math.min(devicePixelRatio||1,2));
    el.appendChild(r.domElement);
    const scene=new THREE.Scene(), cam=new THREE.PerspectiveCamera(45,1,.1,50);
    cam.position.z=4.6;
    const tilt=new THREE.Group(), g=new THREE.Group(), pg=new THREE.Group();
    scene.add(tilt); tilt.add(g); tilt.add(pg);
    // network nodes on a sphere
    const pts=[];
    for(let i=0;i<N;i++){
      const y=1-(i/(N-1))*2, rad=Math.sqrt(1-y*y), th=i*2.399963, k=R*(1+(Math.random()-.5)*.05);
      pts.push(new THREE.Vector3(Math.cos(th)*rad*k,y*k,Math.sin(th)*rad*k));
    }
    const nodeGeo=new THREE.BufferGeometry().setFromPoints(pts);
    const nodeMat=new THREE.PointsMaterial({size:.05,transparent:true,depthWrite:false});
    g.add(new THREE.Points(nodeGeo,nodeMat));
    // connections between near neighbours (computed once)
    const thr=Math.sqrt(4*Math.PI*R*R/N)*1.75, seg=[];
    for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)if(pts[i].distanceTo(pts[j])<thr)seg.push(pts[i],pts[j]);
    const lineGeo=new THREE.BufferGeometry().setFromPoints(seg);
    const lineMat=new THREE.LineBasicMaterial({transparent:true,depthWrite:false});
    g.add(new THREE.LineSegments(lineGeo,lineMat));
    // soft core
    const coreGeo=new THREE.SphereGeometry(R*.98,32,24);
    const coreMat=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false});
    g.add(new THREE.Mesh(coreGeo,coreMat));
    // floating particles
    const M=lite?60:140, pp=[];
    for(let i=0;i<M;i++){
      const u=Math.random()*2-1, t=Math.random()*6.2832, s=Math.sqrt(1-u*u), d=1.75+Math.random()*1;
      pp.push(new THREE.Vector3(s*Math.cos(t)*d,u*d,s*Math.sin(t)*d));
    }
    const partGeo=new THREE.BufferGeometry().setFromPoints(pp);
    const partMat=new THREE.PointsMaterial({size:.03,transparent:true,opacity:.7,depthWrite:false});
    pg.add(new THREE.Points(partGeo,partMat));

    const apply=th=>{
      const p=PAL[th], bl=p.add?THREE.AdditiveBlending:THREE.NormalBlending;
      nodeMat.color.set(p.node); nodeMat.blending=bl; nodeMat.opacity=1; nodeMat.needsUpdate=true;
      lineMat.color.set(p.line); lineMat.opacity=p.lo; lineMat.blending=bl; lineMat.needsUpdate=true;
      coreMat.color.set(p.core); coreMat.opacity=p.coreO; coreMat.blending=bl; coreMat.needsUpdate=true;
      partMat.color.set(p.part); partMat.blending=bl; partMat.needsUpdate=true;
    };
    const draw=()=>r.render(scene,cam);
    const size=()=>{const w=el.clientWidth||300,hh=el.clientHeight||300;r.setSize(w,hh);cam.aspect=w/hh;cam.updateProjectionMatrix();draw()};
    const calm=reduce();
    let tx=0,ty=0,vis=true,raf=0;
    const clock=new THREE.Clock();
    const loop=()=>{
      raf=requestAnimationFrame(loop);
      if(!vis||document.hidden)return;
      const dt=Math.min(clock.getDelta(),.05), t=clock.elapsedTime;
      g.rotation.y+=dt*.18;
      pg.rotation.y-=dt*.04; pg.rotation.x=Math.sin(t*.25)*.12;
      tilt.rotation.x+=(ty-tilt.rotation.x)*.05;
      tilt.rotation.y+=(tx-tilt.rotation.y)*.05;
      draw();
    };
    const move=e=>{const b=el.getBoundingClientRect();tx=((e.clientX-b.left)/b.width-.5)*.9;ty=((e.clientY-b.top)/b.height-.5)*.7};
    const leave=()=>{tx=0;ty=0};
    const ro=new ResizeObserver(size); ro.observe(el);
    const io=new IntersectionObserver(es=>{vis=es[0].isIntersecting});io.observe(el);
    if(!calm){el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);loop()}
    st.current={apply,draw};
    apply(document.documentElement.dataset.theme||'dark'); size();
    return()=>{
      cancelAnimationFrame(raf);ro.disconnect();io.disconnect();
      el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);
      [nodeGeo,lineGeo,coreGeo,partGeo,nodeMat,lineMat,coreMat,partMat].forEach(o=>o.dispose());
      r.dispose();if(r.domElement.parentNode)r.domElement.parentNode.removeChild(r.domElement);st.current=null;
    };
  },[fb]);
  useEffect(()=>{if(st.current){st.current.apply(theme);st.current.draw()}},[theme]);
  return fb?h('div',{className:'orb','aria-hidden':'true'}):h('div',{ref:host,className:'gl','aria-hidden':'true'});
}

export { HeroSphere, PAL, hasGL };
export default HeroSphere;
