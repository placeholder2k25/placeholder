import Navbar from '@/components/landing page/Navbar'
import Hero from '@/components/landing page/Hero'
import HowItWorks from '@/components/landing page/HowItWorks'
import Features from '@/components/landing page/Features'
import Footer from '@/components/landing page/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  )
}