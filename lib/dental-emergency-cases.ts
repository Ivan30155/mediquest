'use client'

export type CaseType = 'silent-allergen' | 'morning-collapse'

export interface SimulationLevel {
  id: number
  scenario: string
  question: string
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
  explanation: string
  score: number
  medicalContext: string
}

export interface SimulationCase {
  id: CaseType
  title: string
  description: string
  mode: string
  totalLevels: number
  levels: SimulationLevel[]
}

// CASE 1: THE SILENT ALLERGEN (8 levels)
export const SILENT_ALLERGEN: SimulationCase = {
  id: 'silent-allergen',
  title: 'The Silent Allergen',
  description: 'Advanced Mode - 27-year-old female presenting for surgical extraction of impacted 48',
  mode: 'Advanced Mode',
  totalLevels: 8,
  levels: [
    {
      id: 1,
      scenario: '11:30 AM – Minor Oral Surgery Room. Patient reports mild asthma and seasonal allergies. 3 minutes post-injection: Patient says "My lips feel swollen..." You observe erythematous rash on neck, lip edema, mild cough.',
      question: 'Your FIRST action?',
      options: [
        { id: 'a', text: 'Continue extraction', isCorrect: false },
        { id: 'b', text: 'Observe', isCorrect: false },
        { id: 'c', text: 'Stop procedure immediately', isCorrect: true },
        { id: 'd', text: 'Give oral antihistamine', isCorrect: false },
      ],
      explanation: 'STOP the procedure immediately. Early warning signs of anaphylaxis require immediate cessation of treatment. This is the critical first step.',
      score: 13,
      medicalContext: 'Anaphylaxis Recognition - Early Warning Signs',
    },
    {
      id: 2,
      scenario: '2 minutes later: Hoarse voice, Stridor beginning, BP 88/60 (down from 118/76), Pulse 124 (up from 82), Patient anxious.',
      question: 'Most likely diagnosis?',
      options: [
        { id: 'a', text: 'Vasovagal syncope', isCorrect: false },
        { id: 'b', text: 'Panic attack', isCorrect: false },
        { id: 'c', text: 'Anaphylaxis', isCorrect: true },
        { id: 'd', text: 'LA toxicity', isCorrect: false },
      ],
      explanation: 'ANAPHYLAXIS - Hypotension, tachycardia, airway involvement (stridor), and urticaria confirm systemic allergic reaction. This is life-threatening.',
      score: 12,
      medicalContext: 'Differential Diagnosis - Systemic Allergic Reaction',
    },
    {
      id: 3,
      scenario: 'Patient now showing airway compromise and cardiovascular collapse signs.',
      question: 'What is the immediate treatment?',
      options: [
        { id: 'a', text: 'IV hydrocortisone', isCorrect: false },
        { id: 'b', text: 'IM epinephrine', isCorrect: true },
        { id: 'c', text: 'IV antihistamine', isCorrect: false },
        { id: 'd', text: 'Oxygen only', isCorrect: false },
      ],
      explanation: 'IM EPINEPHRINE is the definitive first-line treatment for anaphylaxis. Steroids and antihistamines are secondary. Oxygen alone is insufficient.',
      score: 13,
      medicalContext: 'First-Line Drug Selection - Epinephrine Priority',
    },
    {
      id: 4,
      scenario: 'You open the emergency kit. Epinephrine available: 1:1000 concentration.',
      question: 'What is the correct adult dose?',
      options: [
        { id: 'a', text: '1 mg IM', isCorrect: false },
        { id: 'b', text: '0.5 mg IM', isCorrect: true },
        { id: 'c', text: '0.05 mg IM', isCorrect: false },
        { id: 'd', text: '5 mg IM', isCorrect: false },
      ],
      explanation: 'CORRECT DOSE: 0.5 mg IM (0.5 mL of 1:1000 solution). This is the standard adult anaphylaxis dose. Incorrect dosing is fatal.',
      score: 13,
      medicalContext: 'Dose Calculation - Critical Competency',
    },
    {
      id: 5,
      scenario: 'You have the epinephrine syringe loaded with correct dose.',
      question: 'Where do you inject?',
      options: [
        { id: 'a', text: 'Deltoid', isCorrect: false },
        { id: 'b', text: 'Subcutaneous forearm', isCorrect: false },
        { id: 'c', text: 'Outer mid-thigh (vastus lateralis)', isCorrect: true },
        { id: 'd', text: 'Intravenous line', isCorrect: false },
      ],
      explanation: 'OUTER MID-THIGH (Vastus Lateralis) - IM injection in anterolateral thigh. Provides fastest absorption and most reliable delivery in emergency.',
      score: 12,
      medicalContext: 'Injection Site Selection - Optimal Delivery',
    },
    {
      id: 6,
      scenario: 'You are ready to administer epinephrine IM.',
      question: 'Which technique is correct?',
      options: [
        { id: 'a', text: 'Subcutaneous shallow injection', isCorrect: false },
        { id: 'b', text: 'Deep intramuscular at 90° angle', isCorrect: true },
        { id: 'c', text: 'Intradermal injection', isCorrect: false },
        { id: 'd', text: 'Slow IV push', isCorrect: false },
      ],
      explanation: 'DEEP IM AT 90° - Use 23-25 gauge needle, insert perpendicular, into anterolateral thigh muscle. May repeat every 5-15 minutes if needed.',
      score: 12,
      medicalContext: 'Injection Technique - Safety & Efficacy',
    },
    {
      id: 7,
      scenario: 'Epinephrine given. Patient stabilizing. Multiple tasks need priority.',
      question: 'Arrange correct sequence: Give epinephrine, Call EMS, Lay patient supine, Provide high-flow oxygen',
      options: [
        { id: 'a', text: '1 → 3 → 4 → 2', isCorrect: true },
        { id: 'b', text: '3 → 1 → 2 → 4', isCorrect: false },
        { id: 'c', text: '2 → 1 → 3 → 4', isCorrect: false },
        { id: 'd', text: '1 → 2 → 3 → 4', isCorrect: false },
      ],
      explanation: 'CORRECT SEQUENCE: Epinephrine FIRST (life-saving), Position supine, Oxygen, Call EMS. Epinephrine must be given immediately.',
      score: 13,
      medicalContext: 'Emergency Protocol Sequence - Priority Management',
    },
    {
      id: 8,
      scenario: 'Post-recovery investigation: Patient reported "No known drug allergies" but reaction occurred after lignocaine injection.',
      question: 'True allergy to amide local anesthetics like lignocaine is:',
      options: [
        { id: 'a', text: 'Very common', isCorrect: false },
        { id: 'b', text: 'Rare', isCorrect: true },
        { id: 'c', text: 'Always fatal', isCorrect: false },
        { id: 'd', text: 'Same as adrenaline reaction', isCorrect: false },
      ],
      explanation: 'RARE - True IgE-mediated allergy to amides is extremely rare. Most likely: allergy to preservative (methylparaben) or sulfite in solution.',
      score: 13,
      medicalContext: 'Root Cause Analysis - Preservative Allergy Recognition',
    },
  ],
}

