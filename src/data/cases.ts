import type { EcgRhythmKey } from '../components/MonitorDisplay'

export type Quality = 'strong' | 'partial' | 'review'
export type StepKind = 'identify' | 'decision'
export type MonitorType = 'ecg' | 'ct' | 'none'

export interface Choice {
  id: string
  label: string
  quality: Quality
  feedback: string
  nextStateLabel?: string
  nextStateText?: string
}

export interface Monitor {
  type: MonitorType
  rhythmKey?: EcgRhythmKey
  ctFinding?: string
}

export interface Step {
  id: string
  kind: StepKind
  patientKicker: string
  patientType: string
  vignette: string
  vitals: string[]
  monitor: Monitor
  question: string
  choices: Choice[]
}

export interface ClinicalCase {
  id: string
  caseNumber: number
  category: string
  broadCategory: string
  difficulty: 'Básico' | 'Intermediário' | 'Avançado'
  title: string
  chiefComplaint: string
  durationMin: number
  icon: 'heart' | 'activity' | 'zap' | 'brain' | 'wind' | 'users' | 'cpu'
  algorithmPhases: string[]
  steps: Step[]
}

export const cases: ClinicalCase[] = [
  {
    id: 'bradicardia-sintomatica',
    caseNumber: 1,
    category: 'Bradiarritmias',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Intermediário',
    title: 'Bradicardia Sintomática',
    chiefComplaint: 'Homem, 68 anos, confusão mental e mal-estar súbito.',
    durationMin: 10,
    icon: 'heart',
    algorithmPhases: ['Identificar ritmo', 'Avaliação ABCDE', '1ª linha: atropina', '2ª linha: marcapasso/vasoativo'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Leito 3',
        patientType: 'Paciente monitorizado',
        vignette:
          'Homem, 68 anos, encaminhado por mal-estar e confusão mental iniciados há 1 hora. Ao exame, está sonolento, pele fria e pálida. O monitor exibe o traçado abaixo.',
        vitals: ['FC 38 bpm', 'PA 82/50 mmHg', 'SpO2 91%', 'FR 14 irpm', 'Glicemia 98 mg/dL', 'Glasgow 14'],
        monitor: { type: 'ecg', rhythmKey: 'sinus-brady' },
        question: 'Com base no traçado do monitor, qual é a interpretação correta do ritmo?',
        choices: [
          {
            id: 'a',
            label: 'Bradicardia sinusal: onda P normal antes de cada QRS, com frequência baixa',
            quality: 'strong',
            feedback:
              'Correto. O traçado mostra onda P presente e constante antes de cada complexo QRS, com frequência abaixo de 50 bpm — bradicardia sinusal.',
          },
          {
            id: 'b',
            label: 'Ritmo juncional: ausência de onda P, com QRS estreito e regular',
            quality: 'partial',
            feedback:
              'Parcialmente correto no raciocínio (ambos cursam com frequência baixa), mas neste traçado a onda P está presente e precede cada QRS, o que descarta ritmo juncional.',
          },
          {
            id: 'c',
            label: 'Bloqueio atrioventricular total: dissociação completa entre onda P e QRS',
            quality: 'review',
            feedback:
              'Incorreto. No BAV total, átrio e ventrículo batem em frequências independentes. Aqui cada onda P está relacionada a um QRS, sem dissociação.',
          },
          {
            id: 'd',
            label: 'Bloqueio de ramo esquerdo com frequência cardíaca normal',
            quality: 'review',
            feedback:
              'Incorreto. Bloqueio de ramo altera a morfologia do QRS (alargado), mas o achado central deste traçado é a frequência baixa com onda P preservada — isso é bradicardia, não um distúrbio de condução intraventricular.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Leito 3',
        patientType: 'Paciente monitorizado',
        vignette:
          'Confirmada a bradicardia sinusal. O paciente mantém confusão mental, hipotensão e pele fria — sinais de baixo débito.',
        vitals: ['FC 38 bpm', 'PA 82/50 mmHg', 'SpO2 91%', 'FR 14 irpm', 'Enchimento capilar > 3s'],
        monitor: { type: 'ecg', rhythmKey: 'sinus-brady' },
        question: 'Qual é a sua primeira conduta diante deste paciente instável?',
        choices: [
          {
            id: 'a',
            label: 'Monitorizar, obter acesso venoso, oferecer O2 se necessário e confirmar com ECG de 12 derivações',
            quality: 'strong',
            feedback:
              'Correto. Antes de qualquer droga, o algoritmo pede monitorização completa, acesso venoso e ECG de 12 derivações para confirmar o ritmo e investigar a causa.',
            nextStateLabel: 'Avaliação inicial feita',
            nextStateText:
              'Paciente monitorizado, acesso obtido. ECG confirma bradicardia sinusal. Sinais de baixo débito persistem.',
          },
          {
            id: 'b',
            label: 'Administrar atropina 1 mg em bolus imediatamente, sem aguardar o restante da avaliação',
            quality: 'partial',
            feedback:
              'A atropina é apropriada para este paciente instável, mas pular a monitorização e o acesso venoso adequado compromete a segurança da conduta — isso deve ocorrer em paralelo, não substituindo a avaliação inicial.',
            nextStateLabel: 'Conduta parcialmente correta',
            nextStateText: 'Atropina administrada sem acesso confirmado. A equipe perde tempo organizando o restante do atendimento.',
          },
          {
            id: 'c',
            label: 'Solicitar apenas exames laboratoriais (TSH, eletrólitos) antes de qualquer intervenção',
            quality: 'review',
            feedback:
              'Incorreto como primeira conduta. Investigar causas (hipotireoidismo, distúrbio eletrolítico) é importante, mas não deve atrasar a estabilização de um paciente já sintomático e instável.',
            nextStateLabel: 'Atraso na estabilização',
            nextStateText: 'O paciente permanece instável enquanto se aguardam resultados laboratoriais.',
          },
          {
            id: 'd',
            label: 'Aguardar e reavaliar em 15 minutos, já que a saturação está acima de 90%',
            quality: 'review',
            feedback:
              'Incorreto. O paciente já apresenta sinais de baixo débito (confusão, hipotensão, má perfusão periférica) — isso caracteriza instabilidade e exige conduta imediata, independente da saturação.',
            nextStateLabel: 'Atraso na conduta',
            nextStateText: 'O paciente piora a confusão mental enquanto a equipe aguarda.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Leito 3',
        patientType: 'Paciente monitorizado · instável',
        vignette:
          'Com via e monitorização garantidas, o paciente mantém sinais de baixo débito. Um novo ECG mostra progressão do distúrbio de condução.',
        vitals: ['FC 36 bpm', 'PA 80/48 mmHg', 'SpO2 93% em O2', 'Glasgow 13'],
        monitor: { type: 'ecg', rhythmKey: 'bav-mobitz2' },
        question: 'O ECG evolui para um bloqueio atrioventricular de 2º grau. Qual a conduta de primeira linha?',
        choices: [
          {
            id: 'a',
            label: 'Atropina 1 mg IV em bolus, podendo repetir até a dose máxima de 3 mg',
            quality: 'strong',
            feedback:
              'Correto. Atropina é a primeira linha para bradicardia sintomática, independente da origem (nó sinusal ou AV), na dose de 1 mg em bolus, repetível até 3 mg.',
            nextStateLabel: 'Resposta parcial',
            nextStateText: 'FC sobe para 50 bpm, mas o paciente ainda está hipotenso e confuso.',
          },
          {
            id: 'b',
            label: 'Atropina 0,5 mg diluída, em infusão lenta ao longo de 10 minutos',
            quality: 'review',
            feedback:
              'Incorreto. A atropina para bradicardia instável é administrada em bolus rápido (1 mg), não diluída em infusão lenta — essa forma de administração reduz sua eficácia no contexto de emergência.',
            nextStateLabel: 'Resposta inadequada',
            nextStateText: 'A frequência cardíaca não se altera de forma significativa.',
          },
          {
            id: 'c',
            label: 'Iniciar marcapasso transcutâneo sem tentar atropina antes',
            quality: 'partial',
            feedback:
              'Aceitável em bloqueios de alto grau quando a atropina não está prontamente disponível, mas a diretriz recomenda tentar atropina primeiro quando possível, reservando o marcapasso para falha de resposta.',
            nextStateLabel: 'Conduta antecipada',
            nextStateText: 'Marcapasso instalado; paciente desconfortável pela ausência de sedação.',
          },
          {
            id: 'd',
            label: 'Infundir noradrenalina em dose baixa, titulando lentamente como em um choque séptico',
            quality: 'review',
            feedback:
              'Incorreto para este cenário. Na bradicardia instável, as drogas de suporte (dopamina ou adrenalina) seguem atropina/marcapasso e já se inicia em dose mais alta — não se titula lentamente como em outras causas de hipotensão.',
            nextStateLabel: 'Conduta inadequada',
            nextStateText: 'A frequência cardíaca permanece baixa e o paciente continua instável.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Leito 3',
        patientType: 'Paciente monitorizado · instável',
        vignette:
          'Após atropina, o paciente mantém sinais de baixo débito e a frequência cardíaca não normaliza adequadamente.',
        vitals: ['FC 48 bpm', 'PA 84/50 mmHg', 'SpO2 94% em O2'],
        monitor: { type: 'ecg', rhythmKey: 'bav-mobitz2' },
        question: 'A atropina não resolveu adequadamente o quadro. Qual o próximo passo?',
        choices: [
          {
            id: 'a',
            label: 'Marcapasso transcutâneo e/ou dopamina/adrenalina em infusão, chamando um especialista',
            quality: 'strong',
            feedback:
              'Correto. Com falha da atropina, o algoritmo recomenda marcapasso transcutâneo e/ou infusão de dopamina ou adrenalina, além de acionar um especialista para avaliar marcapasso transvenoso.',
            nextStateLabel: 'Caso estabilizado',
            nextStateText: 'FC sobe para 70 bpm com marcapasso, paciente mais alerta. Especialista a caminho para avaliar marcapasso transvenoso.',
          },
          {
            id: 'b',
            label: 'Repetir atropina até a dose máxima de 3 mg e aguardar sem outras medidas',
            quality: 'partial',
            feedback:
              'Repetir é permitido até 3 mg, mas diante de resposta insuficiente o algoritmo já recomenda avançar para marcapasso/vasoativos em paralelo, não apenas repetir e esperar.',
            nextStateLabel: 'Resposta tardia',
            nextStateText: 'O paciente demora mais para estabilizar.',
          },
          {
            id: 'c',
            label: 'Cardioversão elétrica sincronizada imediata',
            quality: 'review',
            feedback:
              'Incorreto. Cardioversão é tratamento para taquiarritmias, não para bradicardia — aplicá-la aqui não trata a causa e pode ser perigosa.',
            nextStateLabel: 'Conduta equivocada',
            nextStateText: 'Essa conduta não melhora a frequência cardíaca do paciente.',
          },
          {
            id: 'd',
            label: 'Dar alta com orientação de retorno caso o quadro piore',
            quality: 'review',
            feedback:
              'Incorreto e perigoso. Paciente instável com bloqueio AV de 2º grau não pode receber alta — precisa de estabilização e avaliação especializada.',
            nextStateLabel: 'Conduta grave',
            nextStateText: 'Essa conduta coloca a vida do paciente em risco.',
          },
        ],
      },
    ],
  },
  {
    id: 'fv-pos-choque',
    caseNumber: 2,
    category: 'Parada Cardiorrespiratória',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Avançado',
    title: 'Fibrilação Ventricular',
    chiefComplaint: 'Mulher, 54 anos, encontrada em colapso, sem pulso.',
    durationMin: 12,
    icon: 'zap',
    algorithmPhases: ['Identificar ritmo', 'Desfibrilação', 'RCP + adrenalina', 'Cuidados pós-PCR'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Pós-SAMU',
        patientType: 'Parada cardiorrespiratória',
        vignette:
          'Mulher, 54 anos, diabética, trazida pelo SAMU em PCR. Compressões iniciadas pelo marido antes da chegada da equipe. O monitor exibe o traçado abaixo.',
        vitals: ['Compressões em andamento', 'Sem pulso palpável', 'Via aérea com máscara laríngea'],
        monitor: { type: 'ecg', rhythmKey: 'vf' },
        question: 'Com base no traçado, qual é a leitura correta do ritmo?',
        choices: [
          {
            id: 'a',
            label: 'Fibrilação ventricular: atividade elétrica caótica, sem complexos organizados',
            quality: 'strong',
            feedback:
              'Correto. O traçado é completamente desorganizado, sem onda P, QRS ou T identificáveis — fibrilação ventricular, ritmo chocável.',
          },
          {
            id: 'b',
            label: 'Taquicardia ventricular polimórfica (Torsades de Pointes)',
            quality: 'partial',
            feedback:
              'Ambos são ritmos chocáveis e a conduta imediata (desfibrilação) é semelhante, mas na Torsades há uma oscilação de amplitude mais organizada em "fuso", diferente do caos completo deste traçado.',
          },
          {
            id: 'c',
            label: 'Assistolia: linha reta sem atividade elétrica',
            quality: 'review',
            feedback:
              'Incorreto e perigoso confundir os dois. Assistolia é uma linha praticamente plana (ritmo não chocável) — este traçado tem atividade elétrica abundante e caótica, exigindo desfibrilação imediata, ao contrário da assistolia.',
          },
          {
            id: 'd',
            label: 'Artefato de movimento por compressões, sem significado de ritmo',
            quality: 'review',
            feedback:
              'Incorreto. Embora compressões possam gerar artefato, esse traçado deve ser tratado como fibrilação ventricular real até prova em contrário — assumir "artefato" sem pausar para verificar é um erro grave e pode atrasar a desfibrilação.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-SAMU',
        patientType: 'Parada cardiorrespiratória',
        vignette: 'Confirmada a fibrilação ventricular no monitor.',
        vitals: ['Compressões em andamento', 'Sem pulso palpável', 'Via aérea com máscara laríngea'],
        monitor: { type: 'ecg', rhythmKey: 'vf' },
        question: 'Qual a conduta imediata diante da FV confirmada?',
        choices: [
          {
            id: 'a',
            label: 'Desfibrilação imediata com 200 J, mantendo compressões até a carga estar pronta',
            quality: 'strong',
            feedback:
              'Correto. FV é um ritmo chocável — a prioridade é desfibrilar o quanto antes, mantendo as compressões torácicas até o aparelho estar carregado, interrompendo só para o choque.',
            nextStateLabel: 'Choque aplicado',
            nextStateText: 'Choque de 200 J aplicado. RCP retomada imediatamente por 2 minutos.',
          },
          {
            id: 'b',
            label: 'Administrar adrenalina 1 mg IV antes de desfibrilar',
            quality: 'partial',
            feedback:
              'A adrenalina faz parte do algoritmo de ritmos chocáveis, mas entra após o primeiro ou segundo choque — nunca antes da primeira desfibrilação disponível.',
            nextStateLabel: 'Conduta fora de ordem',
            nextStateText: 'Tempo perdido antes do primeiro choque.',
          },
          {
            id: 'c',
            label: 'Continuar apenas compressões e reavaliar ritmo em 2 minutos',
            quality: 'review',
            feedback:
              'Incorreto. Diante de um ritmo chocável já identificado, a desfibrilação deve ocorrer imediatamente, não esperar o próximo ciclo de 2 minutos.',
            nextStateLabel: 'Conduta inadequada',
            nextStateText: 'O ritmo chocável permanece sem tratamento por tempo desnecessário.',
          },
          {
            id: 'd',
            label: 'Realizar cardioversão sincronizada com 100 J',
            quality: 'review',
            feedback:
              'Incorreto. Em ritmos sem pulso como a FV, o choque deve ser assíncrono (desfibrilação), não sincronizado — a sincronização pode até impedir a liberação do choque, pois o aparelho não encontra um QRS organizado para sincronizar.',
            nextStateLabel: 'Choque não liberado',
            nextStateText: 'O desfibrilador não dispara por falta de complexo QRS para sincronizar, atrasando o tratamento.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-choque',
        patientType: 'Parada cardiorrespiratória',
        vignette: 'Após o primeiro choque e 2 minutos de RCP, o monitor ainda mostra fibrilação ventricular.',
        vitals: ['FV persistente', 'Via aérea com máscara laríngea', 'Acesso venoso obtido'],
        monitor: { type: 'ecg', rhythmKey: 'vf' },
        question: 'FV persiste após o primeiro choque. Qual a conduta?',
        choices: [
          {
            id: 'a',
            label: 'Novo choque de 200 J e, em seguida, adrenalina 1 mg IV',
            quality: 'strong',
            feedback:
              'Correto. Em ritmo chocável persistente, aplica-se novo choque e inicia-se a adrenalina 1 mg IV, repetida a cada 3-5 minutos ao longo da reanimação.',
            nextStateLabel: 'Retorno de circulação',
            nextStateText: 'Após 3 ciclos, há retorno de circulação espontânea: FC 90 bpm, PA 81x38 mmHg.',
          },
          {
            id: 'b',
            label: 'Trocar para amiodarona 300 mg IV antes de qualquer novo choque',
            quality: 'partial',
            feedback:
              'A amiodarona entra no algoritmo de FV refratária (geralmente após o 3º choque sem resposta), mas não substitui a sequência de choque imediato já indicada neste momento.',
            nextStateLabel: 'Sequência alterada',
            nextStateText: 'Equipe atrasa o próximo choque organizando a medicação antiarrítmica.',
          },
          {
            id: 'c',
            label: 'Administrar bicarbonato de sódio empiricamente para "estabilizar" o ritmo',
            quality: 'review',
            feedback:
              'Incorreto. Bicarbonato não é indicado rotineiramente em FV — é reservado para situações específicas (hipercalemia, acidose metabólica grave preexistente, intoxicação por tricíclicos), não para "estabilizar" o ritmo chocável.',
            nextStateLabel: 'Conduta sem indicação',
            nextStateText: 'O tempo é usado numa medida sem respaldo para este cenário.',
          },
          {
            id: 'd',
            label: 'Suspender a reanimação por falta de resposta ao primeiro choque',
            quality: 'review',
            feedback:
              'Incorreto e precoce. Um único choque sem resposta não indica falha de reanimação — o protocolo prevê múltiplos ciclos antes de considerar essa decisão.',
            nextStateLabel: 'Decisão prematura',
            nextStateText: 'Essa conduta seria eticamente inadequada neste estágio do atendimento.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-RCE',
        patientType: 'Retorno de circulação espontânea',
        vignette: 'A paciente recupera pulso: FC 90 bpm, PA 81x38 mmHg, saturando 93%.',
        vitals: ['FC 90 bpm', 'PA 81/38 mmHg', 'SpO2 93%', 'CO2 expirado 41 mmHg', 'Glasgow 8 ao retorno'],
        monitor: { type: 'ecg', rhythmKey: 'stemi-inferior' },
        question: 'Com retorno de circulação, o novo ECG mostra o traçado acima. Qual a prioridade imediata?',
        choices: [
          {
            id: 'a',
            label: 'Reconhecer o supra de ST, garantir via aérea definitiva e suporte hemodinâmico, acionando a hemodinâmica',
            quality: 'strong',
            feedback:
              'Correto. O ECG pós-RCE mostra supra de ST — isso aponta a provável causa da parada (infarto) e exige acionamento da hemodinâmica, junto ao ABCDE pós-PCR (via aérea definitiva, suporte de PA).',
            nextStateLabel: 'Caso estabilizado',
            nextStateText: 'Equipe aciona hemodinâmica para angioplastia primária; paciente mantido com suporte hemodinâmico.',
          },
          {
            id: 'b',
            label: 'Transferir para UTI sem repetir ECG nem investigar a causa da parada',
            quality: 'partial',
            feedback:
              'A transferência para um leito de cuidados intensivos é necessária, mas não deve pular a investigação da causa já disponível no ECG — isso atrasa um tratamento time-sensitivo (reperfusão).',
            nextStateLabel: 'Investigação incompleta',
            nextStateText: 'A causa do evento (infarto) só é tratada horas depois.',
          },
          {
            id: 'c',
            label: 'Aguardar estabilização espontânea da pressão arterial sem intervenção',
            quality: 'review',
            feedback:
              'Incorreto. A paciente está hipotensa (PA 81x38) — isso exige intervenção ativa (volume e/ou vasoativo), não apenas observação.',
            nextStateLabel: 'Risco de nova parada',
            nextStateText: 'A hipotensão não tratada pode levar a uma nova deterioração.',
          },
          {
            id: 'd',
            label: 'Iniciar hipotermia terapêutica profunda (< 30°C) imediatamente, antes de qualquer outra medida',
            quality: 'review',
            feedback:
              'Incorreto. O controle direcionado de temperatura pós-PCR usa alvo de 32-36°C, nunca abaixo disso, e só depois de estabilizar via aérea, ventilação e hemodinâmica — não é a prioridade imediata.',
            nextStateLabel: 'Prioridade invertida',
            nextStateText: 'A equipe perde tempo com uma medida fora de prioridade e de alvo incorreto.',
          },
        ],
      },
    ],
  },
  {
    id: 'sca-supra-st',
    caseNumber: 3,
    category: 'Síndromes Coronarianas Agudas',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Intermediário',
    title: 'Infarto com Supra de ST',
    chiefComplaint: 'Homem, 58 anos, dor torácica típica há 40 minutos.',
    durationMin: 10,
    icon: 'activity',
    algorithmPhases: ['Leitura do ECG', 'Até 10 minutos', 'Reperfusão', 'Tratamento adjunto'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Dor Torácica',
        patientType: 'Triagem prioritária',
        vignette:
          'Homem, 58 anos, dor torácica em aperto, irradiando para o braço esquerdo, sudorese e náusea, iniciada há 40 minutos, sem melhora com repouso. ECG obtido em até 10 minutos, traçado abaixo.',
        vitals: ['FC 92 bpm', 'PA 142/88 mmHg', 'SpO2 96%', 'Dor 8/10', 'Glasgow 15', 'Temperatura 36,4°C'],
        monitor: { type: 'ecg', rhythmKey: 'stemi-inferior' },
        question: 'Qual a interpretação correta deste ECG?',
        choices: [
          {
            id: 'a',
            label: 'Supradesnivelamento de ST em derivações inferiores (D2, D3, aVF), sugestivo de IAM',
            quality: 'strong',
            feedback:
              'Correto. O traçado mostra elevação do ponto J com supra de ST — achado compatível com infarto agudo do miocárdio com supra de ST (IAMCST) de parede inferior.',
          },
          {
            id: 'b',
            label: 'Pericardite aguda, com supradesnivelamento difuso e côncavo de ST',
            quality: 'partial',
            feedback:
              'É um diagnóstico diferencial relevante de supra de ST, mas a pericardite tipicamente mostra elevação difusa (não localizada) e côncava, sem imagem em espelho — o quadro clínico típico de IAM e a localização aqui favorecem infarto.',
          },
          {
            id: 'c',
            label: 'Repolarização precoce, variante normal do ECG',
            quality: 'review',
            feedback:
              'Incorreto. Repolarização precoce é um achado benigno, geralmente em pacientes jovens assintomáticos — não se aplica a um paciente de 58 anos com dor torácica típica e supra de ST.',
          },
          {
            id: 'd',
            label: 'Infradesnivelamento de ST anterior por isquemia subendocárdica',
            quality: 'review',
            feedback:
              'Incorreto. O traçado mostra elevação (supra), não depressão (infra), e a localização descrita é inferior, não anterior.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Dor Torácica',
        patientType: 'Triagem prioritária',
        vignette: 'ECG com supra de ST confirmado logo na chegada do paciente.',
        vitals: ['FC 92 bpm', 'PA 142/88 mmHg', 'SpO2 96%', 'Dor 8/10'],
        monitor: { type: 'ecg', rhythmKey: 'stemi-inferior' },
        question: 'Qual deveria ter sido a conduta na chegada deste paciente, antes mesmo do ECG?',
        choices: [
          {
            id: 'a',
            label: 'Monitorização imediata e realização do ECG de 12 derivações em até 10 minutos da chegada',
            quality: 'strong',
            feedback:
              'Correto. A meta do protocolo de dor torácica é realizar e avaliar o ECG em até 10 minutos da chegada — essa etapa não depende de avaliação médica prévia.',
            nextStateLabel: 'ECG obtido a tempo',
            nextStateText: 'ECG realizado dentro da meta de 10 minutos, permitindo decisão rápida de reperfusão.',
          },
          {
            id: 'b',
            label: 'Aguardar troponina de alta sensibilidade antes do ECG, por ser mais sensível',
            quality: 'review',
            feedback:
              'Incorreto. O ECG tem prioridade absoluta e deve ser feito em até 10 minutos — os exames laboratoriais são complementares e não devem atrasar essa etapa, mesmo sendo sensíveis.',
            nextStateLabel: 'Atraso diagnóstico',
            nextStateText: 'Minutos preciosos são perdidos enquanto se aguarda o laboratório.',
          },
          {
            id: 'c',
            label: 'Classificar como crise de ansiedade e reavaliar em 1 hora',
            quality: 'review',
            feedback:
              'Incorreto e arriscado. Dor torácica típica com irradiação e sudorese exige avaliação de síndrome coronariana aguda, não ser descartada como quadro ansioso sem ECG.',
            nextStateLabel: 'Conduta perigosa',
            nextStateText: 'O diagnóstico de infarto é retardado significativamente.',
          },
          {
            id: 'd',
            label: 'Aguardar a avaliação médica completa (anamnese e exame físico) antes do ECG',
            quality: 'review',
            feedback:
              'Incorreto. Estudos mostram que o ECG pode e deve ser obtido antes mesmo da avaliação médica completa — equipe de triagem treinada pode identificar o sintoma suspeito e providenciar o ECG, reduzindo o tempo porta-ECG.',
            nextStateLabel: 'Atraso evitável',
            nextStateText: 'O ECG só é feito após a consulta médica completa, ultrapassando a meta de 10 minutos.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Dor Torácica',
        patientType: 'IAM com supra de ST confirmado',
        vignette: 'O paciente está hemodinamicamente estável, sem contraindicações aparentes a trombolítico.',
        vitals: ['FC 90 bpm', 'PA 138/84 mmHg', 'SpO2 96%'],
        monitor: { type: 'ecg', rhythmKey: 'stemi-inferior' },
        question: 'Confirmado IAM com supra de ST. Qual a prioridade terapêutica?',
        choices: [
          {
            id: 'a',
            label: 'Iniciar reperfusão: angioplastia em até 90 minutos (preferencial) ou fibrinólise em até 30 minutos se hemodinâmica indisponível',
            quality: 'strong',
            feedback:
              'Correto. IAM com supra de ST exige reperfusão o mais rápido possível — angioplastia é a primeira escolha (até 90 min), com fibrinólise (até 30 min) como alternativa quando não há hemodinâmica disponível.',
            nextStateLabel: 'Reperfusão iniciada',
            nextStateText: 'Equipe de hemodinâmica acionada; paciente segue para angioplastia.',
          },
          {
            id: 'b',
            label: 'Apenas controlar a dor com morfina e observar evolução por 2 horas',
            quality: 'partial',
            feedback:
              'Controlar a dor faz parte do tratamento adjunto, mas sem acionar a reperfusão (angioplastia/fibrinólise) a conduta fica incompleta e o miocárdio continua em sofrimento — "observar por 2 horas" ultrapassa em muito as metas de tempo.',
            nextStateLabel: 'Tratamento incompleto',
            nextStateText: 'A dor melhora, mas a oclusão coronariana persiste sem tratamento definitivo.',
          },
          {
            id: 'c',
            label: 'Aguardar resultado de troponina seriada (3 coletas) antes de decidir sobre reperfusão',
            quality: 'review',
            feedback:
              'Incorreto. Com supra de ST no ECG, o diagnóstico já está confirmado e a reperfusão não deve esperar troponina seriada — essa estratégia é usada nos casos sem supra de ST, não neste.',
            nextStateLabel: 'Atraso crítico',
            nextStateText: 'O retardo pode aumentar a área de necrose miocárdica.',
          },
          {
            id: 'd',
            label: 'Indicar cirurgia de revascularização miocárdica de urgência como primeira opção',
            quality: 'review',
            feedback:
              'Incorreto como primeira escolha. A revascularização cirúrgica de urgência é reservada para situações específicas (ex.: falha de angioplastia, anatomia desfavorável) — a primeira escolha em IAMCST é a angioplastia percutânea.',
            nextStateLabel: 'Conduta fora de sequência',
            nextStateText: 'O paciente aguarda uma avaliação cirúrgica que não é a prioridade neste momento.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pré-hemodinâmica',
        patientType: 'Aguardando angioplastia',
        vignette: 'Enquanto aguarda a angioplastia, a equipe prepara o tratamento adjunto conforme o protocolo.',
        vitals: ['FC 88 bpm', 'PA 134/82 mmHg', 'SpO2 97%', 'Sem alergias conhecidas'],
        monitor: { type: 'ecg', rhythmKey: 'stemi-inferior' },
        question: 'Qual conjunto de medidas adjuntas é apropriado neste momento?',
        choices: [
          {
            id: 'a',
            label: 'AAS + clopidogrel (dupla antiagregação), heparina, e considerar nitrato/morfina para a dor, observando contraindicações',
            quality: 'strong',
            feedback:
              'Correto. O tratamento adjunto padrão inclui dupla antiagregação (AAS + clopidogrel), anticoagulação com heparina, e alívio de dor com nitrato ou morfina, sempre checando contraindicações.',
            nextStateLabel: 'Caso conduzido corretamente',
            nextStateText: 'Paciente estável, medicação adjunta administrada, segue para angioplastia dentro do tempo-alvo.',
          },
          {
            id: 'b',
            label: 'Administrar apenas AAS, sem outras medicações adjuntas',
            quality: 'partial',
            feedback:
              'AAS é essencial e reduz mortalidade, mas isoladamente não compõe o tratamento adjunto completo recomendado (falta dupla antiagregação e anticoagulação).',
            nextStateLabel: 'Tratamento parcial',
            nextStateText: 'O paciente segue para angioplastia com cobertura farmacológica incompleta.',
          },
          {
            id: 'c',
            label: 'Nitroglicerina em infusão contínua sem avaliar o território do infarto',
            quality: 'review',
            feedback:
              'Incorreto. Nitroglicerina é contraindicada em infarto de ventrículo direito ou de parede inferior com comprometimento de VD — é preciso avaliar isso antes de usar, pois pode causar hipotensão grave.',
            nextStateLabel: 'Risco de hipotensão grave',
            nextStateText: 'O paciente apresenta queda abrupta da pressão arterial.',
          },
          {
            id: 'd',
            label: 'Suspender o AAS por risco de sangramento gastrointestinal não investigado',
            quality: 'review',
            feedback:
              'Incorreto. Na ausência de sangramento ativo ou alergia confirmada, o AAS não deve ser suspenso — ele reduz mortalidade no IAM e seu benefício supera o risco teórico sem evidência de sangramento atual.',
            nextStateLabel: 'Tratamento essencial omitido',
            nextStateText: 'O paciente perde o benefício de uma medicação com impacto direto na mortalidade.',
          },
        ],
      },
    ],
  },
  {
    id: 'avc-isquemico',
    caseNumber: 4,
    category: 'Acidente Vascular Cerebral',
    broadCategory: 'Emergência Neurológica',
    difficulty: 'Avançado',
    title: 'AVC Isquêmico Agudo',
    chiefComplaint: 'Mulher, 71 anos, perda de força súbita no braço direito.',
    durationMin: 12,
    icon: 'brain',
    algorithmPhases: ['Reconhecimento', 'Tempo zero', 'Trombólise', 'Monitorização'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Protocolo AVC',
        patientType: 'Protocolo AVC ativado',
        vignette:
          'Mulher, 71 anos, trazida pela família com queda súbita de força no braço direito e dificuldade para falar. A tomografia de crânio é realizada.',
        vitals: ['FC 84 bpm', 'PA 168/94 mmHg', 'Glicemia capilar 102 mg/dL', 'SpO2 97%', 'Glasgow 13'],
        monitor: {
          type: 'ct',
          ctFinding: 'Sem sinais de sangramento, hipodensidade estabelecida ou efeito de massa.',
        },
        question: 'Com base na tomografia e no quadro clínico, qual a interpretação mais provável?',
        choices: [
          {
            id: 'a',
            label: 'AVC isquêmico agudo, sem contraindicação por imagem para trombólise',
            quality: 'strong',
            feedback:
              'Correto. A ausência de sangramento na tomografia, associada ao déficit focal súbito, é compatível com AVC isquêmico agudo — a TC normal/sem sangramento é justamente o que se espera nas primeiras horas de um isquêmico, e libera a via para considerar trombólise.',
          },
          {
            id: 'b',
            label: 'AVC hemorrágico — a trombólise está contraindicada',
            quality: 'review',
            feedback:
              'Incorreto. O enunciado descreve ausência de sangramento na tomografia — isso é o oposto do AVC hemorrágico, que mostraria uma área hiperdensa (sangue) na TC.',
          },
          {
            id: 'c',
            label: 'Tumor cerebral com efeito de massa, causando o déficit focal',
            quality: 'review',
            feedback:
              'Incorreto. O achado descrito não menciona efeito de massa nem lesão expansiva — e o início súbito do déficit (em minutos) é muito mais compatível com evento vascular do que com tumor, que costuma ter evolução progressiva.',
          },
          {
            id: 'd',
            label: 'Alteração esperada para a idade, sem necessidade de conduta específica',
            quality: 'review',
            feedback:
              'Incorreto e perigoso. Um déficit motor e de fala súbitos não são "normais para a idade" — isso é uma emergência tempo-dependente e precisa de conduta imediata.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Suspeita de AVC',
        patientType: 'Protocolo AVC ativado',
        vignette: 'A família não sabe precisar a hora exata do início do déficit.',
        vitals: ['FC 84 bpm', 'PA 168/94 mmHg', 'Glicemia capilar 102 mg/dL', 'SpO2 97%'],
        monitor: { type: 'none' },
        question: 'Qual a primeira pergunta/conduta essencial neste momento?',
        choices: [
          {
            id: 'a',
            label: 'Determinar a última hora em que a paciente foi vista bem, e confirmar a glicemia capilar',
            quality: 'strong',
            feedback:
              'Correto. O "tempo zero" para elegibilidade a tratamento é a última vez que a paciente foi vista bem, não o horário em que o déficit foi notado. A glicemia também deve ser checada, pois hipoglicemia pode mimetizar AVC.',
            nextStateLabel: 'Tempo zero definido',
            nextStateText: 'Família informa que a paciente foi vista bem há 1h40min. Glicemia normal — hipoglicemia excluída como causa.',
          },
          {
            id: 'b',
            label: 'Considerar a hora em que a família notou o déficit como o início dos sintomas',
            quality: 'review',
            feedback:
              'Incorreto. Usar a hora em que o déficit foi notado (em vez da última vez vista bem) pode subestimar o tempo real de evolução e levar a decisões terapêuticas erradas sobre a janela disponível.',
            nextStateLabel: 'Tempo zero incorreto',
            nextStateText: 'A equipe calcula uma janela terapêutica maior do que a real.',
          },
          {
            id: 'c',
            label: 'Solicitar ressonância magnética antes de qualquer outra conduta',
            quality: 'partial',
            feedback:
              'A ressonância pode ser usada, mas na maioria dos serviços a tomografia sem contraste é mais rápida e é o exame inicial padrão — não se deve atrasar o processo esperando por ressonância.',
            nextStateLabel: 'Atraso no fluxo',
            nextStateText: 'O tempo até a decisão terapêutica aumenta.',
          },
          {
            id: 'd',
            label: 'Aguardar a paciente "melhorar espontaneamente" antes de agir',
            quality: 'review',
            feedback:
              'Incorreto. Em suspeita de AVC, "tempo é cérebro" — não se espera melhora espontânea, o protocolo deve ser ativado imediatamente.',
            nextStateLabel: 'Perda de tempo crítico',
            nextStateText: 'Minutos valiosos da janela terapêutica são perdidos.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Protocolo AVC',
        patientType: 'Pós-tomografia',
        vignette: 'O NIHSS calculado é 14. Última vez vista bem: há 1h50min.',
        vitals: ['FC 86 bpm', 'PA 172/96 mmHg', 'NIHSS 14', 'Sem sangramento na TC'],
        monitor: { type: 'ct', ctFinding: 'Sem sangramento. Sem sinais precoces extensos de isquemia estabelecida.' },
        question: 'TC sem sangramento, dentro da janela de 3h. Qual a conduta?',
        choices: [
          {
            id: 'a',
            label: 'Verificar contraindicações e, se não houver, administrar alteplase IV (0,9 mg/kg, máx. 90 mg)',
            quality: 'strong',
            feedback:
              'Correto. Dentro da janela de até 3h (e até 4h30 para a maioria dos pacientes), sem sangramento e sem contraindicações, a alteplase intravenosa é o tratamento indicado, na dose de 0,9 mg/kg (máximo 90 mg), 10% em bolus e o restante em 60 minutos.',
            nextStateLabel: 'Trombólise iniciada',
            nextStateText: 'Alteplase administrada. Equipe mantém monitorização neurológica rigorosa e controle pressórico abaixo de 180x105 mmHg.',
          },
          {
            id: 'b',
            label: 'Iniciar AAS imediatamente como tratamento principal, em vez de alteplase',
            quality: 'review',
            feedback:
              'Incorreto neste momento. Antiagregantes não devem ser administrados antes de decidir sobre trombólise, e nas primeiras 24h após alteplase são contraindicados — o AAS entra depois, se a trombólise não for indicada ou após o período de risco de sangramento.',
            nextStateLabel: 'Conduta equivocada',
            nextStateText: 'Essa conduta pode interferir na elegibilidade para alteplase.',
          },
          {
            id: 'c',
            label: 'Aguardar angiotomografia de vasos antes de decidir sobre a alteplase',
            quality: 'partial',
            feedback:
              'A angiotomografia é importante para avaliar trombectomia mecânica, mas não deve atrasar a administração de alteplase nos pacientes elegíveis — as duas avaliações correm em paralelo.',
            nextStateLabel: 'Atraso evitável',
            nextStateText: 'A trombólise é postergada sem necessidade.',
          },
          {
            id: 'd',
            label: 'Não tratar e aguardar a paciente completar 4h30 do início dos sintomas antes de decidir',
            quality: 'review',
            feedback:
              'Incorreto. A paciente já está dentro da janela de até 3h — não há motivo para "esperar completar" mais tempo; ao contrário, quanto mais cedo o tratamento, melhor o prognóstico.',
            nextStateLabel: 'Atraso sem justificativa',
            nextStateText: 'A paciente perde a janela ideal de tratamento sem necessidade.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-trombólise',
        patientType: 'Sob monitorização neurológica',
        vignette: 'Trinta minutos após o início da alteplase, a paciente apresenta cefaleia súbita intensa e piora do déficit motor.',
        vitals: ['FC 92 bpm', 'PA 190/104 mmHg', 'Piora do NIHSS'],
        monitor: { type: 'ct', ctFinding: 'A ser repetida com urgência diante dos novos sintomas.' },
        question: 'Suspeita de complicação durante a trombólise. Qual a conduta?',
        choices: [
          {
            id: 'a',
            label: 'Parar a infusão imediatamente e levar a paciente para nova tomografia de crânio sem contraste',
            quality: 'strong',
            feedback:
              'Correto. Cefaleia súbita intensa e piora neurológica durante a infusão de alteplase sugerem transformação hemorrágica — a conduta é parar a infusão e obter TC de crânio imediatamente para confirmar.',
            nextStateLabel: 'Complicação identificada a tempo',
            nextStateText: 'TC confirma pequena hemorragia; equipe de neurocirurgia é acionada e a paciente é manejada conforme protocolo de hemorragia intracraniana.',
          },
          {
            id: 'b',
            label: 'Reduzir a velocidade da infusão e reavaliar em 15 minutos',
            quality: 'review',
            feedback:
              'Incorreto. Sinais de piora neurológica aguda durante a trombólise exigem parada imediata da infusão e investigação por imagem, não apenas reduzir a velocidade.',
            nextStateLabel: 'Conduta insuficiente',
            nextStateText: 'O atraso pode agravar uma possível hemorragia em curso.',
          },
          {
            id: 'c',
            label: 'Administrar apenas analgésico para a cefaleia e manter a infusão',
            quality: 'review',
            feedback:
              'Incorreto e perigoso. Esses sinais são de alarme para complicação hemorrágica — manter a infusão de alteplase nessa situação pode ser fatal.',
            nextStateLabel: 'Conduta grave',
            nextStateText: 'O risco de uma hemorragia não controlada aumenta significativamente.',
          },
          {
            id: 'd',
            label: 'Aumentar a velocidade da infusão para completar a dose total mais rapidamente',
            quality: 'review',
            feedback:
              'Incorreto. Diante de sinais de alarme para hemorragia, a prioridade é parar a infusão — aumentar a velocidade só agravaria uma possível complicação hemorrágica em curso.',
            nextStateLabel: 'Conduta contraindicada',
            nextStateText: 'A dose adicional de trombolítico pode piorar significativamente um sangramento já iniciado.',
          },
        ],
      },
    ],
  },
  {
    id: 'rcp-basica-sbv',
    caseNumber: 5,
    category: 'Suporte Básico de Vida',
    broadCategory: 'Suporte Básico de Vida',
    difficulty: 'Básico',
    title: 'RCP de Alta Qualidade',
    chiefComplaint: 'Homem, ~60 anos, colapso súbito em via pública.',
    durationMin: 8,
    icon: 'wind',
    algorithmPhases: ['Reconhecer PCR', 'Compressões', 'Uso do DEA', 'Troca/reavaliação'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Via Pública · Testemunha presente',
        patientType: 'Colapso súbito',
        vignette:
          'Homem, aproximadamente 60 anos, colapsa subitamente em frente a você. Você se aproxima e percebe que ele respira de forma ofegante, irregular, com longos intervalos entre as respirações.',
        vitals: ['Sem resposta a estímulos', 'Padrão respiratório irregular', 'Cena aparentemente segura'],
        monitor: { type: 'none' },
        question: 'Como você deve classificar esse padrão respiratório observado?',
        choices: [
          {
            id: 'a',
            label: 'Gasping — deve ser considerado ausência de respiração efetiva, compatível com PCR',
            quality: 'strong',
            feedback:
              'Correto. O gasping (respiração agônica) é um padrão comum nos primeiros minutos de parada cardiorrespiratória e NÃO deve ser confundido com respiração normal — é um dos erros mais comuns que atrasa o início da RCP.',
          },
          {
            id: 'b',
            label: 'Respiração normal — isso descarta parada cardiorrespiratória',
            quality: 'review',
            feedback:
              'Incorreto e perigoso. Esse é exatamente o erro clássico: confundir gasping com respiração normal retarda o início da RCP. Gasping não é respiração efetiva.',
          },
          {
            id: 'c',
            label: 'Respiração de Cheyne-Stokes — aguardar e reavaliar em alguns minutos',
            quality: 'review',
            feedback:
              'Incorreto. Mesmo que o padrão lembrasse Cheyne-Stokes, diante de um colapso súbito com ausência de resposta, a conduta nunca é "aguardar" — deve-se checar pulso/respiração em até 10 segundos e agir.',
          },
          {
            id: 'd',
            label: 'Hiperventilação por crise de ansiedade — orientar a vítima a se acalmar',
            quality: 'review',
            feedback:
              'Incorreto. Uma vítima em colapso súbito, sem resposta, não está tendo uma crise de ansiedade — essa interpretação atrasa perigosamente o reconhecimento da parada cardiorrespiratória.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Via Pública · Testemunha presente',
        patientType: 'Colapso súbito',
        vignette: 'Você reconhece o gasping como sinal de alarme. Não há resposta ao chamado.',
        vitals: ['Sem resposta', 'Gasping presente', 'Cena aparentemente segura'],
        monitor: { type: 'none' },
        question: 'Qual a sua próxima ação?',
        choices: [
          {
            id: 'a',
            label: 'Checar a segurança da cena, verificar responsividade e checar pulso/respiração por até 10 segundos',
            quality: 'strong',
            feedback:
              'Correto. Antes de tudo, confirme que a cena é segura para você e a vítima, depois verifique responsividade e, simultaneamente, pulso carotídeo e respiração/gasping por no máximo 10 segundos.',
            nextStateLabel: 'Parada confirmada',
            nextStateText: 'Sem pulso, sem respiração efetiva. Você aciona o serviço de emergência e inicia RCP.',
          },
          {
            id: 'b',
            label: 'Iniciar compressões torácicas imediatamente sem checar pulso ou segurança da cena',
            quality: 'partial',
            feedback:
              'Em muitos protocolos leigos simplificados isso é aceitável, mas como profissional de saúde você deve confirmar segurança da cena e ausência de pulso/respiração antes de iniciar — pular essa etapa compromete sua segurança e a precisão do diagnóstico.',
            nextStateLabel: 'Conduta apressada',
            nextStateText: 'Você inicia as compressões, mas sem confirmar formalmente a segurança da cena ou a ausência de pulso.',
          },
          {
            id: 'c',
            label: 'Colocar a vítima em posição lateral de segurança e aguardar a ambulância',
            quality: 'review',
            feedback:
              'Incorreto. Posição lateral de segurança é para vítimas que respiram normalmente e estão inconscientes, não para suspeita de PCR com gasping — isso atrasa fatalmente o início das compressões.',
            nextStateLabel: 'Conduta contraindicada',
            nextStateText: 'A ausência de compressões torácicas agrava a hipóxia tecidual.',
          },
          {
            id: 'd',
            label: 'Aguardar a ambulância chegar antes de fazer qualquer coisa',
            quality: 'review',
            feedback:
              'Incorreto. Cada minuto sem início do atendimento reduz a chance de sobrevida em até 10% — você deve agir imediatamente, não esperar a ambulância.',
            nextStateLabel: 'Perda de tempo crítico',
            nextStateText: 'O tempo sem atendimento aumenta o risco de dano cerebral irreversível.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Via Pública · RCP em andamento',
        patientType: 'Parada cardiorrespiratória confirmada',
        vignette: 'Ausência de pulso e respiração confirmadas. Você está sozinho até a chegada de ajuda.',
        vitals: ['Sem pulso', 'Sem respiração efetiva', 'DEA ainda não disponível', 'Glasgow 3'],
        monitor: { type: 'none' },
        question: 'Como você deve realizar as compressões torácicas?',
        choices: [
          {
            id: 'a',
            label: 'Centro do tórax, 5-6 cm de profundidade, 100-120 compressões/min, permitindo retorno completo do tórax, braços esticados',
            quality: 'strong',
            feedback:
              'Correto. Essa é a técnica de compressão de alta qualidade: região hipotenar no centro do tórax, profundidade de 5-6 cm, frequência de 100-120/min, retorno completo entre compressões, força vinda do tronco com os braços esticados.',
            nextStateLabel: 'RCP de alta qualidade',
            nextStateText: 'Compressões efetivas mantidas. Um segundo socorrista chega com um DEA.',
          },
          {
            id: 'b',
            label: 'Compressões rápidas e profundas (acima de 6 cm), sem se preocupar com o retorno completo do tórax',
            quality: 'partial',
            feedback:
              'A frequência pode estar correta, mas ultrapassar 6 cm de profundidade e não permitir o retorno completo do tórax reduzem a eficácia e aumentam o risco de lesões, como fraturas de costela.',
            nextStateLabel: 'RCP subótima',
            nextStateText: 'As compressões são aplicadas, mas com menor eficácia circulatória e maior risco de lesão.',
          },
          {
            id: 'c',
            label: 'Compressões superficiais (cerca de 2 cm) na região abdominal superior, a uma frequência de 60/min',
            quality: 'review',
            feedback:
              'Incorreto. A compressão deve ser no centro do tórax (metade inferior do esterno), nunca na região abdominal, com profundidade de 5-6 cm e frequência de 100-120/min — nada nesta opção está correto.',
            nextStateLabel: 'Conduta inadequada',
            nextStateText: 'Essa técnica não gera fluxo sanguíneo eficaz.',
          },
          {
            id: 'd',
            label: 'Compressões no centro do tórax a 100-120/min, mas sem permitir o retorno completo, "para não perder o ritmo"',
            quality: 'review',
            feedback:
              'Incorreto. Apoiar-se sobre o tórax entre as compressões (sem retorno completo) impede o enchimento cardíaco adequado e reduz drasticamente o débito gerado pela RCP, mesmo com frequência e local corretos.',
            nextStateLabel: 'Erro técnico frequente',
            nextStateText: 'A perfusão gerada pelas compressões fica comprometida apesar da frequência correta.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Via Pública · Chegada do DEA',
        patientType: 'Parada cardiorrespiratória · 2 socorristas',
        vignette: 'Um segundo socorrista chega com um DEA disponível, enquanto você continua as compressões.',
        vitals: ['Compressões em andamento', 'DEA disponível', 'Tórax seco, sem adesivos na região das pás'],
        monitor: { type: 'none' },
        question: 'Com o DEA disponível, qual a conduta correta?',
        choices: [
          {
            id: 'a',
            label: 'Preparar o DEA sem interromper as compressões; parar apenas quando o aparelho estiver pronto para analisar/chocar',
            quality: 'strong',
            feedback:
              'Correto. Com dois socorristas, as compressões não devem ser interrompidas até que o DEA esteja pronto para análise — a prioridade então passa a ser a desfibrilação, mesmo que o ciclo de 2 minutos não tenha terminado.',
            nextStateLabel: 'Choque indicado e aplicado',
            nextStateText: 'DEA identifica ritmo chocável e aplica o choque. RCP retomada imediatamente após.',
          },
          {
            id: 'b',
            label: 'Parar as compressões assim que o DEA chegar, para conectá-lo com calma',
            quality: 'partial',
            feedback:
              'O DEA deve ser conectado, mas as compressões só devem parar quando ele estiver de fato pronto para analisar o ritmo — parar antes disso sem necessidade reduz a perfusão.',
            nextStateLabel: 'Interrupção evitável',
            nextStateText: 'Perda de alguns segundos valiosos de compressão.',
          },
          {
            id: 'c',
            label: 'Não usar o DEA até a ambulância avançada chegar, por ser "procedimento médico"',
            quality: 'review',
            feedback:
              'Incorreto. O DEA foi projetado para uso por leigos treinados e deve ser usado assim que disponível — cerca de 70% das paradas extra-hospitalares são por ritmos chocáveis, e a desfibrilação precoce aumenta muito a sobrevida.',
            nextStateLabel: 'Oportunidade perdida',
            nextStateText: 'O tratamento do ritmo chocável é postergado sem necessidade.',
          },
          {
            id: 'd',
            label: 'Aplicar o choque imediatamente ao ligar o DEA, sem aguardar a análise automática do ritmo',
            quality: 'review',
            feedback:
              'Incorreto. O DEA precisa analisar o ritmo antes de indicar (ou não) o choque — aplicar choque "no escuro" sem a análise do aparelho não é o funcionamento correto do equipamento e compromete a segurança.',
            nextStateLabel: 'Uso incorreto do equipamento',
            nextStateText: 'O aparelho não libera o choque fora da sequência correta de análise.',
          },
        ],
      },
    ],
  },
  {
    id: 'taquicardia-instavel-svt',
    caseNumber: 6,
    category: 'Taquicardias',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Intermediário',
    title: 'Taquicardia Supraventricular Instável',
    chiefComplaint: 'Mulher, 32 anos, palpitações súbitas e tontura.',
    durationMin: 10,
    icon: 'activity',
    algorithmPhases: ['Identificar ritmo', 'Estável ou instável', 'Cardioversão sincronizada', 'Prevenção secundária'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Triagem',
        patientType: 'Taquicardia sintomática',
        vignette:
          'Mulher, 32 anos, previamente hígida, relata início súbito de palpitações e tontura há 20 minutos, sem dor torácica. O monitor exibe o traçado abaixo.',
        vitals: ['FC 182 bpm', 'PA 96/64 mmHg', 'SpO2 98%', 'FR 20 irpm'],
        monitor: { type: 'ecg', rhythmKey: 'svt' },
        question: 'Qual é a leitura correta deste traçado?',
        choices: [
          {
            id: 'a',
            label: 'Taquicardia supraventricular: QRS estreito e regular, frequência muito elevada, onda P não identificável',
            quality: 'strong',
            feedback:
              'Correto. O traçado mostra complexos estreitos, regulares, em frequência muito alta, sem onda P visível — compatível com taquicardia supraventricular (TSV).',
          },
          {
            id: 'b',
            label: 'Fibrilação atrial com resposta ventricular rápida',
            quality: 'partial',
            feedback:
              'Ambas cursam com QRS estreito e frequência elevada, mas a fibrilação atrial tem intervalos R-R irregulares — aqui o ritmo é regular, o que afasta FA.',
          },
          {
            id: 'c',
            label: 'Flutter atrial com condução 2:1',
            quality: 'review',
            feedback:
              'Incorreto. O flutter atrial costuma mostrar ondas F em "dente de serra" entre os QRS, ausentes neste traçado, mesmo com frequência numericamente parecida.',
          },
          {
            id: 'd',
            label: 'Taquicardia ventricular',
            quality: 'review',
            feedback:
              'Incorreto. Na taquicardia ventricular o QRS é alargado — este traçado mostra complexos estreitos, o que já afasta essa hipótese.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Triagem',
        patientType: 'Taquicardia sintomática',
        vignette: 'Confirmada a TSV. Você reavalia a paciente e nota tontura importante, pele pastosa e queda da pressão.',
        vitals: ['FC 182 bpm', 'PA 78/50 mmHg', 'Tontura importante', 'Pele fria e úmida'],
        monitor: { type: 'ecg', rhythmKey: 'svt' },
        question: 'Diante desses sinais, qual a primeira conduta?',
        choices: [
          {
            id: 'a',
            label: 'Reconhecer os sinais de instabilidade (hipotensão, hipoperfusão) e indicar cardioversão elétrica sincronizada imediata',
            quality: 'strong',
            feedback:
              'Correto. Alteração de perfusão e hipotensão caracterizam taquicardia instável — a conduta de primeira linha é a cardioversão elétrica sincronizada, não manobras ou drogas de uso em pacientes estáveis.',
            nextStateLabel: 'Instabilidade reconhecida',
            nextStateText: 'Equipe se prepara imediatamente para a cardioversão elétrica sincronizada.',
          },
          {
            id: 'b',
            label: 'Realizar manobra vagal antes de qualquer outra conduta, já que o QRS é estreito',
            quality: 'partial',
            feedback:
              'Manobra vagal e adenosina são apropriadas para TSV estável — mas diante de sinais de instabilidade, a prioridade passa a ser a cardioversão elétrica, não essas medidas.',
            nextStateLabel: 'Conduta atrasada',
            nextStateText: 'A manobra não resolve e a paciente permanece instável enquanto se perde tempo.',
          },
          {
            id: 'c',
            label: 'Administrar apenas analgésico para a tontura e reavaliar em 30 minutos',
            quality: 'review',
            feedback:
              'Incorreto e perigoso. Sinais de instabilidade hemodinâmica exigem conduta imediata, não analgesia e reavaliação tardia.',
            nextStateLabel: 'Risco aumentado',
            nextStateText: 'A paciente pode evoluir para deterioração mais grave enquanto se aguarda.',
          },
          {
            id: 'd',
            label: 'Indicar apenas aumento da oferta de oxigênio e observação, sem outra intervenção',
            quality: 'review',
            feedback:
              'Incorreto. A saturação já está normal (98%) — o problema é hemodinâmico, e sinais de instabilidade exigem intervenção ativa sobre o ritmo, não apenas suporte de oxigênio.',
            nextStateLabel: 'Conduta insuficiente',
            nextStateText: 'A tontura e a hipotensão persistem sem tratamento direcionado.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Triagem',
        patientType: 'Taquicardia instável',
        vignette: 'Equipe prepara a cardioversão elétrica sincronizada.',
        vitals: ['FC 182 bpm', 'PA 78/50 mmHg', 'Acesso venoso obtido'],
        monitor: { type: 'ecg', rhythmKey: 'svt' },
        question: 'Como deve ser realizada a cardioversão sincronizada nesta paciente?',
        choices: [
          {
            id: 'a',
            label: 'Sedar se possível, ativar o modo sincronizado do aparelho, posicionar as pás corretamente e aplicar carga inicial de 100 J, mantendo-as até a liberação do choque',
            quality: 'strong',
            feedback:
              'Correto. Para taquicardia de QRS estreito regular que não seja FA/flutter, a carga inicial recomendada é 100 J, sempre em modo sincronizado, mantendo as pás até o choque ser liberado.',
            nextStateLabel: 'Cardioversão bem-sucedida',
            nextStateText: 'Após o choque sincronizado, a paciente reverte para ritmo sinusal.',
          },
          {
            id: 'b',
            label: 'Aplicar o choque sem ativar o modo sincronizado, já que a paciente está instável',
            quality: 'review',
            feedback:
              'Incorreto. Mesmo em paciente instável, se há pulso e um QRS organizado, a cardioversão deve ser sincronizada — o choque assíncrono (desfibrilação) é reservado para ritmos sem pulso, como FV ou TV sem pulso.',
            nextStateLabel: 'Risco de fenômeno R sobre T',
            nextStateText: 'Um choque não sincronizado pode cair no período vulnerável do ciclo cardíaco e precipitar fibrilação ventricular.',
          },
          {
            id: 'c',
            label: 'Aguardar que a adenosina faça efeito antes de cardioverter',
            quality: 'review',
            feedback:
              'Incorreto. Diante de instabilidade já reconhecida, não se deve atrasar a cardioversão elétrica esperando o efeito de uma medicação.',
            nextStateLabel: 'Atraso na estabilização',
            nextStateText: 'A paciente permanece instável enquanto se aguarda a medicação.',
          },
          {
            id: 'd',
            label: 'Aplicar diretamente a carga máxima do aparelho, pulando a dose inicial recomendada',
            quality: 'partial',
            feedback:
              'Não é necessário iniciar na carga máxima — a dose inicial recomendada para QRS estreito regular (fora FA/flutter) é 100 J, escalando apenas se o primeiro choque não for efetivo.',
            nextStateLabel: 'Dose acima do necessário',
            nextStateText: 'A paciente reverte, mas recebeu uma carga maior do que a recomendada para a primeira tentativa.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-cardioversão',
        patientType: 'Pós-cardioversão',
        vignette: 'Após o choque sincronizado, a paciente reverte para ritmo sinusal, com melhora da pressão e da tontura.',
        vitals: ['FC 84 bpm', 'PA 116/74 mmHg', 'Tontura resolvida'],
        monitor: { type: 'ecg', rhythmKey: 'normal-sinus' },
        question: 'Qual a conduta após a reversão bem-sucedida?',
        choices: [
          {
            id: 'a',
            label: 'Manter monitorização contínua, investigar causas desencadeantes e documentar o evento para seguimento ambulatorial/cardiológico',
            quality: 'strong',
            feedback:
              'Correto. Após reversão, mantém-se observação monitorizada, investigam-se possíveis causas (eletrólitos, tireoide, uso de estimulantes) e organiza-se o seguimento ambulatorial.',
            nextStateLabel: 'Caso encerrado com segurança',
            nextStateText: 'Paciente estável, investigação iniciada, encaminhada para seguimento cardiológico.',
          },
          {
            id: 'b',
            label: 'Liberar a paciente imediatamente, já que o ritmo normalizou',
            quality: 'partial',
            feedback:
              'Mesmo assintomática após a reversão, recomenda-se um período de observação monitorizada e investigação inicial antes de considerar a alta.',
            nextStateLabel: 'Alta precoce',
            nextStateText: 'A paciente recebe alta sem investigação, perdendo a oportunidade de identificar a causa.',
          },
          {
            id: 'c',
            label: 'Iniciar antiarrítmico profilático em dose máxima antes de qualquer investigação',
            quality: 'review',
            feedback:
              'Incorreto. Não há indicação de iniciar antiarrítmico empiricamente em dose máxima sem avaliação e indicação específica.',
            nextStateLabel: 'Conduta sem indicação',
            nextStateText: 'A paciente recebe uma medicação sem base clara para a dose escolhida.',
          },
          {
            id: 'd',
            label: 'Repetir a cardioversão elétrica agora, como medida de "consolidação" do ritmo',
            quality: 'review',
            feedback:
              'Incorreto. Não há indicação de repetir a cardioversão em uma paciente que já reverteu e está estável — isso exporia a paciente a um procedimento desnecessário.',
            nextStateLabel: 'Procedimento desnecessário',
            nextStateText: 'A paciente é submetida a um novo choque sem indicação clínica.',
          },
        ],
      },
    ],
  },
  {
    id: 'via-aerea-dificil',
    caseNumber: 7,
    category: 'Manejo de Vias Aéreas',
    broadCategory: 'Via Aérea',
    difficulty: 'Avançado',
    title: 'Intubação em Sequência Rápida',
    chiefComplaint: 'Homem, 45 anos, insuficiência respiratória progressiva.',
    durationMin: 12,
    icon: 'wind',
    algorithmPhases: ['Indicação de via aérea', 'Preparo e posicionamento', 'Sequência rápida', 'Falha de intubação'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Insuficiência Respiratória',
        patientType: 'Insuficiência respiratória',
        vignette:
          'Homem, 45 anos, internado por pneumonia grave, evolui com piora do esforço respiratório, confusão e queda da saturação apesar de máscara não reinalante com reservatório.',
        vitals: ['FC 118 bpm', 'PA 128/78 mmHg', 'SpO2 84% em máscara', 'FR 34 irpm', 'Glasgow 13'],
        monitor: { type: 'none' },
        question: 'Qual a interpretação correta sobre a necessidade de via aérea avançada neste momento?',
        choices: [
          {
            id: 'a',
            label: 'Paciente apresenta falência respiratória apesar de suporte não invasivo máximo — indicação clara de intubação, que não deve ser postergada',
            quality: 'strong',
            feedback:
              'Correto. Uma vez indicada a intubação, o prognóstico piora quanto mais se posterga o procedimento — e aqui já há hipoxemia grave e confusão mesmo com suporte máximo de oxigênio.',
          },
          {
            id: 'b',
            label: 'Tentar apenas aumentar o fluxo de oxigênio na máscara antes de considerar intubação',
            quality: 'partial',
            feedback:
              'O paciente já está em máscara não reinalante com reservatório (próximo do fluxo máximo possível) e mesmo assim apresenta hipoxemia e confusão — isso já ultrapassou o limite do suporte não invasivo.',
          },
          {
            id: 'c',
            label: 'Aguardar o resultado da gasometria arterial antes de decidir sobre via aérea',
            quality: 'review',
            feedback:
              'Incorreto. O quadro clínico de falência respiratória com hipoxemia grave e confusão já é suficiente para indicar a intubação — não se deve atrasar essa decisão esperando um exame.',
          },
          {
            id: 'd',
            label: 'Indicar ventilação não invasiva (VNI/BiPAP) como alternativa definitiva, sem necessidade de intubação',
            quality: 'review',
            feedback:
              'Incorreto. A piora com confusão mental e hipoxemia grave, mesmo com suporte máximo, contraindica insistir em VNI (risco de aspiração e piora) — o quadro indica via aérea definitiva.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pré-intubação',
        patientType: 'Pré-intubação',
        vignette: 'Decidida a intubação. A equipe se prepara para a sequência rápida.',
        vitals: ['FC 118 bpm', 'SpO2 86% pré-oxigenado', 'Acesso venoso calibroso obtido'],
        monitor: { type: 'none' },
        question: 'Qual o passo de preparo mais importante antes de iniciar a sequência rápida?',
        choices: [
          {
            id: 'a',
            label: 'Posicionar o paciente (coxim occipital alinhando os eixos da via aérea), pré-oxigenar adequadamente e definir com a equipe os planos A/B/C/D de via aérea',
            quality: 'strong',
            feedback:
              'Correto. Posicionamento adequado, pré-oxigenação e um plano combinado com a equipe (incluindo planos de resgate) são a base de uma sequência rápida segura.',
            nextStateLabel: 'Equipe preparada',
            nextStateText: 'Paciente posicionado e pré-oxigenado, planos A/B/C/D combinados com a equipe.',
          },
          {
            id: 'b',
            label: 'Apenas montar o material de intubação, sem briefing prévio com a equipe',
            quality: 'partial',
            feedback:
              'Preparar o material é necessário, mas sem definir papéis e planos de resgate com a equipe (quem chama ajuda, em que momento) a segurança do procedimento fica reduzida.',
            nextStateLabel: 'Preparo incompleto',
            nextStateText: 'A equipe tem o material, mas não sabe exatamente seu papel caso a intubação seja difícil.',
          },
          {
            id: 'c',
            label: 'Pular a pré-oxigenação para ganhar tempo, já que o paciente está taquipneico',
            quality: 'review',
            feedback:
              'Incorreto. Pular a pré-oxigenação aumenta muito o risco de dessaturação grave durante a laringoscopia — justamente o paciente taquipneico e hipoxêmico mais se beneficia dela.',
            nextStateLabel: 'Risco aumentado',
            nextStateText: 'O paciente tem menor reserva de oxigênio para a tentativa de intubação.',
          },
          {
            id: 'd',
            label: 'Posicionar o paciente em hiperextensão cervical simples, sem coxim occipital',
            quality: 'review',
            feedback:
              'Incorreto. A hiperextensão pura, sem coxim occipital, não alinha corretamente os três eixos da via aérea — a posição recomendada (olfatória) combina coxim occipital com leve extensão.',
            nextStateLabel: 'Posicionamento inadequado',
            nextStateText: 'A visualização das cordas vocais fica mais difícil do que o necessário.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Sequência Rápida',
        patientType: 'Sequência rápida de intubação',
        vignette: 'Material e equipe prontos. Chegou a hora de administrar as medicações.',
        vitals: ['FC 120 bpm', 'PA 118/74 mmHg', 'SpO2 94% pré-oxigenado'],
        monitor: { type: 'none' },
        question: 'Qual a sequência correta de medicações na indução?',
        choices: [
          {
            id: 'a',
            label: 'Analgésico (ex: fentanil), aguardar o início de ação, depois hipnótico (ex: etomidato/ketamina) e só então o bloqueador neuromuscular',
            quality: 'strong',
            feedback:
              'Correto. A sequência lógica é analgesia, depois sedação/hipnose e só então o bloqueio neuromuscular — sempre aguardando o início de ação de cada medicação antes da próxima.',
            nextStateLabel: 'Indução adequada',
            nextStateText: 'Paciente adequadamente analgesiado, sedado e bloqueado antes da laringoscopia.',
          },
          {
            id: 'b',
            label: 'Bloqueador neuromuscular primeiro, para facilitar a laringoscopia mais rápido',
            quality: 'review',
            feedback:
              'Incorreto e grave. Bloquear antes de sedar deixa o paciente consciente e paralisado, sem conseguir se mover ou respirar — um erro grave de sequência.',
            nextStateLabel: 'Erro grave de sequência',
            nextStateText: 'O paciente fica paralisado e consciente, uma situação extremamente angustiante e perigosa.',
          },
          {
            id: 'c',
            label: 'Usar apenas o bloqueador neuromuscular, sem analgesia ou sedação',
            quality: 'review',
            feedback:
              'Incorreto. Mesmo que o paciente pareça "não vá lembrar", a intubação gera dor e estímulo simpático — analgesia e sedação são obrigatórias antes do bloqueio.',
            nextStateLabel: 'Conduta inadequada',
            nextStateText: 'O paciente é submetido ao procedimento sem analgesia nem sedação.',
          },
          {
            id: 'd',
            label: 'Administrar todas as medicações simultaneamente no mesmo bolus, para agilizar',
            quality: 'review',
            feedback:
              'Incorreto. Cada medicação tem um tempo de início de ação diferente — administrar tudo junto sem aguardar o efeito de cada uma aumenta o risco de uma intubação em paciente inadequadamente sedado.',
            nextStateLabel: 'Risco de sedação insuficiente',
            nextStateText: 'Há risco de o bloqueio neuromuscular agir antes da sedação estar plena.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Falha de Intubação',
        patientType: 'Falha na 1ª laringoscopia',
        vignette: 'A primeira tentativa de laringoscopia falha — via aérea difícil, visualização ruim das cordas vocais.',
        vitals: ['SpO2 91% e caindo', 'Paciente ainda com pulso', 'Sem necessidade de compressões'],
        monitor: { type: 'none' },
        question: 'Qual a conduta correta diante da falha da primeira tentativa?',
        choices: [
          {
            id: 'a',
            label: 'Trocar a técnica/dispositivo para a segunda tentativa, manter a oxigenação entre tentativas e, se necessário, partir para os planos B/C (dispositivo supraglótico/bolsa-válvula-máscara)',
            quality: 'strong',
            feedback:
              'Correto. A segunda tentativa deve ser diferente da primeira (mudando dispositivo, posição ou técnica), mantendo a oxigenação entre elas — no máximo 3 tentativas antes de declarar falha e seguir os planos de resgate.',
            nextStateLabel: 'Segunda tentativa bem-sucedida',
            nextStateText: 'Com a troca de dispositivo, a segunda tentativa tem sucesso e a via aérea é garantida.',
          },
          {
            id: 'b',
            label: 'Repetir exatamente a mesma técnica e posicionamento imediatamente',
            quality: 'review',
            feedback:
              'Incorreto. Repetir a mesma abordagem tende a repetir a mesma falha — a segunda tentativa deve mudar algo (dispositivo, posição, manobra).',
            nextStateLabel: 'Falha repetida',
            nextStateText: 'A segunda tentativa falha também, pelos mesmos motivos da primeira.',
          },
          {
            id: 'c',
            label: 'Tentar a intubação às cegas, sem visualização, para ganhar tempo',
            quality: 'review',
            feedback:
              'Incorreto e perigoso. A intubação às cegas tem alta chance de iatrogenia grave e baixa chance de sucesso — nunca é a conduta recomendada.',
            nextStateLabel: 'Risco de lesão grave',
            nextStateText: 'A tentativa às cegas causa trauma de via aérea sem conseguir intubar.',
          },
          {
            id: 'd',
            label: 'Partir direto para via aérea cirúrgica, sem tentar os planos B/C antes',
            quality: 'partial',
            feedback:
              'A via aérea cirúrgica é o plano D, reservado para quando não se consegue intubar nem ventilar — antes disso, os planos B/C (dispositivo supraglótico, bolsa-válvula-máscara) devem ser tentados.',
            nextStateLabel: 'Conduta precipitada',
            nextStateText: 'O paciente é submetido a um procedimento mais invasivo do que o necessário neste momento.',
          },
        ],
      },
    ],
  },
  {
    id: 'cuidados-pos-pcr-dedicado',
    caseNumber: 8,
    category: 'Cuidados Pós-PCR',
    broadCategory: 'Cuidados Críticos',
    difficulty: 'Avançado',
    title: 'Cuidados Pós-Parada Cardiorrespiratória',
    chiefComplaint: 'Homem, 61 anos, com retorno de circulação espontânea após PCR.',
    durationMin: 10,
    icon: 'heart',
    algorithmPhases: ['Via aérea e ventilação', 'Circulação e hemodinâmica', 'Neurológico e temperatura', 'Metas metabólicas'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Pós-RCE',
        patientType: 'Retorno de circulação espontânea',
        vignette:
          'Homem, 61 anos, retorno de circulação espontânea após 12 minutos de reanimação. Já entubado, a equipe confirma o posicionamento do tubo.',
        vitals: ['FC 94 bpm', 'PA 102/64 mmHg', 'Via aérea avançada instalada'],
        monitor: { type: 'none' },
        question: 'Qual exame confirma mais rapidamente o correto posicionamento do tubo e, de forma indireta, a presença de circulação?',
        choices: [
          {
            id: 'a',
            label: 'Capnografia — a exalação de CO2 confirma a posição traqueal do tubo e, de forma indireta, o débito cardíaco',
            quality: 'strong',
            feedback:
              'Correto. A capnografia é uma ferramenta essencial pós-intubação: a presença de CO2 exalado confirma que o tubo está na via aérea e, quando há retorno de circulação espontânea, esse valor se eleva de forma característica.',
          },
          {
            id: 'b',
            label: 'Radiografia de tórax',
            quality: 'partial',
            feedback:
              'A radiografia é útil para confirmar a posição da ponta da cânula em relação à carina, mas é mais demorada — a confirmação inicial e mais rápida é feita pela capnografia e ausculta.',
          },
          {
            id: 'c',
            label: 'Ausculta pulmonar isolada, sem outros métodos',
            quality: 'partial',
            feedback:
              'A ausculta em 5 pontos faz parte da checagem, mas isoladamente é menos confiável do que associá-la à capnografia, que dá uma confirmação objetiva e contínua.',
          },
          {
            id: 'd',
            label: 'Gasometria arterial',
            quality: 'review',
            feedback:
              'Incorreto para esta finalidade. A gasometria informa sobre trocas gasosas e equilíbrio ácido-base, mas não confirma diretamente o posicionamento do tubo na via aérea.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-RCE',
        patientType: 'Ventilação mecânica pós-PCR',
        vignette: 'Paciente entubado e conectado ao ventilador mecânico. Peso predito calculado: 70 kg.',
        vitals: ['FC 94 bpm', 'PA 102/64 mmHg', 'SpO2 96% em VM', 'Peso predito 70 kg'],
        monitor: { type: 'none' },
        question: 'Qual o volume corrente alvo da ventilação protetora pós-PCR, e quais os demais limites associados?',
        choices: [
          {
            id: 'a',
            label: '6 ml/kg de peso predito, com PEEP de 5-8 cmH2O e pressão de platô ≤ 30 cmH2O',
            quality: 'strong',
            feedback:
              'Correto. A ventilação protetora pós-PCR usa 6 ml/kg de peso predito (calculado pela altura, não pelo peso real), PEEP entre 5-8 cmH2O e pressão de platô limitada a 30 cmH2O.',
            nextStateLabel: 'Ventilação protetora instituída',
            nextStateText: 'Parâmetros ajustados conforme meta, com monitorização contínua da mecânica ventilatória.',
          },
          {
            id: 'b',
            label: '10-12 ml/kg, para garantir expansão pulmonar adequada',
            quality: 'review',
            feedback:
              'Incorreto. Volumes correntes altos (10-12 ml/kg) aumentam o risco de lesão pulmonar induzida pela ventilação — a meta protetora é justamente mais baixa, 6 ml/kg.',
            nextStateLabel: 'Risco de lesão pulmonar',
            nextStateText: 'O volume elevado aumenta o risco de barotrauma e lesão alveolar.',
          },
          {
            id: 'c',
            label: '6 ml/kg de peso real do paciente, independente da altura',
            quality: 'review',
            feedback:
              'Incorreto. O cálculo correto usa o peso predito (calculado pela altura e sexo), não o peso real — em pacientes obesos, por exemplo, isso faz grande diferença no volume calculado.',
            nextStateLabel: 'Cálculo incorreto',
            nextStateText: 'O volume corrente aplicado pode estar bem acima do que seria seguro para este paciente.',
          },
          {
            id: 'd',
            label: '3 ml/kg, para minimizar ao máximo o risco de barotrauma',
            quality: 'review',
            feedback:
              'Incorreto. Um volume tão baixo quanto 3 ml/kg causaria hipoventilação significativa — a meta protetora recomendada é 6 ml/kg, não menos.',
            nextStateLabel: 'Hipoventilação',
            nextStateText: 'O paciente evolui com retenção de CO2 pela ventilação insuficiente.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-RCE',
        patientType: 'Suporte hemodinâmico pós-PCR',
        vignette: 'Nova aferição de pressão mostra queda em relação ao valor inicial pós-RCE.',
        vitals: ['FC 100 bpm', 'PA 82/48 mmHg', 'Pele fria'],
        monitor: { type: 'none' },
        question: 'Quais as metas hemodinâmicas pós-PCR e a conduta diante dessa pressão?',
        choices: [
          {
            id: 'a',
            label: 'Alvo de PAM > 65 mmHg e PAS > 90 mmHg; iniciar cristaloide e, se não houver resposta, associar droga vasoativa',
            quality: 'strong',
            feedback:
              'Correto. As metas pós-PCR são PAS > 90 mmHg e PAM > 65 mmHg — abaixo disso, inicia-se reposição volêmica e, se insuficiente, suporte vasoativo (vasopressor/inotrópico).',
            nextStateLabel: 'Hemodinâmica corrigida',
            nextStateText: 'Após volume, a pressão melhora parcialmente; vasopressor em baixa dose é iniciado para atingir a meta.',
          },
          {
            id: 'b',
            label: 'Aceitar essa pressão como normal no período pós-PCR, sem intervir',
            quality: 'review',
            feedback:
              'Incorreto. A pressão está abaixo da meta (PAS > 90, PAM > 65) — isso exige intervenção ativa, não ser aceito como "esperado".',
            nextStateLabel: 'Hipoperfusão não tratada',
            nextStateText: 'A hipotensão não corrigida compromete a perfusão de órgãos, incluindo o cérebro recém-reanimado.',
          },
          {
            id: 'c',
            label: 'Iniciar vasopressor em dose máxima imediatamente, sem tentar volume antes',
            quality: 'partial',
            feedback:
              'Suporte vasoativo pode ser necessário, mas a sequência recomendada começa com reposição volêmica, reservando o vasopressor para quando o volume não for suficiente — e não em dose máxima de início.',
            nextStateLabel: 'Conduta fora de sequência',
            nextStateText: 'O paciente recebe uma dose de vasopressor maior do que a necessária neste momento.',
          },
          {
            id: 'd',
            label: 'Aguardar 2 horas para reavaliar antes de qualquer conduta',
            quality: 'review',
            feedback:
              'Incorreto. Hipotensão pós-PCR deve ser corrigida prontamente — esperar 2 horas sem intervir coloca a perfusão cerebral e sistêmica em risco.',
            nextStateLabel: 'Atraso perigoso',
            nextStateText: 'A hipoperfusão prolongada pode agravar a lesão neurológica.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-RCE',
        patientType: 'Avaliação neurológica e metabólica',
        vignette: 'Paciente hemodinamicamente mais estável. Avaliação neurológica e exames gerais são revisados.',
        vitals: ['Glasgow 7', 'Temperatura 37,8°C', 'Glicemia 220 mg/dL'],
        monitor: { type: 'none' },
        question: 'Quais as condutas apropriadas neste momento, considerando os achados acima?',
        choices: [
          {
            id: 'a',
            label: 'Iniciar controle direcionado de temperatura (32-36°C por ao menos 24h) e buscar o controle rigoroso da glicemia',
            quality: 'strong',
            feedback:
              'Correto. O controle direcionado de temperatura (entre 32-36°C, por no mínimo 24h) melhora o desfecho neurológico, e o controle glicêmico rigoroso é parte essencial dos cuidados pós-PCR — hiperglicemia está associada a pior prognóstico.',
            nextStateLabel: 'Cuidados neuroprotetores instituídos',
            nextStateText: 'Temperatura-alvo iniciada e insulinoterapia ajustada para controle glicêmico.',
          },
          {
            id: 'b',
            label: 'Permitir a hipertermia atual, já que não há evidência clara de infecção',
            quality: 'review',
            feedback:
              'Incorreto. A hipertermia piora o prognóstico neurológico pós-PCR, independentemente da causa — por isso o controle de temperatura (evitando temperaturas acima do alvo) é recomendado.',
            nextStateLabel: 'Risco neurológico aumentado',
            nextStateText: 'A temperatura elevada pode agravar a lesão cerebral já instalada.',
          },
          {
            id: 'c',
            label: 'Induzir hipotermia profunda, abaixo de 30°C, para proteção cerebral máxima',
            quality: 'review',
            feedback:
              'Incorreto. O alvo do controle direcionado de temperatura é entre 32-36°C — temperaturas abaixo disso aumentam o risco de complicações (arritmias, coagulopatia) sem benefício adicional comprovado.',
            nextStateLabel: 'Hipotermia excessiva',
            nextStateText: 'O paciente desenvolve complicações relacionadas ao resfriamento excessivo.',
          },
          {
            id: 'd',
            label: 'Manter a glicemia elevada propositalmente, para "nutrir" o cérebro',
            quality: 'review',
            feedback:
              'Incorreto. A hiperglicemia está associada a pior prognóstico neurológico pós-PCR — a meta é o controle rigoroso, buscando a normalização, não a manutenção de valores elevados.',
            nextStateLabel: 'Prognóstico comprometido',
            nextStateText: 'A hiperglicemia mantida pode contribuir para maior lesão neurológica secundária.',
          },
        ],
      },
    ],
  },
  {
    id: 'abordagem-paciente-grave-geral',
    caseNumber: 9,
    category: 'Abordagem ao Paciente Grave',
    broadCategory: 'Emergência Geral',
    difficulty: 'Básico',
    title: 'Reconhecimento Precoce do Paciente Grave',
    chiefComplaint: 'Mulher, 76 anos, internada, enfermagem relata "paciente não está bem".',
    durationMin: 8,
    icon: 'activity',
    algorithmPhases: ['Reconhecimento precoce', 'Avaliação 1ª (ABCD)', 'Estabilização inicial', 'Avaliação 2ª e ciclo DIRECT'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Enfermaria · Paciente Internada',
        patientType: 'Deterioração clínica inicial',
        vignette:
          'Mulher, 76 anos, internada por infecção urinária, em uso de antibiótico. A enfermagem relata que a paciente está mais quieta e com a respiração "diferente" nas últimas horas.',
        vitals: ['FR 28 irpm', 'FC 104 bpm', 'PA 108/70 mmHg', 'SpO2 94%'],
        monitor: { type: 'none' },
        question: 'Qual sinal vital, isoladamente, costuma ser o indicador mais sensível e precoce de doença grave?',
        choices: [
          {
            id: 'a',
            label: 'Frequência respiratória elevada (taquipneia)',
            quality: 'strong',
            feedback:
              'Correto. A taquipneia é descrita como o primeiro indicador mais sensível de doença grave na maioria dos casos — embora pouco específica (pode ter várias causas), raramente está ausente em um paciente realmente grave.',
          },
          {
            id: 'b',
            label: 'Pressão arterial, pois a hipotensão sempre aparece primeiro',
            quality: 'review',
            feedback:
              'Incorreto. A pressão arterial normal não afasta choque circulatório — a hipotensão costuma ser um achado tardio em muitas doenças graves, não o primeiro sinal.',
          },
          {
            id: 'c',
            label: 'Frequência cardíaca, por ser o parâmetro mais específico',
            quality: 'partial',
            feedback:
              'A taquicardia é relevante e costuma acompanhar a gravidade, mas a frequência respiratória é descrita como o indicador isolado mais sensível e precoce, ainda que menos específico.',
          },
          {
            id: 'd',
            label: 'Temperatura corporal',
            quality: 'review',
            feedback:
              'Incorreto. A febre pode estar presente ou ausente em quadros graves e não é apontada como o marcador mais sensível e precoce de gravidade.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Enfermaria · Paciente Internada',
        patientType: 'Avaliação inicial',
        vignette: 'Você é chamado para avaliar a paciente taquipneica.',
        vitals: ['FR 28 irpm', 'FC 104 bpm', 'PA 108/70 mmHg', 'SpO2 94%'],
        monitor: { type: 'none' },
        question: 'Qual a sequência correta da avaliação inicial deste paciente?',
        choices: [
          {
            id: 'a',
            label: 'Avaliação primária pelo ABCD (via aérea, respiração, circulação, nível de consciência), buscando reverter o risco imediato',
            quality: 'strong',
            feedback:
              'Correto. A avaliação primária, rápida e direcionada ao ABCD, vem primeiro — o objetivo é identificar e tratar o risco imediato antes de aprofundar a investigação.',
            nextStateLabel: 'Avaliação primária realizada',
            nextStateText: 'Via aérea pérvia, respiração taquipneica mas sem estridor, circulação com perfusão levemente alterada, consciência preservada.',
          },
          {
            id: 'b',
            label: 'Fazer uma história clínica completa e detalhada antes de qualquer exame físico',
            quality: 'review',
            feedback:
              'Incorreto como primeiro passo. A história detalhada faz parte da avaliação secundária, feita depois de estabilizar o paciente pela avaliação primária — não antes dela.',
            nextStateLabel: 'Avaliação fora de ordem',
            nextStateText: 'Tempo é perdido em uma entrevista longa enquanto a paciente pode estar se deteriorando.',
          },
          {
            id: 'c',
            label: 'Solicitar exames de imagem antes de examinar a paciente',
            quality: 'review',
            feedback:
              'Incorreto. Exames complementares vêm depois da avaliação clínica inicial (ABCD) — pedir imagem sem examinar a paciente primeiro atrasa o reconhecimento de um risco imediato.',
            nextStateLabel: 'Atraso na avaliação',
            nextStateText: 'A paciente aguarda o exame sem ter sido clinicamente avaliada.',
          },
          {
            id: 'd',
            label: 'Aguardar a visita médica de rotina do dia seguinte',
            quality: 'review',
            feedback:
              'Incorreto e perigoso. Uma paciente com sinais de deterioração precisa de avaliação imediata, não pode aguardar a rotina do dia seguinte.',
            nextStateLabel: 'Conduta de risco',
            nextStateText: 'O atraso pode permitir uma piora significativa do quadro.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Enfermaria · Reavaliação',
        patientType: 'Avaliação em curso',
        vignette: 'A pressão arterial está apenas levemente reduzida em relação ao basal da paciente, mas ela ainda está taquipneica e taquicárdica.',
        vitals: ['PA 98/60 mmHg', 'FC 108 bpm', 'FR 26 irpm', 'Pele ainda bem perfundida'],
        monitor: { type: 'none' },
        question: 'Essa pressão arterial levemente reduzida é suficiente para afastar choque circulatório?',
        choices: [
          {
            id: 'a',
            label: 'Não — pressão arterial normal ou pouco alterada não afasta choque circulatório; é um achado que pode aparecer tardiamente em várias doenças graves',
            quality: 'strong',
            feedback:
              'Correto. A pressão arterial pode se manter relativamente preservada por mecanismos compensatórios mesmo com um processo de doença grave já instalado — por isso não se deve usar a PA isoladamente para "descartar" gravidade.',
            nextStateLabel: 'Vigilância mantida',
            nextStateText: 'A equipe mantém reavaliação frequente, sem se tranquilizar apenas pela pressão arterial.',
          },
          {
            id: 'b',
            label: 'Sim, pressão arterial normal sempre afasta choque circulatório',
            quality: 'review',
            feedback:
              'Incorreto. Essa é exatamente a armadilha a evitar — a pressão normal/pouco alterada pode mascarar um choque em fase compensada.',
            nextStateLabel: 'Falsa sensação de segurança',
            nextStateText: 'A equipe relaxa a vigilância, e a paciente pode descompensar sem aviso.',
          },
          {
            id: 'c',
            label: 'Só afasta choque se a frequência cardíaca também estiver normal',
            quality: 'partial',
            feedback:
              'A taquicardia de fato chama atenção para gravidade, mas mesmo com FC e PA pouco alteradas um quadro grave pode estar em curso — nenhum parâmetro isolado "afasta" choque com segurança.',
            nextStateLabel: 'Raciocínio incompleto',
            nextStateText: 'A equipe ainda corre o risco de subestimar a gravidade da paciente.',
          },
          {
            id: 'd',
            label: 'Isso só é válido para pacientes jovens, não para idosos',
            quality: 'review',
            feedback:
              'Incorreto. O princípio de que a PA normal não afasta choque vale para qualquer idade — inclusive idosos podem compensar por mais tempo e depois descompensar abruptamente.',
            nextStateLabel: 'Generalização incorreta',
            nextStateText: 'A equipe aplica um raciocínio equivocado à faixa etária da paciente.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Enfermaria · Ciclo de Cuidado',
        patientType: 'Ciclo contínuo de reavaliação',
        vignette: 'A equipe decide reavaliar a paciente em intervalos curtos, ajustando a conduta conforme a resposta.',
        vitals: ['Reavaliação programada a cada poucos minutos'],
        monitor: { type: 'none' },
        question: 'Qual mnemônico resume o ciclo de cuidado contínuo do paciente grave discutido no curso?',
        choices: [
          {
            id: 'a',
            label: 'DIRECT: Detecção, Intervenção, Reavaliação, Comunicação efetiva, Trabalho em equipe',
            quality: 'strong',
            feedback:
              'Correto. O ciclo DIRECT resume o cuidado contínuo do paciente grave: detectar uma alteração, intervir, reavaliar a resposta, e sustentar tudo isso com comunicação efetiva e trabalho em equipe.',
          },
          {
            id: 'b',
            label: 'ABCDE: Airway, Breathing, Circulation, Disability, Exposure',
            quality: 'partial',
            feedback:
              'O ABCDE é um mnemônico real e fundamental do curso, mas é o roteiro da avaliação primária propriamente dita — não o ciclo contínuo de detecção/intervenção/reavaliação perguntado aqui.',
          },
          {
            id: 'c',
            label: 'SAMPLE: Sintomas, Alergias, Medicações, Passado médico, Última refeição, Eventos',
            quality: 'review',
            feedback:
              'Incorreto para esta pergunta. SAMPLE é um mnemônico de coleta de história clínica, não do ciclo de cuidado contínuo do paciente grave.',
          },
          {
            id: 'd',
            label: 'SBAR: Situação, Background, Avaliação, Recomendação',
            quality: 'review',
            feedback:
              'Incorreto para esta pergunta. SBAR é uma ferramenta de comunicação/passagem de caso (handoff), não o ciclo de cuidado do paciente grave discutido aqui.',
          },
        ],
      },
    ],
  },
  {
    id: 'lideranca-comunicacao-equipe',
    caseNumber: 10,
    category: 'Liderança e Comunicação',
    broadCategory: 'Liderança e Comunicação',
    difficulty: 'Intermediário',
    title: 'Comunicação de Equipe em Emergência',
    chiefComplaint: 'Simulação de atendimento em equipe — foco em comunicação, não em diagnóstico.',
    durationMin: 8,
    icon: 'users',
    algorithmPhases: ['Papéis de equipe', 'Comunicação em alça fechada', 'Manifestação de segurança (call-out)', 'Brief e debrief'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Atendimento em Equipe',
        patientType: 'Cenário de comunicação',
        vignette:
          'Durante uma parada cardiorrespiratória, o líder da equipe pede em voz alta: "alguém prepara adrenalina", sem olhar ou direcionar a ordem a ninguém específico.',
        vitals: ['Equipe com 4 profissionais presentes', 'Nenhum nomeado para a tarefa'],
        monitor: { type: 'none' },
        question: 'Qual o problema de comunicação nesta ordem?',
        choices: [
          {
            id: 'a',
            label: 'Falta de identificação de destinatário — ordens devem ser direcionadas a uma pessoa específica, pelo nome, não "para o ar"',
            quality: 'strong',
            feedback:
              'Correto. Uma das bases da boa comunicação em equipe é direcionar claramente cada pedido a uma pessoa nomeada — sem isso, cada membro pode assumir que "outro vai fazer", e a tarefa acaba não sendo executada ou é duplicada.',
          },
          {
            id: 'b',
            label: 'Não há problema, a equipe toda deve se sentir responsável igualmente',
            quality: 'review',
            feedback:
              'Incorreto. Essa difusão de responsabilidade é justamente o problema — sem um nome definido, a tendência é que ninguém assuma a tarefa com clareza, atrasando o atendimento.',
          },
          {
            id: 'c',
            label: 'O problema é a dose da adrenalina não ter sido especificada',
            quality: 'partial',
            feedback:
              'Especificar a dose também é importante, mas o erro central apontado aqui é a ausência de um destinatário nomeado — sem isso, nem importa se a dose foi dita, porque ninguém sabe que deve executar.',
          },
          {
            id: 'd',
            label: 'O problema é a adrenalina não ser a medicação indicada neste momento',
            quality: 'review',
            feedback:
              'Incorreto e fora do foco da pergunta. A questão não é sobre qual medicação usar, mas sobre como a ordem foi comunicada à equipe.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Comunicação em Alça Fechada',
        patientType: 'Cenário de comunicação',
        vignette: 'O líder corrige a ordem: "Ana, me prepara 1 mg de adrenalina."',
        vitals: ['Ordem agora direcionada e com dose especificada'],
        monitor: { type: 'none' },
        question: 'Como deveria ser a resposta da Ana, segundo o conceito de comunicação em alça fechada (closed-loop)?',
        choices: [
          {
            id: 'a',
            label: '"Preparando 1 mg de adrenalina" e, ao concluir, "Adrenalina 1 mg pronta" — confirmando o recebimento e depois a execução da ordem',
            quality: 'strong',
            feedback:
              'Correto. A comunicação em alça fechada exige que quem recebe a ordem confirme o conteúdo de volta e, ao concluir, informe que a tarefa foi feita — fechando o ciclo de comunicação.',
            nextStateLabel: 'Alça de comunicação fechada',
            nextStateText: 'O líder sabe exatamente quando a adrenalina está pronta, sem precisar perguntar ou supor.',
          },
          {
            id: 'b',
            label: 'Apenas executar a tarefa em silêncio, sem responder nada',
            quality: 'review',
            feedback:
              'Incorreto. Isso quebra o loop de comunicação — ninguém confirma que a mensagem foi recebida nem quando a tarefa foi concluída, o que pode levar a repetições ou atrasos.',
            nextStateLabel: 'Loop de comunicação quebrado',
            nextStateText: 'O líder não sabe se a adrenalina está pronta e pode pedir novamente, gerando confusão.',
          },
          {
            id: 'c',
            label: 'Perguntar "por que precisa disso agora?" antes de agir',
            quality: 'review',
            feedback:
              'Incorreto neste contexto. Diante de uma ordem clara durante uma emergência, questionar o motivo antes de agir atrasa desnecessariamente o atendimento — questionamentos de segurança (call-out) são diferentes disso.',
            nextStateLabel: 'Atraso desnecessário',
            nextStateText: 'A medicação demora mais para ficar pronta por causa do questionamento.',
          },
          {
            id: 'd',
            label: 'Responder apenas "ok", sem repetir o conteúdo da ordem',
            quality: 'partial',
            feedback:
              'Um "ok" confirma que a mensagem foi ouvida, mas não fecha completamente o loop — o ideal é repetir o conteúdo específico da ordem (a medicação e a dose) para garantir que foi entendida corretamente.',
            nextStateLabel: 'Confirmação incompleta',
            nextStateText: 'O líder não tem certeza se Ana entendeu a dose corretamente.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Manifestação de Segurança',
        patientType: 'Cenário de comunicação',
        vignette: 'Um membro mais novo da equipe percebe que a cama está prestes a comprimir o acesso venoso do paciente, mas ele não é o líder da equipe.',
        vitals: ['Risco de perda do acesso venoso identificado'],
        monitor: { type: 'none' },
        question: 'O que ele deve fazer, segundo o conceito de "call-out" (manifestação de segurança)?',
        choices: [
          {
            id: 'a',
            label: 'Manifestar-se imediatamente, de forma clara e sem sarcasmo, independentemente de não ser o líder',
            quality: 'strong',
            feedback:
              'Correto. Qualquer membro da equipe, independente da hierarquia, deve se manifestar diante de um risco de segurança percebido — esse é justamente o conceito de call-out ensinado no módulo de liderança.',
            nextStateLabel: 'Risco evitado',
            nextStateText: 'A equipe reposiciona o paciente a tempo, preservando o acesso venoso.',
          },
          {
            id: 'b',
            label: 'Ficar calado, já que não é sua função dar ordens',
            quality: 'review',
            feedback:
              'Incorreto. Isso contraria diretamente o conceito de call-out — a manifestação de um risco de segurança não depende de ser ou não o líder da equipe.',
            nextStateLabel: 'Risco não comunicado',
            nextStateText: 'O acesso venoso é perdido, atrasando a próxima medicação necessária.',
          },
          {
            id: 'c',
            label: 'Esperar o próximo intervalo de reavaliação de 2 minutos para comentar',
            quality: 'review',
            feedback:
              'Incorreto. Um risco de segurança imediato não deve esperar o próximo intervalo programado de reavaliação — deve ser comunicado assim que percebido.',
            nextStateLabel: 'Atraso desnecessário',
            nextStateText: 'O problema se concretiza antes que seja comunicado.',
          },
          {
            id: 'd',
            label: 'Assumir sozinho a liderança da equipe para resolver o problema',
            quality: 'partial',
            feedback:
              'A atitude de agir diante do risco é correta, mas não é necessário (nem apropriado) assumir a liderança da equipe — basta comunicar o risco claramente para quem está liderando ou para o grupo.',
            nextStateLabel: 'Reação desproporcional',
            nextStateText: 'O problema é resolvido, mas gera confusão sobre quem está de fato liderando a equipe.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Encerramento do Atendimento',
        patientType: 'Cenário de comunicação',
        vignette: 'O atendimento terminou. O paciente foi estabilizado e transferido à UTI.',
        vitals: ['Atendimento concluído', 'Equipe ainda reunida na sala'],
        monitor: { type: 'none' },
        question: 'Qual a conduta recomendada neste momento, segundo o conceito de debrief?',
        choices: [
          {
            id: 'a',
            label: 'Reunir a equipe e perguntar: "como fomos?", "o que foi bom?", "o que podemos melhorar?" — sem buscar culpados',
            quality: 'strong',
            feedback:
              'Correto. O debrief é feito logo após o atendimento, reunindo a equipe em rodadas de perguntas abertas sobre o que funcionou e o que pode melhorar, de forma espontânea e não punitiva.',
            nextStateLabel: 'Debrief realizado',
            nextStateText: 'A equipe identifica pontos de melhoria na comunicação para o próximo atendimento, sem clima de acusação.',
          },
          {
            id: 'b',
            label: 'Encerrar o plantão sem conversa adicional, já que o paciente foi estabilizado',
            quality: 'review',
            feedback:
              'Incorreto. Mesmo com um desfecho bom, pular o debrief faz a equipe perder a oportunidade de identificar e corrigir pequenos problemas de comunicação ou processo para o próximo atendimento.',
            nextStateLabel: 'Oportunidade de aprendizado perdida',
            nextStateText: 'Pequenos problemas de comunicação observados durante o caso não são discutidos nem corrigidos.',
          },
          {
            id: 'c',
            label: 'Reunir a equipe apenas para apontar quem errou durante o atendimento',
            quality: 'review',
            feedback:
              'Incorreto. Isso contraria o espírito do debrief, que é não-punitivo e focado em melhoria coletiva, não em apontar culpados individuais.',
            nextStateLabel: 'Clima de equipe prejudicado',
            nextStateText: 'A equipe fica na defensiva, o que prejudica a comunicação em atendimentos futuros.',
          },
          {
            id: 'd',
            label: 'Fazer o debrief apenas por escrito, sem reunir a equipe pessoalmente',
            quality: 'partial',
            feedback:
              'Documentar o debrief é importante para implementar melhorias, mas o módulo enfatiza reunir a equipe pessoalmente logo após o evento, em rodadas de perguntas — o registro escrito complementa, não substitui, esse momento.',
            nextStateLabel: 'Debrief incompleto',
            nextStateText: 'Alguns pontos importantes discutidos informalmente entre a equipe não chegam a ser registrados.',
          },
        ],
      },
    ],
  },
  {
    id: 'tecnologia-favor-vida-caso',
    caseNumber: 11,
    category: 'Tecnologia em Favor da Vida',
    broadCategory: 'Inovação em Saúde',
    difficulty: 'Básico',
    title: 'Tecnologia e Reconhecimento Precoce',
    chiefComplaint: 'Discussão de caso sobre o uso de tecnologia na reanimação.',
    durationMin: 6,
    icon: 'cpu',
    algorithmPhases: ['Reconhecimento por dispositivos', 'Papel da inteligência artificial', 'Apps de treinamento/atendimento', 'Limites da tecnologia'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Cenário · Uso de Tecnologia',
        patientType: 'Discussão de caso',
        vignette: 'Um paciente usa um smartwatch que detecta uma frequência cardíaca irregular e envia um alerta ao seu celular.',
        vitals: ['Alerta automático recebido', 'Paciente ainda assintomático no momento do alerta'],
        monitor: { type: 'none' },
        question: 'Qual a interpretação correta do papel dessa tecnologia, segundo o curso?',
        choices: [
          {
            id: 'a',
            label: 'Wearables podem detectar alterações precocemente e já salvaram vidas ao gerar alertas (ex.: ECG por smartwatch), mas não substituem a avaliação clínica',
            quality: 'strong',
            feedback:
              'Correto. O curso cita exemplos reais de dispositivos vestíveis (relógios, smartphones) que já ajudaram a salvar vidas ao alertar precocemente para alterações — mas sempre como complemento, não substituto, da avaliação clínica.',
          },
          {
            id: 'b',
            label: 'O alerta do dispositivo já é um diagnóstico definitivo, dispensando avaliação médica',
            quality: 'review',
            feedback:
              'Incorreto. Um alerta de wearable é um indício que deve levar à avaliação clínica — não é, por si só, um diagnóstico definitivo.',
          },
          {
            id: 'c',
            label: 'Esses dispositivos não têm nenhuma utilidade clínica comprovada',
            quality: 'review',
            feedback:
              'Incorreto. O curso cita explicitamente exemplos de vidas salvas por esses dispositivos — não é exagero afirmar que eles já tiveram impacto clínico real.',
          },
          {
            id: 'd',
            label: 'Só são úteis dentro do ambiente hospitalar',
            quality: 'review',
            feedback:
              'Incorreto. O exemplo discutido no curso é justamente de uso extra-hospitalar, no dia a dia da pessoa, antes de qualquer contato com o ambiente hospitalar.',
          },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Cenário · Inteligência Artificial',
        patientType: 'Discussão de caso',
        vignette: 'A equipe discute o uso de inteligência artificial na detecção precoce de parada cardiorrespiratória.',
        vitals: ['Tecnologia em fase de desenvolvimento/implantação parcial'],
        monitor: { type: 'none' },
        question: 'Qual exemplo de uso de inteligência artificial no reconhecimento precoce de parada cardiorrespiratória foi citado no curso?',
        choices: [
          {
            id: 'a',
            label: 'Dispositivos em desenvolvimento (como um assento sanitário inteligente) capazes de ajudar a identificar sinais de parada cardíaca extra-hospitalar',
            quality: 'strong',
            feedback:
              'Correto. O curso cita, como exemplo de ponta, dispositivos como um assento sanitário com sensores em desenvolvimento, capazes de auxiliar na detecção precoce de parada cardíaca fora do ambiente hospitalar.',
            nextStateLabel: 'Conceito reconhecido',
            nextStateText: 'A equipe entende esse tipo de tecnologia como complemento à vigilância humana, não substituto.',
          },
          {
            id: 'b',
            label: 'Substituição total do time de resposta rápida por robôs',
            quality: 'review',
            feedback:
              'Incorreto. Essa não é a proposta discutida no curso — a tecnologia complementa a detecção precoce, mas o atendimento continua sendo feito por uma equipe humana treinada.',
            nextStateLabel: 'Interpretação equivocada',
            nextStateText: 'Essa visão não corresponde ao que foi ensinado sobre o papel da tecnologia.',
          },
          {
            id: 'c',
            label: 'Previsão de parada cardíaca com 100% de certeza, eliminando a necessidade de monitorização',
            quality: 'review',
            feedback:
              'Incorreto. Nenhuma tecnologia discutida no curso promete certeza absoluta — o papel dela é ajudar na detecção precoce, não eliminar a necessidade de monitorização e avaliação contínua.',
            nextStateLabel: 'Expectativa irreal',
            nextStateText: 'Essa afirmação superestima o que a tecnologia atual é capaz de garantir.',
          },
          {
            id: 'd',
            label: 'Uso exclusivo em pesquisa, sem qualquer aplicação real ainda',
            quality: 'partial',
            feedback:
              'Esses dispositivos específicos ainda estão em desenvolvimento, mas o curso já cita outras tecnologias (wearables, apps) em uso real — não é correto dizer que toda a tecnologia de reconhecimento precoce está restrita à pesquisa.',
            nextStateLabel: 'Visão parcialmente desatualizada',
            nextStateText: 'A equipe subestima o quanto dessa tecnologia já está em uso real, mesmo que parcial.',
          },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Cenário · Aplicativos de Atendimento',
        patientType: 'Discussão de caso',
        vignette: 'A equipe avalia adotar um aplicativo de apoio durante os atendimentos de parada cardiorrespiratória.',
        vitals: ['Aplicativo disponível para uso em tablets/celulares da equipe'],
        monitor: { type: 'none' },
        question: 'Como os aplicativos de treinamento/atendimento (apps) foram descritos como úteis durante uma parada cardiorrespiratória real?',
        choices: [
          {
            id: 'a',
            label: 'Podem ajudar a marcar o tempo, registrar intervenções, desfibrilações e medicações, gerando um relatório ao final do atendimento',
            quality: 'strong',
            feedback:
              'Correto. O curso descreve aplicativos que auxiliam durante o próprio atendimento, cronometrando intervenções e gerando um relatório completo ao final — além de servirem para treinamento teórico.',
            nextStateLabel: 'Uso apropriado da ferramenta',
            nextStateText: 'A equipe passa a usar o app como apoio à organização do atendimento, sem substituir o julgamento clínico.',
          },
          {
            id: 'b',
            label: 'Servem apenas para estudo teórico, sem qualquer uso durante o atendimento real',
            quality: 'review',
            feedback:
              'Incorreto. O curso descreve explicitamente o uso desses aplicativos também durante o atendimento real, não apenas no estudo teórico.',
            nextStateLabel: 'Subutilização da ferramenta',
            nextStateText: 'A equipe deixa de aproveitar um recurso que poderia ajudar durante o próprio atendimento.',
          },
          {
            id: 'c',
            label: 'Substituem a necessidade de um líder de equipe durante a parada',
            quality: 'review',
            feedback:
              'Incorreto. Nenhum aplicativo substitui a liderança e a coordenação humana da equipe — ele apoia o registro e a organização, não a tomada de decisão clínica em si.',
            nextStateLabel: 'Papel da liderança subestimado',
            nextStateText: 'Essa interpretação contraria o que o curso ensina sobre liderança de equipe.',
          },
          {
            id: 'd',
            label: 'Só funcionam dentro de hospitais com wi-fi, sendo inúteis em via pública',
            quality: 'review',
            feedback:
              'Incorreto. Essa limitação específica não é discutida no curso como um problema central desses aplicativos.',
            nextStateLabel: 'Limitação não fundamentada',
            nextStateText: 'Essa afirmação não corresponde ao que foi apresentado no módulo.',
          },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Cenário · Limites da Tecnologia',
        patientType: 'Discussão de caso',
        vignette: 'Ao final da discussão, a equipe reflete sobre até onde a tecnologia deve influenciar a prática de reanimação.',
        vitals: ['Discussão de encerramento do módulo'],
        monitor: { type: 'none' },
        question: 'Qual a mensagem central do curso sobre os limites da tecnologia na reanimação?',
        choices: [
          {
            id: 'a',
            label: 'A tecnologia amplia o cuidado (dados, aprendizado, desempenho), mas não substitui o treinamento da equipe nem o julgamento clínico',
            quality: 'strong',
            feedback:
              'Correto. A conclusão do módulo é que a tecnologia terá cada vez mais impacto no desfecho dos pacientes, mas sempre como apoio ao treinamento e ao atendimento humano — não como substituto deles.',
          },
          {
            id: 'b',
            label: 'A tecnologia deve substituir integralmente o treinamento humano em RCP',
            quality: 'review',
            feedback:
              'Incorreto. Essa conclusão contraria diretamente a mensagem do módulo, que reforça a tecnologia como apoio ao treinamento, não substituto dele.',
          },
          {
            id: 'c',
            label: 'A tecnologia não trará nenhum impacto relevante no desfecho dos pacientes',
            quality: 'review',
            feedback:
              'Incorreto. O módulo afirma o oposto: que a tecnologia certamente terá impacto no desfecho dos pacientes, tanto no aprendizado quanto no atendimento.',
          },
          {
            id: 'd',
            label: 'Apenas hospitais de grande porte devem investir em tecnologia de reanimação',
            quality: 'review',
            feedback:
              'Incorreto. Essa não é uma conclusão discutida no módulo — os exemplos citados (wearables, apps) são, inclusive, acessíveis fora de grandes centros hospitalares.',
          },
        ],
      },
    ],
  },
]

export function getCaseById(id: string) {
  return cases.find((c) => c.id === id)
}

export const extraCases: ClinicalCase[] = [
  {
    id: 'bav-primeiro-grau',
    caseNumber: 12,
    category: 'Bradiarritmias',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Básico',
    title: 'BAV de 1º Grau',
    chiefComplaint: 'Homem, 70 anos, check-up de rotina, assintomático.',
    durationMin: 8,
    icon: 'heart',
    algorithmPhases: ['Identificar ritmo', 'Avaliar sintomas', 'Investigar causa', 'Conduta'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Ambulatório · Check-up',
        patientType: 'Achado incidental',
        vignette: 'Homem, 70 anos, em check-up de rotina, assintomático. ECG de rotina mostra o traçado abaixo.',
        vitals: ['FC 62 bpm', 'PA 128/78 mmHg', 'Assintomático'],
        monitor: { type: 'ecg', rhythmKey: 'bav-1' },
        question: 'Qual a leitura correta deste traçado?',
        choices: [
          { id: 'a', label: 'BAV de 1º grau: intervalo PR constante, porém alargado (> 0,2s); toda onda P conduz um QRS', quality: 'strong', feedback: 'Correto. No BAV de 1º grau, cada onda P é seguida de QRS, mas o intervalo PR está cronicamente alargado.' },
          { id: 'b', label: 'Bradicardia sinusal simples', quality: 'partial', feedback: 'Na bradicardia sinusal o PR costuma ser normal — aqui o achado central é o PR alargado, não apenas a frequência baixa.' },
          { id: 'c', label: 'BAV de 2º grau Mobitz I', quality: 'review', feedback: 'Incorreto. No Mobitz I o PR se alonga progressivamente até uma onda P não conduzir — aqui o PR é constante, apenas alargado, e toda P conduz.' },
          { id: 'd', label: 'BAV total', quality: 'review', feedback: 'Incorreto. No BAV total há dissociação completa entre P e QRS — aqui toda onda P conduz normalmente, só que atrasada.' },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Ambulatório · Check-up',
        patientType: 'BAV de 1º grau assintomático',
        vignette: 'Paciente permanece assintomático, sem síncope ou tontura.',
        vitals: ['FC 62 bpm', 'PA 128/78 mmHg'],
        monitor: { type: 'ecg', rhythmKey: 'bav-1' },
        question: 'Qual a conduta diante de um BAV de 1º grau assintomático?',
        choices: [
          { id: 'a', label: 'Investigar possíveis causas (medicações, isquemia) e, se assintomático e sem progressão, apenas acompanhar', quality: 'strong', feedback: 'Correto. BAV de 1º grau isolado e assintomático geralmente não exige intervenção imediata — apenas investigação da causa e acompanhamento.', nextStateLabel: 'Investigação iniciada', nextStateText: 'Revisão de medicações em uso é iniciada; paciente segue em acompanhamento ambulatorial.' },
          { id: 'b', label: 'Implantar marcapasso definitivo imediatamente', quality: 'review', feedback: 'Incorreto. BAV de 1º grau isolado assintomático raramente é indicação de marcapasso definitivo.', nextStateLabel: 'Conduta desproporcional', nextStateText: 'O paciente é exposto a um procedimento invasivo sem indicação clara.' },
          { id: 'c', label: 'Atropina em bolus imediatamente', quality: 'review', feedback: 'Incorreto. Atropina é reservada para bradicardia sintomática instável — não é o caso de um achado assintomático e estável.', nextStateLabel: 'Medicação desnecessária', nextStateText: 'O paciente recebe uma medicação sem indicação para o quadro.' },
          { id: 'd', label: 'Suspender toda a medicação do paciente sem avaliar individualmente', quality: 'partial', feedback: 'Revisar medicações em uso faz parte da investigação, mas suspender tudo indiscriminadamente, sem avaliar cada uma, não é a conduta correta.', nextStateLabel: 'Conduta imprecisa', nextStateText: 'Medicações importantes podem ser suspensas sem necessidade.' },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Ambulatório · Investigação',
        patientType: 'Investigação de causa',
        vignette: 'Paciente está em uso de betabloqueador para controle de hipertensão.',
        vitals: ['FC 62 bpm', 'PA 128/78 mmHg', 'Uso de betabloqueador'],
        monitor: { type: 'ecg', rhythmKey: 'bav-1' },
        question: 'Qual a causa mais importante a investigar neste contexto?',
        choices: [
          { id: 'a', label: 'Causa medicamentosa — betabloqueadores, bloqueadores de canal de cálcio e digital, entre outros, podem prolongar o intervalo PR', quality: 'strong', feedback: 'Correto. Medicações que atuam no nó AV são causas clássicas e comuns de prolongamento do PR, merecendo revisão de dose ou necessidade.', nextStateLabel: 'Causa identificada', nextStateText: 'A equipe revisa a indicação e a dose do betabloqueador em uso.' },
          { id: 'b', label: 'Hipertireoidismo', quality: 'review', feedback: 'Incorreto como explicação principal aqui. Hipertireoidismo tende a cursar com taquiarritmias, não com o prolongamento do PR observado neste caso.', nextStateLabel: 'Hipótese pouco provável', nextStateText: 'A investigação nessa direção não encontra achados compatíveis.' },
          { id: 'c', label: 'Hipercalemia grave', quality: 'review', feedback: 'Incorreto como explicação isolada aqui. Hipercalemia grave costuma se associar a alterações mais amplas (alargamento de QRS, ondas T apiculadas) e quadros mais graves, não a um BAV de 1º grau isolado como achado principal.', nextStateLabel: 'Hipótese pouco provável', nextStateText: 'Os exames não mostram alteração significativa de potássio.' },
          { id: 'd', label: 'Febre alta', quality: 'review', feedback: 'Incorreto. Febre tende a acelerar a frequência cardíaca (taquicardia sinusal), não é uma causa classicamente associada ao BAV de 1º grau.', nextStateLabel: 'Hipótese descartada', nextStateText: 'O paciente não apresenta febre ou sinais infecciosos.' },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Ambulatório · Seguimento',
        patientType: 'Seguimento ambulatorial',
        vignette: 'Betabloqueador mantido em dose ajustada. Paciente segue assintomático.',
        vitals: ['FC 64 bpm', 'PA 126/76 mmHg', 'Assintomático'],
        monitor: { type: 'ecg', rhythmKey: 'bav-1' },
        question: 'Qual o seguimento apropriado para este paciente?',
        choices: [
          { id: 'a', label: 'Reavaliar o ECG periodicamente e orientar sinais de alerta (síncope, tontura importante) para buscar atendimento', quality: 'strong', feedback: 'Correto. O acompanhamento com ECG periódico e orientação sobre sinais de alarme é a conduta apropriada para um BAV de 1º grau estável.' },
          { id: 'b', label: 'Alta sem nenhuma orientação, já que o paciente está assintomático', quality: 'partial', feedback: 'Mesmo assintomático, é importante orientar sinais de alerta antes da alta — não apenas liberar sem informação alguma.' },
          { id: 'c', label: 'Internação hospitalar obrigatória', quality: 'review', feedback: 'Incorreto. BAV de 1º grau isolado e assintomático não exige internação hospitalar.' },
          { id: 'd', label: 'Cardioversão elétrica eletiva', quality: 'review', feedback: 'Incorreto. Cardioversão elétrica não se aplica a bradiarritmias — é um tratamento para taquiarritmias específicas.' },
        ],
      },
    ],
  },
  {
    id: 'ritmo-juncional-caso',
    caseNumber: 13,
    category: 'Bradiarritmias',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Intermediário',
    title: 'Ritmo Juncional',
    chiefComplaint: 'Mulher, 58 anos, tontura leve no pós-operatório.',
    durationMin: 8,
    icon: 'heart',
    algorithmPhases: ['Identificar ritmo', 'Avaliar estabilidade', 'Conduta inicial', 'Resposta ao tratamento'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Enfermaria · Pós-operatório',
        patientType: 'Tontura leve',
        vignette: 'Mulher, 58 anos, no 1º dia pós-operatório de cirurgia abdominal, relata tontura leve ao se levantar. Monitor exibe o traçado abaixo.',
        vitals: ['FC 48 bpm', 'PA 110/70 mmHg', 'Tontura leve'],
        monitor: { type: 'ecg', rhythmKey: 'junctional' },
        question: 'Qual a leitura correta deste traçado?',
        choices: [
          { id: 'a', label: 'Ritmo juncional: QRS estreito e regular, sem onda P identificável antes dele', quality: 'strong', feedback: 'Correto. No ritmo juncional, o nó atrioventricular assume como marca-passo, gerando um QRS estreito e regular sem onda P precedendo-o (ou com P retrógrada, de difícil visualização).' },
          { id: 'b', label: 'Bradicardia sinusal', quality: 'partial', feedback: 'Ambas cursam com frequência baixa, mas na bradicardia sinusal há onda P normal antes de cada QRS — aqui ela está ausente.' },
          { id: 'c', label: 'BAV total', quality: 'review', feedback: 'Incorreto. No BAV total há P e QRS organizados de forma independente (dissociados) — aqui simplesmente não há onda P identificável, não uma dissociação entre dois ritmos organizados.' },
          { id: 'd', label: 'Assistolia', quality: 'review', feedback: 'Incorreto. Há QRS organizado e regular presente no traçado — isso não é uma linha reta sem atividade elétrica.' },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Enfermaria · Pós-operatório',
        patientType: 'Ritmo juncional estável',
        vignette: 'Paciente com ritmo juncional e tontura leve, sem hipotensão franca ou outros sinais de baixo débito.',
        vitals: ['FC 48 bpm', 'PA 110/70 mmHg'],
        monitor: { type: 'ecg', rhythmKey: 'junctional' },
        question: 'Qual a conduta neste momento?',
        choices: [
          { id: 'a', label: 'Monitorizar, investigar a causa (ex.: efeito de medicação, supressão do nó sinusal) e reavaliar sinais de instabilidade', quality: 'strong', feedback: 'Correto. Diante de um ritmo juncional com sintoma leve e sem sinais francos de instabilidade, a conduta é monitorizar, investigar a causa e reavaliar — não intervir agressivamente de imediato.', nextStateLabel: 'Investigação iniciada', nextStateText: 'Revisão das medicações do pós-operatório é iniciada; paciente segue monitorizada.' },
          { id: 'b', label: 'Cardioversão elétrica imediata', quality: 'review', feedback: 'Incorreto. Não há instabilidade grave que justifique cardioversão, que além disso não é o tratamento indicado para bradiarritmias.', nextStateLabel: 'Conduta inadequada', nextStateText: 'Procedimento desnecessário e sem indicação para este ritmo.' },
          { id: 'c', label: 'Atropina profilática mesmo sem sinais de instabilidade', quality: 'partial', feedback: 'Atropina é reservada para bradicardia sintomática instável — neste momento o quadro é leve, sem indicação clara ainda para a medicação.', nextStateLabel: 'Conduta antecipada', nextStateText: 'A medicação é administrada antes de haver indicação clara.' },
          { id: 'd', label: 'Alta imediata sem investigação', quality: 'review', feedback: 'Incorreto. Uma tontura nova associada a um ritmo anormal merece investigação antes de qualquer decisão de alta.', nextStateLabel: 'Investigação pulada', nextStateText: 'A causa da tontura não é esclarecida antes da suposta alta.' },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Enfermaria · Progressão',
        patientType: 'Ritmo juncional instável',
        vignette: 'A tontura piora e a pressão arterial cai.',
        vitals: ['FC 44 bpm', 'PA 84/52 mmHg', 'Tontura importante'],
        monitor: { type: 'ecg', rhythmKey: 'junctional' },
        question: 'Agora com sinais de instabilidade. Qual a conduta de primeira linha?',
        choices: [
          { id: 'a', label: 'Atropina 1 mg IV em bolus, podendo repetir até a dose máxima de 3 mg', quality: 'strong', feedback: 'Correto. Diante de bradicardia (de qualquer origem, incluindo juncional) com sinais de instabilidade, a atropina em bolus é a primeira linha.', nextStateLabel: 'Resposta parcial', nextStateText: 'FC sobe para 56 bpm, mas a pressão ainda está abaixo do esperado.' },
          { id: 'b', label: 'Marcapasso transcutâneo direto, sem tentar atropina antes', quality: 'partial', feedback: 'A atropina deve ser tentada primeiro quando disponível rapidamente — o marcapasso é reservado para falha de resposta ou indisponibilidade da medicação.', nextStateLabel: 'Conduta antecipada', nextStateText: 'O marcapasso é instalado sem que a atropina tenha sido tentada.' },
          { id: 'c', label: 'Observar por mais 30 minutos antes de qualquer conduta', quality: 'review', feedback: 'Incorreto. Sinais de instabilidade (hipotensão, tontura importante) exigem ação imediata, não observação prolongada.', nextStateLabel: 'Atraso perigoso', nextStateText: 'A paciente permanece hipotensa enquanto se aguarda.' },
          { id: 'd', label: 'Betabloqueador IV, para "regularizar" o ritmo', quality: 'review', feedback: 'Incorreto e perigoso. Betabloqueador reduziria ainda mais a frequência cardíaca, piorando a bradicardia e a instabilidade.', nextStateLabel: 'Conduta contraindicada', nextStateText: 'A frequência cardíaca cai ainda mais, agravando o quadro.' },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Enfermaria · Resposta ao tratamento',
        patientType: 'Resposta insuficiente à atropina',
        vignette: 'Após a atropina, a resposta é apenas parcial — a paciente segue sintomática.',
        vitals: ['FC 56 bpm', 'PA 90/58 mmHg'],
        monitor: { type: 'ecg', rhythmKey: 'junctional' },
        question: 'A atropina teve resposta insuficiente. Qual o próximo passo?',
        choices: [
          { id: 'a', label: 'Marcapasso transcutâneo e/ou dopamina/adrenalina em infusão, acionando um especialista', quality: 'strong', feedback: 'Correto. Com resposta insuficiente à atropina, o próximo passo é marcapasso transcutâneo e/ou suporte vasoativo, com avaliação especializada para eventual marcapasso transvenoso.', nextStateLabel: 'Caso estabilizado', nextStateText: 'Com marcapasso, a FC sobe para 72 bpm e a pressão se normaliza.' },
          { id: 'b', label: 'Repetir atropina indefinidamente, além da dose máxima de 3 mg', quality: 'partial', feedback: 'A atropina tem dose máxima de 3 mg — ultrapassar esse limite não traz benefício adicional comprovado; o certo é avançar para as medidas de segunda linha.', nextStateLabel: 'Conduta ultrapassada', nextStateText: 'Doses adicionais de atropina não trazem melhora significativa.' },
          { id: 'c', label: 'Cardioversão elétrica sincronizada', quality: 'review', feedback: 'Incorreto. Cardioversão não se aplica a bradiarritmias — é tratamento para taquiarritmias específicas.', nextStateLabel: 'Conduta inadequada', nextStateText: 'O procedimento não trata a causa da bradicardia.' },
          { id: 'd', label: 'Suspender toda a monitorização, assumindo que a paciente "se adaptou" ao ritmo', quality: 'review', feedback: 'Incorreto e perigoso. A paciente segue sintomática e hipotensa — suspender a monitorização neste momento é um risco grave.', nextStateLabel: 'Risco grave', nextStateText: 'A ausência de monitorização pode atrasar o reconhecimento de uma piora.' },
        ],
      },
    ],
  },
  {
    id: 'torsades-de-pointes',
    caseNumber: 14,
    category: 'Taquicardias',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Avançado',
    title: 'Torsades de Pointes',
    chiefComplaint: 'Mulher, 45 anos, síncope após início de novo antibiótico.',
    durationMin: 10,
    icon: 'zap',
    algorithmPhases: ['Identificar ritmo', 'Estável, instável ou sem pulso', 'Tratamento específico', 'Prevenção de recorrência'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Pós-síncope',
        patientType: 'Síncope recente',
        vignette: 'Mulher, 45 anos, iniciou um novo antibiótico há 2 dias e apresentou um episódio de síncope. Agora consciente, o monitor exibe o traçado abaixo.',
        vitals: ['FC 190 bpm', 'PA 92/58 mmHg', 'Uso recente de novo antibiótico'],
        monitor: { type: 'ecg', rhythmKey: 'torsades' },
        question: 'Qual a leitura correta deste traçado?',
        choices: [
          { id: 'a', label: 'Torsades de Pointes: taquicardia ventricular polimórfica, com QRS de amplitude oscilante "girando" em torno da linha de base', quality: 'strong', feedback: 'Correto. O padrão oscilante característico, com a amplitude do QRS variando como um "fuso", associado ao contexto de uma medicação nova (potencial prolongadora do QT), é clássico de Torsades de Pointes.' },
          { id: 'b', label: 'Taquicardia ventricular monomórfica', quality: 'partial', feedback: 'Na TV monomórfica a morfologia do QRS é uniforme entre os batimentos — aqui a amplitude oscila de forma característica, o que define o padrão polimórfico (Torsades).' },
          { id: 'c', label: 'Fibrilação ventricular', quality: 'review', feedback: 'Incorreto. Na FV não há nenhum padrão organizado — aqui existe um padrão oscilante reconhecível, diferente do caos completo da FV.' },
          { id: 'd', label: 'Flutter atrial', quality: 'review', feedback: 'Incorreto. O flutter atrial tem QRS estreito — este traçado mostra complexos largos, o que já afasta essa hipótese.' },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Com Pulso',
        patientType: 'Torsades com pulso, instável',
        vignette: 'A paciente ainda tem pulso, mas está hipotensa e teve síncope recente.',
        vitals: ['FC 190 bpm', 'PA 78/44 mmHg', 'Síncope recente'],
        monitor: { type: 'ecg', rhythmKey: 'torsades' },
        question: 'Paciente com pulso, mas instável (síncope recente, hipotensão). Qual a conduta?',
        choices: [
          { id: 'a', label: 'Cardioversão/desfibrilação conforme a organização do ritmo, e corrigir a causa (repor magnésio, suspender a droga suspeita)', quality: 'strong', feedback: 'Correto. Diante de instabilidade, a prioridade é a estabilização elétrica, associada à correção da causa — repor magnésio e suspender a medicação suspeita de prolongar o QT.', nextStateLabel: 'Conduta combinada iniciada', nextStateText: 'Choque aplicado e sulfato de magnésio IV iniciado; a medicação suspeita é suspensa.' },
          { id: 'b', label: 'Apenas observar, já que a paciente está consciente agora', quality: 'review', feedback: 'Incorreto. Síncope recente associada a hipotensão com esse ritmo caracteriza instabilidade — isso exige conduta ativa, não apenas observação.', nextStateLabel: 'Risco de deterioração', nextStateText: 'A paciente pode evoluir para perda de pulso enquanto se aguarda.' },
          { id: 'c', label: 'Betabloqueador IV para controle de frequência', quality: 'review', feedback: 'Incorreto. O tratamento de Torsades está ligado à correção do QT longo (magnésio, suspensão da causa), não ao controle de frequência com betabloqueador.', nextStateLabel: 'Conduta não específica', nextStateText: 'A arritmia não é tratada de forma direcionada à sua causa.' },
          { id: 'd', label: 'Aguardar o resultado de eletrólitos antes de qualquer conduta', quality: 'partial', feedback: 'Investigar eletrólitos é importante, mas não se deve atrasar a estabilização elétrica e o magnésio empírico esperando o resultado — ambos podem ocorrer em paralelo.', nextStateLabel: 'Atraso evitável', nextStateText: 'O tratamento é postergado sem necessidade.' },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Sem Pulso',
        patientType: 'Torsades sem pulso',
        vignette: 'A paciente evolui e perde o pulso, mantendo o mesmo padrão no monitor.',
        vitals: ['Sem pulso palpável', 'Mesmo traçado no monitor'],
        monitor: { type: 'ecg', rhythmKey: 'torsades' },
        question: 'A paciente perde o pulso. Qual a conduta?',
        choices: [
          { id: 'a', label: 'Tratar como ritmo chocável: RCP + desfibrilação imediata (carga máxima), sem sincronização', quality: 'strong', feedback: 'Correto. Sem pulso, a Torsades/TV polimórfica é tratada como ritmo chocável dentro do algoritmo de PCR — desfibrilação assíncrona, não cardioversão sincronizada.', nextStateLabel: 'Desfibrilação aplicada', nextStateText: 'Choque aplicado, RCP retomada imediatamente; magnésio mantido na sequência do atendimento.' },
          { id: 'b', label: 'Cardioversão sincronizada, já que é uma taquicardia', quality: 'review', feedback: 'Incorreto. Sem pulso, o tratamento segue o algoritmo de PCR com desfibrilação assíncrona — tentar sincronizar pode até impedir a liberação do choque, por não haver um QRS estável para sincronizar.', nextStateLabel: 'Risco de choque não liberado', nextStateText: 'O aparelho pode não disparar corretamente em modo sincronizado neste contexto.' },
          { id: 'c', label: 'Aguardar 2 minutos antes de agir, já que a paciente tinha pulso há pouco', quality: 'review', feedback: 'Incorreto. A perda de pulso exige ação imediata (RCP + desfibrilação), não espera.', nextStateLabel: 'Atraso perigoso', nextStateText: 'O tempo sem RCP compromete a perfusão cerebral e coronariana.' },
          { id: 'd', label: 'Apenas sulfato de magnésio IV, sem desfibrilar', quality: 'partial', feedback: 'O magnésio é parte do tratamento específico da Torsades, mas diante de ausência de pulso a prioridade imediata é desfibrilar — o magnésio continua sendo administrado em paralelo/na sequência.', nextStateLabel: 'Prioridade invertida', nextStateText: 'O ritmo chocável permanece sem o tratamento elétrico prioritário.' },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-RCE',
        patientType: 'Prevenção de recorrência',
        vignette: 'Após desfibrilação e RCP, há retorno de circulação espontânea.',
        vitals: ['FC 92 bpm', 'PA 108/66 mmHg', 'Retorno de circulação espontânea'],
        monitor: { type: 'ecg', rhythmKey: 'normal-sinus' },
        question: 'Com retorno de circulação, qual a medida específica para prevenir a recorrência da Torsades?',
        choices: [
          { id: 'a', label: 'Administrar sulfato de magnésio IV, corrigir distúrbios eletrolíticos (potássio, magnésio) e suspender definitivamente a medicação que prolonga o QT', quality: 'strong', feedback: 'Correto. A prevenção de recorrência da Torsades de Pointes depende diretamente da reposição de magnésio, correção de eletrólitos e remoção da causa (neste caso, a medicação suspeita).', nextStateLabel: 'Causa tratada', nextStateText: 'A medicação suspeita é formalmente suspensa e substituída por alternativa sem efeito sobre o QT.' },
          { id: 'b', label: 'Apenas observação, sem nenhuma medida específica', quality: 'partial', feedback: 'Há medidas específicas e bem definidas (magnésio, correção eletrolítica, suspensão da causa) que devem ser tomadas ativamente, não apenas observação.', nextStateLabel: 'Prevenção incompleta', nextStateText: 'O risco de recorrência permanece sem a correção adequada.' },
          { id: 'c', label: 'Amiodarona em dose plena, como em outras taquicardias ventriculares', quality: 'review', feedback: 'Incorreto. A amiodarona pode prolongar ainda mais o intervalo QT e piorar a Torsades — não é a primeira escolha aqui, diferente de outras TVs.', nextStateLabel: 'Risco de piora', nextStateText: 'O QT pode se prolongar ainda mais, aumentando o risco de recorrência.' },
          { id: 'd', label: 'Reiniciar a medicação suspeita em dose menor, para não perder o efeito terapêutico', quality: 'review', feedback: 'Incorreto e perigoso. A droga suspeita de prolongar o QT deve ser suspensa definitivamente neste contexto, não reintroduzida em dose menor.', nextStateLabel: 'Conduta de alto risco', nextStateText: 'A reintrodução da droga expõe a paciente a um novo episódio de Torsades.' },
        ],
      },
    ],
  },
  {
    id: 'assistolia-caso',
    caseNumber: 15,
    category: 'Suporte Básico de Vida',
    broadCategory: 'Suporte Básico de Vida',
    difficulty: 'Intermediário',
    title: 'Assistolia',
    chiefComplaint: 'Homem, 80 anos, encontrado em parada cardiorrespiratória em casa.',
    durationMin: 10,
    icon: 'wind',
    algorithmPhases: ['Identificar ritmo', 'Confirmar antes de assumir', 'RCP + adrenalina', 'Causas reversíveis (5H/5T)'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Pós-SAMU',
        patientType: 'Parada cardiorrespiratória',
        vignette: 'Homem, 80 anos, encontrado em PCR em casa. RCP em andamento. O monitor exibe o traçado abaixo.',
        vitals: ['Compressões em andamento', 'Sem pulso palpável'],
        monitor: { type: 'ecg', rhythmKey: 'asystole' },
        question: 'Qual a leitura correta deste traçado?',
        choices: [
          { id: 'a', label: 'Assistolia: linha praticamente reta, sem atividade elétrica organizada', quality: 'strong', feedback: 'Correto, com uma ressalva importante: antes de assumir definitivamente a assistolia, deve-se confirmar cabos, ganho do monitor e uma segunda derivação — é o chamado "protocolo da linha reta".' },
          { id: 'b', label: 'Fibrilação ventricular fina', quality: 'review', feedback: 'Mesmo a FV fina costuma mostrar alguma ondulação visível — aqui a linha é essencialmente reta. Ainda assim, por serem difíceis de diferenciar em alguns casos, sempre vale confirmar com o protocolo da linha reta antes de concluir.' },
          { id: 'c', label: 'Desconexão de um eletrodo, sem significado de ritmo', quality: 'partial', feedback: 'É sempre importante checar as conexões — mas a conduta correta diante desse traçado é confirmar tecnicamente (cabos, ganho, outra derivação) antes de simplesmente assumir essa explicação e seguir sem verificar.' },
          { id: 'd', label: 'Atividade elétrica sem pulso (AESP)', quality: 'review', feedback: 'Incorreto. Na AESP o traçado mostra atividade elétrica organizada — aqui não há organização alguma, é uma linha praticamente reta.' },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Confirmação do Ritmo',
        patientType: 'Suspeita de assistolia',
        vignette: 'Antes de declarar o ritmo e seguir o algoritmo, a equipe precisa confirmar o achado.',
        vitals: ['Compressões em andamento', 'Traçado suspeito de assistolia'],
        monitor: { type: 'ecg', rhythmKey: 'asystole' },
        question: 'O que deve ser verificado antes de declarar assistolia (protocolo da linha reta)?',
        choices: [
          { id: 'a', label: 'Checar os cabos e conexões, aumentar o ganho do monitor e confirmar o traçado em uma segunda derivação', quality: 'strong', feedback: 'Correto. O protocolo da linha reta existe justamente para não confundir um problema técnico (cabo solto, ganho baixo) com uma verdadeira assistolia.', nextStateLabel: 'Assistolia confirmada', nextStateText: 'Cabos e ganho conferidos, segunda derivação confirma o traçado — assistolia real confirmada.' },
          { id: 'b', label: 'Aplicar um choque imediatamente, por segurança', quality: 'review', feedback: 'Incorreto. Assistolia é ritmo não chocável — desfibrilar não traz benefício e só atrasa RCP e adrenalina.', nextStateLabel: 'Choque sem indicação', nextStateText: 'Tempo é perdido em uma conduta sem respaldo para este ritmo.' },
          { id: 'c', label: 'Assumir óbito sem mais verificações', quality: 'review', feedback: 'Incorreto. Antes de qualquer conclusão, é preciso confirmar tecnicamente que o traçado não reflete um problema de conexão ou ganho do monitor.', nextStateLabel: 'Conclusão precipitada', nextStateText: 'Uma possível causa técnica para o traçado não é investigada.' },
          { id: 'd', label: 'Apenas continuar comprimindo, sem checar nada no monitor', quality: 'partial', feedback: 'Continuar as compressões é essencial, mas a checagem rápida de cabos e ganho (protocolo da linha reta) deve ser feita em paralelo, sem interromper a RCP.', nextStateLabel: 'Checagem pulada', nextStateText: 'A equipe segue sem confirmar se o traçado reflete realmente assistolia.' },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Assistolia Confirmada',
        patientType: 'Assistolia confirmada',
        vignette: 'Após checagem técnica, a assistolia é confirmada em uma segunda derivação.',
        vitals: ['Assistolia confirmada', 'RCP em andamento'],
        monitor: { type: 'ecg', rhythmKey: 'asystole' },
        question: 'Confirmada a assistolia. Qual a conduta conforme o algoritmo?',
        choices: [
          { id: 'a', label: 'RCP de alta qualidade contínua e adrenalina 1 mg IV a cada 3-5 minutos; não desfibrilar', quality: 'strong', feedback: 'Correto. Assistolia segue o algoritmo de ritmo não chocável: RCP contínua de alta qualidade e adrenalina a cada 3-5 minutos, sem desfibrilação.', nextStateLabel: 'Algoritmo não chocável em curso', nextStateText: 'RCP mantida, adrenalina administrada, equipe investiga causas reversíveis em paralelo.' },
          { id: 'b', label: 'Desfibrilar a cada 2 minutos, como nos ritmos chocáveis', quality: 'review', feedback: 'Incorreto. Assistolia não é ritmo chocável — desfibrilar não tem indicação e não deve ser feito.', nextStateLabel: 'Conduta sem indicação', nextStateText: 'Tempo e energia são gastos em uma conduta sem benefício para este ritmo.' },
          { id: 'c', label: 'Suspender a reanimação imediatamente, já que é assistolia', quality: 'review', feedback: 'Incorreto. Assistolia não significa suspensão automática da RCP — o algoritmo de ritmo não chocável continua normalmente com RCP e adrenalina, investigando causas reversíveis.', nextStateLabel: 'Decisão precipitada', nextStateText: 'A reanimação é interrompida sem seguir o algoritmo completo.' },
          { id: 'd', label: 'Manter apenas RCP, sem administrar nenhuma medicação', quality: 'partial', feedback: 'A adrenalina faz parte do algoritmo de ritmo não chocável e não deve ser omitida — a RCP sozinha, sem a medicação, não segue o protocolo completo.', nextStateLabel: 'Conduta incompleta', nextStateText: 'Falta um componente importante do algoritmo de reanimação.' },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Causas Reversíveis',
        patientType: 'Reanimação em curso',
        vignette: 'A equipe mantém RCP e adrenalina, buscando uma causa para a parada.',
        vitals: ['RCP em curso', 'Adrenalina administrada conforme protocolo'],
        monitor: { type: 'ecg', rhythmKey: 'asystole' },
        question: 'Durante a reanimação, o que deve ser investigado ativamente?',
        choices: [
          { id: 'a', label: 'As causas reversíveis (5H e 5T): hipóxia, hipovolemia, hidrogênio (acidose), hipo/hipercalemia e hipotermia; tensão no tórax (pneumotórax), tamponamento, toxinas, trombose pulmonar e trombose coronariana', quality: 'strong', feedback: 'Correto. Investigar e tratar ativamente as causas reversíveis (5H e 5T) é parte central do algoritmo em qualquer ritmo de parada, incluindo a assistolia.' },
          { id: 'b', label: 'Nenhuma causa específica — assistolia não tem causa reversível a ser investigada', quality: 'review', feedback: 'Incorreto. A busca ativa por causas reversíveis é essencial em qualquer ritmo de parada, inclusive na assistolia.' },
          { id: 'c', label: 'Apenas hipoglicemia', quality: 'partial', feedback: 'A glicemia pode ser relevante no contexto clínico geral, mas a hipoglicemia não está classicamente entre os 5H e 5T investigados especificamente durante a PCR.' },
          { id: 'd', label: 'Apenas o histórico de arritmias prévias do paciente', quality: 'review', feedback: 'Incorreto. O foco durante a reanimação deve ser nas causas reversíveis agudas (5H/5T), não no histórico de arritmias do paciente.' },
        ],
      },
    ],
  },
  {
    id: 'aesp-caso',
    caseNumber: 16,
    category: 'Suporte Básico de Vida',
    broadCategory: 'Suporte Básico de Vida',
    difficulty: 'Avançado',
    title: 'Atividade Elétrica Sem Pulso (AESP)',
    chiefComplaint: 'Mulher, 36 anos, colapso súbito após trauma torácico.',
    durationMin: 10,
    icon: 'wind',
    algorithmPhases: ['Identificar ritmo', 'Confirmar ausência de pulso', 'RCP + adrenalina', 'Causas reversíveis (5H/5T)'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Trauma',
        patientType: 'Colapso pós-trauma',
        vignette: 'Mulher, 36 anos, vítima de trauma torácico, colapsa subitamente. Você checa e não encontra pulso, mas o monitor exibe o traçado abaixo.',
        vitals: ['Sem pulso palpável', 'Trauma torácico recente'],
        monitor: { type: 'ecg', rhythmKey: 'pea' },
        question: 'O monitor mostra um ritmo organizado, mas a paciente está sem pulso palpável. Qual a leitura correta?',
        choices: [
          { id: 'a', label: 'Atividade elétrica sem pulso (AESP): ritmo organizado no monitor, porém sem pulso detectável', quality: 'strong', feedback: 'Correto. A AESP é definida justamente por essa combinação: um ritmo organizado (que poderia até parecer normal) no monitor, mas sem pulso palpável — a armadilha é confiar apenas no monitor sem checar o pulso.' },
          { id: 'b', label: 'Fibrilação ventricular', quality: 'review', feedback: 'Incorreto. O traçado é organizado, não caótico — isso afasta fibrilação ventricular.' },
          { id: 'c', label: 'Assistolia', quality: 'review', feedback: 'Incorreto. Há atividade elétrica organizada claramente visível — isso não é uma linha reta sem atividade.' },
          { id: 'd', label: 'Ritmo sinusal normal, logo não é uma parada cardíaca', quality: 'partial', feedback: 'O traçado pode até parecer um ritmo organizado "normal", mas é a ausência de pulso palpável que define a parada cardíaca neste caso — essa é exatamente a armadilha central da AESP.' },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · AESP Confirmada',
        patientType: 'AESP confirmada',
        vignette: 'Confirmada a AESP após o trauma torácico, sem pulso detectável.',
        vitals: ['Sem pulso', 'Trauma torácico recente', 'RCP iniciada'],
        monitor: { type: 'ecg', rhythmKey: 'pea' },
        question: 'Qual a conduta inicial diante da AESP confirmada?',
        choices: [
          { id: 'a', label: 'RCP de alta qualidade + adrenalina 1 mg a cada 3-5 min; não desfibrilar; investigar imediatamente causas reversíveis ligadas ao trauma', quality: 'strong', feedback: 'Correto. AESP é ritmo não chocável — RCP e adrenalina seguem o algoritmo padrão, e no contexto de trauma a busca por causas reversíveis específicas (pneumotórax, tamponamento, hipovolemia) deve começar imediatamente.', nextStateLabel: 'Investigação de causa iniciada', nextStateText: 'Exame físico direcionado busca sinais de pneumotórax hipertensivo ou tamponamento cardíaco.' },
          { id: 'b', label: 'Desfibrilar imediatamente', quality: 'review', feedback: 'Incorreto. AESP não é ritmo chocável — desfibrilar não traz benefício aqui.', nextStateLabel: 'Conduta sem indicação', nextStateText: 'Tempo é perdido em uma conduta sem respaldo para este ritmo.' },
          { id: 'c', label: 'Aguardar a próxima checagem de ritmo em 2 minutos antes de agir', quality: 'review', feedback: 'Incorreto. RCP e adrenalina devem ser iniciadas imediatamente ao reconhecer o ritmo não chocável — não se espera o próximo ciclo para começar.', nextStateLabel: 'Atraso desnecessário', nextStateText: 'O início do tratamento é postergado sem necessidade.' },
          { id: 'd', label: 'RCP isolada, sem pensar na causa do trauma agora', quality: 'partial', feedback: 'No contexto de trauma torácico, pensar imediatamente em causas específicas (pneumotórax hipertensivo, tamponamento) é essencial — não deve ficar para depois da RCP inicial.', nextStateLabel: 'Investigação adiada', nextStateText: 'Uma causa potencialmente reversível e rapidamente tratável não é buscada a tempo.' },
          ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Causa Específica',
        patientType: 'Exame direcionado ao trauma',
        vignette: 'O exame físico mostra murmúrio vesicular assimétrico e distensão das veias jugulares.',
        vitals: ['Murmúrio vesicular assimétrico', 'Distensão venosa jugular', 'RCP em andamento'],
        monitor: { type: 'ecg', rhythmKey: 'pea' },
        question: 'O exame sugere uma causa específica. Qual a conduta mais indicada?',
        choices: [
          { id: 'a', label: 'Suspeitar de pneumotórax hipertensivo e realizar a descompressão torácica (punção/drenagem) imediatamente', quality: 'strong', feedback: 'Correto. Assimetria no murmúrio vesicular associada à distensão jugular, no contexto de trauma torácico, é um quadro clássico de pneumotórax hipertensivo — a descompressão não deve esperar.', nextStateLabel: 'Descompressão realizada', nextStateText: 'Após a descompressão, há melhora dos parâmetros hemodinâmicos.' },
          { id: 'b', label: 'Administrar grande volume de cristaloide como única medida', quality: 'partial', feedback: 'Reposição volêmica pode ajudar em causas hipovolêmicas, mas os achados aqui (distensão jugular, assimetria torácica) apontam mais diretamente para pneumotórax hipertensivo, que exige descompressão, não apenas volume.', nextStateLabel: 'Conduta incompleta', nextStateText: 'O volume é administrado, mas a causa mecânica do pneumotórax não é tratada.' },
          { id: 'c', label: 'Aguardar radiografia de tórax antes de qualquer intervenção', quality: 'review', feedback: 'Incorreto. Pneumotórax hipertensivo é um diagnóstico clínico — a descompressão não deve esperar a confirmação por imagem.', nextStateLabel: 'Atraso perigoso', nextStateText: 'O tempo de espera pela imagem pode ser fatal neste cenário.' },
          { id: 'd', label: 'Realizar pericardiocentese empírica, mesmo sem sinais de tamponamento', quality: 'review', feedback: 'Incorreto. Os achados descritos (assimetria torácica, murmúrio vesicular alterado) apontam mais para pneumotórax do que para tamponamento cardíaco (que cursaria mais classicamente com bulhas abafadas e pulso paradoxal).', nextStateLabel: 'Procedimento equivocado', nextStateText: 'A causa real (pneumotórax) não é tratada a tempo.' },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Pós-Descompressão',
        patientType: 'Resposta à descompressão',
        vignette: 'Após a descompressão torácica, há melhora dos parâmetros da paciente.',
        vitals: ['Pulso retornando', 'PA em melhora progressiva'],
        monitor: { type: 'ecg', rhythmKey: 'normal-sinus' },
        question: 'Após a melhora com a descompressão, qual o próximo passo?',
        choices: [
          { id: 'a', label: 'Reavaliar pulso e ritmo; se houver retorno de circulação, iniciar os cuidados pós-PCR e manter monitorização contínua', quality: 'strong', feedback: 'Correto. Após qualquer intervenção durante a reanimação, é essencial reavaliar pulso e ritmo — confirmado o retorno de circulação, seguem-se os cuidados pós-PCR com monitorização contínua.' },
          { id: 'b', label: 'Interromper toda a monitorização, já que houve melhora', quality: 'review', feedback: 'Incorreto. Mesmo com melhora, uma paciente pós-PCR por trauma precisa de monitorização contínua e cuidados pós-PCR estruturados.' },
          { id: 'c', label: 'Repetir a descompressão do mesmo lado imediatamente, por precaução', quality: 'review', feedback: 'Incorreto. Repetir um procedimento invasivo sem necessidade clínica clara não é indicado.' },
          { id: 'd', label: 'Transferir a paciente sem reavaliar pulso ou ritmo', quality: 'partial', feedback: 'Antes de qualquer transferência, reavaliar pulso e ritmo é essencial para confirmar formalmente o retorno de circulação espontânea.' },
        ],
      },
    ],
  },
  {
    id: 'taquicardia-sinusal-caso',
    caseNumber: 17,
    category: 'Taquicardias',
    broadCategory: 'Emergência Cardiovascular',
    difficulty: 'Básico',
    title: 'Taquicardia Sinusal',
    chiefComplaint: 'Homem, 29 anos, febre e taquicardia.',
    durationMin: 8,
    icon: 'activity',
    algorithmPhases: ['Identificar ritmo', 'Diferenciar de outras taquicardias', 'Tratar a causa', 'Reavaliação'],
    steps: [
      {
        id: 'passo-0',
        kind: 'identify',
        patientKicker: 'Sala de Emergência · Febre',
        patientType: 'Febre e taquicardia',
        vignette: 'Homem, 29 anos, com febre há 1 dia, taquicárdico ao exame. O monitor exibe o traçado abaixo.',
        vitals: ['FC 118 bpm', 'PA 110/70 mmHg', 'Temperatura 39°C'],
        monitor: { type: 'ecg', rhythmKey: 'sinus-tachy' },
        question: 'Qual a leitura correta deste traçado?',
        choices: [
          { id: 'a', label: 'Taquicardia sinusal: onda P normal antes de cada QRS, frequência acima de 100 bpm', quality: 'strong', feedback: 'Correto. A presença de onda P normal precedendo cada QRS, com frequência elevada, é característica da taquicardia sinusal — geralmente uma resposta fisiológica a alguma causa.' },
          { id: 'b', label: 'Flutter atrial', quality: 'review', feedback: 'Incorreto. No flutter há ondas F em "dente de serra" e ausência de onda P normal — aqui a onda P está presente e com morfologia normal.' },
          { id: 'c', label: 'Taquicardia supraventricular por reentrada', quality: 'review', feedback: 'Incorreto. Na TSV por reentrada a onda P geralmente não é identificável e a frequência costuma ser ainda mais alta e de início abrupto — aqui a onda P está clara e a frequência é compatível com taquicardia sinusal.' },
          { id: 'd', label: 'Fibrilação atrial', quality: 'review', feedback: 'Incorreto. A fibrilação atrial tem intervalos R-R irregulares e ausência de onda P organizada — aqui o ritmo é regular, com onda P presente.' },
        ],
      },
      {
        id: 'passo-1',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Febre',
        patientType: 'Taquicardia sinusal',
        vignette: 'Paciente taquipneico leve, com febre de 39°C.',
        vitals: ['FC 118 bpm', 'PA 110/70 mmHg', 'Temperatura 39°C'],
        monitor: { type: 'ecg', rhythmKey: 'sinus-tachy' },
        question: 'Qual a conduta correta diante dessa taquicardia?',
        choices: [
          { id: 'a', label: 'Tratar a causa de base (ex.: a febre/possível infecção) — a taquicardia sinusal é uma resposta fisiológica, não a doença em si', quality: 'strong', feedback: 'Correto. A taquicardia sinusal reflete uma resposta do organismo a uma causa (aqui, provavelmente febre/infecção) — o tratamento é direcionado à causa, não ao ritmo em si.', nextStateLabel: 'Causa de base sendo tratada', nextStateText: 'Antitérmico e hidratação são iniciados; investigação do foco infeccioso é iniciada.' },
          { id: 'b', label: 'Cardioversão elétrica', quality: 'review', feedback: 'Incorreto. Taquicardia sinusal nunca é cardiovertida — ela é uma resposta a uma causa, não uma arritmia primária a ser corrigida eletricamente.', nextStateLabel: 'Conduta inadequada', nextStateText: 'Procedimento desnecessário e sem indicação para este ritmo.' },
          { id: 'c', label: 'Adenosina IV', quality: 'review', feedback: 'Incorreto. Adenosina é usada em taquicardia supraventricular por reentrada — não está indicada para taquicardia sinusal.', nextStateLabel: 'Medicação sem indicação', nextStateText: 'A frequência pode cair momentaneamente, mas a causa de base não é tratada.' },
          { id: 'd', label: 'Betabloqueador para "normalizar" a frequência cardíaca', quality: 'partial', feedback: 'Tratar apenas a frequência, sem tratar a causa de base (febre/infecção), não resolve o problema e pode até mascarar sinais importantes de piora clínica.', nextStateLabel: 'Conduta incompleta', nextStateText: 'A frequência cai, mas a causa de base segue sem tratamento.' },
        ],
      },
      {
        id: 'passo-2',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Investigação',
        patientType: 'Investigação de causa',
        vignette: 'A equipe considera as possíveis causas da taquicardia sinusal.',
        vitals: ['FC 118 bpm', 'Temperatura 39°C'],
        monitor: { type: 'ecg', rhythmKey: 'sinus-tachy' },
        question: 'Quais são causas comuns de taquicardia sinusal a serem investigadas?',
        choices: [
          { id: 'a', label: 'Febre, dor, ansiedade, hipovolemia, anemia, hipertireoidismo, uso de estimulantes, entre outras causas secundárias', quality: 'strong', feedback: 'Correto. A taquicardia sinusal costuma refletir uma ampla gama de causas secundárias — o raciocínio deve sempre buscar "o que está causando isso", não tratar a taquicardia isoladamente.' },
          { id: 'b', label: 'É sempre um sinal de arritmia cardíaca primária grave', quality: 'review', feedback: 'Incorreto. A taquicardia sinusal normalmente reflete uma causa secundária (fisiológica ou clínica), não uma arritmia cardíaca primária.' },
          { id: 'c', label: 'Ocorre apenas em atletas', quality: 'review', feedback: 'Incorreto. Atletas tendem à bradicardia de repouso (por condicionamento), não à taquicardia sinusal.' },
          { id: 'd', label: 'Apenas hipertireoidismo, sem outras causas relevantes', quality: 'partial', feedback: 'Hipertireoidismo é de fato uma causa possível, mas há muitas outras a considerar (febre, dor, hipovolemia, anemia, estimulantes), não só essa.' },
        ],
      },
      {
        id: 'passo-3',
        kind: 'decision',
        patientKicker: 'Sala de Emergência · Reavaliação',
        patientType: 'Resposta ao tratamento',
        vignette: 'Após antitérmico e hidratação, a frequência cardíaca cai para 86 bpm.',
        vitals: ['FC 86 bpm', 'Temperatura 37,2°C'],
        monitor: { type: 'ecg', rhythmKey: 'normal-sinus' },
        question: 'Com a melhora da causa de base, qual a conduta?',
        choices: [
          { id: 'a', label: 'Reavaliar e confirmar que a melhora é suficiente — a resolução da taquicardia acompanha a resolução da causa de base', quality: 'strong', feedback: 'Correto. Como a taquicardia sinusal é secundária, sua resolução espontânea após o tratamento da causa (febre) confirma o raciocínio inicial e dispensa intervenções adicionais sobre o ritmo em si.' },
          { id: 'b', label: 'Manter betabloqueador contínuo mesmo após a frequência normalizar', quality: 'review', feedback: 'Incorreto. Não há indicação de manter uma medicação para controlar frequência numa taquicardia que já era secundária e se resolveu com o tratamento da causa.' },
          { id: 'c', label: 'Investigar arritmia estrutural com estudo eletrofisiológico agora', quality: 'review', feedback: 'Incorreto. Não é necessário diante de uma taquicardia sinusal clara, que já resolveu com o tratamento da causa de base.' },
          { id: 'd', label: 'Alta sem qualquer reavaliação dos sinais vitais', quality: 'partial', feedback: 'Reavaliar os sinais vitais antes da alta é importante para confirmar objetivamente a resposta ao tratamento, não apenas presumi-la.' },
        ],
      },
    ],
  },
]

cases.push(...extraCases)

export function getRandomCase() {
  return cases[Math.floor(Math.random() * cases.length)]
}
