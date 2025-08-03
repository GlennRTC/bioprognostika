# Wireframes & Interface Design

## Landing Page Wireframe

### Above the Fold (Hero Section)
```
┌─────────────────────────────────────────────────────────────┐
│ [LOGO] BioTwin Research                    [Research Badge] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Explore Your Heart Health Future                   │
│         ═══════════════════════════════                    │
│                                                             │
│    See how lifestyle changes could impact your             │
│    cardiovascular risk in this educational research tool   │
│                                                             │
│    ┌─────────────────────────────┐  [Trust Indicators]     │
│    │   Start 5-Minute Assessment │  • Research-based       │
│    │           ↓                 │  • Educational only     │
│    └─────────────────────────────┘  • Privacy protected   │
│                                                             │
│                    [Preview Image: Risk Visualization]     │
└─────────────────────────────────────────────────────────────┘
```

### How It Works Section
```
┌─────────────────────────────────────────────────────────────┐
│                     How It Works                            │
│                     ══════════                              │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │    [1]      │    │    [2]      │    │    [3]      │     │
│  │  Answer     │ →  │  Explore    │ →  │   Share     │     │
│  │ Questions   │    │ Scenarios   │    │  Results    │     │
│  │             │    │             │    │             │     │
│  │  3 minutes  │    │  Instant    │    │  Optional   │     │
│  │  simple     │    │  what-if    │    │  feedback   │     │
│  │  inputs     │    │  analysis   │    │  for others │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│           See What Your Future Health Could Look Like      │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │      Try It Now - Free      │                │
│            └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Trust & Credibility Section
```
┌─────────────────────────────────────────────────────────────┐
│                 Educational Research Tool                   │
│                 ═══════════════════════                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ⚠️  IMPORTANT DISCLAIMER:                               ││
│  │ This tool is for educational and research purposes      ││
│  │ only. Results are not medical advice. Always consult   ││
│  │ healthcare professionals for medical decisions.         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Evidence-Based Algorithm    •    University Partnership   │
│  Privacy-First Design       •    No Data Storage          │
│  Open Research Methods      •    Peer-Reviewed Sources    │
│                                                             │
│  "This tool helped me understand cardiovascular risk       │
│   factors in a way that motivated me to make changes."     │
│   - Research Participant                                   │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │    Start Assessment →       │                │
│            └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Calculator Interface Wireframes

### Welcome Screen
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Home                          BioTwin Research   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Cardiovascular Risk Assessment                 │
│              ═══════════════════════════                   │
│                                                             │
│  This 5-minute assessment will help you explore how        │
│  lifestyle changes might impact your heart health risk.    │
│                                                             │
│  What you'll do:                                           │
│  • Answer questions about your current health & lifestyle  │
│  • See your estimated cardiovascular risk                  │
│  • Explore "what-if" scenarios with different choices      │
│                                                             │
│  Your privacy:                                             │
│  • No data is stored or shared                            │
│  • Results stay on your device                            │
│  • Optional email for research updates only               │
│                                                             │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │     Begin Assessment        │                │
│            └─────────────────────────────┘                │
│                                                             │
│                   Takes about 5 minutes                    │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: Basic Information
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                               Progress: ●●○ (1/3)   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Basic Information                        │
│                    ═══════════════                         │
│                                                             │
│  Age (years)                                               │
│  ┌─────────────┐  [?] Used to calculate age-related risk   │
│  │    [45]     │                                           │
│  └─────────────┘                                           │
│                                                             │
│  Gender                                                     │
│  ○ Male  ○ Female  ○ Other  [?] Affects risk calculations  │
│                                                             │
│  Height                    Weight                          │
│  ┌─────┐ ┌─────┐          ┌─────┐ ┌─────┐                 │
│  │ 5   │ │ 8   │ ft       │ 170 │ │ lbs │                 │
│  └─────┘ └─────┘          └─────┘ └─────┘                 │
│                                                             │
│  Current Activity Level                                     │
│  ○ Sedentary (desk job, little exercise)                  │
│  ○ Lightly active (light exercise 1-3 days/week)          │
│  ○ Moderately active (moderate exercise 3-5 days/week)    │
│  ○ Very active (hard exercise 6-7 days/week)              │
│                                                             │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │         Continue            │                │
│            └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Lifestyle Factors
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                               Progress: ●●● (2/3)   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   Lifestyle Factors                        │
│                   ═══════════════                          │
│                                                             │
│  Diet Pattern  [?] Affects cholesterol and blood pressure  │
│  ○ Mediterranean-style (lots of fruits, vegetables, fish)  │
│  ○ Balanced (mix of all food groups)                      │
│  ○ Western-style (processed foods, red meat, fast food)   │
│  ○ Other/Unsure                                           │
│                                                             │
│  Smoking Status                                            │
│  ○ Never smoked    ○ Former smoker    ○ Current smoker    │
│                                                             │
│  Alcohol Consumption (drinks per week)                     │
│  ┌─────────────┐  [?] 1 drink = 12oz beer, 5oz wine      │
│  │    [2]      │                                           │
│  └─────────────┘                                           │
│                                                             │
│  Stress Level                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Low ●────○────○────○────○ High                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Sleep Quality                                             │
│  ○ Excellent (7-9 hours, restful)                         │
│  ○ Good (6-8 hours, mostly restful)                       │
│  ○ Fair (5-7 hours, sometimes restless)                   │
│  ○ Poor (less than 6 hours, often restless)               │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │         Continue            │                │
│            └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Health Metrics
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                               Progress: ●●● (3/3)   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Health Information                       │
│                    ════════════════                        │
│                                                             │
│  Current Blood Pressure (if known)                         │
│  ┌─────────┐  /  ┌─────────┐     ○ Don't know             │
│  │  [120]  │     │  [80]   │                               │
│  └─────────┘     └─────────┘                               │
│  Systolic        Diastolic                                 │
│                                                             │
│  Cholesterol Level (if known)                              │
│  ○ Normal (less than 200)    ○ Borderline (200-239)       │
│  ○ High (240+)               ○ Don't know                  │
│                                                             │
│  Family History                                            │
│  Does anyone in your immediate family have:                │
│  □ Heart disease    □ High blood pressure                  │
│  □ Stroke          □ Diabetes                              │
│  □ None of these   □ Don't know                           │
│                                                             │
│  Current Health Conditions                                 │
│  □ Diabetes        □ High cholesterol                      │
│  □ High blood pressure  □ Heart disease                    │
│  □ None of these                                           │
│                                                             │
│  Current Medications                                        │
│  □ Blood pressure medication  □ Cholesterol medication     │
│  □ Diabetes medication       □ Heart medication            │
│  □ None of these             □ Other: ____________         │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │      See My Results         │                │
│            └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘


