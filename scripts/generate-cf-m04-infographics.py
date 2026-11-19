from pathlib import Path
from PIL import ImageFont
import json, html, subprocess, uuid, base64
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'artes/cf-m04'
DATA=json.loads((BASE/'data.json').read_text(encoding='utf-8'))
ASSETS=BASE/'template-assets'
OUT=BASE/'png'; SVG=BASE/'svg'
OUT.mkdir(parents=True,exist_ok=True); SVG.mkdir(parents=True,exist_ok=True)
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
NAVY='#073f78'; CYAN='#16b5e2'; BODY='#101419'
def esc(s): return html.escape(str(s),quote=True)
def lines(text,size,width,bold=False):
    font=ImageFont.truetype(BOLD if bold else REG,size)
    out=[]; row=''
    for word in str(text).split():
        test=(row+' '+word).strip()
        if row and font.getlength(test)>width: out.append(row); row=word
        else: row=test
    if row: out.append(row)
    return out
def text_block(x,y,text,size,width,color=BODY,bold=False,leading=None,align='start',max_lines=None):
    ls=lines(text,size,width,bold)
    if max_lines and len(ls)>max_lines:
        # Preserve a complete sentence while staying inside the box.
        while len(ls)>max_lines:
            ls=lines(text,size-1,width,bold); size-=1
    lead=leading or int(size*1.2); weight='700' if bold else '500'
    spans=''.join(f'<tspan x="{x}" dy="{0 if i==0 else lead}">{esc(line)}</tspan>' for i,line in enumerate(ls))
    return f'<text x="{x}" y="{y}" text-anchor="{align}" font-family="DejaVu Sans, Arial, sans-serif" font-size="{size}px" font-weight="{weight}" fill="{color}">{spans}</text>',len(ls),size
def img(x,y,w,h,name):
    data=base64.b64encode((ASSETS/name).read_bytes()).decode('ascii')
    return f'<image x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,{data}" />'

