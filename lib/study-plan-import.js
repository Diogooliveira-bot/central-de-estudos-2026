import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { STUDY_PLAN_MODULES } from './study-plan-module-catalog.js';

export const PLAN_SCHEMA_VERSION = '1.0.0';
export const MAX_ZIP_BYTES = 3_000_000; // Compatível com limite de payload da função Vercel.
export const MAX_PDF_BYTES = 2_600_000;
export const MAX_JSON_BYTES = 250_000;
export const MAX_ACTIVITIES = 800;
const WEEKDAYS = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];
const SUBJECTS = {
  pt: ['portugues','lingua portuguesa','gramatica'],
  cf: ['direito constitucional','constitucional','cf'],
  adm: ['direito administrativo','administrativo','adm'],
  civil: ['direito civil','civil'],
  cpc: ['direito processual civil','processo civil','cpc'],
  penal: ['direito penal','penal'],
  cpp: ['direito processual penal','processo penal','cpp'],
  rlm: ['raciocinio logico','raciocinio logico matematico','rlm','matematica'],
};

function invalid(message) {
  const error = new Error(message);
  error.status = 422;
  throw error;
}
const text = (v, max = 240) => typeof v === 'string' ? v.trim().slice(0,max) : '';
export const normalize = v => String(v || '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const normTitle = v => normalize(v).replace(/^\d+\s*/, '');

export function knownSubject(v) {
  const n = normalize(v);
  const key = Object.keys(SUBJECTS).find(id => id === n || SUBJECTS[id].includes(n));
  return key || null;
}

export function knownModule(subjectId, explicitUid, title) {
  if (!subjectId) return null;
  const candidates = STUDY_PLAN_MODULES.filter(m => m.subjectId === subjectId);
  if (explicitUid) return candidates.find(m => m.uid === explicitUid) || null;
  if (!title) return null;
  const desired = normTitle(title);
  const matches = candidates.filter(m => normTitle(m.title) === desired);
  return matches.length === 1 ? matches[0] : null;
}

export function validateISO(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00.000Z');
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0,10) === value;
}

function nextDateForWeekday(from, name, to) {
  const day = WEEKDAYS.indexOf(normalize(name));
  if (day < 0) invalid('Dia da semana não reconhecido: ' + text(name,40));
  const initial = new Date(from + 'T12:00:00Z');
  const delta = (day - initial.getUTCDay() + 7) % 7;
  initial.setUTCDate(initial.getUTCDate() + delta);
  const value = initial.toISOString().slice(0,10);
  if (value > to) invalid('Atividade fora dos limites da semana');
  return value;
}
function readString(value, name, max=240, optional=false) {
  const result = text(value,max);
  if (!result && !optional) invalid('Campo obrigatório ausente: ' + name);
  return result;
}
function readPositiveInteger(value, name, max) {
  if (!Number.isInteger(value) || value < 1 || value > max) invalid('Número inválido: ' + name);
  return value;
}
function validTime(value) {
  return value === undefined || value === null || value === '' ||
    (typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value));
}
function requireObject(o, name) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) invalid('Objeto inválido: ' + name);
}
function requireArray(a, name, min=0, max=1000) {
  if (!Array.isArray(a) || a.length<min || a.length>max) invalid('Lista inválida: ' + name);
}

