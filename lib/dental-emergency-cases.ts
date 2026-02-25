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

export const SILENT_ALLERGEN: SimulationCase = {
  id: 'silent-allergen',
  title: 'The Silent Allergen',
  description: 'Advanced Mode - Patient experiencing anaphylaxis during routine procedure',
  mode: 'Advanced Mode',
  totalLevels: 8,
  levels: [
    {
      id: 1,
      scenario:
        '25-year-old female patient under local anesthesia for root canal treatment. 5 minutes into procedure, you notice patient becoming restless and flushed.',
      question: 'What is your first clinical observation concern?',
      options: [
        {
          id: 'a',
          text: 'Anxiety reaction to procedure',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Early signs of anaphylaxis - urticaria and flushing',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Vasovagal syncope',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Hypertension crisis',
          isCorrect: false,
        },
      ],
      explanation:
        'Flushing and restlessness are early signs of anaphylaxis. The urticaria (skin reaction) combined with behavioral changes indicates immunological response rather than psychological anxiety.',
      score: 10,
      medicalContext: 'Anaphylaxis - Immediate allergic reaction',
    },
    {
      id: 2,
      scenario:
        'Patient now has audible wheeze and difficulty breathing. SpO2 drops to 92%. Patient is fully conscious but distressed.',
      question: 'What is the immediate priority action?',
      options: [
        {
          id: 'a',
          text: 'Continue treatment and monitor closely',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Administer epinephrine 0.3-0.5mg IM immediately',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Give antihistamines and observe',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Call for ambulance and wait',
          isCorrect: false,
        },
      ],
      explanation:
        'Respiratory symptoms with hypoxia indicate moderate-to-severe anaphylaxis. IM epinephrine is the first-line treatment - IM route ensures systemic absorption even if vascular collapse occurs.',
      score: 15,
      medicalContext: 'Anaphylaxis Management - First-line therapy',
    },
    {
      id: 3,
      scenario:
        'After epinephrine injection, patient breathing improves slightly but blood pressure drops to 80/50mmHg. Patient remains conscious.',
      question: 'What is the next immediate intervention?',
      options: [
        {
          id: 'a',
          text: 'Reassure patient and wait for recovery',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Place patient supine with legs elevated; establish IV access; consider second epinephrine dose',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Give oxygen only',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Transport to hospital immediately',
          isCorrect: false,
        },
      ],
      explanation:
        'Hypotension with anaphylaxis requires aggressive fluid resuscitation and positioning. Supine with elevated legs maximizes cerebral perfusion. IV access enables rapid medication administration. A second epinephrine dose may be needed if no response in 5-15 minutes.',
      score: 15,
      medicalContext: 'Shock management in Anaphylaxis',
    },
    {
      id: 4,
      scenario:
        'You have established IV access and started fluid resuscitation. Patient vitals stabilizing: BP 95/60, HR 110, SpO2 94%. Breathing easier but still wheezing.',
      question: 'Which additional medication should be administered now?',
      options: [
        {
          id: 'a',
          text: 'Propranolol beta blocker',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'H1 and H2 antihistamines IV, Corticosteroids IV',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Only H1 antihistamines',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'No additional medications needed',
          isCorrect: false,
        },
      ],
      explanation:
        'Secondary treatment in anaphylaxis includes H1-antihistamines (blocks histamine receptors) and H2-antihistamines (blocks gastric acid) plus corticosteroids to prevent biphasic reactions and reduce inflammation. Beta-blockers are contraindicated in anaphylaxis.',
      score: 15,
      medicalContext: 'Secondary Anaphylaxis Treatment',
    },
    {
      id: 5,
      scenario:
        'Patient stabilizing well. HR 95, BP 105/70, SpO2 96%, breathing normal. No active wheeze. Patient reports throat tightness has resolved.',
      question: 'What is critical about discharge planning?',
      options: [
        {
          id: 'a',
          text: 'Patient can go home immediately',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Admit for observation - risk of biphasic anaphylaxis. Prescribe epinephrine auto-injector. Refer to allergy specialist.',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Just prescribe antihistamines',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Discharge with steroid prescription only',
          isCorrect: false,
        },
      ],
      explanation:
        'Biphasic anaphylaxis can occur hours later in 1-3% of cases. Hospital observation is essential. Epinephrine auto-injector prescription and allergy testing are mandatory to identify the causative agent.',
      score: 15,
      medicalContext: 'Post-Anaphylaxis Management',
    },
    {
      id: 6,
      scenario:
        'Patient allergy testing identifies latex sensitivity. Dental procedure can resume only after addressing this.',
      question: 'Which protective measures must be implemented?',
      options: [
        {
          id: 'a',
          text: 'Use latex-free gloves and equipment; premedicate with antihistamines',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Just use thinner latex gloves',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Proceed normally - one reaction is enough',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Refer to another dentist',
          isCorrect: false,
        },
      ],
      explanation:
        'Complete elimination of latex exposure is essential for latex-allergic patients. All equipment, gloves, dam, and instruments must be latex-free. Premedication with H1-antihistamines may reduce minor reactions but does not prevent true anaphylaxis.',
      score: 10,
      medicalContext: 'Latex-Free Protocol Implementation',
    },
    {
      id: 7,
      scenario:
        'During rescheduled procedure with latex-free setup, patient remains stable. Procedure completed successfully. No adverse reactions observed.',
      question: 'What documentation is legally and clinically necessary?',
      options: [
        {
          id: 'a',
          text: 'Brief note: "No issues today"',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Detailed documentation of previous anaphylaxis event, treatment given, allergen identified, preventive measures, and consent for future procedures',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Standard treatment notes only',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'No additional documentation needed',
          isCorrect: false,
        },
      ],
      explanation:
        'Comprehensive medical-legal documentation is critical. Record includes: incident timeline, symptoms observed, medications given with doses/times, vitals, outcomes, allergen identified, and modifications made. This protects both patient safety and practice liability.',
      score: 10,
      medicalContext: 'Medical Record Documentation',
    },
    {
      id: 8,
      scenario:
        'Patient asks about preventing future allergic reactions during dental visits. You create a personalized management plan.',
      question: 'What should be included in the allergy action plan?',
      options: [
        {
          id: 'a',
          text: 'Just avoid latex',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Identification of allergen, latex-free protocol, medication list, emergency procedures, allergy documentation on chart, patient carries epinephrine auto-injector, alert in EMR system',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Prescribe antihistamines before all visits',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'No specific plan needed',
          isCorrect: false,
        },
      ],
      explanation:
        'Comprehensive allergy action plans prevent future incidents. EMR alerts ensure all staff are aware. Patient education about auto-injector use is lifesaving. Clear protocols for latex-free treatment reduce stress and improve patient compliance.',
      score: 15,
      medicalContext: 'Preventive Allergy Management Plan',
    },
  ],
}

