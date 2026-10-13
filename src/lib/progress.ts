export interface SessionRecord {
  caseId: string
  caseTitle: string
  scorePct: number
  strongCount: number
  reviewCount: number
  totalSteps: number
  durationMin: number
  completedAt: number
}

const STORAGE_KEY = 'ressusci_sessions_v1'
const MAX_RECORDS = 200

function readAll(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(records: SessionRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_RECORDS)))
  } catch {
    // localStorage indisponível (modo privado, cota excedida) — progresso simplesmente não persiste
  }
}

export function saveSession(record: SessionRecord) {
  const all = readAll()
  all.push(record)
  writeAll(all)
}

export function getSessions(): SessionRecord[] {
  return readAll()
}

export function getBestScoreForCase(caseId: string): number | null {
  const scores = readAll()
    .filter((r) => r.caseId === caseId)
    .map((r) => r.scorePct)
  return scores.length ? Math.max(...scores) : null
}

export function getAttemptsForCase(caseId: string): number {
  return readAll().filter((r) => r.caseId === caseId).length
}

export function getOverallStats() {
  const all = readAll()
  if (all.length === 0) return { totalSessions: 0, avgScore: 0, uniqueCases: 0 }
  const avgScore = Math.round(all.reduce((sum, r) => sum + r.scorePct, 0) / all.length)
  const uniqueCases = new Set(all.map((r) => r.caseId)).size
  return { totalSessions: all.length, avgScore, uniqueCases }
}

export function clearSessions() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignora se localStorage não estiver disponível
  }
}
