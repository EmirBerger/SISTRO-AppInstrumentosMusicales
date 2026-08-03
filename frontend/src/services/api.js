import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo cerramos sesión si había una sesión activa (había token).
      // Así un login con contraseña incorrecta no dispara este flujo.
      const hadToken = !!localStorage.getItem('token')
      if (hadToken) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // Marca el motivo para avisar en la pantalla de login.
        localStorage.setItem('sessionEndedReason', 'otro-dispositivo')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
