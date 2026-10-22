#!/usr/bin/env python3
"""Publica as apostilas DOCX de CF M03-M05 no leitor nativo da Central."""

from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

from docx import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
MODULES = {
    3: WORKSPACE / "output/cf-m03/CF-M03-Apostila-Didatica-1.docx",
    4: WORKSPACE / "output/cf-m04/CF-M04-Apostila-Didatica-1.docx",
    5: WORKSPACE / "output/cf-m05/CF-M05-Apostila-Didatica-1.docx",
}


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def load_builder(number: int):
    path = ROOT / f"scripts/build-cf-m{number:02d}-docx.py"
    spec = importlib.util.spec_from_file_location(f"cf_m{number:02d}_builder", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def extract_apostila(path: Path) -> str:
    doc = Document(path)
    parts: list[str] = []
    started = False

    for child in doc.element.body.iterchildren():
        if isinstance(child, CT_P):
            paragraph = Paragraph(child, doc)
            text = normalize(paragraph.text)
            if not text:
                continue
            if not started:
                started = paragraph.style.name.startswith("Heading 1")
                if not started:
                    continue

            style = paragraph.style.name
            if style.startswith("Heading"):
                parts.extend([text.upper(), ""])
            elif style.startswith("List Bullet"):
                parts.extend([f"• {text}", ""])
            elif text.startswith(("☐", "□")):
                parts.extend([f"• {text}", ""])
            else:
                parts.extend([text, ""])

        elif isinstance(child, CT_Tbl) and started:
            table = Table(child, doc)
            rows = []
            for row in table.rows:
                cells = [normalize(cell.text) for cell in row.cells]
                if any(cells):
                    rows.append("   ".join(cells))
            if rows:
                parts.extend(rows)
                parts.append("")

    text = "\n".join(parts).strip()
    if "CHECKLIST DE DOMÍNIO" not in text:
        raise ValueError(f"Checklist não encontrado em {path}")
    return text


def load_native(path: Path, number: int) -> dict:
    source = path.read_text(encoding="utf-8")
    match = re.search(
        rf"\.m{number:02d}=(\{{.*\}});\}}\)\(window\);\s*$", source, re.S
    )
    if not match:
        raise ValueError(f"Formato inesperado em {path}")
    return json.loads(match.group(1))


def write_native(path: Path, number: int, data: dict) -> None:
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    source = (
        "(function(g){'use strict';"
        "g.BASE_NATIVE_CONTENT=g.BASE_NATIVE_CONTENT||{};"
        "g.BASE_NATIVE_CONTENT.cf=g.BASE_NATIVE_CONTENT.cf||{};"
        f"g.BASE_NATIVE_CONTENT.cf.m{number:02d}={payload};"
        "})(window);\n"
    )
    path.write_text(source, encoding="utf-8")


def main() -> None:
    for number, docx_path in MODULES.items():
        if not docx_path.exists():
            raise FileNotFoundError(docx_path)

        builder = load_builder(number)
        native_path = ROOT / f"content/cf/m{number:02d}-native-data.js"
        data = load_native(native_path, number)
        data["complete"] = extract_apostila(docx_path)
        data["questions"] = {
            "summary": builder.REVIEW_QUESTIONS,
            "complete": builder.QUESTIONS,
        }
        write_native(native_path, number, data)
        print(
            f"CF M{number:02d}: {len(data['complete'])} caracteres, "
            f"{len(builder.QUESTIONS)} + {len(builder.REVIEW_QUESTIONS)} questões"
        )


if __name__ == "__main__":
    main()
