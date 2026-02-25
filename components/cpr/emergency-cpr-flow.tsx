"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cprSteps, type CPRStep } from "@/lib/cpr-steps"
import { useSpeechNarration } from "@/hooks/use-speech-narration"
import { TimerRing, BPMIndicator } from "@/components/cpr/timer-ring"

const BPM = 120
const TARGET_COMPRESSIONS = 30
const MS_PER_BEAT = 500 // 120 BPM = 500ms per beat

export function EmergencyCPRFlow() {
  const router = useRouter()
  const { speak, stop: stopSpeech, pause: pauseSpeech, resume: resumeSpeech } =
    useSpeechNarration()

  // ===== STATE: Stable component state =====
  const [currentStepIndex, setCurrentStepIndex] = useState(-1) // -1 = home screen
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [compressionCount, setCompressionCount] = useState(0)
  const [cycleCount, setCycleCount] = useState(1)
  const [showTransition, setShowTransition] = useState(false)
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const [showSOSPopup, setShowSOSPopup] = useState(false)

  // ===== REFS: Stable references =====
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioInitializedRef = useRef(false)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const compressionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const metronomeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pausedTimeRef = useRef(0)
  const stepNarrationStartedRef = useRef(false)
  const isAdvancingRef = useRef(false)

  const currentStep: CPRStep | null =
    currentStepIndex >= 0 && currentStepIndex < cprSteps.length
      ? cprSteps[currentStepIndex]
      : null

  const isLastStep = currentStepIndex === cprSteps.length - 1

  // Initialize Web Audio API on user interaction
  const initializeAudio = useCallback(() => {
    if (audioInitializedRef.current) return

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = ctx
      audioInitializedRef.current = true

      // Resume audio context if suspended (required on mobile)
      if (ctx.state === "suspended") {
        ctx.resume()
      }
    } catch (err) {
      console.error("[v0] Audio initialization error:", err)
    }
  }, [])

  // Play emergency-grade beep using Web Audio API
  const playBeep = useCallback(() => {
    if (!audioContextRef.current || isPaused) return

    try {
      const ctx = audioContextRef.current

      // Ensure audio context is running
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      // Emergency-grade beep: 1100 Hz for strong, clear sound
      osc.frequency.value = 1100
      osc.type = "sine"

      // Sharp attack with stronger gain, quick decay (0.1s duration)
      gain.gain.setValueAtTime(0.5, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch (err) {
      console.error("[v0] Beep playback error:", err)
    }
  }, [isPaused])

  // Advance to next step with strict sequential enforcement
  const advanceStepSequential = useCallback(() => {
    if (isAdvancingRef.current) return // Prevent double execution
    isAdvancingRef.current = true

    stopSpeech()
    clearAllIntervals()
    setPulseAnimation(false)
    setIsPaused(false)

    setShowTransition(true)
    setTimeout(() => {
      setCurrentStepIndex((prevIndex) => {
        // Strict sequential: only increment by 1
        let nextIndex = prevIndex + 1

        // Cycle back to compressions (step 4) after breathing (step 5)
        if (nextIndex >= cprSteps.length) {
          setCycleCount((c) => c + 1)
          nextIndex = 4 // Index of compressions step
        }

        // Enforce bounds
        if (nextIndex < 0) nextIndex = 0
        if (nextIndex >= cprSteps.length) nextIndex = cprSteps.length - 1

        isAdvancingRef.current = false
        stepNarrationStartedRef.current = false
        return nextIndex
      })
      setShowTransition(false)
    }, 400)
  }, [stopSpeech, clearAllIntervals])

  // Clear all active intervals
  const clearAllIntervals = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    if (compressionIntervalRef.current) clearInterval(compressionIntervalRef.current)
    if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current)
  }, [])

  // Pause: Freeze all timers and audio
  const pauseCPR = useCallback(() => {
    if (!isRunning || isPaused) return

    pauseSpeech()
    clearAllIntervals()
    setPulseAnimation(false)
    pausedTimeRef.current = timeRemaining
    setIsPaused(true)
  }, [isRunning, isPaused, timeRemaining, pauseSpeech, clearAllIntervals])

  // Resume: Continue from paused state without resetting
  const resumeCPR = useCallback(() => {
    if (!isRunning || !isPaused) return

    resumeSpeech()
    setIsPaused(false)
    // Timers will be restarted by the useEffect when isPaused changes
  }, [isRunning, isPaused, resumeSpeech])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeech()
      clearAllIntervals()
    }
  }, [stopSpeech, clearAllIntervals])

  // Start step narration and timers - FIXED to prevent step skipping
  useEffect(() => {
    if (!currentStep || !isRunning || isPaused) {
      stepNarrationStartedRef.current = false
      return
    }

    // Prevent duplicate narration of same step
    if (stepNarrationStartedRef.current) {
      return
    }
    stepNarrationStartedRef.current = true

    // Define the auto-advance callback (only for timed steps)
    const onNarrationComplete = () => {
      if (currentStep.type === "timed") {
        advanceStepSequential()
      }
    }

    // Start narration with completion callback
    speak(currentStep.narration, onNarrationComplete)

    // Handle timed steps - countdown timer only
    if (currentStep.type === "timed") {
      setTimeRemaining(currentStep.duration)
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
    }

    // Handle compression steps
    if (currentStep.type === "compressions") {
      setCompressionCount(0)
      setTimeRemaining(currentStep.duration)

      // Start 120 BPM metronome: beep every 500ms
      metronomeIntervalRef.current = setInterval(() => {
        playBeep()
        setPulseAnimation(true)
        setTimeout(() => setPulseAnimation(false), 120)
      }, MS_PER_BEAT)

      // Sync compression counter with metronome beats
      compressionIntervalRef.current = setInterval(() => {
        setCompressionCount((prev) => {
          const newCount = prev + 1
          if (newCount >= TARGET_COMPRESSIONS) {
            // Auto-advance after compressions complete
            advanceStepSequential()
            return TARGET_COMPRESSIONS
          }
          return newCount
        })
      }, MS_PER_BEAT)

      // Countdown timer (independent of beat counter)
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
    }

    return () => {
      clearAllIntervals()
    }
  }, [currentStepIndex, isRunning, isPaused, currentStep, playBeep, clearAllIntervals, speak])

  const startEmergency = useCallback(() => {
    initializeAudio()
    setCurrentStepIndex(0)
    setIsRunning(true)
    setIsPaused(false)
    setCycleCount(1)
    setCompressionCount(0)
    setTimeRemaining(0)
  }, [initializeAudio])

  const stopEmergency = useCallback(() => {
    stopSpeech()
    clearAllIntervals()
    setPulseAnimation(false)
    setIsRunning(false)
    setIsPaused(false)
    setCurrentStepIndex(-1)
    setTimeRemaining(0)
    setCompressionCount(0)
    setCycleCount(1)
  }, [stopSpeech, clearAllIntervals])

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

        {/* Paused Indicator */}
        {isPaused && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E10600] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
            PAUSED
          </div>
        )}

        {/* Timer */}
        {!isPaused && (
          <TimerRing
            duration={currentStep?.duration ?? 10}
            timeLeft={timeRemaining}
            size={56}
          />
        )}
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
              isPulsing={pulseAnimation}
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
      <footer className={`flex items-center gap-3 px-4 py-4 bg-[#0D0D0D] border-t border-[#E10600]/20 ${currentStep?.id === 2 ? 'pr-20' : ''}`}>
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

        {/* Pause/Resume button */}
        <button
          onClick={isPaused ? resumeCPR : pauseCPR}
          className={`flex-none w-14 h-14 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
            isPaused
              ? "bg-[#1A5C1A] border-[#2ECC71] text-[#2ECC71] hover:bg-[#1F7A1F]"
              : "bg-[#1A1A1A] border-[#333] text-[#AAAAAA] hover:text-[#F5F5F5] hover:border-[#E10600]"
          }`}
          aria-label={isPaused ? "Resume CPR" : "Pause CPR"}
        >
          {isPaused ? (
            // Resume icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 3v18l15-9z" />
            </svg>
          ) : (
            // Pause icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </button>

        {/* Next / Skip button */}
        <button
          onClick={advanceStepSequential}
          className="flex-1 h-14 bg-[#E10600] hover:bg-[#FF3B3B] text-[#F5F5F5] font-bold text-lg rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
          disabled={isPaused}
        >
          {isLastStep ? "RESTART CYCLE" : "NEXT STEP"}
        </button>

        {/* SOS Button - visible only in Step 2, positioned on the right */}
        {currentStep?.id === 2 && (
          <button
            onClick={() => setShowSOSPopup(true)}
            className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#E10600] hover:from-[#FF5555] hover:to-[#FF3B3B] text-white font-black text-xs flex items-center justify-center shadow-lg hover:shadow-red-600/50 transition-all transform hover:scale-110 active:scale-95 animate-pulse z-30"
            title="Emergency Services Helpline"
          >
            <span className="text-center leading-tight">SOS</span>
          </button>
        )}
      </footer>

      {/* SOS Popup Modal */}
      {showSOSPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSOSPopup(false)} />
          <div
            className="relative bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 border-[#E10600] rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in"
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
              <h3 className="text-2xl font-black text-[#F5F5F5] mb-2">Emergency Helplines</h3>
              <p className="text-sm text-[#AAAAAA]">India Helpline Numbers</p>
            </div>

            {/* Helpline Numbers */}
            <div className="space-y-3">
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Medical Helpline</p>
                <p className="text-2xl font-black text-[#E10600]">108</p>
              </div>
              <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#E10600] border-opacity-30">
                <p className="text-xs text-[#AAAAAA] uppercase tracking-widest mb-1">Ambulance Helpline</p>
                <p className="text-2xl font-black text-[#E10600]">102</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 pt-6 border-t border-[#E10600] border-opacity-20">
              <p className="text-sm text-[#AAAAAA] leading-relaxed">
                Call these numbers immediately for professional emergency services. This app is a guidance tool only.
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
    </main>
  )
}
