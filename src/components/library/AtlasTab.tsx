import { AlertTriangle } from 'lucide-react'
import type { EcgEntry } from '../../data/ecgs'
import { EcgStrip } from '../MonitorDisplay'

interface AtlasTabProps {
  filteredEcgs: EcgEntry[]
  setQuery: (q: string) => void
}

export default function AtlasTab({ filteredEcgs, setQuery }: AtlasTabProps) {
  return (
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
  )
}
