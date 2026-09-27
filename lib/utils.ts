import { ClassValue, clsx } from "cn"

import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function createHash(text: string) {
  return crypto.createHash("sha256").update(text.trim()).digest("hex")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
