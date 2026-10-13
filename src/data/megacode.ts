export interface ChecklistGroup {
  id: string
  title: string
  items: string[]
}

export const leaderChecklist: ChecklistGroup = {
  id: 'lider',
  title: 'Líder da equipe (avaliado em todo cenário)',
  items: [
    'Atribui funções aos membros da equipe no início do cenário',
    'Garante RCP de alta qualidade o tempo todo: frequência 100-120/min, profundidade ≥5 cm, fração de compressões >80%, retorno total do tórax, ventilação adequada',
    'Garante que a equipe tenha boa comunicação (nomeação clara, confirmação de volta)',
  ],
}

export const rhythmChecklists: ChecklistGroup[] = [
  {
    id: 'bradicardia',
    title: 'Tratamento de bradicardia',
    items: [
      'Inicia oxigênio (se necessário), aplica o monitor, inicia acesso IV',
      'Aplica os eletrodos do monitor na posição correta',
      'Reconhece a bradicardia sintomática',
      'Administra a dose correta de atropina (1 mg, repetir até 3 mg)',
      'Prepara para tratamento de segunda linha (marcapasso transcutâneo e/ou dopamina/epinefrina)',
    ],
  },
  {
    id: 'fv-tv',
    title: 'Tratamento de FV / TV sem pulso',
    items: [
      'Reconhece o ritmo chocável (FV ou TVSP)',
      'Pede para as pessoas se afastarem antes da análise e do choque',
      'Reinicia a RCP imediatamente após os choques',
      'Maneja apropriadamente a via aérea',
      'Segue ciclos corretos de medicamento → verificação de ritmo/choque → RCP',
      'Administra os fármacos e as doses apropriados (epinefrina, amiodarona/lidocaína)',
    ],
  },
  {
    id: 'aesp-assistolia',
    title: 'Tratamento de AESP / Assistolia',
    items: [
      'Reconhece a AESP ou a assistolia',
      'Verbaliza as possíveis causas reversíveis (5H e 5T)',
      'Administra os fármacos e as doses apropriados (epinefrina)',
      'Reinicia a RCP imediatamente após as verificações de ritmo (sem desfibrilar)',
    ],
  },
  {
    id: 'taquicardia',
    title: 'Tratamento de taquicardia',
    items: [
      'Reconhece uma taquicardia instável e os sintomas devidos a ela',
      'Executa a cardioversão sincronizada imediata (se instável)',
      'Reconhece se o QRS é estreito ou largo (se estável)',
      'Considera manobras vagais e adenosina (QRS estreito regular)',
      'Considera infusão antiarrítmica e consulta a especialista (QRS largo)',
    ],
  },
  {
    id: 'pos-pcr',
    title: 'Cuidados pós-PCR',
    items: [
      'Identifica o retorno de circulação espontânea (RCE)',
      'Garante a medição da PA, ECG de 12 derivações e monitoramento da SpO2',
      'Verbaliza a necessidade de intubação endotraqueal e capnografia com forma de onda',
      'Solicita exames laboratoriais',
      'Considera o controle direcionado de temperatura (32-36°C por 24h)',
    ],
  },
]

export const megacodeScenarios: { id: string; sequence: string }[] = [
  { id: 'cenarios-1-3-8', sequence: 'Bradicardia → TV sem pulso → AESP → Cuidados pós-PCR' },
  { id: 'cenarios-2-5', sequence: 'Bradicardia → FV → Assistolia → Cuidados pós-PCR' },
  { id: 'cenarios-4-7-10', sequence: 'Taquicardia → FV → AESP → Cuidados pós-PCR' },
  { id: 'cenarios-6-11', sequence: 'Bradicardia → FV → AESP → Cuidados pós-PCR' },
  { id: 'cenario-9', sequence: 'Taquicardia → AESP → FV → Cuidados pós-PCR' },
  { id: 'cenario-12', sequence: 'Bradicardia → FV → Assistolia/AESP → Cuidados pós-PCR' },
]

const stageToChecklistId: Record<string, string> = {
  'Bradicardia': 'bradicardia',
  'Taquicardia': 'taquicardia',
  'TV sem pulso': 'fv-tv',
  'FV': 'fv-tv',
  'Assistolia': 'aesp-assistolia',
  'AESP': 'aesp-assistolia',
  'Assistolia/AESP': 'aesp-assistolia',
  'Cuidados pós-PCR': 'pos-pcr',
}

export function resolveScenarioChecklists(sequence: string): ChecklistGroup[] {
  const stageNames = sequence.split('→').map((s) => s.trim())
  const seenIds = new Set<string>()
  const groups: ChecklistGroup[] = []
  for (const stageName of stageNames) {
    const checklistId = stageToChecklistId[stageName]
    if (!checklistId || seenIds.has(checklistId)) continue
    seenIds.add(checklistId)
    const group = rhythmChecklists.find((g) => g.id === checklistId)
    if (group) groups.push(group)
  }
  return groups
}
