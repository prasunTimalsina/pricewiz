import { clsx, type ClassValue } from "clsx";
import { Header } from "next/dist/lib/load-custom-routes";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
