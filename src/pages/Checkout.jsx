import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/api'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', address: '', city: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.phone || !form.address) {
      setError('من فضلك املأ الاسم والتليفون والعنوان')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        items: items.map((i) => ({ product_id: i.id, quantity: i.qty })),
        payment_method: 'cod',
      }
      const res = await api.createOrder(payload)
      setDone(res.order_id)
      clearCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="wrap" style={{ padding: '100px 0', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div className="h-display" style={{ fontSize: 26, marginBottom: 12 }}>تم استلام طلبك 🎉</div>
        <p style={{ color: 'var(--ink-dim)', marginBottom: 28 }}>رقم الطلب #{done} — هنتواصل معاك على التليفون لتأكيد الشحن.</p>
        <button onClick={() => navigate('/shop')} className="btn btn-primary">متابعة التسوق</button>
      </div>
    )
  }

  return (
    <div className="wrap" style={{ padding: '48px 0 100px', maxWidth: 520 }}>
      <h1 className="h-display" style={{ fontSize: 28, marginBottom: 8 }}>استكمال الطلب</h1>
      <p style={{ color: 'var(--ink-dim)', marginBottom: 28, fontFamily: 'var(--font-mono)', fontSize: 14 }}>
        الإجمالي: {total.toLocaleString()} ج.م — الدفع عند الاستلام
      </p>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>الاسم بالكامل</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div className="field">
          <label>رقم التليفون</label>
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
        </div>
        <div className="field">
          <label>الإيميل (اختياري)</label>
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
        <div className="field">
          <label>العنوان بالتفصيل</label>
          <textarea rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} required />
        </div>
        <div className="field">
          <label>المدينة</label>
          <input value={form.city} onChange={(e) => update('city', e.target.value)} />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-block">
          {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  )
}
