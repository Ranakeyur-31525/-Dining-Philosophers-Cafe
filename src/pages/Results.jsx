// src/pages/Results.jsx
// MODULE 05 — Master Algorithmic Comparison Matrix, Benchmark Race, and Academic Viva Accordion

import React, { useState, useEffect } from 'react';
import VivaCheatSheet from '../components/VivaCheatSheet';
import Footer from '../components/Footer';
import { Award, Play, RotateCcw, BarChart3, CheckCircle, XCircle, AlertTriangle, Zap, Check } from 'lucide-react';

const ALGORITHMS = {
  naive: {
    name: 'Naive Greedy Protocol',
    deadlockFree: false,
    starvationFree: false,
    concurrency: 'Low (0 after freeze)',
    complexity: 'O(1) - None',
    useCase: 'Naive thread pools, uncoordinated locks',
    throughput: 0,
    avgWaitMs: 9999,
    jainFairness: 0.10
  },
  resource_order: {
    name: "Havender's Resource Ordering",
    deadlockFree: true,
    starvationFree: false,
    concurrency: 'High (2 parallel diners)',
    complexity: 'O(1) - Static Order',
    useCase: 'Database global transaction lock order',
    throughput: 42,
    avgWaitMs: 380,
    jainFairness: 0.82
  },
  waiter: {
    name: 'Waiter Semaphore (N-1)',
    deadlockFree: true,
    starvationFree: false,
    concurrency: 'Medium (Throttled)',
    complexity: 'O(1) - Counting Sem',
    useCase: 'HTTP connection pools, DB pool limits',
    throughput: 36,
    avgWaitMs: 490,
    jainFairness: 0.78
  },
  tanenbaum: {
    name: "Tanenbaum's Atomic Monitor",
    deadlockFree: true,
    starvationFree: true,
    concurrency: 'Maximum (Optimal pairs)',
    complexity: 'O(1) - State Check',
    useCase: 'POSIX condition variables, kernel monitors',
    throughput: 50,
    avgWaitMs: 290,
    jainFairness: 0.94
  },
  fifo: {
    name: 'Fair FIFO Aging Queue',
    deadlockFree: true,
    starvationFree: true,
    concurrency: 'High (Fairly Scheduled)',
    complexity: 'O(N) - Priority Queue',
    useCase: 'Linux Completely Fair Scheduler (CFS)',
    throughput: 46,
    avgWaitMs: 320,
    jainFairness: 0.99
  }
};

