import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Lightbulb } from 'lucide-react'
import BackButton from '../../components/BackButton/BackButton'
// import { useAuth } from '../../context/AuthContext' // HEARTS: desactivado temporalmente
import api from '../../services/api'
import styles from './Lesson.module.css'

function LessonBlock({ block }) {
  switch (block.type) {
    case 'text':
      return <p className={styles.blockText}>{block.content}</p>

    case 'image':
      return (
        <figure className={styles.blockImage}>
          {block.content?.url
            ? <img src={block.content.url} alt={block.content.alt || ''} />
            : <div className={styles.imagePlaceholder}>{block.content?.alt || 'Imagen próximamente'}</div>
          }
          {block.content?.caption && (
            <figcaption>{block.content.caption}</figcaption>
          )}
        </figure>
      )

    case 'tip':
      return (
        <div className={styles.blockTip}>
          <Lightbulb size={18} className={styles.tipIcon} />
          <p>{block.content}</p>
        </div>
      )

    case 'key_concepts':
      return (
        <div className={styles.blockConcepts}>
          <span className={styles.conceptsLabel}>Conceptos clave</span>
          <div className={styles.conceptsList}>
            {block.content.map((concept, i) => (
              <span key={i} className={styles.conceptChip}>{concept}</span>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}

function Lesson() {
  const { id } = useParams()
  // const { updateHearts } = useAuth() // HEARTS: desactivado temporalmente
  const called = useRef(false)

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (called.current) return
    called.current = true

    api.post(`/instrumento/${id}/modulo/iniciar`)
      .then((res) => {
        setLesson(res.data.data)
        // HEARTS: desactivado temporalmente
        // const hearts = res.data.hearts_left
        // if (hearts !== 'Infinito' && hearts !== null) {
        //   updateHearts(hearts)
        // }
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setError(err.response.data.message)
        } else if (err.response?.status === 404) {
          setError('Clase no encontrada')
        } else {
          setError('No se pudo cargar la clase')
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className={styles.status}>Cargando...</p>

  if (error) {
    return (
      <div className={styles.page}>
        <BackButton />
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  const blocks = lesson.blocks ?? []

  return (
    <div className={styles.page}>
      <BackButton />
      <h1 className={styles.title}>{lesson.title}</h1>
      <p className={styles.subtitle}>Leé el contenido y completá la clase</p>
      <div className={styles.content}>
        {blocks.length > 0
          ? blocks.map((block) => <LessonBlock key={block.block_id} block={block} />)
          : lesson.theory_content && <p className={styles.blockText}>{lesson.theory_content}</p>
        }
      </div>
    </div>
  )
}

export default Lesson
