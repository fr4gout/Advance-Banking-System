# Advance Banking System — Cursor Rules

## Tech Stack

- **Framework:** TanStack Start (React 19, file-based routing via `@tanstack/react-router`)
- **Styling:** Tailwind CSS v4 (`src/styles.css` with `@theme inline` tokens)
- **UI:** shadcn/ui components in `src/components/ui/`
- **Build:** Vite 7 + `@lovable.dev/vite-tanstack-config`
- **State:** React Context (`BankingContext`), Zustand-like stores for ATM and mobile
- **Icons:** `lucide-react` — use `LucideIcon` type for nav/tab icon arrays

## Architecture

Three app surfaces share one FiveM NUI resource, toggled in browser preview via `AppViewToggle`:

| Surface | Entry | State |
|---------|-------|-------|
| Desktop banking | `src/features/banking/BankingApp.tsx` | `BankingContext` |
| ATM | `src/features/atm/ATMApp.tsx` | `atmStore` |
| Mobile phone | `src/features/mobile/MobileApp.tsx` | `mobileStore` |

Routing: `src/routes/index.tsx` renders `BankingApp`. TanStack Start shell lives in `src/routes/__root.tsx`. Server entry: `src/server.ts` → `src/start.ts`.

## Feature Layout

```
src/features/
  banking/   — accounts, transfers, invoices, cards, loans, society admin
  atm/       — card selection, PIN, withdrawal flow
  mobile/    — phone UI (lock screen, tabs, transfers, contacts)
```

Use the `@/` path alias (`@/*` → `src/*`). Keep imports at the top of files.

## NUI Bridge (FiveM)

`src/features/banking/nui/bridge.ts` is the client ↔ UI contract:

- `isNuiEnvironment()` — true when running inside FiveM
- `fetchNui(action, data)` — outbound calls to `client.lua`
- `useNuiEvent(event, handler)` — inbound events from the game client
- Browser preview: `fetchNui` resolves `{ ok: true, preview: true }` so flows work without a game client

ATM and mobile reuse banking types and `fetchNui` where needed. Do not break preview mode when adding NUI actions.

## Coding Conventions

1. **Lucide icons in config arrays** — type as `LucideIcon`, not `React.ComponentType<{ className?: string }>`.
2. **Click handlers with parameters** — wrap callbacks: `onClick={() => openTransfersSend()}`, not `onClick={openTransfersSend}` when the function accepts optional args (avoids passing `MouseEvent` as the first argument).
3. **Exhaustive unions** — use `never` checks in switch/default; throw on impossible paths instead of returning invalid values.
4. **CSS tokens** — prefer `var(--primary)`, `var(--bg-surface)`, `var(--tx)`, etc. from `styles.css` over hardcoded colors.
5. **Minimal scope** — match existing patterns in the feature folder you are editing; avoid unrelated refactors.

## Commands

```bash
npm run dev          # local dev server (port 8080)
npm run build        # production build
npx tsc --noEmit     # type-check
npm run lint         # ESLint
```

## Key Files

- `src/features/banking/context/BankingContext.tsx` — central banking state and NUI handlers
- `src/features/banking/types/banking.ts` — shared domain types
- `src/features/banking/mock/seed.ts` — preview/mock data
- `vite.config.ts` — TanStack Start server entry override (`server: { entry: "server" }`)
