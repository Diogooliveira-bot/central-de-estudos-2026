/* Banco de questões — Noções de Informática, módulo 09. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[9]=[
 {
  "id": "info-m09-autoral-01",
  "origem": "autoral-ia",
  "q": "Muitas pessoas usam os termos internet e web como se fossem a mesma coisa. Sobre a relação entre os dois, assinale a alternativa correta:",
  "options": [
   "internet e web são sinônimos, pois todo serviço da internet é acessado por navegador",
   "a web é a infraestrutura física, e a internet é apenas o conjunto de sites",
   "o e-mail só funciona dentro da web, pois depende sempre de um navegador",
   "a internet é uma rede restrita a uma organização, e a web é a rede pública",
   "a web é um dos serviços que usam a internet, assim como o e-mail"
  ],
  "answer": 4,
  "explanation": "A internet é a infraestrutura global de redes interconectadas; a web é um dos serviços que a utilizam, com recursos identificados por URLs e acessados por navegadores. E-mail, chamadas de voz e jogos também usam a internet sem serem a web. Por isso não são sinônimos, e nem todo serviço da internet é acessado por navegador. Tratar a web como infraestrutura física e a internet como conjunto de sites inverte as definições. O e-mail não depende da web para existir, embora haja webmail. E a rede de acesso restrito a uma organização é a intranet, e não a internet.",
  "lawRef": "Internet — diferença entre internet, web, intranet e serviços"
 },
 {
  "id": "info-m09-autoral-02",
  "origem": "autoral-ia",
  "q": "Na URL https://exemplo.org/consulta?id=12#resultado, o esquema, o caminho e o fragmento são, respectivamente:",
  "options": [
   "exemplo.org, /consulta e id=12",
   "https, id=12 e resultado",
   "https, /consulta e resultado",
   "https, /consulta e id=12",
   "consulta, exemplo.org e resultado"
  ],
  "answer": 2,
  "explanation": "Na URL dada, o esquema é https, o domínio (host) é exemplo.org, o caminho é /consulta, a consulta é id=12 e o fragmento é resultado, que aponta a uma posição ou identificador do conteúdo e vem depois do símbolo #. Apontar exemplo.org como esquema confunde esquema com domínio, e id=12 como fragmento troca consulta e fragmento. Dizer que o caminho é id=12 confunde caminho e consulta. Na última alternativa, consulta, exemplo.org e resultado, os elementos estão fora de lugar. Cada parte da URL tem função própria.",
  "lawRef": "Internet — partes da URL: esquema, domínio, caminho, consulta e fragmento"
 },
 {
  "id": "info-m09-autoral-03",
  "origem": "autoral-ia",
  "q": "Ao digitar um nome de domínio na barra de endereços do navegador e pressionar Enter, o DNS desempenha, nesse processo, o papel de:",
  "options": [
   "transferir o conteúdo da página do servidor para o navegador, usando HTTP",
   "resolver o nome do domínio para registros associados, como endereços IP",
   "criptografar a conexão e garantir a identidade do site visitado",
   "atribuir automaticamente um endereço IP ao computador do usuário",
   "verificar se o conteúdo é confiável e bloquear sites falsos"
  ],
  "answer": 1,
  "explanation": "O DNS resolve nomes de domínio para registros associados, incluindo endereços IP, permitindo que o navegador descubra onde está o servidor. Ele não transfere a página: isso é papel do HTTP ou do HTTPS. Não criptografa a conexão nem garante a identidade do site: a proteção de transporte vem do TLS e, mesmo assim, não prova legitimidade. Não atribui IP ao computador do usuário: essa configuração automática costuma ser feita pelo DHCP. E o DNS não determina se o conteúdo é confiável nem bloqueia sites falsos por si só.",
  "lawRef": "Internet — DNS: resolução de nomes de domínio"
 },
 {
  "id": "info-m09-autoral-04",
  "origem": "autoral-ia",
  "q": "Uma loja virtual exibe o cadeado e um endereço iniciado por https://. Sobre essa situação, é correto afirmar que:",
  "options": [
   "a conexão tem proteção de transporte, mas isso não prova que a loja seja legítima",
   "o cadeado garante que a loja é idônea e entregará o produto comprado",
   "sites fraudulentos nunca têm certificado válido, então o https prova a autenticidade",
   "o https impede que a loja colete os dados digitados pelo cliente",
   "o cadeado indica que todo o conteúdo exibido na página é verdadeiro"
  ],
  "answer": 0,
  "explanation": "Com HTTPS configurado corretamente, a comunicação entre cliente e servidor tem confidencialidade e integridade, normalmente por TLS, mas isso não prova que a loja seja legítima. Sites fraudulentos também podem ter certificados válidos para seus domínios. Por isso o cadeado não garante idoneidade nem a entrega do produto, e tampouco indica que o conteúdo é verdadeiro. O HTTPS também não impede que o próprio site colete dados que o usuário digita, pois protege o trânsito, e não o que o destino faz com as informações. É preciso examinar o endereço completo, a origem do link e o contexto do pedido.",
  "lawRef": "Internet — HTTPS protege a conexão, mas não prova legitimidade"
 },
 {
  "id": "info-m09-autoral-05",
  "origem": "autoral-ia",
  "q": "Um usuário acessa um endereço e recebe a mensagem Erro 404. De acordo com os grupos de códigos de resposta HTTP, isso indica:",
  "options": [
   "sucesso na solicitação, com a página entregue (grupo 2xx)",
   "redirecionamento para outro endereço (grupo 3xx)",
   "erro interno do servidor ao processar o pedido (grupo 5xx)",
   "recurso não encontrado, falha associada ao cliente (grupo 4xx)",
   "queda da conexão do usuário, sem nenhuma resposta do servidor"
  ],
  "answer": 3,
  "explanation": "O código 404 pertence ao grupo 4xx e significa recurso não encontrado, falha associada à solicitação do cliente, como um endereço digitado errado ou uma página removida. O grupo 2xx indica sucesso (como 200, OK), o 3xx indica redirecionamento (como 301 e 302) e o 5xx indica erro do servidor (como 500, erro interno). Também não se trata de queda da conexão do usuário: nesse caso nem haveria resposta HTTP do servidor, e sim falha de rede. O primeiro dígito do código ajuda a classificar a situação rapidamente.",
  "lawRef": "Internet — códigos de resposta HTTP: 2xx, 3xx, 4xx e 5xx"
 },
 {
  "id": "info-m09-autoral-06",
  "origem": "autoral-ia",
  "q": "Considere os conceitos de cookies, cache e histórico em um navegador. Assinale a alternativa correta:",
  "options": [
   "o cookie guarda cópias de imagens para acelerar a página, e o cache mantém a sessão de login",
   "cookies, cache e histórico são sinônimos para o mesmo tipo de dado armazenado",
   "o histórico guarda cópia completa dos sites visitados para uso offline",
   "o cache guarda recursos temporários; os cookies podem manter sessão e preferências",
   "o cache registra apenas a lista dos endereços visitados pelo usuário"
  ],
  "answer": 3,
  "explanation": "O cache armazena recursos temporários, como imagens e arquivos, para reduzir carregamentos repetidos, e os cookies conservam sessões, preferências e identificadores. Dizer que o cookie guarda imagens e o cache mantém o login inverte os conceitos. Cookies, cache e histórico não são sinônimos. O histórico registra visitas, conforme configuração, mas não guarda cópia completa dos sites para uso offline; favoritos, do mesmo modo, guardam referências, e não cópias. E o cache não registra a lista de endereços visitados: essa é função do histórico.",
  "lawRef": "Internet — cookies, cache e histórico do navegador"
 },
 {
  "id": "info-m09-autoral-07",
  "origem": "autoral-ia",
  "q": "Os navegadores oferecem a navegação privada (também chamada de anônima). É INCORRETO afirmar, a respeito desse recurso, que ele:",
  "options": [
   "torna o usuário anônimo para provedor, rede corporativa e sites visitados",
   "limita a retenção de certos dados no dispositivo após o encerramento da sessão",
   "não elimina os arquivos baixados nem os favoritos que o usuário salvar durante a sessão",
   "não impede que a rede corporativa ou o provedor registrem o acesso feito pelo usuário",
   "não substitui os cuidados contra phishing nem a avaliação das extensões instaladas"
  ],
  "answer": 0,
  "explanation": "A afirmação incorreta é a que diz que a navegação privada torna o usuário anônimo. Ela limita a retenção de certos dados no dispositivo ao encerrar a sessão, mas o provedor de internet, a rede corporativa e os sites visitados ainda podem registrar o acesso. As demais afirmações são verdadeiras: ela não elimina downloads nem favoritos salvos pelo usuário; não impede o registro do acesso pela rede ou pelo provedor; e é só um recurso do navegador, que não substitui cuidados contra phishing nem a avaliação de extensões, as quais podem pedir permissões amplas.",
  "lawRef": "Internet — navegação privada não é anonimato"
 },
 {
  "id": "info-m09-autoral-08",
  "origem": "autoral-ia",
  "q": "Um usuário quer buscar a expressão exata processo eletrônico restringindo os resultados ao domínio jus.br, em buscadores que aceitam esses operadores. A consulta adequada é:",
  "options": [
   "-site:jus.br \"processo eletrônico\"",
   "site:jus.br \"processo eletrônico\"",
   "site:jus.br -\"processo eletrônico\"",
   "site:jus.br processo eletrônico",
   "\"jus.br\" processo -eletrônico"
  ],
  "answer": 1,
  "explanation": "A consulta site:jus.br \"processo eletrônico\" combina o operador site:, que restringe os resultados ao domínio, com as aspas, que buscam a expressão exata. Sem as aspas, o buscador procura as palavras separadamente, e a exigência de expressão exata se perde. Com o sinal de menos antes de site:, o domínio é excluído, e não restrito. O menos antes das aspas exclui a expressão, em vez de exigi-la. Já jus.br entre aspas com -eletrônico procura o texto jus.br e descarta resultados com a palavra eletrônico. Operadores variam por mecanismo, e o resultado não garante completude nem atualidade.",
  "lawRef": "Internet — operadores de busca: aspas, site: e sinal de menos"
 },
 {
  "id": "info-m09-autoral-09",
  "origem": "autoral-ia",
  "q": "Um estudante pesquisa um assunto em um mecanismo de busca e analisa a lista de resultados. Quanto à confiabilidade desses resultados, é correto afirmar que:",
  "options": [
   "o buscador consulta diretamente, em tempo real, todas as páginas da internet a cada pesquisa",
   "o primeiro resultado é sempre a fonte oficial e atualizada do assunto pesquisado",
   "todo site existente está necessariamente indexado e aparece nos resultados",
   "resultado patrocinado é aquele que o buscador verificou e considera o mais confiável",
   "resultados patrocinados são publicidade e a posição elevada não prova autenticidade"
  ],
  "answer": 4,
  "explanation": "Resultados patrocinados são publicidade, e posição elevada nos resultados não prova autenticidade nem qualidade do conteúdo; para normas e documentos oficiais é preciso confirmar a origem e a versão vigente na página institucional. Os buscadores indexam páginas, e não consultam toda a internet em tempo real a cada pesquisa; nem todo site está indexado, e o conteúdo exibido pode estar desatualizado. O primeiro resultado não é sempre a fonte oficial, e resultado patrocinado não significa conteúdo verificado como o mais confiável.",
  "lawRef": "Internet — mecanismos de busca, indexação e resultados patrocinados"
 },
 {
  "id": "info-m09-autoral-10",
  "origem": "autoral-ia",
  "q": "Um plano de internet é anunciado com velocidade de 200 Mbps. Sobre essa unidade e sobre download e upload, é correto afirmar que:",
  "options": [
   "Mbps e MBps são a mesma unidade, de modo que 200 Mbps equivalem a 200 megabytes por segundo",
   "download é enviar arquivos do dispositivo ao servidor, e upload é receber dados do servidor",
   "Mbps são megabits por segundo, e não megabytes; download é receber e upload é enviar",
   "upload só ocorre em redes sociais, e nunca em serviços de e-mail ou de armazenamento",
   "a velocidade anunciada em Mbps mede apenas o envio de dados, e nunca o recebimento"
  ],
  "answer": 2,
  "explanation": "Mbps significa megabits por segundo, e MBps, megabytes por segundo: como cada byte tem 8 bits, 200 Mbps equivalem, no máximo teórico, a cerca de 25 megabytes por segundo, e não a 200. Download é a transferência de dados do servidor para o dispositivo, e upload é o caminho inverso, sendo comum um serviço usar ambos na mesma operação. Por isso é errado inverter download e upload, tratar Mbps e MBps como iguais, limitar o upload às redes sociais, quando e-mail e armazenamento também o usam, ou afirmar que a velocidade anunciada mede apenas o envio.",
  "lawRef": "Internet — download, upload e unidades de velocidade (Mbps x MBps)"
 }
];
