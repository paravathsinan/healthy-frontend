import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOptimizedImageUrl(url: string | null | undefined, width = 400) {
  if (!url || !url.includes('cloudinary.com')) return url || '/images/placeholder.png';
  
  // Inject transformation w_X,q_auto,f_auto after /upload/
  // w_ means width, q_auto means auto quality, f_auto means auto format (WebP/AVIF)
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  return url;
}
