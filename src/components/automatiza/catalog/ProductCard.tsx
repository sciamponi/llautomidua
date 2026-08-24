import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    segment: string;
    shortDescription: string;
    problem?: string | null;
    demoActive?: boolean;
    status: string;
    coverImage?: string | null;
  };
  onConhecer: (product: any) => void;
}

export function ProductCard({ product, onConhecer }: ProductCardProps) {
  const isAvailable = product.status === 'active';

  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#1E8CFF]/30 transition-all group flex flex-col h-full">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <Badge 
          variant="outline" 
          className="text-[10px] font-bold text-[#1E8CFF] uppercase tracking-widest bg-[#1E8CFF]/10 border-[#1E8CFF]/20 px-3 py-1 rounded-full"
        >
          {product.category}
        </Badge>
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isAvailable ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-500"
          )} />
          <span className="text-[10px] font-bold text-[#DCE3EA]/40 uppercase tracking-tighter">
            {isAvailable ? 'Disponível' : 'Indisponível'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white mb-4 font-sora group-hover:text-[#1E8CFF] transition-colors">
          {product.name}
        </h3>
        
        {product.problem && (
          <div className="p-4 rounded-xl bg-[#071A2F]/50 border border-white/5 mb-6">
            <p className="text-[10px] text-[#1E8CFF] font-bold uppercase mb-1 flex items-center gap-1">
              <Check className="w-3 h-3" /> O Problema
            </p>
            <p className="text-sm text-[#DCE3EA]/80 italic line-clamp-2">
              "{product.problem}"
            </p>
          </div>
        )}
        
        <p className="text-[#DCE3EA]/60 text-sm mb-8">
          {product.shortDescription}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={() => onConhecer(product)}
          className="inline-flex items-center justify-center w-full bg-white text-[#071A2F] py-4 rounded-xl font-bold hover:bg-[#F7F8FA] transition-all uppercase text-sm tracking-wider gap-2 shadow-lg shadow-black/20"
        >
          CONHECER <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
