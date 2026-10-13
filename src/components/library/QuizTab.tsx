import { CheckCircle2, XCircle } from 'lucide-react'
import { quizEntries } from '../../data/quiz'

interface QuizTabProps {
  revealedQuiz: Set<string>
  toggleQuizReveal: (id: string) => void
}

export default function QuizTab({ revealedQuiz, toggleQuizReveal }: QuizTabProps) {
  return (
    <>
      <div className="atlas-intro">
        <div>
          <span className="section-index">VERDADEIRO OU FALSO</span>
          <h3>Quiz rápido — pegadinhas clássicas de prova</h3>
          <p>Afirmações no estilo de provas teóricas e práticas de ACLS. Clique para revelar a resposta e a explicação.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 9 }}>
        {quizEntries.map((q, idx) => {
          const isOpen = revealedQuiz.has(q.id)
          return (
            <button
              key={q.id}
              onClick={() => toggleQuizReveal(q.id)}
              style={{
                textAlign: 'left',
                padding: '13px 15px',
                border: `1px solid ${isOpen ? (q.answer ? '#4a9b7e' : '#d9b3a8') : 'var(--line)'}`,
                borderRadius: 10,
                background: isOpen ? (q.answer ? '#eef8f3' : '#fff3ec') : '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span
                  style={{
                    flex: 'none',
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: '#edf1ee',
                    color: '#63716b',
                    fontSize: 10.5,
                    fontWeight: 800,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {idx + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.5 }}>{q.statement}</p>
                  {isOpen && (
                    <div style={{ marginTop: 9, display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                      {q.answer ? (
                        <CheckCircle2 size={14} color="#137158" style={{ flex: 'none', marginTop: 1 }} />
                      ) : (
                        <XCircle size={14} color="#aa4e38" style={{ flex: 'none', marginTop: 1 }} />
                      )}
                      <div>
                        <strong style={{ fontSize: 11.5, color: q.answer ? '#137158' : '#aa4e38' }}>
                          {q.answer ? 'VERDADEIRO' : 'FALSO'}
                        </strong>
                        <p style={{ margin: '3px 0 0', fontSize: 11.5, color: '#53625b', lineHeight: 1.55 }}>{q.explanation}</p>
                      </div>
                    </div>
                  )}
                  {!isOpen && <span style={{ fontSize: 9, color: '#8b9690', fontWeight: 700 }}>CLIQUE PARA VER A RESPOSTA</span>}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}
