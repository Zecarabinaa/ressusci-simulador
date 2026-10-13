import { Heart, Activity, Zap, Brain, Wind, Users, Cpu } from 'lucide-react'
import type { ClinicalCase } from '../data/cases'

const map = {
  heart: Heart,
  activity: Activity,
  zap: Zap,
  brain: Brain,
  wind: Wind,
  users: Users,
  cpu: Cpu,
}

export default function CaseIcon({ icon, size = 18 }: { icon: ClinicalCase['icon']; size?: number }) {
  const Comp = map[icon]
  return <Comp size={size} />
}
