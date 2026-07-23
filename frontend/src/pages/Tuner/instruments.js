import { Guitar, Music2, Piano, AudioWaveform } from 'lucide-react'

export const NOTE_STRINGS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const INSTRUMENTS = [
  {
    id: 'guitar',
    label: 'Guitarra',
    icon: Guitar,
    freqMin: 60,
    freqMax: 1400,
    strings: [
      { name: 'E2', freq: 82.41 },
      { name: 'A2', freq: 110.0 },
      { name: 'D3', freq: 146.83 },
      { name: 'G3', freq: 196.0 },
      { name: 'B3', freq: 246.94 },
      { name: 'E4', freq: 329.63 },
    ],
  },
  {
    id: 'violin',
    label: 'Violín',
    icon: AudioWaveform,
    freqMin: 180,
    freqMax: 3000,
    strings: [
      { name: 'G3', freq: 196.0 },
      { name: 'D4', freq: 293.66 },
      { name: 'A4', freq: 440.0 },
      { name: 'E5', freq: 659.25 },
    ],
  },
]
