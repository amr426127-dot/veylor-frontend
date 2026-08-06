import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      style={{
        display: 'block',
        background: 'var(--bg-card)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        overflow: 'hidden',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }}
      className="product-card"
    >
      <div className="fog-stage" style={{ aspectRatio: '1/1', padding: 28 }}>
        <img src={product.image} alt={product.name} style={{ width: '78%', objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none' }} />
      </div>
      <div style={{ padding: '16px 18px 20px' }}>
        {product.category_name && (
          <div className="eyebrow" style={{ marginBottom: 6 }}>{product.category_name}</div>
        )}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          {product.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'var(--font-mono)' }}>
          <span>{Number(product.price).toLocaleString()} ج.م</span>
          {product.compare_at_price && (
            <span style={{ color: 'var(--ink-faint)', textDecoration: 'line-through', fontSize: 13 }}>
              {Number(product.compare_at_price).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
