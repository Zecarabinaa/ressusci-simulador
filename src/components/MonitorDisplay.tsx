export type EcgRhythmKey =
  | 'normal-sinus'
  | 'sinus-brady'
  | 'bav-mobitz1'
  | 'bav-mobitz2'
  | 'bav-total'
  | 'afib'
  | 'flutter'
  | 'vt-mono'
  | 'vf'
  | 'stemi-inferior'
  | 'svt'
  | 'bav-1'
  | 'junctional'
  | 'torsades'
  | 'asystole'
  | 'pea'
  | 'sinus-tachy'

type Point = [number, number]

const BASELINE = 60
const WIDTH = 640

function qrsUnit(x0: number, amp = 1, stWidth = 10, stLift = 0, wide = false): Point[] {
  const qrsW = wide ? 22 : 10
  return [
    [x0, BASELINE],
    [x0 + 8, BASELINE - 6 * amp],
    [x0 + 10, BASELINE],
    [x0 + 14, BASELINE],
    [x0 + 14 + qrsW * 0.25, BASELINE + 14 * amp],
    [x0 + 14 + qrsW * 0.5, BASELINE - 46 * amp],
    [x0 + 14 + qrsW * 0.75, BASELINE + 18 * amp],
    [x0 + 14 + qrsW, BASELINE],
    [x0 + 14 + qrsW + stWidth, BASELINE - stLift],
    [x0 + 14 + qrsW + stWidth + 10, BASELINE - stLift - 16 * amp],
    [x0 + 14 + qrsW + stWidth + 20, BASELINE],
  ]
}

function generate(key: EcgRhythmKey): Point[] {
  const pts: Point[] = [[0, BASELINE]]
  if (key === 'normal-sinus' || key === 'stemi-inferior') {
    const beatWidth = 85
    const lift = key === 'stemi-inferior' ? 14 : 0
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push(...qrsUnit(x0, 1, 12, lift))
      pts.push([x0 + beatWidth, BASELINE])
    }
  } else if (key === 'svt') {
    const beatWidth = 36
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push(...qrsUnit(x0, 0.85, 2, 0))
      pts.push([x0 + beatWidth, BASELINE])
    }
  } else if (key === 'sinus-brady') {
    const beatWidth = 155
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push(...qrsUnit(x0, 1, 12, 0))
      pts.push([x0 + beatWidth, BASELINE])
    }
  } else if (key === 'bav-mobitz1') {
    const slot = 58
    let i = 0
    for (let x0 = 10; x0 < WIDTH - slot; x0 += slot) {
      const phase = i % 3
      pts.push([x0, BASELINE], [x0 + 5, BASELINE - 7], [x0 + 10, BASELINE])
      if (phase === 0) {
        pts.push(...qrsUnit(x0 + 14, 1, 8, 0))
      } else if (phase === 1) {
        pts.push(...qrsUnit(x0 + 26, 1, 8, 0))
      }
      pts.push([x0 + slot, BASELINE])
      i++
    }
  } else if (key === 'bav-mobitz2') {
    const beatWidth = 80
    let count = 0
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      count++
      if (count % 4 === 0) {
        pts.push([x0, BASELINE], [x0 + 6, BASELINE - 8], [x0 + 12, BASELINE], [x0 + beatWidth, BASELINE])
      } else {
        pts.push(...qrsUnit(x0, 1, 10, 0))
        pts.push([x0 + beatWidth, BASELINE])
      }
    }
  } else if (key === 'bav-total') {
    for (let x0 = 10; x0 < WIDTH - 40; x0 += 38) {
      pts.push([x0, BASELINE], [x0 + 5, BASELINE - 7], [x0 + 10, BASELINE])
    }
    const qrsPts: Point[] = []
    for (let x0 = 25; x0 < WIDTH - 130; x0 += 130) {
      qrsPts.push(...qrsUnit(x0, 0.9, 10, 0))
    }
    return mergeOverlay(pts, qrsPts)
  } else if (key === 'afib') {
    const spacings = [55, 85, 60, 100, 70, 90, 50, 95, 65]
    let x0 = 10
    let i = 0
    while (x0 < WIDTH - 40) {
      for (let x = pts[pts.length - 1][0]; x < x0; x += 4) {
        pts.push([x, BASELINE + (Math.random() - 0.5) * 6])
      }
      pts.push(...qrsUnit(x0, 0.95, 8, 0))
      x0 += spacings[i % spacings.length]
      i++
    }
  } else if (key === 'flutter') {
    let x0 = 10
    let beatCount = 0
    while (x0 < WIDTH - 30) {
      const isQrs = beatCount % 3 === 2
      if (isQrs) {
        pts.push(...qrsUnit(x0, 0.9, 6, 0))
        x0 += 24
      } else {
        pts.push([x0, BASELINE], [x0 + 6, BASELINE - 14], [x0 + 12, BASELINE + 2])
        x0 += 16
      }
      beatCount++
    }
  } else if (key === 'vt-mono') {
    const beatWidth = 72
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push(...qrsUnit(x0, 1.3, 4, 0, true))
      pts.push([x0 + beatWidth, BASELINE])
    }
  } else if (key === 'vf') {
    for (let x = 10; x < WIDTH - 10; x += 5) {
      pts.push([x, BASELINE + (Math.random() - 0.5) * 70])
    }
  } else if (key === 'sinus-tachy') {
    const beatWidth = 56
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push(...qrsUnit(x0, 1, 6, 0))
      pts.push([x0 + beatWidth, BASELINE])
    }
  } else if (key === 'bav-1') {
    const beatWidth = 95
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push([x0, BASELINE], [x0 + 5, BASELINE - 7], [x0 + 10, BASELINE])
      pts.push(...qrsUnit(x0 + 34, 1, 10, 0))
      pts.push([x0 + beatWidth, BASELINE])
    }
  } else if (key === 'junctional') {
    const beatWidth = 78
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push(...qrsUnit(x0, 0.9, 10, 0))
      pts.push([x0 + beatWidth, BASELINE])
    }
  } else if (key === 'torsades') {
    const beatWidth = 26
    let i = 0
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      const envelope = Math.sin((i / 10) * Math.PI) * 1.4
      pts.push(...qrsUnit(x0, envelope, 2, 0, true))
      pts.push([x0 + beatWidth, BASELINE])
      i++
    }
  } else if (key === 'asystole') {
    for (let x = 10; x < WIDTH - 10; x += 8) {
      pts.push([x, BASELINE + (Math.random() - 0.5) * 2])
    }
  } else if (key === 'pea') {
    const beatWidth = 88
    for (let x0 = 10; x0 < WIDTH - beatWidth; x0 += beatWidth) {
      pts.push([x0, BASELINE], [x0 + 5, BASELINE - 7], [x0 + 10, BASELINE])
      pts.push(...qrsUnit(x0 + 14, 1, 10, 0))
      pts.push([x0 + beatWidth, BASELINE])
    }
  }
  pts.push([WIDTH, BASELINE])
  return pts
}

