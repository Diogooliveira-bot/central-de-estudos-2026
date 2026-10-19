#!/usr/bin/env python3
"""Build a QC/central coverage matrix from the retained 416-caderno capture."""
import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DISCIPLINES = {
    "administrativo": "Direito Administrativo",
    "constitucional": "Direito Constitucional",
    "civil": "Direito Civil",
    "processo_civil": "Direito Processual Civil",
    "penal": "Direito Penal",
    "processo_penal": "Direito Processual Penal",
    "rlm": "Raciocínio Lógico-Matemático",
    "trabalho": "Direito do Trabalho",
    "processo_trabalho": "Direito Processual do Trabalho",
    "portugues": "Língua Portuguesa",
}


def js_assignment(path, marker):
    text = path.read_text(encoding="utf-8")
    start = text.index(marker) + len(marker)
    obj_start = text.index("{", start) if marker.endswith("=") else start
    value, _ = json.JSONDecoder().raw_decode(text[obj_start:])
    return value


def code_of(text):
    match = re.search(r"M\d+(?:\.\d+)?", text or "")
    return match.group(0) if match else ("RF" if "RF " in (text or "") else "")


def inventory_discipline(title):
    if title.startswith("RLM"):
        return "Raciocínio Lógico-Matemático"
    if title.startswith("DPT"):
        return "Direito Processual do Trabalho"
    if title.startswith("DT-"):
        return "Direito do Trabalho"
    if title.startswith("CF"):
        return "Direito Constitucional"
    if title.startswith(("Português", "Língua Portuguesa")):
        return "Língua Portuguesa"
    if title.startswith("DPP"):
        return "Direito Processual Penal"
    if title.startswith("DP"):
        return "Direito Penal"
    if title.startswith("Direito Civil"):
        return "Direito Civil"
    if title.startswith("ADM"):
        return "Direito Administrativo"
    if title.startswith(("PC ", "Processo Civil")):
        return "Direito Processual Civil"
    return "Outro"


