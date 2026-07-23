import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Guitar, Music, Radio, ChevronRight } from 'lucide-react'
import styles from './Home.module.css'

const SECTIONS = [
  {
    title: 'Instrumentos',
    description: 'Aprendé a tocar guitarra, piano y más',
    icon: Guitar,
    path: '/instrumentos',
  },
  {
    title: 'Canciones',
    description: 'Explorá canciones por dificultad',
    icon: Music,
    path: '/canciones',
  },
  {
    title: 'Afinador',
    description: 'Afinador en tiempo real para tu instrumento',
    icon: Radio,
    path: '/afinador',
  },
]

function Home() {
  const { user } = useAuth()

  return (
    <div className={styles.page}>
      <h1 className={styles.greeting}>¡Hola, {user?.name}!</h1>
      <p className={styles.subtitle}>¿Qué querés aprender hoy?</p>

      <div className={styles.grid}>
        {SECTIONS.map((section) => {
          const Icon = section.icon
          return (
            <Link key={section.path} to={section.path} className={styles.card}>
              <div className={styles.cardIcon}>
                <Icon size={26} color="#33AB1B" />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardTitle}>{section.title}</p>
                <p className={styles.cardDesc}>{section.description}</p>
              </div>
              <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home
