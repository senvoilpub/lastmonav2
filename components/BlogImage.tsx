"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

interface BlogImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function BlogImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: BlogImageProps) {
  // Use unoptimized images to avoid issues with subdomain image optimization
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
    />
  );
}

