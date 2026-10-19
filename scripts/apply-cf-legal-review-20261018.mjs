import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');

function loadModule(number) {
  const id = `m${String(number).padStart(2, '0')}`;
  const relative = `content/cf/${id}-native-data.js`;
  const file = path.join(root, relative);
  const window = { BASE_NATIVE_CONTENT: { cf: {} } };
  const context = vm.createContext({ window });
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: relative });
  return { id, file, module: window.BASE_NATIVE_CONTENT.cf[id] };
}

function replaceOnce(value, before, after, label) {
  const first = value.indexOf(before);
  if (first < 0) {
    const applied = value.indexOf(after);
    if (applied >= 0 && value.indexOf(after, applied + after.length) < 0) return value;
    throw new Error(`Trecho não localizado: ${label}`);
  }
  if (value.indexOf(before, first + before.length) >= 0) throw new Error(`Trecho duplicado: ${label}`);
  return value.slice(0, first) + after + value.slice(first + before.length);
}

function save({ id, file, module }) {
  const source = `(function(g){'use strict';g.BASE_NATIVE_CONTENT=g.BASE_NATIVE_CONTENT||{};g.BASE_NATIVE_CONTENT.cf=g.BASE_NATIVE_CONTENT.cf||{};g.BASE_NATIVE_CONTENT.cf.${id}=${JSON.stringify(module)};})(window);\n`;
  fs.writeFileSync(file, source);
}

{
  const item = loadModule(3);
  item.module.summary = replaceOnce(
    item.module.summary,
    'Art. 7º: memorize os números: jornada 8h/44h; turno ininterrupto 6h, salvo negociação; hora extra no mínimo +50%;',
    'Art. 7º: memorize os números: jornada permanente de 8h/40h; na transição da EC 141/2026, o limite passa a 42h após dois meses da publicação e a 40h um ano depois; turno ininterrupto 6h, salvo negociação; repouso semanal remunerado de 2 dias, um deles preferencialmente aos domingos, após dois meses; hora extra no mínimo +50%;',
    'M03 resumo — jornada e repouso'
  );
  item.module.summary = replaceOnce(
    item.module.summary,
    '7º                números                        8/44; 6; +50%; +1/3; 120; 5+2; 16/14.',
    '7º                números                        8/40; transição 44→42→40; repouso de 2 dias; 6; +50%; +1/3; 120; 5+2; 16/14.',
    'M03 resumo — quadro do art. 7º'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    'Jornada                           Regra: até 8h diárias e 44h semanais; compensação/redução por acordo ou convenção. Turnos ininterruptos de revezamento: 6h, salvo negociação coletiva.\n\nRepouso / horas extras            Repouso semanal remunerado, preferencialmente aos domingos; serviço extraordinário com adicional de, no mínimo, 50%.',
    'Jornada                           Texto permanente: até 8h diárias e 40h semanais; compensação/redução por acordo ou convenção. A EC 141/2026 determinou transição: 44h até completar 2 meses da publicação; depois, 42h por 1 ano; ao final, 40h. Turnos ininterruptos de revezamento: 6h, salvo negociação coletiva.\n\nRepouso / horas extras            Após 2 meses da publicação da EC 141/2026, repouso semanal remunerado de 2 dias, um deles preferencialmente aos domingos; excepcionalmente, negociação coletiva pode adotar o regime compensatório constitucional. Serviço extraordinário com adicional de, no mínimo, 50%.',
    'M03 completa — quadro de jornada e repouso'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    'Art. 7º                 8h/44h; turno 6h; HE mínimo 50%; férias +1/3; gestante 120 dias; aviso mínimo 30 dias; prescrição 5 anos até 2 após extinção; trabalho: 16 anos, aprendiz 14; restrições a menores de 18.',
    'Art. 7º                 8h/40h no texto permanente, com transição 44→42→40 da EC 141/2026; repouso de 2 dias após 2 meses; turno 6h; HE mínimo 50%; férias +1/3; gestante 120 dias; aviso mínimo 30 dias; prescrição 5 anos até 2 após extinção; trabalho: 16 anos, aprendiz 14; restrições a menores de 18.',
    'M03 completa — lei seca essencial'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    '• 8h/44h; 6h em turnos; HE +50%; férias +1/3; gestante 120 dias; prescrição 5+2; menor: 16/14\n\naprendiz e proteção até 18.',
    '• 8h/40h no texto permanente, com transição 44→42→40 da EC 141/2026; repouso de 2 dias após 2 meses; 6h em turnos; HE +50%; férias +1/3; gestante 120 dias; prescrição 5+2; menor: 16/14\n\naprendiz e proteção até 18.',
    'M03 completa — revisão final'
  );
  save(item);
}

