import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isNuiEnvironment } from "../nui/bridge";

interface CanvasFrameProps {
  children: ReactNode;
  bare?: boolean;
}

const previewGameBg = !isNuiEnvironment();

export function CanvasFrame({ children, bare = false }: CanvasFrameProps) {
  useEffect(() => {
    if (!previewGameBg) return;
    document.documentElement.classList.add("preview-game-bg");
    return () => document.documentElement.classList.remove("preview-game-bg");
  }, []);

  return (
    <div
      className={cn(
        "relative h-screen w-screen overflow-hidden",
        !previewGameBg && "bg-[var(--bg-panel)]",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-cover bg-center",
          previewGameBg ? "opacity-100" : "opacity-40",
        )}
        style={{
          backgroundImage: previewGameBg
            ? "url(/bg-fivem-preview.png)"
            : "linear-gradient(180deg, rgba(6,8,16,0.35) 0%, rgba(6,8,16,0.88) 100%), url(/bank-interior.svg), radial-gradient(ellipse at 50% 30%, oklch(0.25 0.04 265) 0%, oklch(0.13 0.02 265) 70%)",
        }}
      />
      {!previewGameBg ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 15% 20%, var(--primary-08), transparent 50%), radial-gradient(700px circle at 90% 90%, color-mix(in oklch, var(--primary) 6%, transparent), transparent 55%)",
          }}
        />
      ) : null}

      <div className="relative flex h-full w-full items-center justify-center p-4">
        {bare ? (
          children
        ) : (
          <div className="panel-shell flex h-[min(92vh,860px)] w-full max-w-[1440px] overflow-hidden shadow-[var(--shadow-elevated)]">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
