import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RobotMessage } from "../RobotMessage";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: 1,
    question: "Qual é o seu tipo de negócio?",
    options: [
      { label: "Barbearia", value: "barbearia" },
      { label: "Salão / Estética", value: "salao" },
      { label: "Clínica", value: "clinica" },
      { label: "Oficina", value: "oficina" },
      { label: "Loja / Varejo", value: "loja" },
      { label: "Empresa de Serviços", value: "servicos" },
      { label: "Outro", value: "outro" },
    ],
  },
  {
    id: 2,
    question: "O que mais atrapalha sua operação hoje?",
    options: [
      { label: "Gestão de WhatsApp", value: "whatsapp" },
      { label: "Agendamentos manuais", value: "agendamento" },
      { label: "Falta de histórico de clientes", value: "clientes" },
      { label: "Perda de leads/vendas", value: "vendas" },
      { label: "Falta de visão da gestão", value: "gestao" },
      { label: "Dificuldade em divulgar", value: "divulgacao" },
    ],
  },
  {
    id: 3,
    question: "Quantas pessoas trabalham na operação?",
    options: [
      { label: "Só eu", value: "1" },
      { label: "2–5 pessoas", value: "2-5" },
      { label: "6–10 pessoas", value: "6-10" },
      { label: "11–30 pessoas", value: "11-30" },
      { label: "Mais de 30", value: "30+" },
    ],
  },
  {
    id: 4,
    question: "Você já utiliza algum sistema?",
    options: [
      { label: "Não uso nada", value: "não" },
      { label: "Sim, mas é limitado", value: "limitado" },
      { label: "Sim, mas não integra tudo", value: "desintegrado" },
      { label: "Tenho vários sistemas separados", value: "separados" },
    ],
  },
];

const rules = [
  {
    condition: (answers: Record<number, string>) => answers[1] === "barbearia" || (answers[1] === "servicos" && answers[2] === "agendamento"),
    result: { name: "BarberIA", path: "/barberia", desc: "Agendamento e gestão inteligente para barbearias." }
  },
  {
    condition: (answers: Record<number, string>) => answers[1] === "salao" || answers[1] === "clinica",
    result: { name: "Esmaltter-IA", path: "/esmalteria", desc: "Organização completa para negócios de beleza e estética." }
  },
  {
    condition: (answers: Record<number, string>) => answers[2] === "whatsapp" || answers[2] === "vendas",
    result: { name: "Automatiza", path: "/automacao", desc: "Transforme seu WhatsApp em uma máquina de vendas organizada." }
  },
  {
    condition: (answers: Record<number, string>) => answers[1] === "oficina",
    result: { name: "Solução Oficinas", path: "/oficinas", desc: "Gestão especializada para o setor automotivo." }
  },
  {
    condition: (answers: Record<number, string>) => answers[2] === "divulgacao",
    result: { name: "AutoMedia Indoor", path: "/automedia", desc: "Mídia inteligente para atrair e converter mais clientes." }
  }
];

export function DiagnosticQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (value: string) => {
    const currentQuestion = questions[currentStep];
    if (!currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.id]: value };

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getRecommendation = () => {
    const match = rules.find(rule => rule.condition(answers));
    return match ? match.result : rules[2]?.result || { name: "Automatiza", path: "/automacao", desc: "Transforme seu WhatsApp em uma máquina de vendas organizada." };
  };

  if (isFinished) {
    const recommendation = getRecommendation();
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 py-12"
      >
        <div className="inline-block p-6 rounded-full bg-[#1E8CFF]/10 border border-[#1E8CFF]/20 mb-4">
          <span className="text-6xl">🤖</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white font-sora">
          Encontramos a solução ideal para você!
        </h2>
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/5 border border-[#1E8CFF]/30 space-y-6">
          <h3 className="text-2xl font-bold text-[#4CDFF2]">{recommendation.name}</h3>
          <p className="text-[#DCE3EA]">{recommendation.desc}</p>
          <a 
            href={recommendation.path}
            className="block w-full bg-[#1E8CFF] text-white py-4 rounded-xl font-bold hover:bg-[#1E8CFF]/90 transition-all uppercase tracking-wider"
          >
            CONHECER {recommendation.name}
          </a>
        </div>
      </motion.div>
    );
  }

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <span className="text-xs font-bold text-[#1E8CFF] uppercase tracking-widest">Passo {currentStep + 1} de {questions.length}</span>
          <span className="text-xs font-bold text-[#DCE3EA]/40">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#1E8CFF]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white font-sora">
            {questions[currentStep]?.question}
          </h2>
          <div className="grid gap-4">
            {questions[currentStep]?.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border transition-all duration-200 group",
                  "bg-white/5 border-white/10 hover:border-[#1E8CFF] hover:bg-[#1E8CFF]/5"
                )}
              >
                <span className="text-lg font-medium text-[#DCE3EA] group-hover:text-white">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12">
        <RobotMessage 
          type="warning"
          message="Responda com sinceridade para que eu possa indicar a melhor tecnologia para sua operação."
        />
      </div>
    </div>
  );
}