export function validatePlanDocument(doc) {
  requireObject(doc,'raiz');
  if (doc.schema_version !== PLAN_SCHEMA_VERSION) invalid('Versão de importação não suportada. Esperado: 1.0.0');
  requireObject(doc.documento,'documento');
  requireObject(doc.aluno,'aluno');
  requireArray(doc.cronograma,'cronograma',1,52);
  const name=readString(doc.aluno.nome,'aluno.nome',120);
  const objetivo=readString(doc.aluno.objetivo,'aluno.objetivo',160);
  const cargo=readString(doc.aluno.cargo,'aluno.cargo',160,true);
  const periodoInicio=doc.documento.periodo_inicio;
  const periodoFim=doc.documento.periodo_fim;
  if (!validateISO(periodoInicio)||!validateISO(periodoFim)||periodoFim<periodoInicio) invalid('Período geral inválido');
  if ((new Date(periodoFim)-new Date(periodoInicio))>370*864e5) invalid('O plano não pode exceder 370 dias');
  const id=readString(doc.plano_id,'plano_id',120,true) || null;
  const title=readString(doc.documento.titulo,'documento.titulo',160,true) || ('Plano de estudos — '+objetivo);
  const activities=[];
  for(let wi=0;wi<doc.cronograma.length;wi++){
    const week=doc.cronograma[wi];
    requireObject(week,'cronograma['+wi+']');
    if(!validateISO(week.inicio)||!validateISO(week.fim)||week.inicio>week.fim ||
      week.inicio<periodoInicio||week.fim>periodoFim ||
      new Date(week.fim)-new Date(week.inicio)>6*864e5) invalid('Datas inválidas na semana '+(wi+1));
    requireArray(week.atividades,'atividades da semana '+(wi+1),1,80);
    for(let ai=0;ai<week.atividades.length;ai++){
      const a=week.atividades[ai];
      requireObject(a,'atividade');
      const subjectName=readString(a.disciplina,'disciplina',120);
      const subjectId=knownSubject(subjectName);
      const moduleName=readString(a.modulo,'modulo',200,true);
      const explicitUid=readString(a.modulo_uid,'modulo_uid',150,true);
      const matched=knownModule(subjectId,explicitUid,moduleName);
      const activityName=readString(a.atividade,'atividade',280);
      const minutes=readPositiveInteger(a.duracao_minutos,'duracao_minutos',480);
      let date;
      if(a.data!==undefined&&a.data!==null){
        if(!validateISO(a.data)||a.data<week.inicio||a.data>week.fim) invalid('Data de atividade inválida');
        date=a.data;
        if(a.dia && WEEKDAYS.indexOf(normalize(a.dia)) !== new Date(date+'T12:00:00Z').getUTCDay()) invalid('Dia e data divergentes');
      } else date=nextDateForWeekday(week.inicio,a.dia,week.fim);
      if(!validTime(a.horario_inicio)) invalid('Horário deve usar HH:mm');
      activities.push({
        id:'s'+String(wi+1)+'-a'+String(ai+1),
        semana: wi+1, data:date, hora:text(a.horario_inicio,5)||null,
        disciplina:subjectName, disciplina_id:subjectId,
        modulo:moduleName, modulo_uid:matched?.uid||null,
        modulo_url:matched?.url||null, atividade:activityName,
        minutos:minutes, vinculacao:matched ? 'modulo' : subjectId ? 'disciplina' : 'pendente',
      });
    }
  }
  if(activities.length>MAX_ACTIVITIES) invalid('O cronograma excede 800 atividades');
  const identifiers=new Set(activities.map(a=>a.id));
  if(identifiers.size!==activities.length) invalid('IDs duplicados no cronograma');
  return {
    plano_id:id, nome:name, objetivo,cargo, banca:text(doc.aluno.banca,120),
    titulo:title, periodo_inicio:periodoInicio,periodo_fim:periodoFim,
    atividades:activities,
    resumo:{
      total:activities.length,
      minutos:activities.reduce((sum,x)=>sum+x.minutos,0),
      pendentes_vinculacao:activities.filter(x=>x.vinculacao==='pendente').length,
      sem_modulo:activities.filter(x=>x.vinculacao!=='modulo').length,
    },
  };
}

function u16(b,at){return b.readUInt16LE(at)}
function u32(b,at){return b.readUInt32LE(at)}
const crcTable=Array.from({length:256},(_,i)=>{
 let x=i;for(let j=0;j<8;j++)x=(x&1)?(0xEDB88320^(x>>>1)):(x>>>1);return x>>>0;
});
function crc32(buffer){let x=0xFFFFFFFF;for(const b of buffer)x=crcTable[(x^b)&255]^(x>>>8);return (x^0xFFFFFFFF)>>>0}
const decoder=new TextDecoder('utf-8',{fatal:true});

