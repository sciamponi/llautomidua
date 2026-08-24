# Plano: FASE 7 — CONEXÃO REAL COM VPS / POSTGRESQL (PREPARAÇÃO FINAL)

Este plano estabelece a base definitiva e segura para a operação da Automatiza Solução em produção, garantindo integridade de dados e automação de infraestrutura conforme a **Regra Final de Validação** do `VOIDPRO-69.md`.

## Auditoria de Prontidão

| Componente | Estado Atual | Ação |
| :--- | :--- | :--- |
| **Infraestrutura** | `docker-compose.yml` e `Dockerfile` presentes. | Mapear volume persistente `storage-data:/data/storage`. |
| **Entrypoint** | `docker-entrypoint.sh` aguarda banco. | Atualizar para criar subpastas de storage, garantir permissões e rodar migrations. |
| **Banco / Prisma** | `schema.prisma` configurado. | Gerar baseline de migração para o VPS. |
| **Health Check** | Contrato `200/503` implementado em `src/routes/api/public/health.ts`. | Nenhuma mudança necessária (preservar contrato exato). |
| **Autenticação** | `auth.functions.ts` preparado. | Criar endpoint `src/routes/api/admin/bootstrap.ts` protegido e idempotente. |
| **Mocks** | Fallbacks presentes no preview. | Garantir desativação total em produção quando `DATABASE_URL` estiver presente. |

## Mudanças Propostas

### 1. Infraestrutura e Docker (Persistência e Rede)
- **Rede Interna**: Confirmar que os containers `app` e `db` compartilham a mesma rede e o app usa `db:5432`.
- **Volumes**: Mapear `storage-data:/data/storage` no `docker-compose.yml`.
- **Entrypoint**: Atualizar `docker-entrypoint.sh` para:
    1. Aguardar o banco (usando `nc`).
    2. Criar subpastas: `logos`, `previews`, `uploads`, `documents`, `proofs` em `/data/storage`.
    3. Garantir permissões de escrita.
    4. Executar `npx prisma migrate deploy`.
    5. Iniciar a aplicação.

### 2. Migrations e Prisma (Estabilidade)
- **Baseline**: Preparar a pasta `prisma/migrations` para deploy suave.
- **Produção**: Restringir o uso a `npx prisma migrate deploy`. NUNCA executar `migrate reset` ou `db push` em produção.

### 3. Setup do Master Admin (Bootstrap)
- **Endpoint**: Criar `src/routes/api/admin/bootstrap.ts`.
- **Segurança**: Validar contra `BOOTSTRAP_SECRET`. Bloquear se um `MASTER_ADMIN` já existir.
- **Autenticação**: Configurar sessões persistidas no PostgreSQL com cookies `HttpOnly`, `Secure` (prod) e `SameSite=Lax`.

### 4. Produção Sem Mocks (Garantia de Persistência)
- Leads, Produtos, Pedidos, Demos e Sessões devem persistir obrigatoriamente no PostgreSQL quando `DATABASE_URL` estiver presente e `NODE_ENV=production`.
- Implementar logs de auditoria para ações administrativas.

### 5. Documentação e Scripts
- **DEPLOY-VPS.md**: Guia completo com comandos de instalação, configuração de `.env`, bootstrap, backup (`pg_dump`) e restore.
- **Scripts**: Validar `scripts/backup-db.sh`.

## Protocolo de Validação Pós-Implementação (VOIDPRO-69)
1. Acessar `/api/public/health` e confirmar `database: "ok"`.
2. Executar bootstrap do `MASTER_ADMIN`.
3. Validar `/login` e persistência de sessão.
4. Validar `/admin`.
5. Criar e confirmar persistência de **Lead**, **DemoAccess** e **SiteOrder** no PostgreSQL real.
6. Testar persistência do **Storage** e execução de **Backup/Restore**.

## Critérios de Conclusão
- [ ] Health Check validado (retorna `database: ok` com conexão real).
- [ ] Endpoint de Bootstrap testado e funcional.
- [ ] Login real funcional com persistência em banco.
- [ ] Mocks desativados em produção.
- [ ] Documentação de deploy completa.

**Nota técnica:** Se o ambiente atual não possuir acesso ao VPS, o status final será: *"Preparação concluída. VPS ainda não conectado."*
