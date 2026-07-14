"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { isRemoteImage } from "@/lib/images";

export interface ImageViewerImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageViewerProps {
  images: ImageViewerImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export default function ImageViewer({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageViewerProps) {
  const isMultiple = images.length > 1;
  const current = images[currentIndex];

  const handlePrev = useCallback(() => {
    if (!onNavigate) return;
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (!onNavigate) return;
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (isMultiple && e.key === "ArrowLeft") handlePrev();
      if (isMultiple && e.key === "ArrowRight") handleNext();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, handlePrev, handleNext, isMultiple]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (typeof document === "undefined" || !current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div
        className="absolute inset-0 z-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <button
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute top-6 right-6 z-20 text-white transition-colors hover:text-white/70"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {isMultiple && (
        <button
          onClick={handlePrev}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 text-white transition-colors hover:text-white/70 md:left-6"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center px-14 py-16 md:px-20 md:py-20">
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <div className="relative h-full w-full max-w-[1440px] overflow-hidden">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt ?? ""}
              fill
              className="object-contain"
              sizes="(min-width: 1536px) 1440px, calc(100vw - 7rem)"
              priority
              unoptimized={isRemoteImage(current.src)}
            />
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-col items-center gap-2 text-center md:mt-6">
          {current.caption && (
            <p className="max-w-[90vw] text-[22px] font-bold leading-normal text-white md:text-[24px]">
              {current.caption}
            </p>
          )}

          <p className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm md:text-sm">
            {currentIndex + 1}/{images.length}{" "}
            {images.length === 1 ? "photo" : "photos"}
          </p>
        </div>
      </div>

      {isMultiple && (
        <button
          onClick={handleNext}
          aria-label="Next image"
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-white transition-colors hover:text-white/70 md:right-6"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>,
    document.body,
  );
}
