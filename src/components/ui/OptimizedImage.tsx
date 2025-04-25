"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const OptimizedImage = ({ src, alt, className = "" }: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fallbackImage = "https://via.placeholder.com/400x400?text=No+Image";

  return (
    <div className={`relative w-full aspect-square ${className}`}>
      {isLoading && <div className="absolute inset-0  animate-pulse" />}
      <Image
        src={error ? fallbackImage : src}
        alt={alt}
        fill
        className={`duration-700 ease-in-out object-contain ${
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        priority
        quality={75}
      />
    </div>
  );
};

export default OptimizedImage;
