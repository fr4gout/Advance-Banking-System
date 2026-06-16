/** Pacific Standard Bank IBAN format: LS## #### #### #### */
export const IBAN_PATTERN = /^LS\d{2}(?:\s?\d{4}){3}$/i;

export function isValidIban(value: string): boolean {
  return IBAN_PATTERN.test(value.trim());
}

export function normalizeIban(value: string): string {
  return value.trim().toUpperCase();
}
