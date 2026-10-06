# 🍽️ Dining Philosophers Café — Visual Deadlock, Starvation & Resolution Lab
### Fullstack Concurrency & Synchronization Workbench with Tri-Lingual Voice Narration (English, Hindi, Gujarati)

> **Course**: Operating Systems (SEM 5)  
> **Institution**: CHARUSAT University  
> **Author**: Keyur Rana ([@Ranakeyur-31525](https://github.com/Ranakeyur-31525))  
> **Repository**: [https://github.com/Ranakeyur-31525/-Dining-Philosophers-Cafe](https://github.com/Ranakeyur-31525/-Dining-Philosophers-Cafe)  
> **Explanation Report (PDF)**: [Dining_Philosophers_Cafe_Explanation.pdf](./Dining_Philosophers_Cafe_Explanation.pdf)  
> **Frontend**: React 19, Tailwind CSS, Lucide React, Vite  
> **Backend**: Node.js & Express (REST API + Server-Sent Events SSE)  
> **Audio & Speech**: HTML5 Web Speech API (`window.speechSynthesis`) + Web Audio API Synthesizer  
> **Live Server**: `http://localhost:3000`

---

## 🌟 Executive Summary

**Dining Philosophers Café** is an interactive, production-ready educational laboratory for Operating Systems students, instructors, and researchers.

Incorporating the reference architecture from `dining-philosophers-cafe-main`, this project features:
1. **6 Comprehensive Concurrency Labs**:
   - **🏠 Dashboard (`/`)**: High-level problem overview, interactive quick preview, and architecture walkthrough.
   - **💀 Deadlock Lab (`/deadlock`)**: Step-by-step 10-step timeline, directed cycle Wait-For Graph (WFG) visualization, circular wait arcs, and live Coffman conditions matrix.
   - **🛡️ Solution Lab (`/solution`)**: Side-by-side comparison between the Naive Greedy Protocol (Deadlock) vs Havender's Resource Ordering (Safe State) with formal proofs.
   - **⚠️ Starvation Lab (`/starvation`)**: Real-time livelock simulation showing philosopher P3 starved by alternating aggressive neighbors, with one-click FIFO queue fairness resolution.
   - **🚦 Synchronization Lab (`/synchronization`)**: Interactive exploration of POSIX Mutexes (`pthread_mutex_lock`), Semaphores (`sem_wait`/`sem_post`), Critical Section protection, and 10,000-cycle Dijkstra Invariant tests.
   - **📊 Results & Lab Report (`/results`)**: Real-time telemetry counters, concurrency hazards matrix, exportable JSON reports, and print-ready lab sheets.
2. **🗣️ Tri-Lingual Voice Narration**:
   - Native Web Speech API (`window.speechSynthesis`) speaking aloud in **English (en-US)**, **Hindi (hi-IN)**, and **Gujarati (gu-IN)**.
   - Includes mute toggle `[🔊 / 🔇]`, language switcher, and live spoken subtitle ticker.
   - Automatically narrates Deadlock, Starvation, Havender's Solution, FIFO Fairness, Mutex acquisitions, and Semaphore signals!
3. **🎵 Web Audio Synthesizer**:
   - Client-side synthetic sound effects for fork clinks, eating munches, deadlock alarm buzzers, and victory fanfare without external audio files.
4. **⚙️ Node.js + Express Backend**:
   - Serves the production build and provides REST APIs (`/api/status`, `/api/education`, `/api/action`) and Server-Sent Events (`/api/events`).

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode (Vite HMR)
```bash
npm run dev
```

### 3. Build & Run Fullstack Production Server
```bash
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🧩 Architectural Directory Map

```text
dining-philosophers-cafe/
├── package.json               // Unified React 19 + Express dependencies
├── vite.config.js             // Vite bundler configuration
├── tailwind.config.js         // Tailwind theme tokens & dark mode classes
├── server.js                  // Node.js Express server + REST + SSE + SPA routing
├── dist/                      // Optimized production bundle (HTML, JS, CSS)
└── src/
    ├── main.jsx               // React DOM root entry point
    ├── App.jsx                // Client-side React Router routing
    ├── index.css              // Design system tokens, keyframe animations, dark mode
    ├── components/
    │   ├── Navbar.jsx         // Nav tabs, theme toggle, and tri-lingual voice controller
    │   ├── DiningTable.jsx    // Circular mahogany table with SVG arcs & thought badges
    │   ├── DiningTableSimulation.jsx // Dual-state simulation table component
    │   ├── CriticalSectionPanel.jsx  // Critical section visualizer
    │   ├── ThreadMutexMatrix.jsx     // Live thread vs mutex status table
    │   ├── SemaphorePanel.jsx        // Counting semaphore visualization
    │   ├── ProofPanel.jsx            // Formal mathematical proof of deadlock-freedom
    │   ├── ComparisonSection.jsx     // Side-by-side protocol comparison metrics
    │   └── EventLog.jsx              // Real-time timestamped event stream
    ├── context/
    │   └── SimulationContext.jsx     // Centralized state machine & lab synchronization
    ├── hooks/
    │   └── useDeadlockSim.js         // Dedicated 10-step Deadlock state machine
    ├── pages/
    │   ├── Home.jsx                  // Interactive Dashboard & Hero section
    │   ├── DeadlockLab.jsx           // 10-step Deadlock & Coffman conditions lab
    │   ├── SolutionLab.jsx           // Havender Resource Ordering vs Naive lab
    │   ├── StarvationLab.jsx         // Alternating neighbors starvation lab
    │   ├── SynchronizationLab.jsx    // Mutex, Semaphore, and Futex lab
    │   └── Results.jsx               // Telemetry, Hazard Matrix, & Report export
    ├── services/
    │   ├── speechNarrator.js         // Tri-lingual speech synthesis manager
    │   └── audioSynth.js             // Web Audio API micro-sound synthesizer
    └── simulation/
        └── concurrencyEngine.js      // Concurrency step calculation engine
```

---

## 🗣️ Tri-Lingual Voice Narration Matrix

| Event | English (en-US) | Hindi (hi-IN) | Gujarati (gu-IN) |
|---|---|---|---|
| **Deadlock** | *"Look! All five friends grabbed their left fork at the exact same time. Now, everyone is waiting for their right fork. Nobody can eat, and nobody will let go. This complete freeze is called Deadlock!"* | *"देखिए! सभी पांच दोस्तों ने एक ही समय पर अपना बायां कांटा उठा लिया। अब हर कोई अपने दाएं कांटे का इंतजार कर रहा है। कोई खा नहीं पा रहा है और कोई छोड़ भी नहीं रहा। इसे ही डेडलॉक कहते हैं!"* | *"જુઓ! પાંચેય મિત્રોએ એકસાથે પોતાનો ડાબો કાંટો ઉપાડી લીધો છે. હવે બધા જમણા કાંટાની રાહ જોઈ રહ્યા છે. કોઈ જમી નથી શકતું અને કોઈ કાંટો મૂકવા પણ તૈયાર નથી. આ સંપૂર્ણ સ્થિતિને ડેડલોક કહેવાય છે!"* |
| **Havender Solution** | *"Now we apply Resource Ordering, also known as Havender's Algorithm. Watch Philosopher 5! The rule forces them to wait for Fork 1 before touching Fork 5. The cycle is broken!"* | *"अब हमने रिसोर्स ऑर्डरिंग का नियम लागू किया है। फिलॉसफर 5 को देखिए! नियम के कारण वह कांटा 5 छुए बिना कांटा 1 का इंतज़ार कर रहा है। चक्र टूट गया!"* | *"હવે આપણે રિસોર્સ ઓર્ડરિંગનો નિયમ લાગુ કર્યો છે. ફિલોસોફર 5 ને જુઓ! નિયમ મુજબ તે કાંટો 5 લીધા વગર કાંટો 1 ની રાહ જુએ છે. આ રીતે ડેડલોક ટળી જાય છે!"* |
| **Starvation Fix** | *"FIFO queue arbitration is now applied! Waiting times are strictly bounded, ensuring Philosopher P3 is guaranteed a turn to eat."* | *"फीफो फेयरनेस लागू कर दी गई है! अब हर दार्शनिक को बारी-बारी से खाना मिलने की गारंटी है।"* | *"ફીફો કતાર લાગુ કરવામાં આવી છે! હવે P3 ને પણ જમવાનો ચોક્કસ વારો મળશે."* |

---

## 🎓 OS Theory Reference & Exam Guide

### 1. The 4 Coffman Conditions
1. **Mutual Exclusion**: Resources cannot be shared. Each fork is held by at most 1 philosopher.
2. **Hold and Wait**: A process currently holding at least one resource requests additional resources.
3. **No Preemption**: Resources cannot be forcibly revoked; must be released voluntarily.
4. **Circular Wait**: A closed loop of processes exists where each process waits for a resource held by the next.

### 2. Breaking the Conditions
- **Havender's Resource Ordering** breaks **Circular Wait** by enforcing a strict total ordering: always acquire $\min(left, right)$ before $\max(left, right)$.
- **Tanenbaum Monitor** breaks **Hold and Wait** by requiring atomic acquisition of both forks or holding zero.
- **Counting Semaphore Waiter** breaks **Circular Wait** by bounding table occupancy to $N - 1 = 4$, guaranteeing by the **Pigeonhole Principle** that at least one diner receives two forks.

---

## 👥 Authors
Developed for **CHARUSAT - Semester 5 Operating Systems Project**.  
Licensed under the MIT License.
