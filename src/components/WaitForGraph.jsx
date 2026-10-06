// src/components/WaitForGraph.jsx
// Interactive SVG Wait-For Graph (WFG) Visualizer with directed cycle highlighter

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function WaitForGraph({
  cycleDetected = false,
  title = "Wait-For Graph (WFG) Analysis",
  activeEdges = []
}) {
  // 5 Philosopher vertices and 5 Fork vertices arranged in two concentric circles or alternating ring
  const width = 380;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;

  // Outer ring: Philosophers P0..P4
  const philRadius = 110;
  const phils = Array.from({ length: 5 }, (_, i) => {
    const angle = ((-90 + i * 72) * Math.PI) / 180;
    return {
      id: `P${i}`,
      label: `P${i}`,
      x: cx + philRadius * Math.cos(angle),
      y: cy + philRadius * Math.sin(angle),
    };
  });

  // Inner ring: Forks F0..F4
  const forkRadius = 55;
  const forks = Array.from({ length: 5 }, (_, i) => {
    // midway between phils
    const angle = ((-54 + i * 72) * Math.PI) / 180;
    return {
      id: `F${i}`,
      label: `F${i}`,
      x: cx + forkRadius * Math.cos(angle),
      y: cy + forkRadius * Math.sin(angle),
    };
  });

  return (
    <div className="bg-white border border-[#E8DCD5] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8DCD5]">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
            <span>🕸️</span>
            <span>{title}</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Directed dependency graph: Threads (circles) requesting Resources (squares).
          </p>
        </div>

        {cycleDetected ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            CYCLE DETECTED
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            DAG (NO CYCLES)
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative flex justify-center items-center py-1 bg-[#FAF6F3] rounded-xl border border-slate-200 overflow-hidden">
        <svg width={width} height={height} className="select-none">
          <defs>
            <marker
              id="arrow-red"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#BA1A1A" />
            </marker>
            <marker
              id="arrow-gray"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Cyclical Dependency Edges: P0 -> F1 -> P1 -> F2 -> P2 -> F3 -> P3 -> F4 -> P4 -> F0 -> P0 */}
          {cycleDetected && (
            <g className="animate-cycle-march" strokeDasharray="6,4">
              {/* P0 -> F1 */}
              <line x1={phils[0].x} y1={phils[0].y} x2={forks[1].x} y2={forks[1].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* F1 -> P1 */}
              <line x1={forks[1].x} y1={forks[1].y} x2={phils[1].x} y2={phils[1].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* P1 -> F2 */}
              <line x1={phils[1].x} y1={phils[1].y} x2={forks[2].x} y2={forks[2].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* F2 -> P2 */}
              <line x1={forks[2].x} y1={forks[2].y} x2={phils[2].x} y2={phils[2].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* P2 -> F3 */}
              <line x1={phils[2].x} y1={phils[2].y} x2={forks[3].x} y2={forks[3].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* F3 -> P3 */}
              <line x1={forks[3].x} y1={forks[3].y} x2={phils[3].x} y2={phils[3].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* P3 -> F4 */}
              <line x1={phils[3].x} y1={phils[3].y} x2={forks[4].x} y2={forks[4].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* F4 -> P4 */}
              <line x1={forks[4].x} y1={forks[4].y} x2={phils[4].x} y2={phils[4].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* P4 -> F0 */}
              <line x1={phils[4].x} y1={phils[4].y} x2={forks[0].x} y2={forks[0].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
              {/* F0 -> P0 */}
              <line x1={forks[0].x} y1={forks[0].y} x2={phils[0].x} y2={phils[0].y} stroke="#BA1A1A" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
            </g>
          )}

          {/* Philosopher Vertices (Circles) */}
          {phils.map((p) => (
            <g key={p.id} className="transition-all duration-300">
              <circle
                cx={p.x}
                cy={p.y}
                r="16"
                fill={cycleDetected ? '#FEE2E2' : '#EFF6FF'}
                stroke={cycleDetected ? '#BA1A1A' : '#3B82F6'}
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={cycleDetected ? '#991B1B' : '#1D4ED8'}
                fontFamily="JetBrains Mono"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* Fork Vertices (Rectangles) */}
          {forks.map((f) => (
            <g key={f.id} className="transition-all duration-300">
              <rect
                x={f.x - 12}
                y={f.y - 12}
                width="24"
                height="24"
                rx="4"
                fill={cycleDetected ? '#FEF2F2' : '#F8FAFC'}
                stroke={cycleDetected ? '#EF4444' : '#64748B'}
                strokeWidth="1.5"
              />
              <text
                x={f.x}
                y={f.y + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill={cycleDetected ? '#B91C1C' : '#334155'}
                fontFamily="JetBrains Mono"
              >
                {f.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Cycle Detection Banner */}
      {cycleDetected ? (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-mono leading-relaxed">
          <span className="font-bold text-red-900 block mb-0.5">⚠️ CYCLE DETECTED:</span>
          P0 → F1 → P1 → F2 → P2 → F3 → P3 → F4 → P4 → F0 → P0.
          <span className="block text-[11px] text-red-700 mt-1">
            Graph contains no sink node. Circular Wait guarantees permanent thread lockup.
          </span>
        </div>
      ) : (
        <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-mono">
          <span className="font-bold block mb-0.5">🟢 Acyclic Graph:</span>
          No directed cycles detected. System remains live and deadlock-free.
        </div>
      )}
    </div>
  );
}
