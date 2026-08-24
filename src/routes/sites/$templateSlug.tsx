import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sites/$templateSlug')({
  component: TemplateDetailPage,
});

function TemplateDetailPage() {
  const { templateSlug } = Route.useParams();
  return (
    <div className="min-h-screen bg-[#071A2F] text-white p-6">
      <h1 className="text-4xl font-bold">Detalhes do Template: {templateSlug}</h1>
      {/* Detail view implementation */}
    </div>
  );
}
