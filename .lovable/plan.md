# Plano de Implementação - Fase 5.3: Pagamento e Fluxo Financeiro

Este plano detalha a implementação do fluxo de pagamento, aprovação financeira e pipeline de sites, integrando o sistema comercial à operação técnica.

## 1. Evolução do Banco de Dados (Prisma)

Atualizar o `prisma/schema.prisma` para incluir os modelos de pagamento e configurações necessárias.

- **Payment**: Novo modelo para registrar transações.
  - Campos: `id`, `amount`, `method` (PIX, CREDIT_CARD, BOLETO), `status` (PENDING, PAID, etc.), `proofUrl` (para PIX manual), `orderId`, `customerId`, `responsibleUserId`, `paidAt`.
- **PaymentConfig**: Modelo para armazenar configurações globais de pagamento (ex: Chave PIX, tokens do Asaas/Telegram).
  - Campos: `key`, `value`, `encrypted` (booleano).
- **SiteOrder**: Adicionar campo `paymentStatus` e `price`.

## 2. Infraestrutura de Pagamento e Notificações

Implementar os providers de forma modular para permitir trocas futuras de gateway.

- `src/lib/payments/`:
  - `PaymentProvider.ts`: Interface abstrata.
  - `AsaasProvider.ts`: Integração com o gateway Asaas (Boleto/Cartão).
  - `ManualPixProvider.ts`: Lógica para PIX manual com upload de comprovante.
- `src/lib/notifications/`:
  - `TelegramProvider.ts`: Integração para enviar alertas ao Admin.
  - `EmailProvider.ts`: Template e envio de propostas/confirmantes via Resend.

## 3. Painel Administrativo (Operação de Sites & Financeiro)

Evoluir o Kanban e o modal de detalhes para incluir a visão financeira.

- **Kanban Drag & Drop**:
  - Implementar persistência de status ao arrastar os cards.
  - Exibir valor total e quantidade de projetos por lane.
  - Botão para mostrar/ocultar valores financeiros (conforme permissão).
- **OrderModal (Financeiro)**:
  - Implementar a aba "Financeiro" no modal existente.
  - Visualização e aprovação de comprovantes PIX.
  - Registro de histórico de alterações de valor e status de pagamento.

## 4. Experiência do Cliente (Portal de Pagamento)

Evoluir o fluxo após a aprovação do site pelo cliente.

- **Portal do Cliente (`/cliente/*`)**:
  - Nova rota `/cliente/sites/pagamento/$orderId`.
  - Seleção de forma de pagamento (PIX, Cartão, Boleto).
  - Fluxo de PIX: Exibição de QR Code (gerado ou manual), Copia e Cola, e Upload de Comprovante.
  - Fluxo de Asaas: Link para pagamento seguro ou linha digitável.
- **Portal de Aprovação**:
  - Após aprovação positiva, redirecionar automaticamente para a tela de pagamento.

## 5. Auditoria e Segurança

- Garantir que dados sensíveis de cartão NUNCA passem ou sejam armazenados no servidor.
- Implementar logs de auditoria detalhados para todas as ações financeiras (quem alterou, quando e o quê).
- Proteção de rotas `/admin/*` e `/api/public/health` com as novas regras de ambiente.

## Detalhes Técnicos

- **Tecnologias**: Prisma 6, TanStack Start (Server Functions), Framer Motion para o Kanban.
- **Segurança**: Tokens SHA-256 para links de pagamento/aprovação sem login.
- **Modularidade**: Uso de interfaces abstratas para todos os serviços externos.
