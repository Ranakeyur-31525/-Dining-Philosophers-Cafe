// src/components/SimulationControls.jsx
// Control toolbar: Play, Pause, Step Next, Reset, Speed Slider, and Custom Action button

import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

export default function SimulationControls({
  isRunning = false,
  onPlay,
  onPause,
  onStep,
  onReset,
  speed = 1,
  onSpeedChange,
  customAction = null, // { label, icon, onClick, variant: 'danger' | 'primary' | 'success' }
  step = 0,
  totalSteps = 8
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#E8DCD5] rounded-2xl shadow-sm">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        {isRunning ? (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-all shadow-sm active:scale-95"
            title="Pause Simulation"
          >
            <Pause className="w-4 h-4 fill-white" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta hover:bg-[#8c2e12] text-white font-medium text-sm transition-all shadow-sm active:scale-95"
            title="Run Simulation"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Run</span>
          </button>
        )}

        <button
          onClick={onStep}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5EDE8] hover:bg-[#E8DCD5] text-slate-800 font-medium text-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          title="Step to Next Discrete State"
        >
          <SkipForward className="w-4 h-4 text-slate-700" />
          <span>Step</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-all active:scale-95"
          title="Reset Table to Initial State"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>

      {/* Discrete Step Progress Indicator */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
        <span>Step:</span>
        <span className="font-bold text-slate-900">{step}</span>
        <span>/</span>
        <span>{totalSteps}</span>
      </div>

      {/* Speed Slider / Toggle */}
      <div className="flex items-center gap-1 bg-[#F5EDE8] p-1 rounded-xl">
        {[0.5, 1, 2].map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange && onSpeedChange(s)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              speed === s
                ? 'bg-white text-terracotta shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Optional Custom Action Button (e.g. Trigger Deadlock) */}
      {customAction && (
        <button
          onClick={customAction.onClick}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-medium text-sm transition-all shadow-sm active:scale-95 ${
            customAction.variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700 ring-2 ring-red-300'
              : customAction.variant === 'success'
                ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-300'
                : 'bg-terracotta hover:bg-[#8c2e12]'
          }`}
        >
          {customAction.icon}
          <span>{customAction.label}</span>
        </button>
      )}
    </div>
  );
}
