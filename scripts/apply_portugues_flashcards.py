from pathlib import Path
import csv, io, json, re

ANKI = Path('tools/anki.html')
PARTS = [Path(f'data/flashcards_portugues_part{i}.csv') for i in range(1, 5)]
SOURCE = 'flashcards_portugues_medio_dificil.csv'
MIGRATION_TAG = '<script src="./anki-migrate-v6679.js?v=6679"></script>'
# Mantido apenas para compatibilidade com a rotina anterior: pt-md-e6816a3667496ace

REMOVER_RAIZES = {
    '06 LEGISLAÇÃO',
    '99 ARQUIVO FORA DO EDITAL',
    'QUESTÕES',
    'RLM',
}

rows = []
for p in PARTS:
    rows.extend(csv.DictReader(io.StringIO(p.read_text(encoding='utf-8')), delimiter=';'))
assert len(rows) == 160, len(rows)

por_frente = {r['Frente'].strip(): r for r in rows}
assert len(por_frente) == 160, 'Há frentes duplicadas no CSV.'

html = ANKI.read_text(encoding='utf-8')
marker = 'window.ANKI_SITE_DATA = '
pos = html.index(marker) + len(marker)
data, consumed = json.JSONDecoder().raw_decode(html[pos:])
end = pos + consumed

cards_160 = [c for c in data.get('cards', []) if c.get('source') == SOURCE]
assert len(cards_160) == 160, f'Esperados 160 cards novos, encontrados {len(cards_160)}'
assert len({c.get('id') for c in cards_160}) == 160


def raiz(deck):
    return (deck or '').split('::', 1)[0].strip().upper()

limpos = []
for c in data.get('cards', []):
    r = raiz(c.get('deck'))
    if r == '03 PORTUGUÊS' and c.get('source') != SOURCE:
        continue
    if r in REMOVER_RAIZES:
        continue
    limpos.append(c)

data['cards'] = limpos

for c in data['cards']:
    if c.get('source') != SOURCE:
        continue
    frente = (c.get('fields') or {}).get('Frente', '').strip()
    row = por_frente.get(frente)
    assert row is not None, f'Card não encontrado no CSV: {frente[:80]}'

    semana_raw = row['Semana'].strip()
    m = re.match(r'^Semana\s*(\d+)\s*[—–-]\s*(.+)$', semana_raw, re.I)
    assert m, f'Formato de semana inesperado: {semana_raw}'
    numero = int(m.group(1))
    topico = m.group(2).strip().upper()
    c['deck'] = f'03 PORTUGUÊS::SEMANA {numero:02d}::{topico}'

    nivel = row.get('Nivel', '').strip().lower()
    c['tags'] = f'portugues semana-{numero:02d} {nivel} {topico.lower()}'

data['decks'] = sorted(
    {c.get('deck') for c in data['cards'] if c.get('deck')},
    key=lambda x: x.lower()
)

data['totalCards'] = len(data['cards'])
data['deckCount'] = len(data['decks'])
data['version'] = '6.6.79-portugues-organizado'

pt = [c for c in data['cards'] if raiz(c.get('deck')) == '03 PORTUGUÊS']
assert len(pt) == 160, f'Português deveria ter 160 cards, tem {len(pt)}'
assert all(c.get('source') == SOURCE for c in pt), 'Restou card antigo em Português.'
assert {int(re.search(r'SEMANA (\d+)', c['deck']).group(1)) for c in pt} == set(range(1, 17))
for removida in REMOVER_RAIZES:
    assert not any(raiz(c.get('deck')) == removida for c in data['cards']), f'Restou card em {removida}'

compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
out = html[:pos] + compact + html[end:]
# A migração roda no próprio Anki e corrige também localStorage/cópia sincronizada antiga.
if MIGRATION_TAG not in out:
    assert '</body>' in out
    out = out.replace('</body>', MIGRATION_TAG + '</body>', 1)
ANKI.write_text(out, encoding='utf-8')

sw = Path('sw.js')
s = sw.read_text(encoding='utf-8').replace('6678', '6679')
sw.write_text(s, encoding='utf-8')

print('Português=', len(pt))
print('Total=', data['totalCards'])
print('Decks=', data['deckCount'])
print('Migração=', '6679')
print('Removidos=', ', '.join(sorted(REMOVER_RAIZES)))
