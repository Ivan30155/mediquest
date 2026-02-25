'use client'

import { useState, useEffect } from 'react'

interface LevelOneProps {
  onComplete: () => void
  updateScore: (points: number, levelScore: number, level: 'one' | 'two' | 'three') => void
}

const SYMPTOMS = [
  { id: 1, name: 'Pale Skin', correct: true, emoji: '😰' },
  { id: 2, name: 'Excessive Sweating', correct: true, emoji: '💦' },
  { id: 3, name: 'Dizziness / Confusion', correct: true, emoji: '🌀' },
  { id: 4, name: 'Slow Pulse', correct: true, emoji: '💓' },
  { id: 5, name: 'Blurred Vision', correct: true, emoji: '👀' },
  { id: 6, name: 'Loud Coughing', correct: false, emoji: '🔊' },
]

export default function LevelOne({ onComplete, updateScore }: LevelOneProps) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [selected, setSelected] = useState<number[]>([])
  const [feedback, setFeedback] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [levelComplete, setLevelComplete] = useState(false)
  const [levelScore, setLevelScore] = useState(0)

  useEffect(() => {
    if (timeLeft === 0 || levelComplete) return

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, levelComplete])

  useEffect(() => {
    if (timeLeft === 0 && !levelComplete) {
      completeLevel()
    }
  }, [timeLeft, levelComplete])

  const toggleSymptom = (id: number) => {
    if (levelComplete) return
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const completeLevel = () => {
    if (levelComplete) return
    
    const correctSymptomIds = SYMPTOMS.filter((s) => s.correct).map((s) => s.id)
    const correct = selected.filter((id) => correctSymptomIds.includes(id)).length
    const incorrect = selected.filter((id) => !correctSymptomIds.includes(id)).length
    const missed = correctSymptomIds.filter((id) => !selected.includes(id)).length

    let score = 0
    let feedbackText = ''

    if (correct === correctSymptomIds.length && incorrect === 0) {
      score = 100
      feedbackText = 'Perfect! All warning signs identified correctly!'
    } else if (correct >= correctSymptomIds.length - 1 && incorrect === 0) {
      score = 85
      feedbackText = 'Excellent! Nearly perfect identification.'
    } else if (correct >= correctSymptomIds.length - 2 && incorrect <= 1) {
      score = 70
      feedbackText = 'Good! Most warning signs identified correctly.'
    } else {
      score = Math.max(0, correct * 15 - incorrect * 10)
      feedbackText = `You identified ${correct}/${correctSymptomIds.length} warning signs correctly.`
    }

    setLevelScore(score)
    updateScore(score, score, 'one')
    setFeedback(feedbackText)
    setShowFeedback(true)
    setLevelComplete(true)
  }

  const timePercentage = (timeLeft / 30) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl animate-fade-in">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white font-bold rounded-full text-sm mb-6">
          LEVEL 1 OF 3
        </div>
        <h1 className="text-5xl font-black text-[#0D0D0D] mb-4">Warning Signs Recognition</h1>
        <p className="text-xl text-[#666666]">
          Teenage patient faints during tooth extraction. Identify the warning signs that led to syncope.
        </p>
      </div>

      {/* Scenario */}
      <div className="max-w-2xl w-full mb-12">
        <div className="bg-white border-2 border-[#0066CC] rounded-2xl p-8 shadow-lg">
          <div className="text-6xl mb-4 text-center">😵</div>
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-4 text-center">Patient Fainting Scenario</h2>
          <p className="text-[#333333] text-center mb-6 leading-relaxed">
            Before fainting, the patient exhibited several warning signs. Your task: identify which symptoms were present.
          </p>
          
          {/* Timer */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#0066CC]">Time Remaining</span>
              <span className="text-2xl font-black text-[#0066CC]">{timeLeft}s</span>
            </div>
            <div className="w-full h-2 bg-[#E6F2FF] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0066CC] to-[#00D4FF] transition-all duration-300"
                style={{ width: `${timePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Symptoms Grid */}
      <div className="max-w-2xl w-full mb-12">
        <h3 className="text-lg font-bold text-[#0D0D0D] mb-6">Select the warning signs present:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYMPTOMS.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => toggleSymptom(symptom.id)}
              disabled={levelComplete}
              className={`p-6 rounded-xl border-2 transition-all duration-200 transform ${
                selected.includes(symptom.id)
                  ? 'border-[#0066CC] bg-[#E6F2FF] scale-105 shadow-lg'
                  : 'border-[#CCCCCC] bg-white hover:border-[#0066CC]'
              } ${levelComplete ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
            >
              <div className="text-4xl mb-3">{symptom.emoji}</div>
              <div className="text-lg font-bold text-[#0D0D0D]">{symptom.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="max-w-2xl w-full mb-12 animate-scale-in">
          <div className={`rounded-2xl p-8 border-2 ${
            levelScore >= 80
              ? 'border-[#22C55E] bg-[#F0FDF4]'
              : levelScore >= 60
              ? 'border-[#F59E0B] bg-[#FFFBEB]'
              : 'border-[#EF4444] bg-[#FEF2F2]'
          }`}>
            <h3 className={`text-3xl font-black mb-3 ${
              levelScore >= 80
                ? 'text-[#22C55E]'
                : levelScore >= 60
                ? 'text-[#F59E0B]'
                : 'text-[#EF4444]'
            }`}>
              {levelScore >= 80 ? '✓' : levelScore >= 60 ? '!' : '✗'} Score: {levelScore}/100
            </h3>
            <p className="text-lg text-[#333333] mb-6">{feedback}</p>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-[#666666]">
                <strong>Correct symptoms:</strong> Pale Skin, Excessive Sweating, Dizziness, Slow Pulse, Blurred Vision
              </p>
            </div>
            <button
              onClick={onComplete}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Continue to Level 2
            </button>
          </div>
        </div>
      )}

      {!showFeedback && (
        <button
          onClick={completeLevel}
          className="max-w-2xl w-full px-6 py-4 bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Submit Answers
        </button>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
      `}</style>
    </div>
  )
}
