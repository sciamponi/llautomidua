# Guia de Deploy VPS - Automatiza Solução

Este guia descreve como preparar e hospedar o projeto em um servidor próprio (VPS).

## Requisitos do Servidor
- **SO**: Ubuntu 22.04+ (recomendado) ou qualquer distro com Docker.
- **Hardware Mínimo**: 2 vCPU, 4GB RAM, 20GB SSD.
- **Software**: Docker e Docker Compose instalados.

## Configuração do Ambiente

1. Clone o repositório no servidor.
2. Copie o arquivo de exemplo e configure suas variáveis:
   ```bash
   cp .env.example .env
   nano .env
   ```
3. Certifique-se de configurar a `DATABASE_URL` corretamente.

## Execução com Docker

Para iniciar a aplicação e o banco de dados:
```bash
docker compose up -d
```

O comando irá:
1. Iniciar um banco de dados PostgreSQL 16 (isolado na rede interna).
2. O contêiner da aplicação aguardará a prontidão do banco (via `pg_isready`).
3. Executar `npx prisma migrate deploy` automaticamente antes do início da aplicação.
4. Iniciar o servidor TanStack Start na porta 3000 (mapeada para 8080 no host).

## Persistência de Dados
- **Banco de Dados**: Armazenado no volume `postgres-data`.
- **Arquivos/Uploads**: Armazenados no volume `storage-data` (mapeado para `/data/storage` no container).

## Backup
É essencial realizar backup periódico de:
1. Volume do PostgreSQL: `docker exec automatiza-db pg_dumpall -U user > backup.sql`
2. Diretório de storage: `/var/lib/docker/volumes/...`

## Proxy Reverso e SSL
Recomendamos o uso de **Nginx** ou **Caddy** como proxy reverso para gerenciar HTTPS (SSL).

Exemplo Caddy:
```caddy
sua-url.com {
    reverse_proxy localhost:8080
}
```

## Monitoramento
A aplicação expõe um endpoint de saúde:
`GET /api/public/health`

Resposta esperada (JSON):
```json
{
  "status": "ok",
  "database": "ok"
}
```

Estados possíveis (database):
- `not_configured`: Preview / Dev (200 OK)
- `ok`: Produção estável (200 OK)
- `unavailable`: Produção indisponível (503 Service Unavailable)
