'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CPRPage() {
  const [compressions, setCompressions] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<'counting' | 'breathing'>('counting')
  const [breathTimer, setBreathTimer] = useState(0)
  const [pulseEffect, setPulseEffect] = useState(false)

  const compressionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const COMPRESSION_INTERVAL = 545 // 110 BPM = 545ms per compression

  // Initialize Web Audio API
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = audioContext
  }, [])

  // Play beep
  const playBeep = (frequency = 880, duration = 100) => {
    if (!audioContextRef.current) return

    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration / 1000)
    } catch (e) {
      console.error('Beep error:', e)
    }
  }

  // Start CPR compressions
  const startCPR = () => {
    setIsRunning(true)
    setPhase('counting')
    setCompressions(0)

    compressionIntervalRef.current = setInterval(() => {
      setCompressions((prev) => {
        const next = prev + 1
        playBeep(880, 50)
        setPulseEffect(true)
        setTimeout(() => setPulseEffect(false), 100)

        // After 30 compressions, move to breathing
        if (next >= 30) {
          if (compressionIntervalRef.current) {
            clearInterval(compressionIntervalRef.current)
          }
          setPhase('breathing')
          setBreathTimer(2)
          return 0
        }
        return next
      })
    }, COMPRESSION_INTERVAL)
  }

  // Breathing timer
  useEffect(() => {
    if (phase !== 'breathing' || !isRunning) return

    if (breathTimer > 0) {
      breathIntervalRef.current = setTimeout(() => {
        setBreathTimer(breathTimer - 1)
      }, 1000)
      return () => {
        if (breathIntervalRef.current) clearTimeout(breathIntervalRef.current)
      }
    } else if (breathTimer === 0) {
      // Resume compressions
      setPhase('counting')
      setCompressions(0)
      startCPR()
    }
  }, [breathTimer, phase, isRunning])

  // Stop CPR
  const stopCPR = () => {
    setIsRunning(false)
    setPhase('counting')
    setCompressions(0)
    setBreathTimer(0)

    if (compressionIntervalRef.current) {
      clearInterval(compressionIntervalRef.current)
      compressionIntervalRef.current = null
    }
    if (breathIntervalRef.current) {
      clearTimeout(breathIntervalRef.current)
      breathIntervalRef.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (compressionIntervalRef.current) clearInterval(compressionIntervalRef.current)
      if (breathIntervalRef.current) clearTimeout(breathIntervalRef.current)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {phase === 'counting' && isRunning && (
          <>
            {/* BPM Display */}
            <div className="text-center">
              <p className="text-gray-400 text-lg">110 BPM</p>
            </div>

            {/* Compression Counter with Pulse */}
            <div className="text-center">
              <div
                className={`text-9xl font-bold text-red-600 tabular-nums transition-transform duration-100 ${
                  pulseEffect ? 'scale-110' : 'scale-100'
                }`}
              >
                {compressions}
              </div>
              <p className="text-gray-400 mt-4 text-lg">/30</p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-900 p-6 rounded-lg border-2 border-red-600 text-center">
              <p className="text-white text-lg font-semibold">Push hard and fast</p>
              <p className="text-gray-300 text-sm mt-2">
                Compressions running automatically
              </p>
            </div>

            {/* Stop CPR Button */}
            <button
              onClick={stopCPR}
              className="w-full py-6 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
            >
              STOP CPR
            </button>
          </>
        )}

        {phase === 'breathing' && isRunning && (
          <>
            <div className="text-center space-y-8">
              <h1 className="text-4xl font-bold text-white">GIVE 2 BREATHS</h1>

              <div className="text-8xl font-bold text-red-600">
                {breathTimer}
              </div>

              <div className="bg-gray-900 p-6 rounded-lg border-2 border-red-600 text-center">
                <p className="text-white text-lg font-semibold mb-3">Rescue Breathing</p>
                <p className="text-gray-300 text-sm">
                  Tilt head back, lift chin. Give slow, deep breaths. Resume CPR in {breathTimer} second{breathTimer !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          </>
        )}

        {!isRunning && (
          <>
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold text-white">CPR TRAINING</h1>
              <p className="text-gray-400 text-lg">
                Automatic compressions at 110 BPM with rescue breaths
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={startCPR}
              className="w-full py-16 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold rounded-lg transition-colors"
            >
              START CPR
            </button>
          </>
        )}

        {/* Home Button */}
        <Link href="/" className="block pt-4">
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
