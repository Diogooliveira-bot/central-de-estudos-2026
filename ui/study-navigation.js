/* Keep the study destination when opening tools or following a saved link. */
(function () {
  'use strict';
  if (window.CentralStudyNavigation) return;
  const moduleSelector = '.topic-item,.cf-module,.civil-module,.cpp-mod';
  const attributes = ['data-uid','data-ptn-module','data-civil-analista','data-civil','data-cf','data-penal','data-cpc','data-cpp-num'];
  const views = {home:'homeView',agenda:'agendaView',disciplines:'disciplinesView',tec:'tecCadernosView',performance:'performanceView'};
  let sourceModule = null;
  function moduleId(module) {
    return attributes.map(name => module.getAttribute(name)).find(Boolean) || '';
  }
  function rememberReturn() {
    const home = document.getElementById('homeView');
    const context = {};
    if (home && !home.classList.contains('hidden')) {
      const module = sourceModule && sourceModule.isConnected ? sourceModule : null;
      const subject = module?.closest('.subject') || document.querySelector('.subject.open');
      if (subject) context.subject = subject.dataset.id;
      if (module) context.module = moduleId(module);
    } else {
      context.view = Object.keys(views).find(key => {
        const el = document.getElementById(views[key]);
        return el && !el.classList.contains('hidden');
      }) || 'home';
    }
    try { sessionStorage.setItem('central-v6:tool-return', JSON.stringify(context)); } catch (_) {}
  }
  document.addEventListener('click', event => {
    sourceModule = event.target.closest(moduleSelector);
  }, true);
  function openContext(context) {
    if (!context || typeof context !== 'object') return;
    const subject = typeof context.subject === 'string' && (typeof SUBJECTS !== 'undefined' ? SUBJECTS : []).find(s => s.id === context.subject);
    if (subject) {
      if(subject.id==='pt'&&context.module&&typeof window.openPtCurrentModule==='function')return window.openPtCurrentModule(context.module);
      window.jumpSubject(subject.id);
      if (context.module) {
        // Rendering and the subject's native enhancement finish before opening its module.
        let attempts = 0;
        function openModule() {
          const root = Array.from(document.querySelectorAll('.subject')).find(el => el.dataset.id === subject.id);
          const module = root && Array.from(root.querySelectorAll(moduleSelector)).find(el => moduleId(el) === context.module);
          if (!module && ++attempts < 20) { setTimeout(openModule, 100); return; }
          if (!module) return;
          if (!module.classList.contains('open')) {
            const head = module.querySelector('.open-topic,.cf-module-head,.civil-module-head,.cpp-mod-head');
            head?.click();
          }
          setTimeout(() => module.scrollIntoView({block:'start',behavior:'auto'}), 100);
        }
        setTimeout(openModule, 100);
      }
      return;
    }
    const actions = {
      agenda: () => window.CentralAgenda.open(),
      disciplines: () => window.centralHardOpen('disciplines', document.querySelector('[data-central-native="disciplines"]')),
      tec: () => window.openTecCadernos(document.querySelector('.nav button[onclick*="tec-cadernos"]')),
      performance: () => window.openPerformance(document.querySelector('.nav button[onclick*="performance"]')),
      home: () => window.openHome()
    };
    actions[context.view]?.();
  }
  function start() {
    const params = new URLSearchParams(location.search);
    const topic = params.get('study');
    if (topic && typeof window.topicByUid === 'function') {
      const found = window.topicByUid(topic);
      if (found) {
        const index = found.s.topics.indexOf(found.t) + 1;
        const native = {cf:'openCfLast',cpc:'openCpcLast',penal:'openPenalLast'}[found.s.id];
        if (native && typeof window[native] === 'function') window[native](({cf:'w',cpc:'cpc',penal:'p'}[found.s.id]) + index);
        else if (found.s.id === 'pt' && typeof window.openPtCurrentModule === 'function') window.openPtCurrentModule(found.t.uid.replace('pt-auto24-',''));
        else if (found.s.id === 'civil') openContext({subject:'civil',module:topic.replace(/-analista$/, '')});
        else if (found.s.id === 'cpp') openContext({subject:'cpp',module:String(index)});
        else openContext({subject:found.s.id,module:topic});
        return;
      }
    }
    if(topic&&/^pt-/.test(topic)&&typeof window.openPtNativeLast==='function')return window.openPtNativeLast();
    openContext({subject:params.get('subject'),module:params.get('module'),view:params.get('view')});
  }
  window.CentralStudyNavigation = {rememberReturn,openContext};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
