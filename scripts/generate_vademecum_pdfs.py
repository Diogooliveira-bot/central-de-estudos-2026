from pathlib import Path
import re, csv, zipfile, time
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup
from weasyprint import HTML, CSS

LAWS = [
("Lei 9.074/1995 - Concessoes e permissoes","lei",9074,1995),
("Lei 8.745/1993 - Contratacao temporaria federal","lei",8745,1993),
("Lei 9.637/1998 - Organizacoes Sociais","lei",9637,1998),
("Lei 9.790/1999 - OSCIP","lei",9790,1999),
("Lei 8.958/1994 - Fundacoes de apoio","lei",8958,1994),
("Lei 11.107/2005 - Consorcios publicos","lei",11107,2005),
("Lei 13.019/2014 - MROSC","lei",13019,2014),
("Lei 13.848/2019 - Agencias reguladoras","lei",13848,2019),
("Lei 8.443/1992 - Lei Organica do TCU","lei",8443,1992),
("Lei 13.869/2019 - Abuso de autoridade","lei",13869,2019),
("Lei 13.709/2018 - LGPD","lei",13709,2018),
("Lei 14.129/2021 - Governo Digital","lei",14129,2021),
("Lei 8.078/1990 - Codigo de Defesa do Consumidor","lei",8078,1990),
("Lei 8.069/1990 - ECA","lei",8069,1990),
("Lei 13.146/2015 - Estatuto da Pessoa com Deficiencia","lei",13146,2015),
("Lei 8.245/1991 - Inquilinato","lei",8245,1991),
("Lei 6.015/1973 - Registros Publicos","lei",6015,1973),
("Lei 6.766/1979 - Parcelamento do Solo Urbano","lei",6766,1979),
("Lei 8.009/1990 - Bem de Familia","lei",8009,1990),
("Lei 8.560/1992 - Investigacao de Paternidade","lei",8560,1992),
("Lei 5.478/1968 - Alimentos","lei",5478,1968),
("Lei 11.804/2008 - Alimentos Gravidicos","lei",11804,2008),
("Lei 9.278/1996 - Uniao Estavel","lei",9278,1996),
("Lei 9.434/1997 - Transplantes","lei",9434,1997),
("Lei 9.514/1997 - Alienacao fiduciaria de imoveis","lei",9514,1997),
("Lei 6.404/1976 - Sociedades por Acoes","lei",6404,1976),
("Lei 9.307/1996 - Arbitragem","lei",9307,1996),
("Lei 15.040/2024 - Marco Legal dos Seguros","lei",15040,2024),
("Lei 13.465/2017 - REURB","lei",13465,2017),
("Lei 14.382/2022 - SERP e Registros Publicos Eletronicos","lei",14382,2022),
("Lei 14.711/2023 - Marco Legal das Garantias","lei",14711,2023),
("Lei 11.419/2006 - Processo Judicial Eletronico","lei",11419,2006),
("Lei 12.016/2009 - Mandado de Seguranca","lei",12016,2009),
("Lei 4.717/1965 - Acao Popular","lei",4717,1965),
("Lei 7.347/1985 - Acao Civil Publica","lei",7347,1985),
("Lei 13.300/2016 - Mandado de Injuncao","lei",13300,2016),
("Lei 9.507/1997 - Habeas Data","lei",9507,1997),
("Lei 9.868/1999 - ADI e ADC","lei",9868,1999),
("Lei 9.882/1999 - ADPF","lei",9882,1999),
("Lei 11.417/2006 - Sumula Vinculante","lei",11417,2006),
("Lei 1.079/1950 - Crimes de Responsabilidade","lei",1079,1950),
("CLT - Decreto-Lei 5.452/1943","decreto-lei",5452,1943),
("Lei 5.889/1973 - Trabalho Rural","lei",5889,1973),
("Lei 6.019/1974 - Trabalho Temporario e Terceirizacao","lei",6019,1974),
("Lei 9.601/1998 - Contrato por prazo determinado","lei",9601,1998),
("Lei 11.788/2008 - Estagio","lei",11788,2008),
("Lei 9.608/1998 - Servico Voluntario","lei",9608,1998),
("Lei 8.036/1990 - FGTS","lei",8036,1990),
("Lei 9.029/1995 - Discriminacao no Trabalho","lei",9029,1995),
("Lei 7.783/1989 - Greve","lei",7783,1989),
("Lei 11.648/2008 - Centrais Sindicais","lei",11648,2008),
("Lei 4.090/1962 - 13o Salario","lei",4090,1962),
("Lei 4.749/1965 - Adiantamento do 13o","lei",4749,1965),
("Lei 14.611/2023 - Igualdade Salarial","lei",14611,2023),
("Lei 14.457/2022 - Emprega Mais Mulheres","lei",14457,2022),
("LC 150/2015 - Empregado Domestico","lc",150,2015),
("Lei 9.279/1996 - Propriedade Industrial","lei",9279,1996),
("Lei 8.213/1991 - Beneficios Previdenciarios","lei",8213,1991),
("LC 75/1993 - Lei Organica do MPU","lc",75,1993),
("Lei 6.830/1980 - Execucao Fiscal","lei",6830,1980),
("Lei 5.584/1970 - Procedimentos Trabalhistas","lei",5584,1970),
("Lei 7.701/1988 - Processamento nos Tribunais Trabalhistas","lei",7701,1988),
("Lei 11.343/2006 - Drogas","lei",11343,2006),
("Lei 9.613/1998 - Lavagem de Dinheiro","lei",9613,1998),
("Lei 12.850/2013 - Organizacoes Criminosas","lei",12850,2013),
("Lei 11.340/2006 - Maria da Penha","lei",11340,2006),
("Lei 8.072/1990 - Crimes Hediondos","lei",8072,1990),
("Lei 9.455/1997 - Tortura","lei",9455,1997),
("Lei 7.716/1989 - Crimes de Racismo","lei",7716,1989),
("Lei 9.605/1998 - Crimes Ambientais","lei",9605,1998),
("Lei 8.137/1990 - Crimes contra a Ordem Tributaria","lei",8137,1990),
("Lei 9.099/1995 - Juizados Especiais","lei",9099,1995),
("Lei 13.344/2016 - Trafico de Pessoas","lei",13344,2016),
("Lei 14.478/2022 - Marco dos Criptoativos","lei",14478,2022),
("Lei 12.830/2013 - Investigacao Criminal pelo Delegado","lei",12830,2013),
("LC 101/2000 - Lei de Responsabilidade Fiscal","lc",101,2000),
("Lei 10.028/2000 - Crimes contra as Financas Publicas","lei",10028,2000),
("Lei 14.824/2024 - Conselho Superior da Justica do Trabalho","lei",14824,2024),
]

