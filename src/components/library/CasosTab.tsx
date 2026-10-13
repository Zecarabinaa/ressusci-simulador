import { ChevronRight, Clock } from 'lucide-react'
import type { ClinicalCase } from '../../data/cases'
import CaseIcon from '../CaseIcon'

interface CasosTabProps {
  categories: string[]
  categoryFilter: string | null
  setCategoryFilter: (cat: string | null) => void
  filteredCases: ClinicalCase[]
  setQuery: (q: string) => void
  goToCase: (id: string) => void
}

export default function CasosTab({
  categories,
  categoryFilter,
  setCategoryFilter,
  filteredCases,
  setQuery,
  goToCase,
}: CasosTabProps) {
  return (
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
  )
}
