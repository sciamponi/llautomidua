# Plan: Ecosistema Comercial Automatiza Solução - Fase 2

Transformar a landing page institucional atual em uma plataforma comercial completa e segmentada, seguindo a arquitetura de "Máquina Comercial" definida no documento `VOIDPRO-3.md`.

## User Review Required

> [!IMPORTANT]
> A implementação seguirá a lógica de segmentação por problema/dor antes da solução técnica. As novas rotas serão criadas de forma modular para permitir a expansão futura.

- **Dúvida**: O formulário de "Diagnóstico Interativo" deve salvar os dados em algum banco ou apenas redirecionar para o produto? (Assumirei redirecionamento via regras simples inicialmente).
- **Dúvida**: Os vídeos de demonstração nas páginas de produto são links do YouTube/Vimeo ou apenas placeholders por enquanto?

## Proposed Changes

### 1. Reestruturação da Home (Central de Soluções)
- Atualizar o `Hero` para focar na dor ("Escolha o problema. A Automatiza encontra a solução").
- Implementar a nova seção **"Qual problema você quer resolver?"** com cards interativos (WhatsApp, Agendamento, Clientes, Vendas, Gestão, Mídia).
- Criar a seção **"Uma empresa. Várias soluções."** com cards premium para cada SaaS.

### 2. Novas Rotas e Páginas de Produto
- `/solucoes`: Catálogo inteligente com filtros por tipo de dor.
- `/diagnostico`: Quiz interativo (4 perguntas) para recomendação de produto.
- `/automacao` (Automatiza): Página de vendas focada em WhatsApp CRM.
- `/barberia` (BarberIA): Página de vendas focada em agendamento para barbearias.
- `/esmalteria` (Esmaltter-IA): Página de vendas para o setor de beleza.
- `/automedia` (AutoMedia Indoor): Página para soluções de mídia.
- `/oficinas`: Solução específica para gestão de oficinas.

### 3. Componentes Compartilhados (Padrão Comercial)
- **`ProductSalesTemplate`**: Layout base para as páginas de produto (Hero, Problema, Funcionalidades, Pricing, FAQ).
- **`DiagnosticQuiz`**: Componente de lógica de quiz com redirecionamento baseado em regras.
- **`SolutionFilter`**: Filtro dinâmico para o catálogo de soluções.

### 4. Refinamento de Conversão
- Atualizar `/parceiros` para alinhar com a nova narrativa do ecossistema.
- Implementar CTAs claros em todas as páginas ("ENCONTRAR MINHA SOLUÇÃO", "CONHECER OS SAAS").
- Adicionar placeholders visuais para dashboards e interfaces reais (seguindo a regra de não inventar prints falsos).

## Technical Details

- **Routing**: Uso do `@tanstack/react-router` para as novas sub-rotas.
- **State Management**: Local state (React `useState`) para o Quiz e Filtros.
- **Styling**: Manutenção do tema dark navy (#071A2F) com acentos em Electric Blue (#1E8CFF) e Cyan (#4CDFF2).
- **SEO**: Atualização do `head()` em cada rota para metadados específicos de cada solução.
