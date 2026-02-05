

export class CatalogStore {
  constructor() {
    this.products = new Map();
    this.nextId = 1;
  }

  list() {
    return Array.from(this.products.values());
  }

  get(id) {
    return this.products.get(Number(id)) || null;
  }

  create(product) {
    const id = this.nextId++;
    const now = new Date().toISOString();
    const doc = {
      productId: id,
      title: product.title,
      description: product.description || '',
      rating: Number(product.rating) || 0,
      stock: Number(product.stock) || 0,
      price: Number(product.price) || 0,
      mrp: Number(product.mrp) || Number(product.price) || 0,
      currency: product.currency || 'INR',
      metadata: product.metadata || {},
      numberSold: Number(product.numberSold) || 0,
      reviewCount: Number(product.reviewCount) || 0,
      returnRate: Number(product.returnRate) || 0,
      releaseYear: Number(product.releaseYear) || null,
      color: product.color || null,
      brand: product.brand || null,
      category: product.category || null,
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(id, doc);
    return doc;
  }

  updateMetadata(productId, metadata) {
    const id = Number(productId);
    const p = this.products.get(id);
    if (!p) return null;
    p.metadata = { ...p.metadata, ...metadata };
    p.updatedAt = new Date().toISOString();
    return p;
  }
}
