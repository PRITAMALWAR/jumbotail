import express from 'express';
import { searchAndRank } from '../search/ranking.js';

export default function searchRouter(store) {
  const router = express.Router();

  router.get('/search/product', (req, res, next) => {
    try {
      const q = (req.query.query || '').toString();
      const limit = Math.min(100, Number(req.query.limit) || 50);
      const data = searchAndRank(store.list(), q, limit);
      return res.json({ data });
    } catch (e) {
      return next(e);
    }
  });

  return router;
}
