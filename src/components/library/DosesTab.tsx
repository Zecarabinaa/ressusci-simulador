import { AlertTriangle } from 'lucide-react'
import { doseEntries } from '../../data/doses'
import { hCauses, tCauses } from '../../data/causes'
import { premonitorySigns, confirmatorySigns } from '../../data/signs'

export default function DosesTab() {
  return (
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
            <p style={{ fontSize: 10.5, color: '#77847e', margin: '6px 0 10px' }}>Podem anteceder a parada — fique atento.</p>
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
            <p style={{ fontSize: 10.5, color: '#77847e', margin: '6px 0 10px' }}>Confirmam a PCR — inicie as compressões imediatamente.</p>
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
                      fontSize: 9,
                      fontWeight: 800,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {c.letter}
                  </span>
                  <div>
                    <strong style={{ fontSize: 11.5, color: 'var(--ink)' }}>{c.name}</strong>
                    <p style={{ margin: '2px 0 0', fontSize: 10.5, color: '#5f6e67', lineHeight: 1.5 }}>{c.hint}</p>
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
                      fontSize: 9,
                      fontWeight: 800,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {c.letter}
                  </span>
                  <div>
                    <strong style={{ fontSize: 11.5, color: 'var(--ink)' }}>{c.name}</strong>
                    <p style={{ margin: '2px 0 0', fontSize: 10.5, color: '#5f6e67', lineHeight: 1.5 }}>{c.hint}</p>
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
                    <td style={{ padding: '8px 10px', fontSize: 12.5, fontWeight: 700, color: 'var(--ink)', width: '34%' }}>{d.drug}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12.5, color: 'var(--teal-dark)', fontWeight: 650 }}>{d.dose}</td>
                    <td style={{ padding: '8px 10px', fontSize: 10.5, color: '#77847e' }}>{d.note ?? ''}</td>
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
  )
}
