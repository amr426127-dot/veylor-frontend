import { useEffect, useState } from 'react'
import { api } from '../api/api'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [debugError, setDebugError] = useState('')
  const [debugPlain, setDebugPlain] = useState('')

  useEffect(() => {
    // Plain fetch test: no credentials, no custom headers (avoids CORS preflight)
    fetch('https://veylor.gt.tc/backend/api/products/list.php')
      .then((r) => r.text())
      .then((t) => setDebugPlain('نجح ✅ - أول 100 حرف: ' + t.slice(0, 100)))
      .catch((e) => setDebugPlain('فشل ❌ - ' + e.message))
  }, [])

  useEffect(() => {
    api.categories().then((d) => setCategories(d.categories)).catch((e) => setDebugError('categories: ' + e.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    setDebugError('')
    const params = {}
    if (category) params.category = category
    if (search) params.search = search
    api.listProducts(params)
      .then((d) => setProducts(d.products))
      .catch((e) => setDebugError('products: ' + e.message))
      .finally(() => setLoading(false))
  }, [category, search])

  return (
    <div className="wrap" style={{ padding: '48px 0 100px' }}>
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>THE COLLECTION</div>
        <h1 className="h-display" style={{ fontSize: 36 }}>المتجر</h1>
      </div>

      {debugError && (
        <div style={{ background: '#3a0d0d', color: '#ff9b9b', border: '1px solid #ff4d4d', borderRadius: 10, padding: '14px 18px', marginBottom: 12, fontSize: 14, wordBreak: 'break-word' }}>
          DEBUG ERROR (مع كوكيز): {debugError}
        </div>
      )}
      {debugPlain && (
        <div style={{ background: '#0d2a3a', color: '#9bd4ff', border: '1px solid #4dabff', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 14, wordBreak: 'break-word' }}>
          DEBUG PLAIN (بدون كوكيز): {debugPlain}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setCategory('')} className="btn"
            style={{ background: !category ? 'var(--ink)' : 'transparent', color: !category ? 'var(--bg)' : 'var(--ink-dim)', border: '1px solid var(--line)', padding: '8px 16px' }}>
            الكل
          </button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.slug)} className="btn"
              style={{ background: category === c.slug ? 'var(--ink)' : 'transparent', color: category === c.slug ? 'var(--bg)' : 'var(--ink-dim)', border: '1px solid var(--line)', padding: '8px 16px' }}>
              {c.name}
            </button>
          ))}
        </div>
        <input
          placeholder="ابحث عن ساعة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', color: 'var(--ink)', minWidth: 220 }}
        />
      </div>

      {loading ? (
        <div style={{ color: 'var(--ink-dim)', textAlign: 'center', padding: 60 }}>جاري التحميل...</div>
      ) : products.length === 0 ? (
        <div style={{ color: 'var(--ink-dim)', textAlign: 'center', padding: 60 }}>مفيش منتجات مطابقة</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
