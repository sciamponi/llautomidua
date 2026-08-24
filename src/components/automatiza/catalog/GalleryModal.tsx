import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function GalleryModal({ product, isOpen, onClose }: GalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) return null;

  // Use product.gallery if available, otherwise fallback to cover image if it exists
  const images = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : (product.coverImage ? [{ url: product.coverImage, alt: product.name }] : []);

  if (images.length === 0) return null;

  const next = () => setActiveIndex((i) => (i + 1) % images.length);
  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl bg-black/95 border-none text-white p-0 h-[80vh] flex flex-col sm:rounded-3xl overflow-hidden">
        <div className="relative flex-grow flex items-center justify-center p-4">
          <img 
            src={images[activeIndex].url} 
            alt={images[activeIndex].alt || product.name} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />

          {/* Controls */}
          {images.length > 1 && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <div className="absolute top-4 left-6">
            <h3 className="text-xl font-bold font-sora">{product.name}</h3>
            <p className="text-xs text-white/60">Imagem {activeIndex + 1} de {images.length}</p>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="bg-white/5 p-6 flex gap-3 overflow-x-auto justify-center border-t border-white/10">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                  activeIndex === idx ? "border-[#1E8CFF] scale-110" : "border-transparent opacity-50 hover:opacity-100"
                )}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
