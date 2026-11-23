// Extra validators used by profile, security and billing screens.
export const luhn = (num) => {
  const d = String(num).replace(/\D/g, ''); if (d.length < 12) return false;
  let sum = 0, alt = false;
  for (let i = d.length - 1; i >= 0; i--) { let n = +d[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; }
  return sum % 10 === 0;
};
export const cardBrand = (num) => { const d = String(num).replace(/\D/g, ''); return /^4/.test(d) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(d) ? 'Mastercard' : /^3[47]/.test(d) ? 'Amex' : 'Card'; };
export const expiryOk = (v, now = new Date()) => {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.trim()); if (!m) return false;
  const mm = +m[1], yy = 2000 + +m[2]; if (mm < 1 || mm > 12) return false;
  return yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1);
};
export const urlOk = (v) => !v || /^https?:\/\/[^\s/$.?#][^\s]*\.[^\s]{2,}$/i.test(v.trim());
export const validateProfile = (v) => {
  const x = {}, n = v.name.trim();
  if (!n) x.name = 'Enter your name.'; else if (n.length > 40) x.name = 'Keep your name under 40 characters.';
  if (v.role.length > 40) x.role = 'Keep the role under 40 characters.';
  if (v.company.length > 40) x.company = 'Keep the company under 40 characters.';
  if (v.location.length > 60) x.location = 'Keep the location under 60 characters.';
  if (v.bio.length > 200) x.bio = 'The bio can be up to 200 characters.';
  for (const k of ['website', 'github', 'linkedin', 'twitter']) if (!urlOk(v[k])) x[k] = 'Enter a full link that starts with https://';
  return x;
};
