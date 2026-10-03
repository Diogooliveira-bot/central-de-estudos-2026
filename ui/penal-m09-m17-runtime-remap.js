(function(global){
'use strict';

function clone(x){return JSON.parse(JSON.stringify(x));}
function uniq(arr){return Array.from(new Set((arr||[]).filter(Boolean)));}

function apply(){
  try{
    if(typeof PENAL_WEEKS==='undefined')return false;

    const by=id=>PENAL_WEEKS.find(x=>x.id===id);
    const old={};
    ['p8','p9','p10','p11','p12','p13','p14','p15','p16','p17'].forEach(id=>{old[id]=clone(by(id));});
    if(Object.values(old).some(x=>!x))return false;

    const plan={
      p9:{base:'p8',num:9,title:'Crimes contra a Pessoa',subtitle:'CP, arts. 121 a 154-B',topics:old.p8.topics},
      p10:{base:'p9',num:10,title:'Crimes contra o Patrimônio',subtitle:'CP, arts. 155 a 183-A',topics:old.p9.topics},
      p11:{base:'p10',num:11,title:'Crimes contra a Fé Pública',subtitle:'CP, arts. 289 a 311-A',topics:old.p10.topics},
      p12:{base:'p11',num:12,title:'Crimes contra a Dignidade Sexual',subtitle:'CP, arts. 213 a 234-B',topics:old.p11.topics},
      p13:{base:'p12',num:13,title:'Crimes contra a Administração Pública',subtitle:'CP, arts. 312 a 359-H',topics:uniq([...(old.p12.topics||[]),...(old.p17.topics||[])])},
      p14:{base:'p13',num:14,title:'Abuso de Autoridade',subtitle:'Lei 13.869/2019',topics:old.p13.topics},
      p15:{base:'p14',num:15,title:'Lavagem de Dinheiro',subtitle:'Lei 9.613/1998',topics:old.p14.topics},
      p16:{base:'p16',num:16,title:'Crimes em Licitações e Contratos',subtitle:'CP, arts. 337-E a 337-P',topics:old.p16.topics},
      p17:{base:'p15',num:17,title:'Constituição Penal, Responsabilidade Penal da Pessoa Jurídica, Súmulas e Consolidação',subtitle:'CF, art. 5º; CF, art. 225, §3º; Lei 9.605/1998; súmulas STF/STJ',topics:old.p15.topics}
    };

    Object.entries(plan).forEach(([id,p])=>{
      const target=by(id), base=clone(old[p.base]);
      const next={...base,id,num:p.num,title:p.title,subtitle:p.subtitle,topics:uniq(p.topics)};
      Object.keys(target).forEach(k=>delete target[k]);
      Object.assign(target,next);
    });

    try{
      if(typeof PENAL_ANKI!=='undefined'){
        const sourceMap={p9:'p8',p10:'p9',p11:'p10',p12:'p11',p13:'p12',p14:'p13',p15:'p14',p16:'p16',p17:'p15'};
        Object.entries(sourceMap).forEach(([to,from])=>{
          const deck=old[from]?.ankiDeck || PENAL_ANKI[from];
          if(deck)PENAL_ANKI[to]=deck;
        });
      }
    }catch(_){}

    try{
      if(typeof SUBJECTS!=='undefined'){
        const penal=SUBJECTS.find(s=>s.id==='penal');
        if(penal&&Array.isArray(penal.topics)){
          const legacy={};
          penal.topics.forEach(t=>{legacy[t.uid]=clone(t);});
          const sourceUid={9:'pen-m08-analista',10:'pen-m09-analista',11:'pen-m10-analista',12:'pen-m11-analista',13:'pen-m12-analista',14:'pen-m13-analista',15:'pen-m14-analista',16:'pen-m16-analista',17:'pen-m15-analista'};
          const canonicalTitles={
            9:'09 CRIMES CONTRA A PESSOA',
            10:'10 CRIMES CONTRA O PATRIMÔNIO',
            11:'11 CRIMES CONTRA A FÉ PÚBLICA',
            12:'12 CRIMES CONTRA A DIGNIDADE SEXUAL',
            13:'13 CRIMES CONTRA A ADMINISTRAÇÃO PÚBLICA',
            14:'14 ABUSO DE AUTORIDADE',
            15:'15 LAVAGEM DE DINHEIRO',
            16:'16 CRIMES EM LICITAÇÕES E CONTRATOS',
            17:'17 CONSTITUIÇÃO PENAL, PESSOA JURÍDICA, SÚMULAS E CONSOLIDAÇÃO'
          };
          for(let n=9;n<=17;n++){
            const current=penal.topics.find(t=>t.uid===`pen-m${String(n).padStart(2,'0')}-analista`);
            const src=legacy[sourceUid[n]];
            if(current&&src){
              Object.assign(current,clone(src),{
                uid:`pen-m${String(n).padStart(2,'0')}-analista`,
                title:canonicalTitles[n],
                origin:`Módulo ${String(n).padStart(2,'0')} canônico`
              });
              if(n===13){
                const finance=legacy['pen-m17-analista'];
                if(finance?.sourceStats&&current.sourceStats){
                  current.sourceStats.questionsReal=(current.sourceStats.questionsReal||0)+(finance.sourceStats.questionsReal||0);
                  current.sourceStats.questionsAuthorial=(current.sourceStats.questionsAuthorial||0)+(finance.sourceStats.questionsAuthorial||0);
                }
              }
            }
          }
        }
      }
    }catch(_){}

    if(typeof renderSubjects==='function')renderSubjects();
    global.__penalM09M17CanonicalRemapApplied=true;
    return true;
  }catch(err){
    console.error('[Penal M09-M17 canonical remap]',err);
    return false;
  }
}

if(!apply())setTimeout(()=>{if(!apply())setTimeout(apply,120)},60);
})(window);
