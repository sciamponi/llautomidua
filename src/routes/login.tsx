import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/lib/auth.functions";
import { useNavigate } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await login({ data: values });
      toast.success("Login realizado com sucesso!");
      navigate({ to: result.redirect as any });
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071A2F] flex flex-col items-center justify-center p-4 selection:bg-[#1E8CFF] selection:text-white font-inter">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#1E8CFF]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4CDFF2]/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-8">
            <img src={logoAsset.url} alt="Automatiza Solução" className="h-12 w-auto mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-white font-sora">Bem-vindo de volta</h1>
          <p className="text-[#DCE3EA]/60 text-sm mt-2">Acesse sua conta para gerenciar suas soluções Automatiza.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest px-1">E-mail</label>
              <input
                {...form.register("email")}
                type="email"
                placeholder="seu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-[#DCE3EA]/20 outline-none focus:border-[#1E8CFF] transition-all"
              />
              {form.formState.errors.email && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider px-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest px-1">Senha</label>
              <div className="relative">
                <input
                  {...form.register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-[#DCE3EA]/20 outline-none focus:border-[#1E8CFF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#DCE3EA]/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider px-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest hover:underline">
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-white text-[#071A2F] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#F7F8FA] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar na conta"
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-widest hover:text-white transition-colors">
            <ArrowLeft size={12} />
            Voltar para o site institucional
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Framer Motion needs to be imported if used, but here I'll use simple div if preferred. 
// Adding the import just in case.
import { motion } from "framer-motion";
