import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="wrap" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-dim)', marginBottom: 20 }}>سلتك فاضية.</p>
        <Link to="/shop" className="btn btn-primary">تسوّق دلوقتي</Link>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ padding: '48px 0 100px', maxWidth: 760 }}>
      <h1 className="h-display" style={{ fontSize: 30, marginBottom: 32 }}>السلة</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, padding: 14 }}>
            <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-dim)', fontSize: 14 }}>{item.price.toLocaleString()} ج.م</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 10 }}>
              <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: 'none', border: 'none', color: 'var(--ink)', width: 32, height: 32 }}>−</button>
              <span style={{ width: 24, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14 }}>{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: 'none', border: 'none', color: 'var(--ink)', width: 32, height: 32 }}>+</button>
            </div>
            <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 13 }}>حذف</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: 18 }}>
        <span style={{ color: 'var(--ink-dim)', fontFamily: 'var(--font-body)' }}>الإجمالي</span>
        <span>{total.toLocaleString()} ج.م</span>
      </div>

      <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-block">استكمال الطلب</button>
    </div>
  )
}
