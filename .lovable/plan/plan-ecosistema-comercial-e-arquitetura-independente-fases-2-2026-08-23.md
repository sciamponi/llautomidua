# Plan: Ecosistema Comercial e Arquitetura Independente (Fases 2 e 3)

Este plano abrange a transformação da Automatiza Solução em uma plataforma comercial completa ("Máquina Comercial") e a preparação da arquitetura para hospedagem independente em VPS (saída do ecossistema proprietário).

## User Review Required

> [!IMPORTANT]
> A implementação seguirá a lógica de segmentação por dor (WhatsApp, Agendamento, etc.) antes da solução técnica. Prepararemos o projeto para ser exportável, mas o deploy em VPS externo e a configuração do Nginx/Docker são passos que o usuário deverá realizar após a exportação do código.

- **Dúvida**: O formulário de "Diagnóstico Interativo" deve salvar leads no banco de dados local (Prisma) ou apenas redirecionar? (Implementarei salvamento local + redirecionamento).
- **Dúvida**: Para a migração da Fase 3, devo manter a compatibilidade com o ambiente atual ou focar 100% na estrutura de backend Node/Express independente? (Focarei na estrutura independente conforme VOIDPRO-4.md).

## Proposed Changes

### 1. Reestruturação Comercial (Fase 2 - VOIDPRO-3)
- **Home**: Nova seção "Qual problema você quer resolver?" com cards interativos.
- **Diagnóstico**: Implementação da rota `/diagnostico` com o quiz de 4 perguntas para recomendação de SaaS.
- **Catálogo**: Rota `/solucoes` com filtro dinâmico por tipo de dor.
- **Páginas de Produto**: Criação das rotas individuais para cada SaaS (Automatiza, BarberIA, Esmaltter-IA, AutoMedia, Oficinas) usando um template comercial premium.
- **Área de Membros**: Rota `/membros` com dashboard para parceiros e cursos.

### 2. Infraestrutura Independente (Fase 3 - VOIDPRO-4)
- **Estrutura de Pastas**: Reorganização para separar `/frontend` e `/backend`.
- **Backend Node.js/Express**: Criação do servidor backend em TypeScript com autenticação JWT e Refresh Tokens.
- **Banco de Dados (Prisma)**: Definição do `schema.prisma` com as entidades User, Company, Lead, Product, Partner, Course, Lesson.
- **Storage**: Abstração para armazenamento local de arquivos (compatível com VPS).
- **Docker**: Adição de `Dockerfile` e `docker-compose.yml` para facilitar o deploy no VPS.

### 3. Funcionalidades de Negócio
- **Parceiros**: Sistema de gestão de carteira ativa e simulador de ganhos persistente.
- **Leads**: Captura e triagem automática de leads via formulários e quiz.

## Technical Details

- **Frontend**: React + TanStack Router (SPA mode para facilitar exportação).
- **Backend**: Express.js + Prisma ORM + PostgreSQL.
- **Auth**: Cookie-based HttpOnly JWT (Segurança recomendada).
- **Deployment**: Preparado para Nginx Reverse Proxy.
