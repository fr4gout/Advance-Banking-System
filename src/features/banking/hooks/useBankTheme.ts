import type { BankTheme } from "../types/banking";

export const BANK_THEME_STORAGE_KEY = "banking-theme";

export interface BankThemeConfig {
  id: BankTheme;
  name: string;
  description: string;
  swatch: string;
  logoSrc?: string;
}

export const BANK_THEMES: BankThemeConfig[] = [
  {
    id: "pacific",
    name: "Pacific Standard",
    description: "Cyan / blue neon accents",
    swatch: "oklch(0.78 0.13 240)",
    logoSrc: "/logos/pacific-bank.png",
  },
  {
    id: "maze",
    name: "Maze Bank",
    description: "Red / crimson accents",
    swatch: "oklch(0.65 0.22 22)",
    logoSrc: "/logos/maze-bank.png",
  },
  {
    id: "fleeca",
    name: "Fleeca Bank",
    description: "Green / emerald accents",
    swatch: "oklch(0.78 0.17 155)",
    logoSrc: "/logos/fleeca.png",
  },
  {
    id: "lombank",
    name: "Lombank",
    description: "Periwinkle blue accents",
    swatch: "oklch(0.68 0.12 265)",
    logoSrc: "/logos/lombank.png",
  },
];

export function getBankThemeConfig(theme: BankTheme): BankThemeConfig {
  return BANK_THEMES.find((t) => t.id === theme) ?? BANK_THEMES[0];
}

export function readStoredTheme(): BankTheme {
  if (typeof window === "undefined") return "pacific";
  const stored = localStorage.getItem(BANK_THEME_STORAGE_KEY);
  if (stored === "pacific" || stored === "maze" || stored === "fleeca" || stored === "lombank") {
    return stored;
  }
  return "pacific";
}

export function applyBankTheme(theme: BankTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-bank-theme", theme);
}
