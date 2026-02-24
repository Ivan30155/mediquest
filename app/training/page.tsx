'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SessionData {
  totalCompressions: number
  totalCorrect: number
  bpmReadings: number[]
  sessionTime: number
}

export default function TrainingPage() {
  const [compressions, setCompressions] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [bpm, setBpm] = useState(0)
  const [rhythm, setRhythm] = useState('Waiting...')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [totalTime, setTotalTime] = useState(0)

  const compressionTimesRef = useRef<number[]>([])
  const sessionStartRef = useRef<number>(0)
  const correctCompressionRef = useRef(0)
  const bpmReadingsRef = useRef<number[]>([])

  // Session timer
  useEffect(() => {
    if (!isSessionActive) return

    const timer = setInterval(() => {
      setTotalTime(t => t + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isSessionActive])

  // Start session
  const startSession = () => {
    setIsSessionActive(true)
    sessionStartRef.current = Date.now()
    setCompressions(0)
    compressionTimesRef.current = []
    correctCompressionRef.current = 0
    bpmReadingsRef.current = []
    setTotalTime(0)
    setSessionData(null)
  }

  // Handle compression
  const handleCompression = () => {
    if (!isSessionActive) return

    const now = Date.now()
    compressionTimesRef.current.push(now)

    const newCompressions = compressions + 1
    setCompressions(newCompressions)

    // Calculate BPM
    if (compressionTimesRef.current.length > 1) {
      const recent = compressionTimesRef.current.slice(-11)
      const timeDiff = recent[recent.length - 1] - recent[0]
      const intervalsCount = recent.length - 1
      const avgInterval = timeDiff / intervalsCount
      const calculatedBpm = Math.round(60000 / avgInterval)

      setBpm(calculatedBpm)
      bpmReadingsRef.current.push(calculatedBpm)

      // Check rhythm accuracy
      if (calculatedBpm >= 100 && calculatedBpm <= 120) {
        setFeedback('Perfect Rhythm! ✓')
        setRhythm('Perfect')
        correctCompressionRef.current++
      } else if (calculatedBpm < 100) {
        setFeedback('Push Faster!')
        setRhythm('Too Slow')
      } else {
        setFeedback('Slow Down!')
        setRhythm('Too Fast')
      }
    } else {
      setFeedback('Keep going...')
    }
  }

  // End session
  const endSession = () => {
    setIsSessionActive(false)

    const avgBpm = bpmReadingsRef.current.length > 0
      ? Math.round(
        bpmReadingsRef.current.reduce((a, b) => a + b, 0) / bpmReadingsRef.current.length
      )
      : 0

    const accuracyPercent = compressions > 0
      ? Math.round((correctCompressionRef.current / compressions) * 100)
      : 0

    setSessionData({
      totalCompressions: compressions,
      totalCorrect: correctCompressionRef.current,
      bpmReadings: bpmReadingsRef.current,
      sessionTime: totalTime,
    })

    // Determine rhythm rating
    if (accuracyPercent >= 80) {
      setRhythm('Excellent')
    } else if (accuracyPercent >= 60) {
      setRhythm('Good')
    } else if (accuracyPercent >= 40) {
      setRhythm('Fair')
    } else {
      setRhythm('Needs Improvement')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A0000] to-[#0D0D0D] flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E10600] rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-3xl space-y-8">
        <div className="text-center mb-8 animate-float-up">
          <h1 className="text-5xl font-black text-[#F5F5F5] mb-2">📊 TRAINING MODE</h1>
          <p className="text-lg text-[#AAAAAA] font-light">Master your CPR technique with real-time feedback</p>
        </div>

        {!sessionData && !isSessionActive && (
          <>
            {/* Welcome Screen */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-10 space-y-6 text-center backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
            >
              <h2 className="text-3xl font-bold text-[#F5F5F5]">Ready to Train?</h2>
              <p className="text-[#AAAAAA] text-base leading-relaxed">
                This session measures your compression rate, rhythm accuracy, and overall performance with detailed analytics.
              </p>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-20">
                <p className="text-sm text-[#AAAAAA]">
                  <span className="text-[#FF3B3B] font-bold">Target:</span> 100-120 compressions per minute
                </p>
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full px-8 py-6 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              ▶ Start Training Session
            </button>
          </>
        )}

        {isSessionActive && !sessionData && (
          <>
            {/* Training Session Active - Grid Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Compression Counter */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 text-center backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-2">Compressions</p>
                <div className="text-7xl font-black text-[#FF3B3B] tabular-nums animate-scale-pulse">
                  {compressions}
                </div>
              </div>

              {/* Session Timer */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 text-center backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-2">Session Time</p>
                <p className="text-5xl font-black text-[#F5F5F5] font-mono">
                  {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}
                </p>
              </div>

              {/* BPM Display */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 text-center backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-2">Current BPM</p>
                <p className="text-5xl font-black text-[#F5F5F5] font-mono">
                  {bpm > 0 ? bpm : '—'}
                </p>
              </div>

              {/* Rhythm Status */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 text-center backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-2">Rhythm Status</p>
                <p className="text-3xl font-bold text-[#F5F5F5]">
                  {rhythm === 'Perfect' && '✓ Perfect'}
                  {rhythm === 'Too Slow' && '⬆ Too Slow'}
                  {rhythm === 'Too Fast' && '⬇ Too Fast'}
                  {rhythm === 'Waiting...' && '⏳ Waiting'}
                </p>
              </div>
            </div>

            {/* Feedback */}
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FF3B3B] min-h-10">
                {feedback}
              </p>
            </div>

            {/* Main Tap Button */}
            <button
              onClick={handleCompression}
              className="w-full py-16 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white text-3xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              👆 TAP FOR COMPRESSION
            </button>

            {/* End Session Button */}
            {compressions > 0 && (
              <button
                onClick={endSession}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] text-white font-bold rounded-xl transition-all duration-300 border border-[#E10600] border-opacity-20"
              >
                ⏹ End Session
              </button>
            )}
          </>
        )}

        {sessionData && (
          <>
            {/* Performance Summary Header */}
            <div className="text-center animate-float-up">
              <h2 className="text-4xl font-black text-[#F5F5F5] mb-2">✓ Session Complete</h2>
              <p className="text-lg text-[#AAAAAA]">Performance Summary & Analytics</p>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Total Compressions */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-3">Total Compressions</p>
                <p className="text-5xl font-black text-[#FF3B3B]">
                  {sessionData.totalCompressions}
                </p>
              </div>

              {/* Average BPM */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-3">Average BPM</p>
                <p className="text-5xl font-black text-[#F5F5F5] font-mono">
                  {sessionData.bpmReadings.length > 0
                    ? Math.round(
                      sessionData.bpmReadings.reduce((a, b) => a + b, 0) /
                      sessionData.bpmReadings.length
                    )
                    : 0}
                </p>
              </div>

              {/* Accuracy Percentage */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-3">Rhythm Accuracy</p>
                <div className="flex items-end gap-2">
                  <p className="text-5xl font-black text-[#F5F5F5]">
                    {sessionData.totalCompressions > 0
                      ? Math.round(
                        (sessionData.totalCorrect / sessionData.totalCompressions) * 100
                      )
                      : 0}
                  </p>
                  <p className="text-3xl text-[#AAAAAA] pb-1">%</p>
                </div>
              </div>

              {/* Session Duration */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
              >
                <p className="text-[#AAAAAA] text-sm uppercase tracking-wide mb-3">Duration</p>
                <p className="text-4xl font-black text-[#F5F5F5] font-mono">
                  {Math.floor(sessionData.sessionTime / 60)}:{String(sessionData.sessionTime % 60).padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Rhythm Rating Card */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#E10600] border-opacity-40 rounded-2xl p-10 text-center backdrop-blur-sm"
              style={{ boxShadow: 'inset 0 0 50px rgba(225, 6, 0, 0.12), 0 0 40px rgba(225, 6, 0, 0.2)' }}
            >
              <p className="text-[#AAAAAA] text-sm uppercase tracking-widest mb-4">Overall Performance</p>
              <p className="text-6xl font-black text-[#FF3B3B] mb-4">
                {rhythm === 'Excellent' && '★ Excellent'}
                {rhythm === 'Good' && '★ Good'}
                {rhythm === 'Fair' && '★ Fair'}
                {rhythm === 'Needs Improvement' && '⚠ Needs Improvement'}
              </p>
              <p className="text-[#AAAAAA] text-lg">
                {rhythm === 'Excellent' && '🎉 Outstanding performance! You are ready for real emergencies.'}
                {rhythm === 'Good' && '👍 Great job! Continue practicing to maintain consistency.'}
                {rhythm === 'Fair' && '⚡ Good effort. Focus on rhythm consistency in your next session.'}
                {rhythm === 'Needs Improvement' && '💪 Keep training. Each session will improve your technique.'}
              </p>
            </div>

            {/* Restart Button */}
            <button
              onClick={startSession}
              className="w-full px-8 py-6 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              🔄 Train Again
            </button>
          </>
        )}

        {/* Home Button */}
        <Link href="/" className="block pt-4">
          <button className="text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors font-medium">
            ← Back to Home
          </button>
        </Link>
      </div>
    </main>
  )
}
