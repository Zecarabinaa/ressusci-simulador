import { HeartPulse } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const navigate = useNavigate()
  return (
    <div className="topbar">
      <button className="brand-button" onClick={() => navigate('/')}>
        <span className="brand-lockup">
          <span className="brand-mark">
            <HeartPulse />
          </span>
          <span className="brand-text">
            <strong>RESSUSCI+</strong>
            <span>SIMULADOR CLÍNICO</span>
          </span>
        </span>
      </button>
      <div className="topbar-right">
        <span className="topbar-dot" />
        <span className="topbar-label">AMBIENTE DE TREINAMENTO</span>
      </div>
    </div>
  )
}
