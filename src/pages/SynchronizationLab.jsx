// src/pages/SynchronizationLab.jsx
// MODULE 04 — POSIX Mutexes & Atomic Monitors

import React, { useState } from 'react';
import EventLogTerminal from '../components/EventLogTerminal';
import Footer from '../components/Footer';
import { useSimulation } from '../hooks/useSimulation';
import { Lock, Unlock, AlertTriangle, ShieldCheck, Cpu, Activity, Play, Zap } from 'lucide-react';

export default function SynchronizationLab() {
  const {
    uiMode,
    syncState,
    triggerRaceCondition,
    applyMutexLocks,
    applyTanenbaumMonitor
  } = useSimulation();

  const [activeExp, setActiveExp] = useState('mutex'); // 'race' | 'mutex' | 'tanenbaum'

  const { raceDetected, lockContentionRate, avgHoldDurationMs, criticalSectionOccupancy, philosophers, forkMutexes, logs } = syncState;

  const handleSelectExp = (exp) => {
    setActiveExp(exp);
    if (exp === 'race') triggerRaceCondition();
    else if (exp === 'mutex') applyMutexLocks();
    else if (exp === 'tanenbaum') applyTanenbaumMonitor();
  };

  return (
    <div className="min-h-screen bg-[#FEF8F5] text-slate-800 font-sans pb-12">
      {/* Module Header */}
      <section className="px-4 sm:px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8DCD5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-bold font-mono tracking-wide uppercase mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>MODULE 04 — POSIX Mutexes & Atomic Monitors</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display">
              Concurrency & Synchronization Workbench
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Compare unprotected raw shared memory hazards, standard POSIX mutex locks, and Tanenbaum’s atomic state monitor.
            </p>
          </div>

          {/* 3 Experiment Switcher Buttons */}
          <div className="flex flex-wrap items-center bg-[#F5EDE8] p-1.5 rounded-2xl border border-[#E8DCD5] gap-1">
            <button
              onClick={() => handleSelectExp('race')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeExp === 'race'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1. Race Condition Trigger</span>
            </button>

            <button
              onClick={() => handleSelectExp('mutex')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeExp === 'mutex'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>2. POSIX Mutexes</span>
            </button>

            <button
              onClick={() => handleSelectExp('tanenbaum')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeExp === 'tanenbaum'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Tanenbaum Monitor</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 max-w-7xl mx-auto space-y-6">
        {/* Race Condition Red Banner Alert */}
        {raceDetected && (
          <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg animate-pulse flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-sm tracking-wide uppercase">
                ⚠️ DATA RACE / RACE CONDITION DETECTED!
              </div>
              <p className="text-xs text-red-100 mt-1 leading-relaxed">
                Mutex protection was bypassed! Both Thread P0 and Thread P1 performed simultaneous writes to Fork 1 memory space. This causes memory corruption, inconsistent state, and undefined behavior.
              </p>
            </div>
          </div>
        )}

        {/* Telemetry Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E8DCD5] rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-terracotta" />
              Lock Contention Rate
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {raceDetected ? '100% (CRASH)' : `${lockContentionRate}%`}
            </div>
            <span className="text-[10px] text-slate-400">Blocked vs Immediate lock calls</span>
          </div>

          <div className="bg-white border border-[#E8DCD5] rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Avg Hold Duration
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {avgHoldDurationMs} ms
            </div>
            <span className="text-[10px] text-slate-400">Mean time thread holds resource</span>
          </div>

          <div className="bg-white border border-[#E8DCD5] rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              Critical Section Occupancy
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
              {raceDetected ? '💥 VIOLATED' : `${criticalSectionOccupancy} / 2 threads max`}
            </div>
            <span className="text-[10px] text-slate-400">Dijkstra parallel dining bound</span>
          </div>
        </div>

        {/* Mutex Status Visualizer & Fork Locks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 5 Fork Mutexes Display */}
          <div className="lg:col-span-7 bg-white border border-[#E8DCD5] rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 font-display mb-4 pb-2 border-b border-[#E8DCD5] flex items-center justify-between">
              <span>Fork Mutex Primitive Status (`pthread_mutex_t`)</span>
              <span className="font-mono text-xs text-slate-500 font-normal">POSIX Pthreads</span>
            </h3>

            <div className="space-y-3">
              {forkMutexes.map((fm) => (
                <div
                  key={fm.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    fm.ownerThread === 'RACE_CONFLICT'
                      ? 'bg-red-50 border-red-300 ring-2 ring-red-400 animate-pulse'
                      : fm.isLocked
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl text-white ${
                        fm.ownerThread === 'RACE_CONFLICT'
                          ? 'bg-red-600'
                          : fm.isLocked
                            ? 'bg-amber-600'
                            : 'bg-emerald-600'
                      }`}
                    >
                      {fm.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 font-mono">
                        fork_mutex[{fm.id}]
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Type: {fm.lockType} • Contention: {fm.contentionCount}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        fm.ownerThread === 'RACE_CONFLICT'
                          ? 'bg-red-600 text-white'
                          : fm.isLocked
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {fm.ownerThread === 'RACE_CONFLICT'
                        ? '💥 CONCURRENT WRITE'
                        : fm.isLocked
                          ? `🔒 LOCKED BY ${fm.ownerThread}`
                          : '🔓 UNLOCKED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Philosopher Thread State & Tanenbaum Monitor Explanation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8DCD5] rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 font-display mb-3 pb-2 border-b border-[#E8DCD5]">
                Thread State Array (`state[5]`)
              </h3>

              <div className="space-y-2">
                {philosophers.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-[#FEF8F5] border border-[#E8DCD5] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.avatar}</span>
                      <span className="font-semibold text-slate-900">{p.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          p.state === 'EATING'
                            ? 'bg-emerald-600 text-white'
                            : p.state === 'HUNGRY'
                              ? 'bg-amber-600 text-white'
                              : 'bg-blue-600 text-white'
                        }`}
                      >
                        {p.state}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tanenbaum Monitor Code Box */}
            <div className="bg-[#181311] border border-[#3A2F2B] rounded-2xl p-4 text-xs font-mono text-slate-300">
              <div className="text-terracotta-container font-bold pb-2 mb-2 border-b border-[#3A2F2B] text-[11px]">
                Tanenbaum's test(i) Monitor Atomic Function
              </div>
              <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`void test(int i) {
  if (state[i] == HUNGRY && 
      state[LEFT] != EATING && 
      state[RIGHT] != EATING) {
    state[i] = EATING;
    sem_post(&s[i]); // Signal philosopher thread
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Terminal Log */}
        <div className="mt-8">
          <EventLogTerminal
            logs={logs}
            title="POSIX Synchronization Primitives Kernel Trace"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
