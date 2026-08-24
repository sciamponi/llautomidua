import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sites/$templateSlug/pedido/')({
  component: OrderFormPage,
});

function OrderFormPage() {
  return (
    <div className="min-h-screen bg-[#071A2F] text-white p-6">
      <h1 className="text-3xl font-bold">Personalize seu site</h1>
      {/* Multi-step form implementation */}
    </div>
  );
}
