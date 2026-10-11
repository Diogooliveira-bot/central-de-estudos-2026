/* Leitor Universal Base Completa — camada de apresentação, sem migração de dados. */
(function (global) {
  'use strict';
  if (global.CentralUniversalReader) return;
  const SHEETS = [
    '.bc-native-reader-overlay .bc-native-article',
    '.cf-native-reader article',
    '.central-reading-active-topic .ct-body',
    '.central-reading-active-topic .cf-theory-text',
    '.cpc-apostila-content',
    '.cpc-apostila-topic',
    '.cpp-source',
    '.ptn-session-body',
    '.cv-reader article',
    '.pen-theory-scroll article',
    '.pen-theory-scroll main',
    '.pen-theory-scroll .pen-m1-book',
    '.pen-theory-scroll .pen-m2-book',
    'body.bc-universal-standalone main'
  ].join(',');
  const EXCLUDE = 'textarea,input,code,[contenteditable="true"],.cm-editor,.monaco-editor,.ace_editor,.question,.questao,.fixation-question';
  const mode = /\/modules\/trabalho\/base-completa\/m\d+\.html$/i.test(location.pathname) ? 'standalone' : 'central';
  function heading(line) {
    const s = line.trim();
    if (!s || s.length > 125) return 0;
    if (/^\d{1,2}(?:\.\d{1,2}){0,3}[.)]?\s+\S/.test(s)) return (s.match(/\./g) || []).length >= 2 ? 3 : 2;
    if (/^(?:INTRODUÇÃO|CONCEITO|FUNDAMENTOS?|RESUMO|TEORIA|REVISÃO|JURISPRUDÊNCIA|QUESTÕES|CONCLUSÃO|PEGADINHAS|VISÃO GERAL|ATENÇÃO)(?:\s|:|$)/i.test(s) && s.length < 90) return 2;
    if (s.length >= 8 && s.length < 85 && /[A-ZÁÉÍÓÚÃÕÇ]/.test(s) &&
        s === s.toLocaleUpperCase('pt-BR') && !/[.!?;]$/.test(s)) return 3;
    return 0;
  }
  function legal(line) {
    return /^\s*(?:Art\.\s*\d|§\s*\d|Súmula\s*\d|Tema\s*\d|(?:STF|STJ|TST)\s*[:—-]|(?:ATENÇÃO|PEGADINHA|IMPORTANTE|LEI SECA)\s*[:—-])/i.test(line);
  }
  function bullet(line) {
    return /^\s*(?:[•●▪◦*\-]\s+|[a-z]\)\s+|(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+)/i.test(line);
  }
  /* Mantém o <pre> original, oculto apenas quando uma projeção semântica segura é criada.
     Nenhuma palavra é apagada ou gravada no armazenamento do aluno. */
  function formatRaw(pre) {
    if (!pre || pre.dataset.bcUniversalDone || pre.querySelector('code') ||
        pre.closest(EXCLUDE + ',.bc-universal-projection')) return false;
    const raw = pre.textContent || '';
    const lines = raw.split(/\r\n|\n|\r/);
    if (raw.length < 450 || lines.length < 8 || lines.filter(x => x.trim()).length < 5) return false;
    const projection = document.createElement('section');
    projection.className = 'bc-universal-projection';
    projection.setAttribute('aria-label', 'Texto da apostila formatado para leitura');
    const add = (tag, text, className) => {
      const el = document.createElement(tag);
      if (className) el.className = className;
      el.textContent = text;
      projection.appendChild(el);
      return el;
    };
    let para = [], list = null;
    const flush = () => { if (para.length) add('p', para.join('\n')); para=[]; list=null; };
    for (const line of lines) {
      if (!line.trim()) { flush(); continue; }
      const level = heading(line);
      if (level) { flush(); add('h' + level, line); continue; }
      if (bullet(line)) {
        if (para.length) flush();
        if (!list) { list=document.createElement('ul'); projection.appendChild(list); }
        const li=document.createElement('li'); li.textContent=line; list.appendChild(li); continue;
      }
      if (legal(line)) { flush(); add('p', line, 'bc-universal-law'); continue; }
      list=null;
      para.push(line);
    }
    flush();
    if (!projection.children.length) return false;
    pre.dataset.bcUniversalDone='1';
    pre.classList.add('bc-universal-raw-source');
    pre.hidden=true;
    pre.after(projection);
    projection.dataset.sourceLength=String(raw.length);
    return true;
  }
  function enhance(sheet) {
    if (!(sheet instanceof Element) || sheet.matches(EXCLUDE) ||
        sheet.closest('.visual-editor-v1,.block-editor,.bc-universal-projection')) return;
    if (!sheet.classList.contains('bc-universal-sheet')) sheet.classList.add('bc-universal-sheet');
    sheet.querySelectorAll('pre').forEach(formatRaw);
  }
  function controls(overlay) {
    if (!(overlay instanceof Element) || !overlay.classList.contains('bc-native-reader-overlay')) return;
    const toc=overlay.querySelector('.bc-native-toc'),tools=overlay.querySelector('.bc-native-reader-tools');
    if (!toc || !tools || tools.querySelector('[data-bc-universal-index]') ||
        tools.querySelector('.bc-reading-appearance-controls')) return;
    const button=document.createElement('button');
    button.type='button'; button.className='bc-universal-index';
    button.dataset.bcUniversalIndex='1'; button.textContent='☰ Sumário';
    button.setAttribute('aria-label','Mostrar ou ocultar o índice de capítulos');
    button.setAttribute('aria-expanded','false');
    button.addEventListener('click',() => {
      const open=overlay.classList.toggle('bc-universal-chapters-open');
      button.setAttribute('aria-expanded',String(open));
    });
    tools.appendChild(button);
  }
  function normalizeStandalone() {
    if (mode!=='standalone' || document.body.querySelector('main')) return;
    const nodes=Array.from(document.body.childNodes).filter(node=>{
      if(node.nodeType===3) return Boolean(node.textContent.trim());
      if(node.nodeType!==1 || node.matches('script,style,link,.dt-central-bar,.dt-tec-panel,nav[aria-label="Ferramentas do módulo"]')) return false;
      return true;
    });
    if (!nodes.length) return;
    const main=document.createElement('main');
    main.className='bc-universal-standalone-content';
    nodes[0].before(main);
    nodes.forEach(node=>main.appendChild(node));
  }
  function scan(root) {
    if (!(root instanceof Element || root instanceof Document)) return;
    if (mode === 'standalone' && document.body) {document.body.classList.add('bc-universal-standalone');normalizeStandalone();}
    if (root.matches && root.matches(SHEETS)) enhance(root);
    root.querySelectorAll(SHEETS).forEach(enhance);
    if (root.matches && root.matches('.bc-native-reader-overlay')) controls(root);
    root.querySelectorAll('.bc-native-reader-overlay').forEach(controls);
  }
  let scheduled=false;
  const pending=new Set();
  function schedule(root) {
    pending.add(root);
    if (scheduled) return;
    scheduled=true;
    requestAnimationFrame(() => {
      scheduled=false;
      const roots=Array.from(pending); pending.clear();
      roots.forEach(scan);
    });
  }
  function boot() {
    scan(document);
    new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType===1) schedule(node);
        }
      }
    }).observe(document.body,{childList:true,subtree:true});
  }
  global.CentralUniversalReader=Object.freeze({scan,enhance,formatRaw,heading,legal,bullet});
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})(window);
