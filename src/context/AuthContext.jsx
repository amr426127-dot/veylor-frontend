import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.me().then((d) => setUser(d.user)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const d = await api.login({ email, password })
    setUser(d.user)
    return d.user
  }

  async function register(payload) {
    const d = await api.register(payload)
    setUser(d.user)
    return d.user
  }

  async function logout() {
    await api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
