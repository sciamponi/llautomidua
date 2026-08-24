import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { Header } from "@/components/automatiza/Header";
import { Footer } from "@/components/automatiza/Footer";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071A2F] px-4 text-[#DCE3EA]">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white font-sora">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Página não encontrada</h2>
        <p className="mt-2 text-sm text-[#DCE3EA]/60">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#1E8CFF] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1E8CFF]/90"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071A2F] px-4 text-[#DCE3EA]">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-white font-sora">
          Esta página não pôde ser carregada
        </h1>
        <p className="mt-2 text-sm text-[#DCE3EA]/60">
          Algo deu errado do nosso lado. Tente atualizar ou voltar para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-[#1E8CFF] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1E8CFF]/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Voltar para o Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Automatiza Solução | Tecnologia para automatizar. Oportunidades para crescer." },
      { name: "description", content: "Automatize o atendimento, organize sua equipe e transforme seu WhatsApp em uma operação inteligente de vendas e relacionamento." },
      { name: "author", content: "Automatiza Solução" },
      { property: "og:title", content: "Automatiza Solução | Tecnologia para automatizar." },
      { property: "og:description", content: "Automatize o atendimento e transforme seu WhatsApp em uma operação inteligente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Automatiza" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  // Define route patterns that should NOT have the global header/footer
  const isIsolatedPath = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/membros') || 
    location.pathname.startsWith('/sites/aprovacao');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        {!isIsolatedPath && <Header />}
        <main className="flex-grow">
          <Outlet />
        </main>
        {!isIsolatedPath && <Footer />}
      </div>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

