import { AlertTriangle, CheckCircle2, GraduationCap, XCircle } from 'lucide-react'
import { examQuestions } from '../../data/exam'
import { EcgStrip } from '../MonitorDisplay'

interface ProvaTabProps {
  examAnswers: Record<number, string>
  examScoreVisible: boolean
  setExamScoreVisible: (fn: (v: boolean) => boolean) => void
  chooseExamAnswer: (id: number, letter: string) => void
  resetExam: () => void
  examAnsweredCount: number
  examCorrectCount: number
}

export default function ProvaTab({
  examAnswers,
  examScoreVisible,
  setExamScoreVisible,
  chooseExamAnswer,
  resetExam,
  examAnsweredCount,
  examCorrectCount,
}: ProvaTabProps) {
  return (
    <>
      <div className="atlas-intro">
        <div>
          <span className="section-index">SIMULAÇÃO DA PROVA PRÁTICA/TEÓRICA</span>
          <h3>Prova teórica completa — 50 questões</h3>
          <p>
            Questões no estilo da avaliação oficial do provedor ACLS, incluindo os cenários usados na prova
            prática (vinhetas com múltiplas perguntas em sequência) e os traçados de ECG mostrados nelas.
            Responda, veja o feedback na hora e confira sua pontuação final.
          </p>
        </div>
      </div>

      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          marginBottom: 16,
          borderRadius: 10,
          background: '#123b34',
          color: '#fff',
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700 }}>
          {examAnsweredCount}/{examQuestions.length} respondidas
          {examAnsweredCount === examQuestions.length && (
            <span style={{ marginLeft: 10, color: '#9bc9b8' }}>
              Acertos: {examCorrectCount}/{examQuestions.length} ({Math.round((examCorrectCount / examQuestions.length) * 100)}%)
            </span>
          )}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {examAnsweredCount === examQuestions.length && (
            <button
              className="primary-button"
              style={{ minHeight: 30, padding: '0 12px', fontSize: 10, background: '#fff', color: 'var(--teal-dark)' }}
              onClick={() => setExamScoreVisible((v) => !v)}
            >
              {examScoreVisible ? 'Ocultar resumo' : 'Ver resumo'}
            </button>
          )}
          <button
            className="secondary-button"
            style={{ minHeight: 30, padding: '0 12px', fontSize: 10, background: 'transparent', color: '#fff', borderColor: '#2e5a4f' }}
            onClick={resetExam}
          >
            Reiniciar prova
          </button>
        </div>
      </div>

      {examScoreVisible && examAnsweredCount === examQuestions.length && (
        <div className="ecg-caution" style={{ background: '#eef8f3', borderColor: '#4a9b7e', marginBottom: 16 }}>
          <GraduationCap size={14} color="#137158" />
          <p>
            <strong>Resultado final:</strong> você acertou {examCorrectCount} de {examQuestions.length} questões (
            {Math.round((examCorrectCount / examQuestions.length) * 100)}%). Revise abaixo as marcadas em vermelho antes de tentar de novo.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {examQuestions.map((q) => {
          const chosen = examAnswers[q.id]
          const isAnswered = !!chosen
          return (
            <div
              key={q.id}
              style={{
                padding: '15px 16px',
                border: `1px solid ${isAnswered ? (chosen === q.correct ? '#4a9b7e' : '#d9b3a8') : 'var(--line)'}`,
                borderRadius: 11,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--ink)', lineHeight: 1.55, fontWeight: 600 }}>
                  <span style={{ color: 'var(--teal)' }}>{q.id}.</span> {q.statement}
                </p>
              </div>

              {q.rhythmKey && (
                <div style={{ margin: '10px 0' }}>
                  <EcgStrip rhythmKey={q.rhythmKey} />
                </div>
              )}

              <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
                {q.options.map((opt) => {
                  const isChosen = chosen === opt.letter
                  const isCorrectOpt = opt.letter === q.correct
                  let bg = '#fbfcfb'
                  let border = '#e2e8e3'
                  if (isAnswered && isCorrectOpt) {
                    bg = '#eef8f3'
                    border = '#4a9b7e'
                  } else if (isAnswered && isChosen && !isCorrectOpt) {
                    bg = '#fff3ec'
                    border = '#d9b3a8'
                  }
                  return (
                    <button
                      key={opt.letter}
                      onClick={() => chooseExamAnswer(q.id, opt.letter)}
                      disabled={isAnswered}
                      style={{
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                        padding: '9px 11px',
                        borderRadius: 9,
                        border: `1px solid ${border}`,
                        background: bg,
                        cursor: isAnswered ? 'default' : 'pointer',
                      }}
                    >
                      <span
                        style={{
                          flex: 'none',
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          background: isAnswered && isCorrectOpt ? 'var(--teal-dark)' : '#edf1ee',
                          color: isAnswered && isCorrectOpt ? '#fff' : '#63716b',
                          fontSize: 9,
                          fontWeight: 800,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {opt.letter}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--ink)', lineHeight: 1.45 }}>{opt.text}</span>
                      {isAnswered && isCorrectOpt && <CheckCircle2 size={13} color="#137158" style={{ marginLeft: 'auto', flex: 'none' }} />}
                      {isAnswered && isChosen && !isCorrectOpt && <XCircle size={13} color="#aa4e38" style={{ marginLeft: 'auto', flex: 'none' }} />}
                    </button>
                  )
                })}
              </div>

              {isAnswered && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '9px 11px',
                    borderRadius: 8,
                    background: chosen === q.correct ? '#eef8f3' : '#fff3ec',
                  }}
                >
                  <strong style={{ fontSize: 9, color: chosen === q.correct ? '#137158' : '#aa4e38' }}>
                    {chosen === q.correct ? 'CORRETO' : `INCORRETO — a resposta certa é ${q.correct}`}
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: 10, color: '#53625b', lineHeight: 1.55 }}>{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="ecg-caution" style={{ marginTop: 18 }}>
        <AlertTriangle size={14} />
        <p>
          <strong>Importante:</strong> algumas respostas desta prova foram conferidas e corrigidas pela lógica clínica/diretrizes da AHA quando a
          marcação original do gabarito estava ambígua pela digitalização — use para fixar conceitos, não como substituto do gabarito oficial do seu curso.
        </p>
      </div>
    </>
  )
}
