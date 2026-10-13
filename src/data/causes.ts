export interface ReversibleCause {
  id: string
  letter: string
  name: string
  hint: string
}

export const hCauses: ReversibleCause[] = [
  { id: 'hipovolemia', letter: 'H', name: 'Hipovolemia', hint: 'Causa mais comum e mais facilmente reversível de AESP — repor volume.' },
  { id: 'hipoxia', letter: 'H', name: 'Hipóxia', hint: 'Garantir via aérea e oxigenação adequadas.' },
  { id: 'hidrogenio', letter: 'H', name: 'Hidrogênio (acidose)', hint: 'Acidose metabólica grave — considerar bicarbonato só em situações específicas.' },
  { id: 'hipo-hipercalemia', letter: 'H', name: 'Hipo/Hipercalemia', hint: 'Dosar potássio; hipercalemia grave pode alargar o QRS.' },
  { id: 'hipotermia', letter: 'H', name: 'Hipotermia', hint: 'Reaquecer o paciente; pode exigir RCP prolongada.' },
  { id: 'hipoglicemia', letter: 'H', name: 'Hipoglicemia', hint: 'Checar glicemia capilar — pode mimetizar ou agravar a parada.' },
]

export const tCauses: ReversibleCause[] = [
  { id: 'tensao-torax', letter: 'T', name: 'Tensão no tórax (pneumotórax hipertensivo)', hint: 'Descompressão torácica imediata, não espera imagem.' },
  { id: 'tamponamento', letter: 'T', name: 'Tamponamento cardíaco', hint: 'Pericardiocentese guiada pelo quadro clínico.' },
  { id: 'toxinas', letter: 'T', name: 'Toxinas', hint: 'Investigar intoxicação/overdose; considerar antídoto específico.' },
  { id: 'trombose-pulmonar', letter: 'T', name: 'Trombose pulmonar', hint: 'Embolia pulmonar maciça — considerar trombólise em contexto de PCR.' },
  { id: 'trombose-coronaria', letter: 'T', name: 'Trombose coronária', hint: 'Infarto como causa da parada — considerar hemodinâmica pós-RCE.' },
  { id: 'trauma', letter: 'T', name: 'Trauma não reconhecido', hint: 'Reavaliar mecanismo de trauma; pensar em hemorragia oculta.' },
]
