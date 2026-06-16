# Advanced Banking System — Project Reference

## Overview
FiveM NUI banking interface with three surfaces:
- **Desktop Bank** — full-screen banking dashboard (`openDesktop`)
- **ATM** — card/PIN terminal (`openATM`)
- **Mobile** — phone banking app via YSeries (`openMobile`)

---

## Architecture

```
src/
├── App.tsx                        ← Root SPA (state-based NUI router)
├── main.tsx                       ← React 19 createRoot entry
├── styles.css                     ← Global theme (CEF-safe: hex/rgba only)
├── features/
│   ├── banking/
│   │   ├── BankingApp.tsx         ← Desktop banking surface
│   │   ├── context/BankingContext.tsx
│   │   ├── nui/bridge.ts          ← fetchNui, useNuiEvent, isNuiEnvironment
│   │   ├── layout/                ← CanvasFrame, Sidebar, TopBar
│   │   ├── views/                 ← Dashboard, Transfers, Accounts, Cards, Loans, Invoices
│   │   └── components/            ← AppViewToggle, CommandPalette, etc.
│   ├── atm/
│   │   ├── ATMApp.tsx
│   │   └── store/atmStore.tsx     ← Zustand store + ATMProvider
│   └── mobile/
│       ├── MobileApp.tsx
│       └── store/mobileStore.tsx  ← Zustand store + MobileProvider
├── components/ui/                 ← shadcn/ui components (do not modify)
└── lib/utils.ts                   ← cn() helper
phone-app/
├── fxmanifest.lua                 ← FiveM resource manifest
└── client.lua                     ← YSeries phone registration
```

---

## NUI Event Contract

### Inbound (client.lua → UI via `SendNUIMessage`)

| Action | Payload | Effect |
|--------|---------|--------|
| `openDesktop` | `{}` | Shows desktop BankingApp |
| `openATM` | `{}` | Shows ATM surface |
| `openMobile` | `{}` | Shows mobile banking (YSeries) |
| `setVisible` | `boolean` | `true` → shows BankingApp |
| `OpenATM` | `{}` | Legacy alias for `openATM` |
| `setCharacter` | `CharacterData` | Sets player identity |
| `setAccounts` | `Account[]` | Populates account list |
| `setCashOnHand` | `number` | Updates cash balance |
| `pushTransaction` | `Transaction` | Adds new tx to feed |
| `pushInvoice` | `Invoice` | Adds invoice |
| `setContacts` | `Contact[]` | Updates contacts |
| `setCards` | `Card[]` | Updates card list |
| `setLoanProducts` | `LoanProduct[]` | Updates loan products |
| `setCreditProfile` | `CreditProfile` | Updates credit data |
| `pushActiveLoan` | `Loan` | Adds active loan |
| `UpdateCards` | `Card[]` | Refreshes card data |
| `UpdateBalance` | `number` | Updates account balance |
| `CloseATM` | `{}` | Hides ATM surface |

### Outbound (UI → client.lua via `fetchNui`)

| Action | Description |
|--------|-------------|
| `close` | Close banking UI |
| `switchAccount` | Change active account |
| `deposit` | Deposit funds |
| `withdraw` | Withdraw funds |
| `transfer` | Transfer between accounts |
| `payInvoice` | Pay an invoice |
| `saveContact` | Save/update contact |
| `updateSocietyLimits` | Update society account limits |
| `addSharedMember` | Add shared account member |
| `updateSharedMember` | Update shared member permissions |
| `removeSharedMember` | Remove shared member |
| `applyForLoan` | Submit loan application |
| `issueVirtualCard` | Issue a new virtual card |
| `updateCard` | Update card settings |
| `CloseATM` | Close ATM from UI |
| `SelectCard` | Select card at ATM |
| `VerifyPin` | Submit PIN at ATM |
| `WithdrawMoney` | ATM cash withdrawal |

---

## Bank Themes

Switch by setting `data-bank-theme` on `<html>`:

| Value | Color | Bank |
|-------|-------|------|
| *(default)* | `#6bbfff` blue | Pacific Standard |
| `maze` | `#d94444` crimson | Maze Bank |
| `fleeca` | `#84cc16` lime | Fleeca |
| `lombank` | `#6060cc` periwinkle | Lombank |

```lua
-- client.lua example
SendNUIMessage({ action = "setBankTheme", data = "maze" })
```

---

## Dev Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Type-check + production build → dist/
npm run preview    # Preview built dist/ locally
```

---

## FiveM CEF Compatibility Notes

FiveM uses Chromium ~79. The following are **not supported** and have been patched:

| Feature | Status | Fix Applied |
|---------|--------|-------------|
| `oklch()` color function | ❌ Chrome 111+ | Converted to `hex`/`rgba` in `styles.css` |
| `color-mix()` | ❌ Chrome 111+ | Converted to `rgba` in `styles.css` |
| `backdrop-filter` | ❌ Not supported | Avoided — solid `rgba` bg fills used instead |
| `filter: blur()` | ✅ Supported | Used for wallpaper blobs |
| Tailwind v4 directives | ✅ Build-time | Compiled to plain CSS by `@tailwindcss/vite` |

---

## Build Output

```
dist/
├── index.html              ← SPA entry (all asset refs are relative ./)
└── assets/
    ├── index-*.js          ← Bundled React app (~1 MB, ~295 KB gzip)
    └── index-*.css         ← Compiled Tailwind CSS (~118 KB, ~20 KB gzip)
```

### FiveM resource fxmanifest.lua (required)
```lua
ui_page 'dist/index.html'
files   { 'dist/**' }
```

---

## YSeries Phone App

Resource: `phone-app/` — register as a **separate FiveM resource**.

```
server.cfg:
  ensure advanced-banking-system
  ensure advanced-banking-phone
```

When the player opens the Banking icon on the phone:
1. YSeries loads `cfx-nui-advanced-banking-system/dist/index.html` in an iframe
2. `SetAppOpenCallback` fires `SendNUIMessage({ action = "openMobile" })`
3. `useNuiEvent("openMobile")` in `App.tsx` renders `<MobileApp />`

---

## Key Files — Do Not Modify Without Care

| File | Why |
|------|-----|
| `src/features/banking/nui/bridge.ts` | Core NUI bridge — `fetchNui`, `useNuiEvent`, `isNuiEnvironment` |
| `src/features/banking/context/BankingContext.tsx` | All banking state |
| `src/features/atm/store/atmStore.tsx` | ATM Zustand store |
| `src/features/mobile/store/mobileStore.tsx` | Mobile Zustand store |
| `src/components/ui/` | shadcn/ui — regenerate via `npx shadcn add` |
