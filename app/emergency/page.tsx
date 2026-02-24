'use client'

import Link from 'next/link'

export default function StayCalm() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E10600] rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center space-y-8 w-full max-w-2xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] text-white font-bold rounded-full text-sm">
            Step 1 of 4
          </span>
        </div>

        {/* Icon */}
        <div className="text-6xl animate-float-up">🛡️</div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#F5F5F5]">
          STAY CALM
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-[#AAAAAA] font-light">
          You are trained for this moment
        </p>

        {/* Instructions Card */}
        <div className="space-y-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 backdrop-blur-sm"
          style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-lg text-[#F5F5F5] font-semibold">Focus on the person</p>
              <p className="text-[#AAAAAA] text-base">The patient needs your help now. Follow these critical steps.</p>
            </div>

            <div className="pt-6 space-y-3 text-sm">
              <div className="flex items-start gap-3 text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors">
                <span className="text-[#E10600] font-bold text-lg">1</span>
                <p>Keep the area safe and clear obstacles</p>
              </div>
              <div className="flex items-start gap-3 text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors">
                <span className="text-[#E10600] font-bold text-lg">2</span>
                <p>Call emergency services if not already done</p>
              </div>
              <div className="flex items-start gap-3 text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors">
                <span className="text-[#E10600] font-bold text-lg">3</span>
                <p>Check responsiveness and breathing</p>
              </div>
              <div className="flex items-start gap-3 text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors">
                <span className="text-[#E10600] font-bold text-lg">4</span>
                <p>Be ready to begin CPR immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Link href="/emergency/breathing" className="block pt-4">
          <button className="w-full px-8 py-4 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            Continue to Breathing Check →
          </button>
        </Link>

        {/* Back Button */}
        <Link href="/">
          <button className="text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors font-medium">
            ← Back to Home
          </button>
        </Link>
      </div>
    </main>
  )
}
