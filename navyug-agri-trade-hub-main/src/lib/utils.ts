import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveImagePath(path: string | undefined): string {
  if (!path) return '/images/placeholder.svg';
  if (path.startsWith('http')) return path;

  // Remove leading slash for processing
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // Handle legacy lovable-uploads path
  if (cleanPath.startsWith('lovable-uploads/')) {
    cleanPath = cleanPath.replace('lovable-uploads/', '');
  }

  // Ensure it is in images folder if not already (assuming all local images are there now)
  // Avoid double prefixing
  if (!cleanPath.startsWith('images/')) {
    cleanPath = `images/${cleanPath}`;
  }

  return `/${cleanPath}`;
}
