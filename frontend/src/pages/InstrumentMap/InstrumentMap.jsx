import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../../components/BackButton/BackButton'
import api from '../../services/api'
import styles from './InstrumentMap.module.css'

const LEVEL_LABELS = {
  principiante: 'Princ.',
  intermedio:   'Interm.',
  avanzado:     'Avanz.',
}

const LEVEL_GROUP_LABELS = {
  principiante: 'Principiante',
  intermedio:   'Intermedio',
  avanzado:     'Avanzado',
}

function AccordionItem({ module, index, completed }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const code = `C${String(module.order).padStart(2, '0')}`
  const badge = LEVEL_LABELS[module.level] ?? module.level

  return (
    <div className={`${styles.accordionItem} ${open ? styles.accordionOpen : ''}`}>
      <button className={styles.accordionHeader} onClick={() => setOpen(!open)}>
        <span className={styles.classCode}>{code}</span>
        <span className={styles.classTitle}>{module.title}</span>
        <span className={styles.levelBadge} data-level={module.level}>{badge}</span>
        <span className={styles.accordionArrow}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul className={styles.lessonList}>
          {module.lessons.length === 0 && (
            <li className={styles.empty}>Sin módulos en esta clase.</li>
          )}
          {module.lessons.map((lesson) => {
            const done = completed.includes(lesson.lesson_id)
            return (
              <li key={lesson.lesson_id} className={styles.lessonItem}>
                <button
                  className={`${styles.lessonBtn} ${done ? styles.lessonCompleted : ''}`}
                  onClick={() => navigate(`/clase/${lesson.lesson_id}`)}
                >
                  <span className={styles.bulletDot}>{done ? '✓' : '•'}</span>
                  {lesson.title}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function InstrumentMap() {
  const { id } = useParams()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/instrumentos/${id}`)
      .then((res) => setData(res.data.data))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Instrumento no encontrado')
        } else {
          setError('No se pudo cargar el instrumento')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className={styles.status}>Cargando...</p>
  if (error) return <p className={`${styles.status} ${styles.error}`}>{error}</p>

  const totalLessons = data.map.reduce((acc, m) => acc + m.lessons.length, 0)

  // Agrupa los módulos por nivel manteniendo el orden
  const groups = []
  let currentLevel = null
  data.map.forEach((module) => {
    if (module.level !== currentLevel) {
      currentLevel = module.level
      groups.push({ level: module.level, modules: [] })
    }
    groups[groups.length - 1].modules.push(module)
  })

  return (
    <div className={styles.page}>
      <BackButton />
      <h1 className={styles.title}>Clases de {data.name}</h1>
      <p className={styles.subtitle}>Hacé clic en cada clase para ver sus módulos</p>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{data.map.length}</span>
          <span className={styles.statLabel}>Clases</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{totalLessons}</span>
          <span className={styles.statLabel}>Módulos</span>
        </div>
      </div>

      {data.map.length === 0 && (
        <p className={styles.empty}>Este instrumento aún no tiene clases.</p>
      )}

      {groups.map((group, gi) => (
        <div key={gi} className={styles.levelGroup}>
          <p className={styles.levelGroupTitle}>
            Nivel {gi + 1} — {LEVEL_GROUP_LABELS[group.level] ?? group.level}
          </p>
          {group.modules.map((module, i) => (
            <AccordionItem
              key={module.module_id}
              module={module}
              index={i}
              completed={data.completed_lessons}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default InstrumentMap
