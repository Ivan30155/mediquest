"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cprSteps, type CPRStep } from "@/lib/cpr-steps"
import { useSpeechNarration } from "@/hooks/use-speech-narration"
import { TimerRing, BPMIndicator } from "@/components/cpr/timer-ring"

const BPM = 110
const TARGET_COMPRESSIONS = 30

export function EmergencyCPRFlow() {
  const router = useRouter()
  const { speak, stop: stopSpeech } = useSpeechNarration()
  const [currentStepIndex, setCurrentStepIndex] = useState(-1) // -1 = home screen
  const [timeLeft, setTimeLeft] = useState(0)
  const [compressionCount, setCompressionCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [cycleCount, setCycleCount] = useState(1)
  const [showTransition, setShowTransition] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const compressionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const advanceStepRef = useRef<() => void>(() => {})

  const currentStep: CPRStep | null =
    currentStepIndex >= 0 && currentStepIndex < cprSteps.length
      ? cprSteps[currentStepIndex]
      : null

  const isLastStep = currentStepIndex === cprSteps.length - 1

  const advanceStep = useCallback(() => {
    stopSpeech()
    if (timerRef.current) clearInterval(timerRef.current)
    if (compressionTimerRef.current) clearInterval(compressionTimerRef.current)

    setShowTransition(true)
    setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= cprSteps.length - 1) {
          // Cycle back to compressions (step index 4) for CPR cycle
          setCycleCount((c) => c + 1)
          return 4 // Go back to compressions
        }
        return prev + 1
      })
      setShowTransition(false)
    }, 400)
  }, [stopSpeech])

  // Keep ref in sync so interval callbacks always get the latest version
  useEffect(() => {
    advanceStepRef.current = advanceStep
  }, [advanceStep])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeech()
      if (timerRef.current) clearInterval(timerRef.current)
      if (compressionTimerRef.current) clearInterval(compressionTimerRef.current)
    }
  }, [stopSpeech])

  // Start narration and timer when step changes
  useEffect(() => {
    if (!currentStep || !isRunning) return

    // Start narration
    speak(currentStep.narration)

    if (currentStep.type === "timed") {
      setTimeLeft(currentStep.duration)

      if (timerRef.current) clearInterval(timerRef.current)

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            advanceStepRef.current()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    if (currentStep.type === "compressions") {
      setCompressionCount(0)
      setTimeLeft(currentStep.duration)

      const msPerBeat = 60000 / BPM
      if (compressionTimerRef.current) clearInterval(compressionTimerRef.current)

      compressionTimerRef.current = setInterval(() => {
        setCompressionCount((prev) => {
          if (prev >= TARGET_COMPRESSIONS - 1) {
            if (compressionTimerRef.current) clearInterval(compressionTimerRef.current)
            setTimeout(() => advanceStepRef.current(), 500)
            return TARGET_COMPRESSIONS
          }
          return prev + 1
        })
      }, msPerBeat)

      // Also run the countdown
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (compressionTimerRef.current) clearInterval(compressionTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, isRunning])

  const startEmergency = useCallback(() => {
    setCurrentStepIndex(0)
    setIsRunning(true)
    setCycleCount(1)
  }, [])

  const stopEmergency = useCallback(() => {
    stopSpeech()
    if (timerRef.current) clearInterval(timerRef.current)
    if (compressionTimerRef.current) clearInterval(compressionTimerRef.current)
    setIsRunning(false)
    setCurrentStepIndex(-1)
    setTimeLeft(0)
    setCompressionCount(0)
  }, [stopSpeech])

  const skipStep = useCallback(() => {
    advanceStep()
  }, [advanceStep])

  // HOME SCREEN
  if (currentStepIndex === -1) {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center bg-[#0D0D0D] p-6">
        {/* Pulsing background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#E10600] rounded-full opacity-10 blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm text-center">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full border-4 border-[#E10600] flex items-center justify-center bg-[#E10600]/10">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E10600"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-[#F5F5F5] tracking-tight">
              CPR Emergency
              <span className="block text-[#E10600]">Assistant</span>
            </h1>
          </div>

          <p className="text-[#AAAAAA] text-base leading-relaxed">
            Step-by-step CPR guidance with voice narration and visual timers.
            Designed for emergencies.
          </p>

          {/* Start Button */}
          <button
            onClick={startEmergency}
            className="w-full py-6 bg-[#E10600] hover:bg-[#FF3B3B] text-[#F5F5F5] font-black text-xl rounded-2xl transition-all duration-200 active:scale-95 shadow-[0_0_40px_rgba(225,6,0,0.4)] hover:shadow-[0_0_60px_rgba(225,6,0,0.6)]"
          >
            START EMERGENCY CPR
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-[#666] leading-relaxed">
            This app is a guidance tool only. Always call emergency services
            first. Not a substitute for professional medical training.
          </p>

          {/* Back to home */}
          <button
            onClick={() => router.push("/")}
            className="text-sm text-[#AAAAAA] hover:text-[#F5F5F5] transition-colors underline underline-offset-4"
          >
            Back to Home
          </button>
        </div>
      </main>
    )
  }

  // STEP SCREEN
  return (
    <main
      className={`fixed inset-0 flex flex-col bg-[#0D0D0D] transition-opacity duration-300 ${
        showTransition ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0D0D0D] border-b border-[#E10600]/20">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#E10600] text-[#F5F5F5] text-sm font-black">
            {currentStep?.id}
          </span>
          <span className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-widest">
            Step {currentStep?.id} of {cprSteps.length}
            {cycleCount > 1 && (
              <span className="ml-2 text-[#E10600]">
                Cycle {cycleCount}
              </span>
            )}
          </span>
        </div>

        {/* Timer */}
        <TimerRing
          duration={currentStep?.duration ?? 10}
          timeLeft={timeLeft}
          size={56}
        />
      </header>

      {/* Step progress bar */}
      <div className="w-full h-1 bg-[#1A1A1A]">
        <div
          className="h-full bg-gradient-to-r from-[#E10600] to-[#FF3B3B] transition-all duration-500"
          style={{
            width: `${((currentStepIndex + 1) / cprSteps.length) * 100}%`,
          }}
        />
      </div>

      {/* Main content - scrollable */}
      <div
        key={currentStepIndex}
        className="flex-1 flex flex-col overflow-y-auto animate-step-enter"
      >
        {/* Step title */}
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-2xl md:text-3xl font-black text-[#F5F5F5] text-balance leading-tight">
            {currentStep?.title}
          </h2>
        </div>

        {/* Reference image */}
        <div className="px-4 py-3">
          <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#E10600]/10">
            {currentStep && (
              <Image
                src={currentStep.image}
                alt={currentStep.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>

        {/* Instruction text */}
        <div className="px-4 py-3">
          <p className="text-xl md:text-2xl font-semibold text-[#F5F5F5] leading-relaxed">
            {currentStep?.instruction}
          </p>
        </div>

        {/* BPM Indicator for compression step */}
        {currentStep?.type === "compressions" && (
          <div className="px-4 py-6 flex justify-center">
            <BPMIndicator
              bpm={BPM}
              isActive={isRunning}
              compressionCount={compressionCount}
              targetCompressions={TARGET_COMPRESSIONS}
            />
          </div>
        )}

        {/* Speaking indicator */}
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse" />
            <span className="w-1.5 h-3 rounded-full bg-[#E10600] animate-pulse" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-2 rounded-full bg-[#E10600] animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-xs text-[#AAAAAA] uppercase tracking-widest">
            Voice narrating
          </span>
        </div>
      </div>

      {/* Bottom actions */}
      <footer className="flex items-center gap-3 px-4 py-4 bg-[#0D0D0D] border-t border-[#E10600]/20">
        {/* Stop button */}
        <button
          onClick={stopEmergency}
          className="flex-none w-14 h-14 rounded-xl bg-[#1A1A1A] border border-[#333] flex items-center justify-center text-[#AAAAAA] hover:text-[#F5F5F5] hover:border-[#E10600] transition-all active:scale-95"
          aria-label="Stop emergency protocol"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>

        {/* Next / Skip button */}
        <button
          onClick={skipStep}
          className="flex-1 h-14 bg-[#E10600] hover:bg-[#FF3B3B] text-[#F5F5F5] font-bold text-lg rounded-xl transition-all duration-200 active:scale-95"
        >
          {isLastStep ? "RESTART CYCLE" : "NEXT STEP"}
        </button>
      </footer>
    </main>
  )
}
