export interface ExternalResource {
  id: string
  brand: string
  title: string
  description: string
  free: boolean
  facts: string[]
  status: string
  url: string
}

export const externalResources: ExternalResource[] = [
  {
    id: 'aha-guidelines',
    brand: 'American Heart Association',
    title: 'Diretrizes de RCP e ACE 2020/2025',
    description:
      'Diretrizes oficiais que fundamentam os algoritmos de SBV, SAV, bradi/taquiarritmias e cuidados pós-PCR usados neste simulador.',
    free: true,
    facts: ['Atualização periódica', 'Base científica dos algoritmos'],
    status: 'Consulta livre',
    url: 'https://cpr.heart.org/',
  },
  {
    id: 'imed-ressusci',
    brand: 'iMed Group',
    title: 'Curso RESSUSCI+',
    description:
      'Curso online + presencial de reanimação cardiopulmonar que originou o conteúdo dos 10 módulos usados na biblioteca deste simulador.',
    free: false,
    facts: ['Parte online + módulo prático presencial', '10 módulos'],
    status: 'Curso já adquirido',
    url: 'https://www.imedgroup.com.br/',
  },
  {
    id: 'aha-eccguidelines-journal',
    brand: 'Circulation (AHA Journal)',
    title: 'Publicações científicas de suporte',
    description:
      'Artigos originais que sustentam as recomendações de reanimação citados nas diretrizes da American Heart Association.',
    free: true,
    facts: ['Acesso a artigos selecionados gratuito'],
    status: 'Consulta livre',
    url: 'https://www.ahajournals.org/journal/circ',
  },
]
