# Plano de Implementação - Fase 5.3: Pagamento e Fluxo Financeiro (Sites Operation 2.0)

Este plano detalha a evolução da operação de sites para incluir o fluxo de pagamento, aprovação financeira, pipeline Kanban avançado e notificações integradas, conforme especificações em `VOIDPRO-45.md`.

## 1. Banco de Dados e Modelagem (Prisma)

Atualizar o `prisma/schema.prisma` para suportar o novo fluxo financeiro:

- **SiteOrder**: Adicionar `price` (Decimal/Float) e `paymentStatus` (enum).
- **Payment**: Criar modelo para transações.
  - Campos: `id`, `amount`, `method` (PIX, CREDIT_CARD, BOLETO), `status` (PENDING, PROOF_SUBMITTED, UNDER_REVIEW, PAID, REJECTED, CANCELLED, FAILED), `proofUrl`, `orderId`, `customerId`, `responsibleUserId`, `paidAt`.
- **PaymentConfig**: Criar modelo para configurações operacionais (não sensíveis).
  - Campos: `pixEnabled`, `pixKey`, `receiverName`, `instructions`, `qrCodeUrl`.
- **Audit/History**: Garantir que alterações de preço e status financeiro gerem registros em `SiteOrderHistory`.

## 2. Infraestrutura e Providers (Server-Side)

Implementar uma arquitetura de providers abstratos para garantir modularidade e segurança.

- **PaymentProvider**: Interface base para gateways.
  - `ManualPixProvider`: Lógica para PIX com upload de comprovante.
  - `AsaasProvider`: Integração com gateway Asaas (Boleto/Cartão).
- **NotificationProvider**:
  - `TelegramProvider`: Envios via bot (NOVO PEDIDO, COMPROVANTE ENVIADO, etc.).
  - `EmailProvider`: Integração com Resend para propostas e recibos.
- **Segurança**: Secrets (`ASAAS_API_KEY`, `TELEGRAM_BOT_TOKEN`, `RESEND_API_KEY`) permanecem exclusivamente no servidor via variáveis de ambiente.

## 3. Painel Administrativo (Sites Operation 2.0)

Evolução do Kanban e gestão financeira.

- **Kanban Drag & Drop**:
  - Implementar persistência de status no servidor ao mover cards.
  - Exibir contagem de projetos e valor total por lane (lane totalizer).
  - Controle administrativo para MOSTRAR/OCULTAR valores financeiros.
- **OrderModal (Aba Financeiro)**:
  - Visualização de dados de pagamento e comprovantes.
  - Botões de APROVAR/REJEITAR pagamento (rejeição exige motivo).
  - Histórico financeiro detalhado do pedido.

## 4. Experiência do Cliente (Portal do Cliente)

Novo fluxo de checkout e comprovação.

- **Rota de Pagamento**: `/cliente/sites/pagamento/$orderId` (acessível via token seguro).
- **Fluxo PIX**: Exibição da chave e QR Code, botão "Copiar Chave" e área de upload de comprovante (PDF/PNG/JPG).
- **Fluxo Asaas**: Redirecionamento para checkout seguro ou exibição de linha digitável (Boleto).
- **Redirecionamento**: Após o cliente aprovar o preview do site, redirecionar automaticamente para a tela de pagamento.

## 5. Auditoria e Regras de Negócio

- **Regra de Publicação**: Implementar a flag `requirePaymentBeforePublish` (configurável por produto/plano).
- **Auditoria**: Registro detalhado de "quem, quando, o quê e valor anterior/novo" para todas as transações financeiras.

## Fases de Entrega

1. **Fase A (Kanban & Valores)**: Drag-and-drop persistente, totalizadores por lane e resumo financeiro no dashboard.
2. **Fase B (PIX & Comprovante)**: Fluxo de PIX manual no Portal do Cliente e upload de arquivos.
3. **Fase C (Aprovação & Telegram)**: Interface administrativa para aprovação financeira e alertas via Telegram.
4. **Fase D (Integração Asaas)**: Pagamentos automáticos via Cartão/Boleto e Webhook de confirmação.
5. **Fase E (Email & Refinamentos)**: Notificações via Resend e auditoria final.
