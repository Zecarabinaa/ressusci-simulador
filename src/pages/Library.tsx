import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  BookOpenCheck,
  HeartPulse,
  Layers,
  Link2,
  Syringe,
  HelpCircle,
  GraduationCap,
  ClipboardCheck,
} from 'lucide-react'
import { cases } from '../data/cases'
import { modules } from '../data/modules'
import { ecgEntries } from '../data/ecgs'
import { externalResources } from '../data/resources'
import { doseEntries } from '../data/doses'
import { quizEntries } from '../data/quiz'
import { examQuestions } from '../data/exam'
import { rhythmChecklists } from '../data/megacode'
import { useSimulation } from '../context/SimulationContext'
import CasosTab from '../components/library/CasosTab'
import AtlasTab from '../components/library/AtlasTab'
import ModulosTab from '../components/library/ModulosTab'
import DosesTab from '../components/library/DosesTab'
import QuizTab from '../components/library/QuizTab'
import ProvaTab from '../components/library/ProvaTab'
import MegacodeTab from '../components/library/MegacodeTab'
import RecursosTab from '../components/library/RecursosTab'

type TabId = 'casos' | 'atlas' | 'modulos' | 'doses' | 'quiz' | 'prova' | 'megacode' | 'recursos'

const tabs: { id: TabId; label: string; icon: typeof Search }[] = [
  { id: 'casos', label: 'Casos Clínicos', icon: HeartPulse },
  { id: 'atlas', label: 'Atlas de ECG', icon: Layers },
  { id: 'modulos', label: 'Módulos RESSUSCI+', icon: BookOpenCheck },
  { id: 'doses', label: 'Doses e Energias', icon: Syringe },
  { id: 'quiz', label: 'Quiz V/F', icon: HelpCircle },
  { id: 'prova', label: 'Prova Teórica', icon: GraduationCap },
  { id: 'megacode', label: 'Checklist Megacode', icon: ClipboardCheck },
  { id: 'recursos', label: 'Recursos Externos', icon: Link2 },
]

export default function Library() {
  const navigate = useNavigate()
  const { setCaseId } = useSimulation()
  const [tab, setTab] = useState<TabId>('casos')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [revealedQuiz, setRevealedQuiz] = useState<Set<string>>(new Set())
  const [examAnswers, setExamAnswers] = useState<Record<number, string>>({})
  const [examScoreVisible, setExamScoreVisible] = useState(false)
  const [megacodeChecked, setMegacodeChecked] = useState<Set<string>>(new Set())
  const [activeScenario, setActiveScenario] = useState<string | null>(null)

  const toggleMegacodeItem = (key: string) => {
    setMegacodeChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleQuizReveal = (id: string) => {
    setRevealedQuiz((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const chooseExamAnswer = (id: number, letter: string) => {
    setExamAnswers((prev) => (prev[id] ? prev : { ...prev, [id]: letter }))
  }

  const examAnsweredCount = Object.keys(examAnswers).length
  const examCorrectCount = examQuestions.filter((q) => examAnswers[q.id] === q.correct).length

  const resetExam = () => {
    setExamAnswers({})
    setExamScoreVisible(false)
  }

  const categories = useMemo(() => Array.from(new Set(cases.map((c) => c.category))), [])

  const filteredCases = cases.filter((c) => {
    const matchesQuery = (c.title + c.chiefComplaint + c.category).toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !categoryFilter || c.category === categoryFilter
    return matchesQuery && matchesCategory
  })

  const filteredEcgs = ecgEntries.filter((e) =>
    (e.title + e.group + e.prompt).toLowerCase().includes(query.toLowerCase())
  )

  const filteredModules = modules.filter((m) => (m.title + m.summary).toLowerCase().includes(query.toLowerCase()))

  const goToCase = (id: string) => {
    setCaseId(id)
    navigate(`/setup/${id}`)
  }

  return (
    <div className="page-shell library-hub">
      <div className="library-heading section-heading">
        <div>
          <div className="section-index">BIBLIOTECA DE APOIO</div>
          <h2>Material de estudo RESSUSCI+</h2>
        </div>
        <span className="case-count">{cases.length + ecgEntries.length + modules.length + doseEntries.length + quizEntries.length + examQuestions.length + rhythmChecklists.length + externalResources.length} ITENS</span>
      </div>

      <div className="library-tabs">
        {tabs.map((t) => {
          const Icon = t.icon
          const count =
            t.id === 'casos'
              ? cases.length
              : t.id === 'atlas'
                ? ecgEntries.length
                : t.id === 'modulos'
                  ? modules.length
                  : t.id === 'doses'
                    ? doseEntries.length
                    : t.id === 'quiz'
                      ? quizEntries.length
                      : t.id === 'prova'
                        ? examQuestions.length
                        : t.id === 'megacode'
                          ? rhythmChecklists.length
                          : externalResources.length
          return (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              <Icon size={13} />
              {t.label}
              <span>{count}</span>
            </button>
          )
        })}
      </div>

      <div className="library-panel">
        {tab !== 'recursos' && tab !== 'doses' && tab !== 'quiz' && tab !== 'prova' && tab !== 'megacode' && (
          <div className="station-toolbar">
            <div className="station-search">
              <Search size={13} />
              <input
                placeholder="Buscar por título, categoria ou palavra-chave..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <span className="station-results">
              {tab === 'casos' && `${filteredCases.length} resultado(s)`}
              {tab === 'atlas' && `${filteredEcgs.length} resultado(s)`}
              {tab === 'modulos' && `${filteredModules.length} resultado(s)`}
            </span>
          </div>
        )}

        {tab === 'casos' && (
          <CasosTab
            categories={categories}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            filteredCases={filteredCases}
            setQuery={setQuery}
            goToCase={goToCase}
          />
        )}

        {tab === 'atlas' && <AtlasTab filteredEcgs={filteredEcgs} setQuery={setQuery} />}

        {tab === 'modulos' && <ModulosTab filteredModules={filteredModules} setQuery={setQuery} />}

        {tab === 'doses' && <DosesTab />}

        {tab === 'quiz' && <QuizTab revealedQuiz={revealedQuiz} toggleQuizReveal={toggleQuizReveal} />}

        {tab === 'prova' && (
          <ProvaTab
            examAnswers={examAnswers}
            examScoreVisible={examScoreVisible}
            setExamScoreVisible={setExamScoreVisible}
            chooseExamAnswer={chooseExamAnswer}
            resetExam={resetExam}
            examAnsweredCount={examAnsweredCount}
            examCorrectCount={examCorrectCount}
          />
        )}

        {tab === 'megacode' && (
          <MegacodeTab
            megacodeChecked={megacodeChecked}
            toggleMegacodeItem={toggleMegacodeItem}
            activeScenario={activeScenario}
            setActiveScenario={setActiveScenario}
            setMegacodeChecked={setMegacodeChecked}
          />
        )}

        {tab === 'recursos' && <RecursosTab />}
      </div>
    </div>
  )
}
