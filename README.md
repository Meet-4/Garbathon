# 🛡️ CareerGuard & Tracker

> **AI Intelligence Engine & Security Shield for Laid-Off Job Seekers**  
> *Deterministic Scam Detection, Pipeline Management, Automated Follow-Ups, and Technical Interview Prep.*

🚀 **Live Vercel Deployment:** [https://instant-cygnus-d0u40lb.tmp.now](https://instant-cygnus-d0u40lb.tmp.now)  
🔗 **Permanent Claim Link:** [Claim Deployment on Vercel](https://vercel.com/claim-deployment?code=6b868f2e-0f95-40de-8bc4-b65a30d8c7ba)

---

## 🌟 Overview

High-volume job searches during tech layoffs often result in 100+ unorganized email threads, missed follow-ups, and elevated risk of falling victim to sophisticated recruitment scams (advance-fee fraud, domain spoofing, and premature identity theft).

**CareerGuard & Tracker** ingests unorganized job seeker inboxes, performs heuristic security analysis, and orchestrates applications into a unified, actionable pipeline dashboard.

---

## 🚀 Key Modules & Capabilities

### 1. 🚨 Scam & Phishing Red-Flag Alert Center
* **Free-mail Domain Detection:** Instantly flags messages purporting to be from enterprise giants (Microsoft, Amazon, Google) that originate from consumer webmail domains (`@gmail.com`, `@outlook.com`, `@yahoo.com`).
* **Advance-Fee Fraud Prevention:** Quarantines solicitations requesting onboarding fees, software licenses, or equipment shipping deposits.
* **Premature PII Shielding:** Identifies illegal extraction of sensitive government documents (Aadhaar, PAN, SSN, passport scans) prior to legitimate HRIS onboarding.
* **Legal Defense & IC3 / Cyber Crime Export:** One-click generation of formal fraud complaints.

### 2. 📊 Interactive Application Kanban Pipeline
* Canonical 5-stage workflow: `APPLIED` ➔ `SCREEN / TECH` ➔ `INTERVIEW SCHEDULED` ➔ `OFFER EXTENDED` ➔ `REJECTED`.
* Multi-email thread consolidation (e.g., recruiter screen to technical loop progression).
* Instant search and stage filtering.
* Full audit modal for every email thread and underlying metadata.

### 3. ⏳ 7-Day Inactivity Follow-Up Radar
* Automatically flags applications remaining in `APPLIED` status for $\ge 7$ days without response.
* Priority scoring matrix (**P1** to **P4** based on elapsed days).
* **Smart Tone Outreach Generator:** Drafts high-leverage emails incorporating competing offers (e.g., leveraging written offers like Canva to accelerate slow pipelines) with 1-click clipboard copy.

### 4. 🎯 Technical Interview Prep Briefing & Simulator
* Tailored high-yield briefing for upcoming technical rounds (e.g., **OpenAI Research Engineer - System Architecture**).
* Live countdown timer to interview time.
* **Interactive Flashcard Architecture Simulator:** Deep dives into distributed parallelism (Megatron-LM, ZeRO-3, FSDP), low-latency inference (PagedAttention, FlashAttention, continuous batching), and 100TB/day ingestion architectures.
* High-signal reverse-interview questions to ask interviewers.

### 5. 🔬 Live Security Sandbox
* Real-time testing console to paste arbitrary suspicious job email headers and bodies.
* Visual circular trust score gauge (0 - 100%) and instant security verdict.
* Preloaded real-world attack vectors.

### 6. 💾 Verified Export Engine
* Machine-readable **JSON export** with full schema compliance.
* Structured **CSV export** for spreadsheet analysis.

---

## 📁 Repository Structure

```
├── index.html                   # HTML Entry Point
├── package.json                 # React 18, Vite, TypeScript, Tailwind dependencies
├── tsconfig.json                # TypeScript Configuration
├── vite.config.ts               # Vite Configuration
├── tailwind.config.js           # Tailwind Dark-Mode Tokens & Styling
├── postcss.config.js            # PostCSS Autoprefixer Configuration
├── src/
│   ├── main.tsx                 # React Root Mounting Entry
│   ├── App.tsx                  # Main Coordinator & State Orchestrator
│   ├── index.css                # Tailwind Directives & Custom Styling
│   ├── types/
│   │   └── index.ts             # TypeScript Interfaces & Pipeline Types
│   ├── data/
│   │   └── mockEmails.ts        # Ingested 20 Mock Raw Candidate Emails
│   ├── services/
│   │   └── heuristics.ts        # Deterministic Fraud Heuristics & Status Engine
│   └── components/
│       ├── Header.tsx           # App Header & Verified Export Actions
│       ├── StatsOverview.tsx    # Executive Metric Tiles
│       ├── ScamAlertBanner.tsx  # Critical Threat Quarantined Banner
│       ├── KanbanBoard.tsx      # Interactive 5-Stage Kanban Pipeline
│       ├── ScamRadar.tsx        # Threat Inspection & IC3 Defense Notices
│       ├── FollowUpQueue.tsx    # 7-Day Inactivity Table & Smart Outreach Generator
│       ├── InterviewPrep.tsx    # OpenAI Live Countdown & Architecture Flashcards
│       ├── SecuritySandbox.tsx  # Interactive Live Threat Testing Console
│       ├── RawInboxFeed.tsx     # Full Inbound Audit Trail
│       └── DetailModal.tsx      # Comprehensive Thread & Application Inspector
├── .gitignore
└── README.md
```

---

## 💻 Quick Start

Run the Vite development server:

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Or compile production bundle
npm run build
```

Open your browser at `http://localhost:5173`.

---

## 🔒 Security Principles
* Zero candidate data sent to untrusted third parties.
* Strictly client-side deterministic evaluation.
* Adheres to federal and international anti-cyberfraud standards.
