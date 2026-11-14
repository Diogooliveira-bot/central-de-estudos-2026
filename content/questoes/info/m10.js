/* Banco de questões — Noções de Informática, módulo 10. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[10]=[
 {
  "id": "info-m10-autoral-01",
  "origem": "autoral-ia",
  "q": "Os computadores de uma secretaria ligados a um switch formam uma rede local. Quando essa rede se conecta a sistemas de outro estado, a ligação entre localidades distantes é associada a uma:",
  "options": [
   "WAN, que conecta localidades distantes",
   "LAN, pois toda rede que usa switch é LAN, qualquer que seja a distância",
   "PAN, que reúne dispositivos pessoais próximos",
   "MAN, que abrange a escala de uma cidade ou região metropolitana",
   "topologia em estrela, que define a abrangência geográfica da rede"
  ],
  "answer": 0,
  "explanation": "Uma rede ligada a um switch na secretaria é uma LAN, de escopo local. A ligação dessa rede a sistemas de outro estado envolve uma WAN, que conecta localidades distantes. A PAN reúne dispositivos pessoais próximos e não cobre a distância entre estados. A MAN tem escala metropolitana, ou seja, uma cidade ou região urbana, e não liga estados diferentes. Dizer que a ligação é LAN só porque há um switch usa o equipamento como critério, quando a classificação é descritiva e leva em conta a abrangência. Topologia descreve a organização das conexões, e não a abrangência geográfica.",
  "lawRef": "Redes — classificação por abrangência: PAN, LAN, MAN e WAN"
 },
 {
  "id": "info-m10-autoral-02",
  "origem": "autoral-ia",
  "q": "Qual equipamento encaminha pacotes entre redes diferentes, normalmente com base em endereços IP e em tabelas de roteamento?",
  "options": [
   "O switch Ethernet, que comuta quadros entre portas usando endereços MAC na rede local",
   "O hub tradicional, que replica o tráfego recebido para suas portas",
   "O repetidor, que regenera e encaminha o sinal recebido",
   "O ponto de acesso, que permite a conexão de dispositivos sem fio à rede",
   "O roteador, que encaminha pacotes entre redes com base em IP"
  ],
  "answer": 4,
  "explanation": "O roteador encaminha pacotes entre redes diferentes, normalmente com base em endereços IP e tabelas de roteamento. O switch Ethernet comuta quadros entre portas, em geral por endereços MAC, dentro da rede local. O hub tradicional apenas replica o tráfego para as portas, sem comutação inteligente. O repetidor regenera e encaminha o sinal, sem decidir caminhos entre redes. O ponto de acesso permite que dispositivos sem fio se conectem à rede, mas não é ele quem escolhe rotas entre redes. Note que equipamentos residenciais podem juntar várias dessas funções numa só caixa.",
  "lawRef": "Redes — equipamentos: roteador, switch, hub, repetidor e ponto de acesso"
 },
 {
  "id": "info-m10-autoral-03",
  "origem": "autoral-ia",
  "q": "No modelo OSI, as camadas são numeradas de 1 (Física) a 7 (Aplicação). Os números das camadas de Transporte, de Rede e de Aplicação são, respectivamente:",
  "options": [
   "3, 4 e 7",
   "4, 2 e 7",
   "5, 3 e 6",
   "4, 3 e 7",
   "4, 3 e 5"
  ],
  "answer": 3,
  "explanation": "No modelo OSI, as sete camadas são: 1 Física, 2 Enlace, 3 Rede, 4 Transporte, 5 Sessão, 6 Apresentação e 7 Aplicação. Portanto Transporte é a 4, Rede é a 3 e Aplicação é a 7. Trocar Rede e Transporte (3, 4 e 7) é erro comum. A camada 2 é a de Enlace, e não a de Rede, então 4, 2 e 7 falha no segundo número. Sessão é a 5 e Apresentação é a 6, de modo que 5, 3 e 6 não correspondem às camadas pedidas. E a 5 não é a Aplicação, mas a Sessão. O modelo é referência conceitual, e protocolos reais nem sempre seguem divisão rígida.",
  "lawRef": "Redes — modelo OSI: as sete camadas e sua numeração"
 },
 {
  "id": "info-m10-autoral-04",
  "origem": "autoral-ia",
  "q": "Considere os protocolos TCP e UDP, que atuam na camada de Transporte. Assinale a alternativa que descreve corretamente suas características:",
  "options": [
   "o UDP é orientado a conexão e garante entrega ordenada; o TCP não oferece essas garantias",
   "o UDP é sempre mais rápido e mais seguro, por isso o TCP está em desuso",
   "o TCP é orientado a conexão e entrega dados de forma confiável e ordenada; o UDP não oferece as mesmas garantias",
   "o uso de TCP garante dados criptografados, e o UDP nunca pode ser protegido",
   "TCP e UDP operam na camada de Rede, a mesma do protocolo IP"
  ],
  "answer": 2,
  "explanation": "O TCP é orientado a conexão e fornece entrega confiável e ordenada de dados, conforme seus mecanismos; o UDP é não orientado a conexão e não oferece as mesmas garantias. Inverter as características é erro. O UDP não é sempre mais rápido nem mais seguro, e o TCP não está em desuso: a escolha depende da aplicação, e um aplicativo pode usar UDP e implementar controle próprio. Usar TCP ou UDP também não determina, sozinho, se os dados estão criptografados: isso depende de protocolos como o TLS. E ambos operam na camada de Transporte, enquanto o IP é da camada de Rede (internet).",
  "lawRef": "Redes — TCP x UDP na camada de transporte"
 },
 {
  "id": "info-m10-autoral-05",
  "origem": "autoral-ia",
  "q": "Considere os padrões de endereçamento IPv4 e IPv6 usados em redes de computadores. Assinale a alternativa correta sobre o tamanho e a notação dos endereços:",
  "options": [
   "o IPv6 usa 64 bits divididos em seis octetos, o que explica o número 6 do nome",
   "o IPv4 usa 32 bits, em quatro octetos decimais, e o IPv6 usa 128 bits, em grupos hexadecimais",
   "o IPv4 usa 128 bits em grupos hexadecimais, e o IPv6 usa 32 bits em octetos decimais",
   "o IPv4 e o IPv6 usam 32 bits, diferindo apenas na notação com ponto ou dois-pontos",
   "o IPv6 usa 128 bits, mas organizados em quatro octetos decimais como no IPv4"
  ],
  "answer": 1,
  "explanation": "O IPv4 usa endereços de 32 bits, normalmente em quatro octetos decimais separados por ponto, como 192.168.1.10; o IPv6 usa 128 bits, geralmente em grupos hexadecimais separados por dois-pontos. Dizer que o IPv6 tem 64 bits em seis octetos é erro: o número 6 é apenas a versão do protocolo. Também é errado inverter os tamanhos, atribuindo 128 bits ao IPv4 e 32 ao IPv6, ou afirmar que ambos têm 32 bits e mudam só a notação, pois o espaço de endereços do IPv6 é muito maior. Misturar 128 bits com octetos decimais do IPv4 também não faz sentido.",
  "lawRef": "Redes — IPv4 (32 bits) e IPv6 (128 bits)"
 },
 {
  "id": "info-m10-autoral-06",
  "origem": "autoral-ia",
  "q": "Ao conectar um notebook a uma rede, ele recebe automaticamente endereço IP, máscara, gateway e servidor DNS. O protocolo responsável por essa configuração automática é o:",
  "options": [
   "DNS, que resolve nomes de domínio para endereços",
   "DHCP, que distribui automaticamente configurações de rede",
   "NAT, que traduz endereços entre domínios de rede",
   "SMTP, que trata do envio e da transferência de e-mails",
   "SSH, que permite o acesso remoto protegido a equipamentos"
  ],
  "answer": 1,
  "explanation": "O DHCP distribui automaticamente configurações de rede, como endereço IP, máscara, gateway e servidor DNS, a quem se conecta. O DNS apenas resolve nomes de domínio para endereços; ele não entrega configuração ao computador. O NAT traduz endereços entre domínios de rede, como entre uma rede privada e a pública, e não configura o equipamento. O SMTP trata do envio e da transferência de e-mails, e o SSH, do acesso remoto protegido; nenhum dos dois atribui IP. A confusão clássica é DNS x DHCP: nomes de um lado, configuração automática do outro.",
  "lawRef": "Redes — DHCP x DNS x NAT: configuração automática de rede"
 },
 {
  "id": "info-m10-autoral-07",
  "origem": "autoral-ia",
  "q": "Considere as portas padrão e os protocolos de aplicação mais comuns em redes TCP/IP. Assinale a alternativa que apresenta uma afirmação correta:",
  "options": [
   "o HTTP usa a porta 443, e o HTTPS usa a porta 80",
   "o DNS usa exclusivamente a porta 53 sobre TCP, e nunca sobre UDP",
   "o SSH usa a porta 25, e o SMTP usa a porta 22",
   "o HTTPS usa convencionalmente a porta 443 e, com HTTP/3 sobre QUIC, pode operar sobre UDP",
   "as portas padrão são obrigatórias, de modo que nenhum serviço pode operar em outra porta"
  ],
  "answer": 3,
  "explanation": "O HTTPS usa convencionalmente a porta 443 e, com HTTP/3 sobre QUIC, pode operar sobre UDP, de modo que não depende exclusivamente de TCP. As demais alternativas trocam fatos: o HTTP usa a porta 80 e o HTTPS, a 443; o DNS usa a porta 53 tanto em UDP quanto em TCP; o SSH usa a 22 e o SMTP, a 25 (e a 587 na submissão de mensagens). Por fim, portas padrão são convenções e não exigências absolutas, então um serviço pode ser configurado em outra porta.",
  "lawRef": "Redes — portas e protocolos: HTTP 80, HTTPS 443, DNS 53, SSH 22, SMTP 25"
 },
 {
  "id": "info-m10-autoral-08",
  "origem": "autoral-ia",
  "q": "Considere a segurança de redes sem fio e o uso de VPN em redes de computadores. Assinale a alternativa que apresenta uma afirmação correta:",
  "options": [
   "o WEP é a versão mais recente e segura, e por isso substituiu o WPA3",
   "uma VPN torna o usuário automaticamente anônimo para o serviço de destino e dispensa cuidados contra phishing",
   "WPA2 e WPA3 são mecanismos de segurança de redes sem fio, e o WEP é legado e inseguro",
   "uma rede Wi-Fi com nome conhecido é sempre legítima, pois ninguém consegue imitar um SSID",
   "Wi-Fi e internet são sinônimos, pois toda rede sem fio dá acesso direto à rede global"
  ],
  "answer": 2,
  "explanation": "WPA2 e WPA3 são mecanismos de segurança para redes sem fio, enquanto o WEP é legado e inseguro, razão pela qual não deve ser usado. Afirmar que o WEP é o mais recente e seguro inverte a realidade. Uma VPN estabelece conexão protegida, mas não torna o usuário automaticamente anônimo para o serviço de destino nem dispensa cuidados contra malware e phishing. Uma rede com nome familiar pode ser imitada por terceiros, então o SSID não garante legitimidade. E Wi-Fi, baseado em IEEE 802.11, é meio de acesso local; a internet é a rede global de redes, e os dois não são sinônimos.",
  "lawRef": "Redes — segurança Wi-Fi (WPA2, WPA3, WEP) e VPN"
 },
 {
  "id": "info-m10-autoral-09",
  "origem": "autoral-ia",
  "q": "Uma videochamada trava em momentos irregulares, mesmo em conexão de alta largura de banda, porque os pacotes chegam com atrasos que variam muito. Essa variação do atraso é o:",
  "options": [
   "jitter, a variação do atraso na entrega dos pacotes",
   "largura de banda, o volume que a ligação transporta por tempo",
   "latência, o atraso médio na comunicação, e não a sua variação",
   "perda de pacotes, que indica dados não entregues ao destino",
   "máscara de rede, que indica a parte de rede do endereço"
  ],
  "answer": 0,
  "explanation": "A variação do atraso entre os pacotes chama-se jitter, e é ela que causa travamentos em chamadas de voz e vídeo mesmo com boa banda. A largura de banda é o volume que a ligação transporta por tempo, e mais banda não elimina necessariamente alta latência nem jitter. A latência é o atraso na comunicação, e não a sua variação. A perda de pacotes indica dados não entregues, e não atrasos irregulares. A máscara de rede nada tem a ver com desempenho: identifica quantos bits pertencem à parte de rede do endereço.",
  "lawRef": "Redes — desempenho: largura de banda, latência, jitter e perda de pacotes"
 },
 {
  "id": "info-m10-autoral-10",
  "origem": "autoral-ia",
  "q": "Os blocos IPv4 privados típicos são 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16. Entre os endereços a seguir, o único que pertence a um desses blocos é:",
  "options": [
   "172.32.0.10",
   "192.169.1.5",
   "11.10.0.1",
   "8.8.8.8",
   "172.20.4.9"
  ],
  "answer": 4,
  "explanation": "O bloco privado 172.16.0.0/12 vai de 172.16.0.0 a 172.31.255.255, portanto 172.20.4.9 pertence a ele. O endereço 172.32.0.10 fica fora desse intervalo, pois o segundo octeto passa de 31. O 192.169.1.5 está fora de 192.168.0.0/16, que exige 168 no segundo octeto. O 11.10.0.1 está fora de 10.0.0.0/8, pois o primeiro octeto é 11. O 8.8.8.8 é um endereço público (o do DNS público do Google) e é roteado na internet. Endereços privados típicos não são roteados diretamente na internet pública sem mecanismo apropriado, como o NAT.",
  "lawRef": "Redes — endereços IPv4 privados: 10/8, 172.16/12 e 192.168/16"
 }
];
