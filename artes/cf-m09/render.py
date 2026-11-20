import base64, html, json, subprocess
from pathlib import Path
from PIL import ImageFont

ROOT=Path(__file__).resolve().parent
ASSET_ROOT=ROOT/'template-assets'
if not ASSET_ROOT.exists(): ASSET_ROOT=ROOT.parent/'cf-m08'/'template-assets'
DATA=json.loads((ROOT/'data.json').read_text(encoding='utf-8'))
OUT=ROOT/'png'
WEBP=ROOT.parents[1]/'assets/cf/revisao-guiada/m09'
OUT.mkdir(parents=True,exist_ok=True)
WEBP.mkdir(parents=True,exist_ok=True)
REG='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
BOLD='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
logo=base64.b64encode((ASSET_ROOT/'logo.png').read_bytes()).decode()
mascot=base64.b64encode((ASSET_ROOT/'mascote.png').read_bytes()).decode()

def esc(value): return html.escape(str(value),quote=True)

def wrap(value,font,width):
    lines=[]; current=''
    for word in str(value).split():
        candidate=(current+' '+word).strip()
        if current and font.getlength(candidate)>width:
            lines.append(current); current=word
        else: current=candidate
    if current: lines.append(current)
    return lines

def text(value,x,y,size,bold=False,color='#111419',width=None,line=1.16,anchor='start',max_lines=None):
    font=ImageFont.truetype(BOLD if bold else REG,size)
    lines=wrap(value,font,width) if width else [str(value)]
    if max_lines and len(lines)>max_lines:
        raise ValueError(f'{len(lines)} lines do not fit ({max_lines} max): {value}')
    spans=[]
    for i,line_text in enumerate(lines):
        spans.append(f'<tspan x="{x}" dy="{0 if i==0 else size*line:.1f}">{esc(line_text)}</tspan>')
    weight='700' if bold else '400'
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Liberation Sans,Arial,sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">'+''.join(spans)+'</text>'

def fit(value,width,start,minimum=22,bold=True):
    face=BOLD if bold else REG
    for size in range(start,minimum-1,-1):
        if ImageFont.truetype(face,size).getlength(value)<=width: return size
    return minimum

ICON_LABELS={1:'Tribunal',2:'Balança da Justiça',3:'Texto constitucional',4:'Alerta de prova'}
ICONS={
 1:'<path d="M20 36h70M27 36v42m14-42v42m28-42v42m14-42v42M17 78h76M12 89h86M55 12 12 29h86z"/>',
 2:'<path d="M55 15v58M36 84h38M25 31l-14 30h28zM85 31 71 61h28zM55 15l-30 16m30-16 30 16M30 84c-12-5-19-15-19-23m74 23c12-5 19-15 19-23"/>',
 3:'<path d="M55 26c-15-10-29-11-42-5v59c14-6 28-5 42 5 14-10 28-11 42-5V21c-13-6-27-5-42 5zM55 26v59M23 37h20m-20 12h20m36-12h10m-10 12h10"/>',
 4:'<path d="M55 13 99 88H11z"/><path d="M55 39v23m0 12v1" stroke="#fff" stroke-width="8" stroke-linecap="round"/>'
}

def icon(which,x,y):
    fill='none' if which<4 else '#073d78'
    stroke='#fff' if which<4 else '#ffd442'
    sw=6 if which<4 else 5
    return (f'<g transform="translate({x} {y})" aria-label="{ICON_LABELS[which]}"><title>{ICON_LABELS[which]}</title><circle cx="55" cy="55" r="53" fill="#073d78"/>'
            f'<g fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{ICONS[which]}</g></g>')

