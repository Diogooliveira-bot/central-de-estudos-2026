#!/usr/bin/env python3
"""Exporta sem reescrever as revisões guiadas já publicadas de Direito Civil."""
import json
import re
import zipfile
from html import escape
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from pypdf import PdfReader, PdfWriter

ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/"exportacao-civil-20261111"
INDIVIDUAIS=OUTPUT/"Individual"
NAVY=RGBColor(28,51,78)
BLUE=RGBColor(55,93,132)
LABELS=[
    "Explicação",
    "Exemplo prático",
    "Base legal",
    "Aprofundamento",
    "Atenção à pegadinha",
    "O que memorizar"
]

def extract_json(path, marker):
    source=path.read_text(encoding="utf-8")
    match=re.search(re.escape(marker)+r"\s*=\s*",source)
    if not match:
        raise ValueError(f"Não encontrei {marker} em {path}")
    result, length=json.JSONDecoder().raw_decode(source[match.end():])
    return result

def get_law():
    return extract_json(ROOT/"content/civil/civil-teoria-guiada-lei-seca.js","g.BC_CIV_GUIDED_LAW")

def get_module(number):
    path=ROOT/f"content/civil/m{number:02d}-teoria-guiada-data.js"
    data=extract_json(path,f"g.BC_CIV_GUIDED_MODULES[{number}]")
    if int(data["module"])!=number or len(data.get("topics",[]))<5:
        raise ValueError(f"Módulo {number} incompleto: {path}")
    for i, topic in enumerate(data["topics"]):
        if not isinstance(topic,list) or len(topic)<8 or any(not isinstance(x,str) for x in topic[:8]):
            raise ValueError(f"Seção inválida no módulo {number}, tópico {i+1}")
    return data

def word_paragraph(doc, text, style=None):
    for line in str(text).split("\n"):
        p=doc.add_paragraph(style=style)
        p.add_run(line.strip())
    return p

def make_docx(number, data, law, path):
    doc=Document()
    section=doc.sections[0]
    section.top_margin=section.bottom_margin=Cm(2.1)
    section.left_margin=section.right_margin=Cm(2.25)
    normal=doc.styles["Normal"]
    normal.font.name="Aptos"
    normal.font.size=Pt(10.4)
    normal.font.color.rgb=NAVY
    normal.paragraph_format.space_after=Pt(7)
    for name,size in [("Title",23),("Heading 1",16),("Heading 2",12)]:
        st=doc.styles[name]
        st.font.name="Aptos Display" if name=="Title" else "Aptos"
        st.font.size=Pt(size)
        st.font.color.rgb=NAVY
        st.font.bold=True
    doc.add_paragraph("BASE COMPLETA  /  CENTRAL DE ESTUDOS",style="Subtitle")
    doc.add_heading(f"Direito Civil — Módulo {number:02d}",0)
    doc.add_paragraph(str(data["title"]),style="Heading 1")
    if data.get("base"):
        doc.add_paragraph("Referências gerais: "+str(data["base"]))
    doc.add_paragraph("Revisão guiada • leitura única • novembro de 2026")
    doc.add_paragraph("Conteúdo reproduzido a partir da versão de revisão da Central. Não inclui a teoria completa Premium nem questões.")
    for i,topic in enumerate(data["topics"]):
        doc.add_heading(f"{i+1:02d}  {topic[0]}",level=1)
        for j,label in enumerate(LABELS):
            doc.add_heading(label,level=2)
            word_paragraph(doc,topic[j+1])
            if j==2:
                articles=law.get(str(number),{}).get(str(i),[])
                if articles:
                    doc.add_heading("Lei seca relacionada",level=2)
                    for art in articles:
                        if not isinstance(art,list) or len(art)!=2: continue
                        if not art[1]: continue
                        p=doc.add_paragraph()
                        run=p.add_run(str(art[0]));run.bold=True
                        for line in art[1]:
                            word_paragraph(doc,line)
    doc.add_heading("Checklist de compreensão",level=1)
    doc.add_paragraph("Marque apenas os assuntos que você já consegue explicar com suas palavras.")
    for topic in data["topics"]:
        doc.add_paragraph("☐  "+topic[7])
    doc.add_paragraph("Fonte: Base Completa — revisão guiada de Direito Civil M01–M15, código de produção em 11/11/2026.")
    doc.save(path)

