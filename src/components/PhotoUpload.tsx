"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { useTranslations } from "next-intl";
import PhotoCropModal from "./PhotoCropModal";

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (dataUri: string) => void;
  size?: "sm" | "lg";
}

export default function PhotoUpload({ currentPhoto, onPhotoChange, size = "lg" }: PhotoUploadProps) {
  const t = useTranslations("onboarding");
  const fileRef = useRef<HTMLInputElement>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);

  const dimension = size === "lg" ? "w-28 h-28" : "w-20 h-20";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRawImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropDone = (croppedDataUri: string) => {
    setRawImage(null);
    onPhotoChange(croppedDataUri);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => fileRef.current?.click()}
          className={`${dimension} rounded-full relative overflow-hidden border-2 border-dashed border-amber-400/40 flex items-center justify-center group transition-all hover:border-amber-400/70`}
        >
          {currentPhoto ? (
            <>
              <Image src={currentPhoto} alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </>
          ) : (
            <Camera size={size === "lg" ? 28 : 20} className="text-amber-400/60" />
          )}
        </motion.button>
        <p className="text-[10px] text-teal-400/60">
          {currentPhoto ? t("fields.changePhoto") : t("fields.addPhoto")}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
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
