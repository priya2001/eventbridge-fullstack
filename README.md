# EventBridge

Requirement posting app for the GoPratle assignment. This first step provides a Next.js frontend and Express API. The form and MongoDB integration will be added in subsequent steps.

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

The default configuration works without environment files. To customize the backend port, copy `server/.env.example` to `server/.env` and change `PORT`.

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

The health endpoint checks that Express is running; it does not check a database connection.

Production builds use Next.js's supported Webpack option because Turbopack's build workers encountered a local port permission restriction in the development environment.

## Structure

- `client/`: Next.js App Router, TypeScript, Tailwind CSS
- `server/src/index.js`: Express server and health route

Do not commit `.env` files or database credentials.
