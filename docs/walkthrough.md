# Migration Walkthrough: TanStack Start → Vite SPA (FiveM NUI)

## What Was Done

### 1. Stripped TanStack Start & SSR

**Deleted files** (11 files):
- `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/README.md`
- `src/routeTree.gen.ts`, `src/router.tsx`
- `src/server.ts`, `src/start.ts`
- `src/lib/error-capture.ts`, `src/lib/error-page.ts`, `src/lib/lovable-error-reporting.ts`, `src/lib/config.server.ts`, `src/lib/api/example.functions.ts`

**Removed packages** (129 packages removed):
- `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/router-plugin`
- `@lovable.dev/vite-tanstack-config`, `nitro`

---

### 2. New Vite SPA Architecture

| File | Role |
|---|---|
| [vite.config.ts](file:///G:/Dev%20work/Advance-Banking-System/vite.config.ts) | Pure Vite config — `@vitejs/plugin-react` + `@tailwindcss/vite`, `base: './'` for FiveM |
| [index.html](file:///G:/Dev%20work/Advance-Banking-System/index.html) | Standard SPA entry — mounts `#root`, no SSR shell |
| [src/main.tsx](file:///G:/Dev%20work/Advance-Banking-System/src/main.tsx) | React 19 `createRoot` entry |
| [src/App.tsx](file:///G:/Dev%20work/Advance-Banking-System/src/App.tsx) | State-based NUI router |

---

### 3. NUI State Router (App.tsx)

The new `App.tsx` replaces file-based routing with NUI message listeners:

```
NUI Message              → View Rendered
───────────────────────────────────────────
{ action: "openDesktop" } → <BankingApp />   (desktop bank terminal)
{ action: "openATM" }     → <ATMApp />       (ATM machine)
{ action: "openMobile" }  → <MobileApp />    (YSeries phone app)
{ action: "setVisible" }  → <BankingApp />   (backward compat)
{ action: "OpenATM" }     → <ATMApp />       (legacy uppercase compat)
```

All three providers (`BankingProvider`, `ATMProvider`, `MobileProvider`, `QueryClientProvider`) are mounted at root level so state is never torn down when switching views.

---

### 4. FiveM CEF Compatibility Fixes (styles.css)

FiveM runs Chromium ~79 which does **not** support `oklch()` (added Chrome 111) or `color-mix()` (added Chrome 111). Every occurrence was converted:

**oklch() → hex/rgba:**
| oklch value | Converted |
|---|---|
| `oklch(0.13 0.02 265)` | `#0c0e1a` (background) |
| `oklch(0.985 0 0)` | `#fafafa` (foreground) |
| `oklch(0.19 0.03 265)` | `#151926` (surface/card) |
| `oklch(0.78 0.13 240)` | `#6bbfff` (primary) |
| `oklch(0.65 0.22 22)` | `#d94444` (destructive) |
| `oklch(0.78 0.17 155)` | `#4ade80` (success) |
| + all oklch() in all 4 bank theme variants | ✓ |

**color-mix() → rgba:**
| color-mix | Converted |
|---|---|
| `color-mix(in oklch, var(--primary) 8%, transparent)` | `rgba(107,191,255, 0.08)` |
| `color-mix(in oklch, var(--primary) 15%, transparent)` | `rgba(107,191,255, 0.15)` |
| `color-mix(in oklch, var(--primary) 28%, transparent)` | `rgba(107,191,255, 0.28)` |
| `color-mix(in oklch, var(--primary) 30%, transparent)` | `rgba(107,191,255, 0.30)` |
| `color-mix(in oklch, var(--primary) 50%, transparent)` | `rgba(107,191,255, 0.50)` |
| `color-mix(in oklch, var(--c-red) 40%, transparent)` | `rgba(248,113,113, 0.40)` |

> [!NOTE]
> `filter: blur(48px)` on `.mobile-wallpaper-blob` is **kept** — regular CSS `filter` works fine in FiveM CEF. Only `backdrop-filter` would be broken.

---

### 5. BankingApp Cleanup

[BankingApp.tsx](file:///G:/Dev%20work/Advance-Banking-System/src/features/banking/BankingApp.tsx) was slimmed to only render the desktop banking surface. Providers, `AppShell`, `Toaster`, and NUI event handlers were moved up to `App.tsx` to avoid double-wrapping.

---

### 6. YSeries Phone Integration

Two new files in [phone-app/](file:///G:/Dev%20work/Advance-Banking-System/phone-app/):

- [fxmanifest.lua](file:///G:/Dev%20work/Advance-Banking-System/phone-app/fxmanifest.lua) — FiveM resource manifest for the phone registration helper
- [client.lua](file:///G:/Dev%20work/Advance-Banking-System/phone-app/client.lua) — Registers the banking app inside YSeries via `exports["yseries"]:AddCustomApp(...)`

**How it works in-game:**
1. Player opens YSeries phone → taps "Banking" app icon
2. Phone opens iframe pointing to `https://cfx-nui-advanced-banking-system/dist/index.html`
3. `SetAppOpenCallback` fires `SendNUIMessage({ action = "openMobile" })`
4. `useNuiEvent("openMobile")` in `App.tsx` switches view to `<MobileApp />`

---

## Build Results

```
✓ 2614 modules transformed
dist/index.html                   0.78 kB │ gzip:  0.46 kB
dist/assets/index-*.css         117.58 kB │ gzip: 19.98 kB   ← compiled Tailwind
dist/assets/index-*.js        1,029.61 kB │ gzip: 295.14 kB
✓ built in 12.18s
```

- All CSS asset paths use `./assets/` (relative) ✓
- TypeScript: zero errors ✓
- 129 SSR-only packages removed ✓

---

## Deployment Steps

```bash
# 1. Build
npm run build

# 2. Copy dist/ into your FiveM resource folder
# resource folder structure:
#   advanced-banking-system/
#     dist/           ← output of npm run build
#     fxmanifest.lua  ← your existing banking resource manifest
#     client.lua      ← your existing banking client script

# 3. Add the phone registration resource separately:
#   advanced-banking-phone/
#     fxmanifest.lua  ← phone-app/fxmanifest.lua
#     client.lua      ← phone-app/client.lua

# 4. server.cfg
ensure advanced-banking-system
ensure advanced-banking-phone
```

> [!IMPORTANT]
> In your **banking resource's** `fxmanifest.lua`, make sure `ui_page` points to `dist/index.html`:
> ```lua
> ui_page 'dist/index.html'
> files { 'dist/**' }
> ```
