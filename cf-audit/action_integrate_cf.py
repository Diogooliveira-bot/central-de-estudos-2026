import os,re,json,csv,glob,sys,shutil
ROOT=os.environ.get('GITHUB_WORKSPACE','.')
PKG=sys.argv[1] if len(sys.argv)>1 else '/tmp/cf_pkg'
cands=glob.glob(PKG+'/**/CF_M1_M12_AUDITADO_PRONTO_INTEGRACAO',recursive=True)
P=cands[0] if cands else PKG
BASE=P+'/modulos'
DECKS={1:'02 DIREITO CONSTITUCIONAL::01 CONSTITUIÇÃO, NORMAS E PRINCÍPIOS FUNDAMENTAIS',2:'02 DIREITO CONSTITUCIONAL::02 DIREITOS E DEVERES INDIVIDUAIS E COLETIVOS',3:'02 DIREITO CONSTITUCIONAL::03 DIREITOS SOCIAIS, NACIONALIDADE E DIREITOS POLÍTICOS',4:'02 DIREITO CONSTITUCIONAL::04 ORGANIZAÇÃO DO ESTADO',5:'02 DIREITO CONSTITUCIONAL::05 ADMINISTRAÇÃO PÚBLICA E SERVIDORES',6:'02 DIREITO CONSTITUCIONAL::06 PODER LEGISLATIVO - ORGANIZAÇÃO E ATRIBUIÇÕES',7:'02 DIREITO CONSTITUCIONAL::07 PROCESSO LEGISLATIVO E FISCALIZAÇÃO',8:'02 DIREITO CONSTITUCIONAL::08 PODER EXECUTIVO',9:'02 DIREITO CONSTITUCIONAL::09 PODER JUDICIÁRIO - DISPOSIÇÕES GERAIS E STF',10:'02 DIREITO CONSTITUCIONAL::10 CNJ, STJ, JUSTIÇA DO TRABALHO E CSJT',11:'02 DIREITO CONSTITUCIONAL::11 FUNÇÕES ESSENCIAIS À JUSTIÇA',12:'02 DIREITO CONSTITUCIONAL::12 CONTROLE DE CONSTITUCIONALIDADE'}
TOPICS={1:['principios','aplicabilidade'],2:['direitos'],3:['sociais','nacionalidade','politicos'],4:['organizacao'],5:['administracao'],6:['legislativo','leg_org'],7:['legislativo','fiscalizacao'],8:['presidencia'],9:['judiciario','stf'],10:['cnj','stj','trabalho'],11:['mp','defensoria'],12:['controle','adi','adc','adpf']}
TITLES={1:'Constituição, normas constitucionais e princípios fundamentais',2:'Teoria geral dos direitos fundamentais, direitos individuais/coletivos e remédios constitucionais',3:'Direitos sociais, nacionalidade, direitos políticos e partidos políticos',4:'Organização do Estado',5:'Administração Pública e servidores públicos',6:'Poder Legislativo',7:'Processo Legislativo e fiscalização contábil, financeira e orçamentária',8:'Poder Executivo',9:'Poder Judiciário I: disposições gerais e STF',10:'Poder Judiciário II: CNJ, STJ e Justiça do Trabalho',11:'Funções Essenciais à Justiça',12:'Controle de Constitucionalidade'}
def read(p): return open(p,encoding='utf-8-sig').read()
def clean(s):
 s=re.sub(r'```.*?```',' ',str(s),flags=re.S);s=re.sub(r'\[(.*?)\]\([^)]*\)',r'\1',s);s=s.replace('**','').replace('__','').replace('`','');s=re.sub(r'<[^>]+>',' ',s);s=re.sub(r'^[ \t]*[-*+]\s+','• ',s,flags=re.M);s=re.sub(r'\s+',' ',s).strip();return s
