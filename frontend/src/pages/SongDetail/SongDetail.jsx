import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'
import BackButton from '../../components/BackButton/BackButton'
import api from '../../services/api'
import styles from './SongDetail.module.css'

const DIFFICULTY_LABELS = { Easy: 'Fácil', Medium: 'Medio', Hard: 'Difícil' }
const DIFFICULTY_CLASS  = { Easy: styles.badgeEasy, Medium: styles.badgeMedium, Hard: styles.badgeHard }

function SongDetail() {
  const { id } = useParams()
  const containerRef = useRef(null)
  const osmdRef      = useRef(null)

  const [song, setSong]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [sheetLoading, setSheetLoading] = useState(false)
  const [error, setError]       = useState('')
  const [sheetError, setSheetError] = useState('')

  useEffect(() => {
    api.get(`/cancion/${id}`)
      .then((res) => setSong(res.data.data))
      .catch(() => setError('No se pudo cargar la canción'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!song?.file_url || !containerRef.current) return

    setSheetLoading(true)
    setSheetError('')

    const osmd = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      backend: 'svg',
      darkMode: true,
      defaultColorMusic: '#e2e8f0',
      defaultColorTitle: '#ffffff',
    })
    osmdRef.current = osmd

    osmd.load(song.file_url)
      .then(() => osmd.render())
      .catch(() => setSheetError('No se pudo cargar la partitura'))
      .finally(() => setSheetLoading(false))

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [song])

  if (loading) return <p className={styles.status}>Cargando...</p>

  if (error) {
    return (
      <div className={styles.page}>
        <BackButton />
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <BackButton />

      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{song.title}</h1>
          <p className={styles.artist}>{song.artist}</p>
        </div>
        <span className={`${styles.badge} ${DIFFICULTY_CLASS[song.difficulty] ?? ''}`}>
          {DIFFICULTY_LABELS[song.difficulty] ?? song.difficulty}
        </span>
      </div>

      <div className={styles.sheetWrapper}>
        {sheetLoading && <p className={styles.sheetStatus}>Cargando partitura...</p>}
        {sheetError  && <p className={styles.sheetError}>{sheetError}</p>}
        <div ref={containerRef} className={styles.sheetContainer} />
      </div>
    </div>
  )
}

export default SongDetail
