import { Guitar, Piano, Music2, AudioWaveform, Music } from 'lucide-react'
import { getInstrumentIcon } from '../../config/instrumentIcons'
import styles from './Card.module.css'

// Fallback: si el instrumento todavía no tiene icono elegido, lo deducimos del nombre.
const NAME_ICON_MAP = {
  guitarra: Guitar,
  guitar: Guitar,
  piano: Piano,
  bajo: Music2,
  bass: Music2,
  ukelele: Guitar,
  violín: AudioWaveform,
  violin: AudioWaveform,
}

function iconFromName(title) {
  const key = title?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return NAME_ICON_MAP[key] ?? Music
}

function Card({ title, icon, onClick }) {
  const Icon = icon ? getInstrumentIcon(icon) : iconFromName(title)
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
