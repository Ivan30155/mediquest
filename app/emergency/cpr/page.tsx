'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CPRPage() {
  const [compressions, setCompressions] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [bpm, setBpm] = useState(0)
  const [rhythm, setRhythm] = useState('Waiting...')
  const [phase, setPhase] = useState<'counting' | 'breathing' | 'aed'>('counting')
  const [breathTimer, setBreathTimer] = useState(0)
  const [showAED, setShowAED] = useState(false)
  const [aedShock, setAedShock] = useState(false)

  const compressionTimesRef = useRef<number[]>([])
  const metronomeRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const isMetronomePlayingRef = useRef(false)

  // Initialize Web Audio API
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    metronomeRef.current = audioContext
  }, [])

  // Play beep for metronome
  const playBeep = (frequency = 880, duration = 100) => {
    if (!metronomeRef.current) return

    try {
      const ctx = metronomeRef.current
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

  // Start metronome (110 BPM)
  const startMetronome = () => {
    if (isMetronomePlayingRef.current) return

    isMetronomePlayingRef.current = true
    const beatInterval = (60 / 110) * 1000 // 110 BPM

    const metronomeInterval = setInterval(() => {
      if (phase === 'counting' && isCompressing) {
        playBeep(880, 50)
      } else if (!isCompressing) {
        clearInterval(metronomeInterval)
        isMetronomePlayingRef.current = false
      }
    }, beatInterval)
  }

  // Handle compression tap
  const handleCompression = () => {
    if (phase !== 'counting') return

    const now = Date.now()
    compressionTimesRef.current.push(now)

    if (compressionTimesRef.current.length === 1) {
      startMetronome()
      setIsCompressing(true)
    }

    const newCompressions = compressions + 1
    setCompressions(newCompressions)

    // Calculate BPM from last 10 compressions
    if (compressionTimesRef.current.length > 1) {
      const recent = compressionTimesRef.current.slice(-11)
      const timeDiff = recent[recent.length - 1] - recent[0]
      const intervalsCount = recent.length - 1
      const avgInterval = timeDiff / intervalsCount
      const calculatedBpm = Math.round((60000 / avgInterval) * compressionTimesRef.current.length / compressions)

      setBpm(calculatedBpm)

      // Provide feedback
      if (calculatedBpm < 100) {
        setFeedback('Push Faster!')
        setRhythm('Too Slow')
      } else if (calculatedBpm > 120) {
        setFeedback('Slow Down!')
        setRhythm('Too Fast')
      } else {
        setFeedback('Perfect Rhythm!')
        setRhythm('Perfect')
      }

      playBeep(440, 80)
    }

    // After 30 compressions, move to breathing
    if (newCompressions >= 30) {
      setCompressions(0)
      compressionTimesRef.current = []
      setIsCompressing(false)
      setPhase('breathing')
      setBreathTimer(2)
    }
  }

  // Breathing timer
  useEffect(() => {
    if (phase !== 'breathing') return

    if (breathTimer > 0) {
      const timer = setTimeout(() => setBreathTimer(breathTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (breathTimer === 0 && phase === 'breathing') {
      // Move to AED check
      const random = Math.random() > 0.6
      setAedShock(random)
      setShowAED(true)
      setPhase('aed')
    }
  }, [breathTimer, phase])

  // AED auto-resolution
  useEffect(() => {
    if (showAED) {
      const timer = setTimeout(() => {
        setShowAED(false)
        if (aedShock) {
          // After shock, return to CPR
          setPhase('counting')
        } else {
          // No shock needed, resume CPR
          setPhase('counting')
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showAED, aedShock])

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Counter - Main Feature */}
        {phase === 'counting' && (
          <>
            <div className="text-center">
              <h1 className="text-gray-400 text-lg mb-4">COMPRESSIONS</h1>
              <div className="text-9xl font-bold text-red-600 tabular-nums">
                {compressions}
              </div>
              <p className="text-gray-400 mt-4 text-lg">/30</p>
            </div>

            {/* Feedback */}
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-white min-h-12">
                {feedback}
              </div>
              <div className="text-lg text-gray-300">
                {bpm > 0 && `${bpm} BPM - ${rhythm}`}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-900 p-6 rounded-lg border-2 border-red-600 text-center">
              <p className="text-white text-lg font-semibold mb-4">Push hard and fast</p>
              <p className="text-gray-300 text-sm">
                Compress the chest at least 2 inches deep at a rate of 100-120 compressions per minute
              </p>
            </div>

            {/* Tap Button */}
            <button
              onClick={handleCompression}
              className="w-full py-16 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold rounded-lg transition-colors active:bg-red-800"
            >
              TAP FOR COMPRESSION
            </button>

            {/* AED Button */}
            {compressions > 0 && (
              <Link href="/emergency/aed" className="block">
                <Button
                  variant="outline"
                  className="w-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black py-6 rounded-lg font-bold"
                >
                  Get AED
                </Button>
              </Link>
            )}
          </>
        )}

        {/* Breathing Phase */}
        {phase === 'breathing' && (
          <>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-8">GIVE 2 BREATHS</h1>

              <div className="text-8xl font-bold text-red-600 mb-8">
                {breathTimer}
              </div>

              <p className="text-gray-300 text-lg mb-4">
                Tilt head back, lift chin
              </p>
              <p className="text-gray-300 text-lg">
                Give slow, deep breaths
              </p>
            </div>
          </>
        )}

        {/* AED Phase */}
        {showAED && (
          <div className="text-center space-y-8">
            <div className="bg-yellow-900 border-4 border-yellow-500 p-8 rounded-lg space-y-4">
              <h2 className="text-3xl font-bold text-yellow-400">AED ANALYZING</h2>
              <div className="animate-pulse">
                <p className="text-white text-lg">Scanning for abnormal rhythm...</p>
              </div>
            </div>

            {aedShock && (
              <div className="bg-red-900 border-4 border-red-500 p-8 rounded-lg space-y-4">
                <h2 className="text-3xl font-bold text-red-400">SHOCK ADVISED</h2>
                <p className="text-white text-lg">
                  Apply pads and deliver shock
                </p>
                <div className="text-6xl font-bold text-red-500 animate-pulse">⚡</div>
                <p className="text-gray-300 text-sm mt-6">STAND CLEAR - SHOCK DEPLOYING</p>
              </div>
            )}

            {!aedShock && (
              <div className="bg-green-900 border-4 border-green-500 p-8 rounded-lg space-y-4">
                <h2 className="text-3xl font-bold text-green-400">NO SHOCK</h2>
                <p className="text-white text-lg">
                  Continue CPR
                </p>
              </div>
            )}
          </div>
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
