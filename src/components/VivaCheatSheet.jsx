// src/components/VivaCheatSheet.jsx
// Collapsible oral exam defense accordion with rigorous Operating Systems theory

import React, { useState } from 'react';
import { ChevronDown, GraduationCap, BookOpen, Award } from 'lucide-react';

const VIVA_QUESTIONS = [
  {
    id: 1,
    q: "1. Explain the 4 Coffman conditions and prove how Havender's Resource Ordering breaks Condition IV.",
    answer: `The 4 Coffman conditions (1971) are:
1. Mutual Exclusion: At least one resource must be non-shareable.
2. Hold and Wait: A process must concurrently hold at least one resource while requesting another held by another process.
3. No Preemption: Resources cannot be forcibly taken away; only voluntarily released.
4. Circular Wait: A closed chain of processes exists where P0 waits for P1, P1 for P2... and Pn waits for P0.

How Resource Ordering Breaks Condition IV:
Havender (1968) introduced total ordering of all resources: R0 < R1 < ... < Rn. Processes are constrained to acquire resources in strictly monotonically increasing order.
Proof by Contradiction: Suppose a circular wait cycle exists: P0 -> P1 -> P2 -> ... -> Pk -> P0.
This would imply: Rank(Held by P0) < Rank(Held by P1) < ... < Rank(Held by Pk) < Rank(Held by P0), meaning Rank(Held by P0) < Rank(Held by P0), an arithmetic impossibility!
Therefore, no directed cycle can ever form, rendering Deadlock mathematically impossible.`
  },
  {
    id: 2,
    q: "2. Prove why N-1 diners with N forks guarantees at least one can eat (The Pigeonhole Principle).",
    answer: `Theorem: In a system of N philosophers and N forks, restricting concurrent diner seating to at most N - 1 (implemented via a counting semaphore initialized to N - 1) guarantees deadlock freedom.

Formal Proof via Pigeonhole Principle:
- Total forks available = N.
- Maximum philosophers permitted to compete = N - 1.
- In the worst-case scenario, every admitted philosopher grabs their first fork.
- Number of forks consumed in worst case = (N - 1) * 1 = N - 1 forks.
- Number of free forks remaining on table = N - (N - 1) = 1 fork.
- By the Pigeonhole Principle (Pigeons = admitted philosophers, Holes = forks), because only N - 1 philosophers are contending for N forks, at least one admitted philosopher has access to both their required forks.
- That philosopher completes their meal, releases both forks, and triggers a cascade of completions. Deadlock probability is identically 0.0%.`
  },
  {
    id: 3,
    q: "3. What is the fundamental difference between Deadlock, Livelock, and Starvation?",
    answer: `These three concurrency hazards differ across CPU utilization, thread state, and liveness:

1. Deadlock:
   - State: Permanent freeze. Threads are blocked (e.g. in futex_wait/sleep).
   - CPU Utilization: 0% (threads consume no CPU cycles while blocked).
   - Transition: Impossible to recover without external intervention (kill thread / preempt resource).

2. Livelock:
   - State: Continuous active state change, but zero forward progress (e.g. two polite threads repeatedly backing off and retrying in lockstep).
   - CPU Utilization: 100% (threads are actively spinning/executing code).
   - Transition: Can resolve if stochastic perturbation (random delay) is introduced.

3. Starvation (Indefinite Postponement):
   - State: One or more threads are perpetually denied access to a resource while the overall system continues to make progress.
   - Example: Fast alternating neighbors monopolizing forks while a middle philosopher starves.
   - Key Insight: A system can be 100% deadlock-free yet still suffer catastrophic starvation! Resolved via Aging / FIFO Queues.`
  },
  {
    id: 4,
    q: "4. Why is atomic state checking (Tanenbaum Monitor) preferred over random backoff (Ethernet CSMA/CD style)?",
    answer: `While random backoff (e.g. pthread_mutex_trylock with randomized usleep) avoids deterministic lockup, it introduces three major engineering flaws:
1. Probabilistic vs Deterministic: Random backoff only makes deadlock unlikely; Tanenbaum's monitor guarantees deadlock freedom deterministically.
2. Latency & Jitter: Backoff introduces non-deterministic delays and CPU spin waste, unacceptable in Real-Time Operating Systems (RTOS).
3. Starvation Risk: Random backoff provides no fairness guarantees (bounded waiting can be violated).

Tanenbaum's Atomic State Monitor:
- Enforces an atomic test(i) function executed inside a critical section protected by a binary mutex.
- A philosopher only transitions to EATING when both neighbors are verified not eating:
  \`if (state[i] == HUNGRY && state[LEFT] != EATING && state[RIGHT] != EATING)\`
- Grants forks atomically (all-or-nothing), completely eliminating Hold & Wait for incomplete resources!`
  }
];

export default function VivaCheatSheet() {
  const [openId, setOpenId] = useState(1);

  return (
    <div className="bg-white border border-[#E8DCD5] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DCD5]">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-terracotta" />
            <span>Academic Viva / Oral Exam Defense Sheet</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gold-standard theoretical responses and mathematical proofs for university laboratory viva evaluations.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          Viva Ready
        </span>
      </div>

      <div className="space-y-3">
        {VIVA_QUESTIONS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'bg-[#FDFBF9] border-terracotta/40 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-sm text-slate-800 hover:text-terracotta transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen className={`w-4 h-4 shrink-0 ${isOpen ? 'text-terracotta' : 'text-slate-400'}`} />
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-terracotta' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-700 leading-relaxed font-sans border-t border-slate-100 whitespace-pre-line">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
