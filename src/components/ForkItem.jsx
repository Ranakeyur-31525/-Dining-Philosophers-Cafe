// src/components/ForkItem.jsx
// Metallic fork with physical translation and rotation towards holder philosopher

import React from 'react';

export default function ForkItem({ 
  id, 
  heldBy, 
  tableAngleDeg, 
  radius = 145, 
  center = 240, 
  position = 'table',
  lockStatus = null // null | 'locked' | 'unlocked' | 'race'
}) {
  // Angle in radians around table center
  const rad = (tableAngleDeg * Math.PI) / 180;

  // If held in hand, translate slightly further outward towards the philosopher's seat
  const currentRadius = position === 'hand' ? radius + 32 : radius;
  const x = center + currentRadius * Math.cos(rad);
  const y = center + currentRadius * Math.sin(rad);

  const isHeld = heldBy !== null && heldBy !== undefined;
  const isConflict = lockStatus === 'race';

  return (
    <div
      className="absolute transition-all duration-500 ease-out z-20 flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) rotate(${tableAngleDeg + 90}deg) scale(${isHeld ? 1.15 : 1})`,
      }}
    >
      {/* Fork Graphic */}
      <div 
        className={`relative flex flex-col items-center transition-all duration-300 ${
          isConflict 
            ? 'animate-bounce drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]'
            : isHeld 
              ? 'drop-shadow-[0_4px_10px_rgba(186,26,26,0.6)]' 
              : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]'
        }`}
      >
        {/* Fork Prongs */}
        <div className="flex gap-[3px] mb-[1px]">
          <div className={`w-[2.5px] h-4 rounded-t-sm ${isHeld ? 'bg-amber-300' : 'bg-slate-300'}`} />
          <div className={`w-[2.5px] h-4 rounded-t-sm ${isHeld ? 'bg-amber-300' : 'bg-slate-300'}`} />
          <div className={`w-[2.5px] h-4 rounded-t-sm ${isHeld ? 'bg-amber-300' : 'bg-slate-300'}`} />
        </div>
        {/* Fork Base & Neck */}
        <div className={`w-3 h-2 rounded-b-md ${isHeld ? 'bg-amber-400' : 'bg-slate-400'}`} />
        {/* Fork Handle */}
        <div className={`w-[3.5px] h-7 rounded-b-full ${isHeld ? 'bg-amber-500' : 'bg-gradient-to-b from-slate-400 to-slate-500'}`} />
      </div>

      {/* Fork Label Badge */}
      <div 
        className="mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight shadow-sm whitespace-nowrap transition-colors duration-300"
        style={{
          transform: `rotate(-${tableAngleDeg + 90}deg)`,
          backgroundColor: isConflict
            ? '#ef4444'
            : isHeld
              ? '#A43716'
              : '#FFFFFF',
          color: isHeld || isConflict ? '#FFFFFF' : '#334155',
          border: `1px solid ${isHeld ? '#7c250c' : '#cbd5e1'}`
        }}
      >
        {isConflict ? `F${id} 💥 RACE` : isHeld ? `F${id} held by P${heldBy}` : `Fork F${id}`}
      </div>
    </div>
  );
}
