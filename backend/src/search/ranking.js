import Fuse from 'fuse.js';

const COLOR_WORDS = ['black','white','blue','red','green','purple','yellow','silver','gold','graphite','gray','grey'];
const ACCESSORY_WORDS = ['cover','case','screen guard','tempered','charger','cable','power bank','protector'];

const HINGLISH_PRICE_LOW = ['sasta','sastha','cheap','low price','budget','kam daam','kam price'];

function normalize(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\.\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePriceFromQuery(q) {
  const text = q.replace(/,/g, '');
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(lakh|lac|l)/);
  if (lakhMatch) {
    const n = parseFloat(lakhMatch[1]);
    return Math.round(n * 100000);
  }
  const kMatch = text.match(/(\d+(?:\.\d+)?)\s*k/);
  if (kMatch) {
    const n = parseFloat(kMatch[1]);
    return Math.round(n * 1000);
  }
  const rsMatch = text.match(/(?:rs|inr|rupees|price)\s*(\d{4,7})/);
  if (rsMatch) return parseInt(rsMatch[1], 10);
  const plain = text.match(/\b(\d{4,7})\b/);
  if (plain) return parseInt(plain[1], 10);
  return null;
}

function parseFilters(q) {
  const query = normalize(q);
  const wantCheap = HINGLISH_PRICE_LOW.some(w => query.includes(w));
  const priceMax = parsePriceFromQuery(query);
  const colors = COLOR_WORDS.filter(c => query.includes(c));
  const storageMatch = query.match(/\b(64|128|256|512)\s?gb\b/);
  const storage = storageMatch ? `${storageMatch[1]}GB` : null;
  const categoryHint = ACCESSORY_WORDS.some(w => query.includes(w)) ? 'accessory' : null;
  return { wantCheap, priceMax, colors, storage, categoryHint };
}

function buildFuseIndex(items) {
  const fuse = new Fuse(items, {
    includeScore: true,
    shouldSort: false,
    threshold: 0.4,
    ignoreLocation: true,
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.2 },
      { name: 'brand', weight: 0.2 },
      { name: 'category', weight: 0.1 },
      { name: 'metadata.model', weight: 0.3 },
      { name: 'metadata.storage', weight: 0.15 },
      { name: 'metadata.color', weight: 0.15 }
    ]
  });
  return fuse;
}

function normalizeRange(x, min, max) {
  if (x == null) return 0;
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (x - min) / (max - min)));
}

function scoreProduct(p, baseMatchScore, filters, stats) {
  let score = baseMatchScore;
  if (p.stock <= 0) score -= 0.2; else score += Math.min(0.1, p.stock / 10000);
  const ratingPart = (p.rating || 0) / 5;
  const popularityPart = Math.log10((p.numberSold || 0) + 1) / (Math.log10((stats.maxSold || 1) + 1) || 1);
  score += 0.25 * ratingPart + 0.2 * popularityPart;
  const recency = normalizeRange(p.releaseYear || 0, stats.minYear || 2015, stats.maxYear || 2026);
  score += 0.1 * recency;
  const priceNorm = normalizeRange(p.price, stats.minPrice, stats.maxPrice);
  const cheapBoost = filters.wantCheap ? (1 - priceNorm) * 0.25 : 0;
  score += cheapBoost;
  if (filters.priceMax) {
    if (p.price > filters.priceMax) score -= 0.4;
    else {
      const under = (filters.priceMax - p.price) / Math.max(1, filters.priceMax);
      score += 0.15 * Math.max(0, Math.min(1, under));
    }
  }
  const isAccessory = p.category === 'accessory';
  if (filters.categoryHint === 'accessory') {
    if (isAccessory) score += 0.15; else score -= 0.1;
  } else {
    const phoneCues = /(iphone|samsung|galaxy|redmi|mi|oneplus|pixel|vivo|oppo|nothing|motorola)/;
    if (phoneCues.test(normalize(p.title + ' ' + p.description + ' ' + (p.brand || ''))) && isAccessory) {
      score -= 0.1;
    }
  }
  if (filters.colors && filters.colors.length) {
    const pColor = normalize(p.color || p.metadata?.color || '');
    if (filters.colors.some(c => pColor.includes(c))) score += 0.08; else score -= 0.05;
  }
  if (filters.storage) {
    const pStorage = normalize(p.metadata?.storage || '');
    if (pStorage.includes(filters.storage.toLowerCase())) score += 0.06; else score -= 0.03;
  }
  const rr = p.returnRate || 0;
  score -= Math.min(0.15, rr * 0.5);
  return score;
}

export function searchAndRank(allProducts, query, limit = 50) {
  const q = normalize(query || '');
  const filters = parseFilters(q);
  const items = allProducts.map(p => ({ ...p, title: p.title, description: p.description }));
  const fuse = buildFuseIndex(items);
  const fuseResults = q ? fuse.search(q) : items.map(p => ({ item: p, score: 0.5 }));
  const stats = {
    minPrice: Math.min(...allProducts.map(p => p.price || 0), 0),
    maxPrice: Math.max(...allProducts.map(p => p.price || 0), 1),
    minYear: Math.min(...allProducts.map(p => p.releaseYear || 2015)),
    maxYear: Math.max(...allProducts.map(p => p.releaseYear || 2026)),
    maxSold: Math.max(...allProducts.map(p => p.numberSold || 0), 1)
  };
  const scored = fuseResults.map(r => {
    const p = r.item || r;
    const base = 1 - Math.min(1, (r.score ?? 0.7));
    const s = scoreProduct(p, base, filters, stats);
    return { product: p, score: s, baseScore: base };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(r => ({
    productId: r.product.productId,
    title: r.product.title,
    description: r.product.description,
    mrp: r.product.mrp,
    Sellingprice: r.product.price,
    Metadata: r.product.metadata,
    stock: r.product.stock,
    score: Number(r.score.toFixed(4))
  }));
}