def build(item):
    s=['''<svg xmlns="http://www.w3.org/2000/svg" width="1229" height="1536" viewBox="0 0 1229 1536">
<defs><linearGradient id="navy" x1="0" x2="1"><stop stop-color="#005399"/><stop offset=".6" stop-color="#073d78"/><stop offset="1" stop-color="#00569d"/></linearGradient>
<linearGradient id="cyan" x1="0" x2="1"><stop stop-color="#0bc9df"/><stop offset="1" stop-color="#00b8d7"/></linearGradient>
<linearGradient id="pale" x1="0" x2="1"><stop stop-color="#c2e7fb"/><stop offset="1" stop-color="#c8edff"/></linearGradient>
<linearGradient id="center" x1="0" x2="1"><stop stop-color="#d0edfa"/><stop offset="1" stop-color="#92d4f0"/></linearGradient>
<linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f4fcff"/></linearGradient>
<linearGradient id="tip" x1="0" x2="1"><stop stop-color="#e5f9ff"/><stop offset="1" stop-color="#c6efff"/></linearGradient>
<filter id="shadow" x="-.1" y="-.1" width="1.2" height="1.3"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#00254b" flood-opacity=".25"/></filter></defs>
<rect width="1229" height="1536" fill="#fff"/>''']
    s.append(f'<image x="160" y="0" width="910" height="172" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{logo}"/>')
    s.append(f'<image x="0" y="228" width="355" height="580" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{mascot}"/>')
    s.append('<rect x="261" y="176" width="836" height="105" rx="52" fill="#07508a"/>')
    s.append(text('Constituição Federal',679,247,66,True,'#fff',780,1.06,'middle'))
    s.append('<rect x="447" y="266" width="449" height="80" rx="40" fill="url(#cyan)"/>')
    s.append(text(f'Capítulo {item["chapter"]}',671.5,322,51,True,'#041d3a',420,1.04,'middle'))
    s.append('<rect x="341" y="352" width="845" height="70" rx="35" fill="url(#pale)"/>')
    size=fit(item['title'],805,36,22)
    s.append(text(item['title'],763.5,397,size,True,'#081a32',805,1.03,'middle',2))
    s.append('<rect x="380" y="475" width="676" height="262" rx="34" fill="#fff" stroke="#0b477f" stroke-width="4"/>')
    s.append('<rect x="489" y="435" width="454" height="68" rx="34" fill="url(#center)"/>')
    s.append('<g transform="translate(540 445)" fill="none" stroke="#063c78" stroke-width="4" stroke-linejoin="round"><path d="M4 8c11-5 19-4 26 1v34c-7-5-15-6-26-1zM56 8c-11-5-19-4-26 1v34c7-5 15-6 26-1z"/><path d="M11 15h12M11 22h12M37 15h12M37 22h12" stroke-width="3" stroke-linecap="round"/></g>')
    s.append(text('Ponto central',742,482,42,True,'#062b5c',275,1.04,'middle'))
    s.append(text(item['central'],416,550,31,False,'#090d14',604,1.16,'start',5))
    s.append('<rect x="616" y="728" width="5" height="71" rx="3" fill="#0b477f"/>')
    spots=[(28,805),(623,805),(28,1048),(623,1048)]
    for idx,(card,(x,y)) in enumerate(zip(item['cards'],spots),1):
        heading,body=card
        s.append(f'<rect x="{x}" y="{y}" width="578" height="220" rx="29" fill="url(#card)" stroke="#19afe0" stroke-width="3"/>')
        s.append(f'<path d="M{x+168} {y+20}v180" stroke="#1eb6e2" stroke-width="4"/>')
        s.append(icon(idx,x+28,y+45))
        tx=x+183; tw=375
        hs=fit(heading,tw-14,29,20)
        hw=min(tw,ImageFont.truetype(BOLD,hs).getlength(heading)+26)
        s.append(f'<rect x="{tx}" y="{y+18}" width="{hw:.1f}" height="{hs+9}" rx="20" fill="#ffd442"/>')
        s.append(text(heading,tx+13,y+18+hs+1,hs,True,'#12110e',tw-16,1.03,'start',1))
        s.append(text(body,tx,y+18+hs+35,24,False,'#111419',tw,1.16,'start',4))
    s.append('<rect x="19" y="1308" width="1191" height="211" rx="48" fill="url(#tip)"/>')
    s.append('<path d="M19 1356a48 48 0 0 1 48-48h314v211H67a48 48 0 0 1-48-48z" fill="url(#navy)"/>')
    s.append('<g transform="translate(68 1379)" fill="none" stroke="#ffd829" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4a19 19 0 0 0-11 34c3 3 5 7 5 11h20c0-4 2-8 5-11A19 19 0 0 0 17 4z"/><path d="M12 54h20M15 61h14"/><path d="M17 14v12M17 33v1" stroke="#fff" stroke-width="4"/></g>')
    s.append(text('Dica de',247,1406,41,True,'#fff',170,1.03,'middle'))
    s.append(text('Prova',247,1454,41,True,'#fff',170,1.03,'middle'))
    s.append('<path d="M381 1331v165" stroke="#073f76" stroke-width="4"/>')
    for i,tip in enumerate(item['tips']):
        y=1371+i*70
        s.append(text('✓',417,y,36,True,'#07508a',34,1.05))
        s.append(text(tip,465,y-2,27,True,'#111820',708,1.13,'start',2))
    s.append(text('BASE COMPLETA · REVISÃO GUIADA · CF M09',1200,1520,12,False,'#527089',500,1.08,'end'))
    s.append('</svg>')
    return ''.join(s)

def main():
    for item in DATA['chapters']:
        stem=f'CF-M09-C{item["chapter"]:02d}'
        svg=ROOT/(stem+'.svg')
        svg.write_text(build(item),encoding='utf-8')
        png=OUT/(stem+'.png')
        run=subprocess.run(['inkscape',str(svg),'--export-filename='+str(png),'--export-width=1229','--export-height=1536'],capture_output=True,text=True)
        svg.unlink(missing_ok=True)
        if run.returncode: raise RuntimeError(run.stderr or run.stdout)
        from PIL import Image
        with Image.open(png) as im:
            if im.size!=(1229,1536): raise RuntimeError(f'Wrong dimensions {stem}: {im.size}')
            im.convert('RGB').save(png,format='PNG',optimize=True)
            im.convert('RGB').save(WEBP/(stem+'.webp'),format='WEBP',quality=88,method=6)
    print(f'Rendered {len(DATA["chapters"])} PNG and WebP arts.')

if __name__=='__main__': main()
