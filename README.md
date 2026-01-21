# backend-api (AGROFARM)

API principal de AGROFARM (Node.js 18+, Express, PostgreSQL vía Supabase).

## Requisitos
- Node.js 18+
- PostgreSQL (Supabase pooler)

## Instalación
```bash
npm install
cp .env.example .env  # luego completa valores
npm start
```

## Variables de entorno
- `PORT` (ej. 4000)
- `DATABASE_URL` (cadena Supabase, pooler)
- `FRONTEND_ORIGIN` (orígenes permitidos, separados por coma)

## Scripts
- `npm start` → `node src/index.js`
- (opcional) añade `npm run dev` con nodemon si lo prefieres.

## Endpoints
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Pigs: `GET /api/pigs`, `GET /api/pigs/:id`, `POST /api/pigs`, `PUT /api/pigs/:id`, `PATCH /api/pigs/:id/status`, `DELETE /api/pigs/:id`

## Salud
- `GET /health` (usa la conexión a BD).

## Deploy
- Render/Railway: set `DATABASE_URL`, `PORT`, `NODE_VERSION` (18+). Health check `/health`.