for idx,item in enumerate(DATA,1):
    n=f'{idx:02d}'; out=[]
    out.append('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1229" height="1536" viewBox="0 0 1229 1536">')
    out.append('<rect width="1229" height="1536" fill="#fff"/>')
    out.append(img(160,0,910,172,'logo.png'))
    out.append(img(0,228,355,580,'mascote.png'))
    # Three fixed title bars
    out.append('<rect x="261" y="176" width="836" height="105" rx="53" fill="#064980"/>')
    out.append('<text x="679" y="249" text-anchor="middle" font-family="DejaVu Sans, Arial" font-size="64px" font-weight="700" fill="#fff">Constituição Federal</text>')
    out.append('<rect x="447" y="266" width="449" height="80" rx="40" fill="#08c0dc"/>')
    out.append(f'<text x="671" y="322" text-anchor="middle" font-family="DejaVu Sans, Arial" font-size="49px" font-weight="700" fill="#071a31">Capítulo {idx}</text>')
    out.append('<rect x="341" y="352" width="845" height="70" rx="35" fill="#c5e9fb"/>')
    titlelines=lines(item['title'],35,805,True)
    title_size=35
    while len(titlelines)>2:
        title_size-=1; titlelines=lines(item['title'],title_size,805,True)
    title_y=379 if len(titlelines)==1 else 372
    title_svg,_cnt,_=text_block(763,title_y,item['title'],title_size,805,'#071a3b',True,int(title_size*1.05),'middle',2)
    out.append(title_svg)
    # Central point label and panel
    out.append('<rect x="380" y="475" width="676" height="262" rx="34" fill="#fff" stroke="#0b477f" stroke-width="4"/>')
    out.append('<rect x="489" y="435" width="454" height="68" rx="34" fill="#a9def4"/>')
    out.append('<g transform="translate(517 447)" fill="none" stroke="#073f78" stroke-width="4" stroke-linejoin="round"><path d="M2 4c10-4 18-3 25 2v35c-7-5-15-6-25-2zM52 4c-10-4-18-3-25 2v35c7-5 15-6 25-2z"/><path d="M8 12h12M8 19h12M34 12h12M34 19h12" stroke-linecap="round"/></g>')
    out.append('<text x="748" y="480" text-anchor="middle" font-family="DejaVu Sans, Arial" font-size="40px" font-weight="700" fill="#073f78">Ponto central</text>')
    point_svg,count,size=text_block(423,526,item['central'],30,590,BODY,False,36,'start',6)
    if count>6: point_svg,count,size=text_block(423,526,item['central'],27,590,BODY,False,33,'start',6)
    out.append(point_svg)
    out.append('<path d="M618 736v62" stroke="#0b477f" stroke-width="5"/>')
    # Four outlined cards, with original reference icons
    cards=[(28,805,'icon1.png'),(623,805,'icon2.png'),(28,1048,'icon3.png'),(623,1048,'icon4.png')]
    for c,(x,y,icon) in enumerate(cards):
        out.append(f'<rect x="{x}" y="{y}" width="578" height="220" rx="27" fill="#fbfeff" stroke="{CYAN}" stroke-width="3"/>')
        out.append(f'<path d="M{x+171} {y+24}v172" stroke="{CYAN}" stroke-width="4"/>')
        out.append(img(x+18,y+35,137,147,icon))
        hx=x+194; maxw=356
        title=item['cards'][c][0]
        hl=lines(title,27,maxw-22,True)
        hs=27
        while len(hl)>1 and hs>22:
            hs-=1; hl=lines(title,hs,maxw-22,True)
        font=ImageFont.truetype(BOLD,hs)
        for j,line in enumerate(hl):
            w=min(maxw,font.getlength(line)+24)
            hy=y+13+j*(hs+5)
            out.append(f'<rect x="{hx}" y="{hy}" width="{w:.1f}" height="{hs+9}" rx="{(hs+9)/2}" fill="#ffdc55"/>')
            out.append(f'<text x="{hx+12}" y="{hy+hs+1}" font-family="DejaVu Sans, Arial" font-size="{hs}px" font-weight="700" fill="#111">{esc(line)}</text>')
        by=y+55+len(hl)*(hs+3)
        body_svg,body_count,bs=text_block(hx,by,item['cards'][c][1],24,maxw,BODY,False,29,'start',5)
        if body_count>5: body_svg,body_count,bs=text_block(hx,by,item['cards'][c][1],21,maxw,BODY,False,26,'start',6)
        out.append(body_svg)
    # Bottom tip, styled like the provided model
    out.append('<rect x="19" y="1308" width="1191" height="211" rx="48" fill="#d6f3ff"/>')
    out.append('<rect x="19" y="1308" width="362" height="211" rx="48" fill="#064b88"/>')
    out.append('<g transform="translate(64 1357)" fill="none" stroke="#ffd724" stroke-width="6" stroke-linecap="round"><path d="M20 8a29 29 0 0 1 35 0c10 8 12 22 4 33-5 6-8 11-9 17H25c-1-6-4-11-9-17C8 30 10 16 20 8z" fill="#ffd724"/><path d="M27 63h21M29 72h17M32 80h11" stroke="#fff"/><path d="M37 -7v-10M7 8l-8-6M69 8l8-6M6 43l-10 2M71 43l10 2"/></g>')
    out.append('<text x="157" y="1401" font-size="42px" font-family="DejaVu Sans, Arial" font-weight="700" fill="#fff">Dica de</text>')
    out.append('<text x="157" y="1450" font-size="42px" font-family="DejaVu Sans, Arial" font-weight="700" fill="#fff">Prova</text>')
    out.append('<path d="M402 1330v165" stroke="#06457f" stroke-width="4"/>')
    for j,t in enumerate(item['tips']):
        yy=1366+j*65
        out.append(f'<text x="432" y="{yy}" font-size="34px" font-family="DejaVu Sans, Arial" font-weight="700" fill="#07508a">✓</text>')
        svg,cnt,sz=text_block(482,yy,t,28,696,'#101820',False,32,'start',2)
        out.append(svg)
    out.append(f'<text x="1200" y="1530" text-anchor="end" font-family="DejaVu Sans, Arial" font-size="12px" fill="#527089">BASE COMPLETA · REVISÃO GUIADA · CF M04 · C{n}</text>')
    out.append('</svg>')
    svg_path=SVG/f'CF-M04-C{n}.svg'; png_path=OUT/f'CF-M04-C{n}.png'
    svg_path.write_text('\n'.join(out),encoding='utf-8')
    subprocess.run(['inkscape',str(svg_path),'--export-type=png',f'--export-filename={png_path}','--export-width=1229','--export-height=1536'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
print(f'Generated {len(DATA)} SVG/PNG pairs at 1229 x 1536.')

