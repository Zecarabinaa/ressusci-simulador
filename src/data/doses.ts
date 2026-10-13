export interface DoseEntry {
  id: string
  group: string
  drug: string
  dose: string
  note?: string
}

export const doseEntries: DoseEntry[] = [
  { id: 'atropina', group: 'Bradicardia', drug: 'Atropina', dose: '1 mg IV em bolus, repetir a cada 3-5 min até 3 mg', note: 'Não usar em PEA/assistolia (removida dessas diretrizes).' },
  { id: 'dopamina-brady', group: 'Bradicardia', drug: 'Dopamina (infusão)', dose: '5-10 mcg/kg/min', note: 'Segunda linha, se atropina ineficaz.' },
  { id: 'adrenalina-brady', group: 'Bradicardia', drug: 'Adrenalina (infusão)', dose: '2-10 mcg/min' },
  { id: 'adenosina', group: 'Taquicardia', drug: 'Adenosina', dose: '6 mg IV rápido + flush; repetir 12 mg se necessário', note: 'Só para QRS estreito regular. Cuidado em asma (broncoespasmo).' },
  { id: 'cardio-estreito-reg', group: 'Taquicardia', drug: 'Cardioversão — estreito regular (SVT)', dose: '50-100 J sincronizado' },
  { id: 'cardio-estreito-irreg', group: 'Taquicardia', drug: 'Cardioversão — estreito irregular (FA)', dose: '120-200 J bifásico sincronizado' },
  { id: 'cardio-largo-reg', group: 'Taquicardia', drug: 'Cardioversão — largo regular (TV monomórfica)', dose: '100 J sincronizado' },
  { id: 'cardio-largo-irreg', group: 'Taquicardia', drug: 'Largo irregular (Torsades/TV polimórfica)', dose: 'Desfibrilação (não sincronizada), carga máxima' },
  { id: 'amiodarona-taqui', group: 'Taquicardia', drug: 'Amiodarona', dose: '150 mg IV em 10 min; manutenção 1 mg/min por 6h' },
  { id: 'magnesio', group: 'Taquicardia', drug: 'Sulfato de magnésio (Torsades)', dose: '1-2 g IV; pode seguir com 0,5-1 g em 60 min' },
  { id: 'desfib-fv-bifasica', group: 'PCR', drug: 'Desfibrilação bifásica (FV/TV sem pulso)', dose: '120-200 J (seguir fabricante); doses seguintes iguais ou maiores' },
  { id: 'desfib-fv-monofasica', group: 'PCR', drug: 'Desfibrilação monofásica', dose: '360 J' },
  { id: 'adrenalina-pcr', group: 'PCR', drug: 'Adrenalina (PCR)', dose: '1 mg IV/IO a cada 3-5 min' },
  { id: 'amiodarona-pcr', group: 'PCR', drug: 'Amiodarona (FV/TV refratária)', dose: '1ª dose 300 mg bolus; 2ª dose 150 mg' },
  { id: 'posicao-pa-direita', group: 'PCR', drug: 'Posição das pás — direita', dose: 'Região infraclavicular direita', note: 'Passar gel nas pás; afastar todos antes do choque.' },
  { id: 'posicao-pa-esquerda', group: 'PCR', drug: 'Posição das pás — esquerda', dose: '5º espaço intercostal esquerdo (ápice do coração)' },
  { id: 'tubo-padrao', group: 'Via Aérea', drug: 'Tubo orotraqueal', dose: '7,5 como referência inicial quando não dá para individualizar rápido', note: 'Idealmente individualizar: homens ~7,5-8,0; mulheres ~7,0-7,5.' },
  { id: 'tempo-intubacao', group: 'Via Aérea', drug: 'Tempo máx. por tentativa de intubação', dose: '~10 segundos', note: 'Se não conseguir, ventilar com bolsa-válvula-máscara antes de tentar de novo.' },
  { id: 'aas', group: 'Síndrome Coronariana Aguda', drug: 'AAS (aspirina)', dose: '160-325 mg VO, mastigável' },
  { id: 'nitro', group: 'Síndrome Coronariana Aguda', drug: 'Nitroglicerina', dose: '0,3-0,4 mg SL, até 3 doses a cada 3-5 min', note: 'Evitar se PAS < 90 mmHg ou uso de inibidor de fosfodiesterase em 24h.' },
  { id: 'morfina', group: 'Síndrome Coronariana Aguda', drug: 'Morfina', dose: '1-5 mg IV', note: 'Só se a dor não aliviar com nitrato.' },
  { id: 'volume-pos-pcr', group: 'Cuidados Pós-PCR', drug: 'Cristaloide (bolus)', dose: '1-2 L IV se PAS < 90 ou PAM < 65' },
  { id: 'dopamina-pos-pcr', group: 'Cuidados Pós-PCR', drug: 'Dopamina (infusão)', dose: '5-10 mcg/kg/min' },
  { id: 'norepi-pos-pcr', group: 'Cuidados Pós-PCR', drug: 'Noradrenalina (infusão)', dose: '0,1-0,5 mcg/kg/min' },
  { id: 'temperatura', group: 'Cuidados Pós-PCR', drug: 'Controle direcionado de temperatura', dose: '32-36°C por no mínimo 24h' },
  { id: 'alteplase', group: 'AVC', drug: 'Alteplase', dose: '0,9 mg/kg (máx. 90 mg); 10% em bolus, resto em 60 min' },
]
