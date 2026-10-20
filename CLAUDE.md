# ua-taxes-tg-bot

Telegram bot that counts the monthly taxes of a 3rd-group ФОП. NestJS 10 + nestjs-telegraf,
no database. User-facing text is Ukrainian; code, comments and commits are English.

## How it works

- Any message with an amount (`25000`, `25 000`, `25000.50`, `25 000,50 грн`) → ЄН and
  військовий збір, **without ЄСВ**. `/esv 25000` → the same **with** the fixed monthly ЄСВ.
  Text without an amount: a hint in a private chat, silence in a group.
- Rates come from `.env` (`TAX_EN_PERCENT`, `TAX_MILITARY_PERCENT`, `TAX_ESV`) and are shown in
  `/diag`. ЄСВ changes every year (22% of the minimum wage): update `TAX_ESV` on the Pi in January.
- `src/taxes/amount.util.ts` parses amounts; it replaced `replace(/\D/g, '')`, which read
  `10000.50` as 1 000 050.

## Shared plumbing: @randan/tg-bot-kit

`BotKitModule.forRoot({ name, commands })` in `app.module.ts` gives `GET /health` (503 when a
registered check fails; the Docker healthcheck uses it), the admin-only unlisted **`/diag`**
(version from `GIT_SHA`, start time, checks, the sections services register through
`BotKitRegistry`) and the command menu, written to Telegram on startup (do not edit it in
BotFather). Env parsing, `FailureAlert` (admin alert once per hour + one "✅" on recovery),
`retry`, `withTimeout`, `createLimiter`, `isChatGone` come from the kit too: fix shared
behaviour there, not by copying code into a bot. `BotKitModule` must stay in the Telegraf
`include` list, or `/diag` is not picked up.

## Running, testing, deploying

- `npm run lint`, `npm run format:check`, `npm run build`, `npm test` (`npm run test:cov` enforces
  the coverage threshold). Unit tests use fakes, no network or database; `src/app.wiring.spec.ts`
  builds the real module graph, so a provider Nest cannot resolve fails in CI, not on the Pi.
- Every push to `master` runs the shared workflow `Randan/tg-bot-kit/.github/workflows/bot.yml@v1`:
  the checks, then the deploy to the Pi (R5oRR) over Tailscale. Nothing deploys if a check fails.
- `package-lock.json`: regenerate it on Linux (e.g. `docker run --rm -v "$PWD":/app -w /app
  node:24-alpine npm install --package-lock-only`). A lockfile written on macOS can miss Linux-only
  optional packages, and `npm ci` in CI then fails.
- On the Pi in `~/projects/<repo>`; `.env` exists **only on the Pi** (see `.env.example`).
  Logs go to journald and survive deploys: `docker logs <container>`.

## Debugging without shell access (cloud session, phone)

Send `/diag` to the bot as the admin (`ADMIN_TELEGRAM_ID`). The Pi is reachable only over
Tailscale; sudo needs the user's password. Say what could not be verified instead of guessing.
