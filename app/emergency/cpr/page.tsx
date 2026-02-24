'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Phase = 'initial' | 'countdown' | 'compressions' | 'breathing'

export default function CPRPage() {
  const [phase, setPhase] = useState<Phase>('initial')
  const [countdown, setCountdown] = useState(5)
  const [pulseEffect, setPulseEffect] = useState(false)
  const [breathCount, setBreathCount] = useState(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const compressionCountRef = useRef(0)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)

  const COMPRESSION_INTERVAL = 545 // 110 BPM

  // Initialize Web Audio API
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = audioContext
  }, [])

  // Play single beep
  const playBeep = () => {
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

      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch (e) {
      console.error('Beep error:', e)
    }
  }

  // Start countdown
  const startCountdown = () => {
    setPhase('countdown')
    setCountdown(5)

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          playBeep()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle countdown completion
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      setTimeout(() => {
        setPhase('compressions')
        startMetronome()
      }, 500)
    }
  }, [countdown, phase])

  // Start metronome
  const startMetronome = () => {
    if (!isRunningRef.current) return
    compressionCountRef.current = 0
    setPulseEffect(false)

    metronomeIntervalRef.current = setInterval(() => {
      playBeep()
      setPulseEffect(true)
      setTimeout(() => setPulseEffect(false), 150)

      compressionCountRef.current += 1

      // After 30 compressions, pause and show breathing
      if (compressionCountRef.current >= 30) {
        if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current)
        setPhase('breathing')
        setBreathCount(1)
      }
    }, COMPRESSION_INTERVAL)
  }

  // Handle breathing phase
  useEffect(() => {
    if (phase !== 'breathing') return

    if (breathCount === 1) {
      breathIntervalRef.current = setTimeout(() => {
        setBreathCount(2)
      }, 1000)
    } else if (breathCount === 2) {
      breathIntervalRef.current = setTimeout(() => {
        // Resume compressions
        setPhase('compressions')
        startMetronome()
      }, 1000)
    }

    return () => {
      if (breathIntervalRef.current) clearTimeout(breathIntervalRef.current)
    }
  }, [phase, breathCount])

  // Start CPR
  const handleStartCPR = () => {
    isRunningRef.current = true
    startCountdown()
  }

  // Stop CPR
  const handleStopCPR = () => {
    isRunningRef.current = false
    setPhase('initial')
    setCountdown(5)
    setPulseEffect(false)
    setBreathCount(0)
    compressionCountRef.current = 0

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current)
    if (breathIntervalRef.current) clearTimeout(breathIntervalRef.current)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current)
      if (breathIntervalRef.current) clearTimeout(breathIntervalRef.current)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full h-screen flex flex-col items-center justify-center">
        {/* Initial Screen */}
        {phase === 'initial' && (
          <div className="w-full max-w-md space-y-8 text-center">
            <h1 className="text-4xl font-bold text-white">CPR GUIDANCE</h1>

            <div className="space-y-4 text-gray-300">
              <p className="text-xl">Place hands in center of chest</p>
              <p className="text-lg">Prepare to begin compressions</p>
            </div>

            <button
              onClick={handleStartCPR}
              className="w-full py-20 bg-red-600 hover:bg-red-700 text-white text-3xl font-bold rounded-lg transition-colors"
            >
              Start CPR
            </button>

            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white py-4"
              >
                ← Back
              </Button>
            </Link>
          </div>
        )}

        {/* Countdown Screen */}
        {phase === 'countdown' && (
          <div className="text-center space-y-12">
            {countdown > 0 ? (
              <>
                <p className="text-gray-400 text-2xl">Prepare yourself</p>
                <div className="text-9xl font-bold text-red-600">
                  {countdown}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-2xl">Starting...</p>
            )}
          </div>
        )}

        {/* Compressions Screen */}
        {phase === 'compressions' && (
          <div className="text-center space-y-12 w-full">
            {/* Animated Pulse Circle */}
            <div className="flex justify-center">
              <div
                className={`w-48 h-48 rounded-full border-4 border-red-600 transition-all duration-150 ${
                  pulseEffect ? 'scale-110 bg-red-600 bg-opacity-20' : 'bg-transparent'
                }`}
              />
            </div>

            {/* Guidance Text */}
            <div className="space-y-6 px-4">
              <h2 className="text-6xl font-bold text-white">Push Hard</h2>

              <div className="space-y-3 text-gray-300">
                <p className="text-3xl font-semibold">100–120 per minute</p>
                <p className="text-2xl">5–6 cm depth</p>
              </div>
            </div>

            {/* Stop Button */}
            <button
              onClick={handleStopCPR}
              className="w-32 py-4 mx-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors text-lg"
            >
              Stop
            </button>
          </div>
        )}

        {/* Breathing Screen */}
        {phase === 'breathing' && (
          <div className="text-center space-y-12">
            <h1 className="text-5xl font-bold text-white">Give 2 Breaths</h1>

            <div className="text-8xl font-bold text-red-600">
              {breathCount}
            </div>

            <div className="text-xl text-gray-300 max-w-md">
              <p>Tilt head back, lift chin</p>
              <p className="mt-2">Give slow, deep breath</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
