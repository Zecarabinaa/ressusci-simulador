import { useNavigate } from 'react-router-dom'
import { Award, CheckCircle2, Info, AlertTriangle, RotateCcw, BookOpenCheck, ExternalLink, Eye } from 'lucide-react'
import { useSimulation } from '../context/SimulationContext'
import { getCaseById } from '../data/cases'
import { externalResources } from '../data/resources'

const qualityScore: Record<string, number> = { strong: 100, partial: 60, review: 20 }
const qualityMarker: Record<string, string> = { strong: 'quality-strong', partial: 'quality-partial', review: 'quality-review' }

export default function Debrief() {
  const navigate = useNavigate()
  const { caseId, timeline, resetSession, startedAt } = useSimulation()
  const clinicalCase = caseId ? getCaseById(caseId) : undefined

  if (!clinicalCase || timeline.length === 0) {
    return (
      <div className="page-shell narrow-shell">
        <p>Nenhuma sessão concluída ainda.</p>
        <button className="secondary-button" onClick={() => navigate('/')}>
          Ir para a seleção de casos
        </button>
      </div>
    )
  }

  const total = timeline.reduce((sum, t) => sum + (qualityScore[t.quality] ?? 0), 0)
  const scorePct = Math.round(total / timeline.length)
  const strongCount = timeline.filter((t) => t.quality === 'strong').length
  const reviewCount = timeline.filter((t) => t.quality === 'review').length
  const durationMin = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : clinicalCase.durationMin

  const handleRestart = () => {
    resetSession()
    navigate('/')
  }

  return (
    <div className="page-shell debrief-shell">
      <div className="debrief-banner">
        <div className="debrief-icon">
          <Award size={20} />
        </div>
        <div>
          <span>
            <Eye size={10} style={{ marginRight: 5, verticalAlign: -1 }} />
            DIAGNÓSTICO REVELADO · CASO #{clinicalCase.caseNumber}
          </span>
          <h1>{clinicalCase.title}</h1>
          <p>{clinicalCase.category} · Debrief estruturado da sua simulação</p>
        </div>
      </div>

      <div className="score-row">
        <div className="score-main">
          <span>DESEMPENHO GERAL</span>
          <strong>
            {scorePct}<small>/100</small>
          </strong>
          <p>Média das classificações de cada decisão tomada</p>
        </div>
        <div className="score-stat">
          <span>Condutas adequadas</span>
          <strong>{strongCount}</strong>
        </div>
        <div className="score-stat">
          <span>A revisar</span>
          <strong>{reviewCount}</strong>
        </div>
        <div className="score-stat">
          <span>Duração</span>
          <strong>{durationMin} min</strong>
        </div>
      </div>

      <div className="debrief-grid">
        <div className="timeline-card">
          <div className="compact-heading">
            <h2>Linha do tempo das decisões</h2>
          </div>
          <div className="timeline-list">
            {timeline.map((entry, idx) => (
              <div className="timeline-item" key={idx}>
                <span className="timeline-marker">{idx + 1}</span>
                <div>
                  <span className="timeline-stage">{entry.stageLabel}</span>
                  <span className={`timeline-quality ${qualityMarker[entry.quality]}`}>
                    {entry.quality === 'strong' && <CheckCircle2 size={11} style={{ marginRight: 3 }} />}
                    {entry.quality === 'partial' && <Info size={11} style={{ marginRight: 3 }} />}
                    {entry.quality === 'review' && <AlertTriangle size={11} style={{ marginRight: 3 }} />}
                    {entry.quality === 'strong'
                      ? 'Adequada'
                      : entry.quality === 'partial'
                      ? 'Parcial'
                      : 'A revisar'}
                  </span>
                  <p className="timeline-choice">{entry.choiceLabel}</p>
                  <p className="timeline-feedback">{entry.feedback}</p>
                  {entry.nextStateText && (
                    <div className="timeline-next">
                      <strong>EVOLUÇÃO</strong>
                      {entry.nextStateText}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="debrief-side">
          <div className="side-card review-card">
            <div className="side-card-eyebrow">
              <BookOpenCheck size={12} /> PONTOS PARA REVISAR
            </div>
            {reviewCount > 0 ? (
              <div className="review-topic">
                <span>•</span>
                Revise o(s) passo(s) marcados como "a revisar" na linha do tempo e consulte o módulo
                correspondente na biblioteca antes da próxima tentativa.
              </div>
            ) : (
              <div className="review-topic">
                <span>•</span>
                Nenhuma conduta classificada como "a revisar" nesta sessão — bom domínio do algoritmo deste caso.
              </div>
            )}
            <div className="review-topic">
              <span>•</span>
              Categoria do caso: <strong>{clinicalCase.category}</strong> — revise o módulo correspondente na
              biblioteca para reforçar os conceitos.
            </div>
          </div>

          <div className="side-card reference-card">
            <div className="side-card-eyebrow">REFERÊNCIA RÁPIDA</div>
            <p>Diretrizes e materiais que sustentam os algoritmos usados neste caso.</p>
            {externalResources.slice(0, 2).map((r) => (
              <div key={r.id} style={{ marginBottom: 8 }}>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.title} <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="debrief-warning">
        <AlertTriangle size={13} />
        <p>
          <strong>Lembrete:</strong> este debrief é gerado por um simulador educacional. Ele não substitui a
          avaliação de um instrutor humano nem os protocolos oficiais do seu serviço.
        </p>
      </div>

      <div className="debrief-actions">
        <button className="secondary-button" onClick={() => navigate('/biblioteca')}>
          <BookOpenCheck size={14} /> Ir para a biblioteca
        </button>
        <button className="primary-button" onClick={handleRestart}>
          <RotateCcw size={14} /> Tentar outro caso
        </button>
      </div>
    </div>
  )
}
