/* Direito Constitucional M01 — ajustes estritamente locais da lei seca.
 * Mantém intacto o catálogo base M01–M15. Dados já presentes no próprio Vade Mecum.
 */
(function(g){
'use strict';
const modules=g.BC_CF_GUIDED_LAW, first=modules&&modules['1'];
if(!first)return;
const all=Object.values(modules).flatMap(m=>Object.values(m).flat());
function best(label){
 return all.filter(row=>row&&row[0]===label&&Array.isArray(row[1]))
  .sort((a,b)=>b[1].length-a[1].length)[0];
}
function row(label,startsWith){
 const item=best(label);
 if(!item)throw new Error('Lei seca sem fonte: '+label);
 const text=item[1].find(paragraph=>paragraph.startsWith(startsWith));
 if(!text)throw new Error('Trecho legal não localizado: '+label+' '+startsWith);
 return text;
}
function unique(arr,label){
 return arr.filter(x=>x[0]===label).sort((a,b)=>b[1].length-a[1].length)[0];
}
const art60=best('CF/88, art. 60');
const art1=unique(first['9']||[],'CF/88, art. 1º');
const art3=unique(first['11']||[],'CF/88, art. 3º');
const art4=unique(first['12']||[],'CF/88, art. 4º');
const art1complete=unique(first['11']||[],'CF/88, art. 1º');
const art3complete=unique(first['12']||[],'CF/88, art. 3º');
if(!art60||!art1||!art3||!art4||!art1complete||!art3complete)return;
first['1']=[['CF/88, art. 242, § 2º',['§ 2º O Colégio Pedro II, localizado na cidade do Rio de Janeiro, será mantido na órbita federal.']]];
first['3']=[['CF/88, art. 5º, § 3º',[row('CF/88, art. 5º','§ 3º')]]];
first['4']=[
 ['CF/88, art. 5º, XIII',[row('CF/88, art. 5º','XIII -')]],
 ['CF/88, art. 5º, LXXI',[row('CF/88, art. 5º','LXXI -')]],
 ['CF/88, art. 103, § 2º',[row('CF/88, art. 103','§ 2º')]]
];
first['3'].forEach(x=>{if(!x[1].length)throw new Error('Dispositivo sem texto')});
first['5']=[art60];
first['6']=[['LINDB, art. 2º, § 3º',['§ 3º Salvo disposição em contrário, a lei revogada não se restaura por ter a lei revogadora perdido a vigência.']]];
delete first['7']; // assunto sobre mutação: art. 60 não é a lei seca correspondente.
first['9']=[art1];
first['11']=[art3,art1complete];
first['12']=[art4,art3complete];
})(window);
