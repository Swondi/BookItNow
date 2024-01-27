import { randomBytes } from "crypto"

export function generateKey(): string {
  return "bin-" + randomBytes(28).toString("hex")
}

