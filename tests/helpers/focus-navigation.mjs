// Abre um módulo pela navegação simplificada (ui/disciplinas-foco-v1.js): depois de
// escolher a disciplina, a Central mostra "Escolha um módulo" com um cartão por módulo.
// Sem essa navegação, recorre ao cabeçalho original do módulo.
export async function openModule(page, subjectId, index, fallbackHead) {
  const focus = await page.evaluate(() => !!window.BaseCompletaFocusNavigation);
  if (focus) {
    await page.waitForFunction(sid => {
      const s = window.BaseCompletaFocusNavigation?.state;
      return s?.stage === 'modules' && s.subject === sid;
    }, subjectId, { timeout: 15000 });
    const cards = page.locator('#bcFocusModules .bc-focus-module-card');
    await cards.first().waitFor({ state: 'visible', timeout: 15000 });
    await cards.nth(index).click({ timeout: 10000 });
    await page.waitForFunction(() => window.BaseCompletaFocusNavigation?.state.stage === 'reading', null, { timeout: 8000 });
    await page.waitForTimeout(600);
    return page.locator('#subjects .subject[data-id="' + subjectId + '"] .bc-focus-current-module').first();
  }
  await page.locator('.subject[data-id="' + subjectId + '"] ' + fallbackHead + ':visible').nth(index).click();
  await page.waitForTimeout(800);
  return page.locator('.subject[data-id="' + subjectId + '"]');
}

// Quantidade de módulos listados para a disciplina já escolhida.
export async function moduleCount(page, subjectId, fallbackHead) {
  if (await page.evaluate(() => !!window.BaseCompletaFocusNavigation)) {
    await page.locator('#bcFocusModules .bc-focus-module-card').first().waitFor({ state: 'visible', timeout: 15000 });
    return page.locator('#bcFocusModules .bc-focus-module-card').count();
  }
  return page.locator('.subject[data-id="' + subjectId + '"] ' + fallbackHead + ':visible').count();
}

// Volta da leitura do módulo para a lista de módulos.
export async function backToModules(page) {
  await page.evaluate(() => window.BaseCompletaFocusNavigation?.backToModules());
  await page.waitForTimeout(400);
}
