import { Guitar, Piano, Music2, AudioWaveform, Music } from 'lucide-react'
import styles from './Card.module.css'

const ICON_MAP = {
  guitarra: Guitar,
  guitar: Guitar,
  piano: Piano,
  bajo: Music2,
  bass: Music2,
  ukulele: Guitar,
  violín: AudioWaveform,
  violin: AudioWaveform,
}

function getIcon(title) {
  const key = title?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return ICON_MAP[key] ?? Music
}

function Card({ title, onClick }) {
  const Icon = getIcon(title)
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.placeholder}>
        <Icon size={80} color="#33AB1B" />
      </div>
      <p className={styles.title}>{title}</p>
    </div>
  )
}

export default Card
