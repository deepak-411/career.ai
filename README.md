#  Mycareer.ai  
### AI-Driven Adaptive Onboarding & Learning Engine  

mycareer.ai is an AI-powered onboarding platform designed to solve inefficiencies in traditional corporate training systems. It dynamically analyzes a candidate’s current capabilities and generates a personalized, role-specific learning roadmap — enhanced with an audio summary for seamless learning during commutes.

---

##  Problem Statement

Current corporate onboarding systems rely on static, one-size-fits-all training programs. This leads to:

-  Experienced hires wasting time on known concepts  
-  Beginners being overwhelmed by advanced modules  
-  Reduced learning efficiency and engagement  

###  The Challenge

Build an AI-driven adaptive learning engine that:

- Parses a candidate’s current capabilities (Resume / Diagnostic)  
- Identifies skill gaps against a target Job Description  
- Generates a personalized training pathway to achieve role-specific competency  

---

##  Minimum Required Features (Implemented)

###  Intelligent Parsing
- Extracts skills from:
  - Resume  
  - Job Description  
- Determines proficiency levels (L1–L5)  
- Powered by Gemini 3 Flash  

---

###  Dynamic Mapping
- Identifies **skill gaps**  
- Generates **personalized learning roadmap**  
- Structures content into **week-by-week progression**  
- Integrates prerequisite-aware course sequencing  

---

###  Functional Interface
- Web-based UI built with React  
- Input fields for:
  - Resume  
  - Target Job Description  
- Visual output:
  - Skill Gap Analysis  
  - Learning Roadmap  
  - Audio Summary Player  

---

##  Key Features

-  AI-powered Skill Gap Analysis  
-  Adaptive Learning Path Generation  
-  Commute-Friendly Audio Summaries (Gemini TTS)  
-  Secure API Handling (Environment Variables)  
-  Modern SaaS UI (Glassmorphism + Motion Animations)  

---

##  System Architecture

```mermaid
flowchart TD
    A[User Input] --> B[Resume + Job Description]
    B --> C[AI Parsing Engine]
    C --> D[Skill Extraction]
    D --> E[Skill Gap Analysis]
    E --> F[Learning Path Generator]
    F --> G[Course Mapping Engine]
    G --> H[Personalized Roadmap]

    H --> I[Text Output]
    

    style C fill:#1f2937,color:#fff
    style F fill:#2563eb,color:#fff
    style J fill:#059669,color:#fff



src/
 ├── ai/
 │    └── flows.ts          # AI logic (analysis + TTS)
 ├── lib/
 │    └── course-catalog.ts # Learning resources
 ├── App.tsx                # UI Layer
 ├── main.tsx
 └── index.css
