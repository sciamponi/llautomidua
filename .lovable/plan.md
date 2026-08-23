# Ecossistema Comercial e Arquitetura Independente - Automatiza Solução (MVP & Máquina de Vendas)

Este plano detalha a implementação da "Máquina Comercial" da Automatiza Solução, integrando o funil de aquisição, área de membros e uma infraestrutura independente para VPS.

## Objetivos
1. **Máquina de Aquisição (Funil MVP)**: Home -> Catálogo -> Diagnóstico -> Produto -> Lead -> WhatsApp/Checkout.
2. **Máquina de Conversão**: Persistência real de leads, automação de CTAs e sistema de assinatura real (Lead ≠ Cliente).
3. **Máquina de Retenção e Expansão**: Onboarding estruturado, Cross-sell inteligente e Área de Membros funcional.
4. **Máquina de Parceiros**: Estrutura dedicada para revendedores com gestão de carteira e materiais.
5. **Arquitetura Full-Stack Independente**: Backend Node.js/Express, Prisma ORM, PostgreSQL e Docker para portabilidade VPS.

## Implementação Técnica

### 1. Backend & Banco de Dados (Node.js/Express + Prisma)
- **Schema Prisma Completo**:
    - `User`, `Company`, `Product`, `Subscription` (status: pending, active, etc.), `Lead`, `Partner`, `Course`, `Lesson`, `Event`.
- **APIs Públicas**:
    - `GET /api/public/products`: Catálogo dinâmico.
    - `POST /api/public/leads`: Captura completa com rastreamento de origem/campanha.
    - `POST /api/public/diagnostic`: Sessão de diagnóstico persistente com lógica de recomendação no servidor.
- **APIs Protegidas (JWT)**:
    - Autenticação e autorização por roles (`admin`, `partner`, `customer`, `student`).
    - `/admin/*`: Módulos de gestão de produtos, leads, clientes e cursos.
    - `/members/*`: Conteúdos, produtos contratados e materiais.
- **Analytics Centralizado**: Serviço de `track(eventName, metadata)` salvando no PostgreSQL.

### 2. Frontend (TanStack Start + Tailwind)
- **Consumo Dinâmico**: Remover dados hardcoded. Soluções e Quiz consultam o backend.
- **Funil Comercial**:
    - `DiagnosticQuiz`: Refatorado para persistir progresso no backend.
    - `ProductSalesTemplate`:CTAs conectados ao `CheckoutService` (abstração para WhatsApp ou Gateways).
- **Área de Membros & Admin**:
    - Dashboards funcionais com estados vazios ("empty states") onde não houver dados reais.
    - Checklist de onboarding para novos clientes.
- **Cross-Sell**: Componentes de recomendação baseados nos produtos atuais do usuário.

### 3. Infraestrutura e VPS (Docker)
- **Containerização**: `Dockerfile` (app) e `docker-compose.yml` (app + postgres + volumes).
- **Operações**:
    - `scripts/backup-db.sh`: Automação de backups.
    - `DEPLOY-VPS.md`: Guia de configuração (Nginx, HTTPS, Health check).

## Próximos Passos
- Implementar o schema Prisma completo no diretório `prisma/`.
- Criar os endpoints de API de produtos e leads no backend.
- Refatorar o `DiagnosticQuiz` para usar a camada de serviço do backend.
- Desenvolver a interface básica do `/admin` e `/membros` com autenticação JWT.
