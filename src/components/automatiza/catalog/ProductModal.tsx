import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Layout, Zap, Users, MessageSquare, PlayCircle, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DemoRequestModal } from './DemoRequestModal';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onShowGallery: (product: any) => void;
}

export function ProductModal({ product, isOpen, onClose, onShowGallery }: ProductModalProps) {
  const [showDemoRequest, setShowDemoRequest] = useState(false);

  if (!product) return null;

  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl bg-[#071A2F] border-white/10 text-[#DCE3EA] p-0 overflow-hidden">
          <div className="grid md:grid-cols-5 h-full max-h-[90vh]">
            {/* Left Sidebar / Info */}
            <div className="md:col-span-2 p-8 bg-white/5 border-r border-white/5 overflow-y-auto">
              <div className="mb-6">
                <Badge className="bg-[#1E8CFF]/10 text-[#1E8CFF] border-[#1E8CFF]/20 mb-4">
                  {product.category}
                </Badge>
                <DialogTitle className="text-4xl font-bold text-white font-sora mb-2">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="text-[#DCE3EA]/60 text-lg">
                  {product.shortDescription}
                </DialogDescription>
              </div>

              <div className="space-y-8">
                {product.audience && (
                  <div>
                    <h4 className="text-xs font-bold text-[#1E8CFF] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Para quem é
                    </h4>
                    <p className="text-sm text-[#DCE3EA]/80 leading-relaxed">
                      {product.audience}
                    </p>
                  </div>
                )}

                {product.howItWorks && (
                  <div>
                    <h4 className="text-xs font-bold text-[#1E8CFF] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Layout className="w-4 h-4" /> Como funciona
                    </h4>
                    <p className="text-sm text-[#DCE3EA]/80 leading-relaxed">
                      {product.howItWorks}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Main Content */}
            <div className="md:col-span-3 p-8 overflow-y-auto bg-[#071A2F]">
              <div className="space-y-10">
                {/* Image Placeholder / Cover */}
                <div className="relative aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group cursor-pointer"
                     onClick={() => onShowGallery(product)}>
                  {product.coverImage ? (
                    <img src={product.coverImage} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-white/10" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <ImageIcon className="w-4 h-4" /> Ver Galeria
                    </Button>
                  </div>
                </div>

                {/* Benefits */}
                {benefits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#1E8CFF]" /> Principais Benefícios
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {benefits.map((benefit: any, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-5 h-5 text-[#1E8CFF] shrink-0" />
                          <span className="text-sm text-[#DCE3EA]/80">{typeof benefit === 'string' ? benefit : benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                  <Button 
                    className="flex-1 bg-[#1E8CFF] hover:bg-[#1E8CFF]/90 text-white h-14 rounded-xl font-bold uppercase tracking-wider text-xs gap-2"
                    onClick={() => setShowDemoRequest(true)}
                  >
                    <PlayCircle className="w-5 h-5" /> Acessar Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white h-14 rounded-xl font-bold uppercase tracking-wider text-xs gap-2"
                  >
                    <MessageSquare className="w-5 h-5 text-[#1E8CFF]" /> Falar com Especialista
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DemoRequestModal 
        product={product}
        isOpen={showDemoRequest}
        onClose={() => setShowDemoRequest(false)}
      />
    </>
  );
}
