// src/algorithms/resourceOrdering.js
// Havender's Total Resource Ordering (Dijkstra's Asymmetric Solution)

import { PHILOSOPHER_NAMES, PHILOSOPHER_AVATARS } from './deadlockEngine';

export function createInitialResourceOrderingState() {
  return {
    step: 0,
    totalSteps: 7,
    status: 'READY',
    statusMessage: 'Resource Ordering Active: F0 < F1 < F2 < F3 < F4. Lower-numbered fork must be acquired first.',
    narrativeText: 'All philosophers agree to a smart rule: always pick the lower-numbered fork first!',
    activeEater: null,
    deadlockPrevented: true,
    philosophers: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: PHILOSOPHER_NAMES[i],
      avatar: PHILOSOPHER_AVATARS[i],
      state: 'THINKING',
      leftForkId: i,
      rightForkId: (i + 1) % 5,
      // Lower and higher forks based on index
      firstFork: i === 4 ? 0 : i,
      secondFork: i === 4 ? 4 : (i + 1) % 5,
      holding: [],
      hasLeft: false,
      hasRight: false,
      thought: 'Following Havender order: I must take my lower fork first.',
      mealsEaten: 0
    })),
    forks: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      heldBy: null,
      inHandOf: null,
      position: 'table'
    })),
    coffmanConditions: {
      mutualExclusion: { active: true, label: 'Mutual Exclusion', detail: 'Forks remain mutually exclusive.' },
      holdAndWait: { active: true, label: 'Hold & Wait', detail: 'Threads still hold acquired resources.' },
      noPreemption: { active: true, label: 'No Preemption', detail: 'Forks are not forcibly preempted.' },
      circularWait: { active: false, label: 'Circular Wait', detail: '❌ BROKEN! Strict total ordering prevents cyclical resource graphs.' }
    },
    logs: [
      { id: 1, time: '00:00.000', type: 'info', msg: 'Havender global ordering established: F0 < F1 < F2 < F3 < F4.' }
    ]
  };
}

