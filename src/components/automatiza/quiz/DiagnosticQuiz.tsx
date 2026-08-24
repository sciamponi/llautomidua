import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RobotMessage } from "../RobotMessage";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { recommendProduct, createDiagnosticSession, updateDiagnosticSession } from "@/lib/diagnostic.functions";
import { CheckCircle2, ArrowRight, MessageSquare, Info } from "lucide-react";

type Question = {
  id: string;
  title: string;
  options: { label: string; value: string; icon?: string }[];
  dependsOn?: (answers: Record<string, string>) => boolean;
};

const QUESTIONS: Question[] = [
  {
    id: "businessSegment",
    title: "Primeiro: qual é o seu negócio?",
    options: [
      { label: "Barbearia", value: "barbearia" },
      { label: "Salão / Beleza", value: "salao" },
      { label: "Pet Shop", value: "pet_shop" },
      { label: "Restaurante / Food Service", value: "restaurante" },
      { label: "Academia / Gym", value: "academia" },
      { label: "Oficina", value: "oficina" },
      { label: "Clínica", value: "clinica" },
      { label: "Odontologia", value: "odontologia" },
      { label: "Imobiliária", value: "imobiliaria" },
      { label: "Loja / Varejo", value: "loja" },
      { label: "Empresa de Serviços", value: "servicos" },
      { label: "Outro", value: "outro" },
    ],
  },
  {
    id: "mainProblem",
    title: "Qual é o maior desafio hoje?",
    options: [], // Dynamic options based on segment
  },
  {
    id: "specificNeed",
    title: "O que você gostaria de resolver primeiro?",
    options: [], // Dynamic options based on problem
  },
  {
    id: "currentOperation",
    title: "Como você organiza sua operação hoje?",
    options: [
      { label: "WhatsApp Pessoal", value: "whatsapp" },
      { label: "Agenda de Papel", value: "papel" },
      { label: "Planilhas", value: "planilha" },
      { label: "Outro Sistema", value: "sistema" },
      { label: "Nada / Tudo na cabeça", value: "nada" },
    ],
  },
];

const SEGMENT_OPTIONS: Record<string, { label: string; value: string }[]> = {
  barbearia: [
    { label: "Agendamento", value: "agendamento" },
    { label: "Atendimento", value: "atendimento" },
    { label: "Gestão Financeira", value: "financeiro" },
    { label: "Falta de Clientes", value: "clientes" },
  ],
  pet_shop: [
    { label: "Banho & Tosa (Agenda)", value: "agendamento" },
    { label: "Controle de Vacinas", value: "servicos" },
    { label: "Venda de Produtos", value: "varejo" },
    { label: "Atendimento WhatsApp", value: "whatsapp" },
  ],
  servicos: [
    { label: "WhatsApp desorganizado", value: "whatsapp" },
    { label: "Perda de Leads", value: "leads" },
    { label: "Follow-up lento", value: "followup" },
    { label: "Falta de CRM", value: "crm" },
  ],
  default: [
    { label: "Vendas e Leads", value: "vendas" },
    { label: "Atendimento ao Cliente", value: "atendimento" },
    { label: "Organização Operacional", value: "organizacao" },
    { label: "Presença Digital / Site", value: "presenca" },
  ]
};

const NEED_OPTIONS: Record<string, { label: string; value: string }[]> = {
  agendamento: [
    { label: "Reduzir faltas (No-show)", value: "no_show" },
    { label: "Parar de agendar manualmente", value: "automatizar" },
    { label: "Dar autonomia ao cliente", value: "autonomia" },
  ],
  whatsapp: [
    { label: "Vários atendentes num só número", value: "multi_agente" },
    { label: "Respostas automáticas 24h", value: "chatbot" },
    { label: "Organizar conversas por etiquetas", value: "organizacao" },
  ],
  default: [
    { label: "Agilizar processos", value: "agilidade" },
    { label: "Aumentar faturamento", value: "faturamento" },
    { label: "Ter mais tempo livre", value: "tempo" },
  ]
};

