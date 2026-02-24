'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 w-full max-w-md">
        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter">
            Pulse
            <span className="text-red-600">Guide</span>
          </h1>
          <p className="text-xl text-red-500 font-semibold">AI</p>
        </div>

        {/* Tagline */}
        <p className="text-gray-300 text-lg leading-relaxed">
          Emergency Response Training System
        </p>

        {/* Buttons */}
        <div className="space-y-4 pt-8">
          <Link href="/emergency" className="block">
            <Button
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-8 rounded-lg transition-colors"
            >
              Start Emergency
            </Button>
          </Link>

          <Link href="/training" className="block">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 border-white text-white hover:bg-white hover:text-black text-lg font-bold py-8 rounded-lg transition-colors"
            >
              Training Mode
            </Button>
          </Link>
        </div>

        {/* Info */}
        <div className="text-gray-400 text-sm pt-8 border-t border-gray-800">
          <p>Practice CPR techniques with AI-guided rhythm detection and real-time feedback.</p>
        </div>
      </div>
    </main>
  )
}
