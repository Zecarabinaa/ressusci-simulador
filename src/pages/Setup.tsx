import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Users, CheckCircle2, AlertTriangle, ArrowRight, EyeOff } from 'lucide-react'
import { getCaseById } from '../data/cases'
import { useSimulation, type Mode } from '../context/SimulationContext'

export default function Setup() {
  const { caseId = '' } = useParams()
  const navigate = useNavigate()
  const clinicalCase = getCaseById(caseId)
  const { mode, setMode, startSession } = useSimulation()

  if (!clinicalCase) {
    return (
      <div className="page-shell narrow-shell">
        <p>Caso não encontrado.</p>
        <button className="secondary-button" onClick={() => navigate('/')}>
          Voltar
        </button>
      </div>
    )
  }

  const handleStart = () => {
    startSession()
    navigate(`/simulacao/${caseId}`)
  }

  return (
    <div className="page-shell narrow-shell">
      <button className="back-link" onClick={() => navigate('/')}>
        <ArrowLeft size={13} /> Voltar à seleção de casos
      </button>

      <div className="setup-header">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          CONFIGURAR SESSÃO
        </div>
        <h1>
          Como você quer <em>treinar</em> este caso?
        </h1>
        <p>
          Caso Clínico #{clinicalCase.caseNumber}
          <span>·</span>
          {clinicalCase.broadCategory}
          <span>·</span>
          {clinicalCase.durationMin} min
        </p>
      </div>

      <div className="session-note" style={{ marginBottom: 14, background: '#edf2ee', borderColor: '#dce5df', color: '#45534c' }}>
        <EyeOff size={14} />
        <p>
          <strong>Diagnóstico oculto:</strong> você só verá a queixa inicial do paciente. A primeira decisão será
          interpretar o monitor (ECG ou imagem) — o nome da patologia só aparece no debrief final.
        </p>
      </div>

      <div className="mode-grid">
        <button
          className={`mode-card${mode === 'solo' ? ' active' : ''}`}
          onClick={() => setMode('solo' as Mode)}
        >
          <div className="mode-icon">
            <User size={18} />
          </div>
          {mode === 'solo' && <span className="mode-tag">SELECIONADO</span>}
          <h3>Modo Solo</h3>
          <p>
            Você conduz o caso inteiro, assumindo tanto decisões clínicas quanto a liderança da equipe simulada.
            Ideal para revisão individual de conteúdo.
          </p>
          <span className="mode-note">Recomendado para estudo rápido entre plantões</span>
        </button>

        <button
          className={`mode-card${mode === 'duo' ? ' active' : ''}`}
          onClick={() => setMode('duo' as Mode)}
        >
          <div className="mode-icon">
            <Users size={18} />
          </div>
          {mode === 'duo' && <span className="mode-tag">SELECIONADO</span>}
          {mode !== 'duo' && <span className="mode-tag neutral-tag">EM DUPLA</span>}
          <h3>Modo Duo</h3>
          <p>
            Pratique com um colega: um assume o papel de líder da equipe e o outro de liderado, reforçando a
            comunicação em alça fechada discutida no módulo de Liderança.
          </p>
          <span className="mode-note">Ideal para treinar comunicação de equipe</span>
        </button>
      </div>

      <div className="session-note">
        <AlertTriangle size={14} />
        <p>
          <strong>Antes de começar:</strong> este é um ambiente simulado para fins educacionais. As decisões aqui
          não têm efeito sobre pacientes reais e as doses/condutas devem ser sempre confirmadas com os protocolos
          vigentes do seu serviço.
        </p>
      </div>

      <div className="setup-start">
        <button className="primary-button" onClick={handleStart}>
          <CheckCircle2 size={14} /> Iniciar simulação <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
