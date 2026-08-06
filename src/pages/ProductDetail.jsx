import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/api'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setProduct(null); setNotFound(false); setAdded(false); setQty(1)
    api.getProduct(slug).then((d) => setProduct(d.product)).catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="wrap" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-dim)', marginBottom: 20 }}>المنتج ده مش موجود.</p>
        <Link to="/shop" className="btn btn-ghost">رجوع للمتجر</Link>
      </div>
    )
  }
  if (!product) {
    return <div className="wrap" style={{ padding: '100px 0', textAlign: 'center', color: 'var(--ink-dim)' }}>جاري التحميل...</div>
  }

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function handleBuyNow() {
    addItem(product, qty)
    navigate('/cart')
  }

  return (
    <div className="wrap" style={{ padding: '48px 0 100px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} className="pdp-grid">
        <div className="fog-stage" style={{ background: 'var(--bg-elevated)', borderRadius: 24, aspectRatio: '1/1', padding: 40 }}>
          <img src={product.image} alt={product.name} style={{ width: '80%' }} onError={(e) => { e.target.style.display = 'none' }} />
        </div>

        <div>
          {product.category_name && <div className="eyebrow" style={{ marginBottom: 12 }}>{product.category_name}</div>}
          <h1 className="h-display" style={{ fontSize: 34, marginBottom: 16 }}>{product.name}</h1>
          <p style={{ color: 'var(--ink-dim)', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 22, marginBottom: 28 }}>
            <span>{Number(product.price).toLocaleString()} ج.م</span>
            {product.compare_at_price && (
              <span style={{ color: 'var(--ink-faint)', textDecoration: 'line-through', fontSize: 15 }}>
                {Number(product.compare_at_price).toLocaleString()} ج.م
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 10 }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: 'var(--ink)', width: 40, height: 40 }}>−</button>
              <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} style={{ background: 'none', border: 'none', color: 'var(--ink)', width: 40, height: 40 }}>+</button>
            </div>
            <span style={{ color: product.stock > 0 ? 'var(--ink-dim)' : 'var(--danger)', fontSize: 13 }}>
              {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'غير متوفر حاليًا'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={handleAdd} className="btn btn-ghost" disabled={product.stock < 1}>
              {added ? 'اتضافت للسلة ✓' : 'أضف للسلة'}
            </button>
            <button onClick={handleBuyNow} className="btn btn-primary" disabled={product.stock < 1}>
              اشتري الآن
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
