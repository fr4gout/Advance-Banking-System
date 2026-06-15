import type { VirtualCardDesign } from "../../types/banking";

export const CARD_DESIGNS: {
  id: VirtualCardDesign;
  label: string;
  swatchClassName: string;
}[] = [
  { id: "midnight", label: "Midnight", swatchClassName: "bg-gradient-to-br from-[#0b0f1e] to-[#1a2a44]" },
  { id: "silver", label: "Silver", swatchClassName: "bg-gradient-to-br from-[#cbd5e1] to-[#94a3b8]" },
  { id: "navy", label: "Navy", swatchClassName: "bg-gradient-to-br from-[#0b1b3d] to-[#1b4aa6]" },
  { id: "carbon", label: "Carbon", swatchClassName: "bg-[linear-gradient(135deg,#0b0f14_0%,#171a20_45%,#0f172a_100%)]" },
  { id: "burgundy", label: "Burgundy", swatchClassName: "bg-gradient-to-br from-[#2a0b0b] to-[#7f1d1d]" },
];

export function designToCardClassName(design: VirtualCardDesign): string {
  const map: Record<VirtualCardDesign, string> = {
    midnight: "bg-gradient-to-br from-[#0b0f1e] to-[#1a2a44] text-white",
    silver: "bg-gradient-to-br from-[#e2e8f0] to-[#94a3b8] text-[#0b1220]",
    navy: "bg-gradient-to-br from-[#0b1b3d] to-[#1b4aa6] text-white",
    carbon: "bg-[linear-gradient(135deg,#0b0f14_0%,#171a20_45%,#0f172a_100%)] text-white",
    burgundy: "bg-gradient-to-br from-[#2a0b0b] to-[#7f1d1d] text-white",
  };
  return map[design];
}

