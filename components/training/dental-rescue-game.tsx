'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LevelOne from './level-one'
import LevelTwo from './level-two'
import LevelThree from './level-three'
import ScoreScreen from './score-screen'

export type GameLevel = 'one' | 'two' | 'three' | 'complete'

export interface GameState {
  currentLevel: GameLevel
  score: number
  levelOneScore: number
  levelTwoScore: number
  levelThreeScore: number
  feedback: string
}

export default function DentalRescueGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 'one',
    score: 0,
    levelOneScore: 0,
    levelTwoScore: 0,
    levelThreeScore: 0,
    feedback: '',
  })
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const updateScore = (points: number, levelScore: number, level: 'one' | 'two' | 'three') => {
    setGameState((prev) => {
      const newState = {
        ...prev,
        score: prev.score + points,
      }
      if (level === 'one') newState.levelOneScore = levelScore
      if (level === 'two') newState.levelTwoScore = levelScore
      if (level === 'three') newState.levelThreeScore = levelScore
      return newState
    })
  }

  const advanceLevel = () => {
    const levels: GameLevel[] = ['one', 'two', 'three', 'complete']
    const currentIndex = levels.indexOf(gameState.currentLevel)
    if (currentIndex < levels.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentLevel: levels[currentIndex + 1],
      }))
    }
  }

  const resetGame = () => {
    setGameState({
      currentLevel: 'one',
      score: 0,
      levelOneScore: 0,
      levelTwoScore: 0,
      levelThreeScore: 0,
      feedback: '',
    })
  }

  const handleExit = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#E6F2FF] to-[#F5F5F5] relative">
      {/* Exit button in corner */}
      {gameState.currentLevel !== 'complete' && (
        <button
          onClick={() => setShowExitConfirm(true)}
          className="fixed top-6 right-6 z-40 px-4 py-2 bg-white border border-[#999] text-[#333] font-semibold rounded-lg hover:bg-[#f0f0f0] transition-all text-sm"
        >
          Exit Training
        </button>
      )}

      {gameState.currentLevel === 'one' && (
        <LevelOne onComplete={advanceLevel} updateScore={updateScore} />
      )}
      {gameState.currentLevel === 'two' && (
        <LevelTwo onComplete={advanceLevel} updateScore={updateScore} />
      )}
      {gameState.currentLevel === 'three' && (
        <LevelThree onComplete={advanceLevel} updateScore={updateScore} />
      )}
      {gameState.currentLevel === 'complete' && (
        <ScoreScreen
          totalScore={gameState.score}
          levelScores={{
            one: gameState.levelOneScore,
            two: gameState.levelTwoScore,
            three: gameState.levelThreeScore,
          }}
          onRestart={resetGame}
        />
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-[#333] mb-4">Exit Training?</h3>
            <p className="text-[#666] mb-6 leading-relaxed">
              Your current progress will not be saved. Are you sure you want to exit the training session?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-3 bg-[#ddd] hover:bg-[#ccc] text-[#333] font-semibold rounded-lg transition-all"
              >
                Continue
              </button>
              <button
                onClick={handleExit}
                className="flex-1 px-4 py-3 bg-[#E10600] hover:bg-[#FF3B3B] text-white font-semibold rounded-lg transition-all"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
