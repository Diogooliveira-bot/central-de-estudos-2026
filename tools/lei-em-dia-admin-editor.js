
const adminEditor={canEdit:false,revisions:{},open:null,busy:false,error:''};
async function loadAdminEdits(){
 if(typeof fetch!=='function')return;
 try{
  const response=await fetch('/api/lei-em-dia-edits',{credentials:'same-origin',cache:'no-store'});
  if(!response.ok)return;
  const body=await response.json();
  adminEditor.canEdit=body.canEdit===true;
  for(const row of body.edits||[]){
   const article=DATA.find(a=>a.id===row.question_id);
   if(!article||!row.data)continue;
   Object.assign(article.question,row.data);
   adminEditor.revisions[row.question_id]=row.revision;
  }
  render();
 }catch(e){console.warn('Não foi possível carregar edições',e)}
}
function editQuestion(id){if(!adminEditor.canEdit)return;adminEditor.open=id;adminEditor.error='';render()}
function cancelQuestionEdit(){adminEditor.open=null;adminEditor.error='';render()}
function editForm(article){
 if(adminEditor.open!==article.id||!adminEditor.canEdit)return '';
 return '<section class="lei-admin-editor"><h3>Editar questão · administrador</h3>'+
 '<label>Enunciado<textarea id="admin-statement">'+esc(article.question.statement)+'</textarea></label>'+
 '<label>Gabarito<select id="admin-answer"><option value="true" '+(article.question.answer===true?'selected':'')+'>Certo</option><option value="false" '+(article.question.answer===false?'selected':'')+'>Errado</option></select></label>'+
 '<label>Explicação<textarea id="admin-explanation">'+esc(article.question.explanation||'')+'</textarea></label>'+
 (adminEditor.error?'<p role="alert">'+esc(adminEditor.error)+'</p>':'')+
 '<div><button onclick="cancelQuestionEdit()">Cancelar</button><button onclick="saveQuestionEdit(\''+article.id+'\')" '+(adminEditor.busy?'disabled':'')+'>Salvar alterações</button></div></section>';
}
async function saveQuestionEdit(id){
 if(!adminEditor.canEdit||adminEditor.busy)return;
 const article=DATA.find(a=>a.id===id);if(!article)return;
 const data={statement:document.getElementById('admin-statement').value.trim(),answer:document.getElementById('admin-answer').value==='true',explanation:document.getElementById('admin-explanation').value.trim()};
 if(data.statement.length<10){adminEditor.error='O enunciado precisa ter pelo menos 10 caracteres.';render();return}
 adminEditor.busy=true;
 try{
  const response=await fetch('/api/lei-em-dia-edits',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,data,revision:adminEditor.revisions[id]||0})});
  const result=await response.json();
  if(!response.ok)throw Error(result.error||'Falha ao salvar');
  Object.assign(article.question,data);adminEditor.revisions[id]=result.revision;adminEditor.open=null;adminEditor.error='';
 }catch(e){adminEditor.error=e.message||'Erro ao salvar alterações'}
 finally{adminEditor.busy=false;render()}
}
