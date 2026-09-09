import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getCampaignForCapture, submitLead } from "@/lib/captura.functions";
import {
  CheckCircle2,
  Loader2,
  QrCode,
  Send,
  MessageCircle,
  ShieldCheck,
  Lock,
  AlertTriangle,
} from "lucide-react";

type CampaignData = Awaited<ReturnType<typeof getCampaignForCapture>>;

export const Route = createFileRoute("/captura/$campaignId")({
  validateSearch: (search) => ({
    ad: typeof search["ad"] === "string" ? search["ad"] : "",
    tela: typeof search["tela"] === "string" ? search["tela"] : "",
    utm_source: typeof search["utm_source"] === "string" ? search["utm_source"] : "",
    utm_medium: typeof search["utm_medium"] === "string" ? search["utm_medium"] : "",
    utm_campaign: typeof search["utm_campaign"] === "string" ? search["utm_campaign"] : "",
  }),
  loader: async ({ params }) => {
    try {
      return await getCampaignForCapture({ data: params.campaignId });
    } catch {
      return null;
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {};
    }
    const title = `${loaderData.name} | Quero saber mais`;
    const description = loaderData.description ?? `Conheça a oferta ${loaderData.company.name}.`;
    const image = loaderData.imageUrl ?? loaderData.company.logo ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CapturePage,
});

function CapturePage() {
  const { campaignId } = Route.useParams();
  const search = Route.useSearch();
  const campaign = Route.useLoaderData();
  const submitLeadFn = useServerFn(submitLead);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#334155] bg-[#1E293B] p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-[#F59E0B]" />
          <h1 className="font-sora text-lg font-bold text-white">Oferta não encontrada</h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            O link que você acessou não está mais disponível.
          </p>
        </div>
      </div>
    );
  }

  if (campaign.status !== "ACTIVE") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#334155] bg-[#1E293B] p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-[#F59E0B]" />
          <h1 className="font-sora text-lg font-bold text-white">Essa oferta está indisponível</h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            No momento, esta campanha não está ativa. Volte em breve!
          </p>
        </div>
      </div>
    );
  }

  const formatBr = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      await submitLeadFn({
        data: {
          campaignId,
          adId: search.ad || "",
          screenId: search.tela || "",
          name,
          whatsapp: whatsapp.replace(/\D/g, ""),
          email,
          city,
          source: "QR_CODE",
          utmSource: search.utm_source || "",
          utmMedium: search.utm_medium || "",
          utmCampaign: search.utm_campaign || "",
        },
      });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center justify-center gap-2 text-[#64748B]">
          {campaign.company.logo ? (
            <img
              src={campaign.company.logo}
              alt={campaign.company.name}
              className="h-7 w-7 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3B82F6]/10">
              <ShieldCheck className="h-4 w-4 text-[#3B82F6]" />
            </div>
          )}
          <span className="text-xs font-bold">{campaign.company.name}</span>
          <span className="h-1 w-1 rounded-full bg-[#334155]" />
          <span className="text-xs">Mídia Indoor</span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#334155] bg-[#1E293B]">
          {step === 1 && (
            <div>
              {campaign.imageUrl ? (
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] to-transparent" />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/5">
                  <QrCode className="h-14 w-14 text-[#3B82F6]" />
                </div>
              )}

              <div className="p-6 pt-2 text-center">
                <h1 className="font-sora text-2xl font-bold text-white">{campaign.name}</h1>
                {campaign.description && (
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                    {campaign.description}
                  </p>
                )}

                <div className="mt-6 flex flex-col items-center">
                  <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                    Pacotes promocionais exclusivos
                  </span>
                  <div className="w-full rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-4">
                    <p className="text-center text-xs leading-relaxed text-[#94A3B8]">
                      Pacote <span className="font-bold text-white">MÍDIA</span> com veiculação em
                      tela + leads ilimitados
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] py-4 text-base font-bold tracking-wide text-white transition-all hover:bg-[#2563EB]"
                  >
                    <Send className="h-5 w-5" />
                    {campaign.ctaText ?? "QUERO SABER MAIS"}
                  </button>
                  <p className="mt-3 flex items-center gap-1.5 text-[10px] text-[#64748B]">
                    <Lock className="h-3 w-3" />
                    Seus dados estão seguros. Sem spam.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6">
              <button
                onClick={() => setStep(1)}
                className="mb-4 text-xs font-bold text-[#64748B] transition-colors hover:text-white"
              >
                ← Voltar
              </button>
              <h2 className="font-sora text-xl font-bold text-white">Preencha seus dados</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Preencha o formulário abaixo para receber a proposta exclusiva de{" "}
                {campaign.company.name}.
              </p>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2.5 text-xs text-[#EF4444]">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3.5 text-base text-white outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatBr(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3.5 text-base text-white outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    E-mail <span className="text-[#64748B]">(opcional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3.5 text-base text-white outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#94A3B8]">
                    Cidade <span className="text-[#64748B]">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Sua cidade"
                    className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3.5 text-base text-white outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#22C55E] py-4 text-base font-bold tracking-wide text-[#0F172A] transition-all hover:bg-[#16A34A] disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      RECEBER PROPOSTA
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/15">
                <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
              </div>
              <h2 className="font-sora text-xl font-bold text-white">Recebemos seus dados!</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                Obrigado, <span className="font-bold text-white">{name}</span>! Um atendente de{" "}
                {campaign.company.name} entrará em contato pelo WhatsApp em breve.
              </p>
              <div className="mt-5 rounded-2xl border border-[#334155] bg-[#0F172A] p-4 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                  Próximos passos
                </p>
                <ol className="mt-2 space-y-1.5 text-xs text-[#94A3B8]">
                  <li>1. Um especialista analisa o seu interesse</li>
                  <li>2. Você recebe a proposta exclusiva</li>
                  <li>3. Aprove e comece a veicular</li>
                </ol>
              </div>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#22C55E]/40 bg-[#22C55E]/10 py-3.5 text-sm font-bold text-[#22C55E] transition-all hover:bg-[#22C55E]/20"
              >
                <MessageCircle className="h-4 w-4" />
                Falar agora no WhatsApp
              </a>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[10px] text-[#64748B]">
          © {new Date().getFullYear()} Automatiza Solução · Mídia Indoor
        </p>
      </div>
    </div>
  );
}
