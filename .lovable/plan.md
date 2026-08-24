# Plano de Implementação — FASE 5.1: Operação de Produção dos Sites (Revisado)

Este plano detalha a implementação da operação técnica de sites, incluindo Kanban administrativo, versionamento e aprovação pelo cliente.

## Proposta Técnica

### 1. Banco de Dados (Prisma)
- **Modelos**:
    - `InternalNote`: Comentários privados entre a equipe.
    - `NotificationLog`: Rastro de comunicações (Email/WhatsApp).
    - `SiteOrderStatus`: Adicionar `SUBMITTED`, `DATA_REVIEW`, `IN_PRODUCTION`, `WAITING_APPROVAL`, `CHANGES_REQUESTED`, `APPROVED`, `PUBLISHED`, `CANCELLED`.
- **Relacionamentos**: Garantir que `SiteOrder` tenha acesso total ao histórico, versões e notas.

### 2. Lógica de Servidor (`src/lib/admin-sites.functions.ts`)
- **Gestão de Pedidos**: `getAdminOrders` (filtros e paginação), `updateOrderStatus` (com histórico).
- **Produção**: `addInternalNote`, `createSiteVersion` (upload de preview).
- **Aprovação**: `generateApprovalLink` (token seguro), `processClientApproval` (log de feedback).

### 3. Painel Administrativo (`/admin/sites`)
- **Kanban Interativo**: Colunas baseadas no `SiteOrderStatus`.
- **Card de Produção**: Prioridade (SLA), nicho, template e dados de contato.
- **Modal de Gestão**: Centralização de dados, arquivos enviados, histórico de versões e notas internas.

### 4. Experiência do Cliente (`/sites/aprovacao/:token`)
- **Interface de Aprovação**: Visualização do preview (URL/Imagem) e botões de decisão.
- **Solicitação de Ajustes**: Fluxo simplificado para o cliente descrever o que precisa mudar, gerando automaticamente uma tarefa no Kanban.

### 5. Comunicações
- **Notification Provider**: Abstração para envio de mensagens, aproveitando a conexão de WhatsApp já existente no projeto.
- **Histórico**: Registro detalhado de cada tentativa de contato na aba "Comunicações" do pedido.

## Próximos Passos
1. Atualizar o schema Prisma e rodar as migrações.
2. Criar as `createServerFn` para a lógica administrativa.
3. Desenvolver os componentes de UI para o Kanban e Modal.
4. Implementar a página de aprovação do cliente com segurança por token.
