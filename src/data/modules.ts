export interface Module {
  id: string
  number: string
  title: string
  summary: string
  pointCount: number
}

export const modules: Module[] = [
  {
    id: 'lideranca-comunicacao',
    number: '01',
    title: 'Liderança e Comunicação',
    summary:
      'Papéis de líder e liderado, comunicação em alça fechada, handoff e brief/debrief de equipe.',
    pointCount: 7,
  },
  {
    id: 'abordagem-paciente-grave',
    number: '02',
    title: 'Abordagem ao Paciente Grave',
    summary: 'Avaliação primária ABCD, reconhecimento precoce e o ciclo DIRECT.',
    pointCount: 5,
  },
  {
    id: 'suporte-basico-vida',
    number: '03',
    title: 'Suporte Básico de Vida',
    summary: 'Cadeia de sobrevivência, compressões de alta qualidade e uso do DEA.',
    pointCount: 8,
  },
  {
    id: 'manejo-vias-aereas',
    number: '04',
    title: 'Manejo das Vias Aéreas',
    summary: 'Sequência rápida de intubação, posicionamento e planos A/B/C/D.',
    pointCount: 6,
  },
  {
    id: 'cuidados-pos-pcr',
    number: '05',
    title: 'Cuidados Pós-PCR',
    summary: 'Algoritmo ABCDE pós-parada, controle de temperatura e metas hemodinâmicas.',
    pointCount: 3,
  },
  {
    id: 'tecnologia-vida',
    number: '06',
    title: 'Tecnologia em Favor da Vida',
    summary: 'IA, wearables e apps no reconhecimento precoce e no treinamento.',
    pointCount: 4,
  },
  {
    id: 'bradiarritmias',
    number: '07',
    title: 'Bradiarritmias',
    summary: 'Causas, leitura de ECG e manejo de atropina, marcapasso e vasoativos.',
    pointCount: 4,
  },
  {
    id: 'taquicardias',
    number: '08',
    title: 'Taquicardias',
    summary: 'Estável vs. instável, cardioversão sincronizada e adenosina.',
    pointCount: 4,
  },
  {
    id: 'sindromes-coronarianas',
    number: '09',
    title: 'Síndromes Coronarianas Agudas',
    summary: 'ECG em 10 minutos, reperfusão e tratamento adjunto.',
    pointCount: 5,
  },
  {
    id: 'avc',
    number: '10',
    title: 'Acidente Vascular Cerebral',
    summary: 'Escalas pré-hospitalares, janela terapêutica, alteplase e trombectomia.',
    pointCount: 6,
  },
]