{
  const item = loadModule(4);
  if (item.module.complete.includes('superveniente superveniente')) {
    item.module.complete = item.module.complete.replace('superveniente superveniente', 'superveniente');
  }
  save(item);
}

{
  const item = loadModule(5);
  item.module.summary = replaceOnce(
    item.module.summary,
    '2.6 Acumulação Regra: não acumular. Exceções, sempre com compatibilidade de horários: dois cargos de professor; professor + técnico/científico; dois cargos/empregos privativos de profissionais de saúde com profissões regulamentadas.',
    '2.6 Acumulação Regra: não acumular. Exceções, sempre com compatibilidade de horários: dois cargos de professor; um cargo de professor + outro de qualquer natureza, conforme a EC 138/2025; dois cargos/empregos privativos de profissionais de saúde com profissões regulamentadas.',
    'M05 resumo — acumulação'
  );
  item.module.summary = replaceOnce(
    item.module.summary,
    'Pergunta: Quais as três exceções de acumulação? Resposta: 2 professores; professor + técnico/científico; 2 cargos/empregos privativos de profissionais de saúde regulamentados, sempre com compatibilidade.',
    'Pergunta: Quais as três exceções de acumulação? Resposta: 2 professores; professor + outro cargo de qualquer natureza; 2 cargos/empregos privativos de profissionais de saúde regulamentados, sempre com compatibilidade.',
    'M05 resumo — revisão ativa'
  );
  item.module.summary = replaceOnce(
    item.module.summary,
    '• Art. 40 — RPPS: regime próprio destinado ao titular de cargo efetivo, observadas as regras constitucionais.',
    '• Art. 40 — RPPS: regime próprio destinado ao titular de cargo efetivo; a EC 140/2026 criou idade diferenciada de 57 anos para mulheres e 60 para homens, com 25 anos de contribuição e de efetivo exercício, para agentes comunitários de saúde e agentes de combate às endemias.',
    'M05 resumo — RPPS e EC 140'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    '2.9 Acumulação remunerada de cargos A regra é a vedação. Havendo compatibilidade de horários, a Constituição admite: (a) dois cargos de professor; (b) um cargo de professor com outro técnico ou científico; (c) dois cargos ou empregos privativos de profissionais de saúde, com profissões regulamentadas.',
    '2.9 Acumulação remunerada de cargos A regra é a vedação. Havendo compatibilidade de horários, a Constituição admite: (a) dois cargos de professor; (b) um cargo de professor com outro de qualquer natureza, conforme a EC 138/2025; (c) dois cargos ou empregos privativos de profissionais de saúde, com profissões regulamentadas.',
    'M05 completa — acumulação'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    '• Previdência complementar: os entes devem instituir regime complementar nas hipóteses constitucionais, limitando benefícios do RPPS ao teto do RGPS para os servidores alcançados pelo novo regime. • Abono de permanência: pode ser instituído pelo ente para servidor que tenha cumprido requisitos para aposentadoria voluntária e opte por permanecer em atividade, até o limite constitucional.',
    '• Previdência complementar: os entes devem instituir regime complementar nas hipóteses constitucionais, limitando benefícios do RPPS ao teto do RGPS para os servidores alcançados pelo novo regime. • Agentes comunitários de saúde e agentes de combate às endemias: a EC 140/2026 acrescentou ao art. 40 o § 5º-A, com idade de 57 anos para mulheres e 60 para homens, exigidos 25 anos de contribuição e de efetivo exercício na atividade, sem prejuízo das regras de transição da própria emenda. • Abono de permanência: pode ser instituído pelo ente para servidor que tenha cumprido requisitos para aposentadoria voluntária e opte por permanecer em atividade, até o limite constitucional.',
    'M05 completa — RPPS e EC 140'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    '2 professores | professor + técnico/científico | 2 cargos/empregos privativos de profissionais de saúde + compatibilidade de horários.',
    '2 professores | professor + outro cargo de qualquer natureza | 2 cargos/empregos privativos de profissionais de saúde + compatibilidade de horários (EC 138/2025).',
    'M05 completa — regra de bolso'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    'Exemplo 3 — Acumulação: professora efetiva de universidade pública também exerce cargo técnico em autarquia. A acumulação pode ser constitucionalmente possível se o segundo cargo for de natureza técnica/científica e houver compatibilidade de horários.',
    'Exemplo 3 — Acumulação: professora efetiva de universidade pública também exerce outro cargo em autarquia. Após a EC 138/2025, a natureza do segundo cargo não limita essa hipótese; a acumulação pode ser constitucionalmente possível se houver compatibilidade de horários.',
    'M05 completa — exemplo de acumulação'
  );
  save(item);
}

