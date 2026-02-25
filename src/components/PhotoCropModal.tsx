"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface PhotoCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCrop: (dataUri: string) => void;
}

export default function PhotoCropModal({ open, imageSrc, onClose, onCrop }: PhotoCropModalProps) {
  const tc = useTranslations("common");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!open || !imageSrc) return;
    setOffset({ x: 0, y: 0 });
  }, [open, imageSrc]);

  const handleCrop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 400;
      canvas.width = size;
      canvas.height = size;

      const scale = Math.max(size / img.width, size / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      const dx = (size - sw) / 2 + offset.x * scale;
      const dy = (size - sh) / 2 + offset.y * scale;

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, dx, dy, sw, sh);

      onCrop(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = imageSrc;
  }, [imageSrc, offset, onCrop]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setDragging(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-[28px] p-6 max-w-sm w-full"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>

            <div
              className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-2 border-amber-400/40 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {imageSrc && (
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
                  draggable={false}
                />
              )}
            </div>

            <p className="text-xs text-slate-500 text-center mt-3">Drag to adjust position</p>

            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-slate-600/50 text-sm font-semibold text-slate-300"
              >
                {tc("cancel")}
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCrop}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold"
              >
                Use Photo
              </motion.button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
