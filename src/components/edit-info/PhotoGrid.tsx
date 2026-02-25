"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import PhotoCropModal from "@/components/PhotoCropModal";

interface PhotoGridProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export default function PhotoGrid({ photos, onChange }: PhotoGridProps) {
  const t = useTranslations("editInfo");
  const fileRef = useRef<HTMLInputElement>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [addIndex, setAddIndex] = useState<number>(0);

  const slots = Array.from({ length: 9 }, (_, i) => photos[i] || null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRawImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAdd = (index: number) => {
    setAddIndex(index);
    fileRef.current?.click();
  };

  const handleCropDone = (croppedDataUri: string) => {
    setRawImage(null);
    const next = [...photos];
    if (addIndex < next.length) {
      next[addIndex] = croppedDataUri;
    } else {
      next.push(croppedDataUri);
    }
    onChange(next);
  };

  const handleRemove = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className="grid grid-cols-3 gap-2">
        {slots.map((photo, i) => (
          <div
            key={i}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            {photo ? (
              <>
                <Image
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemove(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleAdd(i)}
                className="w-full h-full flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-xl hover:border-violet-500/30 transition-colors"
              >
                <Plus size={20} className="text-violet-400" />
                {i === 0 && (
                  <span className="text-[10px] text-slate-500 mt-1">{t("addPhoto")}</span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <PhotoCropModal
        open={!!rawImage}
        imageSrc={rawImage || ""}
        onClose={() => setRawImage(null)}
        onCrop={handleCropDone}
      />
    </>
  );
}
