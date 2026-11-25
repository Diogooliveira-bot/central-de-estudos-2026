// Vínculos de edital são referências ao material existente, nunca cópias do conteúdo.
import { SHARED_MODULES } from './shared-module-catalog.js';
const clean = (value, limit = 300) => String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, limit);
const key = (value) => /^[a-z0-9][a-z0-9-]{0,99}$/.test(value);
function invalid(message) { throw Object.assign(new Error(message),{statusCode:400}); }

export function normalizeSyllabus(items) {
  if (!Array.isArray(items)) return [];
  if (items.length > 300) invalid('Limite de 300 assuntos por disciplina');
  const seen = new Set();
  return items.map((item, index) => {
    const id = clean(item?.id || `assunto-${index + 1}`, 100).toLowerCase();
    const title = clean(item?.title, 500);
    if (!key(id) || !title || seen.has(id)) invalid('Assunto duplicado ou inválido');
    seen.add(id);
    const links = (Array.isArray(item?.links) ? item.links : []).slice(0, 30).map((link) => {
      const subjectId = clean(link?.subjectId, 30);
      const moduleId = clean(link?.moduleId, 100);
      const chapterId = clean(link?.chapterId, 100) || null;
      const status = ['suggested','approved','rejected'].includes(link?.status) ? link.status : 'suggested';
      const scope = link?.scope === 'full' ? 'full' : 'partial';
      const evidence = clean(link?.evidence, 1000);
      if (!key(subjectId) || !key(moduleId) || (chapterId && !key(chapterId))) invalid('Referência de conteúdo inválida');
      if (status === 'approved' && !evidence) invalid('Descreva a conferência pedagógica do vínculo aprovado');
      if (status === 'approved') {
        const module=(SHARED_MODULES[subjectId]||[]).find((entry)=>entry.id===moduleId);
        if (!module) invalid('O módulo aprovado não consta da biblioteca publicada');
        if (chapterId && !module.chapters.some((chapter)=>chapter.id===chapterId)) invalid('O capítulo aprovado não consta do módulo publicado');
      }
      return {subjectId,moduleId,chapterId,status,scope,evidence};
    });
    const supplement = item?.supplement && typeof item.supplement === 'object' ? {
      title:clean(item.supplement.title, 300),
      status:item.supplement.status === 'approved' ? 'approved' : 'pending',
      evidence:clean(item.supplement.evidence, 1000),
      contentRef:clean(item.supplement.contentRef, 300)
    } : null;
    if (supplement?.status === 'approved' && (!supplement.title || !supplement.evidence || !/^\/content\/[a-z0-9/_-]+\.(?:js|html|pdf)$/i.test(supplement.contentRef))) invalid('Complementação aprovada exige título, conferência e arquivo publicado em /content/');
    return {id,title,links,supplement};
  });
}

export function topicCoverage(topic) {
  const approved = (topic.links || []).filter((link) => link.status === 'approved');
  const full = approved.some((link) => link.scope === 'full');
  const pending = (topic.links || []).some((link) => link.status === 'suggested');
  const supplemented = topic.supplement?.status === 'approved' && !!topic.supplement.contentRef;
  if (full && !pending && !topic.supplement) return 'complete';
  if (approved.length && supplemented && !pending) return 'complete';
  if (approved.length || supplemented) return 'partial';
  return 'missing';
}

export function subjectCoverage(subject) {
  if (!subject.syllabus?.length) return subject.coverage || 'missing'; // legado sem verticalização
  const states = subject.syllabus.map(topicCoverage);
  if (states.every((state) => state === 'complete')) return 'complete';
  return states.some((state) => state !== 'missing') ? 'partial' : 'missing';
}