export function getResourceOrderingStep(stepNumber) {
  const state = createInitialResourceOrderingState();
  const safeStep = Math.max(0, Math.min(stepNumber, 7));
  state.step = safeStep;

  if (safeStep === 0) return state;

  // Step 1: All become hungry
  if (safeStep >= 1) {
    state.philosophers.forEach(p => {
      p.state = 'HUNGRY';
      p.thought = p.id === 4 
        ? 'I need F4 & F0. Since 0 < 4, I must wait for Fork F0 first with empty hands!'
        : `I need F${p.firstFork} and F${p.secondFork}. Lower is F${p.firstFork}.`;
    });
    state.status = 'HUNGRY';
    state.statusMessage = 'All philosophers hungry. Evaluating lower-ranked forks.';
    state.logs.push({ id: 2, time: '00:00.280', type: 'info', msg: 'Threads evaluate min(left, right). P4 identifies F0 as first resource.' });
  }

  // Step 2: P0 takes F0, P1 takes F1, P2 takes F2, P3 takes F3
  if (safeStep >= 2) {
    // P0 takes F0
    state.forks[0].heldBy = 0;
    state.forks[0].position = 'hand';
    state.philosophers[0].holding = [0];
    state.philosophers[0].hasLeft = true;
    state.philosophers[0].state = 'WAITING';

    // P1 takes F1
    state.forks[1].heldBy = 1;
    state.forks[1].position = 'hand';
    state.philosophers[1].holding = [1];
    state.philosophers[1].hasLeft = true;
    state.philosophers[1].state = 'WAITING';

    // P2 takes F2
    state.forks[2].heldBy = 2;
    state.forks[2].position = 'hand';
    state.philosophers[2].holding = [2];
    state.philosophers[2].hasLeft = true;
    state.philosophers[2].state = 'WAITING';

    // P3 takes F3
    state.forks[3].heldBy = 3;
    state.forks[3].position = 'hand';
    state.philosophers[3].holding = [3];
    state.philosophers[3].hasLeft = true;
    state.philosophers[3].state = 'WAITING';

    state.logs.push({ id: 3, time: '00:00.600', type: 'info', msg: 'P0 grabs F0, P1 grabs F1, P2 grabs F2, P3 grabs F3.' });
  }

  // Step 3: THE ASYMMETRY MAGIC: P4 waits for F0 with EMPTY HANDS!
  if (safeStep >= 3) {
    // P4 needs F0 first. F0 is held by P0! So P4 BLOCKS without grabbing F4!
    state.philosophers[4].state = 'WAITING';
    state.philosophers[4].holding = [];
    state.philosophers[4].thought = '⚠️ Havender Rule: I cannot touch Fork F4 until I acquire F0! My hands remain EMPTY!';
    state.forks[4].heldBy = null;
    state.forks[4].position = 'table'; // Free on table!

    state.status = 'ASYMMETRY';
    state.statusMessage = 'KEY INSIGHT: P4 waits for F0 with empty hands. Fork F4 remains free on the table!';
    state.narrativeText = 'Look at Friend 4 (Kabir)! Because he must get Fork 0 first, he leaves Fork 4 on the table with open hands.';
    state.logs.push({ id: 4, time: '00:00.950', type: 'success', msg: 'P4 blocked on F0. Crucially, F4 is LEFT FREE ON TABLE. Cycle broken!' });
  }

  // Step 4: P3 acquires F4 and eats!
  if (safeStep >= 4) {
    state.forks[4].heldBy = 3;
    state.forks[4].position = 'hand';
    state.philosophers[3].holding = [3, 4];
    state.philosophers[3].hasRight = true;
    state.philosophers[3].state = 'EATING';
    state.philosophers[3].mealsEaten = 1;
    state.philosophers[3].thought = '🍜 Delicious! I grabbed Fork F4 because Kabir left it free! Eating noodles!';
    state.activeEater = 3;

    state.status = 'EATING';
    state.statusMessage = 'P3 acquired both F3 & F4 and is eating. Contention successfully resolved!';
    state.narrativeText = 'Friend 3 (Meera) picks up Fork 4, now has two forks, and starts enjoying hot noodles!';
    state.logs.push({ id: 5, time: '00:01.350', type: 'success', msg: 'P3 successfully acquires F4 (both forks secured). Entering critical section (EATING).' });
  }

  // Step 5: P3 finishes eating, releases F3 & F4. P2 eats!
  if (safeStep >= 5) {
    state.philosophers[3].state = 'THINKING';
    state.philosophers[3].thought = 'Finished eating noodles. Released Fork F3 and F4 back to table.';
    state.philosophers[3].hasLeft = false;
    state.philosophers[3].hasRight = false;
    state.philosophers[3].holding = [];

    // P2 grabs F3 and eats!
    state.forks[3].heldBy = 2;
    state.philosophers[2].holding = [2, 3];
    state.philosophers[2].hasRight = true;
    state.philosophers[2].state = 'EATING';
    state.philosophers[2].mealsEaten = 1;
    state.philosophers[2].thought = '🍜 Yum! Fork F3 is free now. Eating noodles!';
    state.activeEater = 2;

    // F4 is free again
    state.forks[4].heldBy = null;
    state.forks[4].position = 'table';

    state.statusMessage = 'P3 released forks. P2 acquired F3 and is now eating.';
    state.logs.push({ id: 6, time: '00:01.800', type: 'info', msg: 'P3 unlocks F3, F4. P2 acquires F3. P2 enters EATING state.' });
  }

  // Step 6: Cascading releases: P2 finishes, P1 eats, then P0 finishes
  if (safeStep >= 6) {
    state.philosophers[2].state = 'THINKING';
    state.philosophers[2].holding = [];
    state.philosophers[2].hasLeft = false;
    state.philosophers[2].hasRight = false;
    state.forks[2].heldBy = null;
    state.forks[3].heldBy = null;

    // P1 eats
    state.philosophers[1].state = 'THINKING';
    state.philosophers[1].mealsEaten = 1;

    // P0 eats and finishes
    state.philosophers[0].state = 'THINKING';
    state.philosophers[0].mealsEaten = 1;
    state.philosophers[0].hasLeft = false;
    state.philosophers[0].holding = [];
    state.forks[0].heldBy = null;
    state.forks[0].position = 'table';

    state.statusMessage = 'P0 releases F0. P4 is finally unblocked!';
    state.logs.push({ id: 7, time: '00:02.200', type: 'info', msg: 'P0 releases F0. P4 unblocks from condition wait on F0.' });
  }

  // Step 7: P4 acquires F0 and F4, eats happily! System completes!
  if (safeStep === 7) {
    state.forks[0].heldBy = 4;
    state.forks[0].position = 'hand';
    state.forks[4].heldBy = 4;
    state.forks[4].position = 'hand';
    state.philosophers[4].holding = [0, 4];
    state.philosophers[4].hasLeft = true;
    state.philosophers[4].hasRight = true;
    state.philosophers[4].state = 'EATING';
    state.philosophers[4].mealsEaten = 1;
    state.philosophers[4].thought = '🍜 Patience rewarded! I hold Fork 0 & Fork 4 and am eating noodles happily!';
    state.activeEater = 4;

    state.status = 'SUCCESS';
    state.statusMessage = 'ALL 5 PHILOSOPHERS HAVE EATEN! Zero deadlocks occurred.';
    state.narrativeText = 'Friend 4 finally gets both forks and eats. Everyone got noodles safely with no freezes!';
    state.logs.push({ id: 8, time: '00:02.600', type: 'success', msg: 'P4 finishes eating. Proof complete: Strict total ordering strictly forbids cycles.' });
  }

  return state;
}
