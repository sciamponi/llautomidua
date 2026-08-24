# Plano de Implementação - Fase 5.3: Pagamento e Fluxo Financeiro (Sites Operation 2.0)

Este plano detalha a evolução da operação de sites para incluir o fluxo de pagamento, aprovação financeira, pipeline Kanban avançado e notificações integradas, conforme especificações em `VOIDPRO-45.md` e `VOIDPRO-46.md`.

## 1. Banco de Dados e Modelagem (Prisma)

Atualizar o `prisma/schema.prisma` para suportar o novo fluxo financeiro:

- **SiteOrder**: 
    - Adicionar `price` (Decimal) para valor comercial.
    - Adicionar `paymentStatus` (enum `PaymentStatus`).
- **Payment**: Criar modelo para transações.
    - Campos: `id`, `amount`, `method` (PIX, CREDIT_CARD, BOLETO), `status` (PENDING, PROOF_SUBMITTED, UNDER_REVIEW, PAID, REJECTED, CANCELLED, FAILED), `proofUrl`, `orderId`, `customerId`, `responsibleUserId`, `paidAt`.
- **PaymentConfig**: Criar modelo para configurações operacionais (não sensíveis).
    - Campos: `pixEnabled`, `pixKey`, `receiverName`, `instructions`, `qrCodeUrl`.
- **Audit/History**: Garantir que alterações de preço e status financeiro gerem registros em `SiteOrderHistory`.

## 2. Infraestrutura e Providers (Server-Side)

Implementar uma arquitetura de providers abstratos para garantir modularidade e segurança.

- **PaymentProvider**: Interface base para gateways em `src/lib/payments/`.
    - `ManualPixProvider`: Lógica para PIX com upload de comprovante.
    - `AsaasProvider`: Integração com gateway Asaas (Boleto/Cartão).
- **NotificationProvider**:
    - `TelegramProvider`: Envios via bot (NOVO PEDIDO, COMPROVANTE ENVIADO, etc.) em `src/lib/notifications.functions.ts`.
    - `EmailProvider`: Integração com Resend para propostas e recibos.
- **Segurança**: Secrets (`ASAAS_API_KEY`, `TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`) permanecem exclusivamente no servidor via variáveis de ambiente.

## 3. Painel Administrativo (Sites Operation 2.0)

Evolução do Kanban e gestão financeira.

- **Kanban Drag & Drop**:
    - Implementar persistência de status no servidor ao mover cards em `src/routes/admin/sites/index.tsx`.
    - Exibir contagem de projetos e valor total por lane (lane totalizer).
    - Controle administrativo para MOSTRAR/OCULTAR valores financeiros.
- **OrderModal (Aba Financeiro)**:
    - Criar aba "FINANCEIRO" em `src/components/admin/sites/OrderModal.tsx`.
    - Visualização de dados de pagamento e comprovantes.
    - Botões de APROVAR/REJEITAR pagamento (rejeição exige motivo).
    - Histórico financeiro detalhado do pedido.

## 4. Experiência do Cliente (Portal do Cliente)

Novo fluxo de checkout e comprovação.

- **Rota de Pagamento**: `/cliente/sites/pagamento/$orderId` (acessível via token seguro).
- **Fluxo PIX**: Exibição da chave e QR Code, botão "Copiar Chave" e área de upload de comprovante (PDF/PNG/JPG).
- **Fluxo Asaas**: Redirecionamento para checkout seguro ou exibição de linha digitável (Boleto).
- **Redirecionamento**: Após o cliente aprovar o preview do site em `/cliente/sites/aprovacao/$token`, redirecionar automaticamente para a tela de pagamento.

## 5. Auditoria e Regras de Negócio

- **Regra de Publicação**: Implementar a flag `requirePaymentBeforePublish` (configurável).
- **Auditoria**: Registro detalhado de "quem, quando, o quê e valor anterior/novo" para todas as transações financeiras.

## Fases de Entrega

1. **Fase A (Banco & Kanban)**: Migração Prisma e evolução do Kanban com totalizadores e persistência.
2. **Fase B (Portal de Pagamento & PIX)**: Rota de pagamento do cliente e fluxo de comprovante manual.
3. **Fase C (Aprovação Financeira & Telegram)**: Aba financeira no Admin e integração com Telegram.
4. **Fase D (Gateway Asaas & Webhook)**: Pagamentos automáticos e processamento de notificações de pagamento.
5. **Fase E (E-mail & Auditoria)**: Notificações via Resend e refinamento dos logs de auditoria.
