# Plano: FASE 7 — CONEXÃO REAL COM VPS / POSTGRESQL (EXECUÇÃO FINAL)

Este plano estabelece a base definitiva e segura para a operação da Automatiza Solução em produção, garantindo integridade de dados, segurança de segredos e automação de infraestrutura conforme os requisitos do `VOIDPRO-67.md`.

## Auditoria de Prontidão

| Componente | Estado Atual | Ação |
| :--- | :--- | :--- |
| **Infraestrutura** | `docker-compose.yml` e `Dockerfile` presentes. | Mapear volume persistente `storage-data:/data/storage`. |
| **Entrypoint** | `docker-entrypoint.sh` aguarda banco via `nc`. | Atualizar para criar subpastas de storage, garantir permissões e rodar migrations. |
| **Banco / Prisma** | `schema.prisma` configurado. | Gerar baseline de migração para o VPS. |
| **Health Check** | Contrato `200/503` implementado em `src/routes/api/public/health.ts`. | Nenhuma mudança necessária (preservar contrato exato). |
| **Autenticação** | `auth.functions.ts` preparado. | Criar endpoint `src/routes/api/admin/bootstrap.ts` protegido e idempotente. |
| **Mocks** | Fallbacks presentes no preview. | Garantir desativação total em produção quando `DATABASE_URL` estiver presente. |
| **Storage** | `LocalStorageProvider` implementado. | Garantir criação das pastas `logos`, `previews`, `uploads`, `documents`, `proofs` no entrypoint. |

## Mudanças Propostas

### 1. Infraestrutura e Docker (Persistência e Rede)
- **Rede Interna**: Garantir que o container `app` e `db` compartilham a mesma rede e o app usa `db:5432`.
- **Volumes**: Mapear `storage-data:/data/storage` no `docker-compose.yml`.
- **Entrypoint**: Atualizar `docker-entrypoint.sh` para:
    1. Aguardar o banco (usando `nc` ou instalando `postgresql-client` para `pg_isready`).
    2. Criar subpastas: `logos`, `previews`, `uploads`, `documents`, `proofs`.
    3. Garantir permissões de escrita em `/data/storage`.
    4. Executar `npx prisma migrate deploy`.
    5. Iniciar a aplicação.

### 2. Migrations e Prisma (Estabilidade)
- **Baseline**: Gerar os arquivos de migração necessários para o deploy suave no VPS.
- **Produção**: Restringir o uso a `npx prisma migrate deploy`. NUNCA executar `migrate reset` ou `db push` em produção.

### 3. Setup do Master Admin (Bootstrap)
- **Endpoint**: Criar `src/routes/api/admin/bootstrap.ts`.
- **Segurança**: Validar contra `BOOTSTRAP_SECRET`. Bloquear se um `MASTER_ADMIN` já existir.
- **Autenticação**: Configurar sessões persistidas no PostgreSQL com cookies `HttpOnly`, `Secure` (prod) e `SameSite=Lax`.

### 4. Persistência e Auditoria
- **Desativação de Mocks**: Leads, Produtos, Pedidos, Demos e Sessões devem persistir obrigatoriamente no PostgreSQL em produção.
- **AuditLog**: Garantir que todas as ações administrativas relevantes sejam registradas no banco.

### 5. Documentação e Backup
- **DEPLOY-VPS.md**: Atualizar com os comandos exatos de bootstrap, backup (`pg_dump`) e restore.
- **Segurança**: Garantir que nenhum segredo (JWT, API keys) vaze para o frontend.

## Critérios de Conclusão
- [ ] Health Check validado (retorna `database: ok` com conexão real).
- [ ] Endpoint de Bootstrap testado e idempotente.
- [ ] Login real funcional com persistência em banco e cookies seguros.
- [ ] Subpastas de storage criadas automaticamente com permissões corretas.
- [ ] Mocks desativados em produção com banco conectado.
- [ ] Documentação de deploy completa com instruções de backup/restore.
- [ ] Guia de comandos finais para o VPS fornecido.
