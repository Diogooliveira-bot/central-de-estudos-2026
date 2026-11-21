from pathlib import Path
from PIL import Image, ImageFont
import html,json,base64,subprocess
ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'data.json').read_text())
ASSET=ROOT/'template-assets'
OUT=ROOT/'png'; SVG=ROOT/'svg'; APP_ROOT=ROOT.parent.parent if ROOT.name=='cf-m14' and ROOT.parent.name=='artes' else ROOT.parent
WEBP=APP_ROOT/'assets/cf/revisao-guiada/m14'
for p in (OUT,SVG,WEBP): p.mkdir(parents=True,exist_ok=True)
REG='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
BOLD='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
logo=base64.b64encode((ASSET/'logo.png').read_bytes()).decode()
mascot=base64.b64encode((ASSET/'mascote.png').read_bytes()).decode()
NAVY='#073d78'; CYAN='#12b8dc'; YELLOW='#ffd442'; BODY='#111820'
ICONS={
'work':'<rect x="25" y="34" width="50" height="42" rx="5"/><path d="M38 34v-9h24v9M25 48h50M43 47v9h14v-9"/>',
'scales':'<path d="M50 18v60m-23 3h46M50 25 20 41m30-16 30 16M19 42 8 64h23L19 42zm62 0L70 64h23L81 42z"/>',
'people':'<circle cx="38" cy="34" r="9"/><circle cx="64" cy="34" r="9"/><path d="M18 78c2-17 9-27 20-27s18 10 20 27m-7 0c2-17 8-27 19-27s17 10 19 27"/>',
'alert':'<path d="M50 15 88 82H12z"/><path d="M50 38v21m0 11v1" stroke="#fff" stroke-width="7"/>',
'heart':'<path d="M50 80S17 61 17 39c0-19 25-25 33-8 8-17 33-11 33 8 0 22-33 41-33 41z"/><path d="M24 50h16l7-12 9 24 7-12h17"/>',
'shield':'<path d="M50 14 82 26v25c0 18-12 29-32 39-20-10-32-21-32-39V26z"/><path d="m34 50 11 11 22-23"/>',
'hand':'<path d="M50 78c-15-9-26-15-26-30 0-11 14-16 22-5l4 6V26c0-8 12-8 12 0v19l4-6c6-8 17-3 13 7l-5 17c-3 9-10 15-24 15z"/>',
'globe':'<circle cx="50" cy="50" r="35"/><path d="M15 50h70M50 15c12 12 12 58 0 70M50 15c-12 12-12 58 0 70M23 31h54M23 69h54"/>',
'city':'<path d="M17 80V43h22v37m0-55h25v55m0-39h19v39M12 82h76"/><path d="M26 52v6m0 8v6m24-35v7m0 8v7m0 8v7m22-7v7"/>',
'filter':'<path d="M17 23h66L58 48v25l-16 8V48z"/>',
'coins':'<ellipse cx="50" cy="30" rx="28" ry="10"/><path d="M22 30v15c0 6 13 11 28 11s28-5 28-11V30M22 45v15c0 6 13 11 28 11s28-5 28-11V45M22 60v9c0 6 13 11 28 11s28-5 28-11v-9"/>',
'budget':'<path d="M18 78h64M24 68h13V50H24zm22 0h13V37H46zm22 0h13V22H68z"/><path d="m20 39 22-15 14 5 25-19"/>',
'hospital':'<path d="M24 82V23h52v59M16 82h68"/><path d="M40 37h20m-10-10v20m-18 9h8m12 0h8m-28 12h8m12 0h8"/>',
'network':'<circle cx="50" cy="24" r="9"/><circle cx="24" cy="72" r="9"/><circle cx="76" cy="72" r="9"/><path d="m45 32-16 31m25-31 16 31M33 72h34"/>',
'handshake':'<path d="m13 45 18-18 18 7 11-6 27 21-15 17-17-9-11 8-15-10-8 7-13-17z"/><path d="m43 51 13 11m-22-4 10 8m-18-7 8 8"/>',
'worker':'<circle cx="50" cy="31" r="12"/><path d="M24 80c2-20 11-31 26-31s24 11 26 31M32 23h36"/><path d="M37 38h26"/>',
'calendar':'<rect x="18" y="24" width="64" height="58" rx="6"/><path d="M32 16v16m36-16v16M19 42h62M32 56h13m8 0h14m-35 13h13"/>',
'savings':'<path d="M21 43c4-14 15-22 31-22 13 0 22 6 27 17l9 4-5 9v15H28l-9-9V46z"/><circle cx="61" cy="37" r="2"/><path d="M31 66v12m38-12v12M47 20v-7m15 9 7-7"/>',
'check':'<rect x="20" y="17" width="60" height="68" rx="6"/><path d="M32 35h34M32 48h34M32 61h13m7 10 7 7 15-18"/>',
'building':'<path d="M50 17 15 34h70L50 17zM22 41h56M26 44v30m16-30v30m16-30v30m16-30v30M18 78h64"/>',
'community':'<circle cx="50" cy="27" r="9"/><circle cx="25" cy="40" r="7"/><circle cx="75" cy="40" r="7"/><path d="M27 79c1-18 8-27 23-27s22 9 23 27M10 75c1-13 6-20 16-22m48 0c10 2 15 9 16 22"/>',
'route':'<circle cx="24" cy="28" r="8"/><circle cx="76" cy="72" r="8"/><path d="M32 28h17c15 0 20 8 20 18s-5 17-20 17H36c-9 0-12 4-12 9"/>',
'plus':'<circle cx="50" cy="50" r="34"/><path d="M50 30v40M30 50h40"/>',
'home':'<path d="m14 49 36-31 36 31M23 43v39h54V43M44 82V57h13v25"/>',
'key':'<circle cx="35" cy="49" r="17"/><path d="M52 49h31m-11 0v10m-9-10v7"/>',
'link':'<path d="M39 60 31 68a16 16 0 0 1-23-23l15-15a16 16 0 0 1 23 0m15 10 8-8a16 16 0 0 1 23 23L77 70a16 16 0 0 1-23 0"/><path d="m35 55 30-30"/>',
}
# The four icons are semantic per chapter: concept, application, constitutional rule and exam trap.
SETS=[
['work','scales','heart','alert'],['heart','shield','hand','alert'],['globe','city','shield','alert'],['filter','coins','scales','alert'],['coins','budget','shield','alert'],['heart','hospital','plus','alert'],['network','hospital','community','alert'],['hospital','handshake','link','alert'],['worker','community','shield','alert'],['calendar','coins','scales','alert'],['savings','check','link','alert'],['people','hand','check','alert'],['building','community','route','alert'],['home','people','route','alert']]