def load_modules():
    runtime = (ROOT / "central-structural-v66119/runtime.js").read_text(encoding="utf-8")
    marker = "const SUBJECTS="
    start = runtime.index(marker) + len(marker)
    subjects, _ = json.JSONDecoder().raw_decode(runtime[start:])
    id_to_discipline = {
        "adm": "Direito Administrativo", "cf": "Direito Constitucional",
        "civil": "Direito Civil", "cpc": "Direito Processual Civil",
        "penal": "Direito Penal", "cpp": "Direito Processual Penal",
        "rlm": "Raciocínio Lógico-Matemático", "trab": "Direito do Trabalho",
        "ptra": "Direito Processual do Trabalho",
    }
    modules = defaultdict(dict)
    for subject in subjects:
        discipline = id_to_discipline.get(subject["id"])
        if not discipline:
            continue
        for index, topic in enumerate(subject.get("topics", []), 1):
            code = code_of(topic["title"]) or f"M{index:02d}"
            modules[discipline][code] = {"title": topic["title"], "source": "Central runtime"}

    # These native indexes are newer/more complete than the legacy runtime list.
    cpp = js_assignment(ROOT / "content/cpp/cpp-native-index.js", "window.CPP_NATIVE_INDEX=")
    for item in cpp["modules"]:
        code = f"M{int(item['number']):02d}"
        modules["Direito Processual Penal"][code] = {"title": item["title"], "source": "CPP native index"}
    ptra = js_assignment(ROOT / "content/ptra/ptra-native-index.js", "window.PTRA_NATIVE_INDEX=")
    for item in ptra["modules"]:
        code = f"M{int(item['number']):02d}"
        modules["Direito Processual do Trabalho"][code] = {"title": item["title"], "source": "PTRA native index"}
    adm = js_assignment(ROOT / "content/adm/adm-native-index.js", "window.ADM_NATIVE_INDEX=")
    for item in adm["modules"].values():
        code = f"M{int(item['number']):02d}"
        modules["Direito Administrativo"][code] = {"title": item["title"], "source": "ADM native index"}

    pt_text = (ROOT / "portugues-site.js").read_text(encoding="utf-8")
    pt_start = pt_text.index("var MODULES=") + len("var MODULES=")
    pt_items, _ = json.JSONDecoder().raw_decode(pt_text[pt_start:])
    for item in pt_items:
        code = f"M{int(item['num']):02d}"
        modules["Língua Portuguesa"][code] = {"title": item["title"], "source": "Português MODULES"}
    return modules


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", required=True, type=Path)
    args = parser.parse_args()
    inventory_root = json.loads(args.inventory.read_text(encoding="utf-8"))
    notebooks = inventory_root["cadernos"]
    main_map = json.loads((ROOT / "content/qc-sharing-links.json").read_text(encoding="utf-8"))
    cpc_map = js_assignment(ROOT / "content/cpc/cpc-sharing-links.js", "window.CPC_SHARING_LINKS=")

    integrations = {}
    for item in main_map["items"]:
        if item.get("status") == "VALIDADO" and item.get("id"):
            integrations[str(item["id"])] = {
                "discipline": item["discipline"], "code": item["code"],
                "source": "content/qc-sharing-links.json",
                "validated": str(item.get("source", "")).startswith("QC autenticado:"),
            }
    for module in cpc_map["modules"].values():
        for item in [module.get("general"), *module.get("subdivisions", [])]:
            if item and item.get("id"):
                integrations[str(item["id"])] = {
                    "discipline": "Direito Processual Civil", "code": item["code"],
                    "source": "content/cpc/cpc-sharing-links.js",
                    "validated": False,
                }

    pending = [item for item in main_map["items"] if item.get("status") == "Pendente"]
    modules = load_modules()
    indexed = defaultdict(list)
    inventory_codes = {}
    for notebook in notebooks:
        discipline = inventory_discipline(notebook["titulo"])
        code = code_of(notebook["titulo"])
        inventory_codes[notebook["id"]] = (discipline, code)
        indexed[(discipline, code.split(".")[0] if code else "")].append(notebook)

    pending_by_module = defaultdict(list)
    for item in pending:
        discipline = item["discipline"]
        code = item["code"]
        pending_by_module[(discipline, code.split(".")[0])].append(item)

    rows = []
    summary = defaultdict(Counter)
    for discipline, course_modules in modules.items():
        for code, module in course_modules.items():
            candidates = indexed.get((discipline, code.split(".")[0]), [])
            mapped = [x for x in candidates if x["id"] in integrations]
            unmapped = [x for x in candidates if x["id"] not in integrations]
            pending_rows = pending_by_module.get((discipline, code.split(".")[0]), [])
            status = ("Validado e integrado" if any(integrations[x["id"]].get("validated") for x in mapped) else
                      "Necessita validação manual" if mapped else
                      "Sem correspondência confirmada" if unmapped else
                      "Pendente sem filtro exclusivo" if pending_rows else
                      "Não localizado")
            rows.append({
                "tipo_registro": "Módulo da Central", "disciplina": discipline,
                "modulo": code, "titulo_modulo_central": module["title"],
                "submodulo": "", "id_caderno_qc": "", "titulo_caderno_qc": "",
                "status": status, "integrado_no_codigo": "sim" if mapped else "não",
                "origem_integracao": "; ".join(sorted({integrations[x["id"]]["source"] for x in mapped})),
                "comparacao_codigo": "correspondência estrutural" if mapped else "sem associação validada",
                "cadernos_candidatos_mesmo_codigo": "; ".join(x["id"] for x in unmapped),
                "observacao": f"{len(candidates)} cadernos no inventário; {len(mapped)} integrados em código; {len(pending_rows)} itens pendentes no mapa.",
            })
            summary[discipline][status] += 1

    for notebook in notebooks:
        discipline = inventory_discipline(notebook["titulo"])
        code = code_of(notebook["titulo"])
        parent = code.split(".")[0] if code else ""
        module = modules.get(discipline, {}).get(parent, {})
        integration = integrations.get(notebook["id"])
        status = ("Validado e integrado" if integration and integration.get("validated") else
                  "Necessita validação manual" if integration else "Sem correspondência confirmada")
        rows.append({
            "tipo_registro": "Caderno existente no QC", "disciplina": discipline,
            "modulo": parent, "titulo_modulo_central": module.get("title", ""),
            "submodulo": code if code and code != parent else "",
            "id_caderno_qc": notebook["id"], "titulo_caderno_qc": notebook["titulo"],
            "status": status, "integrado_no_codigo": "sim" if integration else "não",
            "origem_integracao": integration["source"] if integration else "",
            "comparacao_codigo": ("conteúdo das questões conferido em sessão autenticada do QC" if integration and integration.get("validated") else
                                  "código do módulo confere; questão/assunto do filtro requer validação humana" if integration else "candidato por disciplina/código; título não comprova o tema"),
            "cadernos_candidatos_mesmo_codigo": "",
            "observacao": ("Filtro aberto no QC autenticado; quantidade e assuntos das questões conferidos." if integration and integration.get("validated") else
                           "Caderno já consta nos mapas do código; a abertura autenticada no QC segue necessária para confirmar destino/filtro." if integration else "Caderno e código são sugestões de correspondência; conteúdo do filtro QC não confirmado."),
        })
        summary[discipline][status] += 1

    inventory_by_discipline_code = defaultdict(list)
    for notebook in notebooks:
        discipline = inventory_discipline(notebook["titulo"])
        code = code_of(notebook["titulo"])
        if code:
            inventory_by_discipline_code[(discipline, code)].append(notebook["id"])
    for item in pending:
        code = item["code"]
        discipline = item["discipline"]
        same_code = inventory_by_discipline_code.get((discipline, code), [])
        rows.append({
            "tipo_registro": "Filtro esperado sem link QC integrado", "disciplina": discipline,
            "modulo": code.split(".")[0], "titulo_modulo_central": item.get("moduleTitle", ""),
            "submodulo": code if "." in code else "", "id_caderno_qc": "",
            "titulo_caderno_qc": item.get("title", ""), "status": "Pendente sem filtro exclusivo",
            "integrado_no_codigo": "não", "origem_integracao": item.get("source", ""),
            "comparacao_codigo": "pendência registrada sem ID/link; candidato por código exige validação temática" if same_code else "sem candidato do mesmo código no inventário",
            "cadernos_candidatos_mesmo_codigo": "; ".join(same_code),
            "observacao": item.get("pendingReason", "") or "Filtro específico ausente do catálogo integrado.",
        })
        summary[discipline]["Pendente sem filtro exclusivo"] += 1

    output = ROOT / "audits/qc-integral-20261019"
    output.mkdir(parents=True, exist_ok=True)
    fields = ["tipo_registro", "disciplina", "modulo", "titulo_modulo_central", "submodulo", "id_caderno_qc", "titulo_caderno_qc", "status", "integrado_no_codigo", "origem_integracao", "comparacao_codigo", "cadernos_candidatos_mesmo_codigo", "observacao"]
    with (output / "matriz-qc-central.csv").open("w", newline="", encoding="utf-8-sig") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    print(json.dumps({
        "inventory": len(notebooks), "integrated_ids_in_code": len(integrations),
        "pending": len(pending), "matrix_rows": len(rows),
        "module_counts": {d: len(v) for d, v in modules.items()},
        "inventory_counts": dict(Counter(inventory_discipline(x["titulo"]) for x in notebooks)),
        "summary": {d: dict(c) for d, c in summary.items()},
        "unmatched_adm": [{"id": x["id"], "title": x["titulo"]} for x in notebooks if inventory_discipline(x["titulo"]) == "Direito Administrativo" and x["id"] not in integrations],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
