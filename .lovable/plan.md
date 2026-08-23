# Estratégia Comercial e Arquitetura Independente - Automatiza Solução

Este plano detalha a transformação da Automatiza Solução em um ecossistema comercial completo e uma aplicação full-stack preparada para hospedagem independente (VPS), seguindo as diretrizes finais do MVP.

## Objetivos
1. **Ecossistema Comercial (Prioridade MVP)**: Implementar o funil de aquisição completo: Tráfego -> Home/Soluções -> Diagnóstico -> Produto -> Lead -> WhatsApp/Checkout.
2. **Dados Dinâmicos**: Migrar o catálogo de produtos e a lógica de diagnóstico para o backend, servidos via API.
3. **Persistência Real**: Conectar o frontend ao PostgreSQL via API e Prisma para captura de leads e sessões de diagnóstico.
4. **Infraestrutura Independente**: Preparar a aplicação para VPS usando Node.js, Express, Prisma e Docker.

## Implementação Técnica

### 1. Backend e Banco de Dados (Node.js/Express + Prisma)
- **Schema Prisma**: Implementar tabelas para `User`, `Company`, `Product`, `Lead`, `DiagnosticSession` e `Course/Lesson`.
- **API de Produtos**: `GET /api/public/products` para fornecer os dados do catálogo dinamicamente.
- **API de Leads**: `POST /api/public/leads` com persistência total (nome, e-mail, whatsapp, empresa, cidade, produto, origem, etc.).
- **Serviço de Diagnóstico**: Mover a lógica de recomendação para o backend. A API registrará o início, as respostas e a recomendação final.
- **Segurança**: Middlewares para JWT, Helmet e CORS.

### 2. Frontend (TanStack Start + Tailwind)
- **Consumo de API**: Atualizar o catálogo de soluções e o diagnóstico para consumirem os dados do backend.
- **Fluxo de Lead**: Garantir que todos os CTAs e formulários (como o `PartnerSignup` e formulários de produtos) enviem dados para a API de leads.
- **Checkout Service**: Criar uma camada de abstração para checkout, permitindo integração futura com gateways (Stripe/Asaas) ou redirecionamento para WhatsApp.
- **Área de Membros**: Dashboard funcional para parceiros, consumindo dados de cursos e progresso do banco de dados.

### 3. Infraestrutura (Docker + VPS)
- **Dockerização**: Configurar containers para a aplicação Node.js e para o banco de dados PostgreSQL.
- **Deploy**: Script de inicialização e configuração de variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET`, `CHECKOUT_PROVIDER`, etc.).

## Próximos Passos
- Criar a migração do banco de dados com o schema Prisma completo.
- Desenvolver os endpoints de API para produtos e leads.
- Refatorar o frontend para remover dados hardcoded e usar os novos endpoints.
- Validar o funil comercial completo (MVP).
