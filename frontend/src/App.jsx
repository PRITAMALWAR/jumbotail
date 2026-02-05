import React, { useEffect, useMemo, useState } from 'react'

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const v = localStorage.getItem(key)
      return v != null ? JSON.parse(v) : initialValue
    } catch {
      return initialValue
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state])
  return [state, setState]
}

export default function App() {
  // Leave empty to use Vite proxy (recommended in dev). Set a full URL to bypass proxy.
  const [query, setQuery] = useState('iphone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  const api = useMemo(() => '', [])

  async function search(q) {
    if (!q) return
    setLoading(true)
    setError('')
    try {
      const base = api // empty string => same-origin; Vite proxy forwards to backend
      const res = await fetch(`${base}/api/v1/search/product?query=${encodeURIComponent(q)}&limit=20`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setItems(data?.data || [])
    } catch (e) {
      setError('Failed to fetch results. Check backend URL and CORS.')
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    search(query)
  }

  useEffect(() => { search('iphone') }, [])

  return (
    <div className="container">
      <h1>Electronics Search</h1>

      <form className="panel" onSubmit={onSubmit}>
        <label>Query</label>
        <div className="row">
          <input placeholder="Try: Ifone 16, Sastha wala iPhone, iPhone 50k rupees, iPhone cover strong" value={query} onChange={e => setQuery(e.target.value)} />
          <button type="submit">Search</button>
        </div>
      </form>

      {loading && <div className="status">Searching...</div>}
      {error && <div className="status error">{error}</div>}

      <Results items={items} />
    </div>
  )
}

function Results({ items }) {
  if (!items?.length) return <div className="empty">No results</div>
  return (
    <div className="grid">
      {items.map(p => (
        <div key={p.productId} className="card">
          <div className="title">{p.title}</div>
          <div className="desc">{p.description}</div>
          <div className="meta">
            <span><strong>MRP:</strong> ₹{fmt(p.mrp)}</span>
            <span><strong>Price:</strong> ₹{fmt(p.Sellingprice)}</span>
            <span><strong>Stock:</strong> {p.stock}</span>
            {p.score != null && <span><strong>Score:</strong> {p.score}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function fmt(n) {
  try { return Number(n).toLocaleString('en-IN') } catch { return n }
}
