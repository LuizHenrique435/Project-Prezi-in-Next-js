import type { SVGProps } from 'react'
import type { CompanyId } from '@/data/content'

// Desenhos técnicos em traço: fresa, paquímetro, cotas, HD, processador, circuito integrado, placa e engrenagem.
export type ArtKind = 'endmill' | 'caliper' | 'dimension' | 'hdd' | 'cpu' | 'ic' | 'circuit' | 'gear'

export const ART_SIZE: Record<ArtKind, { w: number; h: number }> = {
  endmill: { w: 80, h: 320 },
  caliper: { w: 520, h: 90 },
  dimension: { w: 340, h: 140 },
  hdd: { w: 260, h: 180 },
  cpu: { w: 220, h: 220 },
  ic: { w: 120, h: 200 },
  circuit: { w: 360, h: 240 },
  gear: { w: 200, h: 200 },
}

// Ícone de cada área em "O que fazemos".
export const ICON: Record<CompanyId, ArtKind> = { tsmtools: 'endmill', toolservices: 'gear', m3code: 'cpu' }

const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const range = (n: number) => Array.from({ length: n }, (_, i) => i)

function gearPath(cx: number, cy: number, teeth: number, ro: number, ri: number) {
  const pts: string[] = []
  const w = Math.PI / teeth
  const p = (r: number, a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2
    pts.push(p(ri, a - w * 0.5), p(ro, a - w * 0.28), p(ro, a + w * 0.28), p(ri, a + w * 0.5))
  }
  return 'M' + pts.join(' L') + ' Z'
}
const GEAR = gearPath(100, 100, 12, 92, 74)

export function Art({ kind, ...rest }: { kind: ArtKind } & SVGProps<SVGSVGElement>) {
  const { w, h } = ART_SIZE[kind]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} {...common} {...rest}>
      {kind === 'endmill' && (
        <>
          <path d="M20 170 V44 Q20 20 40 20 Q60 20 60 44 V170 Z" />
          <rect x="26" y="170" width="28" height="150" rx="2" />
          {range(7).map((i) => (
            <path key={i} d={`M20 ${156 - i * 18} L60 ${130 - i * 18}`} />
          ))}
          <path d="M40 24 V316" strokeDasharray="3 7" />
        </>
      )}
      {kind === 'caliper' && (
        <>
          <rect x="0" y="30" width="520" height="26" />
          {range(51).map((i) => (
            <path key={i} d={`M${i * 10} 30 V${i % 5 === 0 ? 46 : 39}`} />
          ))}
          <path d="M0 56 V88 H20 V56" />
          <rect x="150" y="20" width="96" height="46" rx="6" />
          <path d="M150 66 V88 H170 V66" />
          <circle cx="198" cy="43" r="9" />
        </>
      )}
      {kind === 'dimension' && (
        <>
          <rect x="50" y="62" width="200" height="46" />
          <path d="M50 62 V22 M250 62 V22 M50 32 H250 M50 32 l10 -4 v8 z M250 32 l-10 -4 v8 z" />
          <path d="M262 62 H300 M262 108 H300 M290 62 V108 M290 62 l-4 10 h8 z M290 108 l-4 -10 h8 z" />
          <path d="M150 62 V108" strokeDasharray="6 4" />
          <text x="112" y="24" fill="currentColor" stroke="none" fontSize="13" fontFamily="monospace">Ø25 ±0.01</text>
          <text x="40" y="130" fill="currentColor" stroke="none" fontSize="13" fontFamily="monospace">R 0.4</text>
        </>
      )}
      {kind === 'hdd' && (
        <>
          <rect x="4" y="4" width="252" height="172" rx="10" />
          <circle cx="100" cy="90" r="70" />
          <circle cx="100" cy="90" r="46" />
          <circle cx="100" cy="90" r="20" />
          <circle cx="100" cy="90" r="5" />
          <path d="M224 40 L124 98 L132 108 L232 52 Z" />
          <circle cx="226" cy="42" r="9" />
          <rect x="186" y="148" width="54" height="16" />
          {range(6).map((i) => (
            <path key={i} d={`M${192 + i * 8} 148 V156`} />
          ))}
          {[[16, 16], [244, 16], [16, 164], [244, 164]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="3" />
          ))}
        </>
      )}
      {kind === 'cpu' && (
        <>
          <rect x="40" y="40" width="140" height="140" rx="6" />
          <rect x="68" y="68" width="84" height="84" />
          <rect x="88" y="88" width="44" height="44" />
          <path d="M40 60 L60 40" />
          {range(8).map((i) => (
            <g key={i}>
              <path d={`M${56 + i * 16} 40 V16 M${56 + i * 16} 180 V204`} />
              <path d={`M40 ${56 + i * 16} H16 M180 ${56 + i * 16} H204`} />
            </g>
          ))}
          <circle cx="56" cy="164" r="4" />
        </>
      )}
      {kind === 'ic' && (
        <>
          <rect x="25" y="10" width="70" height="180" rx="4" />
          <path d="M50 10 A10 10 0 0 0 70 10" />
          <circle cx="40" cy="30" r="4" />
          {range(8).map((i) => (
            <path key={i} d={`M5 ${30 + i * 20} H25 M95 ${30 + i * 20} H115`} />
          ))}
        </>
      )}
      {kind === 'circuit' && (
        <>
          <path d="M0 40 H80 L110 70 H200 L230 40 H360" />
          <path d="M0 120 H60 L90 150 H150 V200 H260 L290 170 H360" />
          <path d="M120 0 V60 L150 90 H230 V0" />
          <path d="M40 240 V190 L70 160 H120" />
          <path d="M300 240 V210 L330 180" />
          {[[80, 40], [200, 70], [60, 120], [150, 200], [230, 90], [120, 160]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="5" />
          ))}
          <rect x="250" y="110" width="40" height="28" />
        </>
      )}
      {kind === 'gear' && (
        <>
          <path d={GEAR} />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="18" />
          {range(6).map((i) => (
            <path key={i} d={`M100 100 L${(100 + 50 * Math.cos((i * Math.PI) / 3)).toFixed(1)} ${(100 + 50 * Math.sin((i * Math.PI) / 3)).toFixed(1)}`} />
          ))}
        </>
      )}
    </svg>
  )
}