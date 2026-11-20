import fs from 'node:fs';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const repoSource=path.resolve(root,'../../content/cf/m07-teoria-guiada-data.js');
const raw=fs.readFileSync(fs.existsSync(repoSource)?repoSource:path.join(root,'source-m07.js'),'utf8');
const match=raw.match(/g\.BC_CF_GUIDED_MODULES\[7\]=(\{[\s\S]*\});\}\)\(window\);?/);
if(!match) throw new Error('Não encontrei o módulo 7 no arquivo-fonte.');
const source=JSON.parse(match[1]);
const art=JSON.parse(fs.readFileSync(path.join(root,'art-content.json'),'utf8'));
if(source.topics.length!==16 || art.length!==16) throw new Error('A quantidade de capítulos ou artes não confere.');
const centrals=[
'O art. 59 lista sete espécies normativas. Cada uma tem função e procedimento próprios.',
'A PEC altera a Constituição e exige iniciativa legitimada, dois turnos e 3/5 em cada Casa.',
'Lei complementar é exigida quando a Constituição reserva a matéria; sua aprovação pede maioria absoluta.',
'A iniciativa define quem pode apresentar o projeto. Algumas matérias têm legitimado privativo.',
'Em muitos projetos, uma Casa inicia e a outra revisa; emendas da revisora voltam à iniciadora.',
'Projeto sujeito ao Presidente pode ser sancionado ou vetado. Promulgação e publicação têm funções distintas.',
'A medida provisória exige relevância e urgência, produz efeitos imediatos e passa pelo Congresso.',
'Lei delegada depende de autorização; decreto legislativo e resolução têm ritos sem sanção presidencial.',
'O controle externo verifica legalidade, legitimidade, economicidade e resultados da gestão pública.',
'O Congresso julga as contas anuais do Presidente após parecer prévio do TCU; o Tribunal julga responsáveis.',
'O TCU registra certos atos de pessoal e observa o prazo de cinco anos do Tema 445 nos casos abrangidos.',
'Os três Poderes mantêm controle interno e devem comunicar irregularidades nas hipóteses constitucionais.',
'A EC 139/2026 reconhece Tribunais de Contas como permanentes e essenciais e atualiza os arts. 31 e 75.',
'PPA planeja metas; LDO orienta prioridades; LOA estima receitas e fixa despesas anuais.',
'A Constituição limita emendas e despesas e garante repasses mensais aos Poderes e instituições.',
'Finanças públicas têm normas gerais no art. 163; o art. 164 disciplina moeda e Banco Central.'
];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const data=source.topics.map((t,i)=>({chapter:i+1,title:t[0],review:t[1],example:t[2],constitutional_reference:t[3],exam_trap:t[4],memorization:[t[5],t[6]],central:centrals[i],cards:art[i].cards,tips:art[i].tips}));
fs.writeFileSync(path.join(root,'data.json'),JSON.stringify({module:7,module_title:source.title,chapters:data},null,2)+'\n');
const template=fs.readFileSync(path.join(root,'template.html'),'utf8');
for(const item of data){
 let html=template.replaceAll('__NUM__',String(item.chapter)).replaceAll('__TITLE__',esc(item.title)).replaceAll('__CENTRAL__',esc(item.central)).replaceAll('__T1__',esc(item.tips[0])).replaceAll('__T2__',esc(item.tips[1])).replaceAll('CF M04','CF M07');
 for(let i=0;i<4;i++){html=html.replaceAll(`template-assets/icon${i+1}.png`,`template-assets/icon${i+1}.svg`).replaceAll(`__H${i+1}__`,esc(item.cards[i][0])).replaceAll(`__B${i+1}__`,esc(item.cards[i][1]));}
 fs.writeFileSync(path.join(root,`CF-M07-C${String(item.chapter).padStart(2,'0')}.html`),html);
}
console.log(`Mapped ${data.length} chapters from the source; wrote data.json and HTML files.`);
