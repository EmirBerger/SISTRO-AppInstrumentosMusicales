import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton/BackButton'
import api from '../../services/api'
import { storageUrl } from '../../services/storage'
import styles from './Songs.module.css'

const DIFFICULTIES = [
  { label: 'Todos', value: null },
  { label: 'Fácil', value: 'Easy' },
  { label: 'Medio', value: 'Medium' },
  { label: 'Difícil', value: 'Hard' },
]

const DIFFICULTY_LABELS = {
  Easy: 'Fácil',
  Medium: 'Medio',
  Hard: 'Difícil',
}

const BADGE_CLASS = {
  Easy: styles.badgeEasy,
  Medium: styles.badgeMedium,
  Hard: styles.badgeHard,
}

function Songs() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState([])
  const [instruments, setInstruments] = useState([])
  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/canciones'),
      api.get('/instrumentos'),
    ])
      .then(([songsRes, instrumentsRes]) => {
        setSongs(songsRes.data.data)
        setInstruments(instrumentsRes.data.data)
      })
      .catch(() => setError('No se pudieron cargar las canciones'))
      .finally(() => setLoading(false))
  }, [])

  const instrumentName = (id) =>
    instruments.find((i) => i.instrument_id === id)?.name ?? null

  const filtered = filter ? songs.filter((s) => s.difficulty === filter) : songs

  return (
    <div className={styles.page}>
      <BackButton />
      <h1 className={styles.title}>Canciones</h1>
      <p className={styles.subtitle}>Explorá canciones y filtrá por dificultad</p>

      <div className={styles.filters}>
        {DIFFICULTIES.map((d) => (
          <button
            key={d.label}
            className={`${styles.filterBtn} ${filter === d.value ? styles.filterActive : ''}`}
            onClick={() => setFilter(d.value)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {loading && <p className={styles.status}>Cargando...</p>}
      {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className={styles.status}>No hay canciones para este filtro.</p>
      )}

      <ul className={styles.list}>
        {filtered.map((song) => (
          <li key={song.song_id} className={styles.songCard} onClick={() => navigate(`/cancion/${song.song_id}`)}>
            {song.image ? (
              <img
                className={styles.songImage}
                src={storageUrl(song.image)}
                alt={song.title}
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
              />
            ) : null}
            <div className={styles.songPlaceholder} style={{ display: song.image ? 'none' : 'flex' }}>🎵</div>
            <div className={styles.songInfo}>
              <p className={styles.songTitle}>{song.title}</p>
              <p className={styles.songArtist}>{song.artist}</p>
              {instrumentName(song.instrument_id) && (
                <span className={styles.instrument}>{instrumentName(song.instrument_id)}</span>
              )}
            </div>
            <span className={`${styles.badge} ${BADGE_CLASS[song.difficulty] ?? ''}`}>
              {DIFFICULTY_LABELS[song.difficulty] ?? song.difficulty}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Songs