def secs(text,limit=100):
 out=[];title='Teoria';buf=[]
 def flush():
  nonlocal buf
  b=clean('\n'.join(buf));buf=[]
  if len(b)>=20:
   if len(b)>3500:
    parts=re.split(r'(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÃÕÇ0-9])',b);ch='';k=1
    for p in parts:
     if len(ch)+len(p)>2200 and ch: out.append([clean(title)+(f' — parte {k}' if k>1 else ''),ch]);k+=1;ch=p
     else: ch=(ch+' '+p).strip()
    if ch: out.append([clean(title)+(f' — parte {k}' if k>1 else ''),ch])
   else: out.append([clean(title),b])
 for line in text.replace('\r','').split('\n'):
  m=re.match(r'^#{2,4}\s+(.+)',line.strip())
  if m: flush();title=m.group(1)
  elif re.match(r'^#\s+',line.strip()): flush();title=re.sub(r'^#\s+','',line.strip())
  else: buf.append(line)
 flush();seen=set();z=[]
 for x in out:
  k=re.sub(r'\W+','',x[1].lower())[:500]
  if k not in seen: seen.add(k);z.append(x)
 return z[:limit]
def pick(d,patterns):
 for pat in patterns:
  for f in os.listdir(d):
   if re.search(pat,f,re.I): return os.path.join(d,f)
def special(d):
 def g(pats):
  f=pick(d,pats);return secs(read(f),45) if f else []
 return g([r'porto.*seguro',r'PORTO_SEGURO_DECORAR']),g([r'^decorar',r'DECORAR']),g([r'pegadinh'])
def qload(d,n):
 f=pick(d,[r'^05_QUESTOES_AUTORAIS.*\.json$',r'^questoes_m\d+\.json$']);out=[]
 if not f:return out
 o=json.load(open(f,encoding='utf8'));arr=o if isinstance(o,list) else o.get('questions') or o.get('questoes') or o.get('items') or []
 letters='ABCDE'
 for i,q in enumerate(arr,1):
  def v(*ks):
   for k in ks:
    if q.get(k) not in [None,'']:return q[k]
  opts=v('options','alternatives','alternativas','o') or []
  if isinstance(opts,dict):opts=[opts.get(x) for x in letters if opts.get(x) is not None]
  opts=[str(x.get('text') or x.get('texto') or x.get('value') or '') if isinstance(x,dict) else str(x) for x in opts]
  if len(opts)!=5:continue
  a=v('answerIndex','a');a=v('answer','correct','gabarito') if a is None else a
  if isinstance(a,str):a=letters.index(a.strip().upper()) if a.strip().upper() in letters else int(a) if a.isdigit() else 0
  if isinstance(a,bool):a=0 if a else 1
  try:a=int(a)
  except:a=0
  if not 0<=a<5:continue
  raw=str(v('topic','tema','subject','subtopic','tags','t') or '').lower();t=TOPICS[n][0]
  maps={3:[('nacional','nacionalidade'),('polit','politicos'),('social','sociais')],7:[('fiscal','fiscalizacao'),('tcu','fiscalizacao'),('orçament','fiscalizacao')],9:[('stf','stf')],10:[('cnj','cnj'),('stj','stj'),('trabal','trabalho'),('tst','trabalho')],11:[('defens','defensoria')],12:[('adpf','adpf'),('adc','adc'),('adi','adi')]}
  for needle,val in maps.get(n,[]):
   if needle in raw:t=val;break
  out.append([str(v('id') or f'cf-m{n:02d}-audit-q{i:03d}'),t,clean(v('statement','prompt','enunciado','q') or ''),[clean(x) for x in opts],a,clean(v('commentary','comment','comentario','comentarios','e') or ''),clean(v('basis','foundation','fundamento','legal_basis','r','source') or 'Pacote auditado 19/09/2026'),clean(v('topic','tema','subject','subtopic') or TITLES[n])])
 return out
