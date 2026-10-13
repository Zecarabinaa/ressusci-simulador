import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Quality } from '../data/cases'

export type Mode = 'solo' | 'duo'

export interface TimelineEntry {
  stepIndex: number
  stageLabel: string
  choiceLabel: string
  quality: Quality
  feedback: string
  nextStateText?: string
}

interface SimulationState {
  caseId: string | null
  mode: Mode
  timeline: TimelineEntry[]
  startedAt: number | null
  setCaseId: (id: string) => void
  setMode: (mode: Mode) => void
  startSession: () => void
  addTimelineEntry: (entry: TimelineEntry) => void
  resetSession: () => void
}

const SimulationContext = createContext<SimulationState | undefined>(undefined)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [caseId, setCaseId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('solo')
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [startedAt, setStartedAt] = useState<number | null>(null)

  const startSession = () => {
    setTimeline([])
    setStartedAt(Date.now())
  }

  const addTimelineEntry = (entry: TimelineEntry) => {
    setTimeline((prev) => [...prev, entry])
  }

  const resetSession = () => {
    setCaseId(null)
    setTimeline([])
    setStartedAt(null)
  }

  return (
    <SimulationContext.Provider
      value={{ caseId, mode, timeline, startedAt, setCaseId, setMode, startSession, addTimelineEntry, resetSession }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error('useSimulation deve ser usado dentro de SimulationProvider')
  return ctx
}
