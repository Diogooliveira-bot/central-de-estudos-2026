(function(){
'use strict';
if(window.__centralQuestionStabilityPatch)return;
window.__centralQuestionStabilityPatch=true;

function normalizeAnswer(value){
  if(typeof value==='boolean'||typeof value==='number')return value;
  var s=String(value==null?'':value).trim().toLowerCase();
  if(['c','certo','correto','true','verdadeiro','v'].indexOf(s)>=0)return true;
  if(['e','errado','incorreto','false','falso','f'].indexOf(s)>=0)return false;
  return value;
}
function normalizeArticle(article){
  try{
    if(article&&article.question&&Object.prototype.hasOwnProperty.call(article.question,'answer')){
      article.question.answer=normalizeAnswer(article.question.answer);
    }
  }catch(_){}
  return article;
}
function wrapFunction(name,wrapper){
  var original=window[name];
  if(typeof original!=='function'||original.__centralWrapped)return false;
  var wrapped=wrapper(original);
  if(typeof wrapped!=='function')return false;
  wrapped.__centralWrapped=true;
  window[name]=wrapped;
  return true;
}
function wrapOldLeiSeca(){
  if(typeof window.visible!=='function'||typeof window.startStudy!=='function')return false;
  if(window.__centralOldLeiSecaStabilityWrapped)return true;
  window.__centralOldLeiSecaStabilityWrapped=true;
  var originalVisible=window.visible;
  var frozenList=null;

  window.visible=function(){
    return frozenList||originalVisible.apply(this,arguments);
  };

  wrapFunction('startStudy',function(originalStartStudy){
    return function(){
      try{
        var list=originalVisible.apply(this,arguments)||[];
        frozenList=list.map(normalizeArticle);
      }catch(_){frozenList=null}
      return originalStartStudy.apply(this,arguments);
    };
  });

  function clearFrozen(){frozenList=null}
  ['chooseDiscipline','chooseStatus','toggleTopic','toggleSubtopic','selectAllTopics','toggleAllSubtopics'].forEach(function(name){
    wrapFunction(name,function(original){
      return function(){clearFrozen();return original.apply(this,arguments)};
    });
  });
  wrapFunction('setScreen',function(original){
    return function(screen){
      if(screen!=='study')clearFrozen();
      return original.apply(this,arguments);
    };
  });
  wrapFunction('deleteQuestion',function(original){
    return function(id){
      if(Array.isArray(frozenList))frozenList=frozenList.filter(function(a){return !a||a.id!==id});
      return original.apply(this,arguments);
    };
  });
  wrapFunction('record',function(original){
    return function(article,value){
      normalizeArticle(article);
      return original.call(this,article,value);
    };
  });
  wrapFunction('feedback',function(original){
    return function(article,choice){
      normalizeArticle(article);
      return original.call(this,article,choice);
    };
  });
  return true;
}
function wrapAnswerDebounce(name){
  if(typeof window[name]!=='function'||window[name].__centralDebounced)return false;
  var original=window[name],previous=null,previousAt=0;
  var wrapped=function(){
    // Ignore apenas repeticoes identicas; uma nova alternativa ou questao
    // deve responder imediatamente, inclusive dentro de 250 ms.
    var args=Array.prototype.slice.call(arguments),signature;
    try{signature=JSON.stringify(args)}catch(_){signature=null}
    var now=Date.now();
    if(signature!==null&&signature===previous&&now-previousAt<250)return;
    previous=signature;previousAt=now;
    return original.apply(this,arguments);
  };
  wrapped.__centralDebounced=true;
  window[name]=wrapped;
  return true;
}
function wrapCurrentRuntimes(){
  ['answerCfQuestion','answerPenalQuestion','answerCpcQuestion','civil1Answer','civil2Answer','civil3Answer','civil4Answer','civil5Answer','civil6Answer','civil7Answer','civil8Answer','civil9Answer','civil10Answer','civil11Answer'].forEach(wrapAnswerDebounce);
}
function applyPatch(){
  wrapOldLeiSeca();
  wrapCurrentRuntimes();
}
applyPatch();
document.addEventListener('DOMContentLoaded',applyPatch);
setTimeout(applyPatch,100);
setTimeout(applyPatch,700);
setTimeout(applyPatch,1500);
})();
