// src/algorithms/deadlockEngine.js
// Naive Simultaneous Acquisition resulting in Circular Wait Deadlock

export const PHILOSOPHER_NAMES = [
  'Priya (P0)',
  'Arjun (P1)',
  'Dev (P2)',
  'Meera (P3)',
  'Kabir (P4)'
];

export const PHILOSOPHER_AVATARS = ['👩🏽‍🎓', '👨🏻‍💻', '👨🏽‍🎨', '👩🏻‍🔬', '👨🏾‍🏫'];

export function createInitialDeadlockState() {
  return {
    step: 0,
    totalSteps: 8,
    deadlocked: false,
    status: 'IDLE',
    statusMessage: 'Ready: 5 philosophers seated with 5 plates and 5 forks.',
    narrativeText: 'All five friends are sitting peacefully, thinking about philosophical ideas.',
    philosophers: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: PHILOSOPHER_NAMES[i],
      avatar: PHILOSOPHER_AVATARS[i],
      state: 'THINKING', // THINKING, HUNGRY, WAITING, EATING, DEADLOCKED
      leftForkId: i,
      rightForkId: (i + 1) % 5,
      hasLeft: false,
      hasRight: false,
      thought: 'Thinking deeply...',
      waitingFor: null,
      holding: []
    })),
    forks: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      heldBy: null, // philosopher id or null
      inHandOf: null, // philosopher id or null
      position: 'table' // 'table' or 'hand'
    })),
    coffmanConditions: {
      mutualExclusion: { active: true, label: 'Mutual Exclusion', detail: 'Forks cannot be shared simultaneously (1 philosopher per fork).' },
      holdAndWait: { active: false, label: 'Hold & Wait', detail: 'Holding at least 1 resource while requesting another.' },
      noPreemption: { active: true, label: 'No Preemption', detail: 'Forks cannot be forcibly taken from another philosopher.' },
      circularWait: { active: false, label: 'Circular Wait', detail: 'Closed directed cycle of thread-resource dependencies.' }
    },
    wfgCycleDetected: false,
    wfgChain: [],
    logs: [
      { id: 1, time: '00:00.000', type: 'info', msg: 'System initialized. 5 threads spawned. Mutexes unlocked.' }
    ]
  };
}

