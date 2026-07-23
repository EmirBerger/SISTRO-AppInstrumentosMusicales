import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import styles from './Register.module.css'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', last_name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio'
    if (!form.last_name.trim()) errs.last_name = 'El apellido es obligatorio'
    if (!form.email.trim()) errs.email = 'El correo es obligatorio'
    if (form.password.length < 6) errs.password = 'La contraseña debe tener al menos 6 caracteres'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)

    try {
      await api.post('/crear-cuenta', form)
      navigate('/registro-exitoso')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        const mapped = {}
        for (const [key, msgs] of Object.entries(data.errors)) {
          mapped[key] = msgs[0]
        }
        setErrors(mapped)
      } else {
        setErrors({ general: data?.message || 'Error al registrarse' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              name="last_name"
              placeholder="Apellido"
              value={form.last_name}
              onChange={handleChange}
            />
            {errors.last_name && <p className={styles.fieldError}>{errors.last_name}</p>}
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
          </div>

          {errors.general && <p className={styles.error}>{errors.general}</p>}

          <button className={styles.btnSubmit} type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>

        <Link to="/" className={styles.back}>Volver al inicio</Link>
      </div>
    </div>
  )
}

export default Register
