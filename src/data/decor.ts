// Posições dos desenhos e logos do fundo do canvas. Gerado com semente fixa (sempre o mesmo resultado).
import { ART_SIZE, type ArtKind } from '@/components/Art'
import { COMPANY_IDS, NODES, RECT, type CompanyId } from './content'

export type DecorItem = { kind: ArtKind | 'logo'; company?: CompanyId; x: number; y: number; w: number; h: number; rot: number }

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Box = { x: number; y: number; w: number; h: number } // centro + tamanho
const hit = (a: Box, b: Box, pad: number) =>
  Math.abs(a.x - b.x) < (a.w + b.w) / 2 + pad && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + pad

function build(): DecorItem[] {
  const items: DecorItem[] = []
  const blocked: Box[] = NODES.filter((n) => !n.parent).map((n) => {
    const r = RECT[n.id]
    return { x: r.cx, y: r.cy, w: r.w, h: r.h }
  })

  // Os 3 logos grandes ficam no espaço livre do centro do mapa.
  COMPANY_IDS.forEach((c, i) => {
    const it: DecorItem = { kind: 'logo', company: c, x: (i - 1) * 1100, y: 1100, w: 960, h: 260, rot: 0 }
    items.push(it)
    blocked.push(it)
  })

  const kinds: ArtKind[] = ['endmill', 'cpu', 'caliper', 'hdd', 'ic', 'dimension', 'circuit', 'gear']
  const rand = rng(20261014)
  let n = 0
  for (let attempt = 0; attempt < 2500 && items.length < 95; attempt++) {
    const kind = kinds[n % kinds.length]
    const f = 0.8 + rand() * 0.8
    const base = ART_SIZE[kind]
    const turned = (kind === 'caliper' || kind === 'endmill') && rand() < 0.5
    const rot = turned ? (rand() < 0.5 ? 90 : -90) : (rand() - 0.5) * 40
    const w = base.w * f
    const h = base.h * f
    const box: Box = { x: -3800 + rand() * 7600, y: -700 + rand() * 3650, w: turned ? h : w, h: turned ? w : h }
    if (blocked.some((b) => hit(box, b, 90))) continue
    items.push({ kind, x: box.x, y: box.y, w, h, rot })
    blocked.push(box)
    n++
  }
  return items
}

export const DECOR = build()