{
  const item = loadModule(7);
  item.module.summary = replaceOnce(
    item.module.summary,
    'Art. 75                Simetria dos Tribunais de Contas estaduais e distrital.',
    'Art. 75                Tribunais de Contas são permanentes e essenciais ao controle externo; simetria e vedação de extinção, criação ou instalação, conforme a EC 139/2026.',
    'M07 resumo — art. 75'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    '2.17 Tribunais de Contas nos Estados e Municípios As normas constitucionais sobre TCU aplicam-se, no que couber, à organização, composição e fiscalização dos Tribunais de Contas dos Estados e do Distrito Federal e dos Tribunais e Conselhos de Contas dos Municípios, quando existentes nos limites constitucionais.\n\nA Constituição veda a criação de Tribunais, Conselhos ou órgãos de Contas Municipais. Essa vedação não se confunde com a existência de Tribunais de Contas dos Municípios criados no âmbito estadual ou de órgãos que já existiam nos termos constitucionais.',
    '2.17 Tribunais de Contas nos Estados e Municípios Após a EC 139/2026, o art. 75 qualifica os Tribunais de Contas como instituições permanentes e essenciais ao exercício do controle externo. As normas constitucionais sobre o TCU aplicam-se, no que couber, à organização, composição e fiscalização dos Tribunais de Contas dos Estados e do Distrito Federal e dos Tribunais e Conselhos de Contas dos Municípios.\n\nO texto atual veda a extinção, a criação ou a instalação desses órgãos. Onde houver Tribunal ou Conselho de Contas municipal, ele permanece; ao mesmo tempo, não se admite criar ou instalar novo órgão. O § 1º do art. 31 aplica a mesma vedação ao controle externo da Câmara Municipal.',
    'M07 completa — EC 139'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    'Art. 75                Simetria dos Tribunais de Contas estaduais e distrital.',
    'Art. 75                Tribunais de Contas permanentes e essenciais; simetria; vedada extinção, criação ou instalação.',
    'M07 completa — lei seca do art. 75'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    '• “A criação de novos Tribunais de Contas municipais é permitida por lei orgânica.” - Falso: a\n\nConstituição veda a criação.',
    '• “A criação ou a extinção de Tribunal de Contas municipal pode ser decidida por lei orgânica.” - Falso: após a EC 139/2026, a Constituição veda extinção, criação ou instalação.',
    'M07 completa — pegadinha EC 139'
  );
  save(item);
}

