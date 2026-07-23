import { useNavigate } from 'react-router-dom'
import { Guitar, Music } from 'lucide-react'
import styles from './AdminDashboard.module.css'

const SECTIONS = [
  {
    icon: Guitar,
    label: 'Instrumentos',
    description: 'Creá y editá instrumentos, módulos y clases',
    path: '/admin/instrumentos',
  },
  {
    icon: Music,
    label: 'Canciones',
    description: 'Gestioná el catálogo de canciones',
    path: '/admin/canciones',
  },
]

function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Panel de administración</h1>
      <p className={styles.subtitle}>Seleccioná una sección para gestionar</p>

      <div className={styles.grid}>
        {SECTIONS.map((s) => {
          const Icon = s.icon
          return (
            <button key={s.path} className={styles.card} onClick={() => navigate(s.path)}>
              <div className={styles.iconWrap}>
                <Icon size={40} color="#33AB1B" />
              </div>
              <p className={styles.cardLabel}>{s.label}</p>
              <p className={styles.cardDesc}>{s.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AdminDashboard
