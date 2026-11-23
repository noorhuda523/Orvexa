import React, { useState } from 'react';
import { Btn } from '../components/Button';
import { useToast } from '../components/Toast';
import { Card, Chips, Field } from '../components/ui';
import { D, R, useScrollReveal } from '../hooks/useScrollReveal';
import { pushMessage } from '../utils/storage';
import { EMAIL } from '../utils/validation';
const h = React.createElement;

const TOPICS=['General','Support','Partnership','Feedback'];

function Contact(){
  const ref=useScrollReveal('contact'), toast=useToast();
  const blank={name:'',email:'',topic:'General',msg:''};
  const [v,setV]=useState(blank), [er,setEr]=useState({}), [done,setDone]=useState(false);
  const set=k=>e=>{setV({...v,[k]:e.target.value});if(er[k])setEr({...er,[k]:''})};
  const submit=e=>{
    e.preventDefault();
    const x={};
    if(!v.name.trim())x.name='Enter your name.';
    if(!EMAIL.test(v.email.trim()))x.email='Enter a valid email, like name@company.com.';
    if(v.msg.trim().length<10)x.msg='Write at least 10 characters.';
    setEr(x);
    if(Object.keys(x).length){toast('Please fix the highlighted fields.','err');return}
    pushMessage({...v,at:Date.now()});
    setDone(true);toast('Message sent successfully. Our team will get back to you shortly.');
  };
  return h('div',{ref,className:'pg'},
    h('div',{className:'wrap ph'},D('ring',{width:260,height:260,right:'4%',top:'10%'},-.15),
      h('h1',R(0),'Get in touch'),
      h('p',R(1,'lead'),'Have questions about Orvexa or need help with your deployment? We are here to help.')),
    h('div',{className:'wrap cgrid',style:{paddingBottom:72}},
      done?h('div',R(0,'panel'),h('h3',null,'Thanks, '+(v.name.trim().split(/\s+/)[0]||'there')),
          h('p',{className:'note'},'Your message has been received. Our team will review and respond shortly.'),
          h('div',{style:{marginTop:18}},h(Btn,{v:'sec',onClick:()=>{setV(blank);setEr({});setDone(false)}},'Write another')))
      :h('form',{...R(0,'panel'),onSubmit:submit,noValidate:true},
          h(Field,{label:'Name',value:v.name,onChange:set('name'),error:er.name,autoComplete:'name'}),
          h(Field,{label:'Email',type:'email',value:v.email,onChange:set('email'),error:er.email,autoComplete:'email'}),
          h('p',{className:'tl'},'Topic'),
          h(Chips,{items:TOPICS,value:v.topic,onPick:t=>setV({...v,topic:t})}),
          h(Field,{label:'Message',as:'textarea',value:v.msg,onChange:set('msg'),error:er.msg,hint:v.msg.trim().length+' characters'}),
          h(Btn,{type:'submit'},'Send message')),
      h('div',{className:'grid',style:{gridTemplateColumns:'1fr'}},
        Card(['Fast Response','Our enterprise support team responds to all inquiries within 24 business hours.'],0,null),
        Card(['Direct Inquiries','Reach our team directly at contact@orvexa.dev for enterprise partnerships.'],1,null))),
    );
}

export { TOPICS };
export default Contact;
