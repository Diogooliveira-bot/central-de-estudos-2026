from pathlib import Path
import csv, io, json, hashlib

ANKI = Path('tools/anki.html')
PARTS = [Path(f'data/flashcards_portugues_part{i}.csv') for i in range(1, 5)]
BASE_TS = 1788263834824
SOURCE = 'flashcards_portugues_medio_dificil.csv'
PREFIX = '03 PORTUGUÊS::REVISÃO MÉDIO E DIFÍCIL'
IDS = ['pt-md-81edcc2569944772', 'pt-md-02cbb68ef801e720', 'pt-md-8e4951c77e6f6d8d', 'pt-md-2aead1a3959b72bd', 'pt-md-a6ff475e78344f07', 'pt-md-e6816a3667496ace', 'pt-md-59d82762319d0ab6', 'pt-md-3f05a75965fd938b', 'pt-md-cc4c381b07354489', 'pt-md-882ec5a22b64bb5c', 'pt-md-c04b7da1c4ae80b1', 'pt-md-70103c280cf21f6b', 'pt-md-d82b7cb3e2a567aa', 'pt-md-c810405f196667f4', 'pt-md-03c3831f753507fd', 'pt-md-ac299cf079f22874', 'pt-md-56a6d6d7da48d29a', 'pt-md-4bc4e6415356a983', 'pt-md-792c6dbca00698cd', 'pt-md-0b7464fd88b1406d', 'pt-md-8b872e2685838cff', 'pt-md-f67f3cef72969333', 'pt-md-6bfeadcd63838809', 'pt-md-9895fd3adfc1596a', 'pt-md-9cc6ced9fa529c69', 'pt-md-3b425c94bc0cb822', 'pt-md-0274a6cf82baab79', 'pt-md-6489f183a8bb41af', 'pt-md-e219c890764cc7bb', 'pt-md-f15ce1d2848ace4e', 'pt-md-5e19b1e2154b04f6', 'pt-md-25a9726260d03b7e', 'pt-md-ea2fd9f65b8d090c', 'pt-md-4530277d4e72a2e0', 'pt-md-65d724200584a3de', 'pt-md-04c2524d94954c2c', 'pt-md-9d662923ccdb552f', 'pt-md-919d35352e6e4b81', 'pt-md-b14cb44dc432a5dc', 'pt-md-2fda2ac8451a4af0', 'pt-md-60ce19b7a98d725d', 'pt-md-ccf171d0fd97d718', 'pt-md-2ad5b787d438730a', 'pt-md-9437de154506cfcc', 'pt-md-96ff611d1b1fc8c8', 'pt-md-1fa77cec9218b18e', 'pt-md-9fe688efe9f884a7', 'pt-md-7c87dbff301b2cd3', 'pt-md-ec825bce1968c2da', 'pt-md-7d78e16500fbc4e1', 'pt-md-8b6f8282160f58bb', 'pt-md-51637f0eaffca4dc', 'pt-md-6f83a0804c5a11b8', 'pt-md-be739b0aae4bb8e1', 'pt-md-1e2037d302893547', 'pt-md-0a8e59b043f42688', 'pt-md-534a8d9f9819c18d', 'pt-md-7e0c91ebfd7e49ca', 'pt-md-9a80b7a8b01466d0', 'pt-md-a6221b2198cdbce5', 'pt-md-aafd2d4e9dbb5004', 'pt-md-f18efb50403f1758', 'pt-md-2bbd5b774ef7dc8b', 'pt-md-25970b04cb4d4d83', 'pt-md-ff8a8d64165e58c7', 'pt-md-ba5b691b6869fe7d', 'pt-md-7c8d413ff778b00c', 'pt-md-b9d16b6c831d55fb', 'pt-md-2af1de580555b2e3', 'pt-md-5517762469316cae', 'pt-md-732bd43c9c040cbb', 'pt-md-cbdbcedb19034685', 'pt-md-1a743a3f7e1b1d24', 'pt-md-486177966fa50e82', 'pt-md-9d54d1ab47a78aa5', 'pt-md-de629710da71af6b', 'pt-md-b18f2cf1b16d13fc', 'pt-md-fcb32b67bee56fc6', 'pt-md-bab9f6ef11441144', 'pt-md-596a36dcdf355f4a', 'pt-md-a6f7d38816cfc97b', 'pt-md-bf4214c1a6ed8ef3', 'pt-md-c19f62164d7a1963', 'pt-md-58680ad0ceebdfbb', 'pt-md-d3db1d60505b9213', 'pt-md-c2e89c1624243e91', 'pt-md-a98e49e13fe9c0b7', 'pt-md-ba971a395ee0a3e3', 'pt-md-56359a41e41b3fab', 'pt-md-7423b9144de6e048', 'pt-md-4c5c314447a54e94', 'pt-md-65c9efaba3a5185a', 'pt-md-1a7029496b359610', 'pt-md-cfa470835f5feed7', 'pt-md-e7fa6897efb1ce56', 'pt-md-051b9a36e09ae56c', 'pt-md-2a82c6a77a4cd441', 'pt-md-e151221573f0ae1d', 'pt-md-b4e5d69a3802d697', 'pt-md-e19a6e9c153ef02e', 'pt-md-388198a4601c4602', 'pt-md-dc6f1291ac2964d8', 'pt-md-6f5946d76b92240b', 'pt-md-44f6c24de4be3172', 'pt-md-d8da0e16516944a9', 'pt-md-6ff9e9f02ec951cd', 'pt-md-d7e3244150832290', 'pt-md-aba9aff771b1954b', 'pt-md-c20e30f88284fe6f', 'pt-md-24f338f768caa7c9', 'pt-md-2bbcaca943a77103', 'pt-md-d1088de3e56fe698', 'pt-md-157b5287563c2d26', 'pt-md-44b2ea8dffff5f38', 'pt-md-bc82c6ecbd3c0c46', 'pt-md-118be049d23f9440', 'pt-md-59a6e8819ba0e0ce', 'pt-md-1e965a30dbd49867', 'pt-md-4dc9e2df6abeddfa', 'pt-md-a8b199ef6ef92af3', 'pt-md-2c94396c047a979e', 'pt-md-e447333ddd74dfd7', 'pt-md-5edb71dd40b85e4b', 'pt-md-4dab5861807ac11b', 'pt-md-c8341bd00837aee6', 'pt-md-16a7fda8f0490c7d', 'pt-md-751543fc6f0040ad', 'pt-md-6556231c191db6ff', 'pt-md-6d4217e3f2c8a350', 'pt-md-ed80a9e0b1061a65', 'pt-md-f0baddfe9928d923', 'pt-md-6a5d37531c8b11c8', 'pt-md-afa08189115056b0', 'pt-md-80a4bd935d806b78', 'pt-md-30c0d050342fbf96', 'pt-md-2e47c8b71e9ac611', 'pt-md-cda677fb0c7dc94e', 'pt-md-912eadb993cc737d', 'pt-md-a3b0fadce0596640', 'pt-md-ddc7b8f0a433db5e', 'pt-md-a472637156e4b7d3', 'pt-md-ba8a7916645b6527', 'pt-md-f45a61a391ccdef5', 'pt-md-32d3bdfff95eb31c', 'pt-md-85a9a4646203ca6d', 'pt-md-7a1299b7103f8154', 'pt-md-dc1c7da3439fb7ed', 'pt-md-430865dd9876ccc3', 'pt-md-f389de9a3f13ae82', 'pt-md-e74edec9114d54a2', 'pt-md-60b6990a548877e7', 'pt-md-8de7d2f6c679d789', 'pt-md-c8997f01b759f507', 'pt-md-d6c5bbecbbb64d0c', 'pt-md-98cd66aa37b32100', 'pt-md-0116a16ec667ad11', 'pt-md-4ac0675ba766e8aa', 'pt-md-0fe83bcdf92da049', 'pt-md-1e5d3b27d67ec214', 'pt-md-049137dbf5c67ee8']

