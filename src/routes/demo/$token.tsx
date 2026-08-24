import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { validateDemoToken } from '@/lib/demo.functions';
import { Loader2, AlertCircle, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

export const Route = createFileRoute('/demo/$token')({
  loader: ({ params }) => ({ token: params.token }),
  component: DemoPage,
});

function DemoPage() {
  const { token } = Route.useLoaderData();
  
  const { data: access, isLoading, error } = useSuspenseQuery({
    queryKey: ['demo-access', token],
    queryFn: () => validateDemoToken({ data: token }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#071A2F] flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-12 h-12 text-[#1E8CFF] animate-spin mb-4" />
        <p className="text-[#DCE3EA]/60 font-sora tracking-wide">Validando seu acesso...</p>
      </div>
    );
  }

  if (error || !access.valid) {
    return (
      <div className="min-h-screen bg-[#071A2F] flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full p-8 rounded-[2.5rem] bg-white/5 border border-red-500/20 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold font-sora mb-4">Acesso Inválido ou Expirado</h1>
          <p className="text-[#DCE3EA]/60 mb-8">
            {access.error || "Este link de demonstração não é mais válido ou foi revogado."}
          </p>
          <Button asChild className="w-full bg-[#1E8CFF] hover:bg-[#1E8CFF]/90 text-white rounded-xl h-12 font-bold">
            <a href="/solucoes">VOLTAR PARA SOLUÇÕES</a>
          </Button>
        </div>
      </div>
    );
  }

  const product = access.product;

  return (
    <div className="min-h-screen bg-[#071A2F] text-[#DCE3EA] flex flex-col">
      {/* Header Bar */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1E8CFF] flex items-center justify-center shadow-lg shadow-[#1E8CFF]/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-sora leading-tight">DEMO: {product.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] h-4 bg-[#1E8CFF]/10 text-[#1E8CFF] border-[#1E8CFF]/20 px-2">
                ACESSO TEMPORÁRIO
              </Badge>
              <span className="text-[10px] text-[#DCE3EA]/40 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Expira em: {new Date(access.expiresAt).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10" asChild>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">Falar com Suporte</a>
          </Button>
          <Button size="sm" className="bg-[#1E8CFF] hover:bg-[#1E8CFF]/90 text-white font-bold" asChild>
            <a href={product.demoUrl || '#'} target="_blank" rel="noopener noreferrer" className="gap-2">
              ABRIR EM TELA CHEIA <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </header>

      {/* Demo Viewport */}
      <main className="flex-grow relative bg-[#0B1E35]">
        {product.demoUrl ? (
          <iframe 
            src={product.demoUrl} 
            className="absolute inset-0 w-full h-full border-none"
            title={`Demonstração ${product.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center p-8">
            <div className="max-w-lg">
              <RobotMessage 
                type="info"
                message="Estamos preparando o ambiente de demonstração interativo. Por enquanto, utilize o link de acesso direto."
              />
              <Button size="lg" className="mt-8 bg-[#1E8CFF] hover:bg-[#1E8CFF]/90 text-white px-12 h-16 rounded-2xl font-bold text-xl gap-3 shadow-xl shadow-[#1E8CFF]/20" asChild>
                <a href={product.demoUrl || '#'} target="_blank" rel="noopener noreferrer">
                  ACESSAR AMBIENTE DEMO <ExternalLink className="w-6 h-6" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action for Mobile */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <Button size="lg" className="rounded-full w-14 h-14 bg-[#1E8CFF] shadow-2xl shadow-[#1E8CFF]/40 p-0" asChild>
           <a href={product.demoUrl || '#'} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-6 h-6 text-white" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function RobotMessage({ type, message }: { type: 'info' | 'warning', message: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl inline-flex items-center gap-4 text-left">
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
        type === 'info' ? "bg-[#1E8CFF]/20 text-[#1E8CFF]" : "bg-amber-500/20 text-amber-500"
      )}>
        <ShieldCheck className="w-6 h-6" />
      </div>
      <p className="text-sm text-[#DCE3EA]/80">{message}</p>
    </div>
  );
}

import { cn } from '@/lib/utils';
