import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [active, setActive] = useState(0)
  const scrollerRef = useRef(null)

  useEffect(() => {
    api.listProducts({ featured: 1 }).then((d) => setFeatured(d.products)).catch(() => {})
  }, [])

  function scrollBy(dir) {
    setActive((a) => Math.max(0, Math.min(featured.length - 1, a + dir)))
  }

  const heroProduct = featured[0]

  return (
    <div>
      {/* HERO */}
      <section className="fog-stage" style={{ minHeight: '86vh', padding: '80px 0 40px', textAlign: 'center' }}>
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>A REFLECTION OF TIMELESS PERFECTION</div>
          <h1 className="h-display" style={{ fontSize: 'clamp(48px, 11vw, 128px)', margin: '0 0 32px' }}>
            VEYLOR
          </h1>

          {heroProduct && (
            <img
              src={heroProduct.image}
              alt={heroProduct.name}
              style={{ width: 'min(340px, 70vw)', margin: '0 auto 36px' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}

          <p style={{ color: 'var(--ink-dim)', maxWidth: 460, margin: '0 auto 32px', fontSize: 15, lineHeight: 1.7 }}>
            ساعات ستانلس ستيل مصممة بدقة، بين الفخامة والبساطة — حيث تلتقي الأناقة بالإتقان.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Link to="/shop" className="btn btn-primary">تسوّق الآن</Link>
            <Link to="/about" className="btn btn-ghost">اعرف أكتر</Link>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR STYLE — vitrine carousel */}
      <section className="wrap" style={{ padding: '60px 0 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>SIGNATURE COLLECTION</div>
          <h2 className="h-display" style={{ fontSize: 32 }}>اختار الستايل اللي يناسبك</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => scrollBy(-1)}
            className="btn btn-ghost"
            style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, flexShrink: 0 }}
            aria-label="السابق"
          >‹</button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${featured.length || 1}, minmax(180px, 1fr))`,
            gap: 18,
            overflow: 'hidden',
            flex: 1,
          }}>
            {featured.map((p, i) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="fog-stage"
                style={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${i === active ? 'var(--dial)' : 'var(--line)'}`,
                  borderRadius: 16,
                  padding: '28px 14px',
                  aspectRatio: '3/4',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                  transform: i === active ? 'translateY(-6px)' : 'none',
                }}
                onMouseEnter={() => setActive(i)}
              >
                <img src={p.image} alt={p.name} style={{ width: '90%' }} onError={(e) => { e.target.style.display = 'none' }} />
              </Link>
            ))}
          </div>

          <button
            onClick={() => scrollBy(1)}
            className="btn btn-ghost"
            style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, flexShrink: 0 }}
            aria-label="التالي"
          >›</button>
        </div>

        {featured[active] && (
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <div className="h-display" style={{ fontSize: 20, marginBottom: 6 }}>{featured[active].name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-dim)', marginBottom: 20 }}>
              {Number(featured[active].price).toLocaleString()} ج.م
            </div>
            <Link to={`/product/${featured[active].slug}`} className="btn btn-primary">Buy now</Link>
          </div>
        )}
      </section>

      {/* FULL GRID PREVIEW */}
      <section className="wrap" style={{ paddingBottom: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
          <h2 className="h-display" style={{ fontSize: 24 }}>كل المنتجات</h2>
          <Link to="/shop" style={{ color: 'var(--ink-dim)', fontSize: 14 }}>تصفح الكل ←</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  )
}
