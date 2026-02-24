'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BreathingCheck() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-12 w-full max-w-md">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white">CHECK BREATHING</h1>

        {/* Instructions */}
        <div className="space-y-8 text-left bg-gray-900 p-8 rounded-lg border-2 border-red-600">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-red-600 text-2xl font-bold min-w-8">1</span>
              <p className="text-gray-300 text-lg">Position your ear near their mouth and nose</p>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-red-600 text-2xl font-bold min-w-8">2</span>
              <p className="text-gray-300 text-lg">Look at their chest for movement</p>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-red-600 text-2xl font-bold min-w-8">3</span>
              <p className="text-gray-300 text-lg">Feel for breath for 5-10 seconds</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-yellow-500 font-semibold">If no breathing detected:</p>
            <p className="text-gray-300 mt-2">Begin CPR immediately</p>
          </div>
        </div>

        {/* Continue Button */}
        <Link href="/emergency/cpr" className="block">
          <Button
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-6 rounded-lg transition-colors"
          >
            Start CPR
          </Button>
        </Link>
      </div>
    </main>
  )
}
