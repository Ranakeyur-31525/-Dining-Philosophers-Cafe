// src/algorithms/tanenbaumMonitor.js
// POSIX Mutexes, Race Conditions, and Tanenbaum's Atomic State Monitor

import { PHILOSOPHER_NAMES, PHILOSOPHER_AVATARS } from './deadlockEngine';

export function createInitialSyncState(experiment = 'mutex') {
  return {
    experiment, // 'race', 'mutex', 'tanenbaum'
    status: 'READY',
    raceDetected: false,
    lockContentionRate: 34.2, // %
    avgHoldDurationMs: 420, // ms
    criticalSectionOccupancy: 2, // max 2 philosophers concurrently in critical section
    philosophers: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: PHILOSOPHER_NAMES[i],
      avatar: PHILOSOPHER_AVATARS[i],
      state: 'THINKING', // THINKING, HUNGRY, EATING
      leftForkId: i,
      rightForkId: (i + 1) % 5,
      thought: 'Thread sleeping peacefully.',
      mutexWaitTime: 0
    })),
    forkMutexes: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      isLocked: false,
      ownerThread: null, // P0..P4 or 'RACE_CONFLICT'
      lockType: 'pthread_mutex_t',
      contentionCount: 0
    })),
    logs: [
      { id: 1, time: '00:00.000', type: 'info', msg: `Synchronization Lab initialized in ${experiment.toUpperCase()} experiment mode.` }
    ]
  };
}

export function triggerRaceCondition() {
  const state = createInitialSyncState('race');
  state.raceDetected = true;
  state.status = 'DATA_RACE_DETECTED';

  // Both P0 and P1 try to grab F1 without a mutex lock!
  state.philosophers[0].state = 'EATING';
  state.philosophers[0].thought = '⚠️ Grabbing Fork 1 without checking locks!';

  state.philosophers[1].state = 'EATING';
  state.philosophers[1].thought = '⚠️ Grabbing Fork 1 at the EXACT same nanosecond!';

  state.forkMutexes[1].isLocked = true;
  state.forkMutexes[1].ownerThread = 'RACE_CONFLICT';
  state.forkMutexes[1].contentionCount = 99;

  state.logs.push({
    id: 2,
    time: '00:00.114',
    type: 'fatal',
    msg: 'CRITICAL DATA RACE DETECTED! Thread P0 and Thread P1 performed concurrent unsynchronized writes to Fork 1 memory address.'
  });
  state.logs.push({
    id: 3,
    time: '00:00.116',
    type: 'fatal',
    msg: 'Undefined Behavior (UB): Mutex was bypassed! Memory corruption / inconsistent state.'
  });

  return state;
}

export function applyMutexLocks() {
  const state = createInitialSyncState('mutex');
  state.raceDetected = false;
  state.status = 'MUTEX_LOCKED_SAFE';

  // P0 acquires F0 & F1 using pthread_mutex_lock
  state.philosophers[0].state = 'EATING';
  state.philosophers[0].thought = '🔒 pthread_mutex_lock(&fork[0]) & pthread_mutex_lock(&fork[1]) succeeded! Eating safely.';
  state.forkMutexes[0].isLocked = true;
  state.forkMutexes[0].ownerThread = 'P0';
  state.forkMutexes[1].isLocked = true;
  state.forkMutexes[1].ownerThread = 'P0';

  // P1 requests F1 and gets blocked safely
  state.philosophers[1].state = 'HUNGRY';
  state.philosophers[1].thought = '⏸️ pthread_mutex_lock(&fork[1]) returned EBUSY. Blocked safely in kernel sleep.';
  state.forkMutexes[1].contentionCount = 1;

  // P2 can safely acquire F2 and F3 and eat in parallel!
  state.philosophers[2].state = 'EATING';
  state.philosophers[2].thought = '🔒 pthread_mutex_lock(&fork[2]) & (&fork[3]) succeeded! Safe parallel eating.';
  state.forkMutexes[2].isLocked = true;
  state.forkMutexes[2].ownerThread = 'P2';
  state.forkMutexes[3].isLocked = true;
  state.forkMutexes[3].ownerThread = 'P2';

  state.logs.push({
    id: 4,
    time: '00:00.250',
    type: 'info',
    msg: 'pthread_mutex_lock(&fork[0]) -> SUCCESS (P0). pthread_mutex_lock(&fork[1]) -> SUCCESS (P0).'
  });
  state.logs.push({
    id: 5,
    time: '00:00.255',
    type: 'warn',
    msg: 'P1 pthread_mutex_lock(&fork[1]) -> BLOCKED. Mutex contention handled cleanly without corruption.'
  });

  return state;
}

export function applyTanenbaumMonitor() {
  const state = createInitialSyncState('tanenbaum');
  state.raceDetected = false;
  state.status = 'ATOMIC_MONITOR_ACTIVE';

  // Tanenbaum's test(i) rule:
  // state[i] == HUNGRY && state[LEFT] != EATING && state[RIGHT] != EATING
  // P0 and P2 both test successfully!
  state.philosophers[0].state = 'EATING';
  state.philosophers[0].thought = 'test(0) evaluated TRUE: neighbors P4 and P1 not eating. state[0]=EATING.';

  state.philosophers[2].state = 'EATING';
  state.philosophers[2].thought = 'test(2) evaluated TRUE: neighbors P1 and P3 not eating. state[2]=EATING.';

  state.philosophers[1].state = 'HUNGRY';
  state.philosophers[1].thought = 'test(1) evaluated FALSE: neighbor P0 is EATING! Blocked on condition variable.';

  state.philosophers[3].state = 'HUNGRY';
  state.philosophers[3].thought = 'test(3) evaluated FALSE: neighbor P2 is EATING! Blocked on condition variable.';

  state.forkMutexes[0].isLocked = true;
  state.forkMutexes[0].ownerThread = 'P0';
  state.forkMutexes[1].isLocked = true;
  state.forkMutexes[1].ownerThread = 'P0';

  state.forkMutexes[2].isLocked = true;
  state.forkMutexes[2].ownerThread = 'P2';
  state.forkMutexes[3].isLocked = true;
  state.forkMutexes[3].ownerThread = 'P2';

  state.logs.push({
    id: 6,
    time: '00:00.400',
    type: 'success',
    msg: 'Tanenbaum atomic test(0) and test(2) evaluated atomically inside monitor lock. Both granted.'
  });
  state.logs.push({
    id: 7,
    time: '00:00.410',
    type: 'info',
    msg: 'Threads P1 and P3 suspended on private condition variables sem_wait(&s[1]) and sem_wait(&s[3]).'
  });

  return state;
}
