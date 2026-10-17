/* Recursos semânticos do material de RLM. Dados de aula são sempre escapados. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function table(t){
 if(!t?.headers?.length)return '';
 return '<div class="bc-rlm-table-wrap" tabindex="0" role="region" aria-label="'+esc(t.caption)+'"><table class="bc-rlm-table"><caption>'+esc(t.caption)+'</caption><thead><tr>'+t.headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+t.rows.map(row=>'<tr>'+row.map((x,i)=>i?'<td>'+esc(x)+'</td>':'<th scope="row">'+esc(x)+'</th>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
const svgText=(x,y,t,more='')=>'<text x="'+x+'" y="'+y+'" '+more+'>'+esc(t)+'</text>';
function figure(f){
 if(!f)return '';
 let body='',view='0 0 500 280';
 if(f.kind==='venn2'){
  body='<rect x="15" y="10" width="470" height="250" rx="10" fill="none" stroke="currentColor"/><circle cx="205" cy="130" r="87" fill="#4da6ad" fill-opacity=".16" stroke="#247e87"/><circle cx="305" cy="130" r="87" fill="#8a72b7" fill-opacity=".16" stroke="#78609d"/>'+svgText(150,40,'A')+svgText(350,40,'B')+svgText(165,135,f.values[0])+svgText(250,135,f.values[1])+svgText(340,135,f.values[2])+svgText(42,238,'Fora: '+f.values[3]);
 }else if(f.kind==='venn3'){
  view='0 0 500 330';
  body='<rect x="15" y="10" width="470" height="305" rx="10" fill="none" stroke="currentColor"/><circle cx="200" cy="110" r="85" fill="#4da6ad" fill-opacity=".13" stroke="#247e87"/><circle cx="300" cy="110" r="85" fill="#8a72b7" fill-opacity=".13" stroke="#78609d"/><circle cx="250" cy="190" r="85" fill="#d9a356" fill-opacity=".13" stroke="#aa7838"/>';
  [[150,95],[350,95],[250,245],[250,70],[190,180],[310,180],[250,140],[440,280]].forEach(([x,y],i)=>{body+=svgText(x,y,f.values[i],'text-anchor="middle"');});
  body+=svgText(115,35,'A')+svgText(380,35,'B')+svgText(250,300,'C','text-anchor="middle"')+svgText(420,255,'Fora');
 }else if(f.kind==='inclusion'){
  body='<ellipse cx="175" cy="140" rx="135" ry="100" fill="#4da6ad" fill-opacity=".12" stroke="#247e87"/><ellipse cx="155" cy="145" rx="65" ry="48" fill="#4da6ad" fill-opacity=".22" stroke="#247e87"/><circle cx="410" cy="140" r="60" fill="#8a72b7" fill-opacity=".12" stroke="#78609d"/>'+svgText(155,150,'A')+svgText(220,80,'B')+svgText(410,145,'C');
 }else if(f.kind==='route'){
  body='<path d="M130 225 L265 225 L265 45" fill="none" stroke="#247e87" stroke-width="5"/><path d="M130 225 L265 45" fill="none" stroke="#78609d" stroke-width="2" stroke-dasharray="7 5"/>'+svgText(75,228,'Início')+svgText(280,45,'Fim')+svgText(150,252,'3 km → leste')+svgText(280,145,'4 km ↑ norte')+svgText(60,110,'5 km em linha reta');
 }else if(f.kind==='turns'||f.kind==='matrix'){
  const cells=f.values,cols=f.kind==='matrix'?3:cells.length;
  view=f.kind==='matrix'?'0 0 500 300':'0 0 500 140';
  cells.forEach((x,i)=>{const col=i%cols,row=Math.floor(i/cols),w=440/cols;
   body+='<rect x="'+(30+col*w)+'" y="'+(20+row*85)+'" width="'+(w-8)+'" height="75" rx="8" fill="none" stroke="currentColor"/>'+svgText(30+col*w+(w-8)/2,70+row*85,x,'text-anchor="middle" font-size="35"');
  });
 }else if(f.kind==='timeline'){
  view='0 0 500 150';body='<path d="M45 65 H455" stroke="currentColor" stroke-width="2"/>';
  f.values.forEach((x,i)=>{const px=60+i*380/(f.values.length-1);body+='<circle cx="'+px+'" cy="65" r="5" fill="#247e87"/>'+svgText(px,43,x[0],'text-anchor="middle"')+svgText(px,104,x[1],'text-anchor="middle"');});
 }else if(f.kind==='bars'||f.kind==='line'){
  const vals=f.values,max=Math.max(...vals.map(x=>x[1]));
  body='<path d="M55 25 V225 H470" fill="none" stroke="currentColor"/>'+svgText(27,230,'0');
  for(let i=1;i<=4;i++){let val=max*i/4,y=225-180*i/4;body+='<path d="M55 '+y+' H470" stroke="currentColor" opacity=".13"/>'+svgText(47,y+4,Number(val.toFixed(1)),'text-anchor="end"');}
  const points=[];vals.forEach((x,i)=>{const px=100+i*320/Math.max(1,vals.length-1),y=225-x[1]/max*180;points.push(px+','+y);
   body+=f.kind==='bars'?'<rect x="'+(px-22)+'" y="'+y+'" width="44" height="'+(225-y)+'" fill="#247e87"/>':'<circle cx="'+px+'" cy="'+y+'" r="5" fill="#247e87"/>';
   body+=svgText(px,y-10,x[1],'text-anchor="middle"')+svgText(px,250,x[0],'text-anchor="middle"');});
  if(f.kind==='line')body='<polyline points="'+points.join(' ')+'" fill="none" stroke="#247e87" stroke-width="3"/>'+body;
 }else if(f.kind==='sectors'){
  let start=-Math.PI/2;const colors=['#247e87','#78609d','#bd8541'];
  f.values.forEach((x,i)=>{const end=start+x[1]/100*2*Math.PI;body+='<path d="M145 135 L'+(145+100*Math.cos(start))+' '+(135+100*Math.sin(start))+' A100 100 0 '+(x[1]>50?1:0)+' 1 '+(145+100*Math.cos(end))+' '+(135+100*Math.sin(end))+' Z" fill="'+colors[i%3]+'"/>'+svgText(280,85+i*45,x[0]+': '+x[1]+'%');start=end;});
 }else if(f.kind==='histogram'){
  const bins=f.bins,maxX=Math.max(...bins.map(x=>x.hi)),maxD=Math.max(...bins.map(x=>x.f/(x.hi-x.lo)));
  body='<path d="M65 25 V225 H465" fill="none" stroke="currentColor"/>'+svgText(15,22,'Densidade')+svgText(58,245,'0');
  bins.forEach((b,i)=>{let d=b.f/(b.hi-b.lo),x=65+b.lo/maxX*380,w=(b.hi-b.lo)/maxX*380,h=d/maxD*165;
   body+='<rect x="'+x+'" y="'+(225-h)+'" width="'+w+'" height="'+h+'" fill="'+(i%2?'#78609d':'#247e87')+'" stroke="currentColor"/>'+svgText(x+w/2,215-h,'h='+String(d).replace('.',','),'text-anchor="middle"')+svgText(x+w/2,250,b.lo+'–'+b.hi,'text-anchor="middle"');});
 }
 if(!body)return '';
 return '<figure class="bc-rlm-figure"><svg viewBox="'+view+'" role="img" aria-label="'+esc(f.description)+'" xmlns="http://www.w3.org/2000/svg" focusable="false">'+body+'</svg><figcaption>'+esc(f.description)+'</figcaption></figure>';
}
function chapter(ch){
 return ch.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+
 (ch.development||[]).map(p=>'<p>'+esc(p)+'</p>').join('')+
 (ch.tables||[]).map(table).join('')+figure(ch.figure)+
 (ch.method?.length?'<aside class="bc-rlm-method"><h4>Como resolver</h4><ol>'+ch.method.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol></aside>':'')+
 '<details class="bc-rlm-example"><summary>Exemplo rápido</summary><p>'+esc(ch.example)+'</p></details>'+
 (ch.workedExamples||[]).map(ex=>'<details class="bc-rlm-example bc-rlm-worked"><summary>Exemplo guiado: '+esc(ex.prompt)+'</summary><ol>'+ex.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><p class="bc-rlm-worked-answer"><strong>Resposta: </strong>'+esc(ex.answer)+'</p></details>').join('')+
 (ch.pitfall?'<aside class="bc-rlm-pitfall"><strong>Erro comum: </strong>'+esc(ch.pitfall)+'</aside>':'');
}
function references(d){
 const refs=(d.references||[]).filter(r=>{try{return new URL(r.url).protocol==='https:'}catch(_){return false}});
 return refs.length?'<aside class="bc-rlm-references"><h3>Leituras de apoio</h3><p>Explicações e exemplos autorais. Estas fontes ajudam a aprofundar os conceitos; os exemplos desta aula não são questões oficiais da FCC.</p><ul>'+refs.map(r=>'<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(r.title)+' ↗</a></li>').join('')+'</ul></aside>':'';
}
g.RlmTheoryResources={chapter,references};
})(window);
