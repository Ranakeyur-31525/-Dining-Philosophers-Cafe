// src/pages/Home.jsx
// Home / OS Lab Dashboard: Hero, Miniature Table Vignette, 4-Step Methodology Ribbon, and 4 Module Cards

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, AlertTriangle, Cpu, RefreshCw, Sparkles, Binary, CheckCircle2 } from 'lucide-react';
import DiningTable from '../components/DiningTable';
import Footer from '../components/Footer';
import { useSimulation } from '../hooks/useSimulation';

export default function Home() {
  const { uiMode, deadlockState } = useSimulation();

  // Mini preview table state
  const [miniStep, setMiniStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMiniStep((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const miniPhils = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    name: ['Priya', 'Arjun', 'Dev', 'Meera', 'Kabir'][i],
    avatar: ['👩🏽‍🎓', '👨🏻‍💻', '👨🏽‍🎨', '👩🏻‍🔬', '👨🏾‍🏫'][i],
    state: i === miniStep ? 'EATING' : (i + 1) % 5 === miniStep ? 'HUNGRY' : 'THINKING',
    thought: i === miniStep ? 'Eating noodles!' : 'Thinking peacefully.',
    holding: i === miniStep ? [i, (i + 1) % 5] : []
  }));

  const miniForks = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    heldBy: i === miniStep || i === (miniStep + 1) % 5 ? miniStep : null,
    position: i === miniStep || i === (miniStep + 1) % 5 ? 'hand' : 'table'
  }));

  const methodologySteps = [
    { num: '01', title: 'Select Scenario', desc: 'Choose between Naive Greedy, Asymmetric Ordering, Waiter Semaphore, or Starvation.' },
    { num: '02', title: 'Observe Contention', desc: 'Inspect discrete step-by-step fork acquisition, hand translations, and blocking states.' },
    { num: '03', title: 'Analyze Coffman Matrix', desc: 'Verify the 4 conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.' },
    { num: '04', title: 'Apply Algorithmic Fix', desc: 'Witness mathematically proven resolutions via Havender ordering or FIFO aging.' }
  ];

  const moduleCards = [
    {
      to: '/deadlock',
      badge: 'MODULE 01',
      title: 'Deadlock Lab',
      icon: '💀',
      color: 'border-red-200 hover:border-red-400 bg-red-50/20',
      tagColor: 'bg-red-100 text-red-800',
      summary: 'Trigger naive simultaneous left-fork acquisition resulting in circular dependency lockout, flashing crimson visual lock, and live Wait-For Graph (WFG) cycle detection.'
    },
    {
      to: '/solution',
      badge: 'MODULE 02',
      title: 'Solution Lab',
      icon: '🛡️',
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20',
      tagColor: 'bg-emerald-100 text-emerald-800',
      summary: "Compare Havender's Resource Ordering (P4 reverse acquisition leaving F4 free) vs. The Café Waiter Counting Semaphore (max N-1 diners via Pigeonhole principle)."
    },
    {
      to: '/starvation',
      badge: 'MODULE 03',
      title: 'Starvation Lab',
      icon: '⚠️',
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/20',
      tagColor: 'bg-purple-100 text-purple-800',
      summary: 'Demonstrate zero-deadlock starvation: fast alternating neighbors (P0 & P2) starve P1 indefinitely. Resolve via Fair FIFO Aging Queues and priority tickets.'
    },
    {
      to: '/synchronization',
      badge: 'MODULE 04',
      title: 'Synchronization Lab',
      icon: '🔐',
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/20',
      tagColor: 'bg-blue-100 text-blue-800',
      summary: 'Experiment with raw data race conditions, POSIX mutex locks (pthread_mutex_lock), and Tanenbaum’s atomic state monitor test(i) critical section protection.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FEF8F5] text-slate-800 font-sans pb-12">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-10 pb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Title, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-terracotta-light border border-terracotta/30 rounded-full text-terracotta text-xs font-semibold">
              <span>🍽️</span>
              <span>v2.4 Academic OS Workbench</span>
              <span className="text-slate-300">•</span>
              <span>CHARUSAT SEM 5</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 font-display tracking-tight leading-tight">
              Dining Philosophers <span className="text-terracotta">Café</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-2xl">
              An interactive, zero-error Operating Systems laboratory for studying <strong>Deadlock</strong>, <strong>Starvation</strong>, and <strong>Resource Synchronization</strong> through animated circular table mechanics and tri-lingual voice narration.
            </p>

            {/* Live Dispatcher Vignette Banner */}
            <div className="p-3.5 bg-white border border-[#E8DCD5] rounded-2xl shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    Dispatcher Status: 🟢 System Normal (Contention Free)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Dual Mode: {uiMode === 'story' ? '👶 Story Metaphor Active' : '🎓 POSIX Engineering Rigor Active'}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                Tick: Active
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/deadlock"
                className="flex items-center gap-2 px-6 py-3.5 bg-terracotta hover:bg-[#8c2e12] text-white font-semibold text-sm rounded-2xl transition-all shadow-md active:scale-95"
              >
                <span>🚀 Launch Deadlock Lab</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/solution"
                className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-2xl border border-[#E8DCD5] transition-all shadow-xs active:scale-95"
              >
                <span>📖 Explore Solutions</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Miniature Interactive Table Vignette */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-white border border-[#E8DCD5] rounded-3xl p-4 shadow-md w-full max-w-[440px] flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#E8DCD5] text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Live Workbench Vignette
                </span>
                <span className="font-mono text-[10px] bg-[#F5EDE8] px-2 py-0.5 rounded-full text-terracotta">
                  Auto Cycle
                </span>
              </div>

              {/* Scaled Mini Dining Table */}
              <div className="transform scale-[0.72] -my-14 origin-center">
                <DiningTable
                  philosophers={miniPhils}
                  forks={miniForks}
                  deadlocked={false}
                  uiMode={uiMode}
                  title="Café Live"
                />
              </div>

              <div className="w-full text-center text-xs text-slate-500 pt-2 border-t border-[#E8DCD5] flex items-center justify-between">
                <span>5 Philosophers • 5 Forks</span>
                <span className="text-emerald-700 font-medium font-mono text-[11px]">
                  P{miniStep} Eating Noodles
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Methodology Ribbon */}
      <section className="px-4 sm:px-6 py-10 max-w-7xl mx-auto">
        <div className="bg-white border border-[#E8DCD5] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950 font-display flex items-center gap-2">
              <span>🔬</span>
              <span>The 4-Step Academic Concurrency Methodology</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Standard experimental framework used across all laboratory modules to analyze and resolve synchronization hazards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {methodologySteps.map((step, idx) => (
              <div
                key={step.num}
                className="p-4 rounded-2xl bg-[#FEF8F5] border border-[#E8DCD5] relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-black font-display text-terracotta/80 mb-1">
                    {step.num}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Interactive Module Cards */}
      <section className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 font-display">
              Interactive Concurrency Laboratories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a specialized workbench below to test, visualize, and prove synchronization invariants.
            </p>
          </div>
          <Link
            to="/results"
            className="text-xs font-semibold text-terracotta hover:underline hidden sm:block"
          >
            View Benchmark Matrix →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moduleCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`p-6 rounded-3xl border ${card.color} transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase font-mono ${card.tagColor}`}>
                    {card.badge}
                  </span>
                  <span className="text-2xl transition-transform group-hover:scale-125">
                    {card.icon}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-terracotta transition-colors font-display">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {card.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-terracotta">
                <span>Enter Laboratory Workbench</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
