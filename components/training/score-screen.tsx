'use client'

import Link from 'next/link'

interface ScoreScreenProps {
  totalScore: number
  levelScores: {
    one: number
    two: number
    three: number
  }
  onRestart: () => void
}

export default function ScoreScreen({ totalScore, levelScores, onRestart }: ScoreScreenProps) {
  const averageScore = Math.round((levelScores.one + levelScores.two + levelScores.three) / 3)

  let performanceRating = 'Keep Training'
  let ratingColor = 'text-[#EF4444]'
  let ratingBg = 'bg-[#FEF2F2]'
  let ratingBorder = 'border-[#EF4444]'
  let ratingEmoji = '📚'

  if (averageScore >= 90) {
    performanceRating = 'Excellent'
    ratingColor = 'text-[#22C55E]'
    ratingBg = 'bg-[#F0FDF4]'
    ratingBorder = 'border-[#22C55E]'
    ratingEmoji = '⭐'
  } else if (averageScore >= 75) {
    performanceRating = 'Good'
    ratingColor = 'text-[#F59E0B]'
    ratingBg = 'bg-[#FFFBEB]'
    ratingBorder = 'border-[#F59E0B]'
    ratingEmoji = '👍'
  } else if (averageScore >= 60) {
    performanceRating = 'Needs Improvement'
    ratingColor = 'text-[#3B82F6]'
    ratingBg = 'bg-[#EFF6FF]'
    ratingBorder = 'border-[#3B82F6]'
    ratingEmoji = '📈'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-12">
      {/* Main Score Card */}
      <div className="max-w-2xl w-full mb-12 animate-scale-in">
        <div className={`rounded-3xl p-12 border-3 text-center ${ratingBg} ${ratingBorder}`}>
          <div className={`text-7xl mb-6`}>{ratingEmoji}</div>
          <h1 className={`text-5xl font-black mb-4 ${ratingColor}`}>
            {performanceRating}
          </h1>
          <div className={`text-6xl font-black mb-6 ${ratingColor}`}>
            {averageScore}%
          </div>
          <p className="text-xl text-[#333333] mb-2">Average Score</p>
          <p className="text-[#666666]">Total Points: {totalScore} pts</p>
        </div>
      </div>

      {/* Level Breakdown */}
      <div className="max-w-2xl w-full mb-12">
        <h2 className="text-3xl font-black text-[#0D0D0D] mb-8 text-center">Level Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level 1 */}
          <div className="bg-white border-2 border-[#0066CC] rounded-2xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">1️⃣</div>
            <h3 className="font-bold text-lg text-[#0D0D0D] mb-4">Warning Signs</h3>
            <div className={`text-5xl font-black mb-2 ${
              levelScores.one >= 80 ? 'text-[#22C55E]' : 'text-[#F59E0B]'
            }`}>
              {levelScores.one}
            </div>
            <p className="text-sm text-[#666666]">Score</p>
          </div>

          {/* Level 2 */}
          <div className="bg-white border-2 border-[#0066CC] rounded-2xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">2️⃣</div>
            <h3 className="font-bold text-lg text-[#0D0D0D] mb-4">Response Sequence</h3>
            <div className={`text-5xl font-black mb-2 ${
              levelScores.two >= 80 ? 'text-[#22C55E]' : 'text-[#F59E0B]'
            }`}>
              {levelScores.two}
            </div>
            <p className="text-sm text-[#666666]">Score</p>
          </div>

          {/* Level 3 */}
          <div className="bg-white border-2 border-[#0066CC] rounded-2xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">3️⃣</div>
            <h3 className="font-bold text-lg text-[#0D0D0D] mb-4">Recovery Phase</h3>
            <div className={`text-5xl font-black mb-2 ${
              levelScores.three >= 80 ? 'text-[#22C55E]' : 'text-[#F59E0B]'
            }`}>
              {levelScores.three}
            </div>
            <p className="text-sm text-[#666666]">Score</p>
          </div>
        </div>
      </div>

      {/* Educational Summary */}
      <div className="max-w-2xl w-full mb-12">
        <div className="bg-white border-2 border-[#0066CC] rounded-2xl p-8">
          <h3 className="text-2xl font-black text-[#0D0D0D] mb-6">What You Learned</h3>
          <div className="space-y-4 text-[#333333]">
            <div className="flex gap-4">
              <div className="text-3xl">🔍</div>
              <div>
                <p className="font-bold">Recognize Warning Signs</p>
                <p className="text-sm text-[#666666]">
                  Identifying syncope warning signs (pale skin, sweating, dizziness) is crucial for early intervention.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">⚡</div>
              <div>
                <p className="font-bold">Execute Emergency Protocols</p>
                <p className="text-sm text-[#666666]">
                  Proper sequence: Stop procedure, elevate legs, maintain airway, check vitals, administer O₂.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">💪</div>
              <div>
                <p className="font-bold">Manage Recovery Safely</p>
                <p className="text-sm text-[#666666]">
                  Post-incident: Reassure patient, monitor vitals, provide glucose, postpone treatment until stable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-2xl w-full space-y-4">
        <button
          onClick={onRestart}
          className="w-full px-6 py-4 bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Play Again
        </button>
        <Link href="/" className="block">
          <button className="w-full px-6 py-4 bg-white border-2 border-[#0066CC] text-[#0066CC] font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-[#E6F2FF]">
            Back to Home
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
      `}</style>
    </div>
  )
}
