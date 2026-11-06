# Direito Penal — prévia editorial dos 17 módulos

Escopo: aplicar o padrão visual aprovado no CPP às apostilas completas de Direito Penal, preservando o conteúdo original, tabelas, questões, versões de revisão e mecanismos de progresso.

A apresentação acrescenta abertura com roteiro do módulo, comparação a partir de tabela original, pontos organizados a partir de lista original e revisão antes das questões. A lei seca é distribuída junto às referências identificadas; as referências repetidas recebem caixas em cada trecho correspondente; os artigos restantes do recorte legal ficam em um grupo recolhido no início.

O inventário contém 540 referências de módulo, com 468 artigos distintos. Inclui os capítulos pertinentes do Código Penal, fundamentos constitucionais, Lei 13.869/2019, Lei 9.613/1998 e dispositivos de responsabilidade penal da pessoa jurídica da Lei 9.605/1998. Os textos vêm das compilações oficiais da Câmara e do Senado, com notas legislativas e de controle de constitucionalidade preservadas. O corpus anterior de CPP é reaproveitado para referências correlatas. Não se trata de revisão doutrinária ou jurisprudencial integral da teoria original.

Fontes e cobertura reproduzíveis: `penal-official-source-lines.json`, `penal-visual-law-coverage.json` e `scripts/build-penal-visual-law.mjs`. O gerador rejeita artigos com lacunas na captura oficial. As alterações se limitam à apresentação e aos suplementos legais.

Validação: 24 testes aprovados. O teste de leitores abre os 17 módulos com e sem a camada visual e compara todos os parágrafos, tabelas e 170 questões completas, além dos resumos. A cobertura verifica os capítulos centrais, dispositivos com letras, leis especiais e correspondência literal com as fontes. Os testes existentes de layout, resumo, teoria guiada e acesso de prévia também passaram.

Prévia apenas. Não publicar sem nova autorização do proprietário.

Correção de cobertura (06/11/2026): identificação de listas e intervalos, artigos com letras, células de cabeçalho e caixas de texto sem parágrafos. Acrescentados 24 artigos distintos e 38 vínculos de módulo; referências correlatas das leis especiais capturadas em fontes oficiais. Art. 89 da Lei 8.666/1993 identificado expressamente como redação histórica revogada. Validação desta correção: 15 testes aprovados; conteúdo original e 170 questões preservados.
