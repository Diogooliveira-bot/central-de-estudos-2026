import base64, html, json, subprocess
from pathlib import Path
from PIL import Image, ImageFont
ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'data.json').read_text(encoding='utf-8'))
ASSET=ROOT/'template-assets'
OUT=ROOT/'png'; OUT.mkdir(exist_ok=True)
WEBP=ROOT.parents[1]/'assets/cf/revisao-guiada/m10'; WEBP.mkdir(parents=True,exist_ok=True)
REG='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'; BOLD='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
logo=base64.b64encode((ASSET/'logo.png').read_bytes()).decode(); mascot=base64.b64encode((ASSET/'mascote.png').read_bytes()).decode()
NAVY='#073d78'; BLUE='#07508a'; YELLOW='#ffd442'
# Four different, chapter-specific pictograms per art. Each symbol is a hand-authored vector, not a repeated decorative sticker.
GLYPHS={
'people':'<circle cx="40" cy="34" r="10"/><circle cx="70" cy="34" r="10"/><path d="M20 78c2-16 10-24 20-24s18 8 20 24M50 78c2-16 10-24 20-24s18 8 20 24"/>',
'dashboard':'<rect x="18" y="20" width="64" height="62" rx="8"/><path d="M32 64V50m18 14V38m18 26V29M30 31h12"/>',
'clipboard':'<rect x="27" y="20" width="47" height="65" rx="5"/><path d="M39 20v-6h23v6M36 41h28M36 52h28M36 63h15m7 10 7 7 13-16"/>',
'no-appeal':'<path d="M50 16 18 31h64L50 16zM24 38h52M27 42v29m15-29v29m16-29v29m15-29v29M20 76h60"/><path d="m29 23 43 54" stroke="#ffd442" stroke-width="7"/>',
'court':'<path d="M50 17 15 32h70L50 17zM22 39h56M25 42v31m16-31v31m18-31v31m16-31v31M19 77h62M14 85h72"/>',
'age':'<circle cx="50" cy="50" r="35"/><path d="M50 27v25l17 11M21 24l-8-8m66 8 8-8"/>',
'senate':'<path d="M50 16 16 32h68L50 16zM22 39h56M27 42v29m16-29v29m16-29v29m16-29v29M20 76h60"/><path d="M37 84h26"/>',
'federal-law':'<path d="M20 25c14-7 25-5 30 2 5-7 16-9 30-2v51c-14-7-25-5-30 2-5-7-16-9-30-2zM50 27v51M28 38h14m-14 9h14m16-9h14m-14 9h14"/>',
'treaty':'<path d="M22 18h56v65H22zM32 34h36M32 46h36M32 58h23"/><path d="m57 71 8 8 16-20"/>',
'government-act':'<path d="M50 16 16 31h68L50 16zM23 39h54M27 42v30m16-30v30m16-30v30m16-30v30M19 77h62"/><path d="m70 18 12 10"/>',
'split-courts':'<circle cx="50" cy="20" r="9"/><circle cx="25" cy="75" r="9"/><circle cx="75" cy="75" r="9"/><path d="M50 29v17m0 0H25v20m25-20h25v20"/>',
'appeal-trap':'<path d="M17 50h65m-11-11 11 11-11 11M83 70H18m11-11L18 70l11 11"/><path d="M26 18 74 82"/>',
'magnifier':'<circle cx="43" cy="42" r="24"/><path d="m61 60 21 22M32 42h22m-11-11v22"/>',
'two-thirds':'<text x="50" y="63" text-anchor="middle" font-size="34" font-weight="700" fill="#fff" stroke="none">2/3</text>',
'presumed':'<path d="m50 15 10 22 24 3-18 16 5 24-21-12-21 12 5-24-18-16 24-3z"/>',
'calendar-law':'<rect x="18" y="24" width="64" height="58" rx="6"/><path d="M31 16v17m38-17v17M19 42h62M32 57h14m8 0h12m-34 12h14"/>',
'work-court':'<path d="M50 18 18 33h64L50 18zM24 40h52M27 43v28m15-28v28m16-28v28m15-28v28M20 76h60"/><path d="M35 29v-7h30v7"/>',
'27':'<text x="50" y="64" text-anchor="middle" font-size="37" font-weight="700" fill="#fff" stroke="none">27</text>',
'regional-court':'<path d="M50 17 16 32h68L50 17zM22 39h56M25 42v30m16-30v30m18-30v30m16-30v30M19 77h62"/><path d="M40 85h20"/>',
'number-trap':'<circle cx="50" cy="50" r="34"/><text x="50" y="63" text-anchor="middle" font-size="40" font-weight="700" fill="#fff" stroke="none">#</text>',
'contract':'<path d="M25 33h50v48H25zM38 33v-9h24v9M36 50h28m-28 11h28m-28 11h18"/>',
'strike':'<path d="M37 79V48c0-5 7-5 7 0V34c0-6 8-6 8 0v13V28c0-6 8-6 8 0v19V34c0-6 8-6 8 0v17l4-8c3-5 10-1 7 4L66 75c-2 4-6 7-12 7H46c-4 0-9-1-9-3z"/>',
'compensation':'<path d="M50 16v55m-20 14h40M50 18 20 34m30-16 30 16M19 36 8 60h23L19 36zm62 0L70 60h23L81 36z"/><path d="M8 63c3 9 19 9 23 0m39 0c4 9 20 9 23 0"/>',
'statute-trap':'<path d="M50 16 87 81H13z"/><path d="M50 38v21m0 11v1" stroke="#fff" stroke-width="7"/>',
'council':'<circle cx="50" cy="28" r="11"/><circle cx="27" cy="39" r="8"/><circle cx="73" cy="39" r="8"/><path d="M28 79c0-17 8-27 22-27s22 10 22 27M12 76c0-13 5-21 15-23m66 23c0-13-5-21-15-23"/>',
'budget':'<path d="M18 79h64M25 69h12V50H25zm21 0h12V33H46zm21 0h12V20H67z"/><path d="m21 38 20-12 15 5 23-20"/>',
'court-levels':'<rect x="19" y="18" width="62" height="22" rx="4"/><rect x="26" y="57" width="48" height="22" rx="4"/><path d="M50 40v17m-6-6 6 6 6-6"/>',
'admin-not-appeal':'<path d="M50 18 20 31v23c0 18 13 28 30 36 17-8 30-18 30-36V31z"/><path d="M36 50h28M50 36v28"/>',
'federal-map':'<path d="m22 23 20-7 18 9 17-5 7 21-10 18 4 22-18 2-12-16-16 5-12-17 4-17z"/><circle cx="60" cy="51" r="5" fill="#ffd442" stroke="none"/>',
'seven':'<circle cx="50" cy="50" r="34"/><text x="50" y="64" text-anchor="middle" font-size="40" font-weight="700" fill="#fff" stroke="none">7</text>',
'court-hierarchy':'<path d="M50 18 18 32h64L50 18zM24 39h52M27 42v28m15-28v28m16-28v28m15-28v28M20 75h60"/><path d="M40 85h20"/>',
'regional-appeal':'<path d="M18 25h63v47H18zM31 41h36M31 53h23"/><path d="M53 83h22m-8-9 9 9-9 9"/>',
'federal-entity':'<path d="M18 29h64v48H18zM29 45h12v16H29zm21 0h12v16H50zm17 0h7v16h-7zM12 84h76"/>',
'exceptions':'<path d="M50 16 86 81H14z"/><path d="M50 37v21m0 11v1" stroke="#fff" stroke-width="7"/>',
'inss-trap':'<path d="M50 16 87 81H13z"/><text x="50" y="65" text-anchor="middle" font-size="32" font-weight="700" fill="#fff" stroke="none">!</text>',
'state-map':'<path d="m19 24 18-7 15 8 17-6 13 12-7 15 7 16-15 17-16-8-13 5-16-17 4-14z"/><circle cx="51" cy="49" r="5" fill="#ffd442" stroke="none"/>',
'capital':'<path d="M50 16 18 32h64L50 16zM24 39h52M27 42v30m15-30v30m16-30v30m15-30v30M20 77h60"/><circle cx="50" cy="26" r="3" fill="#ffd442" stroke="none"/>',
'federal-venue':'<path d="M25 18h50v65H25zM36 34h28M36 46h28M36 58h18"/><path d="m57 72 7 7 13-16"/>',
'brazil-location':'<path d="m50 16 8 8 12 1 4 11 11 6-3 12 6 10-8 8-4 12-13 1-9 9-10-6-12 2-8-10-12-4-1-12-8-9 6-12-1-11 10-6 6-11 13 3z"/><circle cx="59" cy="48" r="5" fill="#ffd442" stroke="none"/>',
'state-court':'<path d="M50 17 16 32h68L50 17zM22 39h56M25 42v31m16-31v31m18-31v31m16-31v31M19 78h62"/>',
'constitution':'<path d="M20 22h60v62H20zM31 38h38M31 50h38M31 62h27"/><path d="m58 70 7 7 13-17"/>',
'state-review':'<circle cx="42" cy="42" r="23"/><path d="m58 59 24 24M32 42h20m-10-10v20"/>',
'single-actor-trap':'<circle cx="50" cy="50" r="34"/><path d="M50 16v68M16 50h68"/>',
'military-court':'<path d="M50 17 16 32h68L50 17zM22 39h56M25 42v30m16-30v30m18-30v30m16-30v30M19 77h62"/><path d="m50 39 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#ffd442" stroke="none"/>',
'jury':'<path d="M50 16 86 81H14z"/><path d="M31 65h38M37 64l5-17m10 17-5-17m14 17-5-17"/>',
'agrarian-court':'<path d="M15 72h70M20 70l13-20 12 12 13-27 19 35"/><path d="M28 31h49M36 24l-8 7 8 7m33-14 8 7-8 7"/>',
'military-trap':'<path d="M50 16 87 81H13z"/><path d="M50 38v20m0 12v1" stroke="#fff" stroke-width="7"/>'}
GLYPHS['federal-court']=GLYPHS['court']

