import { createFileRoute, Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { getSiteTemplateBySlug } from '@/lib/sites.functions';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/automatiza/Header';

export const Route = createFileRoute('/sites/$templateSlug')({
  component: TemplateDetailPage,
});

function TemplateDetailPage() {
  const { templateSlug } = Route.useParams();
  const fetchTemplate = useServerFn(getSiteTemplateBySlug);

  const { data: template, isLoading } = useQuery({
    queryKey: ['site-template', templateSlug],
    queryFn: () => fetchTemplate({ data: templateSlug })
  });

  if (isLoading) return <div className="min-h-screen bg-[#071A2F] text-white flex items-center justify-center">Carregando...</div>;
  if (!template) return <div className="min-h-screen bg-[#071A2F] text-white flex items-center justify-center">Template não encontrado.</div>;

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] font-inter">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        <Link to="/sites" className="inline-flex items-center text-[#1E8CFF] hover:text-[#1E8CFF]/80 transition-all mb-8 text-sm font-bold uppercase tracking-widest">
          ← Voltar ao Catálogo
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="bg-[#1E8CFF]/10 text-[#1E8CFF] border border-[#1E8CFF]/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
                {template.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-sora uppercase">{template.name}</h1>
              <p className="text-lg text-gray-400 leading-relaxed italic">"{template.description}"</p>
            </div>

            <div className="grid gap-6 py-8 border-y border-white/10">
              <div className="space-y-2">
                <h4 className="text-[#4CDFF2] font-bold text-sm uppercase tracking-wider">Para quem é</h4>
                <p className="text-sm">{template.segment}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[#4CDFF2] font-bold text-sm uppercase tracking-wider">Para que serve</h4>
                <p className="text-sm">{template.application}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[#4CDFF2] font-bold text-sm uppercase tracking-wider">Como funciona</h4>
                <p className="text-sm">Nossa equipe adapta toda a estrutura do modelo com as cores, logo e textos da sua empresa.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[#4CDFF2] font-bold text-sm uppercase tracking-wider">O que você precisa enviar</h4>
                <ul className="text-sm list-disc list-inside space-y-1 text-gray-400">
                  <li>Logotipo em alta resolução</li>
                  <li>Fotos reais dos seus serviços/produtos</li>
                  <li>Informações de contato e endereço</li>
                  <li>Breve texto sobre sua história e diferenciais</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/sites/$templateSlug/pedido"
                params={{ templateSlug: template.slug }}
                className="bg-[#1E8CFF] text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#1E8CFF]/90 transition-all"
              >
                QUERO ESSE SITE
              </Link>
              {template.externalUrl && (
                <a
                  href={template.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-all"
                >
                  VER SITE COMPLETO ↗
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="aspect-[4/5] bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group">
              {template.previewImage ? (
                <img src={template.previewImage} alt={template.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 italic">
                  Prévia em preparação
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

