// Parse article lists, ranges and named diplomas without treating paragraph numbers as articles.
const diploma=String.raw`(?:Código\s+Penal|Constituição(?:\s+Federal)?|CPPM|CPP|CP|CF|LCP|LEP|ECA|CTB|(?:Lei|DL|Decreto-lei)\s*(?:n[ºo°.]?\s*)?\d[\d.]*(?:\/\d+)?)`;
export function lawId(name){const s=name.toLowerCase();if(/^constituição|^cf$/.test(s))return'cf';if(/^código penal|^cp$/.test(s))return'cp';if(/^(cpp|cppm|lcp|lep|eca|ctb)$/.test(s))return s;const m=/([\d.]+)(?:\/(\d+))?/.exec(s);return(m?'l'+m[1].replaceAll('.',''):'');}
const atom=String.raw`\d+(?:\.\d{3})?[º°]?(?:\s*[-–]\s*[A-Z](?![a-z]))?`;
export function references(text,n){
 const result=[];const re=new RegExp(String.raw`\b(?:arts?\.|artigos?)\s*(${atom}(?:\s*(?:,|\be\b|\ba\b|[–—])\s*${atom})*)`,'gi');
 for(const m of text.matchAll(re)){
  const pre=text.slice(0,m.index),post=text.slice(m.index+m[0].length);
  const before=new RegExp('('+diploma+')\\s*[,;:]?\\s*$','i').exec(pre);
  const after=new RegExp('^\\s*(?:(?!\\barts?\\.|[.;]).){0,100}?\\b(?:do|da)\\s+('+diploma+')\\b','i').exec(post)||new RegExp('^\\s*('+diploma+')\\b','i').exec(post);

  let law=lawId(after?.[1]||before?.[1]||'');
  const refs=[...m[1].matchAll(new RegExp(atom,'g'))].map(x=>({ref:x[0].replace(/[º°\s.]/g,'').replace('–','-').toUpperCase(),index:x.index}));
  if(!law){law=n===14?'l13869':n===15?'l9613':n===17&&refs.every(x=>[3,21,22,23,24].includes(+x.ref))?'l9605':'cp';if(n===1&&refs.every(x=>x.ref==='5'))law='cf';if(n===17&&refs.every(x=>['5','225'].includes(x.ref)))law='cf';}

  if(n===14&&refs.every(x=>['150','327'].includes(x.ref)))law='cp';
  const expanded=[];
  refs.forEach((x,i)=>{expanded.push(x.ref);const next=refs[i+1];if(!next)return;const between=m[1].slice(x.index+x.ref.length,next.index).replace(/[º°]/g,'').trim();if(/^(a|–|—)$/i.test(between)){if(/^\d+$/.test(x.ref)&&/^\d+$/.test(next.ref)&&+next.ref-+x.ref<1000)for(let k=+x.ref+1;k<+next.ref;k++)expanded.push(String(k));else{const a=/^(\d+)-([A-Z])$/.exec(x.ref),b=/^(\d+)-([A-Z])$/.exec(next.ref);if(a&&b&&a[1]===b[1])for(let k=a[2].charCodeAt(0)+1;k<b[2].charCodeAt(0);k++)expanded.push(a[1]+'-'+String.fromCharCode(k));}}});
  for(const ref of expanded)result.push({key:law+':'+ref,law,ref});
 }
 return [...new Map(result.map(x=>[x.key,x])).values()];
}
