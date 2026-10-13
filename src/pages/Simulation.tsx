import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Circle,
  HeartPulse,
  Info,
  Siren,
  Users,
  User,
  ClipboardList,
  ArrowRight,
  EyeOff,
  Stethoscope,
  ListOrdered,
} from 'lucide-react'
import { getCaseById, type Choice } from '../data/cases'
import { useSimulation } from '../context/SimulationContext'
import { EcgStrip, CtFindingDisplay } from '../components/MonitorDisplay'

function formatClock(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function qualityLabel(q: Choice['quality']) {
  if (q === 'strong') return { text: 'Conduta/leitura adequada', cls: 'quality-strong' }
  if (q === 'partial') return { text: 'Parcialmente adequada', cls: 'quality-partial' }
  return { text: 'Requer revisão', cls: 'quality-review' }
}

export default function Simulation() {
  const { caseId = '' } = useParams()
  const navigate = useNavigate()
  const clinicalCase = getCaseById(caseId)
  const { mode, startedAt, addTimelineEntry, timeline } = useSimulation()

  const [stepIndex, setStepIndex] = useState(0)
  const [chosenId, setChosenId] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [facilitatorOpen, setFacilitatorOpen] = useState(false)

  useEffect(() => {
    if (!startedAt) return
    const interval = setInterval(() => setElapsed(Date.now() - startedAt), 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const step = clinicalCase?.steps[stepIndex]

  const shuffledChoices = useMemo(() => {
    if (!step) return []
    const arr = [...step.choices]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicalCase?.id, stepIndex])

  if (!clinicalCase || !step) {
    return (
      <div className="page-shell narrow-shell">
        <p>Caso não encontrado.</p>
      </div>
    )
  }

  const chosen = step.choices.find((c) => c.id === chosenId) ?? null
  const isLastStep = stepIndex === clinicalCase.steps.length - 1
  const progressPct = Math.round(((stepIndex + (chosen ? 1 : 0)) / clinicalCase.steps.length) * 100)
  const isIdentify = step.kind === 'identify'

  const handleChoose = (choice: Choice) => {
    if (chosenId) return
    setChosenId(choice.id)
    addTimelineEntry({
      stepIndex,
      stageLabel: `Etapa ${stepIndex + 1} · ${isIdentify ? 'Identificação' : step.patientType}`,
      choiceLabel: choice.label,
      quality: choice.quality,
      feedback: choice.feedback,
      nextStateText: choice.nextStateText,
    })
  }

  const handleNext = () => {
    if (isLastStep) {
      navigate('/debrief')
      return
    }
    setStepIndex((i) => i + 1)
    setChosenId(null)
  }

  const doneSteps = timeline.length

  return (
    <div className="page-shell simulation-shell">
      <div className="simulation-topline">
        <div className="session-status">
          <span className="live-dot" />
          SESSÃO EM ANDAMENTO
          <span className="status-divider" />
          <EyeOff size={11} /> DIAGNÓSTICO OCULTO
        </div>
        <div className="elapsed-clock">
          <Activity size={12} /> {formatClock(elapsed)}
        </div>
      </div>

      <div className="sim-heading">
        <div>
          <div className="section-index">
            ETAPA {stepIndex + 1} DE {clinicalCase.steps.length}
          </div>
          <h1>Caso Clínico #{clinicalCase.caseNumber}</h1>
          <p>
            {clinicalCase.broadCategory} · {step.patientKicker}
          </p>
        </div>
        <div className="mode-badge">
          {mode === 'duo' ? <Users size={12} /> : <User size={12} />}
          {mode === 'duo' ? 'Modo Duo' : 'Modo Solo'}
        </div>
      </div>

      <div className="progress-track">
        <span style={{ width: `${progressPct}%` }} />
      </div>

      <div className="sim-layout">
        <div className="sim-main-column">
          <div className="patient-card">
            <div className="patient-card-header">
              <div>
                <span className="patient-icon">
                  <HeartPulse size={16} />
                </span>
              </div>
              <span className="patient-type">{step.patientType}</span>
            </div>
            <span className="patient-kicker">VINHETA CLÍNICA</span>
            <h2>{step.vignette}</h2>
            <div className="vital-row">
              {step.vitals.map((v) => (
                <span className="vital-chip" key={v}>
                  {v}
                </span>
              ))}
            </div>

            {step.monitor.type === 'ecg' && step.monitor.rhythmKey && (
              <div style={{ marginTop: 13 }}>
                <EcgStrip rhythmKey={step.monitor.rhythmKey} />
              </div>
            )}
            {step.monitor.type === 'ct' && step.monitor.ctFinding && (
              <div style={{ marginTop: 13 }}>
                <CtFindingDisplay finding={step.monitor.ctFinding} />
              </div>
            )}
          </div>

          <div className="decision-panel">
            <div className="decision-header">
              <div>
                <span className="eyebrow" style={{ marginBottom: 4 }}>
                  {isIdentify ? (
                    <>
                      <Stethoscope size={11} style={{ marginRight: 5 }} /> IDENTIFICAÇÃO DO ACHADO
                    </>
                  ) : (
                    'DECISÃO CLÍNICA'
                  )}
                </span>
                <h2>{step.question}</h2>
              </div>
              <span className="decision-count">
                {stepIndex + 1}/{clinicalCase.steps.length}
              </span>
            </div>

            {mode === 'duo' && (
              <div className="duo-instruction">
                <Users size={12} />
                Combinem entre vocês: um apresenta a conduta em voz alta (líder), o outro confirma de volta
                (comunicação em alça fechada) antes de escolher.
              </div>
            )}

            <div className="choice-list">
              {shuffledChoices.map((choice, idx) => {
                const isChosen = chosenId === choice.id
                const letters = ['A', 'B', 'C', 'D']
                return (
                  <button
                    key={choice.id}
                    className={`choice-button${isChosen ? ' chosen' : ''}${
                      chosenId && !isChosen ? ' choice-muted' : ''
                    }`}
                    onClick={() => handleChoose(choice)}
                    disabled={!!chosenId}
                  >
                    <span className="choice-letter">{letters[idx]}</span>
                    <span className="choice-label">{choice.label}</span>
                    {isChosen ? (
                      <CheckCircle2 size={14} className="choice-check" />
                    ) : (
                      <ChevronRight size={14} className="choice-arrow" />
                    )}
                  </button>
                )
              })}
            </div>

            {chosen && (
              <div className="decision-result">
                <div className="result-heading">
                  <span className={qualityLabel(chosen.quality).cls}>
                    {chosen.quality === 'strong' && <CheckCircle2 size={13} />}
                    {chosen.quality === 'partial' && <Info size={13} />}
                    {chosen.quality === 'review' && <AlertTriangle size={13} />}
                    {qualityLabel(chosen.quality).text}
                  </span>
                  <span className="result-focus">FEEDBACK</span>
                </div>
                <p>{chosen.feedback}</p>

                {chosen.nextStateText && (
                  <div className="next-state">
                    <span>{chosen.nextStateLabel ?? 'EVOLUÇÃO DO CASO'}</span>
                    <p>{chosen.nextStateText}</p>
                  </div>
                )}

                <button className="primary-button next-button" onClick={handleNext}>
                  {isLastStep ? 'Ver resultado final' : 'Avançar para próxima etapa'} <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sim-side-column">
          <div className="side-card">
            <div className="side-card-eyebrow">
              <ListOrdered size={12} /> FASE DO ALGORITMO (AHA)
            </div>
            {clinicalCase.algorithmPhases.map((phase, idx) => (
              <div
                className="skill-line"
                key={phase}
                style={{
                  fontWeight: idx === stepIndex ? 800 : 500,
                  alignItems: 'flex-start',
                  marginTop: idx === 0 ? 0 : 12,
                  lineHeight: 1.45,
                }}
              >
                <span
                  className={idx < stepIndex ? 'skill-done' : idx === stepIndex ? 'skill-todo' : 'skill-todo'}
                  style={{ marginTop: 1, flexShrink: 0 }}
                >
                  {idx < stepIndex ? (
                    <CheckCircle2 size={10} />
                  ) : idx === stepIndex ? (
                    <Circle size={10} fill="#126d59" color="#126d59" />
                  ) : (
                    <Circle size={10} />
                  )}
                </span>
                <span style={{ color: idx === stepIndex ? 'var(--teal-dark)' : undefined }}>{phase}</span>
              </div>
            ))}
          </div>

          {mode === 'duo' && (
            <div className="side-card team-card">
              <div className="side-card-eyebrow">
                <Users size={12} /> EQUIPE SIMULADA
              </div>
              <div className="role-line">
                <span className="role-avatar leader-avatar">L</span>
                <div>
                  <strong>Líder da equipe</strong>
                  <span>Atribui tarefas e decide condutas</span>
                </div>
              </div>
              <div className="role-line">
                <span className="role-avatar facilitator-avatar">F</span>
                <div>
                  <strong>Liderado / apoio</strong>
                  <span>Confirma ordens, executa e se manifesta</span>
                </div>
              </div>
            </div>
          )}

          <div className="side-card checklist-card">
            <div className="side-card-eyebrow">
              <ClipboardList size={12} /> CHECKLIST DO CASO
            </div>
            {clinicalCase.steps.map((s, idx) => (
              <div className="skill-line" key={s.id}>
                <span className={idx < doneSteps ? 'skill-done' : 'skill-todo'}>
                  {idx < doneSteps ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                </span>
                Etapa {idx + 1}: {s.kind === 'identify' ? 'Identificação do achado' : s.patientType}
              </div>
            ))}
          </div>

          <div className="side-card facilitator-card">
            <button
              className="facilitator-toggle"
              aria-expanded={facilitatorOpen}
              onClick={() => setFacilitatorOpen((v) => !v)}
            >
              <span className="side-card-eyebrow">
                <Siren size={12} /> NOTAS DO FACILITADOR
              </span>
              <span>
                <ChevronRight size={13} />
              </span>
            </button>
            {facilitatorOpen && (
              <div className="facilitator-notes">
                <strong>Categoria ampla: {clinicalCase.broadCategory}</strong>
                <p>
                  Este caso é baseado nos algoritmos apresentados no curso RESSUSCI+ e nas diretrizes da American
                  Heart Association. O diagnóstico específico só é revelado no debrief — discuta em grupo o porquê
                  de cada alternativa antes de avançar.
                </p>
                <span>Não substitui protocolo institucional vigente.</span>
              </div>
            )}
          </div>

          <div className="side-progress">
            <span>PROGRESSO DA SESSÃO</span>
            <strong>
              {Math.min(doneSteps, clinicalCase.steps.length)}/{clinicalCase.steps.length} <small>etapas</small>
            </strong>
            <div className="mini-progress">
              <span style={{ width: `${(doneSteps / clinicalCase.steps.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="sim-bottom-note">
        <AlertTriangle size={12} />
        Ambiente simulado — decisões aqui não afetam pacientes reais.
      </div>
    </div>
  )
}
