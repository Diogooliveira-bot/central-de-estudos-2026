(function(global){
'use strict';
function clone(x){return JSON.parse(JSON.stringify(x));}
function apply(){
  try{
    if(typeof PENAL_WEEKS==='undefined')return false;
    const by=id=>PENAL_WEEKS.find(x=>x.id===id);
    const src={
      p13:clone(by('p12')),
      p14:clone(by('p13')),
      p15:clone(by('p14')),
      p16:clone(by('p16')),
      p17:clone(by('p15'))
    };
    if(!src.p13||!src.p14||!src.p15||!src.p16||!src.p17)return false;
    const meta={
      p13:{num:13,title:'Crimes contra a Administração Pública',subtitle:'CP, arts. 312 a 359-H'},
      p14:{num:14,title:'Abuso de Autoridade',subtitle:'Lei 13.869/2019'},
      p15:{num:15,title:'Lavagem de Dinheiro',subtitle:'Lei 9.613/1998'},
      p16:{num:16,title:'Crimes em Licitações e Contratos',subtitle:'CP, arts. 337-E a 337-P'},
      p17:{num:17,title:'Constituição Penal, Responsabilidade Penal da Pessoa Jurídica, Súmulas e Consolidação',subtitle:'CF, art. 5º; CF, art. 225, §3º; Lei 9.605/1998; súmulas STF/STJ'}
    };
    Object.keys(meta).forEach(id=>{
      const target=by(id), base=src[id];
      if(!target||!base)return;
      const next={...base,id,num:meta[id].num,title:meta[id].title,subtitle:meta[id].subtitle};
      Object.keys(target).forEach(k=>delete target[k]);
      Object.assign(target,next);
    });
    try{
      if(typeof PENAL_ANKI!=='undefined'){
        PENAL_ANKI.p13=src.p13.ankiDeck||PENAL_ANKI.p13;
        PENAL_ANKI.p14=src.p14.ankiDeck||PENAL_ANKI.p14;
        PENAL_ANKI.p15=src.p15.ankiDeck||PENAL_ANKI.p15;
        PENAL_ANKI.p16=src.p16.ankiDeck||PENAL_ANKI.p16;
        PENAL_ANKI.p17=src.p17.ankiDeck||PENAL_ANKI.p17;
      }
    }catch(_){}
    if(typeof renderSubjects==='function')renderSubjects();
    global.__penalM13M17CanonicalRemapApplied=true;
    return true;
  }catch(err){
    console.error('[Penal M13-M17 remap]',err);
    return false;
  }
}
if(!apply())setTimeout(()=>{if(!apply())setTimeout(apply,120)},60);
})(window);
