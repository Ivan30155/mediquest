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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TRAINING MODE</h1>
          <p className="text-gray-400">Practice your CPR technique</p>
        </div>

        {!sessionData && !isSessionActive && (
          <>
            {/* Welcome Screen */}
            <div className="bg-gray-900 border-2 border-gray-700 p-8 rounded-lg space-y-4 text-center">
              <h2 className="text-2xl font-bold text-white">Ready to Train?</h2>
              <p className="text-gray-300">
                This session will measure your compression rate and accuracy.
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Target: 100-120 compressions per minute with consistent rhythm.
              </p>
            </div>

            <Button
              onClick={startSession}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-6 rounded-lg"
            >
              Start Training Session
            </Button>
          </>
        )}

        {isSessionActive && !sessionData && (
          <>
            {/* Training Session Active */}
            <div className="text-center">
              <div className="text-7xl font-bold text-red-600 tabular-nums mb-4">
                {compressions}
              </div>
              <p className="text-gray-400 text-lg mb-8">Compressions</p>

              {/* Time */}
              <div className="bg-gray-900 p-4 rounded-lg mb-6">
                <p className="text-gray-400 text-sm">Session Time</p>
                <p className="text-2xl font-bold text-white">
                  {Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}
                </p>
              </div>

              {/* Feedback */}
              <div className="text-center space-y-4 mb-8">
                <div className="text-2xl font-bold text-white min-h-8">
                  {feedback}
                </div>
                {bpm > 0 && (
                  <div className="text-lg text-gray-300">
                    {bpm} BPM - {rhythm}
                  </div>
                )}
              </div>
            </div>

            {/* Main Tap Button */}
            <button
              onClick={handleCompression}
              className="w-full py-16 bg-red-600 hover:bg-red-700 text-white text-2xl font-bold rounded-lg transition-colors active:bg-red-800"
            >
              TAP FOR COMPRESSION
            </button>

            {/* End Session Button */}
            {compressions > 0 && (
              <Button
                onClick={endSession}
                variant="outline"
                className="w-full border-2 border-gray-600 text-gray-300 hover:text-white py-6 rounded-lg font-bold"
              >
                End Session
              </Button>
            )}
          </>
        )}

        {sessionData && (
          <>
            {/* Performance Summary */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Session Complete</h2>
                <p className="text-gray-400">Performance Summary</p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4">
                <div className="bg-gray-900 border-2 border-red-600 p-6 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Total Compressions</p>
                  <p className="text-4xl font-bold text-red-600">
                    {sessionData.totalCompressions}
                  </p>
                </div>

                <div className="bg-gray-900 border-2 border-blue-600 p-6 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Average BPM</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {sessionData.bpmReadings.length > 0
                      ? Math.round(
                        sessionData.bpmReadings.reduce((a, b) => a + b, 0) /
                        sessionData.bpmReadings.length
                      )
                      : 0}
                  </p>
                </div>

                <div className="bg-gray-900 border-2 border-green-600 p-6 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Accuracy</p>
                  <p className="text-4xl font-bold text-green-600">
                    {sessionData.totalCompressions > 0
                      ? Math.round(
                        (sessionData.totalCorrect / sessionData.totalCompressions) * 100
                      )
                      : 0}
                    %
                  </p>
                </div>

                <div className="bg-gray-900 border-2 border-yellow-600 p-6 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Rhythm Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {rhythm}
                  </p>
                </div>

                <div className="bg-gray-900 border-2 border-purple-600 p-6 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Session Duration</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.floor(sessionData.sessionTime / 60)}:{String(sessionData.sessionTime % 60).padStart(2, '0')}
                  </p>
                </div>
              </div>

              {/* Feedback Text */}
              <div className="bg-gray-900 p-6 rounded-lg text-center">
                <p className="text-white text-lg font-semibold mb-2">
                  {rhythm === 'Excellent' && '🎉 Outstanding performance!'}
                  {rhythm === 'Good' && '👍 Great job! Keep practicing.'}
                  {rhythm === 'Fair' && '⚠️ Good effort. More practice needed.'}
                  {rhythm === 'Needs Improvement' && '💪 Keep training to improve.'}
                </p>
              </div>
            </div>

            {/* Restart Button */}
            <Button
              onClick={startSession}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-6 rounded-lg"
            >
              Train Again
            </Button>
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
