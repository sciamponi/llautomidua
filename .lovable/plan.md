# Plano: FASE 7 — CONEXÃO REAL COM VPS / POSTGRESQL (VERSÃO SEGURA)

Este plano estabelece a base definitiva e segura para a operação da Automatiza Solução em produção, garantindo integridade de dados, segurança de segredos e automação de infraestrutura conforme os requisitos do `VOIDPRO-66.md`.

## Auditoria de Prontidão

| Componente | Estado Atual | Ação |
| :--- | :--- | :--- |
| **Infraestrutura** | `docker-compose.yml` e `Dockerfile` presentes. | Mapear volume persistente `storage-data:/data/storage`. |
| **Entrypoint** | `docker-entrypoint.sh` aguarda banco. | Adicionar criação automática de subpastas de storage e permissões. |
| **Banco / Prisma** | `schema.prisma` configurado. | Gerar baseline de migração para o VPS. |
| **Health Check** | Contrato `200/503` implementado. | Nenhuma mudança necessária (preservar contrato). |
| **Autenticação** | `auth.functions.ts` preparado. | Implementar bootstrap idempotente em `/api/admin/bootstrap`. |
| **Mocks** | Fallbacks implementados no preview. | Garantir desativação total quando `DATABASE_URL` estiver presente em prod. |

## Mudanças Propostas

### 1. Infraestrutura e Docker (Segurança)
- **Volumes**: Mapear `storage-data:/data/storage` no `docker-compose.yml` para persistência real.
- **Entrypoint**: Atualizar `docker-entrypoint.sh` para:
    1. Aguardar o PostgreSQL estar disponível via `nc`.
    2. Criar subpastas: `logos`, `previews`, `uploads`, `documents`, `proofs`.
    3. Garantir permissões de leitura/escrita em `/data/storage`.
    4. Executar `npx prisma migrate deploy`.
- **Rede**: Garantir que o app acesse o banco via hostname interno `db` e que o banco não esteja exposto publicamente.

### 2. Migrations e Prisma (Estabilidade)
- **Baseline**: Preparar a pasta `prisma/migrations` para que o deploy no VPS seja suave, sem tentativas de recriação destrutiva.
- **Produção**: Reforçar o uso exclusivo de `npx prisma migrate deploy`. Desativar explicitamente qualquer lógica de `prisma db push` ou `migrate reset`.

### 3. Setup do Master Admin (Bootstrap)
- **Endpoint**: Criar `src/routes/api/admin/bootstrap.ts` (idempotente).
- **Segurança**: Validar contra `BOOTSTRAP_SECRET`. O endpoint deve falhar se um `MASTER_ADMIN` já existir.
- **Autenticação**: Configurar cookies de sessão persistidos no banco (PostgreSQL) com flags `HttpOnly`, `Secure` (prod) e `SameSite=Lax`.

### 4. Persistência Comercial
- **Mocks**: Remover dependências de mock para Leads, Produtos, Pedidos e Demos quando o banco estiver configurado.
- **Auditoria**: Garantir que `AuditLog` e `NotificationLog` persistam no PostgreSQL real.

### 5. Documentação e Backup
- **DEPLOY-VPS.md**: Atualizar com os passos exatos para conexão no servidor, comandos de bootstrap e guia de restore.
- **Scripts**: Validar `scripts/backup-db.sh` para garantir uso de `pg_dump` e armazenamento fora do volume do banco.

## Critérios de Conclusão
- [ ] Health Check validado (retorna `database: ok` com banco real).
- [ ] Bootstrap do Master Admin testado e funcional.
- [ ] Login real funcional com persistência em PostgreSQL e cookies HttpOnly.
- [ ] Subpastas de storage criadas automaticamente no startup.
- [ ] Mocks desativados em ambiente de produção com banco conectado.
- [ ] Guia de deploy atualizado com comandos necessários para o servidor.
