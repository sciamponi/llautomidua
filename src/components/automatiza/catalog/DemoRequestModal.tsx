import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { requestDemoAccess } from '@/lib/demo.functions';
import { Loader2, CheckCircle, ExternalLink } from 'lucide-react';

interface DemoRequestModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function DemoRequestModal({ product, isOpen, onClose }: DemoRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoUnlocked, setDemoUnlocked] = useState(false);
  const [demoUrl, setDemoUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await requestDemoAccess({
        data: {
          ...formData,
          productId: product.id
        }
      });

      if (result.success) {
        setDemoUrl(`/demo/${result.token}`);
        setExpiresAt(new Date(result.expiresAt).toLocaleString('pt-BR'));
        setDemoUnlocked(true);
        toast.success("Demonstração liberada!");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao solicitar demonstração.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#071A2F] border-white/10 text-[#DCE3EA]">
        {!demoUnlocked ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white font-sora">
                Liberar Demo: {product.name}
              </DialogTitle>
              <DialogDescription className="text-[#DCE3EA]/60">
                Preencha os dados abaixo para receber seu link de acesso exclusivo à demonstração do sistema.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#DCE3EA]/60">Nome Completo</Label>
                <Input 
                  id="name" 
                  required 
                  placeholder="Seu nome"
                  className="bg-white/5 border-white/10 text-white focus:border-[#1E8CFF]/50"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-wider text-[#DCE3EA]/60">WhatsApp</Label>
                <Input 
                  id="whatsapp" 
                  required 
                  placeholder="(00) 00000-0000"
                  className="bg-white/5 border-white/10 text-white focus:border-[#1E8CFF]/50"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#DCE3EA]/60">E-mail (opcional)</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-white/5 border-white/10 text-white focus:border-[#1E8CFF]/50"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#1E8CFF] hover:bg-[#1E8CFF]/90 text-white font-bold h-12 rounded-xl mt-4"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "LIBERAR ACESSO AGORA"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-sora">Acesso Liberado!</h3>
              <p className="text-[#DCE3EA]/60 text-sm">
                Seu link de demonstração para <strong>{product.name}</strong> está pronto.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-[#1E8CFF] font-bold uppercase mb-1">Validade do Acesso</p>
              <p className="text-sm font-mono text-[#DCE3EA]/80">{expiresAt}</p>
            </div>

            <Button 
              asChild
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-14 rounded-xl text-lg gap-2"
            >
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                ACESSAR DEMONSTRAÇÃO <ExternalLink className="w-5 h-5" />
              </a>
            </Button>

            <button 
              onClick={onClose}
              className="text-xs text-[#DCE3EA]/40 hover:text-white transition-colors uppercase font-bold tracking-widest"
            >
              FECHAR
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
