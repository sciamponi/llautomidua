# Plano: FASE 7 — CONEXÃO REAL COM VPS / POSTGRESQL (APROVAÇÃO FINAL)

Este plano estabelece a base definitiva para a operação da Automatiza Solução em produção, garantindo integridade de dados, segurança de segredos e automação de infraestrutura.

## Auditoria de Prontidão

| Componente | Estado Atual | Ação |
| :--- | :--- | :--- |
| **Banco de Dados** | `schema.prisma` pronto para PostgreSQL. | Gerar baseline de migração para o VPS. |
| **Infraestrutura** | `Dockerfile` e `docker-compose.yml` isolam o banco. | Mapear volumes persistentes para `/data/storage`. |
| **Health Check** | Contrato `200/503` implementado e testado. | Nenhuma mudança necessária. |
| **Autenticação** | `auth.functions.ts` preparado para PostgreSQL + Cookies. | Implementar bootstrap seguro do Master Admin. |
| **Backups** | `scripts/backup-db.sh` criado com `pg_dump`. | Documentar processo de restauração em `DEPLOY-VPS.md`. |

## Mudanças Propostas

### 1. Migrations e Dados
- **Baseline de Produção**: Criação da pasta `prisma/migrations` com o estado atual do schema para garantir que o `npx prisma migrate deploy` funcione no VPS sem apagar dados (baselining).
- **Fallbacks Seguros**: Garantir que todas as capturas comerciais (Leads, Pedidos, Demos) verifiquem `DATABASE_URL` e usem o banco real obrigatoriamente em produção.

### 2. Autenticação e Master Admin
- **Bootstrap Idempotente**: Implementação de uma rota/função `bootstrap` que cria o primeiro `MASTER_ADMIN` usando `MASTER_ADMIN_EMAIL` e `MASTER_ADMIN_PASSWORD` do `.env`.
- **Proteção de Segredos**: Garantir que segredos como `JWT_SECRET` e `BOOTSTRAP_SECRET` nunca vazem para o cliente.

### 3. Persistência de Arquivos (Storage)
- Garantir que o container tenha permissões de escrita em `/data/storage`.
- Subdividir o volume em `logos`, `previews`, `uploads`, `documents` e `proofs` automaticamente no startup.

## Guia de Deploy VPS (Atualizado)
1. **Configuração**: Clonar e criar `.env` (ex: `JWT_SECRET=$(openssl rand -base64 32)`).
2. **Infra**: `docker compose up -d` (o entrypoint aguarda o banco e aplica migrations).
3. **Setup**: Executar o bootstrap do Master Admin via CLI ou rota protegida.
4. **Validação**: Acessar `/api/public/health` para confirmar status `database: "ok"`.

## Critérios de Conclusão
- [ ] Mocks desativados quando `DATABASE_URL` está presente.
- [ ] Health Check validado contra conexão real.
- [ ] Login real funcional com persistência em PostgreSQL.
- [ ] `DEPLOY-VPS.md` completo com instruções de backup/restore.
- [ ] `/data/storage` persistente e mapeado corretamente.