def fonts():
    for name,bold in [("DejaVu","/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),("DejaVu-Bold","/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")]:
        pdfmetrics.registerFont(TTFont(name,bold))

def styledefs():
    return {
        "title": ParagraphStyle("c_title",fontName="DejaVu-Bold",fontSize=18,leading=25,textColor=colors.HexColor("#193654"),spaceAfter=11),
        "subtitle": ParagraphStyle("c_subtitle",fontName="DejaVu-Bold",fontSize=11,leading=17,textColor=colors.HexColor("#355d84"),spaceAfter=14),
        "h1": ParagraphStyle("c_h1",fontName="DejaVu-Bold",fontSize=12,leading=18,textColor=colors.HexColor("#193654"),spaceBefore=18,spaceAfter=10,keepWithNext=True),
        "h2": ParagraphStyle("c_h2",fontName="DejaVu-Bold",fontSize=9.4,leading=14,textColor=colors.HexColor("#355d84"),spaceBefore=10,spaceAfter=5,keepWithNext=True),
        "text": ParagraphStyle("c_text",fontName="DejaVu",fontSize=9.1,leading=15.2,textColor=colors.HexColor("#20394e"),spaceAfter=9),
        "fine": ParagraphStyle("c_fine",fontName="DejaVu",fontSize=8,leading=13,textColor=colors.HexColor("#516475"),spaceAfter=7),
    }

def pdf_text(flow, text, style):
    for para in str(text).split("\n"):
        flow.append(Paragraph(xml_escape(para.strip()) if para.strip() else " ",style))

def on_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#dce5ed"))
    canvas.line(20*mm,19*mm,190*mm,19*mm)
    canvas.setFont("DejaVu",7)
    canvas.setFillColor(colors.HexColor("#677889"))
    canvas.drawString(21*mm,14*mm,"BASE COMPLETA  ·  DIREITO CIVIL  ·  REVISÃO GUIADA")
    canvas.drawRightString(189*mm,14*mm,str(doc.page))
    canvas.restoreState()

def make_pdf(number,data,law,path):
    styles=styledefs()
    story=[
        Paragraph("BASE COMPLETA  /  CENTRAL DE ESTUDOS",styles["fine"]),
        Paragraph(f"Direito Civil · Módulo {number:02d}",styles["title"]),
        Paragraph(xml_escape(data["title"]),styles["subtitle"]),
    ]
    if data.get("base"): pdf_text(story,"Referências gerais: "+data["base"],styles["fine"])
    story.append(Paragraph("Revisão guiada · leitura única · novembro de 2026",styles["fine"]))
    story.append(Paragraph("Texto da versão de revisão da Central. Sem teoria completa Premium ou questões.",styles["fine"]))
    for i,topic in enumerate(data["topics"]):
        story.append(Paragraph(f"{i+1:02d}  {xml_escape(topic[0])}",styles["h1"]))
        for j,label in enumerate(LABELS):
            story.append(Paragraph(label,styles["h2"]))
            pdf_text(story,topic[j+1],styles["text"])
            if j==2:
                articles=law.get(str(number),{}).get(str(i),[])
                if articles:
                    story.append(Paragraph("Lei seca relacionada",styles["h2"]))
                    for article in articles:
                        if not isinstance(article,list) or len(article)!=2 or not article[1]:continue
                        story.append(Paragraph(xml_escape(str(article[0])),styles["h2"]))
                        for line in article[1]:
                            pdf_text(story,line,styles["text"])
    story.append(Paragraph("Checklist de compreensão",styles["h1"]))
    pdf_text(story,"Marque apenas os assuntos que você já consegue explicar com suas palavras.",styles["text"])
    for topic in data["topics"]:
        story.append(Paragraph("□  "+xml_escape(topic[7]),styles["text"]))
    pdf_text(story,"Fonte: Base Completa — revisão guiada publicada até 11/11/2026.",styles["fine"])
    pdf=SimpleDocTemplate(str(path),pagesize=A4,leftMargin=20*mm,rightMargin=20*mm,topMargin=21*mm,bottomMargin=25*mm,title=f"Base Completa - Direito Civil - Revisão M{number:02d}",author="Base Completa")
    pdf.build(story,onFirstPage=on_page,onLaterPages=on_page)

def main():
    OUTPUT.mkdir(parents=True,exist_ok=True)
    INDIVIDUAIS.mkdir(parents=True,exist_ok=True)
    fonts()
    law=get_law()
    infos=[]
    pdfs=[]
    for n in range(1,16):
        data=get_module(n)
        name=f"Base_Completa_Civil_Revisao_M{n:02d}"
        dpath=INDIVIDUAIS/(name+".docx")
        ppath=INDIVIDUAIS/(name+".pdf")
        make_docx(n,data,law,dpath)
        make_pdf(n,data,law,ppath)
        infos.append((n,data["title"],len(data["topics"]),str(dpath.relative_to(OUTPUT)),str(ppath.relative_to(OUTPUT))))
        pdfs.append(ppath)
    combined=OUTPUT/"Base_Completa_Direito_Civil_M01_ao_M15_Revisoes_Guiadas.pdf"
    writer=PdfWriter()
    for p in pdfs:
        for page in PdfReader(str(p)).pages:
            writer.add_page(page)
    with combined.open("wb") as out:
        writer.write(out)
    lines=[
        "# Base Completa — Revisões recentes de Direito Civil",
        "",
        "Fonte: 15 arquivos de revisão guiada M01–M15 do código da Base Completa (11/11/2026).",
        "Extração fiel dos textos e dos artigos da lei seca anexos à revisão.",
        "Sem exercícios, gabaritos ou teorias completas Premium.",
        "Esta exportação é uma cópia dos textos da revisão publicada na data indicada;",
        "não inclui modificações posteriores em outra conversa ou alterações futuras.",
        "",
        "## Módulos"
    ]
    lines+= [f"- M{n:02d} — {title} ({topics} tópicos)" for n,title,topics,_,_ in infos]
    (OUTPUT/"LEIA-ME.md").write_text("\n".join(lines)+"\n",encoding="utf-8")
    archive=ROOT/"Base_Completa_Revisoes_Direito_Civil_M01-M15_20261111.zip"
    with zipfile.ZipFile(archive,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for f in sorted(OUTPUT.rglob("*")):
            if f.is_file():z.write(f,f.relative_to(OUTPUT))
    print(f"SUCESSO: {archive} | {archive.stat().st_size} bytes | 15 DOCX | 15 PDF | 1 PDF completo")
    print("MÓDULOS:",", ".join(f"M{n:02d}={topics}" for n,_,topics,_,_ in infos))
    print("PÁGINAS_TOTAL:",len(writer.pages))
    assert len(infos)==15
    assert len(list(INDIVIDUAIS.glob("*.docx")))==15
    assert len(list(INDIVIDUAIS.glob("*.pdf")))==15
    with zipfile.ZipFile(archive) as z: assert z.testzip() is None and len(z.namelist())==32

if __name__=="__main__":
    main()