export const MORNING_COLLAPSE: SimulationCase = {
  id: 'morning-collapse',
  title: 'The Morning Collapse',
  description: 'Diagnostic Precision Mode - Patient collapses during morning appointment',
  mode: 'Diagnostic Precision Mode',
  totalLevels: 5,
  levels: [
    {
      id: 1,
      scenario:
        '42-year-old male patient collapses in waiting room at 9:30 AM. Assistant reports patient was standing, suddenly lost consciousness. No seizure activity observed. Patient lying motionless.',
      question: 'What are the differential diagnoses to consider immediately?',
      options: [
        {
          id: 'a',
          text: 'Vasovagal syncope or cardiac arrhythmia',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Only hypoglycemia',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Only seizure disorder',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Sleep deprivation',
          isCorrect: false,
        },
      ],
      explanation:
        'Sudden loss of consciousness in standing position suggests cardiac or vasovagal etiology. Absence of seizure activity makes seizure less likely. Hypoglycemia and sleep deprivation cause altered consciousness, not sudden collapse. Early assessment of cardiac rhythm and responsiveness is critical.',
      score: 10,
      medicalContext: 'Syncope Differential Diagnosis',
    },
    {
      id: 2,
      scenario:
        'Patient is responsive to verbal stimuli. You check: Pulse is weak and thready at 48 bpm. Blood pressure 85/55. Respiratory rate 10/min and shallow. Patient breathing but not fully alert.',
      question: 'What critical action must you take first?',
      options: [
        {
          id: 'a',
          text: 'Position supine with legs elevated; call EMS; obtain AED; establish airway monitoring',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Give coffee to wake patient up',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Move patient to treatment room and wait',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Check blood glucose only',
          isCorrect: false,
        },
      ],
      explanation:
        'Bradycardia, hypotension, and shallow respiration suggest cardiac compromise or significant metabolic issue. Immediate positioning (supine, legs elevated) improves cerebral perfusion. EMS activation ensures definitive care. AED readiness is critical if arrhythmia is present.',
      score: 15,
      medicalContext: 'Cardiac Emergency Response',
    },
    {
      id: 3,
      scenario:
        'EMS called. While waiting, you establish basic vitals. Patient becomes more alert. You find his glucose is 45 mg/dL (severely hypoglycemic). Patient is confused, sweating, trembling.',
      question: 'What is the immediate treatment for hypoglycemia at this severity?',
      options: [
        {
          id: 'a',
          text: 'Give oral glucose tablets',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'IV dextrose 50% or IM glucagon if IV not available; monitor closely',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Just reassure and wait',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Give insulin',
          isCorrect: false,
        },
      ],
      explanation:
        'Severe hypoglycemia (45 mg/dL) with altered consciousness requires rapid glucose delivery. Oral route is ineffective when patient cannot swallow safely. IV dextrose 50% is gold standard. IM glucagon is alternative if IV access unavailable. Reassurance alone risks seizures or permanent brain damage.',
      score: 15,
      medicalContext: 'Severe Hypoglycemia Management',
    },
    {
      id: 4,
      scenario:
        'After IV dextrose administration, patient glucose rises to 120 mg/dL. Vitals improve: HR 72, BP 115/70, RR 16, O2 sat 98%. Patient is fully alert and oriented. He reports being diabetic but forgot breakfast before appointment.',
      question: 'What is the underlying cause and prevention strategy?',
      options: [
        {
          id: 'a',
          text: 'Type 1 or Type 2 diabetes with inadequate carbohydrate intake; patient education on pre-appointment protocol',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Patient is deliberately being difficult',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'No prevention possible',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Blame the patient for not managing diabetes',
          isCorrect: false,
        },
      ],
      explanation:
        'Diabetic patients require stable blood glucose for dental procedures. Skipping meals before appointments is common but preventable. Patient education, rescheduling flexibility, and keeping quick-acting carbohydrates on hand reduce incidents. Early morning appointments without breakfast are high-risk.',
      score: 15,
      medicalContext: 'Diabetes and Dental Care Planning',
    },
    {
      id: 5,
      scenario:
        'Patient recovers fully and wants to continue with scheduled treatment. He has eaten and stabilized. Family history reveals father had cardiac issues. Medical review shows no current cardiac contraindications for dental work.',
      question: 'What is your clinical decision for proceeding?',
      options: [
        {
          id: 'a',
          text: 'Proceed immediately - no concerns',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'Reschedule; contact his physician for cardiac clearance; establish diabetes management protocol; plan shorter, less stressful appointments',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'Refer to hospital',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Refuse to treat patient',
          isCorrect: false,
        },
      ],
      explanation:
        'Although immediate risk has resolved, this event indicates need for interdisciplinary coordination. Physician clearance for cardiac status is prudent given family history. Shorter appointments reduce stress-induced glucose fluctuations. Diabetes management protocol ensures adequate pre-appointment nutrition and medication timing. This approach balances patient safety with continued care.',
      score: 15,
      medicalContext: 'Risk Stratification and Care Planning',
    },
  ],
}
