export interface CPRStep {
  id: number
  title: string
  instruction: string
  narration: string
  image: string
  duration: number // seconds
  type: "timed" | "compressions"
}

export const cprSteps: CPRStep[] = [
  {
    id: 1,
    title: "Check Responsiveness",
    instruction: "Tap the person's shoulders firmly and shout: Are you okay?",
    narration:
      "Step 1. Check responsiveness. Tap the person's shoulders firmly and shout, Are you okay? Look for any signs of movement or response.",
    image: "/images/step-check-response.jpg",
    duration: 10,
    type: "timed",
  },
  {
    id: 2,
    title: "Call Emergency Services",
    instruction:
      "Call 911 immediately. Put the phone on speaker. Ask someone nearby to get an AED.",
    narration:
      "Step 2. Call 9 1 1 immediately. Put the phone on speaker mode. If someone is nearby, ask them to get an A E D.",
    image: "/images/step-call-911.jpg",
    duration: 12,
    type: "timed",
  },
  {
    id: 3,
    title: "Open the Airway",
    instruction:
      "Tilt the head back gently. Lift the chin up with two fingers.",
    narration:
      "Step 3. Open the airway. Place one hand on the forehead and tilt the head back gently. Lift the chin up with two fingers under the jaw bone.",
    image: "/images/step-open-airway.jpg",
    duration: 8,
    type: "timed",
  },
  {
    id: 4,
    title: "Check for Breathing",
    instruction:
      "Look at the chest for movement. Listen and feel for breath for no more than 10 seconds.",
    narration:
      "Step 4. Check for breathing. Look at the chest for any movement. Listen and feel for breath. Do this for no more than 10 seconds.",
    image: "/images/step-check-breathing.jpg",
    duration: 10,
    type: "timed",
  },
  {
    id: 5,
    title: "Perform Chest Compressions",
    instruction:
      "Place the heel of your hand on the center of the chest. Push hard and fast. 30 compressions at 120 BPM.",
    narration:
      "Step 5. Begin chest compressions now. Place the heel of your hand on the center of the chest. Interlock your fingers. Push hard and fast. 30 compressions at 120 beats per minute. Follow the beat.",
    image: "/images/step-compressions.jpg",
    duration: 18,
    type: "compressions",
  },
  {
    id: 6,
    title: "Give Rescue Breaths",
    instruction:
      "Tilt the head back. Pinch the nose shut. Give 2 breaths. Watch the chest rise.",
    narration:
      "Step 6. Give 2 rescue breaths. Tilt the head back, pinch the nose shut, and seal your mouth over theirs. Blow steadily for about 1 second each. Watch the chest rise.",
    image: "/images/step-rescue-breaths.jpg",
    duration: 12,
    type: "timed",
  },
]
