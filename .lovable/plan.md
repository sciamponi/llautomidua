# Plano de Implementação: Fechamento Sites Operation 2.0 (Fase 5.2)

Finalização do fluxo ponta a ponta da operação de sites com persistência real em banco de dados, validação de segurança (ownership) e interface administrativa/cliente completa.

## 1. Persistência e Backend (Server Functions)

### A. Sites Operation Functions (`src/lib/sites-operation.functions.ts`)
- **Implementação Real**: Substituir todos os `console.log` e comentários "In production" por chamadas reais ao Prisma.
- **updateOrderStatus**:
  - Validar permissão do ator.
  - Atualizar `status` e `responsibleUserId` na tabela `SiteOrder`.
  - Criar entrada em `SiteOrderHistory` registrando o status anterior, o novo status, o ator e qualquer comentário.
  - Integrar disparo de notificações automáticas via `sendNotification` baseado na transição.
- **processApproval**:
  - Validar token, expiração e status da solicitação.
  - Atualizar `SiteOrder` e criar histórico de aprovação ou solicitação de ajustes.
- **getSiteOrderDetails**: Retornar dados reais do banco, incluindo histórico, versões, pagamentos e notificações.

### B. Motor de Notificações (`src/lib/notifications.functions.ts`)
- **Persistência**: Gravar cada tentativa de envio em `NotificationLog`.
- **Status Handling**: Gerenciar corretamente os estados `SIMULATED`, `SENT` e `FAILED`.

## 2. Interface Administrativa (Kanban & Modal)

### A. Kanban (`src/routes/admin/sites/index.tsx`)
- **Data Fetching**: Substituir o `useState` de pedidos por dados reais persistidos (via `useQuery` / `useSuspenseQuery`).
- **Drag-and-Drop**: Persistir a mudança de coluna chamando `updateOrderStatus` imediatamente e tratar erros com rollback visual.
- **Totalizadores**: Refletir os valores reais do banco no resumo financeiro superior.

### B. OrderModal (`src/components/admin/sites/OrderModal.tsx`)
- **DADOS/CONTEÚDO**: Exibir campos reais do banco (Instagram, Segmento, Diferenciais, etc.).
- **HISTÓRICO**: Renderizar a linha do tempo real vinda da tabela `SiteOrderHistory`.
- **COMUNICAÇÕES**: Listar logs de `NotificationLog` e permitir disparo manual com preview.
- **VERSÕES**: Listar snapshots imutáveis e permitir visualização.

## 3. Portal do Cliente (`/cliente/*`)

### A. Dashboard e Detalhes
- **Listagem Segura**: Filtrar `SiteOrder` pelo `userId` do cliente autenticado.
- **Timeline de Progresso**: Criar componente visual que reflete o `status` atual e o histórico público.
- **Ownership**: Garantir que o `orderId` na URL pertence ao usuário da sessão em todas as server functions do portal.

### B. Fluxo de Aprovação
- **Solicitação de Ajustes**: Exigir comentário e salvar no banco como `SiteOrderHistory` com tipo específico.

## 4. Segurança

- **Middleware**: Aplicar validação de sessão em todas as funções de escrita e leitura de dados sensíveis.
- **Asset Access**: Validar que o `orderId` associado ao arquivo pertence ao solicitante.

## Detalhes do Usuário (Não Técnico)
Esta atualização transforma o sistema de "protótipo" em uma ferramenta de operação real:
1. **Nada se perde**: Todas as mudanças de status, aprovações e conversas ficam gravadas para sempre no histórico do projeto.
2. **Segurança**: Seus dados e os dados de seus clientes estão protegidos; um cliente nunca verá o projeto de outro.
3. **Automação**: O sistema enviará avisos automáticos (WhatsApp/E-mail) em cada etapa importante, mantendo todos informados sem esforço manual.
4. **Transparência**: O cliente vê exatamente em que fase o site está (Produção, Revisão, etc.) através do portal exclusivo.
