// src/hooks/useSimulation.jsx
// Centralized Tick Generator, Discrete Step Manager, and Dual-Mode UI State

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { createInitialDeadlockState, getDeadlockStep } from '../algorithms/deadlockEngine';
import { createInitialResourceOrderingState, getResourceOrderingStep } from '../algorithms/resourceOrdering';
import { createInitialWaiterState, getWaiterStep } from '../algorithms/waiterArbitrator';
import { createInitialStarvationState, advanceStarvationCycle } from '../algorithms/starvationEngine';
import { createInitialSyncState, triggerRaceCondition, applyMutexLocks, applyTanenbaumMonitor } from '../algorithms/tanenbaumMonitor';
import { useSpeechNarrator } from './useSpeechNarrator';

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  // Dual Mode UI Toggle: 'story' (Café / non-tech friendly) vs 'engineering' (OS Evaluator / Viva rigor)
  const [uiMode, setUiMode] = useState('story'); // 'story' | 'engineering'

  // Global Audio Narrator
  const speech = useSpeechNarrator();

  // Active scenario engine: 'deadlock' | 'resource_ordering' | 'waiter' | 'starvation' | 'sync'
  const [activeEngine, setActiveEngine] = useState('deadlock');

  // Simulation speed: 0.5, 1, 2
  const [speed, setSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // States per algorithm module
  const [deadlockState, setDeadlockState] = useState(createInitialDeadlockState);
  const [resourceState, setResourceState] = useState(createInitialResourceOrderingState);
  const [waiterState, setWaiterState] = useState(createInitialWaiterState);
  const [starvationState, setStarvationState] = useState(() => createInitialStarvationState('conspiracy'));
  const [syncState, setSyncState] = useState(() => createInitialSyncState('mutex'));

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Step function for Deadlock
  const stepDeadlock = useCallback((stepNum = null) => {
    setDeadlockState(prev => {
      const nextStep = stepNum !== null ? stepNum : prev.step + 1;
      const nextState = getDeadlockStep(nextStep);
      speech.soundSynth.playForkClink();

      if (nextState.deadlocked) {
        speech.soundSynth.playDeadlockAlarm();
        speech.speak('deadlock');
      }
      return nextState;
    });
  }, [speech]);

  // Immediate Deadlock Trigger (all pick up left fork simultaneously)
  const triggerDeadlockInstant = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    const finalState = getDeadlockStep(8);
    setDeadlockState(finalState);
    speech.soundSynth.playDeadlockAlarm();
    speech.speak('deadlock');
  }, [speech]);

  // Step function for Resource Ordering
  const stepResourceOrdering = useCallback((stepNum = null) => {
    setResourceState(prev => {
      const nextStep = stepNum !== null ? stepNum : prev.step + 1;
      const nextState = getResourceOrderingStep(nextStep);
      speech.soundSynth.playForkClink();

      if (nextState.status === 'ASYMMETRY') {
        speech.speak('resource_ordering');
      } else if (nextState.status === 'EATING') {
        speech.soundSynth.playEatMunch();
      } else if (nextState.status === 'SUCCESS') {
        speech.soundSynth.playVictoryFanfare();
      }
      return nextState;
    });
  }, [speech]);

  // Step function for Waiter Semaphore
  const stepWaiter = useCallback((stepNum = null) => {
    setWaiterState(prev => {
      const nextStep = stepNum !== null ? stepNum : prev.step + 1;
      const nextState = getWaiterStep(nextStep);
      speech.soundSynth.playForkClink();

      if (nextStep === 1) {
        speech.speak('waiter_solution');
      } else if (nextState.status === 'PARALLEL_EATING' || nextState.statusMessage.includes('eating')) {
        speech.soundSynth.playEatMunch();
      } else if (nextState.status === 'SUCCESS') {
        speech.soundSynth.playVictoryFanfare();
      }
      return nextState;
    });
  }, [speech]);

  // Step function for Starvation
  const stepStarvation = useCallback(() => {
    setStarvationState(prev => {
      const nextState = advanceStarvationCycle(prev);
      if (nextState.mode === 'conspiracy') {
        speech.soundSynth.playEatMunch();
        if (nextState.starvationDetected) {
          speech.soundSynth.playDeadlockAlarm();
          speech.speak('starvation');
        }
      } else {
        speech.soundSynth.playEatMunch();
        speech.speak('fifo_solution');
      }
      return nextState;
    });
  }, [speech]);

  // Switch starvation mode
  const setStarvationMode = useCallback((mode) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    const newState = createInitialStarvationState(mode);
    setStarvationState(newState);
    if (mode === 'fifo') {
      speech.speak('fifo_solution');
    }
  }, [speech]);

  // Play / Run automatic loop
  const playSimulation = useCallback((engineName = activeEngine) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(true);

    const intervalMs = Math.round(1400 / speed);

    timerRef.current = setInterval(() => {
      if (engineName === 'deadlock') {
        setDeadlockState(prev => {
          if (prev.step >= prev.totalSteps || prev.deadlocked) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return prev;
          }
          const nextStep = prev.step + 1;
          const next = getDeadlockStep(nextStep);
          speech.soundSynth.playForkClink();
          if (next.deadlocked) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            speech.soundSynth.playDeadlockAlarm();
            speech.speak('deadlock');
          }
          return next;
        });
      } else if (engineName === 'resource_ordering') {
        setResourceState(prev => {
          if (prev.step >= prev.totalSteps) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return prev;
          }
          const nextStep = prev.step + 1;
          const next = getResourceOrderingStep(nextStep);
          speech.soundSynth.playForkClink();
          if (next.status === 'ASYMMETRY') {
            speech.speak('resource_ordering');
          } else if (next.status === 'EATING') {
            speech.soundSynth.playEatMunch();
          } else if (next.status === 'SUCCESS') {
            clearInterval(timerRef.current);
            setIsRunning(false);
            speech.soundSynth.playVictoryFanfare();
          }
          return next;
        });
      } else if (engineName === 'waiter') {
        setWaiterState(prev => {
          if (prev.step >= prev.totalSteps) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return prev;
          }
          const nextStep = prev.step + 1;
          const next = getWaiterStep(nextStep);
          speech.soundSynth.playForkClink();
          if (next.status === 'SUCCESS') {
            clearInterval(timerRef.current);
            setIsRunning(false);
            speech.soundSynth.playVictoryFanfare();
          }
          return next;
        });
      } else if (engineName === 'starvation') {
        setStarvationState(prev => {
          const next = advanceStarvationCycle(prev);
          speech.soundSynth.playEatMunch();
          if (next.starvationDetected) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            speech.soundSynth.playDeadlockAlarm();
            speech.speak('starvation');
          }
          return next;
        });
      }
    }, intervalMs);
  }, [activeEngine, speed, speech]);

  // Pause
  const pauseSimulation = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Reset
  const resetSimulation = useCallback((engineName = activeEngine) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    if (engineName === 'deadlock') setDeadlockState(createInitialDeadlockState());
    if (engineName === 'resource_ordering') setResourceState(createInitialResourceOrderingState());
    if (engineName === 'waiter') setWaiterState(createInitialWaiterState());
    if (engineName === 'starvation') setStarvationState(createInitialStarvationState('conspiracy'));
    if (engineName === 'sync') setSyncState(createInitialSyncState('mutex'));
  }, [activeEngine]);

  const value = {
    uiMode,
    setUiMode,
    activeEngine,
    setActiveEngine,
    speed,
    setSpeed,
    isRunning,
    playSimulation,
    pauseSimulation,
    resetSimulation,
    deadlockState,
    stepDeadlock,
    triggerDeadlockInstant,
    resourceState,
    stepResourceOrdering,
    waiterState,
    stepWaiter,
    starvationState,
    stepStarvation,
    setStarvationMode,
    syncState,
    setSyncState,
    triggerRaceCondition: () => {
      const state = triggerRaceCondition();
      setSyncState(state);
      speech.soundSynth.playDeadlockAlarm();
    },
    applyMutexLocks: () => {
      const state = applyMutexLocks();
      setSyncState(state);
      speech.soundSynth.playForkClink();
    },
    applyTanenbaumMonitor: () => {
      const state = applyTanenbaumMonitor();
      setSyncState(state);
      speech.soundSynth.playEatMunch();
    },
    speech
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return ctx;
}
