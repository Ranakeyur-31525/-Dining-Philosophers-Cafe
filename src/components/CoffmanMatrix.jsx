// src/components/CoffmanMatrix.jsx
// Visual checklist for Edward G. Coffman Jr.'s 4 Necessary & Sufficient Conditions for Deadlock

import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function CoffmanMatrix({
  conditions = {
    mutualExclusion: { active: true, label: 'Mutual Exclusion', detail: 'Forks cannot be shared simultaneously (1 philosopher per fork).' },
    holdAndWait: { active: false, label: 'Hold & Wait', detail: 'Holding at least 1 resource while requesting another.' },
    noPreemption: { active: true, label: 'No Preemption', detail: 'Forks cannot be forcibly taken from another philosopher.' },
    circularWait: { active: false, label: 'Circular Wait', detail: 'Closed directed cycle of thread-resource dependencies.' }
  },
  title = "Coffman Conditions Matrix (1971)"
}) {
  const items = [
    { key: 'mutualExclusion', roman: 'I', ...conditions.mutualExclusion },
    { key: 'holdAndWait', roman: 'II', ...conditions.holdAndWait },
    { key: 'noPreemption', roman: 'III', ...conditions.noPreemption },
    { key: 'circularWait', roman: 'IV', ...conditions.circularWait },
  ];

  const allActive = items.every(item => item.active);

  return (
    <div className="bg-white border border-[#E8DCD5] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8DCD5]">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <Lock className="w-4 h-4 text-terracotta" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Necessary & sufficient conditions for deadlock to occur in resource allocation systems.
          </p>
        </div>

        {allActive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            DEADLOCK IMMINENT (4/4)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            SYSTEM SAFE ({items.filter(i => i.active).length}/4)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.key}
            className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
              item.active
                ? item.key === 'circularWait'
                  ? 'bg-red-50 border-red-300 ring-1 ring-red-200 shadow-sm'
                  : 'bg-amber-50/70 border-amber-200'
                : 'bg-slate-50 border-slate-200 opacity-75'
            }`}
          >
            <div className="mt-0.5">
              {item.active ? (
                item.key === 'circularWait' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                )
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Condition {item.roman}: {item.label}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.active
                      ? item.key === 'circularWait'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
