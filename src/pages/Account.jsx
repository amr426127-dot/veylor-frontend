import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/api'

const statusLabel = {
  pending: 'قيد الانتظار', confirmed: 'مؤكد', shipped: 'جاري الشحن', delivered: 'تم التسليم', cancelled: 'ملغي',
}

export default function Account() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [loading, user])

  useEffect(() => {
    if (user) api.myOrders().then((d) => setOrders(d.orders)).catch(() => {})
  }, [user])

  if (!user) return null

  return (
    <div className="wrap" style={{ padding: '48px 0 100px', maxWidth: 620 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="h-display" style={{ fontSize: 28 }}>حسابي</h1>
        <button onClick={async () => { await logout(); navigate('/') }} className="btn btn-ghost">تسجيل خروج</button>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, padding: 20, marginBottom: 32 }}>
        <div style={{ fontWeight: 600 }}>{user.name}</div>
        <div style={{ color: 'var(--ink-dim)', fontSize: 14 }}>{user.email}</div>
      </div>

      <h2 className="h-display" style={{ fontSize: 18, marginBottom: 16 }}>طلباتي</h2>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--ink-dim)' }}>لسه معملتش أي طلب.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((o) => (
            <div key={o.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)' }}>#{o.id}</span>
                <span style={{ color: 'var(--dial)' }}>{statusLabel[o.status]}</span>
              </div>
              <div style={{ color: 'var(--ink-dim)', fontSize: 14 }}>
                {o.items.map((i) => i.product_name).join('، ')}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', marginTop: 8 }}>{Number(o.total).toLocaleString()} ج.م</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
