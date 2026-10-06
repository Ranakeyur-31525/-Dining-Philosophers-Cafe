// src/components/PhilosopherAvatar.jsx
// Animated avatar with facial expressions, steam effects, and dual-mode thought/POSIX bubbles

import React from 'react';

const STATE_STYLES = {
  THINKING: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    glow: 'shadow-[0_0_15px_rgba(0,81,213,0.3)]',
    badgeBg: 'bg-blue-600',
    text: 'text-blue-700',
    label: 'THINKING'
  },
  HUNGRY: {
    bg: 'bg-amber-50',
    border: 'border-amber-500',
    glow: 'shadow-[0_0_15px_rgba(230,126,34,0.4)]',
    badgeBg: 'bg-amber-600',
    text: 'text-amber-700',
    label: 'HUNGRY'
  },
  WAITING: {
    bg: 'bg-orange-50',
    border: 'border-orange-500',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    badgeBg: 'bg-orange-600',
    text: 'text-orange-700',
    label: 'WAITING'
  },
  EATING: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-600',
    glow: 'shadow-[0_0_20px_rgba(0,107,44,0.5)]',
    badgeBg: 'bg-emerald-600',
    text: 'text-emerald-700',
    label: 'EATING'
  },
  DEADLOCKED: {
    bg: 'bg-red-50',
    border: 'border-red-600 animate-pulse',
    glow: 'shadow-[0_0_25px_rgba(186,26,26,0.8)]',
    badgeBg: 'bg-red-600',
    text: 'text-red-700',
    label: 'DEADLOCKED'
  },
  STARVING: {
    bg: 'bg-purple-50',
    border: 'border-purple-600 animate-pulse',
    glow: 'shadow-[0_0_25px_rgba(123,31,162,0.8)]',
    badgeBg: 'bg-purple-700',
    text: 'text-purple-700',
    label: 'STARVING'
  }
};

export default function PhilosopherAvatar({
  philosopher,
  tableAngleDeg,
  radius = 215,
  center = 240,
  uiMode = 'story'
}) {
  const { id, name, avatar, state, thought, holding = [], hungerLevel = 0, mealsEaten = 0 } = philosopher;

  const rad = (tableAngleDeg * Math.PI) / 180;
  const x = center + radius * Math.cos(rad);
  const y = center + radius * Math.sin(rad);

  const style = STATE_STYLES[state] || STATE_STYLES.THINKING;
  const isEating = state === 'EATING';
  const isDeadlocked = state === 'DEADLOCKED';
  const isStarving = state === 'STARVING';

  return (
    <div
      className="absolute flex flex-col items-center justify-center transition-all duration-500 ease-out z-30"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Thought Bubble (Above Avatar) */}
      <div 
        className={`mb-1 px-2.5 py-1 rounded-xl text-xs max-w-[155px] text-center shadow-md transition-all duration-300 pointer-events-none ${
          isDeadlocked 
            ? 'bg-red-600 text-white font-bold animate-bounce' 
            : isStarving 
              ? 'bg-purple-700 text-white font-bold animate-pulse'
              : isEating 
                ? 'bg-emerald-700 text-white font-medium' 
                : 'bg-white text-slate-800 border border-[#E8DCD5]'
        }`}
      >
        {uiMode === 'story' ? (
          <span>{thought || 'Pondering...'}</span>
        ) : (
          <span className="font-mono text-[10px] block leading-tight">
            {state === 'EATING' && `CS: HOLDING [${holding.join(', ')}]`}
            {state === 'WAITING' && `BLOCKED: sem_wait(F${philosopher.waitingFor ?? ''})`}
            {state === 'DEADLOCKED' && `FUTEX_WAIT: CYCLE DETECTED`}
            {state === 'HUNGRY' && `REQUESTING: Mutex lock`}
            {state === 'THINKING' && `SLEEP: pthread_delay_np()`}
            {state === 'STARVING' && `STARVE: Starvation threshold`}
          </span>
        )}
      </div>

      {/* Main Philosopher Seat / Avatar Circle */}
      <div
        className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 bg-white ${style.border} ${style.glow}`}
      >
        {/* Eating Noodle Steam */}
        {isEating && (
          <div className="absolute -top-3 flex justify-center gap-1 w-full pointer-events-none">
            <span className="w-1 h-3 bg-slate-300 rounded-full animate-steam-1" />
            <span className="w-1 h-4 bg-slate-300 rounded-full animate-steam-2" />
            <span className="w-1 h-3 bg-slate-300 rounded-full animate-steam-3" />
          </div>
        )}

        {/* Emoji Avatar */}
        <span className="text-2xl select-none">{avatar}</span>

        {/* Status Pill Badge */}
        <span
          className={`absolute -bottom-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white tracking-wider uppercase shadow-sm ${style.badgeBg}`}
        >
          P{id}
        </span>
      </div>

      {/* Name and Meals Count */}
      <div className="mt-2 text-center pointer-events-none">
        <div className="text-xs font-semibold text-slate-900 leading-tight">
          {name.split(' ')[0]}
        </div>
        <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
          <span>🍜 {mealsEaten} meals</span>
        </div>
        
        {/* Hunger Bar (Especially for Starvation Lab) */}
        {hungerLevel > 0 && (
          <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1 mx-auto border border-slate-300">
            <div 
              className={`h-full transition-all duration-500 ${hungerLevel > 80 ? 'bg-purple-600' : hungerLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${hungerLevel}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
