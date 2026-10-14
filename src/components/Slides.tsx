'use client'

import { useTranslations } from 'next-intl'
import { QRCodeSVG } from 'qrcode.react'
import { BY_ID, COMPANY, COMPANY_IDS, CONTACT, WELCOME_PHOTO, type CompanyId, type NodeInfo } from '@/data/content'

// Se a foto principal não existir (download falhou), a segunda camada (fallback) aparece no lugar.
const Photo = ({ src, fallback, className = '' }: { src: string; fallback?: string; className?: string }) => (
  <div className={`photo ${className}`} style={{ backgroundImage: [src, fallback].filter(Boolean).map((u) => `url(${u})`).join(', ') }} />
)

function Qr({ url, size }: { url: string; size: number }) {
  return <QRCodeSVG value={url} size={size} bgColor="#ffffff" fgColor="#14191d" marginSize={2} />
}

// Mostra a versão branca no tema escuro e a preta no tema claro (troca feita no CSS).
export function Logo({ c, ...rest }: { c: CompanyId } & React.HTMLAttributes<HTMLSpanElement>) {
  const t = useTranslations('companies')
  const d = COMPANY[c]
  return (
    <span className="logo" {...rest}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lw" src={d.logoWhite} alt={t(`${c}.name`)} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lb" src={d.logoBlack} alt="" />
    </span>
  )
}

/* Miniatura que aparece no slide do pai enquanto o filho está distante. */
export function CardFace({ node }: { node: NodeInfo }) {
  const t = useTranslations('companies')
  const d = COMPANY[node.company!]
  if (node.kind === 'company') {
    return (
      <>
        <Logo c={node.company!} />
        <strong>{t(`${node.company}.name`)}</strong>
        <span>{t(`${node.company}.tagline`)}</span>
      </>
    )
  }
  const img = d.modules.find((m) => m.id === node.module)!.img
  return (
    <>
      <Photo src={img} fallback={d.hero} />
      <div className="shade" />
      <strong>{t(`${node.company}.modules.${node.module}.title`)}</strong>
    </>
  )
}

function Welcome() {
  const t = useTranslations('welcome')
  return (
    <div className="slide welcome">
      <Photo src={WELCOME_PHOTO} className="wphoto" />
      <div className="wcopy">
        <p className="kicker">{t('kicker')}</p>
        <h1 className="display">{t('title')}</h1>
        <h2 className="group">{t('group')}</h2>
        <p className="lead">{t('text')}</p>
        <button className="cta" data-fly="about">{t('cta')}</button>
      </div>
      <div className="plate">
        {COMPANY_IDS.map((c) => (
          <Logo key={c} c={c} data-fly={c} />
        ))}
      </div>
      <p className="hint">{t('hint')}</p>
    </div>
  )
}

function About() {
  const t = useTranslations('about')
  const stats = t.raw('stats') as { value: string; label: string }[]
  return (
    <div className="slide about">
      <div className="stripe" />
      <div className="about-copy">
        <h2 className="title">{t('title')}</h2>
        <p className="lead">{t('lead')}</p>
        <p className="sectors">{t('sectors')}</p>
      </div>
      <div className="stats">
        {stats.map((s) => (
          <div key={s.value}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <p className="pick">{t('pick')}</p>
    </div>
  )
}

function Company({ node }: { node: NodeInfo }) {
  const c = node.company!
  const d = COMPANY[c]
  const t = useTranslations('companies')
  const u = useTranslations('ui')
  return (
    <div className="slide company">
      <Photo src={d.hero} className="hero" />
      <div className="company-copy">
        <Logo c={c} />
        <h2 className="title">{t(`${c}.tagline`)}</h2>
        <p className="lead">{t(`${c}.intro`)}</p>
        <p className="highlight">{t(`${c}.highlight`)}</p>
      </div>
      <p className="pick modules-hint">{u('modules')}</p>
      <div className="foot">
        <button className="back" data-fly="about">{u('back')}</button>
        <div className="site">
          <Qr url={d.site} size={120} />
          <span>{d.siteLabel}</span>
        </div>
      </div>
    </div>
  )
}

function Module({ node }: { node: NodeInfo }) {
  const c = node.company!
  const m = node.module!
  const t = useTranslations(`companies.${c}.modules.${m}`)
  const u = useTranslations('ui')
  const img = COMPANY[c].modules.find((x) => x.id === m)!.img
  const points = t.raw('points') as string[]
  return (
    <div className="slide module">
      <Photo src={img} fallback={COMPANY[c].hero} className="side" />
      <div className="module-copy">
        <Logo c={c} />
        <h2 className="title">{t('title')}</h2>
        <p className="lead">{t('text')}</p>
        <ul>
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <button className="back" data-fly={node.parent}>{u('back')}</button>
    </div>
  )
}

function What() {
  const t = useTranslations('what')
  const c = useTranslations('companies')
  return (
    <div className="slide what">
      <h2 className="title">{t('title')}</h2>
      <p className="lead">{t('lead')}</p>
      <div className="cols">
        {COMPANY_IDS.map((id) => (
          <div key={id} className="col" data-fly={id} style={{ ['--c' as string]: COMPANY[id].color }}>
            <Photo src={COMPANY[id].hero} />
            <div className="shade" />
            <div className="col-body">
              <Logo c={id} />
              <h3>{c(`${id}.role`)}</h3>
              <p>{c(`${id}.roleText`)}</p>
              <span className="more">{t('more')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Social() {
  const t = useTranslations('social')
  const u = useTranslations('ui')
  return (
    <div className="slide social">
      <h2 className="title">{t('title')}</h2>
      <p className="lead">{t('lead')}</p>
      <div className="cols">
        {COMPANY_IDS.map((id) => {
          const links = [{ label: u('site'), url: COMPANY[id].site }, ...COMPANY[id].socials]
          return (
            <div key={id} className="scol" style={{ ['--c' as string]: COMPANY[id].color }}>
              <Logo c={id} />
              <div className="qrs">
                {links.map((l) => (
                  <figure key={l.label}>
                    <Qr url={l.url} size={150} />
                    <figcaption>{l.label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Overview() {
  const t = useTranslations('overview')
  return (
    <div className="slide overview">
      <div className="flows">
        <h2 className="title">{t('title')}</h2>
        <p className="lead">{t('processes')}</p>
        {COMPANY_IDS.map((id) => {
          const steps = t.raw(`flows.${id}`) as string[]
          return (
            <div key={id} className="flow" style={{ ['--c' as string]: COMPANY[id].color }}>
              <Logo c={id} />
              <ol>
                {steps.map((s, i) => (
                  <li key={s}>
                    <em>{i + 1}</em>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )
        })}
      </div>
      <aside className="thanks">
        <h2 className="title">{t('thanks')}</h2>
        <p className="lead">{t('thanksText')}</p>
        <dl>
          <dt>{t('phone')}</dt>
          <dd>{CONTACT.phone}</dd>
          <dt>{t('address')}</dt>
          <dd>{CONTACT.address}</dd>
        </dl>
      </aside>
    </div>
  )
}

export function Slide({ id }: { id: string }) {
  const n = BY_ID[id]
  switch (n.kind) {
    case 'home': return <Welcome />
    case 'about': return <About />
    case 'company': return <Company node={n} />
    case 'module': return <Module node={n} />
    case 'what': return <What />
    case 'social': return <Social />
    case 'overview': return <Overview />
  }
}
