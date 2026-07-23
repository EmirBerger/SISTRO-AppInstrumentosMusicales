import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import styles from './Login.module.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await api.post('/iniciar-sesion', form)
      login(res.data.user, res.data.access_token)
      navigate('/inicio')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Ingresar</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btnSubmit} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿No tenés cuenta? <Link to="/register">Crear cuenta</Link>
        </p>

        <Link to="/" className={styles.back}>Volver al inicio</Link>
      </div>
    </div>
  )
}

export default Login