export function getDeadlockStep(stepNumber) {
  const state = createInitialDeadlockState();
  const safeStep = Math.max(0, Math.min(stepNumber, 8));
  state.step = safeStep;

  if (safeStep === 0) {
    return state;
  }

  // Step 1: All become hungry
  if (safeStep >= 1) {
    state.philosophers.forEach(p => {
      p.state = 'HUNGRY';
      p.thought = 'I feel hungry! I need both forks to eat noodles.';
    });
    state.status = 'HUNGRY';
    state.statusMessage = 'All 5 philosophers transitioned from THINKING to HUNGRY.';
    state.narrativeText = 'The aroma of hot noodles makes everyone hungry at once!';
    state.logs.push({ id: 2, time: '00:00.320', type: 'warn', msg: 'Threads P0-P4 invoke pthread_mutex_lock on left forks.' });
  }

  // Step 2: P0 takes left fork (F0)
  if (safeStep >= 2) {
    state.forks[0].heldBy = 0;
    state.forks[0].inHandOf = 0;
    state.forks[0].position = 'hand';
    state.philosophers[0].hasLeft = true;
    state.philosophers[0].state = 'WAITING';
    state.philosophers[0].thought = 'Acquired Fork F0 (Left). Requesting Fork F1 (Right)...';
    state.philosophers[0].holding = [0];
    state.philosophers[0].waitingFor = 1;
    state.coffmanConditions.holdAndWait.active = true;
    state.logs.push({ id: 3, time: '00:00.610', type: 'info', msg: 'P0 acquired Left Fork F0. Awaiting F1.' });
  }

  // Step 3: P1 takes left fork (F1)
  if (safeStep >= 3) {
    state.forks[1].heldBy = 1;
    state.forks[1].inHandOf = 1;
    state.forks[1].position = 'hand';
    state.philosophers[1].hasLeft = true;
    state.philosophers[1].state = 'WAITING';
    state.philosophers[1].thought = 'Acquired Fork F1 (Left). Requesting Fork F2 (Right)...';
    state.philosophers[1].holding = [1];
    state.philosophers[1].waitingFor = 2;
    state.logs.push({ id: 4, time: '00:00.890', type: 'info', msg: 'P1 acquired Left Fork F1. Awaiting F2.' });
  }

  // Step 4: P2 takes left fork (F2)
  if (safeStep >= 4) {
    state.forks[2].heldBy = 2;
    state.forks[2].inHandOf = 2;
    state.forks[2].position = 'hand';
    state.philosophers[2].hasLeft = true;
    state.philosophers[2].state = 'WAITING';
    state.philosophers[2].thought = 'Acquired Fork F2 (Left). Requesting Fork F3 (Right)...';
    state.philosophers[2].holding = [2];
    state.philosophers[2].waitingFor = 3;
    state.logs.push({ id: 5, time: '00:01.120', type: 'info', msg: 'P2 acquired Left Fork F2. Awaiting F3.' });
  }

  // Step 5: P3 takes left fork (F3)
  if (safeStep >= 5) {
    state.forks[3].heldBy = 3;
    state.forks[3].inHandOf = 3;
    state.forks[3].position = 'hand';
    state.philosophers[3].hasLeft = true;
    state.philosophers[3].state = 'WAITING';
    state.philosophers[3].thought = 'Acquired Fork F3 (Left). Requesting Fork F4 (Right)...';
    state.philosophers[3].holding = [3];
    state.philosophers[3].waitingFor = 4;
    state.logs.push({ id: 6, time: '00:01.380', type: 'info', msg: 'P3 acquired Left Fork F3. Awaiting F4.' });
  }

  // Step 6: P4 takes left fork (F4)
  if (safeStep >= 6) {
    state.forks[4].heldBy = 4;
    state.forks[4].inHandOf = 4;
    state.forks[4].position = 'hand';
    state.philosophers[4].hasLeft = true;
    state.philosophers[4].state = 'WAITING';
    state.philosophers[4].thought = 'Acquired Fork F4 (Left). Requesting Fork F0 (Right)...';
    state.philosophers[4].holding = [4];
    state.philosophers[4].waitingFor = 0;
    state.logs.push({ id: 7, time: '00:01.650', type: 'info', msg: 'P4 acquired Left Fork F4. Awaiting F0.' });
  }

  // Step 7: All 5 attempt right fork simultaneously and block
  if (safeStep >= 7) {
    state.philosophers.forEach((p, idx) => {
      p.state = 'WAITING';
      p.waitingFor = p.rightForkId;
      p.thought = `I have Fork F${p.leftForkId}, but Fork F${p.rightForkId} is locked! I won't let go!`;
    });
    state.status = 'CONTENTION';
    state.statusMessage = 'Every philosopher holds 1 fork and is blocked awaiting the adjacent fork.';
    state.narrativeText = 'Everyone grabbed their left fork. Everyone needs their right fork, but nobody has one left to take!';
    state.logs.push({ id: 8, time: '00:01.900', type: 'error', msg: 'All threads blocked in kernel futex sleep. No thread can proceed.' });
  }

  // Step 8: DEADLOCK CONFIRMED
  if (safeStep === 8) {
    state.deadlocked = true;
    state.status = 'DEADLOCKED';
    state.statusMessage = 'CRITICAL DEADLOCK: Circular wait cycle detected. Liveness guarantee broken.';
    state.narrativeText = 'TOTAL SYSTEM FREEZE! Nobody can eat, and nobody will surrender their fork. This is Deadlock!';
    state.philosophers.forEach(p => {
      p.state = 'DEADLOCKED';
      p.thought = 'I am stuck! Nobody can eat, and nobody will let go!';
    });
    state.coffmanConditions.circularWait.active = true;
    state.wfgCycleDetected = true;
    state.wfgChain = [
      { from: 'P0', to: 'F1', type: 'requests' },
      { from: 'F1', to: 'P1', type: 'held_by' },
      { from: 'P1', to: 'F2', type: 'requests' },
      { from: 'F2', to: 'P2', type: 'held_by' },
      { from: 'P2', to: 'F3', type: 'requests' },
      { from: 'F3', to: 'P3', type: 'held_by' },
      { from: 'P3', to: 'F4', type: 'requests' },
      { from: 'F4', to: 'P4', type: 'held_by' },
      { from: 'P4', to: 'F0', type: 'requests' },
      { from: 'F0', to: 'P0', type: 'held_by' }
    ];
    state.logs.push({
      id: 9,
      time: '00:02.150',
      type: 'fatal',
      msg: 'CYCLE DETECTED in WFG: P0 -> F1 -> P1 -> F2 -> P2 -> F3 -> P3 -> F4 -> P4 -> F0 -> P0. All 4 Coffman conditions satisfied.'
    });
  }

  return state;
}
