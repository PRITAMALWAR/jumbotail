import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CatalogStore } from './catalog/store.js';
import productRouter from './routes/product.js';
import searchRouter from './routes/search.js';
import { generateAndSeed } from './data/generate.js';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce Search Backend running',
    health: '/health',
    search: '/api/v1/search/product?query=iphone',
    create: 'POST /api/v1/product',
    updateMetadata: 'PUT /api/v1/product/meta-data'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export const store = new CatalogStore();
await generateAndSeed(store, { count: 1500 });

app.use('/api/v1', productRouter(store));
app.use('/api/v1', searchRouter(store));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

async function startServer(port, attemptsLeft = 3) {
  return new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`);
        resolve(server);
      })
      .on('error', async (err) => {
        if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
          const nextPort = port + 1;
          console.warn(`Port ${port} in use, retrying on ${nextPort}...`);
          try {
            const s = await startServer(nextPort, attemptsLeft - 1);
            resolve(s);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(err);
        }
      });
  });
}

await startServer(PORT).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
