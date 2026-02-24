'use client'

import Link from 'next/link'

export default function BreathingCheck() {
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
            Step 2 of 4
          </span>
        </div>

        {/* Icon */}
        <div className="text-6xl animate-float-up">🫁</div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#F5F5F5]">
          CHECK BREATHING
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-[#AAAAAA] font-light">
          Assess responsiveness in 10 seconds
        </p>

        {/* Instructions Card */}
        <div className="space-y-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-30 rounded-2xl p-8 backdrop-blur-sm"
          style={{ boxShadow: 'inset 0 0 40px rgba(225, 6, 0, 0.08)' }}
        >
          <div className="space-y-4">
            {[
              { num: '1', text: 'Position your ear near mouth and nose' },
              { num: '2', text: 'Watch chest for rise and fall movement' },
              { num: '3', text: 'Feel for breath on your cheek' },
              { num: '4', text: 'Listen for breathing sounds' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-4 pb-4 border-b border-[#E10600] border-opacity-10 last:pb-0 last:border-b-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E10600] to-[#FF3B3B] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{step.num}</span>
                </div>
                <p className="text-[#AAAAAA] text-base pt-1">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-6 border-t border-[#E10600] border-opacity-20">
            <p className="text-[#FF3B3B] font-semibold mb-2">⚠ Critical Decision</p>
            <p className="text-[#AAAAAA] text-sm">If breathing is absent or abnormal: Begin CPR immediately</p>
          </div>
        </div>

        {/* Continue Button */}
        <Link href="/emergency/cpr" className="block pt-4">
          <button className="w-full px-8 py-4 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            No Breathing Detected - Start CPR →
          </button>
        </Link>

        {/* Back Button */}
        <Link href="/emergency">
          <button className="text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors font-medium">
            ← Previous Step
          </button>
        </Link>
      </div>
    </main>
  )
}
