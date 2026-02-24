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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        {/* Initial Screen */}
        {phase === 'initial' && (
          <div className="w-full max-w-2xl px-6 space-y-8 text-center animate-fade-in">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-5xl font-black tracking-tight text-white">EMERGENCY CPR MODE</h1>
              <p className="text-lg text-gray-400">Follow the rhythm. Stay focused.</p>
            </div>

            {/* Card Container */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-red-500 border-opacity-30 rounded-2xl p-12 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(255, 59, 59, 0.2)' }}>
              <div className="space-y-8">
                {/* Instructions */}
                <div className="space-y-4">
                  <p className="text-2xl font-semibold text-gray-100">PREPARATION</p>
                  <div className="space-y-3 text-lg text-gray-300">
                    <p className="flex items-center justify-center gap-3">
                      <span className="text-red-500 font-bold">•</span>
                      Place hands in center of chest
                    </p>
                    <p className="flex items-center justify-center gap-3">
                      <span className="text-red-500 font-bold">•</span>
                      Prepare to begin compressions
                    </p>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartCPR}
                  className="w-full py-6 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-2xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  START CPR
                </button>

                {/* BPM Info */}
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <span className="text-sm">110 BPM</span>
                  <span className="text-xl">♥</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-300 py-3 transition-colors"
              >
                ← Return to Home
              </Button>
            </Link>
          </div>
        )}

        {/* Countdown Screen */}
        {phase === 'countdown' && (
          <div className="text-center space-y-12 animate-fade-in">
            <p className="text-3xl font-semibold text-red-500/80 tracking-wide">PREPARE YOURSELF</p>
            <div className="relative">
              <div className="absolute inset-0 animate-pulse">
                <div className="w-48 h-48 mx-auto rounded-full border-2 border-red-500 border-opacity-40" />
              </div>
              <div className="text-9xl font-black text-red-600 tabular-nums drop-shadow-lg" style={{ textShadow: '0 0 30px rgba(255, 59, 59, 0.6)' }}>
                {countdown}
              </div>
            </div>
          </div>
        )}

        {/* Compressions Screen */}
        {phase === 'compressions' && (
          <div className="w-full max-w-2xl px-6 flex flex-col items-center justify-center space-y-12 animate-fade-in">
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-900 bg-opacity-40 border border-green-500 border-opacity-60 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-green-300">CPR ACTIVE</span>
            </div>

            {/* Pulse Ring Animation */}
            <div className="relative h-80 w-80 flex items-center justify-center">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-2 border-slate-700 border-opacity-50" />

              {/* Pulse rings */}
              {pulseEffect && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-red-600 border-opacity-0 animate-ping" style={{ animationDuration: '0.8s' }} />
                  <div className="absolute inset-4 rounded-full border border-red-500 border-opacity-30 animate-ping" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                </>
              )}

              {/* Compression Counter */}
              <div className="relative z-10 text-center space-y-4">
                <div className="text-8xl font-black text-red-600 tabular-nums drop-shadow-lg transition-all duration-100" style={{ textShadow: '0 0 30px rgba(255, 59, 59, 0.8)' }}>
                  {compressionCountRef.current}
                </div>
                <div className="text-gray-400 text-xl font-semibold">/ 30</div>
              </div>

              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(100, 116, 139, 0.2)" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgb(239, 68, 68)"
                  strokeWidth="2"
                  strokeDasharray={`${(compressionCountRef.current / 30) * 282.7} 282.7`}
                  className="transition-all duration-100"
                />
              </svg>
            </div>

            {/* BPM Display */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-red-500 border-opacity-30 rounded-xl px-8 py-4 shadow-lg" style={{ boxShadow: '0 0 20px rgba(255, 59, 59, 0.15)' }}>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-black text-red-600 font-mono">110</span>
                <div className="flex flex-col items-start">
                  <span className="text-xl font-bold text-red-500">BPM</span>
                  <span className="text-xs text-gray-400">Target Rate</span>
                </div>
                <span className="text-3xl animate-pulse">♥</span>
              </div>
            </div>

            {/* Guidance Text */}
            <div className="text-center space-y-6 max-w-md">
              <h2 className="text-5xl font-black text-white tracking-tight">Push Hard</h2>
              <div className="space-y-3 text-gray-300">
                <p className="text-2xl font-bold text-red-500">100–120 per minute</p>
                <p className="text-xl font-semibold text-gray-400">5–6 cm depth</p>
              </div>
            </div>

            {/* Stop Button */}
            <button
              onClick={handleStopCPR}
              className="px-12 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              STOP CPR
            </button>
          </div>
        )}

        {/* Breathing Screen */}
        {phase === 'breathing' && (
          <div className="w-full max-w-2xl px-6 flex flex-col items-center justify-center space-y-12 animate-fade-in">
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 bg-opacity-40 border border-blue-500 border-opacity-60 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-blue-300">BREATH PHASE</span>
            </div>

            {/* Breathing Counter */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 from-20% to-transparent opacity-20 animate-pulse" />
              <div className="text-9xl font-black text-blue-400 drop-shadow-lg" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.6)' }}>
                {breathCount}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-4 max-w-md">
              <h1 className="text-5xl font-black text-white tracking-tight">Give 2 Breaths</h1>
              <div className="bg-slate-800 border border-blue-500 border-opacity-30 rounded-xl p-6 space-y-3">
                <p className="text-lg font-semibold text-blue-300">Rescue Breathing</p>
                <p className="text-gray-300 text-sm">
                  Tilt head back, lift chin. Give slow, deep breath. Resuming CPR...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </main>
  )
}
