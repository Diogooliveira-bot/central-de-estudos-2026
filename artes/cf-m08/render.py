import base64, json, math, os, re, subprocess, html
from pathlib import Path
from PIL import Image, ImageFont

ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'data.json').read_text(encoding='utf-8'))
FREG='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
FBOLD='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
ASSET_ROOT=Path(os.environ.get('CF_M08_ASSET_ROOT', ROOT/'template-assets'))
logo=base64.b64encode((ASSET_ROOT/'logo.png').read_bytes()).decode()
mascote=base64.b64encode((ASSET_ROOT/'mascote.png').read_bytes()).decode()
REPO_ROOT=ROOT.parents[1]
WEBP_ROOT=Path(os.environ.get('CF_M08_WEBP_ROOT', REPO_ROOT/'assets/cf/revisao-guiada/m08' if (REPO_ROOT/'content/cf/m08-teoria-guiada-data.js').exists() else ROOT/'webp'))
WEBP_ROOT.mkdir(parents=True,exist_ok=True)
NAVY='#073d78'; BLUE='#07508a'; CYAN='#16b5d9'; DARK='#081a32'; YELLOW='#ffd442'
def esc(s): return html.escape(str(s),quote=True)
def wrap(text,font,max_width):
    words=str(text).split()
    lines=[]; current=''
    for word in words:
        candidate=(current+' '+word).strip()
        if current and font.getlength(candidate)>max_width:
            lines.append(current); current=word
        else: current=candidate
    if current: lines.append(current)
    return lines
def text_svg(text,x,y,size,weight='normal',color='#111419',width=None,line_height=None,align='start',max_lines=None):
    font=ImageFont.truetype(FBOLD if weight=='bold' else FREG,size)
    lines=wrap(text,font,width) if width else [str(text)]
    if max_lines and len(lines)>max_lines: raise ValueError(f'text overflow ({len(lines)} lines): {text}')
    line_height=line_height or size*1.16
    anchor={'start':'start','middle':'middle','end':'end'}[align]
    chunks=[]
    for i,line in enumerate(lines):
        chunks.append(f'<tspan x="{x}" dy="{0 if i==0 else line_height:.1f}">{esc(line)}</tspan>')
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Liberation Sans, Arial, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">'+''.join(chunks)+'</text>',len(lines)
def fit_size(text,max_width,base,min_size=28,weight='bold'):
    for size in range(base,min_size-1,-1):
        if ImageFont.truetype(FBOLD if weight=='bold' else FREG,size).getlength(text)<=max_width:return size
    return min_size
def icon(which,x,y):
    mark='!' if which==4 else str(which)
    fs=66 if which==4 else 72
    return (f'<g transform="translate({x} {y})"><circle cx="55" cy="73" r="56" fill="{NAVY}"/>'
            f'<circle cx="55" cy="73" r="48" fill="none" stroke="#fff" stroke-width="4"/>'
            f'<circle cx="55" cy="73" r="41" fill="none" stroke="#fff" stroke-width="3"/>'
            f'<text x="55" y="{96 if which==4 else 98}" text-anchor="middle" font-family="Liberation Sans, Arial, sans-serif" font-size="{fs}" font-weight="700" fill="#fff">{mark}</text></g>')
