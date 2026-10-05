from pathlib import Path
import requests, time

OUT=Path("three_missing")
OUT.mkdir(exist_ok=True)

FILES=[
    ("Lei 6.404_1976 - Sociedades por Acoes.pdf",[
        "https://www2.camara.leg.br/legin/fed/lei/1970-1979/lei-6404-15-dezembro-1976-368447-normaatualizada-pl.pdf",
        "https://planalto.gov.br/ccivil_03/leis/l6404compilada.htm",
    ]),
    ("LC 75_1993 - Lei Organica do MPU.pdf",[
        "https://www2.camara.leg.br/legin/fed/leicom/1993/leicomplementar-75-20-maio-1993-354948-normaatualizada-pl.pdf",
        "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp75.htm",
    ]),
    ("Lei 11.340_2006 - Maria da Penha.pdf",[
        "https://www2.camara.leg.br/legin/fed/lei/2006/lei-11340-7-agosto-2006-545133-normaatualizada-pl.pdf",
        "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm",
    ]),
]

headers={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36"}

for name,urls in FILES:
    ok=False
    for url in urls:
        for attempt in range(3):
            try:
                r=requests.get(url,headers=headers,timeout=90,allow_redirects=True,verify=True)
                print(name,url,r.status_code,r.headers.get("content-type"),len(r.content),flush=True)
                if r.status_code==200 and len(r.content)>5000:
                    data=r.content
                    ctype=(r.headers.get("content-type") or "").lower()
                    if data[:4]==b"%PDF" or "pdf" in ctype:
                        (OUT/name).write_bytes(data)
                        ok=True
                        break
            except Exception as e:
                print("ERR",name,url,attempt,e,flush=True)
                time.sleep(2)
        if ok: break
    (OUT/(name+".status.txt")).write_text("OK" if ok else "FALHA",encoding="utf-8")

print("done",flush=True)
