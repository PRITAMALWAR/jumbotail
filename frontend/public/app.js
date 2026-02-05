const form = document.getElementById('searchForm');
const queryEl = document.getElementById('query');
const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');

function renderResults(items) {
  if (!items || !items.length) {
    resultsEl.innerHTML = '<div class="empty">No results</div>';
    return;
  }
  const html = items.map(p => `
    <div class="card">
      <div class="title">${escapeHtml(p.title)}</div>
      <div class="desc">${escapeHtml(p.description || '')}</div>
      <div class="meta">
        <span><strong>MRP:</strong> ₹${fmt(p.mrp)}</span>
        <span><strong>Price:</strong> ₹${fmt(p.Sellingprice)}</span>
        <span><strong>Stock:</strong> ${p.stock}</span>
        <span><strong>Score:</strong> ${p.score}</span>
      </div>
    </div>
  `).join('');
  resultsEl.innerHTML = html;
}

function fmt(n) {
  try { return Number(n).toLocaleString('en-IN'); } catch { return n; }
}

function escapeHtml(s) {
  return (s || '').toString().replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

async function doSearch(q) {
  const base = (typeof window !== 'undefined' && window.BACKEND_URL) ? window.BACKEND_URL.replace(/\/$/, '') : '';
  const url = `${base}/api/v1/search/product?query=${encodeURIComponent(q)}&limit=20`;
  statusEl.textContent = 'Searching...';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderResults(data.data || []);
    statusEl.textContent = `Found ${(data.data || []).length} results`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Error fetching results. Check backend URL and CORS.';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = queryEl.value.trim();
  if (!q) return;
  doSearch(q);
});

// Run a default search on load
setTimeout(() => doSearch('iphone'), 500);
