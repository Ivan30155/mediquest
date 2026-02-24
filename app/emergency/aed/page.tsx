'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AEDPage() {
  const [phase, setPhase] = useState<'analyzing' | 'result' | 'shock'>('analyzing')
  const [shouldShock, setShouldShock] = useState(false)
  const [flashEffect, setFlashEffect] = useState(false)

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
          setFlashEffect(true)
          setTimeout(() => setFlashEffect(false), 300)
        }, 2000)
        return () => clearTimeout(shockTimer)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A0000] to-[#0D0D0D] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E10600] rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Flash Effect for Shock */}
      {flashEffect && (
        <div className="fixed inset-0 bg-white opacity-30 animate-pulse pointer-events-none" />
      )}

      <div className="relative w-full max-w-2xl px-6 space-y-8">
        {phase === 'analyzing' && (
          <div className="text-center space-y-8 animate-fade-in">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold rounded-full text-sm">
                Step 4 of 4
              </span>
            </div>

            {/* AED Icon */}
            <div className="text-7xl">📱</div>

            {/* Analyzing Card */}
            <div className="bg-gradient-to-br from-[#2A1A1A] to-[#1A0D0D] border-2 border-yellow-600 border-opacity-60 rounded-2xl p-12 backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 0 40px rgba(225, 180, 0, 0.1), 0 0 40px rgba(225, 180, 0, 0.2)' }}
            >
              <h1 className="text-4xl font-black text-yellow-400 mb-8 tracking-wide">
                AED ANALYZING
              </h1>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-2 items-center justify-center">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                  <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>

              <p className="text-yellow-300 text-lg font-semibold">
                Scanning heart rhythm...
              </p>
              <p className="text-yellow-200 text-sm mt-3 opacity-80">
                Keep hands clear of patient
              </p>
            </div>
          </div>
        )}

        {phase === 'result' && !shouldShock && (
          <div className="text-center space-y-8 animate-fade-in">
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-900 to-green-800 bg-opacity-50 border border-green-500 border-opacity-60 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-green-300">NORMAL RHYTHM</span>
            </div>

            {/* Result Card */}
            <div className="bg-gradient-to-br from-[#0D2A1A] to-[#1A0D0D] border-2 border-green-600 border-opacity-60 rounded-2xl p-12 backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 0 40px rgba(34, 197, 94, 0.1)' }}
            >
              <h1 className="text-5xl font-black text-green-400 mb-4">
                ✓ NO SHOCK
              </h1>
              <p className="text-green-300 text-lg mb-6">
                Normal rhythm detected
              </p>
              <p className="text-[#AAAAAA] text-base">
                Continue CPR compressions immediately
              </p>
            </div>

            <Link href="/emergency/cpr" className="block">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
              >
                Resume CPR →
              </button>
            </Link>
          </div>
        )}

        {phase === 'result' && shouldShock && (
          <div className="text-center space-y-8 animate-fade-in">
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-900 to-red-800 bg-opacity-50 border border-red-500 border-opacity-60 rounded-full">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-red-300">SHOCK ADVISED</span>
            </div>

            {/* Result Card */}
            <div className="bg-gradient-to-br from-[#2A0D0D] to-[#1A0D0D] border-2 border-[#E10600] border-opacity-60 rounded-2xl p-12 backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.15), 0 0 40px rgba(225, 6, 0, 0.25)' }}
            >
              <h1 className="text-5xl font-black text-[#FF3B3B] mb-4 tracking-wide">
                ⚡ SHOCK ADVISED
              </h1>
              <p className="text-[#FF3B3B] text-lg mb-6 font-semibold">
                Abnormal rhythm detected
              </p>
              <div className="space-y-3">
                <p className="text-[#F5F5F5] text-base font-semibold">Prepare for shock delivery:</p>
                <ul className="text-[#AAAAAA] text-sm space-y-2">
                  <li>✓ Ensure everyone is clear of patient</li>
                  <li>✓ Apply pads to dry chest</li>
                  <li>✓ Stand back from patient</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setPhase('shock')}
              className="w-full px-8 py-5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              ⚡ DELIVER SHOCK
            </button>
          </div>
        )}

        {phase === 'shock' && (
          <div className="text-center space-y-8 animate-fade-in">
            {/* Shock Delivered Card */}
            <div className="bg-gradient-to-br from-[#2A0D0D] to-[#1A0D0D] border-2 border-[#E10600] rounded-2xl p-12 backdrop-blur-sm animate-glow-flash"
              style={{ boxShadow: 'inset 0 0 50px rgba(225, 6, 0, 0.2), 0 0 60px rgba(225, 6, 0, 0.4)' }}
            >
              <h1 className="text-6xl font-black text-[#FF3B3B] mb-8 animate-pulse">
                ⚡ SHOCK DELIVERED
              </h1>

              <div className="my-8 text-7xl animate-scale-pulse">
                ⚡
              </div>

              <p className="text-[#F5F5F5] text-2xl font-black mb-6 tracking-wide">
                STAND CLEAR
              </p>

              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-20 mb-6">
                <p className="text-[#FF3B3B] text-sm font-bold">
                  ⚠ DO NOT TOUCH PATIENT
                </p>
              </div>

              <p className="text-[#AAAAAA] text-lg">
                Resuming CPR immediately...
              </p>
            </div>

            {/* Auto Resume Info */}
            <div className="text-center text-[#AAAAAA] text-sm">
              <p>After shock, continue with 30 chest compressions</p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <Link href="/emergency/breathing" className="block pt-4">
          <button className="text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors font-medium">
            ← Back
          </button>
        </Link>
      </div>
    </main>
  )
}
