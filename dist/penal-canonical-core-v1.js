(function(global){
'use strict';
const VERSION='penal-canonico-2026.09.19-v2';
const OLD_MAIN='penal_tjce_fcc_guided_v32', OLD_FALLBACK='penal_tjce_fcc_guided_v31';
const NEW_MAIN='penal_tjce_fcc_guided_v33_canonico';
const STAGES=['diagnostic','reading','theory','intermediate','deep','fixation'];
const TOPIC_MAP={'pen-m01':'pen-m01','pen-m02':'pen-m02','pen-m03':'pen-m04','pen-m04':'pen-m05','pen-m05':'pen-m06','pen-m06':'pen-m07','pen-m07':'pen-m08','pen-m08':'pen-m09','pen-m09':'pen-m10','pen-m10':'pen-m11','pen-m11':'pen-m12','pen-m12':'pen-m13','pen-m13':'pen-m14','pen-m14':'pen-m15','pen-m15':'pen-m17','pen-m16':'pen-m16','pen-m17':'pen-m13'};
const WEEK_PLAN={p1:{from:['p1'],mode:'exact'},p2:{from:['p2'],mode:'exact'},p3:{from:[],mode:'new'},p4:{from:['p3'],mode:'exact'},p5:{from:['p4'],mode:'expanded'},p6:{from:['p5'],mode:'exact'},p7:{from:['p6'],mode:'expanded'},p8:{from:['p7'],mode:'exact'},p9:{from:['p8'],mode:'exact'},p10:{from:['p9'],mode:'exact'},p11:{from:['p10'],mode:'exact'},p12:{from:['p11'],mode:'exact'},p13:{from:['p12','p17'],mode:'composite'},p14:{from:['p13'],mode:'exact'},p15:{from:['p14'],mode:'exact'},p16:{from:['p16'],mode:'exact'},p17:{from:['p15'],mode:'expanded'}};
const LAST={p1:'p1',p2:'p2',p3:'p4',p4:'p5',p5:'p6',p6:'p7',p7:'p8',p8:'p9',p9:'p10',p10:'p11',p11:'p12',p12:'p13',p13:'p14',p14:'p15',p15:'p17',p16:'p16',p17:'p13'};
const TITLES=[
'Princípios, interpretação, analogia e conflito aparente',
'Aplicação da Lei Penal',
'Teoria do Crime',
'Ilicitude',
'Culpabilidade e Teoria do Erro',
'Concurso de Pessoas',
'Concurso de Crimes e Penas',
'Punibilidade e Prescrição',
'Crimes contra a Pessoa',
'Crimes contra o Patrimônio',
'Crimes contra a Fé Pública',
'Crimes contra a Dignidade Sexual',
'Crimes contra a Administração Pública',
'Abuso de Autoridade — Lei 13.869/2019',
'Lavagem de Dinheiro — Lei 9.613/1998',
'Crimes em Licitações e Contratos',
'Constituição Penal, Responsabilidade Penal da Pessoa Jurídica, Súmulas e Consolidação'
];
function clone(x){return JSON.parse(JSON.stringify(x??null))}
function parse(raw,f){try{return raw?JSON.parse(raw):clone(f)}catch(e){return clone(f)}}
function fresh(){return {diagnostic:false,reading:false,theory:false,intermediate:false,deep:false,fixation:false}}
function norm(x){const o={...(x||{})};STAGES.forEach(k=>o[k]=!!o[k]);return o}
function expanded(x,src){return {...fresh(),migrationStatus:'revalidation_required',legacySource:src,legacyStageState:norm(x)}}
function composite(xs,srcs){const ns=xs.map(norm),o=fresh();STAGES.forEach(k=>o[k]=ns.length>0&&ns.every(s=>s[k]));return {...o,migrationStatus:'composite_preserved',legacySources:srcs,legacyStageStates:ns}}
function migrateState(){
 const existing=parse(localStorage.getItem(NEW_MAIN),null);
 if(existing?.migration?.version===VERSION)return existing;
 const sourceKey=localStorage.getItem(OLD_MAIN)?OLD_MAIN:OLD_FALLBACK;
 const old=parse(localStorage.getItem(sourceKey),{answers:{},weeks:{},lastWeek:'p1'}),weeks={};
 for(const [id,p] of Object.entries(WEEK_PLAN)){
   const xs=p.from.map(s=>old.weeks?.[s]||{});
   weeks[id]=p.mode==='exact'?norm(xs[0]):p.mode==='expanded'?expanded(xs[0],p.from[0]):p.mode==='composite'?composite(xs,p.from):fresh();
 }
 const backupKey='penal_tjce_migration_backup_'+Date.now();
 localStorage.setItem(backupKey,JSON.stringify({version:VERSION,at:new Date().toISOString(),sourceKey,state:old}));
 const neo={...old,answers:clone(old.answers||{}),weeks,lastWeek:LAST[old.lastWeek]||'p1',migration:{version:VERSION,at:new Date().toISOString(),sourceKey,backupKey,oldWeeks:clone(old.weeks||{})}};
 localStorage.setItem(NEW_MAIN,JSON.stringify(neo));
 for(const [nid,p] of Object.entries(WEEK_PLAN)){
   const src=p.from;
   localStorage.setItem('central-v7:penal-open:'+nid,src.some(s=>localStorage.getItem('central-v6:penal-open:'+s)==='1')?'1':'0');
   const notes=src.map(s=>({s,v:localStorage.getItem('central-v6:penal-note:'+s)})).filter(x=>x.v&&x.v.trim());
   if(notes.length)localStorage.setItem('central-v7:penal-note:'+nid,notes.map(x=>src.length>1?'[LEGADO '+x.s+']\n'+x.v:x.v).join('\n\n'));
   const ress=src.map(s=>({s,v:parse(localStorage.getItem('central-v6:penal-res:'+s),{})})).filter(x=>Object.keys(x.v||{}).length);
   if(ress.length){const r={legacySources:ress};for(const k of ['tec','qc']){const x=ress.find(z=>z.v?.[k]);if(x)r[k]=x.v[k]}localStorage.setItem('central-v7:penal-res:'+nid,JSON.stringify(r))}
 }
 localStorage.setItem('penal_tjce_migration_marker',JSON.stringify({version:VERSION,sourceKey,target:NEW_MAIN,backupKey,oldKeysDeleted:false,at:new Date().toISOString()}));
 return neo;
}
function copyWeek(old,id,num,title){
 const w=clone(old)||{};
 w.id=id;w.num=num;w.title=title;w.editalModule='pen-m'+String(num).padStart(2,'0');w.auditStatus='auditoria-final-pen-2026';
 return w;
}
function newM3(){
 return {id:'p3',num:3,title:TITLES[2],subtitle:'Fato típico, conduta, resultado, nexo causal, tipicidade, dolo, culpa, tentativa, desistência e crime impossível.',topics:['pen-m03'],read:'CP, arts. 13 a 25, com foco nos elementos do fato típico e iter criminis.',read_focus:['conduta, resultado, nexo e tipicidade','omissão própria e imprópria','dolo e culpa','tentativa, desistência, arrependimento e crime impossível'],outline:['fato típico','conduta','resultado','nexo causal','concausas','omissão','tipicidade','dolo','culpa','preterdolo','iter criminis','tentativa','desistência voluntária','arrependimento eficaz','arrependimento posterior','crime impossível'],theory:[['Estrutura do crime','Para fins analíticos, o crime é estudado a partir do fato típico, seguido da ilicitude e da culpabilidade. O M3 concentra o fato típico e institutos ligados à realização da conduta.'],['Conduta e resultado','A conduta penalmente relevante pode ser comissiva ou omissiva. Nos crimes materiais, o resultado naturalístico integra a consumação; em outros tipos, a estrutura é diversa.'],['Nexo causal','O art. 13 adota como ponto de partida a equivalência dos antecedentes, com limites normativos e tratamento próprio da superveniência de causa relativamente independente.'],['Omissão imprópria','Nos crimes comissivos por omissão, o resultado pode ser imputado a quem tinha dever jurídico de agir e possibilidade concreta de evitar o resultado, nos termos do art. 13, §2º.'],['Dolo e culpa','Dolo envolve vontade e consciência da realização típica; culpa decorre de violação do dever objetivo de cuidado nas formas legais, quando o tipo admite punição culposa.'],['Tentativa','Há tentativa quando iniciada a execução, o crime não se consuma por circunstâncias alheias à vontade do agente; a redução segue o art. 14, parágrafo único.'],['Desistência e arrependimento eficaz','Nos arts. 15 e 16, diferencie interrupção voluntária da execução, impedimento voluntário do resultado e reparação/restituição posterior nos crimes sem violência ou grave ameaça.'],['Crime impossível','O art. 17 afasta a punição da tentativa quando houver ineficácia absoluta do meio ou impropriedade absoluta do objeto.']],advanced:[['Causalidade','Não confunda causa relativamente independente superveniente que, por si só, produz o resultado com mera condição que mantém o nexo.'],['Tentativa','O critério de redução considera o iter percorrido: quanto mais próximo da consumação, menor tende a ser a redução.'],['Desistência','Na desistência voluntária e no arrependimento eficaz, o agente responde pelos atos já praticados, se constituírem infração.'],['Crime impossível','Ineficácia ou impropriedade relativas não bastam para o art. 17.']],editalModule:'pen-m03-canonico',auditStatus:'auditoria-final-pen-2026'};
}
function buildWeeks(){
 const old=Array.from(PENAL_WEEKS);
 const by=n=>old.find(w=>w.num===n);
 const ws=[];
 ws.push(copyWeek(by(1),'p1',1,TITLES[0]));
 ws.push(copyWeek(by(2),'p2',2,TITLES[1]));
 ws.push(newM3());
 ws.push(copyWeek(by(3),'p4',4,TITLES[3]));
 const m5=copyWeek(by(4),'p5',5,TITLES[4]);m5.outline=[...(m5.outline||[]),'erro de tipo','erro de proibição','descriminantes putativas'];m5.theory=[...(m5.theory||[]),['Erro de tipo','Recai sobre elemento constitutivo do tipo e pode excluir o dolo; o tratamento da culpa depende de previsão legal.'],['Erro de proibição','Recai sobre a ilicitude do fato: se inevitável, isenta; se evitável, permite diminuição de pena.'],['Descriminantes putativas','Exigem identificar se o erro recai sobre pressuposto fático de justificante ou sobre a própria existência/limites jurídicos da permissão.']];ws.push(m5);
 ws.push(copyWeek(by(5),'p6',6,TITLES[5]));
 const m7=copyWeek(by(6),'p7',7,TITLES[6]);m7.outline=[...(m7.outline||[]),'concurso material','concurso formal','crime continuado'];m7.theory=[['Concurso material','Art. 69: praticados mais de um crime mediante mais de uma ação ou omissão, as penas são aplicadas cumulativamente.'],['Concurso formal','Art. 70: uma só ação ou omissão produz dois ou mais crimes; a regra de exasperação cede à cumulação no concurso formal impróprio.'],['Crime continuado','Art. 71: crimes da mesma espécie, em condições semelhantes de tempo, lugar e modo de execução, podem ser tratados como continuação nas condições legais.'],...(m7.theory||[])];m7.advanced=[['Concurso material benéfico','No concurso formal, a exasperação não pode produzir resultado superior ao da soma das penas que seria obtida pelo concurso material.'],...(m7.advanced||[])];ws.push(m7);
 ws.push(copyWeek(by(7),'p8',8,TITLES[7]));
 ws.push(copyWeek(by(8),'p9',9,TITLES[8]));
 ws.push(copyWeek(by(9),'p10',10,TITLES[9]));
 ws.push(copyWeek(by(10),'p11',11,TITLES[10]));
 ws.push(copyWeek(by(11),'p12',12,TITLES[11]));
 const adm=copyWeek(by(12),'p13',13,TITLES[12]),fin=by(17);adm.outline=[...(adm.outline||[]),...(fin?.outline||[])];adm.theory=[...(adm.theory||[]),...(fin?.theory||[])];adm.advanced=[...(adm.advanced||[]),...(fin?.advanced||[])];ws.push(adm);
 ws.push(copyWeek(by(13),'p14',14,TITLES[13]));
 ws.push(copyWeek(by(14),'p15',15,TITLES[14]));
 ws.push(copyWeek(by(16),'p16',16,TITLES[15]));
 const m17=copyWeek(by(15),'p17',17,TITLES[16]);m17.outline=[...(m17.outline||[]),'responsabilidade penal da pessoa jurídica','crimes ambientais','dupla imputação','consolidação M1–M16'];m17.theory=[...(m17.theory||[]),['Responsabilidade penal da pessoa jurídica','A Constituição admite responsabilidade penal da pessoa jurídica em matéria ambiental. A responsabilização da entidade não exige, como condição processual absoluta, a simultânea imputação de pessoa física.'],['Dupla imputação','O STF, no RE 548.181, afastou a exigência de dupla imputação como pressuposto necessário da persecução penal da pessoa jurídica por crime ambiental; o STJ ajustou sua orientação.'],['Estrutura da imputação','A análise deve observar atuação em benefício ou interesse da entidade, decisão de representante legal/contratual ou órgão colegiado e os requisitos da Lei 9.605/1998.'],['Consolidação','Use o M17 para revisar princípios constitucionais penais, súmulas vigentes, responsabilidade da PJ e conexões com os M1–M16.']];ws.push(m17);
 // Keep old Decorando module keys where the existing tool is already populated.
 const decor={p1:'pen-m01',p2:'pen-m02',p3:'pen-m03-canonico',p4:'pen-m03',p5:'pen-m04',p6:'pen-m05',p7:'pen-m06',p8:'pen-m07',p9:'pen-m08',p10:'pen-m09',p11:'pen-m10',p12:'pen-m11',p13:'pen-m12',p14:'pen-m13',p15:'pen-m14',p16:'pen-m16',p17:'pen-m15'};
 ws.forEach(w=>w.editalModule=decor[w.id]||w.editalModule);
 return ws;
}
function install(){
 migrateState();
 PENAL_QUESTIONS.forEach(q=>{const old=q.t||q.moduleId,m=TOPIC_MAP[old]||old;if(q.t)q.t=m;if(q.moduleId)q.moduleId=m});
 const weeks=buildWeeks();PENAL_WEEKS.splice(0,PENAL_WEEKS.length,...weeks);
 const s=SUBJECTS.find(x=>x.id==='penal');if(s){s.special='TJ-CE 2026 — grade canônica auditada M1–M17';s.topics=weeks.map(w=>({uid:'pen-m'+String(w.num).padStart(2,'0')+'-analista',title:String(w.num).padStart(2,'0')+' '+w.title.toUpperCase(),origin:'PEN M'+w.num+' — auditoria final 2026',type:'Curso',studyUrl:null,ankiDeck:null,sourceInfo:'Grade canônica integrada com migração preservadora.',sourceStats:null,tips:['Progresso migrado por identidade temática.','Módulos ampliados exigem revalidação.']}))}
 const alias={p1:'05 DIREITO PENAL::01 PRINCÍPIOS, INTERPRETAÇÃO, ANALOGIA E CONFLITO APARENTE',p2:'05 DIREITO PENAL::02 APLICAÇÃO DA LEI PENAL NO TEMPO E NO ESPAÇO',p3:'',p4:'05 DIREITO PENAL::03 ILICITUDE',p5:'05 DIREITO PENAL::04 CULPABILIDADE',p6:'05 DIREITO PENAL::05 CONCURSO DE PESSOAS',p7:'05 DIREITO PENAL::06 PENAS - ESPÉCIES E COMINAÇÃO',p8:'05 DIREITO PENAL::07 AÇÃO PENAL, PUNIBILIDADE E PRESCRIÇÃO',p9:'05 DIREITO PENAL::08 CRIMES CONTRA A PESSOA',p10:'05 DIREITO PENAL::09 CRIMES CONTRA O PATRIMÔNIO',p11:'05 DIREITO PENAL::10 CRIMES CONTRA A FÉ PÚBLICA',p12:'05 DIREITO PENAL::11 CRIMES CONTRA A DIGNIDADE SEXUAL',p13:'05 DIREITO PENAL::12 CRIMES CONTRA A ADMINISTRAÇÃO PÚBLICA',p14:'05 DIREITO PENAL::13 ABUSO DE AUTORIDADE - LEI 13.869',p15:'05 DIREITO PENAL::14 LAVAGEM DE DINHEIRO - LEI 9.613',p16:'05 DIREITO PENAL::16 CRIMES EM LICITAÇÕES E CONTRATOS',p17:'05 DIREITO PENAL::15 CONSTITUIÇÃO E SÚMULAS STF-STJ'};Object.keys(PENAL_ANKI).forEach(k=>delete PENAL_ANKI[k]);Object.assign(PENAL_ANKI,alias);
 global.penalState=()=>({...{answers:{},weeks:{},lastWeek:'p1'},...parse(localStorage.getItem(NEW_MAIN),{})});
 global.penalSave=st=>localStorage.setItem(NEW_MAIN,JSON.stringify(st));
 global.penalModuleOpenKey=id=>'central-v7:penal-open:'+id;global.penalNoteKey=id=>'central-v7:penal-note:'+id;global.penalResKey=id=>'central-v7:penal-res:'+id;
 const oldMaster=global.renderPenalMaster;global.renderPenalMaster=function(){return '<div class="cf-resource-box" style="margin:0 0 12px;border-color:#315c54"><b>✓ PEN M1–M17 — integração canônica ativa</b><div class="muted small">Storage v33 preservador • respostas e erros mantidos por ID • nenhum storage legado apagado.</div></div>'+oldMaster()};
 global.PenalCanonicalIntegration={version:VERSION,storageKey:NEW_MAIN,weeks,topicMap:TOPIC_MAP,weekPlan:WEEK_PLAN};
 setTimeout(()=>{try{renderAll()}catch(e){}},0);
}
try{install()}catch(e){console.error('[PEN canonical]',e)}
})(window);
