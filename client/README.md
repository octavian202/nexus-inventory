# Nexus Inventory — Client

React + Vite frontend for the `nexus_inventory` backend.

## Run (dev)

From `C:\proiecte\nexus_inventory\client`:

```bash
npm install
npm run dev
```

By default the dev server **proxies** any request starting with `/api` to `http://localhost:8080` (see `vite.config.ts`), so you can call the backend without dealing with CORS during development.

## Backend API used

- `GET /api/v1/products`
- `POST /api/v1/products`
- `PATCH /api/v1/products/{id}/stock` with body `{ "adjustment": 10 }`

## Config

Optional environment variable:

- `VITE_API_BASE_URL` (default: empty, so the app uses relative `/api/...` URLs)

If you build/host the frontend on a different origin than the backend, you’ll either need:
- proper backend CORS configuration, or
- a reverse proxy that serves `/api/*` from the backend.

