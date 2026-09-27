export { cn } from "cn"
import crypto from "crypto"

export function createHash(text: string) {
  return crypto.createHash("sha256").update(text.trim()).digest("hex")
}
