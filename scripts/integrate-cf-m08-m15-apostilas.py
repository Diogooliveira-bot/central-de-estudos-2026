"""Integra as fontes editoriais aprovadas dos módulos CF M08 a M15 na Central."""

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EDITORIAL = ROOT / "content/cf/editorial"
VERSION = "20261022cfm08m15apostila1"


def read_native(module: int) -> tuple[Path, dict]:
    key = f"m{module:02d}"
    path = ROOT / f"content/cf/{key}-native-data.js"
    source = path.read_text(encoding="utf-8")
    match = re.search(rf"\.{key}=(\{{.*\}});\}}\)\(window\);\s*$", source, re.S)
    if not match:
        raise ValueError(f"Não foi possível ler {path}")
    return path, json.loads(match.group(1))


def integrate(module: int) -> dict:
    key = f"m{module:02d}"
    path, data = read_native(module)
    content = (EDITORIAL / f"{key}-apostila.txt").read_text(encoding="utf-8").strip()
    questions = json.loads((EDITORIAL / f"{key}-questions.json").read_text(encoding="utf-8"))

    data["complete"] = content
    data["questions"] = questions
    data["moduleId"] = f"w{module}"
    data["lawTopicId"] = f"cf-{key}"
    data["editorialVersion"] = VERSION

    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    wrapper = (
        "(function(g){'use strict';g.BASE_NATIVE_CONTENT=g.BASE_NATIVE_CONTENT||{};"
        "g.BASE_NATIVE_CONTENT.cf=g.BASE_NATIVE_CONTENT.cf||{};"
        f"g.BASE_NATIVE_CONTENT.cf.{key}={payload};}})(window);\n"
    )
    path.write_text(wrapper, encoding="utf-8")
    return {
        "module": key,
        "characters": len(content),
        "completeQuestions": len(questions["complete"]),
        "summaryQuestions": len(questions["summary"]),
    }


if __name__ == "__main__":
    print(json.dumps([integrate(module) for module in range(8, 16)], ensure_ascii=False, indent=2))
