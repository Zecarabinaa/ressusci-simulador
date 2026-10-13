export interface QuizEntry {
  id: string
  statement: string
  answer: boolean
  explanation: string
}

export const quizEntries: QuizEntry[] = [
  {
    id: 'cricoide',
    statement: 'A pressão cricoide é recomendada rotineiramente durante a intubação de emergência em adultos.',
    answer: false,
    explanation: 'Falso. A pressão cricoide rotineira deixou de ser recomendada — não há evidência de que reduza aspiração, e pode até atrapalhar a visualização da via aérea.',
  },
  {
    id: 'checagem-pulso',
    statement: 'A checagem de pulso durante o reconhecimento da parada cardiorrespiratória deve durar no máximo 10 segundos.',
    answer: true,
    explanation: 'Verdadeiro. Mesmo profissionais treinados nem sempre sentem o pulso com precisão — por isso o limite é de até 10 segundos antes de iniciar as compressões.',
  },
  {
    id: 'cab',
    statement: 'A sequência atual do suporte básico de vida prioriza compressões antes de via aérea e respiração (C-A-B), e não mais via aérea primeiro (A-B-C).',
    answer: true,
    explanation: 'Verdadeiro. A mudança para C-A-B (compressões primeiro) reduziu o tempo até a primeira compressão e melhorou desfechos.',
  },
  {
    id: 'atropina-aesp',
    statement: 'Atropina é indicada rotineiramente no tratamento de AESP e assistolia.',
    answer: false,
    explanation: 'Falso. A atropina foi removida das diretrizes de parada por AESP/assistolia — estudos não mostraram benefício terapêutico no seu uso rotineiro nesses ritmos.',
  },
  {
    id: 'bifasico',
    statement: 'Desfibriladores bifásicos são preferidos em relação aos monofásicos mais antigos.',
    answer: true,
    explanation: 'Verdadeiro. A onda bifásica é mais eficaz para reverter ritmos letais, por isso é a preferida quando disponível.',
  },
  {
    id: 'epi-dose-alta',
    statement: 'Epinefrina em dose alta demonstrou ser mais eficaz que a dose padrão de 1 mg na parada cardiorrespiratória.',
    answer: false,
    explanation: 'Falso. Pesquisas não mostraram benefício da dose alta sobre a dose padrão (1 mg a cada 3-5 min) — por isso a dose alta não é recomendada.',
  },
  {
    id: 'dea-pulso',
    statement: 'O DEA consegue diferenciar sozinho se a vítima tem ou não pulso.',
    answer: false,
    explanation: 'Falso. O DEA só analisa o ritmo elétrico, não detecta pulso — por isso nunca se deve usar um DEA em alguém com pulso palpável.',
  },
  {
    id: 'retorno-torax',
    statement: 'As compressões torácicas devem permitir o retorno completo do tórax entre uma compressão e outra.',
    answer: true,
    explanation: 'Verdadeiro. O retorno completo do tórax é essencial para o enchimento cardíaco adequado entre as compressões.',
  },
  {
    id: 'relacao-30-2',
    statement: 'A relação de 30 compressões para 2 ventilações vale para a vítima que NÃO tem uma via aérea avançada instalada.',
    answer: true,
    explanation: 'Verdadeiro. Sem via aérea avançada, mantém-se o ciclo de 30:2. Com via aérea avançada, as compressões passam a ser contínuas.',
  },
  {
    id: 'via-aerea-avancada',
    statement: 'Com uma via aérea avançada instalada, as compressões devem ser interrompidas a cada ventilação.',
    answer: false,
    explanation: 'Falso. Com via aérea avançada, as compressões tornam-se contínuas (sem pausar), e a ventilação é entregue a cada 6 segundos, independente do ciclo de compressão.',
  },
  {
    id: 'hipovolemia-hipoxia',
    statement: 'Hipovolemia e hipóxia são as causas mais comuns e mais facilmente reversíveis de AESP.',
    answer: true,
    explanation: 'Verdadeiro. Por isso devem estar no topo do diagnóstico diferencial sempre que se identifica atividade elétrica sem pulso.',
  },
  {
    id: 'vasopressina',
    statement: 'A vasopressina oferece vantagem sobre a epinefrina em dose padrão no tratamento da parada cardiorrespiratória.',
    answer: false,
    explanation: 'Falso. Estudos não mostraram superioridade da vasopressina sobre a epinefrina padrão — por isso ela foi removida do algoritmo, que ficou mais simples.',
  },
  {
    id: 'pseudo-fv',
    statement: 'Um artefato de mau contato do eletrodo no monitor pode produzir um padrão parecido com fibrilação ventricular (a chamada "pseudo-FV").',
    answer: true,
    explanation: 'Verdadeiro. Por isso, diante de um traçado súbito de FV sem explicação clínica, vale checar rapidamente cabos e contato antes de tratar — sem nunca atrasar a RCP enquanto se confirma.',
  },
  {
    id: 'sync-nao-choca-fv',
    statement: 'Com o desfibrilador no modo sincronizado, é possível aplicar o choque normalmente numa fibrilação ventricular.',
    answer: false,
    explanation: 'Falso. No modo sincronizado o aparelho procura um QRS organizado para disparar o choque — numa FV (sem QRS identificável) ele pode simplesmente não disparar. Por isso ritmos sem pulso são tratados com desfibrilação assíncrona, não cardioversão sincronizada.',
  },
  {
    id: 'flush-periferico',
    statement: 'Medicação administrada por acesso venoso periférico durante a RCP deve ser seguida por um bolus de soro fisiológico (e, se possível, elevação do membro).',
    answer: true,
    explanation: 'Verdadeiro. O flush de soro e a elevação do membro ajudam a medicação a chegar mais rápido à circulação central, já que o fluxo periférico durante a RCP é mais lento.',
  },
  {
    id: 'epi-intracardiaca',
    statement: 'A adrenalina intracardíaca é uma alternativa recomendada quando não se consegue acesso venoso em até 3 minutos de reanimação.',
    answer: false,
    explanation: 'Falso. A via intracardíaca é obsoleta e perigosa (risco de lesão coronariana, tamponamento, pneumotórax) — as vias recomendadas quando o acesso venoso demora são a intraóssea (IO) e, para algumas drogas, a via endotraqueal.',
  },
  {
    id: 'marcapasso-fv',
    statement: 'O marcapasso transcutâneo é indicado em pacientes com fibrilação ventricular ou assistolia.',
    answer: false,
    explanation: 'Falso. O marcapasso serve para bradicardias com algum ritmo organizado e pulso — não tem papel em ritmos sem pulso como FV, TV sem pulso, AESP ou assistolia.',
  },
  {
    id: 'morfina-apos-nitro',
    statement: 'Diante de uma dor torácica isquêmica que não alivia mesmo após 3 doses de nitroglicerina, o próximo passo do MONA é a morfina IV.',
    answer: true,
    explanation: 'Verdadeiro. A morfina entra especificamente quando a dor persiste apesar dos nitratos (ou quando eles são contraindicados), sempre com monitorização da pressão arterial.',
  },
  {
    id: 'mona-ordem-rigida',
    statement: 'O mnemônico MONA (Morfina, Oxigênio, Nitrato, AAS) descreve a ordem exata e obrigatória em que esses tratamentos devem ser administrados na síndrome coronariana aguda.',
    answer: false,
    explanation: 'Falso. MONA é só um mnemônico para lembrar os componentes do tratamento inicial — na prática, AAS e oxigênio (se necessário) costumam vir primeiro, e a morfina só entra por último, se a dor persistir após o nitrato.',
  },
  {
    id: 'tubo-7-5-sempre',
    statement: 'O tubo orotraqueal número 7,5 é sempre o tamanho ideal, independente do biotipo do paciente.',
    answer: false,
    explanation: 'Falso. O 7,5 é usado como referência inicial comum quando não dá para individualizar rápido, mas o ideal é ajustar pelo biotipo — em geral homens ficam entre 7,5-8,0 e mulheres entre 7,0-7,5.',
  },
  {
    id: 'tempo-tentativa-intubacao',
    statement: 'Uma tentativa de intubação não deve ultrapassar cerca de 10 segundos — se não conseguir, deve-se ventilar com bolsa-válvula-máscara antes de tentar de novo.',
    answer: true,
    explanation: 'Verdadeiro. Isso evita dessaturação prolongada durante a tentativa — é melhor interromper, reoxigenar e tentar de novo do que insistir sem sucesso.',
  },
  {
    id: 'posicao-pas',
    statement: 'A posição padrão das pás do desfibrilador manual é uma na região infraclavicular direita e outra no 5º espaço intercostal esquerdo (ápice do coração).',
    answer: true,
    explanation: 'Verdadeiro. Essa é a posição clássica — e sempre com gel nas pás e certeza de que ninguém está tocando o paciente antes do choque.',
  },
  {
    id: 'choque-tocando-paciente',
    statement: 'É aceitável aplicar o choque do desfibrilador mesmo que algum membro da equipe ainda esteja tocando rapidamente o paciente.',
    answer: false,
    explanation: 'Falso. Antes de qualquer choque, todos devem se afastar completamente do paciente — tocar a vítima durante a descarga pode causar choque acidental em quem está em contato.',
  },
]
