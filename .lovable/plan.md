# Estratégia Comercial e Arquitetura Independente - Automatiza Solução

Este plano detalha a transformação da Automatiza Solução em um ecossistema comercial completo e uma aplicação full-stack preparada para hospedagem independente (VPS).

## Objetivos
1. **Ecossistema Comercial**: Implementar todas as páginas de vendas, catálogo de soluções e diagnóstico interativo.
2. **Área de Membros**: Criar o dashboard para parceiros com trilhas de treinamento e gestão de clientes.
3. **Arquitetura Independente**: Configurar o backend Node.js/Express e a infraestrutura Docker para portabilidade total.

## Implementação Técnica

### 1. Frontend (TanStack Start + Tailwind)
- **Catálogo de Soluções**: Rota `/solucoes` com cards interativos baseados em problemas reais.
- **Páginas de Vendas (SaaS)**: Implementação das páginas `/automacao`, `/barberia`, `/esmalteria`, `/automedia` e `/oficinas` usando o `ProductSalesTemplate`.
- **Diagnóstico Interativo**: Finalização do `DiagnosticQuiz` para recomendação automática de produtos.
- **Área de Membros**: Rota `/membros` com dashboard, módulos de curso e área financeira (simulada/integrada).
- **Integração de Leads**: Conectar formulários à API pública `/api/public/leads`.

### 2. Backend (Node.js/Express + Prisma)
- **Servidor**: API RESTful em TypeScript com middlewares de segurança (Helmet, CORS).
- **Autenticação**: Sistema de login via JWT para parceiros e administradores.
- **Banco de Dados**: Schema Prisma completo cobrindo Usuários, Empresas, Produtos e Leads.
- **API de Leads**: Endpoint para captura e armazenamento de potenciais clientes vindos do frontend.

### 3. Infraestrutura (Docker + VPS)
- **Containerização**: `Dockerfile` otimizado para produção e `docker-compose.yml` para orquestrar App + Banco Postgres.
- **Variáveis de Ambiente**: Configuração centralizada para fácil deploy em qualquer provedor VPS.

## Próximos Passos
- Implementar as tabelas no banco de dados via Prisma.
- Criar a lógica de cursos/aulas na área de membros.
- Validar o fluxo completo de captura de lead -> recomendação -> checkout.
