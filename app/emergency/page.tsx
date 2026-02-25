import { EmergencyCPRFlow } from "@/components/cpr/emergency-cpr-flow"

export const metadata = {
  title: "CPR Emergency Assistant - PulseGuide",
  description:
    "Step-by-step CPR emergency guidance with voice narration and visual timers",
}

export default function EmergencyPage() {
  return <EmergencyCPRFlow />
}
