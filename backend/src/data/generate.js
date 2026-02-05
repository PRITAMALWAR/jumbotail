// Synthetic data generator (no external deps)
function simpleRandomPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const BRANDS = {
  phone: ['Apple', 'Samsung', 'Xiaomi', 'Realme', 'OnePlus', 'Vivo', 'Oppo', 'Motorola', 'Nothing'],
  laptop: ['Apple', 'Lenovo', 'HP', 'Dell', 'Acer', 'Asus', 'MSI'],
  audio: ['Sony', 'JBL', 'boAt', 'OnePlus', 'Sennheiser', 'Realme', 'Noise'],
  accessory: ['Spigen', 'Ringke', 'UAG', 'boAt', 'Portronics', 'Ambrane']
};

const COLORS = ['black', 'white', 'blue', 'red', 'green', 'purple', 'yellow', 'silver', 'graphite'];
const CATEGORIES = ['phone', 'laptop', 'audio', 'accessory'];

function makeTitle(p) {
  const parts = [p.brand];
  if (p.category === 'phone') parts.push(p.modelName);
  if (p.category === 'laptop') parts.push(p.modelName);
  if (p.category === 'audio') parts.push(p.formFactor);
  if (p.category === 'accessory') parts.push(p.accessoryType);
  if (p.storage) parts.push(`${p.storage}`);
  if (p.color) parts.push(p.color);
  return parts.filter(Boolean).join(' ');
}

function randomPhone() {
  const brand = simpleRandomPick(BRANDS.phone);
  const series = brand === 'Apple' ? 'iPhone' : simpleRandomPick(['Galaxy', 'Note', 'Nord', 'Redmi', 'Mi', 'Moto', 'Vivo', 'Oppo']);
  const modelNum = brand === 'Apple' ? randInt(6, 17) : randInt(5, 24);
  const proTag = Math.random() < 0.25 ? ' Pro' : '';
  const modelName = `${series} ${modelNum}${proTag}`;
  const storage = simpleRandomPick(['64GB', '128GB', '256GB', '512GB']);
  const ram = simpleRandomPick(['4GB', '6GB', '8GB', '12GB']);
  const color = simpleRandomPick(COLORS);
  const rating = Math.round((3 + Math.random() * 2) * 10) / 10;
  const reviewCount = randInt(10, 3000);
  const numberSold = randInt(50, 50000);
  const stock = randInt(0, 2000);
  const releaseYear = randInt(2017, 2026);
  const mrp = brand === 'Apple' ? randInt(40000, 160000) : randInt(6000, 90000);
  const discountPct = Math.random() * 0.35;
  const price = Math.max(999, Math.round(mrp * (1 - discountPct)));

  const p = {
    brand,
    category: 'phone',
    modelName,
    storage,
    ram,
    color,
    rating,
    reviewCount,
    numberSold,
    stock,
    releaseYear,
    mrp,
    price,
    description: `${brand} ${modelName} with ${ram} RAM and ${storage}, ${color} color. ` +
      `Brilliant OLED display, long battery life, dual SIM, 5G.`,
    metadata: {
      model: modelName,
      storage,
      ram,
      color,
      screensize: `${(5.5 + Math.random() * 2.2).toFixed(1)} inches`,
      brightness: `${randInt(300, 3000)} nits`,
      display: simpleRandomPick(['OLED', 'AMOLED', 'LCD', 'LTPO AMOLED', 'IPS LCD']),
      battery: `${randInt(3000, 6000)} mAh`,
    }
  };
  p.title = makeTitle(p);
  return p;
}

