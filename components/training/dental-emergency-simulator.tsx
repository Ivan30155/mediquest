'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

  if (gameState === 'case-select') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-10">
            Dental Emergency Simulator
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => handleCaseSelect('silent-allergen')}
              className="bg-red-900 p-6 rounded-xl hover:bg-red-700 transition"
            >
              <h2 className="text-2xl font-bold mb-2">
                The Silent Allergen
              </h2>
              <p>8 Level Advanced Anaphylaxis Simulation</p>
            </button>

            <button
              onClick={() => handleCaseSelect('morning-collapse')}
              className="bg-blue-900 p-6 rounded-xl hover:bg-blue-700 transition"
            >
              <h2 className="text-2xl font-bold mb-2">
                The Morning Collapse
              </h2>
              <p>5 Level Diagnostic Precision Simulation</p>
            </button>
          </div>

          <div className="text-center mt-10">
            <button onClick={() => router.push('/')} className="underline">
              Back to Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (gameState === 'case-complete' && selectedCase) {
    const maxScore = selectedCase.levels.length
    const percentage =
      maxScore > 0
        ? Math.round((score / maxScore) * 100)
        : 0

    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="bg-gray-900 p-10 rounded-2xl max-w-xl w-full text-center">
          <h2 className="text-3xl font-bold mb-6">Case Complete</h2>

          <p className="text-5xl font-bold text-red-500 mb-4">
            {score} / {maxScore}
          </p>

          <p className="text-xl mb-6">
            {percentage}% Accuracy
          </p>

          <div className="space-y-4">
            <button
              onClick={handleRestartCase}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold"
            >
              Try Another Case
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg"
            >
              Return Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (gameState === 'playing' && selectedCase) {
    const currentLevel = selectedCase.levels[currentLevelIndex]
    const isAnswered = showExplanation   // ✅ FIXED HERE

    return (
      <main className="min-h-screen bg-black text-white p-6">
        <div className="max-w-3xl mx-auto">

          <div className="flex justify-between mb-6">
            <p>
              Level {currentLevelIndex + 1} /{' '}
              {selectedCase.levels.length}
            </p>
            <p>
              Score: {score}
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl mb-6">
            <p className="text-sm text-gray-400 mb-2">
              {currentLevel.medicalContext}
            </p>

            <p className="mb-4">
              {currentLevel.scenario}
            </p>

            <h3 className="text-xl font-bold text-red-500 mb-4">
              {currentLevel.question}
            </h3>

            <div className="space-y-3">
              {currentLevel.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3 rounded-lg border ${
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
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
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
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextLevel}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold"
            >
              {currentLevelIndex ===
              selectedCase.levels.length - 1
                ? 'Complete Case'
                : 'Next Level'}
            </button>
          )}
        </div>
      </main>
    )
  }

  return null
}
