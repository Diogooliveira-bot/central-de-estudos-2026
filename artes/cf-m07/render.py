import base64, json, math, os, re, subprocess, html
from pathlib import Path
from PIL import Image, ImageFont

ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'data.json').read_text(encoding='utf-8'))
FREG='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
FBOLD='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
ASSET_ROOT=Path(os.environ.get('CF_M07_ASSET_ROOT', ROOT/'template-assets'))
logo=base64.b64encode((ASSET_ROOT/'logo.png').read_bytes()).decode()
mascote=base64.b64encode((ASSET_ROOT/'mascote.png').read_bytes()).decode()
REPO_ROOT=ROOT.parents[1]
WEBP_ROOT=Path(os.environ.get('CF_M07_WEBP_ROOT', REPO_ROOT/'assets/cf/revisao-guiada/m07' if (REPO_ROOT/'content/cf/m07-teoria-guiada-data.js').exists() else ROOT/'webp'))
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
def badge(i,x,y):
    mark='!' if i==4 else str(i)
    return (f'<g transform="translate({x} {y})"><circle cx="40" cy="40" r="40" fill="url(#navy)"/><circle cx="40" cy="40" r="34" fill="none" stroke="#7fd6f0" stroke-width="2.5"/>'
            f'<text x="40" y="{54 if i<4 else 53}" text-anchor="middle" font-family="Liberation Sans, Arial, sans-serif" font-size="42" font-weight="700" fill="#fff">{mark}</text></g>')