OUT = Path("generated_vademecum_pdfs")
OUT.mkdir(exist_ok=True)

def safe_name(s):
    s = re.sub(r'[<>:"/\\\\|?*]+', "_", s)
    return re.sub(r"\s+", " ", s).strip()

def periods(year):
    if year >= 2023: return ["_ato2023-2026"]
    if year >= 2019: return ["_ato2019-2022"]
    if year >= 2015: return ["_ato2015-2018"]
    if year >= 2011: return ["_ato2011-2014"]
    if year >= 2007: return ["_ato2007-2010"]
    if year >= 2004: return ["_ato2004-2006"]
    return []

def candidates(tipo, num, year):
    n=str(num)
    urls=[]
    if tipo=="lc":
        for suff in ("compilado.htm","compilada.htm",".htm"):
            urls.append(f"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp{n}{suff}")
    elif tipo=="decreto-lei":
        for suff in ("compilado.htm","compilada.htm",".htm"):
            urls.append(f"https://www.planalto.gov.br/ccivil_03/decreto-lei/del{n}{suff}")
    else:
        for p in periods(year):
            for suff in ("compilado.htm","compilada.htm",".htm"):
                urls.append(f"https://www.planalto.gov.br/ccivil_03/{p}/{year}/lei/l{n}{suff}")
        if 2001 <= year <= 2003:
            for suff in ("compilado.htm","compilada.htm",".htm"):
                urls.append(f"https://www.planalto.gov.br/ccivil_03/leis/{year}/l{n}{suff}")
        for suff in ("compilado.htm","compilada.htm",".htm"):
            urls.append(f"https://www.planalto.gov.br/ccivil_03/leis/l{n}{suff}")
    # algumas paginas usam .HTM
    return list(dict.fromkeys(urls + [u[:-3]+"HTM" for u in urls if u.lower().endswith(".htm")]))

