/* Integração CF M1–M12 — staging
 * Fonte: CF_M1_M12_AUDITADO_PRONTO_INTEGRACAO.zip
 * Estratégia: content-only / merge não destrutivo.
 * Esta branch NÃO é Production e não limpa qualquer estado persistido.
 */
window.CF_AUDITED_INTEGRATION = Object.freeze({
  version: "2026-09-19-final-audit",
  status: "staging",
  modules: ["w1","w2","w3","w4","w5","w6","w7","w8","w9","w10","w11","w12"],
  preserve: [
    "progress","status","readChecks","ankiAnswers","ankiStats","decorando",
    "tecQuestions","tecRounds","tecStats","history","correctWrongHistory",
    "percentages","notes","lastSeen","streaks","userStorage"
  ],
  destructiveMigration: false,
  productionPublish: false,
  sourcePackage: "CF_M1_M12_AUDITADO_PRONTO_INTEGRACAO.zip"
});
