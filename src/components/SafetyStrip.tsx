import { ShieldAlert } from 'lucide-react'

export default function SafetyStrip() {
  return (
    <div className="safety-strip">
      <ShieldAlert size={14} />
      <span>
        <strong>Ambiente de simulação educacional.</strong> Não substitui protocolos institucionais, julgamento
        clínico ou diretrizes oficiais — use apenas para treinamento.
      </span>
    </div>
  )
}
