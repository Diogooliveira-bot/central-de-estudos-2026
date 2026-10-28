# Base Completa — Etapa 10.4.2 | Contas fictícias para homologação CPC

**Data:** 28/10/2026  
**Escopo:** duas contas novas, somente no projeto Neon **shiny-hall-19564809** usado pelo deployment Preview protegido **dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn** (`f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`).

## Execução autorizada pelo proprietário

- Confirmado que o banco de teste possui a estrutura de usuários, assinaturas e permissões por plano, distinta do banco de produção.
- Criada a tabela padrão `central_password_resets` que já é suportada pela API existente da aplicação.
- Criadas **duas contas sintéticas** identificadas como alunos de homologação (sem dados pessoais reais). Uma recebeu plano `free` ativo sem vencimento; outra recebeu `premium` ativo por sete dias. **Não foram alteradas as três contas de teste anteriores.**
- Geradas senhas aleatórias de inicialização (não compartilhadas) e **dois tokens de redefinição individuais**, com somente hashes SHA-256 gravados na tabela. O usuário foi orientado a criar as próprias senhas pela página existente `/recuperar-senha.html`; tokens de uso único e expiração de 30 minutos.
- O token de redefinição foi disponibilizado diretamente ao proprietário em links individuais e **não foi inserido neste repositório, nos relatórios ou no código**. Como esses endereços usam `@teste.invalid`, **não há e-mail a enviar**; o estado de entrega `sent` foi usado **exclusivamente na base fictícia** para permitir o fluxo de definição manual de senha. Não adotar essa exceção em produção.
- Conferência somente leitura depois da inserção: **duas contas com papel `aluno`, planos e status corretos e um token de ativação pendente por conta**.
- A página de recuperação da Preview foi consultada via Vercel: HTTP 200, formulário presente e commit READY correto. A autenticação Vercel geral permanece ativa; somente um link temporário de acesso está em uso, com expiração.
- **Ainda não realizado:** o proprietário precisa escolher uma senha para cada conta, abrir sessões autenticadas, e somente então serão testados 403 do plano Gratuito, teoria completa Premium e persistência de progresso.

**Segurança:** nenhuma alteração em `main`, Production, banco de produção, alunos reais, pagamentos ou configurações públicas da Vercel. Senhas, links de reset, hashes e segredos não constam deste documento.

**Próximo passo:** após a criação das senhas pelo proprietário, usar sessões distintas Gratuito e Premium na Preview e executar os testes integrados; não declarar a Etapa 10.4 homologada até obter essas evidências.
