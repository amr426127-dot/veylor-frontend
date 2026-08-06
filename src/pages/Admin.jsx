import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/api'

const emptyProduct = {
  name: '', description: '', price: '', compare_at_price: '', category_id: '',
  strap: 'steel', dial_color: 'black', stock: 10, image: '', is_featured: false,
}

export default function Admin() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) navigate('/login')
  }, [loading, user])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="wrap" style={{ padding: '48px 0 100px' }}>
      <h1 className="h-display" style={{ fontSize: 28, marginBottom: 24 }}>لوحة التحكم</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
        <button onClick={() => setTab('products')} className="btn"
          style={{ background: tab === 'products' ? 'var(--ink)' : 'transparent', color: tab === 'products' ? 'var(--bg)' : 'var(--ink-dim)', border: '1px solid var(--line)' }}>
          المنتجات
        </button>
        <button onClick={() => setTab('orders')} className="btn"
          style={{ background: tab === 'orders' ? 'var(--ink)' : 'transparent', color: tab === 'orders' ? 'var(--bg)' : 'var(--ink-dim)', border: '1px solid var(--line)' }}>
          الطلبات
        </button>
      </div>

      {tab === 'products' ? <ProductsTab /> : <OrdersTab />}
    </div>
  )
}

function ProductsTab() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  function refresh() {
    api.listProducts().then((d) => setProducts(d.products))
  }

  useEffect(() => {
    refresh()
    api.categories().then((d) => setCategories(d.categories))
  }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function edit(p) {
    setEditingId(p.id)
    setForm({
      name: p.name, description: p.description || '', price: p.price, compare_at_price: p.compare_at_price || '',
      category_id: p.category_id || '', strap: p.strap, dial_color: p.dial_color, stock: p.stock,
      image: p.image || '', is_featured: !!p.is_featured,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api.updateProduct({ id: editingId, ...form })
      } else {
        await api.createProduct(form)
      }
      setForm(emptyProduct)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('متأكد إنك عايز تشيل المنتج ده؟')) return
    await api.deleteProduct(id)
    refresh()
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 32 }} className="admin-grid">
      <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 16, padding: 20, height: 'fit-content' }}>
        <div className="h-display" style={{ fontSize: 16, marginBottom: 16 }}>
          {editingId ? 'تعديل منتج' : 'منتج جديد'}
        </div>
        {error && <div className="error-box">{error}</div>}

        <div className="field"><label>الاسم</label><input value={form.name} onChange={(e) => update('name', e.target.value)} required /></div>
        <div className="field"><label>الوصف</label><textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} /></div>
        <div className="field"><label>السعر</label><input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} required /></div>
        <div className="field"><label>السعر قبل الخصم (اختياري)</label><input type="number" value={form.compare_at_price} onChange={(e) => update('compare_at_price', e.target.value)} /></div>
        <div className="field">
          <label>التصنيف</label>
          <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)}>
            <option value="">بدون</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field"><label>المخزون</label><input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} /></div>
        <div className="field"><label>رابط الصورة</label><input value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="/uploads/watch.png" /></div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 14, color: 'var(--ink-dim)' }}>
          <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} />
          منتج مميز (يظهر في الصفحة الرئيسية)
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'حفظ التعديل' : 'إضافة'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyProduct) }} className="btn btn-ghost">إلغاء</button>}
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--line)', borderRadius: 12, padding: 12 }}>
            <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: 'var(--ink-dim)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>{Number(p.price).toLocaleString()} ج.م — مخزون {p.stock}</div>
            </div>
            <button onClick={() => edit(p)} className="btn btn-ghost" style={{ padding: '6px 14px' }}>تعديل</button>
            <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)' }}>حذف</button>
          </div>
        ))}
      </div>

      <style>{`@media (max-width: 800px) { .admin-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const statusLabel = { pending: 'قيد الانتظار', confirmed: 'مؤكد', shipped: 'جاري الشحن', delivered: 'تم التسليم', cancelled: 'ملغي' }

function OrdersTab() {
  const [orders, setOrders] = useState([])

  function refresh() {
    api.adminOrders().then((d) => setOrders(d.orders))
  }
  useEffect(() => { refresh() }, [])

  async function changeStatus(id, status) {
    await api.updateOrderStatus(id, status)
    refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {orders.length === 0 && <p style={{ color: 'var(--ink-dim)' }}>مفيش طلبات لسه.</p>}
      {orders.map((o) => (
        <div key={o.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)' }}>#{o.id}</span>
              <span style={{ color: 'var(--ink-dim)', marginRight: 10 }}> — {o.guest_name} — {o.guest_phone}</span>
            </div>
            <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '4px 10px' }}>
              {statusOptions.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
            </select>
          </div>
          <div style={{ color: 'var(--ink-dim)', fontSize: 14, marginBottom: 6 }}>
            {o.items.map((i) => `${i.product_name} × ${i.quantity}`).join('، ')}
          </div>
          <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>{o.shipping_address}{o.city ? `, ${o.city}` : ''}</div>
          <div style={{ fontFamily: 'var(--font-mono)', marginTop: 8 }}>{Number(o.total).toLocaleString()} ج.م</div>
        </div>
      ))}
    </div>
  )
}
