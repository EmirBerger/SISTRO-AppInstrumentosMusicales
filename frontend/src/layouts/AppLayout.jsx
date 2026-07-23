import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import styles from './AppLayout.module.css'

function AppLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