// CASE 2: THE MORNING COLLAPSE (5 levels)
export const MORNING_COLLAPSE: SimulationCase = {
  id: 'morning-collapse',
  title: 'The Morning Collapse',
  description: 'Diagnostic Precision Mode - 18-year-old male first invasive procedure',
  mode: 'Diagnostic Precision Mode',
  totalLevels: 5,
  levels: [
    {
      id: 1,
      scenario: '9:00 AM – General Dentistry Operatory. 18-year-old male, no systemic disease, no allergies, visibly anxious. Local anesthesia administered. While waiting: Patient says "I feel lightheaded..." You observe pale face, sweating, Pulse 52/min (bradycardia).',
      question: 'Most likely diagnosis?',
      options: [
        { id: 'a', text: 'Anaphylaxis', isCorrect: false },
        { id: 'b', text: 'Vasovagal syncope', isCorrect: true },
        { id: 'c', text: 'Hypoglycemia', isCorrect: false },
        { id: 'd', text: 'LA toxicity', isCorrect: false },
      ],
      explanation: 'VASOVAGAL SYNCOPE - Classic triad: anxiety, bradycardia, and pallor. Distinct from anaphylaxis which shows tachycardia and rash.',
      score: 20,
      medicalContext: 'Differential Diagnosis - Syncope Recognition',
    },
    {
      id: 2,
      scenario: 'Confirming differential: You note pale skin, sweating, and notably SLOW pulse (52/min). No rash visible. No airway swelling.',
      question: 'Which feature supports syncope over anaphylaxis?',
      options: [
        { id: 'a', text: 'Rash', isCorrect: false },
        { id: 'b', text: 'Tachycardia', isCorrect: false },
        { id: 'c', text: 'Bradycardia', isCorrect: true },
        { id: 'd', text: 'Lip swelling', isCorrect: false },
      ],
      explanation: 'BRADYCARDIA is the key differentiator. Syncope shows slow pulse via parasympathetic activation. Anaphylaxis shows rapid pulse from catecholamine release.',
      score: 18,
      medicalContext: 'Clinical Differentiation - Heart Rate Significance',
    },
    {
      id: 3,
      scenario: 'Patient loses consciousness during waiting period. Vitals: BP dropping, weak pulse, slow respirations.',
      question: 'What do you do FIRST?',
      options: [
        { id: 'a', text: 'Inject epinephrine', isCorrect: false },
        { id: 'b', text: 'Sit upright', isCorrect: false },
        { id: 'c', text: 'Supine position with legs elevated', isCorrect: true },
        { id: 'd', text: 'Begin CPR', isCorrect: false },
      ],
      explanation: 'SUPINE + LEGS ELEVATED - Gravity assists return of blood to brain and heart. This simple positional maneuver is the primary treatment for syncope.',
      score: 20,
      medicalContext: 'Management - Gravitational Positioning',
    },
    {
      id: 4,
      scenario: 'Patient now in recovery phase. Select ALL correct management actions.',
      question: 'Select ALL correct actions for syncope management:',
      options: [
        { id: 'a', text: 'Maintain airway', isCorrect: true },
        { id: 'b', text: 'Loosen tight clothing', isCorrect: true },
        { id: 'c', text: 'Provide oxygen', isCorrect: true },
        { id: 'd', text: 'Give IM epinephrine', isCorrect: false },
      ],
      explanation: 'A, B, C are CORRECT. Airway maintenance, remove restrictive clothing, oxygen support are all supportive. Epinephrine is contraindicated in syncope.',
      score: 18,
      medicalContext: 'Supportive Management - Multi-Modal Approach',
    },
    {
      id: 5,
      scenario: 'After recovery, patient states: "I rushed here... didn\'t eat anything." You review: no breakfast, anxiety about procedure, no sleep issues.',
      question: 'Most likely trigger for syncope episode?',
      options: [
        { id: 'a', text: 'Drug allergy', isCorrect: false },
        { id: 'b', text: 'Anxiety + empty stomach', isCorrect: true },
        { id: 'c', text: 'Cardiac arrhythmia', isCorrect: false },
        { id: 'd', text: 'Toxic reaction', isCorrect: false },
      ],
      explanation: 'ANXIETY + FASTING - Combined psychological stress and hypoglycemia trigger vasovagal response in young, anxious patients. Prevention: eat before appointment.',
      score: 11,
      medicalContext: 'Root Cause - Risk Factor Assessment',
    },
  ],
}

export const ALL_CASES = [SILENT_ALLERGEN, MORNING_COLLAPSE]
