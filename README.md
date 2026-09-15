# ForBist

ForBist is a web application for BIST (Borsa Istanbul) investors that brings together portfolio tracking, market data, AI-powered analysis, and up-to-date market news in a single dashboard.

## Features

- **Portfolio Management** — Buy/sell transactions, average cost, current value, and profit/loss tracking
- **Dashboard** — Portfolio summary, BIST 100 and gram gold data, portfolio value chart
- **AI Assistant** — OpenAI-powered chat assistant that answers questions based on the user's portfolio
- **IPOs** — Calendar of current and upcoming initial public offerings
- **News** — Up-to-date (today/yesterday) news for the Turkish and US markets, one click to the source
- **Transaction History** — List and search of all buy/sell transactions
- **Authentication** — JWT-based, secure session management with an httpOnly cookie

## Tech Stack

**Backend**
- Node.js / Express 5
- MySQL (`mysql2`)
- JWT (`jsonwebtoken`) + `bcryptjs` for authentication
- `zod` for input validation
- `helmet`, `express-rate-limit`, `cors` for security
- `axios` + `cheerio` for fetching market data and news sources
- OpenAI API integration (AI assistant)

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Recharts (charts)
- Lucide React (icons)
- AOS (scroll animations)

## Project Structure

```
ForBist/
├── backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/        # DB connection
│       ├── controllers/    # Route handlers
│       ├── middleware/     # Auth middleware
│       ├── routes/         # API route definitions
│       ├── services/       # Business logic, third-party integrations
│       └── tools/          # AI assistant tool definitions
└── frontend/
    └── src/
        ├── components/     # Shared UI components (Sidebar, Header, cards...)
        └── pages/          # Pages (Landing, Dashboard, Portfolio, News...)
```

## Setup

### Prerequisites

- Node.js 18+
- A MySQL database with `users`, `portfolios`, and `transactions` tables

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in the values
npm run dev             # development mode with nodemon
# or
node server.js
```

Values to fill in `.env`:

| Variable | Description |
|---|---|
| `PORT` | API server port (default: 3000) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection details |
| `JWT_SECRET` | Secret key for session tokens |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `1d`) |
| `OPENAI_API_KEY` | OpenAI API key for the AI assistant |
| `MARKET_API_KEY` | API key for the stock price provider |

By default the backend runs at `http://localhost:3000` and only accepts requests from the `http://localhost:5173` origin.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

## API Endpoints (summary)

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Session info |
| GET | `/api/portfolio` | Portfolio and holdings list |
| GET | `/api/portfolio/summary` | Portfolio summary |
| GET | `/api/portfolio/history` | Portfolio value history |
| POST | `/api/transactions` | Create a buy/sell transaction |
| GET | `/api/ipos` | IPO calendar |
| GET | `/api/market` | BIST 100 and gram gold data |
| GET | `/api/news` | Turkish and US market news (today/yesterday) |
| POST | `/api/ai/chat` | Chat with the AI assistant |

## Notes

- Market data and news are fetched in real time from third-party sources (Yahoo Finance, Bigpara, Anadolu Ajansı, MarketWatch, halkarz.com); changes to those sources' structure can affect the corresponding services.
- The repo does not include a database migration file; you'll need to create the schema by hand based on the fields used in the queries.
