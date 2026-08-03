import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'
import BackButton from '../../components/BackButton/BackButton'
import { NOTE_STRINGS, INSTRUMENTS } from './instruments'
import styles from './Tuner.module.css'

function freqToNote(freq) {
  return Math.round(12 * (Math.log2(freq / 440)) + 69)
}

function noteToFreq(note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

function getNoteName(note) {
  return NOTE_STRINGS[((note % 12) + 12) % 12]
}

function getCents(freq, note) {
  return Math.floor((1200 * Math.log2(freq / noteToFreq(note))) * 10) / 10
}

function yin(buffer, sampleRate) {
  const threshold = 0.1
  const halfLen = Math.floor(buffer.length / 2)

  let rms = 0
  for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i]
  if (Math.sqrt(rms / buffer.length) < 0.01) return -1

  const diff = new Float32Array(halfLen)
  for (let tau = 1; tau < halfLen; tau++) {
    for (let i = 0; i < halfLen; i++) {
      const delta = buffer[i] - buffer[i + tau]
      diff[tau] += delta * delta
    }
  }

  const cmndf = new Float32Array(halfLen)
  cmndf[0] = 1
  let runningSum = 0
  for (let tau = 1; tau < halfLen; tau++) {
    runningSum += diff[tau]
    cmndf[tau] = runningSum === 0 ? 0 : diff[tau] / (runningSum / tau)
  }

  let tau = 2
  while (tau < halfLen) {
    if (cmndf[tau] < threshold) {
      while (tau + 1 < halfLen && cmndf[tau + 1] < cmndf[tau]) tau++
      break
    }
    tau++
  }
  if (tau === halfLen) return -1

  if (tau > 0 && tau < halfLen - 1) {
    const x1 = cmndf[tau - 1], x2 = cmndf[tau], x3 = cmndf[tau + 1]
    const denom = 2 * (2 * x2 - x1 - x3)
    if (denom !== 0) tau += (x3 - x1) / denom
  }

  return sampleRate / tau
}

function closestString(freq, strings) {
  return strings.reduce((prev, curr) =>
    Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev
  )
}

export default function Tuner() {
  const [selectedInstrument, setSelectedInstrument] = useState(null)
  const [active, setActive] = useState(false)
  const [note, setNote] = useState(null)
  const [cents, setCents] = useState(0)
  const [freq, setFreq] = useState(null)
  const [nearest, setNearest] = useState(null)
  const [error, setError] = useState('')

  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const instrumentRef = useRef(null)

  function analyse() {
    const analyser = analyserRef.current
    if (!analyser) return
    const buffer = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(buffer)
    const inst = instrumentRef.current
    const detectedFreq = yin(buffer, audioCtxRef.current.sampleRate)

    if (detectedFreq !== -1 && detectedFreq > inst.freqMin && detectedFreq < inst.freqMax) {
      const midiNote = freqToNote(detectedFreq)
      const c = getCents(detectedFreq, midiNote)
      setFreq(Math.round(detectedFreq * 10) / 10)
      setNote(getNoteName(midiNote))
      setCents(c)
      setNearest(closestString(detectedFreq, inst.strings))
    }

    rafRef.current = requestAnimationFrame(analyse)
  }

  async function startTuner() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      source.connect(analyser)
      analyserRef.current = analyser
      setActive(true)
      rafRef.current = requestAnimationFrame(analyse)
    } catch {
      setError('No se pudo acceder al micrófono. Revisá los permisos del navegador.')
    }
  }

  function stopTuner() {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close()
    analyserRef.current = null
    audioCtxRef.current = null
    streamRef.current = null
    setActive(false)
    setNote(null)
    setFreq(null)
    setCents(0)
    setNearest(null)
  }

  function selectInstrument(inst) {
    if (active) stopTuner()
    instrumentRef.current = inst
    setSelectedInstrument(inst)
  }

  function goBack() {
    if (active) stopTuner()
    setSelectedInstrument(null)
  }

  useEffect(() => () => stopTuner(), [])

  const tuned = Math.abs(cents) < 5
  const slightOff = Math.abs(cents) >= 5 && Math.abs(cents) < 15
  const needlePercent = Math.max(0, Math.min(100, 50 + (cents / 50) * 50))
  const needleColor = tuned ? '#33AB1B' : slightOff ? '#ffc107' : '#ff6b6b'

  // Pantalla de selección de instrumento
  if (!selectedInstrument) {
    return (
      <div className={styles.page}>
        <BackButton />
        <h1 className={styles.title}>Afinador</h1>
        <p className={styles.subtitle}>Elegí tu instrumento</p>
        <div className={styles.instrumentGrid}>
          {INSTRUMENTS.map((inst) => {
            const Icon = inst.icon
            return (
              <button
                key={inst.id}
                className={styles.instrumentCard}
                onClick={() => selectInstrument(inst)}
              >
                <Icon size={56} color="#33AB1B" />
                <span>{inst.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Pantalla del afinador
  const Icon = selectedInstrument.icon
  return (
    <div className={styles.page}>
      <BackButton />
      <h1 className={styles.title}>Afinador</h1>

      <div className={styles.card}>
        {/* Instrumento seleccionado */}
        <div className={styles.instrumentHeader}>
          <Icon size={20} color="#33AB1B" />
          <span className={styles.instrumentName}>{selectedInstrument.label}</span>
          <button className={styles.changeBtn} onClick={goBack}>Cambiar</button>
        </div>

        {/* Nota detectada */}
        <div className={styles.noteDisplay}>
          <span className={styles.noteName} style={{ color: needleColor }}>
            {note ?? '–'}
          </span>
          {freq && <span className={styles.freq}>{freq} Hz</span>}
        </div>

        {/* Medidor */}
        <div className={styles.meter}>
          <div className={styles.meterTrack}>
            <div
              className={styles.meterNeedle}
              style={{ left: `${needlePercent}%`, backgroundColor: needleColor }}
            />
            <div className={styles.meterCenter} />
          </div>
          <div className={styles.meterLabels}>
            <span>Bajo</span>
            <span style={{ color: tuned ? '#33AB1B' : 'rgba(255,255,255,0.4)' }}>
              {tuned && note ? '✓ Afinado' : cents !== 0 ? `${cents > 0 ? '+' : ''}${cents} ¢` : '–'}
            </span>
            <span>Alto</span>
          </div>
        </div>

        {/* Cuerdas */}
        <div className={styles.strings}>
          {selectedInstrument.strings.map((s) => (
            <div
              key={s.name}
              className={`${styles.stringBtn} ${nearest?.name === s.name ? styles.stringActive : ''}`}
            >
              {s.name}
            </div>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={`${styles.btn} ${active ? styles.btnStop : styles.btnStart}`}
          onClick={active ? stopTuner : startTuner}
        >
          {active ? <MicOff size={20} /> : <Mic size={20} />}
          {active ? 'Detener' : 'Activar micrófono'}
        </button>
      </div>
    </div>
  )
}
