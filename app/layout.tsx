import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Qarabic Academy - Online Quran Learning',
  description: 'Professional online Quran academy for children and adults worldwide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body">
        <Navbar />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  )
}