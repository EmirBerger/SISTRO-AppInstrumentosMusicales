import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Home, Music, Guitar, Radio, User, ShieldCheck } from 'lucide-react' // HEARTS: Heart removido temporalmente
import api from '../../services/api'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { label: 'Inicio', icon: Home, path: '/inicio' },
  { label: 'Instrumentos', icon: Guitar, path: '/instrumentos' },
  { label: 'Canciones', icon: Music, path: '/canciones' },
  { label: 'Afinador', icon: Radio, path: '/afinador' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAdmin } = useAuth() // HEARTS: updateHearts removido temporalmente

  // HEARTS: desactivado temporalmente
  // const showHearts = user?.plan !== 'premium' && user?.hearts !== undefined

  // useEffect(() => {
  //   if (user?.plan === 'premium') return
  //   function fetchHearts() {
  //     api.get('/me')
  //       .then((res) => {
  //         const h = res.data.user?.hearts
  //         if (h !== undefined) updateHearts(h)
  //       })
  //       .catch(() => {})
  //   }
  //   fetchHearts()
  //   const interval = setInterval(fetchHearts, 60 * 1000)
  //   return () => clearInterval(interval)
  // }, [])

  const allNavItems = [
    ...NAV_ITEMS,
    ...(isAdmin ? [{ label: 'Admin', icon: ShieldCheck, path: '/admin' }] : []),
    { label: 'Perfil', icon: User, path: '/perfil' },
  ]

  return (
    <>
      {/* ── Sidebar (desktop / tablet) ── */}
      <aside className={styles.sidebar}>
        <Link to="/inicio" className={styles.logo}>
          <img src="/logo.svg" alt="" className={styles.logoImg} />
          <span>Sistro</span>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${location.pathname === item.path ? styles.navItemActive : ''}`}
              >
                <Icon size={20} className={styles.icon} />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {isAdmin && (
          <div className={styles.adminNav}>
            <Link
              to="/admin"
              className={`${styles.navItem} ${location.pathname.startsWith('/admin') ? styles.navItemActive : ''}`}
            >
              <ShieldCheck size={20} className={styles.icon} />
              <span className={styles.navLabel}>Admin</span>
            </Link>
          </div>
        )}

        <div className={styles.bottom}>
          {/* HEARTS: desactivado temporalmente */}
          {/* {showHearts && (
            <div className={styles.hearts}>
              <Heart size={18} fill="#ff6b6b" color="#ff6b6b" />
              <span className={styles.navLabel}>{user.hearts} vidas</span>
            </div>
          )} */}
          <button className={styles.navItem} onClick={() => navigate('/perfil')}>
            <User size={20} className={styles.icon} />
            <span className={styles.navLabel}>Perfil</span>
          </button>
        </div>
      </aside>

      {/* ── Barra inferior (mobile) ── */}
      <nav className={styles.bottomNav}>
        {allNavItems.map((item) => {
          const Icon = item.icon
          const isActive = item.path === '/admin'
            ? location.pathname.startsWith('/admin')
            : location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.bottomNavItem} ${isActive ? styles.bottomNavItemActive : ''}`}
            >
              <Icon size={22} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

export default Sidebar
