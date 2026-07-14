"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { isRemoteImage } from "@/lib/images";
import ImageViewer, { type ImageViewerImage } from "./ImageViewer";

interface ClickableImageSingleProps extends Omit<ImageProps, "onClick"> {
  caption?: string;
}

export function ClickableImage({
  caption,
  className,
  ...imageProps
}: ClickableImageSingleProps) {
  const [open, setOpen] = useState(false);
  const shouldBypassOptimization =
    typeof imageProps.src === "string" && isRemoteImage(imageProps.src);

  const images: ImageViewerImage[] = [
    {
      src: imageProps.src as string,
      alt: imageProps.alt as string,
      caption,
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View image${caption ? `: ${caption}` : ""}`}
        className="cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E328A] rounded-inherit"
      >
        <Image
          {...imageProps}
          className={className}
          alt={imageProps.alt ?? ""}
          unoptimized={imageProps.unoptimized ?? shouldBypassOptimization}
        />
      </button>

      {open && (
        <ImageViewer
          images={images}
          currentIndex={0}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export interface GalleryImage extends ImageViewerImage {
  sizes?: string;
}

interface ClickableImageGalleryProps {
  images: GalleryImage[];
  index: number;
  openIndex: number | null;
  onOpen: (index: number) => void;
  onClose: () => void;
  onNavigate: (index: number) => void;
  imageClassName?: string;
  fill?: boolean;
  sizes?: string;
}

/**
 * Renders one image in a gallery that opens a shared fullscreen ImageViewer.
 * Lift { openIndex, setOpenIndex } into the parent and pass them down to each tile.
 *
 * @example
 * const [openIndex, setOpenIndex] = useState<number | null>(null);
 *
 * {images.map((img, i) => (
 *   <ClickableImageGallery
 *     key={img.src}
 *     images={images}
 *     index={i}
 *     openIndex={openIndex}
 *     onOpen={setOpenIndex}
 *     onClose={() => setOpenIndex(null)}
 *     onNavigate={setOpenIndex}
 *   />
 * ))}
 */
export function ClickableImageGallery({
  images,
  index,
  openIndex,
  onOpen,
  onClose,
  onNavigate,
  imageClassName,
  fill = true,
  sizes = "25vw",
}: ClickableImageGalleryProps) {
  const img = images[index];

  return (
    <>
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`View image${img.caption ? `: ${img.caption}` : ""}`}
        className="relative block w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E328A] rounded-inherit"
      >
        <Image
          src={img.src}
          alt={img.alt ?? ""}
          fill={fill}
          sizes={sizes}
          className={imageClassName}
          unoptimized={isRemoteImage(img.src)}
        />
      </button>

      {/* Only the item whose index matches renders the portal */}
      {openIndex !== null && openIndex === index && (
        <ImageViewer
          images={images}
          currentIndex={openIndex}
          onClose={onClose}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
}
