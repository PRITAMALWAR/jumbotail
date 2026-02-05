# Backend

Express microservice for e-commerce product search and ranking (in-memory).

## Folder structure

```
backend/
├─ package.json
├─ package-lock.json
└─ src/
   ├─ index.js                # App entry, server start (uses PORT env or 8000)
   ├─ catalog/
   │  └─ store.js            # In-memory product store
   ├─ data/
   │  └─ generate.js         # Dataset generator + seeding
   ├─ routes/
   │  ├─ product.js          # POST /api/v1/product, PUT /api/v1/product/meta-data
   │  └─ search.js           # GET /api/v1/search/product
   └─ search/
      └─ ranking.js          # Ranking + fuzzy search
```

## Scripts

- `npm start` → start server (`node src/index.js`)
- `npm run dev` → dev with nodemon

## Local development

```
cd backend
npm install
npm start
# Server on http://localhost:8000
```

Health check:
- GET `http://localhost:8000/health` → `{ "status": "ok" }`

## API

- GET `/api/v1/search/product?query=iphone&limit=20`
  - Response: `{ data: Product[] }`
- POST `/api/v1/product`
  - body: `{ title, price, mrp, description?, ... }`
  - response: `{ productId }`
- PUT `/api/v1/product/meta-data`
  - body: `{ productId, Metadata: { ... } }`
  - response: `{ productId, Metadata }`

## Deployment notes

- Binds to `process.env.PORT` (required by Render/Heroku). Default `8000`.
- No database; data is seeded in-memory on boot via `generateAndSeed`.
