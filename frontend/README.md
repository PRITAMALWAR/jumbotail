# Frontend

React (Vite) app for product search UI.

## Folder structure

```
frontend/
├─ package.json
├─ vite.config.js           # Dev server + proxy to backend
├─ index.html               # Vite HTML entry
├─ server.js                # (optional) simple static server for preview
├─ public/
│  ├─ index.html            # Static demo page (no React)
│  └─ app.js                # Static demo logic (uses window.BACKEND_URL or relative)
└─ src/
   ├─ main.jsx              # React/Vite bootstrap
   ├─ App.jsx               # Search UI (uses VITE_BACKEND_URL in prod, proxy in dev)
   └─ styles.css            # Basic styles
```

## Scripts

- `npm run dev` → start Vite dev server
- `npm run build` → build production assets
- `npm run preview` → preview production build locally

## Local development

Backend must be running (default http://localhost:8000).

```
cd frontend
npm install
npm run dev
# Open the printed URL (e.g., http://localhost:5173)
```

Vite proxy is configured to forward `/api` and `/health` to:
- `process.env.VITE_BACKEND_URL` if set, else `http://localhost:8000`.

So in dev you can leave API calls as relative paths (e.g. `/api/v1/...`).

## Production configuration

Set the environment variable during build:
- `VITE_BACKEND_URL=https://your-backend.onrender.com`

The app will then call `${VITE_BACKEND_URL}/api/...` at runtime.

For Render Static Sites:
- Build Command: `npm --prefix frontend run build`
- Publish Directory: `frontend/dist`
- Environment Variable: `VITE_BACKEND_URL` pointing to your deployed backend

## API endpoints used

- `GET /api/v1/search/product?query=iphone&limit=20`

## Static public demo

Under `public/`, a plain HTML/JS demo is provided. It uses `window.BACKEND_URL` if defined globally, otherwise relative `/api` paths (useful with a reverse proxy).
