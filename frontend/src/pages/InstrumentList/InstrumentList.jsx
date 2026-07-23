import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card/Card'
import BackButton from '../../components/BackButton/BackButton'
import api from '../../services/api'
import { storageUrl } from '../../services/storage'
import styles from './InstrumentList.module.css'

function InstrumentList() {
  const navigate = useNavigate()
  const [instruments, setInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/instrumentos')
      .then((res) => setInstruments(res.data.data))
      .catch(() => setError('No se pudieron cargar los instrumentos'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <BackButton />
      <h1 className={styles.title}>Instrumentos</h1>
      <p className={styles.subtitle}>Elegí un instrumento para empezar a aprender</p>

      {loading && <p className={styles.status}>Cargando...</p>}
      {error && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

      <div className={styles.grid}>
        {instruments.map((inst) => (
          <Card
            key={inst.instrument_id}
            title={inst.name}
            image={storageUrl(inst.image)}
            onClick={() => navigate(`/instrumento/${inst.instrument_id}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default InstrumentList
