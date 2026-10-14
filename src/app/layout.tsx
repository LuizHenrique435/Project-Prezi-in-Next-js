import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, IBM_Plex_Sans } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const display = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-display' })
const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-body' })

export const metadata: Metadata = { title: 'Grupo Tool Services' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
