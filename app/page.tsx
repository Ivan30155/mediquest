'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-[#F5F5F5]">
            PulseGuide
            <span className="block text-[#E10600] text-5xl md:text-6xl mt-2">AI</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-[#AAAAAA] tracking-wide">
            Emergency Response Guidance & Training
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
