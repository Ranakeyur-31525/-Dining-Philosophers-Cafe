// src/components/Footer.jsx
// Shared Academic Footer with Student IDs, Department Info, and OS Course Context

import React from 'react';
import { ShieldCheck, Users, GraduationCap, Code } from 'lucide-react';

export default function Footer() {
  const teamMembers = [
    { id: '24DCE080', role: 'State Machine & Deadlock Engine' },
    { id: '24DCE114', role: 'Visual Table & Voice Narrator' },
    { id: '24DCE101', role: 'Havender & Waiter Algorithms' },
    { id: 'D25DCE176', role: 'Benchmark & Concurrency Analytics' }
  ];

  return (
    <footer className="mt-16 border-t border-[#E8DCD5] bg-white text-slate-700 py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#E8DCD5]">
          {/* Project Details */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🍽️</span>
              <span className="font-bold text-slate-900 font-display text-base">
                Dining Philosophers Café
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Interactive Concurrency & Synchronization Workbench designed for Operating Systems laboratory curriculum, viva presentations, and resource contention research.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <GraduationCap className="w-4 h-4 text-terracotta" />
              <span><strong>Course:</strong> Operating Systems (SEM 5)</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              <strong>Institution:</strong> CHARUSAT University
            </div>
          </div>

          {/* Project Team Members */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-terracotta" />
              <span className="font-bold text-slate-900 text-sm font-display">
                Project Development Team Credits
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-[#FEF8F5] border border-[#E8DCD5] rounded-xl text-center shadow-xs"
                >
                  <div className="font-mono font-bold text-terracotta text-sm">
                    {member.id}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {member.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero-Error Guaranteed Architecture
            </span>
            <span>React 19 + Tailwind CSS + Web Audio + Web Speech API</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-slate-400">v2.4 Academic OS Workbench</span>
            <span className="text-slate-300">|</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
