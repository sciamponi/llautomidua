# Plano de Implementação: Fase 5 — Operação de Sites Profissionais

Transformar a categoria "Sites" em uma operação comercial completa com catálogo por nichos, pré-visualização, formulário de personalização, pipeline administrativo (Kanban) e notificações automatizadas.

## 1. Arquitetura de Dados (Prisma)

Atualizar o `prisma/schema.prisma` com as novas entidades necessárias para a operação:

- `SiteTemplate`: Catálogo de modelos por nicho (Ar-condicionado, Estética, etc.).
- `SiteOrder`: Pedido de produção vinculado a um usuário, empresa e template.
- `SiteOrderHistory`: Log de auditoria para mudanças de status e comentários.
- `SiteOrderVersion`: Controle de versões de preview enviadas para aprovação.
- `ApprovalRequest`: Registro de feedbacks e aprovações do cliente via link seguro.
- `SiteOrderFile`: Metadados de arquivos enviados (logo, fotos, documentos).

## 2. Catálogo e Navegação (/sites)

- **Landing Page de Sites**: Implementar a nova rota `/sites` com Hero focado em "Presença Digital à Altura".
- **Grid de Cards**: Desenvolver cards premium que mostram preview, nicho, categoria e botões de ação (Ver Site / Quero Essa).
- **Filtros por Segmento**: Barra de filtragem lateral ou superior (Saúde, Beleza, Tecnologia, etc.).
- **Página de Detalhe (/sites/:slug)**: Visão expandida do template com "Como funciona" e "O que você precisa enviar".

## 3. Funil de Customização e Pedido

- **Multi-step Form (/sites/:slug/pedido)**:
  - Etapa 1: Dados da Empresa (Nome, Responsável, Localização).
  - Etapa 2: Dados Comerciais (Serviços, Diferenciais, Público).
  - Etapa 3: Contatos e Horários.
  - Etapa 4: Upload de Conteúdo (Logo, Fotos, Textos).
  - Etapa 5: Revisão e Envio.
- **Sistema de Rascunho**: Persistência local ou no banco para permitir que o cliente termine o preenchimento depois.

## 4. Pipeline Administrativo (/admin/sites)

- **Kanban Pipeline**: Visualização por colunas de status (Novos, Em Produção, Aguardando Aprovação, Publicados).
- **Gestão de Status**: Interface para mover pedidos entre colunas e disparar ações.
- **Modal de Detalhes**: Visualização completa de todos os dados e arquivos enviados pelo cliente.
- **Controle de Versões**: Upload de novas URLs de preview para o cliente aprovar.

## 5. Aprovação e Comunicação

- **Link Seguro de Aprovação (/sites/aprovacao/:token)**: Página pública para o cliente visualizar a versão atual, aprovar ou solicitar ajustes.
- **Notification Layer**: Serviço server-side para envio de notificações via E-mail (SMTP) e WhatsApp (reutilizando integração existente).
- **Automação de Mensagens**: Gatilhos automáticos baseados na mudança de status (ex: "Seu site entrou em produção").

## Detalhes Técnicos

- **Tecnologias**: React 19, TanStack Start (Server Functions), Prisma, Tailwind CSS, Framer Motion (animações Kanban).
- **Segurança**: Tokens aleatórios (UUID/CUID) para links de aprovação; validação de sessão para área administrativa.
- **Uploads**: Armazenamento em Storage (ex: Supabase Storage) com referências no PostgreSQL.
- **Analytics**: Rastreamento de eventos (`template_selected`, `site_order_submitted`) para inteligência comercial.
