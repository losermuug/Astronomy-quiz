import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '✨ Сансрын асуулт ✨',
  description: 'Space-themed astronomy quiz app with OpenAI integration',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  )
}