session=requests.Session()
session.headers.update({"User-Agent":"Mozilla/5.0 BaseCompleta/1.0"})

def fetch_official(tipo,num,year):
    for url in candidates(tipo,num,year):
        try:
            r=session.get(url,timeout=6,allow_redirects=True)
            if r.status_code != 200 or len(r.content) < 600:
                continue
            r.encoding = r.apparent_encoding or r.encoding
            txt=r.text
            low=txt.lower()
            if "página não encontrada" in low or "pagina nao encontrada" in low or "404" in (r.url or ""):
                continue
            # evita aceitar pagina vazia/indice
            if not any(x in low for x in ("lei nº","lei n", "decreto-lei", "presidência da república", "presidencia da republica")):
                continue
            return r.url, txt
        except Exception:
            continue
    return None, None

BASE_CSS = """
@page { size: A4; margin: 16mm 15mm 17mm 15mm; }
body { font-family: "DejaVu Sans", Arial, sans-serif !important; font-size: 9.5pt !important; line-height: 1.42 !important; color:#111 !important; }
p, div, span, td { font-size: 9.5pt !important; line-height: 1.42 !important; }
table { max-width:100% !important; width:auto !important; border-collapse:collapse; }
img { max-width:100% !important; height:auto !important; }
a { color:#111 !important; text-decoration:none !important; }
@media print { .no-print { display:none !important; } }
"""

rows=[]
ok=0

def generate_one(item):
    name,tipo,num,year=item
    print(f"[START] {name}", flush=True)
    url, source=fetch_official(tipo,num,year)
    if not source:
        print(f"[FALHA URL] {name}", flush=True)
        return [name,tipo,num,year,"FALHA","",""]
    try:
        soup=BeautifulSoup(source,"html.parser")
        for tag in soup(["script","noscript"]):
            tag.decompose()
        header=soup.new_tag("div")
        header["style"]="border-bottom:1px solid #aaa;padding-bottom:8px;margin-bottom:14px;font-family:Arial,sans-serif"
        title=soup.new_tag("div")
        title["style"]="font-size:12pt;font-weight:bold;margin-bottom:3px"
        title.string=name
        src=soup.new_tag("div")
        src["style"]="font-size:7.5pt;color:#555"
        src.string="Fonte oficial: Presidencia da Republica - Planalto | " + url
        header.append(title); header.append(src)
        body=soup.body
        if body:
            body.insert(0,header)
            html=str(soup)
        else:
            html="<html><body>"+str(header)+str(soup)+"</body></html>"
        out=OUT/(safe_name(name)+".pdf")
        HTML(string=html,base_url=url).write_pdf(str(out),stylesheets=[CSS(string=BASE_CSS)])
        size=out.stat().st_size if out.exists() else 0
        if size < 2000:
            raise RuntimeError("PDF muito pequeno")
        print(f"[OK] {name} - {size} bytes", flush=True)
        return [name,tipo,num,year,"OK",url,size]
    except Exception as e:
        print(f"[FALHA PDF] {name}: {e}", flush=True)
        return [name,tipo,num,year,"FALHA_PDF",url,str(e)]

with ThreadPoolExecutor(max_workers=6) as ex:
    futs={ex.submit(generate_one,item):item for item in LAWS}
    for fut in as_completed(futs):
        row=fut.result()
        rows.append(row)
        if row[4]=="OK":
            ok+=1

rows.sort(key=lambda r: r[0])

with open(OUT/"relatorio.csv","w",newline="",encoding="utf-8-sig") as f:
    w=csv.writer(f,delimiter=";")
    w.writerow(["nome","tipo","numero","ano","status","url","detalhe"])
    w.writerows(rows)

with open(OUT/"README.txt","w",encoding="utf-8") as f:
    f.write(f"Base Completa - PDFs do Vade Mecum\n\nGerados com fonte oficial do Planalto.\nSucessos: {ok}/{len(LAWS)}\n\nVeja relatorio.csv para conferir a URL oficial de cada diploma.\n")

zip_path=Path("PDFs_VadeMecum.zip")
with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED) as z:
    for p in OUT.iterdir():
        z.write(p,arcname=p.name)
print(f"FINAL: {ok}/{len(LAWS)} PDFs. ZIP={zip_path}", flush=True)
