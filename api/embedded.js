const SOURCES = {
  anki: 'https://central-estudos-embeds-1.vercel.app/anki.txt',
  decorando: 'https://central-estudos-embeds-1.vercel.app/decorando.txt',
  vade: 'https://central-estudos-embeds-2.vercel.app/vade.txt',
  rlm: 'https://central-estudos-embeds-2.vercel.app/rlm.txt',
};

const payloadPromises = new Map();

function loadPayload(name) {
  if (!payloadPromises.has(name)) {
    const promise = fetch(SOURCES[name])
      .then(async (response) => {
        if (!response.ok) throw new Error(`Falha ao carregar a base: ${response.status}`);
        return response.text();
      })
      .catch((error) => {
        payloadPromises.delete(name);
        throw error;
      });
    payloadPromises.set(name, promise);
  }
  return payloadPromises.get(name);
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).send('Method Not Allowed');
  }

  const name = String(request.query?.name || '');
  if (!SOURCES[name]) return response.status(400).send('Ferramenta inválida');

  try {
    const data = await loadPayload(name);
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.setHeader('Cache-Control', 'public, s-maxage=31536000, immutable');
    return response.status(200).send(data);
  } catch (error) {
    console.error('Falha ao servir ferramenta incorporada', error);
    return response.status(502).send('Não foi possível carregar a ferramenta');
  }
}
