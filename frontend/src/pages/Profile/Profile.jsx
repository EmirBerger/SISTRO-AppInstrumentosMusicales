import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { User, LogOut } from 'lucide-react' // HEARTS: Heart removido temporalmente
import api from '../../services/api'
import styles from './Profile.module.css'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await api.post('/cerrar-sesion')
    } catch {}
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mi perfil</h1>
      <p className={styles.subtitle}>Tu información y configuración de cuenta</p>

      <div className={styles.card}>
        <div className={styles.avatar}>
          <User size={32} color="#33AB1B" />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Nombre</span>
          <span className={styles.value}>{user?.name} {user?.last_name}</span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.field}>
          <span className={styles.label}>Correo</span>
          <span className={styles.value}>{user?.email}</span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.field}>
          <span className={styles.label}>Plan</span>
          <span className={`${styles.planBadge} ${user?.plan === 'premium' ? styles.planPremium : styles.planFree}`}>
            {user?.plan === 'premium' ? '⭐ Premium' : 'Gratuito'}
          </span>
        </div>

        {/* HEARTS: desactivado temporalmente */}
        {/* {user?.plan !== 'premium' && (
          <>
            <hr className={styles.divider} />
            <div className={styles.field}>
              <span className={styles.label}>Energía</span>
              <span className={styles.hearts}>
                <Heart size={16} fill="#ff6b6b" color="#ff6b6b" />
                {user?.hearts} vidas
              </span>
            </div>
          </>
        )} */}

        <button className={styles.btnLogout} onClick={handleLogout}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default Profile
