# Plano de Implementação: Fechamento Sites Operation 2.0 (Fase 5.2)

Finalização da operação de sites com persistência real em banco de dados, motor de notificações operacional e portal do cliente integrado.

## 1. Persistência de Dados e Lógica de Negócio
- **Sites Operation Functions (`src/lib/sites-operation.functions.ts`)**:
  - Implementar lógica real no Prisma para `updateOrderStatus`, garantindo o registro de histórico em `SiteOrderHistory`.
  - Finalizar `processApproval` para validar tokens de aprovação, expiração e ownership.
  - Implementar `getSiteOrderDetails` para retornar todos os relacionamentos necessários (histórico, versões, notificações).
- **Notificações (`src/lib/notifications.functions.ts`)**:
  - Persistir cada disparo no banco de dados (`NotificationLog`).
  - Implementar lógica de fallback para o estado `SIMULATED` quando providers reais não estiverem configurados.

## 2. Interface Administrativa (Admin Kanban)
- **Refatoração do Kanban (`src/routes/admin/sites/index.tsx`)**:
  - Substituir o estado local (`useState`) por dados reais do banco (via queries do TanStack).
  - Persistir o drag-and-drop chamando `updateOrderStatus` no servidor.
  - Adicionar totalizadores dinâmicos (quantidade e valor) por coluna.
- **OrderModal (`src/components/admin/sites/OrderModal.tsx`)**:
  - Completar as abas `RESUMO`, `DADOS`, `CONTEÚDO`, `ARQUIVOS`, `VERSÕES` e `HISTÓRICO` com dados persistidos.
  - Implementar prévia de mensagens antes do disparo manual na aba `COMUNICAÇÕES`.

## 3. Portal do Cliente (`/cliente/*`)
- **Visualização Segura**:
  - Validar ownership em todas as requisições para que um cliente não acesse dados de outro.
  - Renderizar a timeline de progresso real baseada no histórico do banco.
- **Fluxo de Aprovação**:
  - Integrar a tela de aprovação com a lógica de versionamento imutável.
  - Redirecionar para o fluxo de pagamento pós-aprovação se configurado (`requirePaymentBeforePublish`).

## 4. Versionamento Imutável
- **Snapshots**: Garantir que cada envio para aprovação ou publicação gere uma nova entrada em `SiteOrderVersion` com o `contentSnapshot` daquele momento.

## Detalhes do Usuário (Não Técnico)
Esta atualização remove todos os "dados de simulação" do sistema:
1. **Histórico Real**: Tudo o que acontecer com um projeto (mudança de status, arquivos enviados, mensagens) ficará gravado no banco de dados.
2. **Portal Seguro**: O cliente terá uma área exclusiva e protegida para acompanhar seu site, dar feedbacks e aprovar o projeto.
3. **Notificações Inteligentes**: O sistema enviará alertas automáticos (WhatsApp/E-mail) em cada etapa importante da produção.
4. **Kanban Operacional**: A equipe administrativa terá um painel que reflete a realidade da produção, com totalizadores financeiros automáticos.
