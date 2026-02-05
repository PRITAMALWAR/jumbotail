# E-commerce Search Microservice (Beginner-friendly, Node.js/Express)

This project is a small Express microservice that supports product catalog storage in-memory and a powerful search with ranking for electronics (phones, laptops, audio, accessories). It seeds 1000+ synthetic products at startup so you can test immediately.

Latency goal: < 1000 ms for typical queries (in-memory + Fuse.js + custom scoring).

## Features
- Store products with attributes (title, description, price, mrp, rating, stock, etc.)
- Update product metadata (ram, storage, screen size, model, color, etc.)
- Search API with ranking that handles:
  - Typos (e.g., "Ifone 16")
  - Hinglish intents (e.g., "sasta"/"budget")
  - Colors and storage (e.g., "iPhone 16 red", "more storage")
  - Budget constraints (e.g., "iPhone 50k")
  - Accessory intent (e.g., "iPhone cover strong")

## Tech Stack
- Node.js 18+
- Express 4
- Fuse.js (fuzzy search)
- In-memory store (simple Map)

## Getting Started
1. Install dependencies
```
npm install
```

2. Run the service
```
npm run dev
# or
npm start
```

3. Service will start at
```
http://localhost:3000
```

Health check:
```
GET http://localhost:3000/health
```

On startup, the service seeds ~1500 synthetic products across categories.

## APIs
Base path: `/api/v1`

1) Store Product in Catalog
- Endpoint: `POST /api/v1/product`
- Body example:
```json
{
  "title": "Iphone 17",
  "description": "6.3-inch 120Hz ProMotion OLED display...",
  "rating": 4.2,
  "stock": 1000,
  "price": 81999,
  "mrp": 82999,
  "currency": "INR"
}
```
- Response:
```json
{ "productId": 101 }
```
- Curl:
```
curl -X POST http://localhost:3000/api/v1/product \
  -H 'Content-Type: application/json' \
  -d '{
    "title":"Iphone 17",
    "description":"6.3-inch 120Hz ProMotion OLED display...",
    "rating":4.2,
    "stock":1000,
    "price":81999,
    "mrp":82999,
    "currency":"INR"
  }'
```

2) Update Metadata for the Product
- Endpoint: `PUT /api/v1/product/meta-data`
- Body example:
```json
{
  "productId": 101,
  "Metadata": {
    "ram": "8GB",
    "screensize": "6.3 inches",
    "model": "Iphone 17",
    "storage": "128GB",
    "brightness": "3000 nits"
  }
}
```
- Response returns updated metadata

3) Search the Products
- Endpoint: `GET /api/v1/search/product?query=...&limit=50`
- Examples:
```
GET /api/v1/search/product?query=Latest%20iphone
GET /api/v1/search/product?query=Sastha%20wala%20iPhone
GET /api/v1/search/product?query=Ifone%2016
GET /api/v1/search/product?query=iPhone%2016%20red%20color
GET /api/v1/search/product?query=iPhone%2016%20more%20storage
GET /api/v1/search/product?query=iPhone%20cover%20strong
GET /api/v1/search/product?query=iPhone%2050k%20rupees
```
- Response shape:
```json
{
  "data": [
    {
      "productId": 80,
      "title": "Iphone 13",
      "description": "This is an iphone 13 64GB white colour",
      "mrp": 62999,
      "Sellingprice": 35000,
      "Metadata": { ... },
      "stock": 10,
      "score": 0.8231
    }
  ]
}
```

## Ranking Algorithm (simplified)
- Textual relevance via Fuse.js (title, description, brand, model, storage, color)
- Availability: in-stock gets a boost; out-of-stock penalized
- Quality and popularity: rating and numberSold (+ reviewCount via numberSold proxy)
- Recency: newer releaseYear boosted
- Price intent: "sasta" boosts cheaper items; budget parsed from query (e.g., 50k, 1.2L)
- Soft filters: color and storage if mentioned in query
- Accessory intent: words like cover/case/charger steer results toward accessories
- Return rate penalty

All signals are combined into a single score, then sorted descending.

## Project Structure
```
src/
  index.js              # App bootstrap, routes, seed
  catalog/store.js      # In-memory store
  data/generate.js      # Synthetic data generator
  routes/product.js     # Product create & metadata update
  routes/search.js      # Search endpoint
  search/ranking.js     # Query parsing + ranking logic
```

## Notes & Extensibility
- You can replace the in-memory `CatalogStore` with MongoDB/Postgres/Elasticsearch later.
- For better search: use Elasticsearch or Meilisearch and move the ranking signals to function score.
- To scrape real data, add a script using cheerio/puppeteer and map fields to the product model.
- LLM enrichment: call an LLM to extract extra attributes from descriptions (e.g., IP rating, chipset).

## Requirements mapping
- In-memory store: yes
- Metadata update: yes
- Search API and ranking: yes
- Typos/Hinglish/budget/color/storage/accessory: yes
- Error handling and <1000ms: typical queries satisfied for 1k+ products

## License
MIT
