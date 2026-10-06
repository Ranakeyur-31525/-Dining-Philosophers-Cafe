// src/algorithms/waiterArbitrator.js
// Counting Semaphore Arbitrator (Max N-1 Diners allowed at the table)

import { PHILOSOPHER_NAMES, PHILOSOPHER_AVATARS } from './deadlockEngine';

export function createInitialWaiterState() {
  return {
    step: 0,
    totalSteps: 6,
    waiterTokens: 4, // Max N-1 = 4
    maxTokens: 4,
    activeDiners: 0,
    status: 'READY',
    statusMessage: 'Café Waiter Semaphore initialized to 4 (N-1). At most 4 diners permitted at once.',
    narrativeText: 'The café waiter stands by: "Only 4 friends can try eating at the same time to ensure someone always gets 2 forks!"',
    philosophers: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      name: PHILOSOPHER_NAMES[i],
      avatar: PHILOSOPHER_AVATARS[i],
      state: 'THINKING',
      hasToken: false,
      leftForkId: i,
      rightForkId: (i + 1) % 5,
      hasLeft: false,
      hasRight: false,
      thought: 'Waiting for permission from the Waiter...',
      mealsEaten: 0
    })),
    forks: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      heldBy: null,
      position: 'table'
    })),
    logs: [
      { id: 1, time: '00:00.000', type: 'info', msg: 'sem_init(&waiter_sem, 0, 4) — Counting Semaphore initialized to 4.' }
    ]
  };
}

