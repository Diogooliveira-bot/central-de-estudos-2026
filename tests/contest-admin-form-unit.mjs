import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import * as pdfjs from '../vendor/pdfjs/pdf.min.mjs';
import { SHARED_MODULES } from '../lib/shared-module-catalog.js';

const code=fs.readFileSync(new URL('../ui/contest-admin-form.js',import.meta.url),'utf8');
test('formulário visual mantém sugestões pendentes até aprovação documentada', () => {
  const dom=new JSDOM('<!doctype html><body><div id="overlay"></div></body>',{url:'https://preview.example.test',runScripts:'outside-only'});
  const w=dom.window;
  w.CentralModuleCatalog={cf:[{number:2,title:'Direitos e garantias fundamentais'}]};
  w.CentralStudyObjectiveCatalog={subjects:{cf:{name:'Direito Constitucional'}}};
  w.eval(code);
  const overlay=w.document.getElementById('overlay');
  const data={id:'teste-2026',name:'Teste',organ:'Órgão',state:'CE',sphere:'Estadual',year:2026,status:'publicado',active:false,sources:[{title:'Edital',url:'https://example.org/edital'}],cargos:[],subjects:[{id:'cf-edital',name:'Constitucional',centralId:'cf',coverage:'missing',topics:[],weight:1,syllabus:[{id:'direitos',title:'Direitos fundamentais',links:[],supplement:null}]}]};
  w.CentralContestAdminForm.open(overlay,data,false);
  assert.equal(overlay.querySelector('#contestAdminJson'),null);
  assert.ok(overlay.querySelector('[data-pdf]'));
  overlay.querySelector('[data-suggest-topic="0.0"]').click();
  const draft=w.CentralContestAdminForm.value();
  assert.equal(draft.subjects[0].syllabus[0].links[0].moduleId,'cf-02');
  assert.equal(draft.subjects[0].syllabus[0].links[0].status,'suggested');
  overlay.querySelector('[data-review-link="0.0.0.approved"]').click();
  assert.equal(draft.subjects[0].syllabus[0].links[0].status,'suggested');
  const evidence=overlay.querySelector('[data-field="subjects.0.syllabus.0.links.0.evidence"]');
  evidence.value='Conferi os subitens e o capítulo em 22/11/2026.';
  evidence.dispatchEvent(new w.Event('input',{bubbles:true}));
  overlay.querySelector('[data-review-link="0.0.0.approved"]').click();
  assert.equal(draft.subjects[0].syllabus[0].links[0].status,'approved');
  assert.equal(data.subjects[0].syllabus[0].links.length,0,'o original não foi alterado antes de salvar');
  dom.window.close();
});

test('inventário administrativo permite escolher capítulo realmente existente', async () => {
  const dom=new JSDOM('<!doctype html><body><div id="overlay"></div></body>',{url:'https://preview.example.test',runScripts:'outside-only'});
  const w=dom.window;
  w.fetch=async()=>({ok:true,json:async()=>({modules:SHARED_MODULES})});
  w.CentralModuleCatalog={info:[{number:9,title:'Internet, Navegadores e Pesquisa'}]};
  w.CentralStudyObjectiveCatalog={subjects:{info:{name:'Informática'}}};
  w.eval(code);
  const overlay=w.document.getElementById('overlay');
  await w.CentralContestAdminForm.open(overlay,{id:'teste-2026',sources:[],cargos:[],subjects:[{id:'info',name:'Informática',centralId:'info',syllabus:[{id:'internet',title:'Internet e intranet',links:[{subjectId:'info',moduleId:'info-09',chapterId:null,status:'suggested',scope:'partial',evidence:''}]}]}]},false);
  const select=overlay.querySelector('[data-field="subjects.0.syllabus.0.links.0.chapterId"]');
  assert.ok([...select.options].some((item)=>item.value==='info-09-c01' && item.textContent.includes('intranet')));
  select.value='info-09-c01';select.dispatchEvent(new w.Event('change',{bubbles:true}));
  assert.equal(w.CentralContestAdminForm.value().subjects[0].syllabus[0].links[0].chapterId,'info-09-c01');
  dom.window.close();
});

test('pdf.js extrai o texto de edital fictício, sem aprovar vínculos', async () => {
  pdfjs.GlobalWorkerOptions.workerSrc=new URL('../vendor/pdfjs/pdf.worker.min.mjs',import.meta.url).href;
  const stream='BT /F1 12 Tf 72 720 Td (Internet e intranet) Tj ET';
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let content='%PDF-1.4\n';const offsets=[0];for(const [i,object] of objects.entries()){offsets.push(content.length);content+=`${i+1} 0 obj\n${object}\nendobj\n`;}
  const start=content.length;content+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map((offset)=>String(offset).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  const pdf=await pdfjs.getDocument({data:new Uint8Array(Buffer.from(content)),useSystemFonts:true}).promise;
  const extracted=(await (await pdf.getPage(1)).getTextContent()).items.map((item)=>item.str).join(' ');
  assert.match(extracted,/Internet e intranet/);
  await pdf.destroy();
});
