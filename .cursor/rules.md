# Advance Banking System — Cursor Rules

## Tech Stack

- **Framework:** React 19 + Vite 7 SPA (`src/App.tsx` NUI router)
- **Styling:** Tailwind CSS v4 (`src/styles.css` with `@theme inline` tokens)
- **UI:** shadcn/ui components in `src/components/ui/`
- **State:** React Context (`BankingContext`, `atmStore`, `mobileStore`)
- **Icons:** `lucide-react`

## Architecture

Three app surfaces share one FiveM NUI resource:

| Surface | Entry | State |
|---------|-------|-------|
| Desktop banking | `src/features/banking/BankingApp.tsx` | `BankingContext` |
| ATM | `src/features/atm/ATMApp.tsx` | `atmStore` |
| Mobile phone | `src/features/mobile/MobileApp.tsx` | `mobileStore` |

Routing is NUI-driven in `src/App.tsx` — no URL router. Browser preview uses `AppViewToggle`.

## FiveM Resource

- Root `fxmanifest.lua` serves `dist/index.html`
- `client/main.lua` — zones, targets, `SendNUIMessage`
- `client/nui.lua` — `RegisterNUICallback` handlers
- `server/*.lua` — QBCore + oxmysql
- `phone-app/` — separate YSeries registration resource

## NUI Bridge

`src/features/banking/nui/bridge.ts` + `docs/NUI_CONTRACT.md`

- `isNuiEnvironment()` — true inside FiveM CEF
- `fetchNui(action, data)` — outbound to Lua
- `useNuiEvent(action, handler)` — inbound from Lua

## Conventions

- Use `@/` path alias (`@/*` → `src/*`)
- Keep imports at top of files
- CEF-safe CSS only (hex/rgba; no `oklch`, `backdrop-filter`)
- Mock seed data only in browser preview (`!isNuiEnvironment()`)
