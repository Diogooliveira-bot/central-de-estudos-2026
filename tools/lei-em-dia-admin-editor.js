
/* Lei em Dia — correções compartilhadas e edição estritamente administrativa. */
const adminEditor={canEdit:false,revisions:{},moduleOverrides:{},original:{},open:null,busy:false,loadError:''};
function editorOptions(items,selected,allowEmpty=false){
 return (allowEmpty?'<option value="">Preservar vínculos existentes</option>':'')+
 items.map(item=>'<option value="'+esc(item.id)+'"'+(selected===item.id?' selected':'')+'>'+esc(item.label)+'</option>').join('');
}
function editorTopics(discipline){return (TOPICS_BY_DISCIPLINE[discipline]||[]).map(t=>({id:t.id,label:t.label}))}
function editorModules(discipline){return LAW_MODULE_LIST.filter(m=>m.discipline===discipline).map(m=>({id:m.id,label:(m.number?'M'+String(m.number).padStart(2,'0')+' — ':'')+m.title}))}
function editorSubtopics(discipline,topicId){
 const topic=(TOPICS_BY_DISCIPLINE[discipline]||[]).find(t=>t.id===topicId);
 return [...new Set(topic?.subtopics||[])].map(s=>({id:s,label:s}));
}
function editorNotice(message){
 const el=document.getElementById('admin-editor-status');
 if(el){el.textContent=message;el.hidden=!message}
}
function applyQuestionEdit(article,data){
 if(!data||typeof data!=='object'||typeof data.statement!=='string'||typeof data.answer!=='boolean'||typeof data.explanation!=='string')return;
 if(typeof data.discipline==='string'&&typeof data.topicId==='string'&&typeof data.subtopic==='string'&&typeof data.moduleId==='string'){
  const newDiscipline=data.discipline;
  const validTopic=(TOPICS_BY_DISCIPLINE[newDiscipline]||[]).some(t=>t.id===data.topicId);
  const validModule=!data.moduleId||LAW_MODULE_LIST.some(m=>m.id===data.moduleId&&m.discipline===newDiscipline);
  if(DISCIPLINES[newDiscipline]&&validTopic&&validModule){
   if(!adminEditor.original[article.id]){
    adminEditor.original[article.id]={
     discipline:article.discipline,
     moduleIds:LAW_MODULE_LIST.filter(m=>LAW_MODULE_QUESTIONS.get(m.id)?.has(article.id)).map(m=>m.id)
    };
   }
   const base=adminEditor.original[article.id];
   for(const set of LAW_MODULE_QUESTIONS.values())set.delete(article.id);
   if(data.moduleId)LAW_MODULE_QUESTIONS.get(data.moduleId)?.add(article.id);
   else if(newDiscipline===base.discipline){
    for(const id of base.moduleIds)LAW_MODULE_QUESTIONS.get(id)?.add(article.id);
   }
   article.discipline=newDiscipline;
   article.topicId=data.topicId;
   article.subtopic=data.subtopic;
   adminEditor.moduleOverrides[article.id]=data.moduleId;
  }
 }
 Object.assign(article.question,{statement:data.statement,explanation:data.explanation,answer:data.answer});
}
async function loadAdminEdits(){
 if(typeof fetch!=='function')return;
 try{
  const response=await fetch('/api/lei-em-dia-edits',{credentials:'same-origin',cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const body=await response.json();
  adminEditor.canEdit=body.canEdit===true;
  for(const row of body.edits||[]){
   const article=DATA.find(a=>a.id===row.question_id);
   if(!article||!row.data)continue;
   applyQuestionEdit(article,row.data);
   adminEditor.revisions[row.question_id]=Number(row.revision)||0;
  }
  adminEditor.loadError='';
  render();
 }catch(e){adminEditor.loadError='As correções online estão temporariamente indisponíveis.';console.warn(adminEditor.loadError,e);render()}
}
function editQuestion(id){
 if(!adminEditor.canEdit||adminEditor.busy)return;
 adminEditor.open=id;
 render();
}
function cancelQuestionEdit(){
 if(adminEditor.busy)return;
 adminEditor.open=null;
 render();
}
function updateEditorDiscipline(value){
 const article=DATA.find(a=>a.id===adminEditor.open);if(!article||!DISCIPLINES[value])return;
 const topic=document.getElementById('admin-topic');
 const topics=editorTopics(value);
 topic.innerHTML=editorOptions(topics,'');
 updateEditorTopic();
 const modules=editorModules(value);
 const moduleEl=document.getElementById('admin-module');
 const changed=value!==article.discipline;
 moduleEl.innerHTML=changed?'<option value="" selected disabled>Selecione o módulo de destino</option>'+editorOptions(modules,''):editorOptions(modules,adminEditor.moduleOverrides[article.id]||'',true);
 moduleEl.required=changed;
}
function updateEditorTopic(){
 const discipline=document.getElementById('admin-discipline').value;
 const topic=document.getElementById('admin-topic').value;
 document.getElementById('admin-subtopic').innerHTML=editorOptions(editorSubtopics(discipline,topic),'');
}
function editForm(article){
 if(!adminEditor.canEdit||adminEditor.open!==article.id)return '';
 const disciplines=Object.values(DISCIPLINES).map(d=>({id:d.id,label:d.name||d.law}));
 const topics=editorTopics(article.discipline);
 if(!topics.some(t=>t.id===article.topicId))topics.unshift({id:article.topicId,label:article.topicId+' (atual)'});
 const subtopics=editorSubtopics(article.discipline,article.topicId);
 if(!subtopics.some(t=>t.id===article.subtopic))subtopics.unshift({id:article.subtopic,label:article.subtopic+' (atual)'});
 const modules=editorModules(article.discipline);
 const moduleId=adminEditor.moduleOverrides[article.id]||'';
 return '<section class="lei-admin-editor" aria-label="Edição administrativa da questão">'+
 '<h3>✎ Editar questão</h3><p class="editor-helper">Somente o administrador pode salvar. As correções ficam disponíveis para todos os alunos.</p>'+
 '<label>Enunciado<textarea id="admin-statement" maxlength="20000">'+esc(article.question.statement)+'</textarea></label>'+
 '<label>Gabarito<select id="admin-answer"><option value="true" '+(article.question.answer===true?'selected':'')+'>Certo</option><option value="false" '+(article.question.answer===false?'selected':'')+'>Errado</option></select></label>'+
 '<label>Comentário / explicação<textarea id="admin-explanation" maxlength="30000">'+esc(article.question.explanation||'')+'</textarea></label>'+
 '<div class="editor-grid"><label>Disciplina<select id="admin-discipline" onchange="updateEditorDiscipline(this.value)">'+editorOptions(disciplines,article.discipline)+'</select></label>'+
 '<label>Lei ou assunto<select id="admin-topic" onchange="updateEditorTopic()">'+editorOptions(topics,article.topicId)+'</select></label>'+
 '<label>Subassunto<select id="admin-subtopic">'+editorOptions(subtopics,article.subtopic)+'</select></label>'+
 '<label>Módulo da Central<select id="admin-module">'+editorOptions(modules,moduleId,true)+'</select></label></div>'+
 '<p class="editor-helper">Ao mudar de disciplina, escolha também o módulo de destino. O histórico das tentativas anteriores permanece registrado sem recalcular acertos.</p>'+
 '<p id="admin-editor-status" class="editor-error" role="alert" hidden></p>'+
 '<div class="editor-actions"><button type="button" onclick="cancelQuestionEdit()">Cancelar</button><button type="button" id="admin-save" onclick="saveQuestionEdit('+JSON.stringify(article.id).replace(/"/g,'&quot;')+')">Salvar alterações</button></div></section>';
}
async function saveQuestionEdit(id){
 if(!adminEditor.canEdit||adminEditor.busy||adminEditor.open!==id)return;
 const article=DATA.find(a=>a.id===id);if(!article)return;
 const val=name=>document.getElementById(name)?.value||'';
 const data={statement:val('admin-statement').trim(),answer:val('admin-answer')==='true',
 explanation:val('admin-explanation').trim(),discipline:val('admin-discipline'),topicId:val('admin-topic'),
 subtopic:val('admin-subtopic'),moduleId:val('admin-module')};
 if(data.statement.length<10)return editorNotice('O enunciado precisa ter pelo menos 10 caracteres.');
 if(!data.subtopic)return editorNotice('Selecione um subassunto.');
 if(data.discipline!==article.discipline&&!data.moduleId)return editorNotice('Escolha o módulo de destino da nova disciplina.');
 if(data.moduleId&&!LAW_MODULE_LIST.some(m=>m.id===data.moduleId&&m.discipline===data.discipline))return editorNotice('Módulo incompatível com a disciplina.');
 adminEditor.busy=true;
 const save=document.getElementById('admin-save');if(save)save.disabled=true;
 editorNotice('');
 try{
  const response=await fetch('/api/lei-em-dia-edits',{method:'PUT',credentials:'same-origin',
   headers:{'Content-Type':'application/json'},body:JSON.stringify({id,data,revision:adminEditor.revisions[id]||0})});
  const result=await response.json();
  if(!response.ok)throw Error(result.error||'Falha ao salvar');
  applyQuestionEdit(article,data);
  adminEditor.revisions[id]=result.revision;
  adminEditor.open=null;
  // A classificação pode mudar o caderno atual; retorna aos filtros sem apagar progresso.
  if(data.discipline!==saved.preferences.discipline){
   ui.selectedModules.clear();ui.selectedTopics.clear();ui.selectedSubtopics.clear();
   ui.articleIndex=0;ui.choice=null;ui.screen='filters';
   saved.preferences.discipline=data.discipline;ui.discPicked=true;save();
  }
  render();
 }catch(e){editorNotice(e.message||'Não foi possível salvar. Tente novamente.')}
 finally{adminEditor.busy=false;if(save&&save.isConnected)save.disabled=false}
}
