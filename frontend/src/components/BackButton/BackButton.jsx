import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import styles from './BackButton.module.css'

function BackButton() {
  const navigate = useNavigate()
  return (
    <button className={styles.btn} onClick={() => navigate(-1)}>
      <ChevronLeft size={18} />
      <span className={styles.label}>Volver</span>
    </button>
  )
}

export default BackButton