function mergeOverlay(a: Point[], b: Point[]): Point[] {
  const merged = [...a, ...b].sort((p, q) => p[0] - q[0])
  return merged
}

const labels: Record<EcgRhythmKey, string> = {
  'normal-sinus': 'Monitor cardíaco',
  'sinus-brady': 'Monitor cardíaco',
  'bav-mobitz1': 'Monitor cardíaco',
  'bav-mobitz2': 'Monitor cardíaco',
  'bav-total': 'Monitor cardíaco',
  afib: 'Monitor cardíaco',
  flutter: 'Monitor cardíaco',
  'vt-mono': 'Monitor cardíaco',
  vf: 'Monitor cardíaco',
  'stemi-inferior': 'Monitor cardíaco · D2, D3, aVF',
  svt: 'Monitor cardíaco',
  'bav-1': 'Monitor cardíaco',
  junctional: 'Monitor cardíaco',
  torsades: 'Monitor cardíaco',
  asystole: 'Monitor cardíaco',
  pea: 'Monitor cardíaco',
  'sinus-tachy': 'Monitor cardíaco',
}

function EcgGrid() {
  return (
    <>
      <defs>
        <pattern id="ecg-grid-small" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f2dcdc" strokeWidth="0.5" />
        </pattern>
        <pattern id="ecg-grid-big" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#ecg-grid-small)" />
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#edc9c9" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width={WIDTH} height="120" fill="url(#ecg-grid-big)" />
    </>
  )
}

export function EcgStrip({ rhythmKey }: { rhythmKey: EcgRhythmKey }) {
  const points = generate(rhythmKey)
  const pointsStr = points.map((p) => p.join(',')).join(' ')
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #f0dede' }}>
      <svg viewBox={`0 0 ${WIDTH} 120`} style={{ width: '100%', display: 'block', background: '#fcf8f8' }}>
        <EcgGrid />
        <polyline points={pointsStr} fill="none" stroke="#b84c43" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div
        style={{
          padding: '5px 10px',
          background: '#fff',
          borderTop: '1px solid #f0dede',
          color: '#8a7470',
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
        }}
      >
        {labels[rhythmKey]} · traçado ilustrativo
      </div>
    </div>
  )
}

export function CtFindingDisplay({ finding }: { finding: string }) {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
      <div
        style={{
          minHeight: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'repeating-conic-gradient(#e9e9ec 0% 25%, #dcdce1 0% 50%) 50% / 12px 12px',
          color: '#50565c',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          textAlign: 'center',
          padding: 12,
        }}
      >
        Tomografia de crânio sem contraste (ilustrativa)
      </div>
      <div style={{ padding: '8px 10px', background: '#fff', fontSize: 10, color: 'var(--ink)' }}>{finding}</div>
    </div>
  )
}
