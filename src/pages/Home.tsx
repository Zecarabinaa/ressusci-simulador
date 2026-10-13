import { useNavigate } from 'react-router-dom'
import { Activity, Clock, Users, ArrowRight, ChevronRight, BookOpenCheck, ListChecks, Shuffle, EyeOff, TrendingUp } from 'lucide-react'
import { cases, getRandomCase } from '../data/cases'
import { useSimulation } from '../context/SimulationContext'
import { getOverallStats } from '../lib/progress'

export default function Home() {
  const navigate = useNavigate()
  const { setCaseId } = useSimulation()
  const stats = getOverallStats()

  const goToCase = (id: string) => {
    setCaseId(id)
    navigate(`/setup/${id}`)
  }

  const goRandom = () => {
    const c = getRandomCase()
    goToCase(c.id)
  }

  return (
    <div className="page-shell">
      <section className="hero-row">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            TREINAMENTO EM REANIMAÇÃO CARDIOPULMONAR
          </div>
          <h1>
            Pratique decisões clínicas <em>sob pressão</em>, sem saber o diagnóstico de antemão.
          </h1>
          <p>
            Simulador de casos clínicos baseado no curso RESSUSCI+ e nas diretrizes da American Heart
            Association. O diagnóstico só é revelado no debrief final — exatamente como numa prova prática ou
            num plantão real.
          </p>
          <div className="hero-meta">
            <span>
              <Clock size={14} /> 8–12 min por caso
            </span>
            <span className="meta-separator" />
            <span>
              <Users size={14} /> Modo solo ou duo
            </span>
            <span className="meta-separator" />
            <span>
              <Activity size={14} /> {cases.length} casos disponíveis
            </span>
            {stats.totalSessions > 0 && (
              <>
                <span className="meta-separator" />
                <span>
                  <TrendingUp size={14} /> {stats.totalSessions} sessões suas · média {stats.avgScore}/100
                </span>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-label">
            <span className="pulse-dot" />
            MONITOR EM TEMPO REAL
          </div>
          <div className="wave-wrap">
            <svg viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 50 L60 50 L75 20 L90 80 L105 50 L160 50 L175 30 L190 70 L205 50 L260 50 L275 15 L290 85 L305 50 L400 50"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="hero-visual-bottom">
            <span>FC 78 BPM</span>
            <span>SPO2 97%</span>
            <span>RITMO SINUSAL</span>
          </div>
        </div>
      </section>

      <section className="cases-section">
        <div className="selected-summary" style={{ background: '#123b34', marginBottom: 24 }}>
          <div>
            <span className="summary-label" style={{ color: '#9bc9b8' }}>
              MODO EXAME · DIAGNÓSTICO OCULTO
            </span>
            <strong style={{ color: '#fff' }}>Sortear um caso clínico aleatório</strong>
            <p style={{ color: '#c2d6ce' }}>
              Você recebe apenas a queixa inicial do paciente. O nome da patologia só aparece no debrief,
              depois de você conduzir todas as decisões.
            </p>
          </div>
          <button className="primary-button" onClick={goRandom} style={{ background: '#fff', color: 'var(--teal-dark)', borderColor: '#fff' }}>
            <Shuffle size={14} /> Sortear caso <ArrowRight size={14} />
          </button>
        </div>

        <div className="section-heading">
          <div>
            <div className="section-index">OU ESCOLHA PELA DIFICULDADE</div>
            <h2>Casos disponíveis</h2>
          </div>
          <div className="case-count">{cases.length} CASOS · DIAGNÓSTICO OCULTO</div>
        </div>

        <div className="case-grid">
          {cases.map((c) => (
            <button key={c.id} className="case-card" onClick={() => goToCase(c.id)}>
              <div className="case-card-top">
                <span className="case-icon">
                  <EyeOff size={16} />
                </span>
                <span className="case-difficulty">{c.difficulty}</span>
              </div>
              <span className="case-category">{c.broadCategory}</span>
              <h3>Caso Clínico #{c.caseNumber}</h3>
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
      </section>

      <section className="how-row">
        <div className="how-intro">
          <div className="section-index">COMO FUNCIONA</div>
          <h2>Do sinal clínico ao debrief com diagnóstico</h2>
          <p>
            Cada sessão segue o mesmo fluxo de uma prova prática: você identifica o ritmo/achado, decide a
            conduta e só descobre o nome da patologia no final.
          </p>
        </div>
        <div className="how-steps">
          <div className="how-step">
            <span>01</span>
            <div>
              <strong>Receba a queixa, sem diagnóstico</strong>
              <p>Apenas idade, sexo e sintoma principal — como na triagem real.</p>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="how-step">
            <span>02</span>
            <div>
              <strong>Interprete o monitor (ECG/TC)</strong>
              <p>Primeira decisão: identificar o achado a partir da imagem, com alternativas de prova.</p>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="how-step">
            <span>03</span>
            <div>
              <strong>Conduza pelo algoritmo da AHA</strong>
              <p>Um painel lateral mostra em qual fase do algoritmo você está a cada decisão.</p>
            </div>
            <ChevronRight size={14} />
          </div>
          <div className="how-step">
            <span>04</span>
            <div>
              <strong>Descubra o diagnóstico no debrief</strong>
              <p>Pontuação, linha do tempo das decisões e o nome real da patologia conduzida.</p>
            </div>
            <ChevronRight size={14} />
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 48 }}>
        <div className="section-heading">
          <div>
            <div className="section-index">PARA ESTUDAR MAIS</div>
            <h2>Biblioteca de apoio</h2>
          </div>
        </div>
        <div className="selected-summary" style={{ background: '#fff', border: '1px solid var(--line)' }}>
          <div>
            <span className="summary-label">MÓDULOS, ATLAS DE ECG E RECURSOS</span>
            <strong>Biblioteca RESSUSCI+</strong>
            <p>
              Aqui os diagnósticos ficam visíveis — é o espaço de revisão teórica, diferente da simulação às
              cegas.
            </p>
          </div>
          <button className="secondary-button" onClick={() => navigate('/biblioteca')}>
            <BookOpenCheck size={14} /> Abrir biblioteca
          </button>
        </div>
      </section>

      <div className="references-footer">
        <div className="references-title">
          <ListChecks size={12} /> REFERÊNCIAS
        </div>
        <p>
          Conteúdo baseado nas diretrizes da American Heart Association e no curso RESSUSCI+ (iMed Group).
          Este simulador é uma ferramenta de apoio ao estudo e não substitui protocolos institucionais.
        </p>
      </div>
    </div>
  )
}
