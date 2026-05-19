import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'WeatherWise | PM Accelerator Assessment',
  description:
    'Full-stack weather application built by Juan Sebastian Urrea for PM Accelerator internship assessment.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}>
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
