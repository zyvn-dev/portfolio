"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Loader2, X, Check } from "lucide-react";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  recommendedSize?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  folder = "portfolio",
  recommendedSize = "1200x800",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(file, folder);
      onChange(uploadedUrl);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(
        err.message ||
          "Upload failed. Ensure Cloudinary credentials and Firebase ID are configured, or enter a direct image URL."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <label className="text-white/70 uppercase tracking-wider">{label}</label>
        <span className="text-white/40">{recommendedSize}</span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-2xl border-2 border-dashed p-4 transition-all duration-200 text-center ${
          dragOver
            ? "border-[var(--sky-primary)] bg-[var(--sky-primary)]/10"
            : "border-white/15 bg-white/[0.02] hover:border-white/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileProcess(e.target.files[0]);
            }
          }}
        />

        {value ? (
          <div className="relative group w-full h-44 rounded-xl overflow-hidden glass-pill">
            <Image src={value} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white text-slate-950 font-mono text-xs font-medium hover:bg-white/90"
              >
                Replace Image
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer py-6 flex flex-col items-center justify-center space-y-2"
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 text-[var(--sky-primary)] animate-spin" />
                <span className="text-xs font-mono text-white/60">
                  Compressing to WebP & Uploading...
                </span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-white/60 border border-white/10">
                  <UploadCloud className="w-5 h-5 text-[var(--sky-primary)]" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-white/80 block">
                    Click to browse or drag & drop image
                  </span>
                  <span className="text-[11px] text-white/40 block font-mono">
                    Auto-compressed to WebP before transfer
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {error && (
          <p className="text-[11px] font-mono text-rose-400 mt-2 text-left">{error}</p>
        )}
      </div>

      {/* Manual direct URL fallback input */}
      <div className="pt-1">
        <input
          type="url"
          placeholder="Or paste external image URL..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 text-xs font-mono focus:outline-none focus:border-[var(--sky-primary)]"
        />
      </div>
    </div>
  );
};
