'use client'

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { NextIntlClientProvider } from 'next-intl'
import pt from '../../messages/pt-BR.json'
import en from '../../messages/en.json'

type Locale = 'pt-BR' | 'en'
type Theme = 'dark' | 'light'
type Ctx = { locale: Locale; theme: Theme; toggleLocale: () => void; toggleTheme: (origin?: { x: number; y: number }) => void }

const MESSAGES = { 'pt-BR': pt, en }
const AppCtx = createContext<Ctx>(null as unknown as Ctx)
export const useApp = () => useContext(AppCtx)

// View Transitions API: congela a tela, aplica a mudança e anima da imagem antiga para a nova.
function withViewTransition(update: () => void, origin?: { x: number; y: number }) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
  if (!doc.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return update()
  const vt = doc.startViewTransition(() => flushSync(update))
  if (!origin) return
  vt.ready.then(() => {
    const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y))
    document.documentElement.animate(
      { clipPath: [`circle(0 at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
      { duration: 750, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
    )
  })
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('pt-BR')
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    try {
      const l = localStorage.getItem('locale')
      const th = localStorage.getItem('theme')
      if (l === 'en' || l === 'pt-BR') setLocale(l)
      if (th === 'light' || th === 'dark') setTheme(th)
    } catch {}
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = locale
    try {
      localStorage.setItem('theme', theme)
      localStorage.setItem('locale', locale)
    } catch {}
  }, [theme, locale])

  const toggleLocale = useCallback(() => withViewTransition(() => setLocale((l) => (l === 'pt-BR' ? 'en' : 'pt-BR'))), [])
  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => withViewTransition(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), origin),
    [],
  )
  const value = useMemo(() => ({ locale, theme, toggleLocale, toggleTheme }), [locale, theme, toggleLocale, toggleTheme])

  return (
    <AppCtx.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]} timeZone="America/Sao_Paulo">
        {children}
      </NextIntlClientProvider>
    </AppCtx.Provider>
  )
}
