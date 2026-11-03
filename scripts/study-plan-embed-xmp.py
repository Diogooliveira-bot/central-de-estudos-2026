#!/usr/bin/env python3
"""Base Completa: inclui o cronograma JSON como metadados XMP em um PDF oficial.

Exemplo:
    pip install pymupdf
    python scripts/study-plan-embed-xmp.py --pdf plano.pdf --json plano.json --out plano-inteligente.pdf

O aluno recebe APENAS o PDF final. Nunca coloca ZIP ou JSON na mão do aluno.
Este utilitário é para o gerador do Léo, não é executado pela Central.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
from pathlib import Path
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Dependência ausente: instale com 'pip install pymupdf'.")

MAX_PDF_BYTES = 2_600_000
MAX_JSON_BYTES = 250_000


def embed(pdf_path: Path, json_path: Path, out_path: Path) -> Path:
    if pdf_path.resolve() == out_path.resolve():
        raise ValueError("A saída deve ser diferente do PDF de origem.")
    if out_path.resolve() == json_path.resolve():
        raise ValueError("A saída não pode substituir o JSON.")
    if pdf_path.stat().st_size > MAX_PDF_BYTES:
        raise ValueError("PDF original acima de 2,6 MB.")
    if json_path.stat().st_size > MAX_JSON_BYTES:
        raise ValueError("JSON acima de 250 kB.")
    raw = json_path.read_bytes()
    doc = json.loads(raw.decode("utf-8"))
    if doc.get("schema_version") != "1.0.0":
        raise ValueError("O plano.json deve usar schema_version 1.0.0.")

    digest = hashlib.sha256(raw).hexdigest()
    payload = base64.b64encode(raw).decode("ascii")
    xmp = (
        '<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?>\n'
        '<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Base Completa">\n'
        '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n'
        '<rdf:Description xmlns:bc="https://basecompleta.com.br/ns/study-plan/1.0.0" rdf:about="">\n'
        '<bc:studyPlan version="1.0.0" sha256="' + digest + '">' +
        payload + '</bc:studyPlan>\n'
        '</rdf:Description>\n</rdf:RDF>\n</x:xmpmeta>\n<?xpacket end="w"?>'
    )

    with fitz.open(pdf_path) as original:
        if original.is_encrypted:
            raise ValueError("PDF protegido por senha não é aceito.")
        if original.page_count == 0:
            raise ValueError("PDF sem páginas.")
        # Mantém todas as páginas do modelo oficial; altera somente o XMP.
        original.set_xml_metadata(xmp)
        original.save(out_path, garbage=4, deflate=False)

    if out_path.stat().st_size > MAX_PDF_BYTES:
        out_path.unlink()
        raise ValueError("PDF inteligente acima de 2,6 MB. Reduza as imagens do original.")
    with fitz.open(out_path) as result:
        metadata = result.get_xml_metadata()
        if result.page_count == 0 or digest not in metadata or payload not in metadata:
            raise ValueError("Falha na verificação do PDF inteligente.")
    return out_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera PDF inteligente Base Completa sem ZIP.")
    parser.add_argument("--pdf", type=Path, required=True, help="PDF visual oficial aprovado")
    parser.add_argument("--json", type=Path, required=True, help="JSON Schema v1.0.0")
    parser.add_argument("--out", type=Path, required=True, help="PDF que será enviado ao estudante")
    args = parser.parse_args()
    print(embed(args.pdf, args.json, args.out))


if __name__ == "__main__":
    main()
