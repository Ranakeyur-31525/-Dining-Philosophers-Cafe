// src/components/DiningTable.jsx
// Circular Dining Table with 5 Philosophers, Plates, Steam, and Physical Fork Translations

import React from 'react';
import PhilosopherAvatar from './PhilosopherAvatar';
import ForkItem from './ForkItem';

export default function DiningTable({
  philosophers = [],
  forks = [],
  deadlocked = false,
  starvationDetected = false,
  waiterTokens = null, // if waiter mode active (e.g. 4)
  uiMode = 'story',
  title = null
}) {
  const center = 240;
  const tableRadius = 140;

  // Angles for 5 positions around the circle (in degrees)
  // Top: 270 deg (Philosopher 0)
  // 0: -90 (270)
  // 1: -18 (342)
  // 2: 54
  // 3: 126
  // 4: 198
  const philAngles = [-90, -18, 54, 126, 198];

  // Forks are placed midway between adjacent philosophers:
  // F0 between P4 and P0: (-90 + 198) / 2 = 54 + 180... halfway between 198 & 270 = 234 deg
  // F0: 234 deg (between P4 and P0)
  // F1: 306 deg (between P0 and P1)
  // F2: 18 deg (between P1 and P2)
  // F3: 90 deg (between P2 and P3)
  // F4: 162 deg (between P3 and P4)
  const forkAngles = [234, 306, 18, 90, 162];

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Golden Rule Banner in Story Mode */}
      {uiMode === 'story' && (
        <div className="mb-3 px-4 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-semibold shadow-sm flex items-center gap-2">
          <span>🍜</span>
          <span><strong>Golden Rule:</strong> You need <strong>2 forks</strong> to eat noodles!</span>
        </div>
      )}

      {/* Main Circular Dining Table Container */}
      <div 
        className={`relative w-[480px] h-[480px] rounded-full transition-all duration-500 ${
          deadlocked ? 'animate-deadlock-shake' : ''
        }`}
      >
        {/* Wooden Mahogany Table Top */}
        <div 
          className={`absolute rounded-full transition-all duration-700 shadow-2xl flex items-center justify-center ${
            deadlocked 
              ? 'animate-deadlock-crimson border-4 border-red-600 bg-gradient-to-br from-[#73221b] via-[#4d130e] to-[#260705]' 
              : starvationDetected
                ? 'animate-starvation-pulse border-4 border-purple-600 bg-gradient-to-br from-[#4a154b] via-[#2f0d30] to-[#170518]'
                : 'border-8 border-[#3A1F16] bg-gradient-to-br from-[#683b2b] via-[#4a281c] to-[#2b160f]'
          }`}
          style={{
            width: `${tableRadius * 2}px`,
            height: `${tableRadius * 2}px`,
            left: `${center - tableRadius}px`,
            top: `${center - tableRadius}px`,
          }}
        >
          {/* Table Center Inlay / Emblem */}
          <div className="w-28 h-28 rounded-full border-2 border-amber-900/60 bg-[#23120b]/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-2 shadow-inner">
            <span className="text-2xl select-none">🍜</span>
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider font-display">
              {title || 'Café Table'}
            </span>
            {waiterTokens !== null && (
              <span className="text-[10px] text-emerald-300 font-mono mt-0.5 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                🧑🍳 Tokens: {waiterTokens}/4
              </span>
            )}
            {deadlocked && (
              <span className="text-[9px] font-bold text-red-300 bg-red-950 px-2 py-0.5 rounded-full mt-1 animate-pulse border border-red-500">
                DEADLOCKED
              </span>
            )}
          </div>
        </div>

        {/* 5 Dining Plates on the Table */}
        {philAngles.map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          const plateRadius = 92;
          const px = center + plateRadius * Math.cos(rad);
          const py = center + plateRadius * Math.sin(rad);
          const p = philosophers[idx];
          const isEating = p && p.state === 'EATING';

          return (
            <div
              key={`plate-${idx}`}
              className="absolute w-12 h-12 rounded-full bg-stone-100 border-2 border-stone-300 shadow-md flex items-center justify-center select-none transition-all duration-300 z-10"
              style={{
                left: `${px}px`,
                top: `${py}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Noodles graphic */}
              <div className="w-9 h-9 rounded-full bg-amber-200 border border-amber-400 flex items-center justify-center text-sm shadow-inner relative overflow-hidden">
                <span className="text-xs">🍝</span>
                {isEating && (
                  <span className="absolute inset-0 bg-emerald-400/20 animate-ping rounded-full" />
                )}
              </div>
            </div>
          );
        })}

        {/* 5 Metallic Forks with physical translation */}
        {forks.map((fork, idx) => (
          <ForkItem
            key={`fork-${idx}`}
            id={fork.id}
            heldBy={fork.heldBy}
            tableAngleDeg={forkAngles[idx]}
            position={fork.position || (fork.heldBy !== null ? 'hand' : 'table')}
            center={center}
            lockStatus={fork.lockStatus}
          />
        ))}

        {/* 5 Philosophers with Avatars & Thought Bubbles */}
        {philosophers.map((phil, idx) => (
          <PhilosopherAvatar
            key={`phil-${phil.id}`}
            philosopher={phil}
            tableAngleDeg={philAngles[idx]}
            center={center}
            uiMode={uiMode}
          />
        ))}
      </div>
    </div>
  );
}
