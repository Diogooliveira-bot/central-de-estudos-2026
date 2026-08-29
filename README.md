# Central de Estudos Integrada

Versão atual: **v6.6.57 — Lei seca visual**

Estrutura:
- `index.html` — app principal (site)
- `api/` — funções Vercel (sync com Neon + embedded)
- `connector-deploy/` — versão self-contained (para link externo/Android)
- `connector-assets-1/` e `connector-assets-2/` — bases auxiliares (Anki, Decorando, Vade, RLM)
- `scripts/` — builders que geram connector-deploy e connector-assets a partir do index.html

Deploy: Vercel (framework none, sem build). Variáveis necessárias: `DATABASE_URL` e `CENTRAL_SYNC_PEPPER`.

Para publicar uma nova versão: atualize `index.html` aqui e a Vercel publica automaticamente (após conectar o repo no projeto Vercel).
