import { Guitar, Piano, Music2, AudioWaveform, Drum, Mic, Music } from 'lucide-react'

// Iconos disponibles para elegir al crear/editar un instrumento.
// `value` es lo que se guarda en la base (columna `icon`).
export const INSTRUMENT_ICONS = [
  { value: 'guitarra', label: 'Guitarra',        Icon: Guitar },
  { value: 'piano',    label: 'Piano',           Icon: Piano },
  { value: 'bajo',     label: 'Bajo',            Icon: Music2 },
  { value: 'violin',   label: 'Violín',          Icon: AudioWaveform },
  { value: 'bateria',  label: 'Batería',         Icon: Drum },
  { value: 'voz',      label: 'Voz / Micrófono', Icon: Mic },
  { value: 'otro',     label: 'Otro',            Icon: Music },
]

// Devuelve el componente de icono para un `value` guardado.
// Si no lo encuentra, usa el genérico (último de la lista).
export function getInstrumentIcon(value) {
  const found = INSTRUMENT_ICONS.find((i) => i.value === value)
  return (found ?? INSTRUMENT_ICONS[INSTRUMENT_ICONS.length - 1]).Icon
}
