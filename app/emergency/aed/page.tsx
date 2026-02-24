'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AEDPage() {
  const [phase, setPhase] = useState<'analyzing' | 'result' | 'shock'>('analyzing')
  const [shouldShock, setShouldShock] = useState(false)

  useEffect(() => {
    // Simulate AED analysis
    const timer = setTimeout(() => {
      const random = Math.random() > 0.5
      setShouldShock(random)
      setPhase('result')

      // If shock needed, show shock phase after 2 seconds
      if (random) {
        const shockTimer = setTimeout(() => {
          setPhase('shock')
        }, 2000)
        return () => clearTimeout(shockTimer)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {phase === 'analyzing' && (
          <div className="text-center space-y-8">
            <div className="bg-yellow-900 border-4 border-yellow-500 p-12 rounded-lg">
              <h1 className="text-4xl font-bold text-yellow-400 mb-8">
                AED ANALYZING
              </h1>
              <div className="animate-pulse space-y-2">
                <div className="h-2 bg-yellow-500 rounded"></div>
                <div className="h-2 bg-yellow-500 rounded"></div>
                <div className="h-2 bg-yellow-500 rounded"></div>
              </div>
              <p className="text-yellow-300 mt-8 text-lg">
                Analyzing heart rhythm...
              </p>
            </div>
          </div>
        )}

        {phase === 'result' && !shouldShock && (
          <div className="text-center space-y-8">
            <div className="bg-green-900 border-4 border-green-500 p-12 rounded-lg">
              <h1 className="text-4xl font-bold text-green-400 mb-4">
                NO SHOCK
              </h1>
              <p className="text-green-300 text-lg mb-8">
                No abnormal rhythm detected
              </p>
              <p className="text-white text-lg">
                Continue CPR compressions
              </p>
            </div>

            <Link href="/emergency/cpr" className="block">
              <Button
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-6 rounded-lg"
              >
                Resume CPR
              </Button>
            </Link>
          </div>
        )}

        {phase === 'result' && shouldShock && (
          <div className="text-center space-y-8">
            <div className="bg-red-900 border-4 border-red-500 p-12 rounded-lg">
              <h1 className="text-4xl font-bold text-red-400 mb-4">
                SHOCK ADVISED
              </h1>
              <p className="text-red-300 text-lg mb-8">
                Abnormal rhythm detected
              </p>
              <p className="text-white text-sm mb-4">
                Ensure everyone is clear of patient
              </p>
              <div className="text-7xl animate-pulse mb-6">⚡</div>
            </div>

            <Button
              onClick={() => setPhase('shock')}
              size="lg"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg font-bold py-6 rounded-lg"
            >
              DELIVER SHOCK
            </Button>
          </div>
        )}

        {phase === 'shock' && (
          <div className="text-center space-y-8">
            <div className="bg-red-900 border-4 border-red-500 p-12 rounded-lg">
              <h1 className="text-5xl font-bold text-red-400 mb-8 animate-pulse">
                SHOCK DELIVERED
              </h1>
              <div className="text-8xl mb-8">⚡</div>
              <p className="text-white text-xl font-bold">
                STAND CLEAR
              </p>
              <p className="text-red-300 text-lg mt-4">
                Resuming CPR in 3 seconds
              </p>
            </div>
          </div>
        )}

        {/* Home Link */}
        <Link href="/" className="block pt-8">
          <Button
            variant="ghost"
            className="w-full text-gray-400 hover:text-white py-4"
          >
            ← Home
          </Button>
        </Link>
      </div>
    </main>
  )
}
