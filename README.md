# EventBridge

Requirement posting app for the GoPratle assignment. It provides a four-step Next.js requirement form and an Express + MongoDB API.

## Requirements

- Node.js 22.9 or newer
- npm

## Run locally

From the repository root:

```sh
npm install
npm run dev
```

In a second terminal, also from the repository root:

```sh
npm run dev:server
```

- Frontend: http://localhost:3000
- Backend health: http://localhost:4000/api/health

For MongoDB storage, copy `server/.env.example` to `server/.env`, then set `MONGODB_URI` to your MongoDB Atlas connection string. Keep the real `.env` file private. The frontend defaults to `http://localhost:4000`; optionally copy `client/.env.example` to `client/.env.local` to configure a different API URL.

## Verification

```sh
npm run lint
npm run check:server
npm run build
curl -i http://localhost:4000/api/health
```

Health endpoint response (HTTP 200):

```json
{"status":"ok","service":"eventbridge-api"}
```

The health endpoint reports whether the database is connected. Records are saved with `POST /api/requirements`; it returns `201 Created` and the saved record ID when MongoDB is configured.

Production builds use Next.js's supported Webpack option because Turbopack's build workers encountered a local port permission restriction in the development environment.

## Structure

- `client/`: Next.js App Router, TypeScript, Tailwind CSS
- `server/src/index.js`: Express API, validation, MongoDB connection
- `server/src/requirement.js`: Mongoose requirement model

Do not commit `.env` files or database credentials.
