import type { CSSProperties, ReactNode } from "react";
import { MobileWallpaper } from "./MobileWallpaper";

interface PhoneWrapperProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function PhoneWrapper({ children, footer }: PhoneWrapperProps) {

  return (
    <div className="flex max-h-[92vh] items-center justify-center p-4">
      <div className="relative w-[375px] max-w-full shrink-0 animate-modal-in">
        <div
          className="panel-shell relative overflow-hidden rounded-[40px] p-2 shadow-[var(--shadow-elevated)]"
          style={{ boxShadow: "var(--shadow-elevated), inset 0 1px 0 rgba(255,255,255,0.06)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[40px] opacity-30"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%, transparent 55%, rgba(255,255,255,0.04) 100%)",
            }}
          />
          <div
            className="relative flex h-[812px] max-h-[calc(92vh-2rem)] w-full flex-col overflow-hidden rounded-[32px] bg-[var(--bg-panel)]"
            style={
              {
                "--mobile-safe-top": "32px",
                "--mobile-safe-bottom": "28px",
                "--mobile-tab-clearance": "80px",
              } as CSSProperties
            }
          >
            <MobileWallpaper />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-2 z-20 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-black/85"
            />
            <div
              aria-hidden
              className="mobile-hero-glow mobile-glow-pulse pointer-events-none absolute inset-x-0 top-0 z-0 h-40"
            />
            <div className="relative z-10 flex min-h-0 flex-1 flex-col pt-[var(--mobile-safe-top)] pb-[var(--mobile-safe-bottom)]">
              {children}
            </div>
            <div className="absolute inset-x-0 bottom-0 z-20">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
