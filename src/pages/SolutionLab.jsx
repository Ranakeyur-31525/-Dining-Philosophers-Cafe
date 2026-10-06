// src/pages/SolutionLab.jsx
// MODULE 02 — Breaking the Cycle (Resource Ordering & Central Arbitrator)

import React, { useState, useEffect } from 'react';
import DiningTable from '../components/DiningTable';
import SimulationControls from '../components/SimulationControls';
import CoffmanMatrix from '../components/CoffmanMatrix';
import EventLogTerminal from '../components/EventLogTerminal';
import Footer from '../components/Footer';
import { useSimulation } from '../hooks/useSimulation';
import { Shield, Sparkles, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

export default function SolutionLab() {
  const [activeTab, setActiveTab] = useState('resource_ordering'); // 'resource_ordering' | 'waiter'

  const {
    uiMode,
    resourceState,
    stepResourceOrdering,
    waiterState,
    stepWaiter,
    isRunning,
    playSimulation,
    pauseSimulation,
    resetSimulation,
    speed,
    setSpeed,
    setActiveEngine
  } = useSimulation();

  useEffect(() => {
    setActiveEngine(activeTab);
  }, [activeTab, setActiveEngine]);

  const isResource = activeTab === 'resource_ordering';
  const currentState = isResource ? resourceState : waiterState;
  const currentStepFunc = isResource ? stepResourceOrdering : stepWaiter;

  return (
    <div className="min-h-screen bg-[#FEF8F5] text-slate-800 font-sans pb-12">
      {/* Module Header */}
      <section className="px-4 sm:px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8DCD5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold font-mono tracking-wide uppercase mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>MODULE 02 — Breaking the Cycle (Resource Ordering & Arbitration)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Deadlock Resolution & Prevention Workbench
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Eliminate Condition IV (Circular Wait) through strict monotonic resource ranking or throttle concurrency via counting semaphores.
            </p>
          </div>

          {/* Algorithm Switcher (2 Tabs) */}
          <div className="flex items-center bg-[#F5EDE8] p-1.5 rounded-2xl border border-[#E8DCD5]">
            <button
              onClick={() => {
                setActiveTab('resource_ordering');
                resetSimulation('resource_ordering');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isResource
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔢</span>
              <span>Havender Resource Ordering</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('waiter');
                resetSimulation('waiter');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isResource
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🧑🍳</span>
              <span>Café Waiter (Semaphore N-1)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Solution Details Card / Explanation Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 mb-6 shadow-xs">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="text-xs sm:text-sm leading-relaxed flex-grow">
              <div className="font-bold mb-1 flex items-center gap-2">
                <span>{isResource ? "Havender's Total Ordering Principle (F0 < F1 < F2 < F3 < F4)" : "The Café Waiter Arbitrator (Pigeonhole Principle)"}</span>
              </div>
              <p>
                {isResource ? (
                  uiMode === 'story'
                    ? "Friend 4 (Kabir) needs Fork 4 and Fork 0. Because 0 is smaller than 4, Kabir waits with empty hands for Fork 0. This leaves Fork 4 free for Friend 3 (Meera) to eat happily!"
                    : "P4 must acquire min(4, 0) = F0 first. P0 holds F0, so P4 suspends WITHOUT claiming F4! F4 remains unheld on the table, allowing P3 to acquire both F3 & F4 and enter the critical section."
                ) : (
                  uiMode === 'story'
                    ? "The Café Waiter allows at most 4 friends at the table. Since there are 5 forks and only 4 diners, at least one friend is guaranteed to get both forks!"
                    : "Counting semaphore sem_init(&waiter, 0, 4) restricts concurrent threads to N-1 (4). By the Pigeonhole Principle, 5 forks / 4 diners guarantees at least one thread obtains 2 forks without blocking."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="mb-6">
          <SimulationControls
            isRunning={isRunning}
            onPlay={() => playSimulation(activeTab)}
            onPause={pauseSimulation}
            onStep={() => currentStepFunc()}
            onReset={() => resetSimulation(activeTab)}
            speed={speed}
            onSpeedChange={setSpeed}
            step={currentState.step}
            totalSteps={currentState.totalSteps}
            customAction={{
              label: isResource ? '✨ Step Asymmetry' : '🧑🍳 Step Waiter',
              icon: <CheckCircle2 className="w-4 h-4" />,
              onClick: () => currentStepFunc(),
              variant: 'success'
            }}
          />
        </div>

        {/* Two-Column Simulation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Circular Dining Table */}
          <div className="lg:col-span-7 flex flex-col items-center bg-white border border-[#E8DCD5] rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#E8DCD5] text-xs font-semibold text-slate-700">
              <span className="font-display font-bold text-sm text-slate-900">
                {isResource ? 'Resource-Ordered Table' : 'Waiter-Controlled Table'}
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {isResource ? '🟢 Condition IV Broken' : `🟢 Tokens: ${currentState.waiterTokens}/4`}
              </span>
            </div>

            {/* The Animated Dining Table */}
            <div className="transform scale-95 sm:scale-100 my-2">
              <DiningTable
                philosophers={currentState.philosophers}
                forks={currentState.forks}
                deadlocked={false}
                waiterTokens={!isResource ? currentState.waiterTokens : null}
                uiMode={uiMode}
                title={isResource ? 'Havender Lab' : 'Waiter Lab'}
              />
            </div>

            {/* Live Message */}
            <div className="w-full mt-4 p-3 bg-white border border-emerald-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
              <span>{currentState.statusMessage}</span>
              <span className="font-mono text-[11px] text-emerald-700 font-bold">
                Throughput: Progress Active
              </span>
            </div>
          </div>

          {/* Right Column: Before vs After Comparison Card & Mathematical Proof */}
          <div className="lg:col-span-5 space-y-6">
            {/* Before vs After Comparison Card */}
            <div className="bg-white border border-[#E8DCD5] rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-display mb-3 pb-2 border-b border-[#E8DCD5] flex items-center gap-2">
                <span>⚖️</span>
                <span>Before vs. After Comparison</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Before Card */}
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-red-700 mb-1">
                    Before: Naive Protocol
                  </div>
                  <div className="font-mono font-bold text-lg mb-1">0 Meals / s</div>
                  <p className="text-[11px] text-red-800 leading-snug">
                    Circular Dependency cycle forms. 100% thread lockup on contention.
                  </p>
                </div>

                {/* After Card */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-emerald-700 mb-1">
                    After: {isResource ? "Havender Order" : "Café Waiter"}
                  </div>
                  <div className="font-mono font-bold text-lg text-emerald-700 mb-1">
                    Continuous Progress
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    {isResource 
                      ? "Strict total order eliminates cycle. P3 eats, unblocking all."
                      : "Pigeonhole principle guarantees >= 1 thread eats at all times."}
                  </p>
                </div>
              </div>
            </div>

            {/* Coffman Conditions Matrix in Solution Mode */}
            {isResource && (
              <CoffmanMatrix
                conditions={currentState.coffmanConditions}
                title="Coffman Matrix (Havender Solution)"
              />
            )}

            {!isResource && (
              <div className="bg-white border border-[#E8DCD5] rounded-2xl p-5 shadow-sm text-xs leading-relaxed text-slate-700 space-y-2">
                <h4 className="font-bold text-slate-900 font-display text-sm flex items-center gap-1.5 pb-2 border-b border-[#E8DCD5]">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>The Pigeonhole Principle Proof</span>
                </h4>
                <p>
                  <strong>Theorem:</strong> With 5 forks and at most 4 permitted diners, deadlock cannot occur.
                </p>
                <div className="p-2.5 bg-slate-50 font-mono text-[11px] rounded-lg border border-slate-200">
                  Total Forks = 5 <br />
                  Max Concurrent Threads = 4 <br />
                  Worst Case: 4 diners hold 1 fork each = 4 forks <br />
                  Remaining Free Forks = 5 - 4 = 1 fork <br />
                  Result: Free fork guarantees &ge; 1 diner acquires 2 forks!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event Terminal */}
        <div className="mt-8">
          <EventLogTerminal
            logs={currentState.logs}
            title={isResource ? "Resource Ordering Execution Trace" : "Waiter Semaphore Dispatcher Trace"}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
