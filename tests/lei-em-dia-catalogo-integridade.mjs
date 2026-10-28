import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const root = new URL("../", import.meta.url);

function firstQuestionArray(source, path) {
  const match = /\bconst\s+DATA_[A-Z0-9_]+\s*=\s*\[/.exec(source);
  assert.ok(match, "Array de dados não localizada: " + path);
  const begin = match.index + match[0].lastIndexOf("[");
  let depth = 0;
  let quoted = "";
  let escaped = false;
  let end = -1;
  for (let i = begin; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quoted) quoted = "";
    } else if (c === '"' || c === "'") quoted = c;
    else if (c === "[") depth++;
    else if (c === "]" && --depth === 0) {
      end = i + 1;
      break;
    }
  }
  assert.ok(end > begin, "Array incompleta: " + path);
  return JSON.parse(source.slice(begin, end));
}

test("Inventário integral: IDs, enunciados, gabaritos tipados, fontes e estrutura", () => {
  const manifest = JSON.parse(readFileSync(
    new URL("audits/lei-em-dia-auditoria-20261012-inventario.json", root), "utf8"));
  const seen = new Map();
  let questions = 0;
  let filesChecked = 0;
  for (const entry of manifest.files) {
    if (entry.questionObjectCount === 0) continue;
    const raw = readFileSync(new URL(entry.path, root), "utf8");
    const items = firstQuestionArray(raw, entry.path);
    if (entry.path === "tools/decorando-data-restantes.js") {
      // Inventário de 12/10 é histórico. Em 23/10 foram retiradas 165 questões
      // de Trabalho e 69 de Processo do Trabalho (234 no total).
      // Validar a remoção expressamente, sem alterar o snapshot histórico.
      assert.equal(entry.questionObjectCount,448);
      assert.equal(items.length,214,"Somente as 234 questões das disciplinas removidas podem faltar");
      assert.ok(items.every(q=>!["trabalho","ptrabalho"].includes(q.discipline)),
        "A publicação atual não pode restaurar disciplinas removidas");
      assert.deepEqual(Object.fromEntries(["penal","cpp","cpc"].map(d=>
        [d,items.filter(q=>q.discipline===d).length])),{penal:147,cpp:50,cpc:17});
    } else {
      assert.equal(items.length, entry.questionObjectCount, "Contagem alterada: " + entry.path);
    }
    filesChecked++;
    for (const q of items) {
      const location = entry.path + " · " + String(q.id || "sem ID");
      assert.ok(typeof q.id === "string" && q.id.trim(), "ID vazio: " + location);
      assert.ok(!seen.has(q.id), "ID duplicado: " + location + " / " + seen.get(q.id));
      seen.set(q.id, entry.path);
      assert.ok(q.question && typeof q.question.statement === "string" &&
        q.question.statement.trim(), "Enunciado ausente: " + location);
      assert.ok(typeof q.question.answer === "boolean", "Gabarito não booleano: " + location);
      assert.ok(typeof q.question.source === "string" &&
        q.question.source.trim(), "Fonte ausente: " + location);
      assert.ok(Array.isArray(q.parts) && q.parts.length > 0,
        "Base legal ausente: " + location);
      assert.ok(!/Lei 13\.303\/2026|Lei 1\x603\.848\/19|3º Região/.test(
        [q.question.source, q.question.meta].join(" ")), "Metadado incorreto: " + location);
      questions++;
    }
  }
  // Snapshot de 12/10 permanece imutável: 448 -> 214 após retirada autorizada de 234 itens.
  assert.equal(questions, manifest.sumOfScriptObjectCounts-234,
    "Total atual diverge do inventário histórico além das 234 questões retiradas");
  assert.equal(seen.size, questions, "Quantidade de IDs exclusivos divergente");
  console.log(JSON.stringify({filesChecked, questions, uniqueIds: seen.size,
    scope: "integridade estrutural; não certifica gabaritos juridicamente nem revisa comentários"}));
});
