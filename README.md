# 🛡️ CareerGuard & Tracker

> **AI Intelligence Engine & Security Shield for Laid-Off Job Seekers**  
> *Deterministic Scam Detection, Pipeline Management, Automated Follow-Ups, and Technical Interview Prep.*

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
├── index.html              # Main Single-Page Application
├── css/
│   ├── variables.css       # Design tokens (colors, gradients, glassmorphism)
│   ├── base.css            # Base reset, layout, and keyframe animations
│   ├── components.css      # Reusable UI controls, stats, badges, and modals
│   └── modules.css         # Module layouts (Radar, Kanban, Follow-up, Simulator)
├── js/
│   ├── mockData.js         # 20 raw inbox test emails with metadata
│   ├── heuristics.js       # Deterministic fraud detection and status classifier
│   ├── kanban.js           # Kanban pipeline manager
│   ├── followUp.js         # 7-day inactivity engine and outreach generator
│   ├── interviewPrep.js    # Interview briefing countdown and flashcards
│   ├── sandbox.js          # Interactive live email analyzer sandbox
│   ├── export.js           # JSON and CSV export handlers
│   └── app.js              # Application bootstrap and event coordinator
├── .gitignore
└── README.md
```

---

## 💻 Quick Start

Run a local server with Python or Node:

```bash
# Using Python
python -m http.server 3000

# Or using Node / npx
npx serve .
```

Open your browser at `http://localhost:3000`.

---

## 🔒 Security Principles
* Zero candidate data sent to untrusted third parties.
* Strictly client-side deterministic evaluation.
* Adheres to federal and international anti-cyberfraud standards.
