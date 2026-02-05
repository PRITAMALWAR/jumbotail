import express from 'express';

export default function productRouter(store) {
  const router = express.Router();

  router.post('/product', (req, res, next) => {
    try {
      const body = req.body || {};
      if (!body.title || !body.price || !body.mrp) {
        return res.status(400).json({ error: 'title, price and mrp are required' });
      }
      const doc = store.create({
        title: body.title,
        description: body.description,
        rating: body.rating,
        stock: body.stock,
        price: body.price,
        mrp: body.mrp,
        currency: body.currency || 'INR',
        metadata: body.Metadata || body.metadata || {},
        numberSold: body.numberSold,
        reviewCount: body.reviewCount,
        returnRate: body.returnRate,
        releaseYear: body.releaseYear,
        color: body.color,
        brand: body.brand,
        category: body.category,
      });
      return res.status(201).json({ productId: doc.productId });
    } catch (e) {
      return next(e);
    }
  });

  router.put('/product/meta-data', (req, res, next) => {
    try {
      const body = req.body || {};
      const productId = body.productId;
      const metadata = body.Metadata || body.metadata;
      if (!productId || !metadata || typeof metadata !== 'object') {
        return res.status(400).json({ error: 'productId and Metadata are required' });
      }
      const doc = store.updateMetadata(productId, metadata);
      if (!doc) return res.status(404).json({ error: 'Product not found' });
      return res.json({ productId: doc.productId, Metadata: doc.metadata });
    } catch (e) {
      return next(e);
    }
  });

  return router;
}
