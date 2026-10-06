// src/components/Navbar.jsx
// Sticky Header with Active Route Highlights, Tri-Lingual Audio Controls, Dual Mode Toggle, and Subtitle Ticker

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Binary, Award, ShieldAlert, Cpu } from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';

export default function Navbar() {
  const { uiMode, setUiMode, speech } = useSimulation();
  const { voiceEnabled, language, setLanguage, toggleVoice, currentSubtitle, isSpeaking } = speech;

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/deadlock', label: 'Deadlock Lab', icon: '💀' },
    { to: '/solution', label: 'Solution Lab', icon: '🛡️' },
    { to: '/starvation', label: 'Starvation Lab', icon: '⚠️' },
    { to: '/synchronization', label: 'Synchronization', icon: '🔐' },
    { to: '/results', label: 'Results & Viva', icon: '📊' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8DCD5] shadow-xs">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Badge */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🍽️</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-display">
                Dining Philosophers Café
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-terracotta-light text-terracotta border border-terracotta/30 rounded-full">
                v2.4
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium hidden sm:block">
              CHARUSAT SEM 5 • Concurrency & Synchronization Workbench
            </div>
          </div>
        </NavLink>

        {/* Global Controls: Dual Mode Toggle & Tri-Lingual Voice */}
        <div className="flex items-center gap-3">
          {/* Dual Mode Toggle (Story Mode vs Engineering Mode) */}
          <div className="flex items-center bg-[#F5EDE8] p-1 rounded-xl border border-[#E8DCD5]">
            <button
              onClick={() => setUiMode('story')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                uiMode === 'story'
                  ? 'bg-white text-terracotta shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Story Mode: Non-tech friendly cafe metaphor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Story</span>
            </button>

            <button
              onClick={() => setUiMode('engineering')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                uiMode === 'engineering'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Engineering Mode: POSIX primitives, WFG and Coffman matrix"
            >
              <Binary className="w-3.5 h-3.5 text-blue-600" />
              <span>Engineering</span>
            </button>
          </div>

          {/* Tri-Lingual Voice Narration Controls */}
          <div className="flex items-center gap-1.5 bg-[#FEF8F5] px-2 py-1 rounded-xl border border-[#E8DCD5]">
            {/* Voice Mute/Unmute Toggle */}
            <button
              onClick={toggleVoice}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                voiceEnabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
              title={voiceEnabled ? 'Voice Narration is ON (Click to Mute)' : 'Voice Narration is OFF (Click to Unmute)'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Selector Dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
              title="Select Voice Language"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="gu">🇮🇳 ગુજરાતી</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Row */}
      <div className="bg-[#FAF4F0] border-t border-[#E8DCD5] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-terracotta text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Live Voice Subtitle Ticker (When audio plays or after event) */}
      {currentSubtitle && (
        <div className="bg-[#2A211E] text-amber-100 px-4 py-1 text-xs font-mono flex items-center gap-2 overflow-hidden border-t border-[#3A2F2B]">
          <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-terracotta text-white px-1.5 py-0.2 rounded">
            {isSpeaking ? '🗣️ Speaking' : '💬 Subtitle'}
          </span>
          <div className="truncate text-slate-200">
            {currentSubtitle}
          </div>
        </div>
      )}
    </header>
  );
}
