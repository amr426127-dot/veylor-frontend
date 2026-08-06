import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/account')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wrap" style={{ padding: '80px 0', maxWidth: 420 }}>
      <h1 className="h-display" style={{ fontSize: 28, marginBottom: 28 }}>إنشاء حساب</h1>
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>الاسم</label>
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div className="field">
          <label>الإيميل</label>
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        </div>
        <div className="field">
          <label>رقم التليفون</label>
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div className="field">
          <label>الباسورد</label>
          <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-block">
          {loading ? '...' : 'إنشاء الحساب'}
        </button>
      </form>
      <p style={{ marginTop: 20, color: 'var(--ink-dim)', fontSize: 14 }}>
        عندك حساب؟ <Link to="/login" style={{ color: 'var(--ink)' }}>سجل دخول</Link>
      </p>
    </div>
  )
}
