import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  BookOpenCheck,
  HeartPulse,
  Layers,
  Link2,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  Clock,
  Syringe,
  CheckCircle2,
  XCircle,
  HelpCircle,
  GraduationCap,
} from 'lucide-react'
import { cases } from '../data/cases'
import CaseIcon from '../components/CaseIcon'
import { modules } from '../data/modules'
import { ecgEntries } from '../data/ecgs'
import { externalResources } from '../data/resources'
import { doseEntries } from '../data/doses'
import { quizEntries } from '../data/quiz'
import { hCauses, tCauses } from '../data/causes'
import { premonitorySigns, confirmatorySigns } from '../data/signs'
import { examQuestions } from '../data/exam'
import { useSimulation } from '../context/SimulationContext'
import { EcgStrip } from '../components/MonitorDisplay'

type TabId = 'casos' | 'atlas' | 'modulos' | 'doses' | 'quiz' | 'prova' | 'recursos'

const tabs: { id: TabId; label: string; icon: typeof Search }[] = [
  { id: 'casos', label: 'Casos Clínicos', icon: HeartPulse },
  { id: 'atlas', label: 'Atlas de ECG', icon: Layers },
  { id: 'modulos', label: 'Módulos RESSUSCI+', icon: BookOpenCheck },
  { id: 'doses', label: 'Doses e Energias', icon: Syringe },
  { id: 'quiz', label: 'Quiz V/F', icon: HelpCircle },
  { id: 'prova', label: 'Prova Teórica', icon: GraduationCap },
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
        <span className="case-count">{cases.length + ecgEntries.length + modules.length + doseEntries.length + quizEntries.length + examQuestions.length + externalResources.length} ITENS</span>
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
        {tab !== 'recursos' && tab !== 'doses' && tab !== 'quiz' && tab !== 'prova' && (
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
          <>
            <div className="filter-chips">
              <button className={!categoryFilter ? 'active' : ''} onClick={() => setCategoryFilter(null)}>
                Todas as categorias
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={categoryFilter === cat ? 'active' : ''}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredCases.length === 0 ? (
              <div className="empty-library">
                <strong>Nenhum caso encontrado</strong>
                <button onClick={() => { setQuery(''); setCategoryFilter(null) }}>Limpar filtros</button>
              </div>
            ) : (
              <div className="case-grid">
                {filteredCases.map((c) => (
                  <button key={c.id} className="case-card" onClick={() => goToCase(c.id)}>
                    <div className="case-card-top">
                      <span className="case-icon">
                        <CaseIcon icon={c.icon} />
                      </span>
                      <span className="case-difficulty">{c.difficulty}</span>
                    </div>
                    <span className="case-category">{c.category}</span>
                    <h3>{c.title}</h3>
                    <p>{c.chiefComplaint}</p>
                    <div className="case-card-bottom">
                      <span>
                        <Clock size={11} /> {c.durationMin} min
                      </span>
                      <span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'atlas' && (
          <>
            <div className="atlas-intro">
              <div>
                <span className="section-index">LEITURA DE RITMOS</span>
                <h3>Atlas de referência de ECG</h3>
                <p>Descrições textuais dos principais ritmos trabalhados nos casos e módulos do curso.</p>
              </div>
            </div>
            {filteredEcgs.length === 0 ? (
              <div className="empty-library">
                <strong>Nenhum ritmo encontrado</strong>
                <button onClick={() => setQuery('')}>Limpar busca</button>
              </div>
            ) : (
              <div className="ecg-grid">
                {filteredEcgs.map((e) => (
                  <div className="ecg-card" key={e.id}>
                    <EcgStrip rhythmKey={e.rhythmKey} />
                    <div className="ecg-card-body">
                      <span className="ecg-group">{e.group}</span>
                      <h3>{e.title}</h3>
                      <p className="ecg-prompt">{e.prompt}</p>
                      <p className="ecg-source">{e.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="ecg-caution">
              <AlertTriangle size={14} />
              <p>
                <strong>Importante:</strong> estas descrições são resumos didáticos para revisão rápida — sempre
                confirme a leitura de um ECG real com um traçado completo e, se necessário, um especialista.
              </p>
            </div>
          </>
        )}

        {tab === 'modulos' && (
          <>
            {filteredModules.length === 0 ? (
              <div className="empty-library">
                <strong>Nenhum módulo encontrado</strong>
                <button onClick={() => setQuery('')}>Limpar busca</button>
              </div>
            ) : (
              <div className="module-grid">
                {filteredModules.map((m) => (
                  <div className="module-card" key={m.id}>
                    <span className="module-number">{m.number}</span>
                    <div>
                      <h3>{m.title}</h3>
                      <p>{m.summary}</p>
                      <span className="module-count">{m.pointCount} pontos-chave</span>
                    </div>
                    <button>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="supplemental-module">
              <span>
                <BookOpenCheck size={12} /> MATERIAL COMPLEMENTAR
              </span>
              <h3>PDF — Descrição das falas do RESSUSCI+</h3>
              <p>
                Resumo completo de todos os 10 módulos, com os pontos principais ditos por cada instrutor.
              </p>
              <a className="text-action" href="/ressusci-descricao-falas.pdf" target="_blank" rel="noreferrer">
                Abrir PDF <ExternalLink size={11} />
              </a>
            </div>
          </>
        )}

        {tab === 'doses' && (
          <>
            <div className="atlas-intro">
              <div>
                <span className="section-index">CONSULTA RÁPIDA</span>
                <h3>Doses e energias de referência</h3>
                <p>Resumo das doses e cargas usadas nos casos, baseado nas diretrizes da AHA — para consulta rápida, não para decisão clínica direta.</p>
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div className="ecg-group" style={{ marginBottom: 8, display: 'block' }}>Reconhecimento da PCR</div>
              <div className="resource-grid">
                <div className="resource-card">
                  <div className="resource-card-top">
                    <span className="resource-brand">SINAIS PREMONITÓRIOS</span>
                  </div>
                  <p style={{ fontSize: 9, color: '#77847e', margin: '6px 0 10px' }}>Podem anteceder a parada — fique atento.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {premonitorySigns.map((s) => (
                      <span key={s} className="vital-chip">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="resource-card">
                  <div className="resource-card-top">
                    <span className="resource-brand" style={{ color: '#aa4e38' }}>SINAIS COMPROBATÓRIOS</span>
                  </div>
                  <p style={{ fontSize: 9, color: '#77847e', margin: '6px 0 10px' }}>Confirmam a PCR — inicie as compressões imediatamente.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {confirmatorySigns.map((s) => (
                      <span key={s} className="vital-chip">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div className="ecg-group" style={{ marginBottom: 8, display: 'block' }}>Causas reversíveis — 5H e 5T</div>
              <div className="resource-grid">
                <div className="resource-card" style={{ background: '#f2f8f4' }}>
                  <div className="resource-card-top">
                    <span className="resource-brand" style={{ color: 'var(--teal-dark)' }}>OS 5H</span>
                  </div>
                  <div style={{ display: 'grid', gap: 9, marginTop: 10 }}>
                    {hCauses.map((c) => (
                      <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span
                          style={{
                            flex: 'none',
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: 'var(--teal-dark)',
                            color: '#fff',
                            fontSize: 8,
                            fontWeight: 800,
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {c.letter}
                        </span>
                        <div>
                          <strong style={{ fontSize: 10, color: 'var(--ink)' }}>{c.name}</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 9, color: '#5f6e67', lineHeight: 1.5 }}>{c.hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="resource-card" style={{ background: '#fff3ec' }}>
                  <div className="resource-card-top">
                    <span className="resource-brand" style={{ color: '#a05a40' }}>OS 5T</span>
                  </div>
                  <div style={{ display: 'grid', gap: 9, marginTop: 10 }}>
                    {tCauses.map((c) => (
                      <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span
                          style={{
                            flex: 'none',
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#a05a40',
                            color: '#fff',
                            fontSize: 8,
                            fontWeight: 800,
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {c.letter}
                        </span>
                        <div>
                          <strong style={{ fontSize: 10, color: 'var(--ink)' }}>{c.name}</strong>
                          <p style={{ margin: '2px 0 0', fontSize: 9, color: '#5f6e67', lineHeight: 1.5 }}>{c.hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {Array.from(new Set(doseEntries.map((d) => d.group))).map((group) => (
              <div key={group} style={{ marginBottom: 18 }}>
                <div className="ecg-group" style={{ marginBottom: 8, display: 'block' }}>{group}</div>
                <table className="index" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {doseEntries
                      .filter((d) => d.group === group)
                      .map((d) => (
                        <tr key={d.id} style={{ borderBottom: '1px solid var(--line)' }}>
                          <td style={{ padding: '8px 10px', fontSize: 11, fontWeight: 700, color: 'var(--ink)', width: '34%' }}>{d.drug}</td>
                          <td style={{ padding: '8px 10px', fontSize: 11, color: 'var(--teal-dark)', fontWeight: 650 }}>{d.dose}</td>
                          <td style={{ padding: '8px 10px', fontSize: 9, color: '#77847e' }}>{d.note ?? ''}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
            <div className="ecg-caution">
              <AlertTriangle size={14} />
              <p>
                <strong>Importante:</strong> esta tabela é um apoio de memória, baseada no curso RESSUSCI+ e nas diretrizes da AHA. Sempre confirme doses e cargas pelo protocolo vigente do seu serviço antes de aplicar na prática real.
              </p>
            </div>
          </>
        )}

        {tab === 'quiz' && (
          <>
            <div className="atlas-intro">
              <div>
                <span className="section-index">VERDADEIRO OU FALSO</span>
                <h3>Quiz rápido — pegadinhas clássicas de prova</h3>
                <p>Afirmações no estilo de provas teóricas e práticas de ACLS. Clique para revelar a resposta e a explicação.</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 9 }}>
              {quizEntries.map((q, idx) => {
                const isOpen = revealedQuiz.has(q.id)
                return (
                  <button
                    key={q.id}
                    onClick={() => toggleQuizReveal(q.id)}
                    style={{
                      textAlign: 'left',
                      padding: '13px 15px',
                      border: `1px solid ${isOpen ? (q.answer ? '#4a9b7e' : '#d9b3a8') : 'var(--line)'}`,
                      borderRadius: 10,
                      background: isOpen ? (q.answer ? '#eef8f3' : '#fff3ec') : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span
                        style={{
                          flex: 'none',
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: '#edf1ee',
                          color: '#63716b',
                          fontSize: 9,
                          fontWeight: 800,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 11, color: 'var(--ink)', lineHeight: 1.5 }}>{q.statement}</p>
                        {isOpen && (
                          <div style={{ marginTop: 9, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                            {q.answer ? (
                              <CheckCircle2 size={14} color="#137158" style={{ flex: 'none', marginTop: 1 }} />
                            ) : (
                              <XCircle size={14} color="#aa4e38" style={{ flex: 'none', marginTop: 1 }} />
                            )}
                            <div>
                              <strong style={{ fontSize: 10, color: q.answer ? '#137158' : '#aa4e38' }}>
                                {q.answer ? 'VERDADEIRO' : 'FALSO'}
                              </strong>
                              <p style={{ margin: '3px 0 0', fontSize: 10, color: '#53625b', lineHeight: 1.55 }}>{q.explanation}</p>
                            </div>
                          </div>
                        )}
                        {!isOpen && <span style={{ fontSize: 8, color: '#8b9690', fontWeight: 700 }}>CLIQUE PARA VER A RESPOSTA</span>}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {tab === 'prova' && (
          <>
            <div className="atlas-intro">
              <div>
                <span className="section-index">SIMULAÇÃO DA PROVA PRÁTICA/TEÓRICA</span>
                <h3>Prova teórica completa — 50 questões</h3>
                <p>
                  Questões no estilo da avaliação oficial do provedor ACLS, incluindo os cenários usados na prova
                  prática (vinhetas com múltiplas perguntas em sequência) e os traçados de ECG mostrados nelas.
                  Responda, veja o feedback na hora e confira sua pontuação final.
                </p>
              </div>
            </div>

            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                marginBottom: 16,
                borderRadius: 10,
                background: '#123b34',
                color: '#fff',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700 }}>
                {examAnsweredCount}/{examQuestions.length} respondidas
                {examAnsweredCount === examQuestions.length && (
                  <span style={{ marginLeft: 10, color: '#9bc9b8' }}>
                    Acertos: {examCorrectCount}/{examQuestions.length} ({Math.round((examCorrectCount / examQuestions.length) * 100)}%)
                  </span>
                )}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {examAnsweredCount === examQuestions.length && (
                  <button
                    className="primary-button"
                    style={{ minHeight: 30, padding: '0 12px', fontSize: 10, background: '#fff', color: 'var(--teal-dark)' }}
                    onClick={() => setExamScoreVisible((v) => !v)}
                  >
                    {examScoreVisible ? 'Ocultar resumo' : 'Ver resumo'}
                  </button>
                )}
                <button
                  className="secondary-button"
                  style={{ minHeight: 30, padding: '0 12px', fontSize: 10, background: 'transparent', color: '#fff', borderColor: '#2e5a4f' }}
                  onClick={resetExam}
                >
                  Reiniciar prova
                </button>
              </div>
            </div>

            {examScoreVisible && examAnsweredCount === examQuestions.length && (
              <div className="ecg-caution" style={{ background: '#eef8f3', borderColor: '#4a9b7e', marginBottom: 16 }}>
                <GraduationCap size={14} color="#137158" />
                <p>
                  <strong>Resultado final:</strong> você acertou {examCorrectCount} de {examQuestions.length} questões (
                  {Math.round((examCorrectCount / examQuestions.length) * 100)}%). Revise abaixo as marcadas em vermelho antes de tentar de novo.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gap: 10 }}>
              {examQuestions.map((q) => {
                const chosen = examAnswers[q.id]
                const isAnswered = !!chosen
                return (
                  <div
                    key={q.id}
                    style={{
                      padding: '15px 16px',
                      border: `1px solid ${isAnswered ? (chosen === q.correct ? '#4a9b7e' : '#d9b3a8') : 'var(--line)'}`,
                      borderRadius: 11,
                      background: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--ink)', lineHeight: 1.55, fontWeight: 600 }}>
                        <span style={{ color: 'var(--teal)' }}>{q.id}.</span> {q.statement}
                      </p>
                    </div>

                    {q.rhythmKey && (
                      <div style={{ margin: '10px 0' }}>
                        <EcgStrip rhythmKey={q.rhythmKey} />
                      </div>
                    )}

                    <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
                      {q.options.map((opt) => {
                        const isChosen = chosen === opt.letter
                        const isCorrectOpt = opt.letter === q.correct
                        let bg = '#fbfcfb'
                        let border = '#e2e8e3'
                        if (isAnswered && isCorrectOpt) {
                          bg = '#eef8f3'
                          border = '#4a9b7e'
                        } else if (isAnswered && isChosen && !isCorrectOpt) {
                          bg = '#fff3ec'
                          border = '#d9b3a8'
                        }
                        return (
                          <button
                            key={opt.letter}
                            onClick={() => chooseExamAnswer(q.id, opt.letter)}
                            disabled={isAnswered}
                            style={{
                              textAlign: 'left',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 9,
                              padding: '9px 11px',
                              borderRadius: 9,
                              border: `1px solid ${border}`,
                              background: bg,
                              cursor: isAnswered ? 'default' : 'pointer',
                            }}
                          >
                            <span
                              style={{
                                flex: 'none',
                                width: 20,
                                height: 20,
                                borderRadius: 6,
                                background: isAnswered && isCorrectOpt ? 'var(--teal-dark)' : '#edf1ee',
                                color: isAnswered && isCorrectOpt ? '#fff' : '#63716b',
                                fontSize: 9,
                                fontWeight: 800,
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              {opt.letter}
                            </span>
                            <span style={{ fontSize: 10, color: 'var(--ink)', lineHeight: 1.45 }}>{opt.text}</span>
                            {isAnswered && isCorrectOpt && <CheckCircle2 size={13} color="#137158" style={{ marginLeft: 'auto', flex: 'none' }} />}
                            {isAnswered && isChosen && !isCorrectOpt && <XCircle size={13} color="#aa4e38" style={{ marginLeft: 'auto', flex: 'none' }} />}
                          </button>
                        )
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: '9px 11px',
                          borderRadius: 8,
                          background: chosen === q.correct ? '#eef8f3' : '#fff3ec',
                        }}
                      >
                        <strong style={{ fontSize: 9, color: chosen === q.correct ? '#137158' : '#aa4e38' }}>
                          {chosen === q.correct ? 'CORRETO' : `INCORRETO — a resposta certa é ${q.correct}`}
                        </strong>
                        <p style={{ margin: '4px 0 0', fontSize: 10, color: '#53625b', lineHeight: 1.55 }}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="ecg-caution" style={{ marginTop: 18 }}>
              <AlertTriangle size={14} />
              <p>
                <strong>Importante:</strong> algumas respostas desta prova foram conferidas e corrigidas pela lógica clínica/diretrizes da AHA quando a
                marcação original do gabarito estava ambígua pela digitalização — use para fixar conceitos, não como substituto do gabarito oficial do seu curso.
              </p>
            </div>
          </>
        )}

        {tab === 'recursos' && (
          <>
            <div className="resource-grid">
              {externalResources.map((r) => (
                <div className="resource-card" key={r.id}>
                  <div className="resource-card-top">
                    <span className="resource-brand">{r.brand}</span>
                    {r.free && <span className="resource-free-tag">ACESSO LIVRE</span>}
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                  <div className="resource-facts">
                    {r.facts.map((f) => (
                      <span key={f}>
                        <ChevronRight size={10} /> {f}
                      </span>
                    ))}
                  </div>
                  <span className="resource-status">{r.status}</span>
                  <a className="resource-link" href={r.url} target="_blank" rel="noreferrer">
                    Acessar <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
            <div className="resource-note">
              <AlertTriangle size={14} />
              <p>
                Links externos levam a plataformas de terceiros. Custos, disponibilidade e condições de acesso
                são definidos por cada instituição, não por este simulador.
              </p>
            </div>
            <div className="catalog-link-row">
              <span>Quer sugerir um novo recurso para a biblioteca?</span>
              <a href="#">Fale com a equipe <ExternalLink size={11} /></a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