export function DiagnosticQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getRec = useServerFn(recommendProduct);
  const startSess = useServerFn(createDiagnosticSession);
  const updateSess = useServerFn(updateDiagnosticSession);

  useEffect(() => {
    startSess().then(res => setSessionId(res.id));
  }, []);

  const handleSelect = async (value: string) => {
    const currentQ = QUESTIONS[step];
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (sessionId) {
      updateSess({ sessionId, step: step + 1, data: newAnswers });
    }

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const res = await getRec({
          businessSegment: newAnswers.businessSegment,
          mainProblem: newAnswers.mainProblem,
          specificNeed: newAnswers.specificNeed,
          currentOperation: newAnswers.currentOperation,
        });
        setResult(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getCurrentOptions = () => {
    const currentQ = QUESTIONS[step];
    if (currentQ.id === "mainProblem") {
      return SEGMENT_OPTIONS[answers.businessSegment] || SEGMENT_OPTIONS.default;
    }
    if (currentQ.id === "specificNeed") {
      return NEED_OPTIONS[answers.mainProblem] || NEED_OPTIONS.default;
    }
    return currentQ.options;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#1E8CFF]/20 border-t-[#1E8CFF] rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl">🤖</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Processando seu Diagnóstico...</h2>
          <p className="text-[#DCE3EA]/60">Nosso cérebro comercial está analisando a melhor solução para você.</p>
        </div>
      </div>
    );
  }

  if (result) {
    if (result.status === "needs_review") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto py-12 text-center space-y-8">
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-3xl">
            <Info className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">{result.message}</h2>
            <p className="text-[#DCE3EA]/70 mb-8">
              Seu cenário é único e queremos garantir que você receba a ferramenta exata para sua necessidade.
            </p>
            <Link to="/contato" className="inline-flex items-center gap-2 bg-white text-[#071A2F] px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all">
              FALAR COM ESPECIALISTA <MessageSquare className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      );
    }

    const { topMatch, recommendations, confidence } = result;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E8CFF]/10 border border-[#1E8CFF]/20 text-[#1E8CFF] text-sm font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" /> Diagnóstico Concluído
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-sora">
            Encontramos a solução ideal
          </h2>
          <p className="text-[#DCE3EA]/60 text-lg">
            Com base no seu perfil de <span className="text-[#1E8CFF] font-bold">{answers.businessSegment}</span> e desafio em <span className="text-[#1E8CFF] font-bold">{answers.mainProblem}</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Main Recommendation */}
          <div className="md:col-span-3 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1E8CFF] to-[#4CDFF2] rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#0A1F35] border border-white/10 p-8 md:p-10 rounded-[2rem] space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-4xl font-bold text-white mb-2">{topMatch.product.name}</h3>
                    <p className="text-[#4CDFF2] font-medium">{topMatch.product.category}</p>
                  </div>
                  {confidence === "HIGH" && (
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold rounded-lg">
                      100% MATCH
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#DCE3EA]/40 uppercase tracking-widest">Por que recomendamos:</h4>
                  <ul className="space-y-3">
                    {topMatch.reason.split(". ").map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-[#DCE3EA]">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1E8CFF]" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Link 
                    to={`/solucoes/${topMatch.product.slug}` as any}
                    className="flex items-center justify-center gap-2 w-full bg-[#1E8CFF] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#1E8CFF]/90 transition-all group/btn"
                  >
                    COMEÇAR AGORA <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Alternatives or Next Steps */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-sm font-bold text-[#DCE3EA]/40 uppercase tracking-widest px-2">Outras opções relevantes</h4>
            <div className="space-y-4">
              {recommendations.slice(1).map((rec: any) => (
                <Link 
                  key={rec.product.id}
                  to={`/solucoes/${rec.product.slug}` as any}
                  className="block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-2"
                >
                  <h5 className="font-bold text-white">{rec.product.name}</h5>
                  <p className="text-sm text-[#DCE3EA]/60">{rec.product.shortDescription}</p>
                </Link>
              ))}
              
              <div className="p-6 rounded-2xl border border-dashed border-white/10 space-y-4">
                <p className="text-sm text-[#DCE3EA]/60 italic">
                  "Ainda na dúvida? Nossa equipe pode fazer uma demonstração personalizada."
                </p>
                <Link to="/contato" className="flex items-center gap-2 text-[#1E8CFF] font-bold text-sm hover:underline">
                  Falar com consultor <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;
  const options = getCurrentOptions();

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xs font-bold text-[#1E8CFF] uppercase tracking-widest">Passo {step + 1} de {QUESTIONS.length}</span>
          <span className="text-xs font-bold text-[#DCE3EA]/40">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#1E8CFF] to-[#4CDFF2]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white font-sora leading-tight">
            {currentQ.title}
          </h2>
          <div className="grid gap-4">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full text-left p-6 rounded-2xl border transition-all duration-200 group flex items-center justify-between",
                  "bg-white/5 border-white/10 hover:border-[#1E8CFF] hover:bg-[#1E8CFF]/5"
                )}
              >
                <span className="text-lg font-medium text-[#DCE3EA] group-hover:text-white">{option.label}</span>
                <ArrowRight className="w-5 h-5 text-white/0 group-hover:text-[#1E8CFF] transition-all -translate-x-2 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-16">
        <RobotMessage 
          type="warning"
          message="Quanto mais preciso você for, melhor será a tecnologia que vou separar para o seu negócio."
        />
      </div>
    </div>
  );
}
