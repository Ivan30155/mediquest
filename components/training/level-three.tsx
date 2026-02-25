'use client'

import { useState } from 'react'

interface LevelThreeProps {
  onComplete: () => void
  updateScore: (points: number, levelScore: number, level: 'one' | 'two' | 'three') => void
}

interface Decision {
  id: string
  question: string
  correct: boolean
  action: string
}

const DECISIONS: Decision[] = [
  {
    id: 'reassure',
    question: 'Reassure the patient?',
    correct: true,
    action: 'Calmly reassure the patient',
  },
  {
    id: 'vitals',
    question: 'Monitor vitals continuously?',
    correct: true,
    action: 'Continue monitoring pulse and breathing',
  },
  {
    id: 'glucose',
    question: 'Offer glucose/juice?',
    correct: true,
    action: 'Provide glucose for recovery',
  },
  {
    id: 'continue',
    question: 'Continue treatment?',
    correct: false,
    action: 'Postpone treatment for today',
  },
]

export default function LevelThree({ onComplete, updateScore }: LevelThreeProps) {
  const [decisions, setDecisions] = useState<Record<string, boolean | null>>({
    reassure: null,
    vitals: null,
    glucose: null,
    continue: null,
  })
  const [showFeedback, setShowFeedback] = useState(false)
  const [levelScore, setLevelScore] = useState(0)
  const [feedback, setFeedback] = useState<string>('')
  const [levelComplete, setLevelComplete] = useState(false)

  const makeDecision = (id: string, value: boolean) => {
    if (levelComplete) return
    setDecisions((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const completeLevel = () => {
    if (levelComplete) return

    let correct = 0
    let incorrect = 0

    DECISIONS.forEach((decision) => {
      const chosen = decisions[decision.id]
      if (chosen === null) return

      if ((chosen && decision.correct) || (!chosen && !decision.correct)) {
        correct++
      } else {
        incorrect++
      }
    })

    let score = 0
    let feedbackText = ''

    if (correct === DECISIONS.length) {
      score = 100
      feedbackText = 'Excellent! All recovery decisions made correctly!'
    } else if (correct === DECISIONS.length - 1) {
      score = 85
      feedbackText = 'Very good! Almost perfect recovery management.'
    } else if (correct >= DECISIONS.length - 2) {
      score = 70
      feedbackText = 'Good recovery management decisions.'
    } else {
      score = Math.max(0, correct * 20 - incorrect * 10)
      feedbackText = `${correct}/${DECISIONS.length} correct recovery decisions.`
    }

    setLevelScore(score)
    updateScore(score, score, 'three')
    setFeedback(feedbackText)
    setShowFeedback(true)
    setLevelComplete(true)
  }

  const allAnswered = Object.values(decisions).every((v) => v !== null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl animate-fade-in">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white font-bold rounded-full text-sm mb-6">
          LEVEL 3 OF 3
        </div>
        <h1 className="text-5xl font-black text-[#0D0D0D] mb-4">Recovery Phase</h1>
        <p className="text-xl text-[#666666]">
          Patient is regaining consciousness. Make the right decisions for post-incident recovery.
        </p>
      </div>

      {/* Scenario */}
      <div className="max-w-3xl w-full mb-12">
        <div className="bg-white border-2 border-[#0066CC] rounded-2xl p-8 shadow-lg">
          <div className="text-6xl mb-4 text-center">😊</div>
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-4 text-center">Patient Regaining Consciousness</h2>
          <p className="text-[#333333] text-center leading-relaxed">
            The patient is now responsive and breathing normally. Make the correct decisions to ensure safe recovery.
          </p>
        </div>
      </div>

      {/* Decision Questions */}
      <div className="max-w-3xl w-full space-y-6 mb-12">
        {DECISIONS.map((decision) => (
          <div key={decision.id} className="bg-white border-2 border-[#CCCCCC] rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-[#0D0D0D] mb-6">{decision.question}</h3>
            <div className="flex gap-4">
              <button
                onClick={() => makeDecision(decision.id, true)}
                disabled={levelComplete}
                className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                  decisions[decision.id] === true
                    ? 'bg-[#22C55E] text-white scale-105 shadow-lg'
                    : 'bg-[#E6F2FF] text-[#0066CC] border-2 border-[#0066CC] hover:bg-[#0066CC] hover:text-white'
                } ${levelComplete ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                Yes
              </button>
              <button
                onClick={() => makeDecision(decision.id, false)}
                disabled={levelComplete}
                className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform ${
                  decisions[decision.id] === false
                    ? 'bg-[#EF4444] text-white scale-105 shadow-lg'
                    : 'bg-[#FFE6E6] text-[#EF4444] border-2 border-[#EF4444] hover:bg-[#EF4444] hover:text-white'
                } ${levelComplete ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                No
              </button>
            </div>
            {levelComplete && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-bold ${
                (decisions[decision.id] && decision.correct) || (!decisions[decision.id] && !decision.correct)
                  ? 'bg-[#F0FDF4] text-[#22C55E]'
                  : 'bg-[#FEF2F2] text-[#EF4444]'
              }`}>
                {(decisions[decision.id] && decision.correct) || (!decisions[decision.id] && !decision.correct)
                  ? '✓ Correct'
                  : '✗ Incorrect'}: {decision.action}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="max-w-3xl w-full mb-12 animate-scale-in">
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
            <button
              onClick={onComplete}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              View Final Score
            </button>
          </div>
        </div>
      )}

      {!showFeedback && (
        <button
          onClick={completeLevel}
          disabled={!allAnswered}
          className={`max-w-3xl w-full px-6 py-4 font-bold text-lg rounded-xl transition-all duration-300 transform ${
            allAnswered
              ? 'bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white hover:scale-105 active:scale-95 cursor-pointer'
              : 'bg-[#CCCCCC] text-[#999999] cursor-not-allowed'
          }`}
        >
          {allAnswered ? 'Complete Level 3' : 'Answer all questions'}
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
