

const PWL=['','Weak','Fair','Good','Strong'];

function pwScore(p){let s=0;if(p.length>=8)s++;if(/[a-z]/.test(p)&&/[A-Z]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9]/.test(p)||p.length>=14)s++;return p?Math.max(1,s):0}

const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const profileErrors=v=>{const x={},n=v.name.trim();if(!n)x.name='Enter your name.';else if(n.length>40)x.name='Keep your name under 40 characters.';if(v.role.trim().length>40)x.role='Keep the role under 40 characters.';return x};

export { EMAIL, PWL, profileErrors, pwScore };
