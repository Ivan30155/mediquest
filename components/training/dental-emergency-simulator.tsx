'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SILENT_ALLERGEN, MORNING_COLLAPSE, type CaseType, type SimulationCase } from '@/lib/dental-emergency-cases'

type GameState = 'case-select' | 'playing' | 'level-complete' | 'case-complete'

export default function DentalEmergencySimulator() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>('case-select')
  const [selectedCase, setSelectedCase] = useState<SimulationCase | null>(null)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answeredLevels, setAnsweredLevels] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const handleCaseSelect = (caseId: CaseType) => {
    const caseData = caseId === 'silent-allergen' ? SILENT_ALLERGEN : MORNING_COLLAPSE
    setSelectedCase(caseData)
    setGameState('playing')
    setCurrentLevelIndex(0)
    setScore(0)
    setAnsweredLevels(0)
  }

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !selectedCase) return

    const currentLevel = selectedCase.levels[currentLevelIndex]
    const selectedOption = currentLevel.options.find((opt) => opt.id === selectedAnswer)

    if (selectedOption?.isCorrect) {
      setScore((prev) => prev + 1)
    }

    setAnsweredLevels((prev) => prev + 1)
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

  const handleExitGame = () => {
    setShowExitConfirm(true)
  }

  const confirmExit = () => {
    router.push('/')
  }

  const handleRestartCase = () => {
    setGameState('case-select')
    setSelectedCase(null)
    setCurrentLevelIndex(0)
    setScore(0)
    setAnsweredLevels(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
  }

  if (gameState === 'case-select') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A0000] to-[#0D0D0D] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-[#F5F5F5] mb-4">Dental Emergency Simulator</h1>
            <p className="text-lg text-[#AAAAAA]">Select a case to begin advanced diagnostic training</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Silent Allergen Card */}
            <button
              onClick={() => handleCaseSelect('silent-allergen')}
              className="group bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#E10600] border-opacity-30 hover:border-opacity-100 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 text-left"
              style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
            >
              <div className="text-5xl mb-4">⚕️</div>
              <h2 className="text-3xl font-black text-[#F5F5F5] mb-2">The Silent Allergen</h2>
              <p className="text-[#AAAAAA] mb-6">Advanced Mode</p>
              <p className="text-sm text-[#CCCCCC] mb-6 leading-relaxed">
                Patient experiencing anaphylaxis during routine dental procedure. Master recognition, immediate response, and prevention strategies through 8 progressive levels.
              </p>
              <div className="inline-block px-6 py-2 bg-[#E10600] text-white font-bold rounded-lg group-hover:bg-[#FF3B3B] transition-colors">
                Start Case → 8 Levels
              </div>
            </button>

            {/* Morning Collapse Card */}
            <button
              onClick={() => handleCaseSelect('morning-collapse')}
              className="group bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#0066CC] border-opacity-30 hover:border-opacity-100 rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 text-left"
              style={{ boxShadow: 'inset 0 0 40px rgba(0, 102, 204, 0.08)' }}
            >
              <div className="text-5xl mb-4">🩺</div>
              <h2 className="text-3xl font-black text-[#F5F5F5] mb-2">The Morning Collapse</h2>
              <p className="text-[#AAAAAA] mb-6">Diagnostic Precision Mode</p>
              <p className="text-sm text-[#CCCCCC] mb-6 leading-relaxed">
                Patient collapses during morning appointment. Develop differential diagnosis skills and interdisciplinary care planning through 5 diagnostic scenarios.
              </p>
              <div className="inline-block px-6 py-2 bg-[#0066CC] text-white font-bold rounded-lg group-hover:bg-[#0052A3] transition-colors">
                Start Case → 5 Levels
              </div>
            </button>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/')}
              className="text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (gameState === 'case-complete' && selectedCase) {
    const totalLevels = selectedCase.levels.length
    const rating =
      score >= totalLevels * 0.9 ? 'Excellent' : score >= totalLevels * 0.75 ? 'Good' : score >= totalLevels * 0.6 ? 'Fair' : 'Needs Improvement'

    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A0000] to-[#0D0D0D] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#E10600] rounded-3xl p-12 text-center"
            style={{ boxShadow: 'inset 0 0 50px rgba(225, 6, 0, 0.15), 0 0 60px rgba(225, 6, 0, 0.3)' }}
          >
            <h2 className="text-4xl font-black text-[#F5F5F5] mb-6">Case Complete</h2>

            <div className="bg-[#0D0D0D] rounded-xl p-8 mb-8">
              <p className="text-[#AAAAAA] text-sm uppercase tracking-widest mb-4">Final Score</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black text-[#E10600]">{score}</span>
                <span className="text-2xl text-[#AAAAAA]">/ {totalLevels}</span>
              </div>
            </div>

            <div className="bg-[#0D0D0D] rounded-xl p-8 mb-8">
              <p className="text-[#AAAAAA] text-sm uppercase tracking-widest mb-3">Performance Rating</p>
              <p className="text-4xl font-black text-[#E10600]">{rating}</p>
              <p className="text-[#AAAAAA] mt-4">
                {rating === 'Excellent'
                  ? 'Outstanding! You demonstrate expert-level clinical decision-making.'
                  : rating === 'Good'
                    ? 'Strong performance. Continue refining your diagnostic approach.'
                    : rating === 'Fair'
                      ? 'Good effort. Review the case materials and try again.'
                      : 'Review all levels and improve your clinical reasoning.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleRestartCase}
                className="w-full px-8 py-4 bg-[#E10600] hover:bg-[#FF3B3B] text-white font-bold text-lg rounded-xl transition-all duration-200"
              >
                Try Another Case
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full px-8 py-4 bg-[#1A1A1A] border border-[#333] text-[#AAAAAA] hover:text-[#F5F5F5] font-bold rounded-xl transition-all"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (gameState === 'playing' && selectedCase) {
    const currentLevel = selectedCase.levels[currentLevelIndex]
    const isAnswered = selectedAnswer !== null

    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1A0000] to-[#0D0D0D] p-4">
        {/* Header with Exit Button */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-[#F5F5F5]">{selectedCase.title}</h1>
              <p className="text-sm text-[#AAAAAA] mt-2">{selectedCase.mode}</p>
            </div>
            <button
              onClick={handleExitGame}
              className="px-6 py-3 bg-[#1A1A1A] border border-[#E10600] border-opacity-50 text-[#AAAAAA] hover:text-[#F5F5F5] font-bold rounded-lg transition-all"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#AAAAAA] font-semibold">Level {currentLevelIndex + 1} / {selectedCase.totalLevels}</span>
              <span className="text-sm text-[#E10600] font-black">Score: {score} / {selectedCase.totalLevels}</span>
            </div>
          <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E10600] to-[#FF3B3B] transition-all duration-500"
              style={{ width: `${((currentLevelIndex + 1) / selectedCase.totalLevels) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Animated Medical Visual Section */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 mb-8 relative overflow-hidden min-h-[200px] flex items-center justify-center"
            style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
          >
            {/* Animated Background Pulse */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E10600]/0 via-[#E10600]/50 to-[#E10600]/0 animate-pulse" />
            </div>

            {/* Medical Animation Content */}
            <div className="relative z-10 text-center w-full">
              {selectedCase.id === 'silent-allergen' ? (
                <div className="space-y-6">
                  {/* Anaphylaxis Visualization */}
                  <div className="inline-flex flex-col items-center">
                    {/* Head with swelling animation */}
                    <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
                      {/* Face outline */}
                      <circle cx="60" cy="50" r="30" fill="none" stroke="#FF3B3B" strokeWidth="2" />
                      {/* Eyes */}
                      <circle cx="50" cy="45" r="3" fill="#FF3B3B" />
                      <circle cx="70" cy="45" r="3" fill="#FF3B3B" />
                      {/* Mouth */}
                      <path d="M 55 55 Q 60 58 65 55" fill="none" stroke="#FF3B3B" strokeWidth="2" />
                      {/* Swelling animation circles */}
                      {[0, 1, 2].map((i) => (
                        <circle
                          key={i}
                          cx="60"
                          cy="50"
                          r={40 + i * 5}
                          fill="none"
                          stroke="#FF3B3B"
                          strokeWidth="1"
                          opacity={0.3 - i * 0.1}
                          style={{
                            animation: `pulse-glow 2s ease-in-out ${i * 0.3}s infinite`,
                          }}
                        />
                      ))}
                    </svg>
                  </div>

                  <p className="text-[#AAAAAA] text-sm font-semibold">Allergic Response Simulation</p>
                  
                  {currentLevelIndex === 0 && (
                    <div className="mt-4 space-y-3 w-full max-w-xs mx-auto">
                      <div className="inline-block px-6 py-2 bg-[#E10600]/20 border border-[#E10600] rounded-lg">
                        <p className="text-[#FF3B3B] text-xs font-bold">CRITICAL: Facial Swelling Detected</p>
                      </div>
                      <div className="text-xs text-[#AAAAAA]">Symptoms progressing rapidly</div>
                    </div>
                  )}
                  
                  {currentLevelIndex === 1 && (
                    <div className="mt-4 space-y-3 w-full max-w-xs mx-auto">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-[#AAAAAA]">Airway Status</span>
                          <span className="text-xs text-[#FF3B3B] font-bold">75% Compromised</span>
                        </div>
                        <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden border border-[#E10600]">
                          <div className="h-full bg-gradient-to-r from-[#FF3B3B] to-[#E10600] animate-pulse" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentLevelIndex >= 2 && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#E10600]/10 border border-[#E10600]/30 rounded-lg">
                      <div className="w-3 h-3 bg-[#FF3B3B] rounded-full animate-pulse" />
                      <p className="text-[#FF3B3B] text-xs font-semibold">EMERGENCY STATE ESCALATING</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Syncope/Hypoglycemia Visualization */}
                  <div className="inline-flex flex-col items-center">
                    <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
                      {/* Heart outline */}
                      <path
                        d="M 60 100 C 40 90, 25 75, 25 60 C 25 48, 33 40, 45 40 C 52 40, 58 44, 60 50 C 62 44, 68 40, 75 40 C 87 40, 95 48, 95 60 C 95 75, 80 90, 60 100 Z"
                        fill="none"
                        stroke="#0066CC"
                        strokeWidth="2"
                      />
                      {/* Heartbeat line */}
                      <path
                        d="M 20 60 L 35 60 L 40 50 L 45 70 L 50 60 L 100 60"
                        fill="none"
                        stroke="#0066CC"
                        strokeWidth="2"
                        style={{
                          animation: 'pulse-glow 1.5s ease-in-out infinite',
                        }}
                      />
                    </svg>
                  </div>

                  <p className="text-[#AAAAAA] text-sm font-semibold">Hypoglycemic Crisis Simulation</p>
                  
                  {currentLevelIndex === 0 && (
                    <div className="mt-4 space-y-2 w-full max-w-xs mx-auto">
                      <div className="inline-block">
                        <p className="text-[#FF3B3B] font-bold text-2xl">38</p>
                        <p className="text-[#AAAAAA] text-xs">mg/dL</p>
                      </div>
                      <p className="text-[#E10600] text-xs font-bold">CRITICALLY LOW</p>
                    </div>
                  )}

                  {currentLevelIndex >= 2 && (
                    <div className="mt-4 space-y-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-lg">
                        <div className="w-2 h-2 bg-[#2ECC71] rounded-full animate-pulse" />
                        <p className="text-[#2ECC71] text-xs font-semibold">Glucose Responding</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 mb-8 animate-slide-up"
            style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
          >
            {/* Medical Context */}
            <div className="bg-[#0D0D0D] rounded-lg p-4 mb-6 border border-[#E10600] border-opacity-20">
              <p className="text-xs text-[#E10600] uppercase tracking-widest font-bold mb-2">Clinical Context</p>
              <p className="text-[#AAAAAA] text-sm">{currentLevel.medicalContext}</p>
            </div>

            {/* Scenario */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">Scenario</h2>
              <p className="text-[#CCCCCC] leading-relaxed">{currentLevel.scenario}</p>
            </div>

            {/* Question */}
            <div className="mb-8 pb-8 border-b border-[#E10600] border-opacity-20">
              <h3 className="text-2xl font-black text-[#E10600] mb-6">{currentLevel.question}</h3>

              {/* MCQ Options */}
              <div className="space-y-3">
                {currentLevel.options.map((option, idx) => (
                  <button
                    key={option.id}
                    onClick={() => !isAnswered && handleAnswerSelect(option.id)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === option.id
                        ? option.isCorrect
                          ? 'border-[#2ECC71] bg-[#2ECC71] bg-opacity-10 text-[#2ECC71] animate-pulse'
                          : 'border-[#FF3B3B] bg-[#FF3B3B] bg-opacity-10 text-[#FF3B3B] animate-pulse'
                        : 'border-[#333] bg-[#0D0D0D] text-[#CCCCCC] hover:border-[#E10600] cursor-pointer'
                    } ${isAnswered ? 'cursor-default' : ''}`}
                    style={{ 
                      animation: !isAnswered ? `fade-in 0.4s ease-out ${idx * 0.1}s both` : 'none'
                    }}
                  >
                    <span className="font-bold">{option.id.toUpperCase()}</span>
                    <span className="ml-4">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation - Shows after answer is selected */}
            {showExplanation && (
              <div className="bg-[#0D0D0D] rounded-lg p-6 border-2 border-[#E10600] border-opacity-40 animate-fade-in">
                <p className="text-xs text-[#E10600] uppercase tracking-widest font-bold mb-3">Explanation</p>
                <p className="text-[#CCCCCC] leading-relaxed mb-4">{currentLevel.explanation}</p>
                <div className="flex items-center gap-2 text-[#2ECC71] font-bold">
                  <span>+{currentLevel.score} points</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 py-4 bg-[#E10600] hover:bg-[#FF3B3B] text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextLevel}
                className="flex-1 py-4 bg-[#E10600] hover:bg-[#FF3B3B] text-white font-bold rounded-xl transition-all"
              >
                {currentLevelIndex === selectedCase.levels.length - 1 ? 'Complete Case' : 'Next Level'}
              </button>
            )}
          </div>
        </div>

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowExitConfirm(false)} />
            <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#E10600] rounded-2xl p-8 max-w-sm w-full">
              <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">End Session?</h3>
              <p className="text-[#AAAAAA] mb-6">Your progress will not be saved. Are you sure you want to exit?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#333] text-[#AAAAAA] font-bold rounded-lg hover:text-[#F5F5F5] transition-all"
                >
                  Continue
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 px-4 py-3 bg-[#E10600] hover:bg-[#FF3B3B] text-white font-bold rounded-lg transition-all"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes score-pop {
            0% { transform: scale(0.8) translateY(10px); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1) translateY(-30px); opacity: 0; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: inset 0 0 40px rgba(225, 6, 0, 0.08), 0 0 20px rgba(225, 6, 0, 0.1); }
            50% { box-shadow: inset 0 0 40px rgba(225, 6, 0, 0.15), 0 0 40px rgba(225, 6, 0, 0.25); }
          }
          .animate-fade-in { animation: fade-in 0.4s ease-out; }
          .animate-slide-up { animation: slide-up 0.5s ease-out; }
          .animate-score-pop { animation: score-pop 0.8s ease-out forwards; }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        `}</style>
      </main>
    )
  }

  return null
}
