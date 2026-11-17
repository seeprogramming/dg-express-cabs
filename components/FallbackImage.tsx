"use client";

import { useState, useEffect } from "react";
import Image, { type ImageProps } from "next/image";

const DEFAULT_FALLBACK =
  "https://images.pexels.com/photos/9420512/pexels-photo-9420512.jpeg?auto=compress&cs=tinysrgb&w=1400";
const LOCAL_FALLBACK = "/images/about.jpeg";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function FallbackImage({
  fallbackSrc = DEFAULT_FALLBACK,
  src,
  alt,
  ...props
}: FallbackImageProps) {
  const effectiveInitial = src || fallbackSrc;
  const [imgSrc, setImgSrc] = useState(effectiveInitial);
  const [errorStage, setErrorStage] = useState<number>(0);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setErrorStage(0);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (errorStage === 0 && fallbackSrc && fallbackSrc !== imgSrc) {
          setErrorStage(1);
          setImgSrc(fallbackSrc);
        } else if (errorStage < 2 && imgSrc !== LOCAL_FALLBACK) {
          setErrorStage(2);
          setImgSrc(LOCAL_FALLBACK);
        }
      }}
    />
  );
}