def esc(s): return html.escape(str(s),quote=True)
def wrap(value,font,width):
 lines=[]; cur=''
 for word in str(value).split():
  nxt=(cur+' '+word).strip()
  if cur and font.getlength(nxt)>width: lines.append(cur); cur=word
  else: cur=nxt
 if cur: lines.append(cur)
 return lines
def text(value,x,y,size,bold=False,color='#111419',width=None,line=1.16,anchor='start',max_lines=None):
 font=ImageFont.truetype(BOLD if bold else REG,size); lines=wrap(value,font,width) if width else [str(value)]
 if max_lines and len(lines)>max_lines: raise ValueError(f'{len(lines)} lines exceed {max_lines}: {value}')
 spans=''.join(f'<tspan x="{x}" dy="{0 if i==0 else size*line:.1f}">{esc(v)}</tspan>' for i,v in enumerate(lines))
 return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Liberation Sans,Arial,sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{spans}</text>'
def fit(value,width,start,minimum=22,bold=True):
 face=BOLD if bold else REG
 for size in range(start,minimum-1,-1):
  if ImageFont.truetype(face,size).getlength(value)<=width:return size
 return minimum
def icon(code,x,y):
 if code not in GLYPHS: raise ValueError(f'Unknown semantic icon {code}')
 return f'<g transform="translate({x} {y})" aria-label="{esc(code)}"><title>{esc(code)}</title><circle cx="55" cy="55" r="53" fill="{NAVY}"/><g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">{GLYPHS[code]}</g></g>'