## Results Dashboard Wireframes

### Current Risk Overview
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Assessment              🔗 Share  📊 Export      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                Your Cardiovascular Risk                     │
│                ══════════════════════════                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │        CURRENT ESTIMATED RISK: MODERATE                ││
│  │                                                         ││
│  │    ┌─────────────────────────────────────────────────┐  ││
│  │    │ Low    Moderate    High    Very High            │  ││
│  │    │  ●───────●────────○────────○────────○          │  ││
│  │    │  0%     15%      30%      45%      60%+         │  ││
│  │    └─────────────────────────────────────────────────┘  ││
│  │                                                         ││
│  │    Your 10-year risk: ~18%                            ││
│  │    Similar people your age: 12-25% (average: 19%)     ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Key Risk Factors Contributing to Your Score:              │
│  • Age (45): Moderate impact                              │
│  • BMI (25.2): Low impact                                 │
│  • Activity Level (Lightly active): Moderate impact       │
│  • Blood Pressure (120/80): Low impact                    │
│  • Family History: High impact                            │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │    Explore What-If Scenarios │                │
│            └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### What-If Scenarios Interface
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Overview                        Reset Changes    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                  What-If Scenarios                          │
│                  ═══════════════                           │
│                                                             │
│  Explore how lifestyle changes could impact your risk:     │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  CURRENT RISK          NEW RISK WITH CHANGES           ││
│  │                                                         ││
│  │     18%                        12%                      ││
│  │   ●────────                   ●──────                   ││
│  │  Moderate                     Low                       ││
│  │                                                         ││
│  │                      ↓ 6% reduction                     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Adjust Your Lifestyle:                                    │
│                                                             │
│  Exercise Frequency  [Current: Lightly Active]             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ None ○──────●─────○─────○ Daily                        ││
│  └─────────────────────────────────────────────────────────┘│
│  → Change to "Moderately Active": -3% risk                 │
│                                                             │
│  Diet Quality  [Current: Balanced]                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Poor ○─────○──────●─────○ Excellent                    ││
│  └─────────────────────────────────────────────────────────┘│
│  → Change to "Mediterranean": -2% risk                     │
│                                                             │
│  Weight Management  [Current: BMI 25.2]                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ +20lbs ○───○──────●─────○ -20lbs                       ││
│  └─────────────────────────────────────────────────────────┘│
│  → Lose 10 lbs: -1% risk                                  │
│                                                             │
│  Stress Management  [Current: Moderate]                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ High ○─────●──────○─────○ Low                          ││
│  └─────────────────────────────────────────────────────────┘│
│  → Improve stress management: -0% risk                     │
│                                                             │
│            ┌─────────────────────────────┐                │
│            │     See Full Analysis       │                │
│            └─────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Detailed Analysis & Next Steps
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Scenarios              🔗 Share  📧 Get Updates  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                 Your Personalized Insights                 │
│                 ══════════════════════════                 │
│                                                             │
│  Based on your assessment, here's what matters most:       │
│                                                             │
│  🎯 TOP PRIORITY: Increase Physical Activity               │
│     Moving from "lightly active" to "moderately active"    │
│     could reduce your risk by 3%. This is your biggest     │
│     opportunity for improvement.                            │
│                                                             │
│     Evidence: Regular moderate exercise reduces            │
│     cardiovascular risk by 20-35% (American Heart Assoc.) │
│                                                             │
│  🍎 SECOND PRIORITY: Improve Diet Quality                  │
│     Adopting Mediterranean-style eating could reduce       │
│     your risk by 2%. Focus on more vegetables, fish,       │
│     and whole grains.                                       │
│                                                             │
│  📈 Your Risk Over Time:                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │     Current Risk         With Changes                   ││
│  │     ┌─────────────┐     ┌─────────────┐                ││
│  │     │    18%      │  →  │    12%      │                ││
│  │     │  Moderate   │     │    Low      │                ││
│  │     └─────────────┘     └─────────────┘                ││
│  │                                                         ││
│  │     Same as: Couch     Same as: Active                 ││
│  │     potato 55-yr-old   40-year-old                     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ⚠️  IMPORTANT REMINDER:                                   │
│  This tool provides educational estimates only. Always     │
│  consult your healthcare provider for personalized        │
│  medical advice and before making significant health       │
│  changes.                                                  │
│                                                             │
│  Want to learn more about cardiovascular health?          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ □ Email me evidence-based health tips (research only)  ││
│  │ □ Notify me when new assessment tools are available    ││
│  │                                                         ││
│  │ Email: _________________________ [Subscribe]           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│            ┌─────────────────┐  ┌─────────────────┐        │
│            │   Share Results │  │  Start Over     │        │
│            └─────────────────┘  └─────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```
```