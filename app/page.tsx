'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
      ctx.strokeStyle = 'rgba(225, 6, 0, 0.4)'
      ctx.lineWidth = 2

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
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E10600] rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Heartbeat Line Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-30 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 w-full max-w-3xl animate-float-up">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-[#F5F5F5]">
            PulseGuide
            <span className="block text-[#E10600]">AI</span>
          </h1>
          <p className="text-2xl md:text-3xl font-light text-[#AAAAAA] tracking-wide">
            Real-Time CPR & Emergency Response Guidance
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 py-12">
          {[
            { icon: '♥', title: 'CPR Rhythm Guidance', desc: 'AI-powered 110 BPM metronome' },
            { icon: '⚡', title: 'Emergency Flow', desc: 'Structured step-by-step guidance' },
            { icon: '📋', title: 'AED Simulation', desc: 'Realistic device training' },
          ].map((feature, i) => (
            <div
              key={i}
              className="group bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-[#E10600] border-opacity-20 rounded-2xl p-6 hover:border-opacity-40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              style={{ boxShadow: 'inset 0 0 30px rgba(225, 6, 0, 0.05)' }}
            >
              <div className="text-4xl mb-3 group-hover:animate-heartbeat">{feature.icon}</div>
              <h3 className="text-lg font-bold text-[#F5F5F5] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#AAAAAA]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 pt-8 flex flex-col md:flex-row gap-4 justify-center md:gap-6">
          <Link href="/emergency" className="flex-1 md:flex-none">
            <button className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-[#E10600] to-[#FF3B3B] hover:from-[#FF3B3B] hover:to-[#E10600] text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-600/50"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            >
              ▶ Start Emergency
            </button>
          </Link>

          <Link href="/training" className="flex-1 md:flex-none">
            <button className="w-full md:w-auto px-12 py-4 bg-transparent border-2 border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              📚 Training Mode
            </button>
          </Link>
        </div>

        {/* Description */}
        <div className="pt-8 border-t border-[#E10600] border-opacity-20">
          <p className="text-[#AAAAAA] text-base leading-relaxed max-w-xl mx-auto">
            Professional emergency response training with AI-guided CPR rhythm detection, real-time feedback, and realistic AED simulation for healthcare professionals and first responders.
          </p>
        </div>
      </div>
    </main>
  )
}
