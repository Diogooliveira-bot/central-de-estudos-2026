#!/usr/bin/env python3
"""Build the admin-only QC notebook inventory from the retained 416-item capture."""

from __future__ import annotations

import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / "audits/qc-integral-20261019"
SOURCE = AUDIT / "fontes/qc_todos_cadernos_416.json"
MATRIX = AUDIT / "matriz-qc-central.csv"
MAIN_MAP = ROOT / "content/qc-sharing-links.json"
CPC_MAP = ROOT / "content/cpc/cpc-sharing-links.js"
OUTPUT = ROOT / "content/qc-notebook-catalog.js"

DISCIPLINE_KEYS = {
    "Direito Administrativo": "administrativo",
    "Direito Constitucional": "constitucional",
    "Direito Civil": "civil",
    "Direito Processual Civil": "processual-civil",
    "Direito Penal": "penal",
    "Direito Processual Penal": "processual-penal",
    "Raciocínio Lógico-Matemático": "rlm",
    "Direito do Trabalho": "trabalho",
    "Direito Processual do Trabalho": "processual-trabalho",
    "Língua Portuguesa": "portugues",
}


def main() -> None:
    source = json.loads(SOURCE.read_text(encoding="utf-8"))
    main_map = json.loads(MAIN_MAP.read_text(encoding="utf-8"))
    linked_ids = {str(item["id"]) for item in main_map["items"] if item.get("id")}
    cpc_source = CPC_MAP.read_text(encoding="utf-8")
    linked_ids.update(re.findall(r'"id":"(\d+)"', cpc_source))

    matrix_rows = list(csv.DictReader(MATRIX.open(encoding="utf-8-sig")))
    matrix = {
        row["id_caderno_qc"]: row
        for row in matrix_rows
        if row["tipo_registro"] == "Caderno existente no QC" and row["id_caderno_qc"]
    }
    pending = [
        row for row in matrix_rows
        if row["tipo_registro"] == "Filtro esperado sem link QC integrado"
        and row["status"] == "Pendente sem filtro exclusivo"
    ]

    rows = []

    def display_title(value: str) -> str:
        """Repair common UTF-8-as-Latin-1 mojibake while retaining sourceTitle."""
        value = str(value or "")
        if not any(marker in value for marker in ("Ã", "Â", "â")):
            return value
        try:
            repaired = value.encode("latin-1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            return value
        markers = ("Ã", "Â", "â")
        return repaired if sum(repaired.count(marker) for marker in markers) < sum(value.count(marker) for marker in markers) else value

    for notebook in source["cadernos"]:
        notebook_id = str(notebook["id"])
        match = matrix.get(notebook_id, {})
        discipline = match.get("disciplina", "")
        code = match.get("submodulo") or match.get("modulo", "")
        exact_pending = next((
            item for item in pending
            if item["disciplina"] == discipline
            and (item.get("submodulo") or item.get("modulo")) == code
        ), None)
        linked = notebook_id in linked_ids
        rows.append({
            "id": notebook_id,
            "title": display_title(notebook.get("titulo", "")),
            "sourceTitle": notebook.get("titulo", ""),
            "url": notebook.get("url", ""),
            "page": notebook.get("pagina"),
            "candidateDiscipline": discipline,
            "candidateDisciplineKey": DISCIPLINE_KEYS.get(discipline, ""),
            "candidateModule": match.get("modulo", ""),
            "candidateSubmodule": match.get("submodulo", ""),
            "candidateModuleTitle": match.get("titulo_modulo_central", ""),
            "linkedInExistingMap": linked,
            "reviewStatus": "linked-in-existing-map" if linked else "no-confirmed-module-match",
            "pendingCandidateCode": (exact_pending.get("submodulo") or exact_pending.get("modulo")) if exact_pending else "",
            "pendingCandidateTitle": exact_pending.get("titulo_caderno_qc", "") if exact_pending else "",
            "evidenceNote": (
                "ID encontrado em um mapa QC existente; a validação do destino requer abertura autenticada."
                if linked else
                "A disciplina/código é apenas sugestão da matriz; não exibir como filtro do aluno sem validação temática."
            ),
        })

    if len(rows) != 416 or len({row["id"] for row in rows}) != 416:
        raise SystemExit("Inventário inesperado: esperado 416 IDs únicos.")
    payload = {
        "schema": "qc-notebook-inventory-v1",
        "capturedAt": source.get("extraidoEm", ""),
        "source": source.get("origem", ""),
        "total": len(rows),
        "linkedInExistingMap": sum(row["linkedInExistingMap"] for row in rows),
        "withoutConfirmedModuleMatch": sum(not row["linkedInExistingMap"] for row in rows),
        "items": rows,
    }
    OUTPUT.write_text(
        "/* Generated from audits/qc-integral-20261019/build_qc_catalog.py. */\n"
        "window.QC_NOTEBOOK_CATALOG = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(json.dumps({key: payload[key] for key in ("total", "linkedInExistingMap", "withoutConfirmedModuleMatch")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
