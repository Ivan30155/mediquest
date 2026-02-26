'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showSOSPopup, setShowSOSPopup] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let animationFrame: number

    const drawHeartbeat = () => {
      const now = Date.now()
      const time = (now % 2000) / 2000

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(225, 6, 0, 0.3)'
      ctx.lineWidth = 2.5

      const centerY = canvas.height / 2
      const points = []

      for (let x = 0; x < canvas.width; x += 1) {
        let y = centerY
        const phase = ((x / canvas.width) - time + 1) % 1

        if (phase < 0.1) {
          y += Math.sin(phase * Math.PI * 10) * 20
        } else if (phase < 0.3) {
          y -= Math.sin((phase - 0.1) * Math.PI * 5) * 15
        } else if (phase < 0.4) {
          y += Math.sin((phase - 0.3) * Math.PI * 10) * 10
        }

        points.push([x, y])
      }

      ctx.beginPath()
      ctx.moveTo(points[0][0], points[0][1])
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1])
      }
      ctx.stroke()

      animationFrame = requestAnimationFrame(drawHeartbeat)
    }

    drawHeartbeat()

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E10600] rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Heartbeat Line Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 w-full max-w-2xl px-6">
        {/* Header */}
        <div className="space-y-6 animate-fade-in">
          <h1 className="w-full text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-[#F5F5F5] leading-tight break-words">
           MediQuest
             </h1>
          <p className="text-2xl md:text-3xl font-light text-[#AAAAAA] tracking-wide">
            Emergency Response Guidance & Medical Training
          </p>
        </div>

        {/* Main CTA Buttons */}
        <div className="space-y-4 pt-8 flex flex-col gap-6 max-w-md mx-auto animate-scale-in">
          {/* Emergency Mode */}
          <Link href="/emergency" className="group w-full">
            <button className="w-full px-8 py-6 bg-gradient-to-br from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white font-bold text-2xl rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-red-600/50 overflow-hidden relative"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-3xl">⚡</span>
                <span>Emergency Mode</span>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
            <p className="text-sm text-[#AAAAAA] mt-3 text-center">
              Voice-guided CPR steps with 120 BPM metronome
            </p>
          </Link>

          {/* Training Mode */}
          <Link href="/training" className="group w-full">
            <button className="w-full px-8 py-6 bg-gradient-to-br from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#0066CC] text-white font-bold text-2xl rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-blue-600/50 overflow-hidden relative"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span className="text-3xl">🎮</span>
                <span>Training Mode</span>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
            <p className="text-sm text-[#AAAAAA] mt-3 text-center">
              Dental Rescue scenario with gamified learning
            </p>
          </Link>
        </div>

        {/* Description */}
        <div className="pt-12 border-t border-[#E10600] border-opacity-30 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-[#AAAAAA] text-base leading-relaxed">
            Professional emergency response training system with AI-guided CPR instructions and realistic medical simulation for healthcare professionals.
          </p>
        </div>
      </div>

      {/* Floating SOS Button */}
      <button
        onClick={() => setShowSOSPopup(true)}
        className="fixed bottom-6 right-6 z-40 w-20 h-20 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#E10600] hover:from-[#FF5555] hover:to-[#FF3B3B] text-white font-black text-sm flex items-center justify-center shadow-2xl hover:shadow-red-600/50 transition-all transform hover:scale-110 active:scale-95 animate-pulse"
        title="Emergency Helplines"
      >
        SOS
      </button>

      {/* SOS Popup Modal */}
      {showSOSPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSOSPopup(false)} />
          <div
            className="relative bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#E10600] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: 'inset 0 0 50px rgba(225, 6, 0, 0.15), 0 0 60px rgba(225, 6, 0, 0.4)' }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowSOSPopup(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* SOS Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E10600] mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-[#F5F5F5] mb-2">All India Helplines</h3>
              <p className="text-sm text-[#AAAAAA]">Emergency Contact Numbers</p>
            </div>

            {/* Helpline Numbers */}
            <div className="space-y-3">
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Police Control Room</p>
                <p className="text-2xl font-black text-[#E10600]">100</p>
              </div>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Women Helpline</p>
                <p className="text-2xl font-black text-[#E10600]">181</p>
              </div>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Medical Helpline</p>
                <p className="text-2xl font-black text-[#E10600]">108</p>
              </div>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Ambulance Helpline</p>
                <p className="text-2xl font-black text-[#E10600]">102</p>
              </div>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">AIDS Helpline</p>
                <p className="text-2xl font-black text-[#E10600]">1097</p>
              </div>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Fire Service</p>
                <p className="text-2xl font-black text-[#E10600]">101</p>
              </div>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Railway Helpline</p>
                <p className="text-2xl font-black text-[#E10600]">1512</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 pt-6 border-t border-[#E10600] border-opacity-20">
              <p className="text-sm text-[#AAAAAA] leading-relaxed">
                Call these numbers immediately for professional emergency services. Always dial the appropriate number based on the emergency type.
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowSOSPopup(false)}
              className="w-full mt-6 px-6 py-3 bg-[#E10600] hover:bg-[#FF3B3B] text-white font-bold rounded-xl transition-all duration-200 active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.6s ease-out forwards; }
      `}</style>
    </main>
  )
}
