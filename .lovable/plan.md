# Plan - Fase 6: Master Admin, Auth Real & Arquitetura Multi-Produto

Implementar autenticação real e um sistema de permissões centralizado preparado para o ecossistema multi-produto/multi-tenant da Automatiza Solução, permitindo que usuários possuam múltiplos vínculos (Admin, Parceiro, Cliente) em diferentes produtos ou empresas.

## User Review Required

> [!IMPORTANT]
> - Esta implementação exige Lovable Cloud (PostgreSQL).
> - Utilizaremos sessões persistidas no banco e HttpOnly cookies.
> - A arquitetura será baseada em Scopes (GLOBAL, PRODUCT, COMPANY, PARTNER) para suportar BarberIA, PetFlow, Esmaltter-IA, Oficinas, Media Indoor e novos produtos.
> - O primeiro `MASTER_ADMIN` será criado via função de bootstrap segura.

## Proposed Changes

### 1. Database & Security (Multi-Tenant)
- **Prisma Schema Updates**:
  - **Enum `AuthScope`**: `GLOBAL`, `PRODUCT`, `COMPANY`, `PARTNER`.
  - **Enum `UserRole`**: Expandir para incluir `MASTER_ADMIN`, `ADMIN`, `OPERATOR`, `CUSTOMER`, `PARTNER`.
  - **Model `Company`**: Representar o Tenant (Empresa).
  - **Model `UserRoleMapping`**: Tabela de vínculo entre `User`, `UserRole`, `AuthScope`, `Company` e `Product`. Permite que um usuário tenha múltiplos papéis em diferentes contextos.
  - **Model `Session`**: Incluir `tokenHash`, `expiresAt`, `activeCompanyId`, `activeProductId`.
  - **Model `AuditLog`**: Registro de ações críticas (Login, Alteração de Perfil, Ações Financeiras).
- **Security Middleware**:
  - Implementar middleware do TanStack Start para validar permissões server-side considerando o contexto ativo (Scope/Product/Company).

### 2. Authentication System
- **Backend Logic (`src/lib/auth.functions.ts`)**:
  - Hashing seguro via Web Crypto API (edge-compatible).
  - `login`: Autenticação real e criação de sessão com cookie HttpOnly.
  - `getSession`: Retorna usuário, todos os vínculos (perfis) e permissões agregadas.
  - `switchContext`: Permitir que o usuário troque entre contextos (ex: de Cliente para Parceiro ou entre Empresas).
- **Identidade Única**:
  - Tela de login `/login` unificada seguindo a marca Automatiza.
  - Redirecionamento inteligente baseado no vínculo.

### 3. Centralized Admin & Isolation
- **Master Admin Central (`/admin`)**:
  - Visão GLOBAL da Automatiza.
  - Gestão de todo o ecossistema: Usuários, Empresas, Produtos e Assinaturas.
  - Novo layout de sidebar isolado do site institucional.
- **Zonas de Produto/Tenant**:
  - `/cliente`: Scope COMPANY.
  - `/membros`: Scope PARTNER.
  - `/admin/[produto]`: Scope PRODUCT.
- **Root Layout (`src/routes/__root.tsx`)**:
  - Refatoração para remover Header/Footer públicos de todas as áreas logadas automaticamente.

### 4. System Refinement
- **Bootstrap Tool**: Comando/Função segura para inicializar o `MASTER_ADMIN`.
- **Audit Logging**: Persistência real de logs administrativos.

## Technical Details
- **Sessão**: Hashing SHA-256 dos tokens no banco.
- **Cookies**: `HttpOnly`, `Secure` (prod), `SameSite=Strict`, `Path=/`.
- **Arquitetura**: Preparado para escala horizontal e novos micro-serviços/produtos.

## Steps to Execute
1. Atualizar `prisma/schema.prisma` com a nova arquitetura multi-vínculo.
2. Implementar utilitários de autenticação e criptografia em `src/lib/auth.functions.ts`.
3. Desenvolver a rota `/login` e o layout `/admin` central.
4. Refatorar o Kanban de Sites e Portal do Cliente para utilizar a nova autorização baseada em contextos reais.
5. Implementar o bootstrap do Master Admin inicial.
