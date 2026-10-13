import type { EcgRhythmKey } from '../components/MonitorDisplay'

export interface EcgEntry {
  id: string
  group: string
  title: string
  prompt: string
  source: string
  rhythmKey: EcgRhythmKey
}

export const ecgEntries: EcgEntry[] = [
  {
    id: 'fv',
    group: 'Ritmos Chocáveis',
    title: 'Fibrilação Ventricular',
    prompt: 'Ritmo caótico, sem padrão identificável de onda P, QRS ou onda T. Choque imediato indicado.',
    source: 'Referência: módulo "Síndromes Coronarianas Agudas", RESSUSCI+.',
    rhythmKey: 'vf',
  },
  {
    id: 'bav-total',
    group: 'Bradiarritmias',
    title: 'BAV Total (3º grau)',
    prompt: 'Átrio e ventrículo batem em frequências independentes — dissociação completa entre onda P e QRS.',
    source: 'Referência: módulo "Bradiarritmias", RESSUSCI+.',
    rhythmKey: 'bav-total',
  },
  {
    id: 'mobitz-1',
    group: 'Bradiarritmias',
    title: 'BAV 1º grau Mobitz I (Wenckebach)',
    prompt: 'O intervalo PR se alonga progressivamente até uma onda P não conduzir — depois o ciclo reinicia.',
    source: 'Referência: módulo "Bradiarritmias", RESSUSCI+.',
    rhythmKey: 'bav-mobitz1',
  },
  {
    id: 'mobitz-2',
    group: 'Bradiarritmias',
    title: 'BAV 2º grau Mobitz II',
    prompt: 'Ondas P nem sempre conduzem o QRS, sem o alongamento progressivo visto no Mobitz I.',
    source: 'Referência: módulo "Bradiarritmias", RESSUSCI+.',
    rhythmKey: 'bav-mobitz2',
  },
  {
    id: 'bav-1grau',
    group: 'Bradiarritmias',
    title: 'BAV de 1º grau',
    prompt: 'Intervalo PR constante, porém alargado (> 0,2s). Toda onda P conduz, só que atrasada.',
    source: 'Referência: módulo "Bradiarritmias", RESSUSCI+.',
    rhythmKey: 'bav-1',
  },
  {
    id: 'ritmo-juncional',
    group: 'Bradiarritmias',
    title: 'Ritmo Juncional',
    prompt: 'QRS estreito e regular, sem onda P identificável antes dele — o nó AV assume como marca-passo.',
    source: 'Referência: módulo "Bradiarritmias", RESSUSCI+.',
    rhythmKey: 'junctional',
  },
  {
    id: 'sinus-brady',
    group: 'Bradiarritmias',
    title: 'Bradicardia Sinusal',
    prompt: 'Onda P normal antes de cada QRS, com frequência cardíaca abaixo de 60 (geralmente < 50) bpm.',
    source: 'Referência: módulo "Bradiarritmias", RESSUSCI+.',
    rhythmKey: 'sinus-brady',
  },
  {
    id: 'fa',
    group: 'Taquicardias',
    title: 'Fibrilação Atrial',
    prompt: 'QRS estreito, ausência de ondas P organizadas, intervalos R-R irregulares.',
    source: 'Referência: módulo "Taquicardias", RESSUSCI+.',
    rhythmKey: 'afib',
  },
  {
    id: 'flutter',
    group: 'Taquicardias',
    title: 'Flutter Atrial',
    prompt: 'QRS estreito e regular, ondas F em "dente de serra", frequência atrial próxima de 300 bpm.',
    source: 'Referência: módulo "Taquicardias", RESSUSCI+.',
    rhythmKey: 'flutter',
  },
  {
    id: 'svt',
    group: 'Taquicardias',
    title: 'Taquicardia Supraventricular',
    prompt: 'QRS estreito e regular, frequência muito elevada, onda P geralmente não identificável.',
    source: 'Referência: módulo "Taquicardias", RESSUSCI+.',
    rhythmKey: 'svt',
  },
  {
    id: 'tv-monomorfica',
    group: 'Taquicardias',
    title: 'Taquicardia Ventricular Monomórfica',
    prompt: 'QRS largo e regular, morfologia uniforme entre os batimentos.',
    source: 'Referência: módulo "Taquicardias", RESSUSCI+.',
    rhythmKey: 'vt-mono',
  },
  {
    id: 'torsades',
    group: 'Ritmos Chocáveis',
    title: 'Torsades de Pointes (TV polimórfica)',
    prompt: 'QRS largo com amplitude oscilante, "girando" em torno da linha de base. Tratar como ritmo chocável.',
    source: 'Referência: módulo "Taquicardias", RESSUSCI+.',
    rhythmKey: 'torsades',
  },
  {
    id: 'asystole',
    group: 'Ritmos Não Chocáveis',
    title: 'Assistolia',
    prompt: 'Linha praticamente reta, sem atividade elétrica organizada. Ritmo não chocável — RCP + adrenalina.',
    source: 'Referência: módulo "Suporte Básico de Vida", RESSUSCI+.',
    rhythmKey: 'asystole',
  },
  {
    id: 'aesp',
    group: 'Ritmos Não Chocáveis',
    title: 'AESP (Atividade Elétrica Sem Pulso)',
    prompt: 'Ritmo organizado no monitor (pode parecer normal), porém sem pulso palpável. Ritmo não chocável.',
    source: 'Referência: módulo "Suporte Básico de Vida", RESSUSCI+.',
    rhythmKey: 'pea',
  },
  {
    id: 'sinus-tachy',
    group: 'Referência',
    title: 'Taquicardia Sinusal',
    prompt: 'Onda P normal antes de cada QRS, frequência acima de 100 bpm — geralmente resposta a uma causa (dor, febre, hipovolemia).',
    source: 'Referência: módulo "Taquicardias", RESSUSCI+.',
    rhythmKey: 'sinus-tachy',
  },
  {
    id: 'iam-supra',
    group: 'Síndromes Coronarianas',
    title: 'IAM com Supra de ST (parede inferior)',
    prompt: 'Elevação do ponto J em D2, D3 e aVF, com infradesnivelamento espelhado em V1-V3.',
    source: 'Referência: módulo "Síndromes Coronarianas Agudas", RESSUSCI+.',
    rhythmKey: 'stemi-inferior',
  },
  {
    id: 'normal-sinus',
    group: 'Referência',
    title: 'Ritmo Sinusal Normal',
    prompt: 'Onda P normal antes de cada QRS, frequência entre 60-100 bpm, intervalos regulares — usado como referência de comparação.',
    source: 'Referência: base de todos os módulos, RESSUSCI+.',
    rhythmKey: 'normal-sinus',
  },
]
