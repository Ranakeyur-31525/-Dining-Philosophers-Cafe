// src/pages/DeadlockLab.jsx
// MODULE 01 — Coffman Condition IV Analysis & Circular Wait

import React, { useEffect } from 'react';
import DiningTable from '../components/DiningTable';
import SimulationControls from '../components/SimulationControls';
import CoffmanMatrix from '../components/CoffmanMatrix';
import WaitForGraph from '../components/WaitForGraph';
import EventLogTerminal from '../components/EventLogTerminal';
import Footer from '../components/Footer';
import { useSimulation } from '../hooks/useSimulation';
import { Skull, AlertOctagon, Info } from 'lucide-react';

export default function DeadlockLab() {
  const {
    uiMode,
    deadlockState,
    stepDeadlock,
    triggerDeadlockInstant,
    isRunning,
    playSimulation,
    pauseSimulation,
    resetSimulation,
    speed,
    setSpeed,
    setActiveEngine
  } = useSimulation();

  useEffect(() => {
    setActiveEngine('deadlock');
  }, [setActiveEngine]);

  const { philosophers, forks, deadlocked, coffmanConditions, logs, step, totalSteps, statusMessage, narrativeText } = deadlockState;

  return (
    <div className="min-h-screen bg-[#FEF8F5] text-slate-800 font-sans pb-12">
      {/* Module Header */}
      <section className="px-4 sm:px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8DCD5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-xs font-bold font-mono tracking-wide uppercase mb-2">
              <Skull className="w-3.5 h-3.5" />
              <span>MODULE 01 — Coffman Condition IV Analysis & Circular Wait</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Naive Greedy Protocol (Deadlock Simulator)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Demonstrating how simultaneous resource acquisition creates an unbreakable circular dependency chain, violating liveness and causing permanent kernel freeze.
            </p>
          </div>

          {/* Quick status badge */}
          {deadlocked ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-2xl shadow-md font-bold text-xs animate-bounce">
              <AlertOctagon className="w-4 h-4" />
              <span>DEADLOCK ACTIVE (SYSTEM FROZEN)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Simulation Live (Discrete Step {step}/{totalSteps})</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Interactive Workbench Grid */}
      <main className="px-4 sm:px-6 py-4 max-w-7xl mx-auto">
        {/* Status Callout Banner */}
        <div
          className={`p-4 rounded-2xl mb-6 border transition-all ${
            deadlocked
              ? 'bg-red-50 border-red-300 text-red-900 shadow-sm animate-pulse'
              : 'bg-white border-[#E8DCD5] text-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <Info className={`w-5 h-5 mt-0.5 shrink-0 ${deadlocked ? 'text-red-600' : 'text-terracotta'}`} />
            <div className="text-xs sm:text-sm leading-relaxed">
              <div className="font-bold mb-0.5">
                {uiMode === 'story' ? 'Café Story Update:' : 'POSIX Dispatcher State:'}
              </div>
              <p>{uiMode === 'story' ? narrativeText : statusMessage}</p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="mb-6">
          <SimulationControls
            isRunning={isRunning}
            onPlay={() => playSimulation('deadlock')}
            onPause={pauseSimulation}
            onStep={() => stepDeadlock()}
            onReset={() => resetSimulation('deadlock')}
            speed={speed}
            onSpeedChange={setSpeed}
            step={step}
            totalSteps={totalSteps}
            customAction={{
              label: '💀 Trigger Naive Deadlock',
              icon: <Skull className="w-4 h-4" />,
              onClick: triggerDeadlockInstant,
              variant: 'danger'
            }}
          />
        </div>

        {/* Two-Column Simulation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Circular Dining Table */}
          <div className="lg:col-span-7 flex flex-col items-center bg-white border border-[#E8DCD5] rounded-3xl p-6 shadow-sm overflow-hidden">
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#E8DCD5] text-xs font-semibold text-slate-700">
              <span className="font-display font-bold text-sm text-slate-900">
                Circular Dining Table (5 Philosophers • 5 Forks)
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {deadlocked ? '🔴 Circular Lockout' : '🟢 Discrete Step ' + step}
              </span>
            </div>

            {/* The Animated Dining Table */}
            <div className="transform scale-95 sm:scale-100 my-2">
              <DiningTable
                philosophers={philosophers}
                forks={forks}
                deadlocked={deadlocked}
                uiMode={uiMode}
                title="Deadlock Lab"
              />
            </div>

            {/* Bottom Caption */}
            <div className="w-full mt-4 p-3 bg-[#FEF8F5] border border-[#E8DCD5] rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <span>Forks translate to philosopher hand on acquisition.</span>
              <span className="font-mono text-[11px] text-terracotta font-semibold">
                Hold & Wait: {coffmanConditions.holdAndWait.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>

          {/* Right Column: Wait-For Graph (WFG) & Coffman Conditions Matrix */}
          <div className="lg:col-span-5 space-y-6">
            {/* Wait-For Graph (WFG) Visualizer */}
            <WaitForGraph
              cycleDetected={deadlocked}
              title="Wait-For Graph (WFG) Visualizer"
            />

            {/* Coffman Conditions Checklist */}
            <CoffmanMatrix
              conditions={coffmanConditions}
              title="Coffman Verification Checklist"
            />
          </div>
        </div>

        {/* Full-width Terminal Event Log */}
        <div className="mt-8">
          <EventLogTerminal
            logs={logs}
            title="Real-time Millisecond-Precision Kernel Execution Log"
            onClear={() => {}}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