export default function Results() {
  const [algoA, setAlgoA] = useState('naive');
  const [algoB, setAlgoB] = useState('resource_order');
  const [isRacing, setIsRacing] = useState(false);
  const [raceProgress, setRaceProgress] = useState(0); // 0 to 100%

  const dataA = ALGORITHMS[algoA];
  const dataB = ALGORITHMS[algoB];

  useEffect(() => {
    let timer;
    if (isRacing) {
      setRaceProgress(0);
      const start = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const p = Math.min(100, Math.round((elapsed / 3000) * 100));
        setRaceProgress(p);
        if (p >= 100) {
          clearInterval(timer);
          setIsRacing(false);
        }
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isRacing]);

  const handleStartRace = () => {
    setIsRacing(true);
  };

  const mult = isRacing ? raceProgress / 100 : 1;

  return (
    <div className="min-h-screen bg-[#FEF8F5] text-slate-800 font-sans pb-12">
      {/* Module Header */}
      <section className="px-4 sm:px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="pb-4 border-b border-[#E8DCD5]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full text-xs font-bold font-mono tracking-wide uppercase mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>MODULE 05 — Telemetry, Benchmarks & Oral Viva Defense</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
            Master Algorithmic Comparison & Benchmark Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Empirical runtime performance, theoretical complexity bounds, and oral viva exam defense guide.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 max-w-7xl mx-auto space-y-10">
        {/* Master Comparison Table */}
        <section className="bg-white border border-[#E8DCD5] rounded-3xl p-6 shadow-sm overflow-hidden">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Master Algorithmic Comparison Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive side-by-side analysis of all 5 concurrency protocols evaluated in this laboratory.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF4F0] border-b border-[#E8DCD5] text-slate-700 font-semibold uppercase font-mono text-[11px]">
                  <th className="py-3 px-4">Algorithm</th>
                  <th className="py-3 px-3">Deadlock Free?</th>
                  <th className="py-3 px-3">Starvation Free?</th>
                  <th className="py-3 px-3">Concurrency Level</th>
                  <th className="py-3 px-3">Complexity</th>
                  <th className="py-3 px-4">Real-World Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]/70">
                {Object.entries(ALGORITHMS).map(([key, item]) => (
                  <tr key={key} className="hover:bg-[#FEF8F5] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-display text-sm">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-3">
                      {item.deadlockFree ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> No (100% Contention)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      {item.starvationFree ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3.5 h-3.5" /> Guaranteed Fair
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5" /> Probabilistic
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">
                      {item.concurrency}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">
                      {item.complexity}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {item.useCase}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive Benchmark Race */}
        <section className="bg-white border border-[#E8DCD5] rounded-3xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#E8DCD5]">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-terracotta" />
                <span>Interactive Benchmark Race (Side-by-Side Simulation)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any two algorithms to execute a simulated workload and compare throughput, waiting times, and fairness.
              </p>
            </div>

            <button
              onClick={handleStartRace}
              disabled={isRacing}
              className="flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-[#8c2e12] text-white font-semibold text-xs rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRacing ? `Racing (${raceProgress}%)` : 'Run 10s Benchmark Race'}</span>
            </button>
          </div>

          {/* Algorithm Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Algorithm A Selection */}
            <div className="p-4 bg-[#FEF8F5] border border-[#E8DCD5] rounded-2xl">
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-2">
                Competitor A
              </label>
              <select
                value={algoA}
                onChange={(e) => setAlgoA(e.target.value)}
                className="w-full bg-white border border-[#E8DCD5] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta cursor-pointer"
              >
                {Object.entries(ALGORITHMS).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Algorithm B Selection */}
            <div className="p-4 bg-[#FEF8F5] border border-[#E8DCD5] rounded-2xl">
              <label className="block text-xs font-bold text-slate-700 uppercase font-mono mb-2">
                Competitor B
              </label>
              <select
                value={algoB}
                onChange={(e) => setAlgoB(e.target.value)}
                className="w-full bg-white border border-[#E8DCD5] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta cursor-pointer"
              >
                {Object.entries(ALGORITHMS).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparative Bar Charts */}
          <div className="space-y-6">
            {/* Metric 1: Throughput */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Total Meals Served (Throughput higher is better)</span>
                <span className="font-mono text-slate-500">Max: 60 meals</span>
              </div>
              <div className="space-y-2">
                {/* A bar */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-36 truncate font-medium text-slate-700">{dataA.name}</span>
                  <div className="flex-grow bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((dataA.throughput * mult / 60) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-slate-900">
                    {Math.round(dataA.throughput * mult)} meals
                  </span>
                </div>

                {/* B bar */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-36 truncate font-medium text-slate-700">{dataB.name}</span>
                  <div className="flex-grow bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((dataB.throughput * mult / 60) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-slate-900">
                    {Math.round(dataB.throughput * mult)} meals
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 2: Avg Waiting Time */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Average Thread Waiting Time (Lower is better)</span>
                <span className="font-mono text-slate-500">Scale: Milliseconds</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-36 truncate font-medium text-slate-700">{dataA.name}</span>
                  <div className="flex-grow bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((dataA.avgWaitMs / 1000) * 100))}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-slate-900">
                    {dataA.avgWaitMs === 9999 ? '∞ ms (Freeze)' : `${dataA.avgWaitMs} ms`}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="w-36 truncate font-medium text-slate-700">{dataB.name}</span>
                  <div className="flex-grow bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((dataB.avgWaitMs / 1000) * 100))}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-slate-900">
                    {dataB.avgWaitMs === 9999 ? '∞ ms (Freeze)' : `${dataB.avgWaitMs} ms`}
                  </span>
                </div>
              </div>
            </div>

            {/* Metric 3: Jain's Fairness Index */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>Jain's Fairness Index (0.0 to 1.0 — 1.0 is perfectly fair)</span>
                <span className="font-mono text-slate-500">J = (Σx)² / (n · Σx²)</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-36 truncate font-medium text-slate-700">{dataA.name}</span>
                  <div className="flex-grow bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(dataA.jainFairness * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-slate-900">
                    {dataA.jainFairness.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="w-36 truncate font-medium text-slate-700">{dataB.name}</span>
                  <div className="flex-grow bg-slate-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(dataB.jainFairness * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-slate-900">
                    {dataB.jainFairness.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Viva Defense Sheet */}
        <section>
          <VivaCheatSheet />
        </section>
      </main>

      <Footer />
    </div>
  );
}