function extractZip(buffer){
 if(!Buffer.isBuffer(buffer)||buffer.length>MAX_ZIP_BYTES||buffer.length<44) invalid('ZIP inválido ou acima de 3 MB');
 let eocd=-1;
 for(let i=buffer.length-22;i>=Math.max(0,buffer.length-65557);i--){
   if(u32(buffer,i)===0x06054b50 && i+22+u16(buffer,i+20)===buffer.length){eocd=i;break}
 }
 if(eocd<0) invalid('Diretório ZIP ausente ou corrompido');
 if(u16(buffer,eocd+4)!==0||u16(buffer,eocd+6)!==0||u16(buffer,eocd+8)!==2||u16(buffer,eocd+10)!==2) invalid('O ZIP deve conter apenas dois arquivos');
 const size=u32(buffer,eocd+12),offset=u32(buffer,eocd+16);
 if(size===0xFFFFFFFF||offset===0xFFFFFFFF||offset+size!==eocd) invalid('Estrutura ZIP não suportada');
 let pos=offset;const files=new Map();const segments=[];
 for(let n=0;n<2;n++){
   if(pos+46>eocd||u32(buffer,pos)!==0x02014b50) invalid('Entrada ZIP danificada');
   const flags=u16(buffer,pos+8),method=u16(buffer,pos+10),crc=u32(buffer,pos+16);
   const compressed=u32(buffer,pos+20),uncompressed=u32(buffer,pos+24);
   const nameLength=u16(buffer,pos+28),extra=u16(buffer,pos+30),comment=u16(buffer,pos+32);
   const local=u32(buffer,pos+42),attributes=u32(buffer,pos+38);
   if(flags&1||flags&0x40||![0,8].includes(method)|| compressed===0xFFFFFFFF||uncompressed===0xFFFFFFFF) invalid('Arquivo ZIP criptografado ou incompatível');
   if(pos+46+nameLength+extra+comment>eocd) invalid('Nome ZIP inválido');
   let name;
   try{name=decoder.decode(buffer.subarray(pos+46,pos+46+nameLength))}catch(_){invalid('Nome de arquivo não UTF-8')}
   if(!['plano.json','plano.pdf'].includes(name)||files.has(name)) invalid('O ZIP deve conter apenas plano.json e plano.pdf, sem pastas');
   if((attributes>>>16&0o170000)===0o120000) invalid('Links simbólicos não são permitidos');
   const limit=name==='plano.pdf'?MAX_PDF_BYTES:MAX_JSON_BYTES;
   if(!compressed||uncompressed>limit||uncompressed>Math.max(1,compressed)*500) invalid('Arquivo muito grande ou taxa de compressão suspeita');
   if(local+30>offset||u32(buffer,local)!==0x04034b50||u16(buffer,local+8)!==method||u16(buffer,local+6)!==flags) invalid('Cabeçalho ZIP divergente');
   const lname=u16(buffer,local+26),lextra=u16(buffer,local+28),dataStart=local+30+lname+lextra;
   if(dataStart+compressed>offset||lname!==nameLength||
      !buffer.subarray(local+30,local+30+lname).equals(buffer.subarray(pos+46,pos+46+nameLength))) invalid('Conteúdo ZIP fora dos limites');
   segments.push([local,dataStart+compressed]);
   const raw=buffer.subarray(dataStart,dataStart+compressed);
   let result;
   try{result=method===0?Buffer.from(raw):zlib.inflateRawSync(raw,{maxOutputLength:limit+1})}
   catch(_){invalid('Não foi possível descompactar o arquivo com segurança')}
   if(result.length!==uncompressed||crc32(result)!==crc) invalid('Falha de integridade CRC do ZIP');
   files.set(name,result);
   pos+=46+nameLength+extra+comment;
 }
 if(pos!==eocd) invalid('Itens ZIP adicionais não são permitidos');
 segments.sort((a,b)=>a[0]-b[0]);
 if(segments[0][1]>segments[1][0]) invalid('Entradas ZIP sobrepostas');
 return files;
}

export function parseStudyPlanZip(base64){
 if(typeof base64!=='string'||base64.length>4_100_000||!/^([A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) invalid('Conteúdo ZIP em base64 inválido');
 const input=Buffer.from(base64,'base64');
 const files=extractZip(input);
 const pdf=files.get('plano.pdf');
 if(pdf.length<100||!pdf.subarray(0,8).toString('latin1').startsWith('%PDF-')||
    !pdf.subarray(Math.max(0,pdf.length-2048)).toString('latin1').includes('%%EOF')) invalid('PDF inválido ou incompleto');
 // Nunca executar conteúdo do PDF. Bloquear os gatilhos ativos mais comuns.
 const pdfText=pdf.toString('latin1');
 if(/\/(?:JavaScript|JS|Launch|OpenAction|RichMedia|EmbeddedFile)\b/i.test(pdfText) || /\/AA\b/.test(pdfText)) invalid('O PDF contém ações ativas não permitidas');
 let document;
 try{document=JSON.parse(decoder.decode(files.get('plano.json')))}
 catch(_){invalid('plano.json não contém JSON UTF-8 válido')}
 const normalized=validatePlanDocument(document);
 return {document, normalized,pdf,sha256:crypto.createHash('sha256').update(input).digest('hex')};
}
