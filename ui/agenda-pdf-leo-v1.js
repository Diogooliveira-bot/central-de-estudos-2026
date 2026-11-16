/* Importação do PDF "Plano de Estudos" que o Léo entrega no WhatsApp para a Agenda.
 *
 * Como funciona:
 *  1. O PDF é lido NO APARELHO (pdf.js, carregado só quando a pessoa escolhe um arquivo).
 *     Nada é enviado para a internet.
 *  2. O texto vira linhas/colunas e o cronograma ("Segunda-feira, 16/11 … Português … 90 min")
 *     vira uma lista de atividades por dia.
 *  3. Mostramos uma prévia (quantas atividades entram, quais mudam) e só gravamos ao confirmar.
 *  4. As tarefas entram na Agenda no mesmo formato das demais (central-v6:agenda:AAAA-MM-DD),
 *     então marcar como feita, "Hoje na agenda" e a sincronização entre aparelhos já funcionam.
 *  5. Importar de novo (plano atualizado) NÃO duplica: cada atividade tem um id estável
 *     (data + disciplina + título). O que já foi marcado como feito continua feito.
 *
 * O texto do PDF é tratado como não confiável: só entra na tela como texto puro (textContent).
 */
(function (global) {
  'use strict';

  var VERSION = '5.4.149';
  var AGENDA_PREFIX = 'central-v6:agenda:';
  var META_KEY = 'central-v6:leo-plan:v1';
  var SOURCE = 'leo-pdf';
  var PDFJS_URL = '/vendor/pdfjs/pdf.min.mjs?v=' + VERSION;
  var WORKER_URL = '/vendor/pdfjs/pdf.worker.min.mjs?v=' + VERSION;
  var MAX_BYTES = 15 * 1024 * 1024;
  var MAX_PAGES = 60;
  var MAX_ACTIVITIES = 900;
  var MAX_RANGE_DAYS = 400;
  var CELL_GAP = 9;      // espaço (pt) que separa uma coluna da outra
  var ROW_TOLERANCE = 3; // diferença (pt) de altura para ainda ser a mesma linha

  var LABELS = {
    pt: 'Português', cf: 'Direito Constitucional', adm: 'Direito Administrativo', civil: 'Direito Civil',
    cpc: 'Direito Processual Civil', penal: 'Direito Penal', cpp: 'Direito Processual Penal', rlm: 'Raciocínio Lógico-Matemático'
  };
  // A ordem importa: "processual civil" antes de "civil".
  var DISCIPLINE_RULES = [
    ['rlm', /racioc|logic|matemat/],
    ['cpc', /processual civil|\bcpc\b/],
    ['cpp', /processual penal|\bcpp\b/],
    ['cf', /constitucional|\bcf\b/],
    ['adm', /administrativ/],
    ['civil', /\bcivil\b/],
    ['penal', /\bpenal\b/],
    ['pt', /portugu/]
  ];
  var WEEKDAYS = { domingo: 0, segunda: 1, terca: 2, quarta: 3, quinta: 4, sexta: 5, sabado: 6 };
  var WEEKDAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  /* ---------- utilidades puras ---------- */
  function norm(value) {
    return String(value == null ? '' : value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function clean(value, max) {
    var text = String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
    return max && text.length > max ? text.slice(0, max - 1).trim() + '…' : text;
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }
  function validYMD(y, m, d) {
    var date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }
  function weekdayOf(y, m, d) { return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); }
  function dayNumber(isoDate) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    return m ? Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000) : NaN;
  }
  function addDays(isoDate, n) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
    var date = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + n));
    return iso(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  }
  function parseBR(text) {
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(text).trim());
    if (!m) return null;
    var y = +m[3], mo = +m[2], d = +m[1];
    return validYMD(y, mo, d) ? { y: y, m: mo, d: d, iso: iso(y, mo, d) } : null;
  }
  function shortBR(isoDate) { return isoDate.slice(8, 10) + '/' + isoDate.slice(5, 7); }
  function fullBR(isoDate) { return shortBR(isoDate) + '/' + isoDate.slice(0, 4); }
  function fmtMinutes(total) {
    var h = Math.floor(total / 60), m = total % 60;
    return h ? h + 'h' + (m ? pad(m) : '') : m + ' min';
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function disciplineId(label) {
    var text = norm(label);
    if (!text) return '';
    for (var i = 0; i < DISCIPLINE_RULES.length; i++) if (DISCIPLINE_RULES[i][1].test(text)) return DISCIPLINE_RULES[i][0];
    return '';
  }
  function parseDuration(text) {
    var value = String(text || '').trim();
    var m = /^(\d{1,3})\s*min(?:utos)?$/i.exec(value);
    if (m) return +m[1];
    m = /^(\d{1,2})\s*h\s*(\d{2})?$/i.exec(value);
    if (m) return +m[1] * 60 + (m[2] ? +m[2] : 0);
    return null;
  }
  function hash(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(36);
  }

  /* ---------- 1) itens do pdf.js → linhas com colunas ---------- */
  function cellsFrom(items) {
    var cells = [], cell = null, end = 0, space = false, last = '';
    items.forEach(function (item) {
      if (!item.str.trim()) { space = true; return; }
      var gap = cell ? item.x - end : 0;
      if (!cell || gap > CELL_GAP) {
        cell = { x: item.x, text: item.str.trim() };
        cells.push(cell);
      } else {
        var needsSpace = space || gap > 1.2 || /^\s/.test(item.str) || /\s$/.test(last);
        cell.text += (needsSpace ? ' ' : '') + item.str.trim();
      }
      last = item.str; end = item.x + item.w; space = false;
    });
    cells.forEach(function (c) { c.text = c.text.replace(/\s+/g, ' ').trim(); });
    return cells.filter(function (c) { return c.text; });
  }
  function rowsFromItems(items) {
    var list = [];
    (items || []).forEach(function (it) {
      if (!it || typeof it.str !== 'string' || !it.str.length) return;
      var t = it.transform || [];
      var x = Number(t[4]), y = Number(t[5]), w = Number(it.width) || 0;
      if (!isFinite(x) || !isFinite(y)) return;
      list.push({ str: it.str, x: x, y: y, w: w });
    });
    list.sort(function (a, b) { return b.y - a.y || a.x - b.x; });
    var groups = [];
    list.forEach(function (it) {
      var g = groups[groups.length - 1];
      if (!g || Math.abs(g.y - it.y) > ROW_TOLERANCE) { g = { y: it.y, items: [] }; groups.push(g); }
      g.items.push(it);
    });
    return groups.map(function (g) {
      g.items.sort(function (a, b) { return a.x - b.x; });
      return { y: g.y, cells: cellsFrom(g.items) };
    }).filter(function (row) { return row.cells.length; });
  }

  /* ---------- 2) linhas → plano ---------- */
  var DAY_RE = /^(segunda|terca|quarta|quinta|sexta|sabado|domingo)(?:-feira)?\s*,?\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?!\d)/;
  var META_RE = /(\d+)\s*h\s*(\d{2})?\s*[·•|-]\s*(\d+)\s*atividades?/i;
  var RANGE_RE = /(\d{1,2}\/\d{1,2}\/\d{4})\s+a\s+(\d{1,2}\/\d{1,2}\/\d{4})/;
  var BADGE_RE = /^(premium|gr[aá]tis|gratuito)$/i;

  function isChrome(cells) {
    var first = cells[0].text;
    return /^BASE COMPLETA$/i.test(first) ||
      (/^Central de Estudos$/i.test(first) && cells.length <= 2) ||
      /^Base Completa\s*·\s*Central de Estudos/i.test(first);
  }
  function resolveYear(day, month, explicit, week, fallbackYear) {
    if (explicit) return explicit < 100 ? 2000 + explicit : explicit;
    if (week && week.start && week.end) {
      var years = [week.start.y];
      if (week.end.y !== week.start.y) years.push(week.end.y);
      for (var i = 0; i < years.length; i++) {
        if (!validYMD(years[i], month, day)) continue;
        var n = dayNumber(iso(years[i], month, day));
        if (n >= dayNumber(week.start.iso) && n <= dayNumber(week.end.iso)) return years[i];
      }
      return week.start.y;
    }
    return fallbackYear;
  }

  function parseRows(rows, options) {
    options = options || {};
    var plan = { weeks: [], days: [], warnings: [], generatedAt: null, activities: 0, minutes: 0, start: '', end: '' };
    var week = null, pendingWeek = null, day = null, act = null, inSchedule = false;
    var fallbackYear = options.year || new Date().getFullYear();
    var byDate = {};

    function startWeek(number) {
      pendingWeek = { number: number, start: null, end: null };
      week = pendingWeek; plan.weeks.push(week);
      day = null; act = null;
    }
    function setWeekRange(text) {
      var m = RANGE_RE.exec(text);
      if (!m || !week || week.start) return false;
      var a = parseBR(m[1]), b = parseBR(m[2]);
      if (!a || !b) return false;
      week.start = a; week.end = b;
      return true;
    }

    rows.forEach(function (row) {
      // Etiquetas soltas ("Premium") não são colunas do cronograma.
      var cells = row.cells.filter(function (c) { return !BADGE_RE.test(c.text); });
      var premiumBadge = row.cells.some(function (c) { return /^premium$/i.test(c.text); });
      if (!cells.length) return;
      if (isChrome(cells)) return;
      var first = cells[0].text;
      var text = cells.map(function (c) { return c.text; }).join('  ');
      var m;

      if ((m = /^Elaborado em (\d{1,2}\/\d{1,2}\/\d{4})/i.exec(first))) {
        var g = parseBR(m[1]); if (g) { plan.generatedAt = g.iso; fallbackYear = g.y; }
        return;
      }
      if (/^\d{2}\s*·\s*\S/.test(first)) {      // "02 · CRONOGRAMA", "03 · MÉTODO…"
        inSchedule = /cronograma/i.test(first);
        day = null; act = null; if (!inSchedule) { week = null; pendingWeek = null; }
        return;
      }
      if (!inSchedule) return;

      if ((m = /^Semana\s+(\d+)\b/i.exec(first))) {
        var number = +m[1];
        var known = plan.weeks.filter(function (w) { return w.number === number; })[0];
        if (known) { week = known; pendingWeek = known.start ? null : known; day = null; act = null; }
        else startWeek(number);
        setWeekRange(text);
        return;
      }
      if (pendingWeek && !pendingWeek.start && RANGE_RE.test(first)) { setWeekRange(text); pendingWeek = null; return; }

      var dayMatch = DAY_RE.exec(norm(first));
      if (dayMatch) {
        var wd = WEEKDAYS[dayMatch[1]], dd = +dayMatch[2], mm = +dayMatch[3];
        var year = resolveYear(dd, mm, dayMatch[4] ? +dayMatch[4] : 0, week, fallbackYear);
        if (!validYMD(year, mm, dd)) { plan.warnings.push('Data inválida no PDF: ' + clean(first, 40)); day = null; act = null; return; }
        if (weekdayOf(year, mm, dd) !== wd) {
          var other = [year - 1, year + 1].filter(function (yy) { return validYMD(yy, mm, dd) && weekdayOf(yy, mm, dd) === wd; })[0];
          if (other && !(week && week.start)) year = other;
          else plan.warnings.push(clean(first, 40) + ': o dia da semana não confere com ' + year + '.');
        }
        var date = iso(year, mm, dd);
        day = byDate[date];
        if (!day) {
          day = { date: date, weekday: WEEKDAY_NAMES[weekdayOf(year, mm, dd)], week: week ? week.number : null, expected: null, activities: [] };
          byDate[date] = day; plan.days.push(day);
        }
        var meta = META_RE.exec(text);
        if (meta) day.expected = { minutes: (+meta[1]) * 60 + (meta[2] ? +meta[2] : 0), count: +meta[3] };
        act = null;
        return;
      }

      if (/^DICA DO L[ÉE]O$/i.test(first) || /^dica do leo$/.test(norm(first))) { act = null; return; }
      if (!day) return;

      var duration = cells.length >= 2 ? parseDuration(cells[cells.length - 1].text) : null;
      if (duration !== null) {
        var core = cells.slice(0, -1), discipline = '', titleCells = core;
        if (core.length >= 2) { discipline = core[0].text; titleCells = core.slice(1); }
        else if (disciplineId(core[0].text) && !/^m\d/i.test(core[0].text) && !/^revis/i.test(norm(core[0].text))) { discipline = core[0].text; titleCells = []; }
        var raw = titleCells.map(function (c) { return c.text; }).join(' ');
        var title = raw, instruction = '';
        var split = /\s[—–]\s/.exec(raw);
        if (split) { title = raw.slice(0, split.index); instruction = raw.slice(split.index + split[0].length); }
        else if (/\s[—–]$/.test(raw)) title = raw.replace(/\s[—–]$/, '');
        act = {
          discipline: clean(discipline, 80) || 'Geral', title: clean(title, 160), instruction: clean(instruction, 400),
          minutes: duration, premium: premiumBadge || /premium/i.test(raw),
          x: titleCells.length ? titleCells[0].x : cells[0].x
        };
        day.activities.push(act);
        return;
      }

      if (act && cells.length === 1 && Math.abs(cells[0].x - act.x) <= 6) {
        var more = clean(cells[0].text, 400);
        // Título longo que quebrou a linha começa em minúscula; a instrução começa com verbo em maiúscula.
        if (!act.instruction && /^[a-zà-ú]/.test(more)) act.title = clean(act.title + ' ' + more, 160);
        else act.instruction = clean((act.instruction ? act.instruction + ' ' : '') + more, 400);
      }
    });

    plan.days.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    plan.days.forEach(function (d) {
      d.activities.forEach(function (a) { a.disciplineId = disciplineId(a.discipline); delete a.x; plan.activities++; plan.minutes += a.minutes; });
      if (d.expected && d.expected.count !== d.activities.length) {
        plan.warnings.push(shortBR(d.date) + ': o PDF diz ' + plural(d.expected.count, 'atividade', 'atividades') + ' e encontrei ' + d.activities.length + '.');
      } else if (d.expected) {
        var sum = d.activities.reduce(function (s, a) { return s + a.minutes; }, 0);
        if (sum !== d.expected.minutes) plan.warnings.push(shortBR(d.date) + ': a soma das durações (' + fmtMinutes(sum) + ') difere do total do PDF (' + fmtMinutes(d.expected.minutes) + ').');
      }
    });
    if (plan.days.length) {
      plan.start = plan.days[0].date; plan.end = plan.days[plan.days.length - 1].date;
      if (dayNumber(plan.end) - dayNumber(plan.start) > MAX_RANGE_DAYS) plan.warnings.push('O período do plano é muito longo; confira as datas.');
    }
    plan.ok = plan.activities > 0;
    return plan;
  }

  /* ---------- 3) plano → tarefas da Agenda ---------- */
  function buildTasks(plan) {
    var out = {};
    plan.days.forEach(function (d) {
      var used = {};
      out[d.date] = d.activities.map(function (a) {
        var label = a.disciplineId || clean(a.discipline, 80);
        // A chave usa o código do módulo (M01…) quando existe: se o Léo ajustar só o texto do título,
        // a atividade continua sendo a mesma (é atualizada) e o que você marcou como feito se mantém.
        var code = /^(m\d{1,3})\b/.exec(norm(a.title));
        var key = (a.disciplineId || norm(a.discipline)) + '|' + (code ? code[1] : norm(a.title || a.instruction));
        var id = 'leo-' + d.date + '-' + hash(key);
        used[id] = (used[id] || 0) + 1;
        if (used[id] > 1) id += '-' + used[id];
        var text = a.title || a.instruction;
        if (a.title && a.instruction) text += ' — ' + a.instruction;
        text += ' (' + a.minutes + ' min)';
        var task = { id: id, time: '', discipline: label, task: clean(text, 600), done: false, source: SOURCE, minutes: a.minutes };
        if (a.premium) task.premium = true;
        return task;
      });
    });
    return out;
  }

  /* ---------- 4) armazenamento da Agenda ---------- */
  function defaultStore() {
    // A Central troca o "localStorage" por uma versão isolada por usuário (const global em index.html);
    // usar o identificador solto (e não a propriedade da janela) mantém a Agenda de cada conta separada.
    var ls;
    try { ls = typeof localStorage !== 'undefined' ? localStorage : global.localStorage; ls.getItem('central-v6:leo-plan:probe'); } catch (_) { ls = null; }
    if (!ls) return null;
    return {
      get: function (key) { return ls.getItem(key); },
      set: function (key, value) { ls.setItem(key, value); },
      remove: function (key) { ls.removeItem(key); },
      keys: function () { var list = []; for (var i = 0; i < ls.length; i++) list.push(ls.key(i)); return list; }
    };
  }
  function readDay(store, date) {
    var raw = store.get(AGENDA_PREFIX + date);
    if (!raw) return [];
    try { var value = JSON.parse(raw); return Array.isArray(value) ? value : []; } catch (_) { return []; }
  }
  function leoDatesInRange(store, start, end) {
    var dates = [];
    store.keys().forEach(function (key) {
      if (key.indexOf(AGENDA_PREFIX) !== 0) return;
      var date = key.slice(AGENDA_PREFIX.length);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < start || date > end) return;
      dates.push(date);
    });
    return dates;
  }

  /* Calcula o que mudaria (sem gravar). */
  function planMerge(plan, store) {
    var incoming = buildTasks(plan);
    var dates = Object.keys(incoming);
    leoDatesInRange(store, plan.start, plan.end).forEach(function (d) { if (dates.indexOf(d) < 0) dates.push(d); });
    dates.sort();
    var result = { add: 0, update: 0, keep: 0, remove: 0, writes: [] };
    dates.forEach(function (date) {
      var existing = readDay(store, date), news = incoming[date] || [], byId = {}, seen = {}, next = [], changed = false;
      news.forEach(function (t) { byId[t.id] = t; });
      existing.forEach(function (t) {
        if (!t || typeof t !== 'object' || t.source !== SOURCE) { next.push(t); return; }
        var inc = byId[t.id];
        if (inc) {
          seen[t.id] = true;
          var merged = Object.assign({}, t, inc, { done: Boolean(t.done) });
          if (t.task !== inc.task || t.discipline !== inc.discipline) { result.update++; changed = true; } else result.keep++;
          next.push(merged);
        } else if (t.done) { next.push(t); result.keep++; }
        else { result.remove++; changed = true; }
      });
      news.forEach(function (t) { if (!seen[t.id]) { next.push(t); result.add++; changed = true; } });
      if (changed) result.writes.push({ date: date, tasks: next });
    });
    return result;
  }

  function applyMerge(plan, store) {
    var result = planMerge(plan, store);
    result.writes.forEach(function (w) { store.set(AGENDA_PREFIX + w.date, JSON.stringify(w.tasks)); });
    store.set(META_KEY, JSON.stringify({ start: plan.start, end: plan.end, total: plan.activities, minutes: plan.minutes, importedAt: new Date().toISOString() }));
    return result;
  }

  function leoStats(store) {
    var total = 0, done = 0, first = '', last = '';
    store.keys().forEach(function (key) {
      if (key.indexOf(AGENDA_PREFIX) !== 0) return;
      var date = key.slice(AGENDA_PREFIX.length);
      readDay(store, date).forEach(function (t) {
        if (!t || t.source !== SOURCE) return;
        total++; if (t.done) done++;
        if (!first || date < first) first = date;
        if (!last || date > last) last = date;
      });
    });
    return { total: total, done: done, start: first, end: last };
  }

  function removeAll(store) {
    var removed = 0;
    store.keys().forEach(function (key) {
      if (key.indexOf(AGENDA_PREFIX) !== 0) return;
      var date = key.slice(AGENDA_PREFIX.length);
      var tasks = readDay(store, date);
      var kept = tasks.filter(function (t) { return !(t && t.source === SOURCE); });
      if (kept.length !== tasks.length) { removed += tasks.length - kept.length; store.set(key, JSON.stringify(kept)); }
    });
    store.remove(META_KEY);
    return removed;
  }

  /* ---------- 5) leitura do PDF (pdf.js sob demanda) ---------- */
  var loader = null;
  var pdfjsPromise = null;
  function setLoader(fn) { loader = fn; pdfjsPromise = null; }
  function loadPdfjs() {
    if (!pdfjsPromise) {
      var load = loader || function () { return import(PDFJS_URL); };
      pdfjsPromise = Promise.resolve().then(load).then(function (mod) {
        if (mod && mod.GlobalWorkerOptions && !mod.GlobalWorkerOptions.workerSrc) mod.GlobalWorkerOptions.workerSrc = WORKER_URL;
        return mod;
      }).catch(function (error) { pdfjsPromise = null; throw error; });
    }
    return pdfjsPromise;
  }
  function fail(code, message) { var e = new Error(message); e.code = code; return e; }

  function isPdf(bytes) {
    var head = '';
    for (var i = 0; i < Math.min(bytes.length, 1024); i++) head += String.fromCharCode(bytes[i]);
    return head.indexOf('%PDF-') >= 0;
  }

  function extractRows(buffer) {
    var bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    if (bytes.length > MAX_BYTES) return Promise.reject(fail('too-big', 'Arquivo muito grande para ser um plano do Léo.'));
    if (!isPdf(bytes)) return Promise.reject(fail('not-pdf', 'Este arquivo não é um PDF.'));
    return loadPdfjs().then(function (pdfjs) {
      var task = pdfjs.getDocument({ data: bytes, isEvalSupported: false, enableXfa: false, useSystemFonts: false, disableFontFace: true });
      return task.promise.then(function (doc) {
        if (doc.numPages > MAX_PAGES) { doc.destroy(); throw fail('too-many-pages', 'PDF com páginas demais.'); }
        var rows = [], chain = Promise.resolve();
        for (var p = 1; p <= doc.numPages; p++) (function (n) {
          chain = chain.then(function () { return doc.getPage(n); }).then(function (page) {
            return page.getTextContent().then(function (content) { rows = rows.concat(rowsFromItems(content.items)); page.cleanup(); });
          });
        })(p);
        return chain.then(function () { doc.destroy(); return rows; });
      });
    });
  }

  function readPlan(buffer) {
    return extractRows(buffer).then(function (rows) {
      var plan = parseRows(rows);
      if (!plan.ok) throw fail('not-leo', 'Não encontrei o cronograma do Léo neste PDF.');
      if (plan.activities > MAX_ACTIVITIES) throw fail('too-many', 'Plano grande demais.');
      return plan;
    });
  }

  function friendlyError(error) {
    var code = error && (error.code || error.name);
    if (code === 'not-pdf') return 'Esse arquivo não é um PDF. Escolha o PDF do plano que o Léo enviou.';
    if (code === 'too-big' || code === 'too-many-pages') return 'Esse PDF é grande demais para ser um plano do Léo.';
    if (code === 'PasswordException') return 'Esse PDF tem senha. Peça ao Léo o plano sem senha.';
    if (code === 'not-leo') return 'Não encontrei o cronograma do Léo nesse PDF. Use o PDF “Plano de Estudos” que ele mandou no WhatsApp, sem editar.';
    if (code === 'too-many') return 'Esse plano tem atividades demais para importar de uma vez.';
    return 'Não consegui ler esse PDF agora. Confira a internet (a leitura precisa carregar um componente na primeira vez) e tente de novo.';
  }

  /* ---------- 6) interface na Agenda ---------- */
  var ui = { card: null, status: null, summary: null, actions: null, input: null, busy: false };

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else el.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function say(message, kind) {
    if (!ui.status) return;
    ui.status.textContent = message || '';
    ui.status.className = 'bc-leo-status' + (kind ? ' ' + kind : '');
  }
  function setBusy(on) {
    ui.busy = on;
    if (ui.card) ui.card.classList.toggle('is-busy', on);
    if (ui.card) ui.card.querySelectorAll('button').forEach(function (b) { b.disabled = on; });
  }
  function refreshAgenda(focusDate) {
    try {
      var input = document.getElementById('agendaDate');
      if (input && focusDate) { input.value = focusDate; input.dispatchEvent(new Event('change', { bubbles: true })); }
      global.CentralAgenda && global.CentralAgenda.render && global.CentralAgenda.render();
      global.CentralAgenda && global.CentralAgenda.renderHomeSummary && global.CentralAgenda.renderHomeSummary();
      global.CentralStudentPlan && global.CentralStudentPlan.renderAgendaWeek && global.CentralStudentPlan.renderAgendaWeek();
      global.dispatchEvent(new Event('central:student-data-changed'));
    } catch (_) {}
  }
  function todayISO() {
    var d = new Date();
    return iso(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  function renderSummary() {
    if (!ui.summary) return;
    var store = defaultStore();
    ui.summary.textContent = '';
    ui.actions.textContent = '';
    var stats = store ? leoStats(store) : { total: 0 };
    var pick = h('button', { type: 'button', class: 'btn primary', 'data-bc-leo-pick': '', text: stats.total ? 'Atualizar com novo PDF' : 'Adicionar PDF do Léo' });
    pick.addEventListener('click', function () { ui.input.value = ''; ui.input.click(); });
    ui.actions.appendChild(pick);
    if (!stats.total) {
      ui.summary.appendChild(h('p', { class: 'bc-leo-lead', text: 'Recebeu o plano de estudos em PDF do Léo pelo WhatsApp? Escolha o arquivo e as atividades entram na sua Agenda, dia a dia. Você marca como feitas aqui mesmo.' }));
      return;
    }
    ui.summary.appendChild(h('p', { class: 'bc-leo-current' }, [
      h('b', { text: 'Plano do Léo: ' + shortBR(stats.start) + ' a ' + fullBR(stats.end) }),
      h('span', { text: plural(stats.total, 'atividade', 'atividades') + ' · ' + stats.done + ' ' + (stats.done === 1 ? 'concluída' : 'concluídas') })
    ]));
    ui.summary.appendChild(h('p', { class: 'bc-leo-hint', text: 'Se o Léo mandar uma versão atualizada, escolha o novo PDF: o que mudou é atualizado e o que você já marcou continua marcado.' }));
    var remove = h('button', { type: 'button', class: 'btn', text: 'Remover do plano' });
    remove.addEventListener('click', function () { confirmRemove(stats); });
    ui.actions.appendChild(remove);
  }
  function confirmRemove(stats) {
    ui.actions.textContent = '';
    ui.actions.appendChild(h('span', { class: 'bc-leo-confirm', text: 'Apagar ' + plural(stats.total, 'atividade', 'atividades') + ' do PDF do Léo (' + stats.done + ' já ' + (stats.done === 1 ? 'concluída' : 'concluídas') + ')? Suas outras tarefas não mudam.' }));
    var yes = h('button', { type: 'button', class: 'btn red', text: 'Apagar atividades do PDF' });
    var no = h('button', { type: 'button', class: 'btn', text: 'Cancelar' });
    yes.addEventListener('click', function () {
      var store = defaultStore(); if (!store) return;
      var n = removeAll(store);
      renderSummary(); refreshAgenda();
      say(plural(n, 'atividade removida', 'atividades removidas') + ' da Agenda.', 'success');
    });
    no.addEventListener('click', renderSummary);
    ui.actions.appendChild(yes); ui.actions.appendChild(no);
  }

  function onFile(file) {
    if (!file || ui.busy) return;
    var store = defaultStore();
    if (!store) { say('Este navegador não deixa salvar a Agenda. Saia do modo privado e tente de novo.', 'error'); return; }
    if (file.size > MAX_BYTES) { say(friendlyError(fail('too-big')), 'error'); return; }
    setBusy(true); say('Lendo o PDF neste aparelho…');
    file.arrayBuffer().then(readPlan).then(function (plan) {
      setBusy(false); say('');
      openPreview(plan, store);
    }).catch(function (error) {
      setBusy(false); say(friendlyError(error), 'error');
    });
  }

  function openPreview(plan, store) {
    var merge = planMerge(plan, store);
    var previous = document.activeElement;
    // O papel "dialog" fica na caixa (e não no fundo): regras globais de tema pintam [role=dialog] com a cor do cartão.
    var overlay = h('div', { class: 'bc-leo-overlay' });
    var box = h('div', { class: 'bc-leo-box', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'bcLeoTitle' });
    overlay.appendChild(box);
    box.appendChild(h('h2', { id: 'bcLeoTitle', text: 'Plano do Léo encontrado' }));
    var weeks = {};
    plan.days.forEach(function (d) { weeks[d.week || 0] = 1; });
    box.appendChild(h('div', { class: 'bc-leo-chips' }, [
      h('span', { text: shortBR(plan.start) + ' a ' + fullBR(plan.end) }),
      h('span', { text: plural(plan.days.length, 'dia', 'dias') }),
      h('span', { text: plural(plan.activities, 'atividade', 'atividades') }),
      h('span', { text: fmtMinutes(plan.minutes) + ' no total' })
    ]));
    var per = {};
    plan.days.forEach(function (d) { d.activities.forEach(function (a) {
      var key = a.disciplineId ? LABELS[a.disciplineId] : a.discipline;
      per[key] = per[key] || { n: 0, min: 0 }; per[key].n++; per[key].min += a.minutes;
    }); });
    var list = h('ul', { class: 'bc-leo-disc' });
    Object.keys(per).forEach(function (k) { list.appendChild(h('li', { text: k + ' — ' + plural(per[k].n, 'atividade', 'atividades') + ' · ' + fmtMinutes(per[k].min) })); });
    box.appendChild(list);

    var parts = [];
    if (merge.add) parts.push(plural(merge.add, 'nova entra', 'novas entram'));
    if (merge.update) parts.push(plural(merge.update, 'é atualizada', 'são atualizadas'));
    if (merge.keep) parts.push(plural(merge.keep, 'já estava e fica igual', 'já estavam e ficam iguais'));
    if (merge.remove) parts.push(plural(merge.remove, 'saiu do plano e será removida (não estava feita)', 'saíram do plano e serão removidas (não estavam feitas)'));
    box.appendChild(h('p', { class: 'bc-leo-merge', text: parts.length ? parts.join(' · ') + '.' : 'Nada muda: a Agenda já está igual a este PDF.' }));
    if (plan.warnings.length) {
      var warn = h('details', { class: 'bc-leo-warn' }, [h('summary', { text: 'Avisos da leitura (' + plan.warnings.length + ')' })]);
      plan.warnings.slice(0, 12).forEach(function (w) { warn.appendChild(h('p', { text: w })); });
      box.appendChild(warn);
    }
    var detail = h('details', { class: 'bc-leo-days' }, [h('summary', { text: 'Ver os dias' })]);
    plan.days.forEach(function (d) {
      var line = h('div', { class: 'bc-leo-day' }, [h('b', { text: d.weekday + ', ' + shortBR(d.date) })]);
      d.activities.forEach(function (a) {
        line.appendChild(h('p', { text: (a.disciplineId ? LABELS[a.disciplineId] : a.discipline) + ' · ' + (a.title || a.instruction) + ' · ' + a.minutes + ' min' }));
      });
      detail.appendChild(line);
    });
    box.appendChild(detail);

    var actions = h('div', { class: 'bc-leo-actions' });
    var ok = h('button', { type: 'button', class: 'btn primary', text: merge.add + merge.update + merge.remove ? 'Importar para a Agenda' : 'Fechar' });
    var cancel = h('button', { type: 'button', class: 'btn', text: 'Cancelar' });
    actions.appendChild(ok); if (merge.add + merge.update + merge.remove) actions.appendChild(cancel);
    box.appendChild(actions);

    function close() {
      document.removeEventListener('keydown', onKey, true);
      overlay.remove(); document.documentElement.classList.remove('bc-leo-open');
      try { previous && previous.focus && previous.focus(); } catch (_) {}
    }
    function onKey(event) {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'Tab') {
        var f = box.querySelectorAll('button,summary,[href],input'); if (!f.length) return;
        var firstEl = f[0], lastEl = f[f.length - 1];
        if (event.shiftKey && document.activeElement === firstEl) { event.preventDefault(); lastEl.focus(); }
        else if (!event.shiftKey && document.activeElement === lastEl) { event.preventDefault(); firstEl.focus(); }
      }
    }
    cancel.addEventListener('click', close);
    overlay.addEventListener('click', function (event) { if (event.target === overlay) close(); });
    ok.addEventListener('click', function () {
      if (!(merge.add + merge.update + merge.remove)) { close(); return; }
      try {
        var done = applyMerge(plan, store);
        close(); renderSummary();
        var today = todayISO();
        var focus = today >= plan.start && today <= plan.end ? today : plan.start;
        refreshAgenda(focus);
        say('Pronto! ' + plural(done.add + done.update, 'atividade', 'atividades') + ' ' + (done.add + done.update === 1 ? 'adicionada' : 'adicionadas') + ' de ' + shortBR(plan.start) + ' a ' + shortBR(plan.end) + (done.remove ? ' (' + plural(done.remove, 'saiu', 'saíram') + ' do plano)' : '') + '.', 'success');
      } catch (_) {
        say('Não foi possível salvar na Agenda deste navegador.', 'error'); close();
      }
    });
    document.addEventListener('keydown', onKey, true);
    document.documentElement.classList.add('bc-leo-open');
    document.body.appendChild(overlay);
    ok.focus();
  }

  function build() {
    var view = document.getElementById('agendaView');
    if (!view) return false;
    if (document.getElementById('bcLeoCard')) return true;
    var card = h('section', { class: 'card bc-leo-card', id: 'bcLeoCard', 'aria-labelledby': 'bcLeoHead' });
    var mascot = h('img', { class: 'bc-leo-mascot', src: '/assets/mascote/mascote-checklist.webp', alt: '', 'aria-hidden': 'true', width: '64', height: '64', loading: 'lazy', decoding: 'async' });
    var head = h('div', { class: 'bc-leo-head' }, [h('small', { text: 'Léo no WhatsApp' }), h('h2', { id: 'bcLeoHead', text: 'Plano do Léo em PDF' })]);
    var body = h('div', { class: 'bc-leo-body' });
    ui.summary = h('div', { class: 'bc-leo-summary' });
    ui.actions = h('div', { class: 'bc-leo-buttons' });
    ui.status = h('div', { class: 'bc-leo-status', role: 'status', 'aria-live': 'polite' });
    ui.input = h('input', { type: 'file', accept: 'application/pdf,.pdf', hidden: '', 'aria-label': 'Escolher o PDF do plano do Léo' });
    ui.input.addEventListener('change', function () { onFile(ui.input.files && ui.input.files[0]); });
    body.appendChild(ui.summary); body.appendChild(ui.actions); body.appendChild(ui.status);
    body.appendChild(h('p', { class: 'bc-leo-privacy', text: 'O PDF é lido neste aparelho. Nada é enviado para a internet.' }));
    card.appendChild(mascot); card.appendChild(head); card.appendChild(body); card.appendChild(ui.input);
    ['dragenter', 'dragover'].forEach(function (name) { card.addEventListener(name, function (e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) { e.preventDefault(); card.classList.add('is-drop'); } }); });
    ['dragleave', 'drop'].forEach(function (name) { card.addEventListener(name, function () { card.classList.remove('is-drop'); }); });
    card.addEventListener('drop', function (e) { e.preventDefault(); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) onFile(f); });
    ui.card = card;
    renderSummary();
    // Fica logo abaixo da semana; sem ela, logo abaixo do título da página.
    var anchor = document.getElementById('studentAgendaWeek') || view.querySelector('.hero');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(card, anchor.nextSibling); else view.appendChild(card);
    return true;
  }
  function ensure() {
    try {
      var existing = document.getElementById('bcLeoCard');
      if (!existing) { ui = { card: null, status: null, summary: null, actions: null, input: null, busy: false }; build(); }
      else {
        // Mantém o cartão logo abaixo da semana, mesmo se outro script reorganizar a Agenda.
        var week = document.getElementById('studentAgendaWeek');
        if (week && week.nextSibling !== existing && week.parentNode === existing.parentNode) week.parentNode.insertBefore(existing, week.nextSibling);
      }
    } catch (_) {}
  }
  function start() {
    ensure();
    document.addEventListener('click', function (event) {
      if (event.target && event.target.closest && event.target.closest('[data-central-agenda],#agendaView')) setTimeout(ensure, 0);
    }, true);
    document.addEventListener('change', function (event) {
      if (event.target && event.target.closest && event.target.closest('#agendaEditor,#homeAgenda')) setTimeout(function () { if (ui.summary && !ui.busy) renderSummary(); }, 0);
    });
    global.addEventListener('storage', function (event) { if (event.key && event.key.indexOf(AGENDA_PREFIX) === 0 && ui.summary && !ui.busy) renderSummary(); });
    setTimeout(ensure, 1200);
  }

  global.BCAgendaPdfLeo = {
    VERSION: VERSION, SOURCE: SOURCE,
    rowsFromItems: rowsFromItems, parseRows: parseRows, buildTasks: buildTasks,
    planMerge: planMerge, applyMerge: applyMerge, removeAll: removeAll, leoStats: leoStats,
    readPlan: readPlan, extractRows: extractRows, setLoader: setLoader, friendlyError: friendlyError,
    disciplineId: disciplineId, parseDuration: parseDuration, defaultStore: defaultStore, ensure: ensure
  };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
  }
})(typeof window !== 'undefined' ? window : globalThis);
