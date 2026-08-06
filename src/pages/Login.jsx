import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : '/account')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="wrap" style={{ padding: '80px 0', maxWidth: 420 }}>
      <h1 className="h-display" style={{ fontSize: 28, marginBottom: 28 }}>تسجيل الدخول</h1>
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>الإيميل</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>الباسورد</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-block">
          {loading ? '...' : 'دخول'}
        </button>
      </form>
      <p style={{ marginTop: 20, color: 'var(--ink-dim)', fontSize: 14 }}>
        مالكش حساب؟ <Link to="/register" style={{ color: 'var(--ink)' }}>اعمل حساب</Link>
      </p>
    </div>
  )
}
