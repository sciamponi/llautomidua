# Deploy VPS - Guia de Preparação

Este documento detalha o status de prontidão para hospedagem própria (VPS) e as configurações necessárias.

## Status de Prontidão

| Módulo | Status | Descrição |
| --- | --- | --- |
| **Infraestrutura (Docker)** | PRONTO | Dockerfile e docker-compose.yml configurados com PostgreSQL 16. |
| **Banco de Dados (Prisma)** | PRONTO | Migrations automáticas via entrypoint. |
| **Health Check** | PRONTO | Endpoint /api/public/health configurado conforme spec. |
| **Storage** | PRONTO | Abstração para LocalStorage com volumes persistentes. |
| **Auth** | EM DESENVOLVIMENTO | Necessário configurar JWT e Provider (Better Auth sugerido). |
| **Operação de Sites 2.0** | EM ANDAMENTO | Fase 5.2 em execução (Admin + Portal Cliente). |

## Configuração de Ambiente (.env)

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@db:5432/automatiza?schema=public"

# Segurança
JWT_SECRET="seu_secret_gerado_no_vps"
SHA256_SALT="seu_salt_para_tokens"

# Notificações (Simulação por padrão)
WHATSAPP_API_URL=""
WHATSAPP_API_TOKEN=""
