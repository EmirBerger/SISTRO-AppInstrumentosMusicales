import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  function login(userData, accessToken) {
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', accessToken)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  function updateHearts(hearts) {
    const updated = { ...user, hearts }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  // Revalida la sesión contra el servidor. Si la llave (token) fue revocada
  // —por ejemplo, porque se inició sesión en otro dispositivo— el servidor
  // responde 401 y el interceptor de api.js cierra la sesión y va al login.
  const validateSession = useCallback(() => {
    if (!localStorage.getItem('token')) return
    api.get('/me')
      .then((res) => {
        const fresh = res.data.user
        setUser(fresh)
        localStorage.setItem('user', JSON.stringify(fresh))
      })
      .catch(() => { /* el 401 lo maneja el interceptor de api.js */ })
  }, [])

  // Chequea al cargar la app y cada vez que se vuelve a la pestaña/dispositivo.
  useEffect(() => {
    validateSession()

    function onFocus() { validateSession() }
    function onVisible() {
      if (document.visibilityState === 'visible') validateSession()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [validateSession])

  const isAdmin = user?.rol === 1

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login, logout, updateHearts }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
