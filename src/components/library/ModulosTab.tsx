import { BookOpenCheck, ChevronRight, ExternalLink } from 'lucide-react'
import type { Module } from '../../data/modules'

interface ModulosTabProps {
  filteredModules: Module[]
  setQuery: (q: string) => void
}

export default function ModulosTab({ filteredModules, setQuery }: ModulosTabProps) {
  return (
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
  )
}