def aload(d,n):
 fs=[x for x in glob.glob(d+'/*anki*.csv')+glob.glob(d+'/*ANKI*.csv') if 'arquivado' not in x.lower()];out=[]
 if not fs:return out
 p=fs[0];first=open(p,encoding='utf-8-sig').readline();delim=';' if first.count(';')>first.count(',') else ','
 for i,r in enumerate(csv.DictReader(open(p,encoding='utf-8-sig',newline=''),delimiter=delim),1):
  rr={str(k or '').strip().lower():v for k,v in r.items() if k};front=(rr.get('front') or rr.get('frente') or '').strip();back=(rr.get('back') or rr.get('verso') or '').strip()
  if not front or not back:continue
  rid=(rr.get('id') or f'cf-m{n:02d}-audit-anki-{i:03d}').strip();out.append([rid,front,back,(rr.get('tags') or f'cf_m{n:02d} auditado_2026').strip(),(rr.get('source') or rr.get('fonte') or 'CF auditado 19/09/2026').strip()])
 return out
mods=[]
for n in range(1,13):
 ds=glob.glob(f'{BASE}/CF_M{n}_FINAL_AUDITADO');assert ds,f'M{n} ausente';d=ds[0]
 tf=pick(d,[r'02_TEORIA_FINAL',r'^teoria_m',r'TEORIA.*FINAL']);theory=secs(read(tf),100) if tf else []
 porto,decor,peg=special(d)
 subtitle='';readtxt='';readfocus=[];outline=[]
 for jf in [f'module_cf_m{n:02d}.json',f'module_cf_m{n}.json',f'08_CF_M{n}_INTEGRATION_PAYLOAD.json']:
  p=os.path.join(d,jf)
  if os.path.exists(p):
   try:
    obj=json.load(open(p,encoding='utf8'))
    def walk(o):
     if isinstance(o,dict):
      yield o
      for vv in o.values():yield from walk(vv)
     elif isinstance(o,list):
      for vv in o:yield from walk(vv)
    for x in walk(obj):
     subtitle=subtitle or (x.get('subtitle') if isinstance(x.get('subtitle'),str) else '')
     readtxt=readtxt or (x.get('read') if isinstance(x.get('read'),str) else '')
     readfocus=readfocus or (x.get('read_focus') if isinstance(x.get('read_focus'),list) else [])
     outline=outline or (x.get('outline') if isinstance(x.get('outline'),list) else [])
   except:pass
  if subtitle or outline:break
 if not outline:outline=[x[0] for x in theory[:30]]
 mods.append([n,DECKS[n],[f'w{n}',TITLES[n],subtitle,TOPICS[n],readtxt,readfocus,outline,theory,porto,decor,peg],qload(d,n),aload(d,n)])
