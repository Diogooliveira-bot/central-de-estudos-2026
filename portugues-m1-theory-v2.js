/* Português M1 — teoria v2
 * Aprofundamento das sessões S1-S3 com base no PDF oficial.
 * Camada de conteúdo: não grava progresso nem altera a chave do M1.
 */
(function(){
'use strict';
if(window.__PT_M1_THEORY_V2__)return;window.__PT_M1_THEORY_V2__=true;

var LESSONS={
 s1:{
  title:'S1 — Fundamentos de fonologia',
  source:'PDF 1, p. 3–20',
  lead:'Antes de decorar regras de acentuação, você precisa enxergar a estrutura sonora da palavra. Esta sessão serve para impedir os erros de base: confundir letra com som, dígrafo com encontro consonantal e dígrafo nasal com ditongo nasal.',
  parts:[
   {kind:'text',title:'1. Acento tônico não é acento gráfico',html:'<p><strong>Acento tônico</strong> pertence à fala: indica a sílaba pronunciada com maior intensidade. <strong>Acento gráfico</strong> pertence à escrita e só aparece quando uma regra ortográfica determina. Em <em>saci</em>, a sílaba <strong>ci</strong> é tônica, mas não recebe sinal gráfico; em <em>café</em>, a sílaba final é tônica e também recebe acento gráfico.</p><p>Isso explica por que toda palavra com duas ou mais sílabas tem tonicidade, mas nem toda palavra tem acento escrito. O material também usa pares como <em>sabia / sabiá / sábia</em> para mostrar que a posição ou presença do acento pode distinguir palavras e classes gramaticais.</p>'},
   {kind:'rule',title:'Regra operacional',html:'<p>Primeiro descubra <strong>onde está a força da pronúncia</strong>. Só depois pergunte se existe uma regra que manda escrever o acento.</p>'},
   {kind:'text',title:'2. Monossílabo tônico x átono',html:'<p>O <strong>monossílabo tônico</strong> tem autonomia fonética: é pronunciado com intensidade própria, como <em>meu, pé, pó, dor</em>. O <strong>monossílabo átono</strong> se apoia foneticamente em outra palavra; isso ocorre com frequência em artigos, preposições, conjunções e pronomes, como <em>de, em, a, com</em>.</p><p>Essa distinção será decisiva em S3, porque a regra de acentuação dos monossílabos se aplica aos <strong>tônicos</strong>.</p>'},
   {kind:'text',title:'3. Letra x fonema',html:'<p><strong>Fonema</strong> é uma unidade sonora capaz de participar da formação e da distinção de palavras. <strong>Letra</strong> é a representação gráfica. A relação não é obrigatoriamente de uma letra para um som.</p><p>O PDF usa a troca de sons em palavras como <em>pato → gato</em> para mostrar que mudar um fonema pode produzir outra palavra. Já em grupos como <em>ch</em>, duas letras podem representar apenas um som. Por isso, a contagem de letras e fonemas pode ser diferente.</p>'},
   {kind:'compare',title:'4. Dígrafo x encontro consonantal',leftTitle:'Dígrafo',left:'Duas letras representam <strong>um único fonema</strong>. Exemplos recorrentes no material: CH, LH, NH, RR, SS, SC, SÇ, XC, XS e, em certas palavras, QU/GU.',rightTitle:'Encontro consonantal',right:'Há <strong>dois sons consonantais</strong>. Pode ocorrer na mesma sílaba, como em <em>cli-ma</em> e <em>flo-res</em>, ou em sílabas diferentes, como em <em>ad-ven-to</em>.'},
   {kind:'trap',title:'Pegadinha — QU e GU',html:'<p>Não classifique QU ou GU automaticamente como dígrafo. Pergunte: <strong>o U é pronunciado?</strong> Em <em>quente</em>, o U não tem som próprio e o grupo funciona como dígrafo. Em palavras em que as duas letras são pronunciadas, a análise muda. O próprio PDF usa esse contraste para mostrar por que a pronúncia decide a classificação.</p>'},
   {kind:'text',title:'5. Dígrafos vocálicos',html:'<p>Nos grupos AM/AN, EM/EN, IM/IN, OM/ON e UM/UN, M ou N podem apenas <strong>nasalizar a vogal anterior</strong>. Nessa situação, o grupo representa um som vocálico nasal; M/N não conta como uma consoante independente.</p><p>Isso evita um erro clássico: enxergar encontro consonantal onde não existe. Se o N apenas nasaliza a vogal em um dígrafo vocálico, ele não forma, por si só, encontro consonantal com a letra seguinte.</p>'},
   {kind:'example',title:'Exemplo de prova — “processo”',html:'<p>Em <em>processo</em>, <strong>PR</strong> é encontro consonantal, porque há dois sons consonantais; <strong>SS</strong> é dígrafo, porque duas letras representam um único som. A questão pode colocar as duas estruturas dentro da mesma palavra para testar se você realmente distingue som de grafia.</p>'},
   {kind:'text',title:'6. Separação silábica e vogal',html:'<p>O material reforça que cada sílaba precisa ter uma vogal. Compare <em>pa-ís</em>, em que há duas vogais em sílabas diferentes, com <em>pais</em>, em que A funciona como vogal e I como semivogal na mesma sílaba. Essa ponte leva diretamente à sessão seguinte.</p>'}
  ],
  remember:['Acento tônico = fala; acento gráfico = escrita.','Fonema = som; letra = representação gráfica.','Dígrafo = 2 letras, 1 fonema.','Encontro consonantal = 2 sons consonantais.','QU/GU só podem ser classificados corretamente observando a pronúncia do U.','M/N de dígrafo vocálico apenas nasalizam a vogal.']
 },
 s2:{
  title:'S2 — Encontros vocálicos',
  source:'PDF 1, p. 9–20',
  lead:'Aqui o objetivo é reconhecer quantos sons vocálicos existem e se eles permanecem na mesma sílaba. Essa leitura evita erros posteriores em acentuação, principalmente nas paroxítonas terminadas em ditongo e na regra do hiato.',
  parts:[
   {kind:'text',title:'1. Vogal x semivogal',html:'<p>Em uma sílaba, a <strong>vogal</strong> é o som vocálico de maior intensidade; a <strong>semivogal</strong> é o som vocálico mais fraco que acompanha a vogal. Essa relação de força permite entender ditongos e tritongos.</p>'},
   {kind:'rule',title:'Método antes de classificar',html:'<p><strong>1)</strong> Separe as sílabas. <strong>2)</strong> Observe se os sons vocálicos ficaram juntos ou separados. <strong>3)</strong> Dentro da sílaba, identifique o som mais forte. Só então dê o nome: ditongo, tritongo ou hiato.</p>'},
   {kind:'text',title:'2. Ditongo',html:'<p><strong>Ditongo</strong> é o encontro de uma vogal e uma semivogal <strong>na mesma sílaba</strong>. Se a semivogal vem antes e a vogal depois, temos ditongo <strong>crescente</strong>; se a vogal vem primeiro e a semivogal depois, temos ditongo <strong>decrescente</strong>.</p><p>O PDF ressalta que a banca normalmente não exige a classificação crescente/decrescente isoladamente, mas ela pode ser necessária para justificar regras de acentuação. Exemplos usados no material incluem <em>história, primário</em> para crescentes e <em>meu, paisagem, imóveis</em> para decrescentes.</p>'},
   {kind:'trap',title:'Pegadinha — ditongos abertos',html:'<p>ÉI, ÓI e ÉU são ditongos abertos e <strong>decrescentes</strong>: o primeiro som vocálico é o mais forte. Essa informação reaparece em S3, quando veremos por que <em>herói</em> mantém o acento, mas <em>heroico</em> não.</p>'},
   {kind:'text',title:'3. Tritongo',html:'<p><strong>Tritongo</strong> é a sequência semivogal + vogal + semivogal dentro da mesma sílaba. O material apresenta exemplos como <em>Uruguai, iguais, saguão</em>. Em certas terminações, M pode representar foneticamente uma semivogal, como nas formas citadas <em>águam</em> e <em>deságuem</em>.</p>'},
   {kind:'text',title:'4. Hiato',html:'<p><strong>Hiato</strong> ocorre quando duas vogais ficam em <strong>sílabas diferentes</strong>: <em>sa-ú-de, pa-í-ses, ve-í-cu-lo</em>. A comparação que você deve dominar é <strong>pais x país</strong>: em <em>pais</em>, os sons vocálicos permanecem na mesma sílaba; em <em>pa-ís</em>, há separação e, portanto, hiato.</p>'},
   {kind:'compare',title:'5. Dígrafo nasal x ditongo nasal',leftTitle:'Dígrafo nasal',left:'M/N apenas nasaliza a vogal anterior: há <strong>um som vocálico nasal</strong>. Exemplos do PDF: AM em <em>amplo</em>, EN em <em>entre</em>.',rightTitle:'Ditongo nasal',right:'Há <strong>dois sons vocálicos</strong>, vogal + semivogal. O material destaca AM/EM em final de palavra, como <em>chegam</em> e <em>batem</em>, em que a realização fonética é de ditongo nasal.'},
   {kind:'example',title:'Como a banca mistura conceitos',html:'<p>Em <em>amadurecimento</em>, o grupo <strong>EN</strong> é tratado no material como dígrafo vocálico: N nasaliza E e não funciona como consoante independente. Logo, não se deve inventar um encontro consonantal “n-t”. Esse tipo de alternativa é construído para quem olha apenas para as letras.</p>'},
   {kind:'text',title:'6. Glide ou falso hiato — baixa prioridade',html:'<p>O PDF registra o fenômeno do <strong>glide</strong> em sequências como <em>praia, meio, joia</em>, em que a semivogal de um ditongo decrescente anterior se relaciona com a vogal seguinte. É conteúdo de prioridade menor. Para a sua primeira volta, o domínio obrigatório é: ditongo, tritongo, hiato e a diferença entre dígrafo nasal e ditongo nasal.</p>'}
  ],
  remember:['Ditongo = vogal + semivogal na mesma sílaba.','Crescente: semivogal → vogal; decrescente: vogal → semivogal.','Tritongo = semivogal + vogal + semivogal na mesma sílaba.','Hiato = duas vogais em sílabas diferentes.','Pais ≠ país.','Dígrafo nasal tem um som vocálico; ditongo nasal tem dois sons vocálicos.']
 },
 s3:{
  title:'S3 — Regras gerais de acentuação',
  source:'PDF 1, p. 21–35',
  lead:'Acentuação fica muito mais simples quando você para de decorar palavras e passa a seguir uma ordem fixa: localizar a sílaba tônica, classificar a palavra e só então olhar a terminação.',
  parts:[
   {kind:'rule',title:'Procedimento de resolução',html:'<p><strong>Passo 1 — tonicidade:</strong> última = oxítona; penúltima = paroxítona; antepenúltima = proparoxítona. <strong>Passo 2 — terminação:</strong> veja em que letras ou ditongo a palavra termina. <strong>Passo 3 — regra:</strong> encaixe tonicidade + terminação. <strong>Passo 4 — comparação:</strong> se a questão disser que duas palavras seguem a mesma regra, compare primeiro a tonicidade.</p>'},
   {kind:'text',title:'1. Monossílabos tônicos',html:'<p>São acentuados os monossílabos tônicos terminados em <strong>A(S), E(S), O(S)</strong> e em ditongos abertos <strong>ÉU(S), ÉI(S), ÓI(S)</strong>. Exemplos do material: <em>pá, pés, pó, céu, réis, dói</em>.</p><p>Não misture essa regra com a das oxítonas. Uma palavra de uma sílaba recebe a justificativa de <strong>monossílabo tônico</strong>, mesmo que a terminação se pareça com a de uma oxítona acentuada.</p>'},
   {kind:'text',title:'2. Oxítonas',html:'<p>São acentuadas as oxítonas terminadas em <strong>A(S), E(S), O(S), EM, ENS</strong> e também nos ditongos abertos <strong>ÉU(S), ÉI(S), ÓI(S)</strong>. Exemplos: <em>sofá, café, cipó, também, parabéns, chapéu, papéis, herói</em>.</p>'},
   {kind:'trap',title:'Pegadinha — “mesma regra”',html:'<p>O PDF ensina uma eliminação muito poderosa: se duas palavras têm <strong>tonicidades diferentes</strong>, normalmente não foram acentuadas pela mesma regra. Assim, uma oxítona e uma paroxítona não devem ser agrupadas só porque terminam com letras parecidas. A exceção importante, estudada em S4, é a <strong>regra do hiato</strong>, que pode alcançar oxítonas e paroxítonas.</p>'},
   {kind:'text',title:'3. Paroxítonas — regra geral residual',html:'<p>A lógica é inversa à das oxítonas: pela regra geral, acentuam-se as paroxítonas que <strong>não terminam em A(S), E(S), O(S), EM, ENS</strong>. O próprio PDF chama essa lógica de regra residual. Por isso, palavras de terminações diferentes — como <em>amável, bíceps, caráter</em> — podem estar justificadas pela mesma regra geral de paroxítonas.</p>'},
   {kind:'text',title:'4. Paroxítonas terminadas em ditongo oral',html:'<p>Além da regra residual, há uma regra específica muito cobrada: <strong>acentuam-se as paroxítonas terminadas em ditongo oral</strong>. O material exemplifica com <em>história, série, água, imóveis, primário, rádio, indústria</em>.</p><p>Cuidado com uma leitura superficial: <em>água</em> não deve ser analisada simplesmente como palavra “terminada em A”; sua terminação contém o ditongo <strong>ua</strong>.</p>'},
   {kind:'compare',title:'5. Novo Acordo — ditongos abertos',leftTitle:'Paroxítona',left:'EI e OI abertos perderam o acento: <em>ideia, assembleia, heroico, jiboia, asteroide</em>.',rightTitle:'Oxítona',right:'O acento permanece: <em>papéis, herói, corrói, constrói</em>. A posição da sílaba tônica muda a regra.'},
   {kind:'text',title:'6. Proparoxítonas',html:'<p>A regra é direta: <strong>todas as proparoxítonas são acentuadas</strong>. A terminação não precisa ser examinada para justificar o acento. Exemplos do material incluem <em>médico, lâmpada, específico, matemática</em>.</p>'},
   {kind:'example',title:'7. Hífen x hifens / item x itens',html:'<p><em>Hífen</em> é paroxítona terminada em N e recebe acento. <em>Hifens</em> termina em ENS e, por isso, fica fora da regra geral das paroxítonas acentuadas. Pelo mesmo raciocínio, <em>item</em> e <em>itens</em> não são acentuados: são paroxítonas terminadas em EM/ENS.</p>'},
   {kind:'trap',title:'8. Proparoxítonas aparentes',html:'<p>O PDF registra a análise alternativa de palavras como <em>história, série, glória</em> como proparoxítonas aparentes/eventuais. Para concurso, porém, a orientação do próprio material é priorizar a análise tradicional: <strong>paroxítonas terminadas em ditongo crescente</strong>, salvo quando a banca sinalizar expressamente a análise alternativa.</p>'},
   {kind:'rule',title:'Atalho mental para a prova',html:'<p>Ao ver duas palavras e a pergunta “são acentuadas pela mesma regra?”, faça nesta ordem: <strong>1)</strong> separe as sílabas; <strong>2)</strong> localize a tônica; <strong>3)</strong> compare a classe tônica; <strong>4)</strong> confira a terminação; <strong>5)</strong> só depois procure regra especial, como hiato. Esse processo é mais seguro do que tentar lembrar uma lista de exemplos.</p>'}
  ],
  remember:['Primeiro tonicidade; depois terminação.','Monossílabo tônico: A/E/O + ÉU/ÉI/ÓI.','Oxítona: A/E/O/EM/ENS + ÉU/ÉI/ÓI.','Paroxítona: regra residual + regra específica do ditongo oral.','Proparoxítona: todas são acentuadas.','Ideia/heroico sem acento; papéis/herói com acento.','Tonicidades diferentes normalmente significam regras diferentes; lembre da exceção do hiato.']
 }
};

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function css(){
 if(document.getElementById('pt-m1-theory-v2-style'))return;
 var e=document.createElement('style');e.id='pt-m1-theory-v2-style';e.textContent=`
 .ptm1-theory-v2 .ptm1-theory-lead{margin:0 0 22px;padding:0 0 16px;border-bottom:1px solid var(--line);font-size:var(--central-reading-font-large,16px)!important;line-height:1.72;color:var(--text)}
 .ptm1-theory-v2 .ptm1-lesson{padding:0 0 20px;margin:0 0 20px}
 .ptm1-theory-v2 .ptm1-lesson h4{font-size:15px;margin:0 0 8px}
 .ptm1-theory-v2 .ptm1-lesson p{margin:0 0 10px}.ptm1-theory-v2 .ptm1-lesson p:last-child{margin-bottom:0}
 .ptm1-theory-v2 .ptm1-box{margin:4px 0 20px;padding:14px 16px;border-radius:5px;background:color-mix(in srgb,var(--panel2) 72%,transparent)}
 .ptm1-theory-v2 .ptm1-box h4{font-size:12px;margin:0 0 7px}.ptm1-theory-v2 .ptm1-box p{font-size:var(--central-reading-font-large,16px)!important;line-height:1.68;margin:0}
 .ptm1-theory-v2 .ptm1-rule{border-left:3px solid var(--purple)}.ptm1-theory-v2 .ptm1-trap{border-left:3px solid var(--yellow)}.ptm1-theory-v2 .ptm1-example{border-left:3px solid var(--green)}
 .ptm1-theory-v2 .ptm1-compare{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:4px 0 20px}.ptm1-theory-v2 .ptm1-compare-card{padding:14px 16px;border:1px solid var(--line);border-radius:5px}.ptm1-theory-v2 .ptm1-compare-card b{display:block;font-size:12px;margin-bottom:6px}.ptm1-theory-v2 .ptm1-compare-card p{font-size:var(--central-reading-font-large,16px)!important;line-height:1.68;margin:0}
 @media(max-width:680px){.ptm1-theory-v2 .ptm1-compare{grid-template-columns:1fr}}
 `;document.head.appendChild(e);
}
function partHtml(p){
 if(p.kind==='compare')return '<section class="ptm1-compare"><div class="ptm1-compare-card"><b>'+esc(p.leftTitle)+'</b><p>'+p.left+'</p></div><div class="ptm1-compare-card"><b>'+esc(p.rightTitle)+'</b><p>'+p.right+'</p></div></section>';
 if(p.kind==='rule'||p.kind==='trap'||p.kind==='example')return '<section class="ptm1-box ptm1-'+p.kind+'"><h4>'+esc(p.title)+'</h4>'+p.html+'</section>';
 return '<section class="ptm1-lesson"><h4>'+esc(p.title)+'</h4>'+p.html+'</section>';
}
function block(id){
 var t=LESSONS[id];if(!t)return '';
 return '<article class="ptm1-theory ptm1-theory-v2"><div class="ptm1-theory-head"><b>'+esc(t.title)+'</b><small>Base teórica oficial: '+esc(t.source)+'</small></div><div class="ptm1-theory-body"><p class="ptm1-theory-lead">'+esc(t.lead)+'</p>'+t.parts.map(partHtml).join('')+'<div class="ptm1-memory"><b>O que levar para a prova</b><ul>'+t.remember.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div></div></article>';
}
function enhance(html){
 css();var host=document.createElement('div');host.innerHTML=html;
 Object.keys(LESSONS).forEach(function(id){var section=host.querySelector('[data-ptm1="'+id+'"]');if(!section)return;var old=section.querySelector('.ptm1-theory');if(old)old.outerHTML=block(id)});
 return host.innerHTML;
}
function install(){
 if(typeof window.renderPortugueseMaster!=='function')return setTimeout(install,70);
 if(window.renderPortugueseMaster.__theoryV2)return;
 var base=window.renderPortugueseMaster;var wrapped=function(){return enhance(base())};wrapped.__theoryV2=true;window.renderPortugueseMaster=wrapped;
 try{if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT M1 THEORY V2]',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
