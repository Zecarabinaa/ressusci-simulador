import { AlertTriangle, ChevronRight, ExternalLink } from 'lucide-react'
import { externalResources } from '../../data/resources'

export default function RecursosTab() {
  return (
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
  )
}
