/* CF M1-M12 audit prelude • non-destructive */
(function(){'use strict';
window.CF_AUDIT_INTEGRATION={version:'2026.09.19-final-audited',integratedAt:'2026-09-20',modules:12,questions:503,anki:1024,preserveState:true};
try{if(typeof CF_QUESTIONS!=='undefined')for(const q of CF_QUESTIONS){if(q&&q.real===false&&!q.auditPackage)q.auditArchived=true;}}catch(e){console.warn('CF audit archive questions',e)}
try{const A=window.ANKI_SITE_DATA;if(A&&Array.isArray(A.cards)){for(const c of A.cards){if(c&&String(c.deck||'').startsWith('02 DIREITO CONSTITUCIONAL::')&&!c.auditPackage){c.legacyDeck=c.legacyDeck||c.deck;c.deck='99 ARQUIVO FORA DO EDITAL::DIREITO CONSTITUCIONAL::PRÉ-AUDITORIA 2026';c.migrationArchived=true;}}if(Array.isArray(A.decks)&&!A.decks.includes('99 ARQUIVO FORA DO EDITAL::DIREITO CONSTITUCIONAL::PRÉ-AUDITORIA 2026'))A.decks.push('99 ARQUIVO FORA DO EDITAL::DIREITO CONSTITUCIONAL::PRÉ-AUDITORIA 2026');}}catch(e){console.warn('CF audit archive anki',e)}
})();
