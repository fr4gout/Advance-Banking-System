# Advanced Banking System

FiveM banking NUI for **QBCore** with three surfaces:

- **Desktop Bank** — full banking dashboard
- **ATM** — card/PIN terminal
- **Mobile** — YSeries phone app

## Requirements

- [QBCore](https://github.com/qbcore-framework/qb-core)
- [oxmysql](https://github.com/overextended/oxmysql)
- [qb-target](https://github.com/qbcore-framework/qb-target) (optional; keypress fallback available)
- [YSeries](https://github.com/TeamsGG-Development/yseries) (optional; for mobile banking)
- Node.js 20+

## Quick Start (Development)

```bash
npm install
npm run dev        # http://localhost:3000 — browser preview with mock data
npm run build      # outputs dist/ for FiveM CEF
npm run test       # unit tests
```

## FiveM Deployment

1. Build the UI: `npm run build`
2. Import SQL: run `sql/install.sql` on your database
3. Copy this folder to `resources/[banking]/advanced-banking-system`
4. Copy `phone-app/` to `resources/[banking]/advanced-banking-phone` (separate resource)
5. Add to `server.cfg`:

```cfg
ensure oxmysql
ensure qb-core
ensure qb-target
ensure advanced-banking-system
ensure advanced-banking-phone   # if using YSeries mobile
```

6. Configure bank locations and limits in `config.lua`

## Commands

| Command | Description |
|---------|-------------|
| `/bank` | Open desktop banking |
| `/atm` | Open ATM terminal |

## Architecture

```
React NUI (dist/)  ←→  client/*.lua  ←→  server/*.lua  ←→  oxmysql
                              ↑
                    phone-app/ (YSeries registration)
```

See [docs/NUI_CONTRACT.md](docs/NUI_CONTRACT.md) for the full event contract.

## Project Structure

| Path | Purpose |
|------|---------|
| `src/features/banking/` | Desktop banking UI |
| `src/features/atm/` | ATM surface |
| `src/features/mobile/` | Mobile phone UI |
| `client/` | FiveM client scripts |
| `server/` | QBCore + database logic |
| `phone-app/` | YSeries phone registration |
| `sql/` | Database schema |

## License

Private — see repository owner.