def build(item):
    s=[f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1229" height="1536" viewBox="0 0 1229 1536">
<defs>
<linearGradient id="navy" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0a5fa8"/><stop offset="1" stop-color="#062f5e"/></linearGradient>
<linearGradient id="band" x1="0" x2="1"><stop stop-color="#0a5fa8"/><stop offset=".55" stop-color="#073d78"/><stop offset="1" stop-color="#05305f"/></linearGradient>
<linearGradient id="pale" x1="0" x2="1"><stop stop-color="#dff2fd"/><stop offset="1" stop-color="#cdeafa"/></linearGradient>
<linearGradient id="tip" x1="0" x2="1"><stop stop-color="#eef9ff"/><stop offset="1" stop-color="#d3f0fc"/></linearGradient>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#f1f8fd"/></linearGradient>
<filter id="sh" x="-.05" y="-.05" width="1.1" height="1.2"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dy="5" result="b"/><feFlood flood-color="#06335f" flood-opacity=".16"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs><rect width="1229" height="1536" fill="#fff"/>''']
    s.append(f'<image x="160" y="0" width="910" height="172" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,{logo}"/>')
    s.append('<rect x="60" y="174" width="1109" height="4" rx="2" fill="#16b5d9" opacity=".55"/>')
    s.append(f'<image x="0" y="228" width="355" height="580" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,{mascote}"/>')
    s.append('<rect x="262" y="222" width="88" height="58" fill="#fff"/><rect x="318" y="752" width="36" height="58" fill="#fff"/>')
    s.append('<rect x="0" y="799" width="355" height="14" fill="#fff"/>')
    # banner
    s.append('<rect x="352" y="204" width="837" height="150" rx="40" fill="url(#band)" filter="url(#sh)"/>')
    s.append('<rect x="352" y="204" width="14" height="150" rx="7" fill="#ffd442"/>')
    s.append(text_svg('Constituição Federal',778,276,62,'bold','#ffffff',780,line_height=66,align='middle')[0])
    s.append(text_svg(f'Capítulo {item["chapter"]}',778,330,42,'bold','#62dff5',400,line_height=44,align='middle')[0])
    # title pill
    s.append('<rect x="352" y="376" width="837" height="76" rx="38" fill="url(#pale)" stroke="#9fd5f0" stroke-width="2"/>')
    size=fit_size(item['title'],790,38,27)
    s.append(text_svg(item['title'],770.5,376+38+size*0.35,size,'bold','#081a32',790,line_height=size*1.04,align='middle')[0])
    # central
    s.append('<rect x="380" y="486" width="809" height="262" rx="30" fill="#fff" stroke="#c4e3f4" stroke-width="2" filter="url(#sh)"/>')
    s.append('<rect x="380" y="486" width="12" height="262" rx="6" fill="#16b5d9"/>')
    s.append('<g transform="translate(424 508)" fill="none" stroke="#0a5fa8" stroke-width="4" stroke-linejoin="round"><path d="M4 8c11-5 19-4 26 1v34c-7-5-15-6-26-1zM56 8c-11-5-19-4-26 1v34c7-5 15-6 26-1z"/><path d="M11 15h12M11 22h12M37 15h12M37 22h12" stroke-width="3" stroke-linecap="round"/></g>')
    s.append(text_svg('Ponto central',500,548,40,'bold','#0a5fa8',300,line_height=42)[0])
    s.append('<rect x="424" y="574" width="737" height="3" rx="1.5" fill="#d7ecf8"/>')
    for cs in (33,31,29,28):
        f=ImageFont.truetype(FREG,cs)
        if len(wrap(item['central'],f,737))<=(3 if cs>=29 else 4):break
    s.append(text_svg(item['central'],424,622,cs,'normal','#0e1620',737,cs*1.14,max_lines=4)[0])
    pos=[(28,790+30),(623,790+30),(28,1033+30),(623,1033+30)]
    pos=[(28,820),(623,820),(28,1054),(623,1054)]
    for i,(card,(x,y)) in enumerate(zip(item['cards'],pos),1):
        h,b=card
        s.append(f'<rect x="{x}" y="{y}" width="578" height="214" rx="28" fill="#fff" stroke="#c4e3f4" stroke-width="2" filter="url(#sh)"/>')
        s.append(f'<rect x="{x}" y="{y+26}" width="8" height="162" rx="4" fill="#16b5d9"/>')
        s.append(badge(i,x+30,y+30))
        tx=x+134;tw=578-134-26
        hs=fit_size(h,tw,30,23)
        s.append(text_svg(h,tx,y+50,hs,'bold','#073d78',tw,line_height=hs*1.05)[0])
        w=min(ImageFont.truetype(FBOLD,hs).getlength(h),tw)
        s.append(f'<rect x="{tx}" y="{y+62}" width="{min(w,tw)}" height="5" rx="2.5" fill="#ffd442"/>')
        for bs in (25,24,23,22):
            if len(wrap(b,ImageFont.truetype(FREG,bs),tw))<=(4 if bs>22 else 5):break
        s.append(text_svg(b,tx,y+98,bs,'normal','#16202c',tw,line_height=bs*1.17,max_lines=5)[0])
    # tip
    s.append('<rect x="19" y="1304" width="1191" height="206" rx="44" fill="url(#tip)" stroke="#bfe5f6" stroke-width="2" filter="url(#sh)"/>')
    s.append('<path d="M19 1348a44 44 0 0 1 44-44h318v206H63a44 44 0 0 1-44-44z" fill="url(#navy)"/>')
    s.append('<circle cx="104" cy="1407" r="46" fill="#ffffff" fill-opacity=".10" stroke="#ffd829" stroke-width="3.5"/><g transform="translate(69 1370) scale(.7)"><path d="M50 8C30 8 16 23 16 41c0 12 6 19 13 26 4 4 5 8 5 13h32c0-5 1-9 5-13 7-7 13-14 13-26C84 23 70 8 50 8z" fill="#ffd829"/><path d="M27 40a23 23 0 0 1 12-19" fill="none" stroke="#fff6bf" stroke-width="5" stroke-linecap="round"/><rect x="34" y="83" width="32" height="6" rx="3" fill="#e3ebf3"/><rect x="34" y="91" width="32" height="6" rx="3" fill="#cfd9e4"/><path d="M41 99h18a2 2 0 0 1 2 2 6 6 0 0 1-6 5H45a6 6 0 0 1-6-5 2 2 0 0 1 2-2z" fill="#b6c4d2"/></g>')
    s.append(text_svg('Dica de',247,1403,41,'bold','#fff',170,line_height=42,align='middle')[0])
    s.append(text_svg('Prova',247,1451,41,'bold','#fff',170,line_height=42,align='middle')[0])
    for j,t in enumerate(item['tips']):
        y=1371+j*72
        s.append(f'<circle cx="434" cy="{y-10}" r="17" fill="#16b5d9"/><path d="M425 {y-10}l7 7 12-14" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>')
        s.append(text_svg(t,472,y-2,27,'bold','#0e1620',700,line_height=30.5,max_lines=2)[0])
    s.append(text_svg('BASE COMPLETA · REVISÃO GUIADA · CF M07',1200,1526,13,'normal','#527089',500,line_height=14,align='end')[0])
    s.append('</svg>')
    return ''.join(s)
def main():
    for item in DATA['chapters']:
        stem=f'CF-M07-C{item["chapter"]:02d}'
        temp=ROOT/'.render'; temp.mkdir(exist_ok=True)
        svgpath=temp/f'{stem}.svg'
        svgpath.write_text(build(item),encoding='utf-8')
        png=ROOT/'png'/f'{stem}.png'
        proc=subprocess.run(['inkscape',str(svgpath),'--export-filename='+str(png),'--export-width=1229','--export-height=1536'],capture_output=True,text=True)
        if proc.returncode: raise RuntimeError(proc.stderr or proc.stdout)
        with Image.open(png) as im:
            if im.size!=(1229,1536): raise RuntimeError(f'Wrong dimensions {stem}: {im.size}')
            im.convert('RGB').save(png,format='PNG',optimize=True)
            im.convert('RGB').save(WEBP_ROOT/f'{stem}.webp',format='WEBP',quality=88,method=6)
        svgpath.unlink(missing_ok=True)
    print(f'Rendered {len(DATA["chapters"])} PNG and WebP arts.')
if __name__=='__main__':main()
