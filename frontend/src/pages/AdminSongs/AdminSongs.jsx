import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Music } from 'lucide-react'
import BackButton from '../../components/BackButton/BackButton'
import api from '../../services/api'
import { storageUrl } from '../../services/storage'
import styles from './AdminSongs.module.css'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const DIFFICULTY_LABELS = { Easy: 'Fácil', Medium: 'Medio', Hard: 'Difícil' }
const BADGE_CLASS = { Easy: styles.badgeEasy, Medium: styles.badgeMedium, Hard: styles.badgeHard }

// ── Modal shell ────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <Modal title="Confirmar eliminación" onClose={onClose}>
      <p className={styles.confirmText}>{message}</p>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
        <button className={styles.btnDanger} onClick={onConfirm}>Eliminar</button>
      </div>
    </Modal>
  )
}

// ── Song form modal ────────────────────────────────────────────────
function SongModal({ song, instruments, onClose, onSaved }) {
  const editing = !!song
  const [form, setForm] = useState({
    instrument_id: song?.instrument_id ?? (instruments[0]?.instrument_id ?? ''),
    title: song?.title ?? '',
    artist: song?.artist ?? '',
    difficulty: song?.difficulty ?? 'Easy',
  })
  const [imageFile, setImageFile] = useState(null)
  const [songFile, setSongFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = new FormData()
      data.append('instrument_id', form.instrument_id)
      data.append('title', form.title)
      data.append('artist', form.artist)
      data.append('difficulty', form.difficulty)
      if (imageFile) data.append('image', imageFile)
      if (songFile) data.append('file_url', songFile)

      if (editing) {
        await api.post(`/admin/cancion/${song.song_id}/editar`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await api.post('/admin/cancion/nuevo', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar la canción')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={editing ? 'Editar canción' : 'Nueva canción'} onClose={onClose}>
      <form onSubmit={submit}>
        <div className={styles.field}>
          <label className={styles.label}>Instrumento *</label>
          <select className={styles.select} name="instrument_id" value={form.instrument_id} onChange={handle}>
            {instruments.map((i) => (
              <option key={i.instrument_id} value={i.instrument_id}>{i.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Título *</label>
            <input className={styles.input} name="title" value={form.title} onChange={handle} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Artista *</label>
            <input className={styles.input} name="artist" value={form.artist} onChange={handle} required />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Dificultad *</label>
          <div className={styles.diffBtns}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`${styles.diffBtn} ${form.difficulty === d ? styles[`diff${d}`] : ''}`}
                onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Imagen de portada</label>
          <input type="file" accept="image/*" className={styles.fileInput}
            onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Archivo de canción (audio/partitura)</label>
          <input type="file" className={styles.fileInput}
            onChange={(e) => setSongFile(e.target.files[0])} />
        </div>

        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear canción'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Main page ──────────────────────────────────────────────────────
function AdminSongs() {
  const [songs, setSongs] = useState([])
  const [instruments, setInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState(null) // instrument_id | null
  const [songModal, setSongModal] = useState(null) // null | 'new' | song object
  const [confirm, setConfirm] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const [songsRes, instrRes] = await Promise.all([
        api.get('/canciones'),
        api.get('/instrumentos'),
      ])
      setSongs(songsRes.data.data)
      setInstruments(instrRes.data.data)
    } catch {
      setError('No se pudieron cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function deleteSong(song) {
    try {
      await api.post(`/admin/cancion/${song.song_id}/eliminar`)
      load()
    } catch {
      setError('No se pudo eliminar la canción')
    }
  }

  const filtered = filter ? songs.filter((s) => s.instrument_id === filter) : songs

  return (
    <div className={styles.page}>
      <BackButton />
      <h1 className={styles.title}>Admin — Canciones</h1>
      <p className={styles.subtitle}>Gestioná el catálogo de canciones</p>

      <div className={styles.topBar}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === null ? styles.filterActive : ''}`}
            onClick={() => setFilter(null)}
          >
            Todos
          </button>
          {instruments.map((i) => (
            <button
              key={i.instrument_id}
              className={`${styles.filterBtn} ${filter === i.instrument_id ? styles.filterActive : ''}`}
              onClick={() => setFilter(i.instrument_id)}
            >
              {i.name}
            </button>
          ))}
        </div>
        <button className={styles.btnPrimary} onClick={() => setSongModal('new')}>
          <Plus size={16} /> Nueva canción
        </button>
      </div>

      {loading && <p className={styles.status}>Cargando...</p>}
      {error && <p className={`${styles.status} ${styles.errorText}`}>{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className={styles.status}>No hay canciones.</p>
      )}

      <div className={styles.list}>
        {filtered.map((song) => (
          <div key={song.song_id} className={styles.songRow}>
            <div className={styles.songThumb}>
              {song.image ? (
                <img src={storageUrl(song.image)} alt={song.title} className={styles.songImg} />
              ) : (
                <div className={styles.songPlaceholder}><Music size={20} color="rgba(255,255,255,0.3)" /></div>
              )}
            </div>
            <div className={styles.songInfo}>
              <p className={styles.songTitle}>{song.title}</p>
              <p className={styles.songArtist}>{song.artist}</p>
            </div>
            <span className={`${styles.badge} ${BADGE_CLASS[song.difficulty] ?? ''}`}>
              {DIFFICULTY_LABELS[song.difficulty] ?? song.difficulty}
            </span>
            <span className={styles.songInstrument}>
              {instruments.find((i) => i.instrument_id === song.instrument_id)?.name ?? '—'}
            </span>
            <div className={styles.rowActions}>
              <button className={styles.iconBtn} onClick={() => setSongModal(song)} title="Editar">
                <Pencil size={15} />
              </button>
              <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => setConfirm(song)} title="Eliminar">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {songModal && (
        <SongModal
          song={songModal === 'new' ? null : songModal}
          instruments={instruments}
          onClose={() => setSongModal(null)}
          onSaved={() => { setSongModal(null); load() }}
        />
      )}

      {confirm && (
        <ConfirmModal
          message={`¿Eliminar "${confirm.title}" de ${confirm.artist}? Esta acción no se puede deshacer.`}
          onConfirm={() => { deleteSong(confirm); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

export default AdminSongs
