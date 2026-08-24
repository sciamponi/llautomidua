# Plano de Implementação: Fechamento Sites Operation 2.0 (Fase 5.2)

Finalização da operação de sites com persistência real no Prisma, motor de notificações operacional, Kanban administrativo seguro e Portal do Cliente funcional.

## 1. Persistência e Backend (Prisma)
- **Sites Operation Functions (`src/lib/sites-operation.functions.ts`)**:
  - Implementar lógica real no Prisma para `updateOrderStatus`, garantindo o registro de histórico em `SiteOrderHistory` e disparo de notificações.
  - Finalizar `processApproval` para validar tokens de `ApprovalRequest`, expiração e ownership.
  - Implementar `getSiteOrderDetails` para retornar todos os relacionamentos (histórico, versões, notificações, arquivos, pagamentos).
  - **Segurança**: Aplicar validação de ownership server-side em todas as funções (Cliente A nunca acessa Cliente B).
- **Notificações (`src/lib/notifications.functions.ts`)**:
  - Persistir cada tentativa de envio em `NotificationLog` com estados `SIMULATED`, `SENT` ou `FAILED`.
  - Garantir fallback para `SIMULATED` quando providers reais não estiverem configurados.

## 2. Interface Administrativa (Kanban & Operação)
- **Kanban Real (`src/routes/admin/sites/index.tsx`)**:
  - Substituir `useState` por `useSuspenseQuery` para dados do banco.
  - Implementar drag-and-drop persistente com rollback visual em caso de erro.
  - **Financeiro**: Exibir totalizadores por coluna. Adicionar controle "MOSTRAR/OCULTAR VALORES" e restringir visibilidade por permissão de usuário.
- **OrderModal Completo (`src/components/admin/sites/OrderModal.tsx`)**:
  - Popular abas `RESUMO`, `DADOS`, `CONTEÚDO`, `ARQUIVOS`, `VERSÕES`, `HISTÓRICO` e `COMUNICAÇÕES` com dados reais.
  - **Arquivos**: Listar, permitir visualizar e baixar, com validação de permissão.
  - **Comunicações**: Preview de mensagem antes do disparo manual e logs de envio.

## 3. Portal do Cliente & Aprovação
- **Área do Cliente (`/cliente/*`)**:
  - Refatorar listagem para filtrar pedidos por `userId`.
  - Criar rota de detalhes `/cliente/sites/$orderId` com timeline de progresso real baseada no histórico do banco.
- **Fluxo de Aprovação**:
  - Implementar aprovação ou solicitação de ajustes (com comentário obrigatório).
  - Atualizar status para `CHANGES_REQUESTED` ou `APPROVED` e notificar a equipe.

## 4. Versionamento Imutável
- **Snapshots Imutáveis**: Toda vez que uma versão for enviada para aprovação, criar um `SiteOrderVersion` com `contentSnapshot`. Uma vez enviada, a versão é imutável. Alterações subsequentes devem gerar uma nova versão (V2, V3, etc.).

## Detalhes do Usuário (Não Técnico)
Esta atualização transforma o sistema em uma ferramenta de produção real:
1. **Histórico Completo**: Cada mudança de status ou mensagem enviada fica gravada no banco de dados.
2. **Segurança de Dados**: O portal do cliente é totalmente isolado e seguro.
3. **Controle Financeiro**: O Kanban agora mostra o valor total da produção, com opção de ocultar valores sensíveis.
4. **Provas de Produção**: O versionamento garante que o que o cliente aprova é exatamente o que será publicado, sem alterações acidentais.