{
  const item = loadModule(9);
  if (item.module.complete.includes('Maioria absoluta absoluta')) {
    item.module.complete = item.module.complete.replace('Maioria absoluta absoluta', 'Maioria absoluta');
  }
  save(item);
}

{
  const item = loadModule(14);
  item.module.summary = replaceOnce(
    item.module.summary,
    'A assistência à saúde é livre à iniciativa privada. Instituições privadas podem participar de forma complementar do SUS, segundo suas diretrizes, mediante contrato de direito público ou convênio, com preferência constitucional para entidades filantrópicas e sem fins lucrativos.',
    'A assistência à saúde é livre à iniciativa privada. Instituições privadas podem participar de forma complementar do SUS, segundo suas diretrizes, mediante contrato de direito público ou convênio, com preferência constitucional para entidades filantrópicas e sem fins lucrativos. A EC 140/2026 tornou permanente e exclusiva de Estado a atuação dos agentes comunitários de saúde e dos agentes de combate às endemias, vedando contratação temporária ou terceirizada, salvo emergência em saúde pública, e assegurando regime jurídico de cargo efetivo, aposentadoria diferenciada e adicional de insalubridade.',
    'M14 resumo — SUS e EC 140'
  );
  item.module.summary = replaceOnce(
    item.module.summary,
    'O art. 201 reúne a proteção previdenciária do RGPS. O art. 202 disciplina o regime de previdência privada complementar, que é autônomo em relação ao RGPS, facultativo e baseado na constituição de reservas que garantam o benefício contratado.',
    'O art. 201 reúne a proteção previdenciária do RGPS. A EC 140/2026 criou, para agentes comunitários de saúde e agentes de combate às endemias, idade de 57 anos para mulheres e 60 para homens, com 25 anos de contribuição e de efetivo exercício na atividade, além das regras transitórias da emenda. O art. 202 disciplina o regime de previdência privada complementar, que é autônomo em relação ao RGPS, facultativo e baseado na constituição de reservas que garantam o benefício contratado.',
    'M14 resumo — RGPS e EC 140'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    'A Constituição também disciplina financiamento mínimo e organização interfederativa do sistema.\n\nNÃO CONFUNDIR — descentralização não elimina coordenação; direção única existe em cada esfera de governo.',
    'A Constituição também disciplina financiamento mínimo e organização interfederativa do sistema.\n\nAGENTES COMUNITÁRIOS E DE COMBATE ÀS ENDEMIAS — A EC 140/2026 definiu sua atuação como obrigatória, permanente, essencial ao SUS e exclusiva de Estado. O art. 198 veda contratação temporária ou terceirizada, salvo emergência em saúde pública, submete esses agentes ao regime jurídico dos servidores efetivos e lhes assegura aposentadoria diferenciada e adicional de insalubridade.\n\nNÃO CONFUNDIR — descentralização não elimina coordenação; direção única existe em cada esfera de governo.',
    'M14 completa — SUS e EC 140'
  );
  item.module.complete = replaceOnce(
    item.module.complete,
    'O art. 201 reúne prestações ligadas a incapacidade, idade, maternidade, desemprego involuntário nos termos do sistema, salário-família e auxílio-reclusão para dependentes segundo os critérios constitucionais, pensão por morte e demais proteções definidas no regime.',
    'O art. 201 reúne prestações ligadas a incapacidade, idade, maternidade, desemprego involuntário nos termos do sistema, salário-família e auxílio-reclusão para dependentes segundo os critérios constitucionais, pensão por morte e demais proteções definidas no regime. O § 8º-A, incluído pela EC 140/2026, fixa para agentes comunitários de saúde e agentes de combate às endemias idade de 57 anos para mulheres e 60 para homens, desde que comprovados 25 anos de contribuição e de efetivo exercício na atividade. As regras de transição e as hipóteses de cômputo especial estão na própria emenda.',
    'M14 completa — RGPS e EC 140'
  );
  save(item);
}

console.log('Revisão jurídica aplicada aos módulos CF M03, M05, M07 e M14.');
