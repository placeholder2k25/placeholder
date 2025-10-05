import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Placeholder - Connect Brands with Creators',
  description: 'The ultimate platform where brands launch campaigns, creators bring them to life, and everyone wins with data-driven performance tracking and seamless payments.',
  keywords: 'brand marketing, creator economy, influencer marketing, social media campaigns, content creation',
  authors: [{ name: 'Placeholder Team' }],
  openGraph: {
    title: 'Placeholder - Connect Brands with Creators',
    description: 'The ultimate platform where brands launch campaigns, creators bring them to life, and everyone wins with data-driven performance tracking and seamless payments.',
    type: 'website',
  },
}

import AuthBootstrap from "@/components/AuthBootstrap";
import RouteGuard from "@/components/RouteGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthBootstrap />
        <RouteGuard>
          {children}
        </RouteGuard>
      </body>
    </html>
  )
}