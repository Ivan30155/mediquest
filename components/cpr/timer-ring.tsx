"use client"

import { useEffect, useState, useRef } from "react"

interface TimerRingProps {
  duration: number
  timeLeft: number
  size?: number
}

export function TimerRing({ duration, timeLeft, size = 80 }: TimerRingProps) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const progress = timeLeft / duration
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={timeLeft <= 3 ? "#FF3B3B" : "#E10600"}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 linear"
        />
      </svg>
      <span
        className={`absolute text-2xl font-black tabular-nums ${
          timeLeft <= 3 ? "text-[#FF3B3B] animate-pulse" : "text-[#F5F5F5]"
        }`}
      >
        {timeLeft}
      </span>
    </div>
  )
}

interface BPMIndicatorProps {
  bpm: number
  isActive: boolean
  compressionCount: number
  targetCompressions: number
  isPulsing?: boolean
}

export function BPMIndicator({
  bpm,
  isActive,
  compressionCount,
  targetCompressions,
  isPulsing = false,
}: BPMIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pulsing circle synchronized with metronome */}
      <div
        className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-100 ${
          isPulsing
            ? "scale-110 border-[#FF3B3B] bg-[#FF3B3B]/20"
            : "scale-100 border-[#E10600] bg-[#E10600]/10"
        }`}
      >
        <div className="text-center">
          <span className="text-3xl font-black text-[#F5F5F5]">{bpm}</span>
          <span className="block text-xs font-semibold text-[#AAAAAA] uppercase tracking-widest">
            BPM
          </span>
        </div>
      </div>

      {/* Compression counter */}
      <div className="flex items-center gap-2">
        <span className="text-4xl font-black text-[#F5F5F5] tabular-nums">
          {compressionCount}
        </span>
        <span className="text-lg text-[#AAAAAA]">/</span>
        <span className="text-lg text-[#AAAAAA]">{targetCompressions}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[200px] h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E10600] to-[#FF3B3B] transition-all duration-100"
          style={{
            width: `${Math.min(
              (compressionCount / targetCompressions) * 100,
              100
            )}%`,
          }}
        />
      </div>
    </div>
  )
}