export function getWaiterStep(stepNumber) {
  const state = createInitialWaiterState();
  const safeStep = Math.max(0, Math.min(stepNumber, 6));
  state.step = safeStep;

  if (safeStep === 0) return state;

  // Step 1: All 5 request token. P0, P1, P2, P3 get token. P4 must wait outside!
  if (safeStep >= 1) {
    // 4 philosophers get token
    for (let i = 0; i < 4; i++) {
      state.philosophers[i].hasToken = true;
      state.philosophers[i].state = 'HUNGRY';
      state.philosophers[i].thought = 'Waiter granted token! Now reaching for forks.';
    }
    state.waiterTokens = 0; // 4 - 4 = 0
    state.activeDiners = 4;

    // P4 is blocked by the waiter
    state.philosophers[4].hasToken = false;
    state.philosophers[4].state = 'WAITING';
    state.philosophers[4].thought = '🧑🍳 Waiter says: "Wait! Only 4 at the table. Please wait until someone finishes!"';

    state.status = 'THROTTLED';
    state.statusMessage = 'Waiter Semaphore count = 0. P4 is blocked in sem_wait(&waiter).';
    state.narrativeText = 'The waiter stops Friend 4 politely. 4 friends sit down with 5 forks on the table.';
    state.logs.push({ id: 2, time: '00:00.410', type: 'info', msg: 'Threads P0-P3 decrement semaphore to 0. Thread P4 suspended on waiter_sem queue.' });
  }

  // Step 2: Forks are grabbed. By pigeonhole principle, P1 and P3 can eat, or P0 and P2 eat!
  if (safeStep >= 2) {
    // P0 grabs F0 and F1 -> eats!
    state.forks[0].heldBy = 0;
    state.forks[0].position = 'hand';
    state.forks[1].heldBy = 0;
    state.forks[1].position = 'hand';
    state.philosophers[0].hasLeft = true;
    state.philosophers[0].hasRight = true;
    state.philosophers[0].state = 'EATING';
    state.philosophers[0].mealsEaten = 1;
    state.philosophers[0].thought = '🍜 Eating noodles! I got both Fork 0 and Fork 1!';

    // P2 grabs F2 and F3 -> eats!
    state.forks[2].heldBy = 2;
    state.forks[2].position = 'hand';
    state.forks[3].heldBy = 2;
    state.forks[3].position = 'hand';
    state.philosophers[2].hasLeft = true;
    state.philosophers[2].hasRight = true;
    state.philosophers[2].state = 'EATING';
    state.philosophers[2].mealsEaten = 1;
    state.philosophers[2].thought = '🍜 Eating noodles! I got both Fork 2 and Fork 3!';

    // P1 and P3 are waiting on forks, but NOT deadlocked
    state.philosophers[1].state = 'WAITING';
    state.philosophers[1].thought = 'Waiting for Fork 1 to be released by Priya.';
    state.philosophers[3].state = 'WAITING';
    state.philosophers[3].thought = 'Waiting for Fork 3 to be released by Dev.';

    state.status = 'PARALLEL_EATING';
    state.statusMessage = 'Pigeonhole Guarantee: 5 forks / 4 diners guarantees at least 1 (here 2!) can eat concurrently.';
    state.narrativeText = 'Notice: Priya and Dev both have 2 forks and eat noodles simultaneously!';
    state.logs.push({ id: 3, time: '00:00.820', type: 'success', msg: 'P0 and P2 acquire 2 forks each. 2 threads concurrently in critical section.' });
  }

  // Step 3: P0 and P2 finish eating, return forks and release waiter tokens
  if (safeStep >= 3) {
    // P0 finishes
    state.philosophers[0].state = 'THINKING';
    state.philosophers[0].hasLeft = false;
    state.philosophers[0].hasRight = false;
    state.philosophers[0].thought = 'Finished eating noodles. Returning forks and token to waiter.';
    state.forks[0].heldBy = null;
    state.forks[0].position = 'table';
    state.forks[1].heldBy = null;
    state.forks[1].position = 'table';

    // P2 finishes
    state.philosophers[2].state = 'THINKING';
    state.philosophers[2].hasLeft = false;
    state.philosophers[2].hasRight = false;
    state.philosophers[2].thought = 'Finished eating noodles. Returning forks and token to waiter.';
    state.forks[2].heldBy = null;
    state.forks[2].position = 'table';
    state.forks[3].heldBy = null;
    state.forks[3].position = 'table';

    state.waiterTokens = 2; // Tokens released
    state.logs.push({ id: 4, time: '00:01.200', type: 'info', msg: 'P0 & P2 sem_post(&waiter). Semaphore count increments to 2.' });
  }

  // Step 4: P1 and P3 acquire forks and eat! P4 gets granted token!
  if (safeStep >= 4) {
    // P1 grabs F1 and F2 and eats
    state.forks[1].heldBy = 1;
    state.forks[1].position = 'hand';
    state.forks[2].heldBy = 1;
    state.forks[2].position = 'hand';
    state.philosophers[1].hasLeft = true;
    state.philosophers[1].hasRight = true;
    state.philosophers[1].state = 'EATING';
    state.philosophers[1].mealsEaten = 1;
    state.philosophers[1].thought = '🍜 My turn! Fork 1 and 2 are mine. Eating noodles!';

    // P3 grabs F3 and F4 and eats
    state.forks[3].heldBy = 3;
    state.forks[3].position = 'hand';
    state.forks[4].heldBy = 3;
    state.forks[4].position = 'hand';
    state.philosophers[3].hasLeft = true;
    state.philosophers[3].hasRight = true;
    state.philosophers[3].state = 'EATING';
    state.philosophers[3].mealsEaten = 1;
    state.philosophers[3].thought = '🍜 Fork 3 and 4 secured. Eating noodles!';

    // P4 gets a token
    state.philosophers[4].hasToken = true;
    state.philosophers[4].state = 'HUNGRY';
    state.philosophers[4].thought = '🧑🍳 Waiter called me! Token granted. Waiting for forks to free up.';

    state.waiterTokens = 1;
    state.statusMessage = 'P1 & P3 eating. P4 admitted to table by waiter.';
    state.logs.push({ id: 5, time: '00:01.600', type: 'success', msg: 'P1 and P3 enter critical section. P4 unblocked by semaphore.' });
  }

  // Step 5: P1 and P3 finish. P4 grabs F4 and F0 and eats!
  if (safeStep >= 5) {
    state.philosophers[1].state = 'THINKING';
    state.philosophers[1].hasLeft = false;
    state.philosophers[1].hasRight = false;
    state.forks[1].heldBy = null;
    state.forks[2].heldBy = null;

    state.philosophers[3].state = 'THINKING';
    state.philosophers[3].hasLeft = false;
    state.philosophers[3].hasRight = false;
    state.forks[3].heldBy = null;
    state.forks[4].heldBy = null;

    // P4 grabs F4 and F0!
    state.forks[4].heldBy = 4;
    state.forks[4].position = 'hand';
    state.forks[0].heldBy = 4;
    state.forks[0].position = 'hand';
    state.philosophers[4].hasLeft = true;
    state.philosophers[4].hasRight = true;
    state.philosophers[4].state = 'EATING';
    state.philosophers[4].mealsEaten = 1;
    state.philosophers[4].thought = '🍜 Finally! Fork 4 and Fork 0 are mine. Delicious noodles!';

    state.waiterTokens = 3;
    state.statusMessage = 'P4 is eating noodles. System progress continuous.';
    state.logs.push({ id: 6, time: '00:02.050', type: 'info', msg: 'P4 acquires F4 and F0. Critical section active.' });
  }

  // Step 6: All done!
  if (safeStep === 6) {
    state.philosophers[4].state = 'THINKING';
    state.philosophers[4].hasLeft = false;
    state.philosophers[4].hasRight = false;
    state.forks[4].heldBy = null;
    state.forks[0].heldBy = null;
    state.waiterTokens = 4;
    state.activeDiners = 0;

    state.status = 'SUCCESS';
    state.statusMessage = 'ALL 5 DINERS SATISFIED! Zero deadlocks. Pigeonhole constraint verified.';
    state.narrativeText = 'All 5 friends had full bowls of noodles, thanks to the friendly café waiter!';
    state.logs.push({ id: 7, time: '00:02.400', type: 'success', msg: 'All threads completed eating cycle. Invariant verified: active_diners <= 4 at all times.' });
  }

  return state;
}