def build(item):
 s=['''<svg xmlns="http://www.w3.org/2000/svg" width="1229" height="1536" viewBox="0 0 1229 1536">
<defs><linearGradient id="navy" x1="0" x2="1"><stop stop-color="#005399"/><stop offset=".6" stop-color="#073d78"/><stop offset="1" stop-color="#00569d"/></linearGradient><linearGradient id="cyan" x1="0" x2="1"><stop stop-color="#0bc9df"/><stop offset="1" stop-color="#00b8d7"/></linearGradient><linearGradient id="pale" x1="0" x2="1"><stop stop-color="#c2e7fb"/><stop offset="1" stop-color="#c8edff"/></linearGradient><linearGradient id="center" x1="0" x2="1"><stop stop-color="#d0edfa"/><stop offset="1" stop-color="#92d4f0"/></linearGradient><linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f4fcff"/></linearGradient><linearGradient id="tip" x1="0" x2="1"><stop stop-color="#e5f9ff"/><stop offset="1" stop-color="#c6efff"/></linearGradient></defs><rect width="1229" height="1536" fill="#fff"/>''']
 s.append(f'<image x="160" y="0" width="910" height="172" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{logo}"/>')
 s.append(f'<image x="0" y="228" width="355" height="580" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{mascot}"/>')
 s.append('<rect x="261" y="176" width="836" height="105" rx="52" fill="#07508a"/>')
 s.append(text('Constituição Federal',679,247,66,True,'#fff',780,1.06,'middle'))
 s.append('<rect x="447" y="266" width="449" height="80" rx="40" fill="url(#cyan)"/>')
 s.append(text(f'Capítulo {item["chapter"]}',671.5,322,51,True,'#041d3a',420,1.04,'middle'))
 s.append('<rect x="341" y="352" width="845" height="70" rx="35" fill="url(#pale)"/>')
 size=fit(item['title'],805,36,22)
 s.append(text(item['title'],763.5,397,size,True,'#081a32',805,1.03,'middle',2))
 s.append('<rect x="380" y="475" width="676" height="262" rx="34" fill="#fff" stroke="#0b477f" stroke-width="4"/><rect x="489" y="435" width="454" height="68" rx="34" fill="url(#center)"/>')
 s.append('<g transform="translate(540 445)" fill="none" stroke="#063c78" stroke-width="4" stroke-linejoin="round"><path d="M4 8c11-5 19-4 26 1v34c-7-5-15-6-26-1zM56 8c-11-5-19-4-26 1v34c7-5 15-6 26-1z"/><path d="M11 15h12M11 22h12M37 15h12M37 22h12" stroke-width="3" stroke-linecap="round"/></g>')
 s.append(text('Ponto central',742,482,42,True,'#062b5c',275,1.04,'middle'))
 s.append(text(item['central'],416,550,31,False,'#090d14',604,1.16,'start',5))
 s.append('<rect x="616" y="728" width="5" height="71" rx="3" fill="#0b477f"/>')
 spots=[(28,805),(623,805),(28,1048),(623,1048)]
 for idx,((heading,body),(x,y),code) in enumerate(zip(item['cards'],spots,item['icons'])):
  s.append(f'<rect x="{x}" y="{y}" width="578" height="220" rx="29" fill="url(#card)" stroke="#19afe0" stroke-width="3"/><path d="M{x+168} {y+20}v180" stroke="#1eb6e2" stroke-width="4"/>')
  s.append(icon(code,x+28,y+45)); tx=x+183; tw=375
  hs=fit(heading,tw-14,29,20); hw=min(tw,ImageFont.truetype(BOLD,hs).getlength(heading)+26)
  s.append(f'<rect x="{tx}" y="{y+18}" width="{hw:.1f}" height="{hs+9}" rx="20" fill="{YELLOW}"/>')
  s.append(text(heading,tx+13,y+18+hs+1,hs,True,'#12110e',tw-16,1.03,'start',1))
  s.append(text(body,tx,y+18+hs+35,24,False,'#111419',tw,1.16,'start',4))
 s.append('<rect x="19" y="1308" width="1191" height="211" rx="48" fill="url(#tip)"/><path d="M19 1356a48 48 0 0 1 48-48h314v211H67a48 48 0 0 1-48-48z" fill="url(#navy)"/><g transform="translate(68 1379)" fill="none" stroke="#ffd829" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4a19 19 0 0 0-11 34c3 3 5 7 5 11h20c0-4 2-8 5-11A19 19 0 0 0 17 4z"/><path d="M12 54h20M15 61h14M17 14v12M17 33v1" stroke="#fff" stroke-width="4"/></g>')
 s.append(text('Dica de',247,1406,41,True,'#fff',170,1.03,'middle')); s.append(text('Prova',247,1454,41,True,'#fff',170,1.03,'middle'))
 s.append('<path d="M381 1331v165" stroke="#073f76" stroke-width="4"/>')
 for i,tip in enumerate(item['tips']):
  y=1371+i*70; s.append(text('✓',417,y,36,True,'#07508a',34,1.05)); s.append(text(tip,465,y-2,27,True,'#111820',708,1.13,'start',2))
 s.append(text('BASE COMPLETA · REVISÃO GUIADA · CF M10',1200,1520,12,False,'#527089',500,1.08,'end')); s.append('</svg>')
 return ''.join(s)
for item in DATA['chapters']:
 stem=f'CF-M10-C{item["chapter"]:02d}'; svg=ROOT/(stem+'.svg'); svg.write_text(build(item),encoding='utf-8')
 png=OUT/(stem+'.png'); run=subprocess.run(['inkscape',str(svg),'--export-filename='+str(png),'--export-width=1229','--export-height=1536'],capture_output=True,text=True); svg.unlink(missing_ok=True)
 if run.returncode: raise RuntimeError(run.stderr or run.stdout)
 with Image.open(png) as im:
  if im.size!=(1229,1536): raise RuntimeError(f'Wrong dimensions: {stem} {im.size}')
  im.convert('RGB').save(png,format='PNG',optimize=True)
  im.convert('RGB').save(WEBP/(stem+'.webp'),format='WEBP',quality=88,method=6)
print(f'Rendered {len(DATA["chapters"])} PNG and WebP arts.')
