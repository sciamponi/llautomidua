# Plano de Implementação — FASE 5.1 — Operação de Produção de Sites

Este plano descreve a transformação do sistema de pedidos de sites em uma operação comercial completa e automatizada, baseada nos requisitos arquiteturais de `VOIDPRO-17.md`.

## 1. Arquitetura de Dados (Prisma)

Atualizar o `schema.prisma` para suportar a operação completa:

- **SiteOrder**: Adicionar campos de controle (`responsibleId`, `priority`, `slaAt`) e refinar o fluxo de status (`SUBMITTED`, `DATA_REVIEW`, `IN_PRODUCTION`, `WAITING_APPROVAL`, `APPROVED`, `PUBLISHED`, `CANCELLED`).
- **SiteOrderVersion**: Tornar imutável. Incluir `version` (int), `previewUrl`, `previewImage`, `notes`, `status` (`DRAFT`, `WAITING_APPROVAL`, `APPROVED`, `REJECTED`, `ARCHIVED`).
- **ApprovalRequest**: Tabela para gerenciar links de aprovação com `tokenHash`, `expiresAt` e `status` (`PENDING`, `APPROVED`, `CHANGES_REQUESTED`).
- **SiteOrderHistory**: Registro obrigatório de todas as transições de status com comentário e autor.
- **InternalNote**: Notas privadas visíveis apenas para equipe interna (admin/operator).
- **NotificationLog**: Registro de todas as comunicações enviadas (WhatsApp/Email) com status de entrega e suporte a retry.

## 2. Motor de Processos (Backend/Functions)

Implementar lógica de negócio em `src/lib/`:

- **sites.functions.ts**:
    - `updateOrderStatus`: Gerenciar transição de status + gravação de histórico + disparo de eventos.
    - `createSiteVersion`: Lógica de criação de novas versões imutáveis.
    - `requestApproval`: Geração de link seguro (token), criação de `ApprovalRequest` e disparo de notificação.
    - `processApproval`: Validação de token/hash e atualização em cascata (Request -> Version -> Order).
- **notifications.functions.ts**:
    - `NotificationEngine`: Sistema agnóstico de canal que processa eventos (`SITE_ORDER_CREATED`, etc).
    - `WhatsAppProvider` & `EmailProvider`: Integrações reais configuradas via env vars.
- **storage.functions.ts**:
    - `StorageProvider`: Camada de abstração para upload de previews (inicialmente filesystem/Local, preparado para R2/S3).

## 3. Dashboard Administrativo (Admin Kanban)

Local: `src/routes/admin/sites/index.tsx`

- **Visual**: Kanban mobile-friendly com colunas: NOVOS, EM ANÁLISE, EM PRODUÇÃO, AGUARDANDO APROVAÇÃO, AJUSTES SOLICITADOS, APROVADOS, PUBLICADOS, CANCELADOS.
- **Funcionalidades**:
    - Filtros avançados: Nicho, Template, Responsável, SLA, Status, Período.
    - Busca global por Empresa, WhatsApp ou Email.
    - Cards com indicadores de SLA (NORMAL, ATENÇÃO, ATRASADO).
- **Modal de Pedido**:
    - Abas: RESUMO, DADOS, CONTEÚDO, ARQUIVOS, PREVIEW, VERSÕES, HISTÓRICO, COMUNICAÇÕES, NOTAS INTERNAS.
    - Ações contextuais baseadas no status atual.

## 4. Portal do Cliente (Aprovação)

Local: `src/routes/sites/aprovacao/$token.tsx`

- **Interface**: Mobile-first, focada em conversão.
- **Exibição**: Dados da empresa, template escolhido, versão atual e preview (iframe ou imagem).
- **Fluxo**:
    - Botão **APROVAR SITE**: Confirmação imediata.
    - Botão **SOLICITAR AJUSTES**: Campo de texto para feedback.
- **Segurança**: Validação rigorosa do hash do token, expiração e integridade da versão/pedido.

## Detalhes Técnicos

- **Segurança**: Hashing de tokens no banco (SHA-256). Proteção de rotas `/admin` via middleware de role.
- **Notificações**: Sistema assíncrono para garantir que falhas na API de WhatsApp não bloqueiem o fluxo do sistema.
- **SLA**: Cálculo baseado em `createdAt` e configuração de `SITE_PRODUCTION_SLA_HOURS`.
- **Idempotência**: Chave única para evitar disparos duplicados de notificações automáticas para o mesmo evento/versão.

## Próximos Passos

1. Executar migração do banco de dados com novos modelos e enums.
2. Implementar `NotificationEngine` e `StorageProvider` stubs.
3. Construir o Kanban e Modal de Detalhes.
4. Desenvolver a página de aprovação pública.
5. Realizar o teste E2E obrigatório (fluxo completo de criação à publicação).
