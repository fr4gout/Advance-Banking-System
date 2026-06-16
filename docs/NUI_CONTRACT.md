# NUI Contract

Communication between the FiveM client (`client/*.lua`) and the React UI (`dist/`).

## Message Format

All messages use:

```json
{ "action": "<eventName>", "data": { ... } }
```

## Inbound (client.lua → UI via `SendNUIMessage`)

| Action | Payload | Effect |
|--------|---------|--------|
| `openDesktop` | `{}` | Shows desktop `BankingApp` |
| `openATM` / `OpenATM` | `{ balance?, atmLimit? }` | Shows ATM surface |
| `openMobile` | `{}` | Shows mobile banking |
| `setVisible` | `boolean` | Toggles desktop banking visibility |
| `setCharacter` | `Character` | Sets player identity |
| `setAccounts` | `Account[]` | Populates accounts |
| `setCashOnHand` | `number` | Updates cash balance |
| `pushTransaction` | `Transaction` | Adds transaction to feed |
| `pushInvoice` | `Invoice` | Adds invoice |
| `setContacts` | `Contact[]` | Updates contacts |
| `setCards` | `VirtualCard[]` | Updates cards |
| `setLoanProducts` | `LoanProduct[]` | Updates loan products |
| `setCreditProfile` | `CreditProfile` | Updates credit data |
| `pushActiveLoan` | `Loan` | Adds active loan |
| `setBankTheme` | `"pacific" \| "maze" \| "fleeca" \| "lombank"` | Sets bank theme |
| `UpdateCards` | `{ cards: BankCard[] }` | ATM card list |
| `UpdateBalance` | `{ balance: number, atmLimit?: number }` | ATM balance |
| `CloseATM` | `{}` | Hides ATM |

## Outbound (UI → client.lua via `fetchNui` / `RegisterNUICallback`)

| Action | Payload | Server event |
|--------|---------|--------------|
| `close` | `{}` | Closes UI, releases focus |
| `switchAccount` | `{ id }` | `advanced-banking:server:switchAccount` |
| `deposit` | `{ amount }` | `advanced-banking:server:deposit` |
| `withdraw` | `{ amount }` | `advanced-banking:server:withdraw` |
| `transfer` | `{ toIban?, citizenId?, amount, note? }` | `advanced-banking:server:transfer` |
| `requestPayment` | `{ toIban?, citizenId?, amount, reason, contactName? }` | stub |
| `payInvoice` | `{ id }` | stub |
| `saveContact` | `Contact \| { id, deleted: true }` | stub |
| `updateSocietyLimits` | `{ accountId, withdrawLimit, depositLimit }` | stub |
| `addSharedMember` | `{ accountId, citizenId, role }` | stub |
| `updateSharedMember` | `{ accountId, memberId, role }` | stub |
| `removeSharedMember` | `{ accountId, memberId }` | stub |
| `applyForLoan` | `{ accountId, productId, amount }` | stub |
| `issueVirtualCard` | `{ accountId, pin, design }` | stub |
| `updateCard` | `{ cardId, status?, spendingLimit? }` | stub |
| `CloseATM` | `{}` | Closes UI |
| `SelectCard` | `{ cardId }` | stub |
| `VerifyPin` | `{ cardId, pin }` | stub |
| `WithdrawMoney` | `{ cardId, amount }` | `advanced-banking:server:atmWithdraw` |

## Response Format

NUI callbacks should respond with:

```json
{ "ok": true }
```

On failure:

```json
{ "ok": false, "error": "reason" }
```

The UI rolls back optimistic updates when `ok: false` is returned.

## Browser Preview

When `window.GetParentResourceName` is undefined, `fetchNui` returns `{ ok: true, preview: true }` and mock seed data is used.
