'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  SILENT_ALLERGEN,
  MORNING_COLLAPSE,
  type CaseType,
  type SimulationCase,
} from '@/lib/dental-emergency-cases'

type GameState = 'case-select' | 'playing' | 'case-complete'

export default function DentalEmergencySimulator() {
  const router = useRouter()

  const [gameState, setGameState] = useState<GameState>('case-select')
  const [selectedCase, setSelectedCase] = useState<SimulationCase | null>(null)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleCaseSelect = (caseId: CaseType) => {
    const caseData =
      caseId === 'silent-allergen'
        ? SILENT_ALLERGEN
        : MORNING_COLLAPSE

    setSelectedCase(caseData)
    setGameState('playing')
    setCurrentLevelIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  const handleAnswerSelect = (answerId: string) => {
    if (!showExplanation) {
      setSelectedAnswer(answerId)
    }
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !selectedCase) return

    const currentLevel = selectedCase.levels[currentLevelIndex]
    const selectedOption = currentLevel.options.find(
      (opt) => opt.id === selectedAnswer
    )

    if (selectedOption?.isCorrect) {
      setScore((prev) => prev + 1)
    }

    setShowExplanation(true)
  }

  const handleNextLevel = () => {
    if (!selectedCase) return

    if (currentLevelIndex < selectedCase.levels.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setGameState('case-complete')
    }
  }

  const handleRestartCase = () => {
    setGameState('case-select')
    setSelectedCase(null)
    setCurrentLevelIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  // ================= CASE SELECT =================
  if (gameState === 'case-select') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black text-white p-6">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-10">
            Dental Emergency Simulator
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handleCaseSelect('silent-allergen')}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:scale-105 transition"
            >
              <h2 className="text-2xl font-bold mb-2">
                The Silent Allergen
              </h2>
              <p>8 Level Advanced Anaphylaxis Simulation</p>
            </button>

            <button
              onClick={() => handleCaseSelect('morning-collapse')}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl hover:scale-105 transition"
            >
              <h2 className="text-2xl font-bold mb-2">
                The Morning Collapse
              </h2>
              <p>5 Level Diagnostic Precision Simulation</p>
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ================= CASE COMPLETE =================
  if (gameState === 'case-complete' && selectedCase) {
    const maxScore = selectedCase.levels.length
    const percentage =
      maxScore > 0
        ? Math.round((score / maxScore) * 100)
        : 0

    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black text-white p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl max-w-xl w-full text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Case Complete</h2>

          <p className="text-5xl font-bold text-red-400 mb-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]">
            {score} / {maxScore}
          </p>

          <p className="text-xl mb-6">
            {percentage}% Accuracy
          </p>

          <button
            onClick={handleRestartCase}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"
          >
            Try Another Case
          </button>
        </motion.div>
      </main>
    )
  }

  // ================= PLAYING =================
  if (gameState === 'playing' && selectedCase) {
    const currentLevel = selectedCase.levels[currentLevelIndex]

    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white p-6">
        <motion.div
          key={currentLevelIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="flex justify-between mb-4">
            <p>
              Level {currentLevelIndex + 1} /{' '}
              {selectedCase.levels.length}
            </p>
            <p className="font-bold text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.6)]">
              Score: {score}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((currentLevelIndex +
                    (showExplanation ? 1 : 0)) /
                    selectedCase.levels.length) *
                  100
                }%`,
              }}
              transition={{ duration: 0.4 }}
              className="h-3 bg-gradient-to-r from-red-500 to-pink-500"
            />
          </div>

          {/* Question Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl mb-6">
            <p className="text-sm text-gray-400 mb-2">
              {currentLevel.medicalContext}
            </p>

            <p className="mb-4">
              {currentLevel.scenario}
            </p>

            <h3 className="text-xl font-bold text-red-400 mb-4">
              {currentLevel.question}
            </h3>

            <div className="space-y-3">
              {currentLevel.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 transform hover:scale-[1.02] ${
                    showExplanation
                      ? option.isCorrect
                        ? 'border-green-500 bg-green-900'
                        : selectedAnswer === option.id
                        ? 'border-red-500 bg-red-900'
                        : 'border-gray-600 bg-gray-800'
                      : selectedAnswer === option.id
                      ? 'border-red-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-800 hover:border-red-500'
                  }`}
                >
                  {option.id.toUpperCase()}. {option.text}
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl mb-4">
              <p className="mb-2 text-red-400 font-bold">
                Explanation
              </p>
              <p>{currentLevel.explanation}</p>
            </div>
          )}

          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition disabled:opacity-50"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextLevel}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition"
            >
              {currentLevelIndex ===
              selectedCase.levels.length - 1
                ? 'Complete Case'
                : 'Next Level'}
            </button>
          )}
        </motion.div>
      </main>
    )
  }

  return null
}