rows = []
for p in PARTS:
    rows.extend(csv.DictReader(io.StringIO(p.read_text(encoding='utf-8')), delimiter=';'))
assert len(rows) == 160, len(rows)
assert len(IDS) == len(rows)

html = ANKI.read_text(encoding='utf-8')
marker = 'window.ANKI_SITE_DATA = '
pos = html.index(marker) + len(marker)
data, consumed = json.JSONDecoder().raw_decode(html[pos:])
end = pos + consumed

# Idempotência: elimina uma eventual importação anterior desta mesma coleção.
data['cards'] = [c for c in data.get('cards', []) if c.get('source') != SOURCE]
data['decks'] = [d for d in data.get('decks', []) if not d.startswith(PREFIX)]

new_decks = set()
for i, row in enumerate(rows):
    week = row['Semana'].strip()
    level = row['Nivel'].strip()
    deck = f'{PREFIX}::{week.upper()}'
    new_decks.add(deck)
    ts = BASE_TS + i
    data['cards'].append({
        'id': IDS[i],
        'deck': deck,
        'tags': f'portugues revisao {level.lower()} {week.lower()}',
        'noteType': 'Básico',
        'fields': {'Frente': row['Frente'], 'Verso': row['Verso']},
        'structural': False,
        'judgment': False,
        'expected': None,
        'suspended': False,
        'source': SOURCE,
        'createdAt': ts,
        'modifiedAt': ts,
        'stats': {'again': 0, 'hard': 0, 'good': 0, 'easy': 0, 'last': 0, 'history': []}
    })

data['decks'] = sorted(set(data.get('decks', [])) | new_decks, key=lambda x: x.lower())
data['generatedAt'] = BASE_TS
data['totalCards'] = len(data['cards'])
data['deckCount'] = len(data['decks'])
data['version'] = '6.6.77-portugues-flashcards'
assert data['totalCards'] == 4844, data['totalCards']
assert data['deckCount'] == 183, data['deckCount']

compact = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
ANKI.write_text(html[:pos] + compact + html[end:], encoding='utf-8')

sw = Path('sw.js')
s = sw.read_text(encoding='utf-8').replace('6676', '6677')
sw.write_text(s, encoding='utf-8')

print('cards=', data['totalCards'], 'decks=', data['deckCount'])
print('anki_sha256=', hashlib.sha256(ANKI.read_bytes()).hexdigest())
print('sw_sha256=', hashlib.sha256(sw.read_bytes()).hexdigest())
