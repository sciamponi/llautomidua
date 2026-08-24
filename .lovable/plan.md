# Plano de Implementação: Fechamento Sites Operation 2.0 (Fase 5.2)

Finalização da operação de sites com persistência real em banco de dados, motor de notificações operacional e portal do cliente integrado.

## 1. Persistência de Dados e Lógica de Negócio
- **Sites Operation Functions (`src/lib/sites-operation.functions.ts`)**:
  - Implementar lógica real no Prisma para `updateOrderStatus`, garantindo o registro de histórico em `SiteOrderHistory` dentro de uma transação.
  - Finalizar `processApproval` para validar tokens de aprovação via `ApprovalRequest`, expiração e ownership.
  - Implementar `getSiteOrderDetails` para retornar todos os relacionamentos necessários (histórico, versões, notificações, arquivos).
  - Adicionar validações de ownership em todas as funções acessadas pelo cliente.
- **Notificações (`src/lib/notifications.functions.ts`)**:
  - Persistir cada tentativa de envio no banco de dados (`NotificationLog`).
  - Implementar lógica de fallback para o estado `SIMULATED` quando providers reais não estiverem configurados.

## 2. Interface Administrativa (Admin Kanban)
- **Refatoração do Kanban (`src/routes/admin/sites/index.tsx`)**:
  - Substituir o estado local (`useState`) por dados reais do banco usando `useSuspenseQuery`.
  - Implementar persistência imediata do drag-and-drop chamando `updateOrderStatus` no servidor com rollback visual em caso de erro.
  - Adicionar totalizadores dinâmicos (quantidade e valor) por coluna baseados nos dados do banco.
- **OrderModal (`src/components/admin/sites/OrderModal.tsx`)**:
  - Popular as abas `RESUMO`, `DADOS`, `CONTEÚDO`, `ARQUIVOS`, `VERSÕES` e `HISTÓRICO` com dados reais do Prisma.
  - Implementar a listagem de arquivos com suporte a download e visualização.
  - Exibir a timeline real no histórico e o log de comunicações na aba correspondente.

## 3. Portal do Cliente (`/cliente/*`)
- **Visualização Segura**:
  - Refatorar a listagem em `/cliente/sites/index.tsx` para filtrar pedidos pelo `userId` autenticado.
  - Criar a rota de detalhes `/cliente/sites/$orderId.tsx` com timeline de progresso real.
- **Fluxo de Aprovação**:
  - Vincular o token de aprovação à versão específica do site.
  - Garantir que a aprovação ou solicitação de ajustes atualize o status do pedido no Kanban e notifique a equipe.

## 4. Versionamento Imutável
- **Snapshots**: Garantir que cada envio para aprovação (`WAITING_APPROVAL`) gere uma nova entrada em `SiteOrderVersion` com o `contentSnapshot` atual, garantindo que o que o cliente aprovou não mude.

## Detalhes do Usuário (Não Técnico)
Esta atualização remove todos os "dados de exemplo" do sistema:
1. **Histórico Verdadeiro**: Tudo o que for alterado em um projeto ficará gravado para sempre no banco de dados.
2. **Segurança Máxima**: Cada cliente só conseguirá ver os seus próprios projetos e arquivos.
3. **Notificações Operacionais**: O sistema registrará cada mensagem enviada ao cliente, permitindo saber se ele foi notificado.
4. **Painel de Produção**: A equipe terá uma visão exata de quanto dinheiro está em cada etapa da produção através do Kanban.
