(function (global) {
  'use strict';
  let draft, host, creating;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slug = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
  const input = (label, field, value, type='text') => `<label class="contest-field">${esc(label)}<input type="${type}" data-field="${field}" value="${esc(value)}"></label>`;
  const option = (value, current, text) => `<option value="${esc(value)}" ${value===current?'selected':''}>${esc(text)}</option>`;
  const selected = (value, choices, field) => `<select data-field="${field}">${choices.map(([id,label])=>option(id,value,label)).join('')}</select>`;
  const subjectChoices = () => Object.entries(global.CentralStudyObjectiveCatalog?.subjects || {}).map(([id,entry])=>[id,entry.name]);
  const status = (topic) => {
    const accepted=(topic.links||[]).filter((link)=>link.status==='approved');
    if (accepted.some((link)=>link.scope==='full') && !topic.supplement || accepted.length && topic.supplement?.status==='approved' && topic.supplement?.contentRef) return 'Completa';
    if (accepted.length || topic.supplement?.status==='approved') return 'Parcial';
    return 'Sem cobertura';
  };
  function render() {
    host.innerHTML=`<main class="contest-catalog-shell"><button type="button" class="contest-detail-back" data-contest-back>← Voltar ao catálogo</button><section class="contest-admin-panel"><h1>${creating?'Novo concurso':'Editar concurso'}</h1><p>Os assuntos e vínculos são conferidos individualmente. Sugestões não contam como cobertura.</p>
      <div class="contest-form-grid">${input('Identificador', 'id',draft.id)}${input('Nome','name',draft.name)}${input('Órgão','organ',draft.organ)}${input('Local (UF ou BR)','state',draft.state)}${input('Esfera','sphere',draft.sphere)}${input('Ano','year',draft.year,'number')}${input('Banca','board',draft.board)}${input('Número do edital','noticeNumber',draft.noticeNumber)}${input('Data do edital','noticeDate',draft.noticeDate,'date')}${input('Última conferência','lastVerified',draft.lastVerified,'date')}<label class="contest-field">Modelo de questões${selected(draft.questionMode||'multiple-choice',[['multiple-choice','Múltipla escolha'],['right-wrong','Certo/errado']],'questionMode')}</label><label class="contest-field">Situação${selected(draft.status,[['previsto','Previsto'],['publicado','Edital publicado'],['encerrado','Encerrado']],'status')}</label><label class="contest-field">Visibilidade${selected(String(draft.active),[['false','Rascunho inativo'],['true','Visível no catálogo']],'active')}</label></div>
      <label class="contest-field">Resumo<textarea data-field="summary">${esc(draft.summary)}</textarea></label>
      <h2>Fontes oficiais</h2><div class="contest-form-list">${(draft.sources||[]).map((source,i)=>`<div class="contest-form-row">${input('Título',`sources.${i}.title`,source.title)}${input('URL HTTPS',`sources.${i}.url`,source.url,'url')}<button type="button" data-remove-source="${i}">Remover</button></div>`).join('')}</div><button type="button" data-add-source>Adicionar fonte</button>
      <h2>Cargos</h2><div class="contest-form-list">${(draft.cargos||[]).map((cargo,i)=>`<div class="contest-form-row">${input('Cargo',`cargos.${i}.name`,cargo.name)}${input('Escolaridade',`cargos.${i}.education`,cargo.education)}<button type="button" data-remove-cargo="${i}">Remover</button></div>`).join('')}</div><button type="button" data-add-cargo>Adicionar cargo</button>
      <h2>Disciplinas e assuntos</h2><div class="contest-form-list">${(draft.subjects||[]).map((subject,i)=>`<section class="contest-form-subject"><div class="contest-form-row">${input('Disciplina',`subjects.${i}.name`,subject.name)}<label class="contest-field">Biblioteca${selected(subject.centralId||'',[['','Sem referência'],...subjectChoices()],`subjects.${i}.centralId`)}</label><button type="button" data-remove-subject="${i}">Remover</button></div><p>${(subject.syllabus||[]).length} assuntos verticalizados · cobertura calculada após aprovação</p><div class="contest-form-list">${(subject.syllabus||[]).map((topic,j)=>`<div class="contest-form-topic"><div class="contest-form-row">${input('Assunto do edital',`subjects.${i}.syllabus.${j}.title`,topic.title)}<b>${status(topic)}</b><button type="button" data-remove-topic="${i}.${j}">Remover</button></div>${(topic.links||[]).map((link,k)=>`<div class="contest-form-link"><span>${esc(link.subjectId)} / ${esc(link.moduleId)}${link.chapterId?' / '+esc(link.chapterId):''} · ${esc(link.status)}</span><label>Capítulo existente (ID) <input data-field="subjects.${i}.syllabus.${j}.links.${k}.chapterId" value="${esc(link.chapterId||'')}"></label><label>Conferência pedagógica <input data-field="subjects.${i}.syllabus.${j}.links.${k}.evidence" value="${esc(link.evidence||'')}" placeholder="Quais subitens o material cobre?"></label><label>Alcance ${selected(link.scope,[['partial','Parcial'],['full','Integral']],`subjects.${i}.syllabus.${j}.links.${k}.scope`)}</label><button type="button" data-review-link="${i}.${j}.${k}.approved">Aprovar</button><button type="button" data-review-link="${i}.${j}.${k}.rejected">Rejeitar</button><button type="button" data-review-link="${i}.${j}.${k}.suggested">Reabrir</button></div>`).join('')}${input('Complementação necessária',`subjects.${i}.syllabus.${j}.supplement.title`,topic.supplement?.title||'')}${`<div class="contest-form-row">${input('Conferência da complementação',`subjects.${i}.syllabus.${j}.supplement.evidence`,topic.supplement?.evidence||'')}${input('Arquivo /content/... da complementação',`subjects.${i}.syllabus.${j}.supplement.contentRef`,topic.supplement?.contentRef||'')}<button type="button" data-review-supplement="${i}.${j}">${topic.supplement?.status==='approved'?'Voltar a pendente':'Aprovar complementação'}</button></div>`}<button type="button" data-suggest-topic="${i}.${j}">Sugerir módulos existentes</button><label class="contest-field">Módulo existente<select data-manual-module="${i}.${j}">${(global.CentralModuleCatalog?.[subject.centralId]||[]).map((module)=>option(`${subject.centralId}-${String(module.number).padStart(2,'0')}`,'',`${String(module.number).padStart(2,'0')} · ${module.title}`)).join('')}</select></label><button type="button" data-add-link="${i}.${j}">Vincular manualmente</button></div>`).join('')}</div><button type="button" data-add-topic="${i}">Adicionar assunto</button><button type="button" data-import-target="${i}">Usar esta disciplina para o PDF</button></section>`).join('')}</div><button type="button" data-add-subject>Adicionar disciplina</button>
      <h2>Importação assistida de edital</h2><p>O PDF é lido neste aparelho. Confira o trecho do conteúdo programático, ajuste as linhas e só então adicione os assuntos. PDF digitalizado sem texto requer transcrição.</p><input type="file" accept="application/pdf,.pdf" data-pdf aria-label="Selecionar PDF oficial"><p data-pdf-status role="status"></p><label class="contest-field">Linhas para conferir<textarea data-pdf-lines placeholder="Uma linha por assunto do edital"></textarea></label><button type="button" data-import-lines>Adicionar linhas à disciplina selecionada</button><p data-import-feedback role="status"></p>
      <div class="contest-admin-actions"><button type="button" data-contest-back>Cancelar</button><button type="button" class="contest-admin-save" data-contest-save="${creating?'create':'update'}">Salvar rascunho</button></div></section></main>`;
  }
  function field(event) {
    const path=event.target.dataset.field?.split('.'); if (!path) return;
    let cursor=draft;
    for(const step of path.slice(0,-1)) {
      if(step==='supplement' && !cursor.supplement) cursor.supplement={title:'',status:'pending',evidence:'',contentRef:''};
      cursor=cursor[step]; if(!cursor)return;
    }
    let value=event.target.value;
    if(path.at(-1)==='active') value=value==='true';
    if(path.at(-1)==='year') value=Number(value);
    cursor[path.at(-1)]=value;
    if(path.includes('supplement') && path.at(-1)==='title' && !value) cursor.status='pending';
  }
  function refresh() { render(); }
  function edit(event) {
    const target=event.target;
    if(target.matches('[data-add-source]')) { draft.sources.push({type:'oficial',title:'',url:'https://'}); return refresh(); }
    if(target.matches('[data-add-cargo]')) { draft.cargos.push({name:'',education:''}); return refresh(); }
    if(target.matches('[data-add-subject]')) { draft.subjects.push({id:`disciplina-${Date.now()}`,name:'',centralId:null,coverage:'missing',topics:[],weight:1,moduleIds:[],syllabus:[]}); return refresh(); }
    for(const [attr,key] of [['remove-source','sources'],['remove-cargo','cargos'],['remove-subject','subjects']]) if(target.dataset[attr.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())] !== undefined) { draft[key].splice(Number(target.dataset[attr.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]),1); return refresh(); }
    const index=Number(target.dataset.addTopic);
    if(Number.isInteger(index) && target.dataset.addTopic!==undefined) { const subject=draft.subjects[index]; subject.syllabus ||= []; subject.syllabus.push({id:`assunto-${Date.now()}`,title:'Novo assunto',links:[],supplement:null}); return refresh(); }
    if(target.dataset.removeTopic) { const [i,j]=target.dataset.removeTopic.split('.').map(Number); draft.subjects[i].syllabus.splice(j,1); return refresh(); }
    if(target.dataset.importTarget!==undefined) { host.dataset.pdfTarget=target.dataset.importTarget; host.querySelector('[data-import-feedback]').textContent=`Disciplina selecionada: ${draft.subjects[Number(host.dataset.pdfTarget)].name}`; return; }
    if(target.dataset.addLink) { const [i,j]=target.dataset.addLink.split('.').map(Number); const subject=draft.subjects[i]; if(!subject.centralId) return message('Escolha uma disciplina da biblioteca.'); const moduleId=target.parentElement.querySelector(`[data-manual-module="${i}.${j}"]`)?.value; if(!moduleId)return message('Nenhum módulo verificado disponível nesta disciplina.'); subject.syllabus[j].links.push({subjectId:subject.centralId,moduleId:moduleId.trim(),chapterId:null,status:'suggested',scope:'partial',evidence:''}); return refresh(); }
    if(target.dataset.suggestTopic) { const [i,j]=target.dataset.suggestTopic.split('.').map(Number); const subject=draft.subjects[i], topic=subject.syllabus[j]; const modules=global.CentralModuleCatalog?.[subject.centralId] || []; const words=(value)=>new Set(slug(value).split('-').filter((w)=>w.length>3)); const requested=words(topic.title); const ranked=modules.map((module)=>({module,score:[...requested].filter((word)=>words(module.title).has(word)).length})).filter((item)=>item.score>0).sort((a,b)=>b.score-a.score).slice(0,3); for(const {module} of ranked) { const moduleId=`${subject.centralId}-${String(module.number).padStart(2,'0')}`; if(!topic.links.some((link)=>link.moduleId===moduleId))topic.links.push({subjectId:subject.centralId,moduleId,chapterId:null,status:'suggested',scope:'partial',evidence:''}); } if(!ranked.length)return message('Nenhum módulo parecido encontrado. Cadastre uma referência manualmente após conferir.'); return refresh(); }
    if(target.dataset.reviewLink) { const [i,j,k,action]=target.dataset.reviewLink.split('.'); const link=draft.subjects[+i].syllabus[+j].links[+k]; if(action==='approved'&&!link.evidence.trim())return message('Descreva a conferência pedagógica antes de aprovar.'); link.status=action; return refresh(); }
    if(target.dataset.reviewSupplement) { const [i,j]=target.dataset.reviewSupplement.split('.').map(Number); const supplement=draft.subjects[i].syllabus[j].supplement; if(!supplement)return; if(supplement.status!=='approved'&&(!supplement.title||!supplement.evidence||!/^\/content\/[a-z0-9/_-]+\.(?:js|html|pdf)$/i.test(supplement.contentRef||'')))return message('Informe título, conferência e arquivo /content/ da complementação.'); supplement.status=supplement.status==='approved'?'pending':'approved'; return refresh(); }
    if(target.matches('[data-import-lines]')) { const lines=host.querySelector('[data-pdf-lines]').value.split(/\r?\n/).map((line)=>line.trim()).filter((line)=>line.length>5); const subject=draft.subjects[Number(host.dataset.pdfTarget)]; if(!subject)return message('Escolha primeiro a disciplina para receber as linhas.'); if(subject.syllabus.length+lines.length>300)return message('Limite de 300 assuntos por disciplina.'); const used=new Set(subject.syllabus.map((topic)=>topic.title.toLowerCase())); for(const line of lines)if(!used.has(line.toLowerCase())){subject.syllabus.push({id:`assunto-${Date.now()}-${subject.syllabus.length}`,title:line.slice(0,500),links:[],supplement:null});used.add(line.toLowerCase());} refresh(); return message('Linhas adicionadas para revisão. Nenhum vínculo foi aprovado automaticamente.'); }
  }
  function message(text) { const node=host.querySelector('[data-import-feedback]')||host.querySelector('[data-pdf-status]'); if(node)node.textContent=text; }
  async function pdf(event) {
    const file=event.target.files?.[0]; if(!file)return;
    if(file.type!=='application/pdf' && !file.name.toLowerCase().endsWith('.pdf'))return message('Selecione um PDF.');
    if(file.size>15*1024*1024)return message('PDF acima de 15 MB.');
    const status=host.querySelector('[data-pdf-status]'); status.textContent='Extraindo texto do PDF neste aparelho…';
    try {
      const pdfjs=await import('/vendor/pdfjs/pdf.min.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc='/vendor/pdfjs/pdf.worker.min.mjs';
      const document=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
      if(document.numPages>150)throw new Error('O PDF excede 150 páginas.');
      const pages=[]; for(let page=1;page<=document.numPages;page++){ const text=await (await document.getPage(page)).getTextContent(); pages.push(text.items.map((item)=>item.str+(item.hasEOL?'\n':' ')).join('')); }
      host.querySelector('[data-pdf-lines]').value=pages.join('\n').slice(0,180000);
      status.textContent=`${document.numPages} páginas lidas. Selecione e organize apenas os assuntos do edital, uma linha por assunto.`;
      await document.destroy();
    } catch (error) { status.textContent='Não foi possível extrair o texto. Use um PDF com camada de texto ou transcreva os assuntos. '+String(error.message||''); }
  }
  global.CentralContestAdminForm={
    open(overlay,item,isNew){host=overlay;creating=isNew;draft=JSON.parse(JSON.stringify(item));draft.subjects ||= [];draft.cargos ||= [];draft.sources ||= [];render();host.querySelector('[data-field="id"]').readOnly=!isNew;},
    value(){return draft;},
  };
  document.addEventListener('input',(event)=>{if(host && !host.hidden && event.target.closest('.contest-admin-panel') && event.target.dataset.field)field(event);});
  document.addEventListener('change',(event)=>{if(host && !host.hidden && event.target.matches('[data-pdf]'))pdf(event);else if(host && !host.hidden && event.target.dataset.field)field(event);});
  document.addEventListener('click',(event)=>{if(host && !host.hidden && event.target.closest('.contest-admin-panel'))edit(event);});
})(window);
