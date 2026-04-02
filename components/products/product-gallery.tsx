"use client";

import { useState } from "react";
import Image from "next/image";

type ProductImage = {
  id: number;
  src: string;
  alt: string;
};

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
        No image
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Image
          src={currentImage.src}
          alt={currentImage.alt || productName}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id + "-" + index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded border ${
                selectedIndex === index ? "border-white" : "border-zinc-700"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={image.alt || productName}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
