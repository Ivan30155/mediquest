'use client'

import { useState, useEffect } from 'react'

interface LevelTwoProps {
  onComplete: () => void
  updateScore: (points: number, levelScore: number, level: 'one' | 'two' | 'three') => void
}

const CORRECT_SEQUENCE = [
  { id: 1, action: 'Stop procedure immediately', emoji: '⏹️' },
  { id: 2, action: 'Position patient supine with legs elevated', emoji: '🛏️' },
  { id: 3, action: 'Loosen tight clothing / remove dentures', emoji: '👕' },
  { id: 4, action: 'Maintain airway (tilt head, lift chin)', emoji: '🫁' },
  { id: 5, action: 'Check pulse and breathing', emoji: '💓' },
  { id: 6, action: 'Administer oxygen if available', emoji: '🔬' },
]

export default function LevelTwo({ onComplete, updateScore }: LevelTwoProps) {
  const [sequence, setSequence] = useState<typeof CORRECT_SEQUENCE>([
    ...CORRECT_SEQUENCE.sort(() => Math.random() - 0.5),
  ])
  const [selectedOrder, setSelectedOrder] = useState<number[]>([])
  const [feedback, setFeedback] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [levelComplete, setLevelComplete] = useState(false)
  const [levelScore, setLevelScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)

  const selectAction = (id: number) => {
    if (levelComplete) return
    if (selectedOrder.includes(id)) {
      setSelectedOrder((prev) => prev.filter((x) => x !== id))
    } else {
      setSelectedOrder((prev) => [...prev, id])
    }
  }

  const completeLevel = () => {
    if (levelComplete) return

    const correctOrder = CORRECT_SEQUENCE.map((a) => a.id)
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(correctOrder)

    let score = 0
    let feedbackText = ''
    let mistakeCount = 0

    if (isCorrect) {
      score = 100
      feedbackText = 'Perfect! Correct emergency response sequence!'
    } else {
      let correctCount = 0
      for (let i = 0; i < Math.min(selectedOrder.length, correctOrder.length); i++) {
        if (selectedOrder[i] === correctOrder[i]) {
          correctCount++
        } else {
          mistakeCount++
        }
      }

      const missing = correctOrder.length - selectedOrder.length
      mistakeCount += missing

      score = Math.max(0, 100 - mistakeCount * 15)
      feedbackText = `You got ${correctCount} actions in correct order. ${mistakeCount} mistakes.`
    }

    setLevelScore(score)
    setMistakes(mistakeCount)
    updateScore(score, score, 'two')
    setFeedback(feedbackText)
    setShowFeedback(true)
    setLevelComplete(true)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-12">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl animate-fade-in">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#0052A3] text-white font-bold rounded-full text-sm mb-6">
          LEVEL 2 OF 3
        </div>
        <h1 className="text-5xl font-black text-[#0D0D0D] mb-4">Emergency Response Sequence</h1>
        <p className="text-xl text-[#666666]">
          Patient is now unresponsive. Arrange the correct sequence of emergency response actions.
        </p>
      </div>

      {/* Scenario */}
      <div className="max-w-3xl w-full mb-12">
        <div className="bg-white border-2 border-[#0066CC] rounded-2xl p-8 shadow-lg">
          <div className="text-6xl mb-4 text-center">🚨</div>
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-4 text-center">Syncope Emergency</h2>
          <p className="text-[#333333] text-center leading-relaxed">
            The patient has lost consciousness. Your task: arrange the actions in the correct order to manage this emergency.
          </p>
        </div>
      </div>

      {/* Available Actions */}
      <div className="max-w-3xl w-full mb-8">
        <h3 className="text-lg font-bold text-[#0D0D0D] mb-6">Available Actions (click to arrange):</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sequence.map((action) => {
            const isSelected = selectedOrder.includes(action.id)
            const orderIndex = selectedOrder.indexOf(action.id)
            return (
              <button
                key={action.id}
                onClick={() => selectAction(action.id)}
                disabled={levelComplete}
                className={`p-6 rounded-xl border-2 transition-all duration-200 transform text-left ${
                  isSelected
                    ? 'border-[#0066CC] bg-[#E6F2FF] scale-105 shadow-lg'
                    : 'border-[#CCCCCC] bg-white hover:border-[#0066CC]'
                } ${levelComplete ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{action.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-[#0D0D0D]">{action.action}</div>
                    {isSelected && (
                      <div className="text-sm text-[#0066CC] font-bold mt-2">
                        Order: {orderIndex + 1}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Order */}
      {selectedOrder.length > 0 && (
        <div className="max-w-3xl w-full mb-12">
          <h3 className="text-lg font-bold text-[#0D0D0D] mb-4">Your Sequence Order:</h3>
          <div className="space-y-3">
            {selectedOrder.map((id, index) => {
              const action = CORRECT_SEQUENCE.find((a) => a.id === id)
              const correctIndex = CORRECT_SEQUENCE.findIndex((a) => a.id === id)
              const isCorrectPosition = correctIndex === index
              return (
                <div
                  key={id}
                  className={`p-4 rounded-lg border-2 flex items-center gap-4 ${
                    isCorrectPosition
                      ? 'border-[#22C55E] bg-[#F0FDF4]'
                      : 'border-[#F59E0B] bg-[#FFFBEB]'
                  }`}
                >
                  <div className="text-2xl font-black text-[#0D0D0D]">{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-bold text-[#0D0D0D]">{action?.action}</div>
                  </div>
                  <div className="text-xl">{isCorrectPosition ? '✓' : '?'}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
            <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-[#0D0D0D] mb-3">Correct sequence:</p>
              <ol className="text-sm text-[#666666] space-y-1">
                {CORRECT_SEQUENCE.map((action, index) => (
                  <li key={action.id}>
                    {index + 1}. {action.action}
                  </li>
                ))}
              </ol>
            </div>
            <button
              onClick={onComplete}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Continue to Level 3
            </button>
          </div>
        </div>
      )}

      {!showFeedback && (
        <button
          onClick={completeLevel}
          disabled={selectedOrder.length !== CORRECT_SEQUENCE.length}
          className={`max-w-3xl w-full px-6 py-4 font-bold text-lg rounded-xl transition-all duration-300 transform ${
            selectedOrder.length === CORRECT_SEQUENCE.length
              ? 'bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white hover:scale-105 active:scale-95 cursor-pointer'
              : 'bg-[#CCCCCC] text-[#999999] cursor-not-allowed'
          }`}
        >
          {selectedOrder.length === CORRECT_SEQUENCE.length
            ? 'Check Sequence'
            : `Select all ${CORRECT_SEQUENCE.length} actions`}
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
