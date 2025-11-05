import './globals.css'

export const metadata = {
  title: '🌠 Сансрын асуулт 🌠',
  description: 'Space-themed astronomy quiz app with OpenAI integration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  )
}
