/* Ignore destinations and saved shortcuts for courses removed from the Central. */
(function (global) {
  'use strict';
  const ids = new Set(['trab','ptra','ptrab','trabalho','ptrabalho','processual-trabalho','processo-trabalho','trabalhista']);
  function isRemoved(value) {
    const text = String(value || '').trim().toLowerCase();
    return ids.has(text)
      || /^(?:t:)?(?:trab|ptra|ptrab|proc-trab)-/.test(text)
      || /(?:^|\/)(?:modules\/trabalho|content\/ptra|assets\/ptra)(?:\/|$)/.test(text)
      || /^(?:\d+\s+)?(?:direito\s+)?(?:(?:processual|processo)\s+)?(?:do\s+)?trabalho(?:$|\s*[•—–:]|::)/.test(text);
  }
  function isRemovedRecord(record) {
    if (!record || typeof record !== 'object') return false;
    return ['subject','subjectId','discipline','disciplineId','disciplineKey','grupo','uid','topicUid','cid','module','url','title'].some(key => isRemoved(record[key]))
      || Boolean(record.opts && isRemovedRecord(record.opts));
  }
  global.CentralDisciplineAvailability = Object.freeze({isRemoved,isRemovedRecord});
})(window);
