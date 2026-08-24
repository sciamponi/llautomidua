# Plano: FASE 7 — CONEXÃO REAL COM VPS / POSTGRESQL (APROVAÇÃO FINAL)

Este plano estabelece a base definitiva para a operação da Automatiza Solução em produção, garantindo integridade de dados, segurança de segredos e automação de infraestrutura conforme os requisitos do `VOIDPRO-64.md`.

## Auditoria de Prontidão

| Componente | Estado Atual | Ação |
| :--- | :--- | :--- |
| **Banco de Dados** | `schema.prisma` pronto para PostgreSQL. | Gerar baseline de migração para o VPS. |
| **Infraestrutura** | `Dockerfile` e `docker-compose.yml` isolam o banco. | Mapear volumes persistentes para `/data/storage`. |
| **Health Check** | Contrato `200/503` implementado em `src/routes/api/public/health.ts`. | Validar contra conexão real. |
| **Autenticação** | `auth.functions.ts` preparado. | Implementar endpoint de bootstrap seguro. |
| **Backups** | `scripts/backup-db.sh` criado com `pg_dump`. | Documentar processo em `DEPLOY-VPS.md`. |
| **Storage** | `LocalStorageProvider` implementado. | Garantir criação automática de subpastas no entrypoint. |

## Mudanças Propostas

### 1. Infraestrutura e Persistência (Docker)
- **Volumes**: Mapear `storage-data:/data/storage` no `docker-compose.yml`.
- **Entrypoint**: Atualizar `docker-entrypoint.sh` para criar as pastas obrigatórias (`logos`, `previews`, `uploads`, `documents`, `proofs`) e garantir permissões de escrita antes de iniciar a app.
- **Rede**: Confirmar que `DATABASE_URL` utiliza `db:5432` para comunicação interna segura.

### 2. Migrations e Dados (Prisma)
- **Baseline de Produção**: Gerar arquivos de migração iniciais para que o `npx prisma migrate deploy` funcione no VPS sem tentar recriar tabelas existentes (se houver).
- **Proteção de Dados**: Reforçar em toda a lógica server-side que o `DATABASE_URL` é a única fonte da verdade em produção, desativando mocks completamente.

### 3. Setup do Master Admin (Bootstrap)
- **Endpoint Seguro**: Criar `src/routes/api/public/bootstrap.ts` que chama a função `bootstrapMaster` interna.
- **Segurança**: Validar contra `BOOTSTRAP_SECRET` e garantir que a operação seja idempotente (falha se já existir um Master).
- **Hash de Senha**: Utilizar `PBKDF2` (já implementado) para armazenamento seguro.

### 4. Autenticação e Sessões
- **Cookies**: Configurar cookies de sessão como `HttpOnly`, `Secure` (em prod), `SameSite=Lax`.
- **Persistência**: Garantir que as sessões sejam gravadas na tabela `Session` do PostgreSQL.

### 5. Documentação de Operação
- **DEPLOY-VPS.md**: Atualizar com os passos exatos de bootstrap, backup e restauração.
- **Scripts**: Validar o script de backup para garantir que os arquivos SQL não fiquem presos no volume do banco.

## Critérios de Conclusão
- [ ] Health Check validado (retorna `database: ok` com banco real).
- [ ] Bootstrap do Master Admin testado e funcional.
- [ ] Login real funcional com persistência em PostgreSQL e cookies HttpOnly.
- [ ] Pastas de storage criadas automaticamente com permissões corretas.
- [ ] Documentação de deploy completa e sem segredos expostos.