payload=['2026.09.19-final-audited',mods]
os.makedirs(ROOT+'/cf-audit/generated',exist_ok=True)
json.dump(payload,open(ROOT+'/cf-audit/generated/cf-audit-data.json','w',encoding='utf8'),ensure_ascii=False,separators=(',',':'))
js='window.CF_AUDIT_PAYLOAD='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'+r'''(function(){'use strict';
const P=window.CF_AUDIT_PAYLOAD;if(!P||P[0]!=='2026.09.19-final-audited')return;const ARCH='99 ARQUIVO FORA DO EDITAL::DIREITO CONSTITUCIONAL::PRÉ-AUDITORIA 2026';
window.CF_AUDIT_INTEGRATION={version:P[0],integratedAt:'2026-09-20',modules:12,questions:503,anki:1024,preserveState:true};
try{if(typeof CF_QUESTIONS!=='undefined')for(const q of CF_QUESTIONS)if(q&&q.real===false&&!q.auditPackage)q.auditArchived=true}catch(e){}
try{const A=window.ANKI_SITE_DATA;if(A&&Array.isArray(A.cards)){for(const c of A.cards)if(c&&String(c.deck||'').startsWith('02 DIREITO CONSTITUCIONAL::')&&!c.auditPackage){c.legacyDeck=c.legacyDeck||c.deck;c.deck=ARCH;c.migrationArchived=true}if(Array.isArray(A.decks)&&!A.decks.includes(ARCH))A.decks.push(ARCH)}}catch(e){}
for(const E of P[1]){const n=E[0],deck=E[1],m=E[2],qs=E[3]||[],cards=E[4]||[];const id=m[0];
 try{if(typeof CF_WEEKS!=='undefined'){const w=CF_WEEKS.find(x=>x.id===id);if(w)Object.assign(w,{title:m[1],subtitle:m[2]||w.subtitle,topics:m[3]||w.topics,read:m[4]||w.read,read_focus:m[5]?.length?m[5]:w.read_focus,outline:m[6]?.length?m[6]:w.outline,theory:m[7]?.length?m[7]:w.theory,portoSeguro:m[8],decorar:m[9],pegadinhas:m[10],auditStatus:'AUDITADO • 19/09/2026',auditVersion:P[0]})}}catch(e){}
 try{if(typeof CF_QUESTIONS!=='undefined'){const by=new Map(CF_QUESTIONS.map((q,i)=>[String(q.id),i]));for(const r of qs){const q={id:r[0],t:r[1],l:'auditada',real:false,q:r[2],o:r[3],a:r[4],e:r[5],r:r[6],source:`CF M${n} auditado • 19/09/2026`,subject:r[7]||m[1],auditPackage:true,auditModule:id};const i=by.get(String(q.id));if(i==null){CF_QUESTIONS.push(q);by.set(String(q.id),CF_QUESTIONS.length-1)}else CF_QUESTIONS[i]=Object.assign({},CF_QUESTIONS[i],q)}}}catch(e){}
 try{const A=window.ANKI_SITE_DATA;if(A&&Array.isArray(A.cards)){const by=new Map(A.cards.map((c,i)=>[String(c.id),i]));let seq=0;for(const r of cards){seq++;const card={id:r[0],originalId:r[0],noteId:r[0]+'-note',deck,front:r[1],back:r[2],tags:r[3],noteType:'Básico',fields:{Frente:r[1],Verso:r[2]},structural:false,judgment:false,expected:null,suspended:false,createdAt:1789858800000+n*1000+seq,modifiedAt:1789858800000+n*1000+seq,stats:{views:0,correct:0,wrong:0,streak:0,lastSeen:null,history:[]},source:r[4],migrationGroup:'constitucional-auditado-20260919',migrationArchived:false,editalModule:`cf-m${String(n).padStart(2,'0')}`,auditPackage:true};const i=by.get(String(card.id));if(i==null){A.cards.push(card);by.set(String(card.id),A.cards.length-1)}else{const old=A.cards[i]||{};card.stats=old.stats||card.stats;A.cards[i]=Object.assign({},old,card)}}if(Array.isArray(A.decks)&&!A.decks.includes(deck))A.decks.push(deck);A.totalCards=A.cards.length;if(A.meta)A.meta.totalCards=A.cards.length}}catch(e){}
 try{if(typeof DATA_CF!=='undefined'&&typeof DATA!=='undefined'&&Array.isArray(m[9])){const ids=new Set(DATA_CF.map(x=>String(x.id)));let seq=0;for(const x of m[9].slice(0,30)){seq++;const did=`cf-audit-decor-m${String(n).padStart(2,'0')}-${String(seq).padStart(3,'0')}`;if(ids.has(did))continue;const t=x[0]||'Decorar',b=x[1]||'';const d={id:did,number:`DECORAR ${String(seq).padStart(2,'0')}`,title:'Memorização auditada',parts:[b],topicId:`cf-m${String(n).padStart(2,'0')}`,subtopic:t,question:{statement:(t+': '+b).slice(0,1300),answer:true,source:'Pacote CF M1-M12 auditado em 19/09/2026',explanation:'Regra de memorização validada na auditoria final.',meta:'DECORAR • conteúdo auditado',bank:'Autoral FCC',year:2026,origin:'auditado'},discipline:'cf',origin:'auditado_2026',auditPackage:true};DATA_CF.push(d);DATA.push(d);ids.add(did)}}}catch(e){}
}
try{if(typeof cfPool==='function'&&!window.__CF_AUDIT_POOL_PATCHED){window.__CF_AUDIT_POOL_PATCHED=true;cfPool=function(w){return CF_QUESTIONS.filter(q=>!q.auditArchived&&w.topics.includes(q.t))}}}catch(e){}
try{if(typeof cfStats==='function'&&!window.__CF_AUDIT_STATS_PATCHED){window.__CF_AUDIT_STATS_PATCHED=true;cfStats=function(){const st=cfState();let answered=0,correct=0,wrongIds=[];CF_QUESTIONS.filter(q=>!q.auditArchived).forEach(q=>{const a=st.answers?.[q.id];if(a?.attempts){answered++;if(a.lastCorrect)correct++;if(a.everWrong&&!a.lastCorrect)wrongIds.push(q.id)}});return {answered,correct,wrongIds,accuracy:answered?Math.round(correct/answered*1000)/10:0}}}}catch(e){}
try{if(typeof renderCfModule==='function'&&!window.__CF_AUDIT_RENDER_PATCHED){window.__CF_AUDIT_RENDER_PATCHED=true;const original=renderCfModule;renderCfModule=function(w){let out=original(w),box=(label,a)=>Array.isArray(a)&&a.length?`<details class="cf-syllabus"><summary>${label} • ${a.length}</summary><div class="cf-theory-grid" style="margin-top:9px">${a.map(x=>`<div class="cf-theory"><details><summary>${esc(x[0]||label)}</summary><div class="cf-theory-text">${esc(x[1]||'')}</div></details></div>`).join('')}</div></details>`:'';const ex=box('🛟 Porto Seguro FCC',w.portoSeguro)+box('🧠 Decorar',w.decorar)+box('⚠ Pegadinhas FCC',w.pegadinhas);return ex?out.replace('<details class="cf-resources">',ex+'<details class="cf-resources">'):out}}}catch(e){}
try{if(typeof renderAll==='function')setTimeout(()=>renderAll(),0)}catch(e){}try{if(typeof render==='function')setTimeout(()=>render(),0)}catch(e){}
})();'''
open(ROOT+'/cf-audit/generated/cf-audit-bundle-v1.js','w',encoding='utf8').write(js)
TAG='/cf-audit/generated/cf-audit-bundle-v1.js?v=20260920a'
def ins(path,src,mode):
 s=read(path)
 if 'cf-audit-bundle-v1.js' in s:return
 tag=f'<script src="{src}"></script>'
 if mode=='index':
  marker='<script src="/central-structural-v66119/runtime.js?v=66119s2"></script>'
  assert marker in s;s=s.replace(marker,marker+'\n'+tag,1)
 else:
  s=s.replace('</body>',tag+'\n</body>',1)
 open(path,'w',encoding='utf8').write(s)
ins(ROOT+'/index.html',TAG,'index')
ins(ROOT+'/tools/anki.html','../cf-audit/generated/cf-audit-bundle-v1.js?v=20260920a','tool')
ins(ROOT+'/tools/decorando.html','../cf-audit/generated/cf-audit-bundle-v1.js?v=20260920a','tool')
for p in [ROOT+'/cf-audit/payload',ROOT+'/cf-audit/cf-audit-prelude-v1.js',ROOT+'/cf-audit/cf-audit-post-v1.js',ROOT+'/cf-audit/cf-audit-loader-v1.js']:
 if os.path.isdir(p):shutil.rmtree(p)
 elif os.path.exists(p):os.remove(p)
report={'version':payload[0],'modules':12,'questions':sum(len(x[3]) for x in mods),'anki':sum(len(x[4]) for x in mods),'theorySections':sum(len(x[2][7]) for x in mods),'nonDestructive':True}
open(ROOT+'/cf-audit/INTEGRATION_REPORT.json','w').write(json.dumps(report,ensure_ascii=False,indent=2))
assert report['questions']==503,report
assert report['anki']==1024,report
print(json.dumps(report,ensure_ascii=False))
