'use client'

import { memo } from 'react'
import { COMPANY } from '@/data/content'
import { DECOR } from '@/data/decor'
import { Art } from './Art'

// Fundo do canvas: desenhos técnicos e os logos das três empresas. Fica no mundo, então aparece inteiro em "Mapa".
export default memo(function Decor() {
  return (
    <div className="decor" aria-hidden>
      {DECOR.map((d, i) => {
        const style = { left: d.x, top: d.y, width: d.w, transform: `translate(-50%, -50%) rotate(${d.rot}deg)` }
        if (d.kind === 'logo') {
          const c = COMPANY[d.company!]
          return (
            <div key={i} className="bgl" style={style}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lw" src={c.logoWhite} alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb" src={c.logoBlack} alt="" />
            </div>
          )
        }
        return (
          <div key={i} className="art" style={{ ...style, height: d.h }}>
            <Art kind={d.kind} />
          </div>
        )
      })}
    </div>
  )
})