def esc(v): return html.escape(str(v),quote=True)
def wrap(text,font,width):
 out=[]; row=''
 for word in str(text).split():
  nxt=(row+' '+word).strip()
  if row and font.getlength(nxt)>width: out.append(row); row=word
  else: row=nxt
 if row: out.append(row)
 return out
def tblock(x,y,value,size,width,color=BODY,bold=False,leading=None,anchor='start',max_lines=None,minsize=None):
 fontpath=BOLD if bold else REG
 while True:
  font=ImageFont.truetype(fontpath,size); ls=wrap(value,font,width)
  if (not max_lines or len(ls)<=max_lines) or (minsize and size<=minsize): break
  size-=1
 leading=leading or int(size*1.2)
 spans=''.join(f'<tspan x="{x}" dy="{0 if i==0 else leading}">{esc(line)}</tspan>' for i,line in enumerate(ls))
 return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Liberation Sans,Arial,sans-serif" font-size="{size}px" font-weight="{700 if bold else 400}" fill="{color}">{spans}</text>',len(ls),size
def icon(name,x,y):
 body=ICONS[name]
 return f'<g transform="translate({x} {y})"><circle cx="50" cy="50" r="47" fill="{NAVY}"/><g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">{body}</g></g>'

for i,item in enumerate(DATA,1):
 svg=['<svg xmlns="http://www.w3.org/2000/svg" width="1229" height="1536" viewBox="0 0 1229 1536"><rect width="1229" height="1536" fill="#fff"/>']
 svg.append(f'<image x="160" y="0" width="910" height="172" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{logo}"/>')
 svg.append(f'<image x="0" y="225" width="355" height="580" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{mascot}"/>')
 svg+=['<rect x="261" y="176" width="836" height="105" rx="53" fill="#064980"/>','<text x="679" y="249" text-anchor="middle" font-family="Liberation Sans,Arial" font-size="64px" font-weight="700" fill="#fff">Constituição Federal</text>',f'<rect x="447" y="266" width="449" height="80" rx="40" fill="#08c0dc"/><text x="671" y="322" text-anchor="middle" font-family="Liberation Sans,Arial" font-size="49px" font-weight="700" fill="#071a31">Capítulo {i}</text>','<rect x="341" y="352" width="845" height="70" rx="35" fill="#c5e9fb"/>']
 title_size=35
 while title_size>24 and ImageFont.truetype(BOLD,title_size).getlength(item['title'])>805: title_size-=1
 svg.append(f'<text x="763" y="397" text-anchor="middle" font-family="Liberation Sans,Arial,sans-serif" font-size="{title_size}px" font-weight="700" fill="#071a3b">{esc(item["title"])}</text>')
 svg += ['<rect x="380" y="475" width="676" height="262" rx="34" fill="#fff" stroke="#0b477f" stroke-width="4"/>','<rect x="489" y="435" width="454" height="68" rx="34" fill="#a9def4"/>','<g transform="translate(517 447)" fill="none" stroke="#073f78" stroke-width="4"><path d="M2 4c10-4 18-3 25 2v35c-7-5-15-6-25-2zM52 4c-10-4-18-3-25 2v35c7-5 15-6 25-2z"/><path d="M8 12h12M8 19h12M34 12h12M34 19h12" stroke-linecap="round"/></g>','<text x="748" y="480" text-anchor="middle" font-family="Liberation Sans,Arial" font-size="40px" font-weight="700" fill="#073f78">Ponto central</text>']
 central=item['central'].replace('\n',' ')
 point,_,_=tblock(423,532,central,29,590,BODY,False,35,'start',6,23); svg.append(point)
 svg.append('<path d="M618 736v62" stroke="#0b477f" stroke-width="5"/>')
 cards=[(28,805),(623,805),(28,1048),(623,1048)]
 carddata=[('Conceito-chave',item['example']),('Regra constitucional',item['rule']),('Ponto importante',item['detail']),('Pegadinha de prova',item['trap'])]
 for n,((x,y),(head,body),iconname) in enumerate(zip(cards,carddata,SETS[i-1])):
  svg.append(f'<rect x="{x}" y="{y}" width="578" height="220" rx="27" fill="#fbfeff" stroke="{CYAN}" stroke-width="3"/>')
  svg.append(f'<path d="M{x+171} {y+24}v172" stroke="{CYAN}" stroke-width="4"/>')
  svg.append(icon(iconname,x+34,y+58))
  hx=x+194; headtext,hl,_=tblock(hx,y+45,head,27,356,BODY,True,32,'start',2,23); svg.append(headtext)
  bodytext,bl,_=tblock(hx,y+91,body,24,356,BODY,False,29,'start',4,20)
  if bl>4: bodytext,bl,_=tblock(hx,y+91,body,20,356,BODY,False,24,'start',5,18)
  svg.append(bodytext)
 svg += ['<rect x="19" y="1308" width="1191" height="211" rx="48" fill="#d6f3ff"/>','<rect x="19" y="1308" width="362" height="211" rx="48" fill="#064b88"/>','<g transform="translate(64 1357)" fill="none" stroke="#ffd724" stroke-width="6" stroke-linecap="round"><path d="M20 8a29 29 0 0 1 35 0c10 8 12 22 4 33-5 6-8 11-9 17H25c-1-6-4-11-9-17C8 30 10 16 20 8z" fill="#ffd724"/><path d="M27 63h21M29 72h17M32 80h11" stroke="#fff"/><path d="M37 -7v-10M7 8l-8-6M69 8l8-6M6 43l-10 2M71 43l10 2"/></g>','<text x="157" y="1401" font-size="42px" font-family="Liberation Sans,Arial" font-weight="700" fill="#fff">Dica de</text>','<text x="157" y="1450" font-size="42px" font-family="Liberation Sans,Arial" font-weight="700" fill="#fff">Prova</text>','<path d="M402 1330v165" stroke="#06457f" stroke-width="4"/>']
 for j,t in enumerate([item['memory'],item['check']]):
  yy=1366+j*65; svg.append(f'<text x="432" y="{yy}" font-size="34px" font-family="Liberation Sans,Arial" font-weight="700" fill="#07508a">✓</text>')
  tip,_,_=tblock(482,yy,t,28,696,'#101820',False,32,'start',2,23); svg.append(tip)
 svg.append(f'<text x="1200" y="1530" text-anchor="end" font-family="Liberation Sans,Arial" font-size="12px" fill="#527089">BASE COMPLETA · REVISÃO GUIADA · CF M14 · C{i:02d}</text></svg>')
 text='\n'.join(svg); sp=SVG/f'CF-M14-C{i:02d}.svg'; pp=OUT/f'CF-M14-C{i:02d}.png'; wp=WEBP/f'CF-M14-C{i:02d}.webp'
 sp.write_text(text,encoding='utf-8')
 subprocess.run(['inkscape',str(sp),'--export-type=png',f'--export-filename={pp}','--export-width=1229','--export-height=1536'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 Image.open(pp).save(wp,'WEBP',quality=88,method=6)
 print(f'{pp.name}: {Image.open(pp).size}, {pp.stat().st_size} bytes')
print(f'Generated {len(DATA)} chapter art pairs with four relevant semantic icons each.')
