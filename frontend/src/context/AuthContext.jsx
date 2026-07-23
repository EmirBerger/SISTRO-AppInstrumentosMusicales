import { createContext, useContext, useState } from 'react'

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
