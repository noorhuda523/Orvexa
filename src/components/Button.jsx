import React from 'react';
const h = React.createElement;

const Btn=({v='pri',sm,className='',...p})=>h('button',{type:'button',...p,className:'btn '+v+(sm?' sm':'')+' '+className});

export { Btn };
export const Button = Btn;
export default Btn;