def build(item):
    svg=['''<svg xmlns="http://www.w3.org/2000/svg" width="1229" height="1536" viewBox="0 0 1229 1536">
<defs>
<linearGradient id="navy" x1="0" x2="1"><stop stop-color="#005399"/><stop offset=".6" stop-color="#073d78"/><stop offset="1" stop-color="#00569d"/></linearGradient>
<linearGradient id="cyan" x1="0" x2="1"><stop stop-color="#0bc9df"/><stop offset="1" stop-color="#00b8d7"/></linearGradient>
<linearGradient id="pale" x1="0" x2="1"><stop stop-color="#c2e7fb"/><stop offset="1" stop-color="#c8edff"/></linearGradient>
<linearGradient id="center" x1="0" x2="1"><stop stop-color="#d0edfa"/><stop offset="1" stop-color="#92d4f0"/></linearGradient>
<linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f4fcff"/></linearGradient>
<linearGradient id="tip" x1="0" x2="1"><stop stop-color="#e5f9ff"/><stop offset="1" stop-color="#c6efff"/></linearGradient>
<filter id="shadow" x="-.1" y="-.1" width="1.2" height="1.3"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#00254b" flood-opacity=".25"/></filter>
</defs><rect width="1229" height="1536" fill="#fff"/>''']
    svg.append(f'<image x="160" y="0" width="910" height="172" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{logo}"/>')
    svg.append(f'<image x="0" y="228" width="355" height="580" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{mascote}"/>')
    svg.append('<rect x="261" y="176" width="836" height="105" rx="52" fill="#07508a"/>')
    svg.append(text_svg('Constituição Federal',679,247,66,'bold','#fff',780,line_height=70,align='middle')[0])
    svg.append('<rect x="447" y="266" width="449" height="80" rx="40" fill="url(#cyan)"/>')
    svg.append(text_svg(f'Capítulo {item["chapter"]}',671.5,322,51,'bold','#041d3a',420,line_height=53,align='middle')[0])
    svg.append('<rect x="341" y="352" width="845" height="70" rx="35" fill="url(#pale)"/>')
    size=fit_size(item['title'],805,36,24)
    svg.append(text_svg(item['title'],763.5,397,size,'bold',DARK,805,line_height=size*1.04,align='middle')[0])
    svg.append('<rect x="380" y="475" width="676" height="262" rx="34" fill="#fff" stroke="#0b477f" stroke-width="4"/>')
    # The label overlaps the top edge of the central box in the original template.
    svg.append('<rect x="489" y="435" width="454" height="68" rx="34" fill="url(#center)"/>')
    svg.append('<g transform="translate(540 445)" fill="none" stroke="#063c78" stroke-width="4" stroke-linejoin="round"><path d="M4 8c11-5 19-4 26 1v34c-7-5-15-6-26-1zM56 8c-11-5-19-4-26 1v34c7-5 15-6 26-1z"/><path d="M11 15h12M11 22h12M37 15h12M37 22h12" stroke-width="3" stroke-linecap="round"/></g>')
    svg.append(text_svg('Ponto central',742,482,42,'bold','#062b5c',275,line_height=44,align='middle')[0])
    central,cl=text_svg(item['central'],416,550,31,'normal','#090d14',604,35.96,max_lines=5)
    svg.append(central)
    svg.append('<rect x="616" y="728" width="5" height="71" rx="3" fill="#0b477f"/>')
    positions=[(28,805),(623,805),(28,1048),(623,1048)]
    for i,(card,(x,y)) in enumerate(zip(item['cards'],positions),1):
        heading,body=card
        svg.append(f'<rect x="{x}" y="{y}" width="578" height="220" rx="29" fill="url(#card)" stroke="#19afe0" stroke-width="3"/>')
        ix=x+17; svg.append(f'<path d="M{ix+151} {y+20}v180" stroke="#1eb6e2" stroke-width="4"/>')
        svg.append(icon(i, x+25,y+37))
        tx=x+183; tw=578-183-20
        hs=fit_size(heading,tw-12,29,23)
        hwidth=ImageFont.truetype(FBOLD,hs).getlength(heading)+26
        svg.append(f'<rect x="{tx}" y="{y+18}" width="{min(hwidth,tw)}" height="{hs+9}" rx="20" fill="#ffd442"/>')
        svg.append(text_svg(heading,tx+13,y+18+hs+1,hs,'bold','#12110e',tw-16,line_height=hs*1.03)[0])
        body_svg,lines=text_svg(body,tx,y+18+hs+1+9+25,24,'normal','#111419',tw,line_height=28,max_lines=5)
        svg.append(body_svg)
    svg.append('<rect x="19" y="1308" width="1191" height="211" rx="48" fill="url(#tip)"/>')
    svg.append('<path d="M19 1356a48 48 0 0 1 48-48h314v211H67a48 48 0 0 1-48-48z" fill="url(#navy)"/>')
    # lightbulb icon
    svg.append('<g transform="translate(68 1379)" fill="none" stroke="#ffd829" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 4a19 19 0 0 0-11 34c3 3 5 7 5 11h20c0-4 2-8 5-11A19 19 0 0 0 17 4z"/><path d="M12 54h20M15 61h14"/><path d="M17 14v12M17 33v1" stroke="#fff" stroke-width="4"/></g>')
    svg.append(text_svg('Dica de',247,1406,41,'bold','#fff',170,line_height=42,align='middle')[0])
    svg.append(text_svg('Prova',247,1454,41,'bold','#fff',170,line_height=42,align='middle')[0])
    svg.append('<path d="M381 1331v165" stroke="#073f76" stroke-width="4"/>')
    for j,t in enumerate(item['tips']):
        y=1371+j*70
        svg.append(text_svg('✓',417,y,36,'bold','#07508a',34,line_height=38)[0])
        row,lines=text_svg(t,465,y-2,27,'bold','#111820',708,line_height=30.5,max_lines=2)
        svg.append(row)
    svg.append(text_svg('BASE COMPLETA · REVISÃO GUIADA · CF M08',1200,1520,12,'normal','#527089',500,line_height=14,align='end')[0])
    svg.append('</svg>')
    return ''.join(svg)
def main():
    for item in DATA['chapters']:
        stem=f'CF-M08-C{item["chapter"]:02d}'
        temp=ROOT/'.render'; temp.mkdir(exist_ok=True)
        svgpath=temp/f'{stem}.svg'
        svgpath.write_text(build(item),encoding='utf-8')
        png=ROOT/'png'/f'{stem}.png'
        png.parent.mkdir(parents=True,exist_ok=True)
        proc=subprocess.run(['inkscape',str(svgpath),'--export-filename='+str(png),'--export-width=1229','--export-height=1536'],capture_output=True,text=True)
        if proc.returncode: raise RuntimeError(proc.stderr or proc.stdout)
        with Image.open(png) as im:
            if im.size!=(1229,1536): raise RuntimeError(f'Wrong dimensions {stem}: {im.size}')
            im.convert('RGB').save(png,format='PNG',optimize=True)
            im.convert('RGB').save(WEBP_ROOT/f'{stem}.webp',format='WEBP',quality=88,method=6)
        svgpath.unlink(missing_ok=True)
    print(f'Rendered {len(DATA["chapters"])} PNG and WebP arts.')
if __name__=='__main__':main()
