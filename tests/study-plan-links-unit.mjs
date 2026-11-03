import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
import {knownModule,knownSubject} from '../lib/study-plan-import.js';

test('Conectar automaticamente abreviações confiáveis do PDF TJCE',()=>{
 const cases=[
  ['Direito Constitucional','M01 · Princípios','cf-m01-analista'],
  ['Direito Constitucional','M02 · Direitos','cf-m02-analista'],
  ['Direito Administrativo','M01 · Princípios','adm-01-01-regime-juridico-e-principios'],
  ['Direito Administrativo','M02 · Organização','adm-02-02-organizacao-administrativa'],
  ['Direito Civil','M01 · Pessoas','civ-pessoa-natural-analista'],
  ['Direito Civil','M02 · Pessoas jurídicas','civ-pessoa-juridica-analista'],
  ['Direito Processual Civil','M01 · Normas','cpc-m01-disciplina'],
 ];
 for(const [subject,title,expected] of cases){
  const m=knownModule(knownSubject(subject),null,title);
  assert.equal(m?.uid,expected,subject+' '+title);
 }
});

test('Não criar vínculo incorreto com catálogo histórico desatualizado',()=>{
 const cases=[
  ['rlm','M01 · Proposições'],
  ['rlm','M02 · Conectivos'],
  ['pt','M02 · Morfologia'],
  ['adm','M01–M02'],
  ['cf','M01–M02'],
  ['cf','M01 · Organização'],
  ['civil','M01 · Pessoas jurídicas'],
 ];
 for(const [subject,title] of cases){
  assert.equal(knownModule(subject,null,title),null,subject+' '+title);
 }
});

test('O atalho na Central está presente e contém sintaxe Javascript válida',()=>{
 const source=readFileSync('ui/study-plan-deeplink-v1.js','utf8');
 assert.doesNotThrow(()=>new Script(source));
 assert.match(source,/BaseCompletaFocusNavigation/);
 assert.match(source,/targetMatch/);
 assert.match(source,/bc_plan_uid/);
 assert.match(readFileSync('index.html','utf8'),/study-plan-deeplink-v1\.js/);
});

test('Tela de planos usa somente rota da Central e respeita vínculos confirmados',()=>{
 const html=readFileSync('tools/meus-planos.html','utf8');
 assert.match(html,/central-v119\.html\?/);
 assert.match(html,/bc_plan_subject/);
 assert.match(html,/bc_plan_uid/);
 assert.match(html,/vinculo_confirmado/);
 assert.ok(!html.includes("modules/portugues/index.html"));
});

test('API resolve vínculos em leitura sem alterar histórico e progresso das disciplinas',()=>{
 const src=readFileSync('lib/study-plan-handler.js','utf8');
 assert.match(src,/knownModule\(subjectId,x\.modulo_uid,x\.modulo\)/);
 assert.match(src,/const confirmed=!!st\?\.subject_id/);
 assert.match(src,/vinculo_confirmado:confirmed/);
 assert.ok(!src.includes('UPDATE central_user_progress_summary'));
});
