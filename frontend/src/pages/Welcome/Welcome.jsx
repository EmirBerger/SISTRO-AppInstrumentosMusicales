import { Link } from 'react-router-dom'
import styles from './Welcome.module.css'

function Welcome() {
  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <img src="/logo.svg" alt="Logo de Sistro" className={styles.logo} />
        <h1 className={styles.title}>Sistro</h1>
      </div>

      <div className={styles.right}>
        <p className={styles.subtitle}>Tu espacio para aprender música</p>
        <div className={styles.buttons}>
          <Link to="/login" className={styles.btnPrimary}>Iniciar sesión</Link>
          <Link to="/register" className={styles.btnSecondary}>Crear cuenta</Link>
        </div>
      </div>
    </div>
  )
}

export default Welcome
