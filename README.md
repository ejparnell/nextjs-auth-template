# Auth Template

A reusable **Next.js 15 / TypeScript** starter that ships a complete, production‑ready email‑password authentication flow. Copy the folder into any project (or click *Use this template* on GitHub) and you have sign‑up, sign‑in, email verification, password reset, rate‑limit, captcha, ESLint + Prettier, and strict security headers out of the box.

---

## ✨ Features

| Capability | Stack / Notes |
|------------|--------------|
| **Email + Password Sign‑up / Sign‑in** | NextAuth v4 Credentials provider |
| **Server‑side email verification** | Resend + hashed tokens in MongoDB |
| **Strong password policy** | 10 chars, upper/lower/number/symbol, zxcvbn score ≥ 3 |
| **Password‑reset flow** | 30 min tokens, same mailer / DB model |
| **Bot & abuse protection** | Cloudflare Turnstile captcha + Upstash Redis sliding‑window rate‑limit (5 req/hr per IP) |
| **Security headers** | CSP, HSTS, X‑Frame‑Options DENY, etc. (`next.config.js`) |
| **Type‑safe validation** | Zod 3 schemas shared client⇄server |
| **Database** | MongoDB via Mongoose 8 |
| **Hashing** | bcryptjs (Node runtime only) |
| **CI‑ready quality gate** | ESLint v9 flat‑config + Prettier + Husky pre‑commit |

---

## 📦 Tech Stack

- **Next.js 15** (App Router, Route Handlers)
- **TypeScript 5**
- **React 19**
- **NextAuth 4**
- **Mongoose 8**
- **Zod 3** for schemas
- **bcryptjs 5** for password hashing
- **Resend 4** – email delivery
- **@zxcvbn-ts** for entropy scoring
- **Cloudflare Turnstile** captcha (`react-turnstile` wrapper)
- **Upstash Redis + @upstash/ratelimit**
- **ESLint 9** & **Prettier** (shared config)

> **Why bcryptjs?** Native `bcrypt` fails in the Edge runtime; this template pins `/api/*` routes to Node anyway, but `bcryptjs` avoids native bindings for easy deploy everywhere.

---

## 🗺️ Routes

### Public pages

| Path | Purpose |
|------|---------|
| `/signin` | Email + password sign‑in |
| `/signup` | New account registration |
| `/forgot-password` | Request password reset link |
| `/reset-password?token=…&email=…` | Set new password |
| `/verify-email` | Success landing from verification |
| `/logout` | Client‑side sign‑out helper |

### API / backend

| Method & Path | Description |
|---------------|-------------|
| `POST /api/auth/signup` | Create user & send verification mail |
| `POST /api/auth/signin` | NextAuth credentials endpoint |
| `GET /api/auth/session` | NextAuth session fetch |
| `POST /api/auth/request-password-reset` | Send reset link |
| `POST /api/auth/reset-password` | Verify token & update hash |
| `GET /api/verify-email` | Mark `emailVerified`, delete token |
| `GET /api/health` | Simple 200 OK for load balancers |

---

## 🗄️ Entity‑Relationship Diagram

```text
┌────────────┐   1          * ┌────────────────────┐
│   User     │───────────────►│ VerificationToken  │
└────────────┘                └────────────────────┘
| _id        |                | _id                |
| name       |                | userId             |
| email      |                | tokenHash          |
| password   |                | kind               |
| emailVerified               | expiresAt          |
└────────────┘                └────────────────────┘
```

### User

- `_id` – MongoDB ObjectId
- `name` – User’s display name
- `email` – User’s email address (unique)
- `password` – Hashed password (bcrypt)
- `emailVerified` – Date of email verification (or `null`)

### VerificationToken

- `_id` – MongoDB ObjectId
- `userId` – User’s ObjectId
- `tokenHash` – SHA256 hash of the token
- `kind` – `email` or `password`
- `expiresAt` – Date of expiration (30 min from creation)

---

## 🚀 Quick start

```bash
# 1 · Clone template or click “Use this template”
pnpm install

# 2 · Set environment variables
cp .env.example .env.local
# → fill NEXTAUTH_SECRET, DATABASE_URL, RESEND_API_KEY, etc.

# 3 · Run locally
pnpm dev
```

Navigate to **<http://localhost:3000/signup>** and register.

---

## 🔧 Environment Variables

| Key | Example | Required | Description |
|-----|---------|----------|-------------|
| `DATABASE_URL` | `mongodb+srv://user:pass@cluster0/db` | ✅ | Mongo connection string |
| `NEXTAUTH_SECRET` | `super_long_random` | ✅ | JWT encryption key |
| `NEXTAUTH_URL` | `http://localhost:3000` | ✅ | Base URL (prod = your domain) |
| `RESEND_API_KEY` | `re_live_xxx` | ✅ | Resend API key |
| `MAIL_FROM` | `Auth <no‑reply@acme.dev>` | ✅ | Verified sender |
| `TURNSTILE_SITEKEY` | `0x4AAA…` | ✅ | Public site key |
| `TURNSTILE_SECRET` | `0x4AAA…` | ✅ | Secret key for server verify |
| `UPSTASH_REDIS_REST_URL` | `https://us1.low...` | ✅ | Upstash REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | `AZABC...` | ✅ | Upstash token |

---

## 📑 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Next.js in dev mode |
| `pnpm build` / `pnpm start` | Production build / start |
| `pnpm lint` | Run ESLint + Prettier checks |
| `pnpm lint:fix` | Auto‑fix & format staged files |

---

## 🛡️ Security Hardening

* **CSP** – Only self + Turnstile scripts; hashed inline bootstrap
* **HSTS** – 6 months + preload
* **Rate‑limit** – 5 sensitive actions/hour/IP (Upstash Redis)
* **Captcha** – Turnstile auto‑passes real browsers, blocks bots
* **Password hashing** – bcryptjs with cost 10
* **Tokens** – 32‑byte random, SHA‑256 hashed at rest

---

## 🗺️ Future roadmap

- OAuth providers (Google, GitHub)
- TOTP / WebAuthn MFA
- Storybook components
- Docker Compose (Next + Mongo + Redis)

Feel free to open PRs or issues—happy building! 🎉
