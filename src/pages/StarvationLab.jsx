// src/pages/StarvationLab.jsx
// MODULE 03 — Indefinite Postponement & Fair Scheduling (Conspiracy vs FIFO Aging)

import React, { useEffect } from 'react';
import DiningTable from '../components/DiningTable';
import SimulationControls from '../components/SimulationControls';
import EventLogTerminal from '../components/EventLogTerminal';
import Footer from '../components/Footer';
import { useSimulation } from '../hooks/useSimulation';
import { AlertTriangle, Clock, Ticket, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

export default function StarvationLab() {
  const {
    uiMode,
    starvationState,
    stepStarvation,
    setStarvationMode,
    isRunning,
    playSimulation,
    pauseSimulation,
    resetSimulation,
    speed,
    setSpeed,
    setActiveEngine
  } = useSimulation();

  useEffect(() => {
    setActiveEngine('starvation');
  }, [setActiveEngine]);

  const { mode, starvationDetected, philosophers, forks, fifoQueue, logs, cycle, statusMessage, narrativeText } = starvationState;
  const isConspiracy = mode === 'conspiracy';
  const p1 = philosophers[1];

  return (
    <div className="min-h-screen bg-[#FEF8F5] text-slate-800 font-sans pb-12">
      {/* Module Header */}
      <section className="px-4 sm:px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8DCD5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-xs font-bold font-mono tracking-wide uppercase mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>MODULE 03 — Indefinite Postponement & Fair Scheduling</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Starvation & Bounded Waiting Laboratory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Proving that a system can have <strong>ZERO deadlocks</strong>, yet still suffer catastrophic starvation. Resolve it using Fair FIFO Aging queues.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#F5EDE8] p-1.5 rounded-2xl border border-[#E8DCD5]">
            <button
              onClick={() => setStarvationMode('conspiracy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isConspiracy
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Greedy Alternation (Conspiracy)</span>
            </button>

            <button
              onClick={() => setStarvationMode('fifo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isConspiracy
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fair FIFO Aging Queue</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Status Callout Banner */}
        <div
          className={`p-4 rounded-2xl mb-6 border transition-all ${
            starvationDetected
              ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm animate-pulse'
              : !isConspiracy
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-white border-[#E8DCD5] text-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${starvationDetected ? 'text-purple-600' : 'text-amber-600'}`} />
            <div className="text-xs sm:text-sm leading-relaxed flex-grow">
              <div className="font-bold mb-0.5">
                {uiMode === 'story' ? 'Café Story Insight:' : 'Bounded-Waiting Invariant Status:'}
              </div>
              <p>{uiMode === 'story' ? narrativeText : statusMessage}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <SimulationControls
            isRunning={isRunning}
            onPlay={() => playSimulation('starvation')}
            onPause={pauseSimulation}
            onStep={stepStarvation}
            onReset={() => resetSimulation('starvation')}
            speed={speed}
            onSpeedChange={setSpeed}
            step={cycle}
            totalSteps={20}
            customAction={{
              label: isConspiracy ? '⚡ Apply FIFO Aging Solution' : '⚡ Revert to Greedy Conspiracy',
              icon: isConspiracy ? <ShieldCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />,
              onClick: () => setStarvationMode(isConspiracy ? 'fifo' : 'conspiracy'),
              variant: isConspiracy ? 'success' : 'primary'
            }}
          />
        </div>

        {/* Two-Column Simulation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Dining Table */}
          <div className="lg:col-span-7 flex flex-col items-center bg-white border border-[#E8DCD5] rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#E8DCD5] text-xs font-semibold text-slate-700">
              <span className="font-display font-bold text-sm text-slate-900">
                Starvation Table Simulation
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                starvationDetected 
                  ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold animate-pulse'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {starvationDetected ? '⚠️ Starvation Active' : 'Cycle ' + cycle}
              </span>
            </div>

            {/* The Animated Dining Table */}
            <div className="transform scale-95 sm:scale-100 my-2">
              <DiningTable
                philosophers={philosophers}
                forks={forks}
                deadlocked={false}
                starvationDetected={starvationDetected}
                uiMode={uiMode}
                title="Starvation Lab"
              />
            </div>

            {/* Bottom Insight */}
            <div className="w-full mt-4 p-3 bg-[#FEF8F5] border border-[#E8DCD5] rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <span>Notice: P0 and P2 alternate while P1 is caught in the middle.</span>
              <span className="font-mono text-[11px] text-purple-700 font-bold">
                P1 Hunger: {p1 ? p1.hungerLevel : 0}%
              </span>
            </div>
          </div>

          {/* Right Column: P1 Hunger Meter & FIFO Ticket Queue */}
          <div className="lg:col-span-5 space-y-6">
            {/* P1 Hunger Meter Card */}
            <div className="bg-white border border-[#E8DCD5] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8DCD5]">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Philosopher P1 (Arjun) Starvation Telemetry</span>
                </h3>
                <span className="text-xs font-mono font-bold text-purple-700">
                  {p1 ? p1.hungerLevel : 0}%
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-300 relative mb-3">
                <div
                  className={`h-full transition-all duration-500 ${
                    p1 && p1.hungerLevel >= 90
                      ? 'bg-purple-600 animate-pulse'
                      : p1 && p1.hungerLevel >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${p1 ? p1.hungerLevel : 0}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#FEF8F5] rounded-xl border border-[#E8DCD5]">
                  <span className="text-slate-500 block text-[10px]">Accumulated Wait Time:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{p1 ? p1.waitTime : 0}s</span>
                </div>
                <div className="p-2.5 bg-[#FEF8F5] rounded-xl border border-[#E8DCD5]">
                  <span className="text-slate-500 block text-[10px]">Meals Consumed:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">{p1 ? p1.mealsEaten : 0} bowls</span>
                </div>
              </div>

              {starvationDetected && (
                <div className="mt-3 p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 font-semibold leading-relaxed">
                  ⚠️ STARVATION DETECTED: Bounded Waiting Condition Violated! Although forks are constantly being used (0 deadlocks), thread P1 is indefinitely postponed.
                </div>
              )}
            </div>

            {/* Fair FIFO Aging Ticket Queue */}
            <div className="bg-white border border-[#E8DCD5] rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-display mb-3 pb-2 border-b border-[#E8DCD5] flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <span>Fair FIFO Queue & Priority Aging</span>
              </h3>

              {!isConspiracy && fifoQueue.length > 0 ? (
                <div className="space-y-2">
                  {fifoQueue.map((item) => (
                    <div
                      key={item.ticket}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        item.status === 'EATING'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 text-[10px]">
                          Ticket #{item.ticket}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-500">Wait: {item.waitTime}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'EATING' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center leading-relaxed">
                  FIFO Queue inactive in Greedy Conspiracy mode.
                  <br />
                  Click <strong>[Apply FIFO Aging Solution]</strong> to issue tickets and enforce fairness!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terminal Log */}
        <div className="mt-8">
          <EventLogTerminal
            logs={logs}
            title="Starvation & Fair Queue Dispatcher Log"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
