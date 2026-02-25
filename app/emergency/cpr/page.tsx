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

  const COMPRESSION_INTERVAL = 500 // 120 BPM (500ms per beat)

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
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A0000] to-[#0D0D0D] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E10600] rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        {/* Initial Screen */}
        {phase === 'initial' && (
          <div className="w-full max-w-2xl px-6 space-y-8 text-center animate-slide-in">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] text-[#F5F5F5] font-bold rounded-full text-sm">
                Step 3 of 4
              </span>
            </div>

            {/* Header */}
            <div className="space-y-3">
              <h1 className="text-5xl font-black tracking-tight text-[#F5F5F5]">
                ♥ CPR GUIDANCE
              </h1>
              <p className="text-lg text-[#AAAAAA] font-light">Follow the rhythm. Stay focused.</p>
            </div>

            {/* Card Container */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-12 backdrop-blur-sm" style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08), 0 0 40px rgba(225, 6, 0, 0.15)' }}>
              <div className="space-y-8">
                {/* Instructions */}
                <div className="space-y-4">
                  <p className="text-2xl font-bold text-[#F5F5F5]">PREPARATION</p>
                  <div className="space-y-3 text-lg text-[#AAAAAA]">
                    <p className="flex items-center justify-center gap-3">
                      <span className="text-[#E10600] font-bold">1</span>
                      Place hands in center of chest
                    </p>
                    <p className="flex items-center justify-center gap-3">
                      <span className="text-[#E10600] font-bold">2</span>
                      Prepare to begin compressions
                    </p>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartCPR}
                  className="w-full py-6 px-6 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white text-2xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
                >
                  ▶ START CPR
                </button>

                {/* BPM Info */}
                <div className="flex items-center justify-center gap-3 text-[#AAAAAA]">
                  <span className="text-2xl font-black text-[#E10600]">120</span>
                  <span className="text-lg">BPM Target Rate</span>
                  <span className="text-2xl animate-heartbeat">♥</span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <Link href="/emergency/breathing">
              <button className="text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors font-medium">
                ← Previous Step
              </button>
            </Link>
          </div>
        )}

        {/* Countdown Screen */}
        {phase === 'countdown' && (
          <div className="text-center space-y-12 animate-fade-in">
            <p className="text-3xl font-semibold text-[#FF3B3B] tracking-wider">PREPARE YOURSELF</p>
            <div className="relative">
              <div className="absolute inset-0 animate-pulse">
                <div className="w-48 h-48 mx-auto rounded-full border-2 border-[#E10600] border-opacity-40" />
              </div>
              <div className="text-9xl font-black text-[#FF3B3B] tabular-nums drop-shadow-lg animate-scale-pulse" style={{ textShadow: '0 0 50px rgba(225, 6, 0, 0.8)' }}>
                {countdown}
              </div>
            </div>
          </div>
        )}

        {/* Compressions Screen */}
        {phase === 'compressions' && (
          <div className="w-full max-w-2xl px-6 flex flex-col items-center justify-center space-y-10 animate-fade-in">
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-900 to-green-800 bg-opacity-50 border border-green-500 border-opacity-60 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-green-300 tracking-wide">CPR ACTIVE</span>
            </div>

            {/* Pulse Ring Animation */}
            <div className="relative h-72 w-72 flex items-center justify-center">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-2 border-[#E10600] border-opacity-20" />

              {/* Glow circle */}
              {pulseEffect && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E10600] to-transparent opacity-20 animate-scale-pulse" />
              )}

              {/* Pulse rings */}
              {pulseEffect && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-[#FF3B3B] border-opacity-50 animate-ping" style={{ animationDuration: '0.6s' }} />
                  <div className="absolute inset-6 rounded-full border border-[#E10600] border-opacity-30 animate-ping" style={{ animationDuration: '0.6s', animationDelay: '0.1s' }} />
                </>
              )}

              {/* Compression Counter */}
              <div className="relative z-10 text-center space-y-2">
                <div className="text-8xl font-black text-[#FF3B3B] tabular-nums drop-shadow-lg transition-all duration-75 animate-scale-pulse" style={{ textShadow: '0 0 40px rgba(225, 6, 0, 0.8)' }}>
                  {compressionCountRef.current}
                </div>
                <div className="text-[#AAAAAA] text-lg font-bold">/ 30</div>
              </div>

              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(225, 6, 0, 0.1)" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#E10600"
                  strokeWidth="2.5"
                  strokeDasharray={`${(compressionCountRef.current / 30) * 282.7} 282.7`}
                  className="transition-all duration-75"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* BPM Display */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl px-8 py-6 shadow-lg" style={{ boxShadow: 'inset 0 0 30px rgba(225, 6, 0, 0.08), 0 0 30px rgba(225, 6, 0, 0.2)' }}>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-5xl font-black text-[#FF3B3B] font-mono">120</div>
                  <div className="text-[#AAAAAA] text-sm font-bold mt-1">BPM</div>
                </div>
                <span className="text-4xl animate-heartbeat">♥</span>
              </div>
            </div>

            {/* Guidance Text */}
            <div className="text-center space-y-6 max-w-md">
              <h2 className="text-5xl md:text-6xl font-black text-[#F5F5F5] tracking-tight">Push Hard</h2>
              <div className="space-y-3 text-[#AAAAAA]">
                <p className="text-3xl font-bold text-[#FF3B3B]">120 per minute</p>
                <p className="text-xl font-semibold text-[#AAAAAA]">5–6 cm depth</p>
              </div>
            </div>

            {/* Stop Button */}
            <button
              onClick={handleStopCPR}
              className="px-12 py-4 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] text-[#F5F5F5] font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-[#E10600] border-opacity-20"
            >
              ⏹ STOP CPR
            </button>
          </div>
        )}

        {/* Breathing Screen */}
        {phase === 'breathing' && (
          <div className="w-full max-w-2xl px-6 flex flex-col items-center justify-center space-y-12 animate-fade-in">
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-800 bg-opacity-50 border border-blue-500 border-opacity-60 rounded-full">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-blue-300 tracking-wide">BREATH PHASE</span>
            </div>

            {/* Breathing Counter */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E10600] from-20% to-transparent opacity-10 animate-pulse" />
              <div className="text-9xl font-black text-[#FF3B3B] drop-shadow-lg animate-scale-pulse" style={{ textShadow: '0 0 40px rgba(225, 6, 0, 0.8)' }}>
                {breathCount}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-4 max-w-md">
              <h1 className="text-5xl font-black text-[#F5F5F5] tracking-tight">Give 2 Breaths</h1>
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-6 space-y-3" style={{ boxShadow: 'inset 0 0 30px rgba(225, 6, 0, 0.08)' }}>
                <p className="text-lg font-bold text-[#FF3B3B]">Rescue Breathing</p>
                <p className="text-[#AAAAAA] text-sm leading-relaxed">
                  Tilt head back, lift chin. Give slow, deep breath. Resuming CPR in {breathCount === 2 ? '1' : '2'} second...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </main>
  )
}
