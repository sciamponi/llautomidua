# Guia de Deploy VPS - Automatiza Solução

Este documento descreve o processo de implantação da aplicação em um servidor próprio (VPS).

## 1. Requisitos do Sistema
- Docker e Docker Compose instalados.
- Nginx ou Caddy para Proxy Reverso e SSL (HTTPS).
- Mínimo de 2GB RAM recomendado.

## 2. Preparação do Ambiente
1. Clone o repositório no VPS.
2. Crie o arquivo `.env` na raiz do projeto baseado no `.env.example`.
3. Configure as variáveis obrigatórias:
   - `DATABASE_URL`: `postgresql://user:password@db:5432/automatiza?schema=public`
   - `JWT_SECRET`: Gere uma string aleatória longa.
   - `BOOTSTRAP_SECRET`: Gere uma string segura para o setup inicial.
   - `MASTER_ADMIN_EMAIL` / `MASTER_ADMIN_PASSWORD`: Credenciais do primeiro acesso.

## 3. Deployment via Docker
```bash
# Build das imagens
docker compose build

# Iniciar os containers em background
docker compose up -d

# Verificar status
docker compose ps
docker compose logs -f app
```

## 4. Banco de Dados e Migrations
O container da aplicação executa `npx prisma migrate deploy` automaticamente no startup via `docker-entrypoint.sh`.
Para verificar o estado do banco:
```bash
docker exec automatiza-app npx prisma status
```

## 5. Setup do Master Admin (Bootstrap)
Após o primeiro deploy, execute o bootstrap para criar o usuário administrador global:
```bash
# Exemplo via chamada curl interna (requer BOOTSTRAP_SECRET)
curl -X POST http://localhost:8080/api/public/bootstrap \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "SEU_BOOTSTRAP_SECRET",
    "name": "Administrador",
    "email": "admin@automatizasolucao.com.br",
    "password": "SENHA_SEGURA_AQUI"
  }'
```

## 6. Backup e Restauração
### Backup Manual
```bash
./scripts/backup-db.sh
```
Os backups são salvos em `/data/backups/` no host (se mapeado) ou no volume definido.

### Restauração
1. Pare o container da app: `docker compose stop app`
2. Restaure o SQL: `cat backup.sql | docker exec -i automatiza-db psql -U user automatiza`
3. Inicie a app: `docker compose start app`

## 7. Health Check
Valide a saúde da aplicação:
`curl http://localhost:8080/api/public/health`
Esperado: `{"status":"ok", "database":"ok"}`
