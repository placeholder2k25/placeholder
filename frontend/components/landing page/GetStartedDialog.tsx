"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function GetStartedDialog() {

  const router = useRouter();
  const handleGetStarted = () => {
    router.push('/signup');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold group"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose your journey</DialogTitle>
          <DialogDescription>Quick highlights for both Brands and Creators.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Brands Section */}
          <div className="rounded-lg border p-4 bg-white/60">
            <h3 className="font-semibold text-lg mb-3">For Brands</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Launch targeted campaigns easily</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Discover vetted creators</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Track performance with analytics</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Secure payments and contracts</li>
            </ul>
          </div>

          {/* Creators Section */}
          <div className="rounded-lg border p-4 bg-white/60">
            <h3 className="font-semibold text-lg mb-3">For Creators</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Get matched with brand campaigns</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Clear briefs and deliverables</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Transparent payouts</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> Build your portfolio and insights</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button variant="secondary" onClick={handleGetStarted}>Get Started</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}