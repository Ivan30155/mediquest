'use client'

import { useState, useEffect } from 'react'
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
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 'one',
    score: 0,
    levelOneScore: 0,
    levelTwoScore: 0,
    levelThreeScore: 0,
    feedback: '',
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-[#E6F2FF] to-[#F5F5F5]">
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
    </div>
  )
}
