'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function StayCalm() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-12 w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white">STAY CALM</h1>

        {/* Instructions */}
        <div className="space-y-6 text-left bg-gray-900 p-8 rounded-lg border-2 border-red-600">
          <div className="space-y-2">
            <p className="text-gray-300 text-lg">You are trained for this.</p>
            <p className="text-gray-300 text-lg">The person needs your help.</p>
            <p className="text-gray-300 text-lg">Follow the instructions carefully.</p>
          </div>

          <div className="pt-6 space-y-3 text-sm text-gray-400">
            <p>• Keep the area safe</p>
            <p>• Call emergency services if not already done</p>
            <p>• Be ready to perform CPR</p>
          </div>
        </div>

        {/* Continue Button */}
        <Link href="/emergency/breathing" className="block">
          <Button
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-6 rounded-lg transition-colors"
          >
            Continue
          </Button>
        </Link>
      </div>
    </main>
  )
}
