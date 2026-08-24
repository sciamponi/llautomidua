# Plano de Implementação — FASE 5.1: Operação de Produção dos Sites

Este plano visa transformar o sistema de pedidos de sites em uma operação completa, com Kanban administrativo, controle de versões, preview para clientes e aprovação formal.

## User Review Required

> [!IMPORTANT]
> A implementação utilizará o `TanStack Start` com `createServerFn` e `Prisma` para persistência real. O sistema de notificações (WhatsApp/Email) será implementado como um provider abstrato, permitindo o reuso da infraestrutura existente de WhatsApp.

- **Filtros do Kanban**: Confirma se os filtros (nicho, template, responsável, SLA) atendem às necessidades iniciais.
- **Segurança**: O link de aprovação utilizará tokens seguros com expiração programada.

## Proposta Técnica

### 1. Banco de Dados e API (Backend)
- **Schema Prisma**: Expandir o schema para incluir `InternalNote`, `NotificationLog`, e atualizar `SiteOrderHistory` e `SiteOrderVersion`.
- **Server Functions**:
    - `getAdminOrders`: Busca pedidos para o Kanban com filtros e paginação.
    - `updateOrderStatus`: Altera status, registra histórico e dispara notificações automáticas.
    - `addInternalNote`: Adiciona comentários privados ao pedido.
    - `createSiteVersion`: Registra uma nova versão de preview (URL/Imagem).
    - `generateApprovalLink`: Cria um token seguro e gera a URL de aprovação.
    - `processClientApproval`: Processa a decisão do cliente (Aprovar/Ajustes).

### 2. Painel Administrativo (`/admin/sites`)
- **Kanban Real**: Colunas: NOVOS, EM ANÁLISE, EM PRODUÇÃO, AGUARDANDO APROVAÇÃO, AJUSTES SOLICITADOS, APROVADOS, PUBLICADOS, CANCELADOS.
- **Cards Dinâmicos**: Indicadores de SLA (Normal, Atenção, Atrasado), nome da empresa, nicho, template e WhatsApp.
- **Modal de Pedido Completo**:
    - **Abas**: Resumo, Dados, Conteúdo, Arquivos, Preview, Histórico, Comunicações.
    - **Ações**: Alteração de status com registro obrigatório de histórico.
    - **Notas Internas**: Feed de comentários para a equipe técnica.

### 3. Sistema de Preview e Aprovação
- **Versionamento**: Controle rigoroso de versões (V1, V2, etc.) sem sobrescrever dados anteriores.
- **Página de Aprovação (`/sites/aprovacao/:token`)**:
    - Responsiva (Mobile First).
    - Visualização da versão atual.
    - Ações diretas: Aprovar ou Solicitar Ajustes (com campo de texto).
- **Segurança**: Validação de `orderId` + `versionId` + `token`.

### 4. Comunicação Automática
- **Notification Engine**: Disparo de mensagens via WhatsApp/Email nos marcos críticos (Pedido Recebido, Aguardando Aprovação, Publicado).
- **Retry System**: Registro de falhas e botão de reenvio manual no painel admin.
- **Provider Abstraction**: Reuso da integração de WhatsApp existente (Automatiza/BarberIA).

## Arquivos a serem criados/modificados

### Novos Arquivos
- `src/routes/admin/sites/index.tsx`: Dashboard e Kanban Admin.
- `src/routes/sites/aprovacao/$token.tsx`: Página de aprovação do cliente.
- `src/lib/admin-sites.functions.ts`: Funções de servidor para administração.
- `src/components/automatiza/admin/KanbanBoard.tsx`: Componente de visualização do Kanban.
- `src/components/automatiza/admin/OrderModal.tsx`: Modal detalhado do pedido.

### Arquivos Modificados
- `prisma/schema.prisma`: Adição de modelos `InternalNote` e logs de notificação.
- `src/lib/sites.functions.ts`: Inclusão de funções para o lado do cliente (aprovação).
- `src/lib/leads.functions.ts`: Atualização para vincular leads de sites aos novos modelos.
- `src/routes/sites/$templateSlug/pedido.tsx`: Integração final com o sistema de pedidos real.
