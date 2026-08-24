# Plano de Implementação: Fechamento da Fase 5.2 — Sites Operation 2.0

Finalização e validação do fluxo ponta a ponta da operação de sites, garantindo persistência no banco de dados, completude do painel administrativo e do portal do cliente, e robustez no sistema de versionamento e notificações.

## Mudanças Técnicas

### 1. Persistência de Dados (Prisma & Server Functions)
- **Implementação Completa**: Finalizar as server functions em `src/lib/sites-operation.functions.ts` e `src/lib/notifications.functions.ts`, removendo códigos comentados e integrando totalmente com o Prisma.
- **Validação de Ownership**: Adicionar verificações de segurança para garantir que clientes acessem apenas seus próprios projetos.
- **Fluxo de Status**: Refinar `updateOrderStatus` para registrar automaticamente no `SiteOrderHistory` e disparar notificações baseadas nas transições.

### 2. Painel Admin: Kanban e Modal de Pedido
- **Refatoração do Kanban**: Atualizar `src/routes/admin/sites/index.tsx` para substituir o estado local por `useSuspenseQuery`, garantindo sincronia com o banco.
- **OrderModal (Fase Final)**:
    - Implementar abas `DADOS`, `CONTEUDO`, `ARQUIVOS`, `PREVIEW`, `VERSOES` e `HISTORICO` com dados reais.
    - Adicionar empty states claros onde não houver dados.
    - Implementar prévia de notificações e disparador manual (SIMULATED/SENT).

### 3. Portal do Cliente
- **Dashboard Real**: Atualizar `/cliente/sites/index.tsx` para listar projetos reais do usuário logado.
- **Nova Rota de Detalhes**: Criar `/cliente/sites/$orderId.tsx` para visualização detalhada, timeline de progresso e acesso rápido a aprovações/pagamentos.
- **Melhoria UX**: Garantir que o `ClientHeader` e o layout isolado funcionem corretamente em dispositivos móveis.

### 4. Versionamento e Publicação
- **Snapshots Imutáveis**: Garantir que `createImmutableVersion` seja invocado em marcos críticos (ex: envio para aprovação).
- **Controle de Versão**: Exibir o histórico de versões no admin e permitir que o cliente veja qual versão está revisando.

### 5. Motor de Notificações
- **Logs de Notificação**: Implementar gravação em `NotificationLog` para todos os disparos (WhatsApp/Email).
- **Status da Notificação**: Gerenciar estados `SIMULATED`, `SENT` e `FAILED` corretamente.

## Detalhes do Usuário (Não Técnico)
Esta etapa garante que todo o sistema de criação de sites funcione de forma profissional e segura.
1. O administrador terá controle total sobre cada etapa da produção, com histórico completo e gestão de arquivos.
2. O cliente terá um portal exclusivo onde poderá acompanhar o progresso em tempo real, ver prévias do site e realizar aprovações ou pagamentos com poucos cliques.
3. Todas as comunicações (e-mail/WhatsApp) serão registradas, evitando falhas de entendimento e garantindo prazos (SLA).
