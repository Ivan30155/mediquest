"use client"

import { useEffect, useRef, useCallback } from "react"

export function useSpeechNarration() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const isSpeakingRef = useRef(false)

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      isSpeakingRef.current = false
    }
  }, [])

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return

      stop()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Prefer a clear English voice
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Daniel"))
      )
      if (preferred) {
        utterance.voice = preferred
      } else {
        const english = voices.find((v) => v.lang.startsWith("en"))
        if (english) utterance.voice = english
      }

      utterance.onstart = () => {
        isSpeakingRef.current = true
      }
      utterance.onend = () => {
        isSpeakingRef.current = false
        onEnd?.()
      }
      utterance.onerror = () => {
        isSpeakingRef.current = false
        onEnd?.()
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [stop]
  )

  useEffect(() => {
    // Preload voices
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices()
    }
    return () => {
      stop()
    }
  }, [stop])

  return { speak, stop, isSpeaking: isSpeakingRef }
}
