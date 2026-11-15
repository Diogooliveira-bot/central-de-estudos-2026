# Lentidão da Central — investigação de 15/11/2026

**Método:** Chromium com CPU 4× mais lenta (celular intermediário) e, nos números de rede, 1,6 Mbps / 150 ms (4G lento). Perfil de CPU (`Profiler`) por etapa: carga inicial, abrir Direito Administrativo, abrir módulo e abrir a Revisão. Contagem de requisições e bytes com gzip. Conferência de conteúdo idêntico (hash do texto) com e sem os arquivos retirados.

## O que foi encontrado
1. **Direito Administrativo baixava 39 arquivos legados** (`adm-mN-theory/content-pN/runtime/correction` e o pacote `adm-m9-m20-bundle`, 1,7 MB / 485 KB gz) ao abrir a disciplina, e ainda os executava e higienizava (`cleanLegacyHtml`). As apostilas atuais (Revisão e Teoria completa) vêm dos leitores nativos. Bloqueando os 39 arquivos, lista, página do módulo, Revisão e Teoria completa ficaram **idênticas** (M1, M5, M13 e M20; 0 erros). O Plano Gratuito já abria o ADM sem eles (403 ignorado).
2. **Direito Civil carregava 5 arquivos legados (`civil-course-001…005`, ~700 KB / 140 KB gz) na abertura da Central.** Idêntico sem eles (início, lista, M1, M5, M12).
3. **O registro de filtros QC/TEC era refeito e reordenado a cada alteração da tela** (`external-question-filters-v1.js`): `localeCompare('pt-BR')` cria um coletor novo a cada comparação. Agora usa `Intl.Collator` reaproveitado, só refaz quando os catálogos mudam e ignora alterações dentro de leitores abertos.
4. **Vários "varredores" globais** (MutationObserver) revarrem o documento inteiro a cada alteração: `student-ux-core-v3`, `shell.js`, `old-questions-removed-v1`, `correcoes-20260930`, `module-clean`, `visual-editor`. É o que mais pesa ao abrir uma Revisão (≈ 3,5 s de 8,7 s com CPU 4×).
5. **Carga inicial:** 170 requisições, 3,9 MB (1,03 MB gz). Maiores: `runtime.js` 732 KB (172 KB gz), `index.html` 239 KB, catálogos QC (`qc-notebook-catalog` 264 KB, `qc-sharing-links` 168 KB), editais (`trt8`/`tjpb` 173 KB). RLM (`aulas-*`, `complementos-teoria`) e CF (`cf-weeks-*`) **não** podem sair: o conteúdo muda sem eles.

## Antes → depois (CPU 4×; rede 4G lento)
| Etapa | Antes | Depois |
| --- | --- | --- |
| Carga inicial (rede) | 1,20 MB gz · pronto em 26,3 s | 1,03 MB gz · pronto em 23,3 s |
| Abrir ADM: transferência | 485 KB gz · 44 requisições | 27 KB gz · 5 requisições |
| Abrir ADM + módulo (4G lento) | ≈ 12,5 s | ≈ 1,7 s |
| Abrir ADM: CPU (CPU 4×) | 4,7 s | 2,3 s |
| Abrir Revisão do ADM (4G lento) | 7,3 s | 6,0 s |

## Próximos passos (não feitos; maior ganho primeiro)
1. Unificar os varredores globais em um só, com fila e escopo (hoje 6 revarrem o documento).
2. Quebrar `runtime.js` (732 KB) em partes por disciplina, carregadas sob demanda.
3. Carregar sob demanda os catálogos QC/TEC e os editais TRT8/TJPB (só abrem na Central de Questões e no Edital).
4. Cabeçalho `Cache-Control: no-cache` em **todos** os arquivos (inclusive versionados com `?v=`): usar `public, max-age=31536000, immutable` para arquivos versionados.
5. Cache do serviço (PWA) já serve arquivos versionados do aparelho; confirmar nos aparelhos reais.