function randomLaptop() {
  const brand = simpleRandomPick(BRANDS.laptop);
  const modelName = `${simpleRandomPick(['Pro', 'Air', 'Slim', 'Gaming', 'Book'])} ${randInt(13, 17)}`;
  const storage = simpleRandomPick(['256GB', '512GB', '1TB']);
  const ram = simpleRandomPick(['8GB', '16GB', '32GB']);
  const color = simpleRandomPick(['silver', 'black', 'gray']);
  const rating = Math.round((3 + Math.random() * 2) * 10) / 10;
  const reviewCount = randInt(10, 3000);
  const numberSold = randInt(20, 30000);
  const stock = randInt(0, 1000);
  const releaseYear = randInt(2017, 2026);
  const mrp = randInt(25000, 250000);
  const discountPct = Math.random() * 0.3;
  const price = Math.max(9999, Math.round(mrp * (1 - discountPct)));

  const p = {
    brand,
    category: 'laptop',
    modelName,
    storage,
    ram,
    color,
    rating,
    reviewCount,
    numberSold,
    stock,
    releaseYear,
    mrp,
    price,
    description: `${brand} ${modelName} laptop with ${ram} RAM and ${storage}, ${color} color. ` +
      `IPS display, backlit keyboard, long battery life.`,
    metadata: {
      model: modelName,
      storage,
      ram,
      color,
      screensize: `${randInt(13, 17)} inches`,
      brightness: `${randInt(250, 500)} nits`,
      cpu: simpleRandomPick(['i5', 'i7', 'Ryzen 5', 'Ryzen 7']),
      gpu: simpleRandomPick(['Integrated', 'RTX 3050', 'RTX 3060', 'RTX 4060'])
    }
  };
  p.title = makeTitle(p);
  return p;
}

function randomAudio() {
  const brand = simpleRandomPick(BRANDS.audio);
  const formFactor = simpleRandomPick(['Earbuds', 'Headphones', 'Neckband', 'Speaker']);
  const color = simpleRandomPick(COLORS);
  const rating = Math.round((3 + Math.random() * 2) * 10) / 10;
  const reviewCount = randInt(5, 5000);
  const numberSold = randInt(50, 100000);
  const stock = randInt(0, 5000);
  const releaseYear = randInt(2018, 2026);
  const mrp = randInt(499, 29999);
  const discountPct = Math.random() * 0.5;
  const price = Math.max(199, Math.round(mrp * (1 - discountPct)));

  const p = {
    brand,
    category: 'audio',
    formFactor,
    color,
    rating,
    reviewCount,
    numberSold,
    stock,
    releaseYear,
    mrp,
    price,
    description: `${brand} ${formFactor} with deep bass, long battery life, fast charging.`,
    metadata: {
      color,
      battery: `${randInt(10, 70)} hours`,
      latency: `${randInt(30, 200)} ms`
    }
  };
  p.title = makeTitle(p);
  return p;
}

function randomAccessory() {
  const brand = simpleRandomPick(BRANDS.accessory);
  const accessoryType = simpleRandomPick(['Cover', 'Screen Guard', 'Charger', 'Cable', 'Power Bank']);
  const color = simpleRandomPick(COLORS);
  const rating = Math.round((3 + Math.random() * 2) * 10) / 10;
  const reviewCount = randInt(0, 2000);
  const numberSold = randInt(10, 80000);
  const stock = randInt(0, 8000);
  const releaseYear = randInt(2018, 2026);
  const mrp = randInt(149, 4999);
  const discountPct = Math.random() * 0.6;
  const price = Math.max(99, Math.round(mrp * (1 - discountPct)));

  const p = {
    brand,
    category: 'accessory',
    accessoryType,
    color,
    rating,
    reviewCount,
    numberSold,
    stock,
    releaseYear,
    mrp,
    price,
    description: `${brand} ${accessoryType} durable and strong, compatible with multiple devices.`,
    metadata: {
      color,
      strength: simpleRandomPick(['standard', 'strong', 'ultra-strong'])
    }
  };
  p.title = makeTitle(p);
  return p;
}

export async function generateAndSeed(store, { count = 1200 } = {}) {
  const gens = [randomPhone, randomLaptop, randomAudio, randomAccessory];
  for (let i = 0; i < count; i++) {
    const g = simpleRandomPick(gens);
    const base = g();
    store.create({
      title: base.title,
      description: base.description,
      rating: base.rating,
      stock: base.stock,
      price: base.price,
      mrp: base.mrp,
      currency: 'INR',
      metadata: base.metadata,
      numberSold: base.numberSold,
      reviewCount: base.reviewCount,
      returnRate: Math.random() * 0.15,
      releaseYear: base.releaseYear,
      color: base.color,
      brand: base.brand,
      category: base.category,
    });
  }
}
