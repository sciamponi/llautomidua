# Plano: FASE 7 — CONEXÃO REAL COM VPS / POSTGRESQL (VERSÃO FINAL)

Este plano detalha a preparação definitiva para a transição da Automatiza Solução do ambiente de preview para um VPS real com PostgreSQL 16 e Docker.

## 1. Auditoria de Infraestrutura
- **Prisma**: O schema já está preparado para PostgreSQL. A baseline de migração foi inicializada.
- **Docker**: `Dockerfile` utiliza `node:22-alpine` com `docker-entrypoint.sh` para migrações automáticas. `docker-compose.yml` isola o banco em uma rede interna.
- **Health Check**: `/api/public/health` está pronto para produção, retornando `503` se a conexão com o banco falhar.
- **Storage**: O sistema utiliza `LocalStorageProvider` apontando para `/data/storage`, pronto para volumes persistentes no Docker.

## 2. Estratégia de Banco de Dados
- **Zero Downtime/Loss**: Utilizaremos `prisma migrate deploy` no deploy inicial e atualizações. O comando `migrate reset` está proibido em produção.
- **Baseline**: Caso o banco no VPS já contenha dados, a primeira migration será marcada como aplicada manualmente (`prisma migrate resolve`) para evitar conflitos.
- **Backup**: Criado o script `scripts/backup-db.sh` que realiza `pg_dump` e compressão `gzip`.

## 3. Autenticação e Master Admin
- **Bootstrap Seguro**: O sistema usará as variáveis `MASTER_ADMIN_EMAIL` e `MASTER_ADMIN_PASSWORD` para criar o primeiro usuário de acesso global.
- **Sessões Reais**: Substituição total de qualquer lógica de `localStorage` para autenticação por Cookies `HttpOnly` com persistência no PostgreSQL.

## 4. Implementação Técnica

### A. Refatoração de Servidor
- Ajustar `src/lib/auth.functions.ts` para garantir que `bootstrapMaster` possa ser chamado via CLI ou rota protegida por `BOOTSTRAP_SECRET`.
- Garantir que todas as funções de captura (Leads, Pedidos, Demos) falhem graciosamente se o banco estiver fora, registrando erros nos logs de servidor.

### B. Persistência de Storage
- Verificar se o `docker-compose.yml` mapeia corretamente o volume `storage-data` para o container.
- Confirmar permissões de escrita em `/data/storage` dentro do `Dockerfile`.

## 5. Guia de Deploy VPS (Resumo)
1. Clonar repositório.
2. Criar `.env` baseado no `.env.example`.
3. `docker compose build`
4. `docker compose up -d`
5. Validar via `curl http://localhost:8080/api/public/health`.
6. Executar o bootstrap do Master Admin.

## Critérios de Conclusão
- [ ] Schema sincronizado entre código e banco real.
- [ ] Health Check retornando `database: "ok"`.
- [ ] Login persistente funcionando com PostgreSQL.
- [ ] Backup funcional e documentado em `DEPLOY-VPS.md`.
- [ ] Mocks desativados automaticamente na presença de `DATABASE_URL`.
