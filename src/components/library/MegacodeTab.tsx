import { AlertTriangle, CheckCircle2, ChevronRight, Circle } from 'lucide-react'
import { leaderChecklist, rhythmChecklists, megacodeScenarios, resolveScenarioChecklists } from '../../data/megacode'

interface MegacodeTabProps {
  megacodeChecked: Set<string>
  toggleMegacodeItem: (key: string) => void
  activeScenario: string | null
  setActiveScenario: (id: string | null) => void
  setMegacodeChecked: (fn: (prev: Set<string>) => Set<string>) => void
}

export default function MegacodeTab({
  megacodeChecked,
  toggleMegacodeItem,
  activeScenario,
  setActiveScenario,
  setMegacodeChecked,
}: MegacodeTabProps) {
  return (
    <>
      <div className="atlas-intro">
        <div>
          <span className="section-index">COMO A PROVA PRÁTICA É AVALIADA</span>
          <h3>Checklist oficial do Megacode</h3>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Na prova prática (Megacode), um instrutor marca estes critérios enquanto você conduz o caso.
            Não é "acertar o diagnóstico" apenas — é demonstrar cada passo abaixo, em voz alta, na ordem certa.
            Clique nos itens para marcar como feito, igual numa simulação de verdade.
          </p>
        </div>
      </div>

      <div className="resource-card" style={{ marginBottom: 16, background: '#123b34' }}>
        <div className="resource-card-top">
          <span className="resource-brand" style={{ color: '#9bc9b8', fontSize: 11, letterSpacing: '.08em' }}>
            {leaderChecklist.title}
          </span>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {leaderChecklist.items.map((item, idx) => {
            const key = `lider-${idx}`
            const checked = megacodeChecked.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleMegacodeItem(key)}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                {checked ? (
                  <CheckCircle2 size={16} color="#65dbac" style={{ flex: 'none', marginTop: 1 }} />
                ) : (
                  <Circle size={16} color="#6f9385" style={{ flex: 'none', marginTop: 1 }} />
                )}
                <span
                  style={{
                    fontSize: 13,
                    color: checked ? '#9bc9b8' : '#eaf4ef',
                    lineHeight: 1.55,
                    textDecoration: checked ? 'line-through' : 'none',
                  }}
                >
                  {item}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="resource-grid">
        {rhythmChecklists.map((group) => (
          <div className="resource-card" key={group.id}>
            <div className="resource-card-top">
              <span className="resource-brand" style={{ fontSize: 11, letterSpacing: '.08em' }}>{group.title}</span>
            </div>
            <div style={{ display: 'grid', gap: 9, marginTop: 12 }}>
              {group.items.map((item, idx) => {
                const key = `${group.id}-${idx}`
                const checked = megacodeChecked.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleMegacodeItem(key)}
                    style={{
                      display: 'flex',
                      gap: 9,
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 0,
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {checked ? (
                      <CheckCircle2 size={15} color="#126d59" style={{ flex: 'none', marginTop: 1 }} />
                    ) : (
                      <Circle size={15} color="#a6b5ae" style={{ flex: 'none', marginTop: 1 }} />
                    )}
                    <span
                      style={{
                        fontSize: 12.5,
                        color: checked ? '#8b9690' : 'var(--ink)',
                        lineHeight: 1.55,
                        textDecoration: checked ? 'line-through' : 'none',
                      }}
                    >
                      {item}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22 }}>
        <div className="ecg-group" style={{ marginBottom: 8, display: 'block', fontSize: 11 }}>
          Sequências reais cobradas no Megacode
        </div>
        <p style={{ fontSize: 12.5, color: '#5f6e67', margin: '0 0 14px', lineHeight: 1.6 }}>
          A prova prática oficial não testa um ritmo isolado — ela encadeia vários ritmos no mesmo cenário,
          exigindo que você reconheça a transição e troque de conduta sem perder o fio da RCP. Clique numa
          sequência para montar o checklist completo daquele cenário.
        </p>
        <div style={{ display: 'grid', gap: 9 }}>
          {megacodeScenarios.map((s) => {
            const isOpen = activeScenario === s.id
            const scenarioGroups = resolveScenarioChecklists(s.sequence)
            const totalItems =
              leaderChecklist.items.length + scenarioGroups.reduce((sum, g) => sum + g.items.length, 0)
            const checkedCount =
              leaderChecklist.items.filter((_, idx) => megacodeChecked.has(`${s.id}-lider-${idx}`)).length +
              scenarioGroups.reduce(
                (sum, g) =>
                  sum + g.items.filter((_, idx) => megacodeChecked.has(`${s.id}-${g.id}-${idx}`)).length,
                0,
              )
            const allChecked = checkedCount === totalItems

            return (
              <div key={s.id}>
                <button
                  onClick={() => setActiveScenario(isOpen ? null : s.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '12px 15px',
                    borderRadius: 10,
                    border: `1px solid ${isOpen ? 'var(--teal-dark)' : 'var(--line)'}`,
                    background: isOpen ? '#eef5f1' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 650, color: 'var(--ink)' }}>{s.sequence}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                    {checkedCount > 0 && (
                      <span style={{ fontSize: 11, color: allChecked ? '#137158' : '#8b9690', fontWeight: 700 }}>
                        {checkedCount}/{totalItems}
                      </span>
                    )}
                    <ChevronRight
                      size={15}
                      style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }}
                    />
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '14px 16px', border: '1px solid var(--line)', borderTop: 0, borderRadius: '0 0 10px 10px', background: '#fff' }}>
                    <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: '#65756d', letterSpacing: '.08em' }}>
                        LÍDER DA EQUIPE
                      </span>
                      {leaderChecklist.items.map((item, idx) => {
                        const key = `${s.id}-lider-${idx}`
                        const checked = megacodeChecked.has(key)
                        return (
                          <button
                            key={key}
                            onClick={() => toggleMegacodeItem(key)}
                            style={{ display: 'flex', gap: 9, alignItems: 'flex-start', textAlign: 'left', background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
                          >
                            {checked ? (
                              <CheckCircle2 size={15} color="#126d59" style={{ flex: 'none', marginTop: 1 }} />
                            ) : (
                              <Circle size={15} color="#a6b5ae" style={{ flex: 'none', marginTop: 1 }} />
                            )}
                            <span style={{ fontSize: 12.5, color: checked ? '#8b9690' : 'var(--ink)', lineHeight: 1.55, textDecoration: checked ? 'line-through' : 'none' }}>
                              {item}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {scenarioGroups.map((group) => (
                      <div key={group.id} style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#65756d', letterSpacing: '.08em' }}>
                          {group.title.toUpperCase()}
                        </span>
                        {group.items.map((item, idx) => {
                          const key = `${s.id}-${group.id}-${idx}`
                          const checked = megacodeChecked.has(key)
                          return (
                            <button
                              key={key}
                              onClick={() => toggleMegacodeItem(key)}
                              style={{ display: 'flex', gap: 9, alignItems: 'flex-start', textAlign: 'left', background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
                            >
                              {checked ? (
                                <CheckCircle2 size={15} color="#126d59" style={{ flex: 'none', marginTop: 1 }} />
                              ) : (
                                <Circle size={15} color="#a6b5ae" style={{ flex: 'none', marginTop: 1 }} />
                              )}
                              <span style={{ fontSize: 12.5, color: checked ? '#8b9690' : 'var(--ink)', lineHeight: 1.55, textDecoration: checked ? 'line-through' : 'none' }}>
                                {item}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ))}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        paddingTop: 12,
                        borderTop: '1px solid var(--line)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: allChecked ? '#137158' : '#aa4e38',
                        }}
                      >
                        {allChecked ? 'APROVADO' : `${checkedCount}/${totalItems} concluídos`}
                      </span>
                      <button
                        className="secondary-button"
                        style={{ minHeight: 30, padding: '0 12px', fontSize: 11 }}
                        onClick={() => {
                          setMegacodeChecked((prev) => {
                            const next = new Set(prev)
                            for (const k of Array.from(next)) {
                              if (k.startsWith(`${s.id}-`)) next.delete(k)
                            }
                            return next
                          })
                        }}
                      >
                        Reiniciar cenário
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="ecg-caution" style={{ marginTop: 22 }}>
        <AlertTriangle size={14} />
        <p style={{ fontSize: 12 }}>
          <strong>Importante:</strong> este checklist resume o material oficial de apoio ao provedor ACLS (American Heart Association). Ele orienta o que é avaliado na prova prática — não substitui o manual completo nem o instrutor do seu curso.
        </p>
      </div>
    </>
  )
}
