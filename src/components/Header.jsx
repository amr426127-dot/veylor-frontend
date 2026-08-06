import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { count } = useCart()
  const { user } = useAuth()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,13,0.85)', backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <Link to="/" className="h-display" style={{ fontSize: 22, letterSpacing: '0.04em' }}>
          VEYLOR
        </Link>

        <nav style={{ display: 'flex', gap: 28, fontSize: 14, color: 'var(--ink-dim)' }}>
          <NavLink to="/" end style={({isActive}) => ({ color: isActive ? 'var(--ink)' : 'var(--ink-dim)' })}>الرئيسية</NavLink>
          <NavLink to="/shop" style={({isActive}) => ({ color: isActive ? 'var(--ink)' : 'var(--ink-dim)' })}>المتجر</NavLink>
          <NavLink to="/about" style={({isActive}) => ({ color: isActive ? 'var(--ink)' : 'var(--ink-dim)' })}>من نحن</NavLink>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to={user ? '/account' : '/login'} style={{ fontSize: 14, color: 'var(--ink-dim)' }}>
            {user ? user.name.split(' ')[0] : 'تسجيل دخول'}
          </Link>
          <Link to="/cart" className="btn btn-ghost" style={{ padding: '9px 18px' }}>
            السلة {count > 0 && <span style={{ color: 'var(--copper)' }}>({count